// ==UserScript==
// @name         课堂派反反作弊
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  将课堂派的无法复制、粘贴、回退，切屏检测等功能进行了破除
// @author       You
// @match        https://www.ketangpai.com/
// @icon         https://www.ketangpai.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477640/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%8F%8D%E5%8F%8D%E4%BD%9C%E5%BC%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477640/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%8F%8D%E5%8F%8D%E4%BD%9C%E5%BC%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (window["webpackJsonp"] = window["webpackJsonp"] || []).push([
        ["chunk-379c430e"], {
            ba16: function(e, t, s) {
                "use strict";
                s("cf01")
            },
            c2e1: function(e, t, s) {
                "use strict";
                s.r(t);
                var a = function() {
                    var e = this,
                        t = e.$createElement,
                        s = e._self._c || t;
                    return s("div", {
                        ref: "setBoxMessage",
                        staticClass: "preview-testpaper-view"
                    }, ["1" == e.courserole ? s("div", {
                        staticClass: "head-tips-box"
                    }, [e._m(0)]) : e._e(), s("div", {
                        staticClass: "previw-test-content"
                    }, [s("div", {
                        staticClass: "test-desc"
                    }, [s("div", {
                        staticClass: "test-desc-le"
                    }, [s("p", [e._v(e._s(e.descObj.title))]), "0" == e.courserole ? s("span", [e._v("起止时间：" + e._s(e.descObj.newBeginTimer) + "~" + e._s(e.descObj.newEndTimer))]) : e._e()]), "0" == e.courserole ? s("div", {
                        staticClass: "test-desc-ri"
                    }, [s("i", {
                        staticClass: "el-icon-time"
                    }), null != e.descObj.timelength && 0 != e.descObj.timelength ? s("span", [e._v("倒计时：" + e._s(e.downTime))]) : s("span", [e._v(" 答题用时：" + e._s(e.nowTime))])]) : e._e()]), s("div", {
                        staticClass: "test-list-box"
                    }, [s("div", {
                        staticClass: "answer-card"
                    }, [s("div", {
                        staticClass: "card-top"
                    }, [s("p", [e._v("答题卡")]), e._m(1), s("div", {
                        staticClass: "progress-box"
                    }, [s("p", {
                        staticClass: "ti"
                    }, [s("span", [e._v("答题进度")]), s("span", [s("i", [e._v(e._s(e.getAnserEnd))]), e._v("/" + e._s(e.testListPreview.length))])]), s("el-progress", {
                        attrs: {
                            percentage: e.getAnserProgress,
                            "show-text": !1
                        }
                    }), s("p", {
                        staticClass: "cout"
                    }, [e._v("共" + e._s(e.testListPreviewNum.length) + "题，总分" + e._s(e.descObj.totalScore) + "分")]), s("p", [e._v("注：段落说明题不需要作答，不计入总分")])], 1), s("div", {
                        staticClass: "all-testlist"
                    }, [s("p", [e._v("全部试题")]), s("ul", {
                        class: {
                            maxHeight: 2 == e.descObj.style
                        }
                    }, e._l(e.testListPreviewNum, (function(t, a) {
                        return s("li", {
                            key: a,
                            class: {
                                activeLi: "1" == t.answerTypes
                            },
                            on: {
                                click: function(s) {
                                    return e.checkedTestPaper(t, a)
                                }
                            }
                        }, [e._v(e._s(a + 1))])
                    })), 0)])]), "1" != e.courserole ? s("div", {
                        staticClass: "card-submit"
                    }, [s("el-button", {
                        attrs: {
                            type: "primary"
                        },
                        on: {
                            click: e.SubmitTestClick
                        }
                    }, [e._v("提交")])], 1) : e._e()]), "1" == e.courserole || 1 == e.descObj.style && "0" == e.courserole ? s("div", {
                        staticClass: "test-list"
                    }, e._l(e.testListPreview, (function(t, a) {
                        return s("div", {
                            key: a
                        }, ["1" == t.type ? s("div", [s("JudgeTest", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                judgeOjb: t,
                                degreeType: !1,
                                answerType: !1,
                                answering: !0,
                                disabledDoing: !1,
                                Testindex: a,
                                laodingFlag: e.laodingFlag
                            },
                            on: {
                                radioChangeClick: e.radioChangeClick
                            }
                        })], 1) : e._e(), "2" == t.type ? s("div", {
                            staticClass: "calss-message-box"
                        }, [s("SingleChoice", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                SingleChoiceOjb: t,
                                degreeType: !1,
                                disabledDoing: !1,
                                answering: !0,
                                answerType: !1,
                                Testindex: a,
                                laodingFlag: e.laodingFlag
                            },
                            on: {
                                radioChangeClick: e.radioChangeClickSing
                            }
                        })], 1) : e._e(), "3" == t.type ? s("div", {
                            staticClass: "calss-message-box"
                        }, [s("Multiplechoice", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                MultiplechoiceObj: t,
                                degreeType: !1,
                                disabledDoing: !1,
                                answering: !0,
                                answerType: !1,
                                Testindex: a,
                                laodingFlag: e.laodingFlag
                            },
                            on: {
                                changChecked: e.changChecked
                            }
                        })], 1) : e._e(), "6" == t.type ? s("div", {
                            staticClass: "calss-message-box"
                        }, [s("IndefiniteItem", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                IndefiniteItemobj: t,
                                degreeType: !1,
                                disabledDoing: !1,
                                answering: !0,
                                answerType: !1,
                                Testindex: a,
                                laodingFlag: e.laodingFlag
                            },
                            on: {
                                changChecked: e.changCheckedmore
                            }
                        })], 1) : e._e(), "7" == t.type ? s("div", [s("DocumentTitle", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                degreeType: !1,
                                answering: !0,
                                DocumentTitleObj: t,
                                Testindex: a,
                                answerType: !1,
                                inputEditorFalg: !0,
                                courserole: e.courserole,
                                cutscreenState: e.cutscreenState
                            },
                            on: {
                                myInputValue: e.getInputTitleValueDoc,
                                myInputValueInput: e.getInputTitleValueDoc,
                                upSuccessValue: e.upSuccessValue,
                                getInputTitleValue: e.ChangeInputTitleValue,
                                upLoadClick: e.upLoadClick
                            }
                        })], 1) : e._e(), "4" == t.type ? s("div", [s("ShortAnswerQuestions", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                degreeType: !1,
                                answering: !0,
                                ShortAnswerQuestionsObj: t,
                                Testindex: a,
                                answerType: !1,
                                inputEditorFalg: !0,
                                isabledDoing: !1,
                                cutscreenState: e.cutscreenState
                            },
                            on: {
                                myInputValue: e.getInputTitleValueShort,
                                myInputValueInput: e.getInputTitleValueShort
                            }
                        })], 1) : e._e(), "10" == t.type ? s("div", [s("Paragraph", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                ParagraphObj: t,
                                Testindex: a,
                                answerType: !1
                            }
                        })], 1) : e._e(), "5" == t.type ? s("div", [s("oldBlanks", {
                            directives: [{
                                name: "watermark",
                                rawName: "v-watermark",
                                value: {
                                    text: e.watermark,
                                    stno: e.stno
                                },
                                expression: "{ text: watermark, stno: stno }"
                            }],
                            attrs: {
                                degreeType: !1,
                                answering: !0,
                                ShortAnswerQuestionsObj: t,
                                Testindex: a,
                                answerType: !1,
                                inputEditorFalg: !0,
                                cutscreenState: e.cutscreenState
                            },
                            on: {
                                myInputValue: e.getInputTitleValueShort,
                                myInputValueInput: e.getInputTitleValueShort
                            }
                        })], 1) : e._e()])
                    })), 0) : e._e(), null != e.itemCard && 2 == e.descObj.style && "0" == e.courserole ? s("div", {
                        staticClass: "test-list-card"
                    }, [null != e.itemCard && "1" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("JudgeTest", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            judgeOjb: e.itemCard,
                            degreeType: !1,
                            answerType: !1,
                            answering: !0,
                            disabledDoing: !1,
                            Testindex: e.testListIndNum,
                            laodingFlag: e.laodingFlag
                        },
                        on: {
                            radioChangeClick: e.radioChangeClick
                        }
                    })], 1) : e._e(), null != e.itemCard && "2" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("SingleChoice", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            SingleChoiceOjb: e.itemCard,
                            degreeType: !1,
                            disabledDoing: !1,
                            answering: !0,
                            answerType: !1,
                            Testindex: e.testListIndNum,
                            laodingFlag: e.laodingFlag
                        },
                        on: {
                            radioChangeClick: e.radioChangeClickSing
                        }
                    })], 1) : e._e(), null != e.itemCard && "3" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("Multiplechoice", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            MultiplechoiceObj: e.itemCard,
                            degreeType: !1,
                            disabledDoing: !1,
                            answering: !0,
                            answerType: !1,
                            Testindex: e.testListIndNum,
                            laodingFlag: e.laodingFlag
                        },
                        on: {
                            changChecked: e.changChecked
                        }
                    })], 1) : e._e(), null != e.itemCard && "6" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("IndefiniteItem", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            IndefiniteItemobj: e.itemCard,
                            degreeType: !1,
                            disabledDoing: !1,
                            answering: !0,
                            answerType: !1,
                            Testindex: e.testListIndNum,
                            laodingFlag: e.laodingFlag
                        },
                        on: {
                            changChecked: e.changCheckedmore
                        }
                    })], 1) : e._e(), null != e.itemCard && "7" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("DocumentTitle", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            degreeType: !1,
                            answering: !0,
                            DocumentTitleObj: e.itemCard,
                            Testindex: e.testListIndNum,
                            answerType: !1,
                            inputEditorFalg: !0,
                            courserole: e.courserole,
                            noPasting: e.noPasting,
                            cutscreenState: e.cutscreenState
                        },
                        on: {
                            myInputValue: e.getInputTitleValueDoc,
                            myInputValueInput: e.getInputTitleValueDoc,
                            upSuccessValue: e.upSuccessValue,
                            getInputTitleValue: e.ChangeInputTitleValue,
                            upLoadClick: e.upLoadClick
                        }
                    })], 1) : e._e(), null != e.itemCard && "4" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("ShortAnswerQuestions", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            degreeType: !1,
                            answering: !0,
                            ShortAnswerQuestionsObj: e.itemCard,
                            Testindex: e.testListIndNum,
                            answerType: !1,
                            noPasting: e.noPasting,
                            inputEditorFalg: !0,
                            isabledDoing: !1,
                            cutscreenState: e.cutscreenState
                        },
                        on: {
                            myInputValue: e.getInputTitleValueShort,
                            myInputValueInput: e.getInputTitleValueShort
                        }
                    })], 1) : e._e(), null != e.itemCard && "10" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("Paragraph", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            ParagraphObj: e.itemCard,
                            Testindex: e.testListIndNum,
                            answerType: !1
                        }
                    })], 1) : e._e(), null != e.itemCard && "5" == e.itemCard.type ? s("div", {
                        staticClass: "card-box"
                    }, [s("oldBlanks", {
                        directives: [{
                            name: "watermark",
                            rawName: "v-watermark",
                            value: {
                                text: e.watermark,
                                stno: e.stno
                            },
                            expression: "{ text: watermark, stno: stno }"
                        }],
                        key: e.itemCard.id,
                        attrs: {
                            degreeType: !1,
                            answering: !0,
                            ShortAnswerQuestionsObj: e.itemCard,
                            Testindex: e.testListIndNum,
                            answerType: !1,
                            inputEditorFalg: !0,
                            noPasting: e.noPasting,
                            cutscreenState: e.cutscreenState
                        },
                        on: {
                            myInputValue: e.getInputTitleValueShort,
                            myInputValueInput: e.getInputTitleValueShort
                        }
                    })], 1) : e._e(), s("div", {
                        staticClass: "wrapper-bg"
                    }, [s("p", {
                        staticClass: "card-bot"
                    }, [e.preBtnFlag ? s("el-button", {
                        attrs: {
                            type: "primary",
                            disabled: 0 == e.testListIndNum
                        },
                        on: {
                            click: e.preCardClick
                        }
                    }, [e._v("上一题")]) : e._e(), s("el-button", {
                        attrs: {
                            type: "primary",
                            disabled: e.testListIndNum == e.testListPreview.length - 1
                        },
                        on: {
                            click: e.nextCardClick
                        }
                    }, [e._v("下一题")])], 1)])]) : e._e()])])])
                },
                    n = [function() {
                        var e = this,
                            t = e.$createElement,
                            s = e._self._c || t;
                        return s("div", {
                            staticClass: "head-tips"
                        }, [s("i", {
                            staticClass: "el-icon-warning"
                        }), e._v("您当前在试题预览页面，可以答题，但是不能提交答题结果")])
                    }, function() {
                        var e = this,
                            t = e.$createElement,
                            s = e._self._c || t;
                        return s("div", {
                            staticClass: "answer-type"
                        }, [s("span", {
                            staticClass: "Answered"
                        }, [e._v("已答"), s("i")]), s("span", {
                            staticClass: "AnsweredNo"
                        }, [e._v("未答"), s("i")])])
                    }],
                    i = s("1da1"),
                    r = s("d4ec"),
                    l = s("bee2"),
                    o = s("262e"),
                    u = s("2caf"),
                    c = (s("96cf"), s("a15b"), s("159b"), s("a9e3"), s("99af"), s("9ab4")),
                    d = s("5f72"),
                    m = s("93bf"),
                    h = s.n(m),
                    p = s("60a3"),
                    g = s("881a"),
                    w = s("40d4"),
                    v = s("1235"),
                    f = s("7e32"),
                    C = s("f4f8"),
                    k = s("206e"),
                    b = s("bcd6"),
                    y = s("f625"),
                    T = s("53db"),
                    x = s("48b8"),
                    I = s("c1df"),
                    j = s.n(I),
                    S = s("8253"),
                    L = s("8bbf"),
                    A = s.n(L);
                A.a.directive("watermark", (function(e, t) {
                    function s() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "课堂派",
                            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                            s = arguments.length > 2 ? arguments[2] : void 0,
                            a = arguments.length > 3 ? arguments[3] : void 0,
                            n = arguments.length > 4 ? arguments[4] : void 0,
                            i = document.createElement("canvas");
                        s.appendChild(i), i.width = 210, i.height = 120;
                        var r = i.getContext("2d");
                        r.rotate(-25 * Math.PI / 180), r.font = a || "10px Microsoft JhengHei", r.fillStyle = n || "rgba(180, 180, 180, 0.3)", r.textAlign = "center", r.textBaseline = "Middle", r.fillText(e, i.width / 3, i.height / 1), r.fillText(t, i.width / 3, i.height / .8), s.style.backgroundImage = "url(" + i.toDataURL("image/png") + ") ", s.removeChild(i)
                    }
                    s(t.value.text, t.value.stno, e, t.value.font, t.value.textColor)
                }));
                var F = s("73ec"),
                    O = function(e) {
                        Object(o["a"])(s, e);
                        var t = Object(u["a"])(s);

                        function s() {
                            var e;
                            return Object(r["a"])(this, s), e = t.apply(this, arguments), e.courseid = "", e.testpaperid = "", e.courserole = "", e.descObj = {}, e.nowTime = "", e.itemCard = null, e.testListPreview = [], e.nowTimers = 0, e.remainTime = 999, e.downTime = "", e.testListIndNum = 0, e.fallbackNumer = 0, e.preBtnFlag = !0, e.testListPreviewNum = [], e.fallbackFlag = !1, e.watermark = "", e.stno = "", e.isFullscreen = !1, e.cutscreenState = 0, e.testpaperAllCount = 0, e.stuentCount = 0, e.lastCount = 0, e.uploadFlag = !1, e.handupStatus = !0, e.remainTimes = 0, e.laodingFlag = !1, e.noPasting = !1, e.isCutScreenIng = !1, e.timeout = null, e
                        }
                        return Object(l["a"])(s, [{
                            key: "currentTime",
                            value: function() {
                                this.iner = setInterval(this.getDate, 1e3)
                            }
                        }, {
                            key: "preCardClick",
                            value: function() {
                                if (this.itemCard = null, !(this.testListIndNum > 0)) return !1;
                                this.testListIndNum--, this.itemCard = this.testListPreview[this.testListIndNum]
                            }
                        }, {
                            key: "nextCardClick",
                            value: function() {
                                if (this.itemCard = null, !(this.testListIndNum < this.testListPreview.length - 1)) return !1;
                                this.testListIndNum++, this.preBtnFlag || this.setFallbackLimitApiFn(this.testListIndNum + 1), this.itemCard = this.testListPreview[this.testListIndNum]
                            }
                        }, {
                            key: "checkedTestPaper",
                            value: function(e, t) {
                                false ? this.$message.error("当前试卷已经设置成了不允许回退，无法进行试题选择！") : (this.itemCard = this.testListPreview[t], this.testListIndNum = t)
                            }
                        }, {
                            key: "getDate",
                            value: function() {
                                var e = new Date,
                                    t = e - this.nowTimers,
                                    s = x["g"].addzero(Math.floor(t / 1e3) % 60),
                                    a = x["g"].addzero(Math.floor(t / 6e4) % 60),
                                    n = x["g"].addzero(Math.floor(t / 36e5));
                                this.nowTime = n + ":" + a + ":" + s
                            }
                        }, {
                            key: "getDownTimer",
                            value: function() {
                                var e = this;
                                this.remainIner = setInterval((function() {
                                    0 == e.remainTime ? (e.downTime = "00:00:00", clearInterval(e.remainIner), clearInterval(e.downTimerInterval), d["Message"].success("测试结束，系统自动提交试卷..."), e.handupApi("1")) : (e.remainTime--, e.downTime = x["g"].addzero(Math.floor(e.remainTime / 3600)) + ":" + x["g"].addzero(Math.floor(e.remainTime / 60) % 60) + ":" + x["g"].addzero(e.remainTime % 60), 15 == e.remainTime && e.$alert("15秒后，系统将自动交卷！", "系统提示", {
                                        confirmButtonText: "已知晓",
                                        callback: function(e) {}
                                    }))
                                }), 1e3)
                            }
                        }, {
                            key: "syncTimes",
                            value: function() {
                                var e = {
                                    testpaperid: this.testpaperid
                                };
                                this.downTimerInterval = setInterval((function() {
                                    T["a"].syncTimes(e, {
                                        allData: !0,
                                        loading: !1
                                    })
                                }), 2e4)
                            }
                        }, {
                            key: "radioChangeClick",
                            value: function(e) {
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer,
                                    ids: e.ids
                                };
                                this.saveAnswerApi(t, "show", "")
                            }
                        }, {
                            key: "radioChangeClickSing",
                            value: function(e) {
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer,
                                    ids: e.ids
                                };
                                this.saveAnswerApi(t, "show", "")
                            }
                        }, {
                            key: "changChecked",
                            value: function(e) {
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer.length ? e.answer.join("|") : "",
                                    ids: e.ids
                                };
                                this.saveAnswerApi(t, "show", "show")
                            }
                        }, {
                            key: "changCheckedmore",
                            value: function(e) {
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer.length ? e.answer.join("|") : "",
                                    ids: e.ids
                                };
                                this.saveAnswerApi(t, "show", "show")
                            }
                        }, {
                            key: "getInputTitleValueDoc",
                            value: function(e) {
                                if (null != e) {
                                    var t = {
                                        subjectid: e.obj.id,
                                        answer: e.answer,
                                        ids: e.ids
                                    };
                                    "" != e.answer && this.saveAnswerApi(t, "", "")
                                }
                            }
                        }, {
                            key: "upSuccessValue",
                            value: function(e) {
                                this.saveFileAnswerApi(e.attachment, e.testid, e.ids)
                            }
                        }, {
                            key: "saveFileAnswerApi",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e(t, s, a) {
                                    var n, i;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return n = [], t.length && t.forEach((function(e) {
                                                    n.push(e.fileid)
                                                })), i = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid,
                                                    subjectid: s,
                                                    attachment: n.join("|")
                                                }, e.next = 5, T["a"].saveFileAnswerApi(i, {
                                                    allData: !0,
                                                    loading: !0
                                                });
                                            case 5:
                                                e.sent, this.testListPreview[a].answerAttachment = t, t && t.length > 0 ? this.testListPreview[a].answerTypes = "1" : this.testListPreview[a].answerTypes = "0";
                                            case 8:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t(t, s, a) {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "ChangeInputTitleValue",
                            value: function() {}
                        }, {
                            key: "upLoadClick",
                            value: function() {
                                this.uploadFlag = !0
                            }
                        }, {
                            key: "getInputTitleValueShort",
                            value: function(e) {
                                if (null == e) return null;
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer,
                                    ids: e.ids
                                };
                                "" != e.answer && this.saveAnswerApi(t, "", "")
                            }
                        }, {
                            key: "CompletionChangValue",
                            value: function(e) {
                                var t = {
                                    subjectid: e.obj.id,
                                    answer: e.answer,
                                    ids: e.ids
                                };
                                "" != e.answer && this.saveAnswerApi(t, "", "")
                            }
                        }, {
                            key: "getAnserEnd",
                            get: function() {
                                var e = 0;
                                return this.testListPreview.forEach((function(t) {
                                    "1" == t.answerTypes && e++
                                })), e
                            }
                        }, {
                            key: "getAnserProgress",
                            get: function() {
                                var e, t = 0;
                                return this.testListPreview.forEach((function(e) {
                                    "1" == e.answerTypes && t++
                                })), e = t > 0 ? Math.ceil(t / this.testListPreview.length * 100) : 0, e
                            }
                        }, {
                            key: "stopRefresh",
                            value: function() {
                                document.onkeydown = function(e) {
                                    var t = window.event || e,
                                        s = t.keyCode || t.which,
                                        a = e.ctrlKey,
                                        n = e.shiftKey,
                                        i = e.altKey;
                                    return (116 == s || 112 == s || a && 82 == s) && (t.preventDefault ? t.preventDefault() : (t.keyCode = 0, t.returnValue = !1)), (!a || 78 != s) && ((!n || 121 != s) && ((!i || 115 != s) && ((!i || 27 != s) && void 0)))
                                }
                            }
                        }, {
                            key: "doSubjectListApi",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t, s, a, n, i, r, l, o, u, c, m, h, p, g = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return this.itemCard = null, t = x["c"].getLocalStorage("testCode"), t || (t = ""), s = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid,
                                                    testCode: t
                                                }, e.next = 6, T["a"].doSubjectListApi(s, {
                                                    allData: !0,
                                                    loading: !0
                                                });
                                            case 6:
                                                a = e.sent, n = a.data.testpaper, n && n.cutscreen && x["c"].setLocalStorage("testCode", n.cutscreen.testCode), this.descObj = n, this.remainTimes = a.data.remainTimes, i = Number(j()(new Date).format("X")), 1 == this.descObj.over ? this.$alert("测试已经结束了，无法进行答题", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        g.$router.push({
                                                            path: "/main/classDetail",
                                                            query: {
                                                                courseid: g.courseid,
                                                                courserole: g.courserole
                                                            }
                                                        })
                                                    }
                                                }) : (r = a.data.testpaper.cutscreen, this.lastCount = r.lastCount, this.cutscreenState = r.cutscreenState, this.testpaperAllCount = r.testpaperAllCount, this.stuentCount = r.studentCount, "1" != this.courserole && 1 == this.cutscreenState && (this.stopRefresh(), 1 == r.isFirstJoin ? this.$confirm('<div style="text-decoration:line-through">本场考试已开启切屏模式，切换页面<span style="color:red">'.concat(this.testpaperAllCount, "</span>次后将强制交卷</div><p style='color:maroon;font-size:20px'>请随意答题已为您开启反反作弊模式</p>"), "提示", {
                                                    confirmButtonText: "开始答题",
                                                    cancelButtonText: "暂不答题",
                                                    dangerouslyUseHTMLString: !0,
                                                    type: "warning"
                                                }).then((function() {
                                                    g.clickFullscreen(), g.setBeginAnswer()
                                                })).catch((function() {
                                                    g.$router.go(-1)
                                                })) : this.$alert('<div style="text-decoration:line-through">本场考试已开启切屏模式，切换页面<span style="color:red">'.concat(this.testpaperAllCount, "</span>次后将强制交卷</div><p style='color:maroon;font-size:20px'>请随意答题已为您开启反反作弊模式</p>"), "提示", {
                                                    confirmButtonText: "知道了",
                                                    dangerouslyUseHTMLString: !0,
                                                    showClose: !1,
                                                    center: !0,
                                                    callback: function(e) {
                                                        g.clickFullscreen()
                                                    }
                                                })), l = Number(a.data.fallback_number), o = null, u = 0, a.data.lists && a.data.lists.forEach((function(e, t) {
                                                    null != e.myanswer && e.myanswer || null != e.answerAttachment && e.answerAttachment.length > 0 || "10" == e.type ? e.answerTypes = "1" : (e.answerTypes = "0", null == o && (o = e, u = t))
                                                })), this.testListPreview = a.data.lists, this.testListPreviewNum = a.data.lists, "1" == n.fallback ? (Number(n["isrand"]) > 0 ? null == o ? (this.itemCard = this.testListPreview[this.testListPreviewNum.length - 1], this.testListIndNum = this.testListPreviewNum.length - 1) : (this.itemCard = o, this.testListIndNum = u) : (l - 1 >= 0 && (this.itemCard = this.testListPreview[l - 1]), this.testListIndNum = l - 1), this.preBtnFlag = !1, this.fallbackFlag = !0) : null != this.testListPreview[this.testListIndNum] && (this.itemCard = this.testListPreview[this.testListIndNum]), this.descObj = n, this.descObj.newBeginTimer = Number(n.begintime) <= 0 ? "无" : j.a.unix(Number(n.begintime)).format("YYYY-MM-DD HH:mm"), this.descObj.newEndTimer = Number(n.endtime) <= 0 ? "无" : j.a.unix(Number(n.endtime)).format("YYYY-MM-DD HH:mm"), "0" == n.allowcopy && (c = this.$refs.setBoxMessage, c.oncontextmenu = function() {}, c.oncopy = function() {}, c.className += ""), "0" == n.allowpaster && (m = this.$refs.setBoxMessage, m.onpaste = function(e) {}, this.noPasting = !0), Number(this.descObj.endtime) > i && null != this.descObj.timelength && 0 != this.descObj.timelength ? (this.getDownTimer(), this.syncTimes(), Number(this.remainTimes) < Number(this.descObj.timelength) ? this.limtEndTinerLength = setInterval((function() {
                                                    var e = Number(g.remainTimes);
                                                    e--, 0 == e && (clearInterval(g.limtEndTinerLength), g.handupApi("4"))
                                                }), 1e3) : this.limtEndTinerLength = setInterval((function() {
                                                    var e = Number(g.descObj.timelength);
                                                    e--, 0 == e && (clearInterval(g.limtEndTinerLength), g.handupApi("4"))
                                                }), 1e3), i + Number(this.descObj.timelength), h = this, this.limtEndTinerLength = setInterval((function() {
                                                    i > Number(h.descObj.endtime) && (clearInterval(h.limtEndTinerLength), h.handupApi("3"))
                                                }), 1e3)) : null != this.descObj.timelength && 0 != this.descObj.timelength && 0 == Number(this.descObj.endtime) ? (this.getDownTimer(), this.syncTimes()) : Number(this.descObj.endtime) > 0 && (null == this.descObj.timelength || 0 == this.descObj.timelength) ? (this.currentTime(), p = this, this.limtEndTiner = setInterval((function() {
                                                    var e = Number(j()(new Date).format("X"));
                                                    e >= Number(p.descObj.endtime) && (clearInterval(p.limtEndTiner), p.handupApi("1"))
                                                }), 1e3)) : this.currentTime());
                                            case 13:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "setBeginAnswer",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return t = {
                                                    testpaperid: this.testpaperid
                                                }, e.next = 3, T["a"].setBeginAnswer(t, {
                                                    allData: !0,
                                                    loading: !1
                                                });
                                            case 3:
                                                e.sent;
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "testOnlineApi",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t, s, a, n = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return t = x["c"].getLocalStorage("userCode"), t || (t = ""), s = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid,
                                                    userCode: t
                                                }, e.next = 5, T["a"].testOnlineApi(s, {
                                                    allData: !0,
                                                    loading: !1
                                                });
                                            case 5:
                                                a = e.sent, "" != a.data.data.onlineCode && x["c"].setLocalStorage("userCode", a.data.data.onlineCode), 2 == a.data.data.testRate && this.$alert("老师设置了只允许一台设备登录作答，您已经登录一台设备，不允许登录多台设备哦！", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }), 1 == a.data.data.cutscreenState ? this.cutscreenState = 1 : 0 == a.data.data.cutscreenState && (this.cutscreenState = 0), a.data.data.maxCutscreenCount > 0 && this.testpaperAllCount != a.data.data.maxCutscreenCount && (this.testpaperAllCount = a.data.data.maxCutscreenCount, this.lastCount = this.testpaperAllCount - a.data.data.usedScreenCount);
                                            case 10:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "testOnlineInter",
                            value: function() {
                                this.testOnlinInner = setInterval(this.testOnlineApi, 1e4)
                            }
                        }, {
                            key: "getCurrImportlistData",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t, s;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return t = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid
                                                }, this.itemCard = null, e.next = 4, T["a"].getCurrImportlistData(t, {
                                                    allData: !0,
                                                    loading: !0
                                                });
                                            case 4:
                                                s = e.sent, s && 1 === s.status && (s.data.lists.forEach((function(e, t) {
                                                    null != e.myanswer && e.myanswer ? e.answerTypes = "1" : e.answerTypes = "0"
                                                })), this.testListPreview = s.data.lists, this.testListPreviewNum = s.data.lists, this.itemCard = this.testListPreview[this.testListIndNum], this.descObj = s.data.testpaper);
                                            case 6:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "debounce",
                            value: function(e, t) {
                                clearTimeout(this.timeout), this.timeout = setTimeout(e, t)
                            }
                        }, {
                            key: "saveAnswerApi",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e(t, s, a) {
                                    var n, i = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                n = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid,
                                                    subjectid: t.subjectid,
                                                    answer: t.answer
                                                }, this.testListPreview[t.ids].myanswer = t.answer, "" != t.answer ? this.testListPreview[t.ids].answerTypes = "1" : this.testListPreview[t.ids].answerTypes = "0", "0" == this.courserole && ("show" == s ? "show" == a ? this.debounce((function() {
                                                    i.laodingFlag = !0, T["a"].saveAnswerApi(n, {
                                                        allData: !0,
                                                        loading: !1
                                                    }).then((function(e) {
                                                        i.$store.dispatch("testpaper/setMessage", "点击过快，正在保存答案中..."), i.laodingFlag = !1, i.$message({
                                                            message: "作答保存成功",
                                                            type: "success",
                                                            duration: 1e3
                                                        })
                                                    })).catch((function(e) {
                                                        void 0 != e && "" != e && null != e || (i.$store.dispatch("testpaper/setMessage", "当前网络波动，请重新作答该题"), i.laodingFlag = !1, i.$alert("您的网络出现问题，答案保存失败！请检查当前网络是否有问题，恢复网络后请重新答题。", "系统提示", {
                                                            confirmButtonText: "确定",
                                                            dangerouslyUseHTMLString: !0,
                                                            showClose: !1,
                                                            center: !0,
                                                            type: "warning"
                                                        }))
                                                    }))
                                                }), 1e3) : (this.laodingFlag = !0, T["a"].saveAnswerApi(n, {
                                                    allData: !0,
                                                    loading: !1
                                                }).then((function(e) {
                                                    i.$store.dispatch("testpaper/setMessage", "点击过快，正在保存答案中..."), i.laodingFlag = !1, i.$message({
                                                        message: "作答保存成功",
                                                        type: "success",
                                                        duration: 1e3
                                                    })
                                                })).catch((function(e) {
                                                    void 0 != e && "" != e && null != e || (i.$store.dispatch("testpaper/setMessage", "当前网络波动，请重新作答该题"), i.laodingFlag = !1, i.$alert("您的网络出现问题，答案保存失败！请检查当前网络是否有问题，恢复网络后请重新答题。", "系统提示", {
                                                        confirmButtonText: "确定",
                                                        dangerouslyUseHTMLString: !0,
                                                        showClose: !1,
                                                        center: !0,
                                                        type: "warning"
                                                    }))
                                                }))) : T["a"].saveAnswerApi(n, {
                                                    allData: !0,
                                                    loading: !1
                                                }).then((function(e) {
                                                    i.laodingFlag = !1, i.$message({
                                                        message: "作答保存成功",
                                                        type: "success",
                                                        duration: 1e3
                                                    })
                                                })).catch((function(e) {
                                                    void 0 != e && "" != e && null != e || (i.$store.dispatch("testpaper/setMessage", "当前网络波动，请重新作答该题"), i.laodingFlag = !1, i.$alert("您的网络出现问题，答案保存失败！请检查当前网络是否有问题，恢复网络后请重新答题。", "系统提示", {
                                                        confirmButtonText: "确定",
                                                        dangerouslyUseHTMLString: !0,
                                                        showClose: !1,
                                                        center: !0,
                                                        type: "warning"
                                                    }))
                                                })), this.wsBeginInteract());
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t(t, s, a) {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "setFallbackLimitApiFn",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e(t) {
                                    var s;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return s = {
                                                    testpaperid: this.testpaperid,
                                                    number: t
                                                }, e.next = 3, T["a"].setFallbackLimitApi(s, {
                                                    allData: !0,
                                                    loading: !1
                                                });
                                            case 3:
                                                e.sent;
                                            case 4:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t(t) {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "handupApi",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e(t) {
                                    var s, a, n = this;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return s = {
                                                    testpaperid: this.testpaperid,
                                                    courseid: this.courseid
                                                }, e.next = 3, T["a"].handupApi(s, {
                                                    allData: !0,
                                                    loading: !0,
                                                    showErr: !1
                                                });
                                            case 3:
                                                a = e.sent, 0 === a.status ? this.$alert(a.message ? a.message : "测试已经结束了，无法进行答题", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }) : "1" == t ? this.$alert("测试已经结束了，系统已经自动提交试卷", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }) : "2" == t ? (this.$message({
                                                    type: "success",
                                                    message: "试卷提交成功!"
                                                }), this.$router.go(-1)) : "3" == t ? this.$alert("测试已经结束了，无法进行答题", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }) : "4" == t ? this.$alert("限时时间到，当前测试设置了限时，系统自动提交试卷", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }) : "5" == t && this.$alert("当前测试切屏数次上限，系统自动提交试卷", "系统提示", {
                                                    confirmButtonText: "知道了",
                                                    showClose: !1,
                                                    callback: function(e) {
                                                        n.$router.go(-1)
                                                    }
                                                }), this.wsBeginInteract();
                                            case 6:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t(t) {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "SubmitTestClick",
                            value: function() {
                                var e = this;
                                this.$confirm("是否提交测试?", "提示", {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }).then((function() {
                                    e.handupStatus = !1;
                                    var t = document;
                                    t.exitFullscreen ? t.exitFullscreen() : t.mozCancelFullScreen ? t.mozCancelFullScreen() : t.msExitFullscreen ? t.msExiFullscreen() : t.webkitCancelFullScreen && t.webkitCancelFullScreen(), e.handupApi("2")
                                })).catch((function() {}))
                            }
                        }, {
                            key: "getSnyTImer",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t, s;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return t = {
                                                    testpaperid: this.testpaperid
                                                }, e.next = 3, T["a"].syncTimes(t, {
                                                    allData: !0,
                                                    loading: !1
                                                });
                                            case 3:
                                                s = e.sent, s.data && s.data.remainTime && (this.remainTime = Number(s.data.remainTime));
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "created",
                            value: function() {
                                this.nowTimers = new Date, this.courseid = this.$route.query.courseid || x["c"].getLocalStorage("courseid"), this.testpaperid = this.$route.query.testpaperid || x["c"].getLocalStorage("testpaperid"), this.courserole = this.$route.query.courserole, "1" == this.courserole ? this.getCurrImportlistData() : (this.doSubjectListApi(), this.getSnyTImer(), this.testOnlineApi(), this.testOnlineInter(), this.watermark = this.$store.getters.userInfo.username, this.stno = this.$store.getters.userInfo.stno)
                            }
                        }, {
                            key: "mounted",
                            value: function() {
                                var e = this;
                                window.onresize = function() {};
                                var t = this;
                                window.onblur = function() {}
                            }
                        }, {
                            key: "checkFull",
                            value: function() {}
                        }, {
                            key: "clickFullscreen",
                            value: function() {
                                var e = this;
                                if (Object(F["U"])()) this.isFullscreen = !0;
                                else {
                                    if (!h.a.isEnabled) return this.$message({
                                        message: "该浏览器不支持全屏",
                                        type: "warning"
                                    }), !1;
                                    h.a.on("change", (function() {
                                        var t = h.a;
                                        e.isFullscreen = t.isFullscreen
                                    })), h.a.toggle()
                                }
                            }
                        }, {
                            key: "studentCutscreenLog",
                            value: function() {
                                var e = Object(i["a"])(regeneratorRuntime.mark((function e() {
                                    var t, s;
                                    return regeneratorRuntime.wrap((function(e) {
                                        while (1) switch (e.prev = e.next) {
                                            case 0:
                                                return t = {
                                                    testpaperid: this.testpaperid
                                                }, e.next = 3, T["a"].studentCutscreenLog(t, {
                                                    allData: !0,
                                                    loading: !1
                                                });
                                            case 3:
                                                s = e.sent, 1 == s.cutscreenState && (this.lastCount = s.lastCount, this.testpaperAllCount = s.testpaperAllCount);
                                            case 5:
                                            case "end":
                                                return e.stop()
                                        }
                                    }), e, this)
                                })));

                                function t() {
                                    return e.apply(this, arguments)
                                }
                                return t
                            }()
                        }, {
                            key: "wsBeginInteract",
                            value: function() {
                                var e = {
                                    courseid: this.courseid
                                };
                                S["a"].studentAnswer(e)
                            }
                        }, {
                            key: "destroyed",
                            value: function() {
                                this.iner && clearInterval(this.iner), this.testOnlinInner && clearInterval(this.testOnlinInner), clearInterval(this.remainIner), clearInterval(this.downTimerInterval), window.onresize = null, window.onblur = null
                            }
                        }]), s
                    }(p["i"]);
                O = Object(c["a"])([Object(p["a"])({
                    components: {
                        JudgeTest: g["default"],
                        SingleChoice: w["default"],
                        Multiplechoice: v["default"],
                        IndefiniteItem: f["default"],
                        DocumentTitle: C["default"],
                        ShortAnswerQuestions: k["default"],
                        Paragraph: b["default"],
                        oldBlanks: y["default"]
                    }
                })], O);
                var N = O,
                    _ = N,
                    D = (s("ba16"), s("2877")),
                    P = Object(D["a"])(_, a, n, !1, null, "57393c6f", null);
                t["default"] = P.exports
            },
            cf01: function(e, t, s) {}
        }
    ]);
})();