// ==UserScript==
// @name            VIP视频破解
// @author          linweibuju
// @description     vip视频破解 优酷 爱奇艺 腾讯等 新手测试版
// @version         0.0.1
// @include      *://*.iqiyi.com/*
// @include      *://*.youku.com/*
// @include      *://v.qq.com/*
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @namespace https://greasyfork.org/users/432700
// @downloadURL https://update.greasyfork.org/scripts/394708/VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/394708/VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

//百度网盘
(function() {
var pan_title=new Array()
		pan_title[0]= "https://pan.baidu.com/s/"
		pan_title[1]= "https://pan.baidu.com/share/"
		pan_title[2]= "https://yun.baidu.com/s/"
        let pan_link = location.href;
		for(var a=0;a<pan_title.length;a++){
			if(pan_link.indexOf(pan_title[a])!= -1){
                pan_link = pan_link.replace('baidu.com','baiduwp.com');
				var pan_html = "<a href="+pan_link+" target='_blank' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;'><img src='https://cdn.80note.com/vip.gif' height='55' ></a>";
				$("body").append(pan_html);
			}
		}
})();
'use strict'
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e;
} : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
!function () {
    function e(e, t, i) {
        e = e || "", t = t || "", i = i || "", console.group("[百度网盘直链下载助手]"), console.log(e, t, i), console.groupEnd();
    }

    function t(e, t) {
        var i = localStorage.getItem("baiduyunPlugin_BDUSS") ? localStorage.getItem("baiduyunPlugin_BDUSS") : '{"baiduyunPlugin_BDUSS":""}',
            n = JSON.parse(i).BDUSS;
        return n ? 'aria2c "' + e + '" --out "' + t + '" --header "User-Agent: ' + w + '" --header "Cookie: BDUSS=' + n + '"' : (swal({
            title: "提示",
            text: "请先安装【网盘万能助手】",
            buttons: {confirm: {text: "安装", value: "confirm"}}
        }).then(function (e) {
            "confirm" === e && (location.href = "https://www.baiduyun.wiki/zh-cn/assistant.html");
        }), "请先安装网盘万能助手，安装后请重启浏览器！！！");
    }

    function i(e) {
        return e ? e.replace(/&/g, "&amp;") : "";
    }

    function n() {
        function t() {
            Q = j(), W = L(), Z = U(), ee = l(), le = V(), "all" == le && (re = N()), "category" == le && (ce = O()), "search" == le && (ue = D()), a(), i(), n();
        }

        function i() {
            "all" == le ? ie = P() : "category" == le ? ie = F() : "search" == le && (ie = z());
        }

        function n() {
            ne = [];
        }

        function a() {
            de = d();
        }

        function d() {
            return $("." + h.list).is(":hidden") ? "grid" : "list";
        }

        function s() {
            c(), p(), m(), y(), k();
        }

        function c() {
            window.addEventListener("hashchange", function (e) {
                a(), "all" == V() ? le == V() ? re != N() && (re = N(), i(), n()) : (le = V(), re = N(), i(), n()) : "category" == V() ? le == V() ? ce != O() && (le = V(), ce = O(), i(), n()) : (le = V(), ce = O(), i(), n()) : "search" == V() && (le == V() ? ue != D() && (le = V(), ue = D(), i(), n()) : (le = V(), ue = D(), i(), n()));
            });
        }

        function p() {
            $("a[data-type=list]").click(function () {
                de = "list";
            }), $("a[data-type=grid]").click(function () {
                de = "grid";
            });
        }

        function m() {
            var t = $("span." + h.checkbox);
            "grid" == de && (t = $("." + h["chekbox-grid"])), t.each(function (t, i) {
                $(i).on("click", function (t) {
                    var i = $(this).parent(), n = void 0, a = void 0;
                    if ("list" == de ? (n = $("div.file-name div.text a", i).attr("title"), a = i.hasClass(h["item-active"])) : "grid" == de && (n = $("div.file-name a", $(this)).attr("title"), a = !$(this).hasClass(h["item-active"])), a) {
                        e("取消选中文件：" + n);
                        for (var o = 0; o < ne.length; o++) ne[o].filename == n && ne.splice(o, 1);
                    } else e("选中文件:" + n), $.each(ie, function (e, t) {
                        if (t.server_filename == n) {
                            var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                            ne.push(i);
                        }
                    });
                });
            });
        }

        function b() {
            $("span." + h.checkbox).each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function y() {
            $("div." + h["col-item"] + "." + h.check).each(function (t, i) {
                $(i).bind("click", function (t) {
                    $(this).parent().hasClass(h.checked) ? (e("取消全选"), ne = []) : (e("全部选中"), ne = [], $.each(ie, function (e, t) {
                        var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                        ne.push(i);
                    }));
                });
            });
        }

        function x() {
            $("div." + h["col-item"] + "." + h.check).each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function k() {
            $("div." + h["list-view"] + " dd").each(function (t, i) {
                $(i).bind("click", function (t) {
                    var i = t.target.nodeName.toLowerCase();
                    if ("span" != i && "a" != i && "em" != i) if (e("shiftKey:" + t.shiftKey), t.shiftKey) {
                        ne = [];
                        var n = $("div." + h["list-view"] + " dd." + h["item-active"]);
                        $.each(n, function (t, i) {
                            var n = $("div.file-name div.text a", $(i)).attr("title");
                            e("选中文件：" + n), $.each(ie, function (e, t) {
                                if (t.server_filename == n) {
                                    var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                                    ne.push(i);
                                }
                            });
                        });
                    } else {
                        ne = [];
                        var a = $("div.file-name div.text a", $(this)).attr("title");
                        e("选中文件：" + a), $.each(ie, function (e, t) {
                            if (t.server_filename == a) {
                                var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                                ne.push(i);
                            }
                        });
                    }
                });
            });
        }

        function _() {
            $("div." + h["list-view"] + " dd").each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function S() {
            var e = window.MutationObserver, t = {childList: !0};
            se = new e(function (e) {
                b(), x(), _(), m(), y(), k();
            });
            var i = document.querySelector("." + h["list-view"]), n = document.querySelector("." + h["grid-view"]);
            se.observe(i, t), se.observe(n, t);
        }

        function T() {
            $("div." + h["bar-search"]).css("width", "18%");
            var e = $('<span class="g-dropdown-button"></span>'),
                t = $('<a class="g-button g-button-blue" href="javascript:;"><span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span></a>'),
                i = $('<span class="menu" style="width:114px"></span>'),
                n = $('<span class="g-button-menu" style="display:block"></span>'),
                a = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                o = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">直链下载</span></span></a>'),
                d = $('<span class="menu" style="width:120px;left:79px"></span>'),
                s = $('<a id="batchhttplink-direct" class="g-button-menu" href="javascript:;">显示链接</a>');
            d.append(s), n.append(a.append(o).append(d)), n.hover(function () {
                a.toggleClass("button-open");
            }), s.click(E);
            var l = $('<span class="g-button-menu" style="display:block"></span>'),
                r = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                c = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">Aria下载</span></span></a>'),
                p = $('<span class="menu" style="width:120px;left:79px"></span>'),
                u = $('<a id="batchhttplink-aria" class="g-button-menu" href="javascript:;">显示链接</a>');
            p.append(u), l.append(r.append(c).append(p)), l.hover(function () {
                r.toggleClass("button-open");
            }), u.click(E);
            var f = $('<span class="g-button-menu" style="display:block"></span>'),
                v = $('<span class="g-dropdown-button g-dropdown-button-second" menulevel="2"></span>'),
                g = $('<a class="g-button" href="javascript:;"><span class="g-button-right"><span class="text" style="width:auto">API下载</span></span></a>'),
                m = $('<span class="menu" style="width:120px;left:77px"></span>'),
                w = $('<a id="download-api" class="g-button-menu" href="javascript:;">直接下载</a>'),
                b = $('<a id="batchhttplink-api" class="g-button-menu" href="javascript:;">显示链接</a>'),
                y = $('<a id="appid-setting" class="g-button-menu" href="javascript:;">神秘代码</a>'),
                x = $('<a id="default-setting" class="g-button-menu" href="javascript:;">恢复默认</a>');
            m.append(b).append(y).append(x), f.append(v.append(g).append(m)), f.hover(function () {
                v.toggleClass("button-open");
            }), w.click(A), b.click(E), y.click(G), x.click(M);
            var k = $('<span class="g-button-menu" style="display:block;cursor: pointer">分享选中文件</span>'),
                _ = $('<iframe src="https://ghbtns.com/github-btn.html?user=syhyz1990&repo=baiduyun&type=star&count=true" frameborder="0" scrolling="0" style="height: 20px;max-width: 120px;padding: 0 5px;box-sizing: border-box;margin-top: 5px;"></iframe>');
            k.click(H), i.append(f).append(l).append(k), e.append(t).append(i), e.hover(function () {
                e.toggleClass("button-open");
            }), $("." + h["list-tools"]).append(e), $("." + h["list-tools"]).css("height", "40px");
        }

        function G() {
            swal({
                text: "请输入神秘代码",
                content: {element: "input", attributes: {value: g, placeholder: "默认为：" + v}},
                button: {confirm: {text: "确定", value: "ok"}}
            }).then(function (e) {
                e && (GM_setValue("secretCode", e), swal("神秘代码执行成功 , 点击确定将自动刷新").then(function () {
                    history.go(0);
                }));
            });
        }

        function M() {
            GM_setValue("secretCode", v), swal("恢复默认成功，点击确定将自动刷新").then(function () {
                history.go(0);
            });
        }

        function A(t) {
            e("选中文件列表：", ne);
            var i = t.target.id, n = void 0;
            if ("download-direct" == i) {
                var a = void 0;
                if (0 === ne.length) return void swal(f.unselected);
                1 == ne.length && (a = 1 === ne[0].isdir ? "batch" : "dlink"), ne.length > 1 && (a = "batch"), te = R(ne);
                var o = K(a);
                if (0 !== o.errno) return -1 == o.errno ? void swal("文件不存在或已被百度和谐，无法下载！") : 112 == o.errno ? void swal("页面过期，请刷新重试！") : void swal("发生错误！");
                if ("dlink" == a) n = o.dlink[0].dlink; else {
                    if ("batch" != a) return void swal("发生错误！");
                    n = o.dlink, 1 === ne.length && (n = n + "&zipname=" + encodeURIComponent(ne[0].filename) + ".zip");
                }
            } else {
                if (0 === ne.length) return void swal(f.unselected);
                if (ne.length > 1) return void swal(f.morethan);
                if (1 == ne[0].isdir) return void swal(f.dir);
                "download-api" == i && (n = q(ne[0].path));
            }
            J(n);
        }

        function E(t) {
            if (e("选中文件列表：", ne), 0 === ne.length) return void swal(f.unselected);
            var i = t.target.id, n = void 0, a = void 0;
            if (n = -1 == i.indexOf("https") ? -1 == i.indexOf("http") ? location.protocol + ":" : "http:" : "https:", ae = [], oe = [], -1 != i.indexOf("direct")) {
                ae = I(n);
                if (0 === ae.length) return void swal("没有链接可以显示，不要选中文件夹！");
                pe.open({
                    title: "直链下载",
                    type: "batch",
                    list: ae,
                    tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>，本链接仅支持小文件下载（<300M）',
                    showcopy: !1
                });
            }
            if (-1 != i.indexOf("aria")) {
                if (ae = C(n), a = '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a href="http://pan.baiduyun.wiki/down">XDown</a>', 0 === ae.length) return void swal("没有链接可以显示，不要选中文件夹！");
                pe.open({title: "Aria链接", type: "batchAria", list: ae, tip: a, showcopy: !0});
            }
            if (-1 != i.indexOf("api")) {
                if (ae = C(n), a = '请先安装 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> <b>v2.2.0</b> 后点击链接下载，若下载失败，请先禁用"IDM扩展" <a href="https://www.baiduyun.wiki/zh-cn/question.html" target="_blank">无效？</a>', 0 === ae.length) return void swal("没有链接可以显示，API链接不要全部选中文件夹！");
                pe.open({title: "API下载链接", type: "batch", list: ae, tip: a});
            }
        }

        function I(e) {
            var t = [];
            return $.each(ne, function (i, n) {
                var a = void 0, o = void 0, d = void 0;
                a = 0 == n.isdir ? "dlink" : "batch", te = R([n]), d = K(a), 0 == d.errno ? ("dlink" == a ? o = d.dlink[0].dlink : "batch" == a && (o = d.dlink), o = o.replace(/^([A-Za-z]+):/, e)) : o = "error", t.push({
                    filename: n.filename,
                    downloadlink: o
                });
            }), t;
        }

        function C(e) {
            var t = [];
            return $.each(ne, function (i, n) {
                if (1 != n.isdir) {
                    var a = void 0;
                    a = q(n.path), a = a.replace(/^([A-Za-z]+):/, e), t.push({filename: n.filename, downloadlink: a});
                }
            }), t;
        }

        function j() {
            var e = void 0;
            try {
                e = new Function("return " + Y.sign2)();
            } catch (e) {
                throw new Error(e.message);
            }
            return o(e(Y.sign5, Y.sign1));
        }

        function N() {
            var e = location.hash, t = new RegExp("path=([^&]*)(&|$)", "i"), i = e.match(t);
            return decodeURIComponent(i[1]);
        }

        function O() {
            var e = location.hash, t = new RegExp("type=([^&]*)(&|$)", "i"), i = e.match(t);
            return decodeURIComponent(i[1]);
        }

        function D() {
            var e = location.hash, t = new RegExp("key=([^&]*)(&|$)", "i"), i = e.match(t);
            return decodeURIComponent(i[1]);
        }

        function V() {
            var e = location.hash;
            return e.substring(e.indexOf("#") + 2, e.indexOf("?"));
        }

        function P() {
            var e = [], t = he + "list", i = N();
            ee = l();
            var n = {
                dir: i,
                bdstoken: Z,
                logid: ee,
                order: "size",
                num: 1e3,
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: "chunlei",
                appid: g
            };
            return $.ajax({
                url: t, async: !1, method: "GET", data: n, success: function (t) {
                    e = 0 === t.errno ? t.list : [];
                }
            }), e;
        }

        function F() {
            var e = [], t = he + "categorylist", i = O();
            ee = l();
            var n = {
                category: i,
                bdstoken: Z,
                logid: ee,
                order: "size",
                desc: 0,
                clienttype: 0,
                showempty: 0,
                web: 1,
                channel: "chunlei",
                appid: g
            };
            return $.ajax({
                url: t, async: !1, method: "GET", data: n, success: function (t) {
                    e = 0 === t.errno ? t.info : [];
                }
            }), e;
        }

        function z() {
            var e = [], t = he + "search";
            ee = l(), ue = D();
            var i = {
                recursion: 1,
                order: "time",
                desc: 1,
                showempty: 0,
                web: 1,
                page: 1,
                num: 100,
                key: ue,
                channel: "chunlei",
                app_id: 250528,
                bdstoken: Z,
                logid: ee,
                clienttype: 0
            };
            return $.ajax({
                url: t, async: !1, method: "GET", data: i, success: function (t) {
                    e = 0 === t.errno ? t.list : [];
                }
            }), e;
        }

        function R(e) {
            if (0 === e.length) return null;
            var t = [];
            return $.each(e, function (e, i) {
                t.push(i.fs_id);
            }), "[" + t + "]";
        }

        function L() {
            return Y.timestamp;
        }

        function U() {
            return Y.MYBDSTOKEN;
        }

        function H() {
            var e = [];
            if (0 === ne.length) return void swal(f.unselected);
            $.each(ne, function (t, i) {
                e.push(i.path);
            });
            var t = "https://pan.baidu.com/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + Z + "&logid=" + ee + "&clienttype=0",
                i = B(), n = {schannel: 4, channel_list: JSON.stringify([]), period: 0, pwd: i, fid_list: R(ne)};
            $.ajax({
                url: t, async: !1, method: "POST", data: n, success: function (e) {
                    if (0 === e.errno) {
                        var t = e.link + "#" + i;
                        swal({
                            title: "分享链接",
                            text: t + "(#后面为提取码)",
                            buttons: {open: {text: "打开", value: "open"}, copy: {text: "复制链接", value: "copy"}}
                        }).then(function (e) {
                            "open" === e && GM_openInTab(t, {active: !0}), "copy" === e && GM_setClipboard(t);
                        });
                    }
                }
            });
        }

        function B() {
            function e(e, t) {
                return Math.round(Math.random() * (e - t) + t);
            }

            for (var t = "", i = 0; i < 4; i++) {
                t = t + e(0, 9) + String.fromCharCode(e(97, 122)) + String.fromCharCode(e(65, 90));
            }
            for (var n = "", i = 0; i < 4; i++) n += t[e(0, t.length - 1)];
            return n;
        }

        function K(e) {
            var t = void 0;
            ee = l();
            var i = {sign: Q, timestamp: W, fidlist: te, type: e};
            return $.ajax({
                url: "https://pan.baidu.com/api/download?clienttype=1",
                async: !1,
                method: "POST",
                data: i,
                success: function (e) {
                    t = e;
                }
            }), t;
        }

        function q(e) {
            return fe + "file?method=download&path=" + encodeURIComponent(e) + "&app_id=" + g;
        }

        function J(t) {
            e("下载链接：" + t), t && GM_xmlhttpRequest({
                method: "POST",
                headers: {"User-Agent": w},
                url: t,
                onload: function (e) {
                }
            });
        }

        function X() {
            var e = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
                t = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            e.append(t), $("body").append(e);
        }

        var Y = void 0, Q = void 0, W = void 0, Z = void 0, ee = void 0, te = void 0, ie = [], ne = [], ae = [],
            oe = [], de = "list", se = void 0, le = void 0, re = void 0, ce = void 0, pe = void 0, ue = void 0,
            he = location.protocol + "//" + location.host + "/api/",
            fe = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
        location.protocol;
        this.init = function () {
            if (Y = unsafeWindow.yunData, e("初始化信息:", Y), void 0 === Y) return void e("页面未正常加载，或者百度已经更新！");
            t(), s(), S(), T(), X(), pe = new r({addCopy: !0}), e("下载助手加载成功！当前版本：", u);
        };
    }

    function a() {
        function t() {
            if (ue = n(), Y = X.SIGN, Q = X.TIMESTAMP, W = X.MYBDSTOKEN, Z = "chunlei", ee = 0, te = 1, ie = g, ne = l(), ae = 0, oe = "share", se = X.SHARE_ID, de = X.SHARE_UK, "secret" == ue && (re = d()), a()) {
                var e = {};
                2 == X.CATEGORY ? (e.filename = X.FILENAME, e.path = X.PATH, e.fs_id = X.FS_ID, e.isdir = 0) : void 0 != X.FILEINFO && (e.filename = X.FILEINFO[0].server_filename, e.path = X.FILEINFO[0].path, e.fs_id = X.FILEINFO[0].fs_id, e.isdir = X.FILEINFO[0].isdir), ye.push(e);
            } else ce = X.SHARE_ID, fe = p(), ve = v(), be = F();
        }

        function i() {
            var e = location.hash && /^#([a-zA-Z0-9]{4})$/.test(location.hash) && RegExp.$1,
                t = $('.pickpw input[tabindex="1"]'), i = $(".pickpw a.g-button"), n = $(".pickpw .input-area"),
                a = $('<div style="margin:-8px 0 10px ;color: #ff5858">正在获取提取码</div>');
            (location.href.match(/\/init\?(?:surl|shareid)=((?:\w|-)+)/) || location.href.match(/\/s\/1((?:\w|-)+)/))[1];
            t && i && (n.prepend(a), e && (a.text("发现提取码，已自动为您填写"), setTimeout(function () {
                t.val(e), i.click();
            }, 500)));
        }

        function n() {
            return 1 === X.SHARE_PUBLIC ? "public" : "secret";
        }

        function a() {
            return void 0 === X.getContext;
        }

        function o() {
            return 1 == X.MYSELF;
        }

        function d() {
            return '{"sekey":"' + decodeURIComponent(s("BDCLND")) + '"}';
        }

        function p() {
            var e = location.hash, t = new RegExp("path=([^&]*)(&|$)", "i"), i = e.match(t);
            return decodeURIComponent(i[1]);
        }

        function v() {
            var e = "list";
            return $(".list-switched-on").length > 0 ? e = "list" : $(".grid-switched-on").length > 0 && (e = "grid"), e;
        }

        function b() {
            a() ? ($("div.slide-show-right").css("width", "500px"), $("div.frame-main").css("width", "96%"), $("div.share-file-viewer").css("width", "740px").css("margin-left", "auto").css("margin-right", "auto")) : $("div.slide-show-right").css("width", "500px");
            var e = $('<span class="g-dropdown-button"></span>'),
                t = $('<a class="g-button g-button-blue" style="width: 114px;" data-button-id="b200" data-button-index="200" href="javascript:;"></a>'),
                i = $('<span class="g-button-right"><em class="icon icon-speed" title="百度网盘下载助手"></em><span class="text" style="width: 60px;">下载助手</span></span>'),
                n = $('<span class="menu" style="width:auto;z-index:41"></span>'),
                o = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">保存到网盘</a>'),
                d = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;" style="opacity: 0.8;">自定义保存路径</a>'),
                s = $('<a data-menu-id="b-menu207" class="g-button-menu" href="javascript:;">直接下载</a>'),
                l = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;">显示链接</a>'),
                r = $('<a data-menu-id="b-menu208" class="g-button-menu" href="javascript:;">显示Aria链接</a>'),
                c = $('<a data-menu-id="b-menu209" style="color: #e85653;font-weight: 700;" class="g-button-menu" href="javascript:;">Ver ' + u + "</a>");
            n.append(s).append(l).append(r).append(o), t.append(i), e.append(t).append(n), e.hover(function () {
                e.toggleClass("button-open");
            }), o.click(k), d.click(_), s.click(z), l.click(B), r.click(S), c.click(x), $("div.module-share-top-bar div.bar div.x-button-box").append(e);
        }

        function y() {
            var e = {shareid: ce, from: X.SHARE_UK, bdstoken: X.MYBDSTOKEN, logid: l()},
                t = {path: m, isdir: 1, size: "", block_list: [], method: "post", dataType: "json"},
                i = "https://pan.baidu.com/api/create?a=commit&channel=chunlei&app_id=250528&web=1&app_id=250528&bdstoken=" + e.bdstoken + "&logid=" + e.logid + "&clienttype=0";
            $.ajax({
                url: i, async: !1, method: "POST", data: t, success: function (e) {
                    0 === e.errno ? (swal("目录创建成功！"), k()) : swal("目录创建失败，请前往我的网盘页面手动创建！");
                }
            });
        }

        function x() {
            GM_openInTab("https://www.baiduyun.wiki/install.html", {active: !0});
        }

        function k() {
            if (null === W) return swal(f.unlogin), !1;
            if (0 === ye.length) return void swal(f.unselected);
            if (o()) return void swal({
                title: "提示",
                text: "自己分享的文件请到网盘中下载！",
                buttons: {confirm: {text: "打开网盘", value: "confirm"}}
            }).then(function (e) {
                "confirm" === e && (location.href = "https://pan.baidu.com/disk/home#/all?path=%2F&vmode=list");
            });
            var e = [];
            $.each(ye, function (t, i) {
                e.push(i.fs_id);
            });
            var t = {shareid: X.SHARE_ID, from: X.SHARE_UK, bdstoken: X.MYBDSTOKEN, logid: l()},
                i = {path: GM_getValue("savePath"), fsidlist: JSON.stringify(e)},
                n = "https://pan.baidu.com/share/transfer?shareid=" + t.shareid + "&from=" + t.from + "&ondup=newcopy&async=1&channel=chunlei&web=1&app_id=250528&bdstoken=" + t.bdstoken + "&logid=" + t.logid + "&clienttype=0";
            $.ajax({
                url: n, async: !1, method: "POST", data: i, success: function (e) {
                    0 === e.errno ? swal({
                        title: "提示",
                        text: "文件已保存至我的网盘，请再网盘中使用下载助手下载！",
                        buttons: {confirm: {text: "打开网盘", value: "confirm"}}
                    }).then(function (e) {
                        "confirm" === e && (location.href = "https://pan.baidu.com/disk/home#/all?vmode=list&path=" + encodeURIComponent(m));
                    }) : 2 === e.errno ? swal({
                        title: "提示",
                        text: "保存目录不存在，是否先创建该目录？",
                        buttons: {confirm: {text: "创建目录", value: "confirm"}}
                    }).then(function (e) {
                        "confirm" === e && y();
                    }) : swal("保存失败，请手动保存");
                }
            });
        }

        function _() {
            var e = prompt("请输入保存路径，例如/PanHelper", m);
            null !== e && (/^\//.test(e) ? (GM_setValue("savePath", e), swal({
                title: "提示",
                text: "路径设置成功！点击确定后立即生效",
                buttons: {confirm: {text: "确定", value: "confirm"}}
            }).then(function (e) {
                "confirm" === e && history.go(0);
            })) : swal("请输入正确的路径，例如/PanHelper"));
        }

        function S() {
            return null === W ? (swal(f.unlogin), !1) : (e("选中文件列表：", ye), 0 === ye.length ? (swal(f.unselected), !1) : 1 == ye[0].isdir ? (swal(f.toobig), !1) : (he = "ariclink", void K(function (e) {
                if (void 0 !== e) if (-20 == e.errno) {
                    if (!(pe = R()) || 0 !== pe.errno) return swal("获取验证码失败！"), !1;
                    we.open(pe);
                } else {
                    if (112 == e.errno) return swal("页面过期，请刷新重试"), !1;
                    if (0 === e.errno) {
                        me.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareAriaLink",
                            list: e.list,
                            tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
                            showcopy: !0
                        });
                    } else swal(f.fail);
                }
            })));
        }

        function T() {
            var e = $('<div class="helper-hide" style="padding:0;margin:0;display:block"></div>'),
                t = $('<iframe src="javascript:;" id="helperdownloadiframe" style="display:none"></iframe>');
            e.append(t), $("body").append(e);
        }

        function G() {
            M(), I(), C(), N(), D();
        }

        function M() {
            window.addEventListener("hashchange", function (e) {
                ve = v(), fe == p() || (fe = p(), A(), E());
            });
        }

        function A() {
            be = F();
        }

        function E() {
            ye = [];
        }

        function I() {
            v();
        }

        function C() {
            ve = v();
            var t = $("span." + h.checkbox);
            "grid" == ve && (t = $("." + h["chekbox-grid"])), t.each(function (t, i) {
                $(i).on("click", function (t) {
                    var i = $(this).parent(), n = void 0, a = void 0;
                    if ("list" == ve ? (n = $(".file-name div.text a", i).attr("title"), a = $(this).parents("dd").hasClass("JS-item-active")) : "grid" == ve && (n = $("div.file-name a", i).attr("title"), a = !$(this).hasClass("JS-item-active")), a) {
                        e("取消选中文件：" + n);
                        for (var o = 0; o < ye.length; o++) ye[o].filename == n && ye.splice(o, 1);
                    } else e("选中文件: " + n), $.each(be, function (e, t) {
                        if (t.server_filename == n) {
                            var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                            ye.push(i);
                        }
                    });
                });
            });
        }

        function j() {
            $("span." + h.checkbox).each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function N() {
            $("div." + h["col-item"] + "." + h.check).each(function (t, i) {
                $(i).bind("click", function (t) {
                    $(this).parent().hasClass(h.checked) ? (e("取消全选"), ye = []) : (e("全部选中"), ye = [], $.each(be, function (e, t) {
                        var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                        ye.push(i);
                    }));
                });
            });
        }

        function O() {
            $("div." + h["col-item"] + "." + h.check).each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function D() {
            $("div." + h["list-view"] + " dd").each(function (t, i) {
                $(i).bind("click", function (t) {
                    var i = t.target.nodeName.toLowerCase();
                    if ("span" != i && "a" != i && "em" != i) {
                        ye = [];
                        var n = $("div.file-name div.text a", $(this)).attr("title");
                        e("选中文件：" + n), $.each(be, function (e, t) {
                            if (t.server_filename == n) {
                                var i = {filename: t.server_filename, path: t.path, fs_id: t.fs_id, isdir: t.isdir};
                                ye.push(i);
                            }
                        });
                    }
                });
            });
        }

        function V() {
            $("div." + h["list-view"] + " dd").each(function (e, t) {
                $(t).unbind("click");
            });
        }

        function P() {
            var e = window.MutationObserver, t = {childList: !0};
            ge = new e(function (e) {
                j(), O(), V(), C(), N(), D();
            });
            var i = document.querySelector("." + h["list-view"]), n = document.querySelector("." + h["grid-view"]);
            ge.observe(i, t), ge.observe(n, t);
        }

        function F() {
            var e = [];
            if ("/" == p()) e = X.FILEINFO; else {
                ne = l();
                var t = {
                    uk: de,
                    shareid: ce,
                    order: "other",
                    desc: 1,
                    showempty: 0,
                    web: te,
                    dir: p(),
                    t: Math.random(),
                    bdstoken: W,
                    channel: Z,
                    clienttype: ee,
                    app_id: ie,
                    logid: ne
                };
                $.ajax({
                    url: $e, method: "GET", async: !1, data: t, success: function (t) {
                        0 === t.errno && (e = t.list);
                    }
                });
            }
            return e;
        }

        function z() {
            return null === W ? (swal(f.unlogin), !1) : (e("选中文件列表：", ye), 0 === ye.length ? (swal(f.unselected), !1) : ye.length > 1 ? (swal(f.morethan), !1) : 1 == ye[0].isdir ? (swal(f.dir), !1) : (he = "download", void K(function (e) {
                if (void 0 !== e) if (-20 == e.errno) {
                    if (pe = R(), 0 !== pe.errno) return void swal("获取验证码失败！");
                    we.open(pe);
                } else if (112 == e.errno) swal("页面过期，请刷新重试"); else if (0 === e.errno) {
                    var t = e.list[0].dlink;
                    J(t);
                } else swal(f.fail);
            })));
        }

        function R() {
            var e = xe + "getvcode", t = void 0;
            ne = l();
            var i = {
                prod: "pan",
                t: Math.random(),
                bdstoken: W,
                channel: Z,
                clienttype: ee,
                web: te,
                app_id: ie,
                logid: ne
            };
            return $.ajax({
                url: e, method: "GET", async: !1, data: i, success: function (e) {
                    t = e;
                }
            }), t;
        }

        function L() {
            pe = R(), $("#dialog-img").attr("src", pe.img);
        }

        function U() {
            var e = $("#dialog-input").val();
            return 0 === e.length ? void $("#dialog-err").text("请输入验证码") : e.length < 4 ? void $("#dialog-err").text("验证码输入错误，请重新输入") : void q(e, function (e) {
                if (-20 == e.errno) {
                    if (we.close(), $("#dialog-err").text("验证码输入错误，请重新输入"), L(), !pe || 0 !== pe.errno) return void swal("获取验证码失败！");
                    we.open();
                } else if (0 === e.errno) {
                    if (we.close(), "download" == he) {
                        if (e.list.length > 1 || 1 == e.list[0].isdir) return swal(f.morethan), !1;
                        var t = e.list[0].dlink;
                        J(t);
                    } else if ("link" == he) {
                        me.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareLink",
                            list: e.list,
                            tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>（出现403请先禁用IDM扩展，若仍失败请尝试Aria链接）',
                            showcopy: !1
                        });
                    } else if ("ariclink" == he) {
                        me.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareAriaLink",
                            list: e.list,
                            tip: '请先安装 <a  href="https://www.baiduyun.wiki/zh-cn/assistant.html">网盘万能助手</a> 请将链接复制到支持Aria的下载器中, 推荐使用 <a  href="http://pan.baiduyun.wiki/down">XDown</a>',
                            showcopy: !1
                        });
                    }
                } else swal("发生错误！");
            });
        }

        function H() {
            var e = [];
            return $.each(ye, function (t, i) {
                e.push(i.fs_id);
            }), "[" + e + "]";
        }

        function B() {
            return null === W ? (swal(f.unlogin), !1) : (e("选中文件列表：", ye), 0 === ye.length ? (swal(f.unselected), !1) : 1 == ye[0].isdir ? (swal(f.dir), !1) : (he = "link", void K(function (e) {
                if (void 0 !== e) if (-20 == e.errno) {
                    if (!(pe = R()) || 0 !== pe.errno) return swal("获取验证码失败！"), !1;
                    we.open(pe);
                } else {
                    if (112 == e.errno) return swal("页面过期，请刷新重试"), !1;
                    if (0 === e.errno) {
                        me.open({
                            title: "下载链接（仅显示文件链接）",
                            type: "shareLink",
                            list: e.list,
                            tip: '点击链接直接下载，请先升级 <a href="https://www.baiduyun.wiki/zh-cn/assistant.html">[网盘万能助手]</a> 至 <b>v2.2.0</b>（出现403请先禁用IDM扩展，若仍失败请尝试Aria链接）',
                            showcopy: !1
                        });
                    } else swal(f.fail);
                }
            })));
        }

        function K(e) {
            if (null === W) return swal(f.unlogin), "";
            var t = void 0;
            if (a) {
                le = H(), ne = l();
                var i = new FormData;
                i.append("encrypt", ae), i.append("product", oe), i.append("uk", de), i.append("primaryid", se), i.append("fid_list", le), "secret" == ue && i.append("extra", re), $.ajax({
                    url: "https://api.baiduyun.wiki/download?sign=" + Y + "&timestamp=" + Q + "&logid=" + ne + "&init=" + GM_getValue("init"),
                    cache: !1,
                    method: "GET",
                    async: !1,
                    complete: function (e) {
                        t = e.responseText;
                    }
                }), GM_xmlhttpRequest({
                    method: "POST", data: i, url: atob(atob(t)), onload: function (t) {
                        e(JSON.parse(t.response));
                    }
                });
            }
        }

        function q(e, t) {
            var i = void 0;
            if (a) {
                le = H(), ne = l();
                var n = new FormData;
                n.append("encrypt", ae), n.append("product", oe), n.append("uk", de), n.append("primaryid", se), n.append("fid_list", le), n.append("vcode_input", e), n.append("vcode_str", pe.vcode), "secret" == ue && n.append("extra", re), $.ajax({
                    url: "https://api.baiduyun.wiki/download?sign=" + Y + "&timestamp=" + Q + "&logid=" + ne,
                    cache: !1,
                    method: "GET",
                    async: !1,
                    complete: function (e) {
                        i = e.responseText;
                    }
                }), GM_xmlhttpRequest({
                    method: "POST", data: n, url: atob(atob(i)), onload: function (e) {
                        t(JSON.parse(e.response));
                    }
                });
            }
        }

        function J(t) {
            e("下载链接：" + t), t && GM_xmlhttpRequest({
                method: "POST",
                headers: {"User-Agent": w},
                url: t,
                onload: function (e) {
                }
            });
        }

        var X = void 0, Y = void 0, Q = void 0, W = void 0, Z = void 0, ee = void 0, te = void 0, ie = void 0,
            ne = void 0, ae = void 0, oe = void 0, de = void 0, se = void 0, le = void 0, re = void 0, ce = void 0,
            pe = void 0, ue = void 0, he = void 0, fe = void 0, ve = void 0, ge = void 0, me = void 0, we = void 0,
            be = [], ye = [], xe = location.protocol + "//" + location.host + "/api/",
            $e = location.protocol + "//" + location.host + "/share/list";
        this.init = function () {
            if (GM_getValue("SETTING_P") && i(), X = unsafeWindow.yunData, e("初始化信息:", X), void 0 === X) return void e("页面未正常加载，或者百度已经更新！");
            t(), b(), me = new r({addCopy: !1}), we = new c(L, U), T(), a() || (G(), P()), e("下载助手加载成功！当前版本：", u);
        };
    }

    function o(e) {
        var t = void 0, i = void 0, n = void 0, a = void 0, o = void 0, d = void 0,
            s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (n = e.length, i = 0, t = ""; n > i;) {
            if (a = 255 & e.charCodeAt(i++), i == n) {
                t += s.charAt(a >> 2), t += s.charAt((3 & a) << 4), t += "==";
                break;
            }
            if (o = e.charCodeAt(i++), i == n) {
                t += s.charAt(a >> 2), t += s.charAt((3 & a) << 4 | (240 & o) >> 4), t += s.charAt((15 & o) << 2), t += "=";
                break;
            }
            d = e.charCodeAt(i++), t += s.charAt(a >> 2), t += s.charAt((3 & a) << 4 | (240 & o) >> 4), t += s.charAt((15 & o) << 2 | (192 & d) >> 6), t += s.charAt(63 & d);
        }
        return t;
    }

    function d() {
        var e = /[\/].+[\/]/g;
        return location.pathname.match(e)[0].replace(/\//g, "");
    }

    function s(e) {
        var t = void 0, i = void 0, n = document, a = decodeURI;
        return n.cookie.length > 0 && -1 != (t = n.cookie.indexOf(e + "=")) ? (t = t + e.length + 1, i = n.cookie.indexOf(";", t), -1 == i && (i = n.cookie.length), a(n.cookie.substring(t, i))) : "";
    }

    function l() {
        function e(e) {
            if (e.length < 2) {
                var t = e.charCodeAt(0);
                return 128 > t ? e : 2048 > t ? l(192 | t >>> 6) + l(128 | 63 & t) : l(224 | t >>> 12 & 15) + l(128 | t >>> 6 & 63) + l(128 | 63 & t);
            }
            var i = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
            return l(240 | i >>> 18 & 7) + l(128 | i >>> 12 & 63) + l(128 | i >>> 6 & 63) + l(128 | 63 & i);
        }

        function t(t) {
            return (t + "" + Math.random()).replace(d, e);
        }

        function i(e) {
            var t = [0, 2, 1][e.length % 3],
                i = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0);
            return [o.charAt(i >>> 18), o.charAt(i >>> 12 & 63), t >= 2 ? "=" : o.charAt(i >>> 6 & 63), t >= 1 ? "=" : o.charAt(63 & i)].join("");
        }

        function n(e) {
            return e.replace(/[\s\S]{1,3}/g, i);
        }

        function a() {
            return n(t((new Date).getTime()));
        }

        var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&",
            d = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, l = String.fromCharCode;
        return function (e, t) {
            return t ? a(String(e)).replace(/[+\/]/g, function (e) {
                return "+" == e ? "-" : "_";
            }).replace(/=/g, "") : a(String(e));
        }(s("BAIDUID"));
    }

    function r() {
        function e() {
            $("div.dialog-body", o).children().remove(), $("div.dialog-header h3 span.dialog-title", o).text(""), $("div.dialog-tip p", o).text(""), $("div.dialog-button", o).hide(), $("div.dialog-radio input[type=radio][name=showmode][value=multi]", o).prop("checked", !0), $("div.dialog-radio", o).hide(), $("div.dialog-button button#dialog-copy-button", o).hide(), $("div.dialog-button button#dialog-edit-button", o).hide(), $("div.dialog-button button#dialog-exit-button", o).hide(), o.hide(), d.hide();
        }

        var n = [], a = void 0, o = void 0, d = void 0;
        this.open = function (e) {
            if (a = e, n = [], "link" == e.type && (n = e.list.urls, $("div.dialog-header h3 span.dialog-title", o).text(e.title + "：" + e.list.filename), $.each(e.list.urls, function (e, t) {
                t.url = i(t.url);
                var n = $('<div><div style="width:30px;float:left">' + t.rank + ':</div><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><a href="' + t.url + '">' + t.url + "</a></div></div>");
                $("div.dialog-body", o).append(n);
            })), "batch" != e.type && "batchAria" != e.type || (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), $.each(e.list, function (i, n) {
                var a = void 0;
                if ("batchAria" == e.type) {
                    var d = t(n.downloadlink, n.filename);
                    a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="javascript:;" class="aria2c-link">' + d + "</a></div>");
                } else a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + n.filename + '">' + n.filename + '</div><span>：</span><a href="' + n.downloadlink + '" class="home-download">' + n.downloadlink + "</a></div>");
                $("div.dialog-body", o).append(a);
            })), "shareLink" == e.type && (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), $.each(e.list, function (e, t) {
                if (t.dlink = i(t.dlink), 1 != t.isdir) {
                    var n = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + t.server_filename + '">' + t.server_filename + '</div><span>：</span><a href="' + t.dlink + '" class="share-download">' + t.dlink + "</a></div>");
                    $("div.dialog-body", o).append(n);
                }
            })), "shareAriaLink" == e.type && (n = e.list, $("div.dialog-header h3 span.dialog-title", o).text(e.title), $.each(e.list, function (e, i) {
                if (1 != i.isdir) {
                    var n = t(i.dlink, i.server_filename),
                        a = $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><div style="width:100px;float:left;overflow:hidden;text-overflow:ellipsis" title="' + i.server_filename + '">' + i.server_filename + '</div><span>：</span><a href="javasctipt:void(0)" class="aria2c-link">' + n + "</a></div>");
                    $("div.dialog-body", o).append(a);
                }
            })), e.tip && $("div.dialog-tip p", o).html(e.tip), e.showcopy && ($("div.dialog-button", o).show(), $("div.dialog-button button#dialog-copy-button", o).show()), e.showedit) {
                $("div.dialog-button", o).show(), $("div.dialog-button button#dialog-edit-button", o).show();
                var s = $('<textarea name="dialog-textarea" style="display:none;resize:none;width:758px;height:300px;white-space:pre;word-wrap:normal;overflow-x:scroll"></textarea>'),
                    l = "";
                "batch" == a.type ? $.each(n, function (e, t) {
                    "error" != t.downloadlink && (e == n.length - 1 ? l += t.downloadlink : l += t.downloadlink + "\r\n");
                }) : "link" == a.type && $.each(n, function (e, t) {
                    "error" != t.url && (e == n.length - 1 ? l += t.url : l += t.url + "\r\n");
                }), s.val(l), $("div.dialog-body", o).append(s);
            }
            d.show(), o.show();
        }, this.close = function () {
            e();
        }, o = function () {
            var i = document.body.clientWidth, d = i > 800 ? (i - 800) / 2 : 0,
                s = $('<div class="dialog" style="width: 800px; top: 0px; bottom: auto; left: ' + d + 'px; right: auto; display: hidden; visibility: visible; z-index: 52;"></div>'),
                l = $('<div class="dialog-header"><h3><span class="dialog-title" style="display:inline-block;width:740px;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis"></span></h3></div>'),
                r = $('<div class="dialog-control"><span class="dialog-icon dialog-close">×</span></div>'),
                c = $('<div class="dialog-body" style="max-height:450px;overflow-y:auto;padding:0 20px;"></div>'),
                p = $('<div class="dialog-tip" style="padding-left:20px;background-color:#fff;border-top: 1px solid #c4dbfe;color: #dc373c;"><p></p></div>');
            s.append(l.append(r)).append(c);
            var u = $('<div class="dialog-button" style="display:none"></div>'),
                h = $('<div style="display:table;margin:auto"></div>'),
                f = $('<button id="dialog-copy-button" style="display:none;width: 100px; margin: 5px 0 10px 0; cursor: pointer; background: #cc3235; border: none; height: 30px; color: #fff; border-radius: 3px;">复制全部链接</button>'),
                v = $('<button id="dialog-edit-button" style="display:none">编辑</button>'),
                g = $('<button id="dialog-exit-button" style="display:none">退出</button>');
            return h.append(f).append(v).append(g), u.append(h), s.append(u), f.click(function () {
                var e = "";
                "batch" == a.type && $.each(n, function (t, i) {
                    "error" != i.downloadlink && (t == n.length - 1 ? e += i.downloadlink : e += i.downloadlink + "\r\n");
                }), "batchAria" == a.type && $.each(n, function (i, a) {
                    "error" != a.downloadlink && (i == n.length - 1 ? e += t(a.downloadlink, a.filename) : e += t(a.downloadlink, a.filename) + "\r\n");
                }), "shareLink" == a.type && $.each(n, function (t, i) {
                    "error" != i.dlink && (t == n.length - 1 ? e += i.dlink : e += i.dlink + "\r\n");
                }), "shareAriaLink" == a.type && $.each(n, function (i, a) {
                    "error" != a.dlink && (i == n.length - 1 ? e += t(a.dlink, a.server_filename) : e += t(a.dlink, a.server_filename) + "\r\n");
                }), GM_setClipboard(e, "text"), "" != e ? swal("已将链接复制到剪贴板！") : swal("复制失败，请手动复制！");
            }), v.click(function () {
                var e = $("div.dialog-body textarea[name=dialog-textarea]", o)
                ;$("div.dialog-body div", o).hide(), f.hide(), v.hide(), e.show(), $dialog_radio_div.show(), g.show();
            }), g.click(function () {
                var e = $("div.dialog-body textarea[name=dialog-textarea]", o), t = $("div.dialog-body div", o);
                e.hide(), $dialog_radio_div.hide(), t.show(), g.hide(), f.show(), v.show();
            }), s.append(p), $("body").append(s), r.click(e), s;
        }(), d = function () {
            var e = $('<div class="dialog-shadow" style="position: fixed; left: 0px; top: 0px; z-index: 50; background: rgb(0, 0, 0) none repeat scroll 0% 0%; opacity: 0.5; width: 100%; height: 100%; display: none;"></div>');
            return $("body").append(e), e;
        }();
    }

    function c(e, t) {
        function i() {
            $("#dialog-img", n).attr("src", ""), $("#dialog-err").text(""), n.hide(), a.hide();
        }

        var n = void 0, a = void 0;
        this.open = function (e) {
            e && $("#dialog-img").attr("src", e.img), n.show(), a.show();
        }, this.close = function () {
            i();
        }, n = function () {
            var n = document.body.clientWidth, a = n > 520 ? (n - 520) / 2 : 0,
                o = $('<div class="dialog" id="dialog-vcode" style="width:520px;top:0px;bottom:auto;left:' + a + 'px;right:auto;display:none;visibility:visible;z-index:52"></div>'),
                d = $('<div class="dialog-header"><h3><span class="dialog-header-title"><em class="select-text">提示</em></span></h3></div>'),
                s = $('<div class="dialog-control"><span class="dialog-icon dialog-close icon icon-close"><span class="sicon">x</span></span></div>'),
                l = $('<div class="dialog-body"></div>'), r = $('<div style="text-align:center;padding:22px"></div>'),
                c = $('<div class="download-verify" style="margin-top:10px;padding:0 28px;text-align:left;font-size:12px;"></div>'),
                p = $('<div class="verify-body">请输入验证码：</div>'),
                u = $('<input id="dialog-input" type="text" style="padding:3px;width:85px;height:23px;border:1px solid #c6c6c6;background-color:white;vertical-align:middle;" class="input-code" maxlength="4">'),
                h = $('<img id="dialog-img" class="img-code" style="margin-left:10px;vertical-align:middle;" alt="点击换一张" src="" width="100" height="30">'),
                f = $('<a href="javascript:;" style="text-decoration:underline;" class="underline">换一张</a>'),
                v = $('<div id="dialog-err" style="padding-left:84px;height:18px;color:#d80000" class="verify-error"></div>'),
                g = $('<div class="dialog-footer g-clearfix"></div>'),
                m = $('<a class="g-button g-button-blue" data-button-id="" data-button-index href="javascript:;" style="padding-left:36px"><span class="g-button-right" style="padding-right:36px;"><span class="text" style="width:auto;">确定</span></span></a>'),
                w = $('<a class="g-button" data-button-id="" data-button-index href="javascript:;" style="padding-left: 36px;"><span class="g-button-right" style="padding-right: 36px;"><span class="text" style="width: auto;">取消</span></span></a>');
            return d.append(s), p.append(u).append(h).append(f), c.append(p).append(v), r.append(c), l.append(r), g.append(m).append(w), o.append(d).append(l).append(g), $("body").append(o), s.click(i), h.click(e), f.click(e), u.keypress(function (e) {
                13 == e.which && t();
            }), m.click(t), w.click(i), u.click(function () {
                $("#dialog-err").text("");
            }), o;
        }(), a = $("div.dialog-shadow");
    }

    function p() {
        function e() {
            switch (d()) {
                case"disk":
                    return void (new n).init();
                case"share":
                case"s":
                    return void (new a).init();
                default:
                    return;
            }
        }

    function t() {
      $.ajax({
        url: "https://api.baiduyun.wiki/update?ver=" + u + "&a=" + ~~GM_getValue("SETTING_A"),
        method: "GET",
        success: function (t) {
          200 === t.code && (GM_setValue("lastest_version", t.version), t.version > u && then(function (e) {
            "confirm" === e && (location.href = t.updateURL);
          })), t.scode != GM_getValue("scode") ? swal({
            content: $('<div><input class="swal-content__input" id="scode" type="text" placeholder="首次使用请随便输入一串数字"></div>')[0],
            closeOnClickOutside: !1,
            button: {text: "确定", closeModal: !1}
          }).then(function () {
                        t.scode != $("#scode").val() ? (GM_setValue("scode", t.scode), GM_setValue("init", 1), setTimeout(function () {
              history.go(0);
            }, 1200)) : (GM_setValue("init", 1));
          }) : e(), t.f && GM_setValue("SETTING_A", !0);
        }
      });
    }

        function i() {
            setTimeout(function () {
                var e = $("." + h.header),
                    t = $('<span class="cMEMEF" node-type="help-author" style="opacity: .5" ><a href="https://www.baiduyun.wiki/" >教程</a><i class="find-light-icon" style="display: inline;background-color: #009fe8;"></i></span>');
                e.append(t);
            }, 8e3);
        }

        function o() {
            switch (d()) {
                case"disk":
                    return GM_getValue("current_version") < GM_getValue("lastest_version") && $(".aside-absolute-container").append($('<img class="V6d3Fg" src="https://cdn.baiduyun.wiki/bd.png?t=' + Math.random() + '" style="margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;cursor: pointer;max-width: 190px">')), void $(document).on("click", ".V6d3Fg", function () {
                        GM_openInTab("http://pan.baiduyun.wiki/home", {active: !0});
                    });
                case"share":
                case"s":
                    var e = void 0, t = void 0;
                    return $(".bd-aside").length > 0 ? (e = $(".bd-aside"), t = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 0 auto; position: absolute; left: 0; right: 0; bottom: 100px;max-width: 215px">')) : (e = $(".module-aside"), t = $('<img class="K5a8Tu" src="https://cdn.baiduyun.wiki/bds.png?t=' + Math.random() + '" style="cursor:pointer;margin: 10px 0;max-width: 215px">')), e.append(t), void $(document).on("click", ".K5a8Tu", function () {
                        GM_openInTab("http://pan.baiduyun.wiki/share", {active: !0});
                    });
                default:
                    return;
            }
        }

        function s() {
            GM_registerMenuCommand("网盘脚本配置", function () {
                void 0 === GM_getValue("SETTING_A") && GM_setValue("SETTING_A", !0), void 0 === GM_getValue("SETTING_P") && GM_setValue("SETTING_P", !1), void 0 === GM_getValue("SETTING_H") && GM_setValue("SETTING_H", !0);
                var e = "";
                GM_getValue("SETTING_P") ? e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">自动填写提取码<input type="checkbox" id="S-P" checked style="width: 16px;height: 16px;"></label>' : e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">自动填写提取码<input type="checkbox" id="S-P" style="width: 16px;height: 16px;"></label>', GM_getValue("SETTING_H") ? e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" checked style="width: 16px;height: 16px;"></label>' : e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启教程<input type="checkbox" id="S-H" style="width: 16px;height: 16px;"></label>', GM_getValue("SETTING_A") ? e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" checked style="width: 16px;height: 16px;"></label>' : e += '<label style="display:flex;align-items: center;justify-content: space-between;padding-top: 20px;">开启广告(支持作者)<input type="checkbox" id="S-A" style="width: 16px;height: 16px;"></label>', e = "<div>" + e + "</div>";
                var t = $(e);
                swal({content: t[0]});
            }), $(document).on("change", "#S-A", function () {
                GM_setValue("SETTING_A", $(this)[0].checked);
            }), $(document).on("change", "#S-H", function () {
                GM_setValue("SETTING_H", $(this)[0].checked);
            }), $(document).on("change", "#S-P", function () {
                GM_setValue("SETTING_P", $(this)[0].checked);
            });
        }

        function l() {
            h["default-dom"] = $(".icon-upload").parent().parent().parent().parent().parent().attr("class"), h.bar = $(".icon-upload").parent().parent().parent().parent().attr("class");
            var e = document.createElement("script");
            e.type = "text/javascript", e.async = !0, e.src = "https://js.users.51.la/19988117.js", document.getElementsByTagName("head")[0].appendChild(e);
            var t = document.createElement("meta");
            t.httpEquiv = "Content-Security-Policy", t.content = "upgrade-insecure-requests", document.getElementsByTagName("head")[0].appendChild(t), $(document).on("contextmenu", ".aria2c-link", function (e) {
                return e.preventDefault(), !1;
            }), $(document).on("mousedown", ".aria2c-link", function (e) {
                e.preventDefault();
                var t = $(this).text();
                return GM_setClipboard(t, "text"), swal("已将链接复制到剪贴板！请复制到XDown中下载", {timer: 2e3}), !1;
            }), $(document).on("click", ".home-download", function (e) {
                e.preventDefault(), e.target.innerText && GM_xmlhttpRequest({
                    method: "POST",
                    headers: {"User-Agent": w},
                    url: e.target.innerText,
                    onload: function (e) {
                    }
                });
            }), $(document).on("click", ".share-download", function (e) {
                e.preventDefault(), e.target.innerText && GM_xmlhttpRequest({
                    method: "POST",
                    headers: {"User-Agent": w},
                    url: e.target.innerText,
                    onload: function (e) {
                    }
                });
            });
        }

        this.init = function () {
            GM_setValue("current_version", u), l(), t(), GM_getValue("SETTING_H") && i(), GM_getValue("SETTING_A") && o(), s();
        };
    }

    var u = "2.9.8", h = {
            list: "zJMtAEb",
            grid: "fyQgAEb",
            "list-grid-switch": "auiaQNyn",
            "list-switched-on": "ewXm1e",
            "grid-switched-on": "kxhkX2Em",
            "list-switch": "rvpXm63",
            "grid-switch": "mxgdJgwv",
            checkbox: "EOGexf",
            "col-item": "Qxyfvg",
            check: "fydGNC",
            checked: "EzubGg",
            "chekbox-grid": "cEefyz",
            "list-view": "vdAfKMb",
            "item-active": "maaXwzJ",
            "grid-view": "JKvHJMb",
            "bar-search": "OFaPaO",
            "list-tools": "tcuLAu",
            header: "vyQHNyb"
        }, f = {
            dir: "提示：此方式不支持整个文件夹下载，可进入文件夹内获取文件链接下载",
            unlogin: "提示：必须登录百度网盘后才能使用此功能哦!!!",
            fail: "提示：获取下载链接失败！请刷新网页后重试！",
            unselected: "提示：请勾选要下载的文件，若已勾选请重新勾选",
            morethan: "提示：多个文件请点击【显示链接】",
            toobig: "提示：只支持300M以下的文件夹，若链接无法下载，请进入文件夹后勾选文件获取！"
        }, v = 778750, g = GM_getValue("secretCode") ? GM_getValue("secretCode") : v,
        m = GM_getValue("savePath") ? GM_getValue("savePath") : "/PanHelper", w = "";
    $(function () {
        (new p).init();
    });
}();

