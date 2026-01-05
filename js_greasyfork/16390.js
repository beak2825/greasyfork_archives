// ==UserScript==
// @name         Steam Game show in NGA
// @namespace    https://greasyfork.org/zh-CN/scripts/16390-steam-game-show-in-nga
// @version      1.07
// @require        http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @description  在 NGA论坛 发帖中显示 Steam 游戏信息 移植自 Steamcn.com 同名插件
// @author       原作者 Deparsoul @ steamcn ，由 Lyragosa 移植到NGA
// @include        /^http://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/(read\.php|thread\.php\?fid=414|nuke\.php\?func=steamsync)/
// @grant        GM_xmlhttpRequest
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/16390/Steam%20Game%20show%20in%20NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/16390/Steam%20Game%20show%20in%20NGA.meta.js
// ==/UserScript==

console.log("Lyragosa Steam App Show in NGA load success");


if (location.href.indexOf('/nuke.php?func=steamsync')>0) {
    //var unixTimestamp = new Date(Unix timestamp * 1000) 
    var commonTime = getTimeNow();
    var ownnum = 0; 
    var wishnum = 0;
    if (localStorage.getItem("own") != null) {
        ownnum = eval(localStorage.getItem("own")).length;
    }
    if (localStorage.getItem("wish") != null) {
        wishnum = eval(localStorage.getItem("wish")).length;
    }
    
    jQuery("body").append("<h2 id='page_title'><a href='http://bbs.ngacn.cc'>BBS.NGACN.CC</a> &nbsp; Steam 信息同步</h2>已经重新尝试同步 Steam 愿望单和已购物品信息 于 "+ commonTime + "，如果读取失败，请检查你的浏览器是否已经登录你的 Steam 帐号。<BR>你已购物品(含DLC)共计 <b>"+ ownnum +"</b> 个，愿望单中物品共计  <b>" + wishnum + "</b> 个。 <BR> ");
    
    jQuery("body").append("此信息仅供在NGA直接显示链接颜色使用，<span class='linkOwn'>已购物品将用绿色背景表示</span>，<span class='linkWish'>愿望单中物品将用蓝色背景表示</span>。<BR> 鼠标提示框中的信息需要在提示框中的同步区进行同步。 <BR> 之所以需要两次同步，是因为此脚本<b>并没有整合在NGA，而是由第三方制作</b>。<br>如果你喜欢本插件，请向二哥提议在论坛内置此功能。");
      sync();
    console.log("sync success");
}

if (location.href.indexOf('/thread.php?fid=414')>0) {
    //console.log(jQuery("#m_pbtntop div div").html());
    jQuery("#m_pbtntop div div.right_ table tbody tr").prepend('<td><a href="/nuke.php?func=steamsync" target="_blank" class="b blue"><nobr><span style="font-size:1.23em">同步我的 Steam 信息</span></nobr></a></td>');
}
    
    
    
    /* SYNC END */
    

var currentScript = "0";
function setScriptVersion(a) {
    currentScript = a;
    jQuery("#noScript").hide();
    jQuery("#withScript").show();
    jQuery("#progress").show();
    flag_desura = false;
    flag_userdata = false;
    flag_wish = true;
}
function checkLast() {
    if (localStorage.last) {
        jQuery("#reset").fadeIn();
        jQuery("#lastTime").text(localStorage.last);
        var c = JSON.parse(localStorage.own);
        var e = JSON.parse(localStorage.wish);
        jQuery("#lastOwn").text(c.length);
        jQuery("#lastWish").text(e.length);
        if (localStorage.sub) {
            var d = JSON.parse(localStorage.sub);
            jQuery("#lastSub").html(" | 订阅（SUB）：<strong>" + d.length + "</strong>")
        } else {
            jQuery("#lastSub").html("")
        }
        if (localStorage.desura) {
            var b = JSON.parse(localStorage.desura);
            jQuery("#lastDesura").html(" | Desura：<strong>" + b.length + "</strong>")
        } else {
            jQuery("#lastDesura").html("")
        }
        var a = jQuery("#lastSync");
        if (a.hasClass("alert-info")) {
            a.removeClass("alert-info").addClass("alert-success")
        } else {
            a.addClass("alert-info")
        }
        if (localStorage.avatar) {
            jQuery("#avatar img").attr("src", localStorage.avatar);
            jQuery("#avatar a").attr("href", localStorage.profileurl);
            jQuery("#avatar span").text(localStorage.personaname);
            jQuery("#avatar").show()
        } else {
            jQuery("#avatar").hide()
        }
        a.fadeIn()
    }
}
var flag_own = false;
var flag_wish = false;
var flag_userdata = true;
var flag_desura = true;
    
