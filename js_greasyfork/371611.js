// ==UserScript==
// @name         dict.cn
// @namespace    https://dict.cn/
// @version      0.1
// @description  englist dictionary
// @author       dict.cn
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371611/dictcn.user.js
// @updateURL https://update.greasyfork.org/scripts/371611/dictcn.meta.js
// ==/UserScript==

(function (h, n) {
    var script_ = document.createElement('script');
    script_.type = 'text/javaScript';
    script_.src = 'https://i1.haidii.com/v/1493890502/i1/js/jquery-1.8.0.min.js';
    document.getElementsByTagName('head')[0].appendChild(script_);

    var t = "3.1";
    if (h.dictHc) {
        return
    }
    var U = h.dictHc = {};
    var c = "" + h.location.host;
    var am = h.document,
        aa = am.documentElement;
    var ap = [],
        e = false;
    var au = {},
        m = document.createElement("div"),
        G;
    m.style.display = "none";
    m.innerHTML = "<a href='/a' style='color:red;float:left;opacity:.55;'>a</a>";
    G = m.getElementsByTagName("a")[0];
    au = {
        style: /red/.test(G.getAttribute("style")),
        hrefNormalized: G.getAttribute("href") === "/a"
    };
    var ao = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
    var M = /^(?:href|src|style)$/;
    var al = function (a) {
        return new al.fn.init(a)
    };
    al.fn = al.prototype = {
        init: function (a) {
            var aD = this;
            aD.dom = (typeof a === "string") ? am.getElementById(a) : w(a);
            return aD
        }, attr: function (a, aE) {
            var aI = this;
            if (typeof a === "object") {
                for (var aH in a) {
                    aI.attr(aH, a[aH])
                }
                return aI
            }
            a = ao[a] || a;
            var aG = aI.dom,
                aF = aE !== n,
                aD = M.test(a);
            if ((a in aG || aG[a] !== n) && !aD) {
                if (aF) {
                    aG[a] = aE
                } else {
                    return aG[a]
                }
            } else {
                if (!au.style && a === "style") {
                    if (aF) {
                        aG.style.cssText = "" + aE
                    } else {
                        return aG.style.cssText
                    }
                } else {
                    if (aF) {
                        aG.setAttribute(a, "" + aE)
                    } else {
                        return !au.hrefNormalized && aD ? aG.getAttribute(a, 2) : aG.getAttribute(a)
                    }
                }
            }
            return aI
        }, css: function (a, aE) {
            var aG = this;
            if (typeof a === "object") {
                for (var aF in a) {
                    aG.css(aF, a[aF])
                }
                return aG
            }
            var aD = aG.dom.style;
            a = H(a);
            if (aE !== n) {
                aD[a] = aE
            } else {
                return aD[a]
            }
            return aG
        }, show: function () {
            return this.css({
                display: "block"
            })
        }, hide: function () {
            return this.css({
                display: "none"
            })
        }, html: function (aD) {
            var aE = this,
                a = aE.dom;
            if (aD !== n) {
                a.innerHTML = "";
                a.innerHTML = aD
            } else {
                return a.innerHTML
            }
            return aE
        }, text: function (aD) {
            var aE = this,
                a = aE.dom;
            if (aD !== n) {
                aE.html("").append(am.createTextNode(aD))
            } else {
                return al.text([a])
            }
            return aE
        }, offset: function () {
            var aD = this.dom.getBoundingClientRect();
            var a = am.body,
                aH, aG, aE, aF;
            aH = aa.clientTop || a.clientTop || 0;
            aG = aa.clientLeft || a.clientLeft || 0;
            aE = h.pageYOffset || aa.scrollTop || a.scrollTop;
            aF = h.pageXOffset || aa.scrollLeft || a.scrollLeft;
            return {
                left: aD.left + aF - aG,
                top: aD.top + aE - aH
            }
        }, bind: function (a, aD) {
            var aG = this,
                aE = aG.dom,
                aF = {};
            if (typeof a === "object") {
                aF = a
            } else {
                aF[a] = aD
            }
            for (a in aF) {
                al.bindEvent(aE, a, aF[a])
            }
            return aG
        }, append: function (a) {
            var aD = this;
            aD.dom.appendChild(w(a));
            return aD
        }, appendTo: function (a) {
            var aD = this;
            al(a).append(aD.dom);
            return aD
        }, contains: function (a) {
            return al.contains(this.dom, a)
        }, selfContains: function (aD) {
            if (aC(av)) {
                for (var a in av) {
                    if (av[a] == aD || al.contains(av[a], aD)) {
                        return false
                    }
                }
            } else {
                if (av) {
                    if (av == aD || al.contains(av, aD)) {
                        return false
                    }
                }
            }
            return this.dom === aD || al.contains(this.dom, aD)
        }
    };
    al.fn.init.prototype = al.fn;
    al.text = function (a) {
        var aD = "",
            aF;
        for (var aE = 0; a[aE]; aE++) {
            aF = a[aE];
            if (aF.nodeType === 3 || aF.nodeType === 4) {
                aD += aF.nodeValue
            } else {
                if (aF.nodeType !== 8) {
                    aD += al.text(aF.childNodes)
                }
            }
        }
        return aD
    };
    al.contains = function (a, aD) {
        return a.contains ? a != aD && a.contains(aD) : !!(a.compareDocumentPosition(aD) & 16)
    };
    al.bindEvent = function (aF, aD, aE) {
        var a = aD + aE;
        aF["e" + a] = aE;
        aF[a] = function (aH) {
            aH = d(aH || window.event);
            if (/mouse(over|out)/i.test(aH.type) && ((aH.target !== aF && !al.contains(aF, aH.target)) || al.contains(aF, aH.relatedTarget))) {
                return
            }
            var aG = aF["e" + a](aH);
            if (aG === false) {
                if (aH.preventDefault) {
                    aH.preventDefault();
                    aH.stopPropagation()
                } else {
                    aH.returnValue = false
                }
                aH.cancelBubble = true
            }
        };
        if (aF.addEventListener) {
            aF.addEventListener(aD, aF[a], false)
        } else {
            aF.attachEvent("on" + aD, aF[a])
        }
    };
    al.unbindEvent = function (aF, aD, aE) {
        var a = aD + aE;
        if (aF.removeEventListener) {
            aF.removeEventListener(aD, aF[a], false)
        } else {
            aF.detachEvent("on" + aD, aF[a])
        }
        aF["e" + a] = aF[a] = null
    };
    al.bindReady = function (a) {
        if (am.readyState === "complete") {
            return setTimeout(a, 1)
        }
        ap[ap.length] = a
    };

    function an() {
        if (am.attachEvent && am.readyState !== "complete") {
            return
        }
        al.unbindEvent(am, am.addEventListener ? "DOMContentLoaded" : "readystatechange", an);
        Y()
    }

    function Y() {
        if (e) {
            return
        }
        for (var a in ap) {
            ap[a]()
        }
        e = true
    }
    al.bindEvent(am, am.addEventListener ? "DOMContentLoaded" : "readystatechange", an);
    al.bindEvent(h, "load", Y);
    al.cookie = function (aE, aF, aD) {
        if (typeof aF != "undefined") {
            aD = aD || {};
            var a = aD.expires;
            if (aF === null) {
                aF = "";
                a = -1
            }
            if (typeof a === "number") {
                var aG = a;
                a = new Date();
                a.setDate(a.getDate() + aG)
            }
            return (am.cookie = [encodeURIComponent(aE), "=" + encodeURIComponent(aF), a ? "; expires=" + a.toUTCString() : "", aD.path ? "; path=" + aD.path : "", aD.domain ? "; domain=" + aD.domain : "", aD.secure ? "; secure" : ""].join(""))
        } else {
            if (match = am.cookie.match(new RegExp("(^|;| )" + aE + "s*=([^;]*)(;|$)", "i"))) {
                return unescape(match[2])
            } else {
                return null
            }
        }
    };

    function w(a) {
        return a.dom ? a.dom : a
    }

    function H(a) {
        return a.replace(/-([a-z])/g, function (aD, aE) {
            return aE.toUpperCase()
        })
    }

    function d(aE) {
        if (!aE.target) {
            aE.target = aE.srcElement || am
        }
        if (!aE.relatedTarget && aE.fromElement) {
            aE.relatedTarget = aE.fromElement === aE.target ? aE.toElement : aE.fromElement
        }
        if (aE.pageX == null && aE.clientX != null) {
            var aD = am.documentElement,
                a = am.body;
            aE.pageX = aE.clientX + (aD && aD.scrollLeft || a && a.scrollLeft || 0) - (aD && aD.clientLeft || a && a.clientLeft || 0);
            aE.pageY = aE.clientY + (aD && aD.scrollTop || a && a.scrollTop || 0) - (aD && aD.clientTop || a && a.clientTop || 0)
        }
        if (aE.which == null) {
            aE.which = aE.charCode != null ? aE.charCode : (aE.keyCode != null ? aE.keyCode : null)
        }
        if (!aE.which && aE.button !== n) {
            aE.which = (aE.button & 1 ? 1 : (aE.button & 2 ? 3 : (aE.button & 4 ? 2 : 0)))
        }
        return aE
    }

    function ah(a) {
        return a.replace(/[^\x00-\xff]/g, "**").length
    }

    function aw() {
        return false
    }

    function aC(a) {
        if (!a) {
            return false
        }
        if (typeof jQuery != "undefined") {
            return jQuery.isArray(a)
        }
        return Object.prototype.toString.call(a) === "[object Array]"
    }
    var x = am.documentElement;
    var S = ((typeof i1_home == "undefined" || i1_home == "") ? "https://i1.haidii.com" : i1_home) + "/i1/js/hc3/";
    var ag = "default",
        av = "";
    var o = al(am),
        P = al(h);
    U.init = function (a) {
        if (a) {
            if (a.area) {
                x = a.area
            }
            if (a.skin) {
                ag = a.skin
            }
            if (a.not) {
                av = a.not
            }
        }
    };
    U.reset = function () {
        x = al(x)
    };
    U.not = function (a) {
        av = a
    };
    var L = function (aD, a) {
        if (typeof aD === "string") {
            I = aD
        } else {
            var aE = al(aD);
            I = v(aE.text());
            a = aE.offset()
        } if (I) {
            az = {
                pageX: a.left,
                pageY: a.top + 10
            };
            g();
            l();
            s()
        }
    };
    var ay = true;
    var ak = true;
    var aq = false;
    var ar = false;
    var C, X, ac, Z, i, aj, f;
    var K, V, aA, j, u, F;
    var W = false;
    var B = false,
        ae;
    var I = "",
        az, O;
    var q;
    al.bindReady(function () {
        x = al(x);
        al(am.createElement("link")).attr({
            href: S + "skins/" + ag + "/hc.css?v" + t,
            rel: "stylesheet",
            type: "text/css"
        }).appendTo(am.getElementsByTagName("head")[0]);
        C = al(am.createElement("div")).attr({
            id: "dictHcBtn",
            title: unescape("%u67E5%u8BE2%u5F53%u524D%u9009%u62E9%u8BCD")
        }).css("display", "none").html(unescape("%u67E5%u8BCD%u5178")).appendTo(am.body);
        X = al(am.createElement("div")).attr("id", "dictHcBtnTop").css("display", "none").appendTo(am.body);
        ac = al(am.createElement("div"));
        ac.attr("id", "dictHc").css("display", "none").html('<div id="dictHcTop" onselectstart="return false"><div><span title="' + unescape("%u9501%u5B9A%u4F4D%u7F6E") + '" id="dictHcLock" class="dictHcBtn1"></span>&nbsp;<span title="' + unescape("%u5173%u95ED") + ' (Esc)" id="dictHcClose" class="dictHcBtn1"></span></div><span id="dictHcTitle">' + unescape("%u6D77%u8BCD%u8BCD%u5178%20-%20%u5B66%u5355%u8BCD%uFF0C%u7528%u6D77%u8BCD") + '</span></div><div id="dictHcDragMask"></div><div id="dictHcLoading"><h1></h1><div id="tipwrod">' + unescape("%u6B63%u5728%u52A0%u8F7D%u4E2D...") + '</div></div><iframe id="dictHcContent" width="100%" height="100%" frameborder="0"></iframe><div id="dictHcAd"><div slot="28"></div></div><div id="dictHcBottom"><div><span id="dictHcEnable" class="dictHcBtn2" title="' + unescape("%u5F00%u542F%u6216%u5173%u95ED%u5212%u8BCD") + '">' + unescape("%u5DF2%u5F00%u542F%u5212%u8BCD") + '</span></div><span id="dictHcSetting" class="dictHcBtn2">' + unescape("%u8BBE%u7F6E") + "</span></div>").appendTo(am.body);
        Z = al("dictHcDragMask");
        i = al("dictHcContent");
        K = al("dictHcLock");
        V = al("dictHcClose");
        aA = al("dictHcEnable");
        j = al("dictHcSetting");
        f = al(am.createElement("div"));
        f.attr("id", "dictHcSettingArea").css("display", "none").css("height", "42px").html('<label for="dictHcPie" style="display:none;"><input id="dictHcPie" type="checkbox" value="1" />' + unescape("%u663E%u793A%u91CA%u4E49%u5206%u5E03%u56FE") + '</label><label for="dictHcSound"><input id="dictHcSound" type="checkbox" value="1" />' + unescape("%u60AC%u505C%u53D1%u97F3") + '</label><label for="dictHcDirect"><input id="dictHcDirect" type="checkbox" value="1" />' + unescape("%u5373%u5212%u5373%u67E5") + '</label><div id="dictHcCntLine" />').appendTo(am.body);
        u = al("dictHcSound");
        F = al("dictHcDirect");
        aj = al(am.createElement("div"));
        aj.attr({
            id: "dictHcClosetip",
            href: ""
        }).appendTo(am.body);
        o.bind({
            mouseup: z,
            keydown: R
        });
        C.bind("mouseup", ai);
        K.bind("mouseup", A);
        V.bind("mouseup", E);
        j.bind({
            click: function () {
                q = setTimeout(ab, 0)
            }, mouseout: ax
        });
        f.bind({
            mouseout: ax,
            mouseover: ab
        });
        aA.bind("click", y);
        u.bind("change", function () {
            ak = al(this).attr("checked") ? true : false;
            if (h._dict_config && h.saveConfig) {
                if (ak) {
                    h._dict_config.ss = (_dict_config.ss >> 1) << 1
                } else {
                    h._dict_config.ss |= 1
                }
                h.saveConfig()
            }
            at("dictHcSound", ak);
            s()
        });
        F.bind("change", function () {
            aq = F.attr("checked") ? true : false;
            at("dictHcDirect", aq)
        });
        al("dictHcTop").bind("mousedown", J);
        o.bind({
            mousemove: Q,
            mouseup: k
        });
        var aD = aB("dictHcEnable"),
            aE = aB("dictHcSound"),
            a = aB("dictHcDirect");
        if (aD && ay != (aD === "true")) {
            y()
        }
        if (aE) {
            ak = aE === "true" ? true : false
        }
        if (a) {
            aq = a === "true" ? true : false
        }
        if (!ay) {
            aj.append(aA).show()
        }
        U.query = L;
        N("dictHcAd", jQuery)
    });

    function z(aG) {
        if (aG.which != 1 || B) {
            return
        }
        var aF = aG.target;
        if (ac.selfContains(aF) || f.selfContains(aF)) {
            return
        }
        g();
        ad();
        if (x.selfContains && !x.selfContains(aF)) {
            return
        }
        var aD;
        if (aD = am.selection) {
            var a = aD.createRange(),
                aE = a.parentElement();
            if (!x.selfContains(aE)) {
                return
            }
            az = {
                pageX: aa.scrollLeft + a.boundingLeft,
                pageY: aa.scrollTop + a.boundingTop + a.boundingHeight - 8
            }
        } else {
            az = aG
        }
        I = v(T(aG));
        if (I && ay) {
            O = aF;
            if (aq || ar) {
                l();
                s()
            } else {
                D()
            }
        }
    }

    function p(aE, aD) {
        var aF = v(jQuery(aE).text()),
            a = aF.indexOf(aD) > -1 ? true : false;
        return a
    }

    function T(aD) {
        var aE = "",
            a = aD.target;
        if (a.tagName == "TEXTAREA" || (a.tagName == "INPUT" && a.getAttribute("type") == "text")) {
            if (am.selection) {
                aE = am.selection.createRange().text
            } else {
                if (h.getSelection) {
                    if (a.selectionStart != n) {
                        aE = a.value.substring(a.selectionStart, a.selectionEnd)
                    }
                }
            }
        } else {
            if (a.tagName != "INPUT") {
                if (h.getSelection) {
                    aE = h.getSelection().toString()
                } else {
                    if (am.getSelection) {
                        aE = am.getSelection()
                    } else {
                        if (am.selection) {
                            aE = am.selection.createRange().text
                        }
                    }
                }
            }
        } if (ah(aE) > 20) {
            aE = ""
        }
        return aE
    }

    function R(a) {
        if (a.which == 27) {
            E()
        }
    }

    function D() {
        C.css({
            left: az.pageX + "px",
            top: (az.pageY + 17) + "px"
        }).show();
        X.css({
            left: az.pageX + 8 + "px",
            top: (az.pageY + 8) + "px"
        }).show()
    }

    function g() {
        C.hide();
        X.hide()
    }

    function ai(a) {
        g();
        l();
        s(I);
        return false
    }

    function l() {
        if (!ar) {
            var aD = az.pageX,
                aE = az.pageY + 10,
                a = am.body;
            if ((aD + 332) > ((h.pageXOffset || aa.scrollLeft || a.scrollLeft) + (aa.clientWidth || a.clientWidth))) {
                aD -= 332;
                aE += 8
            }
            ac.css({
                left: aD + "px",
                top: aE + "px"
            }).show()
        }
        W = true;
        if (ay && aj.css("display") == "block") {
            aA.appendTo(al("dictHcBottom").dom.firstChild);
            aj.hide()
        }
    }

    function ad() {
        if (ar) {
            return
        }
        if (W) {
            ac.hide();
            W = false;
            if (!ay) {
                aj.append(aA).show()
            }
        }
    }

    function E(a) {
        if (a && a.which != 1) {
            return
        }
        ar = false;
        K.css("background-position", "0 -44px");
        g();
        ad();
        ax();
        return false
    }

    function A(a) {
        if (a.which != 1) {
            return
        }
        ar = !ar;
        K.css("background-position", "0 -" + (ar ? 66 : 44) + "px");
        K.attr("title", ar ? unescape("%u5DF2%u9501%u5B9A%u4F4D%u7F6E") : unescape("%u9501%u5B9A%u4F4D%u7F6E"));
        return false
    }

    function ab() {
        j.attr("style", "border:1px solid #A1D9ED;");
        u.attr("checked", ak);
        F.attr("checked", aq);
        var a = j.offset();
        f.css({
            left: a.left + "px",
            top: (a.top - 48) + "px"
        }).show();
        al("dictHcCntLine").show()
    }

    function ax(aD) {
        clearTimeout(q);
        var a = al("dictHcCntLine");
        if (aD && (aD.relatedTarget == a.dom || aD.relatedTarget == f.dom || aD.relatedTarget == j.dom)) {
            return
        }
        f.hide();
        j.attr("style", null)
    }

    function y() {
        ay = !ay;
        at("dictHcEnable", ay);
        aA.css("background-position", "3px -" + (ay ? 105 : 127) + "px").html(ay ? unescape("%u5DF2%u5F00%u542F%u5212%u8BCD") : unescape("%u5DF2%u5173%u95ED%u5212%u8BCD"));
        return false
    }

    function J(a) {
        if (a.target.className === "dictHcBtn1") {
            return
        }
        B = true;
        var aD = ac.offset();
        ae = {
            x: a.pageX - aD.left,
            y: a.pageY - aD.top
        };
        Z.show();
        ac.attr("class", "dictHcDrag");
        return false
    }

    function Q(aE) {
        if (B) {
            var aD = aE.pageX - ae.x,
                a = aE.pageY - ae.y;
            if (aD < 0) {
                aD = 0
            }
            if (a < 0) {
                a = 0
            }
            ac.css({
                left: aD + "px",
                top: a + "px"
            })
        }
    }

    function k(a) {
        if (B) {
            B = false;
            ac.attr("class", null);
            Z.hide()
        }
    }

    function v(a) {
        return a.replace(/^\s+|\s+$/g, "").replace(/\s*\r?\n\s*/g, " ")
    }

    function s() {
        i.attr("src", "https://apii.dict.cn/apis/dict3.php?skin=default&q=" + encodeURIComponent(I) + "#" + (ak ? 1 : 0))
    }

    function b(a) {
        if (!a) {
            a = ""
        }
        return '<style type="text/css">html{overflow-y:scroll}body{margin:0;padding:0;padding:10px;padding-left:16px;padding-top:5px;font:12px/18px Verdana,Geneva,Arial,Helvetica,sans-serif}.words h1{padding:0;margin:0;color:#009944;display:inline-block;font-size:20px;margin-right:14px;word-break:normal;word-wrap:break-word;line-height:24px;padding-top:10px}.loading{padding-top:10px;color:#444;font-size:12px;line-height:20px}</style><div class="words"><h1>' + a + '</h1></div><div class="loading">' + unescape("%u6B63%u5728%u52A0%u8F7D%u4E2D...") + "</div>"
    }

    function aB(a) {
        return al.cookie(a)
    }

    function at(a, aD) {
        al.cookie(a, aD, {
            expires: 3650,
            domain: am.domain
        })
    }

    function af(a) {
        var aD = al("#" + a);
        var aE = document.frames ? document.frames[a].document : aD.contentDocument;
        if (aD != null && aE != null) {
            aD.height = aE.body.scrollHeight
        }
    }

    function r(aE, a) {
        var aD = aE.contentWindow.document;
        aD.open();
        aD.write(a);
        aD.close()
    }

    function N(a, aH) {
        return;
        var aF = aH,
            aG = aF("#" + a),
            aE = aF("[slot]", aG);
        if (aE.length) {
            var aD = "https://list.dict.cn/list/slots.php?callback=?&id=";
            aE.each(function (aI, aJ) {
                if (aI != 0) {
                    aD += "-"
                }
                aD += aF(aJ).attr("slot")
            });
            aF.getJSON(aD, function (aJ) {
                if (aJ) {
                    var aI = {};
                    aF.each(aJ, function (aK, aL) {
                        if (!aL.slot) {
                            aL.slot = 0
                        }
                        if (!aL.type) {
                            aL.type = ""
                        }
                        if (!aL.title) {
                            aL.title = ""
                        }
                        if (!aL.text) {
                            aL.text = ""
                        }
                        if (!aL.src) {
                            aL.src = ""
                        }
                        if (!aL.width) {
                            aL.width = "auto"
                        }
                        if (!aL.height) {
                            aL.height = "auto"
                        }
                        if (!aL.href) {
                            aL.href = "javascript:;"
                        }
                        if (!aL.html) {
                            aL.html = ""
                        }
                        switch (aL.type) {
                        case "text":
                            aL.dom = aF('<a title="' + aL.text + '" target="_blank" href="' + aL.href + '">' + aL.text + "</a>");
                            break;
                        case "image":
                            aL.dom = aF('<a target="_blank" href="' + aL.href + '"><img alt="' + aL.title + '" src="' + aL.src + '"></a>');
                            break;
                        case "slide":
                            if (aL.slot) {
                                ! function (aM) {
                                    aL.dom = aM.find("li").length ? aM.find("ul").append('<li><a target="_blank" href="' + aL.href + '"><img alt="' + aL.title + '" src="' + aL.src + '"></a></li>') : aF('<ul><li><a target="_blank" href="' + aL.href + '"><img alt="' + aL.title + '" src="' + aL.src + '"></a></li></ul>');
                                    if (!aI.style) {
                                        aI.style = aF('<style type="text/css">.slot_slide{position:relative;}.slot_slide ul{position:absolute;left:0;top:0;width:312272592px;overflow:hidden;*zoom:1;}.slot_slide li{float:left;width:' + aL.width + ";height:" + aL.height + ";}</style>");
                                        aM.before(aI.style)
                                    }
                                    aI.max = aM.find("li").length - 1;
                                    aI.move = aM.find("ul");
                                    if (!aI.interval) {
                                        aI.index = 0;
                                        aI.distance = aL.width.match(/^\d+/);
                                        aI.interval = setInterval(function () {
                                            aI.index = aI.index < aI.max ? (aI.index + 1) : 0;
                                            aI.move.animate({
                                                left: -(aI.distance * aI.index)
                                            })
                                        }, 5000)
                                    }
                                }(aF("[slot=" + aL.slot + "]"))
                            }
                            break;
                        case "flash":
                            aL.dom = aF('<object type="application/x-shockwave-flash" data="' + aL.src + '" title="' + aL.title + '" style="width:' + aL.width + ";height:" + aL.height + ';position:absolute;"><param name="movie" value="' + aL.src + '" /><param name="AllowScriptAccess" value="always" /><param name="hasPriority" value="true" /><param name="wmode" value="transparent" /><param name="FlashVars" value="volume=100" /></object>');
                            break;
                        case "html":
                            aL.dom = aF(aL.text);
                            break;
                        default:
                            break
                        }
                        if (aL.slot) {
                            aG.show();
                            aL.slot = aF("[slot=" + aL.slot + "]").addClass("slot").addClass("slot_" + aL.type).css({
                                width: aL.width,
                                height: aL.height
                            }).empty().append(aL.dom)
                        }
                    })
                }
            })
        }
    }
})(window);