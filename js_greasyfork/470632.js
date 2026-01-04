// ==UserScript==
// @name         载入dom到html
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  提供一个function,loadJsCode!
// @license      MIT
// @match        *://*/*
// @author       https://github.com/ronn97
// @match        https://www.tampermonkey.net/index.php?locale=zh_CN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470632/%E8%BD%BD%E5%85%A5dom%E5%88%B0html.user.js
// @updateURL https://update.greasyfork.org/scripts/470632/%E8%BD%BD%E5%85%A5dom%E5%88%B0html.meta.js
// ==/UserScript==

/*

	国际化，网页自动翻译。
	作者：管雷鸣
	开原仓库：https://github.com/xnx3/translate

 */
var translate = {
    version: "2.3.2.20230620",
    useVersion: "v1",
    setUseVersion2: function() {
        translate.useVersion = "v2"
    },
    translate: null,
    includedLanguages: "zh-CN,zh-TW,en",
    resourcesUrl: "//res.zvo.cn/translate",
    selectLanguageTag: {
        show: !0,
        languages: "",
        alreadyRender: !1,
        selectOnChange: function(e) {
            var t = e.target.value;
            translate.changeLanguage(t)
        },
        render: function() {
            if (!translate.selectLanguageTag.alreadyRender && (translate.selectLanguageTag.alreadyRender = !0,
            translate.selectLanguageTag.show)) {
                if (null == document.getElementById("translate")) {
                    var e = document.getElementsByTagName("body")[0]
                      , t = document.createElement("div");
                    t.id = "translate",
                    e.appendChild(t)
                } else if (null != document.getElementById("translateSelectLanguage"))
                    return;
                translate.request.post(translate.request.api.host + translate.request.api.language + "?v=" + translate.version, {}, function(e) {
                    if (0 != e.result) {
                        var t = function(e) {
                            translate.selectLanguageTag.selectOnChange(e)
                        }
                          , a = document.createElement("select");
                        a.id = "translateSelectLanguage",
                        a.className = "translateSelectLanguage";
                        for (var n = 0; n < e.list.length; n++) {
                            var l = document.createElement("option");
                            if (l.setAttribute("value", e.list[n].id),
                            translate.selectLanguageTag.languages.length > 0) {
                                var r = ("," + translate.selectLanguageTag.languages + ",").toLowerCase();
                                if (console.log(r),
                                r.indexOf("," + e.list[n].id.toLowerCase() + ",") < 0)
                                    continue
                            }
                            null != translate.to && void 0 !== translate.to && translate.to.length > 0 ? translate.to == e.list[n].id && l.setAttribute("selected", "selected") : e.list[n].id == translate.language.getLocal() && l.setAttribute("selected", "selected"),
                            l.appendChild(document.createTextNode(e.list[n].name)),
                            a.appendChild(l)
                        }
                        window.addEventListener ? a.addEventListener("change", t, !1) : a.attachEvent("onchange", t),
                        document.getElementById("translate").appendChild(a)
                    } else
                        console.log("load language list error : " + e.info)
                })
            }
        }
    },
    localLanguage: "zh-CN",
    googleTranslateElementInit: function() {
        var e = "";
        null != document.getElementById("translate") && (e = "translate"),
        translate.translate = new google.translate.TranslateElement({
            pageLanguage: "zh-CN",
            includedLanguages: translate.selectLanguageTag.languages,
            layout: 0
        },e)
    },
    init: function() {
        var e = window.location.protocol;
        "file:" == window.location.protocol && (e = "http:"),
        -1 == this.resourcesUrl.indexOf("://") && (this.resourcesUrl = e + this.resourcesUrl)
    },
    execute_v1: function() {
        if (null == document.getElementById("translate") && translate.selectLanguageTag.show) {
            var e = document.getElementsByTagName("body")[0]
              , t = document.createElement("div");
            t.id = "translate",
            e.appendChild(t)
        }
        "" == translate.includedLanguages && (translate.selectLanguageTag.languages = translate.includedLanguages),
        console.log("translate.js tip: translate.includedLanguages obsolete, please use the translate.selectLanguageTag.languages are set");
        var a = document.getElementsByTagName("head")[0]
          , n = document.createElement("script");
        n.type = "text/javascript",
        n.src = this.resourcesUrl + "/js/element.js",
        a.appendChild(n)
    },
    setCookie: function(e, t) {
        var a = e + "=" + escape(t);
        document.cookie = a
    },
    getCookie: function(e) {
        for (var t = document.cookie.split("; "), a = 0; a < t.length; a++) {
            var n = t[a].split("=");
            if (n[0] == e)
                return unescape(n[1])
        }
        return ""
    },
    currentLanguage: function() {
        translate.check();
        var e = translate.getCookie("googtrans");
        return e.length > 0 ? e.substr(e.lastIndexOf("/") + 1, e.length - 1) : translate.localLanguage
    },
    changeLanguage: function(e) {
        if (",en,de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr,".indexOf("," + e + ",") > -1) {
            translate.check();
            var t = "/" + translate.localLanguage + "/" + e
              , a = document.location.host.split(".");
            if (a.length > 2) {
                var n = a[a.length - 2] + "." + a[a.length - 1];
                document.cookie = "googtrans=;expires=" + new Date(1) + ";domain=" + n + ";path=/",
                document.cookie = "googtrans=" + t + ";domain=" + n + ";path=/"
            }
            return translate.setCookie("googtrans", "" + t),
            void location.reload()
        }
        if (translate.setUseVersion2(),
        null != translate.to && translate.to.length > 0 && translate.to != translate.language.getLocal())
            var l = !0;
        translate.to = e,
        translate.storage.set("to", e),
        l ? location.reload() : translate.execute()
    },
    check: function() {
        "file:" == window.location.protocol && console.log("\r\n---WARNING----\r\ntranslate.js 主动翻译组件自检异常，当前协议是file协议，翻译组件要在正常的线上http、https协议下才能正常使用翻译功能\r\n------------")
    },
    to: "",
    autoDiscriminateLocalLanguage: !1,
    documents: [],
    ignore: {
        tag: ["style", "script", "link", "i", "pre", "code"],
        class: ["ignore", "translateSelectLanguage"],
        id: [],
        isIgnore: function(e) {
            if (null == e || void 0 === e)
                return !1;
            for (var t = e, a = 100; a-- > 0; ) {
                if (null == t || void 0 === t)
                    return !1;
                var n = translate.element.getNodeName(t).toLowerCase();
                if (n.length > 0) {
                    if ("body" == n || "html" == n || "#document" == n)
                        return !1;
                    if (translate.ignore.tag.indexOf(n) > -1)
                        return !0
                }
                if (null != t.className) {
                    var l = t.className;
                    if (null == l || "string" != typeof l)
                        continue;
                    l = l.trim().split(" ");
                    for (var r = 0; r < l.length; r++)
                        if (null != l[r] && l[r].trim().length > 0 && translate.ignore.class.indexOf(l[r]) > -1)
                            return !0
                }
                if (null != t.id && void 0 !== t.id && translate.ignore.id.indexOf(t.id) > -1)
                    return !0;
                t = t.parentNode
            }
            return !1
        }
    },
    nomenclature: {
        data: new Array,
        old_Data: [],
        set: function(e) {
            alert("请将 translate.nomenclature.set 更换为 append，具体使用可参考： https://github.com/xnx3/translate ")
        },
        append: function(e, t, a) {
            void 0 === translate.nomenclature.data[e] && (translate.nomenclature.data[e] = new Array),
            void 0 === translate.nomenclature.data[e][t] && (translate.nomenclature.data[e][t] = new Array);
            for (var n = a.split("\n"), l = 0; l < n.length; l++) {
                var r = n[l].trim();
                if (!(r.length < 1)) {
                    var s = r.split("=");
                    if (2 == s.length) {
                        var o = s[0].trim()
                          , u = s[1].trim();
                        0 != o.length && 0 != u.length && (translate.nomenclature.data[e][t][o] = u)
                    }
                }
            }
        },
        get: function() {
            return translate.nomenclature.data
        },
        dispose: function(e) {
            if (null == e || 0 == e.length)
                return e;
            if (void 0 === translate.nomenclature.data[translate.language.getLocal()] || void 0 === translate.nomenclature.data[translate.language.getLocal()][translate.to])
                return e;
            for (var t in translate.nomenclature.data[translate.language.getLocal()][translate.to]) {
                var a = translate.nomenclature.data[translate.language.getLocal()][translate.to][t];
                if ("function" != typeof a) {
                    var n = e.indexOf(t);
                    if (n > -1)
                        if ("english" == translate.language.getLocal()) {
                            var l = "";
                            if (0 == n)
                                ;
                            else if (l = e.substr(n - 1, 1),
                            "english" == translate.language.getCharLanguage(l))
                                continue;
                            var r = "";
                            if (n + t.length == e.length)
                                ;
                            else if (r = e.substr(n + t.length, 1),
                            "english" == translate.language.getCharLanguage(r))
                                continue;
                            e = e.replace(new RegExp(l + t + r,"g"), l + a + r)
                        } else
                            e = e.replace(new RegExp(t,"g"), a)
                }
            }
            return e
        }
    },
    setAutoDiscriminateLocalLanguage: function() {
        translate.autoDiscriminateLocalLanguage = !0
    },
    nodeQueue: {},
    setDocuments: function(e) {
        null != e && void 0 !== e && (void 0 === e.length ? translate.documents[0] = e : translate.documents = e,
        translate.nodeQueue = {},
        console.log("set documents , clear translate.nodeQueue"))
    },
    getDocuments: function() {
        return null != translate.documents && void 0 !== translate.documents && translate.documents.length > 0 ? translate.documents : document.all
    },
    listener: {
        isExecuteFinish: !1,
        isStart: !1,
        start: function() {
            translate.temp_linstenerStartInterval = setInterval(function() {
                "complete" == document.readyState && (clearInterval(translate.temp_linstenerStartInterval),
                translate.listener.addListener())
            }, 50)
        },
        addListener: function() {
            translate.listener.isStart = !0;
            const e = {
                attributes: !0,
                childList: !0,
                subtree: !0
            }
              , t = new MutationObserver(function(e, t) {
                var a = [];
                for (let t of e)
                    "childList" === t.type && t.addedNodes.length > 0 && a.push.apply(a, t.addedNodes);
                a.length > 0 && translate.execute(a)
            }
            );
            for (var a = translate.getDocuments(), n = 0; n < a.length; n++) {
                var l = a[n];
                null != l && t.observe(l, e)
            }
        },
        renderTaskFinish: function(e) {}
    },
    renderTask: class {
        constructor() {
            this.taskQueue = [],
            this.nodes = []
        }
        add(e, t, a, n) {
            var l = translate.element.nodeAnalyse.get(e, n)
              , r = translate.util.hash(l.text);
            void 0 === this.nodes[r] && (this.nodes[r] = new Array),
            this.nodes[r].push(e);
            var s = this.taskQueue[r];
            null != s && void 0 !== s || (s = new Array);
            var o = new Array;
            o.originalText = t,
            o.resultText = a,
            o.attribute = n,
            s.push(o),
            this.taskQueue[r] = s
        }
        execute() {
            for (var e in this.taskQueue) {
                "function" != typeof (t = this.taskQueue[e]) && (t.sort((e,t)=>t.originalText.length - e.originalText.length),
                this.taskQueue[e] = t)
            }
            for (var e in this.nodes)
                for (var t = this.taskQueue[e], a = 0; a < this.nodes[e].length; a++)
                    for (var n = 0; n < t.length; n++) {
                        var l = t[n];
                        "function" != typeof t && translate.element.nodeAnalyse.set(this.nodes[e][n], l.originalText, l.resultText, l.attribute)
                    }
            void 0 !== this.taskQueue && this.taskQueue.length > 0 && translate.listener.renderTaskFinish(this)
        }
    }
    ,
    execute: function(e) {
        if ("undefined" != typeof doc && (translate.useVersion = "v2"),
        "v1" != translate.useVersion) {
            var t = translate.util.uuid();
            if (translate.nodeQueue[t] = new Array,
            translate.nodeQueue[t].expireTime = Date.now() + 12e4,
            translate.nodeQueue[t].list = new Array,
            null == translate.to || "" == translate.to) {
                var a = translate.storage.get("to");
                null != a && void 0 !== a && a.length > 0 && (translate.to = a)
            }
            try {
                translate.selectLanguageTag.render()
            } catch (e) {
                console.log(e)
            }
            if (null != translate.to && void 0 !== translate.to && 0 != translate.to.length) {
                if (translate.to != translate.language.getLocal()) {
                    var n;
                    if (void 0 !== e) {
                        if (null == e)
                            return void console.log("translate.execute(...) 中传入的要翻译的目标区域不存在。");
                        void 0 === e.length ? (n = new Array)[0] = e : n = e
                    } else
                        n = translate.getDocuments();
                    for (var l = 0; l < n.length & l < 20; l++) {
                        var r = n[l];
                        translate.element.whileNodes(t, r)
                    }
                    var s = {}
                      , o = {};
                    for (var u in translate.nodeQueue[t].list) {
                        if (null == u || void 0 === u || 0 == u.length || "undefined" == u)
                            continue;
                        s[u] = [],
                        o[u] = [];
                        let e = new translate.renderTask;
                        for (var i in translate.nodeQueue[t].list[u])
                            if ("function" != typeof translate.nodeQueue[t].list[u][i]) {
                                var g = translate.nodeQueue[t].list[u][i].original
                                  , d = translate.nodeQueue[t].list[u][i].translateText
                                  , c = g == d ? i : translate.util.hash(d);
                                translate.nodeQueue[t].list[u][i].cacheHash = c;
                                var h = translate.storage.get("hash_" + translate.to + "_" + c);
                                if (null != h && h.length > 0)
                                    for (var f = 0; f < translate.nodeQueue[t].list[u][i].nodes.length; f++)
                                        e.add(translate.nodeQueue[t].list[u][i].nodes[f].node, g, translate.nodeQueue[t].list[u][i].beforeText + h + translate.nodeQueue[t].list[u][i].afterText, translate.nodeQueue[t].list[u][i].nodes[f].attribute);
                                else
                                    s[u].push(d),
                                    o[u].push(i)
                            }
                        e.execute()
                    }
                    var p = [];
                    for (var u in translate.nodeQueue[t].list)
                        s[u].length < 1 || p.push(u);
                    if (translate.listener.isExecuteFinish || (translate.temp_executeFinishNumber = 0,
                    translate.temp_executeFinishInterval = setInterval(function() {
                        translate.temp_executeFinishNumber == p.length && (translate.listener.isExecuteFinish = !0,
                        clearInterval(translate.temp_executeFinishInterval))
                    }, 50)),
                    0 != p.length)
                        for (var v in p) {
                            u = p[v];
                            if (void 0 === s[u] || s[u].length < 1)
                                return;
                            var m = translate.request.api.host + translate.request.api.translate + "?v=" + translate.version
                              , x = {
                                from: u,
                                to: translate.to,
                                text: encodeURIComponent(JSON.stringify(s[u]))
                            };
                            translate.request.post(m, x, function(e) {
                                if (0 == e.result)
                                    return console.log("=======ERROR START======="),
                                    console.log(s[e.from]),
                                    console.log("response : " + e.info),
                                    console.log("=======ERROR END  ======="),
                                    void translate.temp_executeFinishNumber++;
                                let a = new translate.renderTask;
                                for (var n = 0; n < o[e.from].length; n++) {
                                    var l = e.from
                                      , r = e.text[n]
                                      , u = o[e.from][n]
                                      , i = translate.nodeQueue[t].list[l][u].cacheHash
                                      , g = "";
                                    try {
                                        g = translate.nodeQueue[t].list[l][u].original
                                    } catch (e) {
                                        console.log("uuid:" + t + ", originalWord:" + g + ", lang:" + l + ", hash:" + u + ", text:" + r + ", queue:" + translate.nodeQueue[t]),
                                        console.log(e);
                                        continue
                                    }
                                    for (var d = 0; d < translate.nodeQueue[t].list[l][u].nodes.length; d++)
                                        a.add(translate.nodeQueue[t].list[l][u].nodes[d].node, g, translate.nodeQueue[t].list[l][u].beforeText + r + translate.nodeQueue[t].list[l][u].afterText, translate.nodeQueue[t].list[l][u].nodes[d].attribute);
                                    translate.storage.set("hash_" + e.to + "_" + i, r)
                                }
                                a.execute(),
                                translate.temp_executeFinishNumber++
                            })
                        }
                }
            } else
                translate.autoDiscriminateLocalLanguage && translate.executeByLocalLanguage()
        } else
            translate.execute_v1()
    },
    element: {
        nodeAnalyse: {
            get: function(e, t) {
                return translate.element.nodeAnalyse.analyse(e, "", "", t)
            },
            set: function(e, t, a, n) {
                translate.element.nodeAnalyse.analyse(e, t, a, n)
            },
            analyse: function(e, t, a, n) {
                var l = new Array;
                l.node = e,
                l.text = "";
                var r = translate.element.getNodeName(e);
                if (null != n && "string" == typeof n && n.length > 0)
                    return l.text = e[n],
                    void 0 !== t && t.length > 0 && (void 0 !== e[n] ? e[n] = e[n].replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a)) : console.log(e)),
                    l;
                "#text" == r && (void 0 !== e.parentNode && "TEXTAREA" == translate.element.getNodeName(e.parentNode) && (r = "TEXTAREA",
                e = e.parentNode));
                if ("INPUT" == r || "TEXTAREA" == r) {
                    if (null == e.attributes || void 0 === e.attributes)
                        return l.text = "",
                        l;
                    if ("INPUT" == r && void 0 !== e.attributes.type && null != typeof e.attributes.type.nodeValue && ("button" == e.attributes.type.nodeValue.toLowerCase() || "submit" == e.attributes.type.nodeValue.toLowerCase())) {
                        var s = e.attributes.value;
                        if (null != s && void 0 !== s && void 0 !== s.nodeValue && s.nodeValue.length > 0)
                            return void 0 !== t && t.length > 0 && (s.nodeValue = s.nodeValue.replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a))),
                            l.text = s.nodeValue,
                            l.node = s,
                            l
                    }
                    return void 0 !== e.attributes.placeholder ? (void 0 !== t && t.length > 0 && (e.attributes.placeholder.nodeValue = e.attributes.placeholder.nodeValue.replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a))),
                    l.text = e.attributes.placeholder.nodeValue,
                    l.node = e.attributes.placeholder,
                    l) : (l.text = "",
                    l)
                }
                if ("META" == r) {
                    if (void 0 !== e.name && null != e.name) {
                        var o = e.name.toLowerCase();
                        if ("keywords" == o || "description" == o)
                            return void 0 !== t && t.length > 0 && (e.content = e.content.replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a))),
                            l.text = e.content,
                            l
                    }
                    return l.text = "",
                    l
                }
                return "IMG" == r ? void 0 === e.alt || null == e.alt ? (l.text = "",
                l) : (void 0 !== t && t.length > 0 && (e.alt = e.alt.replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a))),
                l.text = e.alt,
                l) : (null == e.nodeValue || void 0 === e.nodeValue ? l.text = "" : 0 == e.nodeValue.trim().length ? l.text = "" : (void 0 !== t && t.length > 0 && (e.nodeValue = e.nodeValue.replace(new RegExp(translate.util.regExp.pattern(t),"g"), translate.util.regExp.resultText(a))),
                l.text = e.nodeValue),
                l)
            }
        },
        getNodeName: function(e) {
            return null == e || void 0 === e ? "" : null == e.nodeName || void 0 === e.nodeName ? "" : e.nodeName
        },
        whileNodes: function(e, t) {
            if (null != t && void 0 !== t) {
                "object" == typeof t && "string" == typeof t.title && t.title.length > 0 && (translate.ignore.isIgnore(t) || translate.addNodeToQueue(e, t, t.title, "title"));
                var a = t.childNodes;
                if (a.length > 0)
                    for (var n = 0; n < a.length; n++)
                        translate.element.whileNodes(e, a[n]);
                else
                    translate.element.findNode(e, t)
            }
        },
        findNode: function(e, t) {
            if (null != t && void 0 !== t && null != t.parentNode) {
                var a = translate.element.getNodeName(t.parentNode);
                if ("" != a && !(translate.ignore.tag.indexOf(a.toLowerCase()) > -1 || translate.ignore.isIgnore(t))) {
                    var n = translate.element.nodeAnalyse.get(t);
                    n.text.length > 0 && translate.addNodeToQueue(e, n.node, n.text)
                }
            }
        }
    },
    addNodeToQueue: function(e, t, a, n) {
        if (null != t && null != a && 0 != a.length && "#comment" != translate.element.getNodeName(t).toLowerCase()) {
            translate.util.hash(a);
            if (translate.util.findTag(a)) {
                if (null == t.parentNode)
                    return;
                var l = translate.element.getNodeName(t.parentNode);
                if ("SCRIPT" == l || "STYLE" == l)
                    return
            }
            var r = translate.language.get(a);
            for (var s in void 0 !== r[translate.to] && delete r[translate.to],
            r) {
                null != translate.nodeQueue[e].list[s] && void 0 !== translate.nodeQueue[e].list[s] || (translate.nodeQueue[e].list[s] = new Array);
                for (var o = 0; o < r[s].length; o++)
                    if (void 0 !== r[s][o] && void 0 !== r[s][o].text) {
                        var u = r[s][o].text
                          , i = r[s][o].beforeText
                          , g = r[s][o].afterText
                          , d = translate.util.hash(u);
                        if (null != translate.nodeQueue[e].list[s][d] && void 0 !== translate.nodeQueue[e].list[s][d] || (translate.nodeQueue[e].list[s][d] = new Array,
                        translate.nodeQueue[e].list[s][d].nodes = new Array,
                        translate.nodeQueue[e].list[s][d].original = u,
                        translate.nodeQueue[e].list[s][d].translateText = translate.nomenclature.dispose(u),
                        translate.nodeQueue[e].list[s][d].beforeText = i,
                        translate.nodeQueue[e].list[s][d].afterText = g),
                        void 0 !== t.isSameNode)
                            for (var c = 0; c < translate.nodeQueue[e].list[s][d].nodes.length; c++)
                                t.isSameNode(translate.nodeQueue[e].list[s][d].nodes[c].node);
                        var h = translate.nodeQueue[e].list[s][d].nodes.length;
                        translate.nodeQueue[e].list[s][d].nodes[h] = new Array,
                        translate.nodeQueue[e].list[s][d].nodes[h].node = t,
                        translate.nodeQueue[e].list[s][d].nodes[h].attribute = n
                    }
            }
        }
    },
    language: {
        local: "",
        setLocal: function(e) {
            translate.setUseVersion2(),
            translate.language.local = e
        },
        getLocal: function() {
            return (null == translate.language.local || translate.language.local.length < 1) && translate.language.autoRecognitionLocalLanguage(),
            translate.language.local
        },
        autoRecognitionLocalLanguage: function() {
            if (!(null != translate.language.local && translate.language.local.length > 2)) {
                var e = document.body.outerText;
                if (null == e || void 0 === e || e.length < 1)
                    translate.language.local = "chinese_simplified";
                else {
                    e = e.replace(/\n|\t|\r/g, "");
                    for (var t = new Array, a = 0; a < e.length; a++) {
                        var n = e.charAt(a)
                          , l = translate.language.getCharLanguage(n);
                        "" == l && (l = "unidentification"),
                        t.push(l)
                    }
                    var r = translate.util.arrayFindMaxNumber(t)
                      , s = r.indexOf("specialCharacter");
                    s > -1 && r.splice(s, 1),
                    r.length > 0 ? translate.language.local = r[0] : translate.language.local = "chinese_simplified"
                }
            }
        },
        get: function(e) {
            for (var t = new Array, a = new Array, n = [], l = [], r = 0; r < e.length; r++) {
                var s = e.charAt(r)
                  , o = translate.language.getCharLanguage(s);
                "" == o && (o = "unidentification");
                var u = translate.language.analyse(o, a, n, l, s);
                a = u.langStrs,
                void 0 !== n.language && (l.language = n.language,
                l.charstr = n.charstr,
                l.storage_language = n.storage_language),
                n.language = u.storage_language,
                n.charstr = s,
                n.storage_language = u.storage_language,
                t.push(o)
            }
            return void 0 !== a.unidentification && delete a.unidentification,
            void 0 !== a.specialCharacter && delete a.specialCharacter,
            void 0 !== a.number && delete a.number,
            a
        },
        getCharLanguage: function(e) {
            return null == e || void 0 === e ? "" : this.english(e) ? "english" : this.specialCharacter(e) ? "specialCharacter" : this.number(e) ? "number" : this.chinese_simplified(e) ? "chinese_simplified" : this.japanese(e) ? "japanese" : this.korean(e) ? "korean" : (console.log("not find is language , char : " + e + ", unicode: " + e.charCodeAt(0).toString(16)),
            "")
        },
        analyse: function(e, t, a, n, l) {
            void 0 === t[e] && (t[e] = new Array);
            var r = 0;
            void 0 === a.storage_language || (translate.language.connector(l) && (e = a.storage_language),
            r = a.storage_language == e ? t[e].length - 1 : t[e].length),
            void 0 === t[e][r] && (t[e][r] = new Array,
            t[e][r].beforeText = "",
            t[e][r].afterText = "",
            t[e][r].text = ""),
            t[e][r].text = t[e][r].text + l,
            0 == translate.language.wordBlankConnector(translate.language.getLocal()) && translate.language.wordBlankConnector(translate.to) && null != a.storage_language && void 0 !== a.storage_language && a.storage_language.length > 0 && "specialCharacter" != a.storage_language && (0 == translate.language.wordBlankConnector(a.storage_language) && translate.language.wordBlankConnector(e) ? t[a.storage_language][t[a.storage_language].length - 1].afterText = " " : "english" == a.storage_language && "english" != e && (t[e][r].beforeText = " "));
            var s = new Array;
            return s.langStrs = t,
            s.storage_language = e,
            s
        },
        connector: function(e) {
            return !!/.*[\u0020\u00A0\u202F\u205F\u3000]+.*$/.test(e) || (!!/.*[\u0030-\u0039]+.*$/.test(e) || (!!/.*[\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u002C\u002D\u002E\u003A\u003B\u003F\u0040]+.*$/.test(e) || !!/.*[\u3002\uFF1F\uFF01\uFF0C\u3001\uFF1B\uFF1A\u300C\u300D\u300E\u300F\u2018\u2019\u201C\u201D\uFF08\uFF09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uFF0E\u300A\u300B\u3008\u3009\u00b7]+.*$/.test(e)))
        },
        wordBlankConnector: function(e) {
            if (null == e || void 0 === e)
                return !0;
            switch (e.trim().toLowerCase()) {
            case "chinese_simplified":
            case "chinese_traditional":
            case "korean":
            case "japanese":
                return !1
            }
            return !0
        },
        chinese_simplified: function(e) {
            return !!/.*[\u4e00-\u9fa5]+.*$/.test(e)
        },
        english: function(e) {
            return !!/.*[\u0041-\u005a]+.*$/.test(e) || !!/.*[\u0061-\u007a]+.*$/.test(e)
        },
        japanese: function(e) {
            return !!/.*[\u0800-\u4e00]+.*$/.test(e)
        },
        korean: function(e) {
            return !!/.*[\uAC00-\uD7AF]+.*$/.test(e)
        },
        number: function(e) {
            return !!/.*[\u0030-\u0039]+.*$/.test(e)
        },
        specialCharacter: function(e) {
            return !!/.*[\u2460-\u24E9]+.*$/.test(e) || (!!/.*[\u2500-\u25FF]+.*$/.test(e) || (!!/.*[\u3200-\u33FF]+.*$/.test(e) || (!!/.*[\uFF00-\uFF5E]+.*$/.test(e) || (!!/.*[\u2000-\u22FF]+.*$/.test(e) || (!!/.*[\u3001-\u3036]+.*$/.test(e) || (!!/.*[\u0020-\u002F]+.*$/.test(e) || (!!/.*[\u003A-\u007E]+.*$/.test(e) || (!!/.*[\u0009\u000a\u0020\u00A0\u1680\u180E\u202F\u205F\u3000\uFEFF]+.*$/.test(e) || (!!/.*[\u2000-\u200B]+.*$/.test(e) || (!!/.*[\u00A1-\u0105]+.*$/.test(e) || !!/.*[\u2C60-\u2C77]+.*$/.test(e)))))))))))
        }
    },
    executeByLocalLanguage: function() {
        translate.request.post(translate.request.api.host + translate.request.api.ip + "?v=" + translate.version, {}, function(e) {
            0 == e.result ? (console.log("==== ERROR 获取当前用户所在区域异常 ===="),
            console.log(e.info),
            console.log("==== ERROR END ====")) : (translate.setUseVersion2(),
            translate.storage.set("to", e.language),
            translate.to = e.language,
            translate.selectLanguageTag,
            translate.execute())
        })
    },
    util: {
        uuid: function() {
            var e = (new Date).getTime();
            return window.performance && "function" == typeof window.performance.now && (e += performance.now()),
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var a = (e + 16 * Math.random()) % 16 | 0;
                return e = Math.floor(e / 16),
                ("x" == t ? a : 3 & a | 8).toString(16)
            })
        },
        findTag: function(e) {
            return /<[^>]+>/g.test(e)
        },
        arrayFindMaxNumber: function(e) {
            for (var t = {}, a = [], n = 0, l = 0, r = e.length; l < r; l++)
                t[e[l]] ? t[e[l]]++ : t[e[l]] = 1,
                t[e[l]] > n && (n = t[e[l]]);
            for (var s in t)
                t[s] === n && a.push(s);
            return a
        },
        hash: function(e) {
            if (null == e || void 0 === e)
                return e;
            var t, a = 0;
            if (0 === e.length)
                return a;
            for (t = 0; t < e.length; t++)
                a = (a << 5) - a + e.charCodeAt(t),
                a |= 0;
            return a + ""
        },
        charReplace: function(e) {
            return null == e ? "" : e = (e = e.trim()).replace(/\t|\n|\v|\r|\f/g, "")
        },
        regExp: {
            pattern: function(e) {
                return e = (e = e.replace(/\"/g, '\\"')).replace(/\?/g, "\\?")
            },
            resultText: function(e) {
                return e
            }
        }
    },
    request: {
        api: {
            host: "https://api.translate.zvo.cn/",
            language: "language.json",
            translate: "translate.json",
            ip: "ip.json"
        },
        post: function(e, t, a) {
            this.send(e, t, a, "post", !0, {
                "content-type": "application/x-www-form-urlencoded"
            }, null)
        },
        send: function(e, t, a, n, l, r, s) {
            var o = "";
            if (null != t)
                for (var u in t)
                    o.length > 0 && (o += "&"),
                    o = o + u + "=" + t[u];
            var i = null;
            try {
                i = new XMLHttpRequest
            } catch (e) {
                i = new ActiveXObject("Microsoft.XMLHTTP")
            }
            if (i.open(n, e, l),
            null != r)
                for (var u in r)
                    i.setRequestHeader(u, r[u]);
            i.send(o),
            i.onreadystatechange = function() {
                if (4 == i.readyState)
                    if (200 == i.status) {
                        var e = null;
                        try {
                            e = JSON.parse(i.responseText)
                        } catch (e) {
                            console.log(e)
                        }
                        a(null == e ? i.responseText : e)
                    } else
                        null != s && s(i)
            }
        }
    },
    storage: {
        set: function(e, t) {
            localStorage.setItem(e, t)
        },
        get: function(e) {
            return localStorage.getItem(e)
        }
    }
};
console.log("Two lines of js html automatic translation, page without change, no language configuration file, no API Key, SEO friendly! Open warehouse : https://github.com/xnx3/translate");
try {
    translate.init()
} catch (e) {
    console.log(e)
}

window.translate = translate;

function loadJsCode(code){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        //for Chrome Firefox Opera Safari
        script.appendChild(document.createTextNode(code));
        //for IE
        //script.text = code;
        document.body.appendChild(script);
}