function checkFinish() {
    if (flag_own && flag_wish && flag_desura && flag_userdata) {
        localStorage.last = getTimeNow();
        checkLast();
        syncAnywhere();
        //ga("send", "event", "sync", "finish");
        //ga("set", "dimension2", "Finish Sync");
        //ga("set", "metric1", 1)
    }
}
function syncAnywhere() {
    if (sa) {
        if (localStorage.steamid != su) {
            need_login()
        } else {
            var a = {id: localStorage.steamid, avatar: localStorage.avatar, personaname: localStorage.personaname, profileurl: localStorage.profileurl};
            if (localStorage.own) {
                a.own = JSON.parse(localStorage.own)
            }
            if (localStorage.wish) {
                a.wish = JSON.parse(localStorage.wish)
            }
            if (localStorage.sub) {
                a.sub = JSON.parse(localStorage.sub)
            }
            if (localStorage.desura) {
                a.desura = JSON.parse(localStorage.desura)
            }
            jQuery("#sa").slideDown();
            $.post("sync_anywhere", {d: JSON.stringify(a), csrf: csrf}).done(function (b) {
                if (b != "1") {
                    jQuery("#sa_after strong").html(b)
                }
                jQuery("#sa_before").slideUp();
                jQuery("#sa_after").slideDown()
            })
        }
    }
}
function checkBrowser() {
    var a = {explorer: {ie: /msie ([\d.]+).*\.net clr (\d\.){1,2}\d+\)$/, firefox: /firefox\/([\d.]+)/, chrome: /chrome\/([\d.]+)/, opera: /opera.([\d.]+)/, safari: /version\/([\d.]+).*safari/, se: /msie ([\d.]+).*\.net clr (\d\.){1,2}\d+; 360se\)$/, sougou: /msie ([\d.]+).*\.net clr (\d\.){1,2}\d+; .*metasr.*\d\)$/, maxthon: /maxthon\/([\d.]+)/}};
    var c = navigator.userAgent.toLowerCase();
    var b = null;
    (b = c.match(a.explorer.ie)) ? a.ie = b[1] : (b = c.match(a.explorer.firefox)) ? a.firefox = b[1] : (b = c.match(a.explorer.chrome)) ? a.chrome = b[1] : (b = c.match(a.explorer.opera)) ? a.opera = b[1] : (b = c.match(a.explorer.safari)) ? a.safari = b[1] : (b = c.match(a.explorer.se)) ? a.se = b[1] : (b = c.match(a.explorer.sougou)) ? a.sougou = b[1] : (b = c.match(a.explorer.maxthon)) ? a.maxthon = b[1] : false;
    if (a.firefox || a.chrome) {
        return true
    } else {
        return false
    }
}
function noScriptSync() {
    jQuery("#noScriptSync").unbind("click").text("正在进行免脚本同步，请确认已将用户资料设为公开");
    if (localStorage.steamid && localStorage.profileurl) {
        jQuery("#progress").slideDown();
        jQuery("#nav-desura").fadeIn();
        var a = localStorage.steamid;
        $.getJSON("syncProxy.php?type=own&id=" + a, function (d) {
            if (d.response.game_count) {
                var f = d.response.games;
                var b = new Array();
                for (var c = 0; c < f.length; ++c) {
                    b.push(parseInt(f[c].appid))
                }
                localStorage.own = JSON.stringify(b);
                show_status("#own", b.length);
                flag_own = true;
                var e = localStorage.profileurl;
                $.getJSON("syncProxy.php?type=wish&id=" + e, function (h) {
                    var j = new Array();
                    for (var g = 0; g < h.length; ++g) {
                        j.push(parseInt(h[g]))
                    }
                    localStorage.wish = JSON.stringify(j);
                    show_status("#wish", j.length);
                    flag_wish = true;
                    //ga("send", "event", "sync", "noScriptSync");
                    checkFinish()
                })
            } else {
                need_public()
            }
        })
    } else {
        need_login()
    }
}
function checkScript() {
    if (jQuery("#noScript").is(":visible")) {
        //ga("send", "event", "script", "not installed");
        //ga("set", "dimension1", "No Script");
        if (checkBrowser()) {
            jQuery("#installScript").fadeIn()
        }
        jQuery("#noScriptSync").fadeIn();
        if (localStorage.noScriptSync) {
            noScriptSync()
        } else {
            jQuery("#noScriptSync").click(function () {
                localStorage.noScriptSync = true;
                noScriptSync();
                return false
            })
        }
    } else {
        if (currentScript < latestScript) {
            jQuery("#oldScript").show()
        }
        //ga("send", "event", "script", "installed");
        //ga("set", "dimension1", "With Script");
        localStorage.removeItem("noScriptSync")
    }
}
function getTimeNow() {
    return new Date().toLocaleString()
}
function show_status(b, a) {
    if (b == "#own") {
        //ga("set", "metric2", a)
    } else {
        if (b == "#wish") {
            //ga("set", "metric3", a)
        }
    }
    if (a >= 0) {
        jQuery(b + "_after strong").text("成功读取并记录了 " + a + " 个条目")
    } else {
        if (a == -1) {
            jQuery(b + "_after strong").text("读取失败，未登录 Steam")
        } else {
            if (a == -2) {
                jQuery(b + "_after strong").text("读取失败，无法访问 Steam")
            }
        }
    }
    jQuery(b + "_before").slideUp();
    jQuery(b + "_after").slideDown();
    //ga("send", "event", "game stat", localStorage.steamid + "-" + localStorage.personaname + b, a)
}
function proc_own(d) {
    var c = d;
    var a = c.match(/var rgGames = (.*);/);
    if (a) {
        var b = c.match(/g_steamID = "(\d+)";/);
        if (b) {
            localStorage.steamid = b[1]
        }
        var b = c.match(/personaName = (".*");/);
        if (b) {
            localStorage.personaname = JSON.parse(b[1])
        }
        var b = c.match(/var profileLink = "(.*)";/);
        if (b) {
            localStorage.profileurl = b[1] + "/"
        }
        var b = c.match(/<div class="profile_small_header_avatar">\s*<div[^>]+>\s*<img src="([^"]+)/);
        if (b) {
            localStorage.avatar = b[1].replace("_medium.jpg", ".jpg")
        }
        flag_own = true;
        checkFinish()
    } else {
        if (c.match(/global_action_link/)) {
            show_status("#own", -1);
            need_login()
        } else {
            show_status("#own", -2)
        }
    }
}
function proc_wish(f) {
    var a = f;
    var d = jQuery(a);
    var c = d.find('#tabs_basebg>form>input[name="appid"]');
    var b = d.find(".wishlist_empty_notice").length > 0;
    if (c.length > 0 || b) {
        var e = new Array();
        c.each(function () {
            e.push(parseInt(jQuery(this).val()))
        });
        localStorage.wish = JSON.stringify(e);
        show_status("#wish", e.length);
        flag_wish = true;
        checkFinish()
    } else {
        if (d.find(".global_action_link")) {
            show_status("#wish", -1);
            need_login()
        } else {
            show_status("#wish", -2)
        }
    }
}
function proc_userdata(b) {
    var d = JSON.parse(b);
    if (d) {
        var a = d.rgOwnedApps;
        var e = d.rgWishlist;
        var c = d.rgOwnedPackages;
        if (a || e || c) {
            localStorage.own = JSON.stringify(a);
            localStorage.wish = JSON.stringify(e);
            localStorage.sub = JSON.stringify(c);
            show_status("#own", a.length);
            show_status("#wish", e.length);
            show_status("#sub", c.length);
            if (a.length + e.length + c.length == 0) {
                jQuery("#progress").prepend('<div class="alert alert-danger"><strong><a href="https://store.steampowered.com/login" target="_blank" style="color:white">未读取到 Steam 用户数据，请点击此处，确认是否已经登录 Steam 商店</a></strong></div>')
            }
            flag_userdata = true;
            checkFinish()
        }
    }
}
function proc_desura(c) {
    var e = JSON.parse(c);
    var a = [];
    if (e && e.success) {
        var f = e.games;
        if (f) {
            for (var b = 0; b < f.length; ++b) {
                var d = f[b];
                a.push("/games/" + d[2])
            }
        }
    }
    show_status("#desura", a.length);
    if (a.length < 1) {
        jQuery("#desura_after strong").html('<a target="_blank" href="http://www.desura.com/collection">请检查是否已经登录</a>')
    } else {
        localStorage.desura = JSON.stringify(a)
    }
    flag_desura = true;
    checkFinish()
}
function proc_test(a) {
    console.log(a)
}
function need_login() {
    jQuery("#progress").slideUp();
    jQuery("#needLogin").slideDown();
    //ga("send", "event", "sync", "need login")
}
function need_public() {
    jQuery("#progress").slideUp();
    jQuery("#needPublic").slideDown();
    jQuery("#clickPublic").click(function () {
        jQuery(this).removeClass("btn-danger").addClass("btn-inverse").text("已经设置好了？点这里刷新").unbind("click").click(function () {
            location.reload();
            return false
        })
    });
    //ga("send", "event", "sync", "need public")
}



