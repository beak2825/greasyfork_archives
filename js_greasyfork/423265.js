// ==UserScript==
// @name         Mole Hole Forum
// @description  Mole Hole6
// @author       You
// @match        http://*/*
// @grant        none
// @version 0.0.1.20210315173244
// @namespace https://greasyfork.org/users/323892
// @downloadURL https://update.greasyfork.org/scripts/423265/Mole%20Hole%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/423265/Mole%20Hole%20Forum.meta.js
// ==/UserScript==

var FMole = {
    Home: "https://grmh.pl/",
    sName: "Mole Hole - Forum",
    sVer: "0.4.0 (2019-10-29)",
    lng: "en",
    lasttab: 0,
    emots: !1,
    xfEdit: null,
    xfAvat: "n",
    GetEmots: function() {
        FMole.emots || ($.ajax({
            type: "GET",
            url: FMole.Home + "MHscript/emots.js",
            dataType: "script",
            timeout: 1e4,
            complete: function() {
                FMole.emots = !0;
                var e = $(".fr-element.fr-view:first");
                function t(e, t, o) {
                    return $("<li/>", {
                        style: "float:left; width:35px; height:25; margin-top:4px;"
                    }).click(function() {
                        $("#emot_popup ul li").css("background", 'url("' + FMole.Home + 'gui/etabB.gif")'),
                        $(this).css("background", 'url("' + FMole.Home + 'gui/etabA.gif")'),
                        document.getElementById("emots_poup_content").innerHTML = "",
                        $.each(o, function(e, t) {
                            (e = FMole.Home + "e/" + t).indexOf(".png") < 1 && (e += ".gif"),
                            $("#emots_poup_content").append($("<img/>", {
                                src: e,
                                title: "",
                                class: ".Smilie"
                            }).mouseover(function() {
                                this.style.backgroundColor = "#C0C0C0"
                            }).mouseout(function() {
                                this.style.backgroundColor = "transparent"
                            }).click(function(e) {
                                FMole.xfPasteImage($(this).attr("src"))
                            }))
                        })
                    }).html("<center>" + t + "<center>")
                }
                e.length && (FMole.xfEdit = e.closest("form"),
                FMole.xfEdit.length && (MH_GI_BUT = $("<input/>", {
                    class: "button",
                    style: "z-index:2; min-width:24px; width:24px; height:24px; margin:5px 6px 0 2px; background:url('" + FMole.Home + "gui/but.png') repeat scroll -242px 0px rgba(0, 0, 0, 0) "
                }).click(function() {
                    FMole.MiniForm(this)
                }),
                window.addEventListener("message", function(e) {
                    if (e.origin + "/" == FMole.Home) {
                        var t = e.data.split("=");
                        switch (t[0]) {
                        case "mh_gif":
                            $("#mhMiniFrame").remove(),
                            FMole.xfPasteImage(FMole.Home + t[1])
                        }
                    }
                }, !0),
                MH_EM_POP = $("<div/>", {
                    id: "emot_popup",
                    class: "message",
                    style: "display:none; height:0; position:fixed; top:50%; left:50%; z-index:10;"
                }).append($("<ul/>", {
                    class: "navtabs",
                    style: "height:25; float:left;"
                }).append(t(0, "<img src='" + FMole.Home + "gui/et1a.gif'</img>", Emots.Emoty1)).append(t(0, "<img src='" + FMole.Home + "gui/et2a.gif'</img>", Emots.Emoty2)).append(t(0, "<img src='" + FMole.Home + "gui/et3a.gif'</img>", Emots.Emoty3)).append(t(0, "<img src='" + FMole.Home + "gui/et3b.gif'</img>", Emots.Emoty3b)).append(t(0, "<img src='" + FMole.Home + "gui/et3c.gif'</img>", Emots.Emoty3c)).append(t(0, "<img src='" + FMole.Home + "gui/et4a.gif'</img>", Emots.Emoty4)).append(t(0, "<img src='" + FMole.Home + "gui/et5a.gif'</img>", Emots.Emoty5)).append(t(0, "<img src='" + FMole.Home + "gui/et5b.gif'</img>", Emots.Emoty5b)).append(t(0, "<img src='" + FMole.Home + "gui/et6a.gif'</img>", Emots.Emoty6)).append(t(0, '<img src="' + FMole.Home + 'gui/et6b.gif"</img>', Emots.Emoty6b)).append(t(0, "<img src='" + FMole.Home + "gui/et7a.gif'</img>", Emots.Emoty7)).append(t(0, "<img src='" + FMole.Home + "gui/et8a.gif'</img>", Emots.Emoty8)).append(t(0, "<img src='" + FMole.Home + "gui/et9a.gif'</img>", Emots.Emoty9))).append($("<div/>", {
                    class: "body_wrappe",
                    style: 'clear:both; height:240px; border:.1px solid #000000; border-top:none; background: url("' + FMole.Home + 'imgs/header2.jpg") repeat scroll -3px 0'
                }).append($("<div/>", {
                    class: "signature",
                    style: "margin:0; overflow-y:scroll; height:234px;"
                }).append($("<div/>", {
                    id: "emots_poup_content",
                    style: "width:484px;"
                })))).css({
                    "text-align": "left",
                    width: "504px"
                }),
                $(".p-body-inner").append(MH_EM_POP),
                MH_EM_POP.parent().append("<br>"),
                MH_EM_BUT = $("<input/>", {
                    class: "button",
                    style: "z-index:2; min-width:24px; width:24px; height:24px; margin-left:10px; background:url('" + FMole.Home + "gui/but.png') repeat scroll -88px 0px rgba(0, 0, 0, 0) "
                }).click(function() {
                    $("#emot_popup.content").height() < 80 ? $("#emot_popup.content").css("overflow", "auto") : $("#emot_popup.content").css("overflow-y", "scroll"),
                    $("#emot_popup").toggle()
                }),
                $(".fr-toolbar").length && ($(".fr-toolbar").append(MH_EM_BUT),
                $(".fr-toolbar").append(MH_GI_BUT)),
                $("#emot_popup ul li:first").click(),
                setTimeout("IRQ_Timer()", 1e3)))
            },
            error: function() {
                FMole.emots = !1,
                setTimeout("FMole.GetEmots()", 1e4)
            }
        }),
        FMole.emots = !1,
        setTimeout("FMole.GetEmots()", 1e4))
    },
    xfPasteImage: function(e) {
        var t;
        if (!(t = XF.getEditorInContainer(FMole.xfEdit)))
            return !1;
        console.log(t.ed),
        $('<img src="' + e + '" data-url="' + e + '" class="bbImage fr-fic fr-dii fr-draggable" alt="" title="">').insertBefore(".fr-element.fr-view:first p:last br:last"),
        $("#emot_popup").hide()
    },
    Loader: function() {
        if ($("#header").lenght < 1)
            setTimeout("FMole.Loader()", 100);
        else {
            setTimeout("FMole.GetEmots()", 1e3);
            var e = "gui/logoF2.gif";
            FMole.xfAvat = "y",
            "n" == localStorage.getItem("MH_xfAvat") && (e = "gui/logoF1.gif",
            FMole.xfAvat = "n"),
            $(".p-nav-inner").append($("<div/>", {
                id: "MHlogo",
                style: "class:navTab; float:left; cursor:pointer; margin-top:4px;"
            }).append($("<img/>", {
                src: FMole.Home + e
            })).click(function() {
                "y" == FMole.xfAvat ? FMole.xfAvat = "n" : FMole.xfAvat = "y",
                "y" == FMole.xfAvat ? ($("#MHlogo img").attr("src", FMole.Home + "gui/logoF2.gif"),
                FMole.AddAvatars()) : ($("#MHlogo img").attr("src", FMole.Home + "gui/logoF1.gif"),
                $(".posterAvatar.MH").remove()),
                localStorage.setItem("MH_xfAvat", FMole.xfAvat)
            })),
            "y" == FMole.xfAvat && FMole.AddAvatars()
        }
    },
    AddAvatars: function() {
        $(".structItem-cell--latest").each(function(e, t) {
            var o, i;
            e = (o = (o = (o = $(t).find("a.username").attr("href")).substr(0, o.lastIndexOf("/"))).substr(o.lastIndexOf("/") + 1, o.length)).substr(o.lastIndexOf(".") + 1, o.length),
            e = parseInt(e),
            isNaN(e) || (i = Math.floor(e / 1e3)),
            $(t).append('<div class="listBlock posterAvatar MH"><span class="avatarContainer"><a data-avatarhtml="true" class="avatar Av5s" href="index.php?members/' + o + '/"><img width="48" height="48" alt="X" src="data/avatars/s/' + i + "/" + e + '.jpg?ref" onError=\'this.onerror=null;this.src="styles/grepo_mx/xenforo/avatars/avatar_s.png"\' ></a></span>')
        })
    },
    PlayerStats: function(e, t) {
        var o, i = ($(window).width() - 922) / 2, a = ($(window).height() - 680) / 2;
        i < 5 && (i = 5),
        a < 5 && (a = 5),
        o = $("<div/>", {
            id: "mhMiniFrame",
            style: "background-color:#FFEAB8; z-index:1000; display:block; position:fixed; left:" + i + "px; top:" + a + "px; width:922px; height:680px; border:2px groove orangered; box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);"
        }).append($("<div/>", {
            style: "background-color:#1B426A; text-align:left; color:#F9C97B; font-size:20px;"
        }).html(t + " Info.").append($("<span/>", {
            style: "cursor:pointer; margin:1px 4px 0 0; float:right; width:22px; height:22px; background:url('" + FMole.Home + "gui/but.png') repeat scroll -486px 0px rgba(0, 0, 0, 0) "
        })).click(function() {
            $("#mhMiniFrame").remove()
        })).append($("<div/>", {
            class: "lolo"
        }).html("<iframe width='918px' height='650px' src='" + FMole.Home + "mini.html?p=wp&wp=" + t + "&lnd=" + FMole.lng + "'></iframe>")),
        $("body").append(o)
    },
    MiniForm: function(e) {
        var t, o = ($(window).width() - 922) / 2, i = ($(window).height() - 680) / 2;
        o < 5 && (o = 5),
        i < 5 && (i = 5),
        t = $("<div/>", {
            id: "mhMiniFrame",
            style: "background-color:#FFEAB8; z-index:1000; display:block; position:fixed; left:" + o + "px; top:" + i + "px; width:922px; height:680px; border:2px groove orangered; box-shadow:0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);"
        }).append($("<div/>", {
            style: "background-color:#1B426A; text-align:left; color:#F9C97B; font-size:20px;"
        }).html("Gif's").append($("<span/>", {
            style: "cursor:pointer; margin:1px 4px 0 0; float:right; width:22px; height:22px; background:url('" + FMole.Home + "gui/but.png') repeat scroll -486px 0px rgba(0, 0, 0, 0) "
        })).click(function() {
            $("#mhMiniFrame").remove()
        })).append($("<div/>", {
            class: "lolo"
        }).html("<iframe width='918px' height='650px' src='" + FMole.Home + "mini.html?p=gif&lng=" + FMole.lng + "'></iframe>")),
        $("body").append(t)
    }
};
function IRQ_Timer() {}
$(document).ready(function() {
    var e = window.location.href;
    e = (e = e.substring(e.indexOf("//") + 2, e.lenght)).substring(0, e.indexOf(".")),
    FMole.lng = e,
    $(".message--post>.message-inner>.message-cell--user").append($("<span/>", {
        style: "position:absolute; left:106px; top:92px; cursor:pointer; margin-right:5px; width:31px; height:23px; float:right; background:url('" + FMole.Home + "gui/but.png') repeat scroll -423px 0px rgba(0, 0, 0, 0) "
    }).click(function() {
        if ($(this).parent().find(".message-name>a").length) {
            var e = $(this).parent().find(".message-name>a").html().replace(/<\/?[^>]+>/gi, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\t/g, "").trim();
            FMole.PlayerStats(this, e)
        } else
            XF.alert("Guest")
    })),
    $(".message--post .bbWrapper").each(function(e, t) {
        var o = $(this).html()
          , i = o.indexOf("[video=youtube");
        if (-1 != i) {
            var a = (o = o.replace("[video=youtube_share", "[video=youtube")).substr(i + 15, o.indexOf("]") - i - 15)
              , r = o.indexOf("[/video]") + 8
              , n = '<img alt="" src="https://i.ytimg.com/vi/' + a + '/hqdefault.jpg"/><br>';
            n += '<img alt="" src="https://grmh.pl//imgs//icon.ico"/>&nbsp&nbsp',
            n += '<a href="https://www.youtube.com/watch?v=' + a + '" target="_blank" class="externalLink" rel="nofollow"><b>https://www.youtube.com/watch?v=' + a + "</b></a>";
            var l = o.substr(0, i);
            l += n,
            l += o.substr(r),
            $(this).html(l)
        }
    })
}),
FMH = FMole,
FMH.Init = {},
"undefined" == typeof MH && (MH = {}),
FMH.Init.start = function() {
    if (MoleHoleOnBoard = "runned " + FMH.sVer,
    -1 < window.location.href.indexOf("start?action=select_new_world")) {
        var e = document.createElement("script");
        return e.type = "text/javascript",
        e.src = FMH.Home + "MHscript/SelectWorld.js?_" + (new Date).getDay(),
        document.body.appendChild(e),
        void setTimeout("FMH.Init.SelectWorld()", 1e3)
    }
    setTimeout("FMole.Loader()", 100)
}
,
FMH.Init.SelectWorld = function() {
    void 0 !== MH.SELW ? MH.SELW.Start() : setTimeout("FMH.Init.SelectWorld()", 1e3)
}
,
FMole.GetAvIMG = function(e) {
    var t = '<img width="48" height="48" alt="X" pd="' + e + '" lg="0" src="data/avatars/s/0/' + e + '.jpg?ref" onError=FMole.GetAvIMGE(this) >';
    return alert(t),
    t
}
,
"undefined" == typeof MoleHoleOnBoard && FMH.Init.start();
