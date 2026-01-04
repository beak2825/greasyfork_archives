// ==UserScript==
// @name         Mole Hole
// @description  Mole Hole6
// @author       You
// @match        http://*/*
// @grant        none
// @match		https://*.grepolis.com/game/*
// @license     MIT
// @version      1.36
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/323892
// @downloadURL https://update.greasyfork.org/scripts/532351/Mole%20Hole.user.js
// @updateURL https://update.greasyfork.org/scripts/532351/Mole%20Hole.meta.js
// ==/UserScript==
console.log("salut")
let uw = window, $ = uw.jQuery
//(function() {
    var _log = function(e) {
        "undefined" != typeof DBG && DBG.log(e)
    }

    Object.size = function(e) {
        var t, n = 0;
        for (t in e)
            e.hasOwnProperty(t) && n++;
        return n
    }

    var MH = {
        Home: "https://grepolis-david1327.e-monsite.com/",
        sName: "Mole Hole",
        sVer: "1.36 (08.02.2020)",
        ScriptAtcive: !0,
        RepClipboard: "",
        Scroll: "---\x3e Norka Krecika <---. Jeżeli ktoś chciałby wesprzeć ten projekt to bardzo proszę na konto: PL20 1140 2004 0000 3202 5389 0324 Tytuł przelewu: NK Darowizna (no i można napisać ew. od kogo). Na razie dostałem tylko jedno wsparcie (przez 7 lat). Będzie więcej to będziecie również dostawać wiadomości jakie nowe funkcje i jakie błędy poprawiono. Jeżeli wiecie (na grze) gdzie gram to możecie atakować ale nie musicie. Ja ofc. tak samo;) - O - .",
        ScrollCol: 0,
        GameVer: "?",
        GameUrl: "https://gpen.innogamescdn.com/game",
        GameImg: "https://gpen.innogamescdn.com",
        LangLoaded: !1,
        PlayerLoaded: !1,
        LngUse: "en",
        LngLda: "en",
        Lang: {},
        initiated: !1,
        CookieWall: "cMH_Wall",
        CookieNew: "cMH_New",
        SetCookie: "cMH_Set",
        Set: {
            alarm: !0,
            alarmSel: 0,
            alarmLoop: !0,
            balarm: !0,
            balarmSel: 1,
            balarmLoop: !0,
            FC: !0,
            DR: !0,
            YTW: !0,
            YTR: !1,
            RD: !1,
            turboMode: !1,
            TL: !0,
            exCmdList: !0,
            unitV: !0,
            smallMenu: !1,
            menu: !0,
            cmMenu: !0,
            MS: !0,
            MSb: !1,
            mapOcean: !0,
            mapGrid: !1,
            theme: 0,
            theme1: !0,
            theme2: !1,
            WndT: !0,
            ftabs: !0,
            fheight: !0,
            MesFor: !1,
            wRes: !0,
            wRres: !0,
            wRpos: !0,
            WS: !0,
            AL: !0,
            colRep: !0,
            ownRep: !0,
            statsGRCL: "grmh",
            unitsCost: !0,
            townPrvWindow: !0,
            showCnvRep: !1,
            loadCnv: !0,
            Vspell: !0,
            repFT: "all",
            lng: ""
        },
        gRAPCookie: "cMH_gRAP",
        gRAP: {
            Style: 0,
            Date: !0,
            Title: !1,
            AttT: !0,
            DefT: !0,
            AttU: !0,
            DefU: !0,
            AllU: !0,
            DeffA: !0,
            SpyB: !0,
            SpyC: !0,
            SpyR: !0,
            SelT: !0,
            PrfB: !0,
            PrfA: !0,
            PlyU: !0,
            Booty: !0,
            Booty2: !0,
            Bpnt: !0,
            Costs: !0,
            TwnU: !0,
            cmdIN: !0,
            cmdOUT: !0,
            cmdRET: !0,
            cmdAtt: !0,
            cmdSup: !0,
            cmdSpy: !0,
            cmdFarm: !0,
            cmdRevA: !0,
            cmdRevR: !0,
            cmdOcu: !0,
            WalDA: !0,
            WalDD: !0,
            WalLA: !0,
            WalLD: !0
        },
        gHndLstCookie: "cMH_gHndLst",
        gHndLst: {
            AllyList: {},
            PlayList: {},
            TownList: {},
            IslaList: {},
            TmplList: {}
        },
        GuiUstCookie: "cMH_GuiUst",
        GuiUst: {
            ShowOptions: !0,
            HideCenter: !1,
            HideLeft: !1,
            HideRight: !1,
            Trg: !1,
            TrgTown: {},
            SymAlly: {},
            SymPlay: {},
            unitV: 0,
            wHeight: {},
            EmoHeight: 170,
            TimeMode: 1,
            TimeTmp: 0
        },
        DomIslandsCookie: "cMH_DomIslands",
        DomIslands: {
            t: []
        },
        cma: 0,
        dodaj: "",
        tick: 0,
        AnimStep: 0,
        STime: 0,
        cmTown: 0,
        sShowLastWall: !1,
        AlarmActive: !1,
        TimerAlarmAct: !1,
        bAlarmActive: !1,
        bro: "oth",
        tmpTownList: {},
        attTownList: {},
        numAttacks: 0,
        gridPX: 0,
        gridPY: 0,
        eLng: 0,
        real_night_mode: !1,
        CMD_MaxHeight: !1,
        DioMenuFix: !1,
        mmredraw: !1,
        pasteGP: null,
        pasteAR: null,
        LastForumTab: {},
        allianceForumResized: !1,
        commandsListDrag: !1,
        wndMiniForm: null,
        AjaxStop: !1,
        SWI: null,
        DWI: null,
        is_IDB: "?",
        IDB: null,
        IDB_keys: [],
        player_banned: !1,
        drag: {
            type: 0,
            x: 0,
            y: 0,
            state: !1,
            func: null,
            endfunc: null,
            mouse_down: !1
        },
        delta: {
            x: 0,
            y: 0
        },
        mousemove: function(e) {
            try {
                if (!MH.drag.state)
                    return;
                MH.delta.x = e.pageX - MH.drag.x,
                    MH.delta.y = e.pageY - MH.drag.y,
                    MH.drag.func(e.pageX, e.pageY, MH.delta.x, MH.delta.y),
                    MH.drag.x = e.pageX,
                    MH.drag.y = e.pageY
            } catch (e) {}
        },
        InitDragFunctions: function() {
            $(document).mousedown(function() {
                $(document).mousemove(function(e) {
                    MH.mousemove(e)
                });
                try {
                    MH.drag.mouse_down = !0
                } catch (e) {}
            }),
                $(document).mouseup(function() {
                try {
                    if (MH.drag.mouse_down = !1,
                        !MH.drag.state)
                        return;
                    MH.drag.state = !1,
                        null != MH.drag.endfunc && MH.drag.endfunc(),
                        MH.drag.endfunc = null
                } catch (e) {}
            }),
                $(document).click(function(e) {
                try {
                    MH.drag.mouse_down = !1,
                        1 != MH.MenuHelper.poupclick && $(MH.MenuHelper.actualmenu).length && $(MH.MenuHelper.actualmenu).remove(),
                        MH.MenuHelper.poupclick = !1,
                        $("#MH_EmotsPopup").length && ($("#MH_EmotsPopup").find($(e.target)).length || $("#MH_EmotsPopup").remove())
                } catch (e) {}
            })
        },
        IDB_Get: function(t, n) {
            var i = !1;
            try {
                var a = MH.IDB.transaction(["cookies"]).objectStore("cookies").get(t);
                a.onerror = function(e) {
                    n(t, !1)
                }
                    ,
                    a.onsuccess = function(e) {
                    a.result ? n(a.result.i, $.parseJSON(a.result.v)) : n(t, null)
                }
            } catch (e) {
                i = !0,
                    "undefined" != typeof DBG && alert("ERROR LOAD iDB " + t + " " + e)
            }
            1 == i && n(t, !1)
        },
        IDB_Set: function(t, e) {
            e = MH.IDB.transaction(["cookies"], "readwrite").objectStore("cookies").put({
                i: t,
                v: JSON.stringify(e)
            });
            e.onsuccess = function(e) {
                _log(t + " This has been added to your database")
            }
                ,
                e.onerror = function(e) {
                _log(t + " Unable to add this to your database!")
            }
        },
        StorageLoad: function(e, t) {
            MH.IDB_keys.indexOf(e) < 0 && MH.IDB_keys.push(e),
                1 == MH.is_IDB ? (MH.IDB_Get(e, t),
                                  MH.StorageRemove(e)) : t(e, MH.Storage(e))
        },
        StorageRemove: function(e) {
            try {
                localStorage.removeItem(e),
                    $.removeCookie(e)
            } catch (e) {}
        },
        Storage: function(t, e) {
            try {
                if (1 == MH.is_IDB && null != e && 0 <= MH.IDB_keys.indexOf(t))
                    return MH.IDB_Set(t, e);
                if ("undefined" != typeof Storage) {
                    if (null == e)
                        return $.parseJSON(localStorage.getItem(t));
                    localStorage.setItem(t, JSON.stringify(e))
                } else {
                    if (null == e)
                        return $.parseJSON($.cookie(t));
                    $.cookie(t, JSON.stringify(e), {
                        expires: 30
                    })
                }
            } catch (e) {
                return "undefined" != typeof DBG && alert("ERROR STORAGE " + t + " " + e),
                    "undefined" != typeof Storage && (e = $.parseJSON(localStorage.getItem("cMH_last")),
                                                      localStorage.clear(),
                                                      null != e && localStorage.setItem("cMH_last", JSON.stringify(e)),
                                                      1 != MH.is_IDB && (localStorage.setItem(MH.SetCookie, JSON.stringify(MH.Set)),
                                                                         localStorage.setItem(MH.GuiUstCookie, JSON.stringify(MH.GuiUst)),
                                                                         localStorage.setItem(MH.gRAPCookie, JSON.stringify(MH.gRAP)),
                                                                         localStorage.setItem(MH.gHndLstCookie, JSON.stringify(MH.gHndLst)))),
                    !1
            }
        }
    }
    MH.Init = {
        start: function() {
            if (MoleHoleOnBoard = "runned v0.9.9",
                -1 < window.location.href.indexOf("game/index")) {
                if (MH.GameUrl = window.location.href.substr(0, window.location.href.indexOf("/index")),
                    MH.LoadIcon = setInterval(function() {
                    $("#loader").length && (0 == MH.player_banned && $("#loader_content").append($("<img/>", {
                        id: "MHLoading",
                        src: "https://grepolis-david1327.e-monsite.com/medias/images/mhloading-david1327.png"
                    })),
                                            clearInterval(MH.LoadIcon),
                                            delete MH.LoadIcon)
                }, 1),
                    MH.ScriptAtcive = MH.Storage("cMH_ScriptAtcive"),
                    1 != MH.ScriptAtcive && 0 != MH.ScriptAtcive && (MH.ScriptAtcive = !0,
                                                                     MH.Storage("cMH_ScriptAtcive", !0)),
                    1 != MH.ScriptAtcive)
                    return void this.ActivationIcon();
                window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
                    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
                    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange,
                    window.indexedDB ? ((e = window.indexedDB.open("grmh", 2)).onerror = function(e) {
                    MH.is_IDB = !1
                }
                                        ,
                                        e.onsuccess = function(e) {
                    MH.is_IDB = !0,
                        MH.IDB = e.target.result
                }
                                        ,
                                        e.onupgradeneeded = function(e) {
                    e.target.result.createObjectStore("cookies", {
                        keyPath: "i"
                    })
                }
                                       ) : MH.is_IDB = !1,
                    MH.Init.load()
            }
            var e;
            -1 < window.location.href.indexOf("start?action=select_new_world") && (MH.ScriptAtcive = !1,
                                                                                   (e = document.createElement("script")).type = "text/javascript",
                                                                                   e.src = "https://greasyfork.org/scripts/423028-mhscript-lng-fr/code/MHscript_lng_fr.user.js",
                                                                                   document.body.appendChild(e),
                                                                                   setTimeout("MH.Init.SelectWorld()", 1e3))
        },
        SelectWorld: function() {
            void 0 !== MH.SELW ? MH.SELW.Start() : setTimeout("MH.Init.SelectWorld()", 1e3)
        },
        load: function() {
            var e;
            MH.ScriptAtcive && ("?" != MH.is_IDB ? (MH.LOAD_NUMBER = 0,
                                                    null == (e = MH.Storage("cMH_numAttacks")) ? MH.Storage("cMH_numAttacks", MH.numAttacks) : MH.numAttacks = e,
                                                    null != (e = MH.Storage("cMH_attTownList")) && (MH.attTownList = e),
                                                    MH.StorageLoad(MH.SetCookie, MH.Init.load_get),
                                                    MH.StorageLoad(MH.gHndLstCookie, MH.Init.load_get),
                                                    MH.StorageLoad(MH.gRAPCookie, MH.Init.load_get),
                                                    MH.StorageLoad(MH.GuiUstCookie, MH.Init.load_get),
                                                    MH.StorageLoad(MH.DomIslandsCookie, MH.Init.load_get),
                                                    MH.Init.load_lng()) : setTimeout("MH.Init.load()", 500))
        },
        load_get: function(e, t) {
            if (MH.LOAD_NUMBER++,
                e == MH.SetCookie && (d = MH.Set),
                e == MH.gHndLstCookie && (d = MH.gHndLst),
                e == MH.gRAPCookie && (d = MH.gRAP),
                e == MH.GuiUstCookie && (d = MH.GuiUst),
                e == MH.DomIslandsCookie && (d = MH.DomIslands),
                1 == $.isPlainObject(t))
                for (var n in d)
                    d.hasOwnProperty(n) && t.hasOwnProperty(n) && (d[n] = t[n])
        },
        load_lng: function() {
            void 0 === MH.Lng || MH.LOAD_NUMBER < 4 ? setTimeout("MH.Init.load_lng()", 100) : (MH.Lng.init(),
                                                                                               MH.init())
        },
        ActivationIcon: function() {
            var e = "click to activate";
            null != MH.Lang.butSActivate && (e = MH.Lang.butSActivate),
                $("#HMoleDisabled").remove(),
                $("#ui_box").append($("<img/>", {
                src: MH.Home + "gui/klatka.gif",
                id: "HMoleDisabled",
                style: "cursor:pointer; position:absolute; bottom:10px; left:50px; z-index:1000"
            }).mousePopup(new MousePopup(e)).click(function() {
                $("#HMoleDisabled").attr("src", MH.Home + "gui/klatkafree.gif"),
                    MH.ScriptAtcive = !0,
                    MH.Storage("cMH_ScriptAtcive", !0),
                    MH.AnimStep = 0,
                    setTimeout("MH.Init.ActivationAnim()", 100)
            }))
        }
    },
        "undefined" == typeof MoleHoleOnBoard && MH.Init.start(),
        MH.Init.ActivationAnim = function() {
        var e, t;
        switch (MH.AnimStep) {
            case 0:
                e = $("#HMoleDisabled").offset().left,
                    t = $("#HMoleDisabled").offset().top - 8,
                    3 < e && e--,
                    $("#HMoleDisabled").css({
                    left: e,
                    top: t
                }),
                    t < 200 && MH.AnimStep++;
                break;
            case 1:
                return setTimeout("MH.Init.start()", 100),
                    void $("#HMoleDisabled").remove()
        }
        setTimeout("MH.Init.ActivationAnim()", 50)
    }
        ,
        MH.Init.DeactivationAnim = function() {
        var e;
        switch (MH.AnimStep) {
            case 0:
                $("#ui_box").append($("<img/>", {
                    src: MH.Home + "gui/klatkaP.gif",
                    id: "HMoleDisabled",
                    style: "position:absolute; top:0px; left:50px; z-index:1000"
                })),
                    MH.AnimStep++;
                break;
            case 1:
                e = $("#HMoleDisabled").offset().top + 8,
                    $("#HMoleDisabled").css({
                    top: e
                }),
                    190 < e && MH.AnimStep++;
                break;
            case 2:
                e = $("#MH_logo").offset().left + 5,
                    $("#MH_logo").css({
                    left: e
                }),
                    60 < e && ($("#HMoleDisabled").attr("src", MH.Home + "gui/klatka.gif"),
                               $("#HMoleM").remove(),
                               $(".nui_main_menu").css("top", "255px"),
                               MH.AnimStep++);
                break;
            case 3:
                if (e = $("#HMoleDisabled").offset().top + 10,
                    $("#HMoleDisabled").css({
                    top: e
                }),
                    e > $(window).height() - 100)
                    return MH.AnimStep++,
                        MH.Init.ActivationIcon(),
                        void location.reload()
        }
        setTimeout("MH.Init.DeactivationAnim()", 50)
    }
        ,
        MH.outit = function() {
        MH.ScriptAtcive = !1,
            MH.Storage("cMH_ScriptAtcive", !1),
            MH.wo.Close(),
            $("#toolbar_activity_commands_list a").remove(),
            $(".GMHADD").remove(),
            MH.AnimStep = 0,
            setTimeout("MH.Init.DeactivationAnim()", 100)
    }
        ,
        MH.init = function() {
        var l = void 0 === _mh5437895432 ? !1 : void 0 === _mh5987355678 ? !1 : void 0 === _mh5534272947 ? !1 : void 0 === _mh5998734257 ? !1 : void 0 === _mh5761928745 ? !1 : void 0 === _mh5534272514 ? !1 : !0;
        1 != l || $("#loader").length ? setTimeout("MH.init()", 100) : MH.player_banned || (Game.alliance_name = "",
                                                                                            eval(function(e, t, n, i, a) {
            if (i = function(e) {
                return e.toString(13)
            }
                ,
                !"".replace(/^/, String)) {
                for (; t--; )
                    a[i(t)] = n[t] || i(t);
                n = [function(e) {
                    return a[e]
                }
                    ],
                    i = function() {
                    return "\\w+"
                }
                    ,
                    t = 1
            }
            for (; t--; )
                n[t] && (e = e.replace(new RegExp("\\b" + i(t) + "\\b","g"), n[t]));
            return e
        }("1=0 2,3=0 4,5=0 6,7=0 8,9=0 a,b=0 c;", 13, "new|mhCol|_mh5534272514|mhUtl|_mh5761928745|mhGui|_mh5998734257|mhDat|_mh5534272947|mhAddStd|_mh5987355678|mhRep|_mh5437895432".split("|"), 0, {})),
                                                                                            MH.Set.DR && mhAddStd.DailyLogSet(),
                                                                                            MH.Set.townPrvWindow && (mhAddStd.TownIndexWindowSet(),
                                                                                                                     Game.player_settings.auto_open_townindex && mhAddStd.TownIndexWindowOpen()),
                                                                                            MH.GameImg = Game.img().replace("/images", ""),
                                                                                            MH.real_night_mode = Game.night_mode,
                                                                                            MH.init_waitchrome())
    }
        ,
        MH.init_waitchrome = function() {
        void 0 === MH.initAll ? setTimeout("MH.init_waitchrome()", 100) : MH.initAll()
    }
        ,
        MH.GetHomeUrlParm = function() {
        var e = "&pl=" + Game.player_id;
        return null != Game.alliance_id && (e += "&al" + Game.alliance_id),
            e += "&wid=" + Game.world_id
    }
        ,
        MH.Link2Struct = function(l) {
        ret = {};
        try {
            l = l.split(/#/),
                eval("ret=" + atob(l[1] || l[0]))
        } catch (e) {}
        return ret
    }
        ,
        MH.ghref = function(e, t) {
        return (e = MH.Link2Struct(e.attr("href"))).hasOwnProperty(t) ? e[t] : null
    }
        ,
        MH.btoa = function(e) {
        for (var t, n, i, a, o, r, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", s = "", d = 0; d < e.length; )
            i = (r = e.charCodeAt(d++)) >> 2,
                a = (3 & r) << 4 | (t = e.charCodeAt(d++)) >> 4,
                o = (15 & t) << 2 | (n = e.charCodeAt(d++)) >> 6,
                r = 63 & n,
                isNaN(t) ? o = r = 64 : isNaN(n) && (r = 64),
                s += l.charAt(i) + l.charAt(a) + l.charAt(o) + l.charAt(r);
        return s
    }
        ,
        MH.atob = function(e) {
        var t, n, i, a, o, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", l = "", s = 0, d = e.length;
        for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); s < d; )
            i = r.indexOf(e.charAt(s++)) << 2 | (o = r.indexOf(e.charAt(s++))) >> 4,
                a = (15 & o) << 4 | (t = r.indexOf(e.charAt(s++))) >> 2,
                o = (3 & t) << 6 | (n = r.indexOf(e.charAt(s++))),
                l += String.fromCharCode(i),
                64 !== t && (l += String.fromCharCode(a)),
                64 !== n && (l += String.fromCharCode(o));
        return utf8Decode(l)
    }
        ,
        MH.Pop = function(e) {
        var t = $("#popup_div").attr("style")
        , n = $("#popup_div").html();
        e.mouseenter();
        e = $("#popup_content").html();
        return $("#popup_div").html(n),
            $("#popup_div").attr("style", t),
            e
    }
        ,
        MH.RepFunc = function(e, t, n) {
        void 0 !== e[t] && (e[t + "MHEX"] = e[t],
                            e[t] = function() {
            e[t + "MHEX"]()
        }
                           )
    }
        ,
        MH.FC = function(e, t) {
        $(e).click(t);
        e = $._data($(e)[0], "events");
        e.click.unshift(e.click.pop())
    }
        ,
        MH.SavP = function(e) {
        for (var t = (t = e.val()).replace(MH.bz, " "), n = 0; n < t.length - 1; n++)
            " " == t.charAt(n) && " " == t.charAt(n + 1) && (t = t.substr(0, n) + "¨" + t.substring(n + 1, t.lenght)),
                "\n" == t.charAt(n) && " " == t.charAt(n + 1) && (t = t.substr(0, n + 1) + "¨" + t.substring(n + 2, t.lenght));
        t = t.replace(/¨/g, MH.bz),
            e.val(t)
    }
        ,
        MH.TxtaIns = function(t, n) {
        var i, a, o, r, l;
        n.focus(),
            void 0 !== document.selection ? (l = (r = document.selection.createRange()).text,
                                             r.text = t + l,
                                             r = document.selection.createRange(),
                                             0 == l.length ? r.move("character", -e.length) : r.moveStart("character", t.length + l.length),
                                             r.select()) : void 0 !== n.selectionStart && (i = n.selectionStart,
                                                                                           a = n.selectionEnd,
                                                                                           o = n.scrollTop,
                                                                                           r = n.scrollHeight,
                                                                                           l = n.value.substring(i, a),
                                                                                           n.value = n.value.substr(0, i) + t + l + n.value.substr(a),
                                                                                           l = 0 == l.length ? i + t.length : i + t.length + l.length,
                                                                                           n.selectionStart = l,
                                                                                           n.selectionEnd = l,
                                                                                           n.scrollTop = o + n.scrollHeight - r)
    }
        ,
        MH.ReportsView = function(e) {
        MH.Set.colRep && $.each($(e + " center img"), function(e, t) {
            ($(t).attr("src").includes("r%2Fhead.gif") || $(t).attr("src").includes("r%2Fcut2.gif")) && ($(t).css({
                "margin-bottom": "-3px"
            }),
                                                                                                         null != (t = $(this).parent().next().find(":first")) && (t.css("background", "transparent"),
        t.css("background-image", "url(" + MH.Home + "r/body.gif)"),
        t.css("background-repeat", "repeat-y"),
        t.parent().css("border", "0"),
        t.find("table").css("border", "0")))
        })
    }
        ,
        MH.wndCreate = function(e, t, n, i) {
        if (void 0 === MH.OwnWnds && (MH.OwnWnds = {}),
            MH.OwnWnds.hasOwnProperty(e)) {
            try {
                MH.OwnWnds[e].close()
            } catch (e) {}
            delete MH.OwnWnds[e]
        }
        return MH.OwnWnds[e] = Layout.dialogWindow.open('<img alt="" src="' + MH.Home + 'imgs/loader.gif" style="position:absolute; left:' + (n - 58) / 2 + "px; top:" + (i - 61 - 58) / 2 + 'px;"/>', t, n, i, function() {
            delete MH.OwnWnds[e]
        }, !0),
            MH.OwnWnds[e].setPosition(["center", "center"]),
            MH.OwnWnds[e]
    }
        ,
        MH.AddPlayerAlly = function(e) {
        var t, n;
        "1" != e.attr("MHMplay") && (n = MH.Link2Struct(e.attr("href")).id,
                                     n = parseInt(n),
                                     isNaN(n) || (t = mhCol.AllyName_PlayId(n),
                                                  null != (n = mhCol.AllyId_PlayID(n)) && (!n in mhCol.allys || null != t && (e.after('<span style="margin-left:6px;">' + mhUtl.lnkAlly(n, t) + "<span>"),
                                                                                                                              e.attr("MHMplay", "1")))))
    }
        ,
        MH.GameGet = function(e, t, n, i) {
        var a, i = i || !0, n = n || {}, o = MH.GameUrl + "/";
        o += e,
            o += "?town_id=" + Game.townId,
            o += "&action=" + t,
            o += "&h=" + Game.csrfToken,
            n.town_id = Game.townId,
            n.nl_init = NotificationLoader.isGameInitialized(),
            n = JSON.stringify(n),
            o += "&json=" + (n = encodeURIComponent(n)),
            MH.AjaxStop = !0,
            a = $.ajax(o, {
            method: "GET",
            global: i,
            async: !1
        }),
            MH.AjaxStop = !1;
        try {
            a = JSON.parse(a.responseText)
        } catch (e) {
            a = null
        }
        return a
    }
        ,
        MH.GamePost = function(e, t, n, i) {
        var a, i = i || !0, n = n || {}, i = MH.GameUrl + "/";
        i += e,
            i += "?town_id=" + Game.townId,
            i += "&action=" + t,
            i += "&h=" + Game.csrfToken,
            n.town_id = Game.townId,
            n.nl_init = NotificationLoader.isGameInitialized(),
            n = JSON.stringify(n),
            n = encodeURIComponent(n),
            MH.AjaxStop = !0,
            a = $.ajax(i, {
            method: "POST",
            data: "json=" + n,
            global: !0,
            async: !1
        }),
            MH.AjaxStop = !1;
        try {
            a = JSON.parse(a.responseText)
        } catch (e) {
            a = null
        }
        return a
    }
        ,
        MH.GameCallPost = function(e, t, n, i) {
        var i = i || !0
        , n = n || {}
        , i = MH.GameUrl + "/";
        i += e,
            i += "?town_id=" + Game.townId,
            i += "&action=" + t,
            i += "&h=" + Game.csrfToken,
            n.town_id = Game.townId,
            n.nl_init = NotificationLoader.isGameInitialized(),
            n = JSON.stringify(n),
            n = encodeURIComponent(n),
            $.ajax(i, {
            method: "POST",
            data: "json=" + n
        })
    }
        ,
        MH.Call = function(e, t, n, i, a) {
        return mhDat.Go2(e, t, n, i, a)
    }
        ,
        MH.bbc = function(e, t) {
        return null != e && 0 < e.length ? "[" + t + "]" + e + "[/" + t + "]" : e
    }
        ,
        MH.bbcS = function(e, t) {
        return e ? 0 < e.length ? "[size=" + t + "]" + e + "[/size]" : e : ""
    }
        ,
        MH.bbcT = function(e) {
        return e.toString().indexOf("[town]") < 0 && (e = "[town]" + e + "[/town]"),
            e
    }
        ,
        MH.bbcP = function(e) {
        return e.indexOf("[player]") < 0 && (e = "[player]" + e + "[/player]"),
            e
    }
        ,
        MH.bbcA = function(e) {
        return e.indexOf("[ally]") < 0 && (e = "[ally]" + e + "[/ally]"),
            e
    }
        ,
        MH.bbcWHT = function(e, t) {
        return "¨¨¨¨¨¨¨¨¨¨".slice(1, t - e.length)
    }
        ,
        MH.bbcC = function(e, t) {
        return "[color=#" + t + "]" + e + "[/color]"
    }
        ,
        MH.bbcU = function(e, t) {
        return MH.bbcWHT(e, 7) + e
    }
        ,
        MH.bbcVAL = function(e, t) {
        return MH.bbcWHT(String(e), t) + String(e)
    }
        ,
        "undefined" == typeof MH && (MH = {}),
        MH.GLng = {},
        MH.Lng = {
        loadtry: 0,
        loadtryG: 0,
        DefEN: {
            rep: {
                ga1: ["A ray of light breaks through the clouds,\na chariot descends and follows the city.", "The selected city receives a chariot.", ""],
                ga2: ["Dark clouds appear over the city.\nLightning hit the building and damaged it.", "Random building in the city losing 1 level.", ""],
                ga4: ["Zeus tears up the sky with lightning bolts\nand tosses soldiers through the air.\nSome cling to trees, other swallow the sky.", "Destroys 10-30% of the attacking land units.", ""],
                gb1: ["Brave warriors hear the call for help\nand rush into the city of the patroness.", "The city receives 5 random units.", ""],
                gb2: ["An owl circles above the enemy troops\nand reports about their strength.", "You receive an espionage report\nabout an incoming enemy troop.", ""],
                gb3: ["A ray of light breaks through the clouds.\nAthena spreads her shield across the city.", "You can't throw any spells on the city.", "The city received protection"],
                gc1: ["Wood washes up on the city shore.\nPoseidon is showing himself from his good side.", "The city receives 800 wood.", ""],
                gc2: ["Strong waves break against the shore.\nThe workers imbues wonderful voice of the sea.", "All construction orders in the harbor\nare accelerated.", "Speed of the harbor increased by 100%"],
                gc3: ["The ground shifts and quakes.Large chunks\nof the city wall plummet into the depths.", "The city wall loses 1-3 levels.", ""],
                gc4: ["Poseidon rises and his waves beat against the ships.\nIt's not a good day for seafarers.", "Destroys 10-30% of the\nrandomly selected ships.", ""],
                gd1: ["Noblemen come from all the surrounding lands\nto bring presents to the king's marrying daughter.", "The city receives 200 pieces\nof each raw material.", ""],
                gd2: ["At night, Hera places a warming veil around the\nworkers and cools them gently in the mid-day heat.", "Increases the production\nof raw materials in mines.", "Production has been increased by 50%"],
                gd3: ["Another proud warrior has been born.\nHera means this city well.", "In the barracks, all recruitment\nassigned are accelerated.", "Speed of the barracks increased by 100%"],
                ge1: ["Hades show his justice and punish\nthe dissolved inhabitants terrible epidemic.", "Reduces the basic production\nof raw materials.", "Production reduced by 50%"],
                ge3: ["The ground opens up\nand grants you access to incredible riches.", "The city receives 500 silver coins.", ""]
            },
            norka: "Mole Hole",
            konwrap: "Report Converter",
            repRec: "Remember Report",
            repPla: "Saved Report",
            repCfg: "Configure Report",
            insert: "Insert",
            insGif: "GIF image",
            insEmo: "emoticon",
            opcje: "Options",
            Withdrawing: "Withdrawing",
            set9a: "current alarm sound",
            set9b: "play repeatedly",
            set9c: "PROPOSED BELLS",
            Ttoday: "Time on game today",
            Tnow: "Time from now",
            Tto: "Time remaining to...",
            Talarm: "Turn on the attacks alarm 10s before the end",
            uniVS0: "all units in the city",
            uniVS1: "supporting units from other cities",
            uniVS2: "all units from this city",
            uniVS3: "units from this city in this city",
            uniVS4: "units from this city outside the city",
            uniVM0: "all units in cities",
            uniVM1: "all supporting units from other cities",
            uniVM2: "all held units",
            uniVM3: "all own units remained in the cities",
            uniVM4: "all own units residing outside the cities",
            getBBC: "Get as BBCode",
            getFILE: "Get as file",
            getF1: "Here's your download link",
            getF2: 'click on it right mouse button and select "save as"',
            reaTime: "Arrival Times",
            AddToList: "Add to List",
            ChngIslaNam: "Change the name of island",
            SetTarget: "Mark as Target",
            GoTarget: "Go to marked target",
            ShowOnly: "Show Only",
            ComBefore: "coming before",
            ComAfter: "coming after",
            Road: "Road",
            SymPlay: "Assign a different symbol to this player",
            SymAlly: "Assign a different symbol to this alliance",
            SymAll: "Symbols assignments",
            SymO1: "on the flag",
            SymO2: "over the flag",
            SymO3: "next to the flag",
            SymO4: "remove symbol",
            pldays: "Count of Play Days",
            wrdspeed: "​World Speed",
            unispeed: "Units Speed",
            country: "Country",
            noWWevent: "no Age Wonders Event on this world",
            created: "Founded",
            trdspeed: "​​Trade Speed",
            allylimit: "Alliance Cap",
            nBonus: "Night Bonus",
            atiming: "Anty-timing",
            moral: "Morale",
            conquesttype: "Conquer System",
            conquestt_o: "Conquest (old)",
            conquestt_n: "Revolt (new)",
            conquestt_c: "None (only found cities)",
            protectplay: "Beginner Protection",
            reprv: "Report Preview",
            repopt: "Conversion Options",
            repwzo: "Pattern",
            repwzo1: "Normal",
            title: "Title",
            date: "Date",
            repgen: "Apply Changes",
            UNSUP: "Army defending",
            UNINCO: "Army imminent",
            incozero: "No incoming troops",
            incoown: "belonging to the",
            incoocu: "occupied by",
            supontar: "Support Occurred to Target",
            spelleff: "Spell Effect",
            spelltime: "Duration of the spell",
            spellend: "End of the Spell",
            occupant: "Occupant",
            occuend: "End of Siege",
            wallShow: "Show defeated from",
            wallShowA: "beginning of the game",
            wallShowB: "last reset",
            btnReset: "Reset",
            butSDeactiv: "Deactivate Appendix",
            butSActivate: "click to activate the add-on",
            by: "by",
            lack: "Lack",
            above: "Above",
            god: "God",
            resPhalanx: "Phalanx",
            resRam: "Ram",
            situation: "Situation",
            inAtt: "Imminent Attacks",
            inDef: "Imminent Supports",
            curInci: "Current Incitement",
            startRevolt: "Start of Revolt",
            endRevolt: "End Revolt",
            curRevolt: "Current Revolt",
            BTNCONV: "Convert",
            HIDDEN: "Hidden",
            HELPTAB0: "Spells",
            HELPTAB1: "World Info",
            HELPTAB2: "Player Info",
            HELPTAB3: "Instruction",
            HELPTAB4: "Settings",
            HELPTAB5: "Awards",
            HELPTAB6: "Info.",
            HLPVERSION: "Version",
            MSGHUMANOK: "The information has been saved",
            MSGHUMANERROR: "An error occurred while writing",
            STATS: "Player Stats",
            STATSA: "Alliance Stats",
            STATST: "History of conquest",
            ATTACKER: "Attacker",
            DEFENDER: "Defender",
            PrfA: "Cities/Members",
            PrfB: "Profile",
            AttT: "Attacker's town",
            DefT: "Defender's town",
            AttU: "Army attacking",
            DefU: "Army defenders",
            AllU: "Units",
            DeffA: "Army defending town",
            SpyB: "Buildings",
            SpyC: "Used silver coins",
            SpyR: "Raw materials",
            SelT: "Designations attacks",
            cmdIN: "Incoming",
            cmdOUT: "Outgoing",
            cmdRET: "Reversed",
            cmdRevA: "Incitements",
            cmdRevR: "Revolts",
            cmdOcu: "Occupations",
            cmdAtt: "Attacks",
            cmdSup: "Supports",
            cmdSpy: "Spies",
            cmdFarm: "Villages",
            Farm: "Village",
            cmdOWN: "From Own Cities",
            PlyU: "Army of other players",
            cmdToCity: "City troop movements",
            bbc2f_get: "Get BBCode for external Grepolis forum",
            bbc2f_opi: "Conversion BBCode text used in game to the BBCode text used in the external Grepolis forum",
            bbc2f_in: "Give BBCode from the game",
            bbc2f_out: "Here's the BBCode to use on the external Grepolis forum",
            agrThanks: "thanks for the support",
            _Set_1: "Basic",
            set9: "Attacks alarm",
            set13: "Turn the city preview to window mode",
            Set_DR: "Don't show daily reward at the start",
            Set_YTW: "After clicking on the YouTube link, play the video in a window",
            Set_YTR: "Instead links of YouTube, show the video immediately",
            Set_RD: "Skip warning about going to the outside",
            set11: "Enable economize mode (for slow computers)",
            set5: "To preview the statistics use information from the site",
            _Set_2: "Modifications",
            Set_TL: "Modify list of cities",
            set10: "Modify list of upcoming troops",
            set15: "Switcher of the units view (on the right side of the GUI)",
            set8: "Reduce the original menu",
            set12: "Replace the original menu with other",
            _Set_2b: "Map modifications",
            set14: "Additional options in the context menu",
            Set_MS: "On the map show players and alliances symbols",
            Set_MSb: "On the map show players and alliances subtitles",
            set6: "On the map show the current ocean",
            set7: "On the map show the cartographic grid",
            themes: "Graphics themes",
            Set_theme: "Winter graphics",
            Set_theme2: "Blue roofs",
            Set_theme3: "Backlight",
            Set_themeA: "Cartographic Grid",
            _Set_3: "Windows",
            Set_WndT: "In the browser window modify the title bookmark",
            set3: "In alliance forum (and other windows) show all bookmarks",
            set2: "Enlarge window of alliance forum to 80% height of screen",
            set16: "Modify window with Messages on the shape of the Alliance Forum window",
            wRes1: "Allow to change the size of windows",
            wRes2: "Remember the changed windows sizes",
            Set_WS: "In the windows show the symbols of players and alliances",
            Set_AL: "In the windows add the alliances flags",
            loadCnv: "Download and use the reports conversion module",
            set1: "Modify the appearance of the converted reports",
            set0: "Show converted reports instead of the normal",
            _Set_4: "Language",
            lngNat: "national language",
            lngOth: "other language",
            PostMessage: "send message to the author",
            PostTxt: "Send to the Author",
            PostFail: "Unfortunately, sending the message failed",
            PostOk: "The message, was sent successfully",
            mMain: "Main Menu",
            mLinks: "Links"
        },
        getCountryLng: function(e) {
            switch (e = e.toLowerCase()) {
                case "de":
                    return "de";
                case "en":
                    return "en";
                case "fr":
                    return "fr";
                case "gr":
                    return "el";
                case "nl":
                    return "nl";
                case "es":
                    return "es";
                case "it":
                    return "it";
                case "ro":
                    return "ro";
                case "se":
                    return "sv";
                case "cz":
                    return "cs";
                case "pl":
                    return "pl";
                case "pt":
                    return "pt";
                case "hu":
                    return "hu";
                case "sk":
                    return "sk";
                case "dk":
                    return "da";
                case "ru":
                    return "ru";
                case "no":
                    return "nb";
                case "br":
                    return "pt";
                case "tr":
                    return "tr";
                case "us":
                    return "en";
                case "ar":
                    return "es";
                case "fi":
                    return "fi";
                case "zz":
                    return "en"
            }
            return null
        },
        getLngCountry: function(e) {
            switch (e = e.toLowerCase()) {
                case "de":
                    return "de";
                case "en":
                    return "en";
                case "fr":
                    return "fr";
                case "el":
                    return "gr";
                case "nl":
                    return "nl";
                case "es":
                    return "es";
                case "it":
                    return "it";
                case "ro":
                    return "ro";
                case "sv":
                    return "se";
                case "cs":
                    return "cz";
                case "pl":
                    return "pl";
                case "pt":
                    return "pt";
                case "hu":
                    return "hu";
                case "sk":
                    return "sk";
                case "da":
                    return "dk";
                case "ru":
                    return "ru";
                case "nb":
                    return "no";
                case "tr":
                    return "tr";
                case "fi":
                    return "fi"
            }
            return null
        },
        init: function() {
            for (var e in MH.Lang = {},
                 this.DefEN)
                MH.Lang[e] = this.DefEN[e];
            MH.LngUse = "en";
            try {
                MH.Lng.collectFromGame()
            } catch (e) {}
            MH.LngLda = "",
                "edit" == MH.Set.lng ? MH.StorageLoad("cMH_lng_edit", function(e, t) {
                1 != $.isPlainObject(t) ? MH.LngLda = "" : (MH.eLng = t,
                                                            MH.LngLda = t.can),
                    MH.Lng.load()
            }) : (MH.LngLda = MH.Set.lng,
                  MH.Lng.load())
        },
        load: function() {
            var e = MH.Lng.getCountryLng(MH.LngLda);
            null == e && (e = Game.locale_lang.substring(0, 2),
                          MH.LngLda = Game.world_id.substring(0, 2),
                          "zz" == MH.LngLda && (MH.LngLda = "en"));
            e = "https://github.com/DIO-David1327/Mole-hope/raw/main/Language/lng_" + e + ".js";
            /*if (e === "fr") {
            e = "https://greasyfork.org/scripts/423028-mhscript-lng-fr/code/MHscript_lng_fr.user.js";
        } else if (e === "de") {
            e = "https://greasyfork.org/scripts/430389-mhscript-lng-de/code/MHscript_lng_de.user.js";
        } else {
            e = "https://greasyfork.org/scripts/430388-mhscript-lng-en/code/MHscript_lng_en.user.js";
        }*/
            $.ajax({
                type: "GET",
                url: e,
                dataType: "script",
                timeout: 1e4,
                complete: function() {
                    if ("undefined" == typeof HMoleLangAdd)
                        return MH.Lng.loadtry++,
                            10 < MH.Lng.loadtry ? void 0 : void setTimeout("MH.Lng.load()", 100);
                    if ("undefined" != typeof HMoleLangAdd) {
                        for (var e in MH.LngUse = MH.LngLda,
                             HMoleLangAdd)
                            MH.Lang[e] = HMoleLangAdd[e];
                        if ("edit" == MH.Set.lng)
                            for (e in MH.eLng.str)
                                MH.Lang[e] = MH.eLng.str[e];
                        MH.Lng.UpdateVisible()
                    }
                },
                error: function() {}
            })
        },
        UpdateVisible: function() {
            $("#HMoleLoading").attr("src", MH.Home + "gui/load3.gif"),
                $("#HMConvLink").html(MH.Lang.norka),
                $("#Menu_0").mousePopup(new MousePopup(MH.Lang.GoTarget)),
                $("#ui_box .nui_units_box .MHunitsel .content .button").eq(0).mousePopup(new MousePopup(MH.Lang.uniVS0)),
                $("#ui_box .nui_units_box .MHunitsel .content .button").eq(1).mousePopup(new MousePopup(MH.Lang.uniVS1)),
                $("#ui_box .nui_units_box .MHunitsel .content .button").eq(2).mousePopup(new MousePopup(MH.Lang.uniVS2)),
                $("#ui_box .nui_units_box .MHunitsel .content .button").eq(3).mousePopup(new MousePopup(MH.Lang.uniVS3)),
                $("#ui_box .nui_units_box .MHunitsel .content .button").eq(4).mousePopup(new MousePopup(MH.Lang.uniVS4)),
                $("#Menu_4").mousePopup(new MousePopup(MH.Lang.opcje)),
                MH.Glng.Booty2 = MH.Lang.SpyR,
                MH.Glng.Bpnt = DM.getl10n("mass_recruit").sort_by.points,
                $.ajax({
                type: "GET",
                url:"https://greasyfork.org/scripts/423028-mhscript-lng-fr/code/MHscript_lng_fr.user.js",
                dataType: "script",
                timeout: 1e4,
                complete: function() {
                    if ("undefined" == typeof MH_LngAddGame)
                        return MH.Lng.loadtryG++,
                            10 < MH.Lng.loadtryG ? void 0 : void setTimeout("MH.Lng.UpdateVisible()", 100);
                    if ("undefined" != typeof MH_LngAddGame)
                        for (var e in MH_LngAddGame)
                            MH.GLng[e] = MH_LngAddGame[e]
                }
            })
        },
        collectFromGame: function() {
            MH.Glng = {},
                MH.Glng.WalDef = "Defeated",
                MH.Glng.WalLos = "Losses",
                MH.Glng.WalA = "as an attacker",
                MH.Glng.WalD = "as an defender",
                MH.Glng.TwnU = DM.getl10n("place").support_overview.troops_from_this_city,
                MH.Glng.Booty = DM.getl10n("barracks").tooltips.booty.title,
                MH.Glng.Booty2 = MH.Lang.SpyR,
                MH.Glng.Bpnt = DM.getl10n("mass_recruit").sort_by.points,
                MH.Glng.Jednostki = DM.getl10n("context_menu", "titles").units_info + ":",
                MH.Glng.Ranking = DM.getl10n("COMMON").main_menu.ranking
        },
        GetFromGame: function(e, t) {
            var n, i = {};
            switch (t) {
                default:
                    return;
                case "report:index":
                    if (!MH.DB.needLNG.hasOwnProperty("Page"))
                        return;
                    i.Page = e.find(".game_list_footer>#es_page_reports label").html().clear(),
                        i.Select_all = e.find(".game_list_footer>label").html().clear(),
                        i.Delete_all = e.find(".button_area>.button").eq(1).html().clear();
                    break;
                case "alliance_forum:forum":
                    MH.DB.needLNG.hasOwnProperty("Quote") && e.find("li.post .post_functions a").each(function(e, t) {
                        $(t).attr("onclick") && -1 < $(t).attr("onclick").indexOf("postQuote") && (i.Quote = $(t).html().clear())
                    }),
                        MH.DB.needLNG.hasOwnProperty("Show") && e.find("li.post .bbcodes_spoiler").each(function(e, t) {
                        "none" == $(t).find(".bbcodes_spoiler_text").css("display") && (i.Show = $(t).find(".button.spoiler .middle").html().clear(),
                                                                                        i.Hide = $(t).find(".button.spoiler").attr("data-alt_text").clear())
                    });
                    break;
                case "ranking:index":
                    if (!MH.DB.needLNG.hasOwnProperty("Allys"))
                        return;
                    i.Allys = $("#ranking-alliance .middle").html(),
                        i.Position = e.find("#ranking_fixed_table_header tr:first .r_rank").html(),
                        i.Name = e.find("#ranking_fixed_table_header tr:first .r_name").html(),
                        i.AvgPoints = e.find("#ranking_fixed_table_header tr:first .r_avg_points").html(),
                        i.Towns = e.find("#ranking_fixed_table_header tr:first .r_towns").html();
                    break;
                case "ranking:alliance":
                    if (!MH.DB.needLNG.hasOwnProperty("Players"))
                        return;
                    i.Players = e.find("#ranking_fixed_table_header tr:first .r_player").html();
                    break;
                case "ranking:wonder_alliance":
                    if (!MH.DB.needLNG.hasOwnProperty("Stage"))
                        return;
                    i.Stage = e.find("#ranking_fixed_table_header tr:first .r_stage").html(),
                        i.Sea = e.find("#ranking_fixed_table_header tr:first .r_sea").html();
                    break;
                case "alliance_profile:profile":
                    if (!MH.DB.needLNG.hasOwnProperty("Members"))
                        return;
                    i.Members = e.find("#ally_towns .game_header").html().clear()
            }
            if (0 != MH.utl.ObjLength(i)) {
                for (n in i)
                    delete MH.DB.needLNG[n];
                MH.Storage("cMH_needLNG", MH.DB.needLNG),
                    MH.Call("req:set", {
                    req: {
                        lngGame: i
                    }
                }, function() {})
            }
        }
    },
        MH.ev = {
        ren: {},
        DailyLoginClosed: !1,
        wTypes: {
            alliance: GPWindowMgr.TYPE_ALLIANCE,
            alliance_forum: GPWindowMgr.TYPE_ALLIANCE_FORUM,
            alliance_profile: GPWindowMgr.TYPE_ALLIANCE_PROFILE,
            command_info: GPWindowMgr.TYPE_ATK_COMMAND,
            building_barracks: GPWindowMgr.TYPE_BUILDING,
            building_docks: GPWindowMgr.TYPE_BUILDING,
            building_wall: GPWindowMgr.TYPE_BUILDING,
            building_temple: GPWindowMgr.TYPE_BUILDING,
            building_main: GPWindowMgr.TYPE_BUILDING,
            building_place: GPWindowMgr.TYPE_BUILDING,
            chat: GPWindowMgr.TYPE_CHAT,
            conquwror: GPWindowMgr.TYPE_CONQUEROR,
            conquwror_mov: GPWindowMgr.TYPE_CONQUEROR,
            conquest_info: GPWindowMgr.TYPE_CONQUEST,
            farm_town_overviews: GPWindowMgr.TYPE_FARM_TOWN_OVERVIEWS,
            island_info: GPWindowMgr.TYPE_ISLAND,
            message: GPWindowMgr.TYPE_MESSAGE,
            notification_popup: GPWindowMgr.TYPE_NOTIFICATION_POPUP,
            player_profile: GPWindowMgr.TYPE_PLAYER_PROFILE,
            player_index: GPWindowMgr.TYPE_PLAYER_SETTINGS,
            publish_report: GPWindowMgr.TYPE_PUBLISH_REPORT,
            ranking: GPWindowMgr.TYPE_RANKING,
            report: GPWindowMgr.TYPE_REPORT,
            town_info: GPWindowMgr.TYPE_TOWN,
            town_overviews: GPWindowMgr.TYPE_TOWN_OVERVIEWS,
            wonders: GPWindowMgr.TYPE_UNINHABITED_PLACE,
            academy: 40,
            advent: 41,
            advent_end_interstitial: 42,
            advent_sale_interstitial: 43,
            advent_welcome: 44,
            assassins: 45,
            assassins_end_interstitial: 46,
            assassins_sale_interstitial: 47,
            assassins_sale_interstitial_2: 48,
            assassins_welcome: 49,
            barracks: 50,
            beginners_aid_package_end: 51,
            beginners_aid_package_start: 52,
            community_goal_reached: 53,
            crm: 54,
            daily_login: 55,
            dialog: 56,
            docks: 57,
            easter: 58,
            easter_collect: 59,
            easter_end_interstitial: 60,
            easter_sale_interstitial: 61,
            easter_sale_interstitial_2: 62,
            easypay: 63,
            farm_town: 64,
            gifts_welcome: 65,
            gold_trade_interstitial: 66,
            halloween: 67,
            halloween_collect: 68,
            halloween_end_interstitial: 69,
            halloween_sale_interstitial: 70,
            hercules2014: 71,
            hercules2014_collect: 72,
            hercules2014_end_interstitial: 73,
            hercules2014_interstitial: 74,
            heroes: 75,
            heroes_train: 76,
            heroes_welcome: 77,
            hide: 78,
            interstitial: 79,
            introduction_welcome: 80,
            inventory: 81,
            ipad_welcome: 82,
            island: 83,
            island_quests: 84,
            layout: 85,
            market: 86,
            militia_welcome: 87,
            notes: 88,
            no_gold_dialog: 89,
            package_sale_interstitial_1: 90,
            phoenician_salesman_welcome: 91,
            place: 92,
            premium: 93,
            premium_shop: 94,
            quest: 95,
            quest_progress: 96,
            quest_welcome: 97,
            senate: 98,
            special_offer: 99,
            storage: 100,
            summer2014: 101,
            summer2014_collect: 102,
            summer2014_end_interstitial: 103,
            summer2014_interstitial: 104,
            survey: 105,
            tutorial_fight_animation: 106,
            update_notification: 107,
            valentinesday_collect: 108,
            valentine_welcome: 109,
            world_end_welcome: 110,
            world_wonders_welcome: 111,
            grepolis_score: 112,
            custom_colors: 113,
            world_wonder_donations: 114,
            olympus_temple_info: 115,
            AssSymbols: "01",
            wArrivalTimes: "02",
            wRepCnv: "03",
            NotifyWnd: "04",
            AttacksAlarms: "05",
            wTownList: "06",
            wTownOverview: "07",
            wFarmList: "08",
            wMissList: "09"
        }
    },
        MH.ev.isCurTwnDomination = function() {
        var e, t, n;
        "end_game_type_domination" == Game.features.end_game_type && 0 != require("data/features").isDominationActive() && (n = Game.townId,
                                                                                                                            n = (e = ITowns.towns[n].getIslandCoordinateX()) + ":" + (t = ITowns.towns[n].getIslandCoordinateY()),
                                                                                                                            0 <= MH.DomIslands.t.indexOf(n) || 0 != MapTiles.isDominationIsland(e, t) && (MH.DomIslands.t.push(n),
    MH.Storage(MH.DomIslandsCookie, MH.DomIslands)))
    }
        ,
        MH.ev.Init = function() {
        $.Observer("map:jump").subscribe("MHmj", function() {
            MH.Symbols(),
                MH.Subtitles(),
                MH.MapGrid(),
                MH.ev.isCurTwnDomination()
        }),
            $.Observer("minimap:load_chunks").subscribe("MHmmlc", MH.SymbolsMini),
            $.Observer("window:tab:rendered").subscribe("MHwtr", function(e, t) {
            var n, i, a;
            try {
                i = (n = t.window_model.attributes).window_type,
                    a = n.tabs[n.activepagenr].type
            } catch (n) {}
            MH.ev.WAR(i, a, "")
        }),
            $.Observer("alliance:join").subscribe("MHain", function(e, t) {
            MH.ev.AllyIN(t.alliance_id)
        }),
            $.Observer("alliance:leave").subscribe("MHaout", function(e, t) {
            MH.ev.AllyOUT()
        }),
            $.Observer("town:town_switch").subscribe("MHTswt", function() {
            mhAddStd.TownIndexWindowRename(),
                MH.Set.unitV && MH.UnitsShowSet(MH.GuiUst.unitV),
                MH.ev.isCurTwnDomination()
        }),
            $.Observer("window:island_quest:reward:stash").subscribe("MHmss", function(e, t) {
            $(MH.MissLst_LastClickTR).remove()
        }),
            $.Observer("window:island_quest:reward:use").subscribe("MHmsu", function(e, t) {
            $(MH.MissLst_LastClickTR).remove()
        }),
            $.Observer("window:island_quest:reward:trash").subscribe("MHmss", function(e, t) {
            $(MH.MissLst_LastClickTR).remove()
        })
    }
        ,
        MH.ev.WAR = function(e, t, n) {
        var i, a, o = {};
        if (_log("try render:" + e + " -> " + t),
            0 != MH.Set.theme && null == MH.ev.FirstInitMap && "map_data" == e && "get_chunks" == t)
            return MH.ev.FirstInitMap = !0,
                void MH.theme.Winter();
        if ("daily_login" != e && !("message" == e && "preview" == t || "alliance_forum" == e && "forum" != t))
            if ("reservation" == e && "index" == t && (e = "alliance",
                                                       t = "reservation"),
                "alliance" == e && "profile" == t && (e += "_" + t),
                "player" == e && "get_profile_html" == t && (e += "_profile"),
                "player" == e && "index" == t && (e += "_" + t),
                "town_group_overviews" == e && "town_group_overview" == t && (e = "town_overviews"),
                "command_info" == e && "conquest_info" == t && (e = "conquwror"),
                "command_info" == e && "conquest_movements" == t && (e = "conquwror_mov"),
                "alliance" != e || "properties" != t)
                if ("player_profile" != e || "profile_edit" != t)
                    if ("notify" == e && "delete" == t && MH.Set.loadCnv && setTimeout(function() {
                        var e = "dupa jas";
                        GPWindowMgr.is_open(GPWindowMgr.TYPE_NOTIFICATION_POPUP) && (e = "notification_popup"),
                            e in MH.ev.wTypes && MH.ev.WAR(e, "index", "")
                    }, 100),
                        "alliance" != e || "world_wonders" != t) {
                        if (e in MH.ev.wTypes) {
                            if (a = MH.ev.wTypes[e],
                                "command_info" == e && "colonization_info" == t && (a = GPWindowMgr.TYPE_COLONIZATION_COMMAND),
                                a < 40) {
                                if ("OwnWnds" != t) {
                                    if (!GPWindowMgr.is_open(a))
                                        return;
                                    if (null == (i = GPWindowMgr.getOpenFirst(a)))
                                        return
                                } else {
                                    if (void 0 === MH.OwnWnds)
                                        return;
                                    if (!MH.OwnWnds.hasOwnProperty(e))
                                        return;
                                    i = MH.OwnWnds[e]
                                }
                                "town_info" == e && (i = GPWindowMgr.getFocusedWindow()),
                                    (o = {
                                    wnd: i,
                                    type: e,
                                    tab: t,
                                    id: a,
                                    rt: n,
                                    idJQ: i.getID(),
                                    wJQt: "?",
                                    cJQt: "DIV#gpwnd_" + i.getID(),
                                    wJQ: i.getJQElement().parent(),
                                    setWidth: function(e) {
                                        this.wnd.setWidth(e)
                                    },
                                    getWidth: function() {
                                        return this.wnd.getWidth()
                                    },
                                    setHeight: function(e) {
                                        this.wnd.setHeight(e)
                                    },
                                    getHeight: function() {
                                        return this.wnd.getHeight()
                                    },
                                    centerVerticaly: function() {
                                        this.wnd.centerWindowVerticaly()
                                    },
                                    getJQCloseButton: function() {
                                        return this.wnd.getJQCloseButton()
                                    }
                                }).jGP = i.getJQElement(),
                                    o.cJQ = $(o.cJQt)
                            } else {
                                if ((i = WM.getWindowByType(e)[0]).length <= 0)
                                    return;
                                (o = {
                                    wnd: i,
                                    type: e,
                                    tab: t,
                                    id: a,
                                    rt: n,
                                    idJQ: i.cid,
                                    wJQt: "#window_" + i.cid,
                                    cJQt: "#window_" + i.cid + " .window_content",
                                    setWidth: function(e) {
                                        this.wnd.setWidth(e)
                                    },
                                    getWidth: function() {
                                        return this.wnd.getWidth()
                                    },
                                    setHeight: function(e) {
                                        this.wJQ.css({
                                            "min-height": "240px",
                                            height: e + "px"
                                        })
                                    },
                                    getHeight: function() {
                                        return this.wJQ.height()
                                    },
                                    centerVerticaly: function() {
                                        var e = $(window).innerHeight()
                                        , t = this.getHeight()
                                        , t = Math.max((e - t) / 2, 0);
                                        this.wJQ.css({
                                            top: t + "px"
                                        })
                                    },
                                    getJQCloseButton: function() {
                                        return this.wJQ.find(".btn_wnd.close")
                                    }
                                }).wJQ = $(o.wJQt),
                                    o.cJQ = $(o.cJQt)
                            }
                            if (_log("_is render:" + e),
                                e in MH.ev.ren && MH.ev.ren[e](o, n),
                                MH.ev.ren.AllWnds(o),
                                _log(o.getHeight()),
                                MH.Set.wRes)
                                switch (e) {
                                    case "notes":
                                    case "message":
                                    case "alliance":
                                    case "alliance_forum":
                                    case "alliance_profile":
                                    case "player_profile":
                                    case "ranking":
                                    case "report":
                                    case "town_overviews":
                                    case "custom_colors":
                                    case "chat":
                                    case "conquest_info":
                                    case "building_wall":
                                    case "AssSymbols":
                                    case "wArrivalTimes":
                                    case "wRepCnv":
                                    case "NotifyWnd":
                                    case "AttacksAlarms":
                                    case "hercules2014":
                                    case "wTownList":
                                    case "wTownOverview":
                                    case "wFarmList":
                                    case "wMissList":
                                        MH.ReSizeAdd(o)
                                }
                            MH.Set.loadCnv && MH.rep.AddButtions(o),
                                "undefined" != typeof DBG && DBG.RNKPL(o.cJQ),
                                "ranking" === e && MH.DB.GetRanking(n, t),
                                0 != MH.utl.ObjLength(MH.DB.needLNG) && MH.Lng.GetFromGame(o.cJQ, e + ":" + t)
                        }
                    } else
                        mhDat.gwondInf(n);
                else
                    $.post(MH.Home + "arcprofile.php", {
                        lw: Game.world_id,
                        player: Game.player_name,
                        bbco: $("#edit_profile_text").val()
                    }, function(e) {});
            else
                $("#ally_profile_save_desc").length && $("#ally_profile_save_desc").attr("onclick", "MH.ev.savAllyProf()")
    }
        ,
        MH.ev.AllyIN = function(e) {
        var t = mhCol.OwnAllyName_FromRemote();
        null != t && (Game.alliance_name = t,
                      (t = MH.LMHData_Get("last")) && (t.dat.a = Game.alliance_name,
                                                       t.Save()))
    }
        ,
        MH.ev.AllyOUT = function() {
        Game.alliance_name = "";
        var e = MH.LMHData_Get("last");
        e && (e.dat.a = "",
              e.Save())
    }
        ,
        MH.ev.savAllyProf = function() {
        $.post(MH.Home + "arcprofile.php", {
            lw: Game.world_id,
            ally: "",
            allyID: Game.alliance_id,
            bbco: $("#ally_profile_textarea").val()
        }, function(e) {}),
            Alliance.saveProfile()
    }
        ,
        MH.ReSizeAdd = function(o) {
        var e;
        MH.Set.wRes && (_log("addsize:" + o.type + " -> " + o.tab),
                        "alliance" == o.type && "auto" == o.getHeight() && o.setHeight(500),
                        MH.Set.wRres && MH.GuiUst.wHeight.hasOwnProperty(o.id) && (isNaN(MH.GuiUst.wHeight[o.id]) && (MH.GuiUst.wHeight[o.id] = 500),
                                                                                   o.setHeight(MH.GuiUst.wHeight[o.id]),
                                                                                   o.centerVerticaly()),
                        MH.ReSizeUpdate(o),
                        (e = void 0 !== o.jGP ? o.jGP.parent().find(".gpwindow_bottom:first") : o.wJQ.find(".wnd_border_b:first")).find("a.button").length || e.append($("<a/>", {
            href: "#",
            class: "button",
            style: "cursor:s-resize; top:3px;"
        }).append($("<div/>", {
            style: "float:left; width:2px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') 0px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:100px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') -2px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:100px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') -2px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:2px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') -102px 0px;"
        }))).mousedown(function(e) {
            if ($(document).mousemove(function(e) {
                MH.mousemove(e)
            }),
                !MH.drag.state)
                return MH.drag.x = e.pageX,
                    MH.drag.y = e.pageY,
                    MH.drag.state = !0,
                    MH.drag.func = function(e, t, n, i) {
                    var a = o.getHeight();
                    isNaN(a) && (a = 500),
                        (i += a) < 240 && (i = 240),
                        i > $(window).height() - 10 && (i = $(window).height() - 10),
                        o.setHeight(i),
                        MH.ReSizeUpdate(o)
                }
                    ,
                    MH.Set.wRres && (MH.drag.endfunc = function() {
                    MH.GuiUst.wHeight[o.id] = o.getHeight(),
                        MH.Storage(MH.GuiUstCookie, MH.GuiUst)
                }
                                    ),
                    !1
        }))
    }
        ,
        MH.ReSizeUpdate = function(e) {
        var t = e.jGP
        , n = e.getHeight();
        switch (e.type) {
            case "notes":
                e.cJQ.find(".notes_container").height(n - 80),
                    e.cJQ.find("textarea").length ? e.cJQ.find("textarea").height(n - 123) : e.cJQ.find(".preview_box").height(n - 101);
                break;
            case "message":
                t.find("#announcement_list").css("height", n - 100 + "px"),
                    t.find("#message_messages .game_border:first").css("height", n - 100 + "px"),
                    t.find("#message_messages .game_list:first").css("height", n - 100 - 81 + "px"),
                    t.find("#message_new_message").css("height", n - 100 - 160 + "px"),
                    t.find("#message_message_list .game_border:first").css("height", n - 77 + "px"),
                    t.find("#message_forward_body #message_message").css("height", n - 260 + "px"),
                    t.find(".game_list.inner_recipient_list").css("height", n - 200 + "px"),
                    t.find("#message_report_affront").css("height", n - 450 + "px");
                break;
            case "alliance":
                t.find("#ally_invite_members").css("top", n - 130 + "px"),
                    t.find("#ally_events .game_list").css("max-height", n - 220 + "px"),
                    $("#MH_styleTMP").length || $("head").append('<style id="MH_styleTMP" type="text/css">#ally_events .game_list {max-height:280px; overflow-y:auto;}</style>'),
                    $("#MH_styleTMP").text("#ally_events .game_list {max-height:" + (n - 220) + "px; overflow-y:auto;}"),
                    t.find("#ally_members_body").css("max-height", n - 133 + "px"),
                    t.find("#alliance_properties_wrapper").css("height", n - 100 + "px"),
                    t.find("#ally_flags .game_body").css("max-height", n - 129 + "px"),
                    t.find("#tab_ally_pact_list").css("height", n - 162 + "px"),
                    t.find("#tab_ally_pact_invitations").css("height", n - 162 + "px"),
                    t.find("#tab_ally_enemies").css("height", n - 162 + "px"),
                    t.find("#tab_ally_pact_list .game_list").css("height", n - 162 + "px"),
                    t.find("#tab_ally_pact_invitations .game_list").css("height", n - 162 + "px"),
                    t.find("#tab_ally_enemies .game_list").css("height", n - 162 + "px"),
                    t.find(".reservation_tool .gp_tab_page").css({
                    height: n - 189 + "px",
                    overflow: "auto"
                }),
                    t.find("#ally_finder_text tbody").css("height", n - 199 + "px");
                break;
            case "alliance_forum":
                n -= e.wJQ.find(".menu_wrapper").height() - 22,
                    e.cJQ.find("#forum").css("height", n - 90 + "px"),
                    e.cJQ.find("#content.forum_content").css("height", n - 100 + "px"),
                    e.cJQ.find("#forum_admin").css("height", n - 90 + "px");
                break;
            case "alliance_profile":
                t.find("#ally_profile").css("max-height", n - 298 + "px"),
                    t.find("#ally_towns .members_list").css("height", n - 92 + "px"),
                    t.find("#ally_towns .members_list").css("max-height", n - 92 + "px");
                break;
            case "player_profile":
                t.find("#player_awards").css("bottom", "0px"),
                    t.find("#player_towns .game_list").css("max-height", n - 340 - 49 + "px"),
                    t.find("#player_profile").css("max-height", n - 210 + "px");
                break;
            case "ranking":
                n -= e.wJQ.find(".menu_wrapper").height() - 22,
                    e.cJQ.find(".ranking_table_body").css("max-height", n - 74 + "px"),
                    e.cJQ.find("#ranking_table_wrapper").css("max-height", n - 74 - 55 + "px");
                break;
            case "report":
                t.find("#report_reports .game_border").css("height", n - 95 + "px"),
                    t.find("#report_reports .game_list").css("height", n - 174 + "px"),
                    t.find("#resource_transport_report_form .game_border").css("height", n - 95 + "px"),
                    t.find("#report_report .report_units_overview").css("height", n - 201 + "px");
                break;
            case "town_overviews":
                e.wJQ.find("div.gpwindow_content.fullwindow").css("bottom", "11px"),
                    e.cJQ.find("#command_overview").css("height", n - 151 + "px"),
                    e.cJQ.find("#recruit_town_list").css("height", n - 255 + "px"),
                    e.cJQ.find("#town_units_overview").css("height", n - 105 + "px"),
                    e.cJQ.find("#outer_troops_list").css("max-height", n - 143 + "px"),
                    e.cJQ.find("#building_overview_table_wrapper").css("max-height", n - 180 + "px"),
                    e.cJQ.find("#culture_overview_wrapper").css("height", n - 175 + "px"),
                    e.cJQ.find("#gods_overview_wrapper").css("height", n - 245 + "px"),
                    e.cJQ.find("#hides_overview_wrapper").css("height", n - 80 + "px"),
                    e.cJQ.find(".group_list_scroll_border").css("height", n - 242 + "px"),
                    e.cJQ.find("#townsoverview_table_wrapper").css("max-height", n - 180 + "px");
                break;
            case "custom_colors":
                break;
            case "grepolis_score":
                e.cJQ.find(".scroll_viewport").css("height", n - 235 + "px"),
                    _log("resize" + n);
                break;
            case "wArrivalTimes":
                e.cJQ.find("#citys_info_table_scroll").parent().css("height", n - 238 + "px");
                break;
            case "wRepCnv":
                e.cJQ.find(".game_border:first").css("height", n - 69 + "px"),
                    e.cJQ.find("ul.game_list:first").css("height", n - 126 + "px");
                break;
            case "conquest_info":
                e.cJQ.find(".conquest_info_wrapper").css("height", n - 110 + "px");
                break;
            case "building_wall":
                e.cJQ.find(".game_list").css("max-height", n - 114 + "px");
                break;
            case "AttacksAlarms":
                e.cJQ.find("#AttacksAlarms_table_wrapper").css("max-height", n - 198 + "px");
                break;
            case "wTownList":
            case "wMissList":
                n -= e.wJQ.find(".menu_wrapper").height() - 40,
                    e.cJQ.find(".ranking_table_body").css("max-height", n - 74 + "px"),
                    e.cJQ.find("#ranking_table_wrapper").css("max-height", n - 74 - 55 + "px");
                break;
            case "wFarmList":
                n -= e.wJQ.find(".menu_wrapper").height() - 30,
                    e.cJQ.find(".ranking_table_body").css("max-height", n - 74 + "px"),
                    e.cJQ.find("#ranking_table_wrapper").css("max-height", n - 74 - 55 + "px")
        }
    }
        ,
        MH.ev.ren.AllWnds = function(e) {
        e.cJQ.find("a.bbcodes_url").mouseover(function() {
            this.style.color = "#8080FF"
        }).mouseout(function() {
            this.style.color = "#4040D0"
        }),
            MH.Set.RD && e.cJQ.find("a.bbcodes.bbcodes_url").each(function(e, t) {
            0 <= (e = (t = $(this).attr("href")).indexOf("redirect?url=")) && (t = t.substr(e + 13)),
                t = $(this).attr("href", decodeURIComponent(t))
        }),
            MH.Set.AL && "colors_table" != e.type && e.cJQ.find("a").each(function(e, t) {
            if ("1" != $(this).attr("MHMfl")) {
                var n = $(this).attr("onclick");
                if (void 0 !== n && !1 !== n) {
                    var i = !1;
                    if (0 <= n.indexOf("Forum") && (i = !0),
                        n = i ? n.replace(/Forum\.openAllianceProfile\((.*?),(.*?)\)/gi, "$2") : n.replace(/Layout\.allianceProfile\.open\((.*?),(.*?)\)/gi, "$2"),
                        n = parseInt(n),
                        isNaN(n))
                        return;
                    var a = MH.col.cAllyCustom;
                    n == Game.alliance_id && (a = MH.col.cAllyOwn),
                        0 <= MH.col.AllyEnemy.indexOf(n) && (a = MH.col.cAllyEnemy),
                        0 <= MH.col.AllyFriend.indexOf(n) && (a = MH.col.cAllyFriend),
                        $(this).before($("<div/>", {
                        class: "flag town MHbbcADD",
                        style: "overflow:unset; height:10px; left:-4px; margin-left:4px; position:relative; display:inline-block; background-color:" + a + ";"
                    }).html("<div style=\"left:-2px; top:-2px; position:absolute; width:14px; height:16px; background-image:url('https://grmh.pl/gui/aflag.png');\"></div>")),
                        i && $(this).css({
                        background: "none",
                        "padding-left": "4px"
                    }),
                        (t = $(this).parent()).hasClass("bbcodes_ally") && t.css({
                        background: "none",
                        "padding-left": "4px"
                    }),
                        t.find(".MH_aFlag").remove()
                }
                $(this).attr("MHMfl", "1")
            }
        }),
            "AssSymbols" != e.type && MH.Set.WS && (e.cJQ.find(".bbcodes_player").each(function(e, t) {
            var n;
            "1" != $(this).attr("MHM") && ((n = MH.utl.bbcodes_player_id($(this))) && n in MH.GuiUst.SymPlay && $(this).before($("<div/>", {
                class: "PlaySymIco MHbbcADD",
                id: n,
                style: "float:unset; display:inline-table; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymPlay[n].x + "px -" + MH.GuiUst.SymPlay[n].y + "px"
            })),
                                           $(this).attr("MHM", "1"))
        }),
                                                    "report" != e.type && e.cJQ.find("a.gp_player_link").each(function(e, t) {
            var n;
            "1" != $(this).attr("MHM") && ($(this).find("a.bbcodes_player:first").length || (n = MH.utl.gp_player_link_id($(this))) && n in MH.GuiUst.SymPlay && $(t).before($("<spam/>", {
                class: "PlaySymIco MHbbcADD",
                id: n,
                style: "float:unset; left:-4px; margin-left:4px; position:relative; display:inline-block; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymPlay[n].x + "px -" + MH.GuiUst.SymPlay[n].y + "px"
            })),
                                           $(this).attr("MHM", "1"))
        }))
    }
        ,
        MH.ev.ren.town_info = function(e, t) {
        switch (e.tab) {
            case "attack":
            case "support":
            case "info":
            case "info":
                return MH.ev.ren.towninfo_info(e, t);
            case "god":
                return MH.ev.ren.Spell(e, !0);
            case "cast":
                return MH.ev.ren.SpellCast(e, !0);
            case "trading":
                return MH.ev.ren.towninfo_trading(e, t)
        }
    }
        ,
        MH.ev.ren.towninfo_trading = function(n, e) {
        var t = n.cJQ;
        function i(e, t, n) {
            var i = {};
            return i.wnd = $("DIV#gpwnd_" + t),
                i.selector = i.wnd.find("#town_capacity_" + e),
                i.caption = {
                curr: parseInt(i.wnd.find("#big_progressbar .caption .curr").html()),
                max: parseInt(i.wnd.find("#big_progressbar .caption .max").html()),
                now: parseInt(i.wnd.find("#trade_type_" + e + " input").val())
            },
                i.amounts = {
                curr: parseInt(i.selector.find(".curr").html()) || 0,
                curr2: parseInt(i.selector.find(".curr2").html().substring(3)) || 0,
                curr3: parseInt(i.selector.find(".curr3").html().substring(3)) || 0,
                max: parseInt(i.selector.find(".max").html()) || 0
            },
                "cult" !== n && "cultreverse" !== n || (i.amounts.max = "stone" === e ? 18e3 : 15e3),
                "cultreverse" === n ? (e = $("div#ui_box div.ui_resources_bar div.indicator[data-type='" + e + "'] div.amount").text(),
                                       i.needed = e - i.amounts.max) : i.needed = i.amounts.max - i.amounts.curr - i.amounts.curr2,
                i
        }
        0 < t.find(".q_needed").length || 0 == t.find(".town-capacity-indicator").length || (t.find(".tripple-progress-progressbar").each(function() {
            var e = this.id.split("_")[2]
            , t = i(e, n.idJQ);
            $(this).find(".amounts").append('<span class="q_needed_' + e + "_" + n.idJQ + '"> &#9658; ' + t.needed + "</span>")
        }),
                                                                                             t.find("#trade_tab").append('<a id="q_wood_' + n.idJQ + '_max" class="q_trade q_max" style="top:200px" href="#"></a><a id="q_stone_' + n.idJQ + '_max" class="q_trade q_max" style="top:234px" href="#"></a><a id="q_iron_' + n.idJQ + '_max" class="q_trade q_max" style="top:268px" href="#"></a><a id="q_wood_' + n.idJQ + '_cult" class="q_trade q_send_cult" style="top:200px" href="#"></a><a id="q_stone_' + n.idJQ + '_cult" class="q_trade q_send_cult" style="top:234px" href="#"></a><a id="q_iron_' + n.idJQ + '_cult" class="q_trade q_send_cult" style="top:268px" href="#"></a><a id="q_wood_' + n.idJQ + '_cultreverse" class="q_trade q_send_cult_reverse" style="top:200px" href="#"></a><a id="q_stone_' + n.idJQ + '_cultreverse" class="q_trade q_send_cult_reverse" style="top:234px" href="#"></a><a id="q_iron_' + n.idJQ + '_cultreverse" class="q_trade q_send_cult_reverse" style="top:268px" href="#"></a>'),
                                                                                             t.find(".q_send_cult").css({
            right: "84px",
            position: "absolute",
            height: "16px",
            width: "22px",
            "background-image": "url('" + MH.Home + "gui/trade_cult.png')",
            "background-repeat": "no-repeat",
            "background-position": "0px -1px"
        }),
                                                                                             t.find(".q_send_cult_reverse").css({
            left: "105px",
            position: "absolute",
            height: "16px",
            width: "22px",
            "background-image": "url('" + MH.Home + "gui/trade_cultR.png')",
            "background-repeat": "no-repeat",
            "background-position": "0px -1px"
        }),
                                                                                             t.find(".q_max").css({
            right: "105px",
            position: "absolute",
            height: "16px",
            width: "22px",
            "background-image": "url('" + MH.Home + "gui/trade_arrow.png')",
            "background-repeat": "no-repeat",
            "background-position": "0px -1px"
        }),
                                                                                             t.find(".q_trade").hover(function() {
            $(this).css({
                "background-position": "0px -17px"
            })
        }, function() {
            $(this).css({
                "background-position": "0px -1px"
            })
        }),
                                                                                             t.find(".q_trade").click(function() {
            var e = this.id.split("_")
            , t = i(e[1], e[2], e[3]);
            t.needed - t.amounts.curr3 <= 0 || t.caption.curr <= 0 || 0 < t.amounts.curr3 ? t.send = 0 : t.needed - t.amounts.curr3 > t.caption.curr ? t.send = t.caption.curr + t.amounts.curr3 : t.send = t.needed,
                t.wnd.find("#trade_type_" + e[1] + " input").val(t.send).select().blur()
        }))
    }
        ,
        MH.ev.ren.command_info = function(e, t) {
        switch (e.tab) {
            case "info":
                return MH.ev.ren.commandinfo_info(e);
            case "god":
                return MH.ev.ren.Spell(e, !1);
            case "cast":
                return MH.ev.ren.SpellCast(e, !1);
            case "conquest_info":
                return MH.ev.ren.commandinfo_conquest_info(e);
            case "conquest_movements":
                return MH.ev.ren.commandinfo_conquest_movements(e)
        }
    }
        ,
        MH.ev.ren.report = function(e) {
        switch (e.tab) {
            case "index":
                return MH.ev.ren.report_index(e);
            case "view":
                return MH.ev.ren.report_view(e, !0)
        }
    }
        ,
        MH.ev.ren.Spell_MultiCast = ["divine_sign", "kingly_gift", "underworld_treasures", "wedding", "patroness", "natures_gift"],
        MH.ev.ren.Spell_spell_last = null,
        MH.ev.ren.Spell_spell_num = 0,
        MH.ev.ren.Spell_rspell_num = 0,
        MH.ev.ren.Spell_rspell_last = null,
        MH.ev.ren.Spell_cast = function(e, t, n, i) {
        if (i < 2)
            MH.ev.ren.Spell_spell_last == t ? MH.ev.ren.Spell_spell_num++ : MH.ev.ren.Spell_spell_num = 1,
                MH.ev.ren.Spell_spell_last = t,
                e.sendMessage("castPower", t, n, !0);
        else {
            for (MH.ev.ren.Spell_spell_last = t,
                 MH.ev.ren.Spell_spell_num = i; 0 < i; )
                i--,
                    e.sendMessage("castPower", t, n, !0);
            $(e).remove()
        }
    }
        ,
        MH.ev.ren.Spell = function(e, n) {
        var t, i, a, o, r, l, s, d, p, c, m = e.jGP, u = "DIV#gpwnd_" + e.idJQ + " ", g = e.wnd;
        for (r in MH.ev.ren.Spell_spell_last = null,
             MH.ev.ren.Spell_spell_num = 0,
             c = 1 == n ? (l = JSON.parse(e.rt).json,
                           (l = JSON.parse(l.menu))["town_info-god"].obj.id) : (c = m.find(".towninfo_gods").attr("class")).substr(c.indexOf("target_") + 7, c.length),
             m.find(".towninfo_gods").length && m.find(".towninfo_gods").addClass("town_cast_spell_content"),
             n || g.setWidth(500),
             7 == Object.entries(GameData.gods).length && g.setHeight(502),
             n ? $(u).append($("<div/>", {
            class: "town_cast_spell_oldcontent",
            style: "position:absolute; left:40px;"
        })) : $(u).append($("<div/>", {
            class: "town_cast_spell_oldcontent"
        })),
             (1 == MH.Set.Vspell ? m.find(".spells_dialog") : m.find(".town_cast_spell_oldcontent")).hide(),
             Game.constants.gods)
            if (Game.constants.gods.hasOwnProperty(r)) {
                for (a in d = Game.constants.gods[r],
                     t = $("<div/>", {
                    class: "powers_for_god",
                    style: "position:relative; left:110px; top:-54px; width:204px; height:54px;"
                }),
                     i = $("<div/>", {
                    style: "position:relative; left:110px; top:-70px; width:204px; height:12px;"
                }),
                     mhCNST.GodsPowers[d])
                    mhCNST.GodsPowers[d].hasOwnProperty(a) && (s = mhCNST.GodsPowers[d][a],
                                                               l = "",
                                                               "cleanse" != s && 1 == n && 0 <= mhCNST.OnlyAttackPowers.indexOf(s) && (l = " disabled"),
                                                               "cleanse" != s && 0 == n && mhCNST.OnlyAttackPowers.indexOf(s) < 0 && (l = " disabled"),
                                                               (o = "") != l && (o = "opacity:0.5;"),
                                                               t.append($("<a/>", {
                        class: "choose_power" + l + " towninfo_god_power power_icon45x45 " + mhCNST.GodsPowers[d][a],
                        style: o + " margin:0 3px;",
                        use: l,
                        pid: s,
                        href: "#"
                    }).click(function() {
                        var e, t = $(this).attr("pid");
                        l = "",
                            1 == n && -1 < MH.ev.ren.Spell_MultiCast.indexOf(t) && (0 == (e = m.find(".town_cast_spell_oldcontent .nfo_power_" + t).html()).indexOf("x") && 1 < (e = e.substr(1, e.lenght)) && (l = '<a class="button" href="#" onclick="MH.ev.ren.Spell_cast(w(this),\'' + t + "'," + Game.townId + "," + e + ');"><span class="left"><span class="right"><span class="middle">' + DM.getl10n("context_menu", "titles").inventory_use + " x" + e + '</span></span></span><span style="clear:both;"></span></a>')),
                            m.find(".town_cast_spell_oldcontent #towninfo_description").empty().hide().html('<div><div class="towninfo_power_image power_icon86x86 ' + t + '" id="' + t + '"></div><h4>' + GameData.powers[t].name + "</h4><p>" + GameData.powers[t].description + '</p><p class="small">' + GameData.powers[t].effect + "</p><p>" + DM.getl10n("barracks").cost_details.favor + ": " + GameData.powers[t].favor + '</p><a class="button" href="#" onclick="MH.ev.ren.Spell_cast(w(this),\'' + t + "'," + c + ',1);"><span class="left"><span class="right"><span class="middle">' + DM.getl10n("context_menu", "titles").inventory_use + '</span></span></span><span style="clear:both;"></span></a>' + l + "</div></div>").fadeIn("slow")
                    })),
                                                               i.append($("<div/>", {
                        class: "nfo_power_" + s,
                        style: "text-shadow: 1px 1px 1px black; font-size:12px; width:45px; text-align:right; display:inline-block; " + o + " margin:0 3px;"
                    }).html(" ")));
                o = "height:63px;",
                    0 == (p = MM.checkAndPublishRawModel("PlayerGods", {
                    id: Game.player_id
                }).getCurrentProductionOverview()[d]).production && (o += " opacity:0.5;"),
                    m.find(".town_cast_spell_oldcontent").append($("<div/>", {
                    style: o
                }).append($("<div/>", {
                    style: "width:100px; height:63px;"
                }).append('<a href="#" class="favor" god="' + d + '" onclick="TempleWindowFactory.openTempleWindow();"><span class="god_mini ' + d + '" style="position:relative; left:-30px;"></span><span class="god_favor_icon" style="display:block; position:relative; top:-55px; left:34px; width:28px; background-image:url(\'https://grmh.pl/gui/favor.png\');">&nbsp;</span><span class="god_favor_text" style="position:relative; left:40px; top:-44px;">' + p.current + "</span></a>")).append(t).append(i))
            }
        m.find(".town_cast_spell_oldcontent").append('<div id="towninfo_description" style="left:320px;"><span class="bold">' + DM.getl10n("town_window", "cast_spell").header + "</span></div>"),
            $(u).append(mhGui.But(13, "position:absolute; right:0; bottom:0; margin:0 0 0 0;").click(function() {
            MH.Set.Vspell ? (m.find(".spells_dialog").show(),
                             m.find(".town_cast_spell_oldcontent").hide(),
                             MH.Set.Vspell = !1) : (m.find(".spells_dialog").hide(),
                                                    m.find(".town_cast_spell_oldcontent").show(),
                                                    MH.Set.Vspell = !0),
                MH.Storage(MH.SetCookie, MH.Set)
        })),
            e.rt = '{"json":{"success":"ok"}}',
            MH.ev.ren.SpellCast(e, n)
    }
        ,
        MH.ev.ren.SpellCast = function(e, t) {
        var n = e.jGP;
        e.idJQ,
            e.wnd;
        if ($.each(n.find(".town_cast_spell_oldcontent a.favor"), function(e, t) {
            e = $(this).attr("god");
            var n = MM.checkAndPublishRawModel("PlayerGods", {
                id: Game.player_id
            }).getCurrentProductionOverview()[e];
            0 != n.production && (e = "0px",
                                  0 == n.current && (e = "-110px"),
                                  500 == n.current && (e = "-55px"),
                                  $(this).css({
                background: 'url("' + MH.Home + 'medias/images/bg-favor.png") no-repeat scroll 0 ' + e + " rgba(0,0,0,0)"
            }),
                                  e = "#fc6",
                                  400 <= n.current && (e = "#FF8000"),
                                  490 <= n.current && (e = "#FF0000"),
                                  $(this).find(".god_favor_text").css({
                color: e
            }).html(n.current))
        }),
            $.each(n.find(".town_cast_spell_oldcontent a.choose_power.towninfo_god_power"), function(e, t) {
            t = $(this).attr("pid");
            var n = GameData.powers[t]
            , i = MM.checkAndPublishRawModel("PlayerGods", {
                id: Game.player_id
            }).getCurrentProductionOverview()[n.god_id];
            0 != i.production && (" disabled" != $(this).attr("use") && $(this).removeClass("disabled"),
                                  e = Math.floor(i.current / n.favor),
                                  t = $(this).parent().parent().find(".nfo_power_" + t),
                                  0 < e ? t.css({
                color: "#00FF00",
                "font-size": "12px",
                "text-shadow": "1px 1px 1px black"
            }).html("x" + e) : ($(this).addClass("disabled"),
                                t.countdown("destroy"),
                                t.css({
                color: "#FF0000",
                "font-size": "9px",
                "text-shadow": "none"
            }).html("x" + e),
                                t.countdown(Timestamp.server() + (n.favor - i.current) / i.production * 60 * 60)))
        }),
            1 == MH.Set.Vspell) {
            var i = JSON.parse(e.rt).json;
            if (i.success) {
                var a = null;
                if (i.report_id)
                    a = i.report_id;
                else if (i.notifications)
                    for (var o in i.notifications)
                        if (i.notifications[o].type && "newreport" == i.notifications[o].type) {
                            a = i.notifications[o].param_id;
                            break
                        }
                null != a && (e = DM.getl10n("town_window", "cast_spell").view_report,
                              -1 < MH.ev.ren.Spell_MultiCast.indexOf(MH.ev.ren.Spell_spell_last) && 2 <= MH.ev.ren.Spell_spell_num && (e += " x" + MH.ev.ren.Spell_spell_num),
                              n.find(".town_cast_spell_oldcontent #power_casted").remove(),
                              n.find(".town_cast_spell_oldcontent #towninfo_description").append($("<div/>", {
                    id: "power_casted",
                    style: "display: block; position:unset; text-align:left;"
                }).append($("<a/>", {
                    href: "#"
                }).html(e).click(function() {
                    -1 < MH.ev.ren.Spell_MultiCast.indexOf(MH.ev.ren.Spell_spell_last) && 2 <= MH.ev.ren.Spell_spell_num && (MH.ev.ren.Spell_rspell_last = MH.ev.ren.Spell_spell_last,
                                                                                                                             MH.ev.ren.Spell_rspell_num = MH.ev.ren.Spell_spell_num),
                        hOpenWindow.viewReport(a)
                }))),
                              n.find(".town_cast_spell_oldcontent #towninfo_description").show())
            }
        }
    }
        ,
        MH.ev.ren.report_index = function(e) {
        var i = e.jGP;
        e.idJQ,
            e.wnd;
        switch (MH.Set.repFT) {
            default:
                MH.Set.repFT;
            case "attacks":
            case "support":
            case "espionage":
            case "divine_powers":
            case "alliance":
            case "reservations":
            case "world_wonders":
            case "misc":
        }
        function t(e, t, n) {
            n = 8 == t ? "-3px 180px 0 0" : "-3px 0 0 0";
            t = e == MH.Set.repFT ? "-" + 22 * t + "px 0;" : "-" + 22 * t + "px -22px;",
                i.find("#folder_toggle_menu").append($("<a/>", {
                href: "#",
                class: "button",
                style: "float:right; margin:" + n + "; display:block; width:22px; height:22px; background:url('" + MH.Home + "gui/repFilter.gif') repeat scroll " + t
            }).click(function() {
                $('#dd_filter_type_list .item-list .option[name="' + e + '"]').click()
            }))
        }
        $("#dd_filter_type_list .item-list .option").each(function(e, t) {
            $(t).click(function() {
                MH.Set.repFT = $(this).attr("name"),
                    MH.Storage(MH.SetCookie, MH.Set)
            })
        }),
            JSON.parse(e.rt).json.data.filter_type == MH.Set.repFT ? (t("misc", 8),
                                                                      t("world_wonders", 7),
                                                                      t("reservations", 6),
                                                                      t("alliance", 5),
                                                                      t("divine_powers", 4),
                                                                      t("espionage", 3),
                                                                      t("support", 2),
                                                                      t("attacks", 1),
                                                                      t("all", 0)) : $('#dd_filter_type_list .item-list .option[name="' + MH.Set.repFT + '"]').click()
    }
        ,
        MH.ev.ren.report_view = function(e) {
        var n, i = e.jGP, a = "DIV#gpwnd_" + e.idJQ + " ", o = (e.idJQ,
                                                                e.wnd);
        if (1 < MH.ev.ren.Spell_rspell_num && -1 < MH.ev.ren.Spell_MultiCast.indexOf(MH.ev.ren.Spell_rspell_last) && i.find("#report_arrow").length && "powers" == i.find("div#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1") && (n = i.find("div#report_power_symbol").attr("class").replace(/power_icon86x86 (.*)/, "$1"),
    MH.ev.ren.Spell_rspell_last == n)) {
            switch (n) {
                default:
                    i.find(".res_background>span").each(function(e, t) {
                        n = parseInt($(t).html().clear()),
                            n *= MH.ev.ren.Spell_rspell_num,
                            $(t).html(n)
                    });
                    break;
                case "divine_sign":
                case "patroness":
                    i.find("#right_side div.report_unit").each(function(e, t) {
                        n = parseInt($(t).find("span.place_unit_white").html().clear()),
                            n *= MH.ev.ren.Spell_rspell_num,
                            $(t).find("span.place_unit_white").html(n),
                            $(t).find("span.place_unit_black").html(n)
                    })
            }
            n = i.find("div#left_side h4").html(),
                n += " x" + MH.ev.ren.Spell_rspell_num,
                i.find("div#left_side h4").html(n)
        }
        MH.ev.ren.Spell_rspell_last = null,
            MH.ev.ren.Spell_rspell_num = 0,
            MH.Set.showCnvRep ? (n = "unknow",
                                 i.find("#report_arrow").length ? ("attack" == (n = i.find("div#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1")) && i.find("div.support_report_summary").length && (n = "attack_support"),
                                                                   0 < n.indexOf("espionage") && (n = "espionage")) : (n = "otherTxt",
                                                                                                                       i.find("div.report_unit").length && (n = "otherUni")),
                                 e = MH.rep.Generate(e.type, n, !1),
                                 null != (e = MH.BBCode2HTML(e)) && "" != e && ($(a + "#report_game_body").hide(),
                                                                                $(a + "#report_report_header").after($("<div/>", {
            class: "game_body",
            style: "width: 745px;"
        }).html("<br>" + e + "<br><br>")),
                                                                                MH.ReportsView(a + "#report_report .game_border .game_body"))) : $(a + "#report_report div.game_list_footer").ready(function() {
            if ($(a + "#report_arrow").length && MH.Set.unitsCost && (i.find("#resources p").remove(),
                                                                      i.find("#resources table").remove(),
                                                                      i.find(".report_booty_bonus_fight table").remove(),
                                                                      !i.find("#mhUnRes").length)) {
                var e, t = i.find("div#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1");
                switch (0 < i.find("div.support_report_cities").length && (t = "attack_support"),
                        t) {
                    case "attack_support":
                        o.setHeight(540);
                    case "attack":
                    case "take_over":
                    case "breach":
                        0 < i.find("div.report_booty_bonus_fight").length && ((e = {
                            att: {},
                            def: {}
                        }).att = MH.htm.UnitsRes(a + "div.report_side_attacker_unit"),
                                                                              e.def = "attack_support" != t ? MH.htm.UnitsRes(a + "div.report_side_defender_unit") : MH.htm.UnitsRes(a + "div.support_report_summary .report_side_defender_unit"),
                                                                              $(i.find("div.report_booty_bonus_fight")[0]).append($("<table/>", {
                            id: "mhUnRes",
                            style: "width:100%;font-size:12px"
                        }).append($("<tr><td><hr></td><td><hr></td><td><hr></td></tr>")).append($("<tr/>", {
                            style: "height:16px; padding:0px;"
                        }).append('<td align="right" width="45%">' + e.att.w + "</td>").append('<td><img src="' + MH.Home + 'medias/images/rwood.png"/></td>').append('<td align="left" width="45%">' + e.def.w + "</td>")).append($("<tr/>", {
                            style: "height:16px;padding:0px;"
                        }).append('<td align="right">' + e.att.s + "</td>").append('<td><img src="' + MH.Home + 'medias/images/rstone.png"/></td>').append('<td align="left">' + e.def.s + "</td>")).append($("<tr/>", {
                            style: "height:16px;padding:0px;"
                        }).append('<td align="right">' + e.att.i + "</td>").append('<td><img src="' + MH.Home + 'medias/images/riron.png"/></td>').append('<td align="left">' + e.def.i + "</td>")).append($("<tr/>", {
                            style: "height:16px; padding:0px;"
                        }).append('<td align="right">' + e.att.p + "</td>").append('<td><img src="' + MH.Home + 'medias/images/rpopu.png"/></td>').append('<td align="left">' + e.def.p + "</td>")).append($("<tr/>", {
                            style: "height:16px; padding:0px;"
                        }).append('<td align="right">' + e.att.f + "</td>").append('<td><img src="' + MH.Home + 'medias/images/rfavor.png"/></td>').append('<td align="left">' + e.def.f + "</td>"))))
                }
            }
        })
    }
        ,
        MH.ev.ren.building_barracks = function(e) {
        MH.ev.ren.building_docks(e)
    }
        ,
        MH.ev.ren.building_docks = function(t) {
        t.jGP;
        var n, i, a, o, r, l = "DIV#gpwnd_" + t.idJQ + " ", s = (t.wnd,
                                                                 null);
        $(l + "#sword").length && (s = "fertility_improvement"),
            $(l + "#big_transporter").length && (s = "call_of_the_ocean"),
            null != s && (i = n = "",
                          o = GameData.powers[s],
                          r = MM.checkAndPublishRawModel("PlayerGods", {
            id: Game.player_id
        }).getCurrentProductionOverview()[o.god_id],
                          e = "",
                          0 == r.production ? (i = " opacity:0.5;",
                                               n = " disabled") : (0 < (a = Math.floor(r.current / o.favor)) ? e = $("<div/>", {
            class: "nfo_power_" + s,
            style: "color:#00FF00;"
        }).html("x" + a) : (n = " disabled",
                            e = $("<div/>", {
            class: "nfo_power_" + s,
            style: "color:#FF0000;"
        }).html("x" + a),
                            e.countdown(Timestamp.server() + (o.favor - r.current) / r.production * 60 * 60)),
                                                                   e.css({
            float: "right",
            position: "relative",
            top: "60px",
            "font-size": "18px",
            "text-shadow": "1px 1px 1px black"
        })),
                          $(l + "#unit_order div#units #HMolePower").length && $(l + "#unit_order div#units #HMolePower").remove(),
                          $("<div/>", {
            id: "HMolePower",
            class: "towninfo_power_image" + n + " power_icon86x86 " + s,
            style: "cursor:pointer;" + i
        }).click(function() {
            gpAjax.ajaxPost("town_info", "cast", {
                power: s,
                id: Game.townId
            }, !1, function(e) {
                MH.ev.ren.building_barracks(t)
            })
        }).append(e).appendTo(l + "#unit_order div#units"))
    }
        ,
        MH.ev.ren.building_temple = function(e) {
        e.jGP;
        $.each($("a.choose_power.towninfo_god_power div[name=GMHTcnt]"), function(e, t) {
            $(t).remove()
        }),
            "none" == $("#temple_favor_bar").css("display") && $("#temple_gods").css({
            top: "323px"
        }),
            $.each($('a[id^="temple_"]'), function(e, t) {
            var n = MM.checkAndPublishRawModel("PlayerGods", {
                id: Game.player_id
            }).getCurrentProductionOverview()[$(this).attr("rel")];
            $(this).append($("<div/>", {
                style: "margin-top:60px; color:#000080; text-shadow: 1px 1px 1px white; font-size:11px;",
                name: "GMHTcnt"
            }).html("<center>" + n.production + " /h</center>"))
        })
    }
        ,
        MH.ev.ren.building_main = function(e) {
        e.jGP;
        e.jGP.find("#buildings>div").each(function(e, t) {
            var n = $(t).attr("id").replace("building_main_", "");
            (t = $(this).find(".building>.image")).css("background-image", ""),
                t.addClass("building_icon40x40 " + n)
        })
    }
        ,
        MH.ev.ren.message = function(e) {
        var t, a, n, i, o, r, l;
        "new" != e.tab && "view" != e.tab && "forward" != e.tab && "index" != e.tab && "default" != e.tab || (1 == mhCol.LoadedAllys ? 1 == mhCol.LoadedPlays ? (t = e.jGP,
    e.idJQ,
    e.wnd,
    t.find("#message_message_list .game_border").css({
            width: "772px",
            left: "12px"
        }),
    MH.ReportsView(".message_post_content"),
    MH.YouTubeLinks(t),
    $("#message_bbcodes").length && (i = "",
                                     t.find("#message_new_message").length ? (i = "#message_new_message",
                                                                              "ffx" == MH.bro && $("#btn_message_sent").unbind().bind("click", function() {
            MH.SavP(t.find("#message_new_message")),
                Message.create("new", !0)
        })) : t.find("#message_reply_message").length ? (t.find("#message_reply_message").css("width", "754px"),
                                                         i = "#message_reply_message",
                                                         "ffx" == MH.bro && ($(i).next().attr("onclick", ""),
                                                                             $(i).next().unbind().bind("click", function() {
            MH.SavP(t.find("#message_reply_message")),
                Message.create("reply", !1)
        }))) : t.find("#message_message").length,
                                     "" != i && MH.bbCodeButtions(e, i)),
    e.cJQ.find("#message_list").length && (e.cJQ.find("#message_list>li>.message_date>a.gp_player_link").each(function() {
            MH.AddPlayerAlly($(this))
        }),
                                           e.cJQ.find("#message_list>li>.message_subject").css("width", "300px")),
    e.cJQ.find("#message_message_list #message_partner").length && MH.AddPlayerAlly(e.cJQ.find("#message_message_list #message_partner a.gp_player_link")),
    n = ".message_post_container",
    (i = e.jGP.find(".message_post_container")).length && (MH.Set.MesFor && (i.each(function() {
            var e = $(this);
            e.children().each(function() {
                e.prepend(this)
            })
        }),
                                                                             MH.ev.ren.message_scroll = !0,
                                                                             MH.ev.ren.message_scrolldown(),
                                                                             i.scroll(function(e) {
            0 != MH.drag.mouse_down && (MH.ev.ren.message_scroll = !1)
        }),
                                                                             e.jGP.find(".message_post_container").length && document.getElementById("message_post_container").addEventListener("wheel", function() {
            MH.ev.ren.message_scroll = !1
        }),
                                                                             i.find(".message_poster_id .affront_dialog.message_icon").css({
            display: "inline",
            float: "right"
        }),
                                                                             i.find(".message_poster_id").removeClass("small"),
                                                                             i.find(".message_poster").removeClass("message_partner"),
                                                                             i.find(".message_poster").css("background", "none"),
                                                                             i.find(".message_post_content").css("background", "none"),
                                                                             i.find(".message_post_content").css("border", "none"),
                                                                             $(".message_post_container .message_post .message_poster .message_poster_id .gp_player_link").each(function(e, t) {
            mhUtl.gp_player_link2bbcodes_player($(t))
        }),
                                                                             $(".message_post_container .message_post").each(function(e, t) {
            e % 2 && $(t).css("background", 'url("' + MH.GameImg + '/images/game/border/even.png")'),
                $(t).css({
                padding: "5px",
                "border-bottom": "1px solid #d0be97"
            })
        })),
                                                           $(".message_post_container .message_post").each(function(e, t) {
            e = " top:-15px;",
                MH.Set.MesFor && (e = ""),
                $(t).append($("<div/>", {
                class: "small MHbbcADD",
                style: "text-align:right; position:relative;" + e
            }).append($("<a/>", {
                href: "#",
                style: "margin:0 4px;",
                s: "0"
            }).html(MH.GLng.Show.toLowerCase()).click(function() {
                var e = $(this).parent().parent().find(".message_post_content");
                if (e.length) {
                    if ($("#MHbbcpreview").remove(),
                        "1" == $(this).attr("s"))
                        return $(this).attr("s", "0"),
                            void $(this).html(MH.GLng.Show.toLowerCase());
                    $(this).attr("s", "1"),
                        $(this).html(MH.GLng.Hide.toLowerCase()),
                        e.parent().append($("<textarea/>", {
                        id: "MHbbcpreview",
                        style: "width:" + e.width() + "px; height:" + (e.height() + 30) + "px;"
                    }).val(MH.BBCodeFromJQ(e)))
                }
            })).append($("<a/>", {
                href: "#",
                style: "margin:0 4px;"
            }).html(MH.GLng.Quote).click(function() {
                var e = MH.BBCodeFromJQ($(this).parent().parent().find(".message_post_content"));
                Message.reply(),
                    e = '[quote="' + $(this).parent().parent().find(".message_poster .message_poster_id .gp_player_link").html().clear() + '"]' + e + "[/quote]",
                    $("#message_reply_message").val(e)
            })))
        }),
                                                           (i = t.find(".message_post_container")).length && (r = allPg = 1,
                                                                                                              (l = t.find("#message_message_list .game_header").clone()).find("*").remove(),
                                                                                                              l = l.html().clear(),
                                                                                                              l = MH.BBCodeDecodeHTMLEntities(l),
                                                                                                              t.find(".game_header>#paginator_selected").length && (r = t.find(".game_header>#paginator_selected").html().clear(),
    t.find(".game_header>.paginator_bg").each(function(e, t) {
            t = parseInt($(this).html().clear()),
                isNaN(t) || t > allPg && (allPg = t)
        }),
    r = allPg - r + 1),
                                                                                                              o = "[ " + r + " / " + allPg + " ]",
                                                                                                              t.find(".game_border>.game_list_footer").append(mhGui.But(16, "float:right;").click(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                n = "M" + Game.player_id + MH.ghref(t.find("#message_partner>.gp_player_link"), "id"),
                n += "_" + l + "(" + r + ").html",
                MH.utl.ClientSaveGrepo(n, l, o, t.find(".message_post_container"))
        }).mousePopup(new MousePopup(MH.Lang.getFILE))).append(mhGui.But(15, "float:right;").click(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)";
            var n = 0
            , i = [];
            for (t.find(".message_post_container .message_post").each(function(e, t) {
                i[n] = "\n[img]" + MH.Home + "gui/hr.gif[/img]\n",
                    i[n] += "[player]" + $(t).find(".message_poster_id>.gp_player_link").html().clear() + "[/player] ",
                    i[n] += $(t).find(".message_poster>.message_date").html().clear(),
                    i[n] += "\n\n",
                    i[n] += MH.BBCodeFromJQ($(t).find(".message_post_content")),
                    i[n] += "\n",
                    n++
            }),
                 MH.Set.MesFor || i.reverse(),
                 n = "[img]" + MH.Home + "gui/hrm.gif[/img]\n",
                 n += DM.getl10n("layout").main_menu.items.messages + ": " + l + " " + o,
                 a = 0; a < i.length; a++)
                n += i[a];
            n += "\n[img]" + MH.Home + "gui/hrm.gif[/img]",
                MH.BBCode_Show(n)
        }).mousePopup(new MousePopup(MH.Lang.getBBC)))))) : mhCol.UpdatePlaysFromRemote(function() {
            MH.ev.ren.message(e)
        }) : mhCol.UpdateAllysFromRemote(function() {
            MH.ev.ren.message(e)
        }))
    }
        ,
        MH.ev.ren.message_scroll = !0,
        MH.ev.ren.message_scrolldown = function() {
        var e;
        $(".message_post_container").length && MH.ev.ren.message_scroll && ((e = document.getElementById("message_post_container")).scrollTop = e.scrollHeight,
                                                                            setTimeout(function() {
            MH.ev.ren.message_scrolldown()
        }, 500))
    }
        ,
        MH.ev.ren.alliance_forumScrool = !0,
        MH.ev.ren.alliance_forum = function(e) {
        var t, i, n, a, o, r;
        "forum" == e.tab && (t = e.jGP,
                             e.idJQ,
                             n = e.wnd,
                             MH.ReportsView("#postlist li .content"),
                             MH.bbCodeButtions(e, "#forum_post_textarea"),
                             MH.YouTubeLinks(t),
                             "ffx" == MH.bro && t.find("#forum_post_textarea").length && (t.find("#forum_buttons a.button").length ? (t.find("#forum_buttons a.button:first").attr("onclick", ""),
                                                                                                                                      t.find("#forum_buttons a.button:first").unbind().bind("click", function() {
            MH.SavP(t.find("#forum_post_textarea")),
                Forum.postSave()
        })) : t.find("#newthread").length ? (t.find(".game_footer a.button:first").attr("onclick", ""),
                                             t.find(".game_footer a.button:first").unbind().bind("click", function() {
            MH.SavP(t.find("#forum_post_textarea")),
                Forum.threadCreate()
        })) : (t.find("#post_save_form a.button:first").attr("onclick", ""),
               t.find("#post_save_form a.button:first").unbind().bind("click", function() {
            MH.SavP(t.find("#forum_post_textarea")),
                Forum.postSave()
        }))),
                             MH.Set.ftabs && (e.wJQ.find("div.menu_wrapper.menu_wrapper_scroll.MH").length || (e.setWidth(780),
                                                                                                               e.wJQ.css("margin", ""),
                                                                                                               MH.ren_ChangeTabs(e.wJQ, e.jGP))),
                             1 == MH.Set.fheight && 0 == MH.allianceForumResized && (MH.allianceForumResized = !0,
                                                                                     null == MH.ev.ren.wForum_height && (MH.ev.ren.wForum_height = $(window).height() - 100),
                                                                                     n.setHeight(MH.ev.ren.wForum_height),
                                                                                     n.centerWindowVerticaly()),
                             1 == MH.Set.fheight && 0 == MH.Set.wRes && (n = MH.ev.ren.wForum_height,
                                                                         n -= t.parent().find(".menu_wrapper").height() - 22,
                                                                         t.find("#forum").css("height", n - 90 + "px")),
                             "1" != e.wJQ.find(".menu_inner:first").attr("MHM") && (e.wJQ.find(".menu_inner:first>li").click(function() {
            MH.ev.ren.forum_scroll = !1
        }),
                                                                                    e.wJQ.find(".menu_inner:first").attr("MHM", "1")),
                             "1" != e.wJQ.find(".forum_pager:first").attr("MHM") && (e.wJQ.find(".forum_pager:first>a").click(function() {
            MH.ev.ren.forum_scroll = !1
        }),
                                                                                     e.wJQ.find(".forum_pager:first").attr("MHM", "1")),
                             t.find("#threadlist .thread .lastpost .forum_lastpost").click(function() {
            MH.ev.ren.forum_scroll = !0
        }),
                             1 == MH.ev.ren.forum_scroll && (MH.ev.ren.forum_scrolldown(),
                                                             t.find("#postlist").scroll(function(e) {
            0 != MH.drag.mouse_down && (MH.ev.ren.forum_scroll = !1)
        }),
                                                             e.jGP.find("#postlist").length && document.getElementById("postlist").addEventListener("wheel", function() {
            MH.ev.ren.forum_scroll = !1
        })),
                             $("#postlist li .post_functions").each(function(e, t) {
            var n = !0
            , i = 0;
            $(t).find("a[onclick]").each(function() {
                -1 < $(this).attr("onclick").indexOf("Forum.postEdit") && (n = !1),
                    -1 < $(this).attr("onclick").indexOf("Forum.openPlayerProfile") && (i = 1)
            }),
                n && $(t).find("a[onclick]").eq(i).before($("<a/>", {
                href: "#",
                class: "MHbbcADD",
                style: "margin:0 4px;",
                s: "0"
            }).html(MH.GLng.Show.toLowerCase()).click(function() {
                MH.ev.ren.forum_scroll = !1;
                var e = $(this).parent().parent().find(".content");
                if (e.length) {
                    if ($("#MHbbcpreviewF").remove(),
                        "1" == $(this).attr("s"))
                        return $(this).attr("s", "0"),
                            void $(this).html(MH.GLng.Show.toLowerCase());
                    $(this).attr("s", "1"),
                        $(this).html(MH.GLng.Hide.toLowerCase()),
                        e.parent().append($("<textarea/>", {
                        id: "MHbbcpreviewF",
                        class: "MHbbcADD",
                        style: "width:" + e.width() + "px; height:" + (e.height() + 30) + "px;"
                    }).val(MH.BBCodeFromJQ(e)))
                }
            }))
        }),
                             t.find("#postlist").length && (o = allPg = 1,
                                                            r = e.wJQ.find("#threadtitle span .title").html().clear(),
                                                            e.wJQ.find("#threadtitle span .title").eq(1).length && (r += " " + e.wJQ.find("#threadtitle span .title").eq(1).html().clear()),
                                                            r = MH.BBCodeDecodeHTMLEntities(r),
                                                            o = t.find("#forum .forum_pager #paginator_selected").html().clear(),
                                                            allPg = t.find("#forum .forum_pager .paginator_bg").last().html().clear(),
                                                            a = "[ " + o + " / " + allPg + " ]",
                                                            t.find("#forum>.game_list_footer").append(mhGui.But(16, "float:right;").click(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                i = e.wJQ.find("#threadtitle span .title").html().clear(),
                e.wJQ.find("#threadtitle span .title").eq(1).length && (i = e.wJQ.find("#threadtitle span .title").eq(1).html().clear()),
                i = MH.BBCodeDecodeHTMLEntities(i),
                i = "F" + Game.alliance_id + "_" + i + "(" + o + ").html",
                MH.utl.ClientSaveGrepo(i, r, a, t.find("#postlist"))
        }).mousePopup(new MousePopup(MH.Lang.getFILE))).append(mhGui.But(15, "float:right;").click(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)";
            var n = "[img]" + MH.Home + "gui/hrf.gif[/img]\n";
            n += DM.getl10n("layout").main_menu.items.allianceforum + " [ally]" + Game.alliance_name + "[/ally] : ",
                n += e.wJQ.find(".menu_inner .submenu_link.active").html().clear(),
                n += " -> " + r + " " + a,
                t.find("#postlist>li").each(function(e, t) {
                n += "\n[img]" + MH.Home + "gui/hr.gif[/img]\n",
                    n += "[player]" + $(t).find(".author>.bbcodes_player").html().clear() + "[/player]",
                    $(t).find(".author>.bbcodes_ally").length && (n += " [ally]" + $(t).find(".author>.bbcodes_ally").html().clear() + "[/ally]"),
                    (i = $(t).find(".author").clone()).find("*").remove(),
                    n += " " + i.html().clear(),
                    n += "\n\n",
                    n += MH.BBCodeFromJQ($(t).find(".content")),
                    n += "\n"
            }),
                n += "[img]" + MH.Home + "gui/hrf.gif[/img]\n",
                MH.BBCode_Show(n)
        }).mousePopup(new MousePopup(MH.Lang.getBBC)))))
    }
        ,
        MH.ev.ren.forum_scroll = !1,
        MH.ev.ren.forum_scrolldown = function() {
        var e;
        $("#postlist").length && MH.ev.ren.forum_scroll && ((e = document.getElementById("postlist")).scrollTop = e.scrollHeight,
                                                            setTimeout(function() {
            MH.ev.ren.forum_scrolldown()
        }, 500))
    }
        ,
        MH.ev.ren.player_index = function(e) {
        0 == e.cJQ.find("#HMoleSetupLink").length && e.cJQ.find(".settings-menu ul").eq(2).append($("<li>").append($("<img/>", {
            src: MH.Home + "imgs/icon.ico"
        })).append($("<a/>", {
            id: "HMoleSetupLink",
            href: "#"
        }).html(" " + MH.Lang.norka).click(function() {
            MH.wo.Show(e.wnd)
        })))
    }
        ,
        MH.ev.ren.player_profile = function(e, t) {
        var n, a, i = e.cJQ;
        i.find("#mhStaPla").length || (mhCol.ART_PlayerProfile(t),
                                       a = null,
                                       mhCol.play.hasOwnProperty("name") && (a = mhCol.play.id,
                                                                             n = mhCol.play.name),
                                       null != a && (MH.Set.WS && null != a && a in MH.GuiUst.SymPlay && $(i.find("#player_info h3:first")).append($("<div/>", {
            class: "PlaySymIco",
            id: a,
            style: "background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymPlay[a].x + "px -" + MH.GuiUst.SymPlay[a].y + "px"
        })),
                                                     i.find("#player_buttons").append(mhAddStd.BtnStatPlayer(a, n)),
                                                     i.find("#player_buttons").append(mhGui.But(10, "float:left; margin:0px 0 0 0;").mousePopup(new MousePopup(MH.Lang.SymPlay)).click(function() {
            MH.SYMWnd(a, n, !1)
        })),
                                                     null != a && i.find("#player_buttons").append(mhAddStd.BtnPlayListAdd(a, n).css({
            float: "left",
            margin: "0 0 0 0"
        })),
                                                     i.find("#player_towns .game_border .game_header").html(i.find("#player_towns .game_border .game_header").html() + ": " + i.find("#player_towns li").length),
                                                     i.find("#player_towns .game_border .game_list li .gp_town_link").each(function() {
            var e, t = MH.Link2Struct($(this).attr("href"));
            _log(t);
            var n, i = mhDat.wondInf.wondAlly;
            if ("end_game_type_world_wonder" == Game.features.end_game_type && "?" != mhDat.wondInf && mhDat.wondInf.wondAlly) {
                for (e in i)
                    if (i.hasOwnProperty(e) && i[e].ix == t.ix && i[e].iy == t.iy) {
                        n = e;
                        break
                    }
                n in mhCNST.WorldWondersEx && $(this).append('<div class="mhWondIco ' + mhCNST.WorldWondersEx[n] + '" style="float:right;"></div>')
            }
            Game.player_id == a && "end_game_type_domination" == Game.features.end_game_type && (e = t.ix + ":" + t.iy,
                                                                                                 0 <= MH.DomIslands.t.indexOf(e) && $(this).append('<div class="mhTwnIco domination" style="float:right;"></div>'))
        }),
                                                     null != a && (i.find("#profile_info .game_border").append('<input id="mh_player_bbcode_id" type="text" value="[player]' + n + '[/player]" onclick="this.select();" onfocus="this.select();" style="position:absolute; right:22px; top:0; display:none;">'),
                                                                   i.find("#profile_info .game_border").append(mhGui.But(29, "float:left; margin:0px 0 0 0;").css({
            position: "absolute",
            right: "1px",
            top: "0"
        }).mousePopup(new MousePopup("BBCode")).click(function() {
            "none" == i.find("#profile_info .game_border #mh_player_bbcode_id").css("display") ? i.find("#profile_info .game_border #mh_player_bbcode_id").css("display", "inline-block") : i.find("#profile_info .game_border #mh_player_bbcode_id").css("display", "none")
        }))),
                                                     MH.YouTubeLinks(i.find("#player_profile"), !0)))
    }
        ,
        MH.ev.ren.alliance_profile = function(e, t) {
        var n, a = e.cJQ;
        a.find("#mhStaAly").length || (mhCol.ART_AllianceProfile(t, e.wJQ.find(".ui-dialog-titlebar .ui-dialog-title").html().clear()),
                                       n = allyID = null,
                                       mhCol.ally.hasOwnProperty("name") && (allyID = mhCol.ally.id,
                                                                             n = mhCol.ally.name),
                                       null != allyID && ("?" == MH.SWI.dat.nra && (e = (e = (e = a.find("#player_info ul li:first").html().clear()).substr(0, e.indexOf(" "))).substr(e.indexOf("/") + 1),
                                                                                    isNaN(e) || (MH.SWI.dat.nra = e,
                                                                                                 MH.SWI.Save())),
                                                          MH.Set.WS && null != allyID && allyID in MH.GuiUst.SymAlly && $(a.find("#player_info h3:first")).append($("<div/>", {
            class: "AllySymIco",
            id: allyID,
            style: "background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymAlly[allyID].x + "px -" + MH.GuiUst.SymAlly[allyID].y + "px"
        })),
                                                          a.find("#ally_buttons .center_box").append(mhAddStd.BtnStatAlly(allyID, n).css({
            position: "relative",
            top: "-23px",
            left: "25px"
        })),
                                                          a.find("#ally_buttons .center_box").append(mhGui.But(10, "float:left; position:relative; top:-23px; left:25px;").mousePopup(new MousePopup(MH.Lang.SymAlly)).click(function() {
            MH.SYMWnd(allyID, n, !0)
        })),
                                                          null != allyID && a.find("#ally_buttons .center_box").append(mhAddStd.BtnAllyListAdd(allyID, n).css({
            float: "left",
            position: "relative",
            top: "-23px",
            left: "25px"
        })),
                                                          $("<a/>", {
            href: "#",
            class: "write_message"
        }).click(function() {
            var n, i = "";
            $.each(a.find("#ally_towns ul.members_list>li:nth-child(2) ul li"), function(e, t) {
                3 < (n = MH.Link2Struct($(t).find("a.gp_player_link").attr("href")).name).length && n != Game.player_name && (i += n,
                                                                                                                              i += "; ")
            }),
                Layout.newMessage.open({
                recipients: i
            })
        }).insertBefore(a.find("#ally_towns div.game_border_top")),
                                                          null != n && (a.find("#ally_towns .game_border").append('<input id="mh_ally_bbcode_id" type="text" value="[ally]' + n + '[/ally]" onclick="this.select();" onfocus="this.select();" style="position:absolute; right:22px; top:0; display:none;">'),
                                                                        a.find("#ally_towns .game_border").append(mhGui.But(30, "float:left; margin:0px 0 0 0;").css({
            position: "absolute",
            right: "1px",
            top: "0"
        }).mousePopup(new MousePopup("BBCode")).click(function() {
            "none" == a.find("#ally_towns .game_border #mh_ally_bbcode_id").css("display") ? a.find("#ally_towns .game_border #mh_ally_bbcode_id").css("display", "inline-block") : a.find("#ally_towns .game_border #mh_ally_bbcode_id").css("display", "none")
        }))),
                                                          MH.YouTubeLinks(a.find("#ally_profile"), !0)))
    }
        ,
        MH.ev.ren.towninfo_info = function(e, t) {
        var n, i, a = e.cJQ;
        if ("attack" == e.tab && MH.DB.GetMorAndBon(t),
            "attack" == e.tab || "support" == e.tab) {
            try {
                l = (l = JSON.parse(t).json).json.target_id
            } catch (e) {
                return
            }
            return n = "0 0 -7px 10px",
                "attack" == e.tab && (n = "0 0 -8px 10px"),
                void a.find("#btn_runtime").after($("<a/>", {
                href: "#",
                style: "display:inline-block; margin:" + n + "; width:31px; height:23px; background:url('" + MH.Home + "medias/images/but.png') -454px 0px;"
            }).mousePopup(new MousePopup(MH.Lang.reaTime)).mousedown(function() {
                MH.ATimes(MH.cmTown, "attack" == e.tab)
            }))
        }
        mhCol.ART_TownInfo(t);
        var o = playerID = null;
        mhCol.play.hasOwnProperty("name") && (playerID = mhCol.play.id,
                                              o = mhCol.play.name);
        var r = allyID = null;
        mhCol.ally.hasOwnProperty("name") && (allyID = mhCol.ally.id,
                                              r = mhCol.ally.name);
        var l = a.find("#towninfo_towninfo .game_border .game_header.bold").html().strip_tags().replace(/\s+/g, " ")
        , s = a.find("input#town_bbcode_id").attr("value").replace(/\[town\](.*?)\[\/town\]/, "$1");
        a.find("#town_bbcode_link").css("float", "left").appendTo(a.find("#towninfo_towninfo .game_border .game_header")),
            a.find("#town_bbcode_id").css("float", "left").appendTo(a.find("#towninfo_towninfo .game_border .game_header")),
            (n = a.find("#towninfo_towninfo .game_border .game_list li:first")).html('<span class="bbcodes bbcodes_town"> <a href="#">' + l + "</a>" + n.html()),
            a.find("#towninfo_towninfo .game_border .game_list li:first .bbcodes_town img:first").css("float", "unset"),
            $("span.ui-dialog-title").html(l),
            n.append(mhGui.But(12).css({
            float: "right",
            margin: "-2px 0 0 0"
        }).mousePopup(new MousePopup(MH.Lang.STATST)).mousedown(function() {
            MH.MiniForm("th", "town=" + s)
        })),
            i = MH.Link2Struct(a.find("a.gp_island_link:first").attr("href")),
            n.append(mhAddStd.BtnTownListAdd(s, l, i.ix, i.iy).css({
            float: "right",
            margin: "-2px 0 0 0"
        })),
            n.append(mhGui.But(8).css({
            float: "right",
            margin: "-2px 0 0 0"
        }).mousePopup(new MousePopup(MH.Lang.SetTarget)).mousedown(function() {
            mhAddStd.Trgsetbytown(MH.cmTown)
        })),
            n.append($("<a/>", {
            href: "#",
            style: "float:right; margin:-2px 0 0 0; width:31px; height:23px; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -454px 0px rgba(0, 0, 0, 0) "
        }).mousePopup(new MousePopup(MH.Lang.reaTime)).mousedown(function() {
            MH.ATimes(MH.cmTown)
        })),
            a.find("#towninfo_towninfo .game_border .game_list li .bbcodes_island").parent().append(mhAddStd.BtnIslaListAdd(a.find("a.gp_island_link:first").attr("href")).css({
            float: "right",
            margin: "-2px 0 0 0"
        })),
            null != playerID && (a.find("a.color_table.assign_color").parent().width(145),
                                 mhAddStd.BtnStatPlayer(playerID, o, !1).css({
            float: "right"
        }).attr("id", e.wnd.getName() + "HMoleStatsPlayer").insertAfter(a.find("a.color_table.assign_color")),
                                 mhGui.But(10, "float:right; margin:0px 0 0 0;").mousePopup(new MousePopup(MH.Lang.SymPlay)).click(function() {
            MH.SYMWnd(playerID, o, !1)
        }).insertBefore(a.find("a.color_table.assign_color")),
                                 mhAddStd.BtnPlayListAdd(playerID, o).css({
            float: "right",
            margin: "0 0 0 0"
        }).insertAfter(a.find("a.color_table.assign_color")),
                                 null != allyID && (a.find("a.color_table.assign_ally_color").parent().width(101),
                                                    MH.Set.AL && a.find("a.color_table.assign_ally_color").parent().parent().find("img:first").remove(),
                                                    MH.Set.WS && allyID in MH.GuiUst.SymAlly && a.find("a.color_table.assign_ally_color").parent().parent().find("a:first").before($("<div/>", {
            class: "AllySymIco",
            id: allyID,
            style: "background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymAlly[allyID].x + "px -" + MH.GuiUst.SymAlly[allyID].y + "px"
        })),
                                                    mhAddStd.BtnStatAlly(allyID, r, !0).css({
            float: "right"
        }).insertAfter(a.find("a.color_table.assign_ally_color")),
                                                    mhGui.But(10, "float:right; margin:0px 0 0 0;").mousePopup(new MousePopup(MH.Lang.SymAlly)).click(function() {
            MH.SYMWnd(allyID, r, !0)
        }).insertBefore(a.find("a.color_table.assign_ally_color")),
                                                    mhAddStd.BtnAllyListAdd(allyID, r).css({
            float: "right",
            margin: "0 0 0 0"
        }).insertAfter(a.find("a.color_table.assign_ally_color"))))
    }
        ,
        MH.ev.ren.island_info = function(e) {
        var t, i = e.jGP, n = "DIV#gpwnd_" + e.idJQ + " ", a = (e.wnd,
                                                                i.find("#island_bbcode_id").attr("value").replace(/\[island\](.*?)\[\/island\]/, "$1")), o = i.find(".islandinfo_coords").html().clear().replace(/(.*?)\((.*?)\)/, "$2").split("/"), r = o[1];
        o = o[0],
            e = t = "",
            i.find(".islandinfo-Ws").length && (e = "Ws"),
            i.find(".islandinfo-Wi").length && (e = "Wi"),
            i.find(".islandinfo-Sw").length && (e = "Sw"),
            i.find(".islandinfo-Si").length && (e = "Si"),
            i.find(".islandinfo-Iw").length && (e = "Iw"),
            i.find(".islandinfo-Is").length && (e = "Is"),
            i.find(".wonder_name").length && (t = i.find(".wonder_name").html()),
            $(n + "#island_bbcode_link").before(mhAddStd.BtnIslaListAdd(mhUtl.hrefIsland(a, o, r, e, t)).css({
            float: "left",
            margin: "0 0 0 4px"
        })),
            $("<a/>", {
            href: "#",
            class: "write_message"
        }).click(function() {
            var n = "";
            $.each(i.find("#island_info_towns_left_sorted_by_name li span.player_name"), function(e, t) {
                $(this).text() != Game.player_name && $(this).text() != DM.getl10n("common").ghost_town && "Brak miast na tej wyspie." != $(this).text() && n.indexOf($(this).text()) < 0 && (n += $(this).text(),
            n += "; ")
            }),
                Layout.newMessage.open({
                recipients: n
            })
        }).appendTo(n + "#island_towns_controls")
    }
        ,
        MH.ev.ren.building_wall = function(e) {
        var n = e.jGP
        , i = "DIV#gpwnd_" + e.idJQ + " "
        , a = e.wnd;
        $(i + "#building_wall").ready(function() {
            var e, t;
            n.find("#building_wall ul.game_list").css("max-height", "456px"),
                $(i + "#building_wall #mhWallDiv").length || (e = $("<div/>", {
                id: "mhWallDiv"
            }),
                                                              mhGui.Button(MH.Lang.btnReset).css({
                float: "right"
            }).click(function() {
                MH.WallReset(),
                    1 == MH.sShowLastWall && MH.WallReplace()
            }).appendTo(e),
                                                              t = c2 = "0",
                                                              1 == MH.sShowLastWall ? c2 = "1" : t = "1",
                                                              1 == MH.sShowLastWall && MH.WallReplace(),
                                                              $("<span/>", {
                style: "float:left; display:block;"
            }).html(MH.Lang.wallShow + ": ").append($("<a/>", {
                style: "font-weight:initial",
                href: "#",
                id: "rb_wall1",
                sel: t,
                rel: a.getID()
            }).click(function() {
                0 != MH.sShowLastWall && (MH.sShowLastWall = !1,
                                          document.getElementById("rb_wall2").firstChild.src = MH.Home + "medias/images/rb0.gif",
                                          this.firstChild.src = MH.Home + "medias/images/rb1.gif",
                                          document.getElementById("rb_wall2").setAttribute("sel", "0"),
                                          this.setAttribute("sel", "1"),
                                          $(".place_unit_black.bold.HMoleDiff").remove(),
                                          $(".place_unit_white.bold.HMoleDiff").remove(),
                                          $(".place_unit_black.bold").show(),
                                          $(".place_unit_white.bold").show(),
                                          $("div#building_wall.game_inner_box .game_border .game_header").html(mhUtl.GetBuildingName("wall")))
            }).append($("<img/>", {
                src: MH.Home + "medias/images/rb" + t + ".gif",
                style: "position:relative; top:2px;"
            })).append(" " + MH.Lang.wallShowA + " ")).append(" .... ").append($("<a/>", {
                style: "font-weight:initial",
                href: "#",
                id: "rb_wall2",
                sel: c2
            }).click(function() {
                1 != MH.sShowLastWall && (MH.sShowLastWall = !0,
                                          document.getElementById("rb_wall1").firstChild.src = MH.Home + "medias/images/rb0.gif",
                                          this.firstChild.src = MH.Home + "medias/images/rb1.gif",
                                          document.getElementById("rb_wall1").setAttribute("sel", "0"),
                                          this.setAttribute("sel", "1"),
                                          MH.WallReplace())
            }).append($("<img/>", {
                src: MH.Home + "medias/images/rb" + c2 + ".gif",
                style: "position:relative; top:2px;"
            })).append(" " + MH.Lang.wallShowB)).appendTo(e),
                                                              $(i + "#building_wall ul.game_list").after(e),
                                                              MH.Glng.WalDef = n.find("div.list_item_left h3").html().clear().replace(/\./g, ""),
                                                              MH.Glng.WalLos = n.find("div.list_item_right h3").html().clear().replace(/\./g, ""),
                                                              MH.Glng.WalA = $(n.find("div.list_item_left h4")[0]).html().clear().replace(/\./g, ""),
                                                              MH.Glng.WalD = $(n.find("div.list_item_left h4")[1]).html().clear().replace(/\./g, ""),
                                                              MH.Glng.WalA = MH.Glng.WalA.substr(0, MH.Glng.WalA.indexOf("(")).clear(),
                                                              MH.Glng.WalD = MH.Glng.WalD.substr(0, MH.Glng.WalD.indexOf("(")).clear())
        })
    }
        ,
        MH.ev.ren.commandinfo_info = function(e) {
        var n = e.jGP
        , i = "DIV#gpwnd_" + e.idJQ + " ";
        e.wnd;
        $(i + "div.command_info").ready(function() {
            var e, t;
            !$(i + " div.command_info").length || "attack" == (e = n.find(".command_icon_wrapper img").attr("src").replace(/^.*[\/]/, "").replace(/.png/, "")) && n.find("div.return").length < 1 && MH.Link2Struct(n.find("div.defender a.gp_town_link").attr("href")).id == Game.townId && (e = (e = n.find(".command_info_time .arrival_time").html()).substring(e.length - 8, e.length).replace(/ /, "0"),
        (t = new Date(1e3 * Timestamp.server())).setHours(e.substring(0, 2)),
        t.setMinutes(e.substring(3, 5)),
        t.setSeconds(e.substring(6, 8)),
        (e = Math.round(t.getTime() / 1e3)) < Timestamp.server() && (e += 86400),
        (e = "_" + MH.Link2Struct(n.find("div.attacker a.gp_town_link").attr("href")).id + (e + Timestamp.localeGMTOffset()))in MH.attTownList && n.find(".command_icon_wrapper img:first").attr("src", MH.Home + "m/" + MH.attTownList[e].at + ".png"))
        })
    }
        ,
        MH.ev.ren.olympus_temple_info = function(e, t) {
        var n, i = e.cJQ, a = i.find(".temple_image_wrapper .header span").html().clear(), o = i.find(".temple_image_wrapper .header textarea").html();
        o = (o = o.replace("[temple]", "")).replace("[/temple]", ""),
            n = MH.cmTown.ix,
            e = MH.cmTown.iy,
            i.find(".temple_info_top .troops_support .header").append(mhAddStd.BtnTempleListAdd(o, a, n, e).css({
            float: "right",
            margin: "0 22px 0"
        }))
    }
        ,
        MH.ev.ren.farm_town_overviews = function(e) {}
        ,
        MH.ev.ren.wonders = function(e) {
        var t = e.cJQ;
        t.find(".wonder_progress").length || ($('<div class="prev_ww" style:"z-index:1"></div><div class="next_ww" style:"z-index:1"></div>').appendTo(t.find(".wonder_controls")),
                                              t.find(".wonder_finished").css({
            width: "100%"
        }),
                                              t.find("img.finished_image").css({
            "z-index": "-1"
        }).appendTo(t.find(".wonder_controls")),
                                              e.wnd.setHeight(600))
    }
        ,
        MH.ev.ren.conquest_info = function(e) {
        var t = "DIV#gpwnd_" + e.idJQ + " ";
        e.wnd.setWidth(600),
            $.each($(t + "#unit_movements li"), function(e, t) {
            $(t).width(280)
        })
    }
        ,
        MH.ev.ren.notes = function(t) {
        if (t.setWidth(800),
            MH.t = t.cJQ.find("textarea"),
            MH.t.length)
            return e(".btn_cancel"),
                MH.bbCodeButtions(t, "textarea"),
                MH.FC(t.wJQ.find(".buttons_box .btn_save"), function() {
                MH.t.change()
            }),
                void ("ffx" == MH.bro && MH.FC(t.wJQ.find(".buttons_box .btn_save"), function() {
                MH.SavP(MH.t)
            }));
        function e(e) {
            $(t.cJQt + " .notes_container .buttons_box " + e).click(function() {
                MH.ev.WAR(t.type, t.tab, "")
            })
        }
        MH.ReportsView(t.cJQt + " .notes_container .preview_box"),
            MH.YouTubeLinks(t.cJQ),
            e(".btn_edit")
    }
        ,
        MH.ev.ren.ranking = function(e) {
        MH.Set.ftabs && MH.ren_ChangeTabs(e.wJQ, e.jGP)
    }
        ,
        MH.ren_ChangeTabs = function(e, n) {
        var t, i, a = e.find("div.menu_wrapper.menu_wrapper_scroll"), o = e.find("div.menu_wrapper.menu_wrapper_scroll>ul");
        if (a.width() != o.width() && !e.find("div.menu_wrapper.menu_wrapper_scroll.MH").length) {
            for (a.addClass("MH"),
                 t = a.width(),
                 t += a.parent().find("a.next").width(),
                 t += a.parent().find("a.prev").width(),
                 a.width(t),
                 o.width(t),
                 o.css("right", 0),
                 a.find("div.fade_left").remove(),
                 a.find("div.fade_right").remove(),
                 a.parent().find("a.next").remove(),
                 a.parent().find("a.prev").remove(),
                 i = $($("ul.menu_inner li")[$("ul.menu_inner li").length - 1]).position().top / 22,
                 i = Math.floor(i) + 1,
                 n.height(n.height() + 22 * (i - 1)),
                 n.find("div.gpwindow_content").css("top", 44 + 22 * (i - 1)),
                 a.height(22 * i),
                 n.find("div.gpwindow_top").attr("id", "gptop1"),
                 e.find("div#gptop1").css("height", "29px"),
                 e.find("div#gptop1 .corner").css("height", "29px"),
                 t = 1; t < i - 1; t++)
                $("<div/>", {
                    class: "gpwindow_top",
                    id: "gptop" + (t + 1),
                    style: "top:" + (29 + 22 * (t - 1)) + "px; height:22px; background-position:0 -22px;"
                }).append($("<div/>", {
                    class: "gpwindow_left corner",
                    style: "background-position:left -39px"
                })).append($("<div/>", {
                    class: "gpwindow_right corner",
                    style: "background-position:right -83px"
                })).insertBefore(n.find("div.gpwindow_content"));
            $("<div/>", {
                class: "gpwindow_top",
                id: "gptop" + i,
                style: "top:" + (29 + 22 * (i - 2)) + "px; height:37px; background-position:0 -24px;"
            }).append($("<div/>", {
                class: "gpwindow_left corner",
                style: "height:37px; background-position:left -41px;"
            })).append($("<div/>", {
                class: "gpwindow_right corner",
                style: "height:37px; background-position:right -85px;"
            })).insertBefore(n.find("div.gpwindow_content")),
                n.parent().find("ul.menu_inner>li").css("float", "left"),
                $.each(n.parent().find("ul.menu_inner>li"), function(e, t) {
                0 == e ? n.parent().find("ul.menu_inner>li").eq(0).insertAfter(n.parent().find("ul.menu_inner>li").eq(n.parent().find("ul.menu_inner>li").length - 1)) : n.parent().find("ul.menu_inner>li").eq(0).insertBefore(n.parent().find("ul.menu_inner>li").eq(n.parent().find("ul.menu_inner>li").length - e))
            }),
                n.parent().find("ul.menu_inner li a .left").height(22),
                n.parent().find("ul.menu_inner li a .left .right").height(22),
                n.parent().find("ul.menu_inner li a .left .right .middle").height(22)
        }
    }
        ,
        MH.CmdListIRQA = !1,
        MH.CmdListInit = function() {
        MH.CmdListIRQA = !1,
            $("#ui_box .tb_activities .middle .activity.commands").mouseenter(function() {
            MH.CmdListIRQA || (MH.CmdListIRQA = !0),
                setTimeout(MH.CmdListIRQ, 10)
        })
    }
        ,
        MH.CmdListIRQ = function() {
        var n, i, a, o, r;
        MH.Set.exCmdList && (MH.commandsListDrag && "none" == $("#toolbar_activity_commands_list").css("display") && ($("#toolbar_activity_commands_list").css({
            display: "block"
        }),
                                                                                                                      $("#toolbar_activity_commands_list .js-dropdown-item-list>div").attr("class", "visible"),
                                                                                                                      $("#toolbar_activity_commands").mouseover()),
                             $("#toolbar_activity_commands_list").width(276),
                             $.each($("div.item.command.revolts"), function(e, t) {
            null != $(t).find("a").attr("href") && (a = MH.Link2Struct($(t).find("a").attr("href")).id,
                                                    ITowns.isMyTown(a) && (-1 < $(t).find(":first").attr("class").indexOf("revolt_arising") && ($(t).find(":first").css("background-image", "url(" + MH.Home + "m/ORA.png)"),
                                                                                                                                                $(t).find(":first").css("backgroundPosition", "0 0")),
                                                                           -1 < $(t).find(":first").attr("class").indexOf("revolt_running") && ($(t).find(":first").css("background-image", "url(" + MH.Home + "m/ORR.png)"),
                                                                                                                                                $(t).find(":first").css("backgroundPosition", "0 0"))))
        }),
                             $.each($("div.item.command.unit_movements"), function(e, t) {
            if (-1 < $(t).find(":first").attr("class").indexOf("revolt_running")) {
                if (null == $(t).find("a").attr("href"))
                    return;
                if (a = MH.Link2Struct($(t).find("a").attr("href")).id,
                    !ITowns.isMyTown(a))
                    return
            }
            $(t).find(":first").hasClass("attack") && $(t).find(":first").hasClass("returning") && null != $(t).find("a").attr("href") && ((a = MH.Link2Struct($(t).find("a").attr("href")).id)in ITowns.towns || (n = Timestamp.serverTimeToLocal(),
        n = Math.round(n / 1e3),
        i = $(t).find(".time").html().clear().split(":"),
        r = 60 * parseInt(i[0]) * 60 + 60 * parseInt(i[1]) + parseInt(i[2]),
        i = n + parseInt(r),
        (o = "_" + a + i)in MH.attTownList && ($(t).find(":first").css("background-image", "url(" + MH.Home + "m/" + MH.attTownList[o].at + ".png)"),
                                               $(t).find(":first").css("backgroundPosition", "0 0")),
        $(t).find(".GMHseltroopbutton").length || $("<div/>", {
                id: o,
                class: "button_new square GMHseltroopbutton",
                style: "position:absolute; right:0; top:13px; background-position:-22px 0;",
                tim: i
            }).click(function() {
                MH.commandsListDrag = !0,
                    $("#GMHseltroop").length || (o = $(this).attr("id"),
                                                 i = $(this).attr("tim"),
                                                 $(this).parent().append($("<div/>", {
                    id: "GMHseltroop",
                    style: "position:absolute; left:-1px; top:4px; cursor:pointer;  z-index:1000"
                }).append(mhGui.Border().append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/C.png",
                    onclick: 'MH.SelTroop(this,"C")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X1.png",
                    onclick: 'MH.SelTroop(this,"X1")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X2.png",
                    onclick: 'MH.SelTroop(this,"X2")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X3.png",
                    onclick: 'MH.SelTroop(this,"X3")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X4.png",
                    onclick: 'MH.SelTroop(this,"X4")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X5.png",
                    onclick: 'MH.SelTroop(this,"X5")'
                })).append($("<img/>", {
                    ref: o,
                    tim: i,
                    src: MH.Home + "/m/X6.png",
                    onclick: 'MH.SelTroop(this,"X6")'
                })))))
            }).appendTo(this)))
        }),
                             setTimeout(MH.CmdListIRQ, 200))
    }
        ,
        MH.SelTroop = function(e, t) {
        var n = $(e).attr("ref")
        , e = $(e).attr("tim");
        if ("C" == t) {
            if (!(n in MH.attTownList))
                return void $("#GMHseltroop").remove();
            delete MH.attTownList[n],
                $("#GMHseltroop").parent().find(":first").css("background-image", "url(" + MH.Home + "m/C.png)"),
                $("#GMHseltroop").parent().find(":first").css("backgroundPosition", "0 0")
        } else
            MH.attTownList[n] = {},
                MH.attTownList[n].at = t,
                MH.attTownList[n].ti = e;
        $("#GMHseltroop").remove(),
            MH.SavTroop()
    }
        ,
        MH.SavTroop = function() {
        var e, t = Timestamp.server();
        for (e in MH.attTownList)
            "undefined" == e && delete MH.attTownList[e],
                MH.attTownList[e].ti <= t && delete MH.attTownList[e];
        MH.Storage("cMH_attTownList", MH.attTownList),
            console.log(JSON.stringify(MH.attTownList)),
            console.log("Serwer_time= " + t)
    }
        ,
        MH.bbCodeButtions_ActivePage = 1,
        MH.bbCodeButtions_TextArea = "textarea",
        MH.bbCodeButtions = function(t, n) {
        var i = t.cJQ;
        i.find(".bb_button_wrapper").length && (i.find("#MH_EmoBut").length || (MH.bbCodeButtions_TextArea = n,
                                                                                MH.Set.loadCnv && (MH.RepClipboard.length < 1 ? i.find(".bb_button_wrapper").append($("<a/>", {
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -44px -46px rgba(0, 0, 0, 0) "
        }).mousePopup(new MousePopup(MH.Lang.insert + " " + MH.Lang.repPla))) : i.find(".bb_button_wrapper").append($("<a/>", {
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -44px 0px rgba(0, 0, 0, 0) "
        }).mouseout(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -44px 0px rgba(0, 0, 0, 0)"
        }).click(function() {
            MH.TxtaIns(MH.RepClipboard, i.find(n)[0]),
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)"
        }).mousePopup(new MousePopup(MH.Lang.insert + " " + MH.Lang.repPla))),
                                                                                                   i.find(".bb_button_wrapper").append($("<a/>", {
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -154px 0px rgba(0, 0, 0, 0) "
        }).mouseout(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -154px 0px rgba(0, 0, 0, 0)"
        }).click(function() {
            var e = MH.RepClipboard;
            MH.rep.Generate(null, "situation", !1),
                "" != MH.RepClipboard && (MH.TxtaIns(MH.RepClipboard, i.find(n)[0]),
                                          MH.RepClipboard = e,
                                          this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)")
        }).mousePopup(new MousePopup(MH.Lang.insert + " " + MH.Lang.situation + " " + MH.GLng.Report)))),
                                                                                i.find(".bb_button_wrapper").append($("<a/>", {
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -242px 0px rgba(0, 0, 0, 0) "
        }).click(function() {
            MH.paste_jqC = i,
                MH.paste_txta = n,
                MH.MiniForm("gif", "")
        }).mousePopup(new MousePopup(MH.Lang.insert + " " + MH.Lang.insGif))),
                                                                                i.find(".bb_button_wrapper").append($("<a/>", {
            id: "MH_EmoBut",
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -88px 0px rgba(0, 0, 0, 0) "
        }).click(function() {
            var e;
            i.find("#MH_EmotsPopup").length ? i.find("#MH_EmotsPopup").remove() : ($("#MH_EmotsPopup").remove(),
                                                                                   MH.bbCodeButtionsBox(t, n),
                                                                                   e = $(this).offset().top,
                                                                                   e -= i.offset().top,
                                                                                   e += 50,
                                                                                   i.find("#MH_EmotsPopup").css("top", e + "px"),
                                                                                   i.find("#MH_EmotsPopup").show())
        }).mousePopup(new MousePopup(MH.Lang.insert + " " + MH.Lang.insEmo)))))
    }
        ,
        MH.bbCodeButtionsBox = function(e, i) {
        var o = e.cJQ
        , a = 0;
        function t(e, t, n) {
            return a++,
                $("<li/>").append($("<a/>", {
                class: "submenu_link",
                rel: "O",
                nr: a
            }).click(function() {
                MH.bbCodeButtions_ActivePage = $(this).attr("nr"),
                    o.find("li a.submenu_link").removeClass("active"),
                    $(this).addClass("active"),
                    o.find("#emots_poup_content").html(""),
                    $.each(n, function(e, t) {
                    (e = MH.Home + "e/" + t).indexOf(".png") < 1 && (e += ".gif"),
                        o.find("#emots_poup_content").append($("<img/>", {
                        src: e,
                        title: ""
                    }).mouseover(function() {
                        this.style.backgroundColor = "#C0C0C0"
                    }).mouseout(function() {
                        this.style.backgroundColor = "transparent"
                    }).click(function() {
                        MH.TxtaIns("[img]" + $(this).attr("src") + "[/img]", o.find(i)[0]),
                            o.find("#MH_EmotsPopup").remove()
                    }))
                })
            }).append($("<span/>", {
                class: "left"
            }).append($("<span/>", {
                class: "right"
            }).append($("<span/>", {
                class: "middle"
            }).html(t)))))
        }
        o.find("#MH_EmotsPopup").length || (o.append($("<div/>", {
            id: "MH_EmotsPopup",
            style: "display:none;z-index:5000;"
        }).append($("<div/>", {
            class: "bbcode_box top_left",
            style: 'top:-27px; height:2px; background:url("' + MH.GameImg + '/images/game/popup/top_left.png") rgba(0, 0, 0, 0);'
        })).append($("<div/>", {
            class: "bbcode_box top_right",
            style: 'top:-27px; height:2px; background:url("' + MH.GameImg + '/images/game/popup/top_right.png") rgba(0, 0, 0, 0);'
        })).append($("<div/>", {
            class: "bbcode_box top_center",
            style: "top:-27px; height:2px;"
        })).append($("<div/>", {
            class: "bbcode_box middle_left",
            style: "top:-25px; width:3px;"
        })).append($("<div/>", {
            class: "bbcode_box middle_right",
            style: "top:-25px; width:7px;"
        })).append($("<div/>", {
            class: "menu_wrapper closable",
            style: "top:-25px; left: -4px; width:100%; background-color:#282218;"
        }).append($("<ul/>", {
            class: "menu_inner",
            style: "width: 508px;"
        }).prepend(t(0, '<img src="' + MH.Home + 'gui/et1a.gif"</img>', Emots.Emoty1)).prepend(t(0, '<img src="' + MH.Home + 'gui/et2a.gif"</img>', Emots.Emoty2)).prepend(t(0, '<img src="' + MH.Home + 'gui/et3a.gif"</img>', Emots.Emoty3)).prepend(t(0, '<img src="' + MH.Home + 'gui/et3b.gif"</img>', Emots.Emoty3b)).prepend(t(0, '<img src="' + MH.Home + 'gui/et3c.gif"</img>', Emots.Emoty3c)).prepend(t(0, '<img src="' + MH.Home + 'gui/et4a.gif"</img>', Emots.Emoty4)).prepend(t(0, '<img src="' + MH.Home + 'gui/et5a.gif"</img>', Emots.Emoty5)).prepend(t(0, '<img src="' + MH.Home + 'gui/et5b.gif"</img>', Emots.Emoty5b)).prepend(t(0, '<img src="' + MH.Home + 'gui/et6a.gif"</img>', Emots.Emoty6)).prepend(t(0, '<img src="' + MH.Home + 'gui/et6b.gif"</img>', Emots.Emoty6b)).prepend(t(0, '<img src="' + MH.Home + 'gui/et7a.gif"</img>', Emots.Emoty7)).prepend(t(0, '<img src="' + MH.Home + 'gui/et8a.gif"</img>', Emots.Emoty8)).prepend(t(0, '<img src="' + MH.Home + 'gui/et9a.gif"</img>', Emots.Emoty9)))).append($("<div/>", {
            class: "bbcode_box middle_center",
            style: "height:" + MH.GuiUst.EmoHeight + "px;"
        }).append($("<div/>", {
            class: "bbcode_box top_left"
        })).append($("<div/>", {
            class: "bbcode_box top_right"
        })).append($("<div/>", {
            class: "bbcode_box top_center"
        })).append($("<div/>", {
            class: "bbcode_box bottom_center"
        })).append($("<div/>", {
            class: "bbcode_box bottom_right"
        })).append($("<div/>", {
            class: "bbcode_box bottom_left"
        })).append($("<div/>", {
            class: "bbcode_box middle_left"
        })).append($("<div/>", {
            class: "bbcode_box middle_right"
        })).append($("<div/>", {
            class: "bbcode_box content clearfix",
            style: "overflow-y:scroll; height:100%;"
        }).append($("<div/>", {
            id: "emots_poup_content",
            style: "width:484px;"
        })))).css({
            position: "absolute",
            top: "48px",
            left: "255px"
        })),
                                            e = o.find("#MH_EmotsPopup .menu_wrapper ul li").length,
                                            o.find("#MH_EmotsPopup .menu_wrapper ul li a").eq(e - MH.bbCodeButtions_ActivePage).click(),
                                            (e = o.find("#MH_EmotsPopup .bottom_center")).find("a.button").length || (e.css("text-align", "center"),
                                                                                                                      e.append($("<a/>", {
            href: "#",
            class: "button",
            style: "cursor:s-resize; top:-2px;"
        }).append($("<div/>", {
            style: "float:left; width:2px; height:14px; background:url('" + MH.Home + "gui/splitter_horY.png') 0px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:100px; height:14px; background:url('" + MH.Home + "gui/splitter_horY.png') -2px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:2px; height:14px; background:url('" + MH.Home + "gui/splitter_horY.png') -102px 0px;"
        }))).mousedown(function(e) {
            if ($(document).mousemove(function(e) {
                MH.mousemove(e)
            }),
                !MH.drag.state)
                return MH.drag.x = e.pageX,
                    MH.drag.y = e.pageY,
                    MH.drag.state = !0,
                    MH.drag.func = function(e, t, n, i) {
                    var a = o.find("#MH_EmotsPopup .middle_center").height();
                    isNaN(a) && (a = 170),
                        (i += a) < 70 && (i = 70),
                        600 < i && (i = 600),
                        o.find("#MH_EmotsPopup .middle_center").css("height", i + "px"),
                        MH.GuiUst.EmoHeight = i
                }
                    ,
                    !(MH.drag.endfunc = function() {
                    MH.Storage(MH.GuiUstCookie, MH.GuiUst)
                }
                     )
        })))
    }
        ,
        MH.YouTubeLinks = function(e, n) {
        var i, a, o;
        (MH.Set.YTW || MH.Set.YTR) && (i = "youtube.com",
                                       a = "youtu.be",
                                       MH.Set.YTR ? e.find("a.bbcodes_url").each(function(e, t) {
            (-1 < $(t).attr("data-href").indexOf(i) || -1 < $(t).attr("data-href").indexOf(a)) && (o = (o = (o = $(t).attr("data-href")).replace(a + "%2F", "www." + i + "%2Fwatch%3Fv%3D")).substr(o.indexOf("url=") + 4),
                                                                                                   o = mhUtl.PlayYouTube_HTML(o, "0", n),
                                                                                                   $(t).after($("<p/>", {
                class: "MHbbcADD"
            }).html(o)))
        }) : MH.Set.YTW && e.find("a.bbcodes_url").each(function(e, t) {
            (-1 < $(t).attr("data-href").indexOf(i) || -1 < $(t).attr("data-href").indexOf(a)) && (o = (o = (o = $(t).attr("data-href")).replace(a + "%2F", "www." + i + "%2Fwatch%3Fv%3D")).substr(o.indexOf("url=") + 4),
                                                                                                   $(t).after($("<spam/>", {
                class: "MHbbcADD",
                style: "color:#4040d0; cursor:pointer;",
                v: o
            }).mouseover(function() {
                this.style.color = "#8080FF"
            }).mouseout(function() {
                this.style.color = "#4040D0"
            }).click(function() {
                mhUtl.PlayYouTube($(this).attr("v"))
            }).html("<b>" + $(t).html() + "</b>")),
                                                                                                   $(t).hide())
        }))
    }
        ,
        MH.AlarmsURLs = ["http://grmh.pl/sound/alarm.mp3", "http://grmh.pl/sound/alarm1.mp3", "http://grmh.pl/sound/alarm2.mp3", "http://grmh.pl/sound/alarm3.mp3", "http://grmh.pl/sound/Awolnation - Run.mp3", "http://grmh.pl/sound/Swierszcz.mp3", "http://grmh.pl/sound/DJ VISAGE - formula 1 remix.mp3", "http://grmh.pl/sound/Motorhead - The Game.mp3", "http://grmh.pl/sound/Styles Of Beyond - Nine Thou.mp3", "http://grmh.pl/sound/Grupa JNA - Samo Jedan Klub.mp3", "http://grmh.pl/sound/Mugison - Chicken Song  -  [Geco Remix].mp3", "http://grmh.pl/sound/The Dunk Squad.mp3", "http://grmh.pl/sound/Star Wars - The Imperial March.mp3", "http://greenmp3.pl/dzwonki/1535.mp3", "http://greenmp3.pl/dzwonki/414.mp3", "http://greenmp3.pl/dzwonki/2288.mp3", "http://greenmp3.pl/dzwonki/1248.mp3", "http://greenmp3.pl/dzwonki/1144.mp3", "http://greenmp3.pl/dzwonki/28284.mp3", "http://greenmp3.pl/dzwonki/4663.mp3", "http://greenmp3.pl/dzwonki/526.mp3", "http://greenmp3.pl/dzwonki/8157.mp3", "http://greenmp3.pl/dzwonki/626.mp3", "http://greenmp3.pl/dzwonki/8348.mp3", "http://grmh.pl/sound/Angerfist-incoming(ringtone).mp3", "http://grmh.pl/sound/ACDC-Thunderstruck.mp3", "http://grmh.pl/sound/Awolnation-Sail.mp3", "http://grmh.pl/sound/DVBBS&Borgeous-TSUNAMI_(Original_Mix).mp3", "http://grmh.pl/sound/Led_Zepellin-Whole_Lotta_Love.mp3", "http://grmh.pl/sound/OxmoPuccino-JeSuisCoolMaisPasSympa(ins).mp3", "http://grmh.pl/sound/Pillar-Frontline.mp3", "http://grmh.pl/sound/Ryan_Taubert-Absolution.mp3", "http://grmh.pl/sound/VibeTribe&Spade-BadHabbits(BCRemix).mp3", "http://grmh.pl/sound/Within_Temptation-What_Have_You_Done_Mix.mp3", "http://grmh.pl/sound/Yanni_Violin_Vs_Saxophone.mp3", "http://www.youtube.com/watch?v=MssoLlPrhMo", "http://www.youtube.com/watch?v=SLnq95KWAxA", "http://www.youtube.com/watch?v=nv76KvFV748", "https://www.youtube.com/watch?v=bYOkOE8REXU", "No Sound"],
        MH.AlarmStart = function() {
        var e;
        MH.AlarmActive || (document.title = "!!! " + document.title,
                           $("#favicon").remove(),
                           $("head").append('<link href="' + MH.Home + 'gui/gicoatt.ico" id="favicon" rel="shortcut icon">'),
                           e = isNaN(MH.Set.alarmSel) ? "http://" + MH.Set.alarmSel : MH.AlarmsURLs[MH.Set.alarmSel],
                           MH.PlaySound(e, "AAlarm", MH.Set.alarmLoop),
                           MH.AlarmActive = !0,
                           $("#MH_logo").html(""),
                           $("#MH_logo").append($("<img/>", {
            style: "position:absolute; left:16px; top:8px;",
            src: MH.Home + "gui/alarm.gif"
        })).append($("<a/>", {
            class: "last_report game_arrow_left",
            href: "#",
            style: "top:38px;"
        }).click(function() {
            document.getElementById("MH_AAlarm").volume -= .05
        })).append($("<a/>", {
            class: "next_report game_arrow_right",
            href: "#",
            style: "top:38px;"
        }).click(function() {
            document.getElementById("MH_AAlarm").volume += .05
        })).append($("<a/>", {
            class: "game_arrow_delete",
            href: "#",
            style: "top:40px;"
        }).click(function() {
            MH.TimerAlarmAct = !1,
                MH.AlarmStop()
        })))
    }
        ,
        MH.AlarmStop = function() {
        $("#MH_logo").html(""),
            $("#MH_logo").append($("<img/>", {
            style: "position:absolute; left:1px; top:3px;",
            src: MH.Home + "gui/logo.gif"
        })),
            MH.StopSound("AAlarm"),
            MH.AlarmActive = !1,
            document.title = MH.DB.worldID + " " + MH.DB.wName + " - " + Game.townName,
            $("#favicon").remove(),
            $("head").append('<link href="' + MH.Home + 'gui/gico.ico" id="favicon" rel="shortcut icon">')
    }
        ,
        MH.setAralm = function() {
        MH.tAlarmSel = -1,
            isNaN(MH.Set.alarmSel) || (MH.tAlarmSel = MH.Set.alarmSel),
            MH.tAlarmLoop = MH.Set.alarmLoop,
            MH.wSetAlarm = MH.wndCreate("AttacksAlarms", MH.Lang.set9 + " - " + MH.Lang.HELPTAB4, 650, 544);
        var e = $("<tbody/>", {
            id: "MH_SndList"
        })
        , t = 0;
        for (var n in MH.AlarmsURLs)
            MH.AlarmsURLs.hasOwnProperty(n) && ((a = t % 2 ? $("<tr>", {
                i: n,
                class: "game_table_even top"
            }) : $("<tr>", {
                i: n,
                class: "game_table_odd top"
            })).append("<td>" + (t + 1)),
                                                a.append($("<td>", {
                id: "asel_" + n,
                i: n
            }).append("<img src='" + MH.Home + "medias/images/cbb0.gif'>").click(function() {
                -1 < MH.tAlarmSel && $("#asel_" + MH.tAlarmSel).html("<img src='" + MH.Home + "medias/images/cbb0.gif'>"),
                    $(this).html("<img src='" + MH.Home + "medias/images/cbb1.gif'>"),
                    MH.tAlarmSel = $(this).attr("i"),
                    $("#HM_ACTUAL").val(MH.AlarmsURLs[MH.tAlarmSel].replace("http://", "").replace("https://", ""))
            })),
                                                a.append("<td>" + MH.AlarmsURLs[n]).append($("<a/>", {
                href: "#",
                class: "plybtn",
                style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -198px 0px rgba(0, 0, 0, 0) "
            }).click(function() {
                $("#MH_SndList tr a.plybtn").css({
                    background: "url('" + MH.Home + "medias/images/but.png') -198px 0px"
                }),
                    this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -176px -46px rgba(0, 0, 0, 0)",
                    MH.PlaySound(MH.AlarmsURLs[$(this).parent().attr("i")], "Preview", MH.tAlarmLoop)
            })),
                                                a.append($("<a/>", {
                href: "#",
                style: "margin:0 3px 0 0; width:22px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -198px -46px rgba(0, 0, 0, 0) "
            }).click(function() {
                $("#MH_SndList tr a.plybtn").css({
                    background: "url('" + MH.Home + "medias/images/but.png') -198px 0px"
                }),
                    MH.StopSound("Preview")
            })),
                                                e.append(a),
                                                t++);
        var i = MH.Set.alarmSel;
        isNaN(i) || (i = MH.AlarmsURLs[i].replace("http://", ""));
        var i = mhGui.Border().append(MH.Lang.set9a + ":<br>").append("<b>http://</b>").append($("<input/>", {
            id: "HM_ACTUAL",
            class: "inp500",
            maxlength: "125",
            type: "text",
            style: "text-align:left;",
            val: i
        })).append($("<a/>", {
            href: "#",
            style: "margin:0 32px 0 0; width:22px; height:23px; float:right; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -198px -46px rgba(0, 0, 0, 0) "
        }).click(function() {
            MH.StopSound("Preview")
        })).append($("<a/>", {
            href: "#",
            style: "margin:0 3px 0 0; width:22px; height:23px; float:right; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -198px 0px rgba(0, 0, 0, 0) "
        }).mouseout(function() {
            this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -198px 0px rgba(0, 0, 0, 0)"
        }).click(function() {
            MH.PlaySound("http://" + $(HM_ACTUAL).val(), "Preview", MH.tAlarmLoop),
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)"
        })).append("<br>")
        , a = "0";
        MH.tAlarmLoop && (a = "1"),
            i.append($("<a/>", {
            href: "#",
            sel: a
        }).click(function() {
            "1" == this.getAttribute("sel") ? (this.setAttribute("sel", "0"),
                                               MH.tAlarmLoop = !1) : (this.setAttribute("sel", "1"),
                                                                      MH.tAlarmLoop = !0),
                this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
        }).append($("<img/>", {
            src: MH.Home + "medias/images/cb" + a + ".gif",
            style: "position:relative; top:2px;"
        })).append(" " + MH.Lang.set9b + "<br><br>")),
            i.append(mhGui.Button(MH.Lang.PostTxt).click(function() {
            MH.Call("snd", {
                snd: $("#HM_ACTUAL").val()
            }, function() {
                HumanMessage.success(MH.Lang.PostOk),
                    $("#ht-TAB5").click()
            }, function() {
                HumanMessage.error(MH.Lang.PostFail)
            })
        })).append(mhGui.Button(MH.Lang.repgen).css("float", "right").click(function() {
            MH.StopSound("Preview"),
                -1 < MH.tAlarmSel ? MH.Set.alarmSel = MH.tAlarmSel : MH.Set.alarmSel = $("#HM_ACTUAL").val(),
                MH.Set.alarmLoop = MH.tAlarmLoop,
                MH.Storage(MH.SetCookie, MH.Set),
                MH.wSetAlarm.close(),
                MH.wSetAlarm = void 0
        })).append($("<div/>", {
            class: "game_inner_box ranking_table"
        }).append($("<div/>").css({
            "overflow-y": "auto",
            "overflow-x": "hidden"
        }).append($("<table>", {
            class: "game_header bold",
            style: "width:100%; border-bottom: 1px solid #D0BE97;"
        }).append($("<thead>").append($("<tr>").append("<th>------------------\x3e " + MH.Lang.set9c + " <------------------")))).append($("<div/>", {
            id: "AttacksAlarms_table_wrapper"
        }).css("max-height", "346px").append($("<table>", {
            id: "citys_info_table_scroll",
            class: "game_table",
            style: "overflow-y: auto; overflow-x: hidden;",
            cellspacing: "0"
        }).append(e))))),
            i.append('<div class="game_border_top"></div>'),
            MH.wSetAlarm.appendContent(i, 544),
            MH.ev.WAR("AttacksAlarms", "OwnWnds", ""),
            -1 < MH.tAlarmSel && $("#asel_" + MH.tAlarmSel).html("<img src='" + MH.Home + "medias/images/cbb1.gif'>"),
            $("#HM_ACTUAL").focusout(function() {
            var e = this.value;
            e = (e = (e = (e = (e = (e = (e = e.replace("https://www.", "")).replace("http://www.", "")).replace("https://", "")).replace("http://", "")).replace("www.", "")).replace("youtu.be/", "youtube.com/watch?v=")).replace(/\s+/g, ""),
                this.value = e,
                -1 < MH.tAlarmSel && $("#asel_" + MH.tAlarmSel).html("<img src='" + MH.Home + "medias/images/cbb0.gif'>"),
                MH.tAlarmSel = -1
        })
    }
        ,
        MH.PlaySound = function(e, t, n) {
        var i;
        if (MH.StopSound(t),
            -1 < (e = e.replace("http://grmh.pl/", "https://grmh.pl/")).indexOf("youtube.com") && (e = e.replace("http://", "https://")),
            -1 < e.indexOf("youtube.com"))
            return i = mhUtl.PlayYouTube_HTML(e, "1"),
                void $("#MH_hidden").append($("<spam/>", {
                id: "MHP_" + t,
                YT: "true"
            }).html(i));
        $("#ui_box").append($("<audio/>", {
            id: "MHP_" + t,
            YT: "false"
        }).html('<source src="' + e + '" type="audio/mpeg" /><embed hidden="true" loop="true" src="' + e + '"/>')),
            n && document.getElementById("MHP_" + t).addEventListener("ended", function() {
            this.currentTime = 0,
                this.play()
        }, !1),
            document.getElementById("MHP_" + t).play()
    }
        ,
        MH.StopSound = function(e) {
        var t = "#MHP_" + e;
        $(t).length && ("true" == !$(t).attr("YT") && document.getElementById("MHP_" + e).pause(),
                        $(t).remove())
    }
        ,
        MH.typUnits = {
        1: ["defAtt", "losAtt"],
        2: ["defDef", "losDef"]
    },
        MH.WallReset = function() {
        try {
            var a = {
                defAtt: {},
                losAtt: {},
                defDef: {},
                losDef: {}
            };
            $.each($("div#building_wall li.odd"), function(i, e) {
                0 < i && ($.each(e.getElementsByClassName("list_item_left"), function(n, e) {
                    $.each(e.getElementsByClassName("wall_report_unit"), function(e, t) {
                        unitName = MH.htm.UnitId(t),
                            unitKill = t.getElementsByClassName("place_unit_black")[0].innerHTML,
                            a[MH.typUnits[i][n]][unitName] = unitKill
                    })
                }),
                          $.each(e.getElementsByClassName("list_item_right"), function(n, e) {
                    $.each(e.getElementsByClassName("wall_report_unit"), function(e, t) {
                        unitName = MH.htm.UnitId(t),
                            unitKill = t.getElementsByClassName("place_unit_black")[0].innerHTML,
                            a[MH.typUnits[i][n + 1]][unitName] = unitKill
                    })
                }))
            }),
                a.date = $("#ui_box .server_time_area").html().clear(),
                MH.Storage(MH.CookieWall, a),
                HumanMessage.success(MH.Lang.MSGHUMANOK)
        } catch (e) {
            HumanMessage.error(MH.Lang.MSGHUMANERROR)
        }
    }
        ,
        MH.WallReplace = function() {
        var a, e, o = MH.Storage(MH.CookieWall);
        null != o && (null == o.date && (o.date = "?"),
                      e = $("div#building_wall.game_inner_box .game_border .game_header"),
                      a = e.html(),
                      a += " " + o.date,
                      e.html(a),
                      $("div#building_wall.game_inner_box div.wall_report_unit").append($("<span/>", {
            class: "place_unit_black bold HMoleDiff"
        }).html(" ")).append($("<span/>", {
            class: "place_unit_white bold HMoleDiff"
        }).html(" ")),
                      $.each($("div#building_wall li.odd"), function(i, e) {
            0 < i && ($.each(e.getElementsByClassName("list_item_left"), function(n, e) {
                $.each(e.getElementsByClassName("wall_report_unit"), function(e, t) {
                    t.getElementsByClassName("place_unit_black")[0].style.display = "none",
                        t.getElementsByClassName("place_unit_white")[0].style.display = "none",
                        unitName = MH.htm.UnitId(t),
                        unitKill = t.getElementsByClassName("place_unit_black")[0].innerHTML,
                        unitSave = o[MH.typUnits[i][n]][unitName],
                        unitDiff = unitKill,
                        null != unitSave && (unitDiff = unitKill - unitSave),
                        a = 0 != unitDiff ? unitDiff : "0",
                        "0" != (t.getElementsByClassName("place_unit_black bold HMoleDiff")[0].innerHTML = a) && (t.getElementsByClassName("place_unit_white bold HMoleDiff")[0].innerHTML = a)
                })
            }),
                      $.each(e.getElementsByClassName("list_item_right"), function(n, e) {
                $.each(e.getElementsByClassName("wall_report_unit"), function(e, t) {
                    t.getElementsByClassName("place_unit_black")[0].style.display = "none",
                        t.getElementsByClassName("place_unit_white")[0].style.display = "none",
                        unitName = MH.htm.UnitId(t),
                        unitKill = t.getElementsByClassName("place_unit_black")[0].innerHTML,
                        unitSave = o[MH.typUnits[i][n + 1]][unitName],
                        unitDiff = unitKill,
                        null != unitSave && (unitDiff = unitKill - unitSave),
                        a = 0 != unitDiff ? unitDiff : "0",
                        "0" != (t.getElementsByClassName("place_unit_black bold HMoleDiff")[0].innerHTML = a) && (t.getElementsByClassName("place_unit_white bold HMoleDiff")[0].innerHTML = a)
                })
            }))
        }))
    }
        ,
        MH.MapAdds = function(e) {
        null != typeof MapTiles.updateTownsForCurrentPosition ? ($("#map_move_container #mhMapSym").length && $("#map_move_container #mhMapSym").remove(),
                                                                 $("#map_move_container").append($("<div/>", {
            id: "mhMapSym",
            style: "position:absolute; top:0px; left:0px; z-index:5;"
        })),
                                                                 Function.prototype.MHclone = function() {
            function e() {
                return n.apply(this, arguments)
            }
            var t, n = this;
            for (t in this)
                this.hasOwnProperty(t) && (e[t] = this[t]);
            return e
        }
                                                                 ,
                                                                 MapTiles.updateTownsForCurrentPositionORG = MapTiles.updateTownsForCurrentPosition.MHclone(),
                                                                 _log(MapTiles.updateTownsForCurrentPosition),
                                                                 MapTiles.updateTownsForCurrentPositionMHEX = function() {
            var e = this.mapData.getData(["towns", "wonders", "islands"]);
            0 != MH.Set.theme ? this.drawIslands_Winter(e.islands) : this.drawIslands(e.islands),
                this.updateTowns(e.towns),
                this.updateWonders(e.wonders),
                this.updateIslandInfos(e.islands),
                this.updateAttackSpots(),
                MH.Symbols(),
                MH.Subtitles()
        }
                                                                 ,
                                                                 MapTiles.isDominationIsland = function(e, t) {
            var n, i, a = this.mapData.getData(["islands"]).towns;
            for (n in a)
                if (a.hasOwnProperty(n)) {
                    if ("undefined" == (i = a[n]).type)
                        continue;
                    if ("domination_area_marker" != i.type)
                        continue;
                    if (i.x == e && i.y == t)
                        return !0
                }
            return !1
        }
                                                                 ,
                                                                 MH.Symbols(),
                                                                 MH.Subtitles(),
                                                                 MapTiles.updateTownsForCurrentPosition = MapTiles.updateTownsForCurrentPositionMHEX) : setTimeout("MH.MapAdds()", 1e3)
    }
        ,
        MH.MapGrid = function() {
        var e, t, n = WMap.mapX - 9 << 7, i = WMap.mapY - 10 << 7, a = 23 + (WMap.size.x >> 7) << 7, o = 23 + (WMap.size.y >> 7) << 7, r = n + a, l = i + o;
        if (MH.gridPX = WMap.mapX - 9,
            MH.gridPY = WMap.mapY - 10,
            !MH.Set.mapGrid)
            return $("#mh_Grid").remove(),
                $("#mh_CoordsX").remove(),
                void $("#mh_CoordsY").remove();
        for (var s = $("<div/>", {
            id: "mh_Grid"
        }), d = n; d <= r; d += 128)
            s.append($("<div/>", {
                class: "gmGrdCY",
                style: "left:" + d + "px; top:" + i + "px; height:" + o + "px;"
            }));
        for (e = i; e <= l; e += 128)
            s.append($("<div/>", {
                class: "gmGrdCX",
                style: "left:" + n + "px; top:" + e + "px; width:" + a + "px;"
            }));
        for (d = 1280 * Math.floor(n / 1280); d <= r; d += 1280)
            s.append($("<div/>", {
                class: "gmGrdBY",
                style: "left:" + d + "px; top:" + i + "px; height:" + o + "px;"
            }));
        for (e = 1280 * Math.floor(i / 1280); e <= l; e += 1280)
            s.append($("<div/>", {
                class: "gmGrdBX",
                style: "left:" + n + "px; top:" + e + "px; width:" + a + "px;"
            }));
        for (d = 12800 * Math.floor(n / 12800); d <= r; d += 12800)
            s.append($("<div/>", {
                class: "gmGrdAY",
                style: "left:" + d + "px; top:" + i + "px; height:" + o + "px;"
            }));
        for (e = 12800 * Math.floor(i / 12800); e <= l; e += 12800)
            s.append($("<div/>", {
                class: "gmGrdAX",
                style: "left:" + n + "px; top:" + e + "px; width:" + a + "px;"
            }));
        for ($("#mh_Grid").length && $("#mh_Grid").remove(),
             $("#mh_CoordsX").length && $("#mh_CoordsX").remove(),
             $("#mh_CoordsY").length && $("#mh_CoordsY").remove(),
             $("#map_move_container").append(s),
             t = $("<div/>", {
            id: "mh_CoordsX",
            style: "bottom:45px; top:" + (WMap.size.y - 60) + "px; position:absolute; z-index:2"
        }),
             d = n; d <= r; d += 128)
            t.append($("<div/>", {
                style: "left:" + (d - n - 19) + "px; top:0px;  position:absolute; color:#FFFFFF;"
            }).html("|<br>X:" + (2 + (d >> 7)) + "<br>|"));
        for ($("#map").append(t),
             t = $("<div/>", {
            id: "mh_CoordsY",
            style: "right:190px; top:0px; position:absolute; z-index:2"
        }),
             e = i; e <= l; e += 128)
            t.append($("<div/>", {
                style: "left:0px; top:" + (e - i - 8) + "px;  position:absolute; color:#FFFFFF;"
            }).html("-Y:" + (1 + (e >> 7)) + "-"));
        $("#map").append(t)
    }
        ,
        MH.MapGrid_coords = function() {
        $("#mh_CoordsX").length && $("#mh_CoordsX").css({
            left: 0 - (WMap.scroll.x - (MH.gridPX << 7)),
            bottom: 45
        }),
            $("#mh_CoordsY").length && $("#mh_CoordsY").css({
            top: 0 - (WMap.scroll.y - (MH.gridPY << 7)),
            right: 190
        })
    }
        ,
        MH.wSYM = null,
        MH.wSYMnfo = null,
        MH.wSYMx = MH.wSYMy = 0,
        MH.wSYMid = MH.wSYMname = MH.wSYMally = 0,
        MH.Symbols = function() {
        if (MH.Set.MS) {
            $("#map_move_container #mhMapSym").length || $("#map_move_container").append($("<div/>", {
                id: "mhMapSym",
                style: "position:absolute; top:0px; left:0px; z-index:5;"
            }));
            var e, t = MapTiles, n = t.tile.x - (t.tileBuffer.x >> 1), i = t.tile.y - (t.tileBuffer.y >> 1), a = t.tileCount.x, o = t.tileCount.y, r = t.mapData.getData(n, i, a, o, ["towns"]).towns;
            for (e in r)
                r.hasOwnProperty(e) && r[e].hasOwnProperty("player_name") && "" != r[e].player_name && (r[e].player_id in MH.GuiUst.SymPlay ? l(r[e], MH.GuiUst.SymPlay[r[e].player_id], r[e].player_name) : r[e].hasOwnProperty("alliance_id") && r[e].alliance_id in MH.GuiUst.SymAlly && l(r[e], MH.GuiUst.SymAlly[r[e].alliance_id], r[e].alliance_name))
        } else
            $("#map_move_container #mhMapSym").length && $("#map_move_container #mhMapSym").remove();
        function l(e, t) {
            var n, i, a = {
                sw: [50, -5],
                se: [24, -14],
                ne: [-5, 3],
                nw: [40, -5]
            }, o = {
                sw: [50, -17],
                se: [24, -27],
                ne: [-5, -10],
                nw: [40, -18]
            }, r = {
                sw: [-2, -6],
                se: [50, -6],
                ne: [49, -4],
                nw: [0, -1]
            }, l = $("#map_towns a#town_" + e.id);
            if (l.length) {
                if (!$("#mhMapSym #sym_" + e.id).length) {
                    switch (l = l.position(),
                            n = parseInt(l.left),
                            i = parseInt(l.top),
                            t.t) {
                        default:
                            n += a[e.dir][0],
                                i += a[e.dir][1];
                            break;
                        case 1:
                            n += o[e.dir][0],
                                i += o[e.dir][1];
                            break;
                        case 2:
                            n += r[e.dir][0],
                                i += r[e.dir][1]
                    }
                    $("#mhMapSym").append($("<div/>", {
                        id: "sym_" + e.id,
                        style: "display:block; z-index:3; position:absolute; left:" + n + "px; top:" + i + "px; width:20px; height:20px; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + t.x + "px -" + t.y + "px"
                    }))
                }
            } else
                $("#mhMapSym #sym_" + e.id).remove()
        }
    }
        ,
        MH.SymbolsMini = function() {
        var e, t, n, i, a, o, r, l, s, d, p, c, m;
        if (MH.Set.MS && $("#minimap").length) {
            WMap,
                MapTiles.tileSize;
            if (u = {
                x: .2 * -(WMap.scroll.x + (WMap.size.x >> 1) + MapTiles.tileSize.x),
                y: .2 * -(WMap.scroll.y + (WMap.size.y >> 1) + MapTiles.tileSize.y)
            },
                u = $("#minimap").position(),
                0 != (u = (e = require("map/helpers")).pixel2Map(-u.left / .2, -u.top / .2)).x && 0 != u.y) {
                e = e.pixel2Map($("#minimap_canvas").width() / .2, $("#minimap_canvas").height() / .2),
                    l = {
                    x: u.x,
                    y: u.y,
                    w: e.x,
                    h: e.y
                };
                for (var u = (s = WMap.mapData.getCoveredChunks(l.x, l.y, l.w, l.h)).length; u--; )
                    if (d = WMap.mapData.getChunk(s[u].x, s[u].y)) {
                        for (e in p = d.islands,
                             c = {},
                             d.towns)
                            "inv_spo" === (t = d.towns[e]).type || t.invitation_spot || (c[t.x + "_" + t.y] || (c[t.x + "_" + t.y] = []),
                                                                                         c[t.x + "_" + t.y].push(t));
                        if (n = "mini_chunk_" + d.chunk.x + "_" + d.chunk.y,
                            document.getElementById(n))
                            for (t = p.length; t--; )
                                if (n = "mini_i" + p[t].x + "_" + p[t].y,
                                    (i = document.getElementById(n)) && null == i.getAttribute("mhUpd")) {
                                    var g, f = d.wonders;
                                    for (g in f)
                                        if (f.hasOwnProperty(g)) {
                                            if (!mhCNST.WorldWonders.hasOwnProperty(f[g].wt))
                                                continue;
                                            f[g].ix == p[t].x && f[g].iy == p[t].y && $("#" + n).append('<div class="mhWondIco ' + f[g].wt + '" style="left:' + ~~(f[g].ox / 4 - 20) + "px; top:" + ~~(f[g].oy / 4 - 10) + 'px; position:relative; float:none;"></div>')
                                        }
                                    if (a = c[n = p[t].x + "_" + p[t].y])
                                        for (o = a.length; o--; )
                                            ("mini_t" + c[n][o].id).replace("=", ""),
                                                c[n][o].fc && (m = c[n][o],
                                                               r = mhUtl.lnkTownIco(m.id, m.name, 0, 0) + "<br>",
                                                               r += '<img src="' + MH.Home + 'medias/images/points.gif"/> ' + m.points + "<br>",
                                                               m.hasOwnProperty("player_name") && (r += mhUtl.lnkPlayerIco(m.player_id, m.player_name) + "<br>"),
                                                               m.hasOwnProperty("alliance_name") && (r += mhUtl.lnkAllyIco(m.alliance_id, m.alliance_name) + "<br>"),
                                                               $("#mini_t" + m.id).mousePopup(new MousePopup(r)),
                                                               $("#mini_t" + m.id).attr("name", m.name),
                                                               $("#mini_t" + m.id).attr("x", m.x),
                                                               $("#mini_t" + m.id).attr("y", m.y),
                                                               m.hasOwnProperty("player_name") && "" != m.player_name && (m.player_id in MH.GuiUst.SymPlay ? h(m.id, MH.GuiUst.SymPlay[m.player_id]) : m.hasOwnProperty("alliance_id") && m.alliance_id in MH.GuiUst.SymAlly && h(m.id, MH.GuiUst.SymAlly[m.alliance_id])));
                                    i.setAttribute("mhUpd", "0")
                                }
                    }
                $("#minimap_click_layer").css("z-index", "0"),
                    $(".m_town").css("z-index", "11"),
                    $(".m_town").css("cursor", "pointer"),
                    $(".m_town").click(function(e) {
                    var t = {};
                    t.id = parseInt($(this).attr("id").substring(6), 10),
                        t.name = $(this).attr("name"),
                        t.ix = parseInt($(this).attr("x")),
                        t.iy = parseInt($(this).attr("y")),
                        null != ITowns.getTown(t.id) && (t.name = ITowns.getTown(t.id).name),
                        Layout.contextMenu(e, "determine", t)
                }),
                    MH.SymbolsMiniDrwElem()
            }
        }
        function h(e, t) {
            e = $("#mini_t" + e);
            e.length && (e.html(""),
                         e.append($("<div/>", {
                style: "display:block; width:10px; height:10px; background:url('" + MH.Home + "gui/symbolsm.gif') repeat scroll -" + t.x / 2 + "px -" + t.y / 2 + "px"
            })))
        }
    }
        ,
        MH.SymbolsMiniDrwElem = function() {
        var e, t;
        $("#minimap").length && ($("#mhSelMini").length && $("#mhSelMini").remove(),
                                 (e = $("#mini_t" + Game.townId)).length && (t = e.position(),
                                                                             e.before($("<div/>", {
            id: "mhSelMini",
            style: "z-index:1; position:absolute; left:" + (t.left - 10) + "px; top:" + (t.top - 9) + "px; width:30px; height:30px; background:url('" + MH.Home + "medias/images/selm.png')"
        }))),
                                 MH.GuiUst.trg && ($("#mhTargetMini").length && $("#mhTargetMini").remove(),
                                                   (e = $("#mini_t" + MH.GuiUst.trgTown.id)).length && (t = e.position(),
                                                                                                        e.before($("<div/>", {
            id: "mhTargetMini",
            style: "z-index:1; position:absolute; left:" + (t.left - 10) + "px; top:" + (t.top - 9) + "px; width:30px; height:30px; background:url('" + MH.Home + "gui/targetm.png')"
        })))))
    }
        ,
        MH.SYMWnd = function(e, t, n) {
        if (null == e) {
            if (n) {
                if (1 != mhCol.LoadedAllys)
                    return void mhCol.UpdateAllysFromRemote(function() {
                        his.SYMWnd(e, t, n)
                    })
            } else if (1 != mhCol.LoadedPlays)
                return void mhCol.UpdatePlaysFromRemote(function() {
                    his.SYMWnd(e, t, n)
                });
            e = n ? mhCol.AllyId_AllyName(t) : mhCol.PlayId_PlayName(t)
        }
        function i(e, t, n) {
            return n = 1 == n ? "1" : "0",
                $("<a/>", {
                href: "#",
                id: e,
                sel: n
            }).click(function() {
                document.getElementById("rb_fs1").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_fs2").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_fs3").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_fs4").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    this.firstChild.src = MH.Home + "medias/images/rb1.gif",
                    document.getElementById("rb_fs1").setAttribute("sel", "0"),
                    document.getElementById("rb_fs2").setAttribute("sel", "0"),
                    document.getElementById("rb_fs3").setAttribute("sel", "0"),
                    document.getElementById("rb_fs4").setAttribute("sel", "0"),
                    this.setAttribute("sel", "1");
                var e = $("#mhAddFlag");
                "1" != $("#rb_fs4").attr("sel") ? (e.show(),
                                                   "1" == $("#rb_fs1").attr("sel") && e.css({
                    left: 75,
                    top: 27
                }),
                                                   "1" == $("#rb_fs2").attr("sel") && e.css({
                    left: 75,
                    top: 14
                }),
                                                   "1" == $("#rb_fs3").attr("sel") && e.css({
                    left: 102,
                    top: 31
                })) : e.hide()
            }).append($("<img/>", {
                src: MH.Home + "medias/images/rb" + n + ".gif",
                style: "position:relative; top:2px;"
            })).append(t + "<br>")
        }
        var a, o = MH.Lang.SymPlay;
        if (n && (o = MH.Lang.SymAlly),
            null != MH.wSYM) {
            try {
                MH.wSYM.close()
            } catch (e) {}
            MH.wSYM = null
        }
        MH.wSYM = Layout.dialogWindow.open("", o, 502, 385, function() {
            MH.wSYM = null
        }, !0),
            MH.wSYM.setPosition("center", "center"),
            MH.wSYMid = e,
            MH.wSYMname = t,
            MH.wSYMally = n,
            a = MH.wSYMx = MH.wSYMy = 0,
            MH.wSYMally ? MH.wSYMid in MH.GuiUst.SymAlly && (MH.wSYMx = MH.GuiUst.SymAlly[MH.wSYMid].x,
                                                             MH.wSYMy = MH.GuiUst.SymAlly[MH.wSYMid].y,
                                                             a = MH.GuiUst.SymAlly[MH.wSYMid].t) : MH.wSYMid in MH.GuiUst.SymPlay && (MH.wSYMx = MH.GuiUst.SymPlay[MH.wSYMid].x,
                                                                                                                                      MH.wSYMy = MH.GuiUst.SymPlay[MH.wSYMid].y,
                                                                                                                                      a = MH.GuiUst.SymPlay[MH.wSYMid].t),
            o = mhUtl.lnkPlayerIco(e, t),
            n && (o = mhUtl.lnkAllyIco(e, t));
        o = $("<div/>", {}).append($("<div/>", {
            style: "float:left; width:220px; height:85px;"
        }).append(o).append($("<div/>", {}).append($("<div/>", {
            id: "mhAddFlag",
            style: "display:block; z-index:3; position:absolute; left:50px; top:34px; width:20px; height:20px; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.wSYMx + "px -" + MH.wSYMy + "px"
        })).append($("<div/>", {
            class: "flag town",
            style: "background-color:rgb(187, 85, 17); left:80px; top:34px;"
        }).append($("<div/>", {
            class: "flagpole town"
        }))).append($("<a/>", {
            class: "town_icon tile se lvl5",
            style: "left:50px; top:40px;"
        })))).append($("<div/>", {}).html("<b>" + MH.Lang.HELPTAB4 + ":</b><br>").append(i("rb_fs1", " " + MH.Lang.SymO1, !1)).append(i("rb_fs2", " " + MH.Lang.SymO2, !1)).append(i("rb_fs3", " " + MH.Lang.SymO3, !1)).append(i("rb_fs4", " " + MH.Lang.SymO4, !1))).append("<hr>").append($("<div/>", {
            id: "SYMselect",
            style: "display:block; width:500px; height:200px; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll 0px 0px rgba(0, 0, 0, 0)"
        }).mousemove(function(e) {
            var t = $(this).offset()
            , n = Math.floor((e.pageX - t.left) / 20)
            , t = Math.floor((e.pageY - t.top) / 20);
            n < 0 && (n = 0),
                t < 0 && (t = 0),
                25 < n && (n = 25),
                10 < t && (t = 10),
                n *= 20,
                t *= 20,
                $("#SYMselect div").css({
                top: t,
                left: n
            })
        }).click(function(e) {
            var t = $(this).offset()
            , n = Math.floor((e.pageX - t.left) / 20)
            , t = Math.floor((e.pageY - t.top) / 20);
            n < 0 && (n = 0),
                t < 0 && (t = 0),
                25 < n && (n = 25),
                10 < t && (t = 10),
                n *= 20,
                t *= 20,
                MH.wSYMx = n,
                MH.wSYMy = t,
                $("#mhAddFlag").css("background-position", "-" + n + "px -" + t + "px")
        }).append($("<div/>", {
            style: "display:block; width:18px; height:18px; left:0px; top:0px; position:relative; border-color:#8080ff; border-width:1px;  border-style:solid;"
        }))).append(mhGui.Button(MH.Lang.SymAll).click(function() {
            MH.SYMnfoWnd()
        })).append(mhGui.Button(MH.Lang.repgen).css("float", "right").click(function() {
            var e;
            "1" == $("#rb_fs4").attr("sel") ? MH.wSYMally ? MH.wSYMid in MH.GuiUst.SymAlly && delete MH.GuiUst.SymAlly[MH.wSYMid] : MH.wSYMid in MH.GuiUst.SymPlay && delete MH.GuiUst.SymPlay[MH.wSYMid] : (e = {
                t: 0
            },
        "1" == $("#rb_fs2").attr("sel") && (e.t = 1),
        "1" == $("#rb_fs3").attr("sel") && (e.t = 2),
        e.x = MH.wSYMx,
        e.y = MH.wSYMy,
        MH.wSYMally ? MH.GuiUst.SymAlly[MH.wSYMid] = e : MH.GuiUst.SymPlay[MH.wSYMid] = e),
                MH.Storage(MH.GuiUstCookie, MH.GuiUst),
                MH.wSYM.close(),
                $("#map_move_container #mhMapSym").remove(),
                MH.Symbols(),
                $(".m_island").removeAttr("mhUpd"),
                $(".m_town").removeAttr("mhUpd"),
                MH.SymbolsMini(),
                e = ".PlaySymIco",
                MH.wSYMally && (e = ".AllySymIco"),
                $.each($(e), function(e, t) {
                e = $(this).attr("id"),
                    t = MH.GuiUst.SymPlay,
                    MH.wSYMally && (t = MH.GuiUst.SymAlly),
                    e in t ? $(this).css("background-position", "-" + t[e].x + "px -" + t[e].y + "px") : $(this).remove()
            })
        }));
        switch (MH.wSYM.appendContent(o),
                a) {
            default:
                $("#rb_fs1").click();
                break;
            case 1:
                $("#rb_fs2").click();
                break;
            case 2:
                $("#rb_fs3").click()
        }
    }
        ,
        MH.SYMnfoWnd = function() {
        var e, t, n = $("<div/>", {});
        if (1 == mhCol.LoadedAllys)
            if (1 == mhCol.LoadedPlays) {
                MH.wSYMnfo = MH.wndCreate("AssSymbols", MH.Lang.SymAll + ":", 500, 400),
                    MH.wSYMnfo.getJQElement().find(".gpwindow_content").css("overflow-y", "auto");
                var i = $("<div/>", {
                    style: "float:left; width:50%;"
                }).append($("<div/>", {}).html(MH.GLng.Players + ":"));
                for (e in MH.GuiUst.SymPlay)
                    MH.GuiUst.SymPlay.hasOwnProperty(e) && (t = "not exist",
                                                            e in mhCol.plays && (t = mhCol.plays[e].name),
                                                            i.append($("<div/>", {
                        style: "float:left; display:block; width:20px; height:20px; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymPlay[e].x + "px -" + MH.GuiUst.SymPlay[e].y + "px"
                    })).append($("<div/>", {
                        style: "float:left;"
                    }).html(">")).append($("<div/>", {}).append(mhUtl.lnkPlayerIco(e, t))).append("<br>"));
                var a = $("<div/>", {
                    style: "float:left; width:50%;"
                }).append($("<div/>", {}).html(MH.GLng.Allys + ":"));
                for (e in MH.GuiUst.SymAlly)
                    MH.GuiUst.SymAlly.hasOwnProperty(e) && (t = "not exist",
                                                            e in mhCol.allys && (t = mhCol.allys[e].name),
                                                            a.append($("<div/>", {
                        style: "float:left; display:block; width:20px; height:20px; background:url('" + MH.Home + "gui/symbols.gif') repeat scroll -" + MH.GuiUst.SymAlly[e].x + "px -" + MH.GuiUst.SymAlly[e].y + "px"
                    })).append($("<div/>", {
                        style: "float:left;"
                    }).html(">")).append($("<div/>", {}).append(mhUtl.lnkAllyIco(e, t))).append("<br>"));
                n.append(i),
                    n.append(a),
                    MH.wSYMnfo.setContent(n.html()),
                    MH.ev.WAR("AssSymbols", "OwnWnds", "")
            } else
                mhCol.UpdatePlaysFromRemote(function() {
                    MH.SYMnfoWnd()
                });
        else
            mhCol.UpdateAllysFromRemote(function() {
                MH.SYMnfoWnd()
            })
    }
        ,
        MH.Subtitles = function() {
        if (MH.Set.MSb) {
            $("#map_move_container #mhMapSub").length || $("#map_move_container").append($("<div/>", {
                id: "mhMapSub",
                style: "position:absolute; top:0px; left:0px; z-index:5;"
            }));
            var e, t, n, i, a, o = MapTiles, r = o.tile.x - (o.tileBuffer.x >> 1), l = o.tile.y - (o.tileBuffer.y >> 1), s = o.tileCount.x, d = o.tileCount.y, p = o.mapData.getData(r, l, s, d, ["towns"]).towns;
            for (e in p)
                p.hasOwnProperty(e) && p[e].hasOwnProperty("player_name") && "" != p[e].player_name && (_log(p[e]),
                                                                                                        t = p[e],
                                                                                                        p[e].player_id,
                                                                                                        p[e].player_name,
                                                                                                        a = i = n = void 0,
                                                                                                        (a = $("#map_towns a#town_" + t.id)).length ? $("#mhMapSub #sub_" + t.id).length || (a = a.position(),
            n = parseInt(a.left) - 90,
            i = parseInt(a.top) + 30,
            a = "<center><div>",
            a += '<div"><div style="display:inline-block; background-color:#2FB55D40;"><span class="bbcodes bbcodes_town"> <a style="color:#B0B0B0;" href="#">' + t.name + "</a></span></div></div>",
            a += '<div"><div style="display:inline-block; background-color:#A8532A40;"><img padding-right: 2px;" alt="" src="https://grepolis-david1327.e-monsite.com/medias/images/player.gif">' + mhUtl.lnkPlayerCol(t.player_id, t.player_name, "#E07030") + "</div></div>",
            null != t.alliance_id && (a += '<div><div style="display:inline-block; background-color:#C3D0FF30;"><img alt="" src="https://gppl.innogamescdn.com/images/game/icons/ally.png" padding-right: 2px;">' + mhUtl.lnkAllyCol(t.alliance_id, t.alliance_name, "#0080FF") + "</div></div>"),
            a += "</div></center>",
            $("#mhMapSub").append($("<div/>", {
                    id: "sub_" + t.id,
                    style: "display:block; z-index:3; position:absolute; left:" + n + "px; top:" + i + "px; width:240px;"
                }).append(a))) : $("#mhMapSub #sub_" + t.id).remove())
        } else
            $("#map_move_container #mhMapSub").length && $("#map_move_container #mhMapSub").remove()
    }
        ,
        MH.UnitIsLand = function(e) {
        switch (e) {
            case "militia":
            case "sword":
            case "slinger":
            case "archer":
            case "hoplite":
            case "rider":
            case "chariot":
            case "catapult":
                return !0
        }
        return !(!MH.UnitIsGod(e) || "sea_monster" == e)
    }
        ,
        MH.UnitIsSea = function(e) {
        switch (e) {
            case "big_transporter":
            case "bireme":
            case "attack_ship":
            case "demolition_ship":
            case "small_transporter":
            case "trireme":
            case "colonize_ship":
                return !0
        }
        return "sea_monster" == e
    }
        ,
        MH.UnitIsGod = function(e) {
        switch (e) {
            case "zyklop":
            case "sea_monster":
            case "harpy":
            case "medusa":
            case "minotaur":
            case "manticore":
            case "centaur":
            case "pegasus":
            case "cerberus":
            case "fury":
            case "calydonian_boar":
            case "griffin":
            case "godsent":
                return !0
        }
        return !1
    }
        ,
        MH.UnitIsHero = function(e) {
        return e in GameData.heroes
    }
        ,
        MH.UnitsShow = function(e) {
        var t, n = "#ui_box .nui_units_box ", i = n + ".units_land .middle .content ", a = n + ".units_naval .middle .content ";
        if ($(n + ".units_land").show(),
            $(n + ".units_naval").show(),
            $(n + ".MHunitsel").length || ($(n).prepend($("<div/>", {
            class: "middle MHunitsel"
        }).append($("<div/>", {
            class: "left"
        })).append($("<div/>", {
            class: "right"
        })).append($("<div/>", {
            class: "content",
            style: "margin:6px 4px -12px; height:18px; background:black;"
        }).append($("<a/>", {
            href: "#",
            class: "button",
            style: "display:block; position:absolute; top:-2px; left:9px; width:23px; height:16px; background:url('" + MH.Home + "medias/images/usel.gif') 0px 0px;"
        }).mousePopup(new MousePopup(MH.Lang.uniVS0)).click(function() {
            MH.UnitsShowSet(0)
        })).append($("<a/>", {
            href: "#",
            class: "button",
            style: "display:block; position:absolute; top:-2px; left:34px; width:23px; height:16px; background:url('" + MH.Home + "medias/images/usel.gif') -23px 0px;"
        }).mousePopup(new MousePopup(MH.Lang.uniVS1)).click(function() {
            MH.UnitsShowSet(1)
        })).append($("<a/>", {
            href: "#",
            class: "button",
            style: "display:block; position:absolute; top:-2px; left:59px; width:23px; height:16px; background:url('" + MH.Home + "medias/images/usel.gif') -46px 0px;"
        }).mousePopup(new MousePopup(MH.Lang.uniVS2)).click(function() {
            MH.UnitsShowSet(2)
        })).append($("<a/>", {
            href: "#",
            class: "button",
            style: "display:block; position:absolute; top:-2px; left:84px; width:23px; height:16px; background:url('" + MH.Home + "medias/images/usel.gif') -69px 0px;"
        }).mousePopup(new MousePopup(MH.Lang.uniVS3)).click(function() {
            MH.UnitsShowSet(3)
        })).append($("<a/>", {
            href: "#",
            class: "button",
            style: "display:block; position:absolute; top:-2px; left:109px; width:23px; height:16px; background:url('" + MH.Home + "medias/images/usel.gif') -92px 0px;"
        }).mousePopup(new MousePopup(MH.Lang.uniVS4)).click(function() {
            MH.UnitsShowSet(4)
        })))),
                                           $(i).prepend($("<div/>", {
            class: "units_wrapper clearfix MoleHole"
        })),
                                           $(a).prepend($("<div/>", {
            class: "units_wrapper clearfix MoleHole"
        }))),
            i += ".units_wrapper",
            a += ".units_wrapper",
            null == e)
            return $(i).show(),
                $(a).show(),
                $(i + ".MoleHole").hide(),
                $(a + ".MoleHole").hide(),
                void $("#ui_box .nui_units_box").find(".nav").show();
        for (t in $("#ui_box .nui_units_box").find(".nav").hide(),
             $(i + ".MoleHole").html(""),
             e)
            e.hasOwnProperty(t) && "0" != e[t] && MH.UnitIsLand(t) && $(i + ".MoleHole").append($("<div/>", {
                class: "unit_icon40x40 " + t + " unit",
                "data-type": t
            }).html('<div class="value">' + e[t] + '</div> <div class="selected_border"></div>'));
        for (t in $(a + ".MoleHole").html(""),
             e)
            e.hasOwnProperty(t) && "0" != e[t] && MH.UnitIsSea(t) && $(a + ".MoleHole").append($("<div/>", {
                class: "unit_icon40x40 " + t + " unit",
                "data-type": t
            }).html('<div class="value">' + e[t] + '</div> <div class="selected_border"></div>'));
        $(i).hide(),
            $(a).hide(),
            $(i + ".MoleHole").show(),
            $(a + ".MoleHole").show()
    }
        ,
        MH.UnitsShowSet = function(e) {
        var t, n, i, a;
        if (e < 0 && (e = 0),
            4 < e && (e = 4),
            MH.GuiUst.unitV = e,
            MH.Storage(MH.GuiUstCookie, MH.GuiUst),
            $.each($("#ui_box .nui_units_box .MHunitsel .content .button"), function(e, t) {
            $(t).css("background-position", function(e, t) {
                return t.replace(/-?\d+px$/, "0px")
            })
        }),
            $("#ui_box .nui_units_box .MHunitsel .content .button").eq(e).css("background-position", function(e, t) {
            return t.replace(/-?\d+px$/, "-16px")
        }),
            0 == e)
            return MH.UnitsShow(null);
        switch (n = MH.COL.units.calculateTotalAmountOfUnits(Game.townId),
                i = MH.COL.units.getUnitsInTown(Game.townId).getUnits(),
                a = ITowns.getTown(Game.townId).unitsOuter(),
                e) {
            case 1:
                t = MH.UnitsShowSub(n, i);
                break;
            case 2:
                t = MH.UnitsShowAdd(i, a);
                break;
            case 3:
                t = i;
                break;
            case 4:
                t = a
        }
        MH.UnitsShow(t)
    }
        ,
        MH.UnitsShowAdd = function(e, t) {
        for (var n in t)
            t.hasOwnProperty(n) && (e.hasOwnProperty(n) || (e[n] = 0));
        for (n in e)
            e.hasOwnProperty(n) && t.hasOwnProperty(n) && (e[n] = e[n] + t[n],
                                                           e[n] < 0 && (e[n] = 0));
        return e
    }
        ,
        MH.UnitsShowSub = function(e, t) {
        for (var n in e)
            e.hasOwnProperty(n) && t.hasOwnProperty(n) && (e[n] = e[n] - t[n],
                                                           e[n] < 0 && (e[n] = 0));
        return e
    }
        ,
        MH.UnitsShowAll = function(e) {
        var t, n, i, a, o, r, l = mhUtl.Clone(mhCNST.Units), s = ITowns.getTowns();
        for (r in (e = parseInt(e)) < 0 && (e = 0),
             4 < e && (e = 4),
             delete l.unknown,
             delete l.militia,
             l)
            l.hasOwnProperty(r) && (l[r] = 0);
        for (r in s)
            if (s.hasOwnProperty(r)) {
                switch (t = s[r].units(),
                        n = s[r].unitsOuter(),
                        i = s[r].unitsSupport(),
                        e) {
                    case 0:
                        t = MH.UnitsShowAdd(t, i);
                        break;
                    case 1:
                        t = i;
                        break;
                    case 2:
                        t = MH.UnitsShowAdd(t, n);
                        break;
                    case 3:
                        break;
                    case 4:
                        t = n
                }
                if (l = MH.UnitsShowAdd(l, t),
                    1 != e && 4 != e)
                    for (a in l)
                        l.hasOwnProperty(a) && MH.UnitIsHero(a) && null != (o = s[r].getHero(a)) && (l[a] = o.getLevel())
            }
        return l
    }
        ,
        MH.UnitsShowInTown = function(e, t) {
        var n, i, a, o, r = mhUtl.Clone(mhCNST.Units), l = ITowns.getTowns();
        for (o in (e = parseInt(e)) < 0 && (e = 0),
             4 < e && (e = 4),
             delete r.unknown,
             delete r.militia,
             r)
            r.hasOwnProperty(o) && (r[o] = 0);
        switch (_log("TUTAJ --"),
                _log(r),
                n = l[t].units(),
                i = l[t].unitsOuter(),
                a = l[t].unitsSupport(),
                e) {
            case 0:
                n = MH.UnitsShowAdd(n, a);
                break;
            case 1:
                n = a;
                break;
            case 2:
                n = MH.UnitsShowAdd(n, i);
                break;
            case 3:
                break;
            case 4:
                n = i
        }
        return r = MH.UnitsShowAdd(r, n)
    }
        ,
        MH.col = {
        cAllyOwn: "#0099FF",
        cAllyEnemy: "rgb(255, 0, 0)",
        cAllyFriend: "rgb(57, 155, 30)",
        cAllyCustom: "#BB5511",
        AllyEnemy: [],
        AllyFriend: [],
        cAllys: {},
        cPlays: {},
        Get: function(e) {
            var t, n;
            for (t in MH.MMM.CustomColor)
                "enemy" == (n = MH.MMM.CustomColor[t].attributes).type && (this.cAllyEnemy = "#" + n.color),
                    "pact" == n.type && (this.cAllyFriend = "#" + n.color),
                    "own_alliance" == n.type && (this.cAllyOwn = "#" + n.color);
            for (t in MH.col.AllyEnemy = [],
                 MH.col.AllyFriend = [],
                 MH.MMM.AlliancePact)
                (n = MH.MMM.AlliancePact[t].attributes).alliance_1_id == Game.alliance_id && ("war" == n.relation && MH.col.AllyEnemy.push(n.alliance_2_id),
                                                                                              "peace" == n.relation && MH.col.AllyFriend.push(n.alliance_2_id)),
                    n.alliance_2_id == Game.alliance_id && ("war" == n.relation && MH.col.AllyEnemy.push(n.alliance_1_id),
                                                            "peace" == n.relation && MH.col.AllyFriend.push(n.alliance_1_id));
            _log(this.AllyEnemy),
                _log(this.AllyFriend)
        }
    },
        MH.ATimes = function(e, t) {
        var n, i, t = t || !1;
        if (!e.hasOwnProperty("id"))
            return !1;
        if (e.id = parseInt(e.id),
            i = !1,
            e.hasOwnProperty("ix") || (i = !0,
                                       e.ix = NaN),
            e.hasOwnProperty("iy") || (i = !0,
                                       e.iy = NaN),
            e.hasOwnProperty("name") || (i = !0,
                                         e.name = MH.ATT),
            i) {
            if (0 == (i = mhCol.GetTownInfo_forAT(e, id)))
                return !1;
            e.name = i.name,
                e.ix = i.ix,
                e.iy = i.iy
        }
        function a(e, t) {
            return $("<div/>", {
                class: "unit_container",
                n: e,
                t: t
            }).append($("<a/>", {
                class: "unit index_unit bold unit_icon40x40 " + t,
                href: "#"
            }).append($("<span/>", {
                style: "color:#00FF00;"
            }).html("-"))).click(function() {
                var e = $(this)
                , n = e.attr("n")
                , t = e.attr("t");
                $("#all_unit_speed").html(GameData.units[t].speed),
                    e.parent().find(".unit_container").each(function(e, t) {
                    e == n ? $(t).find("strong").css("color", "#000000") : $(t).find("strong").css("color", "#808080"),
                        3 == e && 4 == n && (e = 4),
                        e <= n ? ($(t).find("a").css("opacity", "1.0"),
                                  $(t).find("a>span").html("V"),
                                  $(t).find("div").css("background-position", "-394px -1px")) : ($(t).find("a").css("opacity", "0.5"),
                                                                                                 $(t).find("a>span").html("-"),
                                                                                                 $(t).find("div").css("background-position", "-394px -18px"))
                }),
                    MH.ATimesCalc(),
                    MH.ATimesTable()
            }).append($("<div/>", {
                style: "display:inline-block; width:20px; height:16px; background:url('" + MH.Home + "medias/images/but.png') -394px -18px"
            })).append($("<strong/>", {
                style: "color:#808080;"
            }).html(GameData.units[t].speed))
        }
        for (i in MH.ATIRQ = !1,
             (i = MH.wndCreate("wArrivalTimes", MH.Lang.reaTime, 420, 600)).setPosition([160, 54]),
             i.setContent(""),
             (i = i.getJQElement().find(".gpwindow_content")).append($("<div/>", {
            id: "mh_unitsTT"
        }).append(a(0, "pegasus")).append(a(1, "harpy")).append(a(2, "manticore")).append(a(3, "bireme")).append(a(4, "small_transporter")).append(a(5, "attack_ship")).append(a(6, "big_transporter")).append(a(7, "colonize_ship"))),
             i.append($("<table/>", {
            style: "width:100%;font-size:12px"
        }).append($("<tr/>", {}).append($("<td/>", {}).append("<b>" + MH.Lang.ShowOnly + ":</b><br>").append($("<div/>", {
            style: "display:inline-block; width:20px; height:16px; background:url('" + MH.Home + "medias/images/but.png') -394px -1px"
        })).append($("<strong/>", {
            id: "all_unit_speed",
            style: "color:#000000;"
        }).html("45"))))),
             i.append('<table style="width:100%;"><tbody><tr><td>' + mhUtl.lnkPlayerIco(Game.player_id, Game.player_name) + '</td><td><img alt="" src="' + MH.Home + 'img/mid.gif"></td></td><td>' + mhUtl.lnkTownIco(e.id, e.name, e.ix, e.iy) + "</td></tr></tbody></table>"),
             i.append(mhGui.Border().append($("<table>", {
            class: "game_header bold",
            style: "border-bottom: 1px solid #D0BE97;"
        }).append($("<thead>").append($("<tr>").append('<th width="186">' + MH.GLng.Town).append('<th width="100">' + MH.Lang.Road).append('<th width="100">' + MH.GLng.Time)))).append($("<div>", {
            style: "overflow-x:hidden; overflow-y:auto; height:362px;"
        }).append($("<table>", {
            id: "citys_info_table_scroll",
            class: "game_table",
            cellspacing: "0"
        }).append("loading...")))),
             (t ? $("#mh_unitsTT .unit_icon40x40.attack_ship") : $("#mh_unitsTT .unit_icon40x40.small_transporter")).click(),
             MH.AT = [],
             n = ITowns.getTowns())
            n.hasOwnProperty(i) && (t = parseInt(n[i].id),
                                    MH.AT[t] = {},
                                    MH.AT[t].id = t,
                                    MH.AT[t].name = n[i].name,
                                    MH.AT[t].ix = parseInt(n[i].getIslandCoordinateX()),
                                    MH.AT[t].iy = parseInt(n[i].getIslandCoordinateY()));
        for (i in MH.ATT = e.id,
             MH.AT[MH.ATT] = e,
             MH.AT)
            MH.AT.hasOwnProperty(i) && (MH.AT[i].ox = 0,
                                        MH.AT[i].oy = 0,
                                        null != ITowns.towns_collection._byId[MH.AT[i].id] && (t = require("map/helpers").map2Pixel(MH.AT[i].ix, MH.AT[i].iy),
                                                                                               MH.AT[i].ox = ITowns.towns_collection._byId[MH.AT[i].id].attributes.abs_x - t.x,
                                                                                               MH.AT[i].oy = ITowns.towns_collection._byId[MH.AT[i].id].attributes.abs_y - t.y),
                                        null != (t = WMap.mapData.findTownInChunks(MH.AT[i].id)) && t.hasOwnProperty("ox") && (MH.AT[i].ox = parseInt(t.ox),
                                                                                                                               MH.AT[i].oy = parseInt(t.oy)));
        MH.ATimesCalc(),
            MH.ATimesTable(),
            MH.ev.WAR("wArrivalTimes", "OwnWnds", ""),
            MH.ATIRQ = !0,
            MH.ATimesIRQ()
    }
        ,
        MH.ATimesCalc = function() {
        var e, t, n, i = parseFloat($("#all_unit_speed").html());
        for (e in MH.ATL = [],
             MH.AT)
            MH.AT.hasOwnProperty(e) && ((t = require("map/helpers").map2Pixel(MH.AT[e].ix, MH.AT[e].iy)).x += MH.AT[e].ox,
                                        t.y += MH.AT[e].oy,
                                        MH.AT[e].pos = t);
        for (e in MH.AT)
            if (MH.AT.hasOwnProperty(e)) {
                if (MH.AT[e].id == MH.ATT)
                    continue;
                t = Math.floor(Math.round(10 * Math.sqrt(Math.pow(MH.AT[e].pos.x - MH.AT[MH.ATT].pos.x, 2) + Math.pow(MH.AT[e].pos.y - MH.AT[MH.ATT].pos.y, 2))) / 10),
                    n = 1,
                    ITowns.towns[MH.AT[e].id].researches().hasResearch("cartography") && (n += .1),
                    "0" != ITowns.towns[MH.AT[e].id].buildings().getBuildingLevel("lighthouse") && (n += .15);
                for (var a = ITowns.towns[MH.AT[e].id].casted_powers_collection, o = 0; o < a.length; ) {
                    if ("unit_movement_boost" == a.models[o].attributes.power_id) {
                        n += a.models[o].attributes.configuration.percent / 100;
                        break
                    }
                    o++
                }
                (o = Math.floor(50 * t / (n * i) + 900 / Game.game_speed)) < 1 && (o = 1),
                    MH.ATL[e] = {},
                    MH.ATL[e].id = MH.AT[e].id,
                    MH.ATL[e].srt = o,
                    MH.AT[e].lnk = mhUtl.lnkMyTown(MH.AT[e].id),
                    ITowns.towns[MH.AT[e].id].units().hasOwnProperty("colonize_ship") && (MH.AT[e].lnk += ' <img src="' + MH.Home + 'gui/colonize.gif">'),
                    1 < n && (MH.AT[e].lnk += ' <img src="' + MH.Home + 'gui/shoe.gif"> +' + parseInt(100 * (n - 1)) + "%"),
                    MH.AT[e].dis = t,
                    MH.AT[e].arv = o
            }
        MH.ATL.sort(function(e, t) {
            return e.srt < t.srt ? -1 : e.srt > t.srt ? 1 : 0
        })
    }
        ,
        MH.ATimesTable = function() {
        var e, t, n = $("<tbody/>", {}), i = 0;
        for (e in MH.ATL)
            if (MH.ATL.hasOwnProperty(e)) {
                if (MH.ATL[e].id == MH.ATT)
                    continue;
                twn = MH.AT[MH.ATL[e].id],
                    t = i % 2 ? $("<tr>", {
                    id: twn.id,
                    class: "game_table_even top"
                }) : $("<tr>", {
                    id: twn.id,
                    class: "game_table_odd top"
                }),
                    twn.id == Game.townId && t.addClass("colA0A0FF"),
                    t.click(function() {
                    Game.townId != $(this).attr("id") && HelperTown.townSwitch($(this).attr("id"))
                }),
                    t.append($('<td width="186">').append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "10px; display:block; position:relative; left:-2px; top:-2px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    $(this).parent().parent().remove()
                })).append(twn.lnk)),
                    t.append('<td width="100"><span class="way_duration">~' + MH.utl.secsToHHMMSS(twn.arv) + "</span>"),
                    czas = getHumanReadableTimeDate(new Date(Timestamp.serverTime().getTime() + 1e3 * twn.arv)),
                    czas = czas.substring(0, 8),
                    t.append('<td width="100"><span class="arrival_time mhTIRQ">' + czas + "</span>"),
                    n.append(t),
                    i++
            }
        $("#citys_info_table_scroll").html(""),
            $("#citys_info_table_scroll").append(n)
    }
        ,
        MH.ATimesTable_TownSwitch = function(e, t) {
        $("#citys_info_table_scroll tr#" + e).removeClass("colA0A0FF"),
            $("#citys_info_table_scroll tr#" + t).addClass("colA0A0FF")
    }
        ,
        MH.ATimesIRQ = function() {
        MH.OwnWnds.hasOwnProperty("wArrivalTimes") || (MH.ATIRQ = !1),
            0 != MH.ATIRQ && (setTimeout(MH.ATimesIRQ, 1e3),
                              MH.OwnWnds.wArrivalTimes.getJQElement().find(".arrival_time.mhTIRQ").each(function() {
            var e = $(this).closest("tr");
            e.length && (e = e.attr("id"),
                         e = (e = getHumanReadableTimeDate(new Date(Timestamp.serverTime().getTime() + 1e3 * MH.AT[e].arv))).substring(0, 8),
                         $(this).html(e))
        }))
    }
        ,
        MH.TimerTick = function() {
        var e, t;
        if (MH.ScriptAtcive) {
            switch (e = Timestamp.serverTimeToLocal(),
                    MH.GuiUst.TimeMode) {
                case 0:
                    return $("#MH_TimerS2").css("background-position", "-140px 0px"),
                        $("#MH_TimerS1").css("background-position", "-140px 0px"),
                        $("#MH_TimerD2").css("background-position", "-157px 0px"),
                        $("#MH_TimerM2").css("background-position", "-140px 0px"),
                        $("#MH_TimerM1").css("background-position", "-140px 0px"),
                        $("#MH_TimerD1").css("background-position", "-157px 0px"),
                        $("#MH_TimerH2").css("background-position", "-140px 0px"),
                        void $("#MH_TimerH1").css("background-position", "-140px 0px");
                case 1:
                    e = getHumanReadableTimeDate(e);
                    break;
                case 2:
                case 3:
                    e = Timestamp.server() - MH.GuiUst.TimeTmp,
                        ":" == (e = readableUnixTimestamp(e))[1] && (e = "0" + e);
                    break;
                case 4:
                case 5:
                    e = MH.GuiUst.TimeTmp - Timestamp.server(),
                        ":" == (e = readableUnixTimestamp(e))[1] && (e = "0" + e)
            }
            5 == MH.GuiUst.TimeMode && MH.GuiUst.TimeTmp - Timestamp.clientGMTOffset() - Timestamp.server() < 11 && (MH.TimerAlarmAct = !0,
                                                                                                                     MH.AlarmStart(),
                                                                                                                     MH.GuiUst.TimeMode = 4),
                4 < (t = MH.GuiUst.TimeMode) && (t = 4),
                t *= 21,
                t -= 21,
                $("#MH_TimerH1").css("background-position", "-" + 14 * e[0] + "px -" + t + "px"),
                $("#MH_TimerH2").css("background-position", "-" + 14 * e[1] + "px -" + t + "px"),
                $("#MH_TimerM1").css("background-position", "-" + 14 * e[3] + "px -" + t + "px"),
                $("#MH_TimerM2").css("background-position", "-" + 14 * e[4] + "px -" + t + "px"),
                $("#MH_TimerS1").css("background-position", "-" + 14 * e[6] + "px -" + t + "px"),
                $("#MH_TimerS2").css("background-position", "-" + 14 * e[7] + "px -" + t + "px"),
                $("#MH_TimerD1").css("background-position", "-154px  -" + t + "px"),
                $("#MH_TimerD2").css("background-position", "-154px  -" + t + "px")
        }
    }
        ,
        MH.TimerInit = function() {
        $("#MH_Timer").css("cursor", "pointer"),
            $("#MH_Timer").click(MH.TimerMenu),
            $("#MH_Timer").append($("<div/>", {
            id: "MH_TimerS2",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })).append($("<div/>", {
            id: "MH_TimerS1",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })).append($("<div/>", {
            id: "MH_TimerD2",
            style: "float:right; width:3px;  height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -157px 0px"
        })).append($("<div/>", {
            id: "MH_TimerM2",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })).append($("<div/>", {
            id: "MH_TimerM1",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })).append($("<div/>", {
            id: "MH_TimerD1",
            style: "float:right; width:3px;  height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -157px 0px"
        })).append($("<div/>", {
            id: "MH_TimerH2",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })).append($("<div/>", {
            id: "MH_TimerH1",
            style: "float:right; width:14px; height:21px; display:block; background:url('https://grepolis-david1327.e-monsite.com/medias/images/digi.gif') -140px 0px"
        })),
            TM.register("MH_TimeTick", 1e3, MH.TimerTick, {})
    }
        ,
        MH.TimerMenu = function() {
        var e = new mhMenu("TM");
        e.add(0 == MH.GuiUst.TimeMode ? "rb1.gif" : "rb0.gif", MH.Lang.lack, function() {
            MH.TimerMode(0)
        }),
            e.add(1 == MH.GuiUst.TimeMode ? "rb1.gif" : "rb0.gif", DM.getl10n("COMMON").server_time, function() {
            MH.TimerMode(1)
        }),
            e.add(2 == MH.GuiUst.TimeMode ? "rb1.gif" : "rb0.gif", MH.Lang.Ttoday, function() {
            MH.TimerMode(2)
        }),
            e.add(3 == MH.GuiUst.TimeMode ? "rb1.gif" : "rb0.gif", MH.Lang.Tnow, function() {
            MH.TimerMode(3)
        }),
            e.add(4 <= MH.GuiUst.TimeMode ? "rb1.gif" : "rb0.gif", MH.Lang.Tto, function() {
            MH.TimerTimeToWND()
        }),
            e.poupAT(0, 0),
            p = $("#MH_Timer").offset(),
            p.left += 50,
            p.top += 21,
            $("#mhm_TM").css({
            left: p.left + "px",
            top: p.top + "px"
        })
    }
        ,
        MH.TimerMode = function(e) {
        var t;
        "Nan" == (e = parseInt(e)) && (e = 1),
            e < 0 && (e = 0),
            5 < e && (e = 5),
            2 == (MH.GuiUst.TimeMode = e) && (MH.GuiUst.TimeTmp = NaN,
                                              null != (t = MH.LMHData_Get("last")).dat.t && (MH.GuiUst.TimeTmp = t.dat.t),
                                              isNaN(MH.GuiUst.TimeTmp) && (MH.GuiUst.TimeTmp = Timestamp.server() - Timestamp.clientGMTOffset(),
                                                                           t.dat.t = MH.GuiUst.TimeTmp,
                                                                           t.Save())),
            3 == e && (MH.GuiUst.TimeTmp = Timestamp.server() - Timestamp.clientGMTOffset()),
            MH.Storage(MH.GuiUstCookie, MH.GuiUst)
    }
        ,
        MH.TimerTimeToWND = function() {
        var e = MH.wndCreate("TimeTo", "⏰ " + MH.Lang.Tto, 200, 140);
        e.getJQElement().find(".gpwindow_content").html(""),
            e.getJQElement().find(".gpwindow_content").css("overflow-y", "auto"),
            e.appendContent($("<input/>", {
            id: "TimeToInp",
            class: "inp70",
            maxlength: "8",
            type: "text",
            style: "float:left;"
        })),
            e.appendContent(mhGui.But(1, "float:right;").click(function() {
            var e = getHumanReadableTimeDate(Timestamp.serverTimeToLocal()).substring(0, 8)
            , t = $("#TimeToInp").val()
            , n = "1" == $("#cb_TimeEndAlarm").attr("sel") ? 5 : 4;
            MH.OwnWnds.TimeTo.close(),
                ":" == t[1] && (t = "0" + t),
                e = mhUtl.timeStrToSec(e),
                t = mhUtl.timeStrToSec(t),
                0 != e && 0 != t && (t < e && (t += 86400),
                                     MH.GuiUst.TimeTmp = Timestamp.server(),
                                     MH.GuiUst.TimeTmp += t - e,
                                     MH.GuiUst.TimeTmp += Timestamp.clientGMTOffset(),
                                     MH.TimerMode(n))
        })),
            e.appendContent($("<div/>", {
            class: "clearfix"
        })),
            e.appendContent(MH.gui.CB("cb_TimeEndAlarm", " " + MH.Lang.Talarm, !1)),
            $("#cb_TimeEndAlarm").css({
            position: "absolute",
            bottom: "0px"
        }),
            e = Timestamp.server() - Timestamp.clientGMTOffset(),
            e += 3600,
            e = mhUtl.SecToTimeStr(e),
            $("#TimeToInp").val(e)
    }
        ,
        MH.theme = {
        url: MH.Home + "themes/"
    },
        MH.theme.Backlight = function(e) {
        e ? $("#ui_box .ui_highlight").css("display", "block") : $("#ui_box .ui_highlight").css("display", "none")
    }
        ,
        MH.theme.changeURL = function(e, t, n) {
        e.indexOf("?") < 0 ? 0 < (i = e.lastIndexOf("_")) && (hash = e.substr(i + 1, e.lastIndexOf(".") - i - 1),
                                                              e = e.substr(0, i),
                                                              e += ".png?" + hash) : (i = e.lastIndexOf("?"),
                                                                                      hash = e.substr(i + 1, e.lastIndexOf('"') - i - 1),
                                                                                      i = e.lastIndexOf(".png"),
                                                                                      e = e.substr(0, i),
                                                                                      e += "_" + hash + ".png");
        var i, t = null == n ? !1 : t || !1, a = e.substr(0, e.indexOf("http"));
        if (0 < (i = e.indexOf("/images/game/")))
            i += 13;
        else {
            if (i = e.indexOf("/themes/" + n + "/"),
                _log(e),
                i < 0)
                return e;
            i += ("/themes/" + n + "/").length
        }
        return e = e.substr(i),
            1 == t ? a + MH.Home + "themes/" + n + "/" + e : (_log(a + MH.GameImg + "/images/game/" + e),
                                                              a + MH.GameImg + "/images/game/" + e)
    }
        ,
        MH.theme.BlueRoofs = function(e) {
        for (var t, n, i = document.styleSheets[0].rules || document.styleSheets[0].cssRules, a = 0; a < i.length; a++)
            null != (t = i[a].selectorText) && (".building_icon40x40" != t ? t.indexOf(".city_overview_building.") < 0 || 0 <= i[a].style.backgroundImage.indexOf("buildings_night") || (n = !1,
        0 < t.indexOf("academy") && (n = !0),
        0 < t.indexOf("barracks") && (n = !0),
        0 < t.indexOf("docks") && (n = !0),
        0 < t.indexOf("farm") && (n = !0),
        0 < t.indexOf("ironer") && (n = !0),
        0 < t.indexOf("main") && (n = !0),
        0 < t.indexOf("market") && (n = !0),
        0 < t.indexOf("temple") && (n = !0),
        0 < t.indexOf("wall") && (n = !0),
        0 < t.indexOf("theater") && (n = !0),
        0 < t.indexOf("thermal") && (n = !0),
        0 < t.indexOf("library") && (n = !0),
        0 < t.indexOf("lighthouse") && (n = !0),
        0 < t.indexOf("tower") && (n = !0),
        0 < t.indexOf("trade_office") && (n = !0),
        0 < t.indexOf("street") && (n = !1),
        0 != n && (i[a].style.backgroundImage = 0 != e ? MH.theme.changeURL(i[a].style.backgroundImage.replace("2.108", "2.70"), e, "blueroofs") : MH.theme.changeURL(i[a].style.backgroundImage, e, "blueroofs"))) : i[a].style.backgroundImage = MH.theme.changeURL(i[a].style.backgroundImage, e, "blueroofs"));
        for (i = document.styleSheets[3].rules || document.styleSheets[3].cssRules,
             a = 0; a < i.length; a++)
            if (t = i[a].selectorText,
                null != t && ".building_icon40x40" == t)
                return void (i[a].style.backgroundImage = MH.theme.changeURL(i[a].style.backgroundImage, e, "blueroofs"))
    }
        ,
        MH.theme.WinterInit = function() {
        MapTiles.drawIslands_Winter = function(e) {
            var t, n, i, a, o, r, l, s = require("map/helpers"), d = document.createDocumentFragment();
            for (n in e)
                e.hasOwnProperty(n) && (o = "islandtile_" + (i = e[n]).x + "_" + i.y,
                                        document.getElementById(o) || (a = this.islands[i.type],
                                                                       r = s.map2Pixel(i.x, i.y),
                                                                       l = s.map2Pixel(a.width + 2, a.height + 2),
                                                                       (t = document.createElement("div")).style.left = r.x + this.cssOffset.x + "px",
                                                                       t.style.top = r.y + this.cssOffset.y + "px",
                                                                       t.style.width = l.x + "px",
                                                                       t.style.height = l.y + "px",
                                                                       t.className = "tile islandtile",
                                                                       t.id = o,
                                                                       t.style.backgroundImage = "url(" + MH.Home + "medias/images/" + a.img + ")",
                                                                       this.debug.show_coords_on_map && (t.innerHTML = i.x + "|" + i.y),
                                                                       d.appendChild(t)));
            return this.elm.tiles.append(d),
                this
        }
            ,
            0 != MH.Set.theme && MH.theme.Winter()
    }
        ,
        MH.theme.GetBCK = function() {
        var e = (t = 'url("https://gppl.innogamescdn.com/images/game/layout/city_overview/town_overview_noships.jpg")').substr(0, t.indexOf("https:"))
        , t = t.substr(t.indexOf("images"));
        return Game.night_mode && (t = t.replace(".jpg", "_night.jpg")),
            0 == MH.Set.theme ? e + MH.GameImg + "/" + t : e + MH.Home + "medias/images/" + t
    }
        ,
        MH.theme.Winter = function(e) {
        function n(e) {
            var t = e.substr(0, e.indexOf("https:"));
            return e = e.substr(e.indexOf("images")),
                Game.night_mode && (e = e.replace(".jpg", "_night.jpg")),
                0 == MH.Set.theme ? t + MH.GameImg + "/" + e : t + MH.Home + "medias/images/" + e
        }
        0 == e ? $(".ui_city_overview .town_background").css("background-image", "") : $(".ui_city_overview .town_background").css("background-image", n('url("https://gppl.innogamescdn.com/images/game/layout/city_overview/town_overview_noships.jpg")')),
            $.each($('div[id^="islandtile_"]'), function(e, t) {
            $(t).css("background-image", n($(t).css("background-image")))
        })
    }
        ,
        MH.theme.WinterClick = function() {
        0 == MH.Set.theme ? MH.Set.theme = 1 : MH.Set.theme = 0,
            MH.Storage(MH.SetCookie, MH.Set),
            MH.theme.Winter(MH.Set.theme)
    }
        ,
        MH.Not = {
        ids: [],
        nots: [],
        nTab: 0
    },
        MH.Not.Init = function() {
        MH.Not.ids.en = ["enacted", "your support", "attacking", "supports", "withdrawing", "back"],
            MH.Not.ids.pl = ["zaklęcie", "wsparcie", "atakuje", "wspiera", "wycofuje", "odsyła"],
            MH.Not.ids.es = ["Usaste", "refuerzo", "ataca", "apoya", "retira"],
            MH.Not.ids.ru = ["заклятие", "подкрепление", "нападает", "высылает", "отзывает", "выводит"],
            MH.Not.ids.hu = ["varázslatot", "támogatóidat", "támadja", "támogatja", "visszavonja"],
            MH.Not.ids.fr = ["lancé", "soutien", "attaque", "soutient", "retire", "renvoie"],
            MH.Not.ids.nl = ["heeft", "?", "valt", "steunt", "stuurt"],
            MH.Not.ids.el = ["Εξαπέλυσες", "υποστήριξή", "επιτίθεται", "υποστηρίζει", "αποσύρει"],
            MH.Not.ids.it = ["usato", "rinforzi", "attacca", "sostiene", "ritira", "riporta"],
            MH.Not.ids.de = ["hast", "Unterstützung", "greift", "unterstützt", "zieht"],
            MH.Not.ids.ro = ["folosit", "?", "atacă", "sprijină", "retrage", "trimite"],
            MH.Not.ids.pt = ["lançou", "?", "atacar", "apoia", "retirada"],
            MH.Not.ids.cs = ["Použil", "podporu", "útočí", "podporuje", "posílá", "stahuje"],
            MH.Not.ids.sk = ["použil", "podporu", "útočí", "podporuje", "posiela"],
            MH.Not.ids.tr = ["uyguladı", "desteğine", "saldırıyor", "destekliyor", "çekiyor"],
            MH.Not.ids.da = ["anvendt", "støtter", "angriber", "hjælper", "sender"],
            MH.Not.ids.fi = ["seuraavan:", "tukeasi", "hyökkää", "tukee", "vetää"],
            MH.Not.ids.sv = ["framkallat", "förstärkningar", "anfaller", "stöder", "skickar"],
            MH.Not.ids.nb = ["utøvd", "?", "angriper", "støtter", "trekker"],
            $("#notification_area #delete_all_notifications").after($("<a/>", {
            id: "MH_Noty",
            style: "width:16px; height:16px; cursor:pointer; display:block; position:absolute; right:17px; bottom:0; background:url('" + MH.Home + "medias/images/but.png') -405px -36px"
        }).click(function() {
            MH.Not.Menu()
        })),
            $.Observer("notification:push").subscribe("MHnpu", MH.Not.Read),
            $.Observer("notification:del").subscribe("MHnde", MH.Not.Read),
            MH.Not.Read()
    }
        ,
        MH.Not.Read = function() {
        $("#MH_Noty").css("display", "none"),
            9 < $("#hidden_notification_count").html() ? $("#hidden_notification_count").css("left", "-7px") : $("#hidden_notification_count").css("left", "0px");
        MH.Not.nots = [],
            GrepoNotificationStack.loop(function(e, t, n) {
            var i, a, o;
            if ("incoming_attack" == t.getType())
                return $("#MH_Noty").css("display", "block"),
                    (o = {
                    id: 9
                }).e = t,
                    void MH.Not.nots.push(o);
            if ("newreport" == t.getType() || "newtempreport" == t.getType()) {
                for ($("#MH_Noty").css("display", "block"),
                     a = t.getOpt().html,
                     n = MH.Not.ids[MH.DB.lang],
                     (o = {
                    id: 9
                }).e = t,
                     i = 0; i < n.length; i++)
                    if (-1 < a.indexOf(n[i])) {
                        o.id = i;
                        break
                    }
                "ru" == MH.DB.lang && a.indexOf(-1 < n[3]) && (o.id = 3),
                    "nl" == MH.DB.lang && a.indexOf("hebt") && (o.id = 0),
                    "pt" == MH.DB.lang && a.indexOf("framkallat") && (o.id = 0),
                    9 == o.id && 0,
                    5 == o.id && (o.id = 4),
                    MH.Not.nots.push(o)
            }
        }),
            $("#mh_NotiBox").length && ($("#mh_NotiBox").html(""),
                                        MH.Not.WndSet(MH.Not.nTab))
    }
        ,
        MH.Not.Menu = function() {
        var e = new mhMenu("NM")
        , t = DM.getl10n("market").remove + " " + DM.getl10n("COMMON").main_menu.reports + " "
        , n = DM.getl10n("report").inbox.filter_types;
        e.add(null, t + " " + n.attacks, function() {
            MH.Not.Delete("ra")
        }),
            e.add(null, t + " " + n.support, function() {
            MH.Not.Delete("rs")
        }),
            e.add(null, t + " " + MH.Lang.HELPTAB0, function() {
            MH.Not.Delete("rm")
        }),
            e.add(null, t + " " + n.misc, function() {
            MH.Not.Delete("rr")
        }),
            e.add("mreports.png", "... " + MH.GLng.Preview, function() {
            MH.Not.Wnd()
        }),
            e.poupAT(0, 0),
            p = $("#MH_Noty").offset(),
            p.left -= $("#mhm_NM").width() + 10,
            p.top -= $("#mhm_NM").height(),
            $("#mhm_NM").css({
            left: p.left + "px",
            top: p.top + "px"
        })
    }
        ,
        MH.Not.Wnd = function() {
        var e, t = MH.wndCreate("NotifyWnd", "", 520, 580);
        t.getJQElement().find(".gpwindow_content").css("overflow-y", "auto"),
            t.setContent2($("<div/>", {
            id: "mh_NotiBox",
            class: "settings-container",
            style: "left:0; bottom:30px"
        })),
            e = DM.getl10n("report").inbox.filter_types,
            t.getJQElement().append(mhGui.Tab("nitab", [e.all, MH.Lang.HELPTAB0, e.attacks, e.support, e.attacks + "-" + e.support, MH.Lang.Withdrawing, e.misc], "", function(e) {
            6 < e && (e = 6),
                MH.Not.nTab = e,
                $("#mh_NotiBox").html(""),
                MH.Not.WndSet(e)
        }).css("left", "0")),
            t.getJQElement().find(".gpwindow_content").append($("<div/>", {
            style: "left:0; bottom:0px; height:30px; position:absolute;"
        }).append("<label>" + MH.GLng.Select_all + '<input style="vertical-align: middle;" onclick="MH.Not.Wnd_markAll(this.checked);" type="checkbox"></label>').append(mhGui.Button(DM.getl10n("market").remove).click(function() {
            MH.Not.Wnd_delete()
        })).append(mhGui.Button(MH.GLng.Delete_all).click(function() {
            MH.Not.Wnd_delAll()
        }))),
            MH.ev.WAR("NotifyWnd", "OwnWnds", ""),
            $("#nitab_" + MH.Not.nTab).click()
    }
        ,
        MH.Not.WndSet = function(e) {
        var t, n;
        switch (--e) {
            case 1:
                e = 2;
                break;
            case 2:
                e = 3;
                break;
            case 3:
                e = 1;
                break;
            case 5:
                e = 9
        }
        for (t = 0; t < MH.Not.nots.length; t++)
            n = MH.Not.nots[t],
                0 <= e && n.id != e || $("#mh_NotiBox").append('<input name="notify_ids[]" value="' + t + '" type="checkbox" style="float:left;"><div class="notification ' + n.e.getType() + '" style="cursor: auto;"><div class="icon""></div><div class="description">' + n.e.getOpt().html + "</div></div>")
    }
        ,
        MH.Not.Wnd_markAll = function(e) {
        $("#mh_NotiBox input").prop("checked", e)
    }
        ,
        MH.Not.Wnd_delAll = function() {
        $("#mh_NotiBox input").prop("checked", !0),
            MH.Not.Wnd_delete()
    }
        ,
        MH.Not.Wnd_delete = function() {
        $.Observer("notification:del").unsubscribe("MHnde"),
            $("#mh_NotiBox input").each(function(e, t) {
            $(t).prop("checked") && (gpAjax.ajaxPost("notify", "delete", {
                id: MH.Not.nots[$(t).attr("value")].e.getId()
            }, !1),
                                     window.GrepoNotificationStack.del(MH.Not.nots[$(t).attr("value")].e),
                                     MH.Not.nots[$(t).attr("value")].e.destroy())
        }),
            $.Observer("notification:del").subscribe("MHnde", MH.Not.Read),
            MH.Not.Read()
    }
        ,
        MH.Not.Delete = function(e) {
        var t, n;
        for ($.Observer("notification:del").unsubscribe("MHnde"),
             t = 0; t < MH.Not.nots.length; t++)
            n = MH.Not.nots[t],
                "ra" == e && 2 != n.id || ("rs" != e || 1 == n.id && 4 == n.id && 5 == n.id) && ("rm" == e && 0 != n.id || "rr" == e && 9 != n.id || (gpAjax.ajaxPost("notify", "delete", {
                id: n.e.getId()
            }, !1),
                                                                                                                                                      window.GrepoNotificationStack.del(n.e),
                                                                                                                                                      n.e.destroy()));
        $.Observer("notification:del").subscribe("MHnde", MH.Not.Read),
            MH.Not.Read()
    }
    ;
    var mhCNST = {
        CountryNames: {
            de: "Deutschland",
            en: "United Kingdom",
            fr: "France",
            gr: "Ελλάδα",
            nl: "Nederland",
            es: "España",
            it: "Italia",
            ro: "România",
            se: "Sverige",
            cz: "Česko",
            pl: "Polska",
            pt: "Portugal",
            hu: "Magyarország",
            sk: "Slovensko",
            dk: "Danmark",
            ru: "Россия",
            no: "Noreg",
            br: "Brasil",
            tr: "Türkiye",
            us: "USA",
            ar: "Argentina",
            fi: "Suomi",
            zz: "Beta"
        },
        Commands: ["abort", "attack_incoming", "attack_land", "attack_pillage", "attack_sea", "attack_spy", "attack_takeover", "attack", "breakthrough", "colonization_failed", "colonization", "conqueror", "farm_attack", "illusion", "revolt_arising", "revolt_running", "revolt", "siege", "spying", "support", "trade", "underattack_land", "underattack_sea"],
        PowersIDs: [],
        lvlPowers: [],
        UTB_Units: ["sword", "slinger", "archer", "hoplite", "rider", "chariot", "catapult", "minotaur", "manticore", "zyklop", "harpy", "medusa", "centaur", "pegasus", "cerberus", "fury", "griffin", "calydonian_boar", "godsent", "big_transporter", "bireme", "attack_ship", "demolition_ship", "small_transporter", "trireme", "colonize_ship", "sea_monster"],
        GodsPowers: {
            zeus: ["divine_sign", "bolt", "fair_wind", "transformation"],
            poseidon: ["kingly_gift", "call_of_the_ocean", "earthquake", "sea_storm"],
            hera: ["wedding", "happiness", "fertility_improvement", "desire"],
            athena: ["patroness", "town_protection", "wisdom", "strength_of_heroes"],
            hades: ["underworld_treasures", "pest", "resurrection", "cap_of_invisibility"],
            artemis: ["natures_gift", "illusion", "cleanse", "effort_of_the_huntress"],
            aphrodite: ["narcissism", "charitable_festival", "hymn_to_aphrodite", "pygmalion"],
            ares: ["ares_sacrifice", "ares_army", "bloodlust", "spartan_training"]
        },
        OnlyAttackPowers: ["fair_wind", "transformation", "sea_storm", "desire", "wisdom", "strength_of_heroes", "resurrection", "cap_of_invisibility", "effort_of_the_huntress"],
        Buildings: {
            main: "A0",
            place: "AA",
            lumber: "A1",
            farm: "A2",
            stoner: "A3",
            storage: "A4",
            ironer: "B1",
            barracks: "B2",
            temple: "B3",
            market: "B4",
            docks: "C1",
            academy: "C2",
            wall: "C3",
            hide: "C4",
            theater: "D1",
            thermal: "D2",
            library: "D3",
            lighthouse: "D4",
            tower: "E1",
            statue: "E2",
            oracle: "E3",
            trade_office: "E4"
        },
        WorldWonders: {
            great_pyramid_of_giza: "pg",
            hanging_gardens_of_babylon: "gb",
            statue_of_zeus_at_olympia: "sz",
            temple_of_artemis_at_ephesus: "ta",
            mausoleum_of_halicarnassus: "mh",
            colossus_of_rhodes: "cr",
            lighthouse_of_alexandria: "la"
        },
        WorldWondersEx: {
            pg: "great_pyramid_of_giza",
            gb: "hanging_gardens_of_babylon",
            sz: "statue_of_zeus_at_olympia",
            ta: "temple_of_artemis_at_ephesus",
            mh: "mausoleum_of_halicarnassus",
            cr: "colossus_of_rhodes",
            la: "lighthouse_of_alexandria"
        },
        Units: {
            militia: "mm",
            sword: "la",
            slinger: "lb",
            archer: "lc",
            hoplite: "ld",
            rider: "le",
            chariot: "lf",
            catapult: "lg",
            big_transporter: "sa",
            bireme: "sb",
            attack_ship: "sc",
            demolition_ship: "sd",
            small_transporter: "se",
            trireme: "sf",
            colonize_ship: "sg",
            manticore: "ga",
            minotaur: "gb",
            zyklop: "gc",
            sea_monster: "gd",
            harpy: "ge",
            medusa: "gf",
            centaur: "gg",
            pegasus: "gh",
            cerberus: "gi",
            fury: "gj",
            griffin: "gk",
            calydonian_boar: "gl",
            godsent: "gm",
            cheiron: "ha",
            ferkyon: "hb",
            orpheus: "hc",
            terylea: "hd",
            andromeda: "he",
            odysseus: "hf",
            democritus: "hg",
            apheledes: "hh",
            christopholus: "hi",
            leonidas: "hj",
            urephon: "hk",
            zuretha: "hl",
            hercules: "hm",
            helen: "hn",
            atalanta: "ho",
            iason: "hp",
            hector: "hq",
            agamemnon: "hr",
            aristotle: "hs",
            rekonos: "ht",
            ylestres: "hu",
            pariphaistes: "hv",
            deimos: "hw",
            pelops: "hx",
            themistokles: "hy",
            daidalos: "hz",
            medea: "ia",
            telemachos: "ib",
            eurybia: "ic",
            ajax: "id",
            alexandrios: "ie",
            perseus: "if",
            argus: "ig",
            philoctetes: "ih",
            lysippe: "ii",
            melousa: "ij",
            unknown: "xx"
        },
        CreatePowersCodes: function() {
            var e, t, n, i;
            for (n in GameData.powers.ares_rage.needs_level = !0,
                 GameData.powers)
                if (-1 < (t = GameData.powers[n]).meta_fields.indexOf("type"))
                    if ("unit_training_boost" == n)
                        for (e in mhCNST.UTB_Units)
                            mhCNST.UTB_Units.hasOwnProperty(e) && (i = mhCNST.UTB_Units[e] + "_generation",
                                                                   t.needs_level && mhCNST.lvlPowers.push(i),
                                                                   mhCNST.PowersIDs.push(i));
                    else if (null == t.name.type)
                        i = n,
                            t.needs_level && mhCNST.lvlPowers.push(i),
                            mhCNST.PowersIDs.push(i);
                    else
                        for (e in t.name.type)
                            t.name.type.hasOwnProperty(e) && ("resource_boost" == (i = n) && (i = "resource_" + e),
                                                              "longterm_resource_boost" == n && (i = "longterm_" + e + "_boost"),
                                                              "instant_resources" == n && (i = n + "_" + e),
                                                              "instant_resources_rare" != n && "instant_resources_epic" != n || (i = n + "_" + e),
                                                              "instant_currency" == n && (i = e + "_generation"),
                                                              "missions_power_1" != n && "missions_power_2" != n && "missions_power_3" != n && "missions_power_4" != n && "missions_reduce_ritual_cooldown" != n && "crafting_recipes_power" != n || (i = e + " " + n),
                                                              "population_boost" == n && (i = n + "_" + e),
                                                              t.needs_level && mhCNST.lvlPowers.push(i),
                                                              mhCNST.PowersIDs.push(i));
                else
                    i = n,
                        t.needs_level && mhCNST.lvlPowers.push(i),
                        mhCNST.PowersIDs.push(i);
            mhCNST.PowersIDs.push("small_temple_powers"),
                mhCNST.PowersIDs.push("large_temple_powers")
        },
        GetBuildingCode: function(e) {
            return mhCNST.Buildings[e] || "XX"
        },
        GetBuildingCodeId: function(e) {
            for (var t in mhCNST.Buildings)
                if (mhCNST.Buildings[t] == e)
                    return t
        },
        GetUnitCode: function(e) {
            return mhCNST.Units[e] || "XX"
        }
    };
    function _mh5534272514() {
        function n(e, t, n) {
            if (!e || !t || !n)
                return 1;
            for (var i in e in n || (n[e] = {}),
                 t)
                n[e][i] = t[i];
            return 0
        }
        this.lang = Game.market_id,
            this.land = Game.world_id.substring(0, 2),
            this.allys = {},
            this.plays = {},
            this.towns = {},
            this.islas = {},
            this.play = {},
            this.ally = {},
            this.LoadedAllys = !1,
            this.LoadedPlays = !1,
            this.UpdateAllFromRemote = function(e) {
            a.UpdateAllysFromRemote(function() {
                a.UpdatePlaysFromRemote(e)
            })
        }
            ,
            this.UpdateAllysFromRemote = function(t) {
            var n, i;
            if (1 != a.LoadedAllys)
                try {
                    $.ajax({
                        type: "GET",
                        url: MH.GameUrl.replace("/game", "/data/alliances.txt"),
                        dataType: "text",
                        success: function(e) {
                            for (n in e = (e = e.replace(/\+/g, " ") + "\n").split("\n"))
                                "" != n && (e[n] += ",",
                                            i = e[n].split(","),
                                            a.allys[i[0]] = {},
                                            a.allys[i[0]].id = i[0],
                                            a.allys[i[0]].name = decodeURIComponent(i[1]),
                                            a.allys[i[0]].points = i[2],
                                            a.allys[i[0]].towns = i[3],
                                            a.allys[i[0]].members = i[4],
                                            a.allys[i[0]].rank = i[5]);
                            for (n in a.LoadedAllys = !0,
                                 a.allys[Game.alliance_id] && (Game.alliance_name = a.allys[Game.alliance_id].name),
                                 i = 0,
                                 MH.GuiUst.SymAlly)
                                MH.GuiUst.SymAlly.hasOwnProperty(n) && (n in a.allys || (delete MH.GuiUst.SymAlly[n],
                                                                                         i++));
                            0 != i && MH.Storage(MH.GuiUstCookie, MH.GuiUst),
                                t && t()
                        }
                    })
                } catch (i) {
                    t && t()
                }
            else
                t && t()
        }
            ,
            this.UpdatePlaysFromRemote = function(t) {
            var n, i;
            if (1 != a.LoadedPlays)
                try {
                    $.ajax({
                        type: "GET",
                        url: MH.GameUrl.replace("/game", "/data/players.txt"),
                        dataType: "text",
                        success: function(e) {
                            for (n in e = (e = e.replace(/\+/g, " ") + "\n").split("\n"))
                                "" != n && (e[n] += ",",
                                            i = e[n].split(","),
                                            a.plays[i[0]] = {},
                                            a.plays[i[0]].id = i[0],
                                            a.plays[i[0]].name = decodeURIComponent(i[1]),
                                            a.plays[i[0]].allianceID = i[2],
                                            a.plays[i[0]].points = i[3],
                                            a.plays[i[0]].rank = i[4],
                                            a.plays[i[0]].towns = i[5]);
                            for (n in a.LoadedPlays = !0,
                                 i = 0,
                                 MH.GuiUst.SymPlay)
                                MH.GuiUst.SymPlay.hasOwnProperty(n) && (n in a.plays || (delete MH.GuiUst.SymPlay[n],
                                                                                         i++));
                            0 != i && MH.Storage(MH.GuiUstCookie, MH.GuiUst),
                                t && t()
                        }
                    })
                } catch (i) {
                    t && t()
                }
            else
                t && t()
        }
            ,
            this.sAlly = function(e) {
            e.hasOwnProperty("id") && (e.id = parseInt(e.id),
                                       isNaN(e.id) || (a.allys.hasOwnProperty(e.id) || (a.allys[e.id] = {
                id: "?",
                name: "?",
                points: "?",
                towns: "?",
                members: "?",
                rank: "?"
            }),
                                                       a.allys[e.id].id = e.id,
                                                       e.hasOwnProperty("name") && (a.allys[e.id].name = e.name),
                                                       e.hasOwnProperty("points") && (a.allys[e.id].points = e.points),
                                                       e.hasOwnProperty("towns") && (a.allys[e.id].towns = e.towns),
                                                       e.hasOwnProperty("members") && (a.allys[e.id].members = e.members),
                                                       e.hasOwnProperty("rank") && (a.allys[e.id].rank = e.rank)))
        }
            ,
            this.sPlay = function(e) {
            e.hasOwnProperty("id") && (e.id = parseInt(e.id),
                                       isNaN(e.id) || (a.plays.hasOwnProperty(e.id) || (a.plays[e.id] = {
                id: "?",
                name: "?",
                allianceID: "?",
                points: "?",
                rank: "?",
                towns: "?"
            }),
                                                       a.plays[e.id].id = e.id,
                                                       e.hasOwnProperty("name") && (a.plays[e.id].name = e.name),
                                                       e.hasOwnProperty("allianceID") && (a.plays[e.id].allianceID = e.allianceID),
                                                       e.hasOwnProperty("points") && (a.plays[e.id].points = e.points),
                                                       e.hasOwnProperty("rank") && (a.plays[e.id].rank = e.rank),
                                                       e.hasOwnProperty("towns") && (a.plays[e.id].towns = e.towns)))
        }
            ,
            this.sTown = function(e, t) {
            return n(e, t, a.towns)
        }
            ,
            this.sIsla = function(e, t) {
            return n(e, t, a.islas)
        }
            ,
            this.GetFromPlayerProfile = function(e) {
            var t, n = $.ajax({
                url: "/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=%7B%22player_id%22%3A" + e + "%2C%22town_id%22%3A" + Game.townId + "%2C%22nlreq_id%22%3A" + NotificationLoader.isGameInitialized() + "%7D",
                async: !1
            });
            try {
                _responseText = JSON.parse(n.responseText).plain.html
            } catch (e) {
                _responseText = n.responseText
            }
            return $(_responseText).eq(0).children("h3").length ? (ret = $(_responseText).eq(0).children("h3").html(),
                                                                   mhCol.plays.hasOwnProperty(e) || (mhCol.plays[e] = {}),
                                                                   mhCol.plays[e].id = e,
                                                                   mhCol.plays[e].name = $(_responseText).eq(0).children("h3").html().clear(),
                                                                   0 <= (t = $(_responseText).eq(0).children("a").attr("onclick")).indexOf("Layout.allianceProfile.open(") && (mhCol.plays[e].allianceID = t.replace(/Layout\.allianceProfile\.open\((.*?),(.*?)\)/gi, "$2"),
        t = t.replace(/Layout\.allianceProfile\.open\((.*?),(.*?)\)/gi, "$1"),
        mhCol.allys.hasOwnProperty(mhCol.plays[e].allianceID) || (mhCol.allys[mhCol.plays[e].allianceID] = {}),
        mhCol.allys[mhCol.plays[e]].name = t),
                                                                   0) : 1
        }
            ,
            this.ART_PlayerProfile = function(e) {
            var t;
            if (a.play = {},
                a.ally = {},
                t = $("<div/>").html(JSON.parse(e).plain.html),
                null != (e = a.PlayId_PlayName(t.find("#player_info h3:first").html().clear())))
                a.play.id = e;
            else if ((e = t.find("#profile_image img")).length && 0 <= (e = e.attr("src")).indexOf("player_id=") && (e = (e = e.substr(e.indexOf("=") + 1, e.length)).substr(0, e.indexOf("&")),
                                                                                                                     isNaN(e) || (a.play.id = e)),
                     !a.play.hasOwnProperty("id")) {
                if (null == (e = MH.ghref(t.find("#player_towns a.gp_town_link:first"), "id")))
                    return;
                if (null == (e = a.PlayId_TownID(e)))
                    return;
                a.play.id = e
            }
            a.play.name = t.find("#player_info h3:first").html().clear(),
                a.play.points = t.find("#player_points div").eq(1).html().clear(),
                e = t.find("#player_points div").eq(0).html(),
                a.play.rank = e.substr(0, e.indexOf(".")),
                a.play.towns = t.find("#player_towns li").length,
                a.sPlay(a.play)
        }
            ,
            this.ART_AllianceProfile = function(e, t) {
            var n;
            a.ally = {},
                e = JSON.parse(e),
                n = $("<div/>").html(e.json.html),
                a.ally.id = e.json.alliance_id,
                a.ally.name = t,
                t = n.find("#player_info ul li").eq(0).html().clear(),
                a.ally.members = t.substr(0, t.indexOf("/")),
                t = n.find("#player_info ul li").eq(1).html().clear(),
                a.ally.points = t.substr(0, t.indexOf(" ")),
                t = n.find("#ally_rank_text .rank_number").eq(0).html().clear(),
                a.ally.rank = t.replace(".", ""),
                a.sAlly(a.ally)
        }
            ,
            this.ART_TownInfo = function(e) {
            var t;
            a.play = {},
                a.ally = {},
                null != (t = $(JSON.parse(e).plain.html)).find("a.gp_player_link").attr("href") && (e = MH.Link2Struct(t.find("a.gp_player_link:first").attr("href")),
                                                                                                    a.play.id = e.id,
                                                                                                    a.play.name = e.name,
                                                                                                    a.play.allianceID = null,
                                                                                                    t.find("a.color_table.assign_ally_color").length && (e = t.find("a.color_table.assign_ally_color").parent().parent().find("a:first").attr("onclick"),
        a.ally.id = e.replace(/(.*?)\('(.*?)',(.*?)\)(.*?)/, "$3"),
        a.ally.name = e.replace(/(.*?)\('(.*?)',(.*?)\)(.*?)/, "$2"),
        a.play.allianceID = a.ally.id,
        a.sAlly(a.ally)),
                                                                                                    a.sPlay(a.play))
        }
            ,
            this.AllyName_AllyId = function(e) {
            return e in a.allys ? a.allys[e].name : null
        }
            ,
            this.AllyId_AllyName = function(e) {
            for (var t in a.allys)
                if (a.allys[t].name == e)
                    return a.allys[t].id;
            return null
        }
            ,
            this.AllyId_PlayID = function(e) {
            return e in a.plays ? a.plays[e].allianceID : null
        }
            ,
            this.AllyId_PlayName = function(e) {
            e = this.PlayId_PlayName(e);
            return null == e ? "" : this.AllyId_PlayID(e)
        }
            ,
            this.AllyId_PlayIDaa = function(e) {
            return null
        }
            ,
            this.AllyName_PlayId = function(e) {
            return e in a.plays ? (e = a.plays[e].allianceID)in a.allys ? a.allys[e].name : "" : null
        }
            ,
            this.AllyName_PlayName = function(e) {
            e = mhCol.PlayId_PlayName(e);
            return null != e && e in mhCol.plays && mhCol.plays[e].allianceID in mhCol.allys ? mhCol.allys[mhCol.plays[e].allianceID].name : ""
        }
            ,
            this.PlayName_PlayId = function(e) {
            if (e in mhCol.plays)
                return mhCol.plays[e].name;
            if (e == Game.player_id)
                return mhCol.plays[e] = {},
                    mhCol.plays[e].id = Game.player_id,
                    mhCol.plays[e].name = Game.player_name,
                    Game.player_name;
            var t = $.ajax({
                url: "/game/player?action=get_profile_html&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=%7B%22player_id%22%3A" + e + "%2C%22town_id%22%3A" + Game.townId + "%2C%22nlreq_id%22%3A" + NotificationLoader.isGameInitialized() + "%7D",
                async: !1
            });
            try {
                _responseText = JSON.parse(t.responseText).plain.html
            } catch (e) {
                _responseText = t.responseText
            }
            return $(_responseText).eq(0).children("h3").length ? (ret = $(_responseText).eq(0).children("h3").html(),
                                                                   mhCol.plays[e] = {},
                                                                   mhCol.plays[e].id = e,
                                                                   mhCol.plays[e].name = $(_responseText).eq(0).children("h3").html().clear(),
                                                                   mhCol.plays[e].name) : "?"
        }
            ,
            this.PlayId_PlayName = function(e) {
            for (var t in a.plays)
                if (a.plays[t].name == e)
                    return a.plays[t].id;
            return e == Game.player_name ? (mhCol.plays[Game.player_id] = {},
                                            mhCol.plays[Game.player_id].id = Game.player_id,
                                            mhCol.plays[Game.player_id].name = Game.player_name,
                                            Game.player_id) : null
        }
            ,
            this.PlayId_PlayIDz = function(e) {
            return null
        }
            ,
            this.PlayId_PlayNamez = function(e) {
            return null
        }
            ,
            this.PlayId_PlayIDa = function(e) {
            return null
        }
            ,
            this.PlayId_TownID = function(e) {
            if (e in mhCol.towns)
                return mhCol.towns[e].playerID;
            if (e in ITowns.towns)
                return mhCol.towns[e] = {},
                    mhCol.towns[e].id = e,
                    mhCol.towns[e].name = ITowns.getTown(e).name,
                    mhCol.towns[e].playerID = Game.player_id,
                    Game.player_id;
            var t = $.ajax({
                url: "/game/town_info?action=info&town_id=" + Game.townId + "&h=" + Game.csrfToken + "&json=%7B%22id%22%3A" + e.toString() + "%2C%22town_id%22%3A" + Game.townId + "%2C%22nlreq_id%22%3A" + NotificationLoader.isGameInitialized() + "%7D",
                async: !1
            });
            try {
                res = JSON.parse(t.responseText).plain.html
            } catch (e) {
                res = t.responseText
            }
            var n = $(res).attr("data-player").clear();
            return !isNaN(n) && n.length ? (mhCol.towns[e] = {},
                                            mhCol.towns[e].id = e,
                                            mhCol.towns[e].name = $(res).find("#towninfo_towninfo .game_border .game_header.bold:first").html().clear(),
                                            mhCol.towns[e].playerID = n,
                                            mhCol.towns[e].playerID) : null
        }
            ,
            this.PlayName_TownID = function(e) {
            if (null == e)
                return "e";
            e = mhCol.PlayId_TownID(e);
            return null != e ? mhCol.PlayName_PlayId(e) : DM.getl10n("common").ghost_town
        }
            ,
            this.TownName_TownID = function(e) {
            return null == e ? "?" : (this.PlayName_TownID(e),
                                      e in mhCol.towns && void 0 !== mhCol.towns[e].name ? mhCol.towns[e].name : e)
        }
            ,
            this.OwnAllyName_FromRemote = function() {
            var t, e;
            if (null == Game.alliance_id)
                return "";
            for (e in MH.MMM.AlliancePact) {
                if ((t = MH.MMM.AlliancePact[e].attributes).alliance_1_id == Game.alliance_id)
                    return t.alliance_1_name;
                if (t.alliance_2_id == Game.alliance_id)
                    return t.alliance_2_name
            }
            t = MH.GameGet("town_info", "info", {
                id: Game.townId.toString()
            }, !1);
            try {
                t = t.plain.html
            } catch (e) {
                t = null
            }
            if (null == t)
                return "?";
            var n = $(t).eq(2);
            if (n.find("a.color_table.assign_ally_color").length) {
                n = n.find("a.color_table.assign_ally_color").parent().parent().find("a:first").attr("onclick"),
                    n.replace(/(.*?)\('(.*?)',(.*?)\)(.*?)/, "$3");
                return n.replace(/(.*?)\('(.*?)',(.*?)\)(.*?)/, "$2")
            }
            return "?"
        }
            ,
            this.GetTownInfo_forAT = function(e) {
            t = MH.GameGet("town_info", "info", {
                id: e
            }, !1);
            try {
                t = t.plain.html
            } catch (e) {
                t = null
            }
            var t, n = $(t).eq(2);
            return (t = {}).id = parseInt(e),
                t.name = n.find("#towninfo_towninfo .game_border .game_header.bold").html().strip_tags().replace(/\s+/g, " "),
                e = (e = n.find(".jmp_2_town>.info_jump_to_town").attr("onclick").replace(/\s+/g, "")).substring(e.indexOf("x:") + 2),
                t.ix = parseInt(e.substring(0, e.indexOf(","))),
                e = e.substring(e.indexOf("y:") + 2),
                t.iy = parseInt(e.substring(0, e.indexOf(","))),
                t
        }
        ;
        var a = this
        }
    function _mh5761928745() {
        this.Clone = function(e) {
            var t, n = {};
            for (t in e)
                e.hasOwnProperty(t) && (n[t] = e[t]);
            return n
        }
        ;
        var t = null;
        this.PlayYouTube_HTML = function(e, t, n) {
            var i;
            return -1 < (i = (e = (e = decodeURIComponent(e)).substr(e.indexOf("?") + 1)).substr(e.indexOf("v=") + 2)).indexOf("&") && (i = i.substr(0, i.indexOf("&"))),
                -1 < e.indexOf("list=") ? (-1 < (e = e.substr(e.indexOf("list="))).indexOf("&") && (e = e.substr(0, e.indexOf("&"))),
                                           n ? '<center><iframe width="336" height="190" frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/' + i + "?rel=0&autoplay=" + t + "&" + e + '"></iframe></center>' : '<center><iframe width="560" height="315" frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/' + i + "?rel=0&autoplay=" + t + "&" + e + '"></iframe></center>') : n ? '<center><iframe width="336" height="190" frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/' + i + "?rel=0&autoplay=" + t + '"></iframe></center>' : '<center><iframe width="560" height="315" frameborder="0" allowfullscreen="" src="https://www.youtube.com/embed/' + i + "?rel=0&autoplay=" + t + '"></iframe></center>'
        }
            ,
            this.PlayYouTube = function(e) {
            e = this.PlayYouTube_HTML(e, "1"),
                null != t && t.close(),
                (t = Layout.dialogWindow.open("", "YouTube", 560, 360, null, !0)).setPosition("center", "center"),
                t.setContent(e)
        }
            ,
            this.GetBuildingName = function(e) {
            return GameData.buildings[e] ? GameData.buildings[e].name : e
        }
            ,
            this.timeStrSrvCurr = function(e) {
            return getHumanReadableTimeDate(new Date(Timestamp.serverTime().getTime() + 1e3 * e)).substring(0, 8)
        }
            ,
            this.timeStrCorrect = function(e) {
            var t;
            return void 0 !== e && (":" == e.charAt(1) && (e = "0" + e),
                                    8 == e.length && (":" == e.charAt(2) && (":" == e.charAt(5) && ("NaN" != (t = parseInt(e.substring(0, 2))) && (!(24 <= t) && ("NaN" != (t = parseInt(e.substring(3, 5))) && (!(60 <= t) && ("NaN" != (t = parseInt(e.substring(6, 8))) && !(60 <= t)))))))))
        }
            ,
            this.timeStrToSec = function(e) {
            return ":" == e.charAt(1) && (e = "0" + e),
                !!this.timeStrCorrect(e) && 60 * parseInt(e.substring(0, 2)) * 60 + 60 * parseInt(e.substring(3, 5)) + (e = parseInt(e.substring(6, 8)))
        }
            ,
            this.SecToTimeStr = function(e) {
            for (; 86400 < e; )
                e -= 86400;
            var t, n, i = Math.floor(e / 3600);
            return e -= 60 * i * 60,
                n = e -= 60 * (t = Math.floor(e / 60)),
                (i = i.toString()).length < 2 && (i = "0" + i),
                (t = t.toString()).length < 2 && (t = "0" + t),
                (n = n.toString()).length < 2 && (n = "0" + n),
                i + ":" + t + ":" + n
        }
            ,
            this.MDelta = function(e, t) {
            return t < e ? e - t : t - e
        }
            ,
            this.lnkMyTown = function(e) {
            var t = ITowns.getTown(e);
            return '<a class="gp_town_link" href="#' + btoa('{"id":' + e + ',"ix":' + t.getIslandCoordinateX() + ',"iy":' + t.getIslandCoordinateY() + ',"tp":"town","name":"' + unescape(encodeURIComponent(t.name)) + '"}') + '">' + t.name + "</a>"
        }
            ,
            this.lnkMyTownIco = function(e, t, n, i) {
            return '<span class="bbcodes bbcodes_town">' + this.lnkMyTown(e, t, n, i) + "</span>"
        }
            ,
            this.lnkTown = function(e, t, n, i) {
            return '<a class="gp_town_link" href="#' + btoa('{"id":' + e + ',"ix":' + n + ',"iy":' + i + ',"tp":"town","name":"' + unescape(encodeURIComponent(t)) + '"}') + '">' + t + "</a>"
        }
            ,
            this.lnkTownCol = function(e, t, n, i, a) {
            return '<a style="color:' + a + '"; class="gp_town_link" href="#' + btoa('{"id":' + e + ',"ix":' + n + ',"iy":' + i + ',"tp":"town","name":"' + unescape(encodeURIComponent(t)) + '"}') + '">' + t + "</a>"
        }
            ,
            this.lnkTownIco = function(e, t, n, i) {
            return '<span class="bbcodes bbcodes_town">' + this.lnkTown(e, t, n, i) + "</span>"
        }
            ,
            this.lnkPlayer = function(e, t) {
            return '<a class="gp_player_link" href="#' + btoa('{"id":' + e + ',"name":"' + unescape(encodeURIComponent(t)) + '"}') + '">' + t + "</a>"
        }
            ,
            this.lnkPlayerCol = function(e, t, n) {
            return '<a style="color:' + n + '" class="gp_player_link" href="#' + btoa('{"id":' + e + ',"name":"' + unescape(encodeURIComponent(t)) + '"}') + '">' + t + "</a>"
        }
            ,
            this.lnkPlayerIco = function(e, t) {
            return '<img style="float: left; padding-right: 2px;" alt="" src="https://grepolis-david1327.e-monsite.com/medias/images/player.gif">' + this.lnkPlayer(e, t)
        }
            ,
            this.lnkAlly = function(e, t) {
            return "<a onclick=\"Layout.allianceProfile.open('" + t + "'," + e + ')" href="#">' + t + "</a>"
        }
            ,
            this.lnkAllyCol = function(e, t, n) {
            return '<a style="color:' + n + '" onclick="Layout.allianceProfile.open(\'' + t + "'," + e + ')" href="#">' + t + "</a>"
        }
            ,
            this.lnkAllyIco = function(e, t) {
            return '<img class="MH_aFlag" style="float: left; padding-right: 2px;" alt="" src="' + MH.Home + 'medias/images/ally.gif">' + this.lnkAlly(e, t)
        }
            ,
            this.lnkFarm = function(e, t, n, i) {
            return '<a class="gp_town_link" href="#' + btoa('{"id":' + e + ',"ix":' + n + ',"iy":' + i + ',"tp":"farm_town","name":"' + unescape(encodeURIComponent(t)) + '"}') + '">' + t + "</a>"
        }
            ,
            this.lnkFarmIco = function(e, t, n, i) {
            return '<span class="bpv_villages farm_town_status_1"></span>' + this.lnkFarm(e, t, n, i)
        }
            ,
            this.hrefIsland = function(e, t, n, i, a) {
            return "#" + btoa('{"tp":"island","id":' + e + ',"ix":' + t + ',"iy":' + n + ',"res":"' + i + '","lnk":true,"wn":"' + a + '"}')
        }
            ,
            this.lnkIsland = function(e, t, n, i) {
            return g = '{"tp":"island","id":"' + e + '","ix":"' + t + '","iy":"' + n + '","res":"' + i + '"}',
                '<a class="gp_island_link" href="#' + btoa(g) + '"></a><div class="islandinfo_malus"></div>'
        }
            ,
            this.gp_player_link2bbcodes_player = function(e) {
            var t = MH.Link2Struct(e.attr("href"));
            e.html('<a class="bbcodes_player" onclick="Forum.openPlayerProfile(\'' + t.name + "'," + t.id + ')" href="javascript:void(0)">' + t.name + "</a>")
        }
            ,
            this.getTownsDis = function(e, t, n, i, a, o, r, l) {
            return Math.sqrt(Math.pow(parseFloat(t) - parseFloat(o), 2) + Math.pow(parseFloat(n) - parseFloat(r), 2))
        }
    }
    function TMHData(e, t) {
        t = t || {};
        this.id = e,
            this.cID = "cMH_" + e,
            this.def = t,
            this.dat = {},
            (MH.LMHData[e] = this).GetDataObj = function() {
            return this.dat
        }
            ,
            this.Clear = function() {
            this.dat = {}
        }
            ,
            this.ApplyDefaults = function() {
            for (var e in this.dat = {},
                 this.def)
                this.dat[e] = this.def[e]
        }
            ,
            this.InsertKeys = function(e, t) {
            for (var t = t || "?", n = 0; n < e.length; n++)
                this.def[e[n]] = t,
                    this.dat[e[n]] = t
        }
            ,
            this.CollectFrom = function(e) {
            var t, n = 0;
            if ("object" != typeof e)
                return n;
            if ($.isEmptyObject(e))
                return n;
            for (t in e)
                this.dat.hasOwnProperty(t) && this.dat[t] != e[t] && (this.dat[t] = e[t],
                                                                      n++);
            return n
        }
            ,
            this.GetKeysByVal = function(e) {
            var t, n = [];
            for (t in this.dat)
                this.dat[t] == e && n.push(t);
            return n
        }
            ,
            this.Load = function() {
            var e = MH.Storage(this.cID);
            return null == e || 0 != e && (this.CollectFrom(e),
                                           !0)
        }
            ,
            this.Save = function() {
            return MH.Storage(this.cID, this.dat)
        }
            ,
            this.ApplyDefaults()
    }
    function _mh5534272947() {
        this.wondInf = "?",
            this.Init = function() {}
            ,
            this.Go2 = function(e, t, a, o, n) {
            e = e || "irq",
                a = a || null,
                o = o || null,
                n = n || null;
            return (t = t || {}).nfo = {},
                t.nfo.pla = MH.DB.player,
                t.nfo.plaID = MH.DB.playerID,
                t.nfo.alyID = Game.alliance_id,
                t.nfo.lng = MH.DB.lang,
                t.nfo.lnd = MH.DB.land,
                t.nfo.world = MH.DB.world,
                t.nfo.key = e,
                $.ajax(MH.Home + "mhpost.php", {
                method: "POST",
                data: t,
                crossDomain: !0,
                global: !1,
                success: function(e, t, n) {
                    var i = !1;
                    try {
                        i = e.ret.e
                    } catch (i) {
                        i = !1
                    }
                    "ok" == i ? a && a(e) : o && o()
                },
                error: function(e, t, n) {
                    o && o()
                },
                complete: function(e, t) {
                    n && n()
                }
            })
        }
            ,
            this.gwondInf = function(e) {
            var t, n, i, a = "?";
            if (e = JSON.parse(e).json,
                (n = JSON.parse(e.menu))["alliance-world_wonders"]) {
                for (t in (a = {
                    isEvent: !0
                }).EventName = n["alliance-world_wonders"].name,
                     a.wondNames = {},
                     a.wondAlly = {},
                     n = e.data.world_wonders)
                    n.hasOwnProperty(t) && (i = n[t].wonder_type)in mhCNST.WorldWonders && (i = mhCNST.WorldWonders[i],
                                                                                            a.wondNames[i] = n[t].full_name,
                                                                                            a.wondAlly[i] = {},
                                                                                            a.wondAlly[i].id = n[t].id,
                                                                                            a.wondAlly[i].ix = n[t].island_x,
                                                                                            a.wondAlly[i].iy = n[t].island_y,
                                                                                            a.wondAlly[i].it = n[t].island_type,
                                                                                            a.wondAlly[i].lvl = n[t].expansion_stage);
                for (t in n = e.data.buildable_wonders)
                    n.hasOwnProperty(t) && t in mhCNST.WorldWonders && (i = mhCNST.WorldWonders[t],
                                                                        a.wondNames[i] = n[t].name)
            } else
                a = {
                    isEvent: !1
                };
            "?" != a && (o.wondInf = a,
                         (n = {}).wondInf = a,
                         MH.Storage("cMH_wi", n))
        }
        ;
        var o = this
        }
    function _mh5998734257() {
        this.Border = function() {
            return $("<div/>", {
                class: "game_border"
            }).append($("<div/>", {
                class: "game_border_top"
            })).append($("<div/>", {
                class: "game_border_bottom"
            })).append($("<div/>", {
                class: "game_border_left"
            })).append($("<div/>", {
                class: "game_border_right"
            })).append($("<div/>", {
                class: "game_border_corner corner1"
            })).append($("<div/>", {
                class: "game_border_corner corner2"
            })).append($("<div/>", {
                class: "game_border_corner corner3"
            })).append($("<div/>", {
                class: "game_border_corner corner4"
            }))
        }
            ,
            this.Border2 = function(e, t, n) {
            var i = $("<div/>");
            return $(i).append($("<div/>", {
                class: "box top left"
            }).append($("<div/>", {
                class: "box top right"
            }).append($("<div/>", {
                class: "box top center"
            })))),
                $(i).append($("<div/>", {
                class: "box middle left"
            }).append($("<div/>", {
                class: "box middle right"
            }).append($("<div/>", {
                class: "box middle center",
                style: "height:" + n + "px;"
            }).append($("<span/>", {
                class: "town_name"
            }).html(e)).append(t)))),
                $(i).append($("<div/>", {
                class: "box bottom left"
            }).append($("<div/>", {
                class: "box bottom right"
            }).append($("<div/>", {
                class: "box bottom center"
            })))),
                i
        }
            ,
            this.BorderLight = function(e, t) {
            var n = $("<div/>");
            return $(n).append($("<div/>", {
                class: "box top left"
            }).append($("<div/>", {
                class: "box top right"
            }).append($("<div/>", {
                class: "box top center"
            })))),
                $(n).append($("<div/>", {
                class: "box middle left"
            }).append($("<div/>", {
                class: "box middle right"
            }).append($("<div/>", {
                class: "box middle center"
            }).append($("<span/>", {
                class: "town_name"
            }).html(e)).append($("<div/>", {
                class: "box_content"
            }).html(t))))),
                $(n).append($("<div/>", {
                class: "box bottom left"
            }).append($("<div/>", {
                class: "box bottom right"
            }).append($("<div/>", {
                class: "box bottom center"
            })))),
                n
        }
            ,
            this.RepPrvBorderLight = function(e, t) {
            var n = $("<div/>");
            return $(n).append($("<div/>", {
                class: "box top left"
            }).append($("<div/>", {
                class: "box top right"
            }).append($("<div/>", {
                class: "box top center"
            })))),
                $(n).append($("<div/>", {
                class: "box middle left"
            }).append($("<div/>", {
                class: "box middle right"
            }).append($("<div/>", {
                class: "box middle center"
            }).append($("<span/>", {
                class: "town_name",
                style: "float:left;"
            }).html(e).append($("<div/>", {
                id: "HMoleRepParts"
            }))).append($("<div/>", {
                class: "box_content"
            }).html(t))))),
                $(n).append($("<div/>", {
                class: "box bottom left"
            }).append($("<div/>", {
                class: "box bottom right"
            }).append($("<div/>", {
                class: "box bottom center"
            })))),
                n
        }
            ,
            this.But = function(e, t) {
            return $("<a/>", {
                href: "#",
                class: "button",
                style: t + " margin:0 0 0 0; display:block; width:22px; height:23px; background:url('" + MH.Home + "medias/images/but.png') repeat scroll " + 22 * -e + "px 0px"
            }).mouseout(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll " + 22 * -e + "px 0px"
            }).mouseover(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll " + 22 * -e + "px -23px"
            })
        }
            ,
            this.Button = function(e) {
            return $("<a/>", {
                class: "button",
                href: "#",
                style: "float:top"
            }).append($("<span/>", {
                class: "left"
            }).append($("<span/>", {
                class: "right"
            }).append($("<span/>", {
                class: "middle"
            }).text(e))).append($("<span/>", {
                style: "clear:both;"
            })))
        }
            ,
            this.ProgressBar = function(e) {
            return $("<div/>", {
                class: "single-progressbar",
                id: e
            }).append($("<div/>", {
                class: "border_l"
            })).append($("<div/>", {
                class: "border_r"
            })).append($("<div/>", {
                class: "body"
            })).append($("<div/>", {
                class: "progress"
            }).append($("<div/>", {
                class: "indicator",
                style: "width: 0%;"
            }))).append($("<div/>", {
                class: "caption"
            }).append($("<span/>", {
                class: "text"
            })))
        }
            ,
            this.gLink = function(e, t) {
            return $("<div/>", {
                style: "color:#ECB44D; font-size:" + t + "px; font-weight:bold; line-height:12px; cursor:pointer;"
            }).html(e).mouseout(function() {
                this.style.color = "#ECB44D"
            }).mouseover(function() {
                this.style.color = "#EEDDBB"
            })
        }
            ,
            this.bLink = function(e, t) {
            return $("<div/>", {
                style: "color:#53C6FF; font-size:" + t + "px; font-weight:bold; line-height:12px; cursor:pointer;"
            }).html(e).mouseout(function() {
                this.style.color = "#53C6FF"
            }).mouseover(function() {
                this.style.color = "#80FFFF"
            })
        }
            ,
            this.rLink = function(e, t) {
            return $("<div/>", {
                style: "color:#FF6000; font-size:" + t + "px; font-weight:bold; line-height:12px; cursor:pointer;"
            }).html(e).mouseout(function() {
                this.style.color = "#FF6000"
            }).mouseover(function() {
                this.style.color = "#FFFF00"
            })
        }
            ,
            this.aLink = function(e, t) {
            return $("<div/>", {
                style: "color:#800080; font-size:" + t + "px; font-weight:bold; line-height:12px; cursor:pointer;"
            }).html(e).mouseout(function() {
                this.style.color = "#800080"
            }).mouseover(function() {
                this.style.color = "#400040"
            })
        }
            ,
            this.Tab = function(e, t, n, i) {
            for (var a = $("<ul/>", {
                id: e,
                class: "menu_inner"
            }), o = t.length - 1; -1 < o; o--)
                a.append($("<li/>").append($("<a/>", {
                    class: "submenu_link",
                    href: "#",
                    id: e + "_" + o,
                    nr: o
                }).click(function() {
                    $(this).parent().parent().find("li a.submenu_link").removeClass("active"),
                        $(this).addClass("active"),
                        i($(this).attr("nr"))
                }).append($("<span/>", {
                    class: "left"
                }).append($("<span/>", {
                    class: "right"
                }).append($("<span/>", {
                    class: "middle",
                    title: name
                }).html(t[o]))))));
            return $("<div/>", {
                class: "menu_wrapper",
                style: "left:78px; right:34px"
            }).append(a)
        }
            ,
            this.SubTab = function(e, t, n, i) {
            for (var a = $("<ul/>", {
                id: e,
                class: "menu_inner",
                style: n
            }), o = t.length - 1; -1 < o; o--)
                a.append($("<li/>").append($("<a/>", {
                    class: "submenu_link",
                    href: "#",
                    id: e + "_" + o,
                    nr: o
                }).click(function() {
                    $(this).parent().parent().find("li a.submenu_link").removeClass("active"),
                        $(this).addClass("active"),
                        i($(this).attr("nr"))
                }).append($("<span/>", {
                    class: "left mh"
                }).append($("<span/>", {
                    class: "right mh"
                }).append($("<span/>", {
                    class: "middle mh",
                    title: name
                }).html(t[o]))))));
            return a
        }
            ,
            this.CheckBox = function(e, t, n) {
            return n = 1 == n ? "1" : "0",
                $("<a/>", {
                href: "#",
                id: e,
                sel: n
            }).click(function() {
                "1" == this.getAttribute("sel") ? this.setAttribute("sel", "0") : this.setAttribute("sel", "1"),
                    this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
            }).append($("<img/>", {
                src: MH.Home + "medias/images/cb" + n + ".gif",
                style: "position:relative; top:2px;"
            })).append(" " + t + "<br>")
        }
            ,
            this.CheckBoxVal = function(e) {
            return 1 == $("#" + e).attr("sel")
        }
            ,
            this.Table = function(e, t, n) {}
    }
    function mhMenu_Object(e, t, n, i) {
        var a = !1
        , o = !1
        , r = function() {}
        , l = "";
        switch (i) {
            default:
                "string" == typeof e && e.indexOf("http") < 0 && (e = MH.Home + "medias/images/" + e),
                    (a = e) || (a = !1),
                    null == e && (a = "https://grepolis-david1327.e-monsite.com/medias/images/null.gif"),
                    r = n,
                    l = t;
                break;
            case "bld":
                l = GameData.buildings[e].name,
                    a = MH.GameImg + "/images/game/main/" + e + ".png",
                    r = function() {
                    BuildingWindowFactory.open(e)
                }
                    ,
                    "place" == e && (a = "https://grepolis-david1327.e-monsite.com/medias/images/place.gif"),
                    "town" == e && (a = MH.Home + "gui/ico/senate.gif",
                                    r = function() {
                    mhAddStd.TownIndexWindowOpen()
                }
                                   );
                break;
            case "men":
                l = DM.getl10n("layout").main_menu.items[e],
                    a = MH.Home + "medias/images/m" + e + ".png",
                    r = function() {
                    MH.MMC.linksHandler[e]()
                }
                ;
                break;
            case "cur":
                0 == (o = t) && (o = 1),
                    l = DM.getl10n("layout").premium_button.premium_menu[e],
                    a = MH.GameImg + "/images/game/premium_features/overviews_sprite_16x16.png",
                    r = function() {
                    TownOverviewWindowFactory.openOverview(e)
                }
                    ,
                    "town_group_overview" == e && (r = function() {
                    TownOverviewWindowFactory.openTownGroupOverview()
                }
                                                  ),
                    "attack_planner" == e && (l = DM.getl10n("premium").advisors.short_advantages.attack_planner,
                                              r = function() {
                    AttackPlannerWindowFactory.openAttackPlannerWindow()
                }
                                             ),
                    "farm_town_overview" == e && (l = DM.getl10n("premium").advisors.short_advantages.farm_town_overview,
                                                  r = function() {
                    FarmTownOverviewWindowFactory.openFarmTownOverview()
                }
                                                 )
        }
        this.getHtml = function() {
            var e = "";
            return 0 != a && (e = '<img src="' + a + '" width="16px" height="16px"> ',
                              0 != o && (isNaN(o) || (e = "<div style=\"background:url('" + a + "') no-repeat scroll 0 -" + o + 'px rgba(0, 0, 0, 0); width:16px; height:16px; display:box; float:left; margin-right:5px;"> </div>'))),
                $("<li/>", {}).html(e + '<span style="position:relative: top:-1px; font-size:14px;">' + l + "</span>").click(r)
        }
            ,
            this.isSub = function() {
            return !1
        }
    }
    function mhMenu(e) {
        var i = e
        , a = e
        , o = [];
        this.getID = function(e) {
            return a
        }
            ,
            this.isSub = function() {
            return !0
        }
            ,
            this.addSub = function(e, t) {
            var n = new mhMenu(a + o.length);
            return n.gid = i,
                n.img = null == t ? "https://grepolis-david1327.e-monsite.com/medias/images/null.gif" : void 0 !== t && t,
                n.txt = e,
                o.push(n),
                n
        }
            ,
            this.add = function(e, t, n, i) {
            i = new mhMenu_Object(e,t,n,i);
            return o.push(i),
                i
        }
            ,
            this.poupAT = function(e, t) {
            $(MH.MenuHelper.actualmenu).length && $(MH.MenuHelper.actualmenu).remove(),
                $("#ui_box").append($("<div/>", {
                id: i
            })),
                MH.MenuHelper.actualmenu = $("#" + i),
                MH.MenuHelper.poupclick = !0,
                $("#" + i).append(this.HtmlWnd()),
                $("#mhm_" + a).css({
                left: e + "px",
                top: t + "px"
            }),
                $("#mhm_" + a).css("visibility", "visible"),
                MH.MenuHelper.wndtohide = $("#mhm_" + a),
                $("#" + i).find("ul li").each(function(e, t) {
                $(this).css("background-image", "url(https://grepolis-david1327.e-monsite.com/medias/images/pu-bg.png)"),
                    $(this).css("cursor", "pointer"),
                    $(this).mouseenter(function() {
                    var e;
                    $(this).css("background-image", "url(" + MH.Home + "medias/images/pu-bgs.png)"),
                        MH.MenuHelper.wndtohide.find($(this)).length || MH.MenuHelper.wndtohide.css({
                        display: "none",
                        visibility: "hidden"
                    }),
                        $(this).attr("sub") && ((e = $(this).offset()).top -= 4,
                                                e.left += $(this).width() - 2,
                                                $("#mhm_" + $(this).attr("sub")).css({
                        left: e.left + "px",
                        top: e.top + "px"
                    }),
                                                $("#mhm_" + $(this).attr("sub")).css({
                        display: "block",
                        visibility: "visible"
                    }))
                }),
                    $(this).mouseleave(function() {
                    $(this).css("background-image", "url(https://grepolis-david1327.e-monsite.com/medias/images/pu-bg.png)"),
                        $(this).attr("sub") && (MH.MenuHelper.wndtohide = $("#mhm_" + $(this).attr("sub")))
                })
            })
        }
            ,
            this.HtmlWnd = function() {
            for (var e, t = $("<ul/>", {
                style: "text-align:left;"
            }), n = 0; n < o.length; n++)
                e = "",
                    0 != o[n].img && (e = '<img src="' + o[n].img + '" width="16px" height="16px"> '),
                    o[n].isSub() ? (t.append($("<li/>", {
                    sub: o[n].getID
                }).html(e + '<span style="position:relative: top:-1px; font-size:14px;">' + o[n].txt + '</span><img src="https://grepolis-david1327.e-monsite.com/medias/images/marr.gif" style="float:right;">')),
                                    $("#" + i).append(o[n].HtmlWnd())) : t.append(o[n].getHtml());
            return $("<div/>", {
                id: "mhm_" + a,
                style: "visibility:hidden; display:block; position:absolute; left:0px; top:0px; z-index:5000;"
            }).append(mhGui.Border().append(t))
        }
    }
    function _mh5987355678() {
        var n = null
        , i = null;
        function a(e, t, n) {
            1 == n ? (MH._ally = e,
                      MH._ally_name = t,
                      MH.statsWnd(!0)) : (MH._player = e,
                                          MH._player_name = t,
                                          MH.statsWnd(!1))
        }
        this.TownIndexWindowSet = function() {
            $.Observer(GameEvents.ui.bull_eye.radiobutton.city_overview.click).subscribe("TownIndexWindow", function(e, t) {
                o.TownIndexWindowOpen()
            }),
                $.Observer(GameEvents.ui.bull_eye.radiobutton.island_view.click).subscribe("TownIndexWindow", function(e, t) {
                i = $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .option.island_view"),
                    null != n && n.close()
            }),
                $.Observer(GameEvents.ui.bull_eye.radiobutton.strategic_map.click).subscribe("TownIndexWindow", function(e, t) {
                i = $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .option.strategic_map"),
                    null != n && n.close()
            })
        }
            ,
            this.TownIndexWindowOpen = function() {
            if (i = $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .option.island_view"),
                null != n)
                return n.isMinimized() && n.maximizeWindow(),
                    void o.TownIndexWindowRename();
            n = Layout.dialogWindow.open("", "", 810, 610, o.TownIndexWindowClose, !0),
                void 0 === MH.OwnWnds && (MH.OwnWnds = {}),
                MH.OwnWnds.wTownOverview = n,
                MH.ev.WAR("wTownOverview", "OwnWnds", ""),
                n.setPosition("center", "center"),
                n.setContent('<div id="TownOverview_extra"></div>'),
                o.TownIndexWindowRename(),
                n.getJQElement().find(".gpwindow_content").css("overflow", "hidden"),
                function e() {
                if (!$(".ui_city_overview #index_map_image").length)
                    return void setTimeout(function() {
                        e()
                    }, 1e3);
                $(".ui_city_overview:first").appendTo("#TownOverview_extra");
                $(".ui_construction_queue:first").appendTo("#TownOverview_extra");
                $("#TownOverview_extra .town_background").css({
                    transform: "translate(-650px,-304px);"
                });
                $("#TownOverview_extra .ui_construction_queue").css({
                    bottom: "-3px"
                });
                $("#TownOverview_extra .ui_construction_queue #close_but").length || $("#TownOverview_extra .ui_construction_queue").append($("<a/>", {
                    id: "close_but",
                    href: "#",
                    style: "display:block; position:relative; left:614px; top:8px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    $(this).parent().hide()
                }))
            }(),
                n.maximize = n.maximize,
                n.maximize = function() {
                o.TownIndexWindowRename()
            }
                ,
                n.minimizeEx = n.minimize,
                n.minimize = function() {
                n.setTitle(DM.getl10n("town_index").window_title),
                    n.minimizeEx()
            }
                ,
                MH.wndS = n
        }
            ,
            this.TownIndexWindowRename = function() {
            $("#TownOverview_extra").length && (n.setTitle('<a class="town town_bbcode_link" href="#" id="twn_bb_lnk" style="float: left; margin:-1px 0 0;" onclick="$(\'#twn_bb_id\').toggle();"></a><input type="text" class="town_bbcode_id" oncontextmenu="this.select();" onfocus="this.select();" onclick="this.select();" value="[town]' + Game.townId + '[/town]" id="twn_bb_id" style="float: left; display: none;"></div> ' + DM.getl10n("town_index").window_title + " - " + Game.townName),
                                                $("#TownOverview_extra .town_background").css({
                transform: "translate(-650px,-304px);"
            }),
                                                n.getJQElement().parent().find(".ui-dialog-titlebar .maximize").length || n.getJQElement().parent().find(".ui-dialog-titlebar").append($("<div/>", {
                class: "btn_wnd maximize",
                style: "float:right;"
            }).click(function() {
                i = $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .option.city_overview"),
                    $("#TownOverview_extra .ui_construction_queue").css({
                    bottom: ""
                }),
                    $("#TownOverview_extra .town_background").css({
                    transform: "translate(-430px,-220px);"
                }),
                    n.close()
            })))
        }
            ,
            this.TownIndexWindowClose = function() {
            n = null,
                delete MH.OwnWnds.wTownOverview,
                $("#TownOverview_extra .ui_city_overview:first").appendTo("#ui_box"),
                $("#TownOverview_extra .ui_construction_queue:first").appendTo("#ui_box"),
                i.click()
        }
            ,
            this.DailyLogSet = function() {
            !function e() {
                if ($("#ui_box #daily_login_icon").length && "none" == $("#ui_box #daily_login_icon").css("display"))
                    return;
                if (!$(".daily_login").find(".minimize").length)
                    return void setTimeout(function() {
                        e()
                    }, 500);
                if ($(".daily_login").find(".loading_icon").length)
                    return void setTimeout(function() {
                        e()
                    }, 500);
                var t = WM.getWindowByType("daily_login")[0];
                if (t.length <= 0)
                    return;
                t.close()
            }()
        }
            ,
            this.Trgsetbytown = function(e) {
            var t = 0;
            void 0 !== MH.GuiUst.TrgTown && (t = MH.GuiUst.TrgTown.id),
                MH.GuiUst.TrgTown = {},
                MH.GuiUst.TrgTown.id = e.id,
                MH.GuiUst.TrgTown.name = e.name,
                MH.GuiUst.TrgTown.ix = e.ix,
                MH.GuiUst.TrgTown.iy = e.iy,
                MH.GuiUst.Trg = !0,
                t == MH.GuiUst.TrgTown.id && (MH.GuiUst.Trg = !1,
                                              MH.GuiUst.TrgTown = {}),
                MH.Storage(MH.GuiUstCookie, MH.GuiUst),
                $("#mhTarget").length && $("#mhTarget").remove(),
                this.Trgirq()
        }
            ,
            this.Trgirq = function() {
            if (MH.GuiUst.Trg && (MH.SymbolsMiniDrwElem(),
                                  !$("#mhTarget").length)) {
                var e = "#town_" + MH.GuiUst.TrgTown.id;
                if (!$(e).length)
                    return e = "#map_temple_" + MH.GuiUst.TrgTown.ix + "_" + MH.GuiUst.TrgTown.iy,
                        $(e).length ? void $("<div/>", {
                        id: "mhTarget",
                        style: 'left:-16px; top:50px; position:absolute; width:105px; height:69px; z-index:-1; background:url("' + MH.Home + 'gui/target.png")'
                    }).appendTo(e) : void 0;
                $("<div/>", {
                    id: "mhTarget",
                    style: 'left:-18px; top:-6px; position:absolute; width:105px; height:69px; z-index:-1; background:url("' + MH.Home + 'gui/target.png")'
                }).appendTo(e)
            }
        }
            ,
            this.BtnAllyListAdd = function(t, n) {
            return mhGui.But(6, "float:right;").mousePopup(new MousePopup(MH.Lang.AddToList)).click(function() {
                var e = t;
                null == MH.gHndLst.AllyList[e] && (MH.gHndLst.AllyList[e] = {},
                                                   MH.gHndLst.AllyList[e].name = n,
                                                   o.AllListView(),
                                                   MH.Storage(MH.gHndLstCookie, MH.gHndLst))
            })
        }
            ,
            this.BtnPlayListAdd = function(t, n) {
            return mhGui.But(6, "float:right;").mousePopup(new MousePopup(MH.Lang.AddToList)).click(function() {
                var e = t;
                null == MH.gHndLst.PlayList[e] && (MH.gHndLst.PlayList[e] = {},
                                                   MH.gHndLst.PlayList[e].name = n,
                                                   o.AllListView(),
                                                   MH.Storage(MH.gHndLstCookie, MH.gHndLst))
            })
        }
            ,
            this.BtnTownListAdd = function(t, n, i, a) {
            return mhGui.But(6, "float:right;").mousePopup(new MousePopup(MH.Lang.AddToList)).click(function() {
                var e = t;
                null == MH.gHndLst.TownList[e] && (MH.gHndLst.TownList[e] = {},
                                                   MH.gHndLst.TownList[e].href = "#" + btoa('{"id":' + e + ',"ix":' + i + ',"iy":' + a + ',"tp":"town","name":"' + unescape(encodeURIComponent(n)) + '"}'),
                                                   MH.gHndLst.TownList[e].name = n,
                                                   o.AllListView(),
                                                   MH.Storage(MH.gHndLstCookie, MH.gHndLst))
            })
        }
            ,
            this.BtnIslaListAdd = function(n) {
            return mhGui.But(6, "float:right;").mousePopup(new MousePopup(MH.Lang.AddToList)).click(function() {
                var e, t = MH.Link2Struct(n);
                "id"in t && "ix"in t && "iy"in t && null == MH.gHndLst.IslaList[t.id] && (MH.gHndLst.IslaList[t.id] = {},
                                                                                          MH.gHndLst.IslaList[t.id].href = n,
                                                                                          MH.gHndLst.IslaList[t.id].name = "",
                                                                                          "wn"in t && (MH.gHndLst.IslaList[t.id].name = t.wn),
                                                                                          "" == MH.gHndLst.IslaList[t.id].name && (MH.gHndLst.IslaList[t.id].name = MH.GLng.Island + " " + t.id),
                                                                                          (e = MH.wndCreate("IslandName", MH.Lang.ChngIslaNam, 235, 84)).getJQElement().find(".gpwindow_content").html(""),
                                                                                          e.getJQElement().find(".gpwindow_content").css("overflow-y", "auto"),
                                                                                          e.appendContent($("<input/>", {
                    id: "islCHNGnam",
                    class: "inp200",
                    maxlength: "25",
                    type: "text",
                    style: "float:left;"
                })),
                                                                                          e.appendContent(mhGui.But(1, "float:right;").click(function() {
                    MH.gHndLst.IslaList[t.id].name = $("#islCHNGnam").val(),
                        "" == MH.gHndLst.IslaList[t.id].name && (MH.gHndLst.IslaList[t.id].name = MH.GLng.Island + " " + t.id),
                        MH.OwnWnds.IslandName.close(),
                        o.AllListView(),
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst)
                })),
                                                                                          $("#islCHNGnam").val(MH.gHndLst.IslaList[t.id].name))
            })
        }
            ,
            this.BtnTempleListAdd = function(t, n, i, a) {
            return mhGui.But(6, "float:right;").mousePopup(new MousePopup(MH.Lang.AddToList)).click(function() {
                var e = t;
                null == MH.gHndLst.TmplList[e] && (MH.gHndLst.TmplList[e] = {},
                                                   MH.gHndLst.TmplList[e].href = "#" + btoa('{"id":' + e + ',"ix":' + i + ',"iy":' + a + ',"tp":"temple","name":"' + unescape(encodeURIComponent(n)) + '"}'),
                                                   MH.gHndLst.TmplList[e].name = n,
                                                   o.AllListView(),
                                                   MH.Storage(MH.gHndLstCookie, MH.gHndLst))
            })
        }
            ,
            this.AllListView = function() {
            $("#HMTowns").html("");
            var e = !1;
            for (t in MH.gHndLst.AllyList)
                e = !0,
                    $("#HMTowns").append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "display:block; position:relative; left:-8px; top:14px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    var e = $(this).attr("lstidx");
                    delete MH.gHndLst.AllyList[e],
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst),
                        mhAddStd.AllListView()
                })).append($("<span/>", {
                    class: "bbcodes bbcodes_ally"
                }).append($("<a/>", {
                    onclick: "Layout.allianceProfile.open('" + MH.gHndLst.AllyList[t].name + "'," + t + ")",
                    href: "#",
                    style: "font-weight:normal; font-size:10px;"
                }).html(MH.gHndLst.AllyList[t].name + "<br>")));
            for (t in MH.gHndLst.PlayList)
                e = !0,
                    $("#HMTowns").append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "display:block; position:relative; left:-8px; top:14px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    var e = $(this).attr("lstidx");
                    delete MH.gHndLst.PlayList[e],
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst),
                        mhAddStd.AllListView()
                })).append($("<span/>", {
                    class: "bbcodes bbcodes_player"
                }).append($("<a/>", {
                    onclick: "Layout.playerProfile.open('" + MH.gHndLst.PlayList[t].name + "'," + t + ")",
                    href: "#",
                    style: "font-weight:normal; font-size:10px;"
                }).html(MH.gHndLst.PlayList[t].name + "<br>")));
            for (t in MH.gHndLst.TownList)
                e = !0,
                    $("#HMTowns").append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "display:block; position:relative; left:-8px; top:14px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    var e = $(this).attr("lstidx");
                    delete MH.gHndLst.TownList[e],
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst),
                        mhAddStd.AllListView()
                })).append($("<span/>", {
                    class: "bbcodes bbcodes_town"
                }).append($("<a/>", {
                    class: "gp_town_link",
                    href: MH.gHndLst.TownList[t].href,
                    style: "font-weight:normal; font-size:10px;"
                }).html(MH.gHndLst.TownList[t].name + "<br>")));
            for (t in MH.gHndLst.IslaList)
                e = !0,
                    $("#HMTowns").append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "display:block; position:relative; left:-8px; top:14px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    var e = $(this).attr("lstidx");
                    delete MH.gHndLst.IslaList[e],
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst),
                        mhAddStd.AllListView()
                })).append($("<span/>", {
                    class: "bbcodes bbcodes_island"
                }).append($("<a/>", {
                    class: "gp_island_link",
                    href: MH.gHndLst.IslaList[t].href,
                    style: "font-weight:normal; font-size:10px;"
                }).html(MH.gHndLst.IslaList[t].name + "<br>")));
            for (t in MH.gHndLst.TmplList)
                e = !0,
                    $("#HMTowns").append($("<a/>", {
                    href: "#",
                    lstidx: t,
                    style: "display:block; position:relative; left:-8px; top:14px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
                }).click(function() {
                    var e = $(this).attr("lstidx");
                    delete MH.gHndLst.TmplList[e],
                        MH.Storage(MH.gHndLstCookie, MH.gHndLst),
                        mhAddStd.AllListView()
                })).append($("<span/>", {
                    class: "bbcodes bbcodes_temple"
                }).append($("<a/>", {
                    class: "gp_town_link",
                    href: MH.gHndLst.TmplList[t].href,
                    style: "font-weight:normal; font-size:10px;"
                }).html(MH.gHndLst.TmplList[t].name + "<br>")));
            e && $("#HMTowns").prepend("<div style=\"display:block; width:145px; height:6px; margin-left:-10px; background:url('" + MH.Home + "gui/LayAC.gif'\">&nbsp</div>"),
                MH.nui_main_menu()
        }
            ,
            this.getConTownListRen = function() {
            if (layout_main_controller) {
                for (var e = 0; "town_name_area" != layout_main_controller.sub_controllers[e].name; )
                    e++;
                layout_main_controller.sub_controllers[e].controller.town_groups_list_view.renderEx = layout_main_controller.sub_controllers[e].controller.town_groups_list_view.render,
                    layout_main_controller.sub_controllers[e].controller.town_groups_list_view.render = function() {
                    layout_main_controller.sub_controllers[e].controller.town_groups_list_view.renderEx(),
                        mhAddStd.TownList()
                }
            } else
                setTimeout(function() {
                    this.getConTownListRen()
                }, 1e3)
        }
            ,
            this.TownList = function() {
            MH.Set.TL && $("#town_groups_list .town_group_town").each(function() {
                var e, t, n, i = $(this).attr("name"), a = ITowns.getTown(i), o = $(this).get(0).innerHTML, r = '<div style="float:left; margin-left:5px;">';
                if (!isNaN(i)) {
                    if (i = parseInt(i),
                        e = MH.COL.player_heroes.getHeroOfTown(i),
                        e && (r += '<div style="float:left; width:25px; height:22px;" class="hero_icon hero25x25 ' + e.attributes.type + '"></div>'),
                        a.units().hasOwnProperty("colonize_ship") && (r += '<div class="mhTwnIco colonize"></div>'),
                        "?" != mhDat.wondInf && mhDat.wondInf.wondAlly) {
                        for (n in e = null,
                             t = mhDat.wondInf.wondAlly)
                            if (t.hasOwnProperty(n) && t[n].ix == a.getIslandCoordinateX() && t[n].iy == a.getIslandCoordinateY()) {
                                e = n;
                                break
                            }
                        e in mhCNST.WorldWondersEx && (r += '<div class="mhWondIco ' + mhCNST.WorldWondersEx[e] + '"></div>')
                    }
                    e = a.getIslandCoordinateX() + ":" + a.getIslandCoordinateY(),
                        0 <= MH.DomIslands.t.indexOf(e) && (r += '<div class="mhTwnIco domination"></div>'),
                        i == MH.MOD.phoenician_salesman.attributes.current_town_id && (r += '<div class="mhTwnIco phoenician"></div>'),
                        "ORA_" + i in MH.attTownList && $(this).css({
                        "background-color": "#F0A080"
                    }),
                        "ORR_" + i in MH.attTownList && $(this).css({
                        "background-color": "#FF6050"
                    }),
                        a.hasConqueror() && $(this).css({
                        "background-color": "#FF6050"
                    }),
                        r += "</div>";
                    var l, s, d = {}, p = 0, c = GameData.buildings, m = a.buildings().getLevels(), u = Math.floor(c.farm.farm_factor * Math.pow(a.buildings().getBuildingLevel("farm"), c.farm.farm_pow)), g = a.getResearches().attributes.plow ? 200 : 0, f = a.getBuildings().getBuildingLevel("thermal") ? 1.1 : 1, i = a.getPopulationExtra();
                    for (l in m)
                        m.hasOwnProperty(l) && (p += Math.round(c[l].pop * Math.pow(m[l], c[l].pop_factor)));
                    d.max = u * f + g + i,
                        d.buildings = p,
                        d.units = parseInt(d.max - (p + a.getAvailablePopulation()), 10),
                        d.percent = Math.round(100 / (d.max - p) * d.units),
                        d.percent < 75 && (s = "threequarter"),
                        d.percent < 50 && (s = "half"),
                        d.percent < 25 && (s = "quarter"),
                        o += '<div class="pop_percent ' + s + '">' + d.percent + "%</div>",
                        $(this).get(0).innerHTML = r + o
                }
            })
        }
            ,
            this.BtnStatPlayer = function(e, t) {
            return $("<a/>", {
                id: "mhStaPla",
                href: "#",
                style: "width:31px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') -423px 0px"
            }).mouseout(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') -423px 0px"
            }).mouseover(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') -423px -23px"
            }).mousePopup(new MousePopup(MH.Lang.STATS)).click(function() {
                a(e, t, !1)
            })
        }
            ,
            this.BtnStatAlly = function(e, t) {
            return $("<a/>", {
                id: "mhStaAly",
                href: "#",
                style: "width:31px; height:23px; float:left; background:url('" + MH.Home + "medias/images/but.png') -423px 0px"
            }).mouseout(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') -423px 0px"
            }).mouseover(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') -423px -23px"
            }).mousePopup(new MousePopup(MH.Lang.STATSA)).click(function() {
                a(e, t, !0)
            })
        }
        ;
        var o = this
        }
    function _mh5437895432() {
        this.bbStrWidth = function(e, t, n) {
            var i, a = 20, o = "#bbStrWidthTest";
            return $(o).length || $("#ui_box").append($("<a/>", {
                id: "bbStrWidthTest",
                href: "#",
                class: "bbcodes bbcodes_player"
            }).html("M")),
                e = e && e.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, ""),
                t = t && t.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, ""),
                n = n && n.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, ""),
                e && ($(o).html(e),
                      a < (i = $(o).width()) && (a = i)),
                t && ($(o).html(t),
                      a < (i = $(o).width()) && (a = i)),
                n && ($(o).html(n),
                      a < (i = $(o).width()) && (a = i)),
                a + 20
        }
            ,
            this.UnitsNew = function(e, t, n, i, a, o, r, l) {
            var s, d, p, c = (i = i || 0) * (a = a || 19), m = "";
            for ((t || n) && (m += "[center]"),
                 p = "[img]" + MH.Home + "i.php?U=",
                 1 == MH.gRAP.Style && (p = "[img]" + MH.Home + "i.php?u="),
                 2 == MH.gRAP.Style && (p = "[img]" + MH.Home + "i.php?v="),
                 s = d = 0; s < e.length; s++,
                 d++)
                c <= d && d < c + a && (m += p + e[s],
                                        t && (m += t[s]),
                                        n && (m += "-" + n[s]),
                                        m += "[/img]");
            return l && (m += l),
                m + "\n[/center]"
        }
    }
    MH.BBCode2HTML = function(e) {
        var t = MH.GamePost("message", "preview", {
            message: e
        });
        try {
            t = t.json.message
        } catch (e) {
            t = null
        }
        return null != t && "" != t && t
    }
        ,
        MH.BBCode_Cut = function(e) {}
        ,
        MH.BBCode_Show = function(e) {
        var t = MH.wndCreate("showBBCode", MH.Lang.getBBC, 700, 584)
        , n = $("<span/>", {}).html("bbCode").append($("<textarea/>", {
            id: "BBCodeView",
            readonly: "true",
            onclick: "this.select()",
            style: "background-color:#e0e0e0; height:500px; width:99%; margin:0px; padding:0px;"
        }));
        t.setContent(n.html()),
            $("#BBCodeView").val(e)
    }
        ,
        MH.BBCode_2ForumWnd = function(e) {
        if (null != MH.wndBBC2) {
            try {
                MH.wndBBC2.close()
            } catch (e) {}
            MH.wndBBC2 = void 0
        }
        MH.wndBBC2 = Layout.dialogWindow.open("", "BBCode 2 Outside Forum Converter v0.3", 700, 584, function() {
            MH.wndBBC2 = void 0
        }, !0),
            MH.wndBBC2.setPosition(["center", "center"]),
            MH.wndBBC2.getJQElement().find(".gpwindow_content").css("overflow", "hidden");
        var t = $("<span/>", {}).html(MH.Lang.bbc2f_opi + ".").append($("<p/>", {}).html(MH.Lang.bbc2f_in + ":").append($("<textarea/>", {
            id: "BBCode2ForumTxt",
            style: "height:200px; width:99%; margin:0px; padding:0px;"
        })).append(mhGui.Button(MH.Lang.BTNCONV).css({
            float: "left"
        }).click(function() {
            var e, t, n, i = $("#BBCode2ForumTxt").val();
            for (i = (i = MH.BBCode_RepairCloseTags(i)).replace(/\[town\]/g, "<town>"); 0 <= i.indexOf("<town>"); )
                t = i.indexOf("<town>"),
                    n = i.substr(t).indexOf("[/town]"),
                    e = i.substr(t + 6, n - 6),
                    isNaN(e) || (e = mhCol.TownName_TownID(e)),
                    i = i.substr(0, t) + "[town]" + e + i.substr(t + n);
            i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = (i = i.replace(/\[ally\]/g, "[img]medias/images/ally.gif[/img] [b]")).replace(/\[\/ally\]/g, "[/b]")).replace(/\[player\]/g, "[img]https://grepolis-david1327.e-monsite.com/medias/images/player.gif[/img] [b]")).replace(/\[\/player\]/g, "[/b]")).replace(/\[town\]/g, "[img]https://grepolis-david1327.e-monsite.com/medias/images/town.gif[/img] [b]")).replace(/\[\/town\]/g, "[/b]")).replace(/\[island\]/g, "[img]https://grmh.pl/e/9/island.gif[/img] [b]")).replace(/\[\/island\]/g, "[/b]")).replace(/\[quote\]/g, "")).replace(/\[\/quote\]/g, "")).replace(/\[\*\]/g, "[tr][td]")).replace(/\[\|\]/g, "[/td][td]")).replace(/\[\/\*\]/g, "[/td][/tr]")).replace(/\[size=7\]/g, "[size=1]")).replace(/\[size=8\]/g, "[size=1]")).replace(/\[size=9\]/g, "[size=2]")).replace(/\[size=10\]/g, "[size=2]"),
                $("#BBCode2ForumTxtOut").val(i)
        }))).append($("<p/>", {}).html(MH.Lang.bbc2f_out + ":").append($("<textarea/>", {
            id: "BBCode2ForumTxtOut",
            readonly: "true",
            onclick: "this.select()",
            style: "background-color:#e0e0e0; height:200px; width:99%; margin:0px; padding:0px;"
        })));
        MH.wndBBC2.appendContent(t, 420),
            "udnefined" != typeof e && ($("#BBCode2ForumTxt").val(e),
                                        MH.wndBBC2.getJQElement().find("a.button").click())
    }
        ,
        MH.BBCode_RepairCloseTags = function(e) {
        for (var t, n, i, a, o = "", r = ["font", "size", "color", "center", "b", "i", "u", "s"], l = ["[|]", "[/*]"], s = [], d = 0, p = 0; p < e.length; p++) {
            if ("[" == e.charAt(p)) {
                for (n = !1,
                     i = 0; i < r.length; i++)
                    if (e.substr(p + 1, r[i].length) == r[i]) {
                        n = !0;
                        break
                    }
                if (n && (s[d] = r[i],
                          d++),
                    "/" == e.charAt(p + 1)) {
                    for (n = !1,
                         i = 0; i < r.length; i++)
                        if (e.substr(p + 2, r[i].length) == r[i]) {
                            n = !0;
                            break
                        }
                    n && 0 <= (a = s.indexOf(r[i])) && (s.splice(a, 1),
                                                        d--)
                }
                for (t = !1,
                     i = 0; i < l.length; i++)
                    if (e.substr(p, l[i].length) == l[i]) {
                        t = !0;
                        break
                    }
                if (t) {
                    for (; 0 < d; )
                        o += "[/" + s[--d] + "]";
                    d = 0
                }
            }
            o += e.charAt(p)
        }
        for (; 0 < d; )
            o += "[/" + s[--d] + "]";
        return o
    }
        ,
        MH.bbCodeHTML = function(e, t, n) {
        1 != t && (e = e.replace(/&nbsp;/gi, " ")),
            e = decodeURIComponent(e);
        var i, a = new Array("b","i","u","s","center","quote","url","img");
        for (e = (e = e.replace(/\r?\n|\r/gm, "")).replace(/\s+/g, " "),
             i = 0; i < a.length; i++)
            e = (e = e.replace(new RegExp("<" + a[i] + ">","gi"), "[" + a[i] + "]")).replace(new RegExp("</" + a[i] + ">","gi"), "[/" + a[i] + "]");
        return e = (e = (e = e.replace(/<a onclick\="Layout\.allianceProfile\.open\((.*?)\)" href\="javascript:void\(0\)">(.*?)<\/a>/gi, "[ally]$2[/ally]")).replace(/<a target\="(.*?)href\="(.*?)">(.*?)<\/a>/gi, "[url=$2]$3[/url]")).replace(/<a onclick\="var(.*?)\.gp_island_link(.*?)href\="(.*?)">(.*?) (.*?)<\/a>/gi, "[island]$5[/island]"),
            e = (e = (e = (e = (e = (e = (e = 1 == t ? e.replace(/<a href\="#" class\="bbcodes bbcodes_player" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player][id=$2]$3[/]") : e.replace(/<a href\="#" class\="bbcodes bbcodes_player" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player]$3[/]")).replace(/<span class\="bbcodes bbcodes_player">(.*?)<\/span>/gi, "[player]$1[/]")).replace(/<span class\="bbcodes bbcodes_town"><a href\="(.*?)>(.*?)<\/span>/gi, "[town]$2[/]")).replace(/<span class\="bbcodes bbcodes_color" style\="color\:#(.*?)">(.*?)<\/span>/gi, "[color=#$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_size" style\="font-size\:(.*?)pt">(.*?)<\/span>/gi, "[size=$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_font (.*?)">(.*?)<\/span>/gi, "[font=$1]$2[/]")).replace(/<a (.*?) class\="link" href="(.*?)">(.*?)<\/a>/gi, "[url=$2]$3[/]"),
            res = MH.BBCode_ReplaceEndTags(e),
            res = res.replace(/\<br>/gi, "\n"),
            res = res.strip_tags().trim(),
            res
    }
        ,
        MH.bbCodeProfile = function(e, t, n) {
        1 != t && (e = (e = e.replace(/&nbsp;/gi, " ")).replace(/&amp;/gi, "&")),
            e = decodeURIComponent(e);
        var i, a = new Array("b","i","u","s","center","quote","url","img");
        for (e = (e = e.replace(/\r?\n|\r/gm, "")).replace(/\s+/g, " "),
             i = 0; i < a.length; i++)
            e = (e = e.replace(new RegExp("<" + a[i] + ">","gi"), "[" + a[i] + "]")).replace(new RegExp("</" + a[i] + ">","gi"), "[/" + a[i] + "]");
        return e = 1 == t ? e.replace(/<span class\="bbcodes bbcodes_ally"><a href\="#" onclick\="Layout\.allianceProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>(.*?)<\/span>/gi, "[ally][id=$2]$3[/]") : e.replace(/<span class\="bbcodes bbcodes_ally"><a href\="#" onclick\="Layout\.allianceProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>(.*?)<\/span>/gi, "[ally]$3[/]"),
            e = (e = (e = (e = (e = (e = (e = 1 == t ? e.replace(/<a href\="#" class\="bbcodes bbcodes_player" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player][id=$2]$3[/]") : e.replace(/<a href\="#" class\="bbcodes bbcodes_player" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player]$3[/]")).replace(/<span class\="bbcodes bbcodes_player">(.*?)<\/span>/gi, "[player]$1[/]")).replace(/<span class\="bbcodes bbcodes_town"><a href\="(.*?)>(.*?)<\/span>/gi, "[town]$2[/]")).replace(/<span class\="bbcodes bbcodes_color" style\="color\:#(.*?)">(.*?)<\/span>/gi, "[color=#$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_size" style\="font-size\:(.*?)pt">(.*?)<\/span>/gi, "[size=$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_font (.*?)">(.*?)<\/span>/gi, "[font=$1]$2[/]")).replace(/<a class\="bbcodes bbcodes_url"(.*?)href\="https:\/\/(.*?)\.grepolis\.com\/start\/redirect\?url\=(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$6[/]"),
            res = MH.BBCode_ReplaceEndTags(e),
            res = res.replace(/\<br>/gi, "\n"),
            res
    }
        ,
        MH.BBCode_ReplaceEndTags = function(t, e) {
        var n, i, a, o = "", r = ["font", "size", "color", "player", "ally", "url", "town"], l = [0, 0, 0, 0, 0, 0, 0], s = [], d = 0, p = 0;
        return null != e && (r = e),
            function e() {
            for (p in l)
                l[p] = 65e3;
            for (p in r)
                0 <= (n = t.indexOf("[" + r[p], 0)) && (l[p] = n);
            for (p in n = a = 65e3,
                 l)
                l[p] < n && (n = l[p],
                             a = p);
            for (p in p = a,
                 i = t.indexOf("[/]", 0),
                 n < 0 && (n = 65e3),
                 i < 0 && (n = 65e3),
                 l)
                p != a && l[p] < i && (i = 65e3);
            return p = a,
                65e3 != n && 65e3 != i && n < i ? (t = t.replace("[/]", "[/" + r[p] + "]"),
                                                   o += t.substring(0, i + 3),
                                                   t = t.substring(i + 3, t.length),
                                                   void e()) : i < n ? (d--,
                                                                        t = t.replace("[/]", "[/" + r[s[d]] + "]"),
                                                                        o += t.substring(0, i + 3),
                                                                        t = t.substring(i + 3, t.length),
                                                                        void (65e3 != n && e())) : void (n < i && (s[d] = p,
                                                                                                                   d++,
                                                                                                                   o += t.substring(0, n + 1),
                                                                                                                   t = t.substring(n + 1, t.length),
                                                                                                                   e()))
        }(),
            o += t
    }
        ,
        MH.WhtImg = function(e) {
        return p = MH.Home + "i/" + e + ".gif",
            "[img]" + p + "[/img]"
    }
        ,
        MH.BBCodeFromHtmlEX = function(e) {
        e = (e = e.replace(/&nbsp;/gi, " ")).replace(/%/gi, "%25"),
            e = decodeURIComponent(e);
        var t, n = new Array("b","i","u","s","center","quote","url");
        for (e = (e = e.replace(/\r?\n|\r/gm, "")).replace(/\s+/g, " "),
             t = 0; t < n.length; t++)
            e = (e = e.replace(new RegExp("<" + n[t] + ">","gi"), "[" + n[t] + "]")).replace(new RegExp("</" + n[t] + ">","gi"), "[/" + n[t] + "]");
        return e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/\<br>/gi, "\n")).replace(/<br \/>/gi, "\n")).replace(/<span class\="bbcodes bbcodes_ally"><a href\="#" onclick\="Layout\.allianceProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>(.*?)<\/span>/gi, "[ally]$3[/]")).replace(/<a href\="#" class\="bbcodes bbcodes_player" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player]$3[/]")).replace(/<span class\="bbcodes bbcodes_player">(.*?)<\/span>/gi, "[player]$1[/]")).replace(/<span class\="bbcodes bbcodes_town"><a href\="(.*?)>(.*?)<\/span>/gi, "[town]$2[/]")).replace(/<span class\="bbcodes bbcodes_color" style\="color\:#(.*?)">(.*?)</gi, "[color=#$1]$2[/]<")).replace(/<span class\="bbcodes bbcodes_color" style\="color\:#(.*?)">(.*?)<\/span>/gi, "[color=#$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_size" style\="font-size\:(.*?)pt">(.*?)<\/span>/gi, "[size=$1]$2[/]")).replace(/<span class\="bbcodes bbcodes_font (.*?)">(.*?)<\/span>/gi, "[font=$1]$2[/]")).replace(/<a class\="bbcodes bbcodes_url"(.*?)href\="https:\/\/(.*?)\.grepolis\.com\/start\/redirect\?url\=(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$6[/]")).replace(/<img src\="(.*?)"(.*?)\/>/gi, "[img]$1[/]")).replace(/<div class\="bbcodes bbcodes_quote quote"><div class\="quote_message small">(.*?)<\/div><\/div>/gi, "[quote]$1[/]")).replace(/<table(.*?)>(.*?)<\/table>/gi, "[table]$2[/]")).replace(/<table(.*?)>(.*?)<\/table>/gi, "[table]$2[/]"),
            res = MH.BBCodeFromHtml_ReplaceEndTags(e),
            res
    }
        ,
        $.fn.removeAllAttrs = function() {
        return this.each(function() {
            $.each(this.attributes, function() {
                this.ownerElement.removeAttributeNode(this)
            })
        })
    }
        ,
        MH.BBCodeFromJQ = function(e) {
        var n;
        function t(e, t) {
            for (; n.find(e).length; )
                n.find(e).replaceWith(t)
        }
        return $("#MH_hidden").append($("<div/>", {
            id: "MH_bbctmp"
        })),
            (n = $("#MH_hidden #MH_bbctmp")).empty(),
            $(e).clone().appendTo(n),
            n.find("script").remove(),
            n.find(".MHbbcADD").remove(),
            t(".bbcodes_color", function() {
            return "[color=" + MH.utl.rgb2hex($(this).css("color")) + "]" + $(this).html() + "[/color]"
        }),
            t(".bbcodes_size", function() {
            return "[size=" + $(this)[0].style.fontSize.replace("pt", "") + "]" + $(this).html() + "[/size]"
        }),
            t(".bbcodes_quote", function() {
            if (!$(".quote_author", this).length)
                return "[quote]" + $(".quote_message", this).html() + "[/quote]";
            var e = $(".quote_author", this).html();
            return "[quote=" + (e = e.substring(0, e.lastIndexOf(" "))) + "]" + $(".quote_message", this).html() + "[/quote]"
        }),
            t(".bbcodes_font", function() {
            return "[font=" + $(this).attr("class").split(" ").pop() + "]" + $(this).html() + "[/font]"
        }),
            n.find(".bbcodes_ally").replaceWith(function() {
            return "[ally]" + $(this).text() + "[/ally]"
        }),
            n.find(".bbcodes_player").replaceWith(function() {
            return "[player]" + $(this).text() + "[/player]"
        }),
            n.find(".bbcodes_spoiler").replaceWith(function() {
            return $(this).find(".button").remove(),
                $("b:first", this).text() == DM.getl10n("bbcodes").spoiler.name ? "[spoiler]" + $(".bbcodes_spoiler_text", this).html() + "[/spoiler]" : "[spoiler=" + $("b:first", this).text() + "]" + $(".bbcodes_spoiler_text", this).html() + "[/spoiler]"
        }),
            n.find(".reservation_list").replaceWith(function() {
            return "[reservation]" + MH.utl.bbcodes_town_id($(this).find("a.gp_town_link")) + "[/reservation]"
        }),
            n.find(".bbcode.grepolis_score").replaceWith(function() {
            return "[score]" + $(this).find(".bbcode_playername").html().clear() + "[/score]"
        }),
            n.find(".published_report").replaceWith("[report]?[/report]"),
            n.find(".bbcode_awards").replaceWith("[img]https://grmh.pl/aw/award.gif[/img]"),
            e = n.html().trim(),
            n.remove(),
            e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/(\r\n|\n|\r|\t)/gm, "")).replace(/\<b\>(.*?)\<\/b\>/gi, "[b]$1[/b]")).replace(/\<i\>(.*?)\<\/i\>/gi, "[i]$1[/i]")).replace(/\<u\>(.*?)\<\/u\>/gi, "[u]$1[/u]")).replace(/\<s\>(.*?)\<\/s\>/gi, "[s]$1[/s]")).replace(/\<center\>(.*?)\<\/center\>/gi, "[center]$1[/center]")).replace(/<a(.*?)class\="bbcodes bbcodes_url"(.*?)href\="https:\/\/(.*?)\.grepolis\.com\/start\/redirect\?url\=(.*?)"(.*?)>(.*?)<\/a>/gi, function(e, t, n, i, a, o, r) {
            return (a = decodeURIComponent(a)) == r ? "[url]" + a + "[/url]" : "[url=" + a + "]" + r + "[/url]"
        })).replace(/\<span class="bbcodes bbcodes_town"\>\<a href=\"#(.*?)\".+\<\/span\>/gi, function(e, t, n, i) {
            return "[town]" + $.parseJSON(atob(t)).id + "[/town]"
        })).replace(/\<span class="bbcodes bbcodes_town"\>(.*?)<\/span\>/gi, "[town]$1[/town]")).replace(/\<img(.*?) src="(.*?)"(.*?)\>/gi, "[img]$2[/img]")).replace(/\<span class="bbcodes bbcodes_island"\>\<a href=\"#(.*?)\" .+\<\/span\>/gi, function(e, t, n, i) {
            return "[island]" + $.parseJSON(atob(t)).id + "[/island]"
        })).replace(/\<span class="bbcodes bbcodes_island"\>(.*?)<\/span\>/gi, "[island]$1[/island]")).replace(/\<tr\>\<td\>/gi, "[*]")).replace(/\<tr\>\<th\>/gi, "[**]")).replace(/\<\/td\>\<\/tr\>/gi, "[/*]")).replace(/\<\/th\>\<\/tr\>/gi, "[/**]")).replace(/\<\/td\>/gi, "[|]")).replace(/\<\/th\>/gi, "[||]")).replace(/\<td\>/gi, "")).replace(/\<th\>/gi, "")).replace(/\<tbody\>/gi, "[table]")).replace(/\<\/tbody\>/gi, "[/table]")).replace(/<br\s*\/?>/gm, "\n")).strip_tags(),
            (e = MH.BBCodeDecodeHTMLEntities(e)).trim()
    }
        ,
        MH.BBCodeDecodeHTMLEntities = function(e) {
        var n = {
            nbsp: 160,
            lt: 60,
            gt: 62,
            amp: 38,
            cent: 162,
            pound: 163,
            yen: 165,
            euro: 8364,
            copy: 169,
            reg: 174,
            forall: 8704,
            part: 8706,
            exist: 8707,
            empty: 8709,
            nabla: 8711,
            isin: 8712,
            notin: 8713,
            ni: 8715,
            prod: 8719,
            sum: 8721,
            Alpha: 913,
            Beta: 914,
            Gamma: 915,
            Delta: 916,
            Epsilon: 917,
            Zeta: 918
        };
        return e.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function(e, t) {
            return "#" === t[0] ? String.fromCharCode("x" === t[1].toLowerCase() ? parseInt(t.substr(2), 16) : parseInt(t.substr(1), 10)) : n.hasOwnProperty(t) ? String.fromCharCode(n[t]) : e
        })
    }
        ,
        MH.utl = {
        ObjLength: function(e) {
            var t, n = 0;
            for (t in e)
                e.hasOwnProperty(t) && n++;
            return n
        },
        bbcodes_ally_id: function(e) {
            var t = $(e).attr("onclick");
            if (void 0 !== t && !1 !== t) {
                e = !1;
                if (0 <= t.indexOf("Forum") && (e = !0),
                    t = e ? t.replace(/Forum\.openAllianceProfile\((.*?),(.*?)\)/gi, "$2") : t.replace(/Layout\.allianceProfile\.open\((.*?),(.*?)\)/gi, "$2"),
                    t = parseInt(t),
                    !isNaN(t))
                    return t
            }
            return !1
        },
        bbcodes_ally_name: function(e) {
            var t = $(e).attr("onclick");
            if (void 0 === t || !1 === t)
                return "";
            e = !1;
            return 0 <= t.indexOf("Forum") && (e = !0),
                t = e ? t.replace(/Forum\.openAllianceProfile\('(.*?)',(.*?)\)/gi, "$1") : t.replace(/Layout\.allianceProfile\.open\('(.*?)',(.*?)\)/gi, "$1")
        },
        bbcodes_player_id: function(e) {
            var t = $(e).attr("onclick");
            if (void 0 !== t && !1 !== t) {
                e = !1;
                if (0 <= t.indexOf("Forum") && (e = !0),
                    t = e ? t.replace(/Forum\.openPlayerProfile\((.*?),(.*?)\)/gi, "$2") : t.replace(/Layout\.playerProfile\.open\((.*?),(.*?)\)/gi, "$2"),
                    t = parseInt(t),
                    !isNaN(t))
                    return t
            }
            return !1
        },
        gp_player_link_id: function(e) {
            e = $(e).attr("href");
            return void 0 !== e && !1 !== e && "undefined" != (e = MH.Link2Struct(e)).id && (e = parseInt(e.id),
                                                                                             !isNaN(e)) && e
        },
        bbcodes_town_id: function(e) {
            e = $(e).attr("href");
            return void 0 !== e && !1 !== e && "undefined" != (e = MH.Link2Struct(e)).id && (e = parseInt(e.id),
                                                                                             !isNaN(e)) && e
        },
        StringReverse: function(e) {
            return Array.from(e).reverse().join("")
        },
        FileNameCorrect: function(e) {
            return e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/\//gi, "_")).replace(/\\/gi, "_")).replace(/\:/gi, "_")).replace(/\*/gi, "_")).replace(/\?/gi, "_")).replace(/</gi, "_")).replace(/>/gi, "_")).replace(/&lt;/gi, "_")).replace(/&gt;/gi, "_")).replace(/\|/gi, "_")).replace(/\"/gi, "_")).replace(/\%/gi, "_")
        },
        ClientSave: function(e, t) {
            e = MH.utl.FileNameCorrect(e);
            MH.wndCreate("SavDlg", MH.Lang.getFILE, 400, 220);
            MH.Call("htm", {
                name: e,
                data: MH.utl.StringReverse(t)
            }, function(e) {
                e.link.indexOf("https://") < 0 ? MH.OwnWnds.SavDlg.setContent("<center><br><br><br><b>ERROR :(</b></center>") : MH.OwnWnds.SavDlg.setContent("<center><br><br><b>" + MH.Lang.getF1 + ':</b><br><br><a href="' + e.link + '" target=_blank>' + e.link + "</a><br><br>" + MH.Lang.getF2 + "</center>")
            }, function() {
                MH.OwnWnds.SavDlg.setContent("<center><br><br><br><b>ERROR :(</b></center>")
            })
        },
        ClientSaveGrepo: function(e, t, n, i, a) {
            var o, r = "";
            $("#MH_hidden").append($("<div/>", {
                id: "MH_tmp"
            })),
                (o = $("#MH_hidden #MH_tmp")).empty(),
                $(i).clone().appendTo(o),
                o.find("script").remove(),
                o.find(".MHbbcADD").remove(),
                o.find("a.bbcodes_ally").css({
                background: "",
                "padding-left": ""
            }),
                o.find("span.bbcodes_ally").css({
                background: "",
                "padding-left": ""
            }),
                o.find("span.bbcodes_ally>a").each(function(e, t) {
                (r = MH.utl.bbcodes_ally_id(t)) && ($(t).attr("href", MH.Home + "?p=tol&m=pal&wid=" + MH.DB.worldID + "&al=" + r),
                                                    $(t).attr("target", "_blank"))
            }),
                o.find("a.bbcodes_ally").each(function(e, t) {
                (r = MH.utl.bbcodes_ally_id(t)) && ($(t).attr("href", MH.Home + "?p=tol&m=pal&wid=" + MH.DB.worldID + "&al=" + r),
                                                    $(t).attr("target", "_blank"))
            }),
                o.find("a.bbcodes_player").each(function(e, t) {
                (r = MH.utl.bbcodes_player_id(t)) && ($(t).attr("href", MH.Home + "?p=tol&m=ppl&wid=" + MH.DB.worldID + "&pl=" + r),
                                                      $(t).attr("target", "_blank"))
            }),
                o.find("a.gp_player_link").each(function(e, t) {
                (r = MH.utl.gp_player_link_id(t)) && ($(t).attr("href", MH.Home + "?p=tol&m=ppl&wid=" + MH.DB.worldID + "&pl=" + r),
                                                      $(t).attr("target", "_blank"))
            }),
                o.find("a.gp_town_link").each(function(e, t) {
                (r = MH.utl.bbcodes_town_id(t)) && ($(t).attr("href", MH.Home + "?p=tol&m=cit&wid=" + MH.DB.worldID + "&town=" + r),
                                                    $(t).attr("target", "_blank"))
            }),
                o.find(".bbcodes_url").css("display", "unset"),
                o.find(".bbcodes_url").each(function(e, t) {
                0 <= (e = (t = $(this).attr("href")).indexOf("redirect?url=")) && (t = t.substr(e + 13)),
                    t = $(this).attr("href", decodeURIComponent(t))
            }),
                o.children().first().attr("id", "MHCON"),
                i = o.html().trim(),
                o.remove(),
                i = i.replace(/onclick="(.*?)"/gi, ""),
                r = "<!DOCTYPE html>\n",
                r += '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="' + Game.locale_lang + '" lang="' + Game.locale_lang + '">\n',
                r += "<head>\n",
                r += '\t<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>\n',
                r += '\t<meta name="description" content="GREPOLIS DUMP"/>\n',
                r += "\t<title>" + t + " " + n + "</title>\n",
                r += '\t<link href="https://en.grepolis.com/cache/css/merged/game_0.css" rel="stylesheet" type="text/css"/>\n',
                r += '\t<link href="https://en.grepolis.com/cache/css/merged/game_1.css" rel="stylesheet" type="text/css"/>\n',
                r += '\t<link href="https://en.grepolis.com/cache/css/merged/game_2.css" rel="stylesheet" type="text/css"/>\n',
                r += '\t<link href="https://en.grepolis.com/cache/css/merged/game_3.css" rel="stylesheet" type="text/css"/>\n',
                r += '\t<link href="https://en.grepolis.com/cache/css/merged/game_4.css" rel="stylesheet" type="text/css"/>\n',
                r += "</head>\n",
                r += "<body>\n",
                r += "<center>\n",
                r += '<div id="rekup">&nbsp;</div>\n',
                r += '<div class="game_border" style="width:756px; text-align:left; z-index:1000;',
                -1 < i.indexOf("message_post_container") && (r += "height:1000px"),
                r += '">\n',
                r += '\t<div class="game_border_top"></div>\n',
                r += '\t<div class="game_border_bottom"></div>\n',
                r += '\t<div class="game_border_left"></div>\n',
                r += '\t<div class="game_border_right"></div>\n',
                r += '\t<div class="game_border_corner corner1"></div>\n',
                r += '\t<div class="game_border_corner corner2"></div>\n',
                r += '\t<div class="game_border_corner corner3"></div>\n',
                r += '\t<div class="game_border_corner corner4"></div>\n',
                r += '\t\t<div id="threadtitle" class="game_header bold">\n',
                r += '           \t\t<span style="cursor:pointer;">\n',
                r += '\t\t\t<span class="title">' + t + "</span>\n",
                r += '\t\t\t<span class="title" style="float:right;">' + n + "</span>\n",
                r += "\t\t\t</span>\n",
                r += "\t\t</div>\n",
                r += i,
                r += "</div>\n",
                r += '<div id="rekdown">&nbsp;</div>\n',
                r += "</center>\n",
                r += " \x3c!-- Include JS --\x3e\n",
                r += ' <script type="text/javascript">\n',
                r += " //<![CDATA[\n",
                r += "(function(){\n",
                r += ' MHTMP_lng_show="' + MH.GLng.Show + '";\n',
                r += ' MHTMP_lng_hide="' + MH.GLng.Hide + '";\n',
                MH.utl.ClientSave(e, r)
        },
        strip_tags: String.prototype.strip_tags = function() {
            return tags = this,
                stripped = tags.replace(/<\/?[^>]+>/gi, ""),
                stripped
        }
        ,
        clear: String.prototype.clear = function() {
            return this.strip_tags().replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\t/g, "").trim()
        }
        ,
        repAt: String.prototype.repAt = function(e, t) {
            return this.substr(0, e) + t + this.substr(e + t.length)
        }
        ,
        hexDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
        rgb2hex: function(e) {
            return e = e.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
                "#" + MH.utl.hex(e[1]) + MH.utl.hex(e[2]) + MH.utl.hex(e[3])
        },
        hex: function(e) {
            return isNaN(e) ? "00" : MH.utl.hexDigits[(e - e % 16) / 16] + MH.utl.hexDigits[e % 16]
        },
        secsToHHMMSS: function(e) {
            e = Math.floor(e);
            var t = Math.floor(e / 3600)
            , n = Math.floor((e - 3600 * t) / 60)
            , e = e - 3600 * t - 60 * n;
            return t < 10 && (t = "0" + t),
                n < 10 && (n = "0" + n),
                e < 10 && (e = "0" + e),
                t + ":" + n + ":" + e
        },
        str2date: function(e) {
            return "." == e[3] ? new Date(e.substring(7, 11),e.substring(4, 6) - 1,e.substring(1, 3),e.substring(12, 14),e.substring(15, 17),e.substring(18, 20)) : (e = (e = (e = (e = e.replace("(", "")).replace(")", "")).replace(" ", "T")).replace(" ", ""),
        new Date(e))
        },
        strNwht: function(e, t) {
            var n = "";
            if ((e = e.toString()).length >= t)
                return e.substring(e.length - t, e.length);
            for (; 0 < t - e.length; )
                n += "\ufeff░",
                    t--;
            return n + e
        },
        strNwhtL: function(e, t) {
            var n = "";
            if ((e = e.toString()).length >= t)
                return e.substring(0, t);
            for (n += e; 0 < t - e.length; )
                n += "\ufeff░",
                    t--;
            return n
        }
    },
        MH.LMHData = {},
        MH.LMHData_Get = function(e) {
        return !!MH.LMHData.hasOwnProperty(e) && MH.LMHData[e]
    }
        ,
        MH.DB = {
        structTWrldNfo: ["id", "nam", "cre", "cas", "wet", "spw", "spu", "spt", "nra", "pro", "atm", "bon", "cnq", "mor", "her", "ibe", "gte", "wnd", "bpv", "end"],
        structTWrldNfo2: ["id", "gvers", "isend", "isreq", "wonde", "allys", "plays", "towns"],
        lang: Game.locale_lang.substring(0, 2).toLowerCase(),
        land: Game.world_id.substring(0, 2).toLowerCase(),
        world: Game.world_id.substring(2, Game.world_id.length),
        worldID: Game.world_id.toLowerCase(),
        wName: "?",
        player: Game.player_name,
        playerID: Game.player_id
    },
        MH.DB.Init = function() {
        void 0 !== GameData.units.colonize_ship ? (MH.GameVer = window.Game.version.full,
                                                   MH.DB.needLNG = {},
                                                   MH.StorageLoad("cMH_needLNG", MH.DB.Init2)) : setTimeout("MH.DB.Init()", 100)
    }
        ,
        MH.DB.Init2 = function(e, t) {
        1 == $.isPlainObject(t) && (MH.DB.needLNG = t),
            MH.SWI = new TMHData("SWnfo"),
            MH.SWI.InsertKeys(MH.DB.structTWrldNfo, "?"),
            MH.StorageLoad(MH.SWI.cID, MH.DB.Init3)
    }
        ,
        MH.DB.Init3 = function(e, t) {
        1 == $.isPlainObject(t) && MH.SWI.CollectFrom(t),
            null == MH.SWI.dat.nam && (MH.SWI.dat.nam = "?"),
            MH.DWI = new TMHData("DWnfo"),
            MH.DWI.InsertKeys(MH.DB.structTWrldNfo2, "?"),
            MH.StorageLoad(MH.DWI.cID, MH.DB.Init4)
    }
        ,
        MH.DB.Init4 = function(e, t) {
        var n, i;
        1 == $.isPlainObject(t) && MH.DWI.CollectFrom(t),
            MH.SWI.dat.id = Game.world_id,
            MH.DWI.dat.id = Game.world_id,
            MH.DWI.dat.isend = "n",
            0 <= MH.DWI.dat.wonde.indexOf("y") && (MH.DWI.dat.isreq = "n"),
            0 <= MH.DWI.dat.wonde.indexOf("n") && (MH.DWI.dat.isreq = "y"),
            "?" != MH.GameVer && (MH.DWI.dat.gvers = MH.GameVer),
            (t = {}).id = Game.world_id,
            t.wet = "n",
            "end_game_type_world_wonder" == Game.features.end_game_type && (t.wet = "w"),
            "end_game_type_domination" == Game.features.end_game_type && (t.wet = "d"),
            "end_game_type_olympus" == Game.features.end_game_type && (t.wet = "o"),
            t.cas = "n",
            Game.features.casual_world && (t.cas = "y"),
            t.spw = Game.game_speed.toString(),
            t.spu = (GameData.units.colonize_ship.speed / 3).toString(),
            t.cnq = "o",
            "old" != Game.features.command_version && (t.cnq = "n"),
            t.her = "n",
            Game.features.heroes_enabled && (t.her = "y"),
            t.ibe = "y",
            "disabled" == Game.features.instant_buy && (t.ibe = "n"),
            t.gte = "n",
            Game.features.premium_gold_trading_enabled && (t.gte = "y"),
            t.bpv = "n",
            Game.features.battlepoint_villages && (t.bpv = "y"),
            t.end = "n",
            $("#world_end_info").length && (n = $("#world_end_info").html().match(/\d+/)[0],
                                            n = parseInt(n),
                                            isNaN(n) || (i = new Date,
                                                         i = new Date(i.setTime(i.getTime() + 864e5 * n)),
                                                         t.end = i.getUTCFullYear(),
                                                         n = i.getUTCMonth() + 1,
                                                         t.end += n < 10 ? "-0" : "-",
                                                         t.end += n,
                                                         n = i.getUTCDate(),
                                                         t.end += n < 10 ? "-0" : "-",
                                                         t.end += n)),
            0 < MH.SWI.CollectFrom(t) && MH.SWI.Save(),
            "?" != MH.SWI.dat.bon && (t.bon = MH.SWI.dat.bon),
            "?" != MH.SWI.dat.mor && (t.mor = MH.SWI.dat.mor),
            "?" != MH.SWI.dat.wnd && (t.wnd = MH.SWI.dat.wnd),
            "?" != MH.SWI.dat.nra && (t.nra = MH.SWI.dat.nra),
            MH.DB.wName = MH.SWI.dat.nam,
            MH.LastTownId = Game.townId,
            MH.Set.WndT && (HelperTown.updateBrowserWindowTitle = function() {
            _log("MH zmiana miasta: " + Game.townId + " (" + Game.townName + ")"),
                document.title = MH.DB.worldID + " " + MH.SWI.dat.nam + " - " + Game.townName,
                MH.SymbolsMiniDrwElem(),
                $("#citys_info_table_scroll").length && MH.ATimesTable_TownSwitch(MH.LastTownId, Game.townId),
                $("#mhTownList_inner").length && MH.TwnLst_MainWnd_TownSwitch(MH.LastTownId, Game.townId),
                $("#mhFarmList_inner").length && MH.FrmLst_MainWnd_TownSwitch(MH.LastTownId, Game.townId),
                $("#mhMissList_inner").length && MH.MissLst_MainWnd_TownSwitch(MH.MissTownId, Game.townId);
            var e = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_TOWN);
            if (e) {
                if (MH.LastTownId == Game.townId)
                    return;
                e.toTop(),
                    e.setTitle(Game.townName),
                    e.requestContentGet("town_info", "god", {
                    id: Game.townId
                })
            }
            MH.LastTownId = Game.townId
        }
                           ),
            HelperTown.updateBrowserWindowTitle(),
            (i = new TMHData("last",{
            v: "?",
            d: "?",
            t: "?",
            a: ""
        })).Load(),
            null == Game.alliance_id && (i.dat.a = ""),
            n = (new Date).getUTCDay(),
            i.dat.a.length < 4 && (null == Game.alliance_id ? i.dat.a = "" : MH.ev.AllyIN(Game.alliance_id)),
            Game.alliance_name = i.dat.a,
            i.dat.v != MH.sVer && setTimeout("MH.DB.ShowNewVer()", 2e4),
            i.dat.d != n && (i.dat.d = n,
                             i.dat.t = Timestamp.server() - Timestamp.clientGMTOffset(),
                             i.Save(),
                             null == MH.SWI.dat.nam && (MH.SWI.dat.nam = "?"),
                             n = MH.SWI.GetKeysByVal("?"),
                             $("#world_end_info").length && (MH.DWI.dat.test = new Date + " - " + Game.world_id + " : " + $("#world_end_info").html()),
                             i = MH.DWI.dat,
                             1 != MH.is_IDB && (t = {},
                                                i = {}),
                             MH.Call("log", {
            req: {
                infWorldSet: t,
                infWorldGet: n,
                DinfWorld: i
            }
        }, function(e) {
            "object" == typeof e.wrldNfo && (0 < MH.SWI.CollectFrom(e.wrldNfo) && MH.SWI.Save(),
                                             MH.DB.wName = MH.SWI.dat.nam),
                "object" == typeof e.DwrldNfo && (MH.DWI.CollectFrom(e.DwrldNfo),
                                                  MH.DWI.Save())
        }, !1, MH.DB.InitLst))
    }
        ,
        MH.DB.InitLst = function() {
        "zz" != MH.DB.land && MH.Call("req:get", {}, function(r) {
            if (null != r.req.lngGame) {
                var i, d = {};
                for (i in r.req.lngGame)
                    if (r.req.lngGame.hasOwnProperty(i))
                        try {
                            "?" == r.req.lngGame[i].charAt(0) && (MH.DB.needLNG[i] = "?"),
                                "@" == r.req.lngGame[i].charAt(0) && (d[i] = eval(r.req.lngGame[i].replace("@", "") + ";"))
                        } catch (e) {
                            delete d[i]
                        }
                MH.Storage("cMH_needLNG", MH.DB.needLNG),
                    MH.Call("req:set", {
                    req: {
                        lngGame: d
                    }
                }, function() {})
            }
        })
    }
        ,
        MH.DB.ShowNewVer = function() {
        $('<style type="text/css"> #notification_area .mh_notifi .icon { background: url(' + MH.Home + "medias/images/log-msg.gif) 0px 0px no-repeat !important;} </style>").appendTo("head"),
            (new NotificationHandler).notify($("#notification_area>.notification").length + 1, "mh_notifi", "<span span id='mh_notifinfo' style='cursor:pointer; color:rgb(255,255,255)'><b><u>" + MH.Lang.norka + " - " + MH.Lang.HLPVERSION + ": " + MH.sVer + "</u></b></span><span class='small notification_date'>;)</span>"),
            $("#notification_area .mh_notifi").click(function() {
            $(this).find(".close").click(),
                Layout.dialogWindow.open('<center><img src="' + MH.Home + 'new_19.png"/></center>', MH.Scripts_name, 650, 592, null, !1).setPosition("center", "center");
            var e = MH.LMHData_Get("last");
            e.dat.v = MH.sVer,
                e.Save()
        })
    }
        ,
        MH.DB.GetMorAndBon = function(e) {
        try {
            var t = JSON.parse(e).json.json;
            if (void 0 !== t.morale_activated && (1 == t.morale_activated ? MH.SWI.dat.mor = "y" : MH.SWI.dat.mor = "n"),
                void 0 !== t.night_starts_at_hour && void 0 !== t.night_duration) {
                if (t.night_duration <= 0)
                    MH.SWI.dat.bon = "n";
                else {
                    var n = parseInt(t.night_starts_at_hour)
                    , i = parseInt(t.night_duration);
                    for (i += n; 23 < i; )
                        i -= 24;
                    MH.SWI.dat.bon = n + ":00-",
                        n < 10 && (MH.SWI.dat.bon = "0" + n + ":00-"),
                        i < 10 && (MH.SWI.dat.bon += "0"),
                        MH.SWI.dat.bon += i + ":00"
                }
                MH.SWI.Save()
            }
        } catch (e) {}
    }
        ,
        MH.DB.GetRanking = function(e, t) {
        var n, i;
        try {
            if ("undefined" == e)
                return;
            if (e = JSON.parse(e),
                "index" == t && "?" == MH.SWI.dat.wnd && (MH.SWI.dat.wnd = "n",
                                                          0 < e.json.menu.indexOf("ranking-wonder_allianceall") ? MH.SWI.dat.wnd = "y" : MH.DWI.dat.wonde = "n!",
                                                          MH.SWI.Save()),
                "index" == t || "alliance" == t) {
                if (i = e.plain.html,
                    n = i.indexOf("last_element"),
                    0 < n && (n = (n = (n = (n = i.substring(n, i.length)).substring(0, n.indexOf(","))).replace(/\s+/g, "")).substring(n.indexOf(":") + 1),
                              NaN == (n = parseInt(n))))
                    return;
                switch (t) {
                    default:
                        return;
                    case "alliance":
                        MH.DWI.dat.allys = n;
                        break;
                    case "index":
                        MH.DWI.dat.plays = n
                }
                MH.DWI.Save()
            }
            if ("y" != MH.SWI.dat.wnd)
                return;
            if ("wonder_alliance" != t)
                return;
            i = e.plain.html,
                MH.DWI.dat.wonde = "n!",
                0 < i.indexOf("gp_wonder_link") && (MH.DWI.dat.wonde = "y!"),
                MH.DWI.Save()
        } catch (e) {}
    }
        ,
        MH.gui = {
        RB_count: 0,
        _RB: function(e, t, n) {
            t = t ? "1" : "0";
            return '<a href="#" class="MHRB" id="RB_' + n + '" sel="' + t + '"><img src="' + MH.Home + "medias/images/rb" + t + '.gif" style="position:relative; top:2px;"> ' + e + "<br></a>"
        },
        _CB: function(e, t, n) {
            t = (t = t || !1) ? "1" : "0";
            return '<a href="#" class="MHCB" id="CB_' + n + '" sel="' + t + '"><img src="' + MH.Home + "medias/images/cb" + t + '.gif" style="position:relative; top:2px;"> ' + e + "<br></a>"
        },
        _append_html_events: function(e) {
            e.find("a.MHRB").click(function() {
                $(this).parent().find("a.MHRB").attr("sel", "0"),
                    $(this).attr("sel", "1"),
                    $(this).parent().find("a.MHRB").each(function() {
                    this.firstChild.src = MH.Home + "medias/images/rb" + this.getAttribute("sel") + ".gif"
                })
            }),
                e.find("a.MHCB").click(function() {
                "1" == this.getAttribute("sel") ? this.setAttribute("sel", "0") : this.setAttribute("sel", "1"),
                    this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
            })
        },
        game_border_corners: function() {
            return '<div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div>'
        },
        CBL: function(e, t) {
            return t = 1 == t ? "1" : "0",
                $("<span/>", {
                href: "#",
                id: e,
                sel: t,
                style: "cursor:pointer;"
            }).click(function() {
                "1" == this.getAttribute("sel") ? this.setAttribute("sel", "0") : this.setAttribute("sel", "1"),
                    this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
            }).append($("<img/>", {
                src: MH.Home + "medias/images/cb" + t + ".gif",
                style: "position:relative; top:2px;"
            }))
        },
        CB: function(e, t, n) {
            return n = 1 == n ? "1" : "0",
                $("<span/>", {
                href: "#",
                id: e,
                sel: n,
                style: "cursor:pointer;"
            }).click(function() {
                "1" == this.getAttribute("sel") ? this.setAttribute("sel", "0") : this.setAttribute("sel", "1"),
                    this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
            }).append($("<img/>", {
                src: MH.Home + "medias/images/cb" + n + ".gif",
                style: "position:relative; top:2px;"
            })).append(" " + t + "<br>")
        },
        CBB: function(e, t, n) {
            return n = 1 == n ? "1" : "0",
                $("<a/>", {
                href: "#",
                id: e,
                sel: n
            }).click(function() {
                "1" == this.getAttribute("sel") ? this.setAttribute("sel", "0") : this.setAttribute("sel", "1"),
                    this.firstChild.src = MH.Home + "medias/images/cb" + this.getAttribute("sel") + ".gif"
            }).append($("<img/>", {
                src: MH.Home + "medias/images/cb" + n + ".gif",
                style: "position:relative; top:2px;"
            })).append(" " + t + "<br>")
        }
    },
        MH.MenuHelper = {
        wndtohide: 0,
        actualmenu: 0,
        poupclick: !0
    },
        MH.htm = {
        wJQ: null,
        PlayerNFO: function(e, t) {
            var n;
            return 0 < $(t).find("li.town_owner a").length ? e.player = MH.bbc($(t).find("li.town_owner a").html().clear(), "player") : e.player = MH.bbc($(t).find("li.town_owner").html().clear(), "player"),
                $(t).find("li.town_owner a").length && (e.playerName = $(t).find("li.town_owner a").html().clear()),
                $(t).find("li.town_owner_ally a").length && ("undefined" == $(t).find("li.town_owner_ally a").attr("onclick") ? e.ally = MH.bbc($(t).find("li.town_owner_ally a").html().clear(), "ally") : (n = (n = (n = $(t).find("li.town_owner_ally a").attr("onclick")).substring(n.indexOf("'") + 1, n.lenght)).substring(0, n.indexOf("'")),
        e.ally = MH.bbc(n, "ally"))),
                $(t).find("li.town_name a").length ? e.town = MH.bbc(MH.Link2Struct($(t).find("li.town_name a").attr("href")).id.toString(), "town") : $(t).find("li.town_name").length && (e.town = MH.bbc($(t).find("li.town_name").html().clear(), "town")),
                $(t).find("li.town_name a").length && (e.townName = $(t).find("li.town_name a").html().clear()),
                $(t).find(".report_command").length && (e.townT = "attack"),
                e
        },
        UnitId: function(e) {
            if (null != $(e).attr("style") && $(e).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1") != $(e).attr("style"))
                return $(e).attr("style").replace(/.*\/([a-z_]*)_[0-9]*x[0-9]*\.png.*/, "$1");
            for (var t in GameData.units)
                if ($(e).hasClass(t))
                    return t.toString();
            for (t in GameData.heroes)
                if ($(e).hasClass(t))
                    return t.toString();
            return "unknown"
        },
        Units: function(n, e) {
            return "[object Array]" !== Object.prototype.toString.call(n.unit_list) && (n.unit_list = []),
                "[object Array]" !== Object.prototype.toString.call(n.unit_send) && (n.unit_send = []),
                $.each(MH.htm.wJQ.find(e), function(e, t) {
                e = MH.htm.UnitId(t),
                    n.unit_list.push(mhCNST.Units[e] || mhCNST.Units.unknown),
                    null != t.children[0] ? n.unit_send.push(t.children[0].innerHTML.clear()) : n.unit_send.push("?")
            }),
                n
        },
        UnitsL: function(i, e) {
            return "[object Array]" !== Object.prototype.toString.call(i.unit_list) && (i.unit_list = []),
                "[object Array]" !== Object.prototype.toString.call(i.unit_send) && (i.unit_send = []),
                "[object Array]" !== Object.prototype.toString.call(i.unit_lost) && (i.unit_lost = []),
                $.each(MH.htm.wJQ.find(e), function(e, t) {
                var n;
                0 < t.childElementCount && ((n = {}).id = MH.htm.UnitId(t.children[0]),
                                            n.cost = MH.htm.UnitCost(n.id),
                                            n.lost = t.children[1].innerHTML.replace("-", ""),
                                            "?" == n.lost ? n.lost = 0 : (i.w += n.cost.w * parseInt(n.lost),
                                                                          i.s += n.cost.s * parseInt(n.lost),
                                                                          i.i += n.cost.i * parseInt(n.lost),
                                                                          i.p += n.cost.p * parseInt(n.lost),
                                                                          i.f += n.cost.f * parseInt(n.lost)),
                                            e = mhCNST.Units[n.id] || mhCNST.Units.unknown,
                                            $(t.children[0]).hasClass("unknown") && (e = "xl"),
                                            $(t.children[0]).hasClass("unknown_naval") && (e = "xs"),
                                            $(t.children[0]).hasClass("unknown_unknown_hero") && (e = "xh"),
                                            i.unit_list.push(e),
                                            i.unit_send.push(t.children[0].children[0].innerHTML.clear()),
                                            i.unit_lost.push(t.children[1].innerHTML.clear().replace("-", "")))
            }),
                i
        },
        GetPowerImgFromClass: function(e, t) {
            for (var n = "x", i = "", a = 0; a < mhCNST.PowersIDs.length; a++)
                if (e.hasClass(mhCNST.PowersIDs[a])) {
                    n = mhCNST.PowersIDs[a];
                    break
                }
            return "x" == n ? MH.Home + "pow/gg.png" : (e.hasClass("lvl1") && (i = "0"),
                                                        e.hasClass("lvl2") && (i = "1"),
                                                        e.hasClass("lvl3") && (i = "2"),
                                                        e.hasClass("lvl4") && (i = "3"),
                                                        e.hasClass("lvl5") && (i = "4"),
                                                        e.hasClass("lvl6") && (i = "5"),
                                                        e.hasClass("lvl7") && (i = "6"),
                                                        e.hasClass("lvl8") && (i = "7"),
                                                        e.hasClass("lvl9") && (i = "8"),
                                                        e.hasClass("lvl10") && (i = "9"),
                                                        a = "3",
                                                        t && (e.hasClass("power_icon16x16") && (a = "1"),
                                                              e.hasClass("power_icon30x30") && (a = "3"),
                                                              e.hasClass("power_icon60x60") && (a = "6"),
                                                              e.hasClass("power_icon86x86") && (a = "8")),
                                                        MH.Home + "i/" + n + a + i + ".png")
        },
        getPowerIcon: function(e) {
            var t, n = "x", i = "", a = $(e);
            if ($(e).hasClass("small_temple_powers"))
                return "[img]" + MH.Home + "i/small_temple_powers3.png[/img]";
            if ($(e).hasClass("large_temple_powers"))
                return "[img]" + MH.Home + "i/large_temple_powers3.png[/img]";
            if (null != $(e).attr("data-power-id"))
                n = $(e).attr("data-power-id");
            else
                for (t = 0; t < mhCNST.PowersIDs.length; t++)
                    if (a.hasClass(mhCNST.PowersIDs[t])) {
                        n = mhCNST.PowersIDs[t];
                        break
                    }
            return "x" == n ? "[img]" + MH.Home + "pow/gg.png[/img]" : (a.hasClass("lvl1") && (i = "0"),
                                                                        a.hasClass("lvl2") && (i = "1"),
                                                                        a.hasClass("lvl3") && (i = "2"),
                                                                        a.hasClass("lvl4") && (i = "3"),
                                                                        a.hasClass("lvl5") && (i = "4"),
                                                                        a.hasClass("lvl6") && (i = "5"),
                                                                        a.hasClass("lvl7") && (i = "6"),
                                                                        a.hasClass("lvl8") && (i = "7"),
                                                                        a.hasClass("lvl9") && (i = "8"),
                                                                        a.hasClass("lvl10") && (i = "9"),
                                                                        t = "3",
                                                                        "[img]" + MH.Home + "i/" + n + t + i + ".png[/img]")
        },
        UnitsRes: function(e) {
            for (var t = {}, n = t.w = t.s = t.i = t.p = t.f = 0; n < $(e + " div.report_unit").length; n++) {
                var i = MH.htm.UnitId($(e + " div.report_unit")[n])
                , a = MH.htm.UnitCost(i)
                , i = $(e + " span.report_losts")[n].innerHTML.replace("-", "");
                "?" == i ? i = 0 : (t.w += a.w * parseInt(i),
                                    t.s += a.s * parseInt(i),
                                    t.i += a.i * parseInt(i),
                                    t.p += a.p * parseInt(i),
                                    t.f += a.f * parseInt(i))
            }
            return t
        },
        UnitCost: function(e) {
            try {
                return {
                    w: GameData.units[e].resources.wood,
                    s: GameData.units[e].resources.stone,
                    i: GameData.units[e].resources.iron,
                    p: GameData.units[e].population,
                    f: GameData.units[e].favor
                }
            } catch (e) {
                return {
                    w: 0,
                    s: 0,
                    i: 0,
                    p: 0,
                    f: 0
                }
            }
        },
        Buildings: function(n, e) {
            return "[object Array]" !== Object.prototype.toString.call(n.unit_list) && (n.unit_list = []),
                "[object Array]" !== Object.prototype.toString.call(n.unit_send) && (n.unit_send = []),
                $.each(MH.htm.wJQ.find(e), function(e, t) {
                "place" != (e = MH.htm.UnitId(t)) && (n.unit_list.push(mhCNST.Buildings[e] || "XX"),
                                                      n.unit_send.push(t.children[0].innerHTML.clear()))
            }),
                n
        },
        UnitsWall: function(e) {
            return res = {
                unit_list: [],
                unit_count: [],
                unit_dlist: [],
                unit_dcount: []
            },
                $.each($(e).find("div.wall_report_unit"), function(e, t) {
                e = MH.htm.UnitId($(t)),
                    res.unit_list.push(mhCNST.Units[e] || mhCNST.Units.unknown),
                    res.unit_count.push($(t).find("span.place_unit_black").html()),
                    $(t).find("span.HMoleDiff").length && "0" != $(t).find("span.HMoleDiff").html().clear() && (res.unit_dlist.push(mhCNST.Units[e] || mhCNST.Units.unknown),
                                                                                                                res.unit_dcount.push($(t).find("span.HMoleDiff").html()))
            }),
                res
        },
        HerculesUnits: function(n, e) {
            return $.each($(".hercules2014_fight_result").find(e), function(e, t) {
                0 < n.unit_list.length && (n.unit_list += "¨"),
                    0 < t.childElementCount && (n.unit_list += function(e) {
                    switch (e) {
                        default:
                            return "XX";
                        case "hastati":
                            return "Y1";
                        case "legionary":
                            return "Y2";
                        case "sagittarii":
                            return "Y3";
                        case "alaris":
                            return "Y4";
                        case "vexillarius":
                            return "Y5"
                    }
                }($(t).find(".mercenary_image").attr("data-type")),
                                                n.unit_send += MH.bbcU($(t).find(".total").html().clear()),
                                                n.unit_lost += MH.bbcU($(t).find(".wounded").html().clear()),
                                                1 != MH.gRAP.Style && (n.unit_send += "¨",
                                                                       n.unit_lost += "¨"))
            }),
                n
        }
    },
        MH.wo = {
        wMain: void 0,
        wGP: null,
        jGP: null,
        wSett: !1,
        nTMain: "0",
        nTInfo: "0",
        nTSettings: "0"
    },
        MH.wo.Close = function() {
        if (null != MH.wo.wMain) {
            try {
                MH.wo.wMain.close()
            } catch (e) {}
            MH.wo.wMain = void 0
        }
    }
        ,
        MH.wo.Reset = function() {
        try {
            $("#mh_SetMainBox").remove(),
                $("#player_settings").show(),
                MH.wo.jGP.find(".menu_wrapper").remove(),
                MH.wo.jGP.parent().find("#subtabs").remove(),
                MH.wo.jGP.parent().find(".gpwindow_top.MH").remove()
        } catch (e) {}
    }
        ,
        MH.wo.Show = function(e) {
        MH.wo.Close(),
            MH.wo.Reset(),
            null == e ? (MH.wo.wSett = !1,
                         MH.wo.wMain = Layout.dialogWindow.open("", MH.Lang.norka, 630, 550, function() {
            MH.wo.wMain = void 0
        }, !1),
                         MH.wo.wMain.setPosition(["center", "center"]),
                         MH.wo.wMain.getJQElement().find(".gpwindow_content").css("overflow", "hidden"),
                         MH.wo.wGP = MH.wo.wMain,
                         MH.wo.jGP = MH.wo.wGP.getJQElement(),
                         MH.wo.wGP.setContent2($("<div/>", {
            id: "mh_SetMainBox",
            class: "settings-container",
            style: "left:0;"
        }))) : (MH.wo.wSett = !0,
                MH.wo.wGP = e,
                MH.wo.jGP = MH.wo.wGP.getJQElement(),
                MH.wo.jGP.find(".settings-container").append($("<div/>", {
            id: "mh_SetMainBox"
        })),
                $(".settings-link").click(function() {
            MH.wo.Reset()
        })),
            MH.wo.jGP.append(mhGui.Tab("wotab", [MH.Lang.HELPTAB4, MH.Lang.HELPTAB6, MH.Lang.HELPTAB3, MH.Lang.HLPVERSION], "", function(e) {
            var t;
            switch (MH.wo.jGP.parent().find("#subtabs").remove(),
                    MH.wo.jGP.parent().find(".gpwindow_top.MH").remove(),
                    e) {
                default:
                    t = MH.wo.Set,
                        e = "0";
                    break;
                case "1":
                    t = MH.wo.Info;
                    break;
                case "2":
                    t = MH.wo.Ins;
                    break;
                case "3":
                    t = MH.wo.About
            }
            MH.wo.nTMain = e,
                $("#mh_SetMainBox").html(""),
                t(),
                $("#player_settings").hide(),
                $("#mh_SetMainBox").show()
        })),
            $("#wotab").append('<li><img src="' + MH.Home + 'imgs/icon.ico"</img></li>'),
            $("#wotab_" + MH.wo.nTMain).click()
    }
        ,
        MH.wo.Ins = function() {
        $("#mh_SetMainBox").append(MH.Lang.HLPVERSION + ":" + MH.sVer + "<iframe frameBorder='0' width='100%' height='460px' src='" + MH.Home + "HMRCinst.html?p=add&m=ins&lng=" + Game.market_id + "'></iframe>")
    }
        ,
        MH.wo.About = function() {
        var e = $("<div/>", {
            style: 'background:url("' + MH.Home + 'bck94.gif") no-repeat; height:488px'
        });
        "pl" == MH.LngUse ? e.append(mhGui.Button(MH.Lang.PostMessage).click(function() {
            MH.wo.MsgToAuthor()
        })).append("<br><b> ostatnio dodano:</b><br>").append(" - procentowa zawartość wojsk w liście miast<br>").append(" - dodatkowe opcje w oknie handlu z własnym miastem<br>").append(' - szybki dostęp do okna "Fenicki Handlarz" w menu<br>').append("<br><b> ostatnio poprawiono:</b><br>").append(" - poprawienie konwersji niektórych raportów (zwiększenie opcji)<br>").append(' - poprawiono błędy związane z "grafiką zimową"<br>').append(" - poprawiono niektóre błędy związane z nową wersją gry<br>").append("<br>" + MH.Lang.HLPVERSION + ":" + MH.sVer + "<br><br><br><br><br><br><br><br><br><br><br><br>").append('<br><font size="30"><a href="https://grmh.pl" target=_blank>grmh.pl</a></font>').append("<hr>").append("<center>pytania lub dostrzeżone błędy można słać na <b>TropsyKretts@gmail.com</b></center>") : e.append(mhGui.Button(MH.Lang.PostMessage).click(function() {
            MH.wo.MsgToAuthor()
        })).append("<br><b>last added:</b><br>").append(" - percentage of troops in towns list <br>").append(" - additional options in the own town trade window<br>").append(' - quick access to the "Phoenician Salesman" window in the menu<br>').append("<br><b>last improved:</b><br>").append(" - improve the conversion of some reports (increase options)<br>").append(' - bugs related to "winter graphics" has been corrected<br>').append(" - fixed some bugs related to the new game version<br>").append("<br>" + MH.Lang.HLPVERSION + ":" + MH.sVer + "<br><br><br><br><br><br><br><br><br><br><br><br>").append('<br><font size="30"><a href="https://grmh.pl" target=_blank>grmh.pl</a></font>').append("<hr>").append("<center>questions or perceived errors can be send to <b>TropsyKretts@gmail.com</b></center>"),
            e.append("<iframe style='top:0; right:0; position:absolute;' frameBorder='0' width='220px' height='120px' src='" + MH.Home + "donation.html?lng=" + Game.market_id + "'></iframe>"),
            $("#mh_SetMainBox").append(e)
    }
        ,
        MH.wo.MsgToAuthor = function() {
        $("#mh_SetMainBox").html(""),
            $("#mh_SetMainBox").append($("<textarea/>", {
            id: "hmMsg2Auth",
            style: "height:410px; width:99%; resize:vertical; margin:0px; padding:0px;"
        })).append(mhGui.Button(MH.Lang.PostTxt).click(function() {
            MH.Call("msg", {
                msg: $("#hmMsg2Auth").val()
            }, function() {
                HumanMessage.success(MH.Lang.PostOk),
                    $("#wotab_3").click()
            }, function() {
                HumanMessage.error(MH.Lang.PostFail)
            })
        }))
    }
        ,
        MH.wo.Info = function() {
        MH.wo.jGP.parent().append(mhGui.SubTab("subtabs", [MH.Lang.HELPTAB1, MH.Lang.HELPTAB2, MH.Lang.HELPTAB0, MH.Lang.AllU, MH.Lang.HELPTAB5, DM.getl10n("island_quests").window_title], "top:35px;", function(e) {
            var t;
            switch (e) {
                default:
                    t = MH.wo.InfoWord,
                        e = "0";
                    break;
                case "1":
                    t = MH.wo.InfoPlayer;
                    break;
                case "2":
                    t = MH.wo.InfoSpells;
                    break;
                case "3":
                    t = MH.wo.InfoUnits;
                    break;
                case "4":
                    t = MH.wo.InfoAwards;
                    break;
                case "5":
                    t = MH.wo.InfoQuests
            }
            $("#mh_InfoBox").html(""),
                t(),
                MH.wo.nTInfo = e,
                MH.wo.jGP.find("table.MHinfo tr").mouseover(function() {
                this.style.background = "#FFC040"
            }).mouseout(function() {
                this.style.background = ""
            })
        })),
            MH.wo.jGP.parent().find("#subtabs li").css("width", "105px"),
            MH.wo.jGP.parent().append($("<div/>", {
            class: "gpwindow_top MH",
            style: "height:12px; background-position:0 -49px; top:57px; z-index:15;"
        }).append($("<div/>", {
            class: "gpwindow_left corner",
            style: "height:12px; background-position:left -66px;"
        })).append($("<div/>", {
            class: "gpwindow_right corner",
            style: "height:12px; background-position:right -110px;"
        }))),
            MH.wo.wSett ? (MH.wo.jGP.parent().find(".gpwindow_top.MH").css({
            position: "absolute",
            left: "231px",
            width: "619px"
        }),
                           $("#mh_SetMainBox").append($("<div/>", {
            id: "mh_InfoBox",
            style: "margin-top:35px"
        }))) : $("#mh_SetMainBox").append($("<div/>", {
            id: "mh_InfoBox",
            style: "margin-top:25px"
        })),
            $("#subtabs_" + MH.wo.nTInfo).click()
    }
        ,
        MH.wo.InfoWord = function() {
        var e, t, n, i, a = MH.DB.land;
        a in mhCNST.CountryNames && (a = mhCNST.CountryNames[a]),
            "?" == (e = mhUtl.Clone(MH.SWI.dat)).spt && (e.spt = e.spu),
            "?" == e.atm && (e.atm = "10"),
            "o" == e.cnq && (e.cnq = MH.Lang.conquestt_o),
            "n" == e.cnq && (e.cnq = MH.Lang.conquestt_n),
            "c" == e.cnq && (e.cnq = MH.Lang.conquestt_c),
            "n" == e.bon && (e.bon = MH.GLng.No),
            n = ["mor", "her", "ibe", "gte", "wnd"];
        for (t = 0; t < n.length; t++)
            e.hasOwnProperty(n[t]) && ("y" == e[n[t]] && (e[n[t]] = MH.GLng.Yes),
                                       "n" == e[n[t]] && (e[n[t]] = MH.GLng.No));
        "y" == (o = mhUtl.Clone(MH.DWI.dat)).isreq && (o.isreq = MH.GLng.Yes),
            "n" == o.isreq && (o.isreq = MH.GLng.No),
            i = "<tr><td><b>" + MH.GLng.World + ":</td><td><b>" + MH.DB.worldID + " - " + e.nam,
            "y" == e.cas && (i += '<img src="' + MH.Home + 'img/world_casual.gif" alt="">'),
            "w" == e.wet && (i += '<img src="' + MH.Home + 'img/world_wonders.gif" alt="">'),
            "d" == e.wet && (i += '<img src="' + MH.Home + 'medias/images/world-domination.gif" alt="">'),
            "o" == e.wet && (i += '<img src="' + MH.Home + 'img/world_olympus.gif" alt="">'),
            i += "</td></tr>",
            MH.wo.jGP.find("#mh_InfoBox").append($('<table class="MHinfo">').append(i).append("<tr><td>" + MH.Lang.country + ":</td><td>" + a).append("<tr><td>" + MH.Lang.created + ":</td><td>" + e.cre).append("<tr><td>" + MH.Lang.conquesttype + ":</td><td>" + e.cnq).append("<tr><td>" + MH.Lang.wrdspeed + ":</td><td>" + e.spw).append("<tr><td>" + MH.Lang.unispeed + ":</td><td>" + e.spu).append("<tr><td>" + MH.Lang.trdspeed + ":</td><td>" + e.spt).append("<tr><td>" + MH.Lang.allylimit + ":</td><td>" + e.nra).append("<tr><td>" + MH.Lang.moral + ":</td><td>" + e.mor).append("<tr><td>" + MH.Lang.nBonus + ":</td><td>" + e.bon).append("<tr><td>" + MH.Lang.atiming + ":</td><td>" + e.atm).append("<tr><td>" + MH.Lang.protectplay + ":</td><td>" + e.pro).append("<tr><td>" + MH.GLng.Heroes + ":</td><td>" + e.her).append("<tr><td>" + DM.getl10n("report").inbox.filter_types.world_wonders + ":</td><td>" + e.wnd).append("<tr><td>" + MH.GLng.Gods + ":</td><td>" + Game.constants.gods.length).append("<tr><td>" + MH.GLng.Allys + ":</td><td>" + o.allys).append("<tr><td>" + MH.GLng.Players + ":</td><td>" + o.plays).append("<tr><td>" + MH.GLng.Towns + ":</td><td>" + o.towns).append("<tr><td>Recruitment:</td><td>" + o.isreq).append("</table>"));
        var o = MH.Home + "tmpcache/" + Game.world_id.substring(0, 2) + "/" + Game.world_id.substring(2, Game.world_id.length) + "/" + Game.world_id;
        void 0 === MH.wo.bstallys ? $.ajax({
            type: "GET",
            url: o + "_bstallys.js?" + (new Date).getDay(),
            dataType: "script",
            complete: function() {
                MH.wo.InfoWord_bstallys()
            },
            error: function(e, t, n) {
                404 == e.status && window.open(MH.Home + "?p=rnk&m=cnq" + MH.GetHomeUrlParm(), "_blank")
            }
        }) : MH.wo.InfoWord_bstallys()
    }
        ,
        MH.wo.InfoWord_bstallys = function() {
        if (void 0 !== MH.wo.bstallys) {
            for (var e = MH.Home + "tmpcache/" + Game.world_id.substring(0, 2) + "/" + Game.world_id.substring(2, Game.world_id.length) + "/" + Game.world_id, t = $("<div/>", {
                style: "border:0px; right:0px; top:177px; position:absolute;"
            }), n = 0; n < 6; n++)
                t.append("<tr><td><b>" + (n + 1) + '</b></td><td><div style="width:10px; height:10px; margin:0 5px; border:1px solid; background:' + MH.wo.bstallys.c[n] + ';"> </div></td><td>' + mhUtl.lnkAlly(MH.wo.bstallys.i[n], MH.wo.bstallys.a[n]) + "</td></tr>");
            MH.wo.jGP.find("#mh_InfoBox").append($("<img/>", {
                src: e + "_worldprv.gif?" + (new Date).getDay(),
                style: "right:60px; top:34px; position:absolute;"
            })),
                MH.wo.jGP.find("#mh_InfoBox").append(t);
            e = {
                type: ""
            };
            e.cJQ = MH.wo.jGP,
                MH.ev.ren.AllWnds(e)
        }
    }
        ,
        MH.wo.InfoPlayer = function() {
        function e(e) {
            return null != Game.premium_features[e] && 0 != Game.premium_user && MH.MMM.PremiumFeatures[Game.player_id].getAllActivated().hasOwnProperty(e) ? null == Game.premium_features[e] || 0 == Game.premium_user ? "-" : DM.getl10n("premium").advisors.ends(DateHelper.formatDateTimeNice(Game.premium_features[e], !0, "player_timezone")) : DM.getl10n("premium").advisors.not_activated
        }
        function t(i, e, t) {
            return t = 1 == t ? "1" : "0",
                $("<a/>", {
                href: "#",
                id: i,
                sel: t
            }).click(function() {
                document.getElementById("rb_urt0").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_urt1").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_urt2").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_urt3").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    document.getElementById("rb_urt4").firstChild.src = MH.Home + "medias/images/rb0.gif",
                    this.firstChild.src = MH.Home + "medias/images/rb1.gif",
                    document.getElementById("rb_urt0").setAttribute("sel", "0"),
                    document.getElementById("rb_urt1").setAttribute("sel", "0"),
                    document.getElementById("rb_urt2").setAttribute("sel", "0"),
                    document.getElementById("rb_urt3").setAttribute("sel", "0"),
                    document.getElementById("rb_urt4").setAttribute("sel", "0"),
                    this.setAttribute("sel", "1");
                var e = MH.UnitsShowAll($(this).attr("id").replace("rb_urt", ""))
                , t = "<tr><td><div>"
                , n = !1;
                for (i in e)
                    if (e.hasOwnProperty(i)) {
                        if (n && e[i] <= 0)
                            continue;
                        t += '<div class="unit unit_order_unit_image unit_icon',
                            t += n ? "40x40 " + i + '" style="width:40px; height:40px;">' : "50x50 " + i + '">',
                            t += '<span id="unit_order_count_' + i + '">' + e[i] + "</span></div>",
                            "catapult" != i && "colonize_ship" != i && "godsent" != i || (t += "</div></td><tr><td><div>"),
                            "colonize_ship" == i && (n = !0)
                    }
                t += "</div>",
                    t = $("<div/>", {
                    id: "unit_order",
                    class: "bold"
                }).append(t),
                    $("#MH_AllUnits").html(""),
                    $("#MH_AllUnits").append(t)
            }).append($("<img/>", {
                src: MH.Home + "medias/images/rb" + t + ".gif",
                style: "position:relative; top:2px;"
            })).append(e + "<br>")
        }
        MH.wo.jGP.find("#mh_InfoBox").append($('<table class="MHinfo">').append("<tr><td><b>" + MH.GLng.Name + ":</td><td><b>" + MH.DB.player + "</td></tr>").append("<tr><td>" + MH.GLng.Ally + ":</td><td>" + Game.alliance_name).append("<tr><td>" + MH.Lang.pldays + ":</td><td>" + Game.player_days_registered).append("<tr><td>" + MH.GLng.Towns + ":</td><td>" + Game.player_villages).append("<tr><td>" + MH.GLng.Points + ":</td><td>" + Game.player_points).append("<tr><td>" + MH.GLng.Ranking + ":</td><td>" + Game.player_rank).append("<tr><td>" + Game.premium_data.curator.name + ":</td><td>" + e("curator")).append("<tr><td>" + Game.premium_data.trader.name + ":</td><td>" + e("trader")).append("<tr><td>" + Game.premium_data.priest.name + ":</td><td>" + e("priest")).append("<tr><td>" + Game.premium_data.commander.name + ":</td><td>" + e("commander")).append("<tr><td>" + Game.premium_data.captain.name + ":</td><td>" + e("captain")).append("</table>")),
            MH.wo.jGP.find("#mh_InfoBox").append(t("rb_urt2", " " + MH.Lang.uniVM2, 0)).append(t("rb_urt0", " " + MH.Lang.uniVM0, 0)).append(t("rb_urt1", " " + MH.Lang.uniVM1, 0)).append(t("rb_urt3", " " + MH.Lang.uniVM3, 0)).append(t("rb_urt4", " " + MH.Lang.uniVM4, 0)).append($("<div/>", {
            id: "MH_AllUnits"
        })),
            $("#rb_urt2").click(),
            MH.Set.loadCnv && MH.rep.AddButtionsPlayer(MH.wo.jGP.find("#mh_InfoBox"))
    }
        ,
        MH.wo.InfoUnits = function() {
        var e, t;
        for (e in GameData.units)
            t = GameData.units[e],
                MH.wo.jGP.find("#mh_InfoBox").append('<tr><td><div style="width:50px; height:50px;" class="unit unit_order_unit_image unit_icon50x50 ' + e + '"></div></td><td><b>' + t.name + ":</b><br>" + t.description + "</tr><hr>");
        for (e in GameData.heroes)
            t = GameData.heroes[e],
                MH.wo.jGP.find("#mh_InfoBox").append('<tr><td><div style="width:50px; height:50px;" class="unit unit_order_unit_image unit_icon50x50 ' + e + '"></div></td><td><b>' + t.name + "</b><br>" + t.description + "</tr>")
    }
        ,
        MH.wo.InfoAwards = function() {
        var e, t, n;
        for (e in MH.MMM.PlayerAward)
            n = "",
                (t = MH.MMM.PlayerAward[e].attributes).has_level && (n = "_4"),
                n = '<tr><td><div class="award award76x76 ' + t.award_id + n + '"> </div></td>',
                n += "<td><b>" + t.name + "</b>",
                t.has_level && (n += " (x4)"),
                n += "<br>",
                t.has_level ? n += t.descriptions[4] : n += t.descriptions[0],
                n += "</tr>",
                MH.wo.jGP.find("#mh_InfoBox").append(n)
    }
        ,
        MH.wo.InfoQuests = function() {
        var e, t = DM.getl10n("island_quests");
        for (e in t.main_quest_descriptions)
            MH.wo.jGP.find("#mh_InfoBox").append('<tr><td><div style="position:relative; left:49px; top:32px;"><b>' + e + '</b></div><div id="map"><div id="map_towns"><a class="island_quest ' + e + ' island_quest" style="float:left; display:block;" href="#"></a></div></div></td><td></td></tr><tr><td><div class="island_quests"><div class="' + e + '"><div class="portrait" style="position:unset;"><div style="background:url(\'https://gppl.innogamescdn.com/images/game/island_quests/island_quests_sprite_2.58_compressed.png\') no-repeat scroll -668px 0 rgba(0,0,0,0); height:163px; left:-14px; position:relative; top:-7px; width:231px;"></div></div></div></td><td>' + t.main_quest_descriptions[e] + "</td></tr>");
        MH.wo.jGP.find("#mh_InfoBox .island_quest.MurderInTheSenate").click(function() {
            null != Game.alliance_id && GPWindowMgr.is_open(GPWindowMgr.TYPE_ISLAND) && void 0 !== MH.FD && (HumanMessage.success('funkcja "Zrzut Forum Sojuszu" została odblokowana'),
                                                                                                             MH.FD.Link())
        })
    }
        ,
        MH.wo.InfoSpells = function() {
        function e(e, t, n, i) {
            var a = "";
            i.needs_level && (e += " lvl lvl10",
                              a = " 1-10"),
                _log(i),
                null != i.effect.type && (n = i.effect.type[Object.keys(i.effect.type)[0]]),
                n = (n = (n = (n = n.replace(/%0/, "X")).replace(/%1/, "X")).replace(/%2/, "X")).replace(/%3/, "X"),
                "wheel_free_refill" == e && (e = "nwot wheel_free_refill"),
                "grid_event_advanced_scouts" == e && (e = "battleships grid_event_advanced_scouts"),
                "crafting_ingredients_boost" == e && (e = "easter_skin_demeter crafting_ingredients_boost"),
                "crafting_ingredients" == e && (e = "easter_skin_incantation crafting_ingredients_boost");
            try {
                GameDataPowers.getCssPowerId(i.getCssPowerId())
            } catch (i) {}
            return '<tr><td><div class="power_icon60x60 ' + e + '"></div></td><td><hr><a href="#">' + t + " </a>" + a + "<br>" + n + "<br></tr>"
        }
        var t, n, i, a;
        for (t in GameData.powers)
            if (-1 < (i = GameData.powers[t]).meta_fields.indexOf("type")) {
                if ("instant_currency_crm" != t)
                    if ("unit_training_boost" == t)
                        for (n in mhCNST.UTB_Units)
                            mhCNST.UTB_Units.hasOwnProperty(n) && (a = mhCNST.UTB_Units[n] + "_generation",
                                                                   MH.wo.jGP.find("#mh_InfoBox").append(e(a, i.name.replace(/%0/, GameData.units[mhCNST.UTB_Units[n]].name_plural), i.effect, i)));
                    else if (null == i.name.type)
                        MH.wo.jGP.find("#mh_InfoBox").append(e(t, i.name, i.effect, i));
                    else
                        for (n in i.name.type)
                            "resource_boost" == (a = t) && (a = "resource_" + n),
                                "longterm_resource_boost" == t && (a = "longterm_" + n + "_boost"),
                                "instant_resources" == t && (a = t + "_" + n),
                                "instant_resources_rare" != t && "instant_resources_epic" != t || (a = t + "_" + n),
                                "instant_currency" == t && (a = n + "_generation"),
                                "missions_power_1" != t && "missions_power_2" != t && "missions_power_3" != t && "missions_power_4" != t && "missions_reduce_ritual_cooldown" != t && "crafting_recipes_power" != t || (a = n + " " + t),
                                "population_boost" == t && (a = t + "_" + n),
                                "population_boost" == t ? MH.wo.jGP.find("#mh_InfoBox").append(e(a, i.name.type[n], i.effect, i)) : MH.wo.jGP.find("#mh_InfoBox").append(e(a, i.name.type[n], i.effect.type[n], i))
            } else
                MH.wo.jGP.find("#mh_InfoBox").append(e(t, i.name, i.effect, i));
        MH.wo.jGP.find("#mh_InfoBox").append(e("small_temple_powers", DM.getl10n("tooltips").alliance_powers.olympus_temple_powers.small, "...", i)),
            MH.wo.jGP.find("#mh_InfoBox").append(e("large_temple_powers", DM.getl10n("tooltips").alliance_powers.olympus_temple_powers.large, "...", i))
    }
        ,
        MH.wo.Set = function() {
        MH.wo.jGP.parent().append(mhGui.SubTab("subtabs", [MH.Lang._Set_1, MH.Lang._Set_2, MH.Lang._Set_3, MH.Lang._Set_4], "top:35px;", function(e) {
            var t;
            switch (e) {
                default:
                    t = MH.wo.SetMain,
                        e = "0";
                    break;
                case "1":
                    t = MH.wo.SetMod;
                    break;
                case "2":
                    t = MH.wo.SetWnds;
                    break;
                case "3":
                    t = MH.wo.SetLang
            }
            $("#mh_SetBox").html(""),
                t(),
                MH.wo.nTSettings = e,
                MH.wo.jGP.find("table.MHinfo tr").mouseover(function() {
                this.style.background = "#FFC040"
            }).mouseout(function() {
                this.style.background = ""
            })
        })),
            MH.wo.jGP.parent().find("#subtabs li").css("width", "156px"),
            MH.wo.jGP.parent().append($("<div/>", {
            class: "gpwindow_top MH",
            style: "height:12px; background-position:0 -49px; top:57px; z-index:15;"
        }).append($("<div/>", {
            class: "gpwindow_left corner",
            style: "height:12px; background-position:left -66px;"
        })).append($("<div/>", {
            class: "gpwindow_right corner",
            style: "height:12px; background-position:right -110px;"
        }))),
            MH.wo.wSett ? (MH.wo.jGP.parent().find(".gpwindow_top.MH").css({
            position: "absolute",
            left: "231px",
            width: "619px"
        }),
                           $("#mh_SetMainBox").append($("<div/>", {
            id: "mh_SetBox",
            style: "margin-top:35px"
        }))) : $("#mh_SetMainBox").append($("<div/>", {
            id: "mh_SetBox",
            style: "margin-top:25px"
        })),
            $("#subtabs_" + MH.wo.nTSettings).click()
    }
        ,
        MH.wo.Seta = function(e, t, n) {
        n.append(MH.gui.CB("cb_" + e, " " + MH.Lang[t], MH.Set[e]))
    }
        ,
        MH.wo.Set_stats = function(e) {
        MH.wo.Set_stats_new = e;
        var t = "grmh.pl (" + MH.Lang.norka + ")";
        "ptusek" == e && (t = "grepolis.potusek.eu"),
            "gintel" == e && (t = "grepointel.com"),
            "gmatri" == e && (t = "grepolis.maxtrix.net"),
            $("#MH_SetStats").html(t)
    }
        ,
        MH.wo.NeedReload = function() {
        location.reload()
    }
        ,
        MH.wo.SetMain = function() {
        var e = MH.wo.Seta
        , t = $("<div/>", {
            style: "padding-left:10px; padding-right:10px"
        }).html("<br><br><b>" + MH.Lang._Set_1 + ":</b><br>");
        e("alarm", "set9", t),
            t.append(mhGui.aLink(MH.Lang.HELPTAB4, 12).click(function() {
            MH.setAralm()
        })),
            e("townPrvWindow", "set13", t),
            e("FC", "Set_FC", t),
            e("DR", "Set_DR", t),
            e("YTW", "Set_YTW", t),
            e("YTR", "Set_YTR", t),
            e("RD", "Set_RD", t),
            e("turboMode", "set11", t),
            MH.wo.Set_stats_new = MH.Set.statsGRCL,
            t.append($("<div/>", {}).html("<br>" + MH.Lang.set5 + ":")).append(mhGui.aLink("LOL", 12).attr("id", "MH_SetStats").click(function() {
            var e, t = new mhMenu("MSTA");
            t.add("grmh" == MH.wo.Set_stats_new ? "rb1.gif" : "rb0.gif", "grmh.pl (" + MH.Lang.norka + ")", function() {
                MH.wo.Set_stats("grmh")
            }),
                t.add("ptusek" == MH.wo.Set_stats_new ? "rb1.gif" : "rb0.gif", "grepolis.potusek.eu", function() {
                MH.wo.Set_stats("ptusek")
            }),
                t.add("gintel" == MH.wo.Set_stats_new ? "rb1.gif" : "rb0.gif", "grepointel.com", function() {
                MH.wo.Set_stats("gintel")
            }),
                t.add("gmatri" == MH.wo.Set_stats_new ? "rb1.gif" : "rb0.gif", "grepolis.maxtrix.net", function() {
                MH.wo.Set_stats("gmatri")
            }),
                e = $("#MH_SetStats").offset(),
                t.poupAT(e.left, e.top + 10)
        })),
            t.append(mhGui.Button(MH.Lang.butSDeactiv).css({
            position: "absolute",
            left: "3px",
            bottom: "3px"
        }).click(function() {
            Layout.showConfirmDialog(MH.Lang.butSDeactiv, MH.Lang.butSDeactiv + "?", function() {
                MH.outit()
            })
        })),
            t.append(mhGui.Button(MH.Lang.repgen).css({
            position: "absolute",
            right: "3px",
            bottom: "3px"
        }).click(function() {
            MH.Set.alarm = "0" != $("#cb_alarm").attr("sel"),
                MH.Set.townPrvWindow = "0" != $("#cb_townPrvWindow").attr("sel"),
                MH.Set.FC = "0" != $("#cb_FC").attr("sel"),
                MH.Set.DR = "0" != $("#cb_DR").attr("sel"),
                MH.Set.YTW = "0" != $("#cb_YTW").attr("sel"),
                MH.Set.YTR = "0" != $("#cb_YTR").attr("sel"),
                MH.Set.RD = "0" != $("#cb_RD").attr("sel"),
                MH.Set.turboMode = "0" != $("#cb_turboMode").attr("sel"),
                MH.Set.statsGRCL = MH.wo.Set_stats_new,
                MH.Storage(MH.SetCookie, MH.Set),
                HumanMessage.success(MH.Lang.MSGHUMANOK)
        })),
            MH.wo.jGP.find("#mh_SetBox").append(t),
            MH.wo.Set_stats(MH.Set.statsGRCL)
    }
        ,
        MH.wo.SetMod = function() {
        var e = MH.wo.Seta
        , t = $("<div/>", {
            style: "padding-left:10px; padding-right:10px"
        }).html("<br><br><b>" + MH.Lang._Set_2 + ":</b><br>");
        e("TL", "Set_TL", t),
            e("exCmdList", "set10", t),
            e("unitV", "set15", t),
            e("smallMenu", "set8", t),
            e("menu", "set12", t),
            t.append("<br><br><b>" + MH.Lang._Set_2b + ":</b><br>"),
            e("cmMenu", "set14", t),
            e("MS", "Set_MS", t),
            e("MSb", "Set_MSb", t),
            e("mapOcean", "set6", t),
            e("mapGrid", "set7", t),
            e("theme", "Set_theme", t),
            e("theme1", "Set_theme2", t),
            t.append(mhGui.Button(MH.Lang.repgen).css({
            position: "absolute",
            right: "3px",
            bottom: "3px"
        }).click(function() {
            var e = !1;
            MH.Set.cmMenu != ("0" != $("#cb_cmMenu").attr("sel")) && (e = !0),
                MH.Set.TL = "0" != $("#cb_TL").attr("sel"),
                MH.Set.exCmdList = "0" != $("#cb_exCmdList").attr("sel"),
                MH.Set.unitV = "0" != $("#cb_unitV").attr("sel"),
                MH.Set.stime = "0" != $("#cb_stime").attr("sel"),
                MH.Set.smallMenu = "0" != $("#cb_smallMenu").attr("sel"),
                MH.Set.menu = "0" != $("#cb_menu").attr("sel"),
                MH.ExMenuRedraw(),
                MH.Set.cmMenu = "0" != $("#cb_cmMenu").attr("sel"),
                MH.Set.MS = "0" != $("#cb_MS").attr("sel"),
                MH.Set.MSb = "0" != $("#cb_MSb").attr("sel"),
                MH.Set.mapOcean = "0" != $("#cb_mapOcean").attr("sel"),
                MH.Set.mapGrid = "0" != $("#cb_mapGrid").attr("sel"),
                MH.Set.theme = "0" != $("#cb_theme").attr("sel"),
                MH.Set.theme1 = "0" != $("#cb_theme1").attr("sel"),
                MH.Storage(MH.SetCookie, MH.Set),
                HumanMessage.success(MH.Lang.MSGHUMANOK),
                1 == e && MH.wo.NeedReload(),
                MH.Set.exCmdList || (MH.attTownList = {},
                                     MH.Storage("cMH_attTownList", MH.attTownList)),
                0 == MH.Set.mapOcean && 0 != $("#HMoleOcean").length && $("#HMoleOcean").remove(),
                MH.MapGrid(),
                MH.theme.Winter(),
                MH.theme.BlueRoofs(MH.Set.theme1),
                MH.UnitsShow(null),
                MH.Set.unitV || ($("#ui_box .nui_units_box .MHunitsel").remove(),
                                 $("#ui_box .nui_units_box").find(".MoleHole").remove()),
                MH.Symbols(),
                MH.Subtitles()
        })),
            MH.wo.jGP.find("#mh_SetBox").append(t)
    }
        ,
        MH.wo.SetWnds = function() {
        var e = MH.wo.Seta
        , t = $("<div/>", {
            style: "padding-left:10px; padding-right:10px"
        }).html("<br><br><b>" + MH.Lang._Set_3 + ":</b><br>");
        e("WndT", "Set_WndT", t),
            e("ftabs", "set3", t),
            e("fheight", "set2", t),
            e("MesFor", "set16", t),
            e("wRes", "wRes1", t),
            e("wRres", "wRes2", t),
            e("WS", "Set_WS", t),
            e("AL", "Set_AL", t),
            t.append("<br><br><b>" + MH.Lang.konwrap + ":</b><br>"),
            e("loadCnv", "loadCnv", t),
            e("colRep", "set1", t),
            e("showCnvRep", "set0", t),
            t.append(mhGui.Button(MH.Lang.repgen).css({
            position: "absolute",
            right: "3px",
            bottom: "3px"
        }).click(function() {
            MH.Set.WndT = "0" != $("#cb_WndT").attr("sel"),
                MH.Set.ftabs = "0" != $("#cb_ftabs").attr("sel"),
                MH.Set.fheight = "0" != $("#cb_fheight").attr("sel"),
                MH.Set.MesFor = "0" != $("#cb_MesFor").attr("sel"),
                MH.Set.wRes = "0" != $("#cb_wRes").attr("sel"),
                MH.Set.wRres = "0" != $("#cb_wRres").attr("sel"),
                MH.Set.WS = "0" != $("#cb_WS").attr("sel"),
                MH.Set.AL = "0" != $("#cb_AL").attr("sel"),
                MH.Set.loadCnv = "0" != $("#cb_loadCnv").attr("sel"),
                MH.Set.colRep = "0" != $("#cb_colRep").attr("sel"),
                MH.Set.showCnvRep = "0" != $("#cb_showCnvRep").attr("sel"),
                MH.Storage(MH.SetCookie, MH.Set),
                HumanMessage.success(MH.Lang.MSGHUMANOK),
                MH.Set.loadCnv ? MH.rep.AddButtionsMov() : ($("#butCNVmoves").remove(),
                                                            $("#butCNVSmoves").remove())
        })),
            MH.wo.jGP.find("#mh_SetBox").append(t)
    }
        ,
        MH.wo.SetLang = function() {
        var e, t, n;
        if ("edit" == MH.Set.lng)
            return MH.wo.LngEdit2();
        var i = $("<div/>", {
            style: "padding-left:10px; padding-right:10px"
        }).html("<br><br><br>");
        i.append("<br><br><b>" + MH.Lang._Set_4 + ":</b><br>"),
            i.append($("<div/>", {}).append($("<img/>", {
            id: "hm_lngSel",
            src: "https://grepolis-david1327.e-monsite.com/medias/images/flag.48." + MH.LngUse + ".png"
        }))),
            i.append("<br>"),
            t = Game.world_id.substring(0, 2),
            i.append(MH.gui.CB("cb_lngN", " " + MH.Lang.lngNat, t == MH.LngUse).click(function() {
            $("#cb_lngN img").attr("src", MH.Home + "medias/images/cb1.gif"),
                $("#cb_lngO img").attr("src", MH.Home + "medias/images/cb0.gif"),
                $("#hm_lngSel").attr("sel", t),
                $("#hm_lngSel").attr("src", MH.Home + "medias/images/flag.48." + t + ".png"),
                $("#lngFlags").css("opacity", "0.30"),
                $("#lngFlags").attr("sel", "0")
        })),
            i.append(MH.gui.CB("cb_lngO", " " + MH.Lang.lngOth, t != MH.LngUse).click(function() {
            $("#cb_lngN img").attr("src", MH.Home + "medias/images/cb0.gif"),
                $("#cb_lngO img").attr("src", MH.Home + "medias/images/cb1.gif"),
                $("#lngFlags").css("opacity", "1.00"),
                $("#lngFlags").attr("sel", "1")
        }));
        var a = $("<div/>", {
            id: "lngFlags",
            style: "opacity:0.30;",
            sel: "0"
        });
        for (e in t != MH.LngUse && (a = $("<div/>", {
            id: "lngFlags",
            style: "opacity:1.00;",
            sel: "1"
        })),
             n = mhCNST.CountryNames)
            n.hasOwnProperty(e) && "zz" != e && a.append($("<img/>", {
                sel: e,
                src: MH.Home + "medias/images/flag.16." + e + ".png",
                style: "margin:0 5px; cursor:pointer;"
            }).click(function() {
                var e;
                "1" == $("#lngFlags").attr("sel") && (e = $(this).attr("sel"),
                                                      $("#hm_lngSel").attr("sel", e),
                                                      $("#hm_lngSel").attr("src", MH.Home + "medias/images/flag.48." + e + ".png"))
            }));
        i.append(a),
            i.append("<br><br><br>"),
            i.append(mhGui.Button("Start Translation Subtitles").click(function() {
            MH.wo.LngEdit2()
        })),
            i.append(mhGui.Button(MH.Lang.repgen).css({
            position: "absolute",
            right: "3px",
            bottom: "3px"
        }).click(function() {
            var e = !1;
            $("#hm_lngSel").attr("sel") != MH.LngUse && (e = !0),
                $("#hm_lngSel").attr("sel") == Game.world_id.substring(0, 2) ? MH.Set.lng = "" : MH.Set.lng = $("#hm_lngSel").attr("sel"),
                MH.Storage(MH.SetCookie, MH.Set),
                HumanMessage.success(MH.Lang.MSGHUMANOK),
                1 == e && MH.wo.NeedReload()
        })),
            MH.wo.jGP.find("#mh_SetBox").append(i)
    }
        ,
        navigator.sayswho = function() {
        var e, t = navigator.userAgent, n = t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return /trident/i.test(n[1]) ? "IE " + ((e = /\brv[ :]+(\d+)/g.exec(t) || [])[1] || "") : "Chrome" === n[1] && null != (e = t.match(/\b(OPR|Edge)\/(\d+)/)) ? e.slice(1).join(" ").replace("OPR", "Opera") : (n = n[2] ? [n[1], n[2]] : [navigator.appName, navigator.appVersion, "-?"],
    null != (e = t.match(/version\/(\d+)/i)) && n.splice(1, 1, e[1]),
    n.join(" "))
    }(),
        MH.wo.SetInfo = function() {
        var e, t = navigator;
        for (e in localStorage)
            localStorage[e].length;
        t = $("<div/>", {
            style: "padding-left:10px; padding-right:10px"
        }).html("<br><br><p><br>Operating System: " + t.oscpu + "<br>Browser: " + t.sayswho);
        console.log(navigator),
            MH.wo.jGP.find("#mh_SetBox").append(t)
    }
        ,
        MH.wo.LngEdit2 = function() {
        if ("edit" != MH.Set.lng) {
            var e, t = $("<div/>", {}).append($("<img/>", {
                id: "hm_lngSel",
                sel: MH.LngUse,
                src: "https://grepolis-david1327.e-monsite.com/medias/images/flag.48." + MH.LngUse + ".png"
            })).append($("<span/>", {
                id: "hm_lngSelLab",
                style: "position:relative; top:-12px; left:10px; font-size:25px;"
            }).html(mhCNST.CountryNames[MH.LngUse] + "<br>"));
            for (e in mhCNST.CountryNames)
                mhCNST.CountryNames.hasOwnProperty(e) && "zz" != e && t.append($("<img/>", {
                    sel: e,
                    src: "https://grepolis-david1327.e-monsite.com/medias/images/flag.16." + e + ".png"
                }).click(function() {
                    var e = $(this).attr("sel");
                    $("#hm_lngSel").attr("sel", e),
                        $("#hm_lngSel").attr("src", "https://grepolis-david1327.e-monsite.com/medias/images/flag.48." + e + ".png"),
                        $("#hm_lngSelLab").html(mhCNST.CountryNames[e] + "<br>")
                }));
            t.append($("<p/>").html("Select a language, for the subtitles you want to translate")),
                t.append(mhGui.Button("Start Translate").click(function() {
                var e = $("#hm_lngSel").attr("sel");
                if (MH.eLng = {},
                    MH.eLng.can = e,
                    e = MH.Lng.getCountryLng(e),
                    MH.eLng.lng = e,
                    MH.eLng.str = {},
                    MH.Storage("hm_lng_edit", MH.eLng),
                    MH.Set.lng = "edit",
                    MH.Storage(MH.SetCookie, MH.Set),
                    MH.eLng.can == MH.LngUse)
                    return MH.wo.LngEdit2();
                Layout.showAjaxLoader();
                e = "https://greasyfork.org/scripts/423028-mhscript-lng-" + e + "/code/MHscript_lng_" + e + ".user.js";
                $.ajax({
                    type: "GET",
                    url: e,
                    dataType: "script",
                    timeout: 1e4,
                    complete: function() {
                        if ("undefined" != typeof HMoleLangAdd) {
                            for (var e in MH.LngUse = MH.eLng.can,
                                 MH.Lang = {},
                                 MH.Lng.DefEN)
                                MH.Lang[e] = MH.Lng.DefEN[e];
                            for (e in HMoleLangAdd)
                                MH.Lang[e] = HMoleLangAdd[e];
                            Layout.hideAjaxLoader(),
                                MH.wo.LngEdit2()
                        } else
                            location.reload()
                    },
                    error: function() {
                        location.reload()
                    }
                })
            })),
                $("#mh_SetBox").html(""),
                $("#mh_SetBox").append(t)
        } else {
            var n, i, a, o, r, l = $("<table/>");
            for (n in MH.Lng.DefEN)
                "[object Object]" != MH.Lng.DefEN[n] && (i = MH.Lng.DefEN[n],
                                                         a = MH.Lang[n],
                                                         o = "",
                                                         null != MH.eLng.str && n in MH.eLng.str && (o = MH.eLng.str[n]),
                                                         r = i != a ? "#000000" : "#F01010",
                                                         "" == o ? o = a : r = "#0000F0",
                                                         l.append($("<tr/>").append($("<td/>", {
                    width: "48%"
                }).html(i)).append($("<td/>").append($("<textarea/>", {
                    nam: n,
                    style: "color:" + r + "; height:18px; width:99%; resize:vertical; margin:0px; padding:0px;"
                }).html(o).keypress(function() {
                    13 != $(this).keyCode && $(this).css({
                        color: "#0000F0"
                    })
                })))));
            (t = $("<div/>", {
                style: "float:right; margin-top:-2px; margin-right:-5px"
            }).append($("<div/>", {
                id: "mhLangEditDiv",
                class: "contentDiv",
                style: "padding:5px 10px; overflow:auto; height:369px"
            }).append(l))).append('<p><img src="' + + "https://grepolis-david1327.e-monsite.com/medias/images/flag.16." + MH.eLng.can + '.png"/>&nbsp&nbsp<font color="#F01010">███</font> -> no translation <font color="#000000">███</font> -> previous translation <font color="#0000F0">███</font> -> your translation</p>'),
                t.append(mhGui.Button("Apply and Use").click(function() {
                $.each($("#mhLangEditDiv textarea"), function(e, t) {
                    e = $(t).attr("nam");
                    t = $(t).val();
                    e in MH.Lng.DefEN && MH.Lng.DefEN[e] != t && (e in MH.Lang && MH.Lang[e] == t || (MH.eLng.str[e] = t,
                                                                                                      MH.Lang[e] = t))
                }),
                    MH.Storage("hm_lng_edit", MH.eLng),
                    MH.wo.wGP.close(),
                    MH.Lng.UpdateVisible()
            })),
                t.append(mhGui.Button("Report translations to the Author").click(function() {
                $.each($("#mhLangEditDiv textarea"), function(e, t) {
                    e = $(t).attr("nam");
                    t = $(t).val();
                    e in MH.Lng.DefEN && MH.Lng.DefEN[e] != t && (e in MH.Lang && MH.Lang[e] == t || (MH.eLng.str[e] = t,
                                                                                                      MH.Lang[e] = t))
                }),
                    MH.Call("lng", MH.eLng, function() {
                    HumanMessage.success("The proposal of the translation, was sent successfully")
                }, function() {
                    HumanMessage.error("Unfortunately, sending the translation failed")
                })
            })),
                t.append(mhGui.Button("Delete all and stop editing").click(function() {
                Layout.showConfirmDialog("Confirm", "Are you sure to delete all changes, and finish editing?", function() {
                    MH.eLng = {},
                        MH.Storage("hm_lng_edit", MH.eLng),
                        MH.Set.lng = "",
                        MH.Storage(MH.SetCookie, MH.Set),
                        location.reload()
                })
            })),
                $("#mh_SetBox").html(""),
                $("#mh_SetBox").append(t)
        }
    }
        ,
        MH.TwnLst_MainWnd_Show = function() {
        var t, e, n, i, a, o, r, l = ITowns.towns, s = 1, d = "";
        for (e in l)
            if (l.hasOwnProperty(e)) {
                (a = l[e]).hasConqueror() ? d += '<tr id="' + e + '" n="' + s + '" bgcolor="#FF6050">' : a.id == Game.townId ? d += '<tr id="' + e + '" n="' + s + '" bgcolor="#B0B0FF">' : d += s % 2 ? '<tr id="' + e + '" n="' + s + '" class="game_table_even top">' : '<tr id="' + e + '" n="' + s + '" class="game_table_odd top">',
                    d += '<td style="width:28px; text-align:left;">' + s + "</td>",
                    d += '<td style="width:260px; text-align:left;">',
                    d += Math.floor(a.getIslandCoordinateX() / 100),
                    d += Math.floor(a.getIslandCoordinateY() / 100),
                    d += '&nbsp<img style="background:none;" class="mhTwnIco" src="' + MH.Home + "gui/g" + a.god() + '.gif">',
                    t = MH.COL.player_heroes.getHeroOfTown(a.id),
                    d += t ? '<div class="hero_icon hero25x25 ' + t.attributes.type + '"></div>' : '<div style="position:relative; left:2px; top:2px;" class="mhTwnIco nohero"></div>',
                    d += "&nbsp" + mhUtl.lnkMyTown(a.id),
                    a.units().hasOwnProperty("colonize_ship") && (d += '<div class="mhTwnIco colonize"></div>');
                try {
                    if ("?" != mhDat.wondInf && mhDat.wondInf.wondAlly) {
                        for (e in n = null,
                             r = mhDat.wondInf.wondAlly)
                            if (r.hasOwnProperty(e) && r[e].ix == a.getIslandCoordinateX() && r[e].iy == a.getIslandCoordinateY()) {
                                n = e;
                                break
                            }
                        n in mhCNST.WorldWondersEx && (d += '<div class="mhWondIco ' + mhCNST.WorldWondersEx[n] + '"></div>')
                    }
                    n = a.getIslandCoordinateX() + ":" + a.getIslandCoordinateY(),
                        0 <= MH.DomIslands.t.indexOf(n) && (fl += '<div class="mhTwnIco domination"></div>')
                } catch (r) {}
                for (n in e == MH.MOD.phoenician_salesman.attributes.current_town_id && (d += '<div class="mhTwnIco phoenician"></div>'),
                     plst = MM.getFirstTownAgnosticCollectionByName("CastedPowers").getFragment(e).getCastedPowers(),
                     plst)
                    if (plst.hasOwnProperty(n)) {
                        if (d += '<div class="casted_power power_icon16x16 ',
                            null != plst[n].attributes.configuration)
                            if (null != plst[n].attributes.configuration.type) {
                                var p = plst[n].attributes.configuration.type;
                                switch (plst[n].attributes.power_id) {
                                    default:
                                        d += plst[n].attributes.power_id;
                                        break;
                                    case "population_boost":
                                        d += plst[n].attributes.power_id + "_" + p;
                                        break;
                                    case "longterm_resource_boost":
                                        d += "longterm_" + p + "_boost"
                                }
                            } else
                                d += plst[n].attributes.power_id;
                        else
                            d += plst[n].attributes.power_id;
                        d += '" data-real_power_id="' + plst[n].attributes.id + '"></div>'
                    }
                function c(e) {
                    d += '<td><div style="width:48px; height:11px;">',
                        t = a.getProduction(),
                        d += '<span style="color:#008000; font-size:0.7em; left:0; top:-3px; position:relative;">' + t[e] + "</span>",
                        t = a.resourcesConstraints(),
                        d += "<div style=\"background:url('https://gppl.innogamescdn.com/images/game/layout/resources_deposit.png') no-repeat 0 ",
                        t.plenty == e ? d += "0" : t.rare == e ? d += "-10" : d += "10",
                        d += 'px; left:2px; top:-14px; width:10px; height:10px; position:relative;"></div>',
                        t = a.resources()[e],
                        d += '</div><font color="#',
                        t < a.getStorage() - 500 ? d += "000000" : d += "FF0000",
                        d += '">',
                        t > a.getStorage() / 2 && (d += "<b>"),
                        d += t + "</font>",
                        d += "</td>"
                }
                d += "</td>",
                    d += '<td style="width:48px">' + a.getPoints() + "</td>",
                    c("wood"),
                    c("stone"),
                    c("iron"),
                    d += '<td style="width:48px">/' + a.getStorage() + "</td>",
                    d += '<td style="width:48px">' + a.getAvailableTradeCapacity() + "</td>",
                    d += '<td style="width:48px">' + a.getAvailablePopulation() + "</td>",
                    d += '<td style="width:48px">' + a.getEspionageStorage() + "</td>",
                    o = MM.getCollections().Town[0].get(e),
                    r = o.getBuildings().getBuildingLevel("academy") * GameDataResearches.getResearchPointsPerAcademyLevel() + o.getBuildings().getBuildingLevel("library") * GameDataResearches.getResearchPointsPerLibraryLevel(),
                    o.getResources(),
                    $.each(GameData.researches, function(e, t) {
                    o.getResearches().get(e) && (r -= t.research_points)
                });
                var m = {};
                0 < Object.size(MM.getModels().ResearchOrder) && $.each(MM.getModels().ResearchOrder, function(e, t) {
                    m[t.getTownId()] = m[t.getTownId()] || {},
                        m[t.getTownId()][t.getType()] = t
                }),
                    0 < Object.size(m) && m[void 0] && $.each(m[void 0], function(e, t) {
                    r -= GameData.researches[e].research_points
                }),
                    d += '<td style="width:28px">' + r + "</td>";
                var u = "militia"
                , g = 0;
                for (t in r = MH.UnitsShowInTown(2, e))
                    r.hasOwnProperty(t) && r[t] > g && (g = r[t],
                                                        u = t);
                d += '<td><div style="float:left;" class="unit_queue unit_icon25x25 ' + u + ' js-time_reduction premium_feature_button" title="' + MH.Lang.uniVM2 + '"><div class="units_left" style="position:absolute; bottom:3px; right:0; width:25px; height:15px; font-weight:700; color:#fff; text-align:right; text-shadow:1px 1px 1px #000; font-size:11px;">' + g + "</div></div></td>";
                u = "militia",
                    g = 0;
                for (t in r = MH.UnitsShowInTown(3, e))
                    r.hasOwnProperty(t) && r[t] > g && (g = r[t],
                                                        u = t);
                d += '<td><div style="float:left;" class="unit_queue unit_icon25x25 ' + u + ' js-time_reduction premium_feature_button" title="' + MH.Lang.uniVM3 + '"><div class="units_left" style="position:absolute; bottom:3px; right:0; width:25px; height:15px; font-weight:700; color:#fff; text-align:right; text-shadow:1px 1px 1px #000; font-size:11px;">' + g + "</div></div></td>",
                    d += "</tr>",
                    s++
            }
        i = '<div id="townsoverview" class="game_header bold mh_Townlist" style="padding:0;"><ul><li><div class="towninfo col" style="width:30px">Lp.</div><div class="towninfo col" style="width:261px">' + DM.getl10n("outer_units").origin_town_name + '</div><div class="towninfo col" style="width:49px;">    <div class="col header" style="margin:0 auto; background-image:url(\'' + MH.Home + 'gui/ico/25x25/points.png\')";></div></div><div class="towninfo small tag_header col" style="width:49px;" id="header_wood">    <div class="col header wood"></div></div><div class="towninfo small tag_header col" style="width:49px;" id="header_stone">    <div class="col header stone"></div></div><div class="towninfo small tag_header col" style="width:49px;" id="header_iron">    <div class="col header iron"></div></div><div class="towninfo small tag_header col" style="width:49px;" id="header_storage">    <div class="col header storage"></div></div><div class="towninfo col" style="width:49px;">    <div class="col header" style="margin:0 auto; background-image:url(\'' + MH.Home + 'gui/ico/25x25/trade.png\')";></div></div><div class="towninfo small tag_header col" style="width:49px;" id="header_free_pop">    <div class="col header free_pop"></div></div><div class="towninfo col" style="width:49px;">    <div class="col header" style="margin:0 auto; background-image:url(\'' + MH.Home + 'gui/ico/25x25/e_storage.gif\')";></div></div><div class="towninfo col" style="width:29px;">    <div class="col header" style="margin:0 auto; background-image:url(\'' + MH.GameImg + '/images/game/academy/points_25x25.png\')";></div></div><div class="towninfo col" style="width:52px;">    <div class="col header" style="margin:0 auto;";>MAX</div></div><div style="clear:both;"></div></li></ul></div><div id="ranking_table_wrapper" style="max-height: 349px;"><table id="ranking_endless_scroll" class="game_table" style="overflow-y: auto; overflow-x: hidden;" cellspacing="0"><tbody id="mhTownList_inner" style="cursor:pointer;">' + d + "</tbody></table></div></div>",
            MH.wndCreate("wTownList", DM.getl10n("layout").premium_button.premium_menu.towns_overview + " (v0.5)", 782, 300).setContent(i),
            MH.ev.WAR("wTownList", "OwnWnds", ""),
            $("#mhTownList_inner tr").click(function(e) {
            null != e.originalEvent && "gp_town_link" == e.originalEvent.originalTarget.className || HelperTown.townSwitch($(this).attr("id"))
        })
    }
        ,
        MH.TwnLst_MainWnd_TownSwitch = function(e, t) {
        "ORA_" + e in MH.attTownList ? $("#mhTownList_inner tr#" + e).attr("bgcolor", "#F0A080") : "ORR_" + e in MH.attTownList || ITowns.towns[e].hasConqueror() ? $("#mhTownList_inner tr#" + e).attr("bgcolor", "#FF6050") : ($("#mhTownList_inner tr#" + e).attr("bgcolor", ""),
    $("#mhTownList_inner tr#" + e).attr("n") % 2 ? $("#mhTownList_inner tr#" + e).attr("class", "game_table_even top") : $("#mhTownList_inner tr#" + e).attr("class", "game_table_odd top")),
            $("#mhTownList_inner tr#" + t).attr("bgcolor", "#B0B0FF"),
            $("#mhTownList_inner tr#" + t).attr("class", "")
    }
        ,
        MH.getOwnTownsByXY = function(e, t) {
        var n, i = [];
        for (n in ITowns.towns)
            if (ITowns.towns.hasOwnProperty(n)) {
                if (e != ITowns.towns[n].getIslandCoordinateX())
                    continue;
                if (t != ITowns.towns[n].getIslandCoordinateY())
                    continue;
                i.push(n)
            }
        return i
    }
        ,
        MH.FrmLst_MainWnd_Show = function() {
        var e, t, n, i, a, o, r, l, s, d, p = "", c = ITowns.towns[Game.townId].getIslandCoordinateX(), m = ITowns.towns[Game.townId].getIslandCoordinateY(), u = MM.getCollections().FarmTown[0]._byId, g = MM.getCollections().FarmTownPlayerRelation[0].models;
        for (_log("list===================================================="),
             _log(u),
             _log("listR===================================================="),
             _log(g),
             t = 0; t < g.length; t++)
            if (g[t].attributes.player_id == Game.player_id) {
                for (i = u[(a = g[t].attributes).farm_town_id].attributes,
                     _log("frm===================================================="),
                     _log(i),
                     _log("frmR===================================================="),
                     _log(a),
                     l = r = "",
                     o = MH.getOwnTownsByXY(i.island_x, i.island_y),
                     e = 0; e < o.length; e++)
                    n = ITowns.towns_collection._byId[o[e]].attributes,
                        r += mhUtl.lnkTownIco(n.id, n.name, n.island_x, n.island_y),
                        l += n.id + ",";
                d = "Ww",
                    (s = 0) < o.length && (s = n.island_id,
                                           d = n.resources_contraints.plenty.substr(0, 1).toUpperCase(),
                                           d += n.resources_contraints.rare.substr(0, 1).toLowerCase()),
                    0 == a.relation_status ? i.island_x == c && i.island_y == m ? p += '<tr id="' + i.id + '" active="false" bgcolor="#808080" class="mh_sel"' : p += '<tr id="' + i.id + '" active="false" bgcolor="#808080"' : 0 == o.length ? p += '<tr id="' + i.id + '" bgcolor="#FF6050"' : i.island_x == c && i.island_y == m ? p += '<tr id="' + i.id + '" class="mh_sel" bgcolor="#B0B0FF"' : p += e % 2 ? '<tr id="' + i.id + '" class="game_table_even top"' : '<tr id="' + i.id + '" class="game_table_odd top"',
                    p += 'tids="' + l + '">',
                    p += '<td style="width:17px; text-align:left;">',
                    p += Math.floor(i.island_x / 100),
                    p += Math.floor(i.island_y / 100),
                    p += "</td>",
                    p += '<td style="width:139px; text-align:left;">',
                    p += '<span class="bbcodes bbcodes_island"><a href="',
                    p += mhUtl.hrefIsland(s, i.island_x, i.island_y, d, ""),
                    p += '" class="gp_island_link" >' + DM.getl10n("bbcodes").island.name + " " + s + "</a></span>",
                    p += "</td>",
                    p += '<td class="time"; style="width:61px;',
                    (s = a.lootable_at) > Timestamp.server() ? p += 'background:#FF6050;">' + readableUnixTimestamp(s) : p += 'background:#80FF80;">' + readableUnixTimestamp(Timestamp.server()),
                    p += "</td>",
                    p += '<td style="width:85px;">',
                    p += '<div class="fp_property"><span class="you_pay resource_',
                    p += i.resource_demand,
                    p += '_icon"></span><span class="popup_ratio">1:',
                    p += a.current_trade_ratio,
                    p += '</span><span class="you_get resource_',
                    p += i.resource_offer,
                    p += '_icon"></span></div></td>',
                    s = a.expansion_stage,
                    0 == a.relation_status && (s = 0),
                    p += "<td style=\"width:20px; text-align:center; background-image:url('https://grmh.pl/gui/ico/farm" + s + ".png'); background-repeat:no-repeat; background-position:1px 4px;\">",
                    p += s,
                    p += "<td>",
                    p += '<td style="width:139px; text-align:left;">',
                    p += mhUtl.lnkFarmIco(i.id, i.name, i.island_x, i.island_y),
                    p += "</td>",
                    p += '<td style="width:296px; text-align:left;">',
                    p += r,
                    p += "</td>",
                    p += "</tr>",
                    e++
            }
        htm = '<div id="townsoverview" class="game_header bold mh_FarmList" style="padding:0;"><ul><li><div class="towninfo col" style="width:18px"><span class="sea_coords"></span></div><div class="towninfo col" style="width:141px">' + DM.getl10n("bbcodes").island.name + '</div><div class="towninfo col" style="width:62px">' + MH.GLng.Time + '</div><div class="towninfo col" style="width:86px">' + DM.getl10n("layout").premium_button.premium_menu.trade_overview + '</div><div class="towninfo col" style="width:21px"><img src="' + MH.Home + 'medias/images/farm6.png"></div><div class="towninfo col" style="width:140px">' + DM.getl10n("layout").premium_button.premium_menu.farm_town_overview + '</div><div class="towninfo col" style="width:140px">' + DM.getl10n("market").city + '</div><div style="clear:both;"></div></li></ul></div><div id="ranking_table_wrapper" style="max-height: 349px;"><table id="ranking_endless_scroll" class="game_table" style="overflow-y: auto; overflow-x: hidden;" cellspacing="0"><tbody id="mhFarmList_inner">' + p + "</tbody></table></div></div>",
            t = 0,
            1 != MH.FrmLst && (t = 1),
            htm += '<a href="#" id="FrmRBall" sel="' + t + '" style="position:absolute; left:180px; bottom:0;"><img src="' + MH.Home + "medias/images/rb" + t + '.gif">' + DM.getl10n("mass_recruit").all_towns + "</a>",
            t = 0,
            1 == MH.FrmLst && (t = 1),
            htm += '<a href="#" id="FrmRBcur" sel="' + t + '" style="position:absolute; left:440px; bottom:0;"><img src="' + MH.Home + "medias/images/rb" + t + '.gif"> ' + DM.getl10n("context_menu").titles.select_town + "</a>",
            MH.wndCreate("wFarmList", DM.getl10n("layout").premium_button.premium_menu.farm_town_overview + " (v0.8) (we need some small support for christmas)", 782, 300).setContent(htm),
            MH.ev.WAR("wFarmList", "OwnWnds", ""),
            $("a#FrmRBall").click(function(e) {
            1 == MH.FrmLst && (MH.FrmLst = !1,
                               $("a#FrmRBall img").attr("src", MH.Home + "medias/images/rb1.gif"),
                               $("a#FrmRBcur img").attr("src", MH.Home + "medias/images/rb0.gif"),
                               $("#mhFarmList_inner tr:not(.mh_sel)").css("display", ""))
        }),
            $("a#FrmRBcur").click(function(e) {
            1 != MH.FrmLst && (MH.FrmLst = !0,
                               $("a#FrmRBall img").attr("src", MH.Home + "medias/images/rb0.gif"),
                               $("a#FrmRBcur img").attr("src", MH.Home + "medias/images/rb1.gif"),
                               $("#mhFarmList_inner tr:not(.mh_sel)").css("display", "none"))
        }),
            1 == MH.FrmLst && $("#mhFarmList_inner tr:not(.mh_sel)").css("display", "none"),
            $("#mhFarmList_inner tr").click(function(e) {
            null == e.originalEvent || e.originalEvent.originalTarget.className
        })
    }
        ,
        MH.FrmLst_MainWnd_FarmClaim = function(e) {
        $("#mhFarmList_inner").length && $("#mhFarmList_inner tr#" + e + " td.time").css("background", "#FF6050")
    }
        ,
        MH.FrmLst_MainWnd_TownSwitch = function(e, i) {
        $("#mhFarmList_inner tr:not(.mh_sel)").css("display", ""),
            $("#mhFarmList_inner tr.mh_sel").attr("bgcolor", ""),
            $("#mhFarmList_inner tr.mh_sel").attr("class", ""),
            WMap.mapData.checkReload(ITowns.towns[i].getIslandCoordinateX(), ITowns.towns[i].getIslandCoordinateY(), MapTiles.tileCount.x, MapTiles.tileCount.y, function() {
            $("#mhFarmList_inner tr").each(function(e, t) {
                var n = t.getAttribute("tids").split(",");
                for (e = 0; e < n.length; e++)
                    if (n[e] == i)
                        return "false" == t.getAttribute("active") ? t.setAttribute("bgcolor", "#808080") : t.setAttribute("bgcolor", "#B0B0FF"),
                            void t.setAttribute("class", "mh_sel")
            }),
                1 == MH.FrmLst && $("#mhFarmList_inner tr:not(.mh_sel)").css("display", "none")
        })
    }
        ,
        MH.MissLst_MainWnd_Show = function() {
        var e, t, n, i, a, o, r, l, s, d, p, c, m, u, g, f = MM.getCollections().IslandQuest[0]._byId, h = MM.getCollections().IslandQuestPlayerRelation[0].models;
        for (_log("list===================================================="),
             _log(f),
             _log("listR===================================================="),
             _log(h),
             e = "",
             t = ITowns.towns[Game.townId].getIslandCoordinateX(),
             n = ITowns.towns[Game.townId].getIslandCoordinateY(),
             a = 0; a < h.length; a++) {
            if (d = h[a].attributes,
                _log("missR===================================================="),
                _log(d),
                null != (r = d.progressables_id)) {
                p = (r = (r = r.substr(r.indexOf("{") + 1, r.length)).substr(0, r.indexOf(",")))in f ? f[r].attributes : null,
                    c = (r = (r = (r = d.progressables_id).substr(r.indexOf(",") + 1, r.length)).substr(0, r.indexOf("}")))in f ? f[r].attributes : null,
                    null == (l = p) && (l = c),
                    null != p && "good" == p.static_data.side && (r = p,
                                                                  p = c,
                                                                  c = r),
                    _log("missBAD===================================================="),
                    _log(p),
                    _log("missGOD===================================================="),
                    _log(c),
                    g = u = "",
                    m = MH.getOwnTownsByXY(d.island_x, d.island_y);
                for (i = 0; i < m.length; i++)
                    o = ITowns.towns_collection._byId[m[i]].attributes,
                        u += mhUtl.lnkTownIco(o.id, o.name, o.island_x, o.island_y),
                        g += o.id + ",";
                d.island_x == t && d.island_y == n ? e += '<tr id="' + d.id + '" class="mh_sel" bgcolor="#B0B0FF"' : e += i % 2 ? '<tr id="' + d.id + '" class="game_table_even top"' : '<tr id="' + d.id + '" class="game_table_odd top"',
                    e += 'tids="' + g + '">',
                    e += '<td style="width:17px; text-align:left;">',
                    e += Math.floor(d.island_x / 100),
                    e += Math.floor(d.island_y / 100),
                    e += "</td>",
                    e += '<td style="width:149px; text-align:left;">',
                    e += '<a mid="' + a + '" href="#" style="font-weight:500">' + l.static_data.name + "</a>",
                    e += "</td>",
                    e += _(p, 1),
                    e += "</td>",
                    e += _(c, 2),
                    e += "</td>",
                    e += '<td style="text-align:left;">',
                    e += d.finished_at,
                    null != d.accepted_at ? e += getHumanReadableTimeDate(new Date(d.accepted_at)) : e += "null",
                    e += "/",
                    e += getHumanReadableTimeDate(new Date(Timestamp.serverTime().getTime())),
                    e += "</td>",
                    e += '<td style="width:177px; text-align:left;">',
                    e += u,
                    e += "</td>",
                    e += "</tr>",
                    i++
            }
            function _(e, t) {
                var n = ""
                , i = 2 == t ? "coins_of_wisdom" : "coins_of_war"
                , n = '<td style="width:199px; text-align:left;">';
                return null != e && null != d.finished_at && d.finished_at < Timestamp.server() && (n = '<td style="width:199px; text-align:left; background:#00D000;">'),
                    n += '<div class="reward_icon  power_icon16x16 ' + i + "_generation " + i + '"></div>',
                    null != e && "good" == e.static_data.side && 1 == t && (e = null),
                    null == e ? n + "-" : ("unit_training_boost" == (t = e.static_data.rewards[1].power_id) && (t = e.static_data.rewards[1].configuration.type + "_generation"),
                                           "resource_boost" == t && (t = "resource_" + e.static_data.rewards[1].configuration.type),
                                           n += '<div class="reward_icon  power_icon16x16 ' + t + '"></div>',
                                           n += e.static_data.short_description,
                                           s = e.configuration.island_quest_level,
                                           null != e && null != d.finished_at && d.finished_at < Timestamp.server() && (n += '<a href="#" id="getrewad" mid="' + e.id + '" style="float:right; width:21px; height:15px; background:rgba(0, 0, 0, 0) url(&quot;https://grmh.pl/gui/missOK.gif&quot;) repeat scroll 0px 0px;"></a>'),
                                           n)
            }
        }
        null == s && (s = "0"),
            htm = '<div id="townsoverview" class="game_header bold mh_MissList" style="padding:0;"><ul><li><div class="towninfo col" style="width:18px"><span class="sea_coords"></span></div><div class="towninfo col" style="width:150px">' + DM.getl10n("island_quests").window_title + '</div><div class="towninfo col" style="width:200px">' + DM.getl10n("heroes").council.exchange_currency.tooltip_coins_of_war + '</div><div class="towninfo col" style="width:200px">' + DM.getl10n("heroes").council.exchange_currency.tooltip_coins_of_wisdom + '</div><div class="towninfo col" style="width:140px">' + DM.getl10n("market").city + '</div><div style="clear:both;"></div></li></ul></div><div id="ranking_table_wrapper" style="max-height: 349px;"><table id="ranking_endless_scroll" class="game_table" style="overflow-y: auto; overflow-x: hidden;" cellspacing="0"><tbody id="mhMissList_inner">' + e + "</tbody></table></div></div>",
            MH.wndCreate("wMissList", DM.getl10n("questlog").categories.island_quests + " (v0.3)", 782, 300).setContent(htm),
            MH.ev.WAR("wMissList", "OwnWnds", ""),
            $("#mhMissList_inner tr").click(function(e) {
            MH.MissLst_LastClickTR = this,
                null == e.originalEvent || e.originalEvent.originalTarget.className
        })
    }
        ,
        MH.MissLst_ONgetTimeToNextQuest = function() {
        $("#mhMissList_inner").length && 1 == MH.MissLst_CloseQuestWnd && $(".classic_window.questlog").css("visibility", "hidden")
    }
        ,
        MH.MissLst_MainWnd_TownSwitch = function(e, i) {
        $("#mhMissList_inner tr.mh_sel").attr("bgcolor", ""),
            $("#mhMissList_inner tr.mh_sel").attr("class", ""),
            $("#mhMissList_inner tr").each(function(e, t) {
            var n = t.getAttribute("tids").split(",");
            for (e = 0; e < n.length; e++)
                if (n[e] == i)
                    return t.setAttribute("bgcolor", "#B0B0FF"),
                        void t.setAttribute("class", "mh_sel")
        })
    }
        ,
        MH.rep = {
        wnds: {},
        wndt: 0,
        RT: 0,
        REP_RD: {},
        REP: {},
        Foot: function(e) {
            var t = "";
            return t += void 0 !== e ? e + MH.WhtImg(240) : MH.WhtImg(400),
                t += "[size=8][url=https://grmh.pl/?p=cnv]" + MH.Lang.norka + " - " + MH.Lang.konwrap + " v1.36[/url][/size]"
        },
        AddButtions: function(e) {
            if (!("command_info" == e.type && "info" != e.tab && "colonization_info" != e.tab || "town_overviews" == e.type && "command_overview" != e.tab || "message" == e.type && "view" != e.tab || "easter" == e.type && "recipes" != e.tab || e.cJQ.find('a[id^="exrepQ_"]').length)) {
                var n, t = (MH.rep.wnds[e.type] = e).cJQ, i = e.type;
                switch (e.type) {
                    case "notes":
                    case "message":
                    case "alliance_forum":
                        e.cJQ.find(".bbcodes.published_report").each(function(e, t) {
                            $(t).find(".conquest").length && $(t).attr("id", "MHconquest_" + i + e),
                                void 0 !== (n = $(t).attr("id")) && 0 != n && (a(i, n).css({
                                float: "right",
                                margin: "-25px 39px 0 0"
                            }).appendTo($(t)),
                                                                               o(i, n).css({
                                float: "right",
                                margin: "-25px 17px 0 0"
                            }).appendTo($(t)),
                                                                               $(t).find("#power_casted_simulator_link").length && $(t).find("#power_casted_simulator_link").css({
                                margin: "0 60px -3px 0"
                            }))
                        });
                        break;
                    case "report":
                        if ("view" != e.tab)
                            return;
                        if (!t.find("#report_arrow").length)
                            return n = "otherTxt",
                                t.find("div.report_unit").length && (n = "otherUni"),
                                a(i, n).css({
                                top: "2px"
                            }).prependTo(t.find("#report_report div.game_list_footer")),
                                void o(i, n).css({
                                top: "2px"
                            }).prependTo(t.find("#report_report div.game_list_footer"));
                        "attack" == (n = t.find("div#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\.png.*/, "$1")) && t.find("div.support_report_summary").length && (n = "attack_support"),
                            0 < n.indexOf("espionage") && (n = "espionage"),
                            a(i, n).css({
                            top: "2px"
                        }).prependTo(t.find("#report_report div.game_list_footer")),
                            o(i, n).css({
                            top: "2px"
                        }).prependTo(t.find("#report_report div.game_list_footer"));
                        break;
                    case "academy":
                        o(i, n = "academy_research").css({
                            float: "right",
                            margin: "-35px 13px 0 0"
                        }).appendTo(t),
                            a(i, n).css({
                            float: "right",
                            margin: "-35px 35px 0 0"
                        }).appendTo(t);
                        break;
                    case "building_main":
                        o(i, n = "buildings").css({
                            top: 370,
                            position: "relative"
                        }).appendTo(t),
                            a(i, n).css({
                            top: 370,
                            position: "relative"
                        }).appendTo(t);
                        break;
                    case "building_wall":
                        a(i, n = "wall").css({
                            top: "2px"
                        }).insertAfter(t.find("#building_wall  ul.game_list")),
                            o(i, n).css({
                            top: "2px"
                        }).insertAfter(t.find("#building_wall  ul.game_list"));
                        break;
                    case "olympus_temple_info":
                        "index" === e.tab && (o(i, n = "olympus_temple").css("bottom", "-35px").appendTo(t.find(".temple_actions_wrapper")).css("margin", "40px 0px 0px"),
                                              a(i, n).css("bottom", "-35px").appendTo(t.find(".temple_actions_wrapper")).css("margin", "40px 0px 0px"));
                        break;
                    case "building_place":
                        switch (e.tab) {
                            case "index":
                                o(i, n = "agora_in").appendTo(t.find("#place_defense div.game_list_footer")),
                                    a(i, n).appendTo(t.find("#place_defense div.game_list_footer")),
                                    mhGui.Button(MH.Lang.agrThanks).css({
                                    float: "left"
                                }).click(function() {
                                    MH.rep.Generate(i, "agora_thanks", !0)
                                }).appendTo(t.find("#place_defense div.game_list_footer"));
                                break;
                            case "units_beyond":
                                o(i, n = "agora_out").appendTo(t.find("#place_defense div.game_list_footer")),
                                    a(i, n).appendTo(t.find("#place_defense div.game_list_footer"))
                        }
                        break;
                    case "town_overviews":
                        o(i, n = "command_curator").appendTo(t.find("#game_list_footer")),
                            a(i, n).appendTo(t.find("#game_list_footer"));
                        break;
                    case "alliance_profile":
                        o(i, n = "ally_profile").css({
                            position: "relative",
                            top: -23
                        }).appendTo(t.find("#ally_buttons .center_box")),
                            a(i, n).css({
                            position: "relative",
                            top: -23
                        }).appendTo(t.find("#ally_buttons .center_box"));
                        break;
                    case "player_profile":
                        o(i, n = "player_profile").appendTo(t.find("#player_towns div.game_border div.game_list_footer")),
                            a(i, n).appendTo(t.find("#player_towns div.game_border div.game_list_footer"));
                        break;
                    case "island_info":
                        a(i, n = "island").prependTo(t.find("#island_towns_controls")),
                            o(i, n).prependTo(t.find("#island_towns_controls"));
                        break;
                    case "ranking":
                        a(i, n = "ranking").css({
                            margin: "2px 0"
                        }).prependTo(t.find(".game_border .game_inner_box .game_list_footer")),
                            o(i, n).css({
                            margin: "2px 0"
                        }).prependTo(t.find(".game_border .game_inner_box .game_list_footer"));
                        break;
                    case "world_wonder_donations":
                        a(i, n = "ww_donations").css({
                            margin: "0 1px"
                        }).prependTo(t.find(".player_search")),
                            o(i, n).css({
                            margin: "0 1px"
                        }).prependTo(t.find(".player_search"));
                        break;
                    case "command_info":
                        n = "command",
                            t.find("div.command_info a.button").length ? (o(i, n).css({
                            position: "absolute",
                            right: 125,
                            bottom: 2
                        }).appendTo(t.find("div.command_info")),
                                                                          a(i, n).css({
                            position: "absolute",
                            right: 150,
                            bottom: 2
                        }).appendTo(t.find("div.command_info"))) : (o(i, n).css({
                            position: "absolute",
                            right: 0,
                            bottom: 2
                        }).appendTo(t.find("div.command_info")),
                                                                    a(i, n).css({
                            position: "absolute",
                            right: 25,
                            bottom: 2
                        }).appendTo(t.find("div.command_info")));
                        break;
                    case "conquwror":
                        o(i, n = "conquerold").css({
                            position: "absolute",
                            left: 22,
                            bottom: 2
                        }).appendTo(t.find("a.publish_btn").parent()),
                            a(i, n).css({
                            position: "absolute",
                            left: 0,
                            bottom: 2
                        }).appendTo(t.find("a.publish_btn").parent());
                        break;
                    case "conquwror_mov":
                        o(i, n = "conquerold_troops").css({
                            position: "absolute",
                            right: 22,
                            bottom: 2
                        }).appendTo(t.find("#unit_movements").parent()),
                            a(i, n).css({
                            position: "absolute",
                            right: 44,
                            bottom: 2
                        }).appendTo(t.find("#unit_movements").parent());
                        break;
                    case "conquest_info":
                        o(i, n = "conquest").css({
                            position: "absolute",
                            left: 22,
                            bottom: 2
                        }).appendTo(t.find("a.publish_btn").parent()),
                            a(i, n).css({
                            position: "absolute",
                            left: 0,
                            bottom: 2
                        }).appendTo(t.find("a.publish_btn").parent());
                        break;
                    case "inventory":
                        a(i, n = "inventory").css({
                            margin: "-25px 24px 0 0"
                        }).appendTo(t),
                            o(i, n).css({
                            margin: "-25px  2px 0 0"
                        }).appendTo(t);
                        break;
                    case "easter":
                        a(i, n = "easter_recipes").css({
                            margin: "-25px 24px 0 0"
                        }).appendTo(t),
                            o(i, n).css({
                            margin: "-25px  2px 0 0"
                        }).appendTo(t);
                        break;
                    case "hercules2014:fight_result":
                        a(p.wID, "hercules_fight_result").css({
                            position: "absolute",
                            top: "342px",
                            right: "90px"
                        }).appendTo(t),
                            o(p.wID, "hercules_fight_result").css({
                            position: "absolute",
                            top: "342px",
                            right: "68px"
                        }).appendTo(t);
                        break;
                    case "world_wonders_welcome":
                        if ("index" == e.tab) {
                            o(i, n = "nofificationIMG").css({
                                position: "absolute",
                                right: "16px",
                                bottom: 0
                            }).appendTo(t),
                                a(i, n).css({
                                position: "absolute",
                                right: "38px",
                                bottom: 0
                            }).appendTo(t);
                            break
                        }
                    case "notification_popup":
                        a(i, n = "nofification").css({
                            position: "absolute",
                            right: "22px",
                            bottom: 0
                        }).appendTo(t),
                            o(i, n).css({
                            position: "absolute",
                            right: 0,
                            bottom: 0
                        }).appendTo(t);
                        break;
                    case "alliance":
                        if ("index" != e.tab)
                            return;
                        a(i, n = "ally_events").css({
                            margin: "-34px 32px 0 0"
                        }).appendTo(t.find("#ally_events")),
                            o(i, n).css({
                            margin: "-34px 10px 0 0"
                        }).appendTo(t.find("#ally_events"))
                }
            }
            function a(e, t) {
                return mhGui.But(3, "float:right;").addClass("MHbbcADD").attr("id", "exrepS_" + e).attr("wid", e).attr("typ", t).mousePopup(new MousePopup(MH.Lang.repCfg)).click(function() {
                    this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                        MH.rep.Generate($(this).attr("wid"), $(this).attr("typ"), !0)
                })
            }
            function o(e, t) {
                return mhGui.But(2, "float:right;").addClass("MHbbcADD").attr("id", "exrepQ_" + e).attr("wid", e).attr("typ", t).mousePopup(new MousePopup(MH.Lang.repRec)).click(function() {
                    this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                        MH.rep.Generate($(this).attr("wid"), $(this).attr("typ"), !1)
                })
            }
        },
        AddButtionsMov: function() {
            $("#butCNVmoves").length || (mhGui.But(2, "float:right;").css({
                margin: "-12px 9px"
            }).attr("id", "butCNVmoves").click(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                    MH.rep.Generate(null, "commands_list", !1)
            }).appendTo("#toolbar_activity_commands_list"),
                                         mhGui.But(3, "float:right;").css({
                margin: "-12px 30px"
            }).attr("id", "butCNVSmoves").click(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                    MH.rep.Generate(null, "commands_list", !0)
            }).appendTo("#toolbar_activity_commands_list"))
        },
        AddButtionsPlayer: function(e) {
            mhGui.But(2, "float:right;").attr("id", "butCNVmoves").css({
                position: "absolute",
                right: 0,
                bottom: 2
            }).click(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                    MH.rep.Generate(null, "player_info", !1)
            }).appendTo(e),
                mhGui.But(3, "float:right;").attr("id", "butCNVSmoves").css({
                position: "absolute",
                right: 25,
                bottom: 2
            }).click(function() {
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)",
                    MH.rep.Generate(null, "player_info", !0)
            }).appendTo(e)
        },
        Generate: function(e, t, n) {
            if (1 == mhCol.LoadedAllys) {
                if (1 == mhCol.LoadedPlays)
                    return MH.rep.wndt = e,
                        MH.rep.RT = t,
                        MH.rep.setup = n,
                        MH.rep.wCNV = n,
                        e = null,
                        MH.rep.wnds.hasOwnProperty(MH.rep.wndt) && (e = MH.rep.wnds[MH.rep.wndt]),
                        MH.rep.REP_RD = MH.rep.BaseRD(e, t),
                        _log(MH.rep.REP_RD),
                        n ? MH.rep.wnd_Show() : MH.rep.RepMake(),
                        MH.rep.REP;
                mhCol.UpdatePlaysFromRemote(function() {
                    MH.rep.Generate(e, t, n)
                })
            } else
                mhCol.UpdateAllysFromRemote(function() {
                    MH.rep.Generate(e, t, n)
                })
        },
        FiltrCommand: function(e) {
            var t = !0;
            return "revolt_arising" != e.id && "revolt_running" != e.id && "conqueror" != e.id && (MH.gRAP.cmdIN || "in" != e.inout || (t = !1),
                                                                                                   MH.gRAP.cmdOUT || "out" != e.inout || (t = !1)),
                MH.gRAP.cmdRET || "abort" != e.id || (t = !1),
                MH.gRAP.cmdAtt || ("attack_incoming" == e.id && (t = !1),
                                   "attack_land" == e.id && (t = !1),
                                   "attack_sea" == e.id && (t = !1),
                                   "breakthrough" == e.id && (t = !1),
                                   "revolt" == e.id && (t = !1),
                                   "attack_takeover" == e.id && (t = !1),
                                   "farm_attack" == e.id && (t = !1)),
                MH.gRAP.cmdSup || "support" != e.id || (t = !1),
                MH.gRAP.cmdSpy || "attack_spy" != e.id || (t = !1),
                MH.gRAP.cmdFarm || "farm_attack" != e.id || (t = !1),
                MH.gRAP.cmdRevA || "revolt_arising" != e.id || (t = !1),
                MH.gRAP.cmdRevR || "revolt_running" != e.id || (t = !1),
                MH.gRAP.cmdOcu || "conqueror" != e.id || (t = !1),
                MH.gRAP.cmdOcu || "attack_takeover" != e.id || (t = !1),
                t
        },
        Units: function(e, t, n) {
            var i, a, o = 0, r = "", l = "[img]" + MH.Home + "i.php?U=";
            for (1 == MH.gRAP.Style && (l = "[img]" + MH.Home + "i.php?u="),
                 2 == MH.gRAP.Style && (l = "[img]" + MH.Home + "i.php?v="),
                 t = t || 19,
                 a = Math.ceil(e.unit_list.length / t); 0 < a; ) {
                for (i = 0; i < t && (r += l + e.unit_list[o],
                                      e.unit_send && (r += e.unit_send[o]),
                                      e.unit_lost && (r += "-" + e.unit_lost[o]),
                                      r += "[/img]",
                                      !(++o >= e.unit_list.length)); i++)
                    ;
                1 == a && n && (r += n),
                    r += "\n",
                    a--
            }
            return r
        },
        Buldings: function(e, t) {
            var n, i, a = 0, o = "", r = "[img]" + MH.Home + "i.php?B=";
            for (1 == MH.gRAP.Style && (r = "[img]" + MH.Home + "i.php?b="),
                 2 == MH.gRAP.Style && (r = "[img]" + MH.Home + "i.php?k="),
                 t = t || 15,
                 i = Math.ceil(e.unit_list.length / t); 0 < i; ) {
                for (n = 0; n < t && (o += r + e.unit_list[a],
                                      e.unit_send && (o += e.unit_send[a]),
                                      o += "[/img]",
                                      !(++a >= e.unit_list.length)); n++)
                    ;
                o += "\n",
                    i--
            }
            return o
        },
        Res: function(e) {
            var t = "";
            return e.txt && (t += "[color=#008000]" + e.txt + "\n[/color]"),
                t += "[img]" + MH.Home + "r/res.gif[/img]",
                t += "[font=monospace][size=9][b]\n",
                t += MH.utl.strNwht(e.wood, 6),
                t += MH.utl.strNwht(e.stone, 6),
                t += MH.utl.strNwht(e.iron, 6),
                t += "[/font]"
        },
        ResF: function(e) {
            var t = "";
            return t += "[b]",
                e.txt && (t += "[color=#008000]" + e.txt + "[/color]\n"),
                0 < e.favor ? t += "[img]" + MH.Home + "r/ressf.gif[/img]\n" : t += "[img]" + MH.Home + "r/ress.gif[/img]\n",
                t += "[font=monospace][size=8][b]",
                t += MH.utl.strNwht(e.wood, 5),
                t += MH.utl.strNwht(e.stone, 5),
                t += MH.utl.strNwht(e.iron, 5),
                0 < e.favor && (t += MH.utl.strNwht(e.favor, 5)),
                t += "\n"
        },
        Commands: function(e) {
            var t, n, i = "[table][*]";
            if (!e.length)
                return i + (MH.WhtImg(705) + "\n" + MH.Lang.incozero) + "[/*][/table]";
            for (i += MH.WhtImg(32) + "[|]" + MH.WhtImg(128) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(128) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(129) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(129) + "[/*]",
                 t = n = nr = 0; t < e.length; t++)
                null != e[t].time_at && 0 != MH.rep.FiltrCommand(e[t]) && (i += 0 == n ? "[*]" : n < 4 ? "[|]" : "[/*]",
                                                                           "in" == MH.rep.REP_RD.movs[t].inout && (i += "[img]" + MH.Home + "m/arL.gif[/img]"),
                                                                           "out" == MH.rep.REP_RD.movs[t].inout && (i += "[img]" + MH.Home + "m/arR.gif[/img]"),
                                                                           i += t + 1 + "\n[img]" + e[t].img + "[/img]",
                                                                           i += "[|]",
                                                                           i += "~" + e[t].time_on + "[b]\n=",
                                                                           i += e[t].time_at + "\n",
                                                                           i += "[town]" + e[t].town + "[/town]\n",
                                                                           i += "[player]" + e[t].player + "[/player][/b]",
                                                                           4 <= ++n && (n = 0));
            return i += "[/*][/table]"
        }
    },
        MH.rep.BaseRD = function(e, t) {
        var o = {
            title: "",
            type: 0,
            time: 0,
            ico: "",
            load: 0,
            morale: "",
            luck: "",
            oldwall: "",
            oldbuld: "",
            nightbonus: "",
            attacktxt: "",
            res: {
                wood: 0,
                stone: 0,
                iron: 0,
                favor: 0
            },
            resources: {},
            att: {}
        };
        o.att.town = 0,
            o.att.townT = "town",
            o.att.player = 0,
            o.att.ally = "",
            o.att.townName = "",
            o.att.playerName = "",
            o.att.pow = "",
            o.att.unit_list = [],
            o.att.unit_send = [],
            o.att.unit_lost = [],
            o.att.w = 0,
            o.att.s = 0,
            o.att.i = 0,
            o.att.p = 0,
            o.att.f = 0,
            o.def = {},
            o.def.town = 0,
            o.def.townT = "town",
            o.def.player = 0,
            o.def.ally = "",
            o.def.townName = "",
            o.def.playerName = "",
            o.def.pow = "",
            o.def.unit_list = [],
            o.def.unit_send = [],
            o.def.unit_lost = [],
            o.def.w = 0,
            o.def.s = 0,
            o.def.i = 0,
            o.def.p = 0,
            o.def.f = 0;
        var n, r, i, a, l, d, p, c, m, u, g, f, h, _, b = "";
        if (null != e && (r = e.cJQ,
                          void 0 !== e.jGP && (r = e.jGP),
                          b = e.rt,
                          MH.rep.wID = e.idJQ,
                          MH.htm.wJQ = e.cJQ,
                          i = e.wJQ,
                          a = e.cJQ),
            o.type = t,
            o.style = MH.gRAP.Style,
            mhRep.fontag = "[font=monospace][size=9]",
            1 == MH.gRAP.Style && (mhRep.fontag = "[font=monospace][size=8]"),
            o.title = MH.GLng.Report,
            n = "",
            null != e && (r.find("#report_report_header").length ? n = r.find("#report_report_header").html().clear() : r.parent().find(".ui-dialog-titlebar .ui-dialog-title").length ? n = r.parent().find(".ui-dialog-titlebar .ui-dialog-title").html().clear() : r.parent().find(".wnd_border_t .title").length && (n = r.parent().find(".wnd_border_t .title").html().clear())),
            2 <= n.length && (o.title = n),
            o.timeSN = Timestamp.serverTime(),
            n = getHumanReadableTimeDate(o.timeSN),
            o.time = "(" + w(n.substring(9, n.length) + " " + n.substring(0, 8)).replace(" ", ") [b]") + "[/b]",
            n = "undefined",
            null != e && r.find("#report_date").length && (n = r.find("#report_date").html().clear()),
            "undefined" != n && 12 <= n.length && (o.time = "(" + w(n).replace(" ", ") [b]") + "[/b]"),
            o.timeS = Timestamp.serverTimeToLocal(),
            o.timeNOW = getHumanReadableTimeDate(Timestamp.serverTimeToLocal()),
            null != e && r.find("#report_arrow img").length && (o.ico = r.find("#report_arrow img").attr("src")),
            "bb_codes_report_" == t.substr(0, 16))
            t = k(t);
        else if ("MHconquest_" == t.substr(0, 11))
            t = k(t);
        else
            switch (t) {
                case "raise":
                case "breach":
                case "attack":
                case "take_over":
                    !function() {
                        o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                            o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                            o.ico = r.find("#report_arrow img").attr("src"),
                            o.load = v("#load"),
                            o.morale = v("span.fight_bonus.morale", MH.Home + "r/rmorale.png"),
                            o.luck = v("span.fight_bonus.luck"),
                            "" != o.luck && (-1 < o.luck.indexOf("-") ? o.luck = "[img]" + MH.Home + "r/rluck.png[/img] [color=#b50307]" + o.luck + "[/color]" : o.luck = "[img]" + MH.Home + "r/rluck.png[/img] " + o.luck),
                            o.oldwall = o.oldbuld = o.nightbonus = "",
                            r.find(".report_side_defender .fight_bonus.oldwall .catapult").length && (o.oldwall = "[img]" + MH.Home + "r/rwall.png[/img] " + r.find(".report_side_defender .fight_bonus.oldwall .catapult").parent().html().clear()),
                            r.find(".report_side_defender .fight_bonus.oldwall .stone_hail").length && (o.oldbuld = "[img]" + MH.Home + "r/rbuld.png[/img] " + r.find(".report_side_defender .fight_bonus.oldwall .stone_hail").parent().html().clear()),
                            r.find(".report_side_defender .fight_bonus.oldwall .night").length && (o.nightbonus = "[img]" + MH.Home + "r/rnbonus.png[/img] " + r.find(".report_side_defender .fight_bonus.oldwall .night").parent().html().clear()),
                            "raise" == o.type ? ($.each(r.find("#left_side .power_holder>div"), function(e, t) {
                            o.att.pow += MH.htm.getPowerIcon($(t))
                        }),
                                                 $.each(r.find("#right_side .power_holder>div"), function(e, t) {
                            o.def.pow += MH.htm.getPowerIcon($(t))
                        })) : ($.each(r.find("div.report_side_attacker .power_holder>div"), function(e, t) {
                            o.att.pow += MH.htm.getPowerIcon($(t))
                        }),
                               $.each(r.find("div.report_side_defender .power_holder>div"), function(e, t) {
                            o.def.pow += MH.htm.getPowerIcon($(t))
                        })),
                            "raise" == o.type ? (o.att = MH.htm.UnitsL(o.att, "#left_side .report_side_attacker_unit"),
                                                 o.def = MH.htm.UnitsL(o.def, "#right_side .report_side_attacker_unit")) : (o.att = MH.htm.UnitsL(o.att, "div.report_side_attacker_unit"),
                                                                                                                            o.def = MH.htm.UnitsL(o.def, "div.report_side_defender_unit")),
                            o.res.count = "",
                            o.res.txt = v("#resources h4:first"),
                            r.find("#resources li.res_background span.bold").each(function(e, t) {
                            o.res.count = "1",
                                $(t).parent().find("div").hasClass("wood_img") && (o.res.wood = t.innerHTML),
                                $(t).parent().find("div").hasClass("stone_img") && (o.res.stone = t.innerHTML),
                                $(t).parent().find("div").hasClass("iron_img") && (o.res.iron = t.innerHTML),
                                $(t).parent().find("div").hasClass("favor_img") && (o.res.favor = t.innerHTML)
                        }),
                            o.bp = {},
                            o.bp.count = "",
                            o.bp.txt = "",
                            r.find("#kill_points>.battle_points").length && (o.bp.txt = r.find("#kill_points>.battle_points span").html().clear(),
                                                                             o.bp.count = r.find("#kill_points>.battle_points").html(),
                                                                             o.bp.count = o.bp.count.substring(o.bp.count.lastIndexOf(">") + 1).clear()),
                            o.attacktxt = "",
                            $("div#resources > span.bold").each(function(e, t) {
                            $(t).attr("id") || (o.attacktxt = $(t).html().replace(/\s+/g, " ").replace("<br>", "\n").clear() + "\n")
                        });
                        try {
                            var e = o.title.replace(/(.*?)\((.*?)\)(.*?)\((.*?)\)(.*?)/gi, 'mhPLA="$2');
                            -1 < e.indexOf('mhPLA="') && (o.attacktxt += MH.Lang.incoocu + ": [player]" + e.substr(7, e.length) + "[/player]\n")
                        } catch (e) {}
                    }();
                    break;
                case "attack_support":
                    o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                        o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                        o.att.unit_list = ["xx"],
                        o.att.unit_send = ["?"],
                        o.att.unit_lost = ["?"],
                        o.att.w = o.att.s = o.att.i = o.att.p = o.att.f = "?",
                        o.def.w = o.def.s = o.def.i = o.def.p = o.def.f = 0,
                        o.player = Game.player_name,
                        o.def = MH.htm.UnitsL(o.def, "div.support_report_summary div.report_units.report_side_defender div.report_side_defender_unit"),
                        o.txt = r.find("div.report_units.report_side_defender.clearfix h4").html().toLowerCase(),
                        "[player]Olimp[/player]" == o.def.player && (o.def.townT = "olimp");
                    break;
                case "illusion":
                    o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                        o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                        o.morale = "",
                        o.luck = "",
                        o.oldwall = "",
                        o.nightbonus = "",
                        o.efekt = {},
                        o.res = {},
                        o.efekt.title = r.find("div#report_game_body p").html().clear();
                    break;
                case "powers":
                    !function() {
                        switch (o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                                o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                                o.ico = r.find("#report_arrow img").attr("src"),
                                o.res = {},
                                o.res.image = "",
                                o.res.unit_list = "",
                                o.res.unit_send = "",
                                o.efekt = {},
                                o.efekt.det = v("div#right_side h4"),
                                o.res.txt = v("div#right_side h4"),
                                o.efekt.title = r.find("div#left_side h4").html().clear(),
                                o.powimg16 = MH.htm.getPowerIcon(r.find("div#report_power_symbol")),
                                o.powimg30 = "[img]" + MH.htm.GetPowerImgFromClass(r.find("div#report_power_symbol"), !0) + "[/img]",
                                o.powid = r.find("div#report_power_symbol").attr("class").replace(/power_icon86x86 (.*)/, "$1"),
                                o.powid = o.powid.replace("wood", "").replace("iron", "").replace("stone", "").replace("all", "").clear(),
                                o.powtype = 0,
                                o.txt = GameData.powers[o.powid].description,
                                o.txt2 = GameData.powers[o.powid].effect,
                                o.god = GameData.powers[o.powid].god_id,
                                o.favor = GameData.powers[o.powid].favor,
                                o.powtime = GameData.powers[o.powid].lifetime,
                                "earthquake" != o.powid && "bolt" != o.powid || (o.powtime = 14400 / Game.game_speed),
                                o.powid) {
                            case "kingly_gift":
                            case "wedding":
                            case "underworld_treasures":
                            case "natures_gift":
                                o.powtype = 1,
                                    r.find(".res_background>span").each(function(e, t) {
                                    switch (e) {
                                        case 0:
                                            o.res.wood = t.innerHTML;
                                            break;
                                        case 1:
                                            o.res.stone = t.innerHTML;
                                            break;
                                        case 2:
                                            o.res.iron = t.innerHTML
                                    }
                                });
                                break;
                            case "chain_lightning":
                            case "demoralizing_plague":
                            case "demoralized_army":
                                o.txt2 = s(o.txt2, o.powtime / 60 * 60, "?");
                            case "divine_sign":
                            case "patroness":
                            case "wisdom":
                            case "sea_storm":
                            case "transformation":
                                o.powtype = 2,
                                    o.res = MH.htm.Units(o.res, "#right_side div.report_unit");
                                break;
                            case "happiness":
                            case "fertility_improvement":
                            case "town_protection":
                            case "call_of_the_ocean":
                            case "earthquake":
                            case "bolt":
                            case "pest":
                                o.powtype = 3,
                                    "pest" == o.powid ? o.efekt.det = o.txt : o.efekt.det = r.find("#right_side p").html().replace("<br>", "_").clear().replace(/\s+/g, " ").replace("_", "\n");
                                var e = MH.utl.str2date("(" + w(r.find("#report_date").html().clear()) + ")");
                                e = new Date(e.getTime() + 1e3 * o.powtime),
                                    o.powend = "[color=#E00000][b]" + MH.Lang.spellend + ": " + e.toTimeString().substring(0, 8) + "[/b] (" + e.toISOString().substring(0, 10) + ")[/color]";
                                break;
                            case "cleanse":
                                o.efekt.det = r.find("#left_side p").html().clear(),
                                    e = r.find("div#right_side .powers_container .power_icon"),
                                    o.pID = null,
                                    0 < e.length && (o.pID = MH.htm.getPowerIcon(e));
                                break;
                            case "illusion":
                                o.efekt.det = "ten atak już doszedł",
                                    o.efekt.det2 = "";
                                var t = !1
                                , e = "#toolbar_activity_commands_list .illusion.outgoing";
                                $(e).length || (t = !0,
                                                $("#toolbar_activity_commands").mouseenter()),
                                    $(e).length && $(e).next().next().hasClass("town_link") && o.def.town == "[town]" + MH.Link2Struct($(e).next().next().find("a.gp_town_link").attr("href")).id + "[/town]" && (o.efekt.det = MH.Pop($(e)),
                    o.efekt.det2 = $(e).next().html()),
                                    t && $("#toolbar_activity_commands").mouseleave()
                        }
                        if ("undefined" != typeof HMoleLangAdd && "rep"in HMoleLangAdd) {
                            var n = null;
                            switch (o.powid) {
                                case "divine_sign":
                                    n = "ga1";
                                    break;
                                case "bolt":
                                    n = "ga2";
                                    break;
                                case "patroness":
                                    n = "gb1";
                                    break;
                                case "wisdom":
                                    n = "gb2";
                                    break;
                                case "town_protection":
                                    n = "gb3";
                                    break;
                                case "kingly_gift":
                                    n = "gc1";
                                    break;
                                case "call_of_the_ocean":
                                    n = "gc2";
                                    break;
                                case "earthquake":
                                    n = "gc3";
                                    break;
                                case "sea_storm":
                                    n = "gc4";
                                    break;
                                case "wedding":
                                    n = "gd1";
                                    break;
                                case "happiness":
                                    n = "gd2";
                                    break;
                                case "fertility_improvement":
                                    n = "gd3";
                                    break;
                                case "pest":
                                    n = "ge1";
                                    break;
                                case "underworld_treasures":
                                    n = "ge3";
                                    break;
                                case "natures_gift":
                                    n = "gf1";
                                    break;
                                case "illusion":
                                    n = "gf3";
                                    break;
                                case "cleanse":
                                    n = "gf4"
                            }
                            n in HMoleLangAdd.rep && (o.txt = HMoleLangAdd.rep[n][0],
                                                      o.txt2 = HMoleLangAdd.rep[n][1])
                        }
                    }();
                    break;
                case "command_curator":
                    o.title = r.find("div.game_header").html().clear(),
                        o.movs = {},
                        _ = JSON.parse(b).json,
                        r.find("#tab_all ul#command_overview li").length && $.each(r.find("#tab_all ul#command_overview li"), function(n, i) {
                        if (null != (h = $(i).attr("id")))
                            if (h = h.substr(h.indexOf("_") + 1),
                                o.movs[n] = {
                                id: "",
                                img: "",
                                inout: "out",
                                inoutImg: "",
                                townIdA: null,
                                townIdB: null,
                                townA: null,
                                townB: null,
                                townAN: "",
                                townBN: "",
                                playerA: "",
                                playerB: "",
                                power: "",
                                unit_list: [],
                                unit_send: [],
                                spy: "",
                                time: "",
                                time_at: readableUnixTimestamp(_.data.commands[n].arrival_at, "player_timezone")
                            },
                                $(i).find("h4").length)
                                o.movs[n].NoCmdTxt = "[b]" + $(i).find("h4").html().clear() + "[/b]";
                            else if ($(i).find("span.italic").length)
                                o.movs[n].NoCmdTxt = "[i]" + $(i).find("span.italic").html().clear() + "[/i]";
                            else if ($(i).hasClass("place_command")) {
                                for (var e in mhCNST.Commands)
                                    $(i).find("div.cmd_img").hasClass(mhCNST.Commands[e]) && (o.movs[n].id = mhCNST.Commands[e]);
                                o.movs[n].img = "[img]" + MH.GameImg + "/images/game/unit_overview/" + o.movs[n].id + ".png[/img]",
                                    $(i).find("img.cmd_img").length && (o.movs[n].id = $(i).find("img.cmd_img").attr("src").replace(/.*\/([a-z_]*)\..*/, "$1"),
                                                                        o.movs[n].img = "[img]" + $(i).find("img.cmd_img").attr("src") + "[/img]"),
                                    o.movs[n].townIdB = "",
                                    $.each($(i).find("a.gp_town_link"), function(e, t) {
                                    0 == e ? o.movs[n].townIdA = MH.Link2Struct(t.getAttribute("href")).id : o.movs[n].townIdB = MH.Link2Struct(t.getAttribute("href")).id,
                                        0 == e ? o.movs[n].townAN = $(t).html() : o.movs[n].townBN = $(t).html(),
                                        o.movs[n].inout = 0 == $(i).find(".overview_incoming").length ? "out" : "in",
                                        o.movs[n].inoutImg = MH.bbc(MH.Home + "m/" + (0 == $(i).find(".overview_incoming").length ? "out" : "in") + ".png", "img")
                                }),
                                    o.movs[n].townA = "[town]" + o.movs[n].townIdA + "[/town]",
                                    o.movs[n].townB = "[town]" + o.movs[n].townIdB + "[/town]",
                                    ITowns.isMyTown(o.movs[n].townIdA) && ("revolt_arising" == o.movs[n].id && (o.movs[n].img = "[img]" + MH.Home + "m/ORA.png[/img]"),
                                                                           "revolt_running" == o.movs[n].id && (o.movs[n].img = "[img]" + MH.Home + "m/ORR.png[/img]")),
                                    $.each($(i).find("a.gp_player_link"), function(e, t) {
                                    0 == e ? (o.movs[n].townA += MH.bbc($(t).html(), "player"),
                                              o.movs[n].playerA = MH.bbc($(t).html(), "player")) : (o.movs[n].townB += MH.bbc($(t).html(), "player"),
                                                                                                    o.movs[n].playerB = MH.bbc($(t).html(), "player")),
                                        o.movs[n].inout = 0 == $(i).find(".overview_incoming").length ? "out" : "in",
                                        o.movs[n].inoutImg = MH.bbc(MH.Home + "m/" + (0 == $(i).find(".overview_incoming").length ? "out" : "in") + ".png", "img")
                                }),
                                    o.movs[n].time = $(i).find(".troops_arrive_at").html(),
                                    $(i).find("div.casted_power").length && (o.movs[n].power = MH.htm.getPowerIcon($(i).find("div.casted_power"))),
                                    "espionage" == $(i).attr("id").replace(/.*_(espionage).*/, "$1") || $.each($(i).find("div.command_overview_units div.place_unit"), function(e, t) {
                                    e = MH.htm.UnitId(t),
                                        o.movs[n].unit_list.push(mhCNST.Units[e] || mhCNST.Units.unknown),
                                        o.movs[n].unit_send.push(t.children[0].innerHTML.clear())
                                })
                            }
                    });
                    break;
                case "commands_list":
                    !function() {
                        var e, t, n, i;
                        for (n in o.title = MH.Lang.cmdToCity + " " + Game.townName,
                             o.movs = [],
                             t = 0,
                             cma = MM.getModels().MovementsUnits,
                             cma)
                            if (cma.hasOwnProperty(n)) {
                                if ((e = cma[n].attributes).home_town_id != Game.townId && e.target_town_id != Game.townId)
                                    continue;
                                o.movs[t] = {},
                                    o.movs[t].arrival_at = e.arrival_at,
                                    o.movs[t].inout = "in",
                                    1 != e.incoming && (o.movs[t].inout = "out"),
                                    o.movs[t].id = e.type,
                                    o.movs[t].time_at = readableUnixTimestamp(e.arrival_at, "player_timezone"),
                                    o.movs[t].time_on = MH.utl.secsToHHMMSS(e.arrival_at - Timestamp.server()),
                                    o.movs[t].img = MH.GameImg + "/images/game/unit_overview/" + e.type + ".png",
                                    o.movs[t].town = e.home_town_id,
                                    o.movs[t].town = function(e) {
                                    return e = $("#toolbar_activity_commands_list #movement_" + e + " .details_wrapper .gp_town_link").attr("href"),
                                        (e = MH.Link2Struct(e)).id
                                }(e.id),
                                    o.movs[t].player = mhCol.PlayName_TownID(o.movs[t].town),
                                    e.link && -1 < e.link.indexOf("href=") && (o.movs[t].town = MH.Link2Struct(e.link.match(/href="([^"]*)/)[1]).id,
                                                                               o.movs[t].player = mhCol.PlayName_TownID(o.movs[n].town)),
                                    MH.gRAP.SelT && "attack" == e.type && (i = "_" + e.home + (e.arrival_at + Timestamp.localeGMTOffset()))in MH.attTownList && (o.movs[t].img = MH.Home + "/m/" + MH.attTownList[i].at + ".png"),
                                    t++
                            }
                        for (n in cma = MM.getModels().MovementsColonization,
                             cma)
                            if (cma.hasOwnProperty(n)) {
                                if ((e = cma[n].attributes).home_town_id != Game.townId && e.target_town_id != Game.townId)
                                    continue;
                                o.movs[t] = {},
                                    o.movs[t].arrival_at = e.arrival_at,
                                    o.movs[t].inout = "out",
                                    o.movs[t].id = "conqueror",
                                    o.movs[t].time_at = readableUnixTimestamp(e.arrival_at, "player_timezone"),
                                    o.movs[t].time_on = MH.utl.secsToHHMMSS(e.arrival_at - Timestamp.server()),
                                    o.movs[t].img = MH.GameImg + "/images/game/unit_overview/foundation.png",
                                    o.movs[t].town = $(e.island_link).html().clear(),
                                    o.movs[t].player = Game.player_name,
                                    t++
                            }
                        for (n in cma = MM.getModels().MovementsSpy,
                             cma)
                            if (cma.hasOwnProperty(n)) {
                                if ((e = cma[n].attributes).home_town_id != Game.townId && e.target_town_id != Game.townId)
                                    continue;
                                o.movs[t] = {},
                                    o.movs[t].arrival_at = e.arrival_at,
                                    o.movs[t].inout = "out",
                                    o.movs[t].id = "attack_spy",
                                    o.movs[t].time_at = readableUnixTimestamp(e.arrival_at, "player_timezone"),
                                    o.movs[t].time_on = MH.utl.secsToHHMMSS(e.arrival_at - Timestamp.server()),
                                    o.movs[t].img = MH.GameImg + "/images/game/unit_overview/attack_spy.png",
                                    o.movs[t].town = e.target_town_id,
                                    o.movs[t].player = mhCol.PlayName_TownID(o.movs[t].town),
                                    t++
                            }
                        for (n in cma = MM.getModels().MovementsConqueror,
                             cma)
                            if (cma.hasOwnProperty(n)) {
                                if ((e = cma[n].attributes).home_town_id != Game.townId && e.target_town_id != Game.townId)
                                    continue;
                                o.movs[t] = {},
                                    o.movs[t].arrival_at = e.conquest_finished_at,
                                    o.movs[t].inout = "none",
                                    o.movs[t].id = "conqueror",
                                    o.movs[t].time_at = readableUnixTimestamp(e.conquest_finished_at, "player_timezone"),
                                    o.movs[t].time_on = MH.utl.secsToHHMMSS(e.conquest_finished_at - Timestamp.server()),
                                    o.movs[t].img = MH.GameImg + "/images/game/unit_overview/conqueror.png",
                                    o.movs[t].town = e.target_town_id,
                                    o.movs[t].player = mhCol.PlayName_TownID(o.movs[t].town),
                                    t++
                            }
                        for (n in cma = MM.getModels().MovementsRevoltDefender,
                             cma)
                            if (cma.hasOwnProperty(n)) {
                                if ((e = cma[n].attributes).home_town_id != Game.townId && e.target_town_id != Game.townId)
                                    continue;
                                o.movs[t] = {
                                    time_at: readableUnixTimestamp(e.started_at, "player_timezone"),
                                    time_on: MH.utl.secsToHHMMSS(e.started_at - Timestamp.server()),
                                    img: MH.Home + "m/ORA.png",
                                    town: e.target_town_id,
                                    player: mhCol.PlayName_TownID(e.target_town_id)
                                },
                                    o.movs[t].inout = "in",
                                    1 != e.incoming && (o.movs[t].inout = "out"),
                                    o.movs[t].id = "revolt_arising",
                                    t++
                            }
                        o.movs.sort(function(e, t) {
                            return "undefined" == e.arrival_at || "undefined" == t.arrival_at ? 0 : e.arrival_at < t.arrival_at ? -1 : e.arrival_at > t.arrival_at ? 1 : 0
                        })
                    }();
                    break;
                case "espionage":
                    o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                        o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                        o.iron = {},
                        o.def.title = "",
                        o.def.unit_list = o.def.unit_send = "",
                        o.build = {},
                        o.build.title = "",
                        o.SpyOk = !0,
                        o.res = {},
                        o.res.title = "",
                        o.res.detail = "",
                        o.res.count = "",
                        o.res.wood = "",
                        o.res.stone = "",
                        o.res.iron = "",
                        !(r.find("div#right_side>h4").length ? (r.find("div#left_side>h4").length && (o.def.title = r.find("div#left_side>h4").html().clear()),
                                                                o.def = MH.htm.Units(o.def, "div#left_side>.spy_success_left_align>div.report_unit"),
                                                                r.find("div#spy_buildings>h4").length && (o.build.title = r.find("div#spy_buildings>h4").html().clear()),
                                                                o.build.unit_list = o.build.unit_send = o.build.unit_img = "",
                                                                o.build = MH.htm.Buildings(o.build, "div#spy_buildings>.spy_success_left_align>div.report_unit"),
                                                                o.iron.title = r.find("div#right_side>h4")[0].innerHTML,
                                                                r.find("#right_side div.spy_success_left_align span").length && (o.iron.count = r.find("#right_side div.spy_success_left_align span").html().clear().replace(/\s+/g, "")),
                                                                o.res.title = "",
                                                                o.res.title = r.find("#right_side h4").eq(1).html().clear(),
                                                                o.res.wood = r.find("#right_side div.spy_success_left_align span").eq(1).html().clear(),
                                                                o.res.stone = r.find("#right_side div.spy_success_left_align span").eq(2).html().clear(),
                                                                o.res.iron = r.find("#right_side div.spy_success_left_align span").eq(3).html().clear(),
                                                                o.res.detail = "[img]" + MH.Home + "r/resn.gif[/img]\n¨" + MH.bbcS(MH.bbcVAL(parseInt(o.res.wood), 7) + "   " + MH.bbcVAL(parseInt(o.res.stone), 7) + "   " + MH.bbcVAL(parseInt(o.res.iron), 7), 7),
                                                                o.spygoodtitle = r.find("#right_side h4").eq(2).html().clear(),
                                                                void (o.spygod = r.find("#right_side .spy_success_left_align .god_micro").attr("title").clear())) : r.find("div#left_side").length ? (o.SpyOk = !1,
            o.def.title = r.find("div#left_side>p").html().clear(),
            r.find("div#right_side>p").length ? o.iron.title = r.find("div#right_side>p")[0].innerHTML.replace(/(.*:).*/, "$1") : o.iron.title = r.find("div#report_game_body>div>p").html().clear(),
            o.iron.count = r.find("div#right_side>p")[0].innerHTML.replace(/.*:([0-9]*)/, "$1").clear()) : (o.SpyOk = "wyrocznia",
                                                                                                            o.iron.title = r.find("#report_game_body div").last().html().clear(),
                                                                                                            o.iron.count = "?"));
                    break;
                case "conquest":
                    o.time_on = r.find("div#conquest").html().clear(),
                        o.time_at = r.find("div#conquest").attr("data-tooltip").clear(),
                        o.att = {},
                        o.def = {},
                        o.command = {},
                        o.txt_allunits = $(r.find("h4")[0]).html().clear(),
                        o.att.player = MH.bbc(r.find("a.gp_player_link").html(), "player"),
                        o.def.town = MH.bbc(MH.Link2Struct(r.find("a.gp_town_link").attr("href")).id.toString(), "town"),
                        o.att = MH.htm.Units(o.att, "div.report_unit"),
                        o.txt_ruchy = $(r.find("h4")[1]).html().clear(),
                        o.movs = [],
                        r.find("ul#unit_movements").length ? $.each(r.find("ul#unit_movements>li"), function(e, t) {
                        o.movs[e] = {},
                            o.movs[e].inout = "in",
                            o.movs[e].img = $(t).find("img.command_type").attr("src"),
                            o.movs[e].id = o.movs[e].img.replace(/(.*?)game\/unit_overview\/(.*?).png/gi, "$2"),
                            f = $(t).find("div>span.eta").html().clear().split(":"),
                            f = 60 * parseInt(f[0]) * 60 + 60 * parseInt(f[1]) + parseInt(f[2]),
                            f = Timestamp.server() + parseInt(f),
                            o.movs[e].time_at = readableUnixTimestamp(f, "player_timezone"),
                            o.movs[e].time_on = $(t).find("div>span.eta").html().clear(),
                            o.movs[e].town = MH.Link2Struct($(t).find(".gp_town_link:first").attr("href")).id,
                            o.movs[e].player = MH.Link2Struct($(t).find(".gp_player_link:first").attr("href")).name
                    }) : o.txt_brakruchow = r.find(".conquest_info_wrapper>span").html().clear();
                    break;
                case "conquerold":
                    o.time_at = r.find("div.clearfix")[0].innerHTML.strip_tags().trim().replace(/\n/gi, "").replace(/.*(\(.*\)).*/, "$1"),
                        o.att = {},
                        o.def = {},
                        o.txt_end = $(r.find(".bold")[0]).html().clear(),
                        o.txt_allunits = $(r.find(".bold")[1]).html().clear(),
                        o.def.town = MH.bbc(MH.Link2Struct(r.find("div.clearfix a.gp_town_link").attr("href")).id.toString(), "town"),
                        o.def.townName = r.find("div.clearfix a.gp_town_link").html(),
                        o.def.player = MH.bbc(r.find("div.clearfix a.gp_player_link").html(), "player"),
                        o.def.playerName = r.find("div.clearfix a.gp_player_link").html(),
                        null == o.def.player && (o.def.player = "",
                                                 o.def.playerName = ""),
                        o.att.units_title = r.find("div.clearfix div.bold").html(),
                        !void (o.att = MH.htm.Units(o.att, r.find("div.clearfix div.index_unit")));
                    break;
                case "conquerold_troops":
                    o.type = "",
                        o.movs = [],
                        o.timeNOW = getHumanReadableTimeDate(Timestamp.serverTimeToLocal()),
                        o.txtRuchy = r.find("div.tab_content>span").html().clear(),
                        r.find("ul#unit_movements").length ? $.each(r.find("ul#unit_movements>li"), function(e, t) {
                        o.movs[e] = {},
                            o.movs[e].inout = "in",
                            o.movs[e].img = $(t).find("img.command_type").attr("src"),
                            o.movs[e].id = o.movs[e].img.replace(/(.*?)game\/unit_overview\/(.*?).png/gi, "$2"),
                            g = $(t).find("div>span.eta").html().clear().split(":"),
                            g = 60 * parseInt(g[0]) * 60 + 60 * parseInt(g[1]) + parseInt(g[2]),
                            g = Timestamp.server() + parseInt(g),
                            o.movs[e].time_at = readableUnixTimestamp(g, "player_timezone"),
                            o.movs[e].time_on = $(t).find("div>span.eta").html().clear(),
                            o.movs[e].town = MH.Link2Struct($($(t).find("div")[2]).find("a").attr("href")).id,
                            o.movs[e].player = mhCol.PlayName_TownID(o.movs[e].town)
                    }) : o.txtRuchy = r.find(".gpwindow_content>span").html().clear();
                    break;
                case "conquer":
                case "found":
                    !function() {
                        o.title = r.find("#report_report_header").html().strip_tags().replace("&nbsp;", " ").trim(),
                            o.type = r.find("#report_arrow img").attr("src").replace(/.*\/([a-z_]*)\..*/, "$1"),
                            o.morale = "",
                            o.luck = "",
                            o.oldwall = "",
                            o.nightbonus = "",
                            o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                            o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town"));
                        var e = 0 == r.find("#report_game_body p a.gp_town_link").length ? "" : MH.bbc(MH.Link2Struct(r.find("#report_game_body p a.gp_town_link").attr("href")).id.toString(), "town")
                        , t = 0 == r.find("#report_game_body p a.gp_player_link").length ? "" : MH.bbc(r.find("#report_game_body p a.gp_player_link").html(), "player");
                        o.detail = r.find("#report_game_body p").html().trim(),
                            o.detail = o.detail.replace(/<a.*gp_town_link.*\/a> /, e + " "),
                            o.detail = o.detail.replace(/<a.*gp_town_link.*\/a>./, e + " "),
                            o.detail = o.detail.replace(/<a.*gp_player_link.*\/a>/, t)
                    }();
                    break;
                case "support":
                    o.att = MH.htm.PlayerNFO(o.att, r.find("#report_sending_town")),
                        o.def = MH.htm.PlayerNFO(o.def, r.find("#report_receiving_town")),
                        o.att = MH.htm.Units(o.att, "div.report_unit");
                    break;
                case "command":
                    o.ico = r.find(".command_icon_wrapper img").attr("src"),
                        o.farm = !!(1 < r.find(".command_icon_wrapper img").length && r.find(".command_icon_wrapper img").attr("src").match(/.*\/(farm).*/)),
                        o.miss = r.find(".report_town_bg_quest").length,
                        o.abort = !!(1 < r.find(".command_icon_wrapper img").length && r.find(".command_icon_wrapper img").attr("src").match(/.*\/(abort).*/)),
                        o.detail = {},
                        r.find(".command_info_res").length && (o.abort = 1,
                                                               o.ico = "/images/game/unit_overview/abort.png"),
                        o.abort ? (H(o.def, "div.attacker"),
                                   H(o.att, "div.defender")) : (H(o.att, "div.attacker"),
                                                                H(o.def, "div.defender")),
                        o.detail.time_title = r.find("fieldset.command_info_time legend").html(),
                        o.detail.time_time = r.find("fieldset.command_info_time .arrival_time").html(),
                        o.att.units_title = r.find("fieldset.command_info_units legend").html(),
                        o.att = MH.htm.Units(o.att, r.find("fieldset.command_info_units div.index_unit")),
                        $.each(r.find("fieldset.command_info_casted_powers div.index_town_powers"), function(e, t) {
                        o.att.pow += MH.htm.getPowerIcon($(t))
                    }),
                        o.res.image = "",
                        o.res.count = "",
                        o.res.wood = "",
                        o.res.stone = "",
                        o.res.iron = "",
                        o.res.title = r.find("fieldset.command_info_res legend").html(),
                        $.each(r.find("fieldset.command_info_res li.res_background span"), function(e, t) {
                        switch (o.resources.count += MH.bbcU(t.innerHTML, "000") + "¨",
                                e) {
                            case 0:
                                o.resources.wood = t.innerHTML;
                                break;
                            case 1:
                                o.resources.stone = t.innerHTML;
                                break;
                            case 2:
                                o.resources.iron = t.innerHTML
                        }
                    }),
                        o.res.detail = "[img]" + MH.Home + "r/res.gif[/img]\\n¨" + MH.bbcS(MH.bbcVAL(parseInt(o.resources.wood), 6) + "¨¨¨" + MH.bbcVAL(parseInt(o.resources.stone), 6) + "¨¨¨" + MH.bbcVAL(parseInt(o.resources.iron), 6), 7),
                        o.bunt = "",
                        !void (r.find("div#resources p").length && r.find("div#resources span").length ? o.bunt = r.find("div#resources span").html() : 1 == r.find("div#resources h4").length && 5 == r.find("div#resources span").length && (o.bunt = r.find("div#resources span")[4].innerHTML));
                    break;
                case "otherTxt":
                    S();
                    break;
                case "otherUni":
                    S(),
                        o.att = MH.htm.Units(o.att, "div.report_unit");
                    break;
                case "nofification":
                    o.html = r.find(".gpwindow_content").html();
                    break;
                case "nofificationIMG":
                    o.img = "",
                        o.html = r.html(),
                        r.find(".wonders_picture").length && (o.img = MH.GameImg + "/images/game/wonders/word_wonders_hint.png");
                    break;
                case "agora_thanks":
                    o.txt_obrona = r.find("#place_defense #defense_header").html().clear(),
                        o.title = o.txt_obrona + " " + Game.townName,
                        o.lst = {},
                        $.each(r.find('.game_list li[id^="support_units_"] a.gp_player_link'), function(e, t) {
                        Game.player_name != $(t).html().clear() && (u = MH.Link2Struct($(t).attr("href")),
                                                                    o.lst[u.id] = {},
                                                                    o.lst[u.id].name = mhCol.PlayName_PlayId(u.id),
                                                                    o.lst[u.id].ally = mhCol.AllyName_PlayId(u.id))
                    });
                    break;
                case "olympus_temple":
                    o.img = r.find(".temple_image_wrapper .temple_image").css("background-image"),
                        o.img = o.img.substr(o.img.indexOf("http"), o.img.length),
                        o.img = o.img.substr(0, o.img.indexOf("png") + 3);
                    break;
                case "agora_in":
                    m = 0,
                        o.txt_obrona = r.find("#place_defense #defense_header").html().clear(),
                        o.title = o.txt_obrona + " " + Game.townName,
                        o.movs = {},
                        $.each(r.find("li.place_units"), function(i, e) {
                        var t = ""
                        , n = "";
                        $(e).children("h4").children("a.gp_town_link").length && (t = MH.bbc(MH.Link2Struct($(e).children("h4").children("a.gp_town_link").attr("href")).id.toString(), "town")),
                            $(e).children("h4").children("a.gp_player_link").length && (n = MH.bbc($(e).children("h4").children("a.gp_player_link").html(), "player")),
                            0 != i && 1 != i || void 0 !== (c = $(e).attr("id")) && 0 != c || 0 == i && (m = 1),
                            i += m,
                            o.movs[i] = {},
                            o.movs[i].titleOrg = $(e).children("h4").html(),
                            o.movs[i].title = "" != n ? $(e).children("h4").html().replace(/(.*)<a.*\/a>.*(<a.*\/a>).*/, "$1") + t + " (" + n + ")" : $(e).children("h4").html().replace(/(.*)<a.*\/a>/, "$1") + t,
                            o.movs[i].unit_list = [],
                            o.movs[i].unit_send = [],
                            $.each($(e).children("div"), function(e, t) {
                            var n = MH.htm.UnitId(t);
                            o.movs[i].unit_list.push(mhCNST.Units[n] || mhCNST.Units.unknown),
                                o.movs[i].unit_send.push(t.children[0].innerHTML.clear())
                        })
                    }),
                        void 0 === o.movs[0] && (o.movs[0] = {},
                                                 o.movs[0].titleOrg = MH.Lang.DeffA,
                                                 o.movs[0].title = MH.Lang.DeffA,
                                                 o.movs[0].unit_list = o.movs[1].unit_list,
                                                 o.movs[0].unit_send = o.movs[1].unit_send);
                    break;
                case "agora_out":
                    o.str = r.find("#place_defense .game_header").html().clear(),
                        o.title = o.str + " " + Game.townName,
                        o.movs = {},
                        $.each(r.find("li"), function(i, e) {
                        var t = ""
                        , n = "";
                        0 < $(e).children("h4").children("a.gp_town_link").length && (t = MH.bbc(MH.Link2Struct($(e).children("h4").children("a.gp_town_link").attr("href")).id.toString(), "town")),
                            0 < $(e).children("h4").children("a.gp_player_link").length && (n = MH.bbc($(e).children("h4").children("a.gp_player_link").html(), "player")),
                            o.movs[i] = {},
                            o.movs[i].titleOrg = $(e).children("h4").html(),
                            o.movs[i].title = "" != n ? $(e).children("h4").html().replace(/(.*)<a.*\/a>.*(<a.*\/a>).*/, "$1") + t + " (" + n + ")" : $(e).children("h4").html().replace(/(.*)<a.*\/a>/, "$1") + t,
                            o.movs[i].unit_list = [],
                            o.movs[i].unit_send = [],
                            $.each($(e).children("a.place_unit"), function(e, t) {
                            var n = $(t).attr("class").split(/\s/)[5];
                            o.movs[i].unit_list.push(mhCNST.Units[n] || mhCNST.Units.unknown),
                                o.movs[i].unit_send.push(t.children[0].innerHTML.clear())
                        })
                    });
                    break;
                case "wall":
                    o.def = {},
                        o.los = {},
                        o.def.att = {},
                        o.def.def = {},
                        o.los.att = {},
                        o.los.def = {},
                        o.txtWall = r.find("div.game_header").html().clear(),
                        o.def.txt = r.find("div.list_item_left h3").html().clear(),
                        o.def.txtAtt = $(r.find("div.list_item_left h4")[0]).html().clear(),
                        o.def.att = MH.htm.UnitsWall(r.find("div.list_item_left .wall_unit_container")[0]),
                        o.def.txtDef = $(r.find("div.list_item_left h4")[1]).html().clear(),
                        o.def.def = MH.htm.UnitsWall(r.find("div.list_item_left .wall_unit_container")[1]),
                        o.los.txt = r.find("div.list_item_right h3").html().clear(),
                        o.los.txtAtt = $(r.find("div.list_item_right h4")[0]).html().clear(),
                        o.los.att = MH.htm.UnitsWall(r.find("div.list_item_right .wall_unit_container")[0]),
                        o.los.txtDef = $(r.find("div.list_item_right h4")[1]).html().clear(),
                        o.los.def = MH.htm.UnitsWall(r.find("div.list_item_right .wall_unit_container")[1]),
                        1 == $("#rb_wall2").attr("sel") && (o.def.att.unit_list = o.def.att.unit_dlist,
                                                            o.def.def.unit_list = o.def.def.unit_dlist,
                                                            o.los.att.unit_list = o.los.att.unit_dlist,
                                                            o.los.def.unit_list = o.los.def.unit_dlist,
                                                            o.def.att.unit_count = o.def.att.unit_dcount,
                                                            o.def.def.unit_count = o.def.def.unit_dcount,
                                                            o.los.att.unit_count = o.los.att.unit_dcount,
                                                            o.los.def.unit_count = o.los.def.unit_dcount);
                    break;
                case "buildings":
                    !function() {
                        var e, t;
                        for (e in o.txt_widok = o.title + "-",
                             o.txt_widok = o.txt_widok.substring(0, o.txt_widok.indexOf("-")),
                             t = ITowns.towns[Game.townId].buildings(),
                             o.build = mhUtl.Clone(mhCNST.Buildings),
                             o.build)
                            o.build[e] = t.getBuildingLevel(e);
                        o.build.spc1 = o.build.spc2 = "",
                            "0" != o.build.theater && (o.build.spc1 = "theater"),
                            "0" != o.build.thermal && (o.build.spc1 = "thermal"),
                            "0" != o.build.library && (o.build.spc1 = "library"),
                            "0" != o.build.lighthouse && (o.build.spc1 = "lighthouse"),
                            "0" != o.build.tower && (o.build.spc2 = "tower"),
                            "0" != o.build.statue && (o.build.spc2 = "statue"),
                            "0" != o.build.oracle && (o.build.spc2 = "oracle"),
                            "0" != o.build.trade_office && (o.build.spc2 = "trade_office")
                    }();
                    break;
                case "academy_research":
                    !function() {
                        var e, t, n, i = [];
                        if (i[0] = ["slinger", "archer", "town_guard", "."],
                            i[1] = ["hoplite", "diplomacy", "meteorology", "."],
                            i[2] = ["espionage", "booty", "pottery", "."],
                            i[3] = ["rider", "architecture", "instructor", "."],
                            i[4] = ["bireme", "building_crane", "shipwright", "colonize_ship"],
                            i[5] = ["chariot", "attack_ship", "conscription", "."],
                            i[6] = ["demolition_ship", "catapult", "cryptography", "democracy"],
                            i[7] = ["small_transporter", "plow", "berth", "."],
                            i[8] = ["trireme", "phalanx", "breach", "mathematics"],
                            i[9] = ["ram", "cartography", "take_over", "."],
                            i[10] = ["stone_storm", "temple_looting", "divine_selection", "."],
                            i[11] = ["combat_experience", "strong_wine", "set_sail", "."],
                            "old" != Game.features.command_version && (i[6][3] = "."),
                            1 == Game.features.battlepoint_villages && (i[1][1] = ".",
                                                                        i[2][1] = "booty"),
                            t = ITowns.towns[Game.townId].researches(),
                            n = "",
                            $(".stone_storm").length)
                            for (y = 0; y < 4; y++)
                                for (x = 0; x < 14; x++)
                                    0 != x ? 13 != x ? (n += "[|]",
                                                        "." != (e = i[x - 1][y]) && (n += "[img]" + MH.Home + "a/" + String.fromCharCode(64 + x) + (y + 1),
                                                                                     3 == x && 1 == y && 1 == Game.features.battlepoint_villages && (n += "V"),
                                                                                     10 == x && 2 == y && "old" != Game.features.command_version && (n += "N"),
                                                                                     t.hasResearch(e) ? n += "a" : n += "i",
                                                                                     n += ".gif[/img]")) : n += "[|][/*]" : n += "[*]";
                        else
                            for (y = 0; y < 4; y++)
                                for (x = 0; x < 12; x++) {
                                    if (0 == y) {
                                        if (0 == x) {
                                            n += "[*]" + MH.WhtImg(53);
                                            continue
                                        }
                                        if (11 == x) {
                                            n += "[|]" + MH.WhtImg(53) + "[/*]";
                                            continue
                                        }
                                    } else {
                                        if (0 == x) {
                                            n += "[*]";
                                            continue
                                        }
                                        if (11 == x) {
                                            n += "[|][/*]";
                                            continue
                                        }
                                    }
                                    n += "[|]",
                                        "." != (e = i[x - 1][y]) && (n += "[img]" + MH.Home + "a/" + String.fromCharCode(64 + x) + (y + 1),
                                                                     3 == x && 1 == y && 1 == Game.features.battlepoint_villages && (n += "V"),
                                                                     10 == x && 2 == y && "old" != Game.features.command_version && (n += "N"),
                                                                     t.hasResearch(e) ? n += "a" : n += "i",
                                                                     n += ".gif[/img]")
                                }
                        o.html = n
                    }();
                    break;
                case "ally_profile":
                    !function() {
                        var n;
                        o.ally = r.parent().find(".ui-dialog-titlebar .ui-dialog-title").html().clear(),
                            o.txtMembers = r.find("#ally_towns .game_border .game_header.bold:first").html().clear(),
                            o.movs = {},
                            $.each(r.find("#ally_towns ul.members_list>li:nth-child(2) ul li"), function(e, t) {
                            n = MH.Link2Struct($(t).find("a.gp_player_link").attr("href")),
                                o.movs[e] = {},
                                o.movs[e].name = n.name,
                                o.movs[e].txt = $(t).find("div.small-descr").html().replace(/^\s*|\s(?=\s)|\t|\s*$/g, "")
                        }),
                            o.bbcode = MH.BBCodeFromJQ(r.find("#ally_profile .ally_bbcode")),
                            o.allyID = mhCol.AllyId_AllyName(o.ally),
                            o.nfo = {
                            id: null,
                            name: "?",
                            points: "?",
                            towns: "?",
                            members: "?",
                            rank: "?"
                        },
                            null != o.allyID && (o.nfo = mhCol.allys[o.allyID]),
                            o.img = MH.Home + "imgs/flag/allybig.gif",
                            r.find("#ally_image").length && (o.img = "https://" + Game.world_id + ".grepolis.com/image.php?alliance_id=" + o.allyID);
                        try {
                            if (r.find("#ally_profile .ally_bbcode").hasClass("centered"))
                                return $.post(MH.Home + "arcprofile.php", {
                                    lw: Game.world_id,
                                    ally: $(" #player_info h3").html(),
                                    delme: !0
                                }, function(e) {});
                            var e = o.bbcode
                            , t = o.ally;
                            $.post(MH.Home + "arcprofile.php", {
                                lw: Game.world_id,
                                ally: t,
                                bbco: e
                            }, function(e) {})
                        } catch (e) {}
                    }();
                    break;
                case "player_profile":
                    !function() {
                        var n;
                        o.play = r.find("#player_info h3").html().clear(),
                            o.ally = "",
                            r.find("#player_info>a").length && (o.ally = MH.utl.bbcodes_ally_name(r.find("#player_info>a"))),
                            o.movs = {},
                            $.each(r.find("#player_towns ul.game_list li"), function(e, t) {
                            n = MH.Link2Struct($(t).find("a.gp_town_link").attr("href")),
                                o.movs[e] = {},
                                o.movs[e].townID = n.id.toString(),
                                o.movs[e].txt1 = "" + $(t).find("span.small:eq(1)").html().clear().split("|")[0],
                                o.movs[e].txt2 = "" + $(t).find("span.small:eq(1)").html().clear().split("|")[1]
                        }),
                            o.bbcode = MH.BBCodeFromJQ(r.find("#player_profile").children().eq(1)),
                            o.playID = mhCol.PlayId_PlayName(o.play),
                            o.nfo = {
                            id: null,
                            name: "?",
                            allianceID: null,
                            points: "?",
                            rank: "?",
                            towns: "?"
                        },
                            null != o.playID && (o.nfo = mhCol.plays[o.playID]),
                            o.img = "https://" + Game.world_id + ".grepolis.com/images/game/profile/profile_default.png",
                            -1 == r.find("#profile_image img").attr("src").indexOf("profile_default.png") && (o.img = "https://" + Game.world_id + ".grepolis.com/image.php?player_id=" + o.playID);
                        try {
                            if (0 < $("#player_profile").children().eq(1).html().indexOf('<p class="profile_descr centered">'))
                                return $.post(MH.Home + "arcprofile.php", {
                                    lw: Game.world_id,
                                    player: $(" #player_info h3").html(),
                                    delme: !0
                                }, function(e) {});
                            var e = o.bbcode;
                            $.post(MH.Home + "arcprofile.php", {
                                lw: Game.world_id,
                                player: r.find("#player_info h3:first").html().clear(),
                                bbco: e
                            }, function(e) {})
                        } catch (e) {}
                    }();
                    break;
                case "island":
                    o.island = r.find("#island_bbcode_id").attr("value").replace(/\[island\](.*?)\[\/island\]/, "$1"),
                        o.sea = r.find(".islandinfo_coords").html().clear(),
                        o.free = r.find(".islandinfo_free").html().clear(),
                        o.movs = {},
                        $.each(r.find(".island_info_towns .game_border ul.game_list:visible:first li"), function(e, t) {
                        o.movs[e] = {},
                            o.movs[e].town = MH.Link2Struct($(t).find("a.gp_town_link").attr("href")).id,
                            o.movs[e].pnts = $(t).find("span:first").html().clear(),
                            o.movs[e].name = $(t).find(".player_name").html().clear(),
                            o.movs[e].ally = mhCol.AllyName_PlayName(o.movs[e].name)
                    });
                    break;
                case "ranking":
                    !function() {
                        function n(e, t, n) {
                            $(t).find(".r_" + n).length && (e[n] = $(t).find(".r_" + n).html().clear())
                        }
                        var e, t;
                        if (o.nTab = 0,
                            o.TabC = {},
                            o.TabN = {},
                            $.each(r.find("#ranking_fixed_table_header thead tr th"), function(e, t) {
                            o.TabC[o.nTab] = $(t).attr("class").substr(2),
                                o.TabN[o.nTab] = $(t).html().clear(),
                                o.nTab++
                        }),
                            o.movs = {},
                            $.each(r.find("#ranking_inner tr"), function(e, t) {
                            o.movs[e] = {},
                                n(o.movs[e], t, "rank"),
                                n(o.movs[e], t, "name"),
                                n(o.movs[e], t, "ally"),
                                n(o.movs[e], t, "points"),
                                n(o.movs[e], t, "towns"),
                                n(o.movs[e], t, "player"),
                                n(o.movs[e], t, "avg_points"),
                                n(o.movs[e], t, "wonder"),
                                n(o.movs[e], t, "stage"),
                                n(o.movs[e], t, "sea")
                        }),
                            o.txt = "[b]" + MH.GLng.World + ": " + MH.DB.worldID + " - " + MH.DB.wName + "[/b] " + r.parent().find(".ui-dialog-titlebar .ui-dialog-title").html().clear(),
                            e = r.parent().find(".ui-dialog-titlebar .menu_wrapper ul li a.active"),
                            o.txt += ":" + e.html().clear(),
                            "ranking-alliance" == (e = e.attr("id")) || "ranking-sea_alliance" == e || "ranking-kill_allianceatt" == e || "ranking-kill_alliancedef" == e || "ranking-kill_allianceall" == e || "ranking-wonder_allianceall" == e)
                            for (t in o.TabC[1] = "ally",
                                 o.movs)
                                o.movs[t].ally = o.movs[t].name
                    }();
                    break;
                case "ww_donations":
                    o.nTab = 0,
                        o.TabC = {},
                        o.TabN = {},
                        $.each(r.find("table.header_table thead tr th"), function(e, t) {
                        "col_scroll" != $(t).attr("class") && (o.TabC[o.nTab] = $(t).attr("class"),
                                                               o.TabN[o.nTab] = $(t).html().clear(),
                                                               o.nTab++)
                    }),
                        o.movs = {},
                        $.each(r.find("table .js-scrollbar-content tr"), function(e, t) {
                        o.movs[e] = {},
                            M(o.movs[e], t, "col_rank"),
                            M(o.movs[e], t, "col_name"),
                            M(o.movs[e], t, "col_wood"),
                            M(o.movs[e], t, "col_stone"),
                            M(o.movs[e], t, "col_silver"),
                            M(o.movs[e], t, "col_total"),
                            M(o.movs[e], t, "col_percentage"),
                            M(o.movs[e], t, "col_towns")
                    }),
                        o.txt = "[b]" + MH.GLng.World + ": " + MH.DB.worldID + " - " + MH.DB.wName + "[/b] [ally]" + Game.alliance_name + "[/ally] " + r.parent().find(".wnd_border_t .title").html().clear(),
                        o.txt += " - " + r.find(".caption").html().clear(),
                        o.txt += "\n\n" + r.find(".donation_title").html().clear() + ": ",
                        o.txt += r.find(".donation_total").html().clear() + "\n\n";
                    break;
                case "inventory":
                    o.title = i.find(".regular_inventory H1").html().clear(),
                        o.invN = [],
                        a.find(".regular_inventory .slots .slot").each(function(e, t) {
                        $(t).hasClass("disabled") ? o.invN[e] = "disabled" : $(t).hasClass("empty") ? o.invN[e] = "empty" : o.invN[e] = MH.htm.GetPowerImgFromClass($(t).find(".reward_icon"), !0)
                    }),
                        o.invEtxt = i.find(".premium_inventory>.headline>.middle").html().clear(),
                        o.invE = [],
                        a.find(".premium_inventory .slots .slot").each(function(e, t) {
                        $(t).hasClass("disabled") ? o.invE[e] = "disabled" : $(t).hasClass("empty") ? o.invE[e] = "empty" : o.invE[e] = MH.htm.GetPowerImgFromClass($(t).find(".reward_icon"), !0)
                    });
                    break;
                case "ally_events":
                    o.ally = o.title,
                        o.title += " " + Game.alliance_name,
                        o.events = [],
                        p = 1,
                        a.find("#ally_events_tabs .ui-tabs-panel").eq(2).is(":visible") && (p = 3),
                        a.find("#ally_events_tabs .ui-tabs-panel").eq(1).is(":visible") && (p = 2),
                        a.find("#ally_events_tabs .ui-tabs-panel").eq(0).is(":visible") && (p = 1),
                        o.nr = p,
                        o.tev = a.find("#ally_events_tabs ul li").eq(p - 1).html().clear(),
                        d = 0,
                        !void a.find("#ally_events_tabs .ui-tabs-panel").eq(p - 1).find("ul li").each(function(e, t) {
                        var n = $(t).html();
                        n = (n = (n = (n = (n = (n = (n = (n = n.substr(n.indexOf('">') + 2)).substr(0, n.indexOf("<span>")).trim()).replace(/<a href\="#" onclick\="Layout\.playerProfile\.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[player]$1[/player]")).replace(/<a href\="javascript:void\(0\)" onclick\="Layout.allianceProfile.open\('(.*?)',(.*?)\)">(.*?)<\/a>/gi, "[ally]$1[/ally]")).replace("gp_player_link", "fp_player_link")).replace(/<a href\="#(.*?)" class\="fp_player_link">(.*?)<\/a>/gi, "[player]$2[/player]")).replace(/<a href\="(.*?)" class\="gp_town_link">(.*?)<\/a>/gi, "[town]$2[/town]")).replace(/<a href\="#(.*?)" class\="gp_player_link">(.*?)<\/a>/gi, "[player]$2[/player]"),
                            o.events[d] = {},
                            o.events[d].txt = n,
                            o.events[d].img = $(t).find("img").attr("src"),
                            o.events[d].dat = $(t).find("span").html().clear(),
                            d++
                    });
                    break;
                case "easter_recipes":
                    o.html = i.find(".tab.recipes .middle").html().clear() + "\n",
                        o.title = DM.getl10n("easter").window_title + " - " + i.find(".tab.recipes .middle").html().clear() + "\n",
                        o.recipes = {},
                        a.find(".recipes_group").each(function(i, e) {
                        var t = $(e).find(".recipe");
                        t.length && (o.recipes[i] = {},
                                     o.recipes[i].name = $(e).find(".reward_name").html().clear(),
                                     o.recipes[i].rec = {},
                                     $.each(t, function(n, e) {
                            o.recipes[i].rec[n] = [],
                                $.each($(e).find(".single_recipe_box "), function(e, t) {
                                switch (e) {
                                    case 0:
                                    case 1:
                                    case 2:
                                        o.recipes[i].rec[n][e] = $(t).find("DIV:first").attr("class").replace("easter_ingredient", "").replace("easter_skin_incantation", "").clear();
                                        break;
                                    case 3:
                                        o.recipes[i].rec[n][e] = MH.htm.GetPowerImgFromClass($(t).find("DIV:first"), !1)
                                }
                            })
                        }))
                    });
                    break;
                case "hercules_fight_result":
                    l = $(".hercules2014_fight_result"),
                        o.Title = $(".classic_window.hercules2014 .wnd_border_t .title").html().clear(),
                        o.txtBattle = $(".classic_sub_window.campaign_fight_result .title").html().clear(),
                        o.att.txt = l.find(".hercules_units_box.blue .hub_title").html().clear(),
                        o.def.txt = l.find(".hercules_units_box.red .hub_title").html().clear(),
                        o.luck = l.find("span.factor.clover").html().clear(),
                        "" != o.luck && (-1 < o.luck.indexOf("-") ? o.luck = "[img]" + MH.Home + "r/rluck.png[/img] [color=#b50307]" + o.luck + "[/color]" : o.luck = "[img]" + MH.Home + "r/rluck.png[/img] " + o.luck),
                        o.artillery = "[img]" + MH.Home + "r/rartillery.png[/img] " + l.find("span.factor.hercules").html().clear(),
                        o.txtRes = l.find("h3:first").html().clear(),
                        o.txtRew = l.find(".reward_icon_box .caption").html().clear(),
                        o.Pow = MH.htm.GetPowerImgFromClass(l.find(".reward_icon_box .scroll .rwrd_container .reward:first"), !1),
                        o.att = MH.htm.HerculesUnits(o.att, ".box_my_army.hercules_units_box .hub_content .hercules2014_mercenaries_box .mercenary"),
                        o.def = MH.htm.HerculesUnits(o.def, ".box_enemy_army.hercules_units_box .hub_content .hercules2014_mercenaries_box .mercenary"),
                        !void (o.def.unit_list = o.def.unit_list.replace(/Y/g, "Z"))
            }
        function M(e, t, n) {
            $(t).find("." + n).length && (e[n] = $(t).find("." + n).html().clear())
        }
        function H(e, t) {
            var n;
            e.player = "?",
                r.find(t + " a.gp_town_link").length ? e.town = MH.Link2Struct(r.find(t + " a.gp_town_link").attr("href")).id : e.town = r.find(t + " li:first").html().clear(),
                r.find(t + " a.gp_player_link").length && (n = MH.Link2Struct(r.find(t + " a.gp_player_link").attr("href")),
                                                           e.player = n.name,
                                                           e.player_id = n.id,
                                                           e.ally = mhCol.AllyName_PlayId(n.id)),
                r.find(t + " .flagpole.ghost_town").length && (e.townT = "ghost",
                                                               e.player = DM.getl10n("common").ghost_town),
                r.find(t + " .island_bg.farm").length && (e.townT = "farm",
                                                          e.player = MH.Lang.Farm),
                r.find(t + " .report_town_bg_quest").length && (e.townT = "quest",
                                                                e.player = DM.getl10n("island_quests").window_title),
                r.find(t + " .flag_foundation").length && (e.townT = "found",
                                                           e.player = Game.player_name,
                                                           e.player_id = Game.player_id,
                                                           e.ally = Game.alliance_name)
        }
        return o.type = t,
            o;
        function w(e) {
            var t = e.indexOf(":");
            if (t < 2)
                return null;
            var n = e[t - 2] + e[t - 1] + ":" + e[t + 1] + e[t + 2] + ":" + e[t + 4] + e[t + 5];
            return "." != (e = (e = (e = e.replace(n, "")).replace(/^\s+|\s+$/g, "")).replace(/[^0-9]/g, ".")).charAt(2) && (e = (t = e.split("."))[2] + ".",
                                                                                                                             e += t[1] + ".",
                                                                                                                             e += t[0]),
                e + " " + n
        }
        function v(e, t, n) {
            return (n = n || r).find(e).length ? t ? "[img]" + t + "[/img] " + n.find(e).html().clear() : n.find(e).html().clear() : ""
        }
        function k(e) {
            var t, n, i, a;
            return "unknown" == (t = "MHconquest_" == (a = e).substr(0, 11) ? "conquest" : (a = r.find("#" + a)).length ? a.find(".power_report").length ? "powers_wisdom" : a.find(".espionage_report").length ? "espionage" : a.find(".report_side_defender").length ? "attack" : a.find(".report_losts").length ? "attack_support" : "unknown" : "unknown") || (a = r.find("#" + e),
        o.type = t,
        o.forum = !0,
        o.title = a.find(".published_report_header .bold").html().clear(),
        o.time = a.find(".published_report_header .reports_date").html().clear(),
        "attack" == t && (o.bp = {},
                          o.bp.count = "",
                          o.bp.txt = "",
                          o.att = {},
                          n = a.find(".published_report_header .bold a.gp_town_link:first"),
                          i = a.find(".published_report_header .bold a.gp_player_link:first"),
                          o.att.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                          o.att.townName = n.html().clear(),
                          i.length ? n.next().hasClass("gp_player_link") ? o.att.playerName = i.html().clear() : o.att.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id) : o.att.playerName = o.title.replace(/(.*?)\((.*?)\)(.*?)/gi, "$2"),
                          o.att.player = MH.bbc(o.att.playerName, "player"),
                          o.att.ally = MH.bbc(mhCol.AllyName_PlayName(o.att.playerName), "ally"),
                          o.def = {},
                          n = a.find(".published_report_header .bold a.gp_town_link:last"),
                          o.def.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                          o.def.townName = n.html().clear(),
                          i.length ? n.next().hasClass("gp_player_link") ? o.def.playerName = i.html().clear() : o.def.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id) : o.def.playerName = DM.getl10n("common").ghost_town,
                          o.def.player = MH.bbc(o.def.playerName, "player"),
                          o.def.ally = MH.bbc(mhCol.AllyName_PlayName(o.def.playerName), "ally"),
                          o.ico = "/images/game/towninfo/" + a.find(".attack_type_img").attr("class").split(" ").pop() + ".png",
                          o.load = v("#load", !1, a),
                          n = a.find("table.report_details .report_icon.morale").parent().html().clear().replace(/\s+/g, " "),
                          o.morale = "[img]" + MH.Home + "r/rmorale.png[/img] " + n.substr(0, n.indexOf("%") + 1),
                          o.luck = n.substr(n.indexOf("%") + 2, n.length),
                          "" != o.luck && (-1 < o.luck.indexOf("-") ? o.luck = "[img]" + MH.Home + "r/rluck.png[/img] [color=#b50307]" + o.luck + "[/color]" : o.luck = "[img]" + MH.Home + "r/rluck.png[/img] " + o.luck),
                          o.oldwall = "",
                          o.nightbonus = "",
                          n = a.find("table.report_details .report_icon.oldwall").parent(),
                          i = a.find("table.report_details .report_icon.nightbonus").parent(),
                          n.length && (n = n.parent().html().clear().replace(/\s+/g, " "),
                                       o.oldwall = "[img]" + MH.Home + "r/rwall.png[/img] " + n.substr(0, n.length)),
                          i.length && (n = i.parent().html().clear().replace(/\s+/g, " "),
                                       o.nightbonus = "[img]" + MH.Home + "r/rnbonus.png[/img] " + n.substr(0, n.length)),
                          o.att.pow = o.def.pow = "",
                          $.each(a.find("div.report_side_attacker div.report_power"), function(e, t) {
                o.att.pow += MH.htm.getPowerIcon($(t))
            }),
                          $.each(a.find("div.report_side_defender div.report_power"), function(e, t) {
                o.def.pow += MH.htm.getPowerIcon($(t))
            }),
                          o.att.w = o.att.s = o.att.i = o.att.p = o.att.f = 0,
                          o.def.w = o.def.s = o.def.i = o.def.p = o.def.f = 0,
                          o.att = MH.htm.UnitsL(o.att, "#" + e + " div.report_side_attacker_unit"),
                          $("#" + e + " div.report_side_defender_unit").length ? o.def = MH.htm.UnitsL(o.def, "#" + e + " div.report_side_defender_unit") : (o.def.unit_list = [],
        o.def.unit_send = [],
        o.def.unit_lost = []),
                          o.res.count = "",
                          o.res.txt = v(".resources .small.bold:first", !1, a),
                          a.find(".resources .resource_count").each(function(e, t) {
                switch (o.res.count += MH.bbcU(t.innerHTML, "000") + "¨",
                        e) {
                    case 0:
                        o.res.wood = t.innerHTML;
                        break;
                    case 1:
                        o.res.stone = t.innerHTML;
                        break;
                    case 2:
                        o.res.iron = t.innerHTML;
                        break;
                    case 3:
                        o.res.favor = t.innerHTML
                }
            }),
                          o.attacktxt = "",
                          $("#" + e + " .resources > span.bold").each(function(e, t) {
                $(t).attr("id") || (o.attacktxt = $(t).html().replace(/\s+/g, " ").replace("<br>", "\n").clear() + "\n")
            })),
        "attack_support" == t && (o.att = {},
                                  n = a.find(".published_report_header .bold a.gp_town_link:first"),
                                  i = a.find(".published_report_header .bold a.gp_player_link:first"),
                                  o.att.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                                  o.att.townName = n.html().clear(),
                                  i.length ? n.next().hasClass("gp_player_link") ? o.att.playerName = i.html().clear() : o.att.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id) : o.att.playerName = o.title.replace(/(.*?)\((.*?)\)(.*?)/gi, "$2"),
                                  o.att.player = MH.bbc(o.att.playerName, "player"),
                                  o.att.ally = MH.bbc(mhCol.AllyName_PlayName(o.att.playerName), "ally"),
                                  o.def = {},
                                  n = a.find(".published_report_header .bold a.gp_town_link:last"),
                                  i = a.find(".published_report_header .bold a.gp_player_link:last"),
                                  o.def.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                                  o.def.townName = n.html().clear(),
                                  i.length ? n.next().hasClass("gp_player_link") ? o.def.playerName = i.html().clear() : o.def.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id) : o.def.playerName = DM.getl10n("common").ghost_town,
                                  o.def.player = MH.bbc(o.def.playerName, "player"),
                                  o.def.ally = MH.bbc(mhCol.AllyName_PlayName(o.def.playerName), "ally"),
                                  o.att.unit_list = ["xx"],
                                  o.att.unit_send = ["?"],
                                  o.att.unit_lost = ["?"],
                                  o.att.w = o.att.s = o.att.i = o.att.p = o.att.f = "?",
                                  o.def.unit_list = o.def.unit_send = o.def.unit_lost = "",
                                  o.def.w = o.def.s = o.def.i = o.def.p = o.def.f = 0,
                                  o.player = "?",
                                  o.def = MH.htm.UnitsL(o.def, "#" + e + " div.report_side_attacker_unit"),
                                  o.txt = r.find("#" + e + " div.report_units .small.bold").html().toLowerCase()),
        "espionage" == t && (o.att = {},
                             o.SpyOk = !0,
                             o.spygoodtitle = DM.getl10n("layout").premium_button.premium_menu.gods_overview,
                             o.spygod = "?",
                             n = a.find(".published_report_header .bold a.gp_town_link:first"),
                             i = a.find(".published_report_header .bold a.gp_player_link:first"),
                             o.att.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                             o.att.townName = n.html().clear(),
                             n.next().hasClass("gp_player_link") ? o.att.playerName = i.html().clear() : o.att.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id),
                             o.att.player = MH.bbc(o.att.playerName, "player"),
                             o.att.ally = MH.bbc(mhCol.AllyName_PlayName(o.att.playerName), "ally"),
                             o.def = {},
                             n = a.find(".published_report_header .bold a.gp_town_link:last"),
                             i = a.find(".published_report_header .bold a.gp_player_link:last"),
                             o.def.town = MH.bbc(MH.Link2Struct(n.attr("href")).id.toString(), "town"),
                             o.def.townName = n.html().clear(),
                             i.length ? n.next().hasClass("gp_player_link") ? o.def.playerName = i.html().clear() : o.def.playerName = mhCol.PlayName_TownID(MH.Link2Struct(n.attr("href")).id) : o.def.playerName = DM.getl10n("common").ghost_town,
                             o.def.player = MH.bbc(o.def.playerName, "player"),
                             o.def.ally = MH.bbc(mhCol.AllyName_PlayName(o.def.playerName), "ally"),
                             o.def = MH.htm.Units(o.def, "#" + e + " div.spy_units>div.report_unit"),
                             o.def.title = a.find(".spy_units>.small.bold:first").html().clear(),
                             o.build = {},
                             o.build.title = r.find("#" + e + " div.spy_buildings>.small.bold").html().clear(),
                             o.build.unit_list = o.build.unit_send = o.build.unit_img = "",
                             o.build = MH.htm.Buildings(o.build, "#" + e + " div.spy_buildings>div.report_unit"),
                             o.iron = {},
                             o.iron.title = r.find("#" + e + " .spy_payed>.small.bold.clear")[0].innerHTML.clear(),
                             o.iron.count = r.find("#" + e + " .spy_payed>.small")[1].innerHTML.clear(),
                             o.res = {},
                             o.res.title = "",
                             o.res.detail = "",
                             o.res.image = "",
                             o.res.count = "",
                             o.res.wood = "",
                             o.res.stone = "",
                             o.res.iron = "",
                             o.res.title = $("#" + e + " .spy_resources>.small.bold.clear")[0].innerHTML.clear(),
                             $.each($("#" + e + " .spy_resources>.resources .resource_count"), function(e, t) {
                switch (o.res.count += MH.bbcU(t.innerHTML, "000") + " ",
                        e) {
                    case 0:
                        o.res.wood = t.innerHTML;
                        break;
                    case 1:
                        o.res.stone = t.innerHTML;
                        break;
                    case 2:
                        o.res.iron = t.innerHTML
                }
            })),
        "powers_wisdom" == t && (o.res = {},
                                 o.res.image = "",
                                 o.res.unit_list = [],
                                 o.res.unit_send = [],
                                 o.efekt = {},
                                 o.efekt.det = $("#" + e + " div.spy_units>.small.bold").html().clear(),
                                 o.efekt.title = $("#" + e + " div.published_report_header>.bold").html().clear(),
                                 o.powid = "wisdom",
                                 o.powimg30 = MH.bbc(MH.Home + "pow/" + o.powid + ".png", "img"),
                                 o.powimg16 = MH.bbc(MH.Home + "pow/" + o.powid + ".png", "img"),
                                 o.powtype = 0,
                                 o.txt = GameData.powers[o.powid].description,
                                 o.txt2 = GameData.powers[o.powid].effect,
                                 o.god = GameData.powers[o.powid].god_id,
                                 o.favor = GameData.powers[o.powid].favor,
                                 o.powtime = GameData.powers[o.powid].lifetime,
                                 o.powtype = 2,
                                 o.res = MH.htm.Units(o.def, "#" + e + " div.spy_units>div.report_unit"),
                                 o.powimg30 = MH.bbc(MH.Home + "pow/gb2.png", "img"),
                                 t = "powers"),
        "conquest" == t && (r = $("#" + e),
                            o.time_on = r.find(".report_side_attacker p:first").html().clear(),
                            o.time_at = "",
                            o.att = {},
                            o.def = {},
                            o.command = {},
                            o.txt_allunits = r.find(".report_side_attacker h4:first").html().clear(),
                            o.att.town = MH.bbc(MH.Link2Struct(r.find(".published_report_header span a").eq(0).attr("href")).id.toString(), "town"),
                            o.def.town = MH.bbc(MH.Link2Struct(r.find(".published_report_header span a").eq(1).attr("href")).id.toString(), "town"),
                            o.def.player = DM.getl10n("common").ghost_town,
                            r.find(".published_report_header span a").eq(2).length && (o.def.player = MH.bbc(r.find(".published_report_header span a").eq(2).html(), "player")),
                            o.att = MH.htm.Units(o.att, "#" + e + " div.report_unit"),
                            o.txt_ruchy = r.find(".report_side_defender h4:first").html().clear(),
                            o.movs = [],
                            $.each(r.find("#unit_movements>li"), function(e, t) {
                o.movs[e] = {},
                    o.movs[e].inout = "in",
                    o.movs[e].img = $(t).find("img.command_type").attr("src"),
                    o.movs[e].id = o.movs[e].img.replace(/(.*?)game\/unit_overview\/(.*?).png/gi, "$2"),
                    o.movs[e].time_at = $(t).find("div span:first").html().clear(),
                    o.movs[e].time_on = "",
                    o.movs[e].town = MH.Link2Struct($(t).find("div a:first").attr("href")).id,
                    o.movs[e].player = MH.Link2Struct($(t).find("div a").eq(1).attr("href")).name
            }))),
                t
        }
        function S() {
            var e = "#report_game_body p ";
            r.find(e).length || (e = "#report_game_body ");
            var t = 0 == r.find(e + "a.gp_town_link").length ? "" : MH.bbc(MH.Link2Struct(r.find(e + "a.gp_town_link").attr("href")).id.toString(), "town")
            , n = 0 == r.find(e + "a.gp_town_link:eq(1)").length ? "" : MH.bbc(MH.Link2Struct(r.find(e + "a.gp_town_link:eq(1)").attr("href")).id.toString(), "town")
            , i = 0 == r.find(e + "a.gp_player_link").length ? "" : MH.bbc(r.find(e + "a.gp_player_link").html(), "player");
            o.html = r.find(e).html().trim(),
                o.html = o.html.replace(/<a.*gp_player_link.*\/a> /, i + " "),
                o.html = o.html.replace(/<a.*gp_town_link.*\/a>:/, t + ":"),
                o.html = o.html.replace(/<a.*gp_town_link.*\/a> /, t + " "),
                o.html = o.html.replace(/<a.*gp_town_link.*\/a>./, n + ".")
        }
    }
        ,
        MH.rep.BD_raise = function(e) {
        return r = "[table][*]" + MH.WhtImg(348) + "[center]\n",
            MH.gRAP.AttU ? r += MH.rep.Units(e.att, 6, e.att.pow) : r += "[img]" + MH.Home + "gui/hidden.gif[/img]",
            r += "[/center][|]" + MH.WhtImg(348) + "[center]\n",
            MH.gRAP.DefU ? ("" != e.oldwall && (r += e.oldwall + "\n"),
                            r += MH.rep.Units(e.def, 6, e.def.pow)) : r += "[img]" + MH.Home + "gui/hidden.gif[/img]",
            r += "[/*][/table]",
            r
    }
        ,
        MH.rep.wCNV = !1,
        MH.rep.wnd_repBBCode = function(e) {
        MH.rep.wCNV.find("#MHrepBBCode").html(e),
            MH.rep.wCNV.find("#MHrepBBCode")[0].select()
    }
        ,
        MH.rep.wnd_repView = function(e) {
        e = MH.BBCode2HTML(e);
        0 == e && (e = "ERROR:( Can't See, but bbCode is OK ;)"),
            MH.rep.wCNV.find("#MHrepView").html(e),
            MH.ReportsView("#MHrepView"),
            MH.ev.ren.AllWnds({
            cJQ: MH.rep.wCNV,
            type: "wRepCnv"
        })
    }
        ,
        MH.rep.wnd_repOptions = function() {
        var e = [];
        switch (MH.rep.RT) {
            case "support":
                e = ["AllU"];
                break;
            case "command":
                e = ["AllU", "SelT"];
                break;
            case "breach":
            case "attack":
            case "take_over":
                e = ["AttU", "DefU", "AttT", "DefT", "Booty", "Booty2", "Bpnt", "Costs"];
                break;
            case "espionage":
                e = ["AllU", "SpyB", "SpyC", "SpyR", "AttT", "DefT"];
                break;
            case "command_curator":
                e = ["AllU", "cmdIN", "cmdOUT", "cmdRET", "cmdAtt", "cmdSup", "cmdSpy", "cmdFarm", "cmdRevA", "cmdRevR", "cmdOcu"];
                break;
            case "conquest":
            case "conquerold":
                break;
            case "attack_support":
                e = ["AttT", "DefT", "Costs"];
                break;
            case "powers":
                e = ["DefT"];
                break;
            case "raise":
                e = ["AttU", "DefU"];
                break;
            case "commands_list":
                e = ["SelT", "cmdIN", "cmdOUT", "cmdRET", "cmdAtt", "cmdSup", "cmdSpy", "cmdFarm", "cmdRevA", "cmdRevR", "cmdOcu"];
                break;
            case "ally_profile":
            case "player_profile":
                e = ["PrfB", "PrfA"];
                break;
            case "agora_in":
                e = ["DeffA", "TwnU", "PlyU"];
                break;
            case "player_info":
                e = ["PrfB", "AllU"];
                break;
            case "wall":
                MH.Glng.WalDA = MH.Glng.WalDef + " " + MH.Glng.WalA,
                    MH.Glng.WalDD = MH.Glng.WalDef + " " + MH.Glng.WalD,
                    MH.Glng.WalLA = MH.Glng.WalLos + " " + MH.Glng.WalA,
                    MH.Glng.WalLD = MH.Glng.WalLos + " " + MH.Glng.WalD,
                    e = ["WalDA", "WalLA", "WalDD", "WalLD"]
        }
        var i = "";
        return $.each(e, function(e, t) {
            var n = "...";
            void 0 !== MH.Lang[t] && (n = MH.Lang[t]),
                void 0 !== MH.Glng[t] && (n = MH.Glng[t]),
                void 0 !== MH.GLng[t] && (n = MH.GLng[t]),
                i += MH.gui._CB(n, MH.gRAP[t], t)
        }),
            i
    }
        ,
        MH.rep.wnd_Show = function() {
        var e = MH.wndCreate("wRepCnv", MH.Lang.norka + " - " + MH.Lang.konwrap, 1e3, 600)
        , t = '<div><div class="game_border" style="width:772px; height:531px; float:left">' + MH.gui.game_border_corners() + '<div class="game_inner_box"><div class="game_header bold"><span class="title">' + MH.Lang.reprv + '</span></div><div id="MHRepParts" class="forum_pager" style="padding:5px 10px;"><strong id="paginator_selected" class="paginator_bg">1</strong></div><ul class="game_list view_topic" style="height:470px; overflow-x:hidden; overflow-y:scroll;"><li class="post odd" id="MHrepView" style="width:746px;"><br><br><br><br><br><center><img alt="Loading ..." src="' + MH.Home + 'imgs/loader.gif"/></center></li></ul></div></div><div style="float:right; width:212px; height:100%; position:absolute; right:0; top:0;"><div class="game_border" style="width:100%; height:82%; position:absolute; right:0; top:0; background:url(\'' + MH.GameImg + "/images/game/popup/middle_middle.png') repeat;\">" + MH.gui.game_border_corners() + '<div class="game_inner_box" id="MHrepCFG"><div class="game_header bold"><span class="title">' + MH.Lang.repopt + '</span></div><div class="box middle center" style="margin:4px 4px;"><span>' + MH.Lang.repwzo + ':</span><div class="box_content">' + MH.gui._RB(MH.Lang.repwzo1, 0 == MH.gRAP.Style, 0) + MH.gui._RB("MiniSpace", 1 == MH.gRAP.Style, 1) + MH.gui._RB("MonoSpace", 2 == MH.gRAP.Style, 2) + '</div></div><div class="box middle center" style="margin:4px 4px;"><span>' + MH.GLng.Show + ':</span><div class="box_content">' + MH.gui._CB(MH.Lang.title, MH.gRAP.Title, "Title") + MH.gui._CB(MH.Lang.date, MH.gRAP.Date, "Date") + MH.rep.wnd_repOptions() + '</div></div></div></div><div class="game_border" style="width:100%; height:14%; position:absolute; right:0; bottom:0;">' + MH.gui.game_border_corners() + '<div class="game_inner_box" id="MHrepBBC"><div class="game_header bold"><span class="title">bbCode</span></div><textarea id="MHrepBBCode" style="width:208px; height:100%; font-size:75%;" readonly="true" onclick="this.select()">...</textarea></div></div></div></div>';
        e.setContent(t),
            MH.ev.WAR("wRepCnv", "OwnWnds", ""),
            MH.rep.wCNV = e.getJQElement(),
            MH.gui._append_html_events(MH.rep.wCNV),
            MH.rep.wCNV.find("#MHrepCFG").append(mhGui.Button(MH.Lang.repgen).css({
            width: "208px",
            bottom: "0",
            position: "absolute"
        }).click(function() {
            MH.rep.wCNV.find("#MHrepView").html('<br><br><br><br><br><center><img alt="Loading ..." src="' + MH.Home + 'imgs/loader.gif"/></center>'),
                MH.rep.RepMake()
        })),
            MH.rep.wCNV.find("#MHrepBBC").append(mhGui.But(2, "position:absolute; left:188px; top:0px;").click(function() {
            MH.RepClipboard = MH.rep.wCNV.find("#MHrepBBCode").val(),
                this.style.background = "url('" + MH.Home + "medias/images/but.png') repeat scroll -22px 0px rgba(0, 0, 0, 0)"
        }).mousePopup(new MousePopup(MH.Lang.repRec))),
            MH.rep.wCNV.find("#MHrepBBC").append(mhGui.But(14, "position:absolute; left:166px; top:0px;").click(function() {
            MH.BBCode_2ForumWnd(MH.rep.wCNV.find("#MHrepBBCode").val())
        }).mousePopup(new MousePopup(MH.Lang.bbc2f_get))),
            GPWindowMgr.is_open(GPWindowMgr.TYPE_REPORT) && MH.rep.wCNV.append($("<a/>", {
            class: "button",
            href: "#",
            style: "width:170px; position:absolute; top:4px; right:36px; z-index:1000;"
        }).append($("<span/>", {
            class: "left"
        }).append($("<span/>", {
            class: "right"
        }).append($("<span/>", {
            class: "middle"
        }).text(MH.Lang.PostTxt))).append($("<span/>", {
            style: "clear: both; "
        }))).click(function() {
            var e = MH.rep.wnds.report.jGP.find(".gpwindow_content").html().trim();
            MH.Call("rep", {
                rep: MH.utl.StringReverse(e)
            }, function() {
                HumanMessage.success(MH.Lang.PostOk)
            }, function() {
                HumanMessage.error(MH.Lang.PostFail)
            })
        })),
            MH.rep.RepMake()
    }
        ,
        MH.rep.RepMake = function() {
        MH.rep.wCNV && (MH.gRAP.Style = 0,
                        "1" == MH.rep.wCNV.find("#MHrepCFG .box_content>#RB_1").attr("sel") && (MH.gRAP.Style = 1),
                        "1" == MH.rep.wCNV.find("#MHrepCFG .box_content>#RB_2").attr("sel") && (MH.gRAP.Style = 2),
                        MH.rep.wCNV.find("#MHrepCFG .box_content>a.MHCB").each(function(e, t) {
            t = $(t).attr("id").replace("CB_", "");
            MH.gRAP[t] = mhGui.CheckBoxVal("CB_" + t)
        })),
            MH.gRAP.Style;
        var e = $.extend(!0, {}, MH.rep.REP_RD);
        MH.gRAP.AttT || null == e.att || (e.att.town = MH.bbc(MH.Lang.HIDDEN, "town"),
                                          e.title = e.title.replace(" (" + e.att.playerName + ")", ""),
                                          e.title = e.title.replace(e.att.townName, e.att.playerName)),
            MH.gRAP.DefT || null == e.def || (e.def.town = MH.bbc(MH.Lang.HIDDEN, "town"),
                                              e.title = e.title.replace(" (" + e.def.playerName + ")", ""),
                                              e.title = e.title.replace(e.def.townName, e.def.playerName));
        var t = null
        , n = null;
        null != MH.rep.wndt && (MH.rep.wnds.hasOwnProperty(MH.rep.wndt) || (t = MH.rep.wnds[MH.rep.wndt].wJQ)),
            1 == MH.gRAP.Style && (n = MH.rep.bbCodeMake_Mini(t, e)),
            2 == MH.gRAP.Style && (n = MH.rep.bbCodeMake_Mono(e)),
            null == n && (n = MH.rep.bbCodeMake_Norm(t, e)),
            null == n && (n = "Error - unknow report type ;("),
            n = n.clear(),
            n = (n = (n = (n = (n = MH.rep.RepMake_bbCodeCut(n)).replace(/\uFEFF\u2591/g, MH.bz)).replace(/\u00A8/g, MH.bz)).replace("[ally][/ally]", "")).replace("[ally]?[/ally]", ""),
            MH.rep.wCNV ? (MH.rep.wnd_repBBCode(n),
                           MH.rep.wnd_repView(n),
                           MH.Storage(MH.gRAPCookie, MH.gRAP)) : MH.RepClipboard = n,
            MH.rep.REP = n
    }
        ,
        MH.rep.RepMake_bbCodeCut = function(e) {
        for (var t, n = 494, i = "[/table][/quote][center][img]" + MH.Home + "r/cut1.gif[/img][/center]\n", a = "[img]" + MH.Home + "/gui/lsin.gif[/img]", o = p = cur = pubp = 0, r = [0, 0, 0, 0], l = [0, 0, 0, 0], s = 0; s < e.length; s++)
            "[" == e.charAt(s) && (o++,
                                   "*" != e.charAt(s + 1) && e.substring(s, s + 38) != a || (cur = s),
                                   n <= o && (0 == p && (n -= 20,
                                                         0 == MH.gRAP.Style && (n -= 32)),
                                              l[p] = cur,
                                              p++,
                                              r[p] = cur,
                                              o = cur = 0));
        if (0 == p)
            return e;
        if (l[p] = e.length,
            MH.rep.wCNV) {
            for (pubp = parseInt($("#MHRepParts #paginator_selected").html()),
                 pubp--,
                 isNaN(pubp) && (pubp = 0),
                 $("#MHRepParts").html(""),
                 s = 0; s <= p; s++)
                t = "<strong ",
                    s == pubp && (t += 'id="paginator_selected" '),
                    t += 'style="cursor:pointer;" class="paginator_bg">' + (s + 1) + "</strong>",
                    $("#MHRepParts").append(t);
            $("#MHRepParts .paginator_bg").click(function() {
                $("#MHRepParts #paginator_selected").removeAttr("id"),
                    $(this).attr("id", "paginator_selected"),
                    MH.rep.wCNV.find("#MHrepCFG .button").click()
            })
        }
        if (s = !1,
            l[pubp] < e.length && (s = !0),
            e = e.substring(r[pubp], l[pubp]),
            s && (e += i),
            0 == pubp)
            return e;
        if (0 != MH.gRAP.Style)
            return "[center][img]" + MH.Home + "r/cut2.gif[/img][/center][quote][table][*]" + MH.WhtImg(40) + "[|][font=monospace]" + e;
        switch (MH.rep.RT) {
            case "conquerold_troops":
            case "conquerold":
            case "conquest":
            case "commands_list":
                return "[center][img]" + MH.Home + "r/cut2.gif[/img][/center][quote][table][*]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(128) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(128) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(129) + "[|]" + MH.WhtImg(32) + "[|]" + MH.WhtImg(129) + e;
            case "ally_profile":
            case "player_profile":
                return "[center][img]" + MH.Home + "r/cut2.gif[/img][/center][quote][table][*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + e
        }
        return "[center][img]" + MH.Home + "r/cut2.gif[/img][/center][quote][table]" + e
    }
        ,
        MH.rep.bbCodeMake_Norm = function(e, a) {
        var t, n, o, r, l, s = "", s = c();
        switch (a.type) {
            default:
                return null;
            case "breach":
            case "take_over":
            case "attack":
                if (s += "[table][*]" + MH.WhtImg(283) + "[b]\n",
                    n = a.att.unit_list.length,
                    l = 0,
                    MH.gRAP.AttU)
                    for (; 0 < n; )
                        0 == l && (s += a.att.pow),
                            s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, a.att.unit_lost, l, 0, "2D2DFF", "FF2D2D"),
                            n -= 6,
                            l++;
                else
                    s += "[center][img]" + MH.Home + "gui/hidden.gif[/img][/center]";
                if (s += "[/b]",
                    r = "mid",
                    a.ico.match(/.*\/(attack).*/) && (r = "mida"),
                    a.ico.match(/.*\/(breach).*/) && (r = "midb"),
                    a.ico.match(/.*\/(conqueror).*/) && (r = "midt"),
                    a.ico.match(/.*\/(take_over).*/) && (r = "midr"),
                    a.oldbuld.length && (r = "mids"),
                    s += "[|][center][img]" + MH.Home + "r/" + r + ".gif[/img]\n",
                    MH.gRAP.Booty && null != a.load && (s += "[b]" + a.load + "\n"),
                    MH.gRAP.Booty2 && "" != a.res.count && (s += MH.rep.ResF(a.res)),
                    MH.gRAP.Bpnt && "" != a.bp.txt && (s += a.bp.txt + " [img]" + MH.Home + "r/bpnt.png[/img]" + a.bp.count),
                    s += "[/center][|]",
                    s += MH.WhtImg(283) + "[b]\n",
                    n = a.def.unit_list.length,
                    l = 0,
                    MH.gRAP.DefU)
                    for (; 0 < n; )
                        0 == l && (s += a.def.pow),
                            s += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, l, 0, "2D2DFF", "FF2D2D"),
                            n -= 6,
                            l++;
                else
                    s += "[center][img]" + MH.Home + "gui/hidden.gif[/img][/center]";
                s += "[/*]",
                    MH.gRAP.AttU || (a.att.w = a.att.i = a.att.s = a.att.p = a.att.f = "?"),
                    MH.gRAP.DefU || (a.def.w = a.def.i = a.def.s = a.def.p = a.def.f = "?"),
                    s += "[*][b]" + a.luck,
                    s += "\n" + a.morale,
                    s += "\n" + a.att.town,
                    s += "\n" + a.att.player,
                    s += "\n" + a.att.ally,
                    s += "[/b][|][font=monospace]",
                    MH.gRAP.Costs && (s += "[size=9][b]" + MH.utl.strNwht(a.att.w, 6) + " [img]" + MH.Home + "r/rwood.png[/img] " + MH.utl.strNwhtL(a.def.w, 6),
                                      s += "\n" + MH.utl.strNwht(a.att.s, 6) + " [img]" + MH.Home + "medias/images/rstone.png[/img] " + MH.utl.strNwhtL(a.def.s, 6),
                                      s += "\n" + MH.utl.strNwht(a.att.i, 6) + " [img]" + MH.Home + "medias/images/riron.png[/img] " + MH.utl.strNwhtL(a.def.i, 6),
                                      s += "\n" + MH.utl.strNwht(a.att.p, 6) + " [img]" + MH.Home + "medias/images/rpopu.png[/img] " + MH.utl.strNwhtL(a.def.p, 6),
                                      s += "\n" + MH.utl.strNwht(a.att.f, 6) + " [img]" + MH.Home + "medias/images/rfavor.png[/img] " + MH.utl.strNwhtL(a.def.f, 6)),
                    s += "[/font][|][b]",
                    a.oldwall.length && (s += "\n" + a.oldwall),
                    a.oldbuld.length && (s += "\n" + a.oldbuld),
                    a.nightbonus.length && (s += "\n" + a.nightbonus),
                    s += "\n" + a.def.town,
                    s += "\n" + a.def.player,
                    s += "\n" + a.def.ally,
                    0 < a.attacktxt.length && (s += "\n[img]" + MH.Home + "m/RR.png[/img]" + a.attacktxt),
                    s += "[/b][/*][/table]";
                break;
            case "raise":
                s += u(a, a.type, 0),
                    s += MH.rep.BD_raise(a);
                break;
            case "attack_support":
                s += u(a, a.type, 0),
                    s += "[table][*]" + MH.WhtImg(202),
                    s += "[center]\n",
                    s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, a.att.unit_lost, !1, !1, "2D2DFF", "FF2D2D"),
                    s += "[/center][|]",
                    MH.gRAP.Costs ? (s += "[font=monospace][size=9][b]",
                                     s += "? [img]" + MH.Home + "medias/images/rwood.png[/img] " + MH.utl.strNwhtL(a.def.w, 6),
                                     s += "\n? [img]" + MH.Home + "medias/images/riron.png[/img] " + MH.utl.strNwhtL(a.def.i, 6),
                                     s += "\n? [img]" + MH.Home + "medias/images/rstone.png[/img] " + MH.utl.strNwhtL(a.def.s, 6),
                                     s += "\n? [img]" + MH.Home + "medias/images/rpopu.png[/img] " + MH.utl.strNwhtL(a.def.p, 6),
                                     s += "\n? [img]" + MH.Home + "medias/images/rfavor.png[/img] " + MH.utl.strNwhtL(a.def.f, 6),
                                     s += "[/font]") : s += MH.WhtImg(85),
                    s += "[|][center]" + MH.WhtImg(400) + "\n",
                    s += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, 0, 10, "2D2DFF", "FF2D2D"),
                    0 < a.att.unit_list.length - 10 && mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, 1, 10, "2D2DFF", "FF2D2D"),
                    s += "[player]" + a.player + "[/player] - " + a.txt + "[/*]",
                    s += "[/table]";
                break;
            case "illusion":
                s += u(a, a.type, 0),
                    s += "[table][*][center]" + MH.WhtImg(705) + a.efekt.title + "[/center][/*][/table]";
                break;
            case "powers":
                var d = "gx";
                switch (a.god) {
                    case "zeus":
                        d = "ga";
                        break;
                    case "poseidon":
                        d = "gc";
                        break;
                    case "hera":
                        d = "gd";
                        break;
                    case "athena":
                        d = "gb";
                        break;
                    case "hades":
                        d = "ge";
                        break;
                    case "artemis":
                        d = "gf";
                        break;
                    case "aphrodite":
                        d = "gg";
                        break;
                    case "ares":
                        d = "gh"
                }
                switch ("chain_lightning" == a.powid && (d = "ga"),
                        "demoralizing_plague" == a.powid && (d = "ge"),
                        "mourning" == a.powid && (d = "gc"),
                        "suffering" == a.powid && (d = "gc"),
                        s += u(a, a.type, d),
                        s += "[table][*]" + MH.WhtImg(301) + "[center][b][color=#000080]" + a.efekt.title + "[/color][/b]\n" + a.txt + "\n[b][color=#008000]" + a.txt2 + "[/color]\n",
                        s += DM.getl10n("barracks").cost_details.favor + ": " + a.favor + "[/b][img]" + MH.Home + "r/rfavor.png[/img][/center][|]" + a.powimg30 + "[|]" + MH.WhtImg(300),
                        s += "[center][b][color=#000080]" + MH.Lang.spelleff + "[/color]\n\n[/b]",
                        a.powtype) {
                    case 1:
                        s += MH.rep.Res(a.res);
                        break;
                    case 2:
                        s += "[color=#008000][b]" + a.efekt.det + "[/b][/color]\n",
                            s += mhRep.UnitsNew(a.res.unit_list, a.res.unit_send, !1, 0, 6),
                            0 < a.res.unit_list.length - 6 && (s += mhRep.UnitsNew(a.res.unit_list, a.res.unit_send, !1, 1, 6));
                        break;
                    case 3:
                        s += "[color=#008000][b]" + a.efekt.det + "[/b][/color]\n",
                            s += MH.Lang.spelltime + ": " + MH.utl.secsToHHMMSS(a.powtime) + " h\n",
                            s += a.powend
                }
                if ("illusion" == a.powid && ("" == a.efekt.det2 ? s += a.efekt.det : (s += "atak za: " + a.efekt.det2,
                                                                                       s += "\nczas ataku " + a.efekt.det)),
                    "cleanse" == a.powid) {
                    s += a.efekt.det,
                        null != a.pID && (s += ":\n" + a.pID);
                    break
                }
                s += "[/center][/*][/table]";
                break;
            case "command_curator":
                for (i in s += "[center][size=12][b][player]" + Game.player_name + "[/player] - " + a.title + " [img]" + MH.Home + "r/curator.gif[/img][/b][/size]\n\n",
                     s += "[img]" + MH.Home + "r/hr.gif[/img][/center]",
                     o = n = 20,
                     t = -1,
                     a.movs)
                    a.movs[i].NoCmdTxt ? t = -1 : MH.rep.FiltrCommand(a.movs[i]) && (o < (t = mhRep.bbStrWidth(a.movs[i].townAN, a.movs[i].playerA, mhCol.AllyName_PlayName(a.movs[i].playerA.replace(/\[player\](.*?)\[\/player\]/, "$1")))) && (o = t),
                                                                                     n < (t = mhRep.bbStrWidth(a.movs[i].townBN, a.movs[i].playerB, mhCol.AllyName_PlayName(a.movs[i].playerB.replace(/\[player\](.*?)\[\/player\]/, "$1")))) && (n = t));
                for (i in t = 691,
                     t -= 52,
                     t -= o + n,
                     t = Math.ceil(t / 10),
                     t *= 10,
                     o = Math.floor(t / 50),
                     s += "[table][*][|][|][|][img]" + MH.Home + "i/" + t + ".gif[/img][/*]",
                     a.movs)
                    a.movs[i].NoCmdTxt || MH.rep.FiltrCommand(a.movs[i]) && (s += "[*][b]",
                                                                             s += "[town]" + a.movs[i].townIdA + "[/town]\n",
                                                                             s += a.movs[i].playerA + "\n",
                                                                             s += "[ally]" + mhCol.AllyName_PlayName(a.movs[i].playerA.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally][/b][|]",
                                                                             s += "[center]" + a.movs[i].time_at + "\n",
                                                                             "out" == a.movs[i].inout ? s += a.movs[i].img + "[img]" + MH.Home + "m/arR.png[/img]" : s += "[img]" + MH.Home + "m/arL.png[/img]" + a.movs[i].img,
                                                                             s += "[/center]",
                                                                             s += "[|][b]",
                                                                             s += "[town]" + a.movs[i].townIdB + "[/town]\n",
                                                                             s += a.movs[i].playerB + "\n",
                                                                             null != a.movs[i].playerB && (s += "[ally]" + mhCol.AllyName_PlayName(a.movs[i].playerB.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally][/b][|]"),
                                                                             MH.gRAP.HideUnits || a.movs[i].unit_list.length && (a.movs[i].unit_list.length < o ? s += mhRep.UnitsNew(a.movs[i].unit_list, a.movs[i].unit_send, !1, !1, !1, !1, !1, a.movs[i].power) : a.movs[i].unit_list.length == o ? ("" != a.movs[i].power && (s += a.movs[i].power + "[b]\n[/b]"),
            s += mhRep.UnitsNew(a.movs[i].unit_list, a.movs[i].unit_send)) : (s += mhRep.UnitsNew(a.movs[i].unit_list, a.movs[i].unit_send, !1, 0, o),
                                                                              s += mhRep.UnitsNew(a.movs[i].unit_list, a.movs[i].unit_send, !1, 1, o, !1, !1, a.movs[i].power))),
                                                                             s += "[/*]");
                s += "[/table]";
                break;
            case "commands_list":
                s += "[center]\n[b]" + MH.Lang.cmdToCity + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    s += MH.rep.Commands(a.movs);
                break;
            case "espionage":
                if (s += u(a, a.type, 0),
                    "" != a.build.title && a.SpyOk && MH.gRAP.SpyB && (s += "[center]" + MH.rep.Buldings(a.build, 15) + "[/center]"),
                    "" != a.build.title && a.SpyOk && MH.gRAP.AllU && (s += "[table][*][center]" + MH.WhtImg(705) + "\n[img]" + MH.Home + "r/uc.gif[/img][size=15][b] " + MH.Lang.AllU + ":[/*][*][center]",
                                                                       s += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send),
                                                                       s += "[/table]"),
                    s += "[table][*]" + MH.WhtImg(229) + "[center][img]" + MH.Home + "s/coins.gif[/img][/center][|]",
                    s += MH.WhtImg(228) + "[center][b]" + a.iron.title + "[/center]\n[center][img]" + MH.GameImg + "/images/game/hide/coins.png[/img] [size=26]",
                    MH.gRAP.SpyC ? s += a.iron.count : s += MH.Lang.HIDDEN,
                    s += "[/size][/center][|]",
                    "" != a.res.title && a.SpyOk && (MH.gRAP.SpyR ? s += MH.rep.Res(a.res) : s += "[center][color=#008000][b]" + a.res.title + "[/b][/color]\n[size=26]" + MH.Lang.HIDDEN + "[/size][/center]"),
                    a.SpyOk || (s += "[b]" + a.def.title + "[/b]"),
                    a.SpyOk) {
                    s += "[|]" + MH.WhtImg(80) + "[b]" + a.spygoodtitle + "\n[/b][img]";
                    d = "gx";
                    switch (a.spygod.toLowerCase()) {
                        case "zeus":
                            d = "ga";
                            break;
                        case "poseidon":
                            d = "gc";
                            break;
                        case "hera":
                            d = "gd";
                            break;
                        case "athena":
                            d = "gb";
                            break;
                        case "hades":
                            d = "ge";
                            break;
                        case "artemis":
                            d = "gf";
                            break;
                        case "aphrodite":
                            d = "gg";
                            break;
                        case "ares":
                            d = "gh"
                    }
                    s += MH.Home + "pow/" + d + ".png[/img]"
                }
                s += "[/*][/table]";
                break;
            case "conquest":
                1 == a.forum ? (s += MH.GLng.Town + ": " + a.def.town + " (" + MH.Lang.incoown + " " + a.def.player + " [ally]" + mhCol.AllyName_PlayName(a.def.player.replace(/\[ally\](.*?)\[\/ally\]/, "$1")) + "[/ally])\n",
                                s += MH.Lang.occupant + ": " + a.att.town + " [player]" + mhCol.PlayName_TownID(a.att.town.replace(/\[town\](.*?)\[\/town\]/, "$1")) + "[/player] [ally]" + mhCol.AllyName_PlayName(mhCol.PlayName_TownID(a.att.town.replace(/\[town\](.*?)\[\/town\]/, "$1"))) + "[/ally]\n",
                                s += a.time_on) : (s += MH.GLng.Town + ": " + a.def.town + " (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n",
                                                   s += MH.Lang.occupant + ": " + a.att.player + " [ally]" + mhCol.AllyName_PlayName(a.att.player.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally]\n",
                                                   s += MH.Lang.occuend + ": ~" + a.time_on + " [b]= " + a.time_at + "[/b]"),
                    MH.gRAP.HideDeffArmy || (s += "[table][*][img]" + MH.Home + "r/icq.gif[/img][|]" + MH.WhtImg(579) + "[center][size=14][img]" + MH.Home + "r/uc.gif[/img] " + a.txt_allunits + " [img]" + MH.Home + "r/ut.gif[/img][/size]\n",
                                             s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, null, 0, 11),
                                             0 < a.att.unit_list.length - 11 && (s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, null, 1, 11)),
                                             s += "[/center][|][img]" + MH.Home + "r/icqm.gif[/img][/*][/table]"),
                    MH.gRAP.HideIncoArmy || (s += MH.rep.Commands(a.movs));
                break;
            case "conquerold":
                o = a.def.town.replace(/\[town\](.*?)\[\/town\]/, "$1"),
                    l = mhCol.PlayId_TownID(o),
                    s += MH.GLng.Town + ": " + a.def.town + " (" + MH.Lang.incoown + " [player]" + mhCol.PlayName_PlayId(l) + "[/player] [ally]" + mhCol.AllyName_PlayName(mhCol.PlayName_PlayId(l)) + "[/ally])\n",
                    s += MH.Lang.occupant + ": [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally]\n",
                    s += a.txt_end + " [b]" + a.time_at + "[/b]",
                    MH.gRAP.HideDeffArmy || (s += "[table][*][img]" + MH.Home + "r/icq.gif[/img][|]" + MH.WhtImg(579) + "[center][size=14][img]" + MH.Home + "r/uc.gif[/img] " + a.txt_allunits + " [img]" + MH.Home + "r/ut.gif[/img][/size]\n",
                                             s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, null, 0, 11),
                                             0 < a.att.unit_list.length - 11 && (s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, null, 1, 11)),
                                             s += "[/center][|][img]" + MH.Home + "r/icqm.gif[/img][/*][/table]");
                break;
            case "conquerold_troops":
                s += "[center]\n[b]" + a.txtRuchy + " [/b] (" + MH.Lang.incoocu + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    s += MH.rep.Commands(a.movs);
                break;
            case "found":
            case "conquer":
                s += u(a, a.type),
                    s += "[table][*][center]" + MH.WhtImg(705) + "[size=10][b]" + a.detail + "[/*][/table]";
                break;
            case "support":
                if (!a.att.unit_list.length) {
                    a.def.player = "[player]" + Game.player_name + "[/player]",
                        a.def.ally = "[ally]" + mhCol.AllyName_PlayName(a.def.player.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally]",
                        a.att.ally = "[ally]" + mhCol.AllyName_PlayName(a.att.player.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally]",
                        a.def.town = MH.bbc(MH.Link2Struct(e.find($("#report_game_body p a.gp_town_link")).attr("href")).id.toString(), "town"),
                        a.att.town = MH.bbc(MH.Link2Struct(e.find($("#report_game_body p a.gp_town_link:eq(1)")).attr("href")).id.toString(), "town"),
                        a.detail = e.find($("#report_game_body p")).html().trim(),
                        a.detail = a.detail.replace(/<a.*gp_town_link.*\/a>,/, a.def.town + ","),
                        a.detail = a.detail.replace(/<a.*gp_player_link.*\/a>(.*?)<a.*gp_town_link.*\/a> /, a.att.player + "$1" + a.def.town + " "),
                        a.detail = a.detail.replace(/<a.*gp_town_link.*\/a>./, a.att.town + "."),
                        a.detail = a.detail.replace(/<br>/, "\n"),
                        s += u(a, "supportbck", 0),
                        s += a.detail;
                    break
                }
            case "command":
                a.SelTroop = !1,
                    "command" == a.type && "X" == a.ico.charAt(a.ico.length - 6) && (MH.gRAP.SelT && (a.SelTroop = a.ico),
                                                                                     a.ico = MH.GameImg + "/images/game/unit_overview/attack.png"),
                    s += u(a, a.type, 0),
                    s += "[table][*][center]" + MH.WhtImg(152) + "\n[img]" + MH.Home + "r/uc.gif[/img][size=15][b] " + MH.Lang.AllU + ":",
                    MH.gRAP.AllU && "command" == a.type && "" != a.att.pow && (s += "\n" + a.att.pow),
                    s += "[/center][|][center]" + MH.WhtImg(544) + "\n",
                    "support" == a.type && (s += "[img]" + MH.Home + "r/ut.gif[/img][img]" + MH.Home + "r/ut.gif[/img][img]" + MH.Home + "r/ut.gif[/img][size=12][b] " + MH.Lang.supontar + " [img]" + MH.Home + "r/ut.gif[/img][img]" + MH.Home + "r/ut.gif[/img][img]" + MH.Home + "r/ut.gif[/img]"),
                    "command" == a.type && (s += "[img]" + MH.Home + "r/uz.gif[/img][size=12][b] " + a.detail.time_title + " [img]" + MH.Home + "r/ut.gif[/img] " + a.detail.time_time),
                    s += "\n",
                    MH.gRAP.AllU ? (0 != a.SelTroop && (s += "[img]" + a.SelTroop + "[/img]\n"),
                                    s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send)) : s += "[img]" + MH.Home + "gui/hidden.gif[/img]",
                    s += "[/*][/table]";
                break;
            case "otherTxt":
                s += a.html;
                break;
            case "otherUni":
                s += "[center] [player]" + Game.player_name + "[/player]  ([ally]" + Game.alliance_name + "[/ally])\n",
                    s += "[img]" + MH.Home + "r/hr.gif[/img]\n\n",
                    s += a.html,
                    s += "\n\n",
                    MH.gRAP.HideAttUnits ? s += "[img]" + MH.Home + "gui/hidden.gif[/img]" : s += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send),
                    s += "[/center]";
                break;
            case "nofification":
                s += MH.bbCodeHTML(a.html, !1, a.title);
                break;
            case "nofificationIMG":
                s += "[table][*][img]" + a.img + "[/img][|][size=10]",
                    s += "[b]" + a.title + "[/b]\n\n",
                    s += MH.bbCodeHTML(a.html, !1),
                    s += "[/size][/*][/table]";
                break;
            case "olympus_temple":
                s += "[table][*][img]" + a.img + "[/img][|][b][size=20]Jeśli chcecie więcej to ślijcie wsparcia.\n\nGive Support if you want more.[/size][/b][/*][/table]";
                break;
            case "agora_thanks":
                s += "[center][img]" + MH.Home + "e/z/serce.gif[/img][b][size=28][color=#804000][font=sansserif]  " + MH.Lang.agrThanks + "  [/font][/color][/size][img]" + MH.Home + "e/z/serce.gif[/img]",
                    s += "\n\n" + a.txt_obrona + " [town]" + Game.townId + "[/town]:[/b][/center]",
                    s += "\n";
                var p = 0;
                for (o in a.lst)
                    s += MH.WhtImg(190) + ++p + ". ",
                        s += "[player]" + a.lst[o].name + "[/player] - " + MH.GLng.Ally,
                        s += ": [ally]" + a.lst[o].ally + "[/ally]",
                        s += "\n";
                s += "\n\n[center][img]" + MH.Home + "e/z/gwiazdki.gif[/img][/center]";
                break;
            case "agora_in":
                for (o in s += "[center]\n[b]" + MH.Lang.DeffA + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                     s += "[table][*][center]",
                     a.movs)
                    0 == o && !MH.gRAP.DeffA || 1 == o && !MH.gRAP.TwnU || 2 <= o && !MH.gRAP.PlyU || (s += "\n[b][size=10]" + a.movs[o].title + "[/b]\n",
                                                                                                       s += mhRep.UnitsNew(a.movs[o].unit_list, a.movs[o].unit_send),
                                                                                                       s += "\n\n[img]" + MH.Home + "r/hr.gif[/img]\n");
                s += "[/center][/*][/table]";
                break;
            case "agora_out":
                for (o in s += "[center]\n[b]" + a.str + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                     s += "[table][*][center]",
                     a.movs)
                    s += "\n[b][size=10]" + a.movs[o].title + "[/b]\n",
                        s += mhRep.UnitsNew(a.movs[o].unit_list, a.movs[o].unit_send),
                        s += "\n\n[img]" + MH.Home + "r/hr.gif[/img]\n";
                s += "[/center][/*][/table]";
                break;
            case "wall":
                if (s += "[table][*]" + MH.WhtImg(705) + "[center][size=12][player]" + Game.player_name + "[/player] - " + a.txtWall + "[/size][/center][/*][/table]",
                    s += "[table][*]" + MH.WhtImg(348) + "[|]" + MH.WhtImg(348) + "[/*]",
                    MH.gRAP.WalDA || MH.gRAP.WalLA) {
                    for (t = a.def.att.unit_list.length,
                         n = a.los.att.unit_list.length,
                         l = 0,
                         s += "[*][b]",
                         MH.gRAP.WalDA && (s += a.def.txt.replace(/\./g, "") + " " + a.def.txtAtt.replace(/\./g, "") + ":"),
                         s += "[/b][|][b]",
                         MH.gRAP.WalLA && (s += a.los.txt.replace(/\./g, "") + " " + a.los.txtAtt.replace(/\./g, "") + ":"),
                         s += "[/b][/*]"; 0 < t || 0 < n; )
                        s += "[*]",
                            MH.gRAP.WalDA && (s += mhRep.UnitsNew(a.def.att.unit_list, a.def.att.unit_count, !1, l, 7)),
                            s += "[|]",
                            MH.gRAP.WalLA && (s += mhRep.UnitsNew(a.los.att.unit_list, a.los.att.unit_count, !1, l, 7)),
                            s += "[/*]",
                            t -= 7,
                            n -= 7,
                            l++;
                    s += "[*]" + MH.WhtImg(348) + "[|]" + MH.WhtImg(348) + "[/*]"
                }
                if (MH.gRAP.WalDD || MH.gRAP.WalLD)
                    for (t = a.def.def.unit_list.length,
                         n = a.los.def.unit_list.length,
                         l = 0,
                         s += "[*][b]",
                         MH.gRAP.WalDD && (s += a.def.txt.replace(/\./g, "") + " " + a.def.txtDef.replace(/\./g, "") + ":"),
                         s += "[/b][|][b]",
                         MH.gRAP.WalLD && (s += a.los.txt.replace(/\./g, "") + " " + a.los.txtDef.replace(/\./g, "") + ":"),
                         s += "[/b][/*]"; 0 < t || 0 < n; )
                        s += "[*]",
                            MH.gRAP.WalDD && (s += mhRep.UnitsNew(a.def.def.unit_list, a.def.def.unit_count, !1, l, 7)),
                            s += "[|]",
                            MH.gRAP.WalLD && (s += mhRep.UnitsNew(a.los.def.unit_list, a.los.def.unit_count, !1, l, 7)),
                            s += "[/*]",
                            t -= 7,
                            n -= 7,
                            l++;
                s += "[/table]";
                break;
            case "buildings":
                s += "[center]\n[b]" + a.txt_widok + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    s += function(t) {
                    var e;
                    function n(e) {
                        return "[img]" + MH.Home + "s/" + mhCNST.Buildings[e] + ".gif[/img][|]" + mhUtl.GetBuildingName(e) + ":[size=12][b]\n" + t[e] + "[/b][/size]"
                    }
                    e = "[table][*][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(92) + "[/*]",
                        e += "[*]" + n("main") + "[|]" + n("lumber") + "[|]" + n("farm") + "[|]" + n("stoner") + "[|]" + n("storage") + "[/*]",
                        "" != t.spc1 ? e += "[*]" + n(t.spc1) + "[|]" : e += "[*][|][|]";
                    e += n("ironer") + "[|]" + n("barracks") + "[|]" + n("temple") + "[|]" + n("market") + "[/*]",
                        "" != t.spc2 ? e += "[*]" + n(t.spc2) + "[|]" : e += "[*][|][|]";
                    return e += n("docks") + "[|]" + n("academy") + "[|]" + n("wall") + "[|]" + n("hide") + "[/*]",
                        e += "[/table]"
                }(a.build);
                break;
            case "academy_research":
                s += "[center]\n[b]Badania Akademickie w mieście: [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    s += "[table]",
                    s += a.html,
                    s += "[/table]";
                break;
            case "island":
                for (l in s += "[island]" + a.island + "[/island] [img]" + MH.Home + "e/9/ocean.gif[/img] " + a.sea + " [img]" + MH.Home + "e/9/free.gif[/img] " + a.free,
                     s += "[table]",
                     s += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                     r = i = 0,
                     a.movs)
                    s += 0 == r ? "[*]" : r < 3 ? "[|]" : "[/*]",
                        s += ++i + ".[|][b][town]",
                        s += a.movs[l].town,
                        s += "[/town]\n",
                        s += a.movs[l].pnts + "\n",
                        s += "[player]" + a.movs[l].name + "[/player]\n",
                        s += "[ally]" + a.movs[l].ally + "[/ally]",
                        s += "[/b]",
                        3 <= ++r && (r = 0);
                s += "[/table]";
                break;
            case "ally_profile":
                if (s += "[center][size=20][ally]" + a.ally + "[/ally][/size][/center]",
                    s += "[table][*]" + MH.WhtImg(169) + "\n" + MH.GLng.Ranking + ": " + a.nfo.rank + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Points + ": " + a.nfo.points + "[|]" + MH.WhtImg(170) + "\n" + a.txtMembers + ": " + a.nfo.members + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Towns + ": " + a.nfo.towns + "[/*][/table]",
                    MH.gRAP.PrfB && (s += "[table][*]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "imgs/flag/allybig.gif[/img][/center]",
                                     s += "[|]" + MH.WhtImg(340) + "[center][img]",
                                     s += a.img,
                                     s += "[/img][/center]",
                                     s += "[|]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "imgs/flag/allybig.gif[/img][/center][/*]",
                                     s += "[*][|][size=10]" + a.bbcode + "\n\n[/size][|][/*]",
                                     s += "[/table]"),
                    MH.gRAP.PrfA) {
                    for (l in s += "[table]",
                         s += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                         r = i = 0,
                         a.movs)
                        s += 0 == r ? "[*]" : r < 3 ? "[|]" : "[/*]",
                            s += ++i + ".[|][b][player]",
                            s += a.movs[l].name,
                            s += "[/player]\n",
                            s += a.movs[l].txt.replace(",", "\n"),
                            s += "[/b]",
                            3 <= ++r && (r = 0);
                    s += "[/table]"
                }
                break;
            case "player_profile":
                if (s += "[center][size=20][player]" + a.play + "[/player][/size][/center]",
                    s += "[table][*]" + MH.WhtImg(169) + "\n" + MH.GLng.Ranking + ": " + a.nfo.rank + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Points + ": " + a.nfo.points + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Towns + ": " + a.nfo.towns + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Ally + ": [ally]" + a.ally + "[/ally][/*][/table]",
                    MH.gRAP.PrfB && (s += "[table][*]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "img/flagplayR.png[/img][/center]",
                                     s += "[|]" + MH.WhtImg(340) + "[center][img]",
                                     s += a.img,
                                     s += "[/img][/center]",
                                     s += "[|]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "img/flagplayL.png[/img][/center][/*]",
                                     s += "[*][|][size=10]" + a.bbcode + "\n\n[/size][|][/*]",
                                     s += "[/table]"),
                    MH.gRAP.PrfA) {
                    for (l in s += "[table]",
                         s += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                         r = i = 0,
                         a.movs)
                        s += 0 == r ? "[*]" : r < 3 ? "[|]" : "[/*]",
                            s += ++i + ".[|][b][town]",
                            s += a.movs[l].townID,
                            s += "[/town]\n",
                            s += a.movs[l].txt1 + "\n",
                            s += a.movs[l].txt2 + "[/b]",
                            3 <= ++r && (r = 0);
                    s += "[/table]"
                }
                break;
            case "ranking":
                for (s += a.txt,
                     s += "[table][*]",
                     i = 0; i < a.nTab; i++)
                    s += a.TabN[i],
                        i + 1 < a.nTab && (s += "[|]");
                for (l in s += "[/*]",
                     r = i = 0,
                     a.movs) {
                    for (s += "[*]",
                         i = 0; i < a.nTab; i++) {
                        if (0 < a.movs[l][a.TabC[i]].length)
                            switch (a.TabC[i]) {
                                default:
                                    s += a.movs[l][a.TabC[i]];
                                    break;
                                case "name":
                                    s += "[player]" + a.movs[l][a.TabC[i]] + "[/player]";
                                    break;
                                case "ally":
                                    s += "[ally]" + a.movs[l][a.TabC[i]] + "[/ally]"
                            }
                        i + 1 < a.nTab && (s += "[|]")
                    }
                    s += "[/*]"
                }
                s += "[/table]";
                break;
            case "ww_donations":
                for (s += a.txt,
                     s += "[table][*]",
                     i = 0; i < a.nTab; i++)
                    s += a.TabN[i],
                        i + 1 < a.nTab && (s += "[|]");
                for (l in s += "[/*]",
                     r = i = 0,
                     a.movs) {
                    for (s += "[*]",
                         i = 0; i < a.nTab; i++)
                        0 < a.movs[l][a.TabC[i]].length && ("col_name" !== a.TabC[i] ? s += a.movs[l][a.TabC[i]] : s += "[player]" + a.movs[l][a.TabC[i]] + "[/player]"),
                            i + 1 < a.nTab && (s += "[|]");
                    s += "[/*]"
                }
                s += "[/table]";
                break;
            case "inventory":
                for (s += "[center]\n[b]" + a.title + " " + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] ([ally]" + Game.alliance_name + "[/ally])\n",
                     s += "[img]" + MH.Home + "/img/invH1.gif[/img]\n[img]" + MH.Home + "/img/invBL.gif[/img]",
                     r = 0; r < 20; r++)
                    "disabled" == a.invN[r] ? s += "[img]" + MH.Home + "/img/invD.gif[/img]" : "empty" == a.invN[r] ? s += "[img]" + MH.Home + "/img/invE.gif[/img]" : s += "[img]" + a.invN[r] + "[/img]",
                        s += 9 != r && 19 != r ? "[img]" + MH.Home + "/img/invM.gif[/img]" : "[img]" + MH.Home + "/img/invBR.gif[/img]",
                        9 == r && (s += "\n[img]" + MH.Home + "/img/invH2.gif[/img]\n[img]" + MH.Home + "/img/invBL.gif[/img]");
                if (s += "[img]" + MH.Home + "/img/invH3.gif[/img]",
                    0 < a.invE.length)
                    for (s += "\n[b]" + a.invEtxt + ":[/b]\n",
                         r = 0; r < a.invE.length; r++)
                        s += "[img]" + a.invE[r] + "[/img]";
                break;
            case "ally_events":
                if (s += "[center][ally]" + Game.alliance_name + "[/ally] - [b]" + a.tev + ":[/b][/center]\n\n",
                    1 == a.nr)
                    for (i = 0; i < a.events.length; i++)
                        s += "    " + a.events[i].dat,
                            s += " [img]" + MH.GameImg + a.events[i].img + "[/img] ",
                            s += a.events[i].txt,
                            s += "\n";
                else
                    for (i = 0; i < a.events.length; i++)
                        s += "    " + a.events[i].dat,
                            s += " [img]" + MH.GameImg + a.events[i].img + "[/img] ",
                            s += a.events[i].txt.replace("[/ally]", "[/ally]\n        "),
                            s += "\n";
                break;
            case "easter_recipes":
                for (r in s += a.html,
                     a.recipes)
                    for (n in s += "[center][b][size=12]\n" + a.recipes[r].name + "\n",
                         a.recipes[r].rec)
                        s += "[img]" + MH.Home + "img/ea_" + a.recipes[r].rec[n][0] + ".gif[/img]",
                            s += " + ",
                            s += "[img]" + MH.Home + "img/ea_" + a.recipes[r].rec[n][1] + ".gif[/img]",
                            s += " + ",
                            s += "[img]" + MH.Home + "img/ea_" + a.recipes[r].rec[n][2] + ".gif[/img]",
                            s += " = ",
                            s += "[img]" + a.recipes[r].rec[n][3] + "[/img]",
                            s += "\n";
                s += "[/b][/center]";
                break;
            case "hercules_fight_result":
            case "situation":
                return function() {
                    var n, e, t, i, a;
                    n = c(),
                        n += "[center]\n[b]" + MH.Lang.situation + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                        e = ITowns.towns[Game.townId],
                        n += "[table]",
                        n += "[*][img]" + MH.Home + "r/swal",
                        "0" == e.buildings().getBuildingLevel("wall") && (n += "d");
                    n += ".gif[/img][|]",
                        n += mhUtl.GetBuildingName("wall") + ":[size=12][b]\n" + e.buildings().getBuildingLevel("wall") + "[/b][/size]",
                        n += "[|][img]" + MH.Home + "r/stow",
                        "0" == e.buildings().getBuildingLevel("tower") && (n += "d");
                    n += ".gif[/img][|]",
                        n += mhUtl.GetBuildingName("tower") + ":[size=12][b]\n",
                        "0" != e.buildings().getBuildingLevel("tower") ? n += MH.GLng.Yes : n += MH.Lang.lack;
                    n += "[/b][/size]",
                        n += "[|][img]" + MH.Home + "r/sfall",
                        e.researches().hasResearch("phalanx") || (n += "d");
                    n += ".gif[/img][|]",
                        n += MH.Lang.resPhalanx + ":[size=12][b]\n",
                        e.researches().hasResearch("phalanx") ? n += MH.GLng.Yes : n += MH.Lang.lack;
                    n += "[/b][/size]",
                        n += "[|][img]" + MH.Home + "r/stara",
                        e.researches().hasResearch("ram") || (n += "d");
                    n += ".gif[/img][|]",
                        n += MH.Lang.resRam + ":[size=12][b]\n",
                        e.researches().hasResearch("ram") ? n += MH.GLng.Yes : n += MH.Lang.lack;
                    n += "[/b][/size]",
                        n += "[|][img]" + MH.Home + "r/sstor",
                        e.getEspionageStorage() < 1e4 && (n += "d");
                    n += ".gif[/img][|]",
                        n += mhUtl.GetBuildingName("hide") + ":[size=12][b]\n",
                        e.getEspionageStorage() < 1e4 ? n += e.getEspionageStorage() : n += MH.Lang.above + " 10000";
                    n += "[/b][/size]",
                        n += "[/*][/table]\n" + MH.Lang.god + ": " + e.god(),
                        n += "\n" + MH.Lang.inAtt + ": " + $("#MH_mna").html(),
                        n += "\n" + MH.Lang.inDef + ": " + $("#MH_mns").html(),
                        e.hasConqueror() && ($("#conquest").length ? (a = $(".conquest_info_wrapper:first"),
                                                                      t = (t = (t = a.html().clear()).substr(2, t.indexOf(":") - 1)).replace(/\n/g, ""),
                                                                      n += "\n\n[b][color=#FF2D2D]" + t + "[/color][/b]\n",
                                                                      n += MH.Lang.by + ": [player]" + a.find(".gp_player_link").html().clear() + "[/player]",
                                                                      t = MH.Link2Struct(a.find(".gp_player_link:first").attr("href")).id,
                                                                      n += " ([ally]" + mhCol.AllyName_PlayId(t) + "[/ally])\n",
                                                                      n += "[b]" + $("#conquest").attr("data-tooltip") + "[/b]\n") : n += "\n\n[b]OCUPATION! ...\n\n");
                    return e = ITowns.towns[Game.townId],
                        n += "\n[size=11]_[img]" + MH.Home + "e/9/ocean.gif[/img] [b]M" + Math.floor(e.getIslandCoordinateX() / 100) + Math.floor(e.getIslandCoordinateY() / 100),
                        n += " [img]" + MH.Home + "medias/images/g" + e.god() + ".gif[/img] [town]" + Game.townId + "[/town] ",
                        $.each($("#ui_box .town_name_area .casted_powers_area .js-list-viewport .list .casted_power"), function(e, t) {
                        for (i in MH.ConstPowers)
                            $(this).hasClass(MH.ConstPowers[i]) && (n += "[img]" + MH.Home + "p6/" + MH.ConstPowers[i] + ".png[/img] ");
                        n += MH.htm.getPowerIcon($(t))
                    }),
                        n += m()
                }();
            case "player_info":
                return function() {
                    var e;
                    a.title = MH.Lang.HELPTAB2,
                        e = c(),
                        e += "[center]\n[player]" + Game.player_name + "[/player] ([ally]" + Game.alliance_name + "[/ally]) - [b]" + MH.Lang.HELPTAB2 + ": [/b]\n\n[/center]",
                        MH.gRAP.PrfB && (e += "[table]",
                                         e += "[*][b]" + MH.GLng.Name + ":[/b][|]" + MH.DB.player + "[/*]",
                                         e += "[*][b]" + MH.GLng.Ally + ":[/b][|]" + Game.alliance_name + "[/*]",
                                         e += "[*][b]" + MH.Lang.pldays + ":[/b][|]" + Game.player_days_registered + "[/*]",
                                         e += "[*][b]" + MH.GLng.Towns + ":[/b][|]" + Game.player_villages + "[/*]",
                                         e += "[*][b]" + MH.GLng.Points + ":[/b][|]" + Game.player_points + "[/*]",
                                         e += "[*][b]" + MH.GLng.Ranking + ":[/b][|]" + Game.player_rank + "[/*]",
                                         e += "[/table]");
                    if (MH.gRAP.AllU) {
                        a.att.unit_list = [],
                            a.att.unit_send = [];
                        var t = 0;
                        "1" == $("#rb_urt1").attr("sel") && (t = 1),
                            "1" == $("#rb_urt2").attr("sel") && (t = 2),
                            "1" == $("#rb_urt3").attr("sel") && (t = 3),
                            "1" == $("#rb_urt4").attr("sel") && (t = 4),
                            e += "[center]\n\n[size=13][b]   " + $("#rb_urt" + t).html().clear() + ":[/b][/size]\n\n[/center]";
                        var n = MH.UnitsShowAll(t);
                        for (t in n)
                            if (n.hasOwnProperty(t)) {
                                if (0 == n[t] && (MH.UnitIsGod(t) || MH.UnitIsHero(t)))
                                    continue;
                                a.att.unit_list.push(mhCNST.Units[t]),
                                    a.att.unit_send.push(n[t])
                            }
                        var i = a.att.unit_list.length;
                        for (l = 0; 0 < i; )
                            e += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, null, l, 14),
                                i -= 14,
                                l++,
                                e += "\n"
                    }
                    return e += m()
                }()
        }
        return s += m();
        function c() {
            return s = "[center]",
                MH.gRAP.Title && (s += "[b]" + a.title + "[/b]\n"),
                s += "[img]" + MH.Home + "r/head.gif[/img][/center][quote]"
        }
        function m() {
            var e = "[/quote][center][img]" + MH.Home + "r/foot.gif[/img]\n";
            return null != a.att && null != a.def && 4e3 < a.att.p + a.def.p && (e += "[img]" + MH.Home + "r/blood.gif[/img]\n"),
                e += "[/center]",
                MH.gRAP.Date ? e += MH.rep.Foot(a.time) : e += MH.rep.Foot(),
                e
        }
        function u(e, t, n) {
            var i = "cb"
            , a = "[table][*][img]";
            if ("powers" == t)
                a += MH.Home + "pow/" + n + ".png";
            else
                switch (e.att.townT) {
                    default:
                        a += MH.Home + "r/ca.gif";
                        break;
                    case "ghost":
                        a += MH.Home + "r/cg.gif";
                        break;
                    case "farm":
                        a += MH.Home + "r/cf.gif";
                        break;
                    case "quest":
                        a += MH.Home + "r/cq.gif";
                        break;
                    case "olimp":
                        a += MH.Home + "r/co.gif"
                }
            if (a += "[/img][|]" + MH.WhtImg(176) + "[b]\n",
                "powers" != t && (a += MH.bbcT(e.att.town) + "\n"),
                a += MH.bbcP(e.att.player) + "\n" + MH.bbcA(e.att.ally) + "[/b][|][img]" + MH.Home + "r/",
                "command" == t && (e.ico.match(/.*\/(support).*/) && (a += "as"),
                                   e.ico.match(/.*\/(attack).*/) && (a += "aa"),
                                   e.ico.match(/.*\/(conqueror).*/) && (a += "ac"),
                                   e.ico.match(/.*\/(colonization).*/) && (a += "af"),
                                   e.ico.match(/.*\/(foundation).*/) && (a += "af"),
                                   e.ico.match(/.*\/(revolt).*/) && (a += "ar"),
                                   e.ico.match(/.*\/(breakthrough).*/) && (a += "ab"),
                                   e.ico.match(/.*\/(abort).*/) && (a += "az"),
                                   e.ico.match(/.*\/(illusion).*/) && (a += "ai"),
                                   e.ico.match(/.*\/(farm_attack).*/) && (a += "ara",
                                                                          i = "cf")),
                "support" == t && (a += "as"),
                "supportbck" == t && (a += "az"),
                "espionage" == t && (a += "ae"),
                "powers" == t && (a += "ap"),
                "attack_support" == t && (a += "aas"),
                "found" == t && (a += "af"),
                "conquer" == t && (a += "ac"),
                "illusion" == t && (a += "ai"),
                "raise" == t && (a += "ara",
                                 i = "cf"),
                "powers" == t)
                switch (e.powerid) {
                    case "transformation":
                    case "sea_storm":
                    case "wisdom":
                        i = "cp"
                }
            return "ghost" == e.def.townT && (i = "cg"),
                "farm" == e.def.townT && (i = "cf"),
                "quest" == e.def.townT && (i = "cq"),
                "attack" == e.def.townT && (i = "cp"),
                "olimp" == e.def.townT && (i = "co",
                                           e.def.town.replace("town", "temple"),
                                           e.def.player = "Olimp"),
                a += ".gif[/img][|]" + MH.WhtImg(176),
                a += "[b]\n",
                "olimp" == e.def.townT ? a += e.def.town.replaceAll("town", "temple") + "\n" + e.def.player : a += MH.bbcT(e.def.town) + "\n" + MH.bbcP(e.def.player),
                a += "\n" + MH.bbcA(e.def.ally) + "[/b][|][img]" + MH.Home + "r/" + i + ".gif[/img][/*][/table]"
        }
    }
        ,
        MH.rep.bbCodeMake_Mini = function(e, a) {
        var o;
        switch (r = function() {
            var e = "[quote]";
            MH.gRAP.ShowTitle && (e += "[center][b]" + a.title + "[/center]");
            return e
        }(),
                a.type) {
            default:
                return null;
            case "breach":
            case "take_over":
            case "attack":
                if (r += "[table][*]" + MH.WhtImg(283) + "[b]\n",
                    o = a.att.unit_list.length,
                    t = 0,
                    MH.gRAP.AttU)
                    for (; 0 < o; )
                        0 == t && (r += a.att.pow),
                            r += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, a.att.unit_lost, t, 8, "2D2DFF", "FF2D2D"),
                            o -= 8,
                            t++;
                else
                    r += "[center][img]" + MH.Home + "gui/hidden.gif[/img][/center]";
                if (r += "[/b]",
                    n = "mid",
                    a.ico.match(/.*\/(attack).*/) && (n = "mida"),
                    a.ico.match(/.*\/(breach).*/) && (n = "midb"),
                    a.ico.match(/.*\/(conqueror).*/) && (n = "midt"),
                    a.ico.match(/.*\/(take_over).*/) && (n = "midr"),
                    a.oldbuld.length && (n = "mids"),
                    r += "[|][center][img]" + MH.Home + "r/" + n + ".gif[/img]\n",
                    MH.gRAP.Booty && null != a.load && (r += "[b]" + a.load + "\n"),
                    MH.gRAP.Booty2 && "" != a.res.count && (r += MH.rep.ResF(a.res)),
                    MH.gRAP.Bpnt && "" != a.bp.txt && (r += a.bp.txt + " [img]" + MH.Home + "r/bpnt.png[/img]" + a.bp.count),
                    r += "[/center][|]",
                    r += MH.WhtImg(283) + "[b]\n",
                    o = a.def.unit_list.length,
                    t = 0,
                    MH.gRAP.DefU)
                    for (; 0 < o; )
                        0 == t && (r += a.def.pow),
                            r += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, t, 8, "2D2DFF", "FF2D2D"),
                            o -= 8,
                            t++;
                else
                    r += "[center][img]" + MH.Home + "gui/hidden.gif[/img][/center]";
                r += "[/*]",
                    MH.gRAP.AttU || (a.att.w = a.att.i = a.att.s = a.att.p = a.att.f = "?"),
                    MH.gRAP.DefU || (a.def.w = a.def.i = a.def.s = a.def.p = a.def.f = "?"),
                    r += "[*][b]" + a.luck,
                    r += "\n" + a.morale,
                    r += "\n" + a.att.town,
                    r += "\n" + a.att.player,
                    r += "\n" + a.att.ally,
                    r += "[/b][|][font=monospace]",
                    MH.gRAP.Costs && (r += "[size=9][b]" + MH.utl.strNwht(a.att.w, 6) + " [img]" + MH.Home + "r/rwood.png[/img] " + MH.utl.strNwhtL(a.def.w, 6),
                                      r += "\n" + MH.utl.strNwht(a.att.s, 6) + " [img]" + MH.Home + "medias/images/rstone.png[/img] " + MH.utl.strNwhtL(a.def.s, 6),
                                      r += "\n" + MH.utl.strNwht(a.att.i, 6) + " [img]" + MH.Home + "medias/images/riron.png[/img] " + MH.utl.strNwhtL(a.def.i, 6),
                                      r += "\n" + MH.utl.strNwht(a.att.p, 6) + " [img]" + MH.Home + "medias/images/rpopu.png[/img] " + MH.utl.strNwhtL(a.def.p, 6),
                                      r += "\n" + MH.utl.strNwht(a.att.f, 6) + " [img]" + MH.Home + "medias/images/rfavor.png[/img] " + MH.utl.strNwhtL(a.def.f, 6)),
                    r += "[/font][|][b]",
                    a.oldwall.length && (r += "\n" + a.oldwall),
                    a.oldbuld.length && (r += "\n" + a.oldbuld),
                    a.nightbonus.length && (r += "\n" + a.nightbonus),
                    r += "\n" + a.def.town,
                    r += "\n" + a.def.player,
                    r += "\n" + a.def.ally,
                    0 < a.attacktxt.length && (r += "\n[img]" + MH.Home + "m/RA.png[/img]" + a.attacktxt),
                    r += "[/b][/*][/table]";
                break;
            case "raise":
                r += d(a, a.type),
                    r += MH.rep.BD_raise(a);
                break;
            case "attack_support":
                r += d(a, a.type),
                    r += "[table][*]" + MH.WhtImg(202),
                    r += "[center]\n",
                    r += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send, a.att.unit_lost),
                    r += "[/center][|]",
                    MH.gRAP.Costs ? (r += "[font=monospace][size=9][b]",
                                     r += "? [img]" + MH.Home + "medias/images/rwood.png[/img] " + MH.utl.strNwhtL(a.def.w, 6),
                                     r += "\n? [img]" + MH.Home + "medias/images/riron.png[/img] " + MH.utl.strNwhtL(a.def.i, 6),
                                     r += "\n? [img]" + MH.Home + "medias/images/rstone.png[/img] " + MH.utl.strNwhtL(a.def.s, 6),
                                     r += "\n? [img]" + MH.Home + "medias/images/rpopu.png[/img] " + MH.utl.strNwhtL(a.def.p, 6),
                                     r += "\n? [img]" + MH.Home + "medias/images/rfavor.png[/img] " + MH.utl.strNwhtL(a.def.f, 6),
                                     r += "[/font]") : r += MH.WhtImg(85),
                    r += "[|][center]" + MH.WhtImg(400) + "\n",
                    r += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, 0, 10),
                    0 < a.att.unit_list.length - 10 && mhRep.UnitsNew(a.def.unit_list, a.def.unit_send, a.def.unit_lost, 1, 10, "2D2DFF", "FF2D2D"),
                    r += "[player]" + a.player + "[/player] - " + a.txt + "[/*]",
                    r += "[/table]";
                break;
            case "illusion":
                r += d(a, a.type),
                    r += "[table][*][center]" + MH.WhtImg(705) + a.efekt.title + "[/center][/*][/table]";
                break;
            case "powers":
                var l = "gx";
                switch (a.god) {
                    case "zeus":
                        l = "ga";
                        break;
                    case "poseidon":
                        l = "gc";
                        break;
                    case "hera":
                        l = "gd";
                        break;
                    case "athena":
                        l = "gb";
                        break;
                    case "hades":
                        l = "ge";
                        break;
                    case "artemis":
                        l = "gf";
                        break;
                    case "aphrodite":
                        l = "gg";
                        break;
                    case "ares":
                        l = "gh"
                }
                switch ("chain_lightning" == a.powid && (l = "ga"),
                        r += d(a, a.type),
                        r += "[table][*]" + MH.WhtImg(301) + "[center][b][color=#000080]" + a.efekt.title + "[/color][/b]\n" + a.txt + "\n[b][color=#008000]" + a.txt2 + "[/color]\n",
                        r += DM.getl10n("barracks").cost_details.favor + ": " + a.favor + "[/b][img]" + MH.Home + "r/rfavor.png[/img][/center][|]" + a.powimg30 + "[|]" + MH.WhtImg(300),
                        r += "[center][b][color=#000080]" + MH.Lang.spelleff + "[/color]\n\n[/b]",
                        a.powtype) {
                    case 1:
                        r += MH.rep.Res(a.res);
                        break;
                    case 2:
                        r += "[color=#008000][b]" + a.efekt.det + "[/b][/color]\n",
                            r += mhRep.UnitsNew(a.res.unit_list, a.res.unit_send, !1, 0, 6),
                            0 < a.res.unit_list.length - 6 && (r += mhRep.UnitsNew(a.res.unit_list, a.res.unit_send, !1, 1, 6));
                        break;
                    case 3:
                        r += "[color=#008000][b]" + a.efekt.det + "[/b][/color]\n",
                            r += MH.Lang.spelltime + ": " + MH.utl.secsToHHMMSS(a.powtime) + " h\n",
                            r += a.powend
                }
                if ("illusion" == a.powid && ("" == a.efekt.det2 ? r += a.efekt.det : (r += "atak za: " + a.efekt.det2,
                                                                                       r += "\nczas ataku " + a.efekt.det)),
                    "cleanse" == a.powid) {
                    r += a.efekt.det,
                        null != a.pID && (r += ":\n" + a.pID);
                    break
                }
                r += "[/center][/*][/table]";
                break;
            case "command_curator":
                for (i in r += "[center][size=12][b][player]" + Game.player_name + "[/player] - " + a.title + " [img]" + MH.Home + "r/curator.gif[/img][/b][/size]\n\n[/center]",
                     a.movs)
                    a.movs[i].NoCmdTxt ? r += "[img]" + MH.Home + "r/hr.gif[/img]" + a.movs[i].NoCmdTxt : MH.rep.FiltrCommand(a.movs[i]) && (r += "[img]" + MH.Home + "r/hr.gif[/img][table][*][b]",
                                                                                                                                             r += "[town]" + a.movs[i].townIdA + "[/town]\n",
                                                                                                                                             r += a.movs[i].playerA + "\n",
                                                                                                                                             r += "[ally]" + mhCol.AllyName_PlayName(a.movs[i].playerA.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally][/b][|]",
                                                                                                                                             "out" == a.movs[i].inout ? r += a.movs[i].img + "[img]" + MH.Home + "m/arR.png[/img]" : r += "[img]" + MH.Home + "m/arL.png[/img]" + a.movs[i].img,
                                                                                                                                             r += "[|][b]",
                                                                                                                                             r += "[town]" + a.movs[i].townIdB + "[/town]\n",
                                                                                                                                             r += a.movs[i].playerB + "\n",
                                                                                                                                             null != a.movs[i].playerB && (r += "[ally]" + mhCol.AllyName_PlayName(a.movs[i].playerB.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally][/b][|]"),
                                                                                                                                             MH.gRAP.HideUnits || (a.movs[i].unit_list && (r += mhRep.UnitsNew(a.movs[i].unit_list, a.movs[i].unit_send)),
            r += "[|]"),
                                                                                                                                             "" != a.movs[i].power && (r += a.movs[i].power + "[b]\n[/b]"),
                                                                                                                                             r += a.movs[i].time,
                                                                                                                                             r += "[/*][/table]");
                r += "[img]" + MH.Home + "r/hr.gif[/img]";
                break;
            case "commands_list":
                r += "[center]\n[b]" + MH.Lang.cmdToCity + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    r += MH.rep.Commands(a.movs);
                break;
            case "espionage":
                r += d(a, a.type),
                    "" != a.build.title && a.SpyOk && MH.gRAP.SpyB && (r += "[center]" + MH.rep.Buldings(a.build, 20) + "[/center]"),
                    "" != a.build.title && a.SpyOk && MH.gRAP.AllU && (r += "[table][*][center]" + MH.WhtImg(705) + "\n[img]" + MH.Home + "r/uc.gif[/img][size=15][b] " + MH.Lang.AllU + ":[/*][*][center]",
                                                                       r += mhRep.UnitsNew(a.def.unit_list, a.def.unit_send),
                                                                       r += "[/table]"),
                    r += "[table][*]" + MH.WhtImg(229) + "[center][img]" + MH.Home + "s/coins.gif[/img][/center][|]",
                    r += MH.WhtImg(228) + "[center][b]" + a.iron.title + "[/center]\n[center][img]" + MH.GameImg + "/images/game/hide/coins.png[/img] [size=26]",
                    MH.gRAP.SpyC ? r += a.iron.count : r += MH.Lang.HIDDEN,
                    r += "[/size][/center][|]" + MH.WhtImg(230),
                    "" != a.res.title && a.SpyOk && (MH.gRAP.SpyR ? r += MH.rep.Res(a.res) : r += "[center][color=#008000][b]" + a.res.title + "[/b][/color]\n[size=26]" + MH.Lang.HIDDEN + "[/size][/center]"),
                    a.SpyOk || (r += "[b]" + a.def.title + "[/b]"),
                    r += "[/*][/table]";
                break;
            case "conquest":
            case "conquerold":
            case "conquerold_troops":
                return null;
            case "found":
            case "conquer":
                r += d(a, a.type),
                    r += "[table][*][center]" + MH.WhtImg(705) + "[size=10][b]" + a.detail + "[/*][/table]";
                break;
            case "support":
                a.att.unit_list;
            case "command":
                return null;
            case "otherTxt":
                r += a.html;
                break;
            case "otherUni":
                r += "[center] [player]" + Game.player_name + "[/player]  ([ally]" + Game.alliance_name + "[/ally])\n",
                    r += "[img]" + MH.Home + "r/hr.gif[/img]\n\n",
                    r += a.html,
                    r += "\n\n",
                    MH.gRAP.HideAttUnits ? r += "[img]" + MH.Home + "gui/hidden.gif[/img]" : r += mhRep.UnitsNew(a.att.unit_list, a.att.unit_send),
                    r += "[/center]";
                break;
            case "nofification":
                r += MH.bbCodeHTML(a.html, !1, a.title);
                break;
            case "agora_thanks":
                r += "[center][img]" + MH.Home + "e/z/serce.gif[/img][b][size=28][color=#804000][font=sansserif]  " + MH.Lang.agrThanks + "  [/font][/color][/size][img]" + MH.Home + "e/z/serce.gif[/img]",
                    r += "\n\n" + a.txt_obrona + " [town]" + Game.townId + "[/town]:[/b][/center]",
                    r += "\n";
                var s = 0;
                for (x in a.lst)
                    r += MH.WhtImg(190) + ++s + ". ",
                        r += "[player]" + a.lst[x].name + "[/player] - " + MH.GLng.Ally,
                        r += ": [ally]" + a.lst[x].ally + "[/ally]",
                        r += "\n";
                r += "\n\n[center][img]" + MH.Home + "e/z/gwiazdki.gif[/img][/center]";
                break;
            case "agora_in":
                for (x in r += "[center]\n[b]" + MH.Lang.DeffA + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                     r += "[table][*][center]",
                     a.movs)
                    r += "\n[b][size=10]" + a.movs[x].title + "[/b]\n",
                        r += mhRep.UnitsNew(a.movs[x].unit_list, a.movs[x].unit_send),
                        r += "\n\n[img]" + MH.Home + "r/hr.gif[/img]\n";
                r += "[/center][/*][/table]";
                break;
            case "agora_out":
                for (x in r += "[center]\n[b]" + a.str + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                     r += "[table][*][center]",
                     a.movs)
                    r += "\n[b][size=10]" + a.movs[x].title + "[/b]\n",
                        r += mhRep.UnitsNew(a.movs[x].unit_list, a.movs[x].unit_send),
                        r += "\n\n[img]" + MH.Home + "r/hr.gif[/img]\n";
                r += "[/center][/*][/table]";
                break;
            case "wall":
                if (r += "[table][*]" + MH.WhtImg(705) + "[center][size=12][player]" + Game.player_name + "[/player] - " + a.txtWall + "[/size][/center][/*][/table]",
                    r += "[table][*]" + MH.WhtImg(348) + "[|]" + MH.WhtImg(348) + "[/*]",
                    MH.gRAP.WalDA || MH.gRAP.WalLA) {
                    for (z = (a.def.att.unit_list.length + 1) / 3,
                         o = (a.los.att.unit_list.length + 1) / 3,
                         t = 0,
                         r += "[*][b]",
                         MH.gRAP.WalDA && (r += a.def.txt.replace(/\./g, "") + " " + a.def.txtAtt.replace(/\./g, "") + ":"),
                         r += "[/b][|][b]",
                         MH.gRAP.WalLA && (r += a.los.txt.replace(/\./g, "") + " " + a.los.txtAtt.replace(/\./g, "") + ":"),
                         r += "[/b][/*]"; 0 < z || 0 < o; )
                        r += "[*]",
                            MH.gRAP.WalDA && (r += mhRep.UnitsNew(a.def.att.unit_list, a.def.att.unit_count, !1, t, 7)),
                            r += "[|]",
                            MH.gRAP.WalLA && (r += mhRep.UnitsNew(a.los.att.unit_list, a.los.att.unit_count, !1, t, 7)),
                            r += "[/*]",
                            z -= 7,
                            o -= 7,
                            t++;
                    r += "[*]" + MH.WhtImg(348) + "[|]" + MH.WhtImg(348) + "[/*]"
                }
                if (MH.gRAP.WalDD || MH.gRAP.WalLD)
                    for (z = (a.def.def.unit_list.length + 1) / 3,
                         o = (a.los.def.unit_list.length + 1) / 3,
                         t = 0,
                         r += "[*][b]",
                         MH.gRAP.WalDD && (r += a.def.txt.replace(/\./g, "") + " " + a.def.txtDef.replace(/\./g, "") + ":"),
                         r += "[/b][|][b]",
                         MH.gRAP.WalLD && (r += a.los.txt.replace(/\./g, "") + " " + a.los.txtDef.replace(/\./g, "") + ":"),
                         r += "[/b][/*]"; 0 < z || 0 < o; )
                        r += "[*]",
                            MH.gRAP.WalDD && (r += mhRep.UnitsNew(a.def.def.unit_list, a.def.def.unit_count, !1, t, 7)),
                            r += "[|]",
                            MH.gRAP.WalLD && (r += mhRep.UnitsNew(a.los.def.unit_list, a.los.def.unit_count, !1, t, 7)),
                            r += "[/*]",
                            z -= 7,
                            o -= 7,
                            t++;
                r += "[/table]";
                break;
            case "buildings":
                r += "[center]\n[b]" + a.txt_widok + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    r += function(t) {
                    var e;
                    function n(e) {
                        return "[img]" + MH.Home + "s/" + mhCNST.Buildings[e] + ".gif[/img][|]" + mhUtl.GetBuildingName(e) + ":[size=12][b]\n" + t[e] + "[/b][/size]"
                    }
                    e = "[table][*][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(93) + "[|][|]" + MH.WhtImg(92) + "[/*]",
                        e += "[*]" + n("main") + "[|]" + n("lumber") + "[|]" + n("farm") + "[|]" + n("stoner") + "[|]" + n("storage") + "[/*]",
                        "" != t.spc1 ? e += "[*]" + n(t.spc1) + "[|]" : e += "[*][|][|]";
                    e += n("ironer") + "[|]" + n("barracks") + "[|]" + n("temple") + "[|]" + n("market") + "[/*]",
                        "" != t.spc2 ? e += "[*]" + n(t.spc2) + "[|]" : e += "[*][|][|]";
                    return e += n("docks") + "[|]" + n("academy") + "[|]" + n("wall") + "[|]" + n("hide") + "[/*]",
                        e += "[/table]"
                }(a.build);
                break;
            case "academy_research":
                r += "[center]\n[b]Badania Akademickie w mieście: [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n\n[/center]",
                    r += "[table]",
                    r += a.html,
                    r += "[/table]";
                break;
            case "island":
                for (t in r += "[island]" + a.island + "[/island] [img]" + MH.Home + "e/9/ocean.gif[/img] " + a.sea + " [img]" + MH.Home + "e/9/free.gif[/img] " + a.free,
                     r += "[table]",
                     r += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                     n = i = 0,
                     a.movs)
                    0 == n ? r += "[*]" : n < 3 ? r += "[|]" : r += "[/*]",
                        r += ++i + ".[|][b][town]",
                        r += a.movs[t].town,
                        r += "[/town]\n",
                        r += a.movs[t].pnts + "\n",
                        r += "[player]" + a.movs[t].name + "[/player]\n",
                        r += "[ally]" + a.movs[t].ally + "[/ally]",
                        r += "[/b]",
                        n++,
                        3 <= n && (n = 0);
                r += "[/table]";
                break;
            case "ally_profile":
                if (r += "[center][size=20][ally]" + a.ally + "[/ally][/size][/center]",
                    r += "[table][*]" + MH.WhtImg(169) + "\n" + MH.GLng.Ranking + ": " + a.nfo.rank + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Points + ": " + a.nfo.points + "[|]" + MH.WhtImg(170) + "\n" + a.txtMembers + ": " + a.nfo.members + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Towns + ": " + a.nfo.towns + "[/*][/table]",
                    MH.gRAP.PrfB && (r += "[table][*]" + MH.WhtImg(174) + "[center][img]" + MH.GameImg + $("#alliance_points img").attr("src") + "[/img][/center]",
                                     r += "[|]" + MH.WhtImg(340) + "[center][img]",
                                     r += a.img,
                                     r += "[/img][/center]",
                                     r += "[|]" + MH.WhtImg(174) + "[center][img]" + MH.GameImg + $("#alliance_points img").attr("src") + "[/img][/center][/*]",
                                     r += "[*][|][size=10]" + a.bbcode + "\n\n[/size][|][/*]",
                                     r += "[/table]"),
                    MH.gRAP.PrfA) {
                    for (t in r += "[table]",
                         r += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                         n = i = 0,
                         a.movs)
                        0 == n ? r += "[*]" : n < 3 ? r += "[|]" : r += "[/*]",
                            r += ++i + ".[|][b][player]",
                            r += a.movs[t].name,
                            r += "[/player]\n",
                            r += a.movs[t].txt.replace(",", "\n"),
                            r += "[/b]",
                            n++,
                            3 <= n && (n = 0);
                    r += "[/table]"
                }
                break;
            case "player_profile":
                if (r += "[center][size=20][player]" + a.play + "[/player][/size][/center]",
                    r += "[table][*]" + MH.WhtImg(169) + "\n" + MH.GLng.Ranking + ": " + a.nfo.rank + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Points + ": " + a.nfo.points + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Towns + ": " + a.nfo.towns + "[|]" + MH.WhtImg(170) + "\n" + MH.GLng.Ally + ": [ally]" + a.ally + "[/ally][/*][/table]",
                    MH.gRAP.PrfB && (r += "[table][*]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "img/flagplayR.png[/img][/center]",
                                     r += "[|]" + MH.WhtImg(340) + "[center][img]",
                                     r += a.img,
                                     r += "[/img][/center]",
                                     r += "[|]" + MH.WhtImg(174) + "[center][img]" + MH.Home + "img/flagplayL.png[/img][/center][/*]",
                                     r += "[*][|][size=10]" + a.bbcode + "\n\n[/size][|][/*]",
                                     r += "[/table]"),
                    MH.gRAP.PrfA) {
                    for (t in r += "[table]",
                         r += "[*]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[|]" + MH.WhtImg(30) + "[|]" + MH.WhtImg(190) + "[/*]",
                         n = i = 0,
                         a.movs)
                        0 == n ? r += "[*]" : n < 3 ? r += "[|]" : r += "[/*]",
                            r += ++i + ".[|][b][town]",
                            r += a.movs[t].townID,
                            r += "[/town]\n",
                            r += a.movs[t].txt1 + "\n",
                            r += a.movs[t].txt2 + "[/b]",
                            n++,
                            3 <= n && (n = 0);
                    r += "[/table]"
                }
                break;
            case "ranking":
                for (r += a.txt,
                     r += "[table][*]",
                     i = 0; i < a.nTab; i++)
                    r += a.TabN[i],
                        i + 1 < a.nTab && (r += "[|]");
                for (t in r += "[/*]",
                     n = i = 0,
                     a.movs) {
                    for (r += "[*]",
                         i = 0; i < a.nTab; i++) {
                        if (0 < a.movs[t][a.TabC[i]].length)
                            switch (a.TabC[i]) {
                                default:
                                    r += a.movs[t][a.TabC[i]];
                                    break;
                                case "name":
                                    r += "[player]" + a.movs[t][a.TabC[i]] + "[/player]";
                                    break;
                                case "ally":
                                    r += "[ally]" + a.movs[t][a.TabC[i]] + "[/ally]"
                            }
                        i + 1 < a.nTab && (r += "[|]")
                    }
                    r += "[/*]"
                }
                r += "[/table]"
        }
        return r += function() {
            var e = "[/quote]";
            MH.gRAP.Date ? e += MH.rep.Foot(a.time) : e += MH.rep.Foot();
            return e
        }(),
            r;
        function d(e, t) {
            var n = "[table][*][b]";
            return "powers" != t && (n += MH.bbcT(e.att.town) + "\n"),
                n += MH.bbcP(e.att.player) + "\n" + MH.bbcA(e.att.ally) + "[/b][|][img]" + MH.GameImg + e.ico + "[/img][|]",
                n += "[b]" + MH.bbcT(e.def.town) + "\n" + MH.bbcP(e.def.player) + "\n" + MH.bbcA(e.def.ally) + "[/b][|][b]" + e.title + "[/b][/*][/table]"
        }
    }
        ,
        MH.rep.bbCodeMake_Mono = function(t) {
        var e, n, i, a, o, r = "", l = "[img]" + MH.Home + "gui/ldou.gif[/img]\n", s = "[img]" + MH.Home + "gui/lsin.gif[/img]\n", r = function() {
            var e = "[quote][table][*]" + MH.WhtImg(40) + "[|][font=monospace]";
            e += "[img]" + MH.Home + "gui/ldou.gif[/img]\n",
                MH.gRAP.Title && (e += "[b]" + MH.bbcS(t.title, 9) + "[/b]\n",
                                  e += "[img]" + MH.Home + "gui/ldou.gif[/img]\n");
            return e
        }();
        switch (t.type) {
            default:
                return null;
            case "breach":
            case "take_over":
            case "attack":
                r += g() + f() + "[img]" + MH.Home + "gui/latt.gif[/img]\n" + h() + _(),
                    MH.gRAP.Booty && null != t.load && (r += "[b]" + t.load + "\n"),
                    MH.gRAP.Booty2 && "" != t.res.count && (r += MH.rep.ResF(t.res)),
                    r += (0 < t.attacktxt.length ? s + MH.bbc(MH.Home + "m/RR.png", "img") + t.attacktxt : "") + s + b();
                break;
            case "raise":
            case "attack_support":
                r += g() + f() + s + h() + _() + s + b();
                break;
            case "illusion":
                r += g() + s + h() + s + t.efekt.title;
                break;
            case "powers":
                var d = "gx";
                switch (t.god) {
                    case "zeus":
                        d = "ga";
                        break;
                    case "poseidon":
                        d = "gc";
                        break;
                    case "hera":
                        d = "gd";
                        break;
                    case "athena":
                        d = "gb";
                        break;
                    case "hades":
                        d = "ge";
                        break;
                    case "artemis":
                        d = "gf";
                        break;
                    case "aphrodite":
                        d = "gg";
                        break;
                    case "ares":
                        d = "gh"
                }
                if ("chain_lightning" == t.powid && (d = "ga"),
                    r += g() + s + h() + s,
                    r += t.efekt.title + " " + t.powimg16 + "\n",
                    null != t.efekt.det) {
                    switch (t.powtype) {
                        case 1:
                            r += MH.rep.Res(t.res);
                            break;
                        case 2:
                            r += "[color=#008000][b]" + t.efekt.det + "[/b][/color]\n",
                                r += c(t.res.unit_list, t.res.unit_send) + "\n";
                            break;
                        case 3:
                            r += MH.Lang.spelltime + ": " + MH.utl.secsToHHMMSS(t.powtime) + " h\n",
                                r += t.powend
                    }
                    "illusion" == t.powid && ("" == t.efekt.det2 ? r += t.efekt.det : (r += "atak za: " + t.efekt.det2,
                                                                                       r += "\nczas ataku " + t.efekt.det)),
                        "cleanse" == t.powid && null != t.pID && (r += "\n" + t.pID)
                }
                break;
            case "command_curator":
                for (e in t.movs)
                    0 < e && (r += s + "\n"),
                        t.movs[e].NoCmdTxt ? r += t.movs[e].NoCmdTxt + "\n" : MH.rep.FiltrCommand(t.movs[e]) && (r += t.movs[e].img + " " + t.movs[e].time + " " + t.movs[e].townA + " " + t.movs[e].inoutImg + " " + t.movs[e].townB + "\n",
                                                                                                                 MH.gRAP.HideUnits || ("" != t.movs[e].unit_list && (r += c(t.movs[e].unit_list, t.movs[e].unit_send) + t.movs[e].power + "\n"),
                                                                                                                                       "" != t.movs[e].spy && (r += t.movs[ind].spy + "\n")));
                break;
            case "commands_list":
                r += "[b]" + MH.Lang.cmdToCity + ": [/b][town]" + Game.townId + "[/town] (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n",
                    r += w(t.movs);
                break;
            case "espionage":
                if (r += g() + s + h() + s,
                    "" != t.def.title && t.SpyOk && (r += t.def.title + "\n",
                                                     MH.gRAP.AllU ? "" != t.def.unit_list ? r += c(t.def.unit_list, t.def.unit_send) + "\n" : r += MH.Lang.NOTUNIT + "\n" : r += "[i]" + MH.Lang.HIDDEN + "[/i]\n"),
                    "" != t.build.title && t.SpyOk && (r += t.build.title + "\n",
                                                       MH.gRAP.SpyB ? r += MH.rep.Buldings(t.build, 15) + "\n" : r += "[i]" + MH.Lang.HIDDEN + "[/i]\n"),
                    r += t.iron.title + " ",
                    "" != t.iron.count && (MH.gRAP.SpyC ? r += MH.bbc(MH.Home + "medias/images/riron.png", "img") + " " + MH.bbcS(t.iron.count, 8) + "\n" : r += "[i]" + MH.Lang.HIDDEN + "[/i]\n"),
                    "" != t.res.title && t.SpyOk && MH.gRAP.SpyR && (r += MH.bbcS(t.res.title, 8) + "\n",
                                                                     r += t.res.detail + "\n"),
                    t.SpyOk) {
                    r += "[b]" + t.spygoodtitle + "\n[/b][img]";
                    d = "gx";
                    switch (t.spygod.toLowerCase()) {
                        case "zeus":
                            d = "ga";
                            break;
                        case "poseidon":
                            d = "gc";
                            break;
                        case "hera":
                            d = "gd";
                            break;
                        case "athena":
                            d = "gb";
                            break;
                        case "hades":
                            d = "ge";
                            break;
                        case "artemis":
                            d = "gf";
                            break;
                        case "aphrodite":
                            d = "gg";
                            break;
                        case "ares":
                            d = "gh"
                    }
                    r += MH.Home + "pow/" + d + ".png[/img]"
                }
                t.SpyOk || (r += "[b]" + t.def.title + "[/b]");
                break;
            case "conquest":
                1 == t.forum ? (r += MH.GLng.Town + ": " + t.def.town + " (" + MH.Lang.incoown + " " + t.def.player + " [ally]" + mhCol.AllyName_PlayName(t.def.player.replace(/\[ally\](.*?)\[\/ally\]/, "$1")) + "[/ally])\n",
                                r += MH.Lang.occupant + ": " + t.att.town + " [player]" + mhCol.PlayName_TownID(t.att.town.replace(/\[town\](.*?)\[\/town\]/, "$1")) + "[/player] [ally]" + mhCol.AllyName_PlayName(mhCol.PlayName_TownID(t.att.town.replace(/\[town\](.*?)\[\/town\]/, "$1"))) + "[/ally]\n",
                                r += t.time_on) : (r += MH.GLng.Town + ": " + t.def.town + " (" + MH.Lang.incoown + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n",
                                                   r += MH.Lang.occupant + ": " + t.att.player + " [ally]" + mhCol.AllyName_PlayName(t.att.player.replace(/\[player\](.*?)\[\/player\]/, "$1")) + "[/ally]\n",
                                                   r += MH.Lang.occuend + ": ~" + t.time_on + " [b]= " + t.time_at + "[/b]"),
                    r += s,
                    r += "[b]" + t.txt_allunits + "[/b]\n",
                    MH.gRAP.HideDeffArmy ? r += "[i]" + MH.Lang.HIDDEN + "[/i]\n" : "" != t.att.unit_list ? r += c(t.att.unit_list, t.att.unit_send) + "\n" : r += MH.Lang.NOTUNIT + "\n",
                    r += s,
                    r += "[b]" + t.txt_ruchy + "[/b]\n",
                    MH.gRAP.HideIncoArmy ? r += "[i]" + MH.Lang.HIDDEN + "[/i]\n" : r += w(t.movs);
                break;
            case "conquerold":
                i = t.def.town.replace(/\[town\](.*?)\[\/town\]/, "$1"),
                    o = mhCol.PlayId_TownID(i),
                    r += MH.GLng.Town + ": " + t.def.town + " (" + MH.Lang.incoown + " [player]" + mhCol.PlayName_PlayId(o) + "[/player] [ally]" + mhCol.AllyName_PlayName(mhCol.PlayName_PlayId(o)) + "[/ally])\n",
                    r += MH.Lang.occupant + ": [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally]\n",
                    r += t.txt_end + " [b]" + t.time_at + "[/b]",
                    r += s,
                    r += t.att.units_title + "\n",
                    MH.gRAP.HideDeffArmy ? r += "[i]" + MH.Lang.HIDDEN + "[/i]\n" : "" != t.att.unit_list ? r += c(t.att.unit_list, t.att.unit_send) + "\n" : r += MH.Lang.NOTUNIT + "\n";
                break;
            case "conquerold_troops":
                r += "[b]" + t.txtRuchy + " [/b] (" + MH.Lang.incoocu + " [player]" + Game.player_name + "[/player] [ally]" + Game.alliance_name + "[/ally])\n",
                    r += w(t.movs);
                break;
            case "found":
            case "conquer":
                r += g() + h() + s + t.detail;
                break;
            case "support":
                if ("" == t.att.unit_list)
                    return null;
            case "command":
                r += g() + s + h() + s,
                    t.SelTroop = !1,
                    "command" == t.type && "X" == t.ico.charAt(t.ico.length - 6) && (MH.gRAP.SelT && (t.SelTroop = t.ico),
                                                                                     t.ico = "/images/game/unit_overview/attack.png"),
                    "support" == t.type && (r += MH.Lang.supontar + "\n"),
                    "command" == t.type && (r += "[img]" + MH.GameImg + t.ico + "[/img]" + t.detail.time_title + " " + t.detail.time_time + "\n"),
                    "command" == t.type && (r += t.att.units_title + ":\n"),
                    MH.gRAP.AllU ? "" != t.att.unit_list ? (r += c(t.att.unit_list, t.att.unit_send) + " ",
                                                            0 != t.SelTroop && (r += "[img]" + t.SelTroop + "[/img]"),
                                                            r += t.att.pow + "\n") : r += MH.Lang.NOTUNIT + "\n" : r += "[i]" + MH.Lang.HIDDEN + "[/i]\n";
                break;
            case "otherTxt":
                r += t.html;
                break;
            case "otherUni":
                r += "[center] [player]" + Game.player_name + "[/player]  ([ally]" + Game.alliance_name + "[/ally])\n",
                    r += s,
                    r += t.html,
                    r += "\n\n",
                    MH.gRAP.HideAttUnits && (r += "[img]" + MH.Home + "gui/hidden.gif[/img]"),
                    r += c(t.att.unit_list, t.att.unit_send) + "\n",
                    r += "[/center]";
                break;
            case "nofification":
                r += MH.bbCodeHTML(t.html, !1, t.title);
                break;
            case "agora_thanks":
                r += "[b]" + t.txt_obrona + " [town]" + Game.townId + "[/town]:[/b]\n";
                var p = 0;
                for (i in t.lst)
                    r += ++p + ". [player]" + t.lst[i].name + "[/player]  ->  [ally]" + t.lst[i].ally + "[/ally]\n";
                break;
            case "agora_in":
            case "agora_out":
                for (e in t.movs)
                    0 < e && (r += s + "\n"),
                        r += t.movs[e].title + "\n",
                        MH.gRAP.DefU ? r += c(t.movs[e].unit_list, t.movs[e].unit_send) + "\n" : r += "[i]" + MH.Lang.HIDDEN + "[/i]\n";
                break;
            case "wall":
                r += t.txtWall + "\n",
                    r += l,
                    "" != t.def.txt && (MH.gRAP.WalDA || MH.gRAP.WalDD) && (r += "[b]" + MH.bbcS(t.def.txt, 10) + "[/b]\n",
                                                                            "" != t.def.txtAtt && MH.gRAP.WalDA && (r += MH.bbcS(t.def.txtAtt, 8) + "\n",
                                                                                                                    r += u(t.def.att.unit_list, t.def.att.unit_count) + "\n"),
                                                                            "" != t.def.txtDef && MH.gRAP.WalDD && (r += MH.bbcS(t.def.txtDef, 8) + "\n",
                                                                                                                    r += u(t.def.def.unit_list, t.def.def.unit_count) + "\n")),
                    "" != t.los.txt && (MH.gRAP.WalLA || MH.gRAP.WalLD) && ("" != t.def.txt && (r += l + "\n"),
                                                                            r += "[b]" + MH.bbcS(t.los.txt, 10) + "[/b]\n",
                                                                            "" != t.los.txtAtt && MH.gRAP.WalLA && (r += MH.bbcS(t.los.txtAtt, 8) + "\n",
                                                                                                                    r += u(t.los.att.unit_list, t.los.att.unit_count) + "\n"),
                                                                            "" != t.los.txtDef && MH.gRAP.WalLD && (r += MH.bbcS(t.los.txtDef, 8) + "\n",
                                                                                                                    r += u(t.los.def.unit_list, t.los.def.unit_count) + "\n"));
                break;
            case "buildings":
            case "academy_research":
                return null;
            case "island":
                for (o in r = M(),
                     r += "[island]" + t.island + "[/island] [img]" + MH.Home + "e/9/ocean.gif[/img] " + t.sea + " [img]" + MH.Home + "e/9/free.gif[/img] " + t.free,
                     r += "[table]",
                     a = e = 0,
                     t.movs)
                    r += "[*]",
                        r += ++e + ".[|][town]",
                        r += t.movs[o].town,
                        r += "[/town][|]",
                        r += t.movs[o].pnts,
                        r += "[|][player]" + t.movs[o].name + "[/player]\n",
                        r += "[|][ally]" + t.movs[o].ally + "[/ally]",
                        r += "[/*]";
                return r += "[/table]",
                    r += H();
            case "ally_profile":
                if (r = M(),
                    r += "[ally]" + t.ally + "[/ally]  " + MH.GLng.Ranking + ":" + t.nfo.rank + "  " + MH.GLng.Points + ":" + t.nfo.points + "  " + t.txtMembers + ":" + t.nfo.members + "  " + MH.GLng.Towns + ":" + t.nfo.towns + "\n\n",
                    MH.gRAP.PrfB && (r += "[img]" + t.img + "[/img]",
                                     r += "[size=10]" + t.bbcode + "\n\n[/size]"),
                    MH.gRAP.PrfA) {
                    for (a in r += "[table]",
                         e = 1,
                         t.movs)
                        r += "[*]" + e++ + ".[|][player]",
                            r += t.movs[a].name,
                            r += "[/player][|]",
                            r += t.movs[a].txt.replace(",", "[|]"),
                            r += "[/*]";
                    r += "[/table]"
                }
                return r += H();
            case "player_profile":
                if (r = M(),
                    r += "[player]" + t.play + "[/player]  " + MH.GLng.Ranking + ":" + t.nfo.rank + "  " + MH.GLng.Points + ":" + t.nfo.points + "  " + MH.GLng.Towns + ":" + t.nfo.towns + "  " + MH.GLng.Ally + ":[ally]" + t.ally + "[/ally]\n\n",
                    MH.gRAP.PrfB && (r += "[img]" + t.img + "[/img]",
                                     r += "[size=10]" + t.bbcode + "\n\n[/size]"),
                    MH.gRAP.PrfA) {
                    for (a in r += "[table]",
                         e = 1,
                         t.movs)
                        r += "[*]" + e++ + ".[|][town]",
                            r += t.movs[a].townID,
                            r += "[/town][|]",
                            r += t.movs[a].txt1,
                            r += t.movs[a].txt2,
                            r += "[/*]";
                    r += "[/table]"
                }
                return r += H();
            case "ranking":
                for (r = M(),
                     r += t.txt,
                     r += "[table][*]",
                     e = 0; e < t.nTab; e++)
                    r += t.TabN[e],
                        e + 1 < t.nTab && (r += "[|]");
                for (o in r += "[/*]",
                     a = e = 0,
                     t.movs) {
                    for (r += "[*]",
                         e = 0; e < t.nTab; e++) {
                        if (0 < t.movs[o][t.TabC[e]].length)
                            switch (t.TabC[e]) {
                                default:
                                    r += t.movs[o][t.TabC[e]];
                                    break;
                                case "name":
                                    r += "[player]" + t.movs[o][t.TabC[e]] + "[/player]";
                                    break;
                                case "ally":
                                    r += "[ally]" + t.movs[o][t.TabC[e]] + "[/ally]"
                            }
                        e + 1 < t.nTab && (r += "[|]")
                    }
                    r += "[/*]"
                }
                return r += "[/table]",
                    r += H();
            case "easter_recipes":
                for (a in t.recipes) {
                    for (n in r += "[b]" + t.recipes[a].name + "[/b]\n",
                         t.recipes[a].rec)
                        r += t.recipes[a].rec[n][0],
                            r += " + ",
                            r += t.recipes[a].rec[n][1],
                            r += " + ",
                            r += t.recipes[a].rec[n][2],
                            r += " = ",
                            r += "[img]" + t.recipes[a].rec[n][3] + "[/img]",
                            r += "\n";
                    r += "\n"
                }
        }
        return r += function() {
            var e = "\n[img]" + MH.Home + "gui/ldou.gif[/img]";
            e += "[/font][|]" + MH.WhtImg(38) + "[/*][/table][/quote]",
                MH.gRAP.Date ? e += MH.rep.Foot(t.time) : e += MH.rep.Foot();
            return e
        }();
        function c(e, t) {
            var n = "";
            if (null == e)
                return n;
            for (var i = 0; i < e.length; i++)
                n += "[img]" + MH.Home + "i.php?v=",
                    n += e[i],
                    n += t[i],
                    n += "[/img]";
            return n
        }
        function m(e, t, n) {
            var i = "";
            if (null == e)
                return i;
            for (var a = 0; a < e.length; a++)
                i += "[img]" + MH.Home + "i.php?v=",
                    i += e[a],
                    i += t[a],
                    i += "-",
                    i += n[a],
                    i += "[/img]";
            return i
        }
        function u(e, t) {
            var n, i, a = "", o = [], r = [], l = j = 0;
            for (o[l] = [],
                 r[l] = [],
                 n = e.length,
                 i = 0; i < n; i++)
                13 < j && (j = 0,
                           o[++l] = [],
                           r[l] = []),
                    o[l].push(e[i]),
                    r[l].push(t[i]),
                    j++;
            for (i = 0; i <= l; i++)
                a += c(o[i], r[i]) + "\n";
            return a
        }
        function g() {
            return "[b]" + MH.bbcS(MH.Lang.ATTACKER, 10) + "[/b]: " + MH.bbcT(t.att.town) + " " + MH.bbcP(t.att.player) + " " + MH.bbcA(t.att.ally) + " " + MH.bbcS(t.morale + " " + t.luck, 8) + "\n"
        }
        function f() {
            var e = "";
            return MH.gRAP.AttU ? (e += m(t.att.unit_list, t.att.unit_send, t.att.unit_lost),
                                   e += t.att.pow + "\n") : e += "[i]" + MH.Lang.HIDDEN + "[/i]\n",
                e
        }
        function h() {
            return "[b]" + MH.bbcS(MH.Lang.DEFENDER, 10) + "[/b]: " + MH.bbcT(t.def.town) + " " + MH.bbcP(t.def.player) + " " + MH.bbcA(t.def.ally) + " " + MH.bbcS(t.oldwall + " " + t.oldbuld + " " + t.nightbonus, 8) + "\n"
        }
        function _() {
            var e = "";
            return MH.gRAP.DefU ? "" != t.def.unit_send ? (e += m(t.def.unit_list, t.def.unit_send, t.def.unit_lost),
                                                           e += t.def.pow + "\n") : e += MH.Lang.NOTUNIT + "\n" : e += "[i]" + MH.Lang.HIDDEN + "[/i]\n",
                e
        }
        function b() {
            var e;
            return MH.gRAP.Costs ? (e = MH.bbc(MH.Home + "v/loss.png", "img") + "[b]" + MH.bbcS(MH.GLng.Costs, 9) + "[/b]\n",
                                    MH.gRAP.AttU || (t.att.w = t.att.i = t.att.s = t.att.p = t.att.f = "?"),
                                    MH.gRAP.DefU || (t.def.w = t.def.i = t.def.s = t.def.p = t.def.f = "?"),
                                    "" != t.att.w && (e += MH.bbcS(MH.bbcVAL(t.att.w, 10) + MH.bbcVAL(t.att.s, 10) + MH.bbcVAL(t.att.i, 10) + MH.bbcVAL(t.att.p, 10) + MH.bbcVAL(t.att.f, 10) + " [b]" + MH.Lang.ATTACKER + "[/b]", 8) + "\n",
                                                      e += MH.bbcS(MH.bbcVAL(t.def.w, 10) + MH.bbcVAL(t.def.s, 10) + MH.bbcVAL(t.def.i, 10) + MH.bbcVAL(t.def.p, 10) + MH.bbcVAL(t.def.f, 10) + " [b]" + MH.Lang.DEFENDER + "[/b]", 8) + "\n"),
                                    e) : ""
        }
        function M() {
            var e = "[quote]";
            return e += "[img]" + MH.Home + "gui/ldou.gif[/img]\n",
                MH.gRAP.Title && (e += "[b]" + MH.bbcS(t.title, 9) + "[/b]\n",
                                  e += "[img]" + MH.Home + "gui/ldou.gif[/img]\n"),
                e
        }
        function H() {
            var e = "\n[img]" + MH.Home + "gui/ldou.gif[/img]";
            return e += "[/quote]",
                MH.gRAP.Date ? e += MH.rep.Foot(t.time) : e += MH.rep.Foot(),
                e
        }
        function w(e) {
            var t;
            if (r = s,
                0 == e.length)
                return r + MH.Lang.incozero;
            for (t = 0; t < e.length; t++)
                null != e[t].time_at && 0 != MH.rep.FiltrCommand(e[t]) && (0 < t && (r += s),
                                                                           r += t + 1 + " ",
                                                                           "in" == e[t].inout && (r += "[img]" + MH.Home + "m/arL.png[/img][img]" + e[t].img + "[/img]"),
                                                                           "out" == e[t].inout && (r += "[img]" + e[t].img + "[/img][img]" + MH.Home + "m/arR.png[/img]"),
                                                                           "none" == e[t].inout && (r += "[img]" + e[t].img + "[/img]"),
                                                                           r += " ~" + e[t].time_on + " (" + e[t].time_at + ") ",
                                                                           r += "[town]" + e[t].town + "[/town] [player]" + e[t].player + "[/player]");
            return r
        }
    }
    ;
    var Emots = {
        Emoty1: ["1/usmiech", "1/ostr", "1/kwadr", "1/smutny", "1/smutny2", "1/yyyy", "1/uoeee", "1/zadowolony", "1/luzik", "1/rotfl", "1/oczko", "1/mniam", "1/jezyk", "1/jezyk_oko", "1/stres", "1/nerwus", "1/zly", "1/w8", "1/bezradny", "1/krzyk", "1/szok", "1/hura", "1/tak", "1/oklaski", "1/boisie", "1/prosi", "1/milczek", "1/nie", "1/hejka", "1/okok", "1/cwaniak", "1/haha", "1/mysli", "1/lezkawoku", "1/papa", "1/papa_buzka", "1/kwiatek", "1/foch", "1/zmeczony", "1/beczy", "1/diabel", "1/glupek", "1/wysmiewacz", "1/zalamka", "1/zmartwienie", "1/buzki", "1/zawstydzony", "1/dobani", "1/dokuczacz", "1/figielek", "1/spadaj", "1/paluszkiem", "1/wnerw", "1/zacieszacz", "1/muza", "1/aparat", "1/kotek", "1/piesek", "1/pocieszacz", "1/buziak", "1/plotki", "1/plask", "1/klotnia", "1/chatownik", "1/wesoly", "1/mruga", "1/lol", "1/rotfl2", "1/zakochany", "1/tiaaa", "1/wc", "1/ziew", "1/bije", "1/dostal", "1/zniesmaczony", "1/zab", "1/puknijsie", "1/gafa", "1/soczek", "1/winko", "1/palacz", "1/gazeta", "1/gra", "1/telefon", "1/zakupy", "1/spioch", "1/wanna", "1/prysznic", "1/pada", "1/woblokach", "1/snieg", "1/slonko", "1/okularnik", "1/jepizze", "1/obiad", "1/tort", "1/piwko", "1/olaboga", "1/hmmm", "1/alejaja", "1/palka", "1/kwiaty", "1/jezyczek", "1/wiwat", "1/uklon", "1/przypal", "1/drink", "1/drinkona", "1/fajek", "1/lupa", "1/snajper", "1/policjant", "1/dzwoni", "1/plakus", "1/alejaaja", "1/tusmiech1", "1/tusmiech2", "1/tusmiech3", "1/tusmiech4", "1/tok", "1/tpa", "1/tpapa", "1/tjupi", "1/tpeace", "1/ttak", "1/t10ton", "1/tplacze", "1/tnie", "1/tniedobrze", "1/tzmieszanie", "1/tzly", "1/twsciekly", "1/tdobani", "1/tsmutny", "1/tbeczy", "1/tjezyk", "1/tjezyk2", "1/tcmok", "1/tgwizd", "1/thaha", "1/tkrzywy", "1/tzeby", "1/tzawstydzony", "1/tkwasny", "1/tslonko", "1/tserduszka", "1/thihihi", "1/toczko", "1/tfejk", "1/tdupa", "1/ttuptup", "1/tstop", "1/thipnoza", "1/tbojesie", "1/tco", "1/toczy", "1/tchytry", "1/tcojest", "1/tlol", "1/tmenu", "1/ttanczy", "1/tcisza", "1/tglupek", "1/tfaja", "1/tsoczek", "1/tpiwo", "1/tzjem", "1/tjem", "1/tniepowiem", "1/tpomocy", "1/tstrach", "1/twow", "1/tysz", "1/tlezaca", "1/tczytaj", "1/tuczen", "1/tczyta", "1/tsciana", "1/tboks", "1/tniewiem", "1/tpaker", "1/t3msie", "1/tglaszcze", "1/ttuli", "1/tuscisk", "1/tcalus", "1/tklotnia", "1/tsamochod", "1/tspie", "1/tprysznic", "1/tpisze", "1/tcwaniak", "1/tczarodziej", "1/tdiabelek", "1/tbalwan", "1/taniolek", "1/tkiler", "1/machinegun", "1/rolki", "1/szatan", "1/pytajnik", "1/wykrzyknik", "1/biggrin.png", "1/frown.png", "1/mad.png", "1/tongue.png", "1/redface.png", "1/confused.png", "1/wink.png", "1/smile.png", "1/rolleyes.png", "1/cool.png", "1/eek.png", "1/s01", "1/s02", "1/s03", "1/s04", "1/s05", "1/s06", "1/s07", "1/s08", "1/s09", "1/s10", "1/s11", "1/s12", "1/s13", "1/s14", "1/s15", "1/s16", "1/s17", "1/s18", "1/s19", "1/s20", "1/s21", "1/s22", "1/s23", "1/s24", "1/s25", "1/s26", "1/s27", "1/s28", "1/s29", "1/s30", "1/s31", "1/s32", "1/s33", "1/s34", "1/s35", "1/s36", "1/s37", "1/s38", "1/s39", "1/s40", "1/s41", "1/s42", "1/s43", "1/s44", "1/s45", "1/s46", "1/s47", "1/s48", "1/s49", "1/s50", "1/s51", "1/s52", "1/s53", "1/s54", "1/s55", "1/s56", "1/s57", "1/s58", "1/s59", "1/s60", "1/s61", "1/s62", "1/s63", "1/s64", "1/s65", "1/s66", "1/s67", "1/s68", "1/s69", "1/s70", "1/s71", "1/s72", "1/s73", "1/s74", "1/s75", "1/s76", "1/s77", "1/s78", "1/s79", "1/s80", "1/s81", "1/s82", "1/s83", "1/s84", "1/s85", "1/s86", "1/s87", "1/uzi", "1/wleb", "1/strach1", "1/strach2", "1/los1", "1/los2", "1/przypal2", "1/kot"],
        Emoty2: ["2/ahoy", "2/majtek", "2/szacunek", "2/rapidka", "2/rapidka2", "2/strach", "2/wrozy", "2/szczerbaty", "2/poszukiwacz", "2/czater", "2/spiewak", "2/szpada", "2/zhustka", "2/pojedynek", "2/kompani", "2/pirat", "2/armata", "2/pirat2", "2/pirat3", "2/skarb", "2/zflaga", "2/salut", "2/pifpaf", "2/kapitan", "2/czacha", "2/skrzynia", "2/tiki", "2/marynarz", "2/oczko", "2/bezrumu", "2/ognia", "2/bomba", "2/zeglarz", "2/brodaty", "2/jack", "2/piratka", "2/piratka2", "2/lol", "2/titanic", "2/walka", "2/nalinie", "2/software", "2/wyskakuj", "2/zarmaty", "2/piratuj", "2/piratpapuga", "2/piraci", "2/szabla", "2/korsarz1", "2/korsarz2", "2/korsarz3", "2/korsarz4", "2/jestok", "2/flirt", "2/przysypia", "2/ara", "2/machaszabla", "2/sparrow", "2/sparrow2", "2/sos", "2/brakrumu", "2/marynarz1", "2/marynarz2", "2/bijatyka", "2/sternik", "2/herb", "2/czaszka", "2/korsarz", "2/skacze", "2/zpapuga", "2/boss", "2/broda", "2/impreza", "2/picko", "2/usmiech", "2/okej", "2/nieok", "2/zart", "2/gwizda", "2/gwizda2", "2/niepewny", "2/zaskoczony", "2/przestraszony", "2/zly", "2/kopniety", "2/przerazony", "2/wesoly", "2/czyta", "2/zimno", "2/niewiedzial", "2/smutny", "2/ouch", "2/popcorn", "2/padaczka", "2/wdekiel", "2/atak", "2/skullbullet", "2/flaga", "2/papuga", "2/armatag", "2/korsi", "2/pirsi", "2/flaga2", "2/flaga4", "2/namiecze", "2/skacz", "2/grabierz", "2/tratwa", "2/wbajli", "2/zaburte", "2/lupy", "2/narekina", "2/zaloga", "2/flaga3", "2/statek", "2/statek2", "2/lup", "2/szable", "2/statek3", "2/zszabla1", "2/zszabla2"],
        Emoty3: ["3/usmiech", "3/tak", "3/szczerbek", "3/usmiech2", "3/usmiech3", "3/usmiechzabki", "3/1st", "3/2nd", "3/3rd", "3/klaun", "3/sumienie", "3/nie", "3/smutasek", "3/lzawi", "3/sorki", "3/placzejakdziecko", "3/placze", "3/beczy", "3/papa", "3/nudy", "3/niepewny", "3/ziewanie", "3/ziewbranoc", "3/ziew", "3/spi", "3/niewiem", "3/kopniety", "3/chytry", "3/hmm", "3/zlosliwy", "3/fuck", "3/zly", "3/wkurzony", "3/agresywny", "3/foch", "3/juhu", "3/takiego", "3/grozi", "3/jezyk", "3/jezyk2", "3/palka", "3/zirytowany", "3/wsciekly", "3/krzyczy", "3/awantura", "3/awantura2", "3/przestan", "3/szok", "3/zmieszany", "3/szuka", "3/puknijsie", "3/pukpuk", "3/onie", "3/kaczuszki", "3/brwi", "3/regulamin", "3/zdziwiony", "3/oczy", "3/zdziwko", "3/lagodny", "3/megaszok", "3/rozgladasie", "3/glupek", "3/oziebly", "3/znudzony", "3/ziewa", "3/foh", "3/swietny", "3/akuku", "3/ziomal", "3/zwyciestwo", "3/yool", "3/gratki", "3/terefere", "3/radocha", "3/gibanie", "3/podchmielony", "3/tanczy", "3/tanczy2", "3/klaska", "3/haha", "3/podziw", "3/oczko", "3/oczko2", "3/oczko3", "3/witaj", "3/witaj2", "3/klaszcze", "3/swir", "3/ubaw", "3/zadowolony", "3/tofajnie", "3/kciukgora", "3/kciukdol", "3/wrrum", "3/jest", "3/napina", "3/sekret", "3/slinisie", "3/napalony", "3/mdleje", "3/gwizdze", "3/sila", "3/sila2", "3/kompwpysk", "3/pobity", "3/namawia", "3/zip", "3/pomidory", "3/ucieczka", "3/psychniety", "3/poddaje", "3/prosi", "3/blagam", "3/zawstydzony", "3/zonk", "3/zonk2", "3/pacman", "3/adolf", "3/bije", "3/box", "3/cwiczy", "3/silacz", "3/zarowka", "3/pizza", "3/zygi", "3/zdrowko", "3/piwko", "3/smutnyspacer", "3/smutnyaniol", "3/uscisk", "3/zakochani", "3/walnac", "3/klutnia", "3/kumple", "3/rucha", "3/odkurz", "3/nosze", "3/doktor", "3/szpady", "3/patyk", "3/zgoda", "3/flaga", "3/tuli", "3/zebranie", "3/debata", "3/lole", "3/winko", "3/zazdrosni", "3/cezar", "3/obrazony", "3/tupie", "3/kima", "3/piwka", "3/zalamka", "3/szama", "3/tancuja", "3/napiernicza", "3/chatuja", "3/ela1", "3/ela2", "3/ela3", "3/ela4", "3/ela5", "3/ela6", "3/LOL", "3/respekt", "3/punk", "3/dzidzius", "3/dziura", "3/dziad1", "3/dziad2", "3/dziad3", "3/dziad4", "3/wasaty", "3/czarnoksieznik", "3/fala", "3/grupfoto", "3/przytulasy", "3/uuu", "3/mil01", "3/mil02", "3/mil03", "3/mil04", "3/mil05", "3/mil06", "3/mil07", "3/mil08", "3/mil09", "3/mil10", "3/mil11", "3/mil12", "3/mil13", "3/mil14", "3/mil15", "3/mil16", "3/mil17", "3/mil18", "3/mil19", "3/mil20", "3/mil21", "3/mil22", "3/mil23", "3/mil24", "3/mil25", "3/mil26", "3/mil27", "3/mil28", "3/mil29", "3/mil30", "3/mil31", "3/mil32"],
        Emoty3b: ["3b/cowboy", "3b/cowboy2", "3b/rolnik", "3b/baca", "3b/czapeczka", "3b/czapeczka2", "3b/czapeczka3", "3b/czapeczka4", "3b/akordeon", "3b/czarodziej", "3b/biskup", "3b/kaznodzieja", "3b/policeman", "3b/policjant", "3b/detektyw", "3b/zolnierz", "3b/szef", "3b/pieniazek", "3b/afro", "3b/kibol", "3b/kibol2", "3b/student", "3b/torba", "3b/aniol", "3b/rybak", "3b/lowi", "3b/surfing", "3b/plywak", "3b/pilot", "3b/skuter", "3b/miesza", "3b/gotuje", "3b/smazy", "3b/kucharz", "3b/glodny", "3b/zuje", "3b/lize", "3b/kelner", "3b/muszka", "3b/piwka", "3b/joint", "3b/kozak", "3b/kozak2", "3b/faja", "3b/kurzak", "3b/grabarz", "3b/winko", "3b/pijaki", "3b/piwko", "3b/boss", "3b/szampan", "3b/degustant", "3b/zrozna", "3b/czyta", "3b/kawka", "3b/przemawia", "3b/koniectematu", "3b/gazeta", "3b/czytaj", "3b/pisze", "3b/maluje", "3b/papa", "3b/tele", "3b/telefon", "3b/komorka", "3b/tv", "3b/tv2", "3b/matrix", "3b/komp", "3b/lamer", "3b/walkman", "3b/dj", "3b/muzyka", "3b/perkusja", "3b/punk", "3b/trabka", "3b/zespol", "3b/wisielec", "3b/sniezka", "3b/zimno", "3b/zimno2", "3b/snieg", "3b/wczasy", "3b/trening", "3b/myjezemby", "3b/uzi", "3b/spluwa", "3b/mysliwy", "3b/uzbrojony", "3b/samoboj", "3b/samoboj2", "3b/zolnierz2", "3b/wmur", "3b/wmur2", "3b/roza", "3b/stokrotki", "3b/stokroty", "3b/zoltakartka", "3b/czerwonakartka", "3b/mlot", "3b/manrikikusari", "3b/zeby", "3b/rokefeler", "3b/cwaniak", "3b/cool", "3b/cool2", "3b/dupa", "3b/rowerek", "3b/kolarz", "3b/zbanowany", "3b/dziecko", "3b/dzieci", "3b/walwleb", "3b/romeo", "3b/smierc", "3b/glowki", "3b/transformer", "3b/lolflag", "3b/dziary", "3b/swiety", "3b/krol", "3b/faja2", "3b/kaska", "3b/wyciska", "3b/pobudka", "3b/zeglarz", "3b/chmurka", "3b/ninja", "3b/gitara", "3b/mikolaj", "3b/kon", "3b/piwolot", "3b/drinkuje", "3b/jablko", "3b/patataj", "3b/mop", "3b/mop2", "3b/ban", "3b/spam", "3b/magik", "3b/szczena", "3b/rycerz", "3b/wiking", "3b/polska", "3b/brawo", "3b/szama", "3b/picko", "3b/diabel", "3b/diabel2", "3b/gitara2", "3b/buja", "3b/skrzat", "3b/skrzaty", "3b/skrzaty2", "3b/bysiu", "3b/dzieki", "3b/malowane", "3b/obstrzal", "3b/doataku", "3b/kosiarz", "3b/witamy"],
        Emoty3c: ["3c/manicure", "3c/robotka", "3c/mdleje", "3c/zegna", "3c/jekwiatek", "3c/swiruje", "3c/psychopatka", "3c/bezprzypalu", "3c/ziewka", "3c/babki", "3c/wraczke", "3c/milosc", "3c/zaciera", "3c/skacze", "3c/wygoniona", "3c/tango", "3c/zdrada", "3c/jezyk", "3c/walc", "3c/dajbuzi", "3c/wyznanie", "3c/paluszkiem", "3c/paznokietki", "3c/dryni", "3c/gdziedmuchac", "3c/brawo", "3c/spiewa", "3c/toon", "3c/czyrliderka", "3c/niebieska", "3c/fajek", "3c/kolezanki", "3c/usmiech", "3c/mruga", "3c/nuda", "3c/haha", "3c/hihi", "3c/faza", "3c/hej", "3c/szalona", "3c/flirt", "3c/calus", "3c/buzka", "3c/zakochana", "3c/serce", "3c/niedowiary", "3c/okurcze", "3c/smutna", "3c/beczy", "3c/placze", "3c/histeria", "3c/zla", "3c/kopnieta", "3c/wchowanego", "3c/sciema", "3c/buja", "3c/nieslucham", "3c/zachwycona", "3c/apsik", "3c/szok", "3c/dlaczego", "3c/chirli", "3c/blondynka", "3c/smierdzi", "3c/oczko", "3c/atletka", "3c/suszyzeby", "3c/kicha", "3c/radocha", "3c/rumieniec", "3c/tonieja", "3c/zdziwiona", "3c/ziewa", "3c/alesmieszne", "3c/sorki", "3c/fochy", "3c/palka", "3c/wielkastopa", "3c/usmieszek", "3c/utratasil", "3c/niedowierza", "3c/tupie", "3c/agentka", "3c/niewiem", "3c/alejaja", "3c/tanczy", "3c/mysli", "3c/lusterko", "3c/profesor", "3c/tancuje", "3c/uklon", "3c/swiruska", "3c/hyhy", "3c/zdziwko", "3c/jola", "3c/krolowa", "3c/tak", "3c/grymas", "3c/drapie", "3c/stres", "3c/chora", "3c/aerobik", "3c/czeka", "3c/zawiedziona", "3c/lala", "3c/salut", "3c/modlitwa", "3c/diabelaniol", "3c/wkurzona", "3c/nie", "3c/gala", "3c/spaghetti", "3c/wymioty", "3c/pijana", "3c/przeciaganie", "3c/proca", "3c/wiedzma", "3c/megafon", "3c/joging", "3c/laptop", "3c/laptopkawa", "3c/myjezemby", "3c/perfumy", "3c/roza", "3c/klaniasie", "3c/telefon", "3c/kucyki", "3c/slinka", "3c/tele", "3c/tele2", "3c/swieta", "3c/pecet", "3c/idzie", "3c/ksiazka", "3c/ksiazka2", "3c/gazeta", "3c/upal", "3c/juchu", "3c/czarka", "3c/talerze", "3c/foto", "3c/kuchta", "3c/lasuch", "3c/cieszysie", "3c/suszywlosy", "3c/pieniazek", "3c/dianiol", "3c/szaleje", "3c/siostra", "3c/rozokulary", "3c/obiad", "3c/kawka", "3c/zachwyt", "3c/chemia", "3c/feministka", "3c/artystka", "3c/profesorka", "3c/piersi", "3c/sniezka", "3c/stokrotka", "3c/dzemik", "3c/lody", "3c/gitara", "3c/dywan", "3c/skleroza", "3c/niemowi", "3c/caus", "3c/czaruje", "3c/swiatlo", "3c/lustro", "3c/pobudka", "3c/spray", "3c/motylek", "3c/krolewicz", "3c/mama", "3c/mama2", "3c/mama3", "3c/mama4", "3c/dziewczynka", "3c/dziewczynka2", "3c/maska", "3c/indianka", "3c/galy", "3c/zpieskiem", "3c/rgada", "3c/rsiostra", "3c/rodmowa", "3c/rokulary", "3c/rhaha", "3c/rstokrot", "3c/rpoczta", "3c/rskakanka", "3c/rtak", "3c/rszalona", "3c/rpapa", "3c/rmacha", "3c/ruklon", "3c/rusmiech", "3c/rcool", "3c/rkocha", "3c/rwstyd", "3c/rmilosc", "3c/rbiustonosz", "3c/bpapa", "3c/zpijanym", "3c/bszyje", "3c/zdobycz", "3c/odlot", "3c/klutnia", "3c/przyjaciolki", "3c/tniego", "3c/tancza", "3c/tancza2", "3c/sympatia", "3c/walczyk", "3c/wpoliczek", "3c/calusek", "3c/calusek2", "3c/martini", "3c/caluswrenke", "3c/ustausta", "3c/wybrany", "3c/zadyma"],
        Emoty4: ["4/usmiech", "4/tak", "4/kiepsko", "4/pinokio", "4/hihi", "4/haha", "4/hahaha", "4/cierpliwy", "4/refleks", "4/sorki", "4/ulga", "4/zatkajsie", "4/niezadowolony", "4/mysli", "4/foch", "4/kciukgora", "4/czas", "4/doroboty", "4/oczko", "4/sciany", "4/tanczy", "4/puknijsie", "4/placze", "4/jacidam", "4/taniec", "4/smiech", "4/dowcip", "4/smutny", "4/kopniety", "4/brzydal", "4/zgrywus", "4/cyklop", "4/lizus", "4/zegnaj", "4/klaszcze", "4/oklaski", "4/pardon", "4/pierdziuch", "4/piroman", "4/polewka", "4/wybryk", "4/poploch", "4/niepewny", "4/klamczuch", "4/wskazuje", "4/uklon", "4/tedy", "4/zakochany", "4/nurek", "4/roza", "4/wmur", "4/lasuch", "4/fajek", "4/kalendarz", "4/dowidzenia", "4/formula", "4/fantazje", "4/nasraczu", "4/zdobycz", "4/suszy", "4/faza", "4/tupie", "4/nerwus", "4/relaks", "4/lektora", "4/pisze", "4/kawka", "4/gracz", "4/kawa", "4/gril", "4/dajeroze", "4/gierka", "4/rozpacz", "4/hahahaha", "4/superman", "4/budzik", "4/pieski", "4/wioslo", "4/elektryk", "4/herbatka", "4/hustawka", "4/flahaha", "4/coto", "4/sluga", "4/wazniak", "4/wmasce", "4/fotograf", "4/samba", "4/swieczka", "4/swieczki", "4/fakersy", "4/klucie", "4/kapki", "4/telefony", "4/tosty", "4/odkurza", "4/drwal", "4/komora", "4/wbija", "4/szczesciarz", "4/rarpack", "4/balonik", "4/palka", "4/przemowa", "4/srubka", "4/mokafe", "4/dryni", "4/cumelek", "4/jojo", "4/tort", "4/malutki", "4/notatki", "4/boks", "4/klapa", "4/pies", "4/odkurzanie", "4/olimpiada", "4/nakonik", "4/wiokonik", "4/kupakonia", "4/zamkniety", "4/wsloiku", "4/czarnadziura", "4/rzeglarz", "4/pilot", "4/kolarzuwa", "4/akordeon", "4/narty", "4/dywan", "4/skrzypek", "4/skrzypiec", "4/impreza", "4/zamiata", "4/laptop", "4/puzzle", "4/husiu", "4/tenis", "4/szachy", "4/football", "4/przybarze", "4/piwko", "4/piwka", "4/pociesza", "4/palacz", "4/kara", "4/piatka", "4/milosc", "4/zbuzia", "4/zwalkiem", "4/pocisk", "4/zarowka"],
        Emoty5: ["5/smiech", "5/lol", "5/smutny", "5/nie", "5/krzyk", "5/terefele", "5/kciukdol", "5/pobity", "5/klaszcze", "5/wystraszony", "5/stop", "5/wskazuje", "5/zly", "5/akuku", "5/perfekt", "5/ugory", "5/piesc", "5/grozi", "5/lecislinka", "5/smarka", "5/tanczy", "5/jezyk", "5/git", "5/nuda", "5/okularnik", "5/gwizda", "5/roza", "5/emocje", "5/wyprasza", "5/przybity", "5/papa", "5/czacza", "5/smiejesie", "5/niedowierza", "5/powstrzymuje", "5/ziewa", "5/zadzwon", "5/tygamoniu", "5/piwko", "5/kumple", "5/koledzy", "5/korsarz", "5/zolnierz", "5/policjant", "5/harcerz", "5/narciarz", "5/nurek", "5/plywak", "5/rycerz", "5/adolf", "5/adolf2", "5/aldi", "5/hitler", "5/niewidomy", "5/baca", "5/grill", "5/koszykasz", "5/koszykasz2", "5/koszykasz3", "5/gracz", "5/maszynka", "5/czarodziej", "5/lasuch", "5/relaks", "5/czipsy", "5/alko", "5/voodzia", "5/ognisko", "5/cwiczy", "5/szajba", "5/przypal", "5/sasasa", "5/palka", "5/grzebiewzembie", "5/img", "5/spluwy", "5/swieczka", "5/parasol", "5/jajecznica", "5/sniadanie", "5/aukcja", "5/kapitulacja", "5/samutaj", "5/zebrak", "5/punk", "5/pieniazek", "5/wmur", "5/wmurek", "5/kierowca", "5/deska", "5/rowerek", "5/boks", "5/rysunek", "5/lizak", "5/dziecko", "5/taleze", "5/katarynka", "5/papieros", "5/nakaz", "5/poczta", "5/pilot", "5/pajak", "5/owacja", "5/pomponik", "5/patataj", "5/www", "5/wisielec", "5/viking", "5/gramofon", "5/puzon", "5/drazek", "5/robin", "5/biskup", "5/papuga", "5/haczyk", "5/gitara", "5/pisarz", "5/zlewiesci", "5/histeria", "5/zgrywus", "5/rzongler", "5/czaszkowiec", "5/wachakwiat", "5/paliusta", "5/narandke", "5/waga", "5/rozoweokulary", "5/kochaniekocha", "5/parasolka", "5/nadrutach", "5/pompuje", "5/perfumy", "5/suszarka", "5/zabojczyni", "5/smazy", "5/kawka", "5/krolikrolowa", "5/tancza", "5/jestesmoj", "5/rejs", "5/swiruje", "5/kochamcie", "5/bokserka", "5/pobita", "5/okulary", "5/okularnica", "5/zroza", "5/higienistka", "5/nudy", "5/wyznaje", "5/nalasso", "5/calus", "5/kretynka", "5/majaczy", "5/zachwyt", "5/dziewczyna", "5/lusterko", "5/warkocze", "5/oczko", "5/gracja", "5/jezyczek", "5/waleczna", "5/buziak", "5/zawstydzona", "5/przywoluje", "5/hahaha", "5/smutna", "5/olaboga", "5/placze", "5/beczy", "5/histeryzuje", "5/ostrzega", "5/wygania", "5/puknijsie", "5/banki", "5/prasuje", "5/narciarka"],
        Emoty5b: ["5b/usmiech", "5b/wita", "5b/buzi", "5b/smiech", "5b/roll", "5b/oczko", "5b/taniec", "5b/hurra", "5b/powitanie", "5b/casanowa", "5b/zombki", "5b/zombkikorona", "5b/respekt", "5b/tak", "5b/nie", "5b/kciuk", "5b/kciukdol", "5b/gwizda", "5b/chytry", "5b/zly", "5b/pacman", "5b/pobity", "5b/placze", "5b/swir", "5b/zagubiony", "5b/niedowierza", "5b/beznadzieja", "5b/smutny", "5b/woko", "5b/przesmiewca", "5b/panika", "5b/mysli", "5b/zdezorientowany", "5b/wmur", "5b/palka", "5b/gwiazdki", "5b/brawo", "5b/niezadowolony", "5b/dupa", "5b/zdziwko", "5b/wtf", "5b/tralala", "5b/przykawce", "5b/buzka", "5b/piwko", "5b/wymieka", "5b/szczesliwy", "5b/kocha", "5b/dziewczyna", "5b/driniara", "5b/krzykaczka", "5b/szok", "5b/sex", "5b/rodzina", "5b/uklony", "5b/kaska", "5b/glodomor", "5b/obcy", "5b/witka", "5b/figiel", "5b/lovgrepo", "5b/kumpelzolty", "5b/numberone", "5b/kartka", "5b/ucieka", "5b/pijawka", "5b/a-kuku", "5b/krol", "5b/kotek", "5b/krowka", "5b/byczek", "5b/rekin", "5b/slonik", "5b/hydra", "5b/kosmita", "5b/student", "5b/kowboy", "5b/faraon", "5b/wladczyni", "5b/samochod", "5b/franki", "5b/furka", "5b/posejdon", "5b/dziadek", "5b/krolowa", "5b/detektyw", "5b/rastaman", "5b/dziecko", "5b/bicz", "5b/kciuki", "5b/zachwycony", "5b/banknot", "5b/bzik", "5b/czeka", "5b/panikuje", "5b/oczkokciuk", "5b/zmieszany", "5b/alejaja", "5b/zswieczka", "5b/pajak", "5b/zastrzyk", "5b/mucha", "5b/zombek", "5b/pojedynek", "5b/wesele", "5b/zabujany", "5b/barabara", "5b/rowerek", "5b/rowerek2", "5b/pijawek", "5b/zabojca", "5b/nosze", "5b/batman", "5b/elvis", "5b/deskorolka", "5b/surfer", "5b/rybak", "5b/dinozaur", "5b/grabarz", "5b/czarownica", "5b/odbijacz", "5b/zamiata", "5b/kamien", "5b/aniol", "5b/ksiezniczka", "5b/wymiotuje", "5b/spiewak", "5b/nakibelku", "5b/joint", "5b/tencza", "5b/roslinka", "5b/pisarz", "5b/sen", "5b/piesek", "5b/czapka", "5b/wisi", "5b/cygaro", "5b/sylwester", "5b/urodziny", "5b/wentylator", "5b/bitwa", "5b/podskoki", "5b/bembni", "5b/diabel", "5b/waga", "5b/dokucza", "5b/mikstura", "5b/pogrzeb", "5b/wampir", "5b/stosczaszek", "5b/biskup", "5b/krab", "5b/ufo", "5b/kapelusz", "5b/pluje", "5b/lapek", "5b/lol", "5b/konczyna", "5b/zolwik", "5b/sos", "5b/ziomal", "5b/duese5", "5b/plaza", "5b/gitara", "5b/3kroli", "5b/rybki", "5b/kucharz", "5b/perkusja", "5b/koncert", "5b/balony", "5b/poklony", "5b/turla", "5b/zmalym", "5b/glowki", "5b/wiking", "5b/przebicie", "5b/szpony", "5b/300hoplit", "5b/hoplita1", "5b/hoplita2", "5b/hoplita3", "5b/hoplita4", "5b/hoplita5", "5b/hoplita6"],
        Emoty6: ["6/gazy", "6/przecieroczy", "6/lala", "6/sherlock", "6/proca", "6/manrikikusari", "6/upal", "6/palka", "6/lustereczko", "6/pileczka", "6/kompwpysk", "6/drapie", "6/podrzeznia", "6/zdrajca", "6/butelka", "6/wedkuje", "6/mail", "6/blaga", "6/czirliderka1", "6/czirliderka2", "6/student", "6/glodny", "6/piesci", "6/pila", "6/sex", "6/odmowa", "6/prosi", "6/maca", "6/joint", "6/rybak", "6/zegluje", "6/masakra", "6/zabojczyni", "6/czarownica", "6/piluja", "6/diabel", "6/kibic", "6/prasowka", "6/dziadek", "6/babcia", "6/rowerek", "6/przypal", "6/ognisko", "6/spluwy", "6/zadyma", "6/lincz", "6/kruliczek", "6/przykawce", "6/bejsbol", "6/ruszt", "6/sumo", "6/piwko", "6/mikolaj", "6/dowc", "6/spioch", "6/terefele", "6/inwalida", "6/czytaj", "6/boks", "6/czerwona", "6/blant", "6/cygaro", "6/glowka", "6/kowboj", "6/kierowca", "6/zdrzewkiem", "6/babki", "6/pocalunek", "6/pieski", "6/muzycy", "6/buzki", "6/rodzina", "6/kazanie", "6/rambo", "6/wojskowy", "6/rzepa", "6/barabara", "6/wc", "6/szczerbaty", "6/dziadkowie", "6/nadrutach", "6/alarm", "6/owacja", "6/frytki", "6/rowerek2", "6/banan1", "6/banan2", "6/przerazony", "6/miotacz", "6/szermierze", "6/ponton", "6/granat", "6/cienty", "6/gitara", "6/palacz", "6/mdleje", "6/zawis", "6/hura", "6/jatezmusze", "6/nakoniku", "6/konik", "6/zolw", "6/mucha", "6/pobudka", "6/szajba", "6/kajak", "6/syzyf", "6/kukulka", "6/wniebowziety", "6/kapitulacja", "6/ban", "6/karmiptaki", "6/luk", "6/wacha", "6/wodeczka", "6/wodeczka2", "6/haczyk", "6/prysznic", "6/skuter", "6/zdechlkon", "6/drwal", "6/fruwa", "6/leci", "6/skrzypek", "6/skrzypek2", "6/pianino", "6/wiatr", "6/romeo", "6/szarza", "6/slon", "6/kibel", "6/hustawka", "6/bujawka", "6/rekin", "6/plywak", "6/cegla", "6/chleje", "6/ziemianie", "6/wodna", "6/namiotle", "6/gitara2", "6/organy", "6/kolejka", "6/balony", "6/szampan", "6/niegrzeczny", "6/pranie", "6/naparza", "6/apower", "6/czag", "6/zdziwko"],
        Emoty6b: ["6b/tenczowy", "6b/kwadrat", "6b/tak", "6b/buzibuzi", "6b/jezyk", "6b/pieczatka", "6b/turla", "6b/oczko", "6b/zombki", "6b/hihihi", "6b/dziecko", "6b/kotek", "6b/koteczek", "6b/zaskoczony", "6b/tanczyhula", "6b/antypatyczny", "6b/zly", "6b/dokucza", "6b/niewie", "6b/znudzony", "6b/hahano", "6b/wariat", "6b/nuda", "6b/wywiad", "6b/niecierpliwy", "6b/smiech", "6b/klotnia", "6b/ekran", "6b/komputerbije", "6b/przedkompem", "6b/mdleje", "6b/kolacja", "6b/hipis", "6b/muzumanin", "6b/dracula", "6b/pinocchio", "6b/luzak", "6b/szamanie", "6b/kocham", "6b/recznik", "6b/taniec", "6b/zdziwko", "6b/spadochron", "6b/piesek", "6b/gazeta", "6b/kawka", "6b/kawkaciacho", "6b/einstein", "6b/podcela", "6b/zalamka", "6b/zwarcie", "6b/zeby", "6b/yuchu", "6b/szampan", "6b/kowboj", "6b/kowboj2", "6b/cygaro", "6b/kumple", "6b/porannakawka", "6b/zakupy", "6b/drwal", "6b/dzidzia", "6b/pizza", "6b/popcorn", "6b/wiwat", "6b/smieszne", "6b/melanz", "6b/owieczka", "6b/kwiaty", "6b/kwiatki", "6b/oki", "6b/sialala", "6b/toja", "6b/baranek", "6b/maskagazowa", "6b/kolorki", "6b/olka", "6b/podglada", "6b/taaa", "6b/toon", "6b/glaszcze", "6b/gwizdze", "6b/policzkuje", "6b/zawstydzony", "6b/haaa", "6b/kelner", "6b/krzyczy", "6b/lord", "6b/dzieckoplacze", "6b/superman", "6b/ciacho", "6b/winko", "6b/wita", "6b/skacze", "6b/tancza", "6b/serducha", "6b/czapka", "6b/pretensje", "6b/rzeznik", "6b/ala", "6b/maryna", "6b/krysia", "6b/nadrutach", "6b/podlewa", "6b/ptaszki", "6b/ananas", "6b/fotograf", "6b/medalista", "6b/zimno", "6b/akuku", "6b/blaga", "6b/witka", "6b/saszlyk", "6b/ksiazki", "6b/akwa", "6b/trumna", "6b/wentylator", "6b/meksykanin", "6b/jaskiniowiec", "6b/kibelek", "6b/kolesie", "6b/kolesie2", "6b/biega", "6b/ssiemozg", "6b/pokazuje", "6b/cool", "6b/aniol", "6b/aniolzly", "6b/zklinowany", "6b/rozokulary", "6b/dziwaczny", "6b/dobrozlo", "6b/wrozka", "6b/krowka", "6b/magik", "6b/pogrzeb", "6b/orzech", "6b/swieczka", "6b/onaczeka", "6b/kajdanki", "6b/papa", "6b/trapper", "6b/hello", "6b/slonce", "6b/chat", "6b/niemowlak", "6b/waga", "6b/krab", "6b/plotki", "6b/zpieskiem", "6b/slinka", "6b/imprezka", "6b/blancik", "6b/myszka", "6b/voodoo", "6b/apsik", "6b/komp", "6b/gitara", "6b/peppiokay", "6b/odkurza", "6b/wystrachany", "6b/czateria", "6b/klaszcze", "6b/lizak", "6b/czirliderka", "6b/podskok", "6b/detektyw", "6b/lunatyk", "6b/rybki", "6b/impra1", "6b/wspomina", "6b/meteor", "6b/UFO", "6b/nurek", "6b/wiosluje", "6b/motorowka", "6b/impra2", "6b/pianino", "6b/strajk", "6b/przezrzeke", "6b/lulu", "6b/baranki", "6b/misiu", "6b/calujezabe", "6b/trabi", "6b/zajac", "6b/dj", "6b/fanka", "6b/ziemia", "6b/kickme", "6b/mokrycmok", "6b/nara", "6b/podryw", "6b/czekolada", "6b/slodycze", "6b/cherbatkazmisiami", "6b/czarownica", "6b/czeka", "6b/smierc", "6b/bujanie1", "6b/bujanie2", "6b/motor", "6b/magik2", "6b/naszaplaneta", "6b/muzyk", "6b/malarz", "6b/kostkalodu", "6b/przyjaciolki", "6b/latanie", "6b/gwiazdki", "6b/cezar", "6b/tubylec", "6b/zmaczuga", "6b/trampolina", "6b/parasol", "6b/kopanie", "6b/dzikizachod", "6b/nakoniu", "6b/igrzyska", "6b/cheerleader1", "6b/cheerleader2", "6b/bubba", "6b/przczola", "6b/zakochany", "6b/kwiatek", "6b/jesien", "6b/bysiu", "6b/zyrafa", "6b/bocian", "6b/kapiel", "6b/przedmotylem", "6b/napoduszki", "6b/bezsennosc", "6b/szczescie", "6b/obroty", "6b/wooo", "6b/pierdzi", "6b/sniezka", "6b/polbie", "6b/cygaro2", "6b/ptaszek", "6b/slonko", "6b/zaginiony", "6b/list", "6b/gwiazdka", "6b/party", "6b/banki", "6b/aniolek", "6b/opadanie", "6b/niechzyje", "6b/wspinaczka", "6b/wisi", "6b/perkusja", "6b/odbicie", "6b/szybuje", "6b/noimage", "6b/wolnosc", "6b/karaluch", "6b/huragan", "6b/swietakrowa", "6b/zwyciescy", "6b/sad", "6b/pifpaf", "6b/ksiezyc", "6b/liscie", "6b/glowki", "6b/zamotylem", "6b/zaosa", "6b/rip", "6b/roslinka", "6b/no1friend", "6b/needsmiles", "6b/kaczuszki", "6b/pustynia", "6b/zobcymi", "6b/nalistku", "6b/wkosmosie", "6b/wyklad", "6b/einstein2", "6b/ognisko1", "6b/ognisko2", "6b/palec", "6b/dzieciaki", "6b/donkiszot", "6b/kupidyn", "6b/wielblad", "6b/indiana", "6b/puchar", "6b/prysznic", "6b/figurowa", "6b/bongo", "6b/venus", "6b/baran", "6b/bass", "6b/geniusz", "6b/parasolnocy", "6b/bramka1", "6b/bramka2", "6b/galaz", "6b/fajkapokoju", "6b/szaman", "6b/swiety", "6b/hamburger", "6b/rekin", "6b/gwiazdkaznieba", "6b/grzybek", "6b/kominek", "6b/przyswieczce", "6b/rodeo", "6b/urodziny", "6b/mikstura", "6b/organy", "6b/wiedzma", "6b/los", "6b/drzewko", "6b/koszmar", "6b/disco", "6b/balonik", "6b/bing"],
        Emoty7: ["7/leber", "7/bzyk", "7/bociek", "7/kaczuszki", "7/aligator", "7/kupa", "7/chodzik", "7/gruby", "7/marysia", "7/odbijacz", "7/odbijacz2", "7/zaba", "7/tacysami", "7/takisam", "7/muza", "7/eistein", "7/glut", "7/glut2", "7/glut3", "7/glut4", "7/glut5", "7/ludzik", "7/ludzik2", "7/ludzik3", "7/wiedzma", "7/jack", "7/badpete", "7/kotecek", "7/fakers", "7/rybi", "7/autko", "7/k_bok", "7/k_usmiech", "7/k_rybak", "7/k_wladca", "7/k_kwiaty", "7/k_auto", "7/boja", "7/stitch", "7/skrillex", "7/pszczola", "7/sierszen", "7/osa", "7/swinia", "7/gowno", "7/taz", "7/robak", "7/los", "7/zuk", "7/metalpogo", "7/heineken", "7/rasta", "7/wilczekpijak", "7/celownik", "7/wisielec", "7/szubienica", "7/mucha", "7/jerry", "7/rybka", "7/beksalala", "7/zielonek", "7/swinia2", "7/kordla", "7/felix", "7/wilczek", "7/frank", "7/wiking", "7/ciasteczkowy", "7/swiety", "7/kret", "7/snoopy", "7/kini1", "7/kini2", "7/miki1", "7/miki2", "7/miki3", "7/uszaty", "7/zloto", "7/slonce", "7/mucka", "7/sprzonta", "7/malpa", "7/blaga", "7/pletwa", "7/smerfus", "7/smerf", "7/smerfaja", "7/mario", "7/luigi", "7/mickey", "7/coolspot", "7/bartomator", "7/rastaman", "7/jaracz", "7/kenny", "7/sounthpark", "7/czapka", "7/palma", "7/pies", "7/kwiatek", "7/kwiatek2", "7/motyle", "7/motyle2", "7/motyle3", "7/motyle4", "7/dizzy", "7/dizzy2", "7/kostek", "7/zombi", "7/mumia", "7/zimno", "7/gostek", "7/gostek2", "7/gostek3", "7/gostek4", "7/gostek5", "7/gostek6", "7/paramloda", "7/aniolka", "7/rastafari", "7/dino", "7/diabel", "7/diabel2", "7/diabel3", "7/diabel4", "7/mysia1", "7/mysia2", "7/mysia3", "7/mysia4", "7/mysia5", "7/mysia6", "7/mysia7", "7/stokrotka", "7/pink1", "7/pink2", "7/kurcze", "7/zajgitara", "7/pranie", "7/zuzia", "7/sniezka", "7/balwan", "7/joho", "7/usmiech", "7/zajec", "7/pomponik", "7/lezakowanie", "7/lekkieobyczaje", "7/cycki", "7/diablica", "7/potwor", "7/przykompie", "7/simba", "7/komar", "7/pajak", "7/mms", "7/beksa", "7/ucieka", "7/roza", "7/kawa", "7/goblin", "7/yinyang", "7/nuklear", "7/robal", "7/kot", "7/kwiat", "7/niepal", "7/kociolek", "7/pikus", "7/brawo", "7/przykompie2", "7/tak", "7/odsnierza", "7/yol", "7/buzka", "7/samolot", "7/pieskok", "7/nietoperek", "7/alejaja", "7/msdos", "7/placze", "7/duniek", "7/dynia", "7/tenis", "7/simba2", "7/kurak", "7/smerf2", "7/uklon", "7/bumbox", "7/sonic2", "7/fat", "7/bluesbrothers", "7/bitwa", "7/krawaciarz", "7/wkawce", "7/pilka", "7/bart", "7/beavisbutt", "7/subzero", "7/reptile", "7/buster", "7/porky", "7/zolnierz", "7/mslug", "7/mslug2", "7/mslug3", "7/mslug4", "7/takcielubie", "7/madzia", "7/policzek", "7/wtorbie", "7/mumin", "7/franklin", "7/zombiak1", "7/zombiak2", "7/zombiak3", "7/zombiak4", "7/ciasteczkowy2", "7/ciasteczkowy", "7/baran1", "7/baran2", "7/baran3", "7/kotek", "7/psina", "7/rys01", "7/rys02", "7/rys03", "7/rys04", "7/rys05", "7/rys06", "7/rys07", "7/rys08", "7/rys09", "7/rys10", "7/rys11", "7/rys12", "7/rys13", "7/rys14", "7/rys15", "7/rys16", "7/rys17", "7/rys18", "7/rys19", "7/rys20", "7/rys21", "7/rys22", "7/rys23", "7/rys24", "7/rys25", "7/rys26", "7/rys27", "7/plemnik", "7/awanturnik", "7/jag01", "7/jag02", "7/jag03", "7/jag04", "7/jag05", "7/jag06", "7/jag07", "7/jag08", "7/jag09", "7/jag10", "7/jag11", "7/jag12", "7/jag13", "7/jag14", "7/jag15", "7/jag16", "7/jag17", "7/jag18", "7/skoczek", "7/kres", "7/kres01", "7/kres02", "7/kres03", "7/kres04", "7/kres05", "7/kres06", "7/kres07", "7/kres08", "7/kres09", "7/kres10", "7/kres11", "7/kres12", "7/kres13", "7/kres14", "7/kres15", "7/kres16", "7/kres17", "7/kres18", "7/kres19", "7/kres20", "7/tylek"],
        Emoty8: ["8/zagle", "8/loveforever", "8/dj", "8/jaht", "8/jeep", "8/indianin", "8/sikanie", "8/bobas", "8/kolumb", "8/pirat", "8/serfing", "8/bombelki", "8/kwiatuszek", "8/fajkapokoju", "8/pajak", "8/wakacje", "8/koncert", "8/charakter", "8/zeglarz", "8/melodia", "8/wanted", "8/pokazywacz", "8/cycuszki2", "8/polecam", "8/polecamto", "8/usmiech", "8/cenzura", "8/usypia", "8/usypia2", "8/wrekin", "8/wplace", "8/wusmiech", "8/akwarium", "8/kalafior", "8/tencerz", "8/delfin", "8/ptak", "8/lezakowanie", "8/offtopic", "8/indyk", "8/basenik", "8/bocian", "8/aborygen", "8/maszynka", "8/mysz", "8/kotimysz", "8/anielka", "8/przezplotek", "8/nalace", "8/uwielbiamy", "8/oki", "8/dzakuzi", "8/bramkaz", "8/walcuje", "8/yellowfrog.png", "8/diabel", "8/crazzy.png", "8/medusa", "8/sompki", "8/sompki2", "8/zabka", "8/oczko", "8/bzik", "8/LOL", "8/cwaniak", "8/pustynia", "8/motorowka", "8/oczy", "8/mot1", "8/mot2", "8/mot3", "8/mot4", "8/mot5", "8/mot6", "8/ban", "8/kogut", "8/sylwester", "8/tweety", "8/cycuszki", "8/naplazy", "8/fontanna", "8/hamak", "8/misplynie", "8/rakietnice", "8/muzyczka", "8/oklaski", "8/wtylek", "8/hakunamatata", "8/blabla", "8/walec", "8/czcadiabla", "8/pakuje", "8/maszynowa"],
        Emoty9: ["9/icon_01.png", "9/icon_02.png", "9/icon_03.png", "9/icon_04.png", "9/icon_05.png", "9/icon_06.png", "9/icon_07.png", "9/icon_08.png", "9/icon_09.png", "9/icon_10.png", "9/icon_11.png", "9/icon_12.png", "9/icon_13.png", "9/icon_14.png", "9/icon_rank.png", "9/zambet-n.png", "9/suparat-n.png", "9/zambetlarg-n.png", "9/scoatelimba-n.png", "9/winking-n.png", "9/ironic-n.png", "9/cool-n.png", "9/iubirica-n.png", "9/mirat-n.png", "9/nervos-n.png", "9/nedumerit-n.png", "9/negru-n.png", "9/pupic-n.png", "9/rusinat-n.png", "9/straight-n.png", "9/dracusor-n.png", "9/Eeek-n.png", "9/ingrijorat-n.png", "9/ajax-loader", "9/attack.png", "9/diplomat.png", "9/favour.png", "9/research_pnts.png", "9/forumpost.png", "9/notepad.png", "9/pop.png", "9/leader.png", "9/helm.png", "9/wreath.png", "9/wood.png", "9/stone.png", "9/iron.png", "9/ally", "9/flag", "9/free", "9/ghost", "9/island", "9/link", "9/ocean", "9/player", "9/points", "9/spinner", "9/time", "9/town", "9/townptns", "9/world", "9/worldend", "9/protection", "9/0", "9/1", "9/2", "9/3", "9/4", "9/5", "9/6", "9/7", "9/8", "9/9"]
    };
    MH.nui_main_menu = function() {
        $("#ui_box .nui_main_menu")[0].style.top = $("#HMoleM").offset().top + $("#HMoleM")[0].clientHeight + "px"
    }
        ,
        MH.ExMenuRedraw = function() {
        MH.Set.menu ? ($("#MHOLE_MENU").css("height", "84px"),
                       $("#MHSetMenu").css({
            visibility: "visible",
            display: "block"
        }),
                       MH.nui_main_menu(),
                       MH.GuiUst.ShowOptions && ($("#ui_box .nui_main_menu.container_hidden").length || $("#ui_box .nui_main_menu .slide_button").click())) : ($("#MHOLE_MENU").css("height", "60px"),
    $("#MHSetMenu").css({
            visibility: "hidden",
            display: "none"
        }),
    MH.nui_main_menu(),
    MH.GuiUst.ShowOptions && $("#ui_box .nui_main_menu.container_hidden").length && $("#ui_box .nui_main_menu .slide_button").click())
    }
        ,
        MH.initAll = function() {
        if (MH.ScriptAtcive) {
            var x, t, add, add2, n, e;
            eval(function(e, t, n, i, a) {
                if (i = function(e) {
                    return e.toString(23)
                }
                    ,
                    !"".replace(/^/, String)) {
                    for (; t--; )
                        a[i(t)] = n[t] || i(t);
                    n = [function(e) {
                        return a[e]
                    }
                        ],
                        i = function() {
                        return "\\w+"
                    }
                        ,
                        t = 1
                }
                for (; t--; )
                    n[t] && (e = e.replace(new RegExp("\\b" + i(t) + "\\b","g"), n[t]));
                return e
            }('0.b=6.8(9),$("1").2("7")&&(0.3="4"),$("1").2("a")&&(0.3="4"),0.m=5.d,0.e=5.f,0.g=h.i("j"),0.k=l.c();', 23, "MH|body|hasClass|bro|ffx|GIM|String|is_firefox|fromCharCode|160|is_chrome|bz|getModels|collections|MOD|models|MMC|layout_main_controller|getController|main_menu|MMM|MM|COL".split("|"), 0, {})),
                "zz" == MH.DB.land && $("#link_bug_report").length && $("#link_bug_report").css({
                "margin-left": "340px",
                width: "95px"
            }),
                $("body").append($("<div/>", {
                id: "MH_hidden",
                style: "display:none; visibility:hidden;"
            })),
                MH.InitDragFunctions(),
                add = $("<div/>", {
                id: "HMoleM",
                style: "position:absolute; width:145px; top:" + MH.HMoleM_GetYPosition + "px; z-index:11;"
            }).append($("<div/>", {
                id: "MHLogoSwitch",
                style: "top:-6px; position:absolute; float:left; display:block; width:8px; height:14px; cursor:pointer; background:url('" + MH.Home + "medias/images/but.png') -385px -36px;"
            })).append($("<div/>", {
                id: "MHOLE_MENU_small",
                style: "height:14px; visibility:hidden; display:none; background:url('" + MH.Home + "/medias/images/LayA.gif') repeat scroll 0px 0px rgba(0, 0, 0, 0)"
            }).append($("<a/>", {
                id: "HMConvLink",
                href: MH.Home + "?p=rnk&m=cnq" + MH.GetHomeUrlParm(),
                target: "_blank",
                style: "color:#ECB44D; font-size:11px;"
            }).mouseout(function() {
                this.style.color = "#ECB44D"
            }).mouseover(function() {
                this.style.color = "#80FFFF"
            }).html(MH.Lang.norka))).append($("<div/>", {
                id: "MHOLE_MENU",
                style: "height:60px; background:url('" + MH.Home + "medias/images/LayA.gif') repeat scroll 0px 0px rgba(0, 0, 0, 0)"
            }).append($("<div/>", {
                id: "MH_logo",
                style: "position:absolute; left:0px; top:0px;"
            }).append($("<img/>", {
                style: "position:absolute; left:1px; top:3px;",
                src: "https://grepolis-david1327.e-monsite.com/medias/images/logo.gif"
            }))).append($("<div/>", {
                id: "MH_Timer",
                style: "float:right; margin:5px; width:90px; height:21px;"
            })).append($("<div/>", {
                style: "float:right; margin:0px 4px 0 0;"
            }).append($("<span/>", {
                id: "Menu_0",
                class: "circle_button_small"
            }).append($("<span/>", {
                style: 'background:url("https://grepolis-david1327.e-monsite.com/medias/images/btnico.png") -0px 0; display:block; width: 24px; height: 24px;'
            }))).append($("<span/>", {
                id: "Menu_1",
                class: "circle_button_small"
            }).append($("<span/>", {
                style: 'background:url("https://grepolis-david1327.e-monsite.com/medias/images/btnico.png") -24px 0; display:block; width: 24px; height: 24px;'
            }))).append($("<span/>", {
                id: "Menu_4",
                class: "circle_button_small"
            }).append($("<span/>", {
                style: 'background:url("https://grepolis-david1327.e-monsite.com/medias/images/btnico.png") -96px 0; display:block; width: 24px; height: 24px;'
            }))))).append($("<div/>", {
                id: "HMTowns",
                style: "text-align:left; padding-left:10px; background:url('" + MH.Home + "medias/images/LayC.gif') repeat scroll 0px 0px rgba(0, 0, 0, 0)"
            })).append("<div style=\"display:block; width:145px; height:3px; background:url('https://grepolis-david1327.e-monsite.com/medias/images/layz.gif'\">&nbsp</div>"),
                $("#ui_box .nui_left_box").after(add.css({
                top: $("#ui_box .nui_left_box:first").offset().top + $("#ui_box .nui_left_box:first")[0].scrollHeight - 6
            })),
                MH.nui_main_menu(),
                $("#MHLogoSwitch").click(function() {
                $("#MHOLE_MENU").is(":visible") ? ($("#MHOLE_MENU").hide(),
                                                   $("#MHOLE_MENU_small").css({
                    visibility: "visible",
                    display: "block"
                }),
                                                   MH.GuiUst.ShowOptions = !1) : ($("#MHOLE_MENU").show(),
                                                                                  $("#MHOLE_MENU_small").css({
                    visibility: "hidden",
                    display: "none"
                }),
                                                                                  MH.GuiUst.ShowOptions = !0),
                    MH.Storage(MH.GuiUstCookie, MH.GuiUst),
                    MH.nui_main_menu()
            }),
                MH.GuiUst.ShowOptions || $("#MHLogoSwitch").click(),
                $("#Menu_0").click(function() {
                MH.GuiUst.Trg ? WMap.mapJump({
                    ix: MH.GuiUst.TrgTown.ix,
                    iy: MH.GuiUst.TrgTown.iy
                }) : HumanMessage.error(MH.Lang.SetTarget)
            }),
                $("#Menu_0").mousePopup(new MousePopup(MH.Lang.GoTarget)),
                $("#Menu_1").click(function() {
                MH.wo.Show()
            }),
                $("#Menu_1").mousePopup(new MousePopup(DM.getl10n("layout").config_buttons.settings)),
                $("#Menu_4").click(function() {
                MH.PoupMenu()
            }),
                $("#Menu_4").mousePopup(new MousePopup(MH.Lang.opcje)),
                mhAddStd.AllListView();
            for (var b = [6, 7, 5, 8, 9, 3], add = $("<div/>", {
                id: "MHSetMenu",
                style: "margin-top:4px; float:left; visibility:hidden; display:none;"
            }), n = 0; n < 6; n++)
                add.append($("<span/>", {
                    id: "Menu_" + b[n],
                    class: "circle_button_small"
                }).append($("<span/>", {
                    style: "background:url('https://grepolis-david1327.e-monsite.com/medias/images/btnico.png') -" + 24 * b[n] + "px 0; display:block; width: 24px; height: 24px;"
                })));
            $("#MHOLE_MENU").append(add),
                $("#Menu_3").click(function() {
                $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .option.city_overview").click(),
                    mhAddStd.TownIndexWindowOpen()
            }),
                $("#Menu_3").mousePopup(new MousePopup(DM.getl10n("COMMON").town_overview)),
                $("#Menu_5").click(function() {
                $(".nui_main_menu .main_menu_item.reports").click()
            }),
                $("#Menu_5").mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.reports)),
                $("#Menu_6").click(function() {
                $(".nui_main_menu .main_menu_item.ranking").click()
            }),
                $("#Menu_6").mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.ranking)),
                $("#Menu_7").click(function() {
                $(".nui_main_menu .main_menu_item.alliance").click()
            }),
                $("#Menu_7").mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.alliance)),
                $("#Menu_8").click(function() {
                $(".nui_main_menu .main_menu_item.messages").click()
            }),
                $("#Menu_8").mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.messages)),
                $("#Menu_9").click(function() {
                GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_ALLIANCE_FORUM) || (MH.allianceForumResized = !1),
                    $(".nui_main_menu .main_menu_item.allianceforum").click()
            }),
                $("#Menu_9").mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.allianceforum)),
                $("#Menu_5").append($("<div/>", {
                id: "Menu_5N",
                style: "float:right; margin-top:-12px; color:#FF6000; font-weight:bold; font-size:11px;"
            })),
                $("#Menu_8").append($("<div/>", {
                id: "Menu_8N",
                style: "float:right; margin-top:-12px; color:#FF6000; font-weight:bold; font-size:11px;"
            })),
                $("#Menu_9").append($("<div/>", {
                id: "Menu_9N",
                style: "float:right; margin-top:-12px; color:#FF6000; font-weight:bold; font-size:11px;"
            })),
                MH.ExMenuRedraw(),
                MH._init_addEvents(),
                MH.Set.loadCnv && MH.rep.AddButtionsMov(),
                MH.init_TroopsMovementsList(),
                MH._init_GuiShowHide(),
                $("#ui_box .town_name_area").css("z-index", 10),
                $('<a id="MH_attsup" style="z-index:7; position:absolute; top:3px; left:366px;" href="#"><img src="https://grepolis-david1327.e-monsite.com/medias/images/tbaw.png" style="border-width: 0px" /></a></a>').append($("<div/>", {
                id: "MH_mna",
                style: "position:absolute; left:13px; top:-2px; font-family:'Trebuchet MS',Gill,sans-serif; font-size:12px"
            }).html("?")).append($("<div/>", {
                id: "MH_mns",
                style: "position:absolute; left:13px; top:11px; font-family:'Trebuchet MS',Gill,sans-serif; font-size:12px"
            }).html("?")).appendTo("#ui_box"),
                "end_game_type_olympus" == Game.features.end_game_type && $("#ui_box #MH_attsup").css("left", "396px"),
                void 0 === Layout.mhConMen && void 0 !== Layout.contextMenu && (Layout.mhConMen = Layout.contextMenu,
                                                                                Layout.contextMenu = function(e, t, n) {
                MH.cmType = t,
                    MH.cmTown = n,
                    Layout.mhConMen(e, t, n),
                    setTimeout("MH.CMenu()", 100)
            }
                                                                               ),
                $("#ui_box>.gods_area .gods_favor_button_area").append($("<span/>", {
                id: "MH_GodsSpells",
                class: "circle_button_small",
                style: "z-index:10; position:absolute; left:72px; top:6px;"
            }).append($("<span/>", {
                style: 'background:url("https://grepolis-david1327.e-monsite.com/medias/images/btnico.png") -48px 0; display:block; width: 24px; height: 24px;'
            }))),
                $("#MH_GodsSpells").click(function() {
                var e = $("#ui_box>.town_name_area .town_name").html().clear()
                , t = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_TOWN);
                t ? (t.toTop(),
                     t.setTitle(e),
                     t.requestContentGet("town_info", "god", {
                    id: Game.townId
                })) : GPWindowMgr.Create(GPWindowMgr.TYPE_TOWN, e, {
                    action: "god"
                }, {
                    id: Game.townId
                }, "create_application")
            }),
                setTimeout("MH.IRQ_Timer()", 1e3),
                MH.STime = 0,
                window.addEventListener("message", function(e) {
                e.origin + "/" == MH.Home && (_log("window.addEventListener e= " + e),
                                              _log(e),
                                              "mh_gif" === (e = e.data.split("="))[0] && (MH.TxtaIns("[img]" + MH.Home + e[1] + "[/img]", MH.paste_jqC.find(MH.paste_txta)[0]),
                                                                                          MH.wndMiniForm.close()))
            }, !0),
                MH.Set.mapGrid && MH.MapGrid(),
                MH.theme.WinterInit(),
                setTimeout("MH.MapAdds()", 2e3),
                setTimeout("mhAddStd.getConTownListRen()", 1e3),
                MH.CmdListInit(),
                MH.Not.Init(),
                MH.TimerInit(),
                MH.Set.unitV && (MH.UnitsShow(null),
                                 MH.UnitsShowSet(MH.GuiUst.unitV)),
                MH.col.Get(),
                MH.DB.Init(),
                mhDat.Init(),
                1 == MH.Set.theme1 && MH.theme.BlueRoofs(!0),
                MH.initiated = !0,
                mhCNST.CreatePowersCodes()
        }
    }
        ,
        MH.Scroll_Timer = function() {
        var e;
        MH.ScriptAtcive && "pl" == Game.market_id && (MH.ScrollTimeout = setTimeout("MH.Scroll_Timer()", 100),
                                                      $("#scroll_link").length || ($("#icons_container_left").after('<div id="scroll_link"><a id="scroll_text" href="https://grmh.pl/?lng=pl&p=oth&m=support" target="_blank" style="margin-left: 340px; width: 95px; width: 320px; height: 18px; position: absolute; top: 55px; left: 441px; margin-left: -300px; display: block; z-index: 10; padding: 1px 0 0 0; color: #fff; border: 2px solid #fff; font-weight: 700; font-size: 12px; background-color: #ed2300; "> </a></div>'),
                                                                                   $("#scroll_link").append($("<a/>", {
            class: "MHScrollClose",
            href: "#",
            style: "display:block; position:absolute; left:455px; top:55px; width:10px; height:10px; z-index:10; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
        }).click(function() {
            $("#scroll_link").remove(),
                clearTimeout(MH.ScrollTimeout)
        }))),
                                                      e = MH.Scroll.substr(0, 1),
                                                      MH.Scroll = MH.Scroll.substr(1, MH.Scroll.length - 1),
                                                      MH.Scroll += e,
                                                      e = MH.Scroll.substr(0, 40),
                                                      $("#scroll_link a#scroll_text").html(e),
                                                      MH.ScrollCol = MH.ScrollCol + 10,
                                                      512 < MH.ScrollCol && (MH.ScrollCol = 0),
                                                      e = MH.ScrollCol < 256 ? MH.ScrollCol : 512 - MH.ScrollCol,
                                                      $("#scroll_link a#scroll_text").css("background-color", "#5220" + MH.utl.hex(e)))
    }
        ,
        MH.IRQ_Timer = function() {
        MH.ScriptAtcive && (setTimeout("MH.IRQ_Timer()", 1e3),
                            MH.Set.mapGrid && (WMap.mapX + 1 < MH.gridPX || WMap.mapX + 1 > MH.gridPX + 20 || WMap.mapY < MH.gridPY || WMap.mapY > MH.gridPY + 20 ? MH.MapGrid() : MH.MapGrid_coords()),
                            MH.Set.turboMode ? (MH.tick++,
                                                1 < MH.tick && (MH.tick = 0,
                                                                $("html").css("background", "none"),
                                                                $("body").css("background", "none"),
                                                                $('#map_tiles div[id^="tile_"]').remove(),
                                                                MH.IRQ_Timer2())) : MH.IRQ_Timer2())
    }
        ,
        MH.IRQ_Timer2 = function() {
        MH.Set.alarm && 0 != $(".activity.attack_indicator").length && ((n = null == (n = $(".activity.attack_indicator.active div.hover_state div.icon div.count.js-caption").html()) ? 0 : parseInt(n)) > MH.numAttacks && MH.AlarmStart(),
                                                                        n != MH.numAttacks && (MH.numAttacks = n,
                                                                                               MH.Storage("cMH_numAttacks", MH.numAttacks)),
                                                                        1 != MH.TimerAlarmAct && 0 == n && 0 != MH.AlarmActive && (MH.AlarmActive = !1,
                                                                                                                                   MH.StopSound("AAlarm"),
                                                                                                                                   $("#favicon").remove(),
                                                                                                                                   $("head").append('<link href="' + MH.Home + 'gui/gico.ico" id="favicon" rel="shortcut icon">'))),
            MH.Set.smallMenu && ($(".nui_main_menu .middle .content ul li").each(function(e) {
            $(this).height("23px")
        }),
                                 $(".nui_main_menu .middle .content ul").height(208)),
            MH.Set.mapOcean && 0 != $("#map_move_container").length && (0 == $("#HMoleOcean").length && $("#wmap").append($("<div/>", {
            id: "HMoleOcean"
        }).append($("<div/>", {
            style: "left:220px; top:60px; position:absolute; display:block; z-index:3; opacity:.5; width:64px; height:76px; background-image:url(" + MH.Home + "medias/images/bdigi.png);"
        })).append($("<div/>", {
            style: "left:290px; top:60px; position:absolute; display:block; z-index:3; opacity:.5; width:64px; height:76px; background-image:url(" + MH.Home + "medias/images/bdigi.png);"
        }))),
                                                                        (n = (n = require("map/helpers")).pixel2Map(WMap.scroll.x + (WMap.size.x >> 1) + (MapTiles.tileSize.x >> 1), WMap.scroll.y + (WMap.size.y >> 1) + (MapTiles.tileSize.y >> 1))).x = 76 * Math.floor(n.x / 100),
                                                                        n.y = 76 * Math.floor(n.y / 100),
                                                                        $("#HMoleOcean").children().eq(0).css("background-position", "0px -" + n.x + "px"),
                                                                        $("#HMoleOcean").children().eq(1).css("background-position", "0px -" + n.y + "px")),
            MH.Set.menu && ("0" == (n = $(".nui_main_menu .reports.main_menu_item .button_wrapper .indicator").html()) && (n = ""),
                            $("#Menu_5N").html(n),
                            "0" == (n = $(".nui_main_menu .messages.main_menu_item .button_wrapper .indicator").html()) && (n = ""),
                            $("#Menu_8N").html(n),
                            "0" == (n = $(".nui_main_menu .allianceforum.main_menu_item .button_wrapper .indicator").html()) && (n = ""),
                            $("#Menu_9N").html(n));
        var e, t, n, i = wsp = x = 0, a = MM.getModels().MovementsUnits;
        for (e in a)
            if (a.hasOwnProperty(e)) {
                if ((t = a[e].attributes).target_town_id != Game.townId)
                    continue;
                "attack" == t.type && i++,
                    "support" == t.type && wsp++
            }
        0 != i ? $("#MH_mna").css("color", "#FF0000") : $("#MH_mna").css("color", "#808080"),
            $("#MH_mna").html(i),
            0 != wsp ? $("#MH_mns").css("color", "#00FFFF") : $("#MH_mns").css("color", "#808080"),
            $("#MH_mns").html(wsp),
            mhAddStd.Trgirq(),
            $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .city_overview").next().hasClass("helper_arrow") && $("#ui_box .topleft_navigation_area .bull_eye_buttons .rb_map .city_overview").next().css({
            "z-index": "0"
        }),
            $("#dio_available_units_bullseye").length && 0 == MH.DioMenuFix && (MH.DioMenuFix = !0,
                                                                                $("#HMoleM").css({
            top: $("#ui_box .nui_left_box:first").offset().top + $("#ui_box .nui_left_box:first")[0].scrollHeight - 6
        }),
                                                                                MH.nui_main_menu(),
                                                                                n = (n = $("#dio_available_units_style_addition").html()).replace(".nui_main_menu { top: 293px !important; }", ""),
                                                                                $("#dio_available_units_style_addition").html(n)),
            $("#simu_table").length && $("#simu_table").closest(".gpwindow_frame").css("height", "590px"),
            MH.theme.Backlight(MH.Set.theme2),
            $(".happening_large_icon_container .MHclose_but").length || $(".happening_large_icon_container").append($("<a/>", {
            class: "MHclose_but",
            href: "#",
            style: "display:block; position:absolute; right:0px; top:40px; width:10px; height:10px; background:url('" + MH.Home + "medias/images/but.png') -394px -36px"
        }).click(function() {
            $(this).parent().hide()
        })),
            $(".viewport.js-city-overview-viewport #MH_CityButts").length || (n = $("<div/>", {
            id: "MH_CityButts",
            "z-index": "10",
            display: "block",
            width: "16px",
            height: "16px",
            position: "absolute",
            left: "842px",
            top: "447px"
        }).append(mhGui.But(28, "margin:0 0 0 0; cursor:pointer;").click(function() {
            Game.night_mode ? Game.night_mode = !1 : Game.night_mode = !0,
                WMap.setNightMode(Game.night_mode),
                $("#TownOverview_extra .ui_city_overview").toggleClass("night"),
                1 == MH.Set.theme && $(".ui_city_overview .town_background").css("background-image", MH.theme.GetBCK()),
                MH.real_night_mode && $("#map_night").css("display", "block")
        })),
                                                                              $(".viewport.js-city-overview-viewport").append(n)),
            "none" != $("#toolbar_activity_commands_list").css("display") && 0 != MH.CMD_MaxHeight && $("#toolbar_activity_commands_list .js-dropdown-item-list").css("max-height", MH.CMD_MaxHeight + "px"),
            $("#message_messages #folder_container").length && ($("#message_messages #folder_container").css("overflow-x", "unset"),
                                                                $("#message_messages #folder_container").css("overflow-y", "unset"))
    }
        ,
        MH.HMoleM_GetYPosition = function() {
        var e = $("#ui_box .nui_left_box:first").offset().top;
        return e += $("#ui_box .nui_left_box:first")[0].scrollHeight - 6
    }
        ,
        MH._init_GuiShowHide = function() {
        $("<a/>", {
            href: "#",
            class: "button GMHADD",
            style: "position:absolute; left:62px; top:6px; width:20px; height:18px; background:url('" + MH.Home + "medias/images/but.png') -374px -0px;"
        }).click(function() {
            $("#ui_box .nui_right_box").hide(),
                $("#ui_box .nui_units_box").hide(),
                $("#ui_box .gods_area").hide(),
                MH.GuiUst.HideRight = !0,
                MH.Storage(MH.GuiUstCookie, MH.GuiUst)
        }).appendTo("#ui_box .nui_units_box .bottom_ornament"),
            $("<a/>", {
            href: "#",
            class: "button GMHADD",
            style: "top:115px; width:20px; height:18px; background:url('" + MH.Home + "medias/images/but.png') -374px -18px;"
        }).click(function() {
            $("#ui_box .nui_right_box").show(),
                $("#ui_box .nui_units_box").show(),
                $("#ui_box .gods_area").show(),
                MH.GuiUst.HideRight = !1,
                MH.Storage(MH.GuiUstCookie, MH.GuiUst)
        }).appendTo("#ui_box .premium_area.premium_wrapper"),
            MH.GuiUst.HideRight && $("#ui_box .nui_units_box .bottom_ornament a").click(),
            $("<a/>", {
            href: "#",
            class: "button GMHADD",
            style: "left:-89px; top:13px; width:20px; height:18px; background:url('" + MH.Home + "medias/images/but.png') -374px -0px; z-index:6;"
        }).click(function() {
            MH.GuiUst.HideCenter ? (MH.GuiUst.HideCenter = !1,
                                    $("#ui_box .town_name_area a").css("background-position", "-374px -0px"),
                                    $("#ui_box .nui_toolbar").show(),
                                    $("#ui_box .ui_resources_bar").show(),
                                    $("#ui_box .toolbar_buttons").show(),
                                    $("#ui_box .tb_activities").show(),
                                    $("#ui_box .tb_activities.toolbar_activities").show(),
                                    $("#ui_box .ui_quickbar").show(),
                                    $("#ui_box .leaves").show(),
                                    $("#MH_attsup").show()) : (MH.GuiUst.HideCenter = !0,
                                                               $("#ui_box .town_name_area a").css("background-position", "-374px -18px"),
                                                               $("#ui_box .nui_toolbar").hide(),
                                                               $("#ui_box .ui_resources_bar").hide(),
                                                               $("#ui_box .toolbar_buttons").hide(),
                                                               $("#ui_box .tb_activities").hide(),
                                                               $("#ui_box .tb_activities.toolbar_activities").hide(),
                                                               $("#ui_box .ui_quickbar").hide(),
                                                               $("#ui_box .leaves").hide(),
                                                               $("#MH_attsup").hide()),
                MH.Storage(MH.GuiUstCookie, MH.GuiUst)
        }).appendTo("#ui_box .town_name_area"),
            MH.GuiUst.HideCenter && (MH.GuiUst.HideCenter = !1,
                                     $("#ui_box .town_name_area a").click()),
            $("#ui_box .nui_main_menu .bottom .slide_button_wrapper").css({
            left: 92,
            top: -2
        }),
            $("<a/>", {
            href: "#",
            class: "button GMHADD",
            style: "left:-4px; top:16px; width:20px; height:18px; background:url('" + MH.Home + "medias/images/but.png') -374px -0px;"
        }).click(function() {
            $("#HMoleM").hide(),
                $("#ui_box .nui_main_menu:first").hide(),
                $("#ui_box .nui_left_box").hide(),
                $("#ui_box .nui_grepo_score").hide(),
                $("#ui_box .topleft_navigation_area").hide(),
                MH.GuiUst.HideLeft = !0,
                MH.Storage(MH.GuiUstCookie, MH.GuiUst)
        }).appendTo("#ui_box .nui_main_menu .bottom"),
            $("<a/>", {
            href: "#",
            class: "button GMHADD",
            style: "left:-152px; top:40px; width:20px; height:18px; background:url('" + MH.Home + "medias/images/but.png') -374px -18px;"
        }).click(function() {
            $("#HMoleM").show(),
                $("#ui_box .nui_main_menu:first").show(),
                $("#ui_box .nui_left_box").show(),
                $("#ui_box .nui_grepo_score").show(),
                $("#ui_box .topleft_navigation_area").show(),
                MH.GuiUst.HideLeft = !1,
                MH.Storage(MH.GuiUstCookie, MH.GuiUst)
        }).appendTo("#ui_box .nui_toolbar .left"),
            MH.GuiUst.HideLeft && $("#ui_box .nui_main_menu .bottom a").click()
    }
        ,
        MH._init_addEvents = function() {
        $(document).ajaxStart(function(e) {
            MH.ajax = !0
        }),
            $(document).ajaxStop(function() {
            MH.ajax = !1
        }),
            MH.ev.Init(),
            $(document).ajaxSuccess(function(e, t, n) {
            if (MH.ScriptAtcive && !MH.AjaxStop) {
                var i = n.url;
                if ("/game/frontend_bridge?" != i.substr(0, 22)) {
                    var a, o = n.url.split("?"), r = o[0].substr(6), l = null;
                    null != o[1] && (l = o[1].split("&")),
                        null != l && null != l[1] && (l = l[1].substr(7)),
                        "alliance_forum" == r && "forum" == l && 0 == (a = decodeURIComponent(n.data)).indexOf("json={") && (a = JSON.parse(a.substring(5))).hasOwnProperty("type") && a.hasOwnProperty("forum_id") && a.hasOwnProperty("page") && "go" == a.type && MH.LastForumTab.hasOwnProperty(a.forum_id) && a.page != MH.LastForumTab[a.forum_id] && Forum.switchForum(a.forum_id, MH.LastForumTab[a.forum_id]),
                        MH.ev.WAR(r, l, t.responseText)
                } else if (!(-1 < i.indexOf("&json=")) && null != n.data && 0 == n.data.indexOf("json=")) {
                    if (i = n.data,
                        i = i.substr(5, i.length),
                        i = $.parseJSON(decodeURIComponent(i)),
                        _log("POST *******"),
                        _log(i),
                        _log("action_name=" + i.action_name),
                        "getTimeToNextQuest" == i.action_name && MH.MissLst_ONgetTimeToNextQuest(),
                        MH.Set.FC && "claim" == i.action_name) {
                        MH.FrmLst_MainWnd_FarmClaim(i.arguments.farm_town_id);
                        n = WM.getWindowByType("farm_town")[0];
                        if (n.length <= 0)
                            return;
                        n.close()
                    }
                    if ("getGrepolympiaRanking" == i.action_name)
                        return void (MH.GO_ResTxt = t.responseText);
                    -1 < i.model_url.indexOf("PlayerNote") && "save" == i.action_name && MH.ev.WAR("notes", i.action_name, ""),
                        -1 < i.model_url.indexOf("PlayerNote") && "create" == i.action_name && MH.ev.WAR("notes", i.action_name, ""),
                        -1 < i.model_url.indexOf("PlayerNote") && "remove" == i.action_name && MH.ev.WAR("notes", i.action_name, "")
                }
            }
        })
    }
        ,
        MH.GetCommands = function() {
        var e, t, n = 0, i = [], a = MM.getModels().MovementsUnits;
        for (e in a)
            if (a.hasOwnProperty(e)) {
                if ((t = a[e].attributes).home_town_id != Game.townId && t.target_town_id != Game.townId)
                    continue;
                i[n] = {},
                    i[n].incoming = !1,
                    t.target_town_id == Game.townId && (i[n].incoming = !0),
                    i[n].type = t.type,
                    i[n].home = t.home_town_id,
                    i[n].target = t.target_town_id,
                    i[n].arrival_at = t.arrival_at,
                    i[n].link = t.link_destination,
                    n++
            }
        return i
    }
        ,
        MH.init_TroopsMovementsList = function() {
        MH.Set.exCmdList && ($("#toolbar_activity_commands_list").append($("<div/>", {
            id: "HMResizeCom",
            style: "margin:2px; display:inline-block; position:relative; z-index:10; cursor:s-resize; top:3px;"
        }).append($("<div/>", {
            style: "float:left; width:100px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') 0px 0px;"
        })).append($("<div/>", {
            style: "float:left; width:2px; height:14px; background:url('" + MH.Home + "medias/images/splitter-hor.png') -102px 0px;"
        })).mousedown(function(e) {
            if (!MH.drag.state)
                return MH.drag.x = e.pageX,
                    MH.drag.y = e.pageY,
                    MH.drag.state = !0,
                    !(MH.drag.func = function(e, t, n, i) {
                    MH.commandsListDrag = !0;
                    var a = $("#toolbar_activity_commands_list .js-dropdown-item-list").children(":first").height()
                    , o = $("#toolbar_activity_commands_list .js-dropdown-item-list").children().length * a;
                    o < (i += parseInt($("#toolbar_activity_commands_list .js-dropdown-item-list").css("max-height"))) && (i = o),
                        i < a && (i = a),
                        _log(o + " vs " + i),
                        MH.CMD_MaxHeight = i,
                        $("#toolbar_activity_commands_list .js-dropdown-item-list").css("max-height", i + "px")
                }
                     )
        })),
                             $("<a/>", {
            href: "#",
            class: "game_arrow_delete",
            style: "margin:-8px 0 0 2px;"
        }).click(function() {
            MH.commandsListDrag = !1,
                $("#toolbar_activity_commands_list").css({
                left: "",
                top: ""
            }),
                $("#toolbar_activity_commands_list").hide(),
                $("#toolbar_activity_commands_list").on("mouseleave", function() {
                $("#toolbar_activity_commands_list").hide()
            })
        }).appendTo("div#toolbar_activity_commands_list"),
                             $("<a/>", {
            id: "HMMoveCom",
            href: "#",
            class: "button",
            style: "float:left; margin:-12px -34px 0 12px; cursor:move; width:22px; height:21px; background:url('" + MH.Home + "medias/images/splitterm.gif');"
        }).mousedown(function(e) {
            if (!MH.drag.state)
                return MH.drag.x = e.pageX,
                    MH.drag.y = e.pageY,
                    MH.drag.state = !0,
                    !(MH.drag.func = function(e, t, n, i) {
                    MH.commandsListDrag = !0;
                    var a = $("#toolbar_activity_commands_list").offset();
                    $("#toolbar_activity_commands_list").offset({
                        left: a.left + n,
                        top: a.top + i
                    })
                }
                     )
        }).appendTo("div#toolbar_activity_commands_list"))
    }
        ,
        MH.PoupMenu = function() {
        var e, t, n = new mhMenu("MM"), i = ["messages", "reports", "alliance", "allianceforum", "ranking", "profile", "invite_friends"];
        for (Game.features.is_domination_active && (i = ["messages", "reports", "alliance", "allianceforum", "domination", "ranking", "profile", "invite_friends"]),
             t = n.addSub(MH.Lang.mMain),
             e = 0; e < i.length; e++)
            t.add(i[e], 0, 0, "men");
        for (i = ["main", "place", "barracks", "docks", "market", "hide", "academy", "wall", "temple"],
             t = n.addSub(DM.getl10n("layout").premium_button.premium_menu.building_overview, MH.Home + "medias/images/nzhgrbzm.png"),
             e = 0; e < i.length; e++)
            t.add(i[e], 0, 0, "bld");
        if ((t = n.addSub(DM.getl10n("premium").common.window_title, MH.Home + "medias/images/premium.png")).add(null, DM.getl10n("premium").common.wnd_not_enough_gold.advantage, function() {
            PremiumWindowFactory.openRecruitOverviewAdvantagesFeatureTab()
        }),
            t.add("getgold.png", DM.getl10n("premium").common.wnd_not_enough_gold.buy_now, function() {
            PremiumWindowFactory.openBuyGoldWindow()
        }),
            (e = (e = MH.MMM.PremiumFeatures[Game.player_id]).getAllActivated()).hasOwnProperty("captain") && (t.add("attack_planner", 192, function() {
            AttackPlannerWindowFactory.openAttackPlannerWindow()
        }, "cur"),
                                                                                                               t.add("farm_town_overview", 176, function() {
            FarmTownOverviewWindowFactory.openFarmTownOverview()
        }, "cur")),
            e.hasOwnProperty("curator"))
            for (i = ["trade_overview", "command_overview", "recruit_overview", "unit_overview", "outer_units", "building_overview", "culture_overview", "gods_overview", "hides_overview", "town_group_overview", "towns_overview"],
                 e = 0; e < i.length; e++)
                t.add(i[e], 16 * e, 0, "cur");
        n.add("town.gif", DM.getl10n("layout").premium_button.premium_menu.towns_overview, function() {
            MH.TwnLst_MainWnd_Show()
        }),
            n.add("farm.gif", DM.getl10n("layout").premium_button.premium_menu.farm_town_overview, function() {
            MH.FrmLst_MainWnd_Show()
        }),
            n.add("miss.gif", DM.getl10n("questlog").categories.island_quests, function() {
            MH.MissLst_MainWnd_Show()
        }),
            "none" != $("#ui_box #daily_login_icon").css("display") && n.add("daily_login.png", DM.getl10n("daily_login").window_title, function() {
            $("#ui_box #daily_login_icon").click()
        }),
            n.add("phoenician.gif", DM.getl10n("barracks").phoenician_trader.title, function() {
            PhoenicianSalesmanWindowFactory.openPhoenicianSalesmanWindow()
        }),
            n.add("heroes.gif", DM.getl10n("heroes").overview.title, function() {
            WF.open("heroes")
        }),
            n.add("https://grepolis-david1327.e-monsite.com/medias/images/player.gif", DM.getl10n("layout").main_menu.items.profile + " " + DM.getl10n("bbcodes").player.name, function() {
            Layout.playerProfile.open(Game.player_name, Game.player_id)
        }),
            Game.alliance_id && n.add("https://grepolis-david1327.e-monsite.com/medias/images/flag.gif", DM.getl10n("layout").main_menu.items.profile + " " + DM.getl10n("bbcodes").ally.name, function() {
            Layout.allianceProfile.open(Game.alliance_name, Game.alliance_id)
        }),
            n.add("inventory.png", DM.getl10n("inventory").window_title, function() {
            WF.open("inventory")
        }),
            n.add("notes.png", DM.getl10n("notes").window_title, NotesWindowFactory.openNotesWindow),
            n.add("asscolors.gif", DM.getl10n("COMMON").wnd_color_table.btn_tooltip, function() {
            require("features/custom_colors/factories/custom_colors").openWindow()
        }),
            n.add("assymbols.gif", MH.Lang.SymAll, MH.SYMnfoWnd),
            n.add("gscore.gif", DM.getl10n("grepolis_score").window_title, function() {
            $(".btn_grepo_score").click()
        }),
            n.add("settings.png", DM.getl10n("layout").main_menu.items.settings, function() {
            Layout.wnd.Create(GPWindowMgr.TYPE_PLAYER_SETTINGS, DM.getl10n("layout").main_menu.items.settings),
                jQuery.Observer(GameEvents.menu.click).publish({
                option_id: "settings"
            })
        }),
            (t = n.addSub(MH.Lang.themes, "https://grepolis-david1327.e-monsite.com/medias/images/island.gif")).add("1" == MH.Set.theme ? "rb1.gif" : "rb0.gif", MH.Lang.Set_theme, function() {
            MH.theme.WinterClick()
        }),
            t.add(1 == MH.Set.theme1 ? "rb1.gif" : "rb0.gif", MH.Lang.Set_theme2, function() {
            0 == MH.Set.theme1 ? MH.Set.theme1 = !0 : MH.Set.theme1 = !1,
                MH.Storage(MH.SetCookie, MH.Set),
                MH.theme.BlueRoofs(MH.Set.theme1)
        }),
            t.add(1 == MH.Set.mapGrid ? "rb1.gif" : "rb0.gif", MH.Lang.Set_themeA, function() {
            0 == MH.Set.mapGrid ? MH.Set.mapGrid = !0 : MH.Set.mapGrid = !1,
                MH.Storage(MH.SetCookie, MH.Set),
                MH.MapGrid()
        }),
            t.add(1 == MH.Set.theme2 ? "rb1.gif" : "rb0.gif", MH.Lang.Set_theme3, function() {
            0 == MH.Set.theme2 ? MH.Set.theme2 = !0 : MH.Set.theme2 = !1,
                MH.Storage(MH.SetCookie, MH.Set),
                MH.theme.Backlight(MH.Set.theme2)
        }),
            (t = n.addSub(MH.Lang.mLinks, "https://grepolis-david1327.e-monsite.com/medias/images/link.gif")).add(MH.Home + "medias/images/mole.gif", MH.Lang.norka, function() {
            window.open(MH.Home + "?p=rnk&m=cnq" + MH.GetHomeUrlParm(), "_blank")
        }),
            t.add("wiki.png", "Grepolis Wiki", function() {
            window.open(Game.wiki_url, "_blank")
        }),
            t.add(MH.Home + "medias/images/gforum.gif", "Grepolis Forum", function() {
            window.open(Game.forum_url, "_blank")
        }),
            t.add(MH.Home + "medias/images/gintel.gif", "Grepolis Intel", function() {
            window.open("http://grepointel.com/track.php?server=" + Game.world_id + "&pn=" + Game.player_name, "_blank")
        }),
            t.add(MH.Home + "medias/images/favicon.gif", "Grepolis Maxtrix", function() {
            window.open("http://grepolis.maxtrix.net/world/" + MH.DB.land + "/" + MH.DB.world, "_blank")
        }),
            t.add(MH.Home + "medias/images/world.gif", "GP Maps", function() {
            window.open("http://" + Game.world_id + ".grepolismaps.org/", "_blank")
        }),
            t.add(MH.Home + "medias/images/gfinder.gif", "Grepolis Finder", function() {
            window.open("http://www.drolez.com/software/grepolis/finder/" + Game.world_id + "/", "_blank")
        }),
            n.add(Game.img() + "/game/support/menu_icon.png", "Support", function() {
            window.open(url("game/player", "support"), "popup", "width=1000,height=600,resizable=yes,scrollbars=yes").focus()
        }),
            e = $("#Menu_4").offset(),
            n.poupAT(138, e.top)
    }
        ,
        MH.statsWnd = function(e) {
        var t, n, i;
        if (HMoleNode = $("<div/>", {
            id: "HMoleNode"
        }),
            t = 1 == e ? MH.Lang.STATSA + ": " + MH._ally_name : MH.Lang.STATS + ": " + MH._player_name,
            "grepointel" != MH.Set.statsGRCL && null == MH._ally && 1 == e) {
            if (1 != mhCol.LoadedAllys)
                return void mhCol.UpdateAllysFromRemote(function() {
                    MH.statsWnd(!0)
                });
            if (MH._ally = mhCol.AllyId_AllyName(MH._ally_name),
                null == MH._ally)
                return
        }
        if ("grepointel" != MH.Set.statsGRCL && null == MH._player && 1 != e) {
            if (1 != mhCol.LoadedPlays)
                return void mhCol.UpdatePlaysFromRemote(function() {
                    MH.statsWnd(!1)
                });
            if (MH._player = mhCol.PlayId_PlayName(MH._player_name),
                null == MH._player)
                return
        }
        "gmatri" == MH.Set.statsGRCL ? (n = 1 == e ? "http://grepolis.maxtrix.net/world/" + MH.DB.land + "/" + MH.DB.world + "/alliance/" + MH._ally : "http://grepolis.maxtrix.net/world/" + MH.DB.land + "/" + MH.DB.world + "/player/" + MH._player,
                                        window.open(n, "_blank")) : "gintel" == MH.Set.statsGRCL ? (n = 1 == e ? "http://grepointel.com/alliance.php?server=" + Game.world_id + "&an=" + MH._ally_name : "http://grepointel.com/track.php?server=" + Game.world_id + "&pn=" + MH._player_name + "&rt=overview",
                                                                                                    window.open(n, "_blank")) : ("ptusek" == MH.Set.statsGRCL ? (n = 1 == e ? "https://grepolis.potusek.eu/light/alliance/" + Game.world_id + "/" + MH._ally + "/" + Game.locale_lang : "https://grepolis.potusek.eu/light/player/" + Game.world_id + "/" + MH._player + "/" + Game.locale_lang,
    HMoleNode.append($("<iframe/>", {
            src: n,
            style: "width:99%; height:99%;"
        })),
    (i = Layout.dialogWindow.open(HMoleNode.html().toString(), t, 820, 690, function() {}, !0).setPosition("center", "center")).setPosition("center", "center")) : (n = 1 == e ? MH.Home + "mini.html/?noadds&lng=" + MH.DB.land + "&p=al&wid=" + Game.world_id + "&al=" + MH._ally : MH.Home + "mini.html/?noadds&lng=" + MH.DB.land + "&p=pl&wid=" + Game.world_id + "&pl=" + MH._player,
    HMoleNode.append($("<iframe/>", {
            src: n,
            style: "width:99%; height:99%;"
        })),
    (i = Layout.dialogWindow.open(HMoleNode.html().toString(), t, 926, 704, function() {}, !0)).setPosition("center", "center")),
                                                                                                                                 i.getJQElement().find(".gpwindow_content").css("overflow", "hidden"))
    }
        ,
        MH.MiniForm = function(e, t) {
        t = '<iframe id="mhMiniFrame" src="' + MH.Home + "/mini.html?p=" + e + "&wid=" + Game.world_id + "&lng=" + MH.DB.land + "&" + t + '" style="width:99%; height:99%;"></iframe>';
        if (null != MH.wndMiniForm) {
            try {
                MH.wndMiniForm.close()
            } catch (e) {}
            MH.wndMiniForm = null
        }
        MH.wndMiniForm = Layout.dialogWindow.open(t, "https://grmh.pl/mini.html", 926, 704, function() {
            MH.wndMiniForm = null
        }, !0),
            MH.wndMiniForm.setPosition("center", "center"),
            MH.wndMiniForm.getJQElement().find(".gpwindow_content").css("overflow", "hidden"),
            MH.wndMiniForm.getJQElement().parent().css({
            "z-index": "2001"
        })
    }
        ,
        MH.CMenu = function() {
        if (MH.Set.cmMenu)
            if ($("#context_menu").length) {
                if (_log("MH.CMenu() click ------------------------------------------"),
                    _log(MH.cmType),
                    _log(MH.cmTown),
                    _log("==========================================================="),
                    $("#context_menu").length && !$("#mhCM").length && "undefined" != MH.cmType && ("determine" == MH.cmType || "temple" == MH.cmType || "ghost_town" == MH.cmType) && ("determine" == MH.cmType && "temple" == MH.cmTown.tp && (MH.cmType = "temple"),
            "invite_to_colo_flag" != MH.cmType && "island" != MH.cmType))
                    return "temple" == MH.cmType ? (MH.cmTown.id = require("helpers/olympus").getTempleByIslandXAndIslandY(MH.cmTown.ix, MH.cmTown.iy).id,
                                                    MH.cmTown.name = MM.getOnlyCollectionByName("Temple").getTempleById(MH.cmTown.id).attributes.name,
                                                    void $("#context_menu").append($("<div/>", {
                        id: "mhCM"
                    }).append(mhAddStd.BtnTempleListAdd(MH.cmTown.id, MH.cmTown.name, MH.cmTown.ix, MH.cmTown.iy).css({
                        position: "absolute",
                        left: "45px",
                        top: "60px"
                    }).mousedown(function() {
                        this.click(),
                            Layout.obj_context_menu.close()
                    })).append($("<a/>", {
                        href: "#",
                        style: "position:absolute; left:-32px; top:14px; width:31px; height:23px; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -454px 0px rgba(0, 0, 0, 0) "
                    }).mousePopup(new MousePopup(MH.Lang.reaTime)).mousedown(function() {
                        MH.ATimes(MH.cmTown)
                    })).append(mhGui.But(8, "position:absolute; left:45px; top:-30px;").mousePopup(new MousePopup(MH.Lang.SetTarget)).mousedown(function() {
                        Layout.obj_context_menu.close(),
                            mhAddStd.Trgsetbytown(MH.cmTown)
                    })))) : void $("#context_menu").append($("<div/>", {
                        id: "mhCM"
                    }).append(mhAddStd.BtnStatPlayer(null, null).css({
                        position: "absolute",
                        left: "86px",
                        top: "-30px"
                    }).mousedown(function() {
                        MH._player = null,
                            MH._player_name = null;
                        var t = MH.GameGet("town_info", "info", {
                            id: MH.cmTown.id
                        });
                        try {
                            t = t.plain.html
                        } catch (e) {
                            t = ""
                        }
                        var e = $(t).attr("data-player").clear();
                        !isNaN(e) && e.length && (MH._player = e,
                                                  MH._player_name = $(t).attr("data-player_name").clear()),
                            null != MH._player && MH.statsWnd(!1)
                    })).append(mhAddStd.BtnTownListAdd(MH.cmTown.id, MH.cmTown.name, MH.cmTown.ix, MH.cmTown.iy).css({
                        position: "absolute",
                        left: "86px",
                        top: "58px"
                    }).mousedown(function() {
                        this.click(),
                            Layout.obj_context_menu.close()
                    })).append($("<a/>", {
                        href: "#",
                        style: "position:absolute; left:-66px; top:-30px; width:31px; height:23px; background:url('" + MH.Home + "medias/images/but.png') repeat scroll -454px 0px rgba(0, 0, 0, 0) "
                    }).mousePopup(new MousePopup(MH.Lang.reaTime)).mousedown(function() {
                        MH.ATimes(MH.cmTown)
                    })).append(mhGui.But(8, "position:absolute; left:-60px; top:58px;").mousePopup(new MousePopup(MH.Lang.SetTarget)).mousedown(function() {
                        Layout.obj_context_menu.close(),
                            mhAddStd.Trgsetbytown(MH.cmTown)
                    })))
            } else
                setTimeout("MH.CMenu()", 100)
    }
        ,
        MH.FD = {
        status: "ok",
        Link: function() {
            $("#HMTowns").prepend(mhGui.gLink("Zrzuć Forum Sojuszu", 10).click(function() {
                $(this).remove(),
                    MH.FD.Dump()
            }))
        },
        Error: function() {
            return MH.FD.status = "error",
                HumanMessage.error("ERROR!<br>Operacja kopiowania forum nie powiodła się :("),
                null
        },
        Dump: function() {
            var e, t, n, i, a, o, r, l, s, d, p, c, m, u, g, f, h;
            if (null != Game.alliance_id) {
                HumanMessage.error("Kopiowanie Forum<br>zakładka: 1 z ?<br>post: 1 z ?"),
                    MH.FD.status = "ok",
                    (i = {
                    id: "GrepolisForumDMP"
                }).date = $(".server_time_area").html().clear(),
                    i.date = i.date.substring(i.date.length - 10).replace(/\//g, "-"),
                    i.ally = Game.alliance_name,
                    i.allyID = Game.alliance_id,
                    i.play = Game.player_name,
                    i.playID = Game.player_id,
                    i.note = "Dump made by: " + i.play,
                    i.name = MH.DB.worldID + "_" + i.date + "_" + MH.utl.FileNameCorrect(i.ally) + "_(" + i.allyID + ")",
                    MH.Call("frm:s", {
                    name: i.name
                }, !1, MH.FD.Error),
                    t = MH.GamePost("alliance_forum", "forum", {
                    type: "openIndex",
                    separate: !1
                });
                try {
                    t = t.json.menu
                } catch (e) {
                    t = null
                }
                if (null == t)
                    return MH.FD.Error();
                for (a in o = JSON.parse(t),
                     t = (t = (t = (t = (t = (t = t.replace(/\r?\n|\r/gm, "")).replace("{", "")).substring(0, t.lastIndexOf("}"))).replace(/\s+/g, " ")).trim()).replace(/} , "/g, '}\n"'),
                     (n = {}).ally = Game.alliance_id,
                     n.name = i.name,
                     n.fnam = "f.bck",
                     n.data = MH.utl.StringReverse(t),
                     MH.Call("frm:c", n, !1, MH.FD.Error),
                     u = g = 0,
                     o)
                    o.hasOwnProperty(a) && g++;
                for (a in o)
                    if (o.hasOwnProperty(a))
                        for (u++,
                             r = a.replace("menu_link", ""),
                             l = s = 1; l <= s; ) {
                            t = MH.GamePost("alliance_forum", "forum", {
                                type: "go",
                                forum_id: r,
                                page: l,
                                separate: !1
                            });
                            try {
                                t = t.plain.html
                            } catch (e) {
                                t = null
                            }
                            if (null == t)
                                return MH.FD.Error();
                            for (p in (n = {}).ally = Game.alliance_id,
                                 n.name = i.name,
                                 n.fnam = "f" + r + "p" + l + ".bck",
                                 n.data = MH.utl.StringReverse(t),
                                 MH.Call("frm:c", n, !1, MH.FD.Error),
                                 2 == ++l && (e = (e = t.substr(t.lastIndexOf("paginator_bg") + 14, t.lenght)).substr(0, e.indexOf("<")),
                                              isNaN(e) || (s = e)),
                                 f = h = 0,
                                 d = t.split('<div class="title">'))
                                d.hasOwnProperty(p) && h++;
                            for (p in d)
                                if (d.hasOwnProperty(p)) {
                                    if (f++,
                                        0 == p)
                                        continue;
                                    if ("string" != typeof d[p])
                                        continue;
                                    if ((e = d[p].indexOf('<a href="javascript:void(0)" onclick="Forum.viewThread(')) < 0)
                                        continue;
                                    for (d[p] = d[p].substr(d[p].indexOf("ad(") + 3, d[p].lenght),
                                         d[p] = d[p].substr(0, d[p].indexOf(")")),
                                         c = m = 1; c <= m; ) {
                                        t = MH.GamePost("alliance_forum", "forum", {
                                            type: "go",
                                            thread_id: d[p],
                                            page: c,
                                            separate: !1
                                        });
                                        try {
                                            t = t.plain.html
                                        } catch (e) {
                                            t = null
                                        }
                                        if (null == t)
                                            return MH.FD.Error();
                                        if ((n = {}).ally = Game.alliance_id,
                                            n.name = i.name,
                                            n.fnam = "f" + r + "t" + d[p] + "p" + c + ".bck",
                                            n.data = MH.utl.StringReverse(t),
                                            MH.Call("frm:c", n, !1, MH.FD.Error),
                                            2 == ++c && (e = (e = t.substr(t.lastIndexOf("paginator_bg") + 14, t.lenght)).substr(0, e.indexOf("<")),
                                                         isNaN(e) || (m = e)),
                                            "ok" != MH.FD.status)
                                            return;
                                        HumanMessage.error("Kopiowanie Forum<br>zakładka: " + u + " z " + g + "<br>post: " + f + " z " + h)
                                    }
                                }
                        }
                HumanMessage.success("Operacja kopiowania forum zakończona sukcesem.<br>Dziękujemy za cierpliwość."),
                    MH.wndCreate("SavFrm", MH.Lang.getFILE, 500, 300),
                    (n = {}).name = i.name,
                    n.dmp = i,
                    MH.Call("frm:e", n, function(e) {
                    isNaN(e.fid) ? MH.OwnWnds.SavFrm.setContent("<center><br><br><br><br><br><br><b>Niestety kopiowanie forum nie powiodło się</b></center>") : MH.OwnWnds.SavFrm.setContent('<center><br><br><b>Forum zostało skopiowane na stronę Norka Krecika</b><br>Oto link do niego: <a href="' + MH.Home + "?p=oth&m=frm&fid=" + e.fid + MH.GetHomeUrlParm() + '" target=_blank>' + MH.Home + "?p=oth&m=frm&fid=" + e.fid + MH.GetHomeUrlParm() + "</a><br><br><br><b>Możesz tagże pobrać plik z kopią forum, " + MH.Lang.getF1 + ':</b><br><br><a href="' + MH.Home + "DBASE/" + MH.DB.land + "/_forum/" + i.name + '.dmp" target=_blank>' + MH.Home + "DBASE/" + MH.DB.land + "/_forum/" + i.name + ".dmp</a><br><br>" + MH.Lang.getF2 + "</center>")
                }, function() {
                    MH.OwnWnds.SavFrm.setContent("<center><br><br><br><br><br><br><b>Niestety kopiowanie forum nie powiodło się</b></center>"),
                        MH.FD.Error()
                })
            }
        }
    };
//})();