//Script Injection
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = fn;
    document.body.appendChild(script);
    document.body.removeChild(script);
}

//Load url and call proc function
function load(url, id){
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
           // console.log(response.responseText)
            //exec('proc_'+id+'("'+addslashes(response.responseText)+'")');
            if (id=='own') {
                proc_own(addslashes(response.responseText))
            }
            else if (id == 'userdata') {
                proc_userdata(response.responseText)
            }
        }
    });
}

function sync() {
    load('http://steamcommunity.com/my/games?tab=all', 'own');
    load('http://store.steampowered.com/dynamicstore/userdata/?random='+Math.random(), 'userdata');
}

//Add slashes to string
function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}



    (function (c) {
    var o = 300;
    var f = 1;
    var e = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;
    if (e) {
        console.log("This is a device with touch support.")
    }
    function a(w) {
        var v = jQuery(w);
        var u = v.prev();
        u.removeClass("touched");
        v.stop().clearQueue().fadeOut(o)
    }

    function t(v) {
        var w = v.height();
        var D = v.prev();
        var E = D.position().left + D.outerWidth();
        var C = D.position().top - 5;
        var z = D.offsetParent().offset();
        var B = jQuery(window).scrollLeft() + jQuery(window).width() - z.left;
        var A = jQuery(window).scrollTop() - z.top;
        var u = A + jQuery(window).height();
        if (B - E < 320) {
            E = B - 320;
            C = D.position().top + D.outerHeight()
        }
        if (u - C < w) {
            C = u - w
        }
        C = C < A + 16 ? A + 16 : C;
        v.css("left", E).css("top", C)
    }

    function m(w) {
        var u = null;
        var x;
        if (x = w.match(/\/store\.steampowered\.com\/((sub|app)\/\d+)/)) {
            u = x[1]
        } else {
            if (x = w.match(/\/steamcommunity\.com\/((sub|app)\/\d+)/)) {
                u = x[1]
            }
        }
        if (!u) {
            var z = null;
            if (x = w.match(/\/www\.steamgifts\.com\/giveaway\/\w{5}\/([a-z0-9-]+)/)) {
                z = x[1]
            } else {
                if (x = w.match(/www\.gamersgate\.(?:com|co\.uk)\/[A-Z0-9-]+\/([a-z0-9-]+?)(-([2-4]|two|three|four)-pack-bundle)?(\/|$)/)) {
                    z = x[1]
                } else {
                    if (x = w.match(/www\.greenmangaming\.com\/.*\/games\/.+?\/([a-z0-9-]+?)(-([2-4]|two|three|four)-pack)?(\/|$)/)) {
                        z = x[1]
                    } else {
                        if (x = w.match(/getgamesgo\.com\/product\/([a-z0-9-]+?)(-steam|-mac|-mac-steam)?(\/|$)/)) {
                            z = x[1]
                        } else {
                            if (x = w.match(/www\.macgamestore\.com\/product\/\d+\/([\-\w]+?)(\/|$)/)) {
                                z = x[1]
                            } else {
                                if (x = w.match(/www\.game\.co\.uk\/\w+\/([\-\w]+?)-\d+(\/|$)/)) {
                                    z = x[1]
                                } else {
                                    if (x = w.match(/store.indiegala.com\/.*\/([a-z0-9-]+?)(-([2-4]|two|three|four)-pack-bundle)?\.html/)) {
                                        z = x[1]
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (z) {
                u = "guess/" + z
            }
        }
        if (!u) {
            var v = /(www\.amazon\.com)\/(gp\/product|dp)\/([A-Z0-9]+)/;
            var x = v.exec(w);
            if (x != null) {
                var y = x[1];
                var A = x[3];
                u = "amazon/" + y + "/dp/" + A
            }
        }
        if (!u) {
            var x = w.match(/(store\.sonkwo\.com\/node|www\.sonkwo\.com\/products)\/(\d+)/);
            if (x != null) {
                var A = x[2];
                u = "sonkwo/" + A
            }
        }
        return u
    }

    var i = 0;

    function r(x) {
        var B = jQuery(x);
        if (B.data("_infoAdded")) {
            return false
        }
        B.data("_infoAdded", true);
        var v = B[0].href;
        var E = m(v);
        if (!E) {
            return false
        }
        var z = false;
        var C = E;
        var D = "";
        var u;
        if (B.next().hasClass("steamInfoWrapper")) {
            D = B.next().attr("id")
        } else {
            ++i;
            D = "steam_info_" + C.replace(/[\/.]/g, "_") + "_" + i;
            u = jQuery('<div style="display:none" class="steamInfoWrapper"><div class="png_loading"></div><iframe frameBorder="0" allowtransparency="true">Loading</iframe></div>');
            u.attr("id", D);
            u.find("iframe").attr("src", c + "/tooltip#" + C + "#" + D);
            B.after(u);
            z = true
        }
        var A = "#" + D;
        u = jQuery(A);
        var w = null;

        function y() {
            jQuery(".steamInfoWrapper:not(" + A + ")").stop().clearQueue().hide().css("opacity", "1");
            clearTimeout(w);
            u.find("iframe")[0].contentWindow.postMessage("show", "*");
            t(u);
            u.fadeIn(o)
        }

        B.bind("mousemove", function () {
            y()
        });
        B.bind("click", function () {
            if (e) {
                if (B.hasClass("touched")) {
                    return true
                } else {
                    jQuery("a.touched").removeClass("touched");
                    B.addClass("touched");
                    return false
                }
            }
            return true
        });
        B.mouseout(function () {
            w = setTimeout(function () {
                a(A)
            }, 500)
        });
        u.hover(function () {
            if (w) {
                clearTimeout(w);
                w = null
            } else {
                w = setTimeout(function () {
                    a(A)
                }, 500)
            }
        });
        return z
    }

    var l = 0;

    function h() {
        if (jQuery("#steamInfoGetOwnAndWish").length == 0) {
            jQuery('<iframe style="display:none" id="steamInfoGetOwnAndWish" src="' + c + '/tooltip" />').appendTo("body")
        }
    }

    var p = [];
    var q = [];
    var k = [];
    var b = [];
       
    if (localStorage.getItem("own") != null) {
        p = eval(localStorage.getItem("own"))
    }
    if (localStorage.getItem("wish") != null) {
        q = eval(localStorage.getItem("wish"))
    }
    

    function s() {
        jQuery("a").each(function () {
            var x = jQuery(this);
            var u = String(x.attr("href"));
            var v;
            if (v = u.match(/\/(store\.steampowered|steamcommunity)\.com\/(app|sub)\/(\d+)/)) {
                //console.log(x);
                //console.log(u);
                var w = v[2];
                //console.log(localStorage.valueOf())
               // console.log(p)
                var y = parseInt(v[3]);
                if (w == "app") {
                    if (p.indexOf(y) !== -1) {
                        
                        x.addClass("linkOwn")
                       


                    } else {
                        if (q.indexOf(y) !== -1) {
                            x.addClass("linkWish")
                        }
                    }
                } else {
                    if (w == "sub") {
                        if (k.indexOf(y) !== -1) {
                            x.addClass("linkOwn")
                        }
                    }
                }

                


            }

            if (x.data("_hoverAdded")) {
                return
            }
            x.data("_hoverAdded", true);
            if (!m(u)) {
                return
            }
            x.hover(function () {
                r(this);
                if (!x.hasClass("loaded")) {
                    n(f, x)
                }
                x.addClass("loaded")
            })
        });
        l += 1000;
        setTimeout(function () {
            s()
        }, l)
    }

    var d = 0;

    function j(w) {
        var v = jQuery(w);
        if (v.data("_preChecked")) {
            return
        }
        v.data("_preChecked", true);
        var u = String(v.attr("href"));
        if (!m(u)) {
            return
        }
        if (r(w)) {
            --d
        }
    }

    function n(w, x) {
        d = w;
        var u = jQuery("a");
        if (x) {
            x = u.index(x);
            for (var v = x; v < u.length; ++v) {
                j(u[v]);
                if (d <= 0) {
                    return false
                }
            }
        }
        u.each(function () {
            j(this);
            if (d <= 0) {
                return false
            }
        })
    }

    jQuery("head").prepend('<link rel="stylesheet" href="' + c + '/assets/css/steam_info.css" type="text/css" />');
    jQuery(function () {
        s();
        n(f);
        if (d > 0) {
            h()
        }
    });
    function g(w) {
        if (w.data.sub) {
            k = JSON.parse(w.data.sub)
        } else {
            if (w.data.own || w.data.wish) {
                p = JSON.parse(w.data.own);
                q = JSON.parse(w.data.wish);
                jQuery(".steam_info_trigger_text").each(function () {
                    var A = jQuery(this);
                    var y = String(A.data("href"));
                    var z;
                    if (z = y.match(/\/(store\.steampowered|steamcommunity)\.com\/app\/(\d+)/)) {
                        var B = parseInt(z[2]);
                        if (p.indexOf(B) !== -1) {
                            A.addClass("steam_info_own")
                        } else {
                            if (q.indexOf(B) !== -1) {
                                A.addClass("steam_info_wish")
                            }
                        }
                    }
                })
            } else {
                if (w.data.desura) {
                    b = JSON.parse(w.data.desura);
                    jQuery('a[href^="http://www.desura.com/games/"]').each(function () {
                        var B = jQuery(this);

                        B.addClass("linkDesura");
                        var y = String(B.attr("href"));
                        var A;
                        if (A = y.match(/\/\/www\.desura\.com(\/[^\/]*\/[^\/#?]*)/)) {
                            var z = A[1];
                            z = z.toLowerCase();
                            if (b.indexOf(z) !== -1) {
                                B.addClass("linkOwn")
                            }
                        }
                    })
                } else {
                    var u = w.data.height;
                    var x = w.data.src;
                    var v = jQuery('iframe[src="' + x + '"]').closest("div");
                    v.height(u + 1);
                    t(v)
                }
            }
        }
    }

    window.addEventListener("message", g, false)
})("http://steamdb.sinaapp.com");

  