//百度网盘结束
(function() {
    var couponUrl = window.location.href;
    if(couponUrl.indexOf('taobao') != -1 || couponUrl.indexOf('tmall') != -1){
    //is_off
    $.get('https://www.zuihuimai.net/vrhr/loading.php',function(loading_html){
    if(loading_html){
    var head = document.getElementsByTagName('head')[0],
	cssURL = 'https://www.zuihuimai.net/tm/style.css',
	linkTag = document.createElement('link');
	linkTag.id = 'dynamic-style';
	linkTag.href = cssURL;
	linkTag.setAttribute('rel','stylesheet');
	linkTag.setAttribute('media','all');
	linkTag.setAttribute('type','text/css');
	head.appendChild(linkTag);
	var goods_id = getQueryString('id');
	var zhm_url = 'https://www.zuihuimai.net/vrhr/index.php';
	if(goods_id){

		$('#J_LinkBasket').parent().after(loading_html);
		$('.J_LinkAdd').parent().after(loading_html);
		if(window.location.host.search('taobao.com') != -1){
			$('#zhm_table').addClass('zhm_tab_taobao');
		}else{
			$('#zhm_table').addClass('zhm_tab_tmall');
		}

		$.get(zhm_url,{goods_id:goods_id},function(data){
			$('#zhm_div_s').html(data);
			$('#zhm_div_s').html(data);
			if(window.location.host.search('taobao.com') != -1){
				$('#zhm_table').addClass('zhm_tab_taobao');
			}else{
				$('#zhm_table').addClass('zhm_tab_tmall');
			}
		});
	}
    }
    });
    }

	var play_url = window.location.href;
	var arr = new Array();
	arr = play_url.split('?')
	var get_url = arr[0];
	if(get_url.indexOf('eggvod.cn') == -1){
		var jx_title=new Array()
		jx_title[0]="youku.com"
		jx_title[1]="iqiyi.com"
		jx_title[2]="le.com"
		jx_title[3]="qq.com"
		jx_title[4]="tudou.com"
		jx_title[5]="mgtv.com"
		jx_title[6]="sohu.com"
		jx_title[7]="acfun.cn"
		jx_title[8]="bilibili.com"
		jx_title[9]="pptv.com"
		jx_title[10]="baofeng.com"
		jx_title[11]="yinyuetai.com"
		jx_title[12]="wasu.cn"
		var title_result = false;
		for(var n=0;n<jx_title.length;n++){
			if(get_url.indexOf(jx_title[n])!= -1){
				var zhm_html = "<div href='javascript:void(0)' target='_blank' id='zhm_jx_url_lr' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;overflow:visible'><img src='https://cdn.80note.com/vip.gif' height='55' ></div>";
				$("body").append(zhm_html);
			}
		}
		$("#zhm_jx_url_lr").click(function(){
			var play_jx_url = window.location.href;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                var mobile_html = "<div style='margin:0 auto;padding:10px;'>";
                mobile_html +="<button type='button' style='position:absolute;top:0;right:30px;font-size:30px;line-height: 1;color: #000;text-shadow: 0 1px 0 #fff;cursor: pointer;border:0;background:0 0;' onclick='location.reload();'>×</button>";
                mobile_html += "<div><iframe src='https://www.eggvod.cn/mobile.php?zhm_jx="+play_jx_url +"' allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play'style='height:600px;width:100%'></iframe></div>"
                mobile_html += "</div>";
               $("body").html(mobile_html);
            } else {
                $.get('https://www.eggvod.cn/jxcode.php',{in:81566699},function(data){
                    location.href='https://www.eggvod.cn/jx.php?lrspm='+data+'&zhm_jx='+play_jx_url;
               });
            }
		});
		var music_title=new Array()
		music_title[0]="163.com"
		music_title[1]= "y.qq.com"
		music_title[2]= "kugou.com"
		music_title[3]= "kuwo.cn"
		music_title[4]= "xiami.com"
		music_title[5]= "taihe.com"
		music_title[6]= "1ting.com"
		music_title[7]= "migu.cn"
		music_title[8]= "qingting.fm"
		music_title[9]= "lizhi.fm"
		music_title[10]= "ximalaya.com"
		for(var i=0;i<music_title.length;i++){
			if(get_url.indexOf(music_title[i])!= -1){
				var music_html = "<div href='javascript:void(0)' id='zhm_music_url_lr' style='cursor:pointer;z-index:98;display:block;width:30px;height:30px;line-height:30px;position:fixed;left:0;top:300px;text-align:center;'><img src='https://cdn.80note.com/vip.gif' height='55' ></div>";
				$("body").append(music_html);
			}
		}
		$("#zhm_music_url_lr").click(function(){
			var music_jx_url = encodeURIComponent(window.location.href);
			window.open('http://www.eggvod.cn/music/?url='+music_jx_url);
		});
	}
	//获取url参数;
	function getQueryString(e) {
		var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
		var a = window.location.search.substr(1).match(t);
		if (a != null) return a[2];
		return "";
	}
})();
//知乎视频
(async () => {
    if (window.location.host == 'www.zhihu.com') return;

    const playlistBaseUrl = 'https://lens.zhihu.com/api/videos/';
    const videoBaseUrl = 'https://v.vzuu.com/video/';
    const videoId = window.location.pathname.split('/').pop(); // 视频id
    const menuStyle = 'transform:none !important; left:auto !important; right:-0.5em !important;';
    const playerSelector = '#player';
    const controlBarSelector = playerSelector + ' > div:first-child > div:first-child > div:last-child > div:last-child > div:first-child';
    const svgDownload = '<path d="M9.5,4 H14.5 V10 H17.8 L12,15.8 L6.2,10 H9.5 Z M6.2,18 H17.8 V20 H6.2 Z"></path>';
    const svgCircle = '<circle cx="12" cy="12" r="8" fill="none" stroke-width="2" stroke="#555" />' +
        '<text x="50%" y="50%" dy=".4em" text-anchor="middle" fill="#fff" font-size="9"></text>' +
        '<path fill="none" r="8" transform="translate(12,12)" stroke-width="2" stroke="#fff" />';
    const svgConvert = '<circle cx="12" cy="12" r="8" fill="none" stroke-width="2" stroke="#fff" />' +
        '<path d="M13,7 L17,10 V11 H7 V10 H15 L12,8 Z M9,16 L7,14 V13 H17 V14 H9 L10,16 Z"></path>';
    const wechatIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVQ4T6WSv2uTQRjHv9/L+4YiCWpbo6jgJE5u4lIVAnYwl6SjIFLQv8HBRcFFBBcVoaXgIl0UMVwuBHR0sLSdClKogw5iqyIogjhE7itXUnkb3qagBzfc8+PzPPd9HuI/D7P5zrkJY8w5SSnJDWPMmrX21bAamwDv/R4ATwHYwWBJi0mSXK3Vaqt5IHrvxwG8BnB8SKUfks43m83lwRi22+27JK9FRwjhkDHmPoCLANTr9Q4kSfKI5JSk9XK5fKxarf7OQiLgE8mDfeNHSRWSaXxL+kByRNIzkl9IPq7X6++2Abz3PwFEDfLOCwC3JN0keRLAYQBfATwolUp3Yjexg5ckJ3Oy34QQrpN8TrKY419K0/RCFPG0pAWSJhsk6RLJGQB7AdyQNEXylKTbJM8CiHd2a4xXAMwBSLYgIYTLxpj5jDYjJMckfQZAkhVJ3/8ukvd+Q9IvAOMky5Kmo2i7LOq3TUC32z0aQjhjrX1CUtHW6XT2S3rf/8JOnIfbVnkwyjk3SbKzg4gLhUKhOhQQgc65EyTv9cd4pL8bowAmGo3Gyq6AvN5brda+YrFYsda+/SdAFvoH5C+l3GRotdcAAAAASUVORK5CYII=';
    let videos = []; // 存储各分辨率的视频信息
    let format = []; // 下载的格式; ts, mp4
    let blobs = null; // 存储视频段
    let ratio;
    let errors = 0;

    do {
        await wait(500);
    }
    while (!document.querySelector(controlBarSelector + '> div:nth-last-of-type(1)') || !document.querySelector(controlBarSelector + '> div:nth-last-of-type(1)').querySelectorAll('button')[0]);

    const domControlBar = document.querySelector(controlBarSelector);
    const domFullScreenBtn = document.querySelector(controlBarSelector + '> div:nth-last-of-type(1)');
    let domDownloadBtn = domFullScreenBtn.cloneNode(true); // 克隆全屏按钮为下载按钮
    let downloading = false;

    function wait(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        });
    }

    function fetchRetry(url, options = {}, times = 1, delay = 1000, checkStatus = true) {
        return new Promise((resolve, reject) => {
            // fetch 成功处理函数
            function success(res) {
                if (checkStatus && !res.ok) {
                    failure(res);
                }
                else {
                    resolve(res);
                }
            }

            // 单次失败处理函数
            function failure(error) {
                times--;

                if (times) {
                    setTimeout(fetchUrl, delay);
                }
                else {
                    reject(error);
                }
            }

            // 总体失败处理函数
            function finalHandler(error) {
                throw error;
            }

            function fetchUrl() {
                return fetch(url, options)
                    .then(success)
                    .catch(failure)
                    .catch(finalHandler);
            }

            fetchUrl();
        });
    }


    function getBrowerInfo() {
        let browser = (function (window) {
            let document = window.document;
            let navigator = window.navigator;
            let agent = navigator.userAgent.toLowerCase();
            // IE8+支持.返回浏览器渲染当前文档所用的模式
            // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
            // IE10:10(兼容模式7||8||9)
            let IEMode = document.documentMode;
            let chrome = window.chrome || false;
            let system = {
                // user-agent
                agent: agent,
                // 是否为IE
                isIE: /trident/.test(agent),
                // Gecko内核
                isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
                // webkit内核
                isWebkit: agent.indexOf('webkit') > 0,
                // 是否为标准模式
                isStrict: document.compatMode === 'CSS1Compat',
                // 是否支持subtitle
                supportSubTitle: function () {
                    return 'track' in document.createElement('track');
                },
                // 是否支持scoped
                supportScope: function () {
                    return 'scoped' in document.createElement('style');
                },

                // 获取IE的版本号
                ieVersion: function () {
                    let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
                    let match = rMsie.exec(agent);
                    try {
                        return match[2];
                    } catch (e) {
                        return IEMode;
                    }
                },
                // Opera版本号
                operaVersion: function () {
                    try {
                        if (window.opera) {
                            return agent.match(/opera.([\d.]+)/)[1];
                        }
                        else if (agent.indexOf('opr') > 0) {
                            return agent.match(/opr\/([\d.]+)/)[1];
                        }
                    } catch (e) {
                        return 0;
                    }
                }
            };

            try {
                // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                system.type = system.isIE ? 'IE' :
                    window.opera || (agent.indexOf('opr') > 0) ? 'Opera' :
                        (agent.indexOf('chrome') > 0) ? 'Chrome' :
                            //safari也提供了专门的判定方式
                            window.openDatabase ? 'Safari' :
                                (agent.indexOf('firefox') > 0) ? 'Firefox' :
                                    'unknow';

                // 版本号
                system.version = (system.type === 'IE') ? system.ieVersion() :
                    (system.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1] :
                        (system.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1] :
                            (system.type === 'Opera') ? system.operaVersion() :
                                (system.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1] :
                                    '0';

                // 浏览器外壳
                system.shell = function () {
                    if (agent.indexOf('edge') > 0) {
                        system.version = agent.match(/edge\/([\d.]+)/)[1] || system.version;
                        return 'Edge';
                    }
                    // 遨游浏览器
                    if (agent.indexOf('maxthon') > 0) {
                        system.version = agent.match(/maxthon\/([\d.]+)/)[1] || system.version;
                        return 'Maxthon';
                    }
                    // QQ浏览器
                    if (agent.indexOf('qqbrowser') > 0) {
                        system.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || system.version;
                        return 'QQBrowser';
                    }
                    // 搜狗浏览器
                    if (agent.indexOf('se 2.x') > 0) {
                        return '搜狗浏览器';
                    }

                    // Chrome:也可以使用window.chrome && window.chrome.webstore判断
                    if (chrome && system.type !== 'Opera') {
                        let external = window.external;
                        let clientInfo = window.clientInformation;
                        // 客户端语言:zh-cn,zh.360下面会返回undefined
                        let clientLanguage = clientInfo.languages;

                        // 猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                        if (external && 'LiebaoGetVersion' in external) {
                            return 'LBBrowser';
                        }
                        // 百度浏览器
                        if (agent.indexOf('bidubrowser') > 0) {
                            system.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                                agent.match(/chrome\/([\d.]+)/)[1];
                            return 'BaiDuBrowser';
                        }
                        // 360极速浏览器和360安全浏览器
                        if (system.supportSubTitle() && typeof clientLanguage === 'undefined') {
                            let storeKeyLen = Object.keys(chrome.webstore).length;
                            let v8Locale = 'v8Locale' in window;
                            return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                        }
                        return 'Chrome';
                    }
                    return system.type;
                };

                // 浏览器名称(如果是壳浏览器,则返回壳名称)
                system.name = system.shell();
                // 对版本号进行过滤过处理
                // System.version = System.versionFilter(System.version);

            } catch (e) {
                // console.log(e.message);
            }

            return system;

        })(window);

        if (browser.name == undefined || browser.name == '') {
            browser.name = 'Unknown';
            browser.version = 'Unknown';
        }
        else if (browser.version == undefined) {
            browser.version = 'Unknown';
        }
        return browser;
    }

    function bytesToSize(bytes) {
        let n = Math.log(bytes) / Math.log(1024) | 0;
        return (bytes / Math.pow(1024, n)).toFixed(0) + ' ' + (n ? 'KMGTPEZY'[--n] + 'B' : 'Bytes');
    }

    // 下载 m3u8 文件
    async function downloadM3u8(url) {
        const res = await fetchRetry(url, {}, 3);
        const m3u8 = await res.text();
        let i = 0;

        blobs = [];
        ratio = 0;
        errors = 0;

        // 初始化进度显示
        domDownloadBtn.querySelector('svg').innerHTML = svgCircle;
        updateProgress(0);

        m3u8.split('\n').forEach(function (line) {
            if (line.match(/\.ts/)) {
                blobs[i] = undefined;
                downloadTs(url.replace(/\/[^\/]+?$/, '/' + line), i++);
            }
        });
    }

    // 下载 m3u8 文件中的单个 ts 文件
    async function downloadTs(url, order) {
        let res;
        let blob;

        try {
            res = await fetchRetry(url, {}, 5);
            blob = await res.blob();

        } catch (e) {
            if (++errors == 1) {
                resetDownloadIcon();
                alert('下载视频失败，请重新下载。');
            }
            return;
        }

        ratio++;
        blobs[order] = blob;

        errors ? resetDownloadIcon() : updateProgress(Math.round(100 * ratio / blobs.length));

        store();
    }

    // 保存视频文件
    async function store() {
        for (let [index, blob] of blobs.entries()) {
            if (blob === undefined) return;
        }

        let blob = new Blob(blobs, {type: 'video/h264'});

        blobs = null;

        if (format == 'mp4-transform') {
            domDownloadBtn.querySelector('svg').innerHTML = svgConvert;
            blob = await convertToMp4(blob);
        }

        downloading = false;
        downloadBlob(blob);
    }

    // 下载 blob 里的视频
    function downloadBlob(blob) {
        let name = (new Date()).valueOf() + '.mp4'; //  + format
        let navigator = window.navigator;
        let url;

        // ArrayBuffer -> blob
        if (blob instanceof ArrayBuffer) {
            blob = new Blob([blob]);
        }

        // 结束进度显示
        resetDownloadIcon();

        // edge
        if (navigator && navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, name);
        }
        else {
            url = URL.createObjectURL(blob);
            downloadUrl(url, name);
        }
    }

    // 下载指定url的资源
    async function downloadUrl(url, name = (new Date()).valueOf() + '.mp4') {
        let browser = getBrowerInfo();

        // Greasemonkey 需要把 url 转为 blobUrl
        if (GM_info.scriptHandler == 'Greasemonkey') {
            let res = await fetchRetry(url);
            let blob = await res.blob();
            url = URL.createObjectURL(blob);
        }

        // Chrome 可以使用 Tampermonkey 的 GM_download 函数绕过 CSP(Content Security Policy) 的限制
        if (window.GM_download) {
            GM_download({url, name});
        }
        else {
            // firefox 需要禁用 CSP, about:config -> security.csp.enable => false
            let a = document.createElement('a');
            a.href = url;
            a.download = name;
            // a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(function () {
                URL.revokeObjectURL(url);
            }, 100);
        }
    }

    // 重置下载图标
    function resetDownloadIcon() {
        domDownloadBtn.querySelector('svg').innerHTML = svgDownload;
    }

    // 更新下载进度界面
    function updateProgress(percent) {
        let r = 8;
        let degrees = (percent == 100 ? 99.9999 : percent) / 100 * 360; // 进度对应的角度值
        let rad = degrees * (Math.PI / 180); // 角度对应的弧度值
        let x = (Math.sin(rad) * r).toFixed(2); // 极坐标转换成直角坐标
        let y = -(Math.cos(rad) * r).toFixed(2);
        let lenghty = Number(degrees > 180); // 大于180°时画大角度弧，小于180°时画小角度弧，(deg > 180) ? 1 : 0
        let paths = ['M', 0, -r, 'A', r, r, 0, lenghty, 1, x, y]; // path 属性

        domDownloadBtn.querySelector('svg > path').setAttribute('d', paths.join(' '));
        domDownloadBtn.querySelector('svg > text').textContent = percent;
    }

    // load QRCode js
    async function loadQrcode() {
        if (!unsafeWindow.qrcode) {
            return new Promise((resolve, reject) => {
                let script = document.createElement('script');
                script.src = 'https://cdn.rawgit.com/kazuhikoarase/qrcode-generator/3c72b1bb/js/qrcode.js';
                script.addEventListener('load', () => {
                    resolve();
                });
                document.body.appendChild(script);
            });
        }
    }

    // load ffmpeg js
    async function loadFfmpeg() {
        if (!unsafeWindow.ffmpegJS) {
            const res = await fetchRetry('https://cdn.rawgit.com/bgrins/videoconverter.js/42def8c4/build/ffmpeg.js');
            const js = await res.text();
        }
        return unsafeWindow.ffmpegJS;
    }

    // ts blob -> mp4 blob
    async function convertToMp4(blob) {
        let hasError = false;
        // const ffmpegJsUrl = 'https://cdn.rawgit.com/bgrins/videoconverter.js/42def8c4/build/ffmpeg.js';
        // const ffmpegJsUrl = 'https://gitee.com/dntc/videoconverter.js/raw/master/build/ffmpeg.js';
        const ffmpegJsUrl = 'https://coding.net/u/dntc/p/videoconverter.js/git/raw/master/build/ffmpeg.js';
        const orgPrompt = unsafeWindow.prompt;
        const buffer = await (new Response(blob)).arrayBuffer();
        const fileData = new Uint8Array(buffer);
        const importFfmpegJs = 'importScripts("' + ffmpegJsUrl + '");';
        const workerJs = importFfmpegJs + `
            function print(text) {
                postMessage({
                    type: 'stdout',
                    data: text
                });
            }

            onmessage = function(event) {
                const message = event.data;

                if (message.type === 'command') {
                    const module = {
                        files: message.files || [],
                        arguments: message.arguments || [],
                        print: print,
                        printErr: print,
                        TOTAL_MEMORY: message.TOTAL_MEMORY || false
                    };

                    postMessage({
                        type: 'start',
                        data: module.arguments.join(' ')
                    });

                    postMessage({
                      type: 'stdout',
                      data: 'Received command: ' + module.arguments.join(' ') +
                        ((module.TOTAL_MEMORY) ? '.  Processing with ' + module.TOTAL_MEMORY + ' bits.' : '')
                    });

                    const time = Math.floor((new Date()).getTime() / 1000);
                    const result = ffmpeg_run(module);
                    const totalTime = Math.floor((new Date()).getTime() / 1000) - time;

                    postMessage({
                        type: 'stdout',
                        data: 'Finished processing (took ' + totalTime + 'm)'
                    });

                    postMessage({
                        type : 'done',
                        data : result,
                        time : totalTime
                    });
                }
            };

            postMessage({
                type: 'ready'
            });
        `;
        const workerBlob = new Blob([workerJs], {'type': 'application/javascript'});
        const worker = new Worker(URL.createObjectURL(workerBlob));
        const parseArguments = function (text) {
            text = text.replace(/\s+/g, ' ');
            let args = [];
            // Allow double quotes to not split args.
            text.split('"').forEach(function (t, i) {
                t = t.trim();
                if ((i % 2) === 1) {
                    args.push(t);
                }
                else {
                    args = args.concat(t.split(' '));
                }
            });
            return args;
        };

        let files;

        return new Promise(function (resolve, reject) {
            worker.onmessage = function (event) {
                const message = event.data;

                if (message.type == 'ready') {
                    console.log('ffmpeg 格式转换代码加载完毕');

                    // worker.postMessage({
                    //     type: 'command',
                    //     arguments: ['-help']
                    // })

                    worker.postMessage({
                        type: 'command',
                        TOTAL_MEMORY: 268435456, // 256M, must be a power of 2
                        arguments: parseArguments('-i zhihu.ts -vf showinfo -strict -2 output.mp4'),
                        files: [
                            {
                                name: 'zhihu.ts',
                                data: fileData
                            }
                        ]
                    });
                }
                else if (message.type == 'start') {
                    console.log('Worker has received command');
                }
                else if (message.type == 'stdout') {
                    console.log(message.data);
                    if (!hasError && message.data.indexOf('TOTAL_MEMORY') != -1) {
                        hasError = true;
                        alert('分配的内存不足，转换出错。');
                    }
                }
                else if (message.type == 'done') {
                    // finishConvert();
                    const files = message.data;
                    resolve(new Blob([files[0].data]));
                }
            };
        });
    }

    // 获取视频信息
    const res = await fetchRetry(playlistBaseUrl + videoId, {
        headers: {
            'referer': 'refererBaseUrl + videoId',
            'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20' // in zplayer.min.js of zhihu
        }
    }, 3);
    const videoInfo = await res.json();

    // 获取不同分辨率视频的信息
    for (let [key, video] of Object.entries(videoInfo.playlist)) {
        video.name = key;

        if (!videos.find(v => v.width == video.width)) {
            videos.push(video);
        }
    }

    // 按分辨率大小排序
    videos = videos.sort(function (v1, v2) {
        return v1.width == v2.width ? 0 : (v1.width > v2.width ? 1 : -1);
    }).reverse();

    // 生成下载按钮图标
    domDownloadBtn.querySelector('button:first-child').outerHTML = domFullScreenBtn.cloneNode(true).querySelector('button').outerHTML;
    domDownloadBtn.querySelector('svg').innerHTML = svgDownload;

    // 鼠标事件 - 选择菜单项
    domDownloadBtn.addEventListener('pointerup', event => {
        let e = event.srcElement || event.target;

        if (downloading) {
            alert('当前正在执行下载任务，请等待任务完成。');
            return;
        }

        downloadUrl(videos[0].play_url);
    });

    // 显示下载按钮
    domControlBar.appendChild(domDownloadBtn);
})();
