// ==UserScript==
// @name        临时测试、注意身体
// @namespace   Violentmonkey Scripts
// @match       *://dt8.cjcg88.com/read/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/12/11 下午1:03:44
// @downloadURL https://update.greasyfork.org/scripts/418479/%E4%B8%B4%E6%97%B6%E6%B5%8B%E8%AF%95%E3%80%81%E6%B3%A8%E6%84%8F%E8%BA%AB%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/418479/%E4%B8%B4%E6%97%B6%E6%B5%8B%E8%AF%95%E3%80%81%E6%B3%A8%E6%84%8F%E8%BA%AB%E4%BD%93.meta.js
// ==/UserScript==
webpackJsonp([2, 22], {
    409: function(t, e, i) {
        "use strict";
        function a(t) {
            i(483)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(467)
          , n = i(485)
          , s = i(28)
          , r = a
          , d = s(o.a, n.a, !1, r, "data-v-19fa8e8f", null);
        e.default = d.exports
    },
    417: function(t, e, i) {
        "use strict";
        function a(t) {
            i(550)
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var o = i(495)
          , n = i(557)
          , s = i(28)
          , r = a
          , d = s(o.a, n.a, !1, r, "data-v-5de50817", null);
        e.default = d.exports
    },
    435: function(t, e, i) {
        "use strict";
        i(8);
        e.a = {
            name: "",
            data: function() {
                return {}
            },
            computed: {
                backHome: function() {
                    return this.homeHref
                }
            },
            methods: {
                back: function() {
                    this.$router.go(-1)
                }
            },
            mounted: function() {},
            props: {
                title: {
                    type: String
                },
                readshow: {
                    type: Boolean
                },
                sort: {
                    type: Number
                }
            }
        }
    },
    436: function(t, e, i) {
        "use strict";
        e.a = {
            name: "imgLoader",
            props: {
                alt: {
                    type: String,
                    default: ""
                },
                src: {
                    type: String,
                    default: ""
                },
                domain: {
                    type: String,
                    default: ""
                }
            },
            data: function() {
                return {
                    native: new XMLHttpRequest,
                    retryed: 0,
                    base64Image: "/src/assets/images/empty.jpg"
                }
            },
            created: function() {
                var t = this;
                setTimeout(function() {
                    t.imgLoader()
                }, 0)
            },
            watch: {
                domain: function(t) {
                    t.indexOf("http") > -1 && this.imgLoader()
                },
                src: function(t) {
                    this.imgLoader()
                }
            },
            methods: {
                imgError: function(t) {
                    this.$emit("error", !1)
                },
                imgLoad: function(t) {
                    this.$emit("load", !1)
                },
                imgLoader: function() {
                    var t = this;
                    if (this.domain.indexOf("http") > -1 && this.src.length > 0) {
                        if (!(this.entrol > 0))
                            return void (this.base64Image = this.domain + this.src);
                        var e = this.src.toLowerCase().replace(".jpeg", ".html").replace(".jpg", ".html").replace(".png", ".html").replace(".gif", ".html")
                          , i = this.native;
                        i.open("GET", this.domain + e, !0),
                        i.onload = function() {
                            if (4 == i.readyState)
                                if (200 == i.status) {
                                    var e = i.responseText.replace(/\+/g, "*");
                                    e = e.replace(/\//g, "+"),
                                    e = e.replace(/\*/g, "/"),
                                    t.base64Image = e
                                } else
                                    t.retryed < 3 && (t.retryed++,
                                    setTimeout(t.imgLoader(), 500 * t.retryed))
                        }
                        ,
                        i.send()
                    }
                }
            },
            destroyed: function() {
                this.native.abort()
            }
        }
    },
    437: function(t, e, i) {
        "use strict";
        function a(t) {
            i(438)
        }
        var o = i(435)
          , n = i(440)
          , s = i(28)
          , r = a
          , d = s(o.a, n.a, !1, r, "data-v-2df90160", null);
        e.a = d.exports
    },
    438: function(t, e, i) {
        var a = i(439);
        "string" == typeof a && (a = [[t.i, a, ""]]),
        a.locals && (t.exports = a.locals);
        i(14)("8c2dbd64", a, !0, {})
    },
    439: function(t, e, i) {
        e = t.exports = i(13)(!1),
        e.push([t.i, '.bar_home[data-v-2df90160]{width:2.5rem;text-align:center;height:2.5rem;font-size:1.2rem;color:#fff;line-height:2.5rem}.read_bar p[data-v-2df90160]:first-of-type{font-size:.85rem;margin-bottom:.2rem}.read_bar p[data-v-2df90160]:nth-of-type(2){font-size:.6rem}#topbar[data-v-2df90160]{height:2.5rem}.topbar[data-v-2df90160]{position:fixed;width:20rem;height:2.5rem;background-color:#f44336;align-items:center;z-index:9;max-width:640px}.topbar[data-v-2df90160]:after{content:"";position:absolute;right:0;width:100%;bottom:auto;height:8px;top:100%;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.1) 40%,rgba(0,0,0,.05) 50%,transparent 80%,transparent)}.topbar .fl[data-v-2df90160]{width:2.5rem;text-align:center;height:2.5rem;margin-right:.5rem}.topbar .fl i[data-v-2df90160]{font-size:1.8rem;color:#fff;line-height:2.5rem}.title[data-v-2df90160]{color:#fff;font-size:.8rem;flex:1;-webkit-flex:1}', ""])
    },
    440: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                attrs: {
                    id: "topbar"
                }
            }, [i("div", {
                staticClass: "topbar flex"
            }, [i("div", {
                staticClass: "fl",
                on: {
                    click: function(e) {
                        return t.back()
                    }
                }
            }, [i("i", {
                staticClass: "fa fa-angle-left"
            })]), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.readshow,
                    expression: "readshow"
                }],
                staticClass: "title read_bar"
            }, [i("p", [t._v(t._s(t.title))]), t._v(" "), t.sort && t.sort > 0 ? i("p", [t._v("第" + t._s(t.sort) + "话")]) : t._e()]), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.readshow,
                    expression: "!readshow"
                }],
                staticClass: "title"
            }, [t._v(t._s(t.title))]), t._v(" "), i("a", {
                staticClass: "bar_home",
                attrs: {
                    href: t.backHome
                }
            }, [i("i", {
                staticClass: "fa fa-home"
            })])])])
        }
          , o = []
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    },
    441: function(t, e, i) {
        "use strict";
        var a = i(436)
          , o = i(444)
          , n = i(28)
          , s = n(a.a, o.a, !1, null, null, null);
        e.a = s.exports
    },
    442: function(t, e, i) {
        "use strict";
        function a(t) {
            i(445)
        }
        var o = i(443)
          , n = i(447)
          , s = i(28)
          , r = a
          , d = s(o.a, n.a, !1, r, "data-v-45a747dc", null);
        e.a = d.exports
    },
    443: function(t, e, i) {
        "use strict";
        var a = i(161)
          , o = (i.n(a),
        {
            SUCCESS: "success",
            ERROR: "error"
        });
        e.a = {
            name: "PictureFactory",
            props: {
                src: {
                    require: !0,
                    type: String
                },
                secret: {
                    type: String,
                    default: function() {
                        return "0123456789abcdef"
                    }
                },
                vi: {
                    type: String,
                    default: function() {
                        return "0123456789abcdef"
                    }
                },
                requestFailNum: {
                    type: Number,
                    default: function() {
                        return 2
                    }
                },
                imgWidth: {
                    type: [Number, String],
                    default: function() {
                        return "100%"
                    }
                },
                imgHeight: {
                    type: [Number, String],
                    default: function() {
                        return "auto"
                    }
                }
            },
            data: function() {
                return {
                    base64: "",
                    failNum: 0,
                    state: ""
                }
            },
            watch: {
                src: function() {
                    this.getFile()
                },
                secret: function() {
                    this.getFile()
                },
                vi: function() {
                    this.getFile()
                }
            },
            created: function() {
                this.getFile()
            },
            methods: {
                getFile: function() {
                    var t = this.src;
                    this.state = "loading",
                    this.deCode(t)
                },
                deCode: function(t) {
                    var e = t;
                    this.base64 = e,
                    this.state = "success",
                    this.$emit(o.SUCCESS, e)
                },
                retry: function() {
                    this.getFile(),
                    this.failNum = 0
                }
            }
        }
    },
    444: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement;
            return (t._self._c || e)("img", {
                attrs: {
                    src: t.base64Image,
                    alt: t.alt
                },
                on: {
                    error: function(e) {
                        return t.imgError(e)
                    },
                    load: function(e) {
                        return t.imgLoad(e)
                    }
                }
            })
        }
          , o = []
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    },
    445: function(t, e, i) {
        var a = i(446);
        "string" == typeof a && (a = [[t.i, a, ""]]),
        a.locals && (t.exports = a.locals);
        i(14)("35a166d1", a, !0, {})
    },
    446: function(t, e, i) {
        e = t.exports = i(13)(!1),
        e.push([t.i, ".warp[data-v-45a747dc]{position:relative;width:100%}.warp .mask[data-v-45a747dc]{position:absolute;left:0;top:0;width:100%;height:100%}.warp .error[data-v-45a747dc],.warp .loading[data-v-45a747dc]{display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:100px;background-color:#c0c4cc}.warp .loading[data-v-45a747dc]{font-size:20px}.warp .img[data-v-45a747dc]{outline:none;border:none}.warp .error[data-v-45a747dc]{text-align:center;font-size:14px;color:#fff}.warp .error span[data-v-45a747dc]{cursor:pointer}.warp .error span:hover .res[data-v-45a747dc]{color:#327dd2}", ""])
    },
    447: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "warp"
            }, [t._t("default", ["loading" === t.state ? [i("div", {
                staticClass: "mask"
            })] : t._e(), t._v(" "), "loading" === t.state ? i("div", {
                staticClass: "loading"
            }, [i("i", {
                staticClass: "el-icon-picture-outline"
            })]) : t._e(), t._v(" "), "success" === t.state ? i("img", {
                staticClass: "img",
                style: {
                    width: t.imgWidth,
                    height: t.imgHeight
                },
                attrs: {
                    src: t.base64
                }
            }) : t._e(), t._v(" "), "error" === t.state ? i("div", {
                staticClass: "error"
            }, [i("span", {
                on: {
                    click: t.retry
                }
            }, [t._v("加载失败-_-//, 点击"), i("span", {
                staticClass: "res"
            }, [t._v("重试")])])]) : t._e()], {
                scope: {
                    base64: t.base64,
                    failNum: t.failNum,
                    state: t.state
                }
            })], 2)
        }
          , o = []
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    },
    467: function(t, e, i) {
        "use strict";
        var a = (i(8),
        i(437))
          , o = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var a in i)
                    Object.prototype.hasOwnProperty.call(i, a) && (t[a] = i[a])
            }
            return t
        }
        ;
        e.a = {
            name: "Dowmload",
            components: {
                MineTop: a.a
            },
            data: function() {
                return {
                    tableHeight: "",
                    user: {},
                    pp: "2.5rem"
                }
            },
            computed: {
                isShowDown: function() {
                    return this.showDown
                }
            },
            mounted: function() {
                this.getUserInfo(),
                this.tableHeight = document.body.clientHeight,
                this.setNewDownStyle()
            },
            methods: {
                setNewDownStyle: function() {
                    this.showDown
                },
                downApp: function() {
                    console.log("downApp"),
                    console.log(this.user),
                    this.user.tempUid && (1 == this.user.isVip || 1 == this.user.isRecharge ? this.$router.push("/reg?down=2") : this.download({
                        rechargeFlag: 1
                    }, "temp down=1")),
                    this.user.uid && (1 == this.user.isVip || 1 == this.user.isRecharge ? this.download({
                        rechargeFlag: 2
                    }, "user down=2") : this.download({
                        rechargeFlag: 1
                    }, "user down=1"))
                },
                getUserInfo: function() {
                    var t = this;
                    this.Http.post({
                        action: 1003,
                        success: function(e) {
                            t.user = e,
                            void 0 != e.tname && window.localStorage.setItem("tname", e.tname)
                        },
                        error: function(t) {}
                    })
                },
                download: function(t, e) {
                    var i = this.getParams()
                      , a = o({}, i, t);
                    this.Http.post({
                        action: 3006,
                        data: a,
                        success: function(t) {
                            t.url && (window.location = t.url)
                        },
                        error: function(t) {}
                    })
                },
                getParams: function() {
                    var t = {
                        platform: 1
                    };
                    if (location.href.indexOf("linkid") > -1 || window.localStorage.getItem("linkid"))
                        if (location.href.indexOf("linkid") > -1) {
                            var e = location.href.split("?")[1]
                              , i = e.split("&")
                              , a = null;
                            if (i.length > 0)
                                for (var o in i)
                                    i[o].indexOf("linkid") > -1 && (a = i[o].split("=")[1]);
                            t.linkid = a
                        } else
                            t.linkid = window.localStorage.getItem("linkid");
                    return t
                },
                closeThis: function() {
                    this.$emit("closeThis", !1)
                }
            },
            props: {
                showDown: {
                    type: Boolean,
                    default: !1
                }
            }
        }
    },
    483: function(t, e, i) {
        var a = i(484);
        "string" == typeof a && (a = [[t.i, a, ""]]),
        a.locals && (t.exports = a.locals);
        i(14)("073771e2", a, !0, {})
    },
    484: function(t, e, i) {
        e = t.exports = i(13)(!1),
        e.push([t.i, ".new_down .download-total[data-v-19fa8e8f]{padding-left:1.2rem;padding-right:1.2rem}.new_down .download-total .download-top[data-v-19fa8e8f]{text-align:center}.new_down .download-total .download-top .top-logo[data-v-19fa8e8f]{margin-top:2rem;width:4rem;height:4rem}.new_down .download-total .download-top .top-title[data-v-19fa8e8f]{height:2rem;line-height:2rem;font-size:.75rem;color:#575456}.new_down .download-total .download-top .top-text[data-v-19fa8e8f]{margin-top:.09333333rem;margin-bottom:.2rem;height:.8rem;line-height:.3rem;font-size:12px;color:#868686;font-weight:300}.new_down .download-total .download-top .install-a[data-v-19fa8e8f]{margin:auto;display:block;height:2.7rem;width:10.6rem;line-height:2.7rem;font-size:18px;font-weight:400;color:#fff;background-image:-webkit-linear-gradient(35deg,#5c47f9 1%,#6084fd);background-image:linear-gradient(55deg,#5c47f9 1%,#6084fd);-webkit-box-shadow:0 2px 10px 0 rgba(95,132,228,.68);box-shadow:0 2px 10px 0 rgba(95,132,228,.68);border-radius:100px;text-decoration:none}.new_down .download-total .tan[data-v-19fa8e8f]{min-width:8.5em;position:fixed;top:0;left:0;bottom:0;right:0;height:100%;z-index:90;background:50% no-repeat rgba(0,0,0,.8)}.new_down .download-total .tan .dialog-wrappp[data-v-19fa8e8f]{position:relative}.new_down .download-total .tan .dialog-wrappp .text-biaoo[data-v-19fa8e8f]{position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;color:#fff;font-size:20px;text-align:center;margin-top:1.46666667rem}.new_down .download-total .tan .dialog-wrappp .text-biaoo .text-fir[data-v-19fa8e8f]{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center}.new_down .download-total .tan .dialog-wrappp .text-biaoo .check[data-v-19fa8e8f]{margin-top:.22666667rem}.new_down .download-total .tan .dialog-wrappp .jiantou[data-v-19fa8e8f]{position:absolute;width:2.12rem;height:2.48rem;-webkit-background-size:100% 100%;background-size:100% 100%;right:.34666667rem}.new_down .download-total .download-title[data-v-19fa8e8f]{margin-top:1.2rem;margin-bottom:.6rem;height:2rem;font-weight:700;line-height:2rem;font-size:16px;color:#454545;text-align:center}.new_down .download-total .download-title i[data-v-19fa8e8f]{display:inline-block;margin-bottom:.13333333rem;height:1px;width:1.5rem}.new_down .download-total .download-title i[data-v-19fa8e8f]:first-child{background-image:-webkit-gradient(linear,right top,left top,from(#939393),to(hsla(0,0%,100%,0)));background-image:-webkit-linear-gradient(right,#939393,hsla(0,0%,100%,0));background-image:linear-gradient(-90deg,#939393,hsla(0,0%,100%,0));margin-right:.26666667rem}.new_down .download-total .download-title i[data-v-19fa8e8f]:nth-child(2){margin-left:.26666667rem;background-image:-webkit-gradient(linear,left top,right top,from(#939393),to(hsla(0,0%,100%,0)));background-image:-webkit-linear-gradient(left,#939393,hsla(0,0%,100%,0));background-image:linear-gradient(90deg,#939393,hsla(0,0%,100%,0))}.new_down .download-total .download-tips[data-v-19fa8e8f]{width:100%;font-size:14px;line-height:1.4rem;margin-bottom:.6rem;color:#fff}.new_down .download-total .android-img[data-v-19fa8e8f]{display:block;height:7.2rem;width:11.2rem;text-align:center;margin:auto auto .8rem}.backHome[data-v-19fa8e8f]{display:block;width:40px;height:40px;background-color:#f44336;font-size:14px;color:#fff;position:fixed;line-height:40px;left:10px;top:6.5rem;z-index:10;text-align:center;-webkit-border-radius:20px;-moz-border-radius:20px;-o-border-radius:20px;border-radius:20px}.antivirus[data-v-19fa8e8f]{font-size:.7rem;line-height:2rem;letter-spacing:2px;text-align:center;color:red;background-color:#ffdac8;border-radius:12px;padding:5px}", ""])
    },
    485: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "new_down"
            }, [i("MineTop", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !t.isShowDown,
                    expression: "!isShowDown"
                }],
                attrs: {
                    title: "下载中心"
                }
            }), t._v(" "), i("a", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.isShowDown,
                    expression: "isShowDown"
                }],
                staticClass: "backHome",
                attrs: {
                    href: "javascript:;"
                },
                on: {
                    click: t.closeThis
                }
            }, [t._v("关闭")]), t._v(" "), i("div", {
                staticClass: "download-total"
            }, [i("div", {
                staticClass: "download-top"
            }, [i("img", {
                staticClass: "top-logo",
                staticStyle: {
                    "border-radius": "10px"
                },
                attrs: {
                    src: "/src/assets/Img/ic_launcher.jpg",
                    alt: "logo"
                }
            }), t._v(" "), t._m(0), t._v(" "), i("p", {
                staticClass: "top-text"
            }), t._v(" "), i("a", {
                staticClass: "install-a",
                staticStyle: {
                    "background-image": "linear-gradient(55deg,#fe1942 1%,#ff6e30 100%)"
                },
                attrs: {
                    id: "link"
                },
                on: {
                    click: t.downApp
                }
            }, [t._v("点击下载安装")])]), t._v(" "), t._m(1), t._v(" "), t._m(2)])], 1)
        }
          , o = [function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("p", {
                staticClass: "top-title"
            }, [t._v("嘿嘿漫画\n        "), i("span", {
                attrs: {
                    id: "version"
                }
            })])
        }
        , function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "tan",
                staticStyle: {
                    display: "none"
                }
            }, [i("div", {
                staticClass: "dialog-wrappp"
            }, [i("div", {
                staticClass: "text-biaoo"
            }, [i("div", {
                staticClass: "text-fir"
            }, [i("span", {
                staticClass: "cliright"
            }, [t._v("点击右上角")]), t._v(" "), i("p", {
                staticClass: "yuan"
            }, [i("span"), t._v(" "), i("span"), t._v(" "), i("span")])]), t._v(" "), i("p", {
                staticClass: "check"
            }, [t._v("选择在浏览器打开")])]), t._v(" "), i("div", {
                staticClass: "jiantou"
            })])])
        }
        , function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "android-content"
            }, [i("div", {
                staticClass: "download-title"
            }, [i("i"), t._v("android安装教程\n        "), i("i")]), t._v(" "), i("div", {
                staticClass: "antivirus"
            }, [t._v("\n        嘿嘿漫画包含成人内容，近日被某些杀毒软件误判为恶意软件，\n        我们承诺不会放置恶意程序，请嘿嘿嘿友们放心安装和使用。\n      ")]), t._v(" "), i("div", {
                staticClass: "download-tips"
            }, [t._v("1、点击“下载APP”获取安装包，下载完成后按照系统引导安装即可。")]), t._v(" "), i("img", {
                staticClass: "android-img",
                attrs: {
                    src: "/src/assets/Img/anzhuo.png",
                    alt: ""
                }
            }), t._v(" "), i("div", {
                staticClass: "download-tips"
            }, [t._v("2、下载完成后按照系统引导安装即可。")])])
        }
        ]
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    },
    495: function(t, e, i) {
        "use strict";
        var a = i(8)
          , o = i(36)
          , n = (i.n(o),
        i(85))
          , s = i(163)
          , r = (i.n(s),
        i(442))
          , d = i(441)
          , l = i(409)
          , c = i(161)
          , h = (i.n(c),
        i(437))
          , u = i(552)
          , p = i(556)
          , f = (i.n(p),
        Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var a in i)
                    Object.prototype.hasOwnProperty.call(i, a) && (t[a] = i[a])
            }
            return t
        }
        );
        a.default.use(n.a),
        e.a = {
            name: "read",
            components: {
                Topbar: h.a,
                readfooter: u.a,
                imgLoader: d.a,
                PictureFactory: r.a,
                downLoad: l.default,
                slider: p.slider,
                slideritem: p.slideritem
            },
            provide: function() {
                return {
                    reload: this.reload
                }
            },
            data: function() {
                return {
                    isReloadAlive: !0,
                    count: 1,
                    countNum: 0,
                    chapterId: this.$route.params.id,
                    bookid: "",
                    sort: 0,
                    bookName: "",
                    bookInfo: [],
                    bookStyle: 1,
                    bookInfoClone: [],
                    bookSliceIndex: 1,
                    book_bean: [],
                    userInfo: "",
                    prevChapterId: "",
                    nextChapterId: "",
                    ispayshow: !1,
                    footerShow: !0,
                    bottomShow: !1,
                    iShowDown: -1,
                    readshow: !0,
                    imgsNextChapyer: "",
                    defaultCover: "",
                    showDown: !1,
                    showIosDown: !1,
                    numShowDown: 1,
                    url: "",
                    imageLoad: {
                        timer: null,
                        timeCount: 0,
                        timeLimite: 500
                    },
                    user: {},
                    adfooterShow: !1,
                    options: {
                        currentPage: 0,
                        pagination: !0,
                        thresholdDistance: 100,
                        thresholdTime: 300,
                        grabCursor: !0,
                        speed: 300
                    },
                    DialogShow: !0
                }
            },
            computed: {
                tabHeight: function() {
                    return document.documentElement.clientHeight
                },
                minH: function() {
                    return document.documentElement.clientHeight + "px"
                },
                minHAuto: function() {
                    return .8 * document.documentElement.clientHeight + "px"
                },
                imgBoot: function() {
                    return this.imgsBoot[0]
                },
                backHome: function() {
                    return this.homeHref
                }
            },
            methods: {
                reload: function() {
                    this.isReloadAlive = !1,
                    this.$nextTick(function() {
                        this.isReloadAlive = !0
                    })
                },
                imgload: function(t) {
                    var e = this;
                    this.imageLoad.timeCount <= this.imageLoad.timeLimite ? 1 == e.bookInfoClone.length ? (clearInterval(e.imageLoad.timer),
                    this.imageLoad.timer = setInterval(function() {
                        e.imageLoad.timeCount = e.imageLoad.timeCount + 10,
                        e.imageLoad.timeCount > e.imageLoad.timeLimite && (e.imageLoad.timeCount = 0,
                        e.bookInfoClone = e.bookInfo.slice(0, e.bookInfoClone.length + 1))
                    }, 10)) : (e.imageLoad.timeCount = 0,
                    e.bookInfoClone = this.bookInfo.slice(0, e.bookInfoClone.length + 1)) : (clearInterval(e.imageLoad.timer),
                    this.imageLoad.timer = setInterval(function() {
                        e.imageLoad.timeCount = e.imageLoad.timeCount + 10,
                        e.imageLoad.timeCount > e.imageLoad.timeLimite && (e.imageLoad.timeCount = 0,
                        this.bookInfoClone = this.bookInfo.slice(0, e.bookInfoClone.length + 1))
                    }, 10))
                },
                ErrorImg: function(t) {
                    var e = this;
                    !t.statusImg && 1 == e.count && e.countNum < e.imgsBoot.length && 1 == e.count && e.countNum < e.imgsBoot.length && (e.count++,
                    e.countNum < e.imgsBoot.length - 1 && e.countNum++)
                },
                go_down: function() {
                    this.DialogInfo("更多", "未删减版啪啪啪漫画")
                },
                downApp: function() {
                    var t = this
                      , e = {
                        platform: 1
                    };
                    if (location.href.indexOf("linkid") > -1 || window.localStorage.getItem("linkid"))
                        if (location.href.indexOf("linkid") > -1) {
                            var i = location.href.split("?")[1]
                              , a = i.split("&")
                              , o = null;
                            if (a.length > 0)
                                for (var n in a)
                                    a[n].indexOf("linkid") > -1 && (o = a[n].split("=")[1]);
                            e.linkid = o
                        } else
                            e.linkid = window.localStorage.getItem("linkid");
                    this.Http.post({
                        action: 3006,
                        data: e,
                        success: function(e) {
                            e.url && (t.url = e.url)
                        },
                        error: function(t) {}
                    }),
                    document.addEventListener("scroll", this.handleScroll)
                },
                handleScroll: function() {
                    var t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                      , e = document.documentElement.scrollHeight || document.body.scrollHeight
                      , i = e - t - this.tabHeight
                      , a = Math.floor(t / this.tabHeight);
                    a > 4 || i >= 0 && i < this.tabHeight ? this.bottomShow = !0 : this.bottomShow = !1,
                    this.isAndroid() && (-1 == this.iShowDown || this.numShowDown < 2 ? (30 == a || 40 == a || 50 == a || i > 0 && i < 640) && (50 == a ? this.DialogInfo("为了", "保护您的账户安全") : this.DialogInfo("更多", "未删减版啪啪啪漫画"),
                    1 == this.numShowDown && (this.numShowDown++,
                    this.iShowDown = 0)) : 30 !== a && 40 !== a && 50 !== a && i > 640 && (this.numShowDown = 1,
                    this.iShowDown = -1));
                    var o = document.cookie.replace(/(?:(?:^|.*;\s*)mftag\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                    this.isIOS() && "isClick" != o && (-1 == this.iShowDown ? 30 != a && 40 != a && 50 != a || (this.IosDialogInfo("请加入主屏幕，激情漫画看不停！！"),
                    1 == this.numShowDown && (this.numShowDown++,
                    this.iShowDown = 0)) : 30 !== a && 40 !== a && 50 !== a && (this.numShowDown = 1,
                    this.iShowDown = -1))
                },
                getUserInfo: function() {
                    var t = this;
                    this.Http.post({
                        action: 1003,
                        success: function(e) {
                            t.user = e,
                            void 0 != e.tname && window.localStorage.setItem("tname", e.tname)
                        },
                        error: function(t) {}
                    })
                },
                download: function(t, e) {
                    console.log(e);
                    var i = this.getParams()
                      , a = f({}, i, t);
                    this.Http.post({
                        action: 3006,
                        data: a,
                        success: function(t) {
                            t.url && (window.location = t.url)
                        },
                        error: function(t) {}
                    })
                },
                getParams: function() {
                    var t = {
                        platform: 1
                    };
                    if (location.href.indexOf("linkid") > -1 || window.localStorage.getItem("linkid"))
                        if (location.href.indexOf("linkid") > -1) {
                            var e = location.href.split("?")[1]
                              , i = e.split("&")
                              , a = null;
                            if (i.length > 0)
                                for (var o in i)
                                    i[o].indexOf("linkid") > -1 && (a = i[o].split("=")[1]);
                            t.linkid = a
                        } else
                            t.linkid = window.localStorage.getItem("linkid");
                    return t
                },
                DialogInfo: function(t, e) {
                    var i = this;
                    0 != this.DialogShow && (3 != sessionStorage.getItem("from") && n.a.confirm({
                        title: "温馨提示",
                        showCancelButton: !0,
                        message: t + '<span style="color:#f00;font-size:17px;">' + e + "</span>，请下载官方App，激情漫画看不停！！"
                    }).then(function() {
                        i.user.tempUid && (1 == i.user.isVip || 1 == i.user.isRecharge ? i.$router.push("/reg?from=/read/" + i.chapterId) : i.download({
                            rechargeFlag: 1
                        }, "temp down=1")),
                        i.user.uid && (1 == i.user.isVip || 1 == i.user.isRecharge ? i.download({
                            rechargeFlag: 2
                        }, "user down=2") : i.download({
                            rechargeFlag: 1
                        }, "user down=1"))
                    }).catch(function() {}))
                },
                IosDialogInfo: function(t) {
                    var e = this;
                    0 != this.DialogShow && n.a.confirm({
                        title: "温馨提示",
                        showCancelButton: !0,
                        message: '更多<span style="color:#f00;font-size:17px;">未删减版啪啪啪漫画</span>，' + t
                    }).then(function() {
                        e.showIosDown = !0,
                        document.body.style.overflow = "hidden"
                    }).catch(function() {})
                },
                cloneDolog: function() {
                    this.showIosDown = !1,
                    document.body.style.overflow = "auto",
                    document.cookie = "mftag=isClick"
                },
                clickmenu: function() {
                    var t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                    Math.floor(t / this.tabHeight) < 40 && (this.bottomShow = !this.bottomShow)
                },
                go_mulu: function(t) {
                    this.$router.push({
                        path: "/cat/" + t
                    })
                },
                prev: function(t) {
                    if (0 == t || "0" == t)
                        return void Object(o.MessageBox)("温馨提示", "没有上一章了");
                    this.reload(),
                    this.$router.push({
                        name: "read",
                        params: {
                            id: t
                        }
                    })
                },
                next: function(t) {
                    if (0 == t || "0" == t || -1 == t)
                        return void Object(o.MessageBox)("温馨提示", "没有下一章了");
                    this.reload(),
                    this.$router.push({
                        name: "read",
                        params: {
                            id: t
                        }
                    })
                },
                getcontentNext: function() {
                    var t = this;
                    this.Http.post({
                        action: 2011,
                        data: {
                            chapterId: t.chapterId,
                            app: 1
                        },
                        success: function(e) {
                            null == e[0].book.readmode && (e[0].book.readmode = 1),
                            t.bookStyle = e[0].book.readmode;
                            var i = new URLSearchParams(window.location.search)
                              , a = i.get("style");
                            null != a && (t.bookStyle = a),
                            document.title = e[0].book.title,
                            t.bookName = e[0].book.title,
                            t.bookid = e[0].bookid,
                            t.sort = +e[0].sort,
                            t.bookInfo = e[0].image,
                            t.bookInfoClone = t.bookInfo,
                            t.chapterId = e[0].id,
                            t.prevChapterId = e[0].previd,
                            t.nextChapterId = e[0].nextid,
                            t.ispayshow = !1,
                            t.footerShow = !0,
                            t.writeHis(),
                            void 0 != e[1] && (t.imgsNextChapyer = e[1].image.slice(0, 5))
                        },
                        error: function(e) {
                          console.log(JSON.stringify(e));
                            document.title = e.data.book.title, t.bookName = e.data.book.title, t.bookid = e.data.bookid, t.sort = +e.data.sort,
							t.bookInfo = e.data.image, t.bookInfoClone = e.data.image.slice(0, 1), t.chapterId = e.data.id, t.prevChapterId =
							e.data.previd, t.nextChapterId = e.data.nextid, t.ispayshow = !1, t.footerShow = !0, t.writeHis(), t.imgsNextChapyer =
							e.data.image.slice(0, 5)
                        }
                    })
                },
                writeHis: function() {
                    var t = this;
                    this.Http.post({
                        action: 1007,
                        data: {
                            bookId: t.bookid,
                            chapterId: t.chapterId
                        },
                        success: function(t) {}
                    })
                },
                closeDown: function() {
                    this.showDown = !1,
                    document.documentElement.style.overflowY = "scroll",
                    document.addEventListener("touchmove", function(t) {
                        t.preventDefault(),
                        window.event.returnValue = !0
                    }, !1)
                },
                setFuckBook: function() {
                    var t = this;
                    window.localStorage.setItem("chapterid", t.chapterId),
                    this.$router.push({
                        name: "recharge"
                    })
                }
            },
            mounted: function() {
                2 == window.localStorage.getItem("app") && (this.DialogShow = !1),
                "isClick" == new URLSearchParams(window.location.search).get("mftag") && (document.cookie = "mftag=isClick");
                var t = this;
                this.getUserInfo(),
                this.downApp(),
                "function" == typeof this.imgsBoot ? this.imgsBoot(t.getcontentNext) : this.getcontentNext()
            },
            props: {},
            watch: {
                chapterId: function(t) {
                    var e = this;
                    this.chapterId = t,
                    this.$nextTick(function() {
                        e.bookInfoClone = [],
                        e.getcontentNext(),
                        e.downApp()
                    })
                },
                $route: function(t, e) {
                    this.chapterId = this.$route.params.id
                },
                immediate: !0
            }
        }
    },
    496: function(t, e, i) {
        "use strict";
        var a = i(8)
          , o = i(85)
          , n = i(163)
          , s = (i.n(n),
        i(441))
          , r = i(442);
        a.default.use(o.a),
        e.a = {
            name: "",
            data: function() {
                return {
                    countNum: 0,
                    bookInfo: [],
                    bookInfoClone: [],
                    imageLoad: {
                        timer: null,
                        timeCount: 0,
                        timeLimite: 500
                    },
                    user: {},
                    book: []
                }
            },
            components: {
                imgLoader: s.a,
                PictureFactory: r.a
            },
            computed: {
                show: function() {
                    return !!this.isAndroid()
                }
            },
            methods: {
                imgload: function(t) {
                    var e = this;
                    this.imageLoad.timeCount <= this.imageLoad.timeLimite ? 1 == e.bookInfoClone.length ? (clearInterval(e.imageLoad.timer),
                    this.imageLoad.timer = setInterval(function() {
                        e.imageLoad.timeCount = e.imageLoad.timeCount + 10,
                        e.imageLoad.timeCount > e.imageLoad.timeLimite && (e.imageLoad.timeCount = 0,
                        e.bookInfoClone = e.bookInfo.slice(0, e.bookInfoClone.length + 1))
                    }, 10)) : (e.imageLoad.timeCount = 0,
                    e.bookInfoClone = this.bookInfo.slice(0, e.bookInfoClone.length + 1)) : (clearInterval(e.imageLoad.timer),
                    this.imageLoad.timer = setInterval(function() {
                        e.imageLoad.timeCount = e.imageLoad.timeCount + 10,
                        e.imageLoad.timeCount > e.imageLoad.timeLimite && (e.imageLoad.timeCount = 0,
                        this.bookInfoClone = this.bookInfo.slice(0, e.bookInfoClone.length + 1))
                    }, 10))
                },
                go_down: function() {
                    this.DialogInfo("更多", "未删减版啪啪啪漫画")
                },
                randomsort: function(t, e) {
                    return Math.random() > .5 ? -1 : 1
                },
                bottomData: function() {
                    var t = this;
                    t.Http.post({
                        action: 3001,
                        data: {
                            ids: "46"
                        },
                        success: function(e) {
                            t.book = e[46].list.sort(t.randomsort).slice(0, 4);
                            var i = [];
                            t.book.forEach(function(e) {
                                e.imgBoot = t.imgsBoot[0],
                                i.push(e.bookcover)
                            }),
                            t.bookInfo = i
                        }
                    })
                },
                getUserInfo: function() {
                    var t = this;
                    this.Http.post({
                        action: 1003,
                        success: function(e) {
                            t.user = e,
                            void 0 != e.tname && window.localStorage.setItem("tname", e.tname)
                        },
                        error: function(t) {}
                    })
                },
                DialogInfo: function(t, e) {
                    if (3 != sessionStorage.getItem("from")) {
                        var i = this;
                        o.a.confirm({
                            title: "温馨提示",
                            showCancelButton: !0,
                            message: t + '<span style="color:#f00;font-size:17px;">' + e + "</span>，请下载官方App，激情漫画看不停！！"
                        }).then(function() {
                            i.$router.push({
                                name: "download"
                            })
                        }).catch(function() {})
                    }
                }
            },
            mounted: function() {
                this.bottomData()
            },
            props: {
                way: {}
            }
        }
    },
    550: function(t, e, i) {
        var a = i(551);
        "string" == typeof a && (a = [[t.i, a, ""]]),
        a.locals && (t.exports = a.locals);
        i(14)("21eb33db", a, !0, {})
    },
    551: function(t, e, i) {
        e = t.exports = i(13)(!1),
        e.push([t.i, '.fade-enter-active[data-v-5de50817],.fade-leave-active[data-v-5de50817]{transition:all 1s ease}.fade-enter-active[data-v-5de50817]{bottom:0;opacity:1}.fade-enter[data-v-5de50817],.fade-leave-active[data-v-5de50817],.fade-leave[data-v-5de50817]{opacity:0;bottom:-2.5rem}.backHome[data-v-5de50817]{display:block;width:40px;height:40px;background-color:#f44336;font-size:14px;color:#fff;position:fixed;line-height:40px;left:10px;top:6.5rem;z-index:10;text-align:center;-webkit-border-radius:20px;-moz-border-radius:20px;-o-border-radius:20px;border-radius:20px}.bottomBox .button.active[data-v-5de50817]{opacity:.55!important}.bottomBox .button[data-v-5de50817]{flex:1;-webkit-flex:1}.bottomBox .function[data-v-5de50817]{width:3rem}.bottomBox>div[data-v-5de50817]{height:2rem;line-height:2rem;margin:.25rem 0;border-right:1px solid #f1f1f1}.bottomBox>div[data-v-5de50817]:last-child{border-right:none}.bottomBox[data-v-5de50817]{position:fixed;width:100%;max-width:640px;bottom:0;height:2.5rem;background-color:#fff;font-size:1rem;color:#f44336;z-index:9999}.bottomBox[data-v-5de50817]:after{content:"";position:absolute;right:0;width:100%;bottom:100%;height:8px;top:auto;pointer-events:none;background:linear-gradient(0deg,rgba(0,0,0,.3),rgba(0,0,0,.1) 40%,rgba(0,0,0,.05) 50%,transparent 80%,transparent)}.pay_info a[data-v-5de50817]{font-size:.6rem;color:#f44336;text-decoration:underline}.pay_info span[data-v-5de50817]{font-size:.6rem}.pay_info[data-v-5de50817]{height:2rem;line-height:2rem;color:#9e9e9e;font-size:.8rem;padding:.4rem 1rem 0}.payButton>a[data-v-5de50817]{display:block;width:100%;line-height:2rem;background-color:#f44336;color:#fff;font-size:.8rem;border-radius:.3rem}.payButton[data-v-5de50817]{padding:.5rem 1rem;border-bottom:1px solid #f5f5f5;height:2rem}#payBox>p[data-v-5de50817]{height:2rem;line-height:2rem;color:#5c5d58;font-size:.8rem;padding:0 1rem}.nopaddLR[data-v-5de50817]{padding:0 1rem .5rem!important;border-bottom:1px solid #f5f5f5}#payBox[data-v-5de50817]{position:fixed;padding:.5rem 0;height:10rem;background-color:#fff;bottom:3rem;left:2%;right:2%;bottom:.5rem;border-radius:.3rem;box-shadow:0 3px 8px#9c9c9c!important;z-index:3}#payBox_before[data-v-5de50817]{content:"";display:block;background:linear-gradient(180deg,hsla(0,0%,100%,0),#fff);position:fixed;left:0;right:0;top:0;bottom:0;z-index:1}#bookread[data-v-5de50817]{position:relative;overflow:hidden}img[data-v-5de50817]{width:100%}.downDown[data-v-5de50817]{position:fixed;width:100%;height:100%;left:0;top:0;padding-top:5.5rem;z-index:100;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box}.downApp[data-v-5de50817]{position:fixed;width:12rem;height:12rem;overflow:hidden;-webkit-border-radius:6rem;-moz-border-radius:6rem;-o-border-radius:6rem;border-radius:6rem;left:50%;top:50%;margin-left:-6rem;margin-top:-6rem;background-image:url("/src/assets/Img/fixdown.jpg");background-repeat:no-repeat;background-position:-6rem -6rem;background-size:150%}.downApp .dd[data-v-5de50817]{font-size:1.6rem;color:#fff;position:absolute;bottom:2.5rem;left:4rem}.downApp .close[data-v-5de50817]{font-size:1.2rem;color:#fff;position:absolute;left:5.8rem;top:1rem}.heartBeat[data-v-5de50817]{-webkit-animation-name:heartBeat-data-v-5de50817;animation-name:heartBeat-data-v-5de50817;-webkit-animation-duration:1.3s;animation-duration:1.3s;-webkit-animation-timing-function:ease-in-out;animation-timing-function:ease-in-out;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}@-webkit-keyframes heartBeat-data-v-5de50817{0%{-webkit-transform:scale(1);transform:scale(1)}14%{-webkit-transform:scale(1.3);transform:scale(1.3)}28%{-webkit-transform:scale(1);transform:scale(1)}42%{-webkit-transform:scale(1.3);transform:scale(1.3)}70%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes heartBeat-data-v-5de50817{0%{-webkit-transform:scale(1);transform:scale(1)}14%{-webkit-transform:scale(1.3);transform:scale(1.3)}28%{-webkit-transform:scale(1);transform:scale(1)}42%{-webkit-transform:scale(1.3);transform:scale(1.3)}70%{-webkit-transform:scale(1);transform:scale(1)}}.addHomePopIos[data-v-5de50817]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.7);z-index:99}.addHomePopIosB[data-v-5de50817]{top:3rem;bottom:0;background-color:rgba(0,0,0,.5)}.addHomeConIos[data-v-5de50817],.addHomePopIosB[data-v-5de50817]{position:fixed;width:100%;max-width:640px;z-index:999999999999999}.addHomeConIos[data-v-5de50817]{bottom:1.5rem}.addHomeInfoIos[data-v-5de50817]{position:relative;margin:0 .7rem;padding:.7rem;border-radius:5px;background-color:#fff;color:#212121;font-size:.75rem;letter-spacing:-1px}.ApplogoIos[data-v-5de50817]{width:1.5rem;margin-right:.5rem}.showInfoIos[data-v-5de50817]{position:absolute;width:1.5rem;height:1.5rem;bottom:-.7rem;left:50%;margin-left:-.7rem;border-radius:3px;background-color:#fff;transform:rotate(45deg)}.page-hr[data-v-5de50817]{width:100%;height:10px;background-color:#ccc;border-top:2px solid rgba(0,0,0,.1)}', ""])
    },
    552: function(t, e, i) {
        "use strict";
        function a(t) {
            i(553)
        }
        var o = i(496)
          , n = i(555)
          , s = i(28)
          , r = a
          , d = s(o.a, n.a, !1, r, "data-v-6fe53e02", null);
        e.a = d.exports
    },
    553: function(t, e, i) {
        var a = i(554);
        "string" == typeof a && (a = [[t.i, a, ""]]),
        a.locals && (t.exports = a.locals);
        i(14)("8070687c", a, !0, {})
    },
    554: function(t, e, i) {
        e = t.exports = i(13)(!1),
        e.push([t.i, "ul[data-v-6fe53e02]{display:flex;display:-webkit-flex;max-height:8rem;overflow:hidden}ul>li[data-v-6fe53e02]{flex:1;-webkit-flex:1;max-height:8rem;overflow:hidden}ul>li[data-v-6fe53e02]:not(:first-child){padding-left:.2rem}ul>li img[data-v-6fe53e02]{width:100%;height:100%}", ""])
    },
    555: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return t.show ? i("div", {
                attrs: {
                    id: "BookreadFooter"
                }
            }, [i("ul", {
                staticClass: "clearfix"
            }, t._l(t.bookInfo, function(e, a) {
                return i("li", {
                    key: a,
                    staticClass: "fl",
                    on: {
                        click: function(e) {
                            return e.stopPropagation(),
                            t.go_down()
                        }
                    }
                }, [i("div", [i("imgLoader", {
                    attrs: {
                        domain: t.imgsBoot[t.countNum],
                        src: e,
                        alt: t.countNum + " " + a
                    },
                    on: {
                        load: function(e) {
                            return t.imgload(a)
                        }
                    }
                })], 1)])
            }), 0)]) : t._e()
        }
          , o = []
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    },
    556: function(t, e, i) {
        !function(e, i) {
            t.exports = i()
        }("undefined" != typeof self && self, function() {
            return function(t) {
                function e(t) {
                    delete installedChunks[t]
                }
                function i(t) {
                    var e = document.getElementsByTagName("head")[0]
                      , i = document.createElement("script");
                    i.type = "text/javascript",
                    i.charset = "utf-8",
                    i.src = p.p + "" + t + "." + _ + ".hot-update.js",
                    e.appendChild(i)
                }
                function a(t) {
                    return t = t || 1e4,
                    new Promise(function(e, i) {
                        if ("undefined" == typeof XMLHttpRequest)
                            return i(new Error("No browser support"));
                        try {
                            var a = new XMLHttpRequest
                              , o = p.p + "" + _ + ".hot-update.json";
                            a.open("GET", o, !0),
                            a.timeout = t,
                            a.send(null)
                        } catch (t) {
                            return i(t)
                        }
                        a.onreadystatechange = function() {
                            if (4 === a.readyState)
                                if (0 === a.status)
                                    i(new Error("Manifest request to " + o + " timed out."));
                                else if (404 === a.status)
                                    e();
                                else if (200 !== a.status && 304 !== a.status)
                                    i(new Error("Manifest request to " + o + " failed."));
                                else {
                                    try {
                                        var t = JSON.parse(a.responseText)
                                    } catch (t) {
                                        return void i(t)
                                    }
                                    e(t)
                                }
                        }
                    }
                    )
                }
                function o(t) {
                    var e = $[t];
                    if (!e)
                        return p;
                    var i = function(i) {
                        return e.hot.active ? ($[i] ? $[i].parents.indexOf(t) < 0 && $[i].parents.push(t) : (k = [t],
                        m = i),
                        e.children.indexOf(i) < 0 && e.children.push(i)) : (console.warn("[HMR] unexpected require(" + i + ") from disposed module " + t),
                        k = []),
                        p(i)
                    };
                    for (var a in p)
                        Object.prototype.hasOwnProperty.call(p, a) && "e" !== a && Object.defineProperty(i, a, function(t) {
                            return {
                                configurable: !0,
                                enumerable: !0,
                                get: function() {
                                    return p[t]
                                },
                                set: function(e) {
                                    p[t] = e
                                }
                            }
                        }(a));
                    return i.e = function(t) {
                        function e() {
                            D--,
                            "prepare" === S && (P[t] || c(t),
                            0 === D && 0 === L && h())
                        }
                        return "ready" === S && s("prepare"),
                        D++,
                        p.e(t).then(e, function(t) {
                            throw e(),
                            t
                        })
                    }
                    ,
                    i
                }
                function n(t) {
                    var e = {
                        _acceptedDependencies: {},
                        _declinedDependencies: {},
                        _selfAccepted: !1,
                        _selfDeclined: !1,
                        _disposeHandlers: [],
                        _main: m !== t,
                        active: !0,
                        accept: function(t, i) {
                            if (void 0 === t)
                                e._selfAccepted = !0;
                            else if ("function" == typeof t)
                                e._selfAccepted = t;
                            else if ("object" == typeof t)
                                for (var a = 0; a < t.length; a++)
                                    e._acceptedDependencies[t[a]] = i || function() {}
                                    ;
                            else
                                e._acceptedDependencies[t] = i || function() {}
                        },
                        decline: function(t) {
                            if (void 0 === t)
                                e._selfDeclined = !0;
                            else if ("object" == typeof t)
                                for (var i = 0; i < t.length; i++)
                                    e._declinedDependencies[t[i]] = !0;
                            else
                                e._declinedDependencies[t] = !0
                        },
                        dispose: function(t) {
                            e._disposeHandlers.push(t)
                        },
                        addDisposeHandler: function(t) {
                            e._disposeHandlers.push(t)
                        },
                        removeDisposeHandler: function(t) {
                            var i = e._disposeHandlers.indexOf(t);
                            i >= 0 && e._disposeHandlers.splice(i, 1)
                        },
                        check: d,
                        apply: u,
                        status: function(t) {
                            if (!t)
                                return S;
                            I.push(t)
                        },
                        addStatusHandler: function(t) {
                            I.push(t)
                        },
                        removeStatusHandler: function(t) {
                            var e = I.indexOf(t);
                            e >= 0 && I.splice(e, 1)
                        },
                        data: y[t]
                    };
                    return m = void 0,
                    e
                }
                function s(t) {
                    S = t;
                    for (var e = 0; e < I.length; e++)
                        I[e].call(null, t)
                }
                function r(t) {
                    return +t + "" === t ? +t : t
                }
                function d(t) {
                    if ("idle" !== S)
                        throw new Error("check() is only allowed in idle status");
                    return b = t,
                    s("check"),
                    a(x).then(function(t) {
                        if (!t)
                            return s("idle"),
                            null;
                        E = {},
                        P = {},
                        T = t.c,
                        w = t.h,
                        s("prepare");
                        var e = new Promise(function(t, e) {
                            g = {
                                resolve: t,
                                reject: e
                            }
                        }
                        );
                        return v = {},
                        c(1),
                        "prepare" === S && 0 === D && 0 === L && h(),
                        e
                    })
                }
                function l(t, e) {
                    if (T[t] && E[t]) {
                        E[t] = !1;
                        for (var i in e)
                            Object.prototype.hasOwnProperty.call(e, i) && (v[i] = e[i]);
                        0 == --L && 0 === D && h()
                    }
                }
                function c(t) {
                    T[t] ? (E[t] = !0,
                    L++,
                    i(t)) : P[t] = !0
                }
                function h() {
                    s("ready");
                    var t = g;
                    if (g = null,
                    t)
                        if (b)
                            Promise.resolve().then(function() {
                                return u(b)
                            }).then(function(e) {
                                t.resolve(e)
                            }, function(e) {
                                t.reject(e)
                            });
                        else {
                            var e = [];
                            for (var i in v)
                                Object.prototype.hasOwnProperty.call(v, i) && e.push(r(i));
                            t.resolve(e)
                        }
                }
                function u(i) {
                    function a(t, e) {
                        for (var i = 0; i < e.length; i++) {
                            var a = e[i];
                            t.indexOf(a) < 0 && t.push(a)
                        }
                    }
                    if ("ready" !== S)
                        throw new Error("apply() is only allowed in ready status");
                    i = i || {};
                    var o, n, d, l, c, h = {}, u = [], f = {}, m = function() {
                        console.warn("[HMR] unexpected require(" + b.moduleId + ") to disposed module")
                    };
                    for (var g in v)
                        if (Object.prototype.hasOwnProperty.call(v, g)) {
                            c = r(g);
                            var b;
                            b = v[g] ? function(t) {
                                for (var e = [t], i = {}, o = e.slice().map(function(t) {
                                    return {
                                        chain: [t],
                                        id: t
                                    }
                                }); o.length > 0; ) {
                                    var n = o.pop()
                                      , s = n.id
                                      , r = n.chain;
                                    if ((l = $[s]) && !l.hot._selfAccepted) {
                                        if (l.hot._selfDeclined)
                                            return {
                                                type: "self-declined",
                                                chain: r,
                                                moduleId: s
                                            };
                                        if (l.hot._main)
                                            return {
                                                type: "unaccepted",
                                                chain: r,
                                                moduleId: s
                                            };
                                        for (var d = 0; d < l.parents.length; d++) {
                                            var c = l.parents[d]
                                              , h = $[c];
                                            if (h) {
                                                if (h.hot._declinedDependencies[s])
                                                    return {
                                                        type: "declined",
                                                        chain: r.concat([c]),
                                                        moduleId: s,
                                                        parentId: c
                                                    };
                                                e.indexOf(c) >= 0 || (h.hot._acceptedDependencies[s] ? (i[c] || (i[c] = []),
                                                a(i[c], [s])) : (delete i[c],
                                                e.push(c),
                                                o.push({
                                                    chain: r.concat([c]),
                                                    id: c
                                                })))
                                            }
                                        }
                                    }
                                }
                                return {
                                    type: "accepted",
                                    moduleId: t,
                                    outdatedModules: e,
                                    outdatedDependencies: i
                                }
                            }(c) : {
                                type: "disposed",
                                moduleId: g
                            };
                            var x = !1
                              , C = !1
                              , I = !1
                              , L = "";
                            switch (b.chain && (L = "\nUpdate propagation: " + b.chain.join(" -> ")),
                            b.type) {
                            case "self-declined":
                                i.onDeclined && i.onDeclined(b),
                                i.ignoreDeclined || (x = new Error("Aborted because of self decline: " + b.moduleId + L));
                                break;
                            case "declined":
                                i.onDeclined && i.onDeclined(b),
                                i.ignoreDeclined || (x = new Error("Aborted because of declined dependency: " + b.moduleId + " in " + b.parentId + L));
                                break;
                            case "unaccepted":
                                i.onUnaccepted && i.onUnaccepted(b),
                                i.ignoreUnaccepted || (x = new Error("Aborted because " + c + " is not accepted" + L));
                                break;
                            case "accepted":
                                i.onAccepted && i.onAccepted(b),
                                C = !0;
                                break;
                            case "disposed":
                                i.onDisposed && i.onDisposed(b),
                                I = !0;
                                break;
                            default:
                                throw new Error("Unexception type " + b.type)
                            }
                            if (x)
                                return s("abort"),
                                Promise.reject(x);
                            if (C) {
                                f[c] = v[c],
                                a(u, b.outdatedModules);
                                for (c in b.outdatedDependencies)
                                    Object.prototype.hasOwnProperty.call(b.outdatedDependencies, c) && (h[c] || (h[c] = []),
                                    a(h[c], b.outdatedDependencies[c]))
                            }
                            I && (a(u, [b.moduleId]),
                            f[c] = m)
                        }
                    var D = [];
                    for (n = 0; n < u.length; n++)
                        c = u[n],
                        $[c] && $[c].hot._selfAccepted && D.push({
                            module: c,
                            errorHandler: $[c].hot._selfAccepted
                        });
                    s("dispose"),
                    Object.keys(T).forEach(function(t) {
                        !1 === T[t] && e(t)
                    });
                    for (var P, E = u.slice(); E.length > 0; )
                        if (c = E.pop(),
                        l = $[c]) {
                            var z = {}
                              , H = l.hot._disposeHandlers;
                            for (d = 0; d < H.length; d++)
                                (o = H[d])(z);
                            for (y[c] = z,
                            l.hot.active = !1,
                            delete $[c],
                            delete h[c],
                            d = 0; d < l.children.length; d++) {
                                var N = $[l.children[d]];
                                N && (P = N.parents.indexOf(c)) >= 0 && N.parents.splice(P, 1)
                            }
                        }
                    var O, B;
                    for (c in h)
                        if (Object.prototype.hasOwnProperty.call(h, c) && (l = $[c]))
                            for (B = h[c],
                            d = 0; d < B.length; d++)
                                O = B[d],
                                (P = l.children.indexOf(O)) >= 0 && l.children.splice(P, 1);
                    s("apply"),
                    _ = w;
                    for (c in f)
                        Object.prototype.hasOwnProperty.call(f, c) && (t[c] = f[c]);
                    var j = null;
                    for (c in h)
                        if (Object.prototype.hasOwnProperty.call(h, c) && (l = $[c])) {
                            B = h[c];
                            var M = [];
                            for (n = 0; n < B.length; n++)
                                if (O = B[n],
                                o = l.hot._acceptedDependencies[O]) {
                                    if (M.indexOf(o) >= 0)
                                        continue;
                                    M.push(o)
                                }
                            for (n = 0; n < M.length; n++) {
                                o = M[n];
                                try {
                                    o(B)
                                } catch (t) {
                                    i.onErrored && i.onErrored({
                                        type: "accept-errored",
                                        moduleId: c,
                                        dependencyId: B[n],
                                        error: t
                                    }),
                                    i.ignoreErrored || j || (j = t)
                                }
                            }
                        }
                    for (n = 0; n < D.length; n++) {
                        var R = D[n];
                        c = R.module,
                        k = [c];
                        try {
                            p(c)
                        } catch (t) {
                            if ("function" == typeof R.errorHandler)
                                try {
                                    R.errorHandler(t)
                                } catch (e) {
                                    i.onErrored && i.onErrored({
                                        type: "self-accept-error-handler-errored",
                                        moduleId: c,
                                        error: e,
                                        orginalError: t,
                                        originalError: t
                                    }),
                                    i.ignoreErrored || j || (j = e),
                                    j || (j = t)
                                }
                            else
                                i.onErrored && i.onErrored({
                                    type: "self-accept-errored",
                                    moduleId: c,
                                    error: t
                                }),
                                i.ignoreErrored || j || (j = t)
                        }
                    }
                    return j ? (s("fail"),
                    Promise.reject(j)) : (s("idle"),
                    new Promise(function(t) {
                        t(u)
                    }
                    ))
                }
                function p(e) {
                    if ($[e])
                        return $[e].exports;
                    var i = $[e] = {
                        i: e,
                        l: !1,
                        exports: {},
                        hot: n(e),
                        parents: (C = k,
                        k = [],
                        C),
                        children: []
                    };
                    return t[e].call(i.exports, i, i.exports, o(e)),
                    i.l = !0,
                    i.exports
                }
                var f = window.webpackHotUpdatevueConciseSlider;
                window.webpackHotUpdatevueConciseSlider = function(t, e) {
                    l(t, e),
                    f && f(t, e)
                }
                ;
                var m, g, v, w, b = !0, _ = "a42a8336a0bb66e88868", x = 1e4, y = {}, k = [], C = [], I = [], S = "idle", L = 0, D = 0, P = {}, E = {}, T = {}, $ = {};
                return p.m = t,
                p.c = $,
                p.d = function(t, e, i) {
                    p.o(t, e) || Object.defineProperty(t, e, {
                        configurable: !1,
                        enumerable: !0,
                        get: i
                    })
                }
                ,
                p.n = function(t) {
                    var e = t && t.__esModule ? function() {
                        return t.default
                    }
                    : function() {
                        return t
                    }
                    ;
                    return p.d(e, "a", e),
                    e
                }
                ,
                p.o = function(t, e) {
                    return Object.prototype.hasOwnProperty.call(t, e)
                }
                ,
                p.p = "",
                p.h = function() {
                    return _
                }
                ,
                o(14)(p.s = 14)
            }([function(t, e) {
                t.exports = function(t, e, i, a, o) {
                    var n, s = t = t || {}, r = typeof t.default;
                    "object" !== r && "function" !== r || (n = t,
                    s = t.default);
                    var d = "function" == typeof s ? s.options : s;
                    e && (d.render = e.render,
                    d.staticRenderFns = e.staticRenderFns),
                    a && (d._scopeId = a);
                    var l;
                    if (o ? (l = function(t) {
                        t = t || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext,
                        t || "undefined" == typeof __VUE_SSR_CONTEXT__ || (t = __VUE_SSR_CONTEXT__),
                        i && i.call(this, t),
                        t && t._registeredComponents && t._registeredComponents.add(o)
                    }
                    ,
                    d._ssrRegister = l) : i && (l = i),
                    l) {
                        var c = d.functional
                          , h = c ? d.render : d.beforeCreate;
                        c ? d.render = function(t, e) {
                            return l.call(e),
                            h(t, e)
                        }
                        : d.beforeCreate = h ? [].concat(h, l) : [l]
                    }
                    return {
                        esModule: n,
                        exports: s,
                        options: d
                    }
                }
            }
            , function(t, e) {
                t.exports = function() {
                    var t = [];
                    return t.toString = function() {
                        for (var t = [], e = 0; e < this.length; e++) {
                            var i = this[e];
                            i[2] ? t.push("@media " + i[2] + "{" + i[1] + "}") : t.push(i[1])
                        }
                        return t.join("")
                    }
                    ,
                    t.i = function(e, i) {
                        "string" == typeof e && (e = [[null, e, ""]]);
                        for (var a = {}, o = 0; o < this.length; o++) {
                            var n = this[o][0];
                            "number" == typeof n && (a[n] = !0)
                        }
                        for (o = 0; o < e.length; o++) {
                            var s = e[o];
                            "number" == typeof s[0] && a[s[0]] || (i && !s[2] ? s[2] = i : i && (s[2] = "(" + s[2] + ") and (" + i + ")"),
                            t.push(s))
                        }
                    }
                    ,
                    t
                }
            }
            , function(t, e, i) {
                function a(t) {
                    for (var e = 0; e < t.length; e++) {
                        var i = t[e]
                          , a = c[i.id];
                        if (a) {
                            a.refs++;
                            for (var o = 0; o < a.parts.length; o++)
                                a.parts[o](i.parts[o]);
                            for (; o < i.parts.length; o++)
                                a.parts.push(n(i.parts[o]));
                            a.parts.length > i.parts.length && (a.parts.length = i.parts.length)
                        } else {
                            for (var s = [], o = 0; o < i.parts.length; o++)
                                s.push(n(i.parts[o]));
                            c[i.id] = {
                                id: i.id,
                                refs: 1,
                                parts: s
                            }
                        }
                    }
                }
                function o() {
                    var t = document.createElement("style");
                    return t.type = "text/css",
                    h.appendChild(t),
                    t
                }
                function n(t) {
                    var e, i, a = document.querySelector("style[" + v + '~="' + t.id + '"]');
                    if (a) {
                        if (f)
                            return m;
                        a.parentNode.removeChild(a)
                    }
                    if (w) {
                        var n = p++;
                        a = u || (u = o()),
                        e = s.bind(null, a, n, !1),
                        i = s.bind(null, a, n, !0)
                    } else
                        a = o(),
                        e = r.bind(null, a),
                        i = function() {
                            a.parentNode.removeChild(a)
                        }
                        ;
                    return e(t),
                    function(a) {
                        if (a) {
                            if (a.css === t.css && a.media === t.media && a.sourceMap === t.sourceMap)
                                return;
                            e(t = a)
                        } else
                            i()
                    }
                }
                function s(t, e, i, a) {
                    var o = i ? "" : a.css;
                    if (t.styleSheet)
                        t.styleSheet.cssText = b(e, o);
                    else {
                        var n = document.createTextNode(o)
                          , s = t.childNodes;
                        s[e] && t.removeChild(s[e]),
                        s.length ? t.insertBefore(n, s[e]) : t.appendChild(n)
                    }
                }
                function r(t, e) {
                    var i = e.css
                      , a = e.media
                      , o = e.sourceMap;
                    if (a && t.setAttribute("media", a),
                    g.ssrId && t.setAttribute(v, e.id),
                    o && (i += "\n/*# sourceURL=" + o.sources[0] + " */",
                    i += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + " */"),
                    t.styleSheet)
                        t.styleSheet.cssText = i;
                    else {
                        for (; t.firstChild; )
                            t.removeChild(t.firstChild);
                        t.appendChild(document.createTextNode(i))
                    }
                }
                var d = "undefined" != typeof document;
                if ("undefined" != typeof DEBUG && DEBUG && !d)
                    throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
                var l = i(7)
                  , c = {}
                  , h = d && (document.head || document.getElementsByTagName("head")[0])
                  , u = null
                  , p = 0
                  , f = !1
                  , m = function() {}
                  , g = null
                  , v = "data-vue-ssr-id"
                  , w = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
                t.exports = function(t, e, i, o) {
                    f = i,
                    g = o || {};
                    var n = l(t, e);
                    return a(n),
                    function(e) {
                        for (var i = [], o = 0; o < n.length; o++) {
                            var s = n[o]
                              , r = c[s.id];
                            r.refs--,
                            i.push(r)
                        }
                        e ? (n = l(t, e),
                        a(n)) : n = [];
                        for (var o = 0; o < i.length; o++) {
                            var r = i[o];
                            if (0 === r.refs) {
                                for (var d = 0; d < r.parts.length; d++)
                                    r.parts[d]();
                                delete c[r.id]
                            }
                        }
                    }
                }
                ;
                var b = function() {
                    var t = [];
                    return function(e, i) {
                        return t[e] = i,
                        t.filter(Boolean).join("\n")
                    }
                }()
            }
            , function(t, e, i) {
                "use strict";
                function a(t) {
                    i(5)
                }
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var o = i(8)
                  , n = i.n(o)
                  , s = i(11)
                  , r = i(0)
                  , d = a
                  , l = r(n.a, s.a, d, null, null);
                e.default = l.exports
            }
            , function(t, e, i) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var a = i(12)
                  , o = i.n(a)
                  , n = i(13)
                  , s = i(0)
                  , r = s(o.a, n.a, null, null, null);
                e.default = r.exports
            }
            , function(t, e, i) {
                var a = i(6);
                "string" == typeof a && (a = [[t.i, a, ""]]),
                a.locals && (t.exports = a.locals),
                i(2)("7b43aed2", a, !0, {})
            }
            , function(t, e, i) {
                e = t.exports = i(1)(),
                e.push([t.i, ".slider-container{margin:0 auto;overflow:hidden;z-index:1;height:100%;width:100%;position:relative;white-space:nowrap}.slider-center-center{margin:auto;z-index:1;position:absolute;top:0;left:0;right:0;bottom:0}.slider-touch{height:100%}.swiper-container-horizontal>*>.slider-wrapper{-moz-flex-direction:row;-ms-flex-direction:row;-o-flex-direction:row;flex-direction:row}.swiper-container-horizontal>*>.slider-wrapper,.swiper-container-vertical>*>.slider-wrapper{box-sizing:content-box;display:flex;height:100%;position:relative;transition-property:transform;width:100%;z-index:1;align-items:center}.swiper-container-vertical>*>.slider-wrapper{-moz-flex-direction:column;-ms-flex-direction:column;-o-flex-direction:column;flex-direction:column}.slider-item{flex-shrink:0;height:100%;position:relative;width:100%;align-items:center;display:flex;font-size:40px;justify-content:center;text-align:center;color:#fff}.slider-fade .slider-item{position:absolute;left:0;opacity:0}.slider-pagination{position:absolute;text-align:center;transform:translateZ(0);z-index:10}.swiper-container-horizontal>.slider-pagination-bullets{bottom:10px;left:0;width:100%}.swiper-container-horizontal>*>.slider-pagination-bullet{background:#000 none repeat scroll 0 0;border-radius:100%;display:inline-block;height:8px;opacity:.2;width:8px;cursor:pointer;margin:0 5px}.swiper-container-vertical>.slider-pagination-bullets{left:0;bottom:auto;left:auto;width:auto;right:10px;top:50%;transform:translate3d(0,-50%,0)}.swiper-container-vertical>*>.slider-pagination-bullet{background:#000 none repeat scroll 0 0;border-radius:100%;height:8px;opacity:.2;width:8px;cursor:pointer;display:block;margin:5px 0}.swiper-container-horizontal .slider-pagination-bullet-active,.swiper-container-vertical .slider-pagination-bullet-active{background:#fff none repeat scroll 0 0;opacity:1}.slider-loading{position:absolute;top:50%;transform:translateY(-50%);z-index:999}.swiper-container-cursorGrab{cursor:grab}", ""])
            }
            , function(t, e) {
                t.exports = function(t, e) {
                    for (var i = [], a = {}, o = 0; o < e.length; o++) {
                        var n = e[o]
                          , s = n[0]
                          , r = n[1]
                          , d = n[2]
                          , l = n[3]
                          , c = {
                            id: t + ":" + o,
                            css: r,
                            media: d,
                            sourceMap: l
                        };
                        a[s] ? a[s].parts.push(c) : i.push(a[s] = {
                            id: s,
                            parts: [c]
                        })
                    }
                    return i
                }
            }
            , function(t, e, i) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                });
                var a = i(9)
                  , o = function(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    }
                }(a);
                e.default = {
                    props: {
                        options: {
                            type: Object,
                            default: function() {
                                return {}
                            }
                        },
                        pages: {
                            type: Array,
                            default: function() {
                                return []
                            }
                        }
                    },
                    name: "slider",
                    data: function() {
                        return {
                            data: {
                                poswidth: 0,
                                posheight: 0,
                                start: {},
                                end: {},
                                currentPage: this.options.currentPage || 0,
                                direction: ""
                            },
                            s_data: {
                                prefixes: (0,
                                o.default)(),
                                transitionEnding: !1,
                                itemTransitionEnding: !1,
                                setIntervalid: "",
                                renderTime: "",
                                sliderLength: 0,
                                effect: this.options.effect || "slide",
                                direction: this.options.direction || "horizontal",
                                tracking: !1,
                                thresholdDistance: this.options.thresholdDistance || 100,
                                thresholdTime: this.options.thresholdTime || 500,
                                animation: !1,
                                itemAnimation: this.options.itemAnimation || !1,
                                loading: !1,
                                containerClass: {
                                    "swiper-container-vertical": !1,
                                    "swiper-container-cursorGrab": this.options.grabCursor || !1
                                },
                                pageInit: !1,
                                widthScalingRatio: this.options.widthScalingRatio || .8,
                                heightScalingRatio: this.options.heightScalingRatio || .8,
                                deviation: this.options.deviation || 200,
                                currentPage: this.options.currentPage || 0,
                                pageWidth: 0,
                                pageHeight: 0,
                                onSlide: !1,
                                onSlideEnd: !0,
                                sliderItem: "",
                                pagination: void 0 === this.options.pagination || this.options.pagination,
                                nested: void 0 === this.options.nested || this.options.nested,
                                resize: void 0 === this.options.resize || this.options.resize,
                                freeze: void 0 !== this.options.freeze && this.options.freeze,
                                slidesPerView: void 0 === this.options.slidesPerView ? 0 : this.options.slidesPerView,
                                $parent: this.judgeParentSlider(this),
                                route: !1,
                                lastPage: this.options.currentPage || 0,
                                e: void 0
                            }
                        }
                    },
                    watch: {
                        $route: function() {
                            var t = this;
                            if (t.route) {
                                var e = t.data.currentPage
                                  , i = t.s_data.sliderLength;
                                t.s_data.transitionEnding = !1,
                                e < 0 ? t.slide(0, "animationnone") : e >= (t.pagenums || i) ? t.slide(i - 1, "animationnone") : t.slide(e, "animationnone"),
                                t.options.autoplay && t.clock().begin(t),
                                t.route = !1
                            } else
                                t.route = !0,
                                t.options.autoplay && t.clock().stop(t)
                        }
                    },
                    computed: {
                        styleobj: function() {
                            var t = {};
                            return t.transform = "translate3D(" + this.data.poswidth + "px," + this.data.posheight + "px,0)",
                            t[this.s_data.prefixes.transition + "TimingFunction"] = this.options.timingFunction || "ease",
                            t[this.s_data.prefixes.transition + "Duration"] = (this.s_data.animation ? this.options.speed || 300 : 0) + "ms",
                            "fade" === this.s_data.effect || "coverflow" === this.s_data.effect ? {} : t
                        },
                        pagenums: function() {
                            return (this.pages.length || 0 !== this.s_data.sliderLength) && this.s_data.pageInit,
                            this.pages.length
                        },
                        currentWidth: {
                            get: function() {
                                if (!this.pages.length && 0 === this.s_data.sliderLength || "fade" === this.s_data.effect || "coverflow" === this.s_data.effect)
                                    return 0;
                                var t = void 0
                                  , e = this.data.currentPage
                                  , i = this.s_data.pageWidth
                                  , a = this.options.loopedSlides || 1;
                                this.options.loop && (e += a ? a <= (this.pagenums || this.s_data.sliderLength) ? a : this.pagenums || this.s_data.sliderLength : 1),
                                "coverflow" === this.options.effect && (e -= 1);
                                for (var o in this.$el.children)
                                    /slider-touch/gi.test(this.$el.children[o].className) && (t = this.$el.children[o]);
                                try {
                                    var n = t.children[0].children
                                      , s = n[e].offsetLeft;
                                    this.options.loop && (s = n[e].offsetLeft);
                                    var r = n[e].offsetWidth;
                                    if (!r)
                                        throw new Error("找不到当前滑动元素，停止滑动");
                                    var d = this.options.slidesPerView
                                      , l = this.s_data.sliderLength;
                                    if (this.options.centeredSlides)
                                        if (d) {
                                            var c = this.data.currentPage
                                              , h = parseInt((d - 1) / 2);
                                            c - h <= 0 ? c = 0 : c + h >= l ? c = l - d : c -= h,
                                            s = n[c].offsetLeft
                                        } else
                                            s = s - i / 2 + r / 2;
                                    if (!this.options.centeredSlides && d) {
                                        var u = this.data.currentPage
                                          , p = this.options.slidesToScroll || 1;
                                        u + p >= l && (s = n[l - p].offsetLeft)
                                    }
                                    return s + i - i
                                } catch (t) {
                                    var f = this;
                                    console.warn(t),
                                    console.warn("滑动报错，停止滑动及轮播"),
                                    this.data.currentPage = this.s_data.lastPage,
                                    this.options.autoplay = 0,
                                    this.clock().stop(f)
                                }
                            }
                        },
                        currentHeight: function() {
                            var t = this.s_data.sliderLength
                              , e = this.data.currentPage
                              , i = this.pages.length
                              , a = 0
                              , o = void 0
                              , n = e - 1
                              , s = this.s_data.pageWidth
                              , r = this.options.loopedSlides || 1;
                            if (!i && 0 === t || "fade" === this.s_data.effect)
                                return 0;
                            this.options.loop && (n = r ? e + (r <= (i || t) ? r : i || t) - 1 : e + 1);
                            for (var d in this.$el.children)
                                /slider-touch/gi.test(this.$el.children[d].className) && (o = this.$el.children[d]);
                            var l = o.children[0].children;
                            for (var c in l)
                                c <= n && (a += l[c].offsetHeight,
                                a += parseInt(l[c].style.marginTop || 0),
                                a += parseInt(l[c].style.marginBottom || 0));
                            return a + s - s
                        },
                        classObject: function() {
                            var t = {};
                            switch (this.options.effect) {
                            case "fade":
                                t = {
                                    "slider-fade": !0
                                }
                            }
                            return t
                        }
                    },
                    mounted: function() {
                        var t = this
                          , e = this;
                        this.s_data.pageWidth = this.$el.offsetWidth,
                        this.s_data.pageHeight = this.$el.offsetHeight,
                        this.$emit("init", this.data),
                        this.$on("slideTo", function(e) {
                            t.data.direction = "slideTo",
                            t.slide(e, "slideTo")
                        }),
                        this.$on("slideNext", function() {
                            t.next()
                        }),
                        this.$on("slidePre", function() {
                            t.pre()
                        }),
                        this.$on("autoplayStart", function(i) {
                            t.options.autoplay = i || t.options.autoplay || 1e3,
                            t.clock().begin(e)
                        }),
                        this.$on("autoplayStop", function() {
                            t.options.autoplay = 0,
                            t.clock().stop(e)
                        }),
                        this.$on("loadingShow", function() {
                            t.s_data.loading = !0
                        }),
                        this.$on("loadingHide", function() {
                            t.s_data.loading = !1
                        }),
                        this.options.autoplay && this.s_data.sliderLength && this.clock().begin(e),
                        document.addEventListener("visibilitychange", this.visibilitychange, !1),
                        "vertical" === this.options.direction ? this.s_data.containerClass["swiper-container-vertical"] = !0 : this.s_data.containerClass["swiper-container-horizontal"] = !0,
                        this.s_data.resize && window.addEventListener("resize", this.resize)
                    },
                    beforeDestroy: function() {
                        this.options.autoplay && this.clock().stop(this),
                        !0 === this.options.preventDocumentMove && document.removeEventListener("touchmove", this.preventDefault),
                        document.removeEventListener("visibilitychange", this.visibilitychange, !1),
                        window.removeEventListener("resize", this.resize)
                    },
                    methods: {
                        visibilitychange: function() {
                            var t = this;
                            document.hidden ? t.options.autoplay && t.clock().stop(t) : t.options.autoplay && t.clock().begin(t)
                        },
                        resize: function() {
                            if (this.s_data.pageWidth = this.$el.offsetWidth,
                            this.s_data.pageHeight = this.$el.offsetHeight,
                            this.data.currentPage >= this.s_data.sliderLength && this.options.loop)
                                return this.slide(0, "animationnone"),
                                !1;
                            this.slide(this.data.currentPage, "animationnone")
                        },
                        swipeStart: function(t) {
                            var e = this;
                            if (this.s_data.e = t,
                            !this.s_data.freeze && !this.s_data.transitionEnding && !(this.s_data.transitionEnding || this.s_data.itemTransitionEnding && this.options.itemAnimation))
                                if (this.s_data.animation = !1,
                                this.options.autoplay && this.clock().stop(e),
                                !0 === this.options.preventDocumentMove && document.addEventListener("touchmove", e.preventDefault(t)),
                                "touchstart" === t.type) {
                                    if (t.touches.length > 1)
                                        return this.s_data.tracking = !1,
                                        !1;
                                    this.s_data.tracking = !0,
                                    this.data.start.t = (new Date).getTime(),
                                    this.data.start.x = t.targetTouches[0].clientX,
                                    this.data.start.y = t.targetTouches[0].clientY,
                                    this.data.end.x = t.targetTouches[0].clientX,
                                    this.data.end.y = t.targetTouches[0].clientY
                                } else
                                    this.s_data.tracking = !0,
                                    this.data.start.t = (new Date).getTime(),
                                    this.data.start.x = t.clientX,
                                    this.data.start.y = t.clientY,
                                    this.data.end.x = t.clientX,
                                    this.data.end.y = t.clientY
                        },
                        swipeMove: function(t) {
                            if (this.s_data.e = t,
                            this.s_data.tracking) {
                                var e = this.s_data.effect
                                  , i = this.s_data.$parent;
                                "touchmove" === t.type ? (this.data.end.x = t.targetTouches[0].clientX,
                                this.data.end.y = t.targetTouches[0].clientY) : (this.data.end.x = t.clientX,
                                this.data.end.y = t.clientY);
                                var a = Math.abs(this.data.end.x - this.data.start.x)
                                  , o = Math.abs(this.data.end.y - this.data.start.y);
                                if (a >= o && "vertical" !== this.options.direction && t.cancelable ? t.preventDefault() : a <= o && "vertical" === this.options.direction && t.cancelable && t.preventDefault(),
                                i && i.s_data.direction === this.s_data.direction && t.stopPropagation(),
                                "fade" === e || "coverflow" === e)
                                    return;
                                if ("vertical" === this.options.direction) {
                                    if (a > o)
                                        return;
                                    i && "vertical" === i.options.direction && 0 === this.data.currentPage && this.data.end.y - this.data.start.y >= 0 && i.s_data.nested && (!i.options.preventRebound || 0 !== i.data.currentPage) ? i.data.posheight = -i.currentHeight + this.data.end.y - this.data.start.y : i && "vertical" === i.options.direction && this.data.currentPage === this.s_data.sliderLength - 1 && this.data.end.y - this.data.start.y <= 0 && i.s_data.nested && (!i.options.preventRebound || i.data.currentPage !== i.s_data.sliderLength - 1) ? i.data.posheight = -i.currentHeight + this.data.end.y - this.data.start.y : this.options.preventRebound && !this.options.loop || (this.data.posheight = -this.currentHeight + this.data.end.y - this.data.start.y)
                                } else {
                                    if (a < o)
                                        return;
                                    i && "vertical" !== i.options.direction && 0 === this.data.currentPage && this.data.end.x - this.data.start.x >= 0 && i.s_data.nested && (!i.options.preventRebound || 0 !== i.data.currentPage) ? i.data.poswidth = -i.currentWidth + this.data.end.x - this.data.start.x : i && "vertical" !== i.options.direction && this.data.currentPage === this.s_data.sliderLength - 1 && this.data.end.x - this.data.start.x <= 0 && i.s_data.nested && (!i.options.preventRebound || i.data.currentPage !== i.s_data.sliderLength - 1) ? i.data.poswidth = -i.currentWidth + this.data.end.x - this.data.start.x : this.options.preventRebound && !this.options.loop || (this.data.poswidth = -this.currentWidth + this.data.end.x - this.data.start.x)
                                }
                            }
                        },
                        swipeEnd: function(t) {
                            this.s_data.e = t,
                            this.s_data.tracking = !1;
                            var e = (new Date).getTime()
                              , i = e - this.data.start.t
                              , a = this.data.end.x - this.data.start.x
                              , o = this.data.end.y - this.data.start.y
                              , n = this.s_data.thresholdDistance
                              , s = this.data.currentPage;
                            if (this.options.autoplay) {
                                var r = this;
                                setTimeout(function() {
                                    r.clock().begin(r)
                                }, this.options.autoplay)
                            }
                            if (!0 === this.options.preventDocumentMove && document.removeEventListener("touchmove", this.preventDefault(t)),
                            i > this.s_data.thresholdTime)
                                return this.slide(s),
                                !1;
                            if ("vertical" !== this.options.direction) {
                                if (a > n && Math.abs(o) < Math.abs(a))
                                    return this.pre(),
                                    !1;
                                if (-a > n && Math.abs(o) < Math.abs(a))
                                    return this.next(),
                                    !1;
                                if (!(i < 100 && Math.abs(a) < 10 && Math.abs(o) < 10))
                                    return this.slide(s),
                                    !1;
                                this.data.direction = "click",
                                this.$emit("tap", this.data),
                                this.slide(s, "click")
                            } else {
                                if (o > n && Math.abs(a) < Math.abs(o))
                                    return this.pre(),
                                    !1;
                                if (-o > n && Math.abs(a) < Math.abs(o))
                                    return this.next(),
                                    !1;
                                if (!(i < 100 && Math.abs(a) < 10 && Math.abs(o) < 10))
                                    return this.slide(s),
                                    !1;
                                this.data.direction = "click",
                                this.$emit("tap", this.data),
                                this.slide(s, "click")
                            }
                        },
                        swipeOut: function(t) {
                            this.$el === t.target && this.s_data.tracking && this.swipeEnd(t)
                        },
                        pre: function() {
                            this.s_data.lastPage = this.data.currentPage,
                            this.data.direction = "vertical" === this.options.direction ? "up" : "left";
                            var t = this.s_data.sliderLength
                              , e = this.options.slidesToScroll || 1
                              , i = this.s_data.$parent;
                            this.data.currentPage >= 1 && this.data.currentPage - e >= 0 ? (this.data.currentPage -= e || 1,
                            this.slide()) : !(this.options.loop && this.data.currentPage - e < 0) || i && i.s_data.nested ? i && 0 === this.data.currentPage && i.s_data.nested ? (i.pre(),
                            this.slide()) : this.slide(0) : (this.data.currentPage -= e || 1,
                            this.s_data.transitionEnding = !0,
                            this.s_data.itemTransitionEnding = !0,
                            this.data.currentPage < 0 && "fade" === this.s_data.effect ? (this.slide((this.pagenums || t) - 1),
                            this.s_data.transitionEnding = !1,
                            this.s_data.itemTransitionEnding = !1) : this.slide())
                        },
                        next: function() {
                            this.data.direction = "vertical" === this.options.direction ? "down" : "right",
                            this.s_data.lastPage = this.data.currentPage;
                            var t = this.s_data.sliderLength
                              , e = this.s_data.$parent
                              , i = this.options.slidesToScroll || 1;
                            if (this.data.currentPage < (this.pagenums || t) - 1 && this.data.currentPage + i <= t - 1)
                                this.data.currentPage += this.options.slidesToScroll || 1,
                                this.slide();
                            else if (!(this.options.loop && this.data.currentPage + i > t - 1 && this.data.currentPage + i <= t) || e && e.s_data.nested)
                                if (e && this.data.currentPage === (this.pagenums || t) - 1 && e.s_data.nested) {
                                    var a = this.s_data.$parent;
                                    a.next(),
                                    this.slide()
                                } else
                                    this.data.direction = "rebound",
                                    this.slide();
                            else
                                this.data.currentPage += this.options.slidesToScroll || 1,
                                this.s_data.transitionEnding = !0,
                                this.s_data.itemTransitionEnding = !0,
                                this.data.currentPage >= (this.pagenums || t) && "fade" === this.s_data.effect ? (this.slide(0),
                                this.s_data.transitionEnding = !1,
                                this.s_data.itemTransitionEnding = !1) : this.slide()
                        },
                        slide: function(t, e) {
                            if (this.s_data.animation = !0,
                            "slideTo" === e && !0 === this.s_data.onSlide)
                                return !1;
                            if (!t && 0 !== t || void 0 !== e || (this.data.direction = "rebound"),
                            "animationnone" === e ? (this.s_data.animation = !1,
                            this.s_data.onSlideEnd = !0,
                            this.s_data.onSlide = !1) : (this.s_data.onSlideEnd = !1,
                            this.s_data.onSlide = !0),
                            (t || 0 === t) && (this.data.currentPage = t),
                            "click" !== e && this.$emit("slide", this.data),
                            "fade" === this.s_data.effect)
                                return void (this.pagenums || this.fadeDom());
                            if ("vertical" === this.options.direction ? (Math.abs(this.data.posheight) === Math.abs(-this.currentHeight) && (this.s_data.onSlideEnd = !0,
                            this.s_data.onSlide = !1),
                            this.data.posheight = -this.currentHeight) : (Math.abs(this.data.poswidth) === Math.abs(-this.currentWidth) && (this.s_data.onSlideEnd = !0,
                            this.s_data.onSlide = !1),
                            this.data.poswidth = -this.currentWidth),
                            this.s_data.sliderLength) {
                                var i = this.$el.getElementsByClassName("slider-wrapper")[0]
                                  , a = Array.prototype.slice.call(i.children)
                                  , o = a.filter(function(t) {
                                    return -1 !== t.className.indexOf("slider-item")
                                })
                                  , n = a.filter(function(t) {
                                    return -1 !== t.className.indexOf("slider-active-copy")
                                })
                                  , s = this.options.loopedSlides || 1
                                  , r = this.s_data.sliderLength
                                  , d = this.$children
                                  , l = this.data.currentPage;
                                if (d = d.filter(function(t) {
                                    return "slideritem" === t.$options.name
                                }),
                                d.forEach(function(t) {
                                    t.removeActive()
                                }),
                                "nest" === this.options.effect)
                                    return;
                                if (d[l] && d[l].addActive(),
                                l < 0 || l >= (this.pagenums || r)) {
                                    o[l + s] && o[l + s].classList && o[l + s].classList.add("slider-active-copy");
                                    var c = l < 0 ? (this.pagenums || r) + l : 0 + l - (this.pagenums || r);
                                    d[c] && d[c].addActive()
                                } else
                                    for (var h = 0; h < n.length; h++) {
                                        var u = n[h];
                                        u.classList.remove("slider-active-copy")
                                    }
                            }
                            return !(this.data.currentPage < 0 || this.data.currentPage >= (this.pagenums || this.s_data.sliderLength)) && void 0
                        },
                        clock: function() {
                            return {
                                begin: function(t) {
                                    t.s_data.setIntervalid || 0 !== t.options.autoplay && (t.s_data.setIntervalid = setInterval(function() {
                                        t.next(),
                                        t.data.currentPage !== (t.pagenums || t.s_data.sliderLength) - 1 || t.options.loop || (clearInterval(t.s_data.setIntervalid),
                                        t.s_data.setIntervalid = 0)
                                    }, t.options.autoplay))
                                },
                                stop: function(t) {
                                    clearInterval(t.s_data.setIntervalid),
                                    t.s_data.setIntervalid = 0
                                }
                            }
                        },
                        preventDefault: function(t) {
                            var e = t || this.s_data.e;
                            this.s_data.e = e,
                            e && e.preventDefault()
                        },
                        onTransitionEnd: function(t) {
                            var e = this;
                            this.s_data.onSlideEnd = !0,
                            this.s_data.onSlide = !1,
                            setTimeout(function() {
                                var t = e.data.currentPage
                                  , i = e.s_data.sliderLength;
                                e.options.loop && "" !== e.s_data.effect && (e.s_data.transitionEnding = !1,
                                t < 0 ? e.slide((e.pagenums || i) + t, "animationnone") : t >= (e.pagenums || i) && e.slide(0 + t - (e.pagenums || i), "animationnone"))
                            }, 0)
                        },
                        onItemTransitionEnd: function(t) {
                            if (t.target === t.currentTarget) {
                                var e = this;
                                setTimeout(function() {
                                    e.s_data.itemTransitionEnding = !1
                                }, 0)
                            }
                        },
                        renderDom: function(t) {
                            var e = this
                              , i = this;
                            this.s_data.renderTime && clearTimeout(this.s_data.renderTime),
                            i.s_data.sliderLength += 1,
                            i.s_data.sliderLength >= 1 && "fade" === i.options.effect && (t.previousSibling ? t.style["z-index"] = 99 - i.s_data.sliderLength : t.style["z-index"] = 99 + i.s_data.sliderLength),
                            this.s_data.renderTime = setTimeout(function() {
                                i.s_data.renderTime = void 0;
                                var t = i.$el.getElementsByClassName("slider-wrapper")[0]
                                  , a = Array.prototype.slice.call(t.children)
                                  , o = a.filter(function(t) {
                                    return -1 !== t.className.indexOf("slider-item") && -1 === t.className.indexOf("slider-copy")
                                });
                                if (i.s_data.sliderLength = o.length || 0,
                                i.s_data.sliderLength >= 1 && i.options.loop && "fade" !== i.options.effect && "coverflow" !== i.options.effect) {
                                    for (var n = t.getElementsByClassName("slider-copy"), s = n.length - 1; s >= 0; s--)
                                        t.removeChild(n[s]);
                                    for (var r = Array.prototype.slice.call(t.children), d = r.filter(function(t) {
                                        return -1 !== t.className.indexOf("slider-item")
                                    }), l = d.length, c = i.options.loopedSlides || 1, h = 0; h < l; h++) {
                                        if (h + c - l >= 0) {
                                            var u = d[h + 0].cloneNode(!0);
                                            u.classList.add("slider-copy"),
                                            u.classList.remove("slider-active"),
                                            t.insertBefore(u, d[0])
                                        }
                                        if (h - c < 0) {
                                            var p = d[h].cloneNode(!0);
                                            p.classList.add("slider-copy"),
                                            p.classList.remove("slider-active"),
                                            t.appendChild(p)
                                        }
                                    }
                                }
                                i.$nextTick(function() {
                                    i.slide(i.data.currentPage, "animationnone"),
                                    i.options.autoplay && e.s_data.sliderLength && i.clock().begin(i)
                                })
                            }, 0)
                        },
                        fadeDom: function() {
                            for (var t = this.data.currentPage, e = this.$el.getElementsByClassName("slider-wrapper")[0], i = e.getElementsByClassName("slider-item"), a = this.options.speed, o = 0; o < i.length; o++)
                                o === t || o === t + 1 ? (i[o].style.opacity = "1",
                                i[o].style["transition-property"] = "opacity",
                                i[o].style[this.s_data.prefixes.transition + "-duration"] = (this.s_data.animation ? a || 300 : 0) + "ms") : (i[o].style.opacity = "0",
                                i[o].style[this.s_data.prefixes.transition + "-duration"] = (this.s_data.animation ? a || 300 : 0) + "ms")
                        },
                        judgeParentSlider: function(t) {
                            return t.$parent && t.$parent.$vnode && "slider" === t.$parent.$options.name ? t.$parent : (!t.$parent || void 0 !== t.$parent.$vnode) && this.judgeParentSlider(t.$parent)
                        }
                    },
                    components: {
                        renderpagination: {
                            render: function(t) {
                                var e = this.index;
                                return this.options.renderPagination.call(this, t, e)
                            },
                            name: "renderpagination",
                            props: {
                                index: {
                                    type: Number,
                                    required: !0
                                },
                                options: {
                                    type: Object,
                                    required: !0
                                }
                            }
                        }
                    }
                }
            }
            , function(t, e, i) {
                "use strict";
                (function(t) {
                    function i() {
                        var e = void 0
                          , i = void 0
                          , a = void 0
                          , o = void 0;
                        return function() {
                            var n = document.createElement("_")
                              , s = n.style
                              , r = void 0;
                            "" === s[r = "webkitTransition"] && (a = "webkitTransitionEnd",
                            i = r),
                            "" === s[r = "transition"] && (a = "transitionend",
                            i = r),
                            "" === s[r = "webkitTransform"] && (e = r),
                            "" === s[r = "msTransform"] && (e = r),
                            "" === s[r = "transform"] && (e = r),
                            document.body.insertBefore(n, null),
                            s[e] = "translate3d(0, 0, 0)",
                            o = !!t.getComputedStyle(n).getPropertyValue(e),
                            document.body.removeChild(n)
                        }(),
                        {
                            transform: e,
                            transition: i,
                            transitionEnd: a,
                            hasTranslate3d: o
                        }
                    }
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    }),
                    e.default = i
                }
                ).call(e, i(10))
            }
            , function(t, e) {
                var i;
                i = function() {
                    return this
                }();
                try {
                    i = i || Function("return this")() || (0,
                    eval)("this")
                } catch (t) {
                    "object" == typeof window && (i = window)
                }
                t.exports = i
            }
            , function(t, e, i) {
                "use strict";
                var a = function() {
                    var t = this
                      , e = t.$createElement
                      , i = t._self._c || e;
                    return i("div", {
                        staticClass: "slider-container",
                        class: t.s_data.containerClass,
                        on: {
                            mouseleave: t.swipeOut
                        }
                    }, [i("div", {
                        staticClass: "slider-touch",
                        style: t.styleobj,
                        on: {
                            touchmove: t.swipeMove,
                            touchstart: t.swipeStart,
                            touchend: t.swipeEnd,
                            mousedown: t.swipeStart,
                            mouseup: t.swipeEnd,
                            mousemove: t.swipeMove,
                            "webkit-transition-end": t.onTransitionEnd,
                            transitionend: t.onTransitionEnd
                        }
                    }, [0 === t.pages.length ? i("div", {
                        staticClass: "slider-wrapper",
                        class: t.classObject
                    }, [t._t("default")], 2) : t._e()]), t._v(" "), t.s_data.pagination ? i("div", {
                        staticClass: "slider-pagination slider-pagination-bullets"
                    }, [t._l(t.pagenums || t.s_data.sliderLength, function(e) {
                        return [t.options.renderPagination ? t._e() : i("span", {
                            key: e,
                            staticClass: "slider-pagination-bullet",
                            class: e - 1 === t.data.currentPage ? "slider-pagination-bullet-active" : "",
                            on: {
                                click: function(i) {
                                    t.slide(e - 1)
                                }
                            }
                        }), t._v(" "), t.options.renderPagination ? i("renderpagination", {
                            key: e,
                            class: e - 1 === t.data.currentPage ? "slider-pagination-bullet-active-render" : "",
                            attrs: {
                                index: e,
                                options: t.options
                            },
                            nativeOn: {
                                click: function(i) {
                                    t.slide(e - 1)
                                }
                            }
                        }) : t._e()]
                    })], 2) : t._e(), t._v(" "), i("div", {
                        directives: [{
                            name: "show",
                            rawName: "v-show",
                            value: !t.pagenums && 0 === t.s_data.sliderLength || t.s_data.loading,
                            expression: "(!pagenums && s_data.sliderLength === 0)||s_data.loading"
                        }],
                        staticClass: "slider-loading"
                    }, [t._t("loading")], 2)])
                }
                  , o = []
                  , n = {
                    render: a,
                    staticRenderFns: o
                };
                e.a = n
            }
            , function(t, e, i) {
                "use strict";
                Object.defineProperty(e, "__esModule", {
                    value: !0
                }),
                e.default = {
                    props: ["index", "pageLength"],
                    name: "slideritem",
                    data: function() {
                        return {
                            slideClass: {
                                "slider-item": !0,
                                "slider-active": !1
                            },
                            data: {
                                start: {},
                                end: {},
                                index: this.index ? this.index : this.$vnode.key,
                                $el: ""
                            }
                        }
                    },
                    mounted: function() {
                        this.renderDom(),
                        this.data.$el = this.$el
                    },
                    methods: {
                        touchStart: function(t) {
                            if ("touchstart" === t.type) {
                                if (t.touches.length > 1)
                                    return this.data.tracking = !1,
                                    !1;
                                this.data.start.t = (new Date).getTime(),
                                this.data.start.x = t.targetTouches[0].clientX,
                                this.data.start.y = t.targetTouches[0].clientY,
                                this.data.end.x = t.targetTouches[0].clientX,
                                this.data.end.y = t.targetTouches[0].clientY,
                                this.data.start.pageX = t.targetTouches[0].pageX,
                                this.data.start.pageY = t.targetTouches[0].pageY
                            } else
                                this.data.start.t = (new Date).getTime(),
                                this.data.start.x = t.clientX,
                                this.data.start.y = t.clientY,
                                this.data.end.x = t.clientX,
                                this.data.end.y = t.clientY,
                                this.data.start.pageX = t.pageX,
                                this.data.start.pageY = t.pageY
                        },
                        touchEnd: function(t) {
                            var e = (new Date).getTime()
                              , i = e - this.data.start.t;
                            "touchend" === t.type ? (this.data.end.t = (new Date).getTime(),
                            this.data.end.x = t.changedTouches[0].clientX,
                            this.data.end.y = t.changedTouches[0].clientY,
                            this.data.end.pageX = t.changedTouches[0].pageX,
                            this.data.end.pageY = t.changedTouches[0].pageY) : (this.data.end.t = (new Date).getTime(),
                            this.data.end.x = t.clientX,
                            this.data.end.y = t.clientY,
                            this.data.end.pageX = t.pageX,
                            this.data.end.pageY = t.pageY);
                            var a = this.data.end.pageX - this.data.start.pageX || 0
                              , o = this.data.end.pageY - this.data.start.pageY || 0;
                            i < 300 && Math.abs(a) < 10 && Math.abs(o) < 10 && this.$emit("tap", this.data)
                        },
                        renderDom: function() {
                            this.$parent && this.$parent.renderDom(this.$el)
                        },
                        addActive: function() {
                            this.slideClass["slider-active"] = !0
                        },
                        removeActive: function() {
                            this.slideClass["slider-active"] = !1
                        },
                        onTransitionEnd: function(t) {
                            this.$parent && this.$parent.onItemTransitionEnd(t)
                        },
                        transform: function() {
                            var t = this.$parent.options
                              , e = this.$parent.data
                              , i = this.$parent.s_data;
                            if (!(t && e && i && this.$el && "coverflow" === t.effect))
                                return {};
                            var a = this.index
                              , o = i.pageWidth
                              , n = this.$el.offsetWidth
                              , s = o / 2 - n / 2
                              , r = s - i.deviation + "px"
                              , d = s + i.deviation + "px"
                              , l = s + "px"
                              , c = {};
                            return a === e.currentPage - 1 || a === this.pageLength - 2 && -1 === e.currentPage ? (c.transform = "translate3D(" + r + ",0 ,0) scale3d(" + i.widthScalingRatio + "," + i.heightScalingRatio + ",1)",
                            c.opacity = "1",
                            "left" === e.direction ? c["z-index"] = "10" : c["z-index"] = "1") : a === e.currentPage + 1 || 1 === a && e.currentPage === this.pageLength ? (c.transform = "translate3D(" + d + ",0 ,0)",
                            c.transform = "translate3D(" + d + ",0 ,0) scale3d(" + i.widthScalingRatio + "," + i.heightScalingRatio + ",1)",
                            c.opacity = "1",
                            "left" === e.direction ? c["z-index"] = "1" : c["z-index"] = "10") : a === e.currentPage ? (c.transform = "translate3D(" + l + ",0 ,0) scale3d(1,1,1)",
                            c["z-index"] = "99",
                            c.opacity = "1") : (c.transform = "translate3D(" + l + ",0 ,0)",
                            c.opacity = "0"),
                            a === this.pageLength - 1 && 0 === e.currentPage && (c.transform = "translate3D(" + r + ",0 ,0) scale3d(" + i.widthScalingRatio + "," + i.heightScalingRatio + ",1)",
                            c.opacity = "1"),
                            0 === a && e.currentPage === this.pageLength - 1 && (c.transform = "translate3D(" + d + ",0 ,0) scale3d(" + i.widthScalingRatio + "," + i.heightScalingRatio + ",1)",
                            c.opacity = "1"),
                            (a !== this.pageLength - 1 && a !== this.pageLength - 2 || -1 !== e.currentPage) && (0 !== a && 1 !== a || e.currentPage !== this.pageLength) || (c.opacity = "1",
                            0 === a && (c["z-index"] = "99"),
                            a === this.pageLength - 1 && (c["z-index"] = "99")),
                            c[i.prefixes.transition + "Duration"] = (i.animation ? t.speed || 300 : 0) + "ms",
                            c.position = "absolute",
                            c
                        }
                    }
                }
            }
            , function(t, e, i) {
                "use strict";
                var a = function() {
                    var t = this
                      , e = t.$createElement;
                    return (t._self._c || e)("div", {
                        class: t.slideClass,
                        style: [t.transform(t.index)],
                        on: {
                            touchstart: t.touchStart,
                            touchend: t.touchEnd,
                            mousedown: t.touchStart,
                            mouseup: t.touchEnd,
                            "webkit-transition-end": t.onTransitionEnd,
                            transitionend: t.onTransitionEnd
                        }
                    }, [t._t("default")], 2)
                }
                  , o = []
                  , n = {
                    render: a,
                    staticRenderFns: o
                };
                e.a = n
            }
            , function(t, e, i) {
                "use strict";
                function a(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    }
                }
                Object.defineProperty(e, "__esModule", {
                    value: !0
                }),
                e.slideritem = e.slider = void 0;
                var o = i(3)
                  , n = a(o)
                  , s = i(4)
                  , r = a(s)
                  , d = n.default
                  , l = r.default;
                e.default = d,
                e.slider = d,
                e.slideritem = l
            }
            ])
        })
    },
    557: function(t, e, i) {
        "use strict";
        var a = function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                attrs: {
                    id: "bookread"
                },
                on: {
                    click: function(e) {
                        return t.clickmenu()
                    }
                }
            }, [i("a", {
                staticClass: "backHome",
                attrs: {
                    href: t.backHome
                }
            }, [t._v("首页")]), t._v(" "), i("Topbar", {
                attrs: {
                    readshow: t.readshow,
                    title: t.bookName,
                    sort: t.sort
                }
            }), t._v(" "), t.ispayshow ? i("div", {
                staticClass: "bookcontent",
                style: {
                    maxHeight: t.minHAuto
                },
                attrs: {
                    id: "readImgBox"
                }
            }, [i("div", {
                staticClass: "readImgBox",
                staticStyle: {
                    "margin-bottom": "3rem"
                }
            }, [i("imgLoader", {
                attrs: {
                    domain: t.imgsBoot[t.countNum],
                    src: t.defaultCover
                },
                on: {
                    load: function(e) {
                        return t.imgload(0)
                    }
                }
            })], 1)]) : i("div", {
                staticClass: "bookcontent",
                style: {
                    minHeight: t.minH
                },
                attrs: {
                    id: "readImgBox"
                }
            }, [2 == t.bookStyle ? i("div", t._l(t.bookInfoClone, function(e, a) {
                return i("div", {
                    key: a,
                    staticClass: "readImgBox"
                }, [i("imgLoader", {
                    attrs: {
                        domain: t.imgsBoot[t.countNum],
                        src: e,
                        alt: t.countNum + " " + t.bookid + " " + t.chapterId + " " + t.sort + " " + a
                    },
                    on: {
                        load: function(e) {
                            return t.imgload(a)
                        }
                    }
                }), t._v(" "), i("hr", {
                    staticClass: "page-hr"
                })], 1)
            }), 0) : 3 == t.bookStyle ? i("div", {
                staticClass: "bookStyle3"
            }, [t.isReloadAlive ? i("div", {
                staticStyle: {
                    width: "100%",
                    height: "auto"
                }
            }, [i("slider", {
                ref: "slider",
                attrs: {
                    options: t.options
                }
            }, [t._l(t.bookInfoClone, function(e, a) {
                return i("slideritem", {
                    key: a
                }, [i("imgLoader", {
                    attrs: {
                        domain: t.imgsBoot[t.countNum],
                        src: e,
                        alt: t.countNum + " " + t.bookid + " " + t.chapterId + " " + t.sort + " " + a
                    },
                    on: {
                        load: function(e) {
                            return t.imgload(a)
                        }
                    }
                })], 1)
            }), t._v(" "), i("div", {
                attrs: {
                    slot: "loading"
                },
                slot: "loading"
            }, [t._v("loading...")])], 2)], 1) : t._e()]) : i("div", t._l(t.bookInfoClone, function(e, a) {
                return i("div", {
                    key: a,
                    staticClass: "readImgBox"
                }, [i("imgLoader", {
                    attrs: {
                        domain: t.imgsBoot[t.countNum],
                        src: e,
                        alt: t.countNum + " " + t.bookid + " " + t.chapterId + " " + t.sort + " " + a
                    },
                    on: {
                        load: function(e) {
                            return t.imgload(a)
                        }
                    }
                })], 1)
            }), 0)]), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.ispayshow,
                    expression: "ispayshow"
                }],
                attrs: {
                    id: "payBox_before"
                }
            }), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.ispayshow,
                    expression: "ispayshow"
                }],
                attrs: {
                    id: "payBox"
                }
            }, [i("p", {
                staticClass: "haspaddLR"
            }, [t._v("本章价格：" + t._s(t.book_bean) + "金币")]), t._v(" "), i("p", {
                staticClass: "nopaddLR"
            }, [t._v("您的余额：" + t._s(t.userInfo.bookBean) + "金币")]), t._v(" "), i("div", {
                staticClass: "payButton"
            }, [i("a", {
                staticClass: "ta",
                attrs: {
                    href: "javascript:;"
                },
                on: {
                    click: t.setFuckBook
                }
            }, [t._v("余额不足，立即充值")])]), t._v(" "), i("div", {
                staticClass: "pay_info"
            }, [i("a", {
                staticClass: "fr",
                attrs: {
                    href: "javascript:;"
                },
                on: {
                    click: t.setFuckBook
                }
            }, [t._v("开通VIP，免费阅读")])])]), t._v(" "), i("transition-group", {
                attrs: {
                    name: "fade"
                }
            }, [i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.bottomShow,
                    expression: "bottomShow"
                }],
                key: 1,
                staticClass: "bottomBox flex"
            }, [i("div", {
                staticClass: "function ta",
                on: {
                    click: function(e) {
                        return t.go_mulu(t.bookid)
                    }
                }
            }, [t._v("目录")]), t._v(" "), i("div", {
                staticClass: "button ta",
                class: {
                    active: 0 == t.prevChapterId
                },
                on: {
                    click: function(e) {
                        return t.prev(t.prevChapterId)
                    }
                }
            }, [t._v("上一章")]), t._v(" "), i("div", {
                staticClass: "button ta",
                class: {
                    active: -1 == t.nextChapterId
                },
                on: {
                    click: function(e) {
                        return t.next(t.nextChapterId)
                    }
                }
            }, [t._v("下一章")]), t._v(" "), i("div", {
                staticClass: "function ta",
                on: {
                    click: function(e) {
                        return t.joinBookrack(t.bookid)
                    }
                }
            }, [t._v("书架")])])]), t._v(" "), i("readfooter", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.footerShow,
                    expression: "footerShow"
                }]
            }), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: !1,
                    expression: "false"
                }]
            }, t._l(t.imgsNextChapyer, function(e, a) {
                return i("div", {
                    key: a,
                    staticClass: "readImgBox"
                }, [i("imgLoader", {
                    attrs: {
                        domain: t.imgsBoot[t.countNum],
                        src: e
                    }
                })], 1)
            }), 0), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.showDown,
                    expression: "showDown"
                }],
                staticClass: "downApp heartBeat"
            }, [i("a", {
                staticClass: "close",
                attrs: {
                    href: "javascript:;"
                },
                on: {
                    click: function(e) {
                        t.showDown = !1
                    }
                }
            }, [t._v("×")]), t._v(" "), i("a", {
                staticClass: "dd",
                attrs: {
                    href: t.url
                }
            }, [t._v("点我")])]), t._v(" "), i("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.showIosDown,
                    expression: "showIosDown"
                }],
                staticClass: "abcd",
                on: {
                    click: function(e) {
                        return t.cloneDolog()
                    }
                }
            }, [i("div", {
                staticClass: "addHomePopIos",
                on: {
                    touchmove: function(t) {
                        t.preventDefault()
                    }
                }
            }), t._v(" "), t._m(0)])], 1)
        }
          , o = [function() {
            var t = this
              , e = t.$createElement
              , i = t._self._c || e;
            return i("div", {
                staticClass: "addHomeConIos",
                attrs: {
                    "data-v-99b5c7a2": ""
                }
            }, [i("div", {
                staticClass: "addHomeInfoIos",
                attrs: {
                    "data-v-99b5c7a2": ""
                }
            }, [i("img", {
                staticClass: "ApplogoIos",
                attrs: {
                    "data-v-99b5c7a2": "",
                    src: "/src/assets/Img/ic_launcher.jpg",
                    alt: ""
                }
            }), t._v("\n    请点击\n    "), i("img", {
                staticClass: "ApplogoIos",
                attrs: {
                    "data-v-99b5c7a2": "",
                    src: "/src/assets/Img/add-Icon2.png",
                    alt: ""
                }
            }), t._v("\n    ，然后轻点“\n    "), i("span", {
                attrs: {
                    "data-v-99b5c7a2": ""
                }
            }, [t._v("添加到主屏幕")]), t._v("”。\n    "), i("div", {
                staticClass: "showInfoIos",
                attrs: {
                    "data-v-99b5c7a2": ""
                }
            })])])
        }
        ]
          , n = {
            render: a,
            staticRenderFns: o
        };
        e.a = n
    }
});
