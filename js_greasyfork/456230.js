// ==UserScript==
// @name         СберКласс
// @namespace    https://beta.sberclass.ru
// @version      0.3.0
// @description  Небольшое улучшение для СберКласса
// @author       Ваш покорный слуга
// @match        https://beta.sberclass.ru/task/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456230/%D0%A1%D0%B1%D0%B5%D1%80%D0%9A%D0%BB%D0%B0%D1%81%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456230/%D0%A1%D0%B1%D0%B5%D1%80%D0%9A%D0%BB%D0%B0%D1%81%D1%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    (self.webpackChunk_mfe_designer = self.webpackChunk_mfe_designer || []).push([[9567], {
        78758: (e, t, s) => {
            "use strict";
            s.d(t, {I0: () => a, Nr: () => o, vT: () => c, _H: () => d});
            var i = s(6736), r = s.n(i), n = s(82623);
            const a = {
                answeredWidgetsIds: [],
                answeredWidgetsNumbers: [],
                widgetsTotal: 0,
                answeredPercentage: 0,
                hasErrors: {}
            }, o = {
                isProtectionRuleDisabled: !1,
                readonly: !0,
                replaceStatusesWithBadges: !1,
                addAccordionToDescription: !1
            }, c = {widgets: []}, d = r().createContext("");
            n.hQ.TEXT, n.hQ.VIDEO, n.hQ.AUDIO, n.hQ.GALLERY, n.hQ.TEST, n.hQ.BANNER, n.hQ.TOP_FACTS
        }, 83924: (e, t, s) => {
            "use strict";
            var i;
            s.d(t, {v: () => i}), function (e) {
                e.EDITOR = "EDITOR", e.PLAYER = "PLAYER"
            }(i || (i = {}))
        }, 92071: (e, t, s) => {
            "use strict";
            s.d(t, {w: () => Re});
            var i = s(63071), r = s(1469), n = s.n(r), a = s(51584), o = s.n(a), c = s(18446), d = s.n(c), u = s(7508),
                g = s(82623);
            const l = e => "getAnswer" in e;
            var M = s(93930), N = s(84008), h = s(81763), I = s.n(h), D = s(16599), A = s(29227), E = s(6618),
                p = s(49448);

            class T extends E.mr {
                events = {
                    ...this.events,
                    setTitle: (0, i.createEvent)(),
                    setDescription: (0, i.createEvent)(),
                    setLanguage: (0, i.createEvent)(),
                    setTheme: (0, i.createEvent)(),
                    setCode: (0, i.createEvent)()
                };

                constructor(e) {
                    super(e, p.XM), this.template = g.hQ.CODE.valueOf(), this.groupType = g.sJ.INFO, this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.setLanguage, ((e, t) => ({
                        ...e,
                        language: t
                    }))).on(this.events.setTheme, ((e, t) => ({
                        ...e,
                        theme: t
                    }))).on(this.events.setCode, ((e, t) => ({
                        ...e,
                        code: t
                    }))), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setLanguage, this.events.setTheme, this.events.setCode])
                }

                combineStores() {
                    return (0, i.combine)({content: this.$content, validationErrors: this.$validationErrors})
                }
            }

            var w = s(4987), v = s(35478), j = s(43375);
            const C = e => {
                const t = function (e) {
                    switch (e) {
                        case g.hQ.BANNER:
                            return 1;
                        case g.hQ.TOP_FACTS:
                            return 3;
                        default:
                            return 0
                    }
                }(e);
                return t ? Array.from(Array(t), j.r) : []
            }, m = {
                updateInputField: (e, t) => ({
                    ...e,
                    images: e.images?.map((e => e.imageId === t.imageId ? {...e, [t.name]: t.value} : e))
                }),
                updateImageUrl: (e, t) => ({
                    ...e,
                    images: e.images?.map((e => e.imageId === t.imageId ? {...e, imgUrl: t.imgUrl} : e))
                }),
                removeImage: (e, t) => ({...e, images: e.images?.filter((e => e.imageId !== t.imageId))}),
                addImage: (e, t) => ({
                    ...e,
                    images: [...e.images || [], {
                        imageId: (0, u.v4)(),
                        imgUrl: t.imgUrl,
                        title: "",
                        description: "",
                        order: e.images?.length
                    }]
                }),
                sortImages: (e, {sortedId: t, newPositionId: s}) => {
                    const i = [...e.images], r = i.findIndex((e => e.imageId === t)),
                        n = i.findIndex((e => e.imageId === s));
                    return i.splice(n, 0, i.splice(r, 1)[0]), {...e, images: [...i]}
                },
                fileUploaded: (e, t) => ({
                    ...e,
                    images: [...e.images || [], {
                        imageId: (0, u.v4)(),
                        imgUrl: t.path,
                        title: "",
                        description: "",
                        order: e.images?.length
                    }]
                }),
                temporaryFileUploaded: (e, t) => ({
                    ...e,
                    images: (e.images || []).map((e => e.imageId === t.id ? {
                        ...e,
                        imgUrl: t.path,
                        isTemporary: !1
                    } : e))
                }),
                setTemporaryImageFile: (e, t) => ({
                    ...e,
                    images: [...e.images || [], {
                        imageId: t.id,
                        imgUrl: t.path,
                        title: "",
                        description: "",
                        order: e.images?.length,
                        isTemporary: t.isTemporary
                    }]
                })
            };

            class O extends E.mr {
                $currentSlideIndex;
                $isFullscreenMode;
                $imageUrlInputValueError;
                $imageUrlInputValue;
                $itemIdInEditMode;
                events = {
                    ...this.events,
                    setCurrentSlideIndex: (0, i.createEvent)(),
                    goToPrevSlide: (0, i.createEvent)(),
                    goToNextSlide: (0, i.createEvent)(),
                    setIsFullscreenMode: (0, i.createEvent)(),
                    setImageUrlInputValue: (0, i.createEvent)(),
                    setImageUrlInputValueError: (0, i.createEvent)(),
                    changeImageInCard: (0, i.createEvent)(),
                    setItemIdInEditMode: (0, i.createEvent)(),
                    uploadImageWithProgress: (0, i.createEvent)()
                };
                template;

                constructor(e) {
                    const {data: t, template: s} = e, r = s || t.template || g.hQ.GALLERY;
                    super(e, (e => ({images: C(e)}))(r)), this.events = {...this.events, ...(0, i.createApi)(this.$content, m)}, this.widgetNumber = t.widgetNumber || 1, this.groupType = g.sJ.INFO, this.template = r, this.$isFullscreenMode = (0, i.restore)(this.events.setIsFullscreenMode, !1), this.$imageUrlInputValue = (0, i.restore)(this.events.setImageUrlInputValue, ""), this.$imageUrlInputValueError = (0, i.restore)(this.events.setImageUrlInputValueError, !1), this.$currentSlideIndex = (0, i.createStore)(0).on(this.events.goToNextSlide, (e => e + 1)).on(this.events.goToPrevSlide, (e => e - 1)).on(this.events.setCurrentSlideIndex, ((e, t) => {
                        const {images: s} = this.$content.getState();
                        return t > s.length - 1 ? 0 : t < 0 ? s.length - 1 : t
                    })), this.$itemIdInEditMode = (0, i.restore)(this.events.setItemIdInEditMode, ""), super.useFileUploader(this.events.fileUploaded), super.useFileUploader(this.events.temporaryFileUploaded, this.events.uploadImageWithProgress, this.events.setTemporaryImageFile), super.useWidgetsEdit([this.events.updateInputField, this.events.updateImageUrl, this.events.removeImage, this.events.addImage, this.events.sortImages, this.events.fileUploaded]), (0, i.sample)({
                        clock: this.events.changeImageInCard,
                        fn: async ({imageId: e, file: t}) => {
                            const s = await (this.api.uploadFile?.(t));
                            s && this.events.updateImageUrl({imageId: e, imgUrl: s.path})
                        }
                    })
                }

                getCopy() {
                    return {
                        images: this.$content.getState().images?.map((({
                                                                           title: e,
                                                                           description: t,
                                                                           order: s,
                                                                           imgUrl: i
                                                                       }) => ({
                            imageId: (0, u.v4)(),
                            title: e,
                            description: t,
                            order: s,
                            imgUrl: i
                        })))
                    }
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        imageUrlInputValue: this.$imageUrlInputValue,
                        imageUrlInputValueError: this.$imageUrlInputValueError,
                        isFullscreenMode: this.$isFullscreenMode,
                        currentSlideIndex: this.$currentSlideIndex,
                        validationErrors: this.$validationErrors,
                        touchedFields: this.$touchedFields,
                        isEditModeTouched: this.$isEditModeTouched,
                        itemIdInEditMode: this.$itemIdInEditMode,
                        filesUploadProgress: this.$filesUploadProgress,
                        errors: this.$validationErrors
                    })
                }
            }

            const z = {
                setTitle: (e, t) => ({...e, title: t.target.value}),
                setDescription: (e, t) => ({...e, description: t}),
                setIframe: (e, t) => ({...e, content: t}),
                setIframeUrl: (e, t) => ({...e, src: t}),
                setIframeWidth: (e, t) => ({...e, width: t}),
                setIframeHeight: (e, t) => ({...e, height: t})
            };
            var L = s(26465);

            class y extends E.mr {
                events = {...this.events};

                constructor(e) {
                    super(e, {
                        content: "",
                        title: "",
                        description: "",
                        width: L.yr,
                        height: L.CY
                    }), this.events = {...this.events, ...(0, i.createApi)(this.$content, z)}, this.template = g.hQ.IFRAME.valueOf(), this.groupType = g.sJ.INFO, this.$content = this.$content.map((e => {
                        const t = (s = e.content, (new DOMParser).parseFromString(s || "", "text/html").querySelector("iframe")?.src || e.src);
                        var s;
                        return {...e, src: t}
                    })), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setIframe])
                }

                getTemplate() {
                    return this.template
                }
            }

            var S = s(88639);
            const U = {content: ""};

            class k extends S.m {
                events = {...this.events, setMarkdownContent: (0, i.createEvent)()};

                constructor(e) {
                    super(e, U), this.events.setHasLoaded(!0), this.template = g.hQ.MARKDOWN.valueOf(), this.groupType = g.sJ.INFO, this.$content.on(this.events.setMarkdownContent, ((e, t) => ({content: t}))), super.useWidgetsEdit([this.events.setMarkdownContent])
                }

                getTemplate() {
                    return this.template
                }
            }

            class x extends E.mr {
                constructor(e) {
                    super(e, {content: ""}), this.template = e.template || g.hQ.TEXT
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        validationErrors: this.$validationErrors,
                        touchedFields: this.$touchedFields,
                        isEditModeTouched: this.$isEditModeTouched
                    })
                }
            }

            const Q = {
                addChoice: e => ({
                    ...e,
                    choices: [...e.choices, {
                        choiceId: (0, u.v4)(),
                        correct: !1,
                        imgUrl: "",
                        originalIndex: e.choices?.length,
                        text: ""
                    }]
                }),
                setTitle: (e, t) => ({...e, title: t}),
                setDescription: (e, t) => ({...e, description: t}),
                setImgUrl: (e, t) => ({...e, imgUrl: t.path}),
                removeImgUrl: e => ({...e, imgUrl: ""}),
                updateChoice: (e, t) => {
                    const s = e.choices?.map((e => t.choiceId === e.choiceId ? {...e, ...t} : e)),
                        i = (s || []).filter((e => !0 === e.correct)).length > 1;
                    return {...e, manyChoices: i, choices: s}
                },
                removeChoice: (e, t) => ({
                    ...e,
                    choices: e.choices?.filter((e => e.choiceId !== t)).map(((e, t) => ({...e, originalIndex: t + 1})))
                }),
                setRightAnswerDescription: (e, t) => ({...e, rightAnswerDescription: t})
            };
            var f = s(69983), Y = s.n(f);

            function $({choices: e = []}) {
                return Y()(e.map((e => ({
                    ...e,
                    correct: null,
                    status: g.q0.DEFAULT,
                    choiceId: e.choiceId || (0, u.v4)()
                }))) || [])
            }

            class F extends E.MN {
                // Тест с вариантами ответа

                $isFullscreenMode;
                events = {
                    ...this.events,
                    selectChoice: (0, i.createEvent)(),
                    setIsFullscreenMode: (0, i.createEvent)(),
                    resetAnswer: (0, i.createEvent)(),
                    uploadChoiceImage: (0, i.createEvent)()
                };
                $initialAnswer;

                constructor(e) {
                    super(e, {
                        title: "",
                        description: "",
                        imgUrl: "",
                        choices: [{choiceId: (0, u.v4)(), correct: !0, originalIndex: 1}, {
                            choiceId: (0, u.v4)(),
                            correct: !1,
                            originalIndex: 2
                        }],
                        manyChoices: !1
                    }, [{
                        choiceId: "",
                        correct: null,
                        status: g.q0.DEFAULT
                    }]), this.events = {...this.events, ...(0, i.createApi)(this.$content, Q)};
                    const {template: t} = e;
                    this.template = t || g.hQ.TEST.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.$isFullscreenMode = (0, i.restore)(this.events.setIsFullscreenMode, !1), this.$widgetStatus.on(this.events.resetAnswer, (() => g.vQ.DEFAULT)), super.useFileUploader(this.events.setImgUrl), (0, i.sample)({
                        clock: this.events.uploadChoiceImage,
                        fn: ({choiceId: e, file: t}) => {
                            this.api.uploadFile?.(t).then((t => {
                                t && this.events.updateChoice({choiceId: e, imgUrl: t.path})
                            }))
                        }
                    }), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.validateAnswer(e)
                    })), this.$answer.on(this.events.selectChoice, ((e, t) => {
                        const {manyChoices: s} = this.getContent() || {};
                        return e.map((e => {
                            const i = e.choiceId === t;
                            if (s) {
                                const t = function (e, t) {
                                    return t ? e.status === g.q0.SELECTED ? g.q0.DEFAULT : g.q0.SELECTED : e.status
                                }(e, i);
                                return {...e, status: t}
                            }
                            return {...e, status: i ? g.q0.SELECTED : g.q0.DEFAULT}
                        }))
                    })).on(this.events.resetAnswer, (e => {
                        const t = this.getContent();
                        return t ? $(t) : e
                    })).watch((e => {
                        if (g.iP.EVALUATED !== this.getAnswerStatus()) {
                            const t = e?.some((e => e.status === g.q0.SELECTED));
                            this.setAnswerStatus(t ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.$content.watch((e => {
                        this.events.setAnswer($(e))
                    })), this.$initialAnswer = this.$content.map((e => $(e))), this.events.setAnswer(this.$initialAnswer.getState()), super.useWidgetsEdit([this.events.addChoice, this.events.setTitle, this.events.setDescription, this.events.setImgUrl, this.events.removeImgUrl, this.events.updateChoice, this.events.removeChoice, this.events.setRightAnswerDescription])
                }

                showCorrectAnswers(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    let i;
                    if (e) {
                        const e = s?.choices?.filter((e => e.correct)), r = e?.map((e => e.choiceId));
                        i = t.map((e => ({
                            ...e,
                            correct: !!r?.includes(e.choiceId) || null
                        }))), this.setFullAnswer(i), this.setAnswerStatus(g.iP.EVALUATED)
                    } else this.setFullAnswer(this.$initialAnswer.getState()), this.setAnswerStatus(g.iP.DEFAULT);
                    return this
                }

                validateAnswer(e) {
                    const t = this.getFullAnswer(), s = this.getContent(), i = s?.choices?.filter((e => e.correct));
                    if (0 === i?.length) return this;
                    let r;
                    r = e ? t.map((e => {
                        let t;
                        return e.status === g.q0.SELECTED && (t = s?.choices?.find((t => t.choiceId === e.choiceId))?.correct), {
                            ...e,
                            correct: t
                        }
                    })) : t.map((e => ({
                        ...e,
                        status: [g.q0.DEFAULT, g.q0.DISABLED].includes(e.status) ? e.status : g.q0.SELECTED
                    }))), this.events.setAnswer(r);
                    const n = r.filter((({correct: e}) => o()(e))),
                        a = i?.every((({choiceId: e}) => n?.find((t => t.choiceId === e)))) && i.length === n.length;
                    return this.setWidgetStatus(a ? g.vQ.CORRECT : g.vQ.ERROR).setAnswerStatus(g.iP.EVALUATED), this
                }

                updateAnswer(e) {
                    const t = this.$initialAnswer.getState().map((t => {
                        const s = e.find((({choiceId: e}) => t.choiceId === e));
                        return s ? {
                            ...t,
                            correct: o()(s.correct) ? s.correct : null,
                            status: s.status === g.q0.SELECTED ? g.q0.SELECTED : g.q0.DEFAULT
                        } : t
                    }));
                    return this.events.setAnswer(t), this
                }

                getCopy() {
                    return {
                        title: (e = this.$content.getState()).title,
                        description: e.description,
                        imgUrl: e.imgUrl,
                        choices: e.choices?.map((({
                                                      text: e,
                                                      originalIndex: t,
                                                      correct: s,
                                                      imgUrl: i
                                                  }) => ({
                            choiceId: (0, u.v4)(),
                            text: e,
                            originalIndex: t,
                            correct: s,
                            imgUrl: i
                        }))),
                        manyChoices: e.manyChoices
                    };
                    var e
                }

                updateAnswerStatus() {
                    const e = this.getContent(), t = this.getAnswerStatus();
                    const s = e?.choices.map((e => {
                        let s = e.status;
                        return s = t === g.iP.EVALUATED ? (e?.correct) ? e?.correct ? g.q0.CORRECT : g.q0.ERROR : g.q0.DISABLED : (e?.correct) || e.status === g.q0.SELECTED ? g.q0.SELECTED : this.$widgetStatus.getState() === g.vQ.DISABLED ? g.q0.DISABLED : g.q0.DEFAULT, {
                            ...e,
                            status: s
                        }
                    }));
                    return this.events.setAnswer(s), this
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus,
                        isFullscreenMode: this.$isFullscreenMode,
                        widgetStatus: this.$widgetStatus,
                        validationErrors: this.$validationErrors,
                        touchedFields: this.$touchedFields,
                        isEditModeTouched: this.$isEditModeTouched
                    })
                }

                resetAnswer() {
                    const e = this.$answer.getState().map((e => ({...e, status: g.q0.DEFAULT})));
                    return this.setFullAnswer(e), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    return super.getAnswer().filter((e => e.status === g.q0.SELECTED)).map((({choiceId: e}) => ({choiceId: e})))
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = this.$answer.getState().map((t => {
                        const s = e?.find((({choiceId: e}) => t.choiceId === e));
                        return {...t, status: s ? g.q0.SELECTED : g.q0.DEFAULT, correct: s?.correct}
                    }));
                    return this.setFullAnswer(t), this
                }
            }

            var b = s(89734), P = s.n(b), R = s(20936);
            const W = {
                addGroup: e => ({...e, groups: [...e.groups || [], {groupId: (0, u.v4)()}]}),
                removeGroup: (e, t) => ({
                    ...e,
                    cards: e.cards?.filter((e => e.groupId !== t)),
                    groups: e.groups?.filter((e => e.groupId !== t))
                }),
                updateGroups: (e, t) => {
                    const s = e.groups?.map((e => e.groupId === t.groupId ? {...e, ...t} : e));
                    return {...e, groups: s}
                },
                swapCards: (e, {activeCardId: t, overCardId: s}) => {
                    const i = [];
                    let r, n;
                    e.cards.forEach((e => {
                        e.cardId !== t ? e.cardId !== s ? i.push(e) : n = e : r = e
                    }));
                    const a = r?.groupOrder, o = n?.groupOrder;
                    return r && i.push({...r, groupOrder: o}), n && i.push({...n, groupOrder: a}), {...e, cards: i}
                },
                setCards: (e, t) => ({...e, cards: [...t]})
            };

            class V extends E.MN {
                // Тест с перетягиванием ответов в группы

                events = {
                    ...this.events,
                    setTitle: (0, i.createEvent)(),
                    setDescription: (0, i.createEvent)(),
                    setAnswerCards: (0, i.createEvent)(),
                    handleDragStart: (0, i.createEvent)(),
                    handleDragOver: (0, i.createEvent)(),
                    setImgUrl: (0, i.createEvent)(),
                    removeImgUrl: (0, i.createEvent)(),
                    setOrderSensitive: (0, i.createEvent)()
                };
                $ungroupedCards;
                $activeCardElement;
                $canAddGroup;
                $canAddCard;

                constructor(e) {
                    super(e, R.tp, R.eJ), this.events = {...this.events, ...(0, i.createApi)(this.$content, W)}, this.template = g.hQ.SORTABLE.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.$answer.on(this.events.setAnswerCards, ((e, t) => t)).watch((e => {
                        if (g.iP.EVALUATED !== this.getAnswerStatus()) {
                            const t = e?.some((e => e.groupId));
                            this.setAnswerStatus?.(t ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.setImgUrl, ((e, t) => ({
                        ...e,
                        imgUrl: t.path
                    }))).on(this.events.removeImgUrl, (e => ({
                        ...e,
                        imgUrl: ""
                    }))).on(this.events.setOrderSensitive, ((e, t) => ({
                        ...e,
                        orderSensitive: t
                    }))), this.$content.watch((e => {
                        const {cards: t} = e, s = t?.map((e => ({...e, groupId: null, groupOrder: null})));
                        this.events.setAnswerCards(s)
                    })), this.$ungroupedCards = this.$answer.map((e => e ? e.filter((e => null == e.groupId)) : [])), this.$activeCardElement = (0, i.createStore)(null).on(this.events.handleDragStart, ((e, t) => document.querySelectorAll(`[data-card-id="${t.active.id}"]`)[0].innerHTML)), this.events.handleDragOver.watch(this.handleDragOver.bind(this)), this.useFileUploader(this.events.setImgUrl), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.validateAnswer(e)
                    })), null == e.data.content && this.events.addGroup(), this.$canAddGroup = this.$content.map((({groups: e}) => null == e || e.length < R.pL)), this.$canAddCard = this.$content.map((({cards: e}) => null == e || e.length < R.Qi)), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setOrderSensitive, this.events.addGroup, this.events.removeGroup, this.events.updateGroups, this.events.swapCards, this.events.setCards, this.events.setImgUrl, this.events.removeImgUrl])
                }

                showCorrectAnswers(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    let i;
                    return e ? (i = t.map((e => ({
                        ...e,
                        groupId: s?.cards?.find((t => t.cardId === e.cardId))?.groupId || null,
                        correct: !0,
                        groupOrder: s?.cards?.find((t => t.cardId === e.cardId))?.groupOrder || null
                    }))).sort(((e, t) => (e.groupOrder ?? 0) - (t.groupOrder ?? 0))), this.setFullAnswer(i), this.setAnswerStatus(g.iP.EVALUATED)) : (i = t.map((e => ({
                        ...e,
                        groupId: null,
                        correct: void 0
                    }))), this.setFullAnswer(i), this.setAnswerStatus(g.iP.DEFAULT)), this
                }

                updateAnswer(e) {
                    const t = this.getFullAnswer().map((t => {
                        const s = e?.find((({cardId: e}) => t.cardId === e));
                        return s ? {
                            ...t,
                            groupId: s?.groupId || null,
                            groupOrder: s?.groupOrder || null,
                            correct: s?.correct
                        } : t
                    }));
                    return this.events.setAnswerCards(t), this
                }

                updateAnswerStatus() {
                    return this.showCorrectAnswers(e), this
                }

                validateAnswer(e) {
                    const t = this.getContent(), s = this.getFullAnswer(), {cards: i, orderSensitive: r} = t || {};
                    if (e) {
                        if (i?.every((e => null === e.groupId))) return this;
                        const e = s.map((e => {
                            const t = i?.find((({cardId: t}) => t === e.cardId));
                            let s = t?.groupId === e.groupId || !e?.groupOrder;
                            return r && s && (s = t?.groupOrder === e.groupOrder), {...e, correct: s}
                        }));
                        this.events.setAnswerCards(e), this.setWidgetStatus(e.every((({correct: e}) => e)) ? g.vQ.CORRECT : g.vQ.ERROR).setAnswerStatus?.(g.iP.EVALUATED)
                    } else this.setWidgetStatus(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT);
                    return this
                }

                getTemplate() {
                    return this.template
                }

                handleDragOver(e) {
                    const {active: t, over: s} = e, i = this.getFullAnswer().find((e => e.cardId === t.id));
                    s && i && ("group" === s?.data?.current?.type ? this.handleDragOverGroup(t.id, "ungrouped-cards" !== s.id ? s.id : null) : this.handleDragOverCard(t.id, s.id))
                }

                handleDragOverGroup(e, t) {
                    const s = this.getFullAnswer(), i = s.find((t => t.cardId === e));
                    if (i) {
                        if (i?.groupId === t) return;
                        const r = s.map((r => r.cardId === e ? {
                            ...r,
                            groupOrder: t ? s.filter((e => e.groupId === t)).length + 1 : null,
                            groupId: t
                        } : i.groupOrder && r.groupOrder && r.groupId === i.groupId && r.groupOrder > i.groupOrder ? {
                            ...r,
                            groupOrder: r.groupOrder - 1
                        } : r));
                        this.events.setAnswerCards(P()(r, ["groupId", "groupOrder"]))
                    }
                }

                handleDragOverCard(e, t) {
                    const s = this.getFullAnswer();
                    if (e === t) return;
                    const i = s.find((({cardId: t}) => t === e)), r = s.find((({cardId: e}) => e === t));
                    if (i && r) if (i?.groupId === r?.groupId) {
                        if (!i.groupOrder || !r.groupOrder) return;
                        const e = i.groupOrder < r.groupOrder, t = s.map((t => {
                            if (t.groupId === i.groupId && t.groupOrder && i.groupOrder && r.groupOrder) {
                                if (e && t.groupOrder > i.groupOrder && t.groupOrder <= r.groupOrder) return {
                                    ...t,
                                    groupOrder: t.groupOrder - 1
                                };
                                if (!e && t.groupOrder >= r.groupOrder && t.groupOrder < i.groupOrder) return {
                                    ...t,
                                    groupOrder: t.groupOrder + 1
                                };
                                if (t.groupOrder === i.groupOrder) return {...t, groupOrder: r.groupOrder}
                            }
                            return t
                        }));
                        this.events.setAnswerCards(P()(t, ["groupId", "groupOrder"]))
                    } else {
                        if (!r?.groupId) return void this.handleDragOverGroup(e, null);
                        const t = s.map((t => t.cardId === e ? {
                            ...t,
                            groupOrder: r.groupOrder,
                            groupId: r.groupId
                        } : i.groupOrder && t.groupOrder && t.groupId === i.groupId && t.groupOrder > i.groupOrder ? {
                            ...t,
                            groupOrder: t.groupOrder - 1
                        } : r.groupOrder && t.groupOrder && t.groupId === r.groupId && t.groupOrder >= r.groupOrder ? {
                            ...t,
                            groupOrder: t.groupOrder + 1
                        } : t));
                        this.events.setAnswerCards(P()(t, ["groupId", "groupOrder"]))
                    }
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        ungroupedCards: this.$ungroupedCards,
                        activeCardElement: this.$activeCardElement,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus
                    })
                }

                resetAnswer() {
                    const e = this.$answer.getState().map((e => {
                        const t = this.$content.getState().cards.find((t => t.cardId === e.cardId))?.groupOrder || 1;
                        return {...e, groupId: null, groupOrder: t}
                    }));
                    return this.setFullAnswer(e), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    return super.getAnswer().map((({cardId: e, groupId: t, groupOrder: s}) => ({
                        cardId: e,
                        groupId: t,
                        groupOrder: s
                    })))
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = this.$answer.getState().map((t => {
                        const s = e?.find((({cardId: e}) => e === t.cardId));
                        return {
                            ...t,
                            status: s ? g.q0.SELECTED : g.q0.DEFAULT,
                            groupOrder: s?.groupOrder,
                            groupId: s?.groupId,
                            correct: s?.correct
                        }
                    }));
                    return this.setFullAnswer(t), this
                }
            }

            class G extends E.MN {
                events = {
                    ...this.events,
                    setTitle: (0, i.createEvent)(),
                    setDescription: (0, i.createEvent)(),
                    setTheme: (0, i.createEvent)(),
                    setCode: (0, i.createEvent)(),
                    setImgUrl: (0, i.createEvent)(),
                    removeImgUrl: (0, i.createEvent)()
                };

                constructor(e) {
                    super(e, p.XM, p.Px), this.template = g.hQ.PYTHON.valueOf(), this.groupType = g.sJ.MIXED, this.$answer.watch((e => {
                        if (g.iP.EVALUATED !== this.getAnswerStatus()) {
                            const t = e?.value?.length;
                            this.setAnswerStatus(t ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.setTheme, ((e, t) => ({
                        ...e,
                        theme: t
                    }))).on(this.events.setCode, ((e, t) => ({
                        ...e,
                        code: t
                    }))).on(this.events.setImgUrl, ((e, t) => ({
                        ...e,
                        imageSrc: t.path
                    }))).on(this.events.removeImgUrl, (e => ({...e, imageSrc: ""}))).watch((e => {
                        this.events.setAnswer({value: e.code || "", status: g.q0.DEFAULT})
                    })), super.useFileUploader(this.events.setImgUrl), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setImgUrl, this.events.removeImgUrl, this.events.setTheme, this.events.setCode])
                }

                resetAnswer() {
                    return this.events.setAnswer({
                        value: this.$content.getState().code || "",
                        status: g.q0.DEFAULT
                    }), this
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity
                    })
                }
            }

            var B = s(91966), K = s.n(B), _ = s(50872), H = s(11626);
            const q = {
                setImgUrl: (e, t) => ({...e, imgUrl: t.path}),
                removeImgUrl: e => ({...e, imgUrl: ""}),
                addGroup: e => {
                    const t = (0, u.v4)();
                    return {
                        ...e,
                        leftCards: [...e.leftCards, {cardId: (0, u.v4)(), pairId: t, content: "", imgUrl: ""}],
                        rightCards: [...e.rightCards, {cardId: (0, u.v4)(), pairId: t, content: "", imgUrl: ""}]
                    }
                },
                removeGroup: (e, t) => ({
                    ...e,
                    leftCards: e.leftCards.filter((e => e.pairId !== t)),
                    rightCards: e.rightCards.filter((e => e.pairId !== t))
                }),
                setCardData: (e, t) => {
                    const s = e => e.map((e => e.cardId === t.cardId ? {...e, ...t} : e)), i = s(e.leftCards),
                        r = s(e.rightCards);
                    return {...e, leftCards: i, rightCards: r}
                }
            };

            class Z extends E.MN {
                // Тест с сопоставлением карточек

                $shuffledLeftCards;
                $shuffledRightCards;
                $orderedLeftCardIds;
                $orderedRightCardIds;
                $pairedCardIds;
                $selectedCard;
                $clickCoordinates;
                events = {
                    ...this.events,
                    setPairs: (0, i.createEvent)(),
                    setClickCoordinates: (0, i.createEvent)(),
                    handleCardClick: (0, i.createEvent)(),
                    setTitle: (0, i.createEvent)(),
                    setDescription: (0, i.createEvent)(),
                    uploadCardImage: (0, i.createEvent)()
                };

                constructor(e) {
                    super(e, {
                        title: "",
                        description: "",
                        imgUrl: "",
                        leftCards: [],
                        rightCards: []
                    }, []), this.events = {...this.events, ...(0, i.createApi)(this.$content, q)}, this.$content.watch((e => {
                        if (!e.leftCards.length || !e.rightCards.length) {
                            const {leftCards: t, rightCards: s} = function () {
                                const e = [], t = [];
                                for (let s = 0; s < 2; s += 1) {
                                    const s = (0, u.v4)();
                                    e.push({
                                        cardId: (0, u.v4)(),
                                        pairId: s,
                                        content: "",
                                        imgUrl: ""
                                    }), t.push({cardId: (0, u.v4)(), pairId: s, content: "", imgUrl: ""})
                                }
                                return {leftCards: e, rightCards: t}
                            }();
                            return this.events.setContent({...e, leftCards: t, rightCards: s})
                        }
                    })), this.widgetNumber = e?.data.widgetNumber || 1, this.groupType = g.sJ.INTERACTIVE, this.template = g.hQ.LINE_CONNECTOR.valueOf(), super.useFileUploader(this.events.setImgUrl), (0, i.sample)({
                        clock: this.events.uploadCardImage,
                        fn: ({cardId: e, file: t}) => {
                            this.api.uploadFile?.(t).then((t => {
                                t && this.events.setCardData({cardId: e, imgUrl: t.path})
                            }))
                        }
                    }), this.$answer.on(this.events.setPairs, ((e, t) => t)).watch((e => {
                        g.iP.EVALUATED !== this.getAnswerStatus() && this.setAnswerStatus(e?.length ? g.iP.DEFAULT : g.iP.NULL)
                    })), this.events.setPairs([]), this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))), this.$content.watch((() => {
                        this.events.setPairs([])
                    })), this.$shuffledLeftCards = this.$content.map((e => Y()(e.leftCards))), this.$shuffledRightCards = this.$content.map((e => Y()(e.rightCards))), this.$clickCoordinates = (0, i.createStore)(null).on(this.events.setClickCoordinates, ((e, t) => t)), this.$selectedCard = _.kD.map((e => e.widgetId === this.id ? e.card : null)), this.$pairedCardIds = this.$answer.map((e => {
                        const t = [];
                        return e.forEach((e => {
                            t.push(e.leftCard.cardId), t.push(e.rightCard.cardId)
                        })), t
                    })), this.$orderedLeftCardIds = this.$pairedCardIds.map((e => {
                        const t = this.$shuffledLeftCards.getState().map((e => e.cardId)),
                            s = e.filter(((e, t) => (t + 1) % 2 == 1)), i = K()(t, s);
                        return [...s, ...i]
                    })), this.$orderedRightCardIds = this.$pairedCardIds.map((e => {
                        const t = this.$shuffledRightCards.getState().map((e => e.cardId)),
                            s = e.filter(((e, t) => (t + 1) % 2 == 0)), i = K()(t, s);
                        return [...s, ...i]
                    })), this.events.handleCardClick.watch(this.handleCardClick.bind(this)), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.validateAnswer(e)
                    })), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setImgUrl, this.events.removeImgUrl, this.events.addGroup, this.events.removeGroup, this.events.setCardData])
                }

                showCorrectAnswers(e) {
                    const t = this.getContent(), s = [];
                    return e ? (t?.leftCards.forEach((e => {
                        const i = t.rightCards.find((t => t.pairId === e.pairId));
                        i && s.push({leftCard: e, rightCard: i, status: g.q0.CORRECT, correct: !0})
                    })), s && (this.setFullAnswer(s), this.setAnswerStatus(g.iP.EVALUATED))) : (this.setFullAnswer(s), this.setAnswerStatus(g.iP.DEFAULT)), this
                }

                updateAnswerStatus() {
                    return this.showCorrectAnswers(e), this
                }

                validateAnswer(e) {
                    const t = this.getFullAnswer();
                    if (t) if (e) {
                        const e = t.map((e => {
                            const t = e.leftCard.pairId === e.rightCard.pairId;
                            return {...e, correct: t}
                        }));
                        this.events.setPairs([...e]), this.setWidgetStatus(e.every((e => e.correct)) ? g.vQ.CORRECT : g.vQ.ERROR).setAnswerStatus?.(g.iP.EVALUATED)
                    } else this.setWidgetStatus(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT);
                    return this
                }

                handleCardClick(e) {
                    const {card: t, event: s} = e;
                    s.stopPropagation(), this.events.setClickCoordinates({clientX: s.clientX, clientY: s.clientY});
                    const i = this.$pairedCardIds.getState(), r = this.$selectedCard.getState(),
                        n = this.$orderedLeftCardIds.getState(), a = this.$orderedRightCardIds.getState(),
                        o = this.getFullAnswer(), c = t.cardId === r?.cardId,
                        d = n.includes(t.cardId) ? H.F.LEFT : H.F.RIGHT,
                        u = d === H.F.LEFT ? r && a.includes(r.cardId) : r && n.includes(r.cardId);
                    if (c) (0, _.$5)(); else {
                        if (u && r) {
                            const e = i.includes(t.cardId) ? o.filter((e => e.leftCard.cardId !== t.cardId && e.rightCard.cardId !== t.cardId)) : o;
                            return this.events.setPairs([...e, {
                                leftCard: d === H.F.LEFT ? t : r,
                                rightCard: d === H.F.RIGHT ? t : r,
                                status: g.q0.DEFAULT
                            }]), void (0, _.$5)()
                        }
                        if (i.includes(t.cardId)) return this.events.setPairs([...o.filter((e => e.leftCard.cardId !== t.cardId && e.rightCard.cardId !== t.cardId))]), void (0, _.$5)();
                        (0, _.Ck)({widgetId: this.id, card: t})
                    }
                }

                getTemplate() {
                    return this.template
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    return super.getAnswer().map((({leftCard: e, rightCard: t}) => ({
                        leftCardId: e.cardId,
                        rightCardId: t.cardId
                    })))
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = e?.map((e => {
                        const t = this.$content.getState(), s = t.rightCards.find((t => t.cardId === e.rightCardId)),
                            i = t.leftCards.find((t => t.cardId === e.leftCardId));
                        return s && i ? {leftCard: i, rightCard: s, status: g.q0.DEFAULT, correct: e.correct} : null
                    })) || [];
                    return this.setFullAnswer(t.filter((e => e))), this
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus,
                        selectedCard: this.$selectedCard,
                        orderedLeftCardIds: this.$orderedLeftCardIds,
                        orderedRightCardIds: this.$orderedRightCardIds,
                        pairedCardIds: this.$pairedCardIds,
                        clickCoordinates: this.$clickCoordinates,
                        validationErrors: this.$validationErrors
                    })
                }
            }

            var J = s(47037), X = s.n(J), ee = s(76578);

            class te extends E.MN {
                // Тест с кратким ответом

                events = this.events;
                $isCorrectAnswerVisible;

                constructor(e) {
                    super(e, {
                        description: "",
                        image: "",
                        correctAnswers: [{id: (0, u.v4)(), value: "", validation: null}],
                        matchCase: !1
                    }, {content: "", status: g.q0.DEFAULT, text: ""}), this.events = {
                        ...this.events,
                        setTitle: (0, i.createEvent)(),
                        setDescription: (0, i.createEvent)(),
                        setMatchCase: (0, i.createEvent)(),
                        addCorrectAnswer: (0, i.createEvent)(),
                        setCorrectAnswer: (0, i.createEvent)(),
                        removeCorrectAnswer: (0, i.createEvent)(),
                        setImage: (0, i.createEvent)(),
                        removeImage: (0, i.createEvent)(),
                        setAnswerText: (0, i.createEvent)(),
                        setCorrectAnswerVisibility: (0, i.createEvent)()
                    }, this.$isCorrectAnswerVisible = 1, this.groupType = g.sJ.INTERACTIVE, this.template = g.hQ.SIMPLE_ANSWER.valueOf(), this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.setMatchCase, ((e, t) => ({
                        ...e,
                        matchCase: t
                    }))).on(this.events.addCorrectAnswer, (e => {
                        const t = {...e};
                        return t.correctAnswers = [...e.correctAnswers || [], {
                            id: (0, u.v4)(),
                            value: "",
                            validation: null
                        }], t
                    })).on(this.events.setCorrectAnswer, ((e, {id: t, value: s}) => {
                        const i = {...e}, r = i.correctAnswers?.find((e => e.id === t));
                        return r && (r.value = s, s.length > 200 ? r.validation = ee.e.SimpleAnswer.validationErrorTooLong : r.validation = null), i
                    })).on(this.events.removeCorrectAnswer, ((e, {id: t}) => {
                        const s = {...e};
                        return s.correctAnswers = s.correctAnswers?.filter((e => e.id !== t)), s
                    })).on(this.events.setImage, ((e, t) => ({
                        ...e,
                        image: t.path
                    }))).on(this.events.removeImage, (e => ({
                        ...e,
                        image: ""
                    }))), this.$answer.on(this.events.setAnswer, ((e, t) => {
                        let s = e?.content || "";
                        return X()(t.content) && (s = t.content), {
                            content: s,
                            status: t.status || e?.status,
                            correct: t.correct
                        }
                    })).on(this.events.setAnswerText, ((e, t) => ({...e, content: t}))).watch((e => {
                        g.iP.EVALUATED !== this.getAnswerStatus() && this.setAnswerStatus(e?.content.length ? g.iP.DEFAULT : g.iP.NULL)
                    })), super.useFileUploader(this.events.setImage), (0, i.sample)({
                        clock: [this.events.setTitle, this.events.setDescription, this.events.setImage, this.events.removeImage, this.events.addCorrectAnswer, this.events.setCorrectAnswer, this.events.removeCorrectAnswer],
                        fn: () => this.setIsDirty(!0)
                    }), this.events.showCorrectAnswers.watch((e => {
                        this.events.setCorrectAnswerVisibility(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.validateAnswer(e)
                    })), super.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setImage, this.events.removeImage, this.events.setCorrectAnswer, this.events.removeCorrectAnswer, this.events.addCorrectAnswer, this.events.setMatchCase])
                }

                updateAnswerStatus() {
                    let e = g.q0.DEFAULT;
                    const {content: t, correct: s} = this.getFullAnswer();
                    switch (this.getAnswerStatus()) {
                        case g.iP.EVALUATED:
                            e = o()(s) ? s ? g.q0.CORRECT : g.q0.ERROR : g.q0.DISABLED;
                            break;
                        case g.iP.NULL:
                            this.$widgetStatus.getState() === g.vQ.DISABLED || this.setFullAnswer({
                                status: g.q0.DEFAULT,
                                content: ""
                            }), e = g.q0.DISABLED;
                            break;
                        default:
                            e = g.q0.DEFAULT
                    }
                    return this.events.setAnswer({status: e, content: t, correct: s}), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    return {answer: super.getAnswer().content}
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = {content: e?.answer || "", correct: e?.correct, status: g.q0.DEFAULT};
                    return this.setFullAnswer(t), this
                }

                validateAnswer(e) {
                    const t = this.getFullAnswer();
                    if (this.getContent()) {
                        const {correctAnswers: s, matchCase: i} = this.$content.getState();
                        if (0 === s?.length) return this;
                        if (e) {
                            const e = s?.find((e => i ? e.value === t.content : e.value.toLowerCase() === t.content.toLowerCase()));
                            this.events.setAnswer({
                                ...t,
                                correct: !!e
                            }), this.setWidgetStatus(e ? g.vQ.CORRECT : g.vQ.ERROR).setAnswerStatus?.(g.iP.EVALUATED)
                        }
                    }
                    return this
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus,
                        isCorrectAnswerVisible: this.$isCorrectAnswerVisible,
                        validationErrors: this.$validationErrors
                    })
                }
            }

            var se = s(14059), ie = s(81227), re = s(40730);
            const ne = {mode: re.y.GENERAL, content: "", title: "", imgUrl: "", backgroundColor: re.r.BLUE};

            class ae extends E.mr {
                $currentImageIndex;
                events = {
                    ...this.events,
                    goToNextImage: (0, i.createEvent)(),
                    goToPrevImage: (0, i.createEvent)(),
                    setImgUrl: (0, i.createEvent)()
                };

                constructor(e) {
                    super(e, ne), this.groupType = g.sJ.INFO, this.template = g.hQ.CUSTOM.valueOf(), this.$content.on(this.events.setImgUrl, ((e, t) => ({
                        ...e,
                        imgUrl: t
                    })));
                    const t = this.$content.getState().imgUrl, s = t ? ie.Y_.indexOf(t) : 0;
                    this.$currentImageIndex = (0, i.createStore)(s).on(this.events.goToNextImage, (e => e >= ie.Y_.length - 1 ? (this.events.setImgUrl(ie.Y_[0]), 0) : (this.events.setImgUrl(ie.Y_[e + 1]), e + 1))).on(this.events.goToPrevImage, (e => e <= 0 ? (this.events.setImgUrl(ie.Y_[ie.Y_.length - 1]), ie.Y_.length - 1) : (this.events.setImgUrl(ie.Y_[e - 1]), e - 1))), super.useWidgetsEdit([this.events.setContentField, this.events.goToNextImage, this.events.goToPrevImage])
                }

                combineStores() {
                    return (0, i.combine)({content: this.$content, currentImageIndex: this.$currentImageIndex})
                }
            }

            var oe = s(20029), ce = s(9200), de = s(18660), ue = s(16148), ge = s(48048);

            function le(e) {
                return e[Math.floor(Math.random() * e.length)]
            }

            class Me extends E.MN {
                instance;
                WidgetViewModel;
                events = {
                    ...this.events,
                    setParsedData: (0, i.createEvent)(),
                    fileUploaded: (0, i.createEvent)(),
                    removeFile: (0, i.createEvent)()
                };
                variantId;

                constructor(e) {
                    super(e, {parsedData: null, file: null}, {});
                    const {data: t, eventBus: s} = e, {template: i, content: r} = t;
                    this.groupType = g.sJ.INTERACTIVE;
                    const n = le(r?.parsedData?.variants || []);
                    switch (this.variantId = n?.variantId, i) {
                        case g.hQ.SIMPLE_ANSWER_VARIATION:
                            this.instance = new te({data: {id: this.id}}), n?.body?.simpleAnswer && this.instance.setContent({...n.body.simpleAnswer}), this.WidgetViewModel = new ge.v({widgetModel: this.instance});
                            break;
                        case g.hQ.FILLING_GAP_VARIATION:
                            this.instance = new oe.v({
                                data: {id: this.id},
                                eventBus: s
                            }), n?.body?.fillingGap && this.instance.setContent({...n.body.fillingGap}), this.WidgetViewModel = new ue.v({widgetModel: this.instance});
                            break;
                        case g.hQ.LINE_CONNECTOR_VARIATION:
                            this.instance = new Z({
                                data: {id: this.id},
                                eventBus: s
                            }), n?.body?.lineConnector && this.instance.setContent({...n.body.lineConnector}), this.WidgetViewModel = new de.v({widgetModel: this.instance});
                            break;
                        case g.hQ.TEST_VARIATION:
                        default:
                            this.instance = new F({
                                data: {id: this.id},
                                eventBus: s
                            }), n?.body?.test && this.instance.setContent({...n.body.test}), this.WidgetViewModel = new ce.v({widgetModel: this.instance})
                    }
                    this.template = i || g.hQ.TEST_VARIATION, this.groupType = g.sJ.INTERACTIVE, super.useFileUploader(this.events.fileUploaded), this.$content.on(this.events.fileUploaded, ((e, t) => ({
                        ...e,
                        file: t
                    }))).on(this.events.setParsedData, ((e, t) => {
                        if (t) {
                            const e = le(t.variants);
                            switch (this.variantId = e.variantId, i) {
                                case g.hQ.LINE_CONNECTOR_VARIATION:
                                    this.instance instanceof Z && e.body?.lineConnector && this.instance.setContent({...e.body.lineConnector});
                                    break;
                                case g.hQ.FILLING_GAP_VARIATION:
                                    this.instance instanceof oe.v && e.body?.fillingGap && this.instance.setContent({...e.body?.fillingGap});
                                    break;
                                case g.hQ.SIMPLE_ANSWER_VARIATION:
                                    this.instance instanceof te && e.body?.simpleAnswer && this.instance.setContent({...e.body?.simpleAnswer});
                                    break;
                                case g.hQ.TEST_VARIATION:
                                default:
                                    this.instance instanceof F && e.body?.test && this.instance.setContent({...e.body?.test})
                            }
                        }
                        return {...e, parsedData: t}
                    })).on(this.events.removeFile, (() => (this.instance.reset(), {
                        file: null,
                        parsedData: null
                    }))), this.events.showCorrectAnswers.watch((e => {
                        this.instance.events.showCorrectAnswers(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.instance.events.validateAnswer(e)
                    })), this.instance.getAnswerStatusStore().watch((e => {
                        this.events.updateAnswerStatus(e)
                    })), super.useWidgetsEdit([this.events.fileUploaded, this.events.removeFile])
                }

                updateAnswerStatus() {
                    return this.instance.updateAnswerStatus(), this
                }

                getAnswer() {
                    return {variantId: this.variantId, answer: this.instance.getAnswer()}
                }

                validateAnswer(e) {
                    return this.instance.validateAnswer(e), this
                }

                setWidgetStatus(e) {
                    return this.instance.setWidgetStatus(e), this
                }

                setAnswer(e) {
                    return this.instance.setAnswer(e), this
                }

                getWidgetStatus() {
                    return this.instance.getWidgetStatus()
                }

                setAnswerStatus(e) {
                    return this.instance.setAnswerStatus(e), this
                }

                getWidgetViewModel() {
                    return this.WidgetViewModel
                }

                combineStores() {
                    return (0, i.combine)({content: this.$content})
                }

                clear() {
                    return super.clear(), this.instance.reset(), this
                }
            }

            var Ne = s(34506);
            const he = {title: "", description: "", videoUrl: "", thumbnailUrl: ""};

            class Ie extends E.mr {
                events = {
                    ...this.events,
                    cleanVideo: (0, i.createEvent)(),
                    setIsFullscreen: (0, i.createEvent)(),
                    setVideoLinkIsValid: (0, i.createEvent)(),
                    uploadVideoFile: (0, i.createEvent)(),
                    uploadThumbnailFile: (0, i.createEvent)(),
                    setVideoFromFile: (0, i.createEvent)(),
                    setThumbnailFromFile: (0, i.createEvent)(),
                    setVideoUrlInterim: (0, i.createEvent)()
                };
                $isFullscreenMode;
                $videoLinkIsValid;
                $uploadedFromLocalDevice;
                $videoUrlInterim;

                constructor(e) {
                    super(e, he), this.widgetNumber = e.data.widgetNumber || 1, this.groupType = g.sJ.INFO, this.template = e.template || g.hQ.VIDEO, this.$content.on(this.events.setVideoFromFile, ((e, t) => ({
                        ...e,
                        videoUrl: t.path,
                        videoService: void 0,
                        title: t.name,
                        thumbnailUrl: Ne.n,
                        originalCoverLink: Ne.n
                    }))).on(this.events.setThumbnailFromFile, ((e, t) => ({
                        ...e,
                        thumbnailUrl: t.path
                    }))).on(this.events.cleanVideo, (e => ({
                        ...e,
                        videoUrl: "",
                        thumbnailUrl: "",
                        videoService: void 0,
                        title: ""
                    }))), this.$isFullscreenMode = (0, i.restore)(this.events.setIsFullscreen, !1), this.$videoLinkIsValid = (0, i.restore)(this.events.setVideoLinkIsValid, !0).on(this.events.setVideoUrlInterim, (() => !0)), this.$videoUrlInterim = (0, i.restore)(this.events.setVideoUrlInterim, ""), this.$uploadedFromLocalDevice = this.$content.map((e => !e.videoService && !!e.videoUrl)), super.useFileUploader(this.events.setVideoFromFile, this.events.uploadVideoFile), super.useFileUploader(this.events.setThumbnailFromFile, this.events.uploadThumbnailFile), super.useWidgetsEdit([this.events.setVideoFromFile, this.events.setThumbnailFromFile, this.events.cleanVideo])
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        isFullscreen: this.$isFullscreenMode,
                        videoLinkIsValid: this.$videoLinkIsValid,
                        uploadedFromLocalDevice: this.$uploadedFromLocalDevice,
                        videoUrlInterim: this.$videoUrlInterim,
                        validationErrors: this.$validationErrors,
                        touchedFields: this.$touchedFields,
                        isEditModeTouched: this.$isEditModeTouched
                    })
                }
            }

            var De = s(57962);

            function Ae(e) {
                try {
                    return JSON.parse(e)
                } catch (e) {
                    return console.warn(e), {}
                }
            }

            class Ee extends E.MN {
                // Текст с пропущенными словами

                $initialAnswer;
                events = {...this.events, changeAnswer: (0, i.createEvent)()};

                constructor(e) {
                    super(e, {
                        title: "",
                        questions: [],
                        correctAnswers: [],
                        defaultValues: [],
                        rawContent: ""
                    }, [{
                        id: "",
                        status: g.q0.DEFAULT,
                        answer: ""
                    }]), this.template = g.hQ.MULTIPLE_TEXT.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.events.setHasLoaded(!0), this.$answer.on(this.events.changeAnswer, ((e, t) => [...e.filter((e => e.id !== t.id)), t])).watch((e => {
                        if (e && [g.iP.DEFAULT, g.iP.NULL].includes(this.getAnswerStatus())) {
                            const t = e.some((e => e.answer.trim().length > 0));
                            this.setAnswerStatus(t ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.$initialAnswer = this.$content.map((e => e.questions?.map((e => ({
                        answer: "",
                        status: g.q0.DEFAULT,
                        id: e.id
                    }))) || [])), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.events.setAnswer(this.$initialAnswer.getState())
                }

                showCorrectAnswers(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    if (e) {
                        const e = t.map((e => {
                            const t = (s?.correctAnswers || []).find((t => e.id === t.id));
                            return {...e, answer: t?.answer[0] || "", correct: !0, status: g.q0.CORRECT}
                        }));
                        return this.setFullAnswer(e), this.setAnswerStatus(g.iP.EVALUATED), this
                    }
                    return this.setFullAnswer(this.$initialAnswer.getState()), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                updateAnswer(e) {
                    const t = this.getFullAnswer().map((t => {
                        const s = e.find((e => t.id === e.id));
                        return s ? {...t, id: s.id, answer: s.answer, status: s.status} : t
                    }));
                    return this.events.setAnswer(t), this
                }

                validateAnswer(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    if (!s) return this;
                    const {correctAnswers: i} = s;
                    if (i?.some((e => 0 === e.answer.length))) return this;
                    const r = e => {
                        const {answer: t, id: s} = e, r = i?.find((e => e.id === s));
                        return r?.answer.includes(t)
                    }, n = t.map((e => ({...e, correct: r(e)})));
                    return this.events.setAnswer(n), e ? n.every((({correct: e}) => e)) ? this.setWidgetStatus(g.vQ.CORRECT).setAnswerStatus?.(g.iP.EVALUATED) : this.setWidgetStatus(g.vQ.ERROR).setAnswerStatus?.(g.iP.EVALUATED) : this.setWidgetStatus(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT), this.updateAnswerStatus(), this
                }

                updateAnswerStatus() {
                    const t = this.getFullAnswer(), s = this.getContent();
                    const e = t.map((e => {
                        const t = (s?.correctAnswers || []).find((t => e.id === t.id));
                        return {...e, answer: t?.answer[0] || "", correct: !0, status: g.q0.CORRECT}
                    }));
                    return this.setFullAnswer(e), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    const {name: e = "Вопрос1"} = Ae(this.getContent()?.rawContent || ""),
                        t = this.getFullAnswer().reduce(((e, t) => ({...e, [t.id]: t.answer})), {});
                    return JSON.stringify({[e]: t})
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = Ae(e || "{}"), s = t[Object.keys(t)[0]];
                    if (!s) return this;
                    const i = Object.entries(s), r = this.getFullAnswer().map((e => {
                        const t = i.find((([t]) => e.id === t));
                        return {...e, answer: t?.[1] || "", status: g.q0.SELECTED}
                    }));
                    return this.setFullAnswer(r), this.validateAnswer(), this
                }

                get getStores() {
                    return {content: this.$content, answer: this.$answer, noInteractivity: this.$noInteractivity}
                }
            }

            var pe = s(21551), Te = s(52353), we = s.n(Te);

            function ve(e) {
                if (!e) return [];
                const {defaultValue: t, columns: s, rows: i} = e;
                return i.reduce(((e, i) => {
                    const r = s.map((e => {
                        return {
                            ...e,
                            correct: null,
                            status: (s = {row: i.value, column: e.value}, r = t, r.some((({
                                                                                              pathToValue: e,
                                                                                              value: t
                                                                                          }) => s.row === e && s.column === t)) ? g.q0.SELECTED : g.q0.DEFAULT)
                        };
                        var s, r
                    }));
                    return [...e, {...i, columns: r}]
                }), [])
            }

            var je = s(76559);

            class Ce extends E.MN {
                // Тест с выбором ответа из нескольких колонок

                initialAnswer;

                constructor(e) {
                    super(e, {
                        title: "",
                        correctAnswer: [],
                        columns: [],
                        rows: [],
                        defaultValue: [],
                        rawContent: ""
                    }, []), this.events.setHasLoaded(!0), this.template = g.hQ.MATRIX.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.initialAnswer = ve(this.getContent()), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.$answer.on(this.events.setAnswer, ((e, t) => t)).watch((e => {
                        if (e && [g.iP.DEFAULT, g.iP.NULL].includes(this.getAnswerStatus())) {
                            const t = e.some((e => e.columns.some((e => e.status === g.q0.SELECTED)))),
                                s = (0, pe.isEqual)(this.initialAnswer, e);
                            this.setAnswerStatus(t && !s ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.events.setAnswer(this.initialAnswer)
                }

                showCorrectAnswers(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    if (e) {
                        const e = (0, je.H)(t, ((e, t) => {
                            const i = s?.correctAnswer.find((s => s.value === t.value && e.value === s.pathToValue)),
                                r = i?.value === t.value;
                            return {correct: r || null, status: r ? g.q0.SELECTED : g.q0.DISABLED}
                        }));
                        return this.setFullAnswer(e), this.setAnswerStatus(g.iP.EVALUATED), this
                    }
                    return this.setFullAnswer(this.initialAnswer), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                updateAnswer(e) {
                    return this.events.setAnswer(e), this
                }

                updateAnswerStatus() {
                    const t = this.getFullAnswer(), s = this.getContent();
                    const e = (0, je.H)(t, ((e, t) => {
                        const i = s?.correctAnswer.find((s => s.value === t.value && e.value === s.pathToValue)),
                            r = i?.value === t.value;
                        return {correct: r || null, status: r ? g.q0.SELECTED : g.q0.DISABLED}
                    }));
                    return this.setFullAnswer(e), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                validateAnswer(e) {
                    if (!e && !we()(e)) return this.setWidgetStatus(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT), this.updateAnswerStatus(), this;
                    const t = this.getContent();
                    if (0 === t?.correctAnswer.length || !t) return this;
                    const {correctAnswer: s} = t, i = this.getFullAnswer(), r = [], n = (0, je.H)(i, ((e, t) => {
                        if (t.status !== g.q0.SELECTED) return t;
                        const i = s.some((({pathToValue: s, value: i}) => s === e.value && i === t.value));
                        return r.push(i), {correct: i}
                    }));
                    return this.setFullAnswer(n), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    const {name: e = "Вопрос1"} = Ae(this.getContent()?.rawContent || "{}"),
                        t = this.getFullAnswer().filter((e => e.columns.some((e => e.status === g.q0.SELECTED)))).reduce(((e, t) => ({
                            ...e,
                            [t.value]: t.columns.find((e => e.status === g.q0.SELECTED))?.value
                        })), {});
                    return JSON.stringify({[e]: t})
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = Ae(e || "{}"), s = t[Object.keys(t)[0]];
                    if (!s) return this;
                    const i = Object.entries(s), r = this.getFullAnswer(),
                        n = (0, je.H)(r, ((e, t) => ({status: i.find((([s, i]) => i === t.value && e.value === s))?.[1] === t.value ? g.q0.SELECTED : g.q0.DISABLED})));
                    return this.setFullAnswer(n), this.validateAnswer(), this
                }

                get getStores() {
                    return {content: this.$content, answer: this.$answer, noInteractivity: this.$noInteractivity}
                }
            }

            function me(e, t) {
                return e.map((e => {
                    const s = e.columns.map((s => {
                        const i = t(e, s, s.choices);
                        return {...s, choices: i || s.choices}
                    }));
                    return {...e, columns: s}
                }))
            }

            var Oe = s(81445), ze = s(75700);

            function Le(e) {
                if (!e) return [];
                const {rows: t, columns: s, defaultValue: i} = e;
                return t.reduce(((t, r) => {
                    const a = s.map((t => {
                        const s = i.find((({pathToValue: e}) => {
                            const [s, i] = e.split(ze.Kr);
                            return s === r.value && i === t.value
                        }));
                        if (t.cellType === Oe.j.TEXT) {
                            const e = s ? s.value : "";
                            return {
                                ...t,
                                choices: [{correct: null, value: e, text: "", status: e ? g.q0.SELECTED : g.q0.DEFAULT}]
                            }
                        }
                        const a = (t.choices || e.choices).map((e => {
                            let t = !1;
                            return n()(s?.value) ? t = -1 !== s?.value?.findIndex((t => t === e.value)) : X()(s?.value) && (t = s?.value === e.value), {
                                ...e,
                                status: t ? g.q0.SELECTED : g.q0.DEFAULT,
                                correct: null
                            }
                        }));
                        return {...t, choices: a}
                    }));
                    return [...t, {...r, columns: a}]
                }), [])
            }

            class ye extends E.MN {
                // Тест с выбором из выпадающего списка

                initialAnswer;
                events = {...this.events, setSelectEvent: (0, i.createEvent)()};

                constructor(e) {
                    super(e, {
                        title: "",
                        columns: [],
                        rows: [],
                        correctAnswer: [],
                        defaultValue: [],
                        choices: [],
                        optionsCaption: "",
                        rawContent: ""
                    }, []), this.events.setHasLoaded(!0), this.template = g.hQ.MATRIX_DROPDOWN.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.initialAnswer = Le(this.getContent()), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.$answer.on(this.events.setSelectEvent, ((e, t) => {
                        const {row: s, column: i, choice: r, cellType: n} = t;
                        return me(e, ((e, t, a) => a.map((a => {
                            switch (n) {
                                case Oe.j.CHECKBOX:
                                    return e.value !== s || t.value !== i || a.value !== r ? a : {
                                        ...a,
                                        status: a.status === g.q0.SELECTED ? g.q0.DEFAULT : g.q0.SELECTED
                                    };
                                case Oe.j.TEXT:
                                    return e.value !== s || t.value !== i ? a : {
                                        ...a,
                                        status: r.trim() ? g.q0.SELECTED : g.q0.DEFAULT,
                                        value: r
                                    };
                                case Oe.j.DROPDOWN:
                                case Oe.j.RADIOGROUP:
                                default: {
                                    if (e.value !== s || t.value !== i) return a;
                                    let n = g.q0.DEFAULT;
                                    return a.value === r && (n = g.q0.SELECTED), {...a, status: n}
                                }
                            }
                        }))))
                    })).watch((e => {
                        if (e && [g.iP.DEFAULT, g.iP.NULL].includes(this.getAnswerStatus())) {
                            const t = [];
                            me(e, ((e, s, i) => (i.forEach((e => e.status === g.q0.SELECTED && t.push(e.value))), null)));
                            const s = t.length > 0, i = (0, pe.isEqual)(this.initialAnswer, e);
                            this.setAnswerStatus(s && !i ? g.iP.DEFAULT : g.iP.NULL)
                        }
                    })), this.events.setAnswer(this.initialAnswer)
                }

                showCorrectAnswers(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    if (e) {
                        const e = me(t, ((e, t, i) => {
                            const r = s?.correctAnswer.find((s => s.pathToValue === `${e.value}${ze.Kr}${t.value}`));
                            return i.map((e => {
                                const s = n()(r?.value) ? r?.value.includes(e.value) : r?.value === e.value;
                                return {
                                    ...e,
                                    value: "text" === t.cellType ? r?.value || "" : e.value,
                                    correct: s || null,
                                    status: s || "text" === t.cellType ? g.q0.CORRECT : g.q0.DISABLED
                                }
                            }))
                        }));
                        return this.setFullAnswer(e), this.setAnswerStatus(g.iP.EVALUATED), this
                    }
                    return this.setFullAnswer(this.initialAnswer), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                updateAnswer(e) {
                    return this.events.setAnswer(e), this
                }

                updateAnswerStatus() {
                    const t = this.getFullAnswer(), s = this.getContent();
                    e = me(t, ((e, t, i) => {
                        const r = s?.correctAnswer.find((s => s.pathToValue === `${e.value}${ze.Kr}${t.value}`));
                        return i.map((e => {
                            const s = n()(r?.value) ? r?.value.includes(e.value) : r?.value === e.value;
                            return {
                                ...e,
                                value: "text" === t.cellType ? r?.value || "" : e.value,
                                correct: s || null,
                                status: s ? g.q0.SELECTED : g.q0.DISABLED
                            }
                        }))
                    }));
                    return this.setFullAnswer(e), this.setAnswerStatus(g.iP.DEFAULT), this
                }

                validateAnswer(e) {
                    if (!e && !we()(e)) return this.setWidgetStatus(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT), this.updateAnswerStatus(), this;
                    const t = this.getContent();
                    if (0 === t?.correctAnswer.length || !t) return this;
                    const {correctAnswer: s} = t, i = this.getFullAnswer(), r = [];
                    let n = [];
                    n = me(i, ((e, t, i) => {
                        const n = s.find((({pathToValue: s}) => {
                            const [i, r] = s.split(ze.Kr);
                            return i === e.value && r === t.value
                        })), a = e => (e || "").trim().toLowerCase();
                        return n ? i.map((e => {
                            switch (t.cellType) {
                                case Oe.j.CHECKBOX: {
                                    if (e.status !== g.q0.SELECTED) return e;
                                    const t = n.value.includes(e.value);
                                    return r.push(t), {...e, correct: t}
                                }
                                case Oe.j.TEXT: {
                                    let t = !1;
                                    return n.value.includes("~") ? t = (n.value?.split("~").filter((e => "" !== e)).map((e => a(e))) || []).includes(a(e.value)) : (t = a(e.value) === a(n.value), r.push(t)), {
                                        ...e,
                                        correct: t
                                    }
                                }
                                case Oe.j.DROPDOWN:
                                case Oe.j.RADIOGROUP:
                                default: {
                                    if (e.status !== g.q0.SELECTED) return e;
                                    const t = n.value === e.value;
                                    return r.push(t), {...e, correct: t}
                                }
                            }
                        })) : null
                    }));
                    const a = r.length > 0 && r.every((e => e)), {
                        widgetStatus: o,
                        answerStatus: c
                    } = (e => ({widgetStatus: e ? g.vQ.CORRECT : g.vQ.ERROR, answerStatus: g.iP.EVALUATED}))(a);
                    return this.setWidgetStatus(o).setAnswerStatus?.(c), this.updateAnswer(n), this.updateAnswerStatus(), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    const {name: e = "Вопрос1"} = Ae(this.getContent()?.rawContent || ""),
                        t = this.getFullAnswer().map((e => ({
                            ...e,
                            columns: e.columns.filter((({choices: e}) => e.filter((({status: e}) => e === g.q0.SELECTED)).length))
                        }))).filter((({columns: e}) => e.length)).reduce(((e, t) => ({
                            ...e,
                            [t.value]: t.columns.reduce(((e, t) => {
                                let s = null;
                                switch (t.cellType) {
                                    case Oe.j.CHECKBOX:
                                        s = t.choices.filter((({status: e}) => e === g.q0.SELECTED)).map((({value: e}) => e));
                                        break;
                                    case Oe.j.RADIOGROUP:
                                    case Oe.j.DROPDOWN:
                                        s = t.choices.find((({status: e}) => e === g.q0.SELECTED))?.value || null;
                                        break;
                                    case Oe.j.TEXT:
                                        s = t.choices[0].value
                                }
                                return {...e, [t.value]: s}
                            }), {})
                        })), {});
                    return JSON.stringify({[e]: t})
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = Ae(e || "{}"), s = t[Object.keys(t)[0]];
                    if (!s) return this;
                    const i = Object.entries(s).map((([e, t]) => [e, Object.entries(t)])),
                        r = me(this.getFullAnswer(), ((e, t, s) => {
                            const r = i?.find((([s, i]) => s === e.value && i?.some((([e]) => e === t.value)))),
                                n = r?.[1].find((([e]) => e === t.value));
                            return s.map((e => {
                                const s = n?.[1] === e.value;
                                return {...e, status: s || "text" === t.cellType ? g.q0.SELECTED : g.q0.DISABLED}
                            }))
                        }));
                    return this.setFullAnswer(r), this.validateAnswer(), this
                }

                get getStores() {
                    return {content: this.$content, answer: this.$answer, noInteractivity: this.$noInteractivity}
                }
            }

            const Se = `${window.location.origin}/services`;
            var Ue = s(64932);

            class ke extends E.MN {
                $frame;
                $iframeAttrs;
                $isScormLoading;
                $isUploadedScormRendering;
                events = {
                    ...this.events,
                    setFrame: (0, i.createEvent)(),
                    setWidgetAnswer: (0, i.createEvent)(),
                    setScormName: (0, i.createEvent)(),
                    setIsScormLoading: (0, i.createEvent)(),
                    setIsUploadedScormRendering: (0, i.createEvent)(),
                    uploadScormFile: (0, i.createEvent)(),
                    deleteScormFile: (0, i.createEvent)(),
                    sendAsyncAnswerEvent: (0, i.createEvent)()
                };

                constructor(e) {
                    super(e, Ue.T5, Ue.MT);
                    const {playerConfigState: t, eventBus: s} = e;
                    this.events.setHasLoaded(!0), this.template = g.hQ.SCORM.valueOf(), this.groupType = g.sJ.INTERACTIVE, this.$frame = (0, i.createStore)(null).on(this.events.setFrame, ((e, t) => t)), this.$content.on(this.events.setContent, ((e, t) => ({...e, ...t}))).on(this.events.deleteScormFile, (() => Ue.T5)), this.$iframeAttrs = this.$content.map((e => function (e) {
                        const t = function (e) {
                            if (!e) return "";
                            const t = e.includes("classbook") ? "" : "classbook/";
                            return `${Se}/${t}${e}`
                        }(e.iframeURL);
                        if (!t) return {src: t, allow: "camera; microphone;"};
                        const s = new URL(t)?.origin;
                        return {src: t, allow: s ? `camera ${s}; microphone ${s};` : "camera; microphone;"}
                    }(e))), this.$isScormLoading = (0, i.restore)(this.events.setIsScormLoading, !1), this.$isUploadedScormRendering = (0, i.restore)(this.events.setIsUploadedScormRendering, !0).reset(this.events.addFile), this.$answer.on(this.events.setWidgetAnswer, ((e, s) => {
                        s.stopPropagation(), s.preventDefault();
                        const i = function (e) {
                            if (e.data) return Ae(e.data)
                        }(s);
                        return i?.data && "result" === i.type ? (this.events.sendAsyncAnswerEvent({
                            widgetId: this.id,
                            widgetGroupType: this.groupType,
                            widgetType: this.template,
                            files: [],
                            answer: JSON.stringify(i)
                        }), t?.scormAnswerCallback?.(JSON.stringify(i)), {...e, ...i}) : e
                    })), s?.register({SCORM_UPLOADING_IN_PROGRESS: this.events.setIsScormLoading}), super.useFileUploader(this.events.uploadScormFile), (0, i.sample)({
                        clock: this.events.addFile,
                        fn: () => this.events.setIsScormLoading(!0)
                    }), (0, i.sample)({
                        clock: this.events.uploadScormFile, fn: async e => {
                            const {name: t, path: s} = e, i = {
                                url: s,
                                taskType: "SCORM_LOADER",
                                taskName: t,
                                subject: "Редактор задания",
                                stage: "",
                                packageName: "noname"
                            };
                            this.events.setScormName(t);
                            const r = await (this.ApiFunctions.loadScormCallback?.({variables: i}));
                            this.events.setIsScormLoading(!1), this.events.setContent(r || Ue.T5)
                        }
                    }), super.useWidgetsEdit([this.events.setContent, this.events.deleteScormFile])
                }

                getAnswer() {
                    const e = this.$frame?.getState();
                    e?.contentWindow?.postMessage("check-state", "*")
                }

                getAsyncAnswerEvent() {
                    return this.events.sendAsyncAnswerEvent
                }

                get getStores() {
                    return {
                        iframeAttrs: this.$iframeAttrs,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        scormName: this.$content.map((({scormName: e}) => e)),
                        isScormLoading: this.$isScormLoading,
                        isUploadedScormRendering: this.$isUploadedScormRendering
                    }
                }
            }

            class xe extends class {
            } {
                $widgetModels;
                playerModel;
                eventBus;
                createWidgetEvent;
                widgetCreatedEvent;
                widgetMovedEvent;
                sectionCreatedEvent;
                sectionRemovedEvent;
                removeWidgetEvent;
                widgetRemovedEvent;
                widgetModelsEvents;
                copyWidgetEvent;
                moveWidgetEvent;
                clearWidgetEvent;
                widgetClearedEvent;

                get widgetsState() {
                    return this.$widgetModels.getState()
                }

                apiFunctions;

                constructor(e, t, s, r) {
                    super(), this.eventBus = s, this.playerModel = e, this.$widgetModels = (0, i.createStore)([]), this.apiFunctions = r || {}, this.createWidgetEvent = (0, i.createEvent)(), this.widgetCreatedEvent = (0, i.createEvent)(), this.widgetMovedEvent = (0, i.createEvent)(), this.sectionCreatedEvent = (0, i.createEvent)(), this.sectionRemovedEvent = (0, i.createEvent)(), this.removeWidgetEvent = (0, i.createEvent)(), this.widgetRemovedEvent = (0, i.createEvent)(), this.copyWidgetEvent = (0, i.createEvent)(), this.moveWidgetEvent = (0, i.createEvent)(), this.clearWidgetEvent = (0, i.createEvent)(), this.widgetClearedEvent = (0, i.createEvent)(), this.widgetModelsEvents = (0, i.createApi)(this.$widgetModels, {
                        add: (e, {
                            widget: t,
                            index: s
                        }) => I()(s) ? (e.splice(s + 1, 0, t), [...e]) : [...e, t], move: (e, {id: t, offset: s}) => {
                            if (0 === s) return [...e];
                            const i = e.findIndex((e => e.id === t));
                            if (-1 === i) return [...e];
                            if (i + s < 0 || i + s > e.length) return [...e];
                            const r = [...e], [n] = r.splice(i, 1);
                            return r.splice(i + s, 0, n), r
                        }, remove: (e, t) => e.filter((e => e.id !== t))
                    }), this.eventBus.register({
                        [N.Kt.WidgetCreated]: this.widgetCreatedEvent,
                        [N.Kt.WidgetRemoved]: this.widgetRemovedEvent
                    }), this.eventBus.register({
                        [N.Kt.SectionCreated]: this.sectionCreatedEvent,
                        [N.Kt.SectionRemoved]: this.sectionRemovedEvent,
                        [N.Kt.WidgetCleared]: this.widgetClearedEvent,
                        WIDGET_MOVED: this.widgetMovedEvent
                    }), this.eventBus.subscribe({
                        [N.PB.CreateWidget]: this.createWidgetEvent.prepend((({
                                                                                  type: e,
                                                                                  widgetData: t
                                                                              }) => this.createWidget({
                            type: e,
                            index: this.getWidgetModels().getState().length + 1,
                            widgetData: t,
                            api: r,
                            isEditView: !0,
                            isSystem: !1
                        }))),
                        [N.PB.RemoveWidget]: this.removeWidgetEvent.prepend((e => this.removeWidget(e, !1))),
                        [N.PB.CopyWidget]: this.copyWidgetEvent.prepend((e => this.copyWidget(e))),
                        [N.PB.MoveWidget]: this.moveWidgetEvent.prepend((e => this.moveWidget(e))),
                        [N.PB.ClearWidget]: this.clearWidgetEvent.prepend((e => this.clearWidget(e)))
                    }), t.forEach(((e, t) => this.createWidget({type: e.template, index: t, widgetData: e, api: r})))
                }

                getWidgetModels() {
                    return this.$widgetModels
                }

                createWidget({type: e, index: t, widgetData: s, isEditView: i, isSystem: r = !0}) {
                    const n = function (e) {
                        const {playerInstanceId: t, type: s, widgetNumber: i, widgetData: r, eventBus: n, api: a} = e;
                        return ((e, t) => {
                            switch (e) {
                                case g.hQ.SORTABLE:
                                    return new V(t);
                                case g.hQ.FULL_ANSWER:
                                    return new v.u(t);
                                case g.hQ.PYTHON:
                                    return new G(t);
                                case g.hQ.VIDEO:
                                case g.hQ.VIDEO_SIMPLIFIED:
                                    return new Ie(t);
                                case g.hQ.AUDIO:
                                case g.hQ.AUDIO_PLAYER:
                                    return new A.c(t);
                                case g.hQ.TEXT:
                                    return new x(t);
                                case g.hQ.SIMPLE_ANSWER:
                                    return new te(t);
                                case g.hQ.LINE_CONNECTOR:
                                    return new Z(t);
                                case g.hQ.IFRAME:
                                    return new y(t);
                                case g.hQ.GALLERY:
                                case g.hQ.BANNER:
                                case g.hQ.TOP_FACTS:
                                    return new O(t);
                                case g.hQ.CODE:
                                    return new T(t);
                                case g.hQ.TEST:
                                case g.hQ.MINI_TEST:
                                    return new F(t);
                                case g.hQ.TEST_VARIATION:
                                case g.hQ.LINE_CONNECTOR_VARIATION:
                                case g.hQ.FILLING_GAP_VARIATION:
                                case g.hQ.SIMPLE_ANSWER_VARIATION:
                                    return new Me({...t, data: {...t.data, template: e}});
                                case g.hQ.MATRIX:
                                    return new Ce(t);
                                case g.hQ.MULTIPLE_TEXT:
                                    return new Ee(t);
                                case g.hQ.MATRIX_DROPDOWN:
                                    return new ye(t);
                                case g.hQ.FILLING_GAP:
                                    return new se.v(t);
                                case g.hQ.MARKDOWN:
                                    return new k(t);
                                case g.hQ.SCORM:
                                    return new ke(t);
                                case g.hQ.CUSTOM:
                                    return new ae(t);
                                case g.hQ.DROPDOWN_GAPS:
                                    return new De.op(t);
                                default:
                                    return new w.E(t)
                            }
                        })(s, {
                            data: r || {id: (0, u.v4)(), widgetNumber: i},
                            playerInstanceId: t,
                            eventBus: n,
                            api: a,
                            template: s
                        })
                    }({
                        playerInstanceId: this.playerModel.getInstanceId(),
                        playerConfigState: this.playerModel.Config,
                        type: e,
                        widgetNumber: t,
                        widgetData: s,
                        eventBus: this.eventBus,
                        api: this.apiFunctions
                    }), a = s || {
                        id: n.id,
                        widgetNumber: n.widgetNumber,
                        content: (0, D.D)(n) ? n.getContent() : null,
                        template: n.template,
                        groupType: n.groupType
                    };
                    return this.widgetCreatedEvent({
                        instance: n,
                        content: a,
                        isEditView: i,
                        isSystem: r
                    }), this.widgetModelsEvents.add({widget: n, index: t}), this
                }

                removeWidget(e, t = !0) {
                    return this.widgetModelsEvents.remove(e), this.widgetRemovedEvent({id: e, isSystem: t}), this
                }

                copyWidget(e) {
                    const t = this.widgetsState.filter(D.D).find((t => t.id === e));
                    if (t && (0, D.D)(t)) {
                        const e = t.getCopy();
                        if (t) {
                            const s = {
                                id: (0, u.v4)(),
                                template: t.template,
                                groupType: t.groupType,
                                widgetNumber: t.widgetNumber + 1,
                                content: e
                            };
                            this.createWidget({
                                type: t.template,
                                index: t.widgetNumber + 1,
                                widgetData: s,
                                isEditView: !0,
                                isSystem: !1
                            })
                        }
                    }
                    return this
                }

                moveWidget({id: e, offset: t}) {
                    return this.widgetModelsEvents.move({id: e, offset: t}), this.widgetMovedEvent({
                        id: e,
                        offset: t
                    }), this
                }

                clearWidget(e) {
                    const t = this.widgetsState.filter(D.D).find((t => t.id === e));
                    return t?.clear(), t && this.widgetClearedEvent(), this
                }

                removeAllWidgets() {
                    return this.$widgetModels.getState().forEach((e => {
                        this.removeWidget(e.id)
                    })), this
                }

                restoreWidgets(e) {
                    return e.forEach(((e, t) => this.createWidget({
                        type: e.template,
                        index: t,
                        widgetData: e,
                        isEditView: !1
                    }))), this
                }

                watchFactoryStore(e) {
                    return this.$widgetModels.watch(e), this
                }
            }

            var Qe = s(78758);
            const fe = e => e.filter((e => e.groupType && [g.sJ.INTERACTIVE, g.sJ.MIXED].includes(e.groupType))).reduce(((e, t, s, i) => {
                const r = [...e.answeredWidgetsIds], n = [...e.answeredWidgetsNumbers], a = {...e.hasErrors}, o = s + 1;
                return t.answerStatus && t.answerStatus !== g.iP.NULL && (r.push(t.id), n.push(o)), "FULL_ANSWER" === t.template && t.answer?.content.length > 1e4 && (a[t.id] = ["Максимальная длина: 10000 символов"]), {
                    answeredWidgetsIds: r,
                    answeredWidgetsNumbers: n,
                    widgetsTotal: i.length,
                    answeredPercentage: r.length / (i.length / 100),
                    hasErrors: a
                }
            }), Qe.I0), Ye = {
                add: (e, t) => [...e, t],
                remove: (e, t) => e.filter((e => e.id !== t.id)),
                copy: (e, t) => [...e, t],
                move: (e, {id: t, offset: s}) => {
                    const i = [...e], r = e.find((e => e.id === t)), n = e.findIndex((e => e.id === t)),
                        a = r?.widgetNumber;
                    if (r && a) {
                        const t = e.findIndex((e => e.widgetNumber === a + s));
                        -1 !== t && (i[t] = {...i[t], widgetNumber: a}, i[n] = {...i[n], widgetNumber: a + s})
                    }
                    return i
                },
                update: (e, t) => e.map((e => t.id !== e.id ? e : {...e, ...t})),
                restore: (e, t) => t
            }, $e = {restore: (e, t) => t}, Fe = {restore: (e, t) => t};
            var be = s(60240);

            class Pe {
                eventBus;
                events;
                $widgetValidationErrors;

                constructor(e) {
                    const {eventBus: t} = e;
                    this.eventBus = t, this.$widgetValidationErrors = (0, i.createStore)({}), this.events = {
                        widgetValidationErrorsChanged: (0, i.createEvent)(),
                        clearWidgetValidationErrors: (0, i.createEvent)()
                    }, this.eventBus.subscribe({
                        [N.hX.WidgetValidationErrorsChanged]: this.events.widgetValidationErrorsChanged,
                        [N.Kt.WidgetRemoved]: this.events.clearWidgetValidationErrors
                    }), this.$widgetValidationErrors.on(this.events.widgetValidationErrorsChanged, ((e, {
                        errors: t,
                        id: s
                    }) => {
                        if (!Object.keys(t).length) {
                            const t = {...e};
                            return delete t[s], t
                        }
                        return {...e, [s]: t}
                    })).on(this.events.clearWidgetValidationErrors, ((e, t) => {
                        const s = {...e};
                        return delete s[t], s
                    }))
                }

                watchValidationErrors(e) {
                    this.$widgetValidationErrors.watch(e)
                }
            }

            class Re extends class {
                $widgets;
                $widgetAnswersInfo;
                $notAvailableContent;
                $contentType;
                events;
                $lastSavedContent;

                get ContentType() {
                    return this.$contentType.getState()
                }

                constructor(e, t) {
                    const {content: s, contentType: r = "UNKNOWN"} = t || {}, {widgets: n} = s || Qe.vT;
                    this.$widgets = (0, i.createStore)(n), this.$notAvailableContent = (0, i.createStore)(!1), this.$contentType = (0, i.createStore)(r), this.$widgetAnswersInfo = this.$widgets.map(fe), this.$lastSavedContent = (0, i.createStore)([]), this.events = {
                        widgets: (0, i.createApi)(this.$widgets, Ye),
                        notAvailableContent: (0, i.createApi)(this.$notAvailableContent, $e),
                        contentType: (0, i.createApi)(this.$contentType, Fe),
                        makeMaskContentEvent: (0, i.createEvent)()
                    }, e.register({
                        [N.H5.NotAvailableContentChanged]: this.$notAvailableContent,
                        [N.H5.ChangeContentType]: this.events.contentType.restore,
                        [N.H5.ChangeContent]: (0, i.combine)({widgets: this.$widgets})
                    }), e.subscribe({
                        [N.Kt.WidgetCreated]: this.events.widgets.add.prepend((e => e.content)),
                        [N.Kt.WidgetRemoved]: this.events.widgets.remove,
                        [N.H5.ChangeContentType]: [this.events.widgets.restore.prepend((() => []))],
                        [N.hX.WidgetContentEdited]: this.events.widgets.update,
                        [N.hX.UserChangeAnswer]: this.events.widgets.update,
                        RESTORE_WIDGETS: [this.events.widgets.restore],
                        WIDGET_MOVED: this.events.widgets.move
                    }), e.subscribe({MAKE_MASK_CONTENT: this.events.makeMaskContentEvent}), (0, i.sample)({
                        clock: this.events.makeMaskContentEvent,
                        source: this.$widgets,
                        target: this.$lastSavedContent
                    })
                }

                setContentType(e) {
                    return this.events.contentType.restore(e), this
                }

                getContent() {
                    return {
                        widgets: this.$widgets.getState().map((({
                                                                    answer: e,
                                                                    variantId: t,
                                                                    answerStatus: s,
                                                                    ...i
                                                                }) => i))
                    }
                }

                getLastSavedContent() {
                    return {widgets: this.$lastSavedContent.getState()}
                }

                setContent(e) {
                    const {widgets: t} = e || {};
                    return t && this.events.widgets.restore(t), this
                }

                getAnswers() {
                    const {widgets: e} = this.getContent();
                    return e.map((e => ({
                        widgetId: e.id,
                        widgetType: e.template,
                        widgetGroupType: e.groupType,
                        answer: e.answer,
                        variantId: e.variantId,
                        files: e.answer?.files
                    })))
                }

                clearContent() {
                    return this.events.widgets.restore([]), this
                }

                getWidgetsCount() {
                    const {widgets: e} = this.getContent();
                    return e.length
                }

                getInformativeWidgetsCount() {
                    const {widgets: e} = this.getContent();
                    return e.filter((e => e.groupType === g.sJ.INFO)).length
                }

                getInteractiveWidgets() {
                    const {widgets: e} = this.getContent();
                    return e.filter((e => e.groupType && [g.sJ.INTERACTIVE, g.sJ.MIXED].includes(e.groupType)))
                }

                getInteractiveWidgetsCount() {
                    return this.getInteractiveWidgets().length
                }

                getMixedWidgetsCount() {
                    const {widgets: e} = this.getContent();
                    return e.filter((e => e.groupType === g.sJ.MIXED)).length
                }

                getWidgetsMeta() {
                    const {widgets: e} = this.getContent();
                    let t = 0;
                    return e.reduce(((e, s, i) => {
                        s.groupType !== g.sJ.INTERACTIVE && s.groupType !== g.sJ.MIXED || (t += 1);
                        const r = !s.content.title && !s.content.description && !s.content.imgUrl;
                        return [...e, {
                            widgetId: s.id,
                            widgetType: s.template,
                            widgetNumber: i,
                            widgetInteractiveNumber: t,
                            questionIsEmpty: r,
                            isVariation: !!s.variantId
                        }]
                    }), [])
                }

                getContentMetaInfo() {
                    return {
                        informativeWidgetsCount: this.getInformativeWidgetsCount(),
                        interactiveWidgetsCount: this.getInteractiveWidgetsCount(),
                        mixedWidgetsCount: this.getMixedWidgetsCount(),
                        widgetsMeta: this.getWidgetsMeta()
                    }
                }

                applyWatchers(e) {
                    return Object.entries(e).forEach((([e, t]) => {
                        switch (e) {
                            case"widgets":
                                n()(t) ? t.forEach(this.$widgets.watch) : this.$widgets.watch(t);
                                break;
                            case"widgetAnswersInfo":
                                n()(t) ? t.forEach(this.$widgetAnswersInfo.watch) : this.$widgetAnswersInfo.watch(t);
                                break;
                            case"notAvailableContent":
                                n()(t) ? t.forEach(this.$notAvailableContent.watch) : this.$notAvailableContent.watch(t)
                        }
                    })), this
                }
            } {
                get widgetsState() {
                    return this.factoryWidget.getWidgetModels().getState()
                }

                $hasLoaded;
                $disabled;
                $isInitialized;
                $isEvaluated;
                $hasValidationErrors;
                $validationErrors;
                $isQueryNotUsed;
                disablePlayerEvent;
                isInitializedEvent;
                setHasLoadedEvent;
                setValidationErrors;
                setIsEvaluatedEvent;
                createWidgetEvent;
                widgetCreatedEvent;
                widgetRemovedEvent;
                removeWidgetEvent;
                copyWidgetEvent;
                clearWidgetEvent;
                moveWidgetEvent;
                setIsQueryUsedEvent;
                factoryWidget;
                setIsDirtyEvent;
                widgetEditedByUserEvent;
                $isDirty;
                contentValidator;
                initialized;
                config;
                playerId;
                eventBus;

                get PlayerId() {
                    return this.playerId
                }

                get Config() {
                    return this.config
                }

                get EventBus() {
                    return this.eventBus
                }

                get WidgetModels() {
                    return this.factoryWidget.getWidgetModels().getState()
                }

                $isAsyncAnswerRequired;
                setIsAsyncAnswerRequiredEvent;

                getWidgetTemplateById(e) {
                    return this.WidgetModels?.find((t => t.id === e))?.groupType || ""
                }

                getWidgetTemplateTypeById = e => this.WidgetModels?.find((t => t.id === e))?.template || "";

                getWidgetStatusById(e) {
                    return this.WidgetModels?.filter(l).find((t => t.id === e))?.getWidgetStatusStore()
                }

                get DataManagerApi() {
                    return {
                        getWidgetsCount: () => this.getWidgetsCount(),
                        getInformativeWidgetsCount: () => this.getInformativeWidgetsCount(),
                        getInteractiveWidgetsCount: () => this.getInteractiveWidgetsCount(),
                        getMixedWidgetsCount: () => this.getMixedWidgetsCount(),
                        getWidgetsMeta: () => this.getWidgetsMeta(),
                        getContentMetaInfo: () => this.getContentMetaInfo(),
                        getContent: () => this.getContent(),
                        getAnswers: () => this.getAnswers(),
                        setContent: e => (this.setContent(e), this.DataManagerApi)
                    }
                }

                constructor(e, t) {
                    const {modules: s, readonly: r, singletonEventBus: n, api: a, config: c = {}} = t || {},
                        l = n || new M.N;
                    super(l), this.eventBus = l;
                    const {widgets: h} = e || {};
                    this.factoryWidget = s?.factoryWidget ?? new xe(this, h || [], l, a), this.initialized = !!h, this.playerId = (0, u.v4)(), this.config = {
                        ...Qe.Nr, ...c,
                        usePythonCompilerCallback: a?.usePythonCompiler,
                        useValidateAnswers: e => {
                            a?.evaluateAnswer?.(this.getContent().widgets.filter((e => e.groupType === g.sJ.INTERACTIVE)) || [], e?.length ? e : this.getAnswers() || [], ((e, t) => this.setAnswers(e, t)))
                        },
                        readonly: o()(r) ? r : Qe.Nr.readonly
                    }, this.isInitializedEvent = (0, i.createEvent)(), this.disablePlayerEvent = (0, i.createEvent)(), this.setHasLoadedEvent = (0, i.createEvent)(), this.setIsEvaluatedEvent = (0, i.createEvent)(), this.createWidgetEvent = (0, i.createEvent)(), this.removeWidgetEvent = (0, i.createEvent)(), this.copyWidgetEvent = (0, i.createEvent)(), this.clearWidgetEvent = (0, i.createEvent)(), this.moveWidgetEvent = (0, i.createEvent)(), this.widgetCreatedEvent = (0, i.createEvent)(), this.widgetRemovedEvent = (0, i.createEvent)(), this.setValidationErrors = (0, i.createEvent)(), this.setIsAsyncAnswerRequiredEvent = (0, i.createEvent)(), this.setIsQueryUsedEvent = (0, i.createEvent)(), this.setIsDirtyEvent = (0, i.createEvent)(), this.widgetEditedByUserEvent = (0, i.createEvent)(), this.contentValidator = new Pe({eventBus: this.eventBus}), this.contentValidator?.watchValidationErrors((e => {
                        this.setValidationErrors(e)
                    })), this.$isDirty = (0, i.restore)(this.setIsDirtyEvent, !1), l.register({
                        [N.PB.CreateWidget]: this.createWidgetEvent,
                        [N.PB.RemoveWidget]: this.removeWidgetEvent,
                        [N.PB.CopyWidget]: this.copyWidgetEvent,
                        [N.PB.ClearWidget]: this.clearWidgetEvent,
                        [N.PB.MoveWidget]: this.moveWidgetEvent,
                        [N.hX.WidgetEditedByUser]: this.widgetEditedByUserEvent,
                        IS_FORM_DIRTY_TRIGGERED: this.$isDirty.map((e => ({status: e, id: "Content"})))
                    }), l.subscribe({
                        [N.Kt.WidgetCreated]: this.widgetCreatedEvent,
                        [N.Kt.WidgetRemoved]: this.widgetRemovedEvent
                    });
                    const I = (0, i.createStore)(!1), D = (0, i.createEvent)(), A = (0, i.createEvent)(),
                        E = (0, i.createEvent)();
                    l.subscribe({
                        [N.H5.NotAvailableContentChanged]: I,
                        IS_FORM_DIRTY_TRIGGERED: D,
                        MAKE_MASK_CONTENT: A,
                        CHANGE_CONTENT: E
                    }), (0, be.m)({
                        contentInstanceId: this.playerId,
                        contentConfig: this.config
                    }), be.P.map((e => e[this.playerId])).watch((e => {
                        this.config = e
                    })), this.config.onLoad?.(), this.factoryWidget.getWidgetModels().watch((e => {
                        this.setIsAsyncAnswerRequiredEvent(e.some((e => e.template === g.hQ.SCORM))), e.forEach((t => {
                            t.addWatchers({
                                hasLoaded: () => {
                                    e.every((e => e.getHasLoaded())) && (this.config.onLoad?.(), this.setHasLoadedEvent(!0))
                                }
                            })
                        }))
                    })), this.$isInitialized = (0, i.restore)(this.isInitializedEvent, !0), this.$disabled = (0, i.restore)(this.disablePlayerEvent, !1), this.$hasLoaded = (0, i.restore)(this.setHasLoadedEvent, !1), this.$isEvaluated = (0, i.restore)(this.setIsEvaluatedEvent, !1), this.$validationErrors = (0, i.restore)(this.setValidationErrors, {}), this.$isQueryNotUsed = (0, i.restore)(this.setIsQueryUsedEvent, !0), this.$hasValidationErrors = this.$validationErrors.map((e => !!Object.keys(e).length)), this.$isAsyncAnswerRequired = (0, i.restore)(this.setIsAsyncAnswerRequiredEvent, !1), (0, i.sample)({
                        clock: [this.widgetCreatedEvent, this.widgetRemovedEvent],
                        target: [this.setIsDirtyEvent, this.widgetEditedByUserEvent],
                        fn: e => !e.isSystem
                    }), (0, i.sample)({
                        clock: E,
                        target: this.setIsDirtyEvent,
                        fn: e => !d()(e.widgets.map((({
                                                          answer: e,
                                                          answerStatus: t,
                                                          ...s
                                                      }) => ({...s}))), super.getLastSavedContent().widgets)
                    }), (0, i.sample)({clock: A, target: [this.setIsDirtyEvent.prepend((() => !1))]})
                }

                getInstanceByWidgetId(e) {
                    return this.widgetsState.find((t => t.id === e))
                }

                combineStores() {
                    return (0, i.combine)({
                        hasLoaded: this.$hasLoaded,
                        disabled: this.$disabled,
                        hasValidationErrors: this.$hasValidationErrors,
                        validationErrors: this.$validationErrors
                    })
                }

                getInstanceId() {
                    return this.playerId
                }

                getIsEvaluated() {
                    return this.$isEvaluated
                }

                getAnswers() {
                    return this.setIsQueryUsedEvent(!0), this.factoryWidget.getWidgetModels().getState().filter(l).map((e => {
                        const t = e.getAnswer();
                        return {
                            widgetId: e.id,
                            widgetGroupType: e.groupType,
                            widgetType: e.template,
                            answer: t,
                            files: t?.files || [],
                            variantId: t?.variantId
                        }
                    }))
                }

                setAnswers(e, t) {
                    return e ? (this.factoryWidget.getWidgetModels().getState().filter(l).forEach((s => {
                        const i = e.find((e => s.id === e?.widgetId));
                        if (!i) return s.setAnswerStatus(g.iP.NULL), void s.updateAnswerStatus();
                        s.setAnswer(i.answer);
                        const r = t?.isShowEvaluationResult && i.widgetStatus,
                            n = t?.isShowEvaluationResult && i.widgetAnswerStatus;
                        s.setWidgetStatus(r || g.vQ.DEFAULT), s.setAnswerStatus(n || g.iP.DEFAULT), s.updateAnswerStatus()
                    })), this) : this
                }

                sendAsyncAnswer({query: e}) {
                    const t = this.factoryWidget.getWidgetModels().getState().filter(l).find((e => e.template === g.hQ.SCORM));
                    if (!t) return this;
                    const s = t.getAsyncAnswerEvent?.();
                    return s ? ((0, i.guard)({
                        clock: s,
                        filter: this.$isQueryNotUsed,
                        target: (0, i.createEffect)((t => {
                            e([t]), this.setIsQueryUsedEvent(!1), this.$isQueryNotUsed.off(this.setIsQueryUsedEvent)
                        }))
                    }), t.getAnswer(), this) : this
                }

                createWidget(e) {
                    this.createWidgetEvent(e)
                }

                getAnswersWithType(e) {
                    const t = this.widgetsState.filter(l);
                    return "HTML" === e ? t[1]?.getAnswer?.() : "JSON" === e ? t.map((e => ({
                        widgetId: e.id,
                        widgetType: e.template,
                        widgetGroupType: e.groupType,
                        answerBody: e?.getAnswer?.()
                    }))) : "CODE_MIRROR" === e ? t.find((e => "CODE" === e.template))?.getAnswer?.().value : {}
                }

                updateUserAnswerWithStatus(e, t, s, i) {
                    const r = this.getInstanceByWidgetId(e);
                    return r && l(r) && (r.updateAnswer?.(t), r.setWidgetStatus?.(s), r.setAnswerStatus?.(i), r.updateAnswerStatus?.()), this
                }

                validateAnswers(e) {
                    return this.widgetsState.filter(l).forEach((t => {
                        t.validateAnswer?.(e || !1), t.updateAnswerStatus?.()
                    })), this.disablePlayer(e), this.setIsEvaluatedEvent(e || !1), this
                }

                validateAnswersByAPI() {
                    this.$isAsyncAnswerRequired.getState() && this.config.useValidateAnswers ? this.sendAsyncAnswer({query: this.config.useValidateAnswers}) : this.config.useValidateAnswers?.()
                }

                showCorrectAnswers(e) {
                    return this.widgetsState.filter(l).forEach((t => {
                        t.events?.showCorrectAnswers?.(e || !1), t.updateAnswerStatus?.()
                    })), this.disablePlayer(e), this
                }

                disablePlayer(e) {
                    return this.widgetsState.filter(l).forEach((t => {
                        const s = t.getWidgetStatus?.();
                        if (e || void 0 === e) {
                            if (s === g.vQ.DEFAULT) {
                                const e = g.vQ.DISABLED;
                                t.setWidgetStatus?.(e).updateAnswerStatus?.()
                            }
                        } else s !== g.vQ.DEFAULT && t.setWidgetStatus?.(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.DEFAULT).updateAnswerStatus?.()
                    })), this.disablePlayerEvent(e || !1), this
                }

                setContent(e) {
                    return this.factoryWidget.removeAllWidgets(), this.factoryWidget.restoreWidgets(e?.widgets || []), this
                }

                updateContentConfig(e) {
                    return (0, be.m)({contentConfig: {...this.config, ...e}, contentInstanceId: this.playerId}), this
                }

                toggleLoading(e) {
                    return this.setHasLoadedEvent(e || !this.$hasLoaded.getState()), this
                }

                getWidgetsNumberWithoutAnswers() {
                    const e = this.widgetsState.filter(l), t = [];
                    let s = 0;
                    return e.forEach((e => {
                        const {id: i, groupType: r} = e;
                        r !== g.sJ.INFO && (s += 1, e.getAnswerStatus?.() === g.iP.NULL && t.push({
                            id: i,
                            widgetNumber: s
                        }))
                    }), e), t
                }

                addWatchers(e) {
                    return e ? (Object.keys(e).forEach((t => {
                        switch (t) {
                            case"isInitialized": {
                                const s = e[t];
                                if (!s) break;
                                n()(s) ? s.forEach((e => this.$isInitialized.watch(e))) : this.$isInitialized.watch(s);
                                break
                            }
                            case"notAvailable": {
                                const s = e[t];
                                if (!s) break;
                                this.applyWatchers({notAvailableContent: s});
                                break
                            }
                            case"widgetAnswersInfo": {
                                const s = e[t];
                                if (!s) break;
                                this.applyWatchers({widgetAnswersInfo: s});
                                break
                            }
                            case"validationErrors": {
                                const s = e[t];
                                if (!s) break;
                                n()(s) ? s.forEach(this.$validationErrors.watch) : this.$validationErrors.watch(s);
                                break
                            }
                        }
                    })), this) : this
                }

                resetWidgetsAnswer() {
                    return this.widgetsState.filter(l).forEach((e => e.setWidgetStatus?.(g.vQ.DEFAULT).setAnswerStatus?.(g.iP.NULL).updateAnswerStatus?.().resetAnswer?.())), this
                }

                resetWidgetsStatus(e) {
                    return this.widgetsState.filter(l).forEach((t => {
                        l(t) && (t.setWidgetStatus?.(g.vQ.DEFAULT), t.setAnswerStatus?.(g.iP.DEFAULT), e && (t.setAnswerStatus?.(g.iP.NULL), t.resetAnswer()), t.updateAnswerStatus?.())
                    })), this
                }

                reset() {
                    return this.setContent(super.getLastSavedContent()), this.setIsDirtyEvent(!1), this
                }
            }
        }, 60240: (e, t, s) => {
            "use strict";
            s.d(t, {m: () => n, P: () => a});
            var i = s(63071), r = s(78758);
            const n = (0, i.createEvent)(),
                a = (0, i.createStore)({}).on(n, ((e, {contentInstanceId: t, contentConfig: s}) => ({
                    ...e,
                    [t]: {...e[t] || r.Nr, ...s}
                })))
        }, 84008: (e, t, s) => {
            "use strict";
            var i, r, n, a;
            s.d(t, {hX: () => i, Kt: () => r, PB: () => n, H5: () => a}), function (e) {
                e.WidgetContentEdited = "WIDGET_CONTENT_EDITED", e.IsFormDirtyTriggered = "IS_FORM_DIRTY_TRIGGERED", e.WidgetValidationErrorsChanged = "WIDGET_VALIDATION_ERRORS_CHANGED", e.UserChangeAnswer = "USER_CHANGE_ANSWER", e.WidgetEditedByUser = "WIDGET_EDITED_BY_USER"
            }(i || (i = {})), function (e) {
                e.SectionCreated = "SECTION_CREATED", e.SectionRemoved = "SECTION_REMOVED", e.WidgetCreated = "WIDGET_CREATED", e.WidgetCleared = "WIDGET_CLEARED", e.WidgetRemoved = "WIDGET_REMOVED"
            }(r || (r = {})), function (e) {
                e.CreateWidget = "CREATE_WIDGET", e.RemoveWidget = "REMOVE_WIDGET", e.CopyWidget = "COPY_WIDGET", e.ClearWidget = "CLEAR_WIDGET", e.MoveWidget = "MOVE_WIDGET"
            }(n || (n = {})), function (e) {
                e.NotAvailableContentChanged = "NOT_AVAILABLE_CONTENT_CHANGED", e.ChangeContentType = "CHANGE_CONTENT_TYPE", e.ChangeContent = "CHANGE_CONTENT"
            }(a || (a = {}))
        }, 93930: (e, t, s) => {
            "use strict";
            s.d(t, {N: () => l});
            var i = s(63071), r = s(3674), n = s.n(r), a = s(27361), o = s.n(a), c = s(36968), d = s.n(c), u = s(1469),
                g = s.n(u);

            class l {
                events;
                eventQueue;

                constructor() {
                    this.eventQueue = {}, this.events = {}
                }

                register(e) {
                    return this.events = Object.assign(this.events, e), n()(e).forEach((e => {
                        const t = this.eventQueue[e];
                        t && t.forEach((t => this.subEvent(e, t)))
                    })), {subscribe: e => this.subscribe(e)}
                }

                subscribe(e) {
                    return n()(e).forEach((t => {
                        const s = e[t];
                        s && this.subEvent(t, s)
                    })), {subscribe: e => this.subscribe(e)}
                }

                subEvent(e, t) {
                    const s = o()(this.events, e);
                    if (s) (0, i.forward)({from: s, to: t}); else {
                        const s = o()(this.eventQueue, e);
                        this.eventQueue = d()(this.eventQueue, e, g()(s) ? [...s, t] : [t])
                    }
                    return this
                }
            }
        }, 35745: (e, t, s) => {
            "use strict";
            s.d(t, {t: () => r});
            var i = s(6736);
            const r = (e, t) => {
                (0, i.useEffect)((() => {
                    const s = s => {
                        !e.current || e.current.contains(s.target) || s.target.classList.contains("widget-menu") || s.target.closest(".widget-menu") || s.target.classList.contains("ck-body-wrapper") || s.target.closest(".ck-body-wrapper") || s.target.matches(".dialog.visible") || s.target.closest(".dialog.visible") || "presentation" === s.target.getAttribute("role") || t()
                    };
                    return document.addEventListener("mousedown", s), document.addEventListener("touchstart", s), () => {
                        document.removeEventListener("mousedown", s), document.removeEventListener("touchstart", s)
                    }
                }), [e, t])
            }
        }, 66531: (e, t, s) => {
            "use strict";
            s.d(t, {$: () => N});
            var i = s(6736), r = s.n(i), n = s(63071), a = s(47487), o = s(16599), c = s(2284), d = s.n(c),
                u = s(79902), g = s(35745), l = s(5357);
            const M = (0, i.memo)((e => {
                const {
                    isEditorView: t,
                    EditorView: s,
                    PlayerView: n,
                    showEditorView: a,
                    showPlayerView: o,
                    Badge: c,
                    hasErrors: M,
                    validationErrors: N
                } = e, h = (0, i.useRef)(null), I = (0, l.M)(N);
                (0, g.t)(h, o);
                const D = (0, i.useCallback)((() => a()), [a]),
                    A = d()("switcher-wrapper__player-wrapper", {"switcher-wrapper__player-wrapper--has-errors": M});
                return r().createElement(r().Fragment, null, t ? r().createElement("div", {
                    className: "switcher-wrapper__editor-wrapper",
                    ref: h
                }, r().createElement(s, null)) : r().createElement("div", {
                    role: "button",
                    tabIndex: 0,
                    onClick: D,
                    onKeyPress: D,
                    className: A
                }, r().createElement("div", {className: "switcher-wrapper__holder"}, r().createElement(n, {Badge: c}), !!I && r().createElement(u.ErrorMessage, {
                    type: "paragraphSSnugNormal",
                    className: "absolute left-0 top-[calc(100%+0.25rem)]",
                    messageText: I
                }))))
            }));

            class N {
                View;
                ViewName;
                id;
                groupType;
                $isEditorVM;

                constructor(e) {
                    const {EditorVM: t, PlayerVM: s, widgetModel: i, isEditorVM: c = !1, enableErrorHints: d = !1} = e;
                    this.id = i.id, this.ViewName = "something", this.groupType = i.groupType;
                    const u = (0, n.createEvent)(), g = (0, n.createEvent)();
                    this.$isEditorVM = (0, n.createStore)(c).on(u, (() => !0)).on(g, (() => !1));
                    const l = () => {
                        g(), (0, o.D)(i) && (i.isEditModeTouched = !0)
                    }, N = (0, n.combine)({
                        isEditorView: this.$isEditorVM,
                        isEditModeTouched: !!(0, o.D)(i) && i.getIsEditModeTouchedStore(),
                        validationErrors: (0, o.D)(i) ? i.getValidationErrorsStore() : {}
                    }), h = t.View, I = s.View;
                    this.View = (0, a.createComponent)(N, (({Badge: e}, {
                        isEditorView: t,
                        isEditModeTouched: s,
                        validationErrors: i
                    }) => r().createElement(M, {
                        isEditorView: t,
                        EditorView: h,
                        PlayerView: I,
                        showEditorView: u,
                        showPlayerView: l,
                        hasErrors: d && !t && s && !!Object.values(i).length,
                        validationErrors: d ? i : void 0,
                        Badge: e
                    })))
                }
            }
        }, 5357: (e, t, s) => {
            "use strict";
            s.d(t, {M: () => r});
            var i = s(76578);

            function r(e) {
                if (!e || !Object.values(e).length) return "";
                const t = Object.values(e);
                return 1 === t.length ? "error" in t[0] ? t[0]?.error?.message ?? "" : r(t[0]) : `${i.e.validationMessages.errorsCountInWidget} ${t.length}`
            }
        }, 16599: (e, t, s) => {
            "use strict";
            s.d(t, {D: () => i});
            const i = e => "getContent" in e
        }, 28352: (e, t, s) => {
            "use strict";
            s.d(t, {_8: () => r, Ut: () => a, jC: () => o});
            var i = s(82623);
            const r = "MFE_DES.WIDGETS", n = i.hQ.TEXT;
            var a;
            !function (e) {
                e.MAIN_INFO = "MAIN_INFO", e.JOINT_VIEWING = "JOINT_VIEWING", e.INFO_REVIEWER = "INFO_REVIEWER", e.STUDENT_INFO = "STUDENT_INFO", e.TEACHER_INFO = "TEACHER_INFO", e.LINKS = "LINKS", e.SKILLS = "SKILLS", e.STUDY_MATERIALS_AUTHOR = "STUDY_MATERIALS_AUTHOR", e.CRITERIAL_ASSESSMENT = "CRITERIAL_ASSESSMENT"
            }(a || (a = {}));
            const o = (e = n) => `${r}.${e}`
        }, 4945: (e, t, s) => {
            "use strict";
            s.d(t, {X: () => d});
            var i = s(63071), r = s(47487), n = s(1469), a = s.n(n), o = s(7508), c = s(82623);

            class d {
                id;
                template;
                playerInstanceId;
                groupType;
                widgetNumber;
                storesMapByName;
                $hasLoaded;
                $filesUploadProgress;
                events;
                api;

                constructor(e) {
                    const {playerInstanceId: t, data: s, api: r} = e, {
                        id: n,
                        template: a,
                        groupType: d,
                        widgetNumber: u
                    } = s || {};
                    this.id = n || (0, o.v4)(), this.template = a || c.hQ.BASE_WIDGET, this.playerInstanceId = t || "", this.groupType = d, this.widgetNumber = u || 1, this.api = r || {}, this.events = {
                        setHasLoaded: (0, i.createEvent)(),
                        setIsDirty: (0, i.createEvent)(),
                        addFile: (0, i.createEvent)(),
                        fileUploadProgress: (0, i.createEvent)()
                    }, this.$hasLoaded = (0, i.restore)(this.events.setHasLoaded, !1), this.$filesUploadProgress = (0, i.createStore)({}).on(this.events.fileUploadProgress, ((e, {
                        fileId: t,
                        progress: s
                    }) => {
                        if (100 === s && e[t]) {
                            const s = {...e};
                            return delete s[t], s
                        }
                        return {...e, [t]: s}
                    })), this.storesMapByName = {hasLoaded: this.$hasLoaded}
                }

                get ApiFunctions() {
                    return this.api
                }

                getHasLoaded() {
                    return this.$hasLoaded.getState()
                }

                getFileUrl = (e = "") => this.api.getFileUrl?.(e) || e;

                useFileUploader(e, t, s) {
                    (0, i.sample)({
                        clock: t || this.events.addFile, fn: t => {
                            this.api.uploadFile && this.api.uploadFile(t, s, ((e, t) => this.events.fileUploadProgress({
                                fileId: e,
                                progress: t
                            }))).then((t => {
                                t && e(t)
                            }))
                        }
                    })
                }

                createComponent(e, t) {
                    return (0, r.createComponent)((0, i.combine)({...this.storesMapByName, ...e}), t)
                }

                addWatchers(e) {
                    return e ? (Object.entries(e).forEach((([e, t]) => {
                        const s = this.storesMapByName[e];
                        (s || t) && (a()(t) ? t : [t]).forEach((e => {
                            s.watch(e)
                        }))
                    })), this) : this
                }

                get widgetTemplate() {
                    return this.template
                }
            }
        }, 88639: (e, t, s) => {
            "use strict";
            s.d(t, {m: () => l});
            var i = s(63071), r = s(82492), n = s.n(r), a = s(36968), o = s.n(a), c = s(84008), d = s(4945),
                u = s(19501), g = s(76578);
            (0, u.i_)({
                string: {
                    max: ({max: e}) => g.e.validationMessages.stringMaxChars(e),
                    url: g.e.validationMessages.stringUrl
                },
                mixed: {required: g.e.validationMessages.mixedRequired, defined: g.e.validationMessages.mixedRequired}
            });

            class l extends d.X {
                $content;
                $validationErrors;
                initialValidationSchema;
                $lastSavedContent;
                events = this.events;
                $errors;
                $touchedFields;
                $isEditModeTouched;
                $isContentAllowEdit;
                $isDirty;

                constructor(e, t) {
                    super(e), this.$errors = e.$errors;
                    const {
                        data: s,
                        eventBus: r,
                        options: a
                    } = e, {content: d} = s || {}, {isContentAllowEdit: u = !0} = a || {}, g = (0, i.createEffect)({
                        name: "validate widget content", handler: async ({state: e}) => {
                            if (!this.validationSchema) return Promise.reject();
                            try {
                                return this.validationSchema.validateSync(e, {abortEarly: !1}), {}
                            } catch (e) {
                                throw e.inner.reduce(((e, {
                                    path: t,
                                    message: s
                                }) => (t && o()(e, String(t).split("."), {error: {message: s, path: t}}), e)), {})
                            }
                        }
                    });
                    this.events = {
                        ...this.events,
                        setContent: (0, i.createEvent)(),
                        patchContent: (0, i.createEvent)(),
                        makeMaskContentEvent: (0, i.createEvent)(),
                        restoreLastSavedStore: (0, i.createEvent)(),
                        clearStores: (0, i.createEvent)(),
                        setTouchedField: (0, i.createEvent)(),
                        setIsContentAllowEdit: (0, i.createEvent)(),
                        setContentField: (0, i.createEvent)(),
                        setIsEditModeTouched: (0, i.createEvent)(),
                        widgetEditedByUserEvent: (0, i.createEvent)()
                    }, this.$content = (0, i.createStore)(n()({}, t, d)).on(this.events.setContent, ((e, t) => t)).on(this.events.patchContent, ((e, t) => ({...e, ...t}))).on(this.events.clearStores, (() => t)).on(this.events.setContentField, ((e, {
                        field: t,
                        value: s
                    }) => ({
                        ...e,
                        [t]: s
                    }))), this.$validationErrors = (0, i.restore)(g.failData, {}).on(g.doneData, (() => ({}))), this.$isDirty = (0, i.restore)(this.events.setIsDirty, !1), this.$isContentAllowEdit = (0, i.restore)(this.events.setIsContentAllowEdit, u), this.$lastSavedContent = (0, i.createStore)(this.$content.getState()), this.$content.watch((e => {
                        g({state: e})
                    })), this.$isEditModeTouched = (0, i.restore)(this.events.setIsEditModeTouched, !1), this.$isEditModeTouched.watch((e => {
                        e && g({state: this.$content.getState()})
                    })), this.storesMapByName = {
                        ...this.storesMapByName,
                        content: this.$content
                    }, r?.register({
                        [c.hX.WidgetContentEdited]: this.$content.map((e => ({
                            content: e,
                            id: this.id,
                            template: this.template
                        }))),
                        [c.hX.IsFormDirtyTriggered]: this.$isDirty.map((e => ({status: e, id: this.id}))),
                        [c.hX.WidgetValidationErrorsChanged]: this.$validationErrors.map((e => ({
                            errors: e,
                            id: this.id
                        }))),
                        [c.hX.WidgetEditedByUser]: this.events.widgetEditedByUserEvent
                    }), r?.subscribe({
                        CHANGE_CONTENT_ALLOW_TRIGGERED: this.$isContentAllowEdit,
                        MAKE_MASK_CONTENT: this.events.makeMaskContentEvent
                    }), this.$touchedFields = (0, i.createStore)({}).on(this.events.setTouchedField, ((e, {
                        touchedField: t,
                        isTouched: s
                    }) => ({
                        ...e,
                        [t]: s
                    }))), this.useWidgetsEdit(this.events.patchContent), (0, i.sample)({
                        clock: this.events.restoreLastSavedStore,
                        source: this.$lastSavedContent,
                        target: [this.$content, this.events.setIsDirty.prepend((() => !1)), this.events.setIsEditModeTouched.prepend((() => !1))]
                    }), (0, i.sample)({
                        clock: this.events.makeMaskContentEvent,
                        source: this.$content,
                        target: [this.$lastSavedContent, this.events.setIsDirty.prepend((() => !1)), this.events.setIsEditModeTouched.prepend((() => !1))]
                    })
                }

                useWidgetsEdit(e) {
                    (0, i.sample)({
                        clock: e,
                        source: {content: this.$content, savedContent: this.$lastSavedContent},
                        target: [this.events.setIsDirty, this.events.widgetEditedByUserEvent],
                        fn: ({content: e, savedContent: t}) => JSON.stringify(e) !== JSON.stringify(t)
                    })
                }

                setIsDirty(e) {
                    this.events.setIsDirty(e)
                }

                getIsDirty() {
                    return this.$isDirty
                }

                getContent() {
                    return this.$content.getState()
                }

                get validationSchema() {
                    return this.initialValidationSchema
                }

                set validationSchema(e) {
                    this.initialValidationSchema = e
                }

                setContent(e) {
                    return this.events.setContent(e), this
                }

                getHasValidationErrors() {
                    return !!Object.keys(this.$validationErrors.getState()).length
                }

                setContentAllowEdit(e) {
                    return this.events.setIsContentAllowEdit(e), this
                }

                reset() {
                    return this.events.restoreLastSavedStore(), this
                }

                clear() {
                    return this.events.clearStores(), this
                }

                getCopy() {
                    return this.getContent()
                }

                ContentMap(e) {
                    return this.$content.map(e)
                }

                set isEditModeTouched(e) {
                    this.events.setIsEditModeTouched(e)
                }

                getIsEditModeTouchedStore() {
                    return this.$isEditModeTouched
                }

                getValidationErrorsStore() {
                    return this.$validationErrors
                }
            }
        }, 6618: (e, t, s) => {
            "use strict";
            s.d(t, {Xt: () => i.X, mr: () => r.m, MN: () => o});
            var i = s(4945), r = s(88639), n = s(63071), a = s(82623);

            class o extends r.m {
                $answer;
                $answerStatus;
                $widgetStatus;
                $noInteractivity;
                lastSavedAnswer;
                initialAnswer;
                events = this.events;

                constructor(e, t, s) {
                    super(e, t);
                    const {data: {answer: i}, eventBus: r} = e;
                    this.events = {
                        ...this.events,
                        setAnswer: (0, n.createEvent)(),
                        updateAnswerStatus: (0, n.createEvent)(),
                        updateWidgetStatus: (0, n.createEvent)(),
                        showCorrectAnswers: (0, n.createEvent)(),
                        validateAnswer: (0, n.createEvent)()
                    }, this.initialAnswer = s, this.$answer = (0, n.createStore)(i || s).on(this.events.setAnswer, ((e, t) => t || e)).on(this.events.restoreLastSavedStore, (() => this.lastSavedAnswer)).on(this.events.clearStores, (() => s)), this.$answerStatus = (0, n.createStore)(a.iP.NULL).on(this.events.updateAnswerStatus, ((e, t) => t)), this.$widgetStatus = (0, n.createStore)(a.vQ.DEFAULT).on(this.events.updateWidgetStatus, ((e, t) => t)), this.$noInteractivity = this.$widgetStatus.map((e => e !== a.vQ.DEFAULT)), this.storesMapByName = {
                        ...this.storesMapByName,
                        answer: this.$answer,
                        answerStatus: this.$answerStatus,
                        widgetStatus: this.$widgetStatus,
                        noInteractivity: this.$noInteractivity
                    }, r?.register({
                        USER_CHANGE_ANSWER: (0, n.combine)({
                            answer: this.$answer,
                            answerStatus: this.$answerStatus,
                            id: (0, n.createStore)(this.id)
                        })
                    }), this.lastSavedAnswer = this.$answer.getState()
                }

                getAnswer() {
                    return this.$answer.getState()
                }

                setAnswer(e) {
                    return this.events.setAnswer(e), this
                }

                updateAnswerStatus() {
                    return this
                }

                updateAnswer(e) {
                    return this.events.setAnswer(e), this
                }

                resetAnswer() {
                    return this.events.setAnswer(this.initialAnswer), this
                }

                setAnswerStatus(e) {
                    return this.events.updateAnswerStatus(e), this
                }

                setWidgetStatus(e) {
                    return this.events.updateWidgetStatus(e), this
                }

                getWidgetStatus() {
                    return this.$widgetStatus.getState()
                }

                getWidgetStatusStore() {
                    return this.$widgetStatus.map((e => e))
                }

                getAnswerStatus() {
                    return this.$answerStatus.getState()
                }

                getAnswerStatusStore() {
                    return this.$answerStatus
                }

                validateAnswer(e) {
                    return this.setAnswerStatus(a.iP.DEFAULT)
                }

                AnswerMap(e) {
                    return this.$answer.map(e)
                }
            }
        }, 43918: (e, t, s) => {
            "use strict";
            s.d(t, {Z: () => o});
            var i = s(6736), r = s.n(i), n = s(76578);
            const a = e => r().createElement(i.Suspense, {...e});
            a.defaultProps = {fallback: n.e.ui.componentLoadingText};
            const o = a
        }, 70027: (e, t, s) => {
            "use strict";
            s.d(t, {Z: () => I});
            var i = s(6736), r = s.n(i), n = s(95009), a = s(2284), o = s.n(a), c = s(85386), d = s(11330),
                u = s(83343);
            const g = "Accordion", l = {
                base: "text-dark-700 any-hover:group-hover:text-primary w-2 h-2 bg-light-50 rounded-s flex items-center justify-center transform transition-transform duration-100 ease-in flex-shrink-0",
                position: {left: "mr-1.5 order-1", right: "ml-1.5"}
            }, M = {
                base: "any-hover:group-hover:text-primary",
                caretIconPosition: {left: "order-2 justify-self-start", right: ""}
            }, N = e => {
                const {
                    children: t,
                    dataTestId: s = g,
                    openByDefault: n = !1,
                    title: a,
                    iconPosition: c = "right",
                    narrow: N = !1
                } = e, [h, I] = (0, i.useState)(n), D = N ? "" : "p-1";
                return r().createElement("div", {
                    "data-testid": s,
                    "data-analytics": g,
                    className: "w-full"
                }, r().createElement("div", {
                    className: o()("flex items-center group", "left" === c ? "justify-start" : "justify-between", D),
                    role: "button",
                    onClick: () => I(!h),
                    "aria-hidden": "true",
                    "data-testid": `${g}.Header`
                }, r().createElement("div", {
                    className: o()(M.base, M.caretIconPosition[c]),
                    "data-testId": `${g}.Title`
                }, a), r().createElement("div", {
                    className: o()(l.base, l.position[c], h ? "rotate-0" : "rotate-180"),
                    "data-testid": `${g}.Icon`
                }, r().createElement(u.Icon, {name: "caret-up", size: 16}))), r().createElement(d.uT, {
                    appear: !0,
                    show: h,
                    as: i.Fragment,
                    enter: "transition duration-100 ease-out",
                    enterFrom: "transform opacity-0 scale-0",
                    enterTo: "transform opacity-100 scale-100",
                    leave: "transition ease-in duration-100",
                    leaveFrom: "opacity-100 scale-100",
                    leaveTo: "opacity-0 scale-0"
                }, r().createElement("div", {className: o()("flex flex-col", D)}, t)))
            }, h = ({title: e, description: t, imgUrl: s, onImageLoad: i}) => r().createElement(N, {
                openByDefault: !0,
                narrow: !0,
                title: r().createElement(n.Typography, {
                    type: "paragraphMSnugNormal",
                    className: o()("block", {"mb-0.25": t || s}),
                    as: "span",
                    dataTestId: "QP.title"
                }, r().createElement(c.X, {content: e || "", removeMargins: !0}))
            }, t && r().createElement(n.Typography, {
                type: "paragraphMSnugNormal",
                className: o()("block dark-100 rounded-m bg-question", {"mb-1.15": s}),
                as: "span",
                dataTestId: "QP.description"
            }, r().createElement(c.X, {
                content: t || "",
                removeMargins: !0
            })), s && r().createElement("div", {className: "flex flex-col items-center w-full"}, r().createElement("img", {
                onLoad: i,
                className: "object-contain rounded-l",
                src: s,
                alt: "",
                "data-testid": "QP.image"
            }))), I = (0, i.memo)((e => {
                const {
                    title: t = "",
                    description: s = "",
                    imgUrl: i = "",
                    onImageLoad: a,
                    Badge: d,
                    isAccordionActive: u = !1,
                    isWithPaddings: g = !1
                } = e;
                return r().createElement("div", {className: "question-player title-box flex items-start mb-1"}, d && d, u ? r().createElement(h, {
                    title: t,
                    description: s,
                    onImageLoad: a,
                    imgUrl: i
                }) : r().createElement("div", {className: "grid"}, t && r().createElement(n.Typography, {
                    type: "paragraphMSnugNormal",
                    className: o()("block overflow-auto pb-0.625", {"mb-0.25": s || i}),
                    as: "span",
                    dataTestId: "QP.title"
                }, r().createElement(c.X, {
                    content: t,
                    removeMargins: !g
                })), s && r().createElement(n.Typography, {
                    type: "paragraphMSnugNormal",
                    className: o()("block dark-100 bg-question overflow-auto pb-0.625", {"mb-1.15": i}),
                    as: "span",
                    dataTestId: "QP.description"
                }, r().createElement(c.X, {
                    content: s || "",
                    removeMargins: !g
                })), i && r().createElement("div", {className: "flex flex-col items-center w-full"}, r().createElement("img", {
                    onLoad: a,
                    className: "object-contain rounded-l",
                    src: i,
                    alt: "",
                    "data-testid": "QP.image"
                }))))
            }))
        }, 85386: (e, t, s) => {
            "use strict";
            s.d(t, {X: () => c});
            var i = s(6736), r = s.n(i), n = s(2284), a = s.n(n), o = s(62077);
            const c = ({
                           content: e,
                           className: t,
                           removeMargins: s = !1,
                           isProtectionRuleDisabled: i,
                           dataTestId: n = ""
                       }) => r().createElement(o.HTMLContentPlayer, {
                isProtectionRuleDisabled: i,
                className: a()(t, {"no-margins": s}),
                content: e || "",
                dataTestId: n
            })
        }, 34506: (e, t, s) => {
            "use strict";
            s.d(t, {n: () => i, J: () => r});
            const i = "useFirstFrame",
                r = "data:image/svg+xml,%3Csvg width='800' height='528' viewBox='0 0 800 528' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1661_325351)'%3E%3Crect width='800' height='528' fill='%23C7D2FE'/%3E%3Ccircle opacity='0.2' cx='47' cy='450' r='299' transform='rotate(-180 47 450)' fill='white'/%3E%3Ccircle cx='43' cy='454' r='299' transform='rotate(-180 43 454)' fill='url(%23paint0_linear_1661_325351)'/%3E%3Cg opacity='0.3'%3E%3Cpath d='M593.5 62.7812C566.262 62.7813 539.635 70.8583 516.988 85.991C494.34 101.124 476.688 122.632 466.265 147.797C455.841 172.962 453.114 200.653 458.428 227.368C463.741 254.082 476.858 278.622 496.118 297.882C515.379 317.142 539.918 330.259 566.632 335.573C593.347 340.886 621.038 338.159 646.203 327.736C671.368 317.312 692.876 299.66 708.009 277.012C723.142 254.365 731.219 227.738 731.219 200.5C731.177 163.988 716.653 128.983 690.835 103.165C665.017 77.3466 630.012 62.8235 593.5 62.7812ZM641.751 209.314L578.189 251.689C576.594 252.755 574.739 253.367 572.823 253.46C570.908 253.554 569.002 253.125 567.311 252.22C565.62 251.315 564.206 249.968 563.221 248.322C562.237 246.676 561.717 244.793 561.719 242.875V158.125C561.717 156.207 562.237 154.324 563.221 152.678C564.206 151.032 565.62 149.685 567.311 148.78C569.002 147.875 570.908 147.446 572.823 147.54C574.739 147.633 576.594 148.245 578.189 149.311L641.751 191.686C643.202 192.653 644.392 193.964 645.215 195.501C646.038 197.039 646.469 198.756 646.469 200.5C646.469 202.244 646.038 203.961 645.215 205.499C644.392 207.036 643.202 208.347 641.751 209.314Z' fill='white'/%3E%3C/g%3E%3Cpath d='M593.5 66.7812C566.262 66.7813 539.635 74.8583 516.988 89.991C494.34 105.124 476.688 126.632 466.265 151.797C455.841 176.962 453.114 204.653 458.428 231.368C463.741 258.082 476.858 282.622 496.118 301.882C515.379 321.142 539.918 334.259 566.632 339.573C593.347 344.886 621.038 342.159 646.203 331.736C671.368 321.312 692.876 303.66 708.009 281.012C723.142 258.365 731.219 231.738 731.219 204.5C731.177 167.988 716.653 132.983 690.835 107.165C665.017 81.3466 630.012 66.8235 593.5 66.7812ZM641.751 213.314L578.189 255.689C576.594 256.755 574.739 257.367 572.823 257.46C570.908 257.554 569.002 257.125 567.311 256.22C565.62 255.315 564.206 253.968 563.221 252.322C562.237 250.676 561.717 248.793 561.719 246.875V162.125C561.717 160.207 562.237 158.324 563.221 156.678C564.206 155.032 565.62 153.685 567.311 152.78C569.002 151.875 570.908 151.446 572.823 151.54C574.739 151.633 576.594 152.245 578.189 153.311L641.751 195.686C643.202 196.653 644.392 197.964 645.215 199.501C646.038 201.039 646.469 202.756 646.469 204.5C646.469 206.244 646.038 207.961 645.215 209.499C644.392 211.036 643.202 212.347 641.751 213.314Z' fill='url(%23paint1_linear_1661_325351)'/%3E%3C/g%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_1661_325351' x1='212' y1='66.6' x2='-16.8' y2='711.4' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23A5B4FC'/%3E%3Cstop offset='1' stop-color='%23A5B4FC' stop-opacity='0'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_1661_325351' x1='671.341' y1='26.0644' x2='565.956' y2='323.058' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23A5B4FC'/%3E%3Cstop offset='1' stop-color='%23A5B4FC' stop-opacity='0'/%3E%3C/linearGradient%3E%3CclipPath id='clip0_1661_325351'%3E%3Crect width='800' height='528' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A"
        }, 87694: (e, t, s) => {
            "use strict";
            var i;
            s.d(t, {s: () => i, t: () => r}), function (e) {
                e.files = "FILES", e.settings = "SETTINGS"
            }(i || (i = {}));
            const r = 60
        }, 29227: (e, t, s) => {
            "use strict";
            s.d(t, {c: () => o});
            var i = s(82623), r = s(6618), n = s(63071), a = s(87694);

            class o extends r.mr {
                $activeEditModeTab;
                $trackIdInEditMode;
                $interimAudioUrl;
                $interimAudioUrlHasError;
                events = {
                    ...this.events,
                    setTitle: (0, n.createEvent)(),
                    setDescription: (0, n.createEvent)(),
                    updateAudioTrack: (0, n.createEvent)(),
                    setTracks: (0, n.createEvent)(),
                    fileUploaded: (0, n.createEvent)(),
                    setActiveEditModeTab: (0, n.createEvent)(),
                    setTrackIdInEditMode: (0, n.createEvent)(),
                    sortTracks: (0, n.createEvent)(),
                    addTrack: (0, n.createEvent)(),
                    trackUploaded: (0, n.createEvent)(),
                    uploadTrack: (0, n.createEvent)(),
                    setAudioFile: (0, n.createEvent)(),
                    changeAudioFile: (0, n.createEvent)(),
                    coverUploaded: (0, n.createEvent)(),
                    uploadCover: (0, n.createEvent)(),
                    setInterimAudioUrl: (0, n.createEvent)(),
                    setInterimAudioUrlHasError: (0, n.createEvent)()
                };
                prevTrackInEditModeId = "";

                constructor(e) {
                    super(e, {
                        tracks: [],
                        title: "",
                        description: ""
                    }), this.$activeEditModeTab = (0, n.restore)(this.events.setActiveEditModeTab, a.s.files), this.$trackIdInEditMode = (0, n.restore)(this.events.setTrackIdInEditMode, this.prevTrackInEditModeId), this.$interimAudioUrl = (0, n.restore)(this.events.setInterimAudioUrl, ""), this.$interimAudioUrlHasError = (0, n.restore)(this.events.setInterimAudioUrlHasError, !1), this.template = e.template || i.hQ.AUDIO, this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.updateAudioTrack, ((e, {id: t, trackData: s}) => ({
                        ...e,
                        tracks: e.tracks.map((e => e.id !== t ? e : {...e, ...s}))
                    }))).on(this.events.setTracks, ((e, t) => ({
                        ...e,
                        tracks: t
                    }))).on(this.events.fileUploaded, ((e, t) => ({
                        ...e,
                        tracks: [{id: t.id, audioUrl: t.path, audioName: t.name}]
                    }))).on(this.events.coverUploaded, ((e, t) => ({
                        ...e,
                        imgUrl: t.path
                    }))).on(this.events.sortTracks, ((e, {sortedId: t, newPositionId: s}) => {
                        const {tracks: i} = e, r = [...i], n = r.findIndex((e => e.id === t)),
                            a = r.findIndex((e => e.id === s));
                        return r.splice(a, 0, r.splice(n, 1)[0]), {...e, tracks: r}
                    })).on(this.events.addTrack, ((e, t) => ({
                        ...e,
                        tracks: [...e.tracks, t]
                    }))).on(this.events.trackUploaded, ((e, t) => ({
                        ...e,
                        tracks: e.tracks.map((e => e.id === t.id ? {
                            id: t.id,
                            audioUrl: t.path,
                            audioName: t.name,
                            isTemporary: !1
                        } : e))
                    })));
                    const t = this.events.addTrack.prepend((e => ({
                        audioUrl: e.path,
                        id: e.id,
                        audioName: e.name,
                        isTemporary: e.isTemporary
                    })));
                    super.useFileUploader(this.events.fileUploaded), super.useFileUploader(this.events.trackUploaded, this.events.uploadTrack, t), super.useFileUploader(this.events.coverUploaded, this.events.uploadCover), super.useWidgetsEdit([this.events.trackUploaded, this.events.updateAudioTrack, this.events.coverUploaded, this.events.sortTracks, this.events.setTitle, this.events.setDescription, this.events.setTracks, this.events.addFile]), (0, n.sample)({
                        clock: this.events.changeAudioFile,
                        fn: async ({id: e, file: t}) => {
                            const s = await (this.api.uploadFile?.(t));
                            s && this.events.updateAudioTrack({id: e, trackData: {audioUrl: s.path, audioName: t.name}})
                        }
                    })
                }

                setTrackIdInEditMode = e => {
                    if (this.events.setTrackIdInEditMode(e), this.prevTrackInEditModeId) {
                        const e = this.$content.getState().tracks.findIndex((e => e.id === this.prevTrackInEditModeId));
                        this.events.setTouchedField({
                            touchedField: `tracks[${e}].audioName`,
                            isTouched: !0
                        }), this.events.setTouchedField({touchedField: `tracks[${e}].description`, isTouched: !0})
                    }
                    this.prevTrackInEditModeId = e
                };

                combineStores() {
                    return (0, n.combine)({
                        content: this.$content,
                        activeEditModeTab: this.$activeEditModeTab,
                        trackIdInEditMode: this.$trackIdInEditMode,
                        touchedFields: this.$touchedFields
                    })
                }
            }
        }, 81227: (e, t, s) => {
            "use strict";
            s.d(t, {PH: () => r, qT: () => n, Y_: () => a});
            var i = s(17216);
            const r = {
                    toolbar: Object.values(i.CKEditorToolbarButtons).filter((e => ![i.CKEditorToolbarButtons.Undo, i.CKEditorToolbarButtons.Redo, i.CKEditorToolbarButtons.Link].includes(e))),
                    removePlugins: [i.CKEditorPluginNames.Heading, i.CKEditorPluginNames.BlockQuote, i.CKEditorPluginNames.HorizontalLine, i.CKEditorPluginNames.Font, i.CKEditorPluginNames.Indent, i.CKEditorPluginNames.IndentBlock, i.CKEditorPluginNames.WordCount, i.CKEditorPluginNames.Image, i.CKEditorPluginNames.ImageCaption, i.CKEditorPluginNames.ImageResize, i.CKEditorPluginNames.ImageStyle, i.CKEditorPluginNames.ImageTextAlternative, i.CKEditorPluginNames.ImageToolbar, i.CKEditorPluginNames.Table, i.CKEditorPluginNames.TableToolbar, i.CKEditorPluginNames.TableProperties, i.CKEditorPluginNames.TableCellProperties, i.CKEditorPluginNames.TableCaption, i.CKEditorPluginNames.Collapse, i.CKEditorPluginNames.Media, i.CKEditorPluginNames.MediaInsert, i.CKEditorPluginNames.MediaResize, i.CKEditorPluginNames.MediaResizeButtons, i.CKEditorPluginNames.MediaResizeHandles, i.CKEditorPluginNames.MediaStyle, i.CKEditorPluginNames.MediaToolbar, i.CKEditorPluginNames.MediaUpload, i.CKEditorPluginNames.MediaEmbed, i.CKEditorPluginNames.MediaEmbedToolbar, i.CKEditorPluginNames.MediaEmbedResize, i.CKEditorPluginNames.MediaEmbedResizeButtons, i.CKEditorPluginNames.MediaEmbedResizeHandles, i.CKEditorPluginNames.Emoji, i.CKEditorPluginNames.Whitelist, i.CKEditorPluginNames.ListProperties],
                    media: {
                        supportedFormats: [".png", ".jpg", ".jpeg", ".gif", ".mp3", ".mp4", ".mov"],
                        uploadFile: () => new Promise((() => {
                        }))
                    }
                }, n = 700,
                a = ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMSIgdmlld0JveD0iMCAwIDEyMCAxMjEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8xXzQpIj4KPHBhdGggZD0iTTU2LjU4MTQgNzguMDAzN0M3Mi4xNjcyIDc4LjAwMzcgODQuODAyIDY0Ljk4MDggODQuODAyIDQ4LjkxNjJDODQuODAyIDMyLjg1MTcgNzIuMTY3MiAxOS44Mjg4IDU2LjU4MTQgMTkuODI4OEM0MC45OTU3IDE5LjgyODggMjguMzYwOSAzMi44NTE3IDI4LjM2MDkgNDguOTE2MkMyOC4zNjA5IDY0Ljk4MDggNDAuOTk1NyA3OC4wMDM3IDU2LjU4MTQgNzguMDAzN1oiIGZpbGw9IiNGRkMxNjYiLz4KPHBhdGggZD0iTTM1LjEwOTIgNDUuMTQ1M0MzNi4wMjUzIDQxLjkyNzIgMzcuNjEgMzguOTQ5MiAzOS42MjAyIDM2LjM1OUM0MS42MzAzIDMzLjc2ODggNDQuMDM5OSAzMS40Njk1IDQ2LjY5MjcgMjkuNjUwNEM0OS4xNSAyNy45NjUyIDUxLjg5MzkgMjYuNzk3MSA1NC43NTUxIDI2LjE1OTlDNTcuNjE2MiAyNS41MjI4IDYwLjQ0NjkgMjUuNDM1IDYzLjI4NjQgMjUuNzg1OUM2Ni4xMjU4IDI2LjEzNjggNjguODMwNiAyNi45MzEgNzEuMzk2NSAyOC4xNDUzQzczLjk2MjQgMjkuMzU5NSA3Ni4yNjM1IDMwLjkxNTUgNzguMjkxIDMyLjg5NjJDODAuNDAxIDM0Ljk1MDggODIuMTUwNyAzNy40MjA5IDgzLjQ5MjMgNDAuMTAzNEM4NC44MzM4IDQyLjc4NTkgODUuODIzNyA0NS44OTMyIDg2LjI5MjYgNDguOTk1OUM4Ni43NjE1IDUyLjA5ODUgODYuNzMxMSA1NS40OTIxIDg2LjE4ODQgNTguNjc3OEM4NS41ODkzIDYyLjE5MTQgODQuNDA0IDY1LjU2NjUgODIuNzQ1NSA2OC42NjkyQzgyLjMxNTcgNjkuNDc3MSA4MS44NTU1IDcwLjI2MiA4MS4zNjQ5IDcxLjAyODVDODEuMDUyMyA3MS41MjI1IDgxLjgwMzQgNzEuOTg0MiA4Mi4xMTYgNzEuNDk0OEM4NC4wODI3IDY4LjM5MjEgODUuNjA2NiA2NC45NjYzIDg2LjUxNCA2MS4zNDY1Qzg3LjM0MzMgNTguMDQ1MyA4Ny42NTU5IDU0LjU5MTggODcuNDA0MSA1MS4xODlDODcuMTYwOSA0Ny45MjAxIDg2LjQwOTggNDQuNzIwNSA4NS4xODU1IDQxLjcxNDhDODMuOTYxMiAzOC43MDkxIDgyLjMyODcgMzYuMDcyNyA4MC4yOTY4IDMzLjcyMjdDNzguMzkwOSAzMS41MjAzIDc2LjEwMjggMjkuNjkyIDczLjYyMzggMjguMjgzOEM3MS4xNDQ3IDI2Ljg3NTYgNjguMjk2NiAyNS43OTUyIDY1LjQ1MjggMjUuMjE4QzYyLjU2MTMgMjQuNjMxNyA1OS41ODczIDI0LjQ5NzggNTYuNjY1NCAyNC44OTQ4QzUzLjc0MzUgMjUuMjkxOSA1MC43ODY4IDI2LjIyNDYgNDguMTI1NCAyNy42OTc0QzQ1LjI5OSAyOS4yNjI2IDQyLjcyODggMzEuNDYwMyA0MC41MjMyIDMzLjg5ODFDMzguMjU2OSAzNi40MDA2IDM2LjM1OTYgMzkuMjkwOCAzNS4wODc1IDQyLjQ5OTdDMzQuNzc0OSA0My4yODQ2IDM0LjUwNTcgNDQuMDgzMyAzNC4yNzEzIDQ0Ljg5NTlDMzQuMTEwNyA0NS40NjM4IDM0Ljk0ODYgNDUuNzA4NSAzNS4xMDkyIDQ1LjE0MDZWNDUuMTQ1M1oiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0zMy42MDY3IDU5LjM1NTdDMzMuNzY3MyA2Mi45OTg2IDM0Ljg3NDQgNjYuNTcyMiAzNi41ODA3IDY5LjcyMUMzOC4zNTIxIDcyLjk5NDUgNDAuODI2OCA3NS44ODAyIDQzLjgzOTkgNzcuODk3OEM0NS4zMzM0IDc4Ljg5NTEgNDYuOTYxNSA3OS42NjE1IDQ4LjY2MzQgODAuMTQ2M0M0OS40NjY2IDgwLjM3MjYgNTAuMTgzIDgwLjkwMzUgNTAuODA4MiA4MS40NjIyQzUxLjM4MTMgODEuOTc0NyA1MS45NTg3IDgyLjU2MTEgNTIuMjggODMuMjk1MkM1Mi42MDEzIDg0LjAyOTMgNTIuODE0IDg0LjkwMTkgNTIuOTc5IDg1LjcxOTFDNTMuMTQ0IDg2LjUzNjMgNTMuMTY1NyA4Ny40MzY3IDUzLjI5MTYgODguMzA5M0M1My41NzM4IDkwLjMxNzcgNTQuMTY0MiA5Mi4yOCA1NS4wMzI2IDk0LjA4OThDNTYuNzM4OCA5Ny42NDk2IDU5LjU3ODIgMTAwLjQ3MSA2My4xNzc1IDEwMS43MTdDNjYuNjA3MyAxMDIuOTA0IDcwLjQ0OTcgMTAyLjcwMSA3My44MDU4IDEwMS4zMzlDNzcuMTYxOCA5OS45NzY2IDgwLjExODUgOTcuNDI4IDgxLjYzOCA5My44OTU5QzgzLjE1NzYgOTAuMzYzOSA4My4zMzU2IDg2LjI1MDEgODIuNzcxMiA4Mi40MTMzQzgyLjYyNzkgODEuNDQzNyA4Mi40MzY5IDgwLjQ4MzQgODIuMTkzOCA3OS41MzIzQzgxLjk1MDYgNzguNTgxMiA4MS42OTAxIDc3LjU4MzkgODEuMjkwNyA3Ni42Nzg5QzgwLjg0NzkgNzUuNjY3OCA3OS45NDA1IDc1LjA1ODMgNzguODk0MSA3NS4wMjZDNzguMzgxOCA3NS4wMTIyIDc3Ljg3ODIgNzUuMTgzIDc3LjM4MzIgNzUuMzAzQzc2Ljg0NDkgNzUuNDM2OSA3Ni4zMDY1IDc1LjU3MDggNzUuNzcyNSA3NS43MDkzQzcxLjM5NjIgNzYuODIyMSA2Ny4wMjQxIDc4LjA0NTYgNjIuODQ3NSA3OS44MzI0QzYxLjgzMTYgODAuMjY2NCA2MC44MjQzIDgwLjczMjcgNTkuODM4NyA4MS4yNDA2QzU5LjMzNTEgODEuNDk5MSA1OS43NzM2IDgyLjI5MzMgNjAuMjc3MyA4Mi4wMzkzQzY0LjIyODEgODAuMDE3MSA2OC40NDgyIDc4LjY0NTggNzIuNjgxMyA3Ny40ODIzQzczLjc0MDYgNzcuMTkxNCA3NC44MDQzIDc2LjkxNDQgNzUuODY4IDc2LjY0MkM3Ni4zNzYgNzYuNTEyNyA3Ni44ODQgNzYuMzgzNCA3Ny4zOTE5IDc2LjI1ODhDNzcuODY1MiA3Ni4xMzg3IDc4LjM2ODggNzUuOTQ5NCA3OC44NTk0IDc1Ljk1NEM3OS4yOTM2IDc1Ljk1ODcgNzkuNzUzOCA3Ni4xMTU2IDgwLjA4MzcgNzYuNDI1QzgwLjQxMzcgNzYuNzM0MyA4MC41Nzg3IDc3LjE5MTQgODAuNzIyIDc3LjYxNjJDODEuMDI1OSA3OC41MTE5IDgxLjI4NjQgNzkuNDMwNyA4MS41MDM0IDgwLjM1ODdDODIuMzQ1NyA4My45OTcgODIuNTQ1NCA4Ny45MzUzIDgxLjU0MjUgOTEuNTU5N0M4MS4wNjkzIDkzLjI3MjYgODAuMzA5NSA5NC45MDcxIDc5LjIyNDEgOTYuMjc4M0M3OC4xMzg3IDk3LjY0OTYgNzYuNzAxNiA5OC44MjY5IDc1LjE2OSA5OS42ODU3QzcyLjEzODYgMTAxLjM3NiA2OC41MjIgMTAxLjk4NSA2NS4xNTcyIDEwMS4zMDJDNjMuNDU5NyAxMDAuOTYgNjEuODI3MiAxMDAuMjkxIDYwLjM4NTggOTkuMjc0OEM1OC45NDQ0IDk4LjI1OSA1Ny42MjQ1IDk2LjgwMDEgNTYuNjQzMyA5NS4xOTc5QzU1LjY2MjEgOTMuNTk1OCA1NC45MTk3IDkxLjc0OSA1NC40NzI1IDg5Ljg1NkM1NC4yNTExIDg4LjkwOTUgNTQuMDk0OCA4Ny45NDkyIDU0LjAxNjYgODYuOTc1QzUzLjk1MTUgODYuMTY3IDUzLjgyNTYgODUuMzg2NyA1My42MjE1IDg0LjYwMThDNTMuNDMwNSA4My44NjMxIDUzLjIyMjEgODMuMDU5NyA1Mi44MjcgODIuNDA4N0M1Mi4zNjI1IDgxLjY0MjMgNTEuNzAyNSA4MS4wMDk3IDUxLjAyOTYgODAuNDU1N0M1MC4zNTY2IDc5LjkwMTYgNDkuNjY2MyA3OS40NTg0IDQ4Ljg2MzEgNzkuMjMyMkM0OC4wNTk5IDc5LjAwNTkgNDcuMjU2NyA3OC43MDU4IDQ2LjQ4ODMgNzguMzQxMUM0My4zNzEgNzYuODU5IDQwLjcwOTYgNzQuNDAyNyAzOC43MDM3IDcxLjQ4NDdDMzYuNjk3OSA2OC41NjY4IDM1LjMxNzMgNjUuMjcwMiAzNC43MjY4IDYxLjc1NjZDMzQuNTkyMiA2MC45NTc4IDM0LjUwOTcgNjAuMTQ5OSAzNC40NzUgNTkuMzQxOUMzNC40NDg5IDU4Ljc1MDkgMzMuNTgwNiA1OC43NDYzIDMzLjYwNjcgNTkuMzQxOVY1OS4zNTU3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTYxLjIwMTkgNzUuMzcxNkM2MC40MDMxIDcxLjA0NTUgNTguMTMyNCA2Ny4yNjg3IDU1LjY4ODEgNjMuNzg3NUM1NC42MDI3IDYyLjI0MDcgNTMuMzgyNyA2MC43OTEgNTIuNDIzMiA1OS4xNDI3QzUyLjMwNiA1OC45Mzk1IDUyLjE4ODcgNTguNzMxOCA1Mi4wODQ1IDU4LjUxOTRDNTEuOTg5IDU4LjMzNDcgNTEuODUwMSA1OC4xMjIzIDUxLjgxNTQgNTcuOTA5OUM1MS43NjMzIDU3LjYwNTIgNTIuMDAyIDU3LjM2OTcgNTIuMjc1NiA1Ny4zODM2QzUyLjgwMDkgNTcuNDExMyA1My4zMjYyIDU3LjUzNiA1My44NTE2IDU3LjU3MjlDNTQuMzc2OSA1Ny42MDk4IDU0Ljg3MTkgNTcuNjI4MyA1NS4zODQyIDU3LjYxOTFDNTkuMTQ0IDU3LjU0OTggNjIuNjM0NyA1Ni4wNzIzIDY1Ljg5NTIgNTQuMTg0QzY2LjY4NTQgNTMuNzI2OSA2Ny40NjY5IDUzLjI0NjcgNjguMjQ4NCA1Mi43NzEyQzY4LjQzNTEgNTIuNjU1NyA2OC42MjYxIDUyLjU0MDMgNjguODEyOCA1Mi40MjQ5QzY4LjkyMTQgNTIuMzYwMiA2OS4wMjU2IDUyLjMwOTQgNjkuMTI5OCA1Mi40MTFDNjkuMjI1MyA1Mi41MDM0IDY5LjE5NDkgNTIuNjMyNiA2OS4xNzc1IDUyLjc1MjdDNjkuMTQ3MSA1My4wMTEyIDY5LjExNjcgNTMuMjY5OCA2OS4wODYzIDUzLjUyODRDNjguODY0OSA1NS41NTUyIDY4LjczNDcgNTcuNTkxNCA2OC42NzgyIDU5LjYyNzVDNjguNTY5NyA2My43NTk3IDY4LjcyMTYgNjcuOTUyIDY5LjQ1MSA3Mi4wMTk3QzY5LjUyOTIgNzIuNDU4MyA2OS42MTYgNzIuODkyMyA2OS43MTE1IDczLjMyMTdDNjkuODM3NCA3My44OTg4IDcwLjY3NTQgNzMuNjU0MSA3MC41NDk1IDczLjA3N0M2OS42NTUxIDY4Ljk5NTUgNjkuNDY0MSA2NC43MjkzIDY5LjUyOTIgNjAuNTUwOUM2OS41NTk2IDU4LjQxMzIgNjkuNjc2OCA1Ni4yNzA5IDY5Ljg4OTUgNTQuMTQyNEM2OS45MzczIDUzLjY0ODQgNzAuMDE5OCA1My4xNTkgNzAuMDU0NSA1Mi42NjVDNzAuMDg5MiA1Mi4xOTg2IDY5Ljg1MDUgNTEuNzQxNiA2OS40NTEgNTEuNTM4NEM2OC45Nzc4IDUxLjI5ODMgNjguNTc0IDUxLjQ5NjggNjguMTYxNiA1MS43NTA4QzY3Ljc0OTEgNTIuMDA0NyA2Ny4zNTg0IDUyLjI0NDggNjYuOTU4OSA1Mi40ODk1QzYzLjY5ODQgNTQuNDc0OCA2MC4yNjQyIDU2LjMwMzIgNTYuNDYwOSA1Ni42MzU2QzU1LjQxODkgNTYuNzI4IDU0LjM2ODIgNTYuNzE0MSA1My4zMjYyIDU2LjU5ODdDNTIuODQ4NyA1Ni41NDc5IDUyLjI4ODYgNTYuMzQ5NCA1MS44MTk3IDU2LjUyNDhDNTEuNDA3MiA1Ni42NzcyIDUxLjA3MjkgNTcuMDU1OCA1MC45Nzc0IDU3LjUwODNDNTAuODY4OSA1OC4wMjA3IDUxLjA3MjkgNTguNDU5NCA1MS4yOTQ0IDU4LjkwMjZDNTEuNTE1OCA1OS4zNDU4IDUxLjc4MDYgNTkuNzk4MyA1Mi4wNTQxIDYwLjIyMzFDNTIuNjA5OSA2MS4wOTU3IDUzLjIyNjQgNjEuOTI2OCA1My44NDcyIDYyLjc0ODZDNTYuMzY5NyA2Ni4xMTQ0IDU4Ljg0NDQgNjkuNzg1IDU5Ljk5MDYgNzMuOTYzNEM2MC4xMzgyIDc0LjUwMzYgNjAuMjY0MiA3NS4wNTMxIDYwLjM2NCA3NS42MDcxQzYwLjQ3MjYgNzYuMTg4OSA2MS4zMTA1IDc1Ljk0NDIgNjEuMjAxOSA3NS4zNjI0Vjc1LjM3MTZaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMzguMTQ0NSA5Mi40NDk4QzM5LjIyOTkgOTEuNTM1NiAzOS4xNzc4IDg5Ljc0ODggMzguMDk2OCA4OC44NjY5QzM2Ljg5NDEgODcuODgzNSAzNS40NTI3IDg4LjYzNjEgMzQuNDc1OSA4OS41NzhDMzMuOTExNSA5MC4xMjI4IDMzLjQwNzggOTAuNzQ2MSAzMi44ODY4IDkxLjMzNzFMMzEuMTg0OSA5My4yNzYyQzMwLjY0NjUgOTMuODg1NyAzMC4wNDMxIDk0LjQ3NjcgMjkuNTc0MiA5NS4xNDYxQzI5LjIzOTkgOTUuNjE3MSAyOC45NzUgOTYuMzIzNSAyOS4zMzU0IDk2Ljg1OTFDMjkuODczNyA5Ny42NTc4IDMwLjg4MSA5Ny4xMTMgMzEuNTI3OSA5Ni44MTI5QzMyLjMwOTQgOTYuNDUyOCAzMy4wNTYxIDk2LjAxODggMzMuNzY4MiA5NS41MjQ3QzM0LjIzMjcgOTUuMjAxNSAzMy43OTg2IDk0LjQwMjggMzMuMzI5NyA5NC43MjZDMzIuODA4NyA5NS4wODYxIDMyLjI3MDMgOTUuNDE4NSAzMS43MTQ2IDk1LjcwOTRDMzEuNDU0MSA5NS44NDMzIDMxLjE5MzYgOTUuOTcyNiAzMC45MjQ0IDk2LjA5MjZDMzAuNjk4NiA5Ni4xOTQyIDMwLjM5OTEgOTYuMzY5NyAzMC4xNDczIDk2LjM2MDRDMjkuODE3MyA5Ni4zNDY2IDMwLjI1NTggOTUuNzA0OCAzMC4zNDcgOTUuNTg5NEMzMC43NzI1IDk1LjA2MyAzMS4yNDE0IDk0LjU2OSAzMS42ODg1IDk0LjA2MTFDMzIuNjEzMyA5My4wMDg0IDMzLjUzMzcgOTEuOTUxMSAzNC40NjI4IDkwLjg5ODRDMzUuMDg4IDkwLjE4NzQgMzUuOTk1NCA4OS4xNTc4IDM3LjAxNTcgODkuMzQyNUMzNy41MTA3IDg5LjQzMDIgMzcuOTE4OCA4OS44NDExIDM4LjA0NDcgOTAuMzUzNkMzOC4xNzkzIDkwLjkwNzcgMzcuOTM2MSA5MS40NTcxIDM3LjUzMjQgOTEuNzk4OEMzNy4zNSA5MS45NTU3IDM3LjM4MDQgOTIuMjg4MiAzNy41MzI0IDkyLjQ0OThDMzcuNzE0NyA5Mi42NDM3IDM3Ljk2MjIgOTIuNjA2OCAzOC4xNDQ1IDkyLjQ0OThWOTIuNDQ5OFoiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0xMDEuMDYzIDY4Ljg3NTVDMTAwLjYwNyA2OC45MzU1IDk5LjU3MzYgNjkuMDY0OCA5OS4zNTY1IDY4LjQ2NDVDOTkuMjMwNiA2OC4xMTM2IDk5LjUyNTkgNjcuNzgxMiA5OS43NjQ3IDY3LjU4MjdDMTAwLjEyOSA2Ny4yODI2IDEwMC41OSA2Ny4xMjU2IDEwMS4wMjggNjYuOTk2M0MxMDIuMDM1IDY2LjcwMDggMTAzLjA4NiA2Ni42NSAxMDQuMTI4IDY2LjY1QzEwNS4xNyA2Ni42NSAxMDYuMTg2IDY2LjY2MzkgMTA3LjIwNiA2Ni43NjA4QzEwOC4zMjYgNjYuODY3IDEwOS40NDIgNjcuMTIxIDExMC40MjggNjcuNzIxMkwxMTAuMzQxIDY2Ljk5NjNDMTA5LjA5NSA2OC4xNzgzIDEwNy40OCA2OC44ODQ3IDEwNS44MTMgNjguOTc3QzEwNS4yNTcgNjkuMDA5NCAxMDUuMjUyIDY5LjkzMjggMTA1LjgxMyA2OS45MDA0QzEwNy43MTggNjkuNzk0MyAxMDkuNTI5IDY5LjAwMDEgMTEwLjk1MyA2Ny42NDczQzExMS4xNjEgNjcuNDQ4OCAxMTEuMDk2IDY3LjA2NTYgMTEwLjg2NiA2Ni45MjI0QzEwOC43OTEgNjUuNjUyOCAxMDYuMjA4IDY1LjcwODIgMTAzLjg4NSA2NS43MjY2QzEwMi42NjEgNjUuNzM1OSAxMDEuNDA2IDY1LjgzNzQgMTAwLjI1MSA2Ni4yOTQ1Qzk5LjM1MjIgNjYuNjUgOTguMTUzOSA2Ny40OTUgOTguNTE4NiA2OC43MDQ2Qzk4Ljg1MjkgNjkuODE3MyAxMDAuMTQyIDY5LjkxODkgMTAxLjA2MyA2OS43OTg5QzEwMS4yOTcgNjkuNzY2NiAxMDEuNDk3IDY5LjYwOTYgMTAxLjQ5NyA2OS4zMzcyQzEwMS40OTcgNjkuMTEwOSAxMDEuMjk3IDY4Ljg0MzEgMTAxLjA2MyA2OC44NzU1VjY4Ljg3NTVaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNOTAuNDY4OSAyOC4xNTg3Qzg5LjU1NzEgMjguMDk4NyA4OC4xMjQ0IDI4LjY4NSA4Ny42NTEyIDI3LjUxMjNDODcuMjM4NyAyNi40OTE5IDg3Ljg1OTYgMjUuNDYyMyA4OC40NzYxIDI0LjcxNDRDODkuMjc0OSAyMy43NTQgOTAuMTM0NiAyMi44MzA2IDkxLjAxNTkgMjEuOTU4QzkxLjg5NzMgMjEuMDg1NCA5Mi44Mzk0IDIwLjI3NzQgOTMuODkwMSAxOS42NDQ5Qzk1LjA0NSAxOC45NTY5IDk2LjMyMTQgMTguNDkwNiA5Ny42NDk5IDE4LjQzOThMOTcuMjMzMSAxNy44NTM0Qzk2LjQyMTMgMjAuODA4NCA5NC45NDk0IDIzLjUyMzIgOTIuOTUyMyAyNS43NDg2QzkyLjU2NTkgMjYuMTc4IDkzLjE3ODEgMjYuODMzNiA5My41NjQ1IDI2LjM5OTZDOTUuNjY1OCAyNC4wNTg4IDk3LjIxNTggMjEuMjAwOCA5OC4wNzExIDE4LjA5MzVDOTguMTQ5MiAxNy44MTE5IDk3LjkzMjEgMTcuNDk3OSA5Ny42NTQzIDE3LjUwNzJDOTQuODg4NyAxNy42MDg3IDkyLjQ5MjEgMTkuMjQzMiA5MC41MTIzIDIxLjE4N0M5MC4wMDQzIDIxLjY4NTYgODkuNTE4MSAyMi4yMDI3IDg5LjA0MDUgMjIuNzMzN0M4OC41NjI5IDIzLjI2NDYgODguMDY4IDIzLjc3NzEgODcuNjMzOCAyNC4zNDVDODYuOTAwMSAyNS4zMSA4Ni4zNzA0IDI2LjU1NjYgODYuODM1IDI3Ljc4OTNDODcuMDgyNCAyOC40NDUgODcuNTgxNyAyOC45NTI4IDg4LjI0MTYgMjkuMDk2Qzg4Ljk4NDEgMjkuMjU3NiA4OS43MjY1IDI5LjAyNjcgOTAuNDczMiAyOS4wNzI5QzkxLjAzMzMgMjkuMTA5OCA5MS4wMjkgMjguMTg2NCA5MC40NzMyIDI4LjE0OTVMOTAuNDY4OSAyOC4xNTg3WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTE2LjI3OTggNDEuMjcwOEMxMy45MzUzIDQwLjIxMzUgMTEuMzYwNyAzOS45MjczIDguODY0MjcgNDAuNDY3NUM4LjU2MDM1IDQwLjUzMjEgOC40MjE0MiA0MS4wMjYxIDguNjczMjMgNDEuMjM4NUMxMC41NjE4IDQyLjg2ODMgMTIuNjcxOSA0NC4xNzUgMTQuOTQyNSA0NS4xMDc2QzE2LjEzNjUgNDUuNTk3IDE3LjM4MjUgNDYuMDEyNiAxOC42NTkgNDYuMTY5NUMxOS43NzkxIDQ2LjMwOCAyMS4wNjg2IDQ1Ljk4OTUgMjEuNTI0NCA0NC43NTY3QzIxLjk4MDMgNDMuNTI0IDIwLjgyNTQgNDIuMTYxOSAxOS42NTMyIDQyLjc1MjlDMTkuMTQ5NiA0My4wMDY4IDE5LjU4ODEgNDMuODA1NiAyMC4wOTE3IDQzLjU1MTdDMjAuMzQzNSA0My40MjI0IDIwLjY1NjEgNDMuNzEzMyAyMC43NDI5IDQzLjk1MzNDMjAuODY0NSA0NC4yOTA0IDIwLjY0MzEgNDQuNjU5OCAyMC40MTczIDQ0Ljg4MTRDMTkuNzA1MyA0NS41NjAxIDE4LjUzMzEgNDUuMjYgMTcuNzAzOCA0NS4wNjE0QzE1LjczMjcgNDQuNTg1OSAxMy44MzExIDQzLjcxMzMgMTIuMDg1NyA0Mi42Mzc1QzExLjEwODkgNDIuMDMyNiAxMC4xNzExIDQxLjM0OTMgOS4yOTQwOSA0MC41OTIxTDkuMTAzMDUgNDEuMzYzMkMxMS4zNDc3IDQwLjg3MzggMTMuNzM1NiA0MS4xMTg1IDE1Ljg0OTkgNDIuMDc0MkMxNi4wNjcgNDIuMTcxMiAxNi4zMTQ1IDQyLjE0MzUgMTYuNDQ0NyA0MS45MDhDMTYuNTUzMyA0MS43MTQxIDE2LjUwNTUgNDEuMzcyNCAxNi4yODg0IDQxLjI3NTVMMTYuMjc5OCA0MS4yNzA4WiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8xXzQiPgo8cmVjdCB3aWR0aD0iMTAzLjM3OCIgaGVpZ2h0PSI4NSIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDggMTcuNTAyKSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMSIgdmlld0JveD0iMCAwIDEyMCAxMjEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF82NTQzNV8zNjU2MzYiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIxIj4KPHJlY3QgeT0iMC4zMjk1OSIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIHJ4PSIyNCIgZmlsbD0id2hpdGUiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzY1NDM1XzM2NTYzNikiPgo8cGF0aCBkPSJNNjAuOTcyMiAzNi4wMDYzQzYxLjQ3MTggMzcuNzgyOSA2My4xNTgyIDM5LjMzMDQgNjUuMTg4MyAzOS45MDhDNjguMDQyIDQwLjcxOTcgNzAuOTkyMyAzOS40MTUyIDczLjg0ODQgMzguNzE2MUM3Ni4yNjg2IDM4LjEyNDYgNzguOTM2IDM3Ljk3ODYgODEuMzA1OCAzOC43ODc2QzgzLjY3NTcgMzkuNTk2NiA4NS42NTU3IDQxLjQ5NzMgODUuODA4MSA0My42NjU1Qzg1LjkxNzUgNDUuMjQ4IDg1LjA2NTMgNDYuNzc3NyA4My44MzMxIDQ3LjkzNDRDODIuNjAwOSA0OS4wOTEgODEuMDExOCA0OS45MjE3IDc5LjM5OTUgNTAuNjY4OUM3Ni41NjgyIDUxLjk4NDIgNzMuNTk3NCA1My4wOTM4IDcwLjg1OTkgNTQuNTQ1NkM2OC4xMjI0IDU1Ljk5NzMgNjUuNTc3NiA1Ny44MzgzIDY0LjAzMDkgNjAuMjYwNEM2Mi40ODQxIDYyLjY4MjYgNjEuMDg5OSA3Mi4yOTA3IDcwLjIzOTQgNzIuOTQ1MkM3My4xNDk4IDczLjE1MzQgNzYuODM1OSA3Mi4zMDQzIDc4LjcxOCA3MC40MzE4QzgwLjA5ODggNjkuMDU4MyA4MC4xMjcyIDY3LjAzOTUgODAuOTUyNyA2NS4zNjQ1QzgyLjA1MiA2My4xMzU3IDg0LjUwODMgNjEuNjM2NSA4Ny4wMjU5IDYwLjU0MjNDODkuNTQzNSA1OS40NDggOTIuMjUzOCA1OC42MzE1IDk0LjUyNDIgNTcuMjAzMkM5Ni4yMzE5IDU2LjEyODQgOTcuNjM1IDU0Ljc0MDUgOTguOTQwMiA1My4zMDkyQzEwMC41MzEgNTEuNTY4MyAxMDIuMDMgNDkuNjk4IDEwMi42OCA0Ny41NDYyQzEwMy43MTcgNDQuMTEzNyAxMDIuNTMzIDM4LjkxNzkgMTAwLjQ5OSAzNS43NzA4Qzk2LjY5MzkgMjkuODg2OSA4Ny43MDMxIDIxLjkzNDQgNjkuNjYwMiAyNS44MjMxQzY2LjMzNzUgMjYuNTM4OSA1OC45NjIzIDI4Ljg2OTUgNjAuOTcyMiAzNi4wMDYzWiIgZmlsbD0iI0ZCNzE4NSIvPgo8cGF0aCBkPSJNNTguMDQ2IDM3LjAyNEM1OC40Njk5IDM4LjQ4NTcgNTkuNTk0MiAzOS43ODgxIDYxLjA4NjcgNDAuNTkzNUM2Mi44MDQ1IDQxLjUxOTcgNjQuNzc0MSA0MS42MDgyIDY2LjY4NjEgNDEuMjQyMUM2OC43NDA5IDQwLjg0OTggNzAuNjYxMiA0MC4wNzIzIDcyLjczMzcgMzkuNzI5Qzc0LjgwNjMgMzkuMzg1NyA3Ni45MjM3IDM5LjQxNjYgNzguODYwOSA0MC4xNEM4MC4zOTE1IDQwLjcxMTUgODEuNzI3NCA0MS43Njk2IDgyLjQyMDMgNDMuMDc5OUM4My4yMDQxIDQ0LjU2NzMgODIuOTA0NiA0Ni4yMTQgODEuOTU2NyA0Ny41NTkzQzgwLjkxNjkgNDkuMDM0NyA3OS4yNTUzIDUwLjA2MDQgNzcuNTQwMSA1MC45MDcyQzc1LjY3MDYgNTEuODI5MyA3My43MDk2IDUyLjYxNzUgNzEuNzkgNTMuNDU4N0M2OC4yNTU0IDU1LjAxMDUgNjQuNzE3MiA1Ni43OTg2IDYyLjI4MjYgNTkuNTQ2NEM2MS42MTM4IDYwLjMwMTkgNjEuMDE4MSA2MS4xMTQ5IDYwLjY3MDcgNjIuMDIzQzYwLjM5ODUgNjIuNzM4NiA2MC4yMjIxIDYzLjQ4ODMgNjAuMTA5NiA2NC4yMzgxQzU5Ljg0MiA2NS45OTYyIDU5LjkxNzIgNjcuODY5OSA2MC41OTIgNjkuNTc3MUM2MS4zMjEgNzEuNDIwMiA2Mi43ODUyIDcyLjk0OTUgNjQuOTIwMiA3My42OTYxQzY2LjI2OTIgNzQuMTY4MSA2Ny43NTU5IDc0LjMxNTQgNjkuMTg4NCA3NC4yNTRDNzAuOTE0NSA3NC4xNzk1IDcyLjY1MDQgNzMuODIxMyA3NC4xNzMxIDczLjEzNkM3NC45MTI0IDcyLjgwNDMgNzUuNjE1MSA3Mi4zOTAzIDc2LjE5NzEgNzEuODc5Qzc2LjgzMDMgNzEuMzIxMiA3Ny4yNzE1IDcwLjY2MSA3Ny41Nzk1IDY5LjkyOThDNzguMjAyIDY4LjQ0OTYgNzguMzY4MSA2Ni44NDU4IDc5LjM3NzIgNjUuNTAwM0M4MS40NjY1IDYyLjcwOTYgODUuMzUyMyA2MS41NjA4IDg4LjY4NSA2MC4xOTAzQzkwLjUzMjIgNTkuNDMwNCA5Mi4yNzE4IDU4LjUzOTkgOTMuNzYzIDU3LjMzMzVDOTUuMjU0MSA1Ni4xMjcxIDk2LjU3MzggNTQuNzE1IDk3Ljc3NTcgNTMuMjc4NkM5OC45Nzc1IDUxLjg0MjIgMTAwLjAwNyA1MC4zMjI5IDEwMC41MjEgNDguNjE4OEMxMDAuOTQ0IDQ3LjIxNTQgMTAwLjk4OSA0NS43NDM5IDEwMC44NjIgNDQuMjk0NEMxMDAuNjE0IDQxLjQ1OTQgOTkuNjkzNSAzOC41Nzg2IDk4LjAwMjYgMzYuMDk3OEM5Ni45MTA0IDM0LjQ5NzMgOTUuNjA2MyAzMi45OTc3IDk0LjA5ODQgMzEuNjY3OEM5Mi4zNDA0IDMwLjExNzUgOTAuMzEzNSAyOC43OTM3IDg4LjA4MjUgMjcuNzkyMUM4NS40MzEyIDI2LjYwOCA4Mi41NTU2IDI1Ljg3ODkgNzkuNjE0NiAyNS41Nzc1Qzc1LjkwODEgMjUuMTk2MyA3Mi4xNDU5IDI1LjQ3NzkgNjguNTMxNCAyNi4xNDU1QzY2LjMwNzggMjYuNTU1NCA2NC4xMDU3IDI3LjExMDEgNjIuMTcyMiAyOC4xNDM4QzYwLjA1NjMgMjkuMjczNiA1OC4zODI4IDMwLjk0NDggNTcuODc3MiAzMy4wOTFDNTcuNTcwOSAzNC4zODg5IDU3LjY4NyAzNS43MzA4IDU4LjA0NiAzNy4wMjRDNTguMTY0MSAzNy40NTExIDU4Ljk0NDIgMzcuMzI5NCA1OC44MjM3IDM2Ljg5NzZDNTguNDc1MyAzNS42NDE1IDU4LjM0NzMgMzQuMzE3IDU4LjY5NTggMzMuMDYwOEM1OC45NzkzIDMyLjA0MTEgNTkuNTQ4NCAzMS4xMTkyIDYwLjM0MTggMzAuMzMxN0M2MS43MzY4IDI4Ljk0NTUgNjMuNzMzOCAyOC4wNjQzIDY1LjczODQgMjcuNDgxOEM2Ni44OTI5IDI3LjE0NTYgNjguMjI3OSAyNi44ODg0IDY5LjQ3MTcgMjYuNjc5M0M3MS4zNDI3IDI2LjM2NDggNzMuMjQ2IDI2LjE1NTEgNzUuMTU5MyAyNi4xMDMxQzc4LjI5NTggMjYuMDE1NyA4MS40Njk4IDI2LjMzMTUgODQuNDczNCAyNy4yMDRDODYuOTQ1NSAyNy45MjI0IDg5LjI1ODEgMjkuMDA5NSA5MS4zMDg3IDMwLjQxQzkzLjA2NTMgMzEuNjA5OCA5NC42MDg5IDMzLjAzNTUgOTUuOTIyIDM0LjU5NUM5Ni40OTA0IDM1LjI3MDUgOTcuMDA3IDM1Ljk2MjkgOTcuNDg4OCAzNi42OTZDOTguMjc3NiAzNy44OTI1IDk4Ljg1MjYgMzkuMTc2MSA5OS4yNzYzIDQwLjQ5NDRDMTAwLjE3OSA0My4zMTQ5IDEwMC42MTEgNDYuNTE4IDk5LjQ0MDcgNDkuMjg3OUM5OC43NTQ1IDUwLjkxMzcgOTcuNjEzNCA1Mi4zNTY3IDk2LjM5NTkgNTMuNzE0N0M5NS4xNzg0IDU1LjA3MjYgOTMuODY1NCA1Ni40MjgzIDkyLjI5NDYgNTcuNTIyQzg5LjI0NTUgNTkuNjQ1NSA4NS4yODgyIDYwLjQ1NyA4Mi4wNDUgNjIuMzIwOUM4MC41ODI4IDYzLjE2MyA3OS4yMzQ3IDY0LjIyOTQgNzguMzkzMyA2NS41NzMzQzc3LjU1MTggNjYuOTE3MSA3Ny4zODA1IDY4LjU1NyA3Ni42ODMzIDcwLjAwMjJDNzYuMDM2MiA3MS4zNDQxIDc0LjY4MzEgNzIuMjIxMyA3My4xNjM2IDcyLjc4ODRDNzEuNjQ0IDczLjM1NTYgNjkuOTUxNCA3My42MzA1IDY4LjI4NjkgNzMuNTg4OEM2NS45Mjk2IDczLjUyOTQgNjMuNjI4IDcyLjc2ODUgNjIuMjYzOSA3MS4wMzAyQzYxLjEzNjIgNjkuNTkxIDYwLjc1NjkgNjcuNzY4NCA2MC43NTg3IDY2LjA4MjJDNjAuNzU5NSA2NC41OTQgNjAuOTcxMyA2My4xMyA2MS42MjQ5IDYxLjc3MjdDNjEuNjUzIDYxLjcxNTUgNjEuNjgxIDYxLjY1ODQgNjEuNzExNiA2MS42MDM3QzYxLjcyMzkgNjEuNTc5NSA2MS43MzkxIDYxLjU1MzMgNjEuNzUxNSA2MS41MjkyQzYxLjc1NzggNjEuNTE2IDYxLjc2NjggNjEuNTAwNyA2MS43NzU4IDYxLjQ4NzdDNjEuODA2NSA2MS40MzA3IDYxLjc0ODUgNjEuNTMzNSA2MS43Njk4IDYxLjQ5NjNDNjEuOTM4NyA2MS4yMTk0IDYyLjEyODMgNjAuOTUwOCA2Mi4zMjUzIDYwLjY4OTVDNjIuODM5NyA2MC4wMDk1IDYzLjQzMzEgNTkuMzc2MSA2NC4wODk1IDU4Ljc5MjdDNjUuMzkxIDU3LjYzNDIgNjYuOTA1NyA1Ni42NTQ4IDY4LjUwMTEgNTUuODA4NkM3MC4zMTc4IDU0Ljg0NjIgNzIuMjM1NCA1NC4wMzIyIDc0LjE0NTQgNTMuMjEzMUM3Ni4wNTU0IDUyLjM5MzkgNzcuODM3NSA1MS42NTIxIDc5LjUxODggNTAuNjQ4MkM4MS4xMTM5IDQ5LjY5NzMgODIuNTEzOCA0OC40NjM5IDgzLjIyODQgNDYuODg4QzgzLjg4NjEgNDUuNDM3NiA4My44MDMxIDQzLjgyMDUgODIuOTE2OCA0Mi40MjU5QzgyLjA5NzIgNDEuMTQwNyA4MC43NDIxIDQwLjEyNjcgNzkuMTkyMSAzOS41Mjg4Qzc3LjMwMyAzOC44MDIgNzUuMTU1MSAzOC43MTQ0IDczLjE1NTEgMzguOTc0MUM3MS4xNTUxIDM5LjIzMzggNjkuMjE0NSAzOS45NTk3IDY3LjIyNjQgNDAuNDIyOEM2NS4zOTI2IDQwLjg0OTIgNjMuNDMyNiA0MC45OTU3IDYxLjcwMjggNDAuMTI1NkM2MC4zMDE1IDM5LjQyIDU5LjIxODMgMzguMjUwMiA1OC44MjM3IDM2Ljg5NzZDNTguNzAwMSAzNi40NzIzIDU3LjkyIDM2LjU5NCA1OC4wNDYgMzcuMDI0WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTY0Ljk3ODggOTIuMzM2MUM3MC4xMDUyIDkxLjMwMzEgNzMuMzQ1IDg2LjUyNDEgNzIuMjE1MSA4MS42NjE4QzcxLjA4NTIgNzYuNzk5NiA2Ni4wMTM0IDczLjY5NTMgNjAuODg3IDc0LjcyODNDNTUuNzYwNiA3NS43NjEyIDUyLjUyMDggODAuNTQwMyA1My42NTA3IDg1LjQwMjVDNTQuNzgwNiA5MC4yNjQ4IDU5Ljg1MjQgOTMuMzY5IDY0Ljk3ODggOTIuMzM2MVoiIGZpbGw9IiNGQjcxODUiLz4KPHBhdGggZD0iTTYwLjI2MzIgOTIuOTU2OEM2NS40OTY4IDkzLjMzMTggNzAuMDE4NCA4OS43NTYgNzAuMzYyNSA4NC45NzAxQzcwLjcwNjcgODAuMTg0MyA2Ni43NDMgNzYuMDAwNiA2MS41MDk0IDc1LjYyNTdDNTYuMjc1OSA3NS4yNTA3IDUxLjc1NDIgNzguODI2NSA1MS40MTAxIDgzLjYxMjRDNTEuMDY1OSA4OC4zOTgyIDU1LjAyOTYgOTIuNTgxOSA2MC4yNjMyIDkyLjk1NjhaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+CjxwYXRoIGQ9Ik0zNS40MDEgNzcuMzgyMkMzOC44MDUzIDc2LjcyNTggNDAuOTk4MiA3My4yNjUyIDQwLjI5OSA2OS42NTI4QzM5LjU5OTkgNjYuMDQwNCAzNi4yNzMzIDYzLjY0NDIgMzIuODY5IDY0LjMwMDZDMjkuNDY0NyA2NC45NTcxIDI3LjI3MTggNjguNDE3NyAyNy45NzA5IDcyLjAzMDFDMjguNjcwMSA3NS42NDI0IDMxLjk5NjcgNzguMDM4NyAzNS40MDEgNzcuMzgyMloiIGZpbGw9IiM0QURFODAiLz4KPHBhdGggZD0iTTM1LjQyMzkgNjAuNjA4NEMzOC44MjgyIDU5Ljk1MiAzNC4yODUyIDMxLjkxODkgMzEuOTI3OSAyNy43NTI3QzMxLjIyODcgMjQuMTQwMyAyNC43NDI2IDI3LjI0MjYgMjEuMzM4MyAyNy44OTkxQzE2LjkzNjcgMzIuODk0NiAyNS40NTM5IDU3Ljc5MTggMjcuNzA1MSA2MC43OTM2QzI4LjEyNTEgNjIuOTYzNyAzMi4wMTk2IDYxLjI2NDkgMzUuNDIzOSA2MC42MDg0WiIgZmlsbD0iIzRBREU4MCIvPgo8cGF0aCBkPSJNMzQuMTk2NyA2MC4zMzAxQzM3LjYwMSA1OS42NzM2IDMzLjA1OCAzMS42NDA1IDMwLjcwMDcgMjcuNDc0NEMzMC4wMDE1IDIzLjg2MiAyMy41MTU1IDI2Ljk2NDMgMjAuMTExMiAyNy42MjA3QzE1LjcwOTUgMzIuNjE2MyAyNC4yMjY4IDU3LjUxMzUgMjYuNDc4IDYwLjUxNTNDMjYuODk3OSA2Mi42ODU0IDMwLjc5MjQgNjAuOTg2NiAzNC4xOTY3IDYwLjMzMDFaIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIi8+CjxwYXRoIGQ9Ik0zNC4xNzM5IDc3LjEwMzRDMzcuNTc4MiA3Ni40NDcgMzkuNzcxMiA3Mi45ODY0IDM5LjA3MiA2OS4zNzRDMzguMzcyOCA2NS43NjE2IDM1LjA0NjMgNjMuMzY1MyAzMS42NDIgNjQuMDIxOEMyOC4yMzc2IDY0LjY3ODMgMjYuMDQ0NyA2OC4xMzg5IDI2Ljc0MzkgNzEuNzUxM0MyNy40NDMxIDc1LjM2MzYgMzAuNzY5NiA3Ny43NTk5IDM0LjE3MzkgNzcuMTAzNFoiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiLz4KPC9nPgo8L3N2Zz4K", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMSIgdmlld0JveD0iMCAwIDEyMCAxMjEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik04Ni40Mzk1IDY3Ljc5NzdMODkuMDc5OCA2Ny43MjEyQzExOCA2Ny4xMSAxMDguMzYgMTQuMjM4OCA3Ny40MTMzIDI4LjIyMDZDNTQuNTcxNyAzOC41MzUgNTguODA4NSA4NS45ODE0IDgzLjI0NjUgOTMuNzc0NkM5NC4wNTMzIDk3LjIxMjcgMTA2LjA4OCA5NC43Njc4IDk3LjEyMzQgOTAuOTQ3NkM4OS40NDgyIDg3LjczODcgODMuMjQ2NSA3OC40OTQyIDgzLjY3NjQgNzAuOTMwM0M4My43OTkyIDY5LjI0OTQgODQuOTY1OCA2Ny43OTc3IDg2LjQzOTUgNjcuNzk3N1oiIGZpbGw9IiMzQjgyRjYiLz4KPHBhdGggZD0iTTg2LjQzOTUgNjcuNzk3N0w4OS4wNzk4IDY3LjcyMTJDMTE4IDY3LjExIDEwOC4zNiAxNC4yMzg4IDc3LjQxMzMgMjguMjIwNkM1NC41NzE3IDM4LjUzNSA1OC44MDg1IDg1Ljk4MTQgODMuMjQ2NSA5My43NzQ2Qzk0LjA1MzMgOTcuMjEyNyAxMDYuMDg4IDk0Ljc2NzggOTcuMTIzNCA5MC45NDc2Qzg5LjQ0ODIgODcuNzM4NyA4My4yNDY1IDc4LjQ5NDIgODMuNjc2NCA3MC45MzAzQzgzLjc5OTIgNjkuMjQ5NCA4NC45NjU4IDY3Ljc5NzcgODYuNDM5NSA2Ny43OTc3WiIgc3Ryb2tlPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yOC4wNjc4IDI3Ljc2MDZDLTAuNTg1NzEyIDM5LjkxNTEgMTEuMDUyOCA5My4wMDM4IDQyLjg2OSA5NS4zMDlDNTEuMTU1MSA5NS45Mzc2IDUzLjMwNTcgOTMuNzcyMiA0Ny4wNDM3IDkxLjE4NzZDNDAuOTcxNCA4OC42NzI5IDMzLjMxNzggNzYuNzk3OCAzMi40OTU1IDY4Ljc2NDdDMzIuMzA1OCA2Ny4xNTggMzMuNDQ0MiA2NS44MzA3IDM0Ljg5OSA2NS44MzA3SDM0LjlDNDMuMjQ4NyA2NS44MzA3IDQ2LjcyNzYgNjUuODMwNyA1MS41OTc5IDU4LjQyNjVDNjMuNTUyNyA0MC4xMjQ5IDQ3LjY3NjIgMTkuNDQ4IDI4LjA2NzggMjcuNzYwNloiIGZpbGw9IiMzQjgyRjYiLz4KPHBhdGggZD0iTTI4LjA2NzggMjcuNzYwNkMtMC41ODU3MTIgMzkuOTE1MSAxMS4wNTI4IDkzLjAwMzggNDIuODY5IDk1LjMwOUM1MS4xNTUxIDk1LjkzNzYgNTMuMzA1NyA5My43NzIyIDQ3LjA0MzcgOTEuMTg3NkM0MC45NzE0IDg4LjY3MjkgMzMuMzE3OCA3Ni43OTc4IDMyLjQ5NTUgNjguNzY0N0MzMi4zMDU4IDY3LjE1OCAzMy40NDQyIDY1LjgzMDcgMzQuODk5IDY1LjgzMDdIMzQuOUM0My4yNDg3IDY1LjgzMDcgNDYuNzI3NiA2NS44MzA3IDUxLjU5NzkgNTguNDI2NUM2My41NTI3IDQwLjEyNDkgNDcuNjc2MiAxOS40NDggMjguMDY3OCAyNy43NjA2WiIgc3Ryb2tlPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik00NS45Njc2IDk0LjIxMTdMNDUuOTY1OSA5NC4yMTE2QzMwLjM2MDggOTMuMDgxIDE5LjYxOTQgNzkuNDc4OSAxNi4zNDE0IDY0LjUyMjZDMTMuMDYyNCA0OS41NjEgMTcuMzEyOCAzMy41NjU2IDMxLjMyMzggMjcuNjIyM0M0MC45MjA3IDIzLjU1MzkgNDkuNTQ3OCAyNi41ODQxIDU0LjMzMzIgMzIuODE5QzU5LjEyMzYgMzkuMDYwNSA2MC4xMDY4IDQ4LjU3MjMgNTQuMjQwOCA1Ny41NTM0QzUxLjgzNSA2MS4yMTA3IDQ5LjgyMjUgNjIuOTYzNiA0Ny40NDE2IDYzLjgzNzJDNDUuMDIwOCA2NC43MjU1IDQyLjE2NTEgNjQuNzMyIDM3Ljk1OTggNjQuNzMyQzM2LjE3NDEgNjQuNzMyIDM0Ljg0MDggNjYuMzUxOSAzNS4wNTkzIDY4LjIyMDdDMzUuNDgyNSA3Mi4zNDQ3IDM3LjY0NDIgNzcuMzk2NiA0MC40NDE5IDgxLjcxODZDNDMuMjMxNSA4Ni4wMjggNDYuNzMyMiA4OS43MzM2IDQ5LjkxMzIgOTEuMDUwOUw0OS45MTM3IDkxLjA1MTFDNTEuNDY0MiA5MS42OTExIDUyLjQyNjggOTIuMjgwMiA1Mi45MDM0IDkyLjc2M0M1My4xNDE1IDkzLjAwNDIgNTMuMjEyMyA5My4xNzI3IDUzLjIyNTIgOTMuMjY0M0M1My4yMzM3IDkzLjMyNSA1My4yMjU2IDkzLjM5NTMgNTMuMTIwMiA5My41QzUyLjk5OTIgOTMuNjIwMyA1Mi43Njg4IDkzLjc2MDUgNTIuMzgzNiA5My44OTAyQzUyLjAwNDkgOTQuMDE3NyA1MS41MTA2IDk0LjEyMzkgNTAuODk3NyA5NC4xOTg3QzQ5LjY3MjMgOTQuMzQ4NCA0OC4wMTk0IDk0LjM2NzQgNDUuOTY3NiA5NC4yMTE3WiIgc3Ryb2tlPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik05Mi4wMzEyIDY2LjYyMjdMOTIuMDI3MyA2Ni42MjI4TDg5LjM5MzkgNjYuNjk5MUM4Ny41NjU3IDY2LjcwMzkgODYuMjczNSA2OC40NjQ0IDg2LjEzOTcgNzAuMjk1Mkw4Ni4xMzk3IDcwLjI5NTJMODYuMTM5MiA3MC4zMDMzQzg1LjkxNjQgNzQuMjIzOSA4Ny40MDk3IDc4LjUzMjUgODkuOTA3NCA4Mi4yNTIyQzkyLjQwNjcgODUuOTc0MyA5NS45NDY5IDg5LjE2MDIgOTkuODkxIDkwLjgwOTZDMTAwLjk5MSA5MS4yNzgzIDEwMS43MzIgOTEuNzExMiAxMDIuMTg1IDkyLjA5MTRDMTAyLjY1MyA5Mi40ODQgMTAyLjcyNiA5Mi43NDIgMTAyLjcyIDkyLjg2MDNDMTAyLjcxNCA5Mi45NjY1IDEwMi42MzIgOTMuMTYxMiAxMDIuMjMgOTMuMzk3OUMxMDEuODQgOTMuNjI3NSAxMDEuMjQ2IDkzLjgzNDkgMTAwLjQ2MiA5My45OTQ0Qzk3LjMyMTUgOTQuNjMzMiA5MS42OTg2IDk0LjM5NzkgODYuMzYwMiA5Mi42OTk0Qzc0LjQyMTIgODguODkyIDY3LjMxMSA3NS4zMzYyIDY2LjA2MDEgNjEuMzAwMUM2NC44MDg3IDQ3LjI1NzQgNjkuNDUwOCAzMy4xMDM3IDgwLjU4MTIgMjguMDc3N0w4MC41ODEyIDI4LjA3NzZDODguMTg4OCAyNC42NDA1IDk0LjQxNDMgMjUuMzM0NyA5OS4wNTYgMjguMjMzNUMxMDMuNzIxIDMxLjE0NjcgMTA2Ljg2MiAzNi4zMzQzIDEwOC4xNzIgNDIuMDEyM0MxMDkuNDgxIDQ3LjY5MDcgMTA4Ljk0MiA1My43ODg4IDEwNi4zMzQgNTguNDgzOEMxMDMuNzQxIDYzLjE1MzMgOTkuMDgyNyA2Ni40NzM3IDkyLjAzMTIgNjYuNjIyN1oiIHN0cm9rZT0iIzM3NDE1MSIvPgo8L3N2Zz4K", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMSIgdmlld0JveD0iMCAwIDEyMCAxMjEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF82NTQzNV8zNjU1NTYiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIxIj4KPHJlY3QgeT0iMC41IiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgcng9IjI0IiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfNjU0MzVfMzY1NTU2KSI+CjxwYXRoIGQ9Ik02Ny40NzUxIDE2LjEwMDFDNjUuMzAwMyAxNi4xMDg0IDYzLjIwMzMgMTYuOTE1MyA2MS41NzcgMTguMzcxNUM1OS45NTE1IDE5LjgyNyA1OC45MDgzIDIxLjgzMTEgNTguNjQzNyAyNC4wMDY5TDUzLjczMzYgNjMuNTM4OEw0OC44ODkzIDUyLjM3NjZWNTIuMzc3NEM0OC4xOTczIDUwLjc3MTIgNDcuMDU1MyA0OS40MDMgNDUuNjAzOSA0OC40NDE3QzQ0LjE1MTggNDcuNDc5NyA0Mi40NTM4IDQ2Ljk2NTkgNDAuNzE2MiA0Ni45NjIxSDI3LjMwNDJDMjQuOTM1IDQ2Ljk2MTMgMjIuNjYzMSA0Ny45MDk5IDIwLjk4NzUgNDkuNTk4MkMxOS4zMTI3IDUxLjI4NjUgMTguMzcxIDUzLjU3NjkgMTguMzcxIDU1Ljk2NTFDMTguMzcxIDU4LjM1MjYgMTkuMzEyNiA2MC42NDI5IDIwLjk4NzUgNjIuMzMxM0MyMi42NjMxIDY0LjAyMDQgMjQuOTM1IDY0Ljk2ODIgMjcuMzA0MiA2NC45Njc0SDM0Ljg1MDlMNTAuMzcxOSAxMDAuNzEzQzUxLjQyNTYgMTAzLjEzNiA1My40ODMyIDEwNC45NjggNTUuOTk3OSAxMDUuNzI1QzU4LjUxMjggMTA2LjQ4IDYxLjIzMDIgMTA2LjA4MyA2My40MjgxIDEwNC42MzhDNjUuNjI2IDEwMy4xOTMgNjcuMDgxOSAxMDAuODQ3IDY3LjQwOTMgOTguMjIxN0w3NS4zODQ0IDM0LjEwN0g5NC4yNjY5Qzk2LjYzNiAzNC4xMDcgOTguOTA4IDMzLjE1OTIgMTAwLjU4NCAzMS40NzA5QzEwMi4yNTggMjkuNzgyNSAxMDMuMiAyNy40OTIyIDEwMy4yIDI1LjEwMzlDMTAzLjIgMjIuNzE1NyAxMDIuMjU4IDIwLjQyNTQgMTAwLjU4NCAxOC43MzdDOTguOTA4IDE3LjA0ODcgOTYuNjM2IDE2LjEwMDkgOTQuMjY2OSAxNi4xMDA5TDY3LjQ3NTEgMTYuMTAwMVoiIGZpbGw9IiM4MThDRjgiLz4KPHBhdGggZD0iTTU2LjYxNDQgMjUuNDc3NEw1Ni42MTQzIDI1LjQ3ODFMNTEuNzkwMyA2NC4zMTY1TDUxLjY3NzUgNjUuMjI1Mkw1MS4zMTI5IDY0LjM4NTJMNDYuNTUzNiA1My40MTg4TDQ2LjU1MzQgNTMuNDE4MkM0NS44OTI2IDUxLjg4NDYgNDQuODAyNCA1MC41NzkzIDQzLjQxNzIgNDkuNjYxOUw0My40MTcyIDQ5LjY2MTlDNDIuMDMxMiA0OC43NDM2IDQwLjQxMDggNDguMjUzNCAzOC43NTI3IDQ4LjI0OThIMjUuNTc2NUgyNS41NzY1QzIzLjMxNTkgNDguMjQ5IDIxLjE0NzYgNDkuMTU0MSAxOS41NDgxIDUwLjc2NTdDMTcuOTQ5MyA1Mi4zNzc0IDE3LjA1IDU0LjU2NDIgMTcuMDUgNTYuODQ0OEMxNy4wNSA1OS4xMjQ3IDE3Ljk0OTMgNjEuMzExNSAxOS41NDgyIDYyLjkyMzJDMjEuMTQ3NiA2NC41MzU2IDIzLjMxNTggNjUuNDM5OSAyNS41NzY0IDY1LjQzOTJIMjUuNTc2NUgzMi45OTA4SDMzLjE1NDhMMzMuMjIwMSA2NS41ODk2TDQ4LjQ2ODggMTAwLjcwOEw1Ni42MTQ0IDI1LjQ3NzRaTTU2LjYxNDQgMjUuNDc3NEM1Ni44NjcgMjMuMzk5OCA1Ny44NjMzIDIxLjQ4NjQgNTkuNDE0OSAyMC4wOTdMNTkuMjQ4MSAxOS45MTA3TTU2LjYxNDQgMjUuNDc3NEw1OS4yNDgxIDE5LjkxMDdNNTkuMjQ4MSAxOS45MTA3TDU5LjQxNDkgMjAuMDk3QzYwLjk2NyAxOC43MDcxIDYyLjk2ODEgMTcuOTM3MiA2NS4wNDMyIDE3LjkyOTJMOTEuMzY0NCAxNy45M0M5My42MjUxIDE3LjkzIDk1Ljc5MzQgMTguODM0NCA5Ny4zOTI4IDIwLjQ0NTlDOTguOTkxNiAyMi4wNTc2IDk5Ljg5MDkgMjQuMjQ0NCA5OS44OTA5IDI2LjUyNTFDOTkuODkwOSAyOC44MDU4IDk4Ljk5MTYgMzAuOTkyNSA5Ny4zOTI4IDMyLjYwNDJDOTUuNzkzNCAzNC4yMTU4IDkzLjYyNTEgMzUuMTIwMiA5MS4zNjQ0IDM1LjEyMDJINzIuODEzMkg3Mi41OTIzTTU5LjI0ODEgMTkuOTEwN0w3Mi41OTIzIDM1LjEyMDJNNzIuNTkyMyAzNS4xMjAyTDcyLjU2NTEgMzUuMzM5M003Mi41OTIzIDM1LjEyMDJMNzIuNTY1MSAzNS4zMzkzTTcyLjU2NTEgMzUuMzM5M0w2NC43Mjk5IDk4LjMyOTJDNjQuNzI5OSA5OC4zMjkyIDY0LjcyOTkgOTguMzI5MiA2NC43Mjk5IDk4LjMyOTJNNzIuNTY1MSAzNS4zMzkzTDY0LjcyOTkgOTguMzI5Mk02MC45MjkzIDEwNC40NTVDNTguODMxNyAxMDUuODM0IDU2LjIzODYgMTA2LjIxMyA1My44Mzg4IDEwNS40OTJNNjAuOTI5MyAxMDQuNDU1TDUzLjgzODggMTA1LjQ5Mk02MC45MjkzIDEwNC40NTVDNjMuMDI3MSAxMDMuMDc1IDY0LjQxNzMgMTAwLjgzNiA2NC43Mjk5IDk4LjMyOTJNNjAuOTI5MyAxMDQuNDU1TDY0LjcyOTkgOTguMzI5Mk01My44Mzg4IDEwNS40OTJDNTEuNDM5MSAxMDQuNzcgNDkuNDc1IDEwMy4wMjIgNDguNDY4OCAxMDAuNzA4TDUzLjgzODggMTA1LjQ5MloiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMC41Ii8+CjwvZz4KPC9zdmc+Cg=="]
        }, 57962: (e, t, s) => {
            "use strict";
            s.d(t, {Nr: () => Z, op: () => d, vK: () => q});
            var i = s(6618), r = s(82623), n = s(63071), a = s(7508), o = s(19501), c = s(76578);

            class d extends i.MN {
                template = r.hQ.DROPDOWN_GAPS;
                groupType = r.sJ.INTERACTIVE;
                $selectionProperties;
                setSelectionProperties;
                $hasGapInSelection;
                setHasGapInSelection;
                $contentCharsCount;
                setContentCharsCount;
                addGap;
                deleteGap;
                addIncorrectOption;
                editOption;
                deleteOption;
                changeOption;
                $gapsCorrectnessMap;
                setGapsCorrectnessMap;
                showValidAnswer;
                $gaps;

                constructor(e) {
                    super(e, {}, {}), this.$selectionProperties = (0, n.createStore)({}), this.setSelectionProperties = (0, n.createEvent)(), this.$selectionProperties.on(this.setSelectionProperties, ((e, t) => t)), this.setHasGapInSelection = (0, n.createEvent)(), this.$hasGapInSelection = (0, n.restore)(this.setHasGapInSelection, !1), this.setContentCharsCount = (0, n.createEvent)(), this.$contentCharsCount = (0, n.restore)(this.setContentCharsCount, 0), this.addGap = (0, n.createEvent)(), this.$content.on(this.addGap, ((e, {
                        gapId: t,
                        correctAnswer: s
                    }) => {
                        if (e.correctAnswers?.some((e => e.gapId === t))) return e;
                        const i = [...e.correctAnswers ?? [], {
                            gapId: t,
                            dropdownChoices: [{gapChoiceId: (0, a.v4)(), text: s, correct: !0}]
                        }];
                        return {...e, correctAnswers: i}
                    })), this.deleteGap = (0, n.createEvent)(), this.$content.on(this.deleteGap, ((e, t) => {
                        const s = e.correctAnswers?.filter((e => e.gapId !== t)) ?? [];
                        return {...e, correctAnswers: s}
                    })), this.addIncorrectOption = (0, n.createEvent)(), this.$content.on(this.addIncorrectOption, ((e, {
                        gapId: t,
                        text: s
                    }) => {
                        const i = e.correctAnswers?.map((e => {
                            if (e.gapId !== t) return e;
                            const i = {gapChoiceId: (0, a.v4)(), text: s, correct: !1};
                            return {...e, dropdownChoices: [...e.dropdownChoices, i]}
                        }));
                        return {...e, correctAnswers: i}
                    })), this.editOption = (0, n.createEvent)(), this.$content.on(this.editOption, ((e, {
                        gapId: t,
                        text: s,
                        optionId: i
                    }) => {
                        const r = e.correctAnswers?.map((e => {
                            if (e.gapId !== t) return e;
                            const r = e.dropdownChoices.map((e => e.gapChoiceId !== i ? e : {...e, text: s}));
                            return {...e, dropdownChoices: r}
                        }));
                        return {...e, correctAnswers: r}
                    })), this.deleteOption = (0, n.createEvent)(), this.$content.on(this.deleteOption, ((e, {
                        gapId: t,
                        optionId: s
                    }) => {
                        const i = e.correctAnswers?.map((e => {
                            if (e.gapId !== t) return e;
                            const i = e.dropdownChoices.filter((e => e.gapChoiceId !== s));
                            return {...e, dropdownChoices: i}
                        }));
                        return {...e, correctAnswers: i}
                    })), this.validationSchema = (0, o.Ry)({
                        description: (0, o.Z_)().notRequired(),
                        imgUrl: (0, o.Z_)().notRequired(),
                        content: (0, o.Z_)().notRequired(),
                        correctAnswers: (0, o.IX)().of((0, o.Ry)({
                            gapId: (0, o.Z_)(),
                            dropdownChoices: (0, o.IX)().of((0, o.Ry)({
                                text: (0, o.Z_)(),
                                correct: (0, o.O7)(),
                                gapChoiceId: (0, o.Z_)()
                            }))
                        }).test({
                            name: "correctAnswerMax", test: ({dropdownChoices: e}) => {
                                const t = e?.find((e => e.correct))?.text;
                                return !(null != t && t.length > 60)
                            }, message: c.e.DropdownGapWidget.correctAnswerError(60)
                        })).notRequired()
                    }), this.changeOption = (0, n.createEvent)(), this.$answer.on(this.changeOption, ((e, {
                        gapId: t,
                        optionId: s
                    }) => ({
                        ...e,
                        [t]: s
                    }))), this.$gaps = this.$content.map((e => e.correctAnswers ?? [])), this.setGapsCorrectnessMap = (0, n.createEvent)(), this.$gapsCorrectnessMap = (0, n.restore)(this.setGapsCorrectnessMap, {}), this.handleShowCorrectAnswerEvent(), this.showValidAnswer = (0, n.createEvent)();
                    const t = (0, n.createEvent)();
                    (0, n.sample)({
                        clock: this.showValidAnswer,
                        source: {gapsCorrectnessMap: this.$gapsCorrectnessMap, gaps: this.$gaps},
                        fn: ({gapsCorrectnessMap: e, gaps: t}) => {
                            const s = t.length, i = Object.values(e), r = i.length === s, n = i.every((e => e));
                            return r && n
                        },
                        target: t
                    }), this.$answerStatus.on(t, (() => r.iP.EVALUATED)), this.$widgetStatus.on(t, ((e, t) => t ? r.vQ.CORRECT : r.vQ.ERROR)), (0, n.sample)({
                        clock: this.$answer,
                        source: this.$answerStatus,
                        fn: (e, t) => e === r.iP.EVALUATED ? e : Object.values(t).some((e => e)) ? r.iP.DEFAULT : r.iP.NULL,
                        target: this.events.updateAnswerStatus
                    }), super.useWidgetsEdit([this.events.setContentField, this.editOption, this.deleteOption, this.addIncorrectOption])
                }

                handleShowCorrectAnswerEvent() {
                    this.handleShowCorrectAnswer(), this.handleHideCorrectAnswer()
                }

                handleShowCorrectAnswer() {
                    const e = (0, n.guard)({source: this.events.showCorrectAnswers, filter: e => e});
                    (0, n.sample)({
                        clock: e, source: this.$content, fn: e => {
                            const {correctAnswers: t} = e, s = {};
                            return t?.reduce(((e, t) => {
                                const {gapId: s, dropdownChoices: i} = t, r = i.find((e => e.correct))?.gapChoiceId;
                                return r && (e[s] = r), e
                            }), s) ?? s
                        }, target: this.events.setAnswer
                    }), (0, n.sample)({
                        clock: e,
                        source: this.$gaps,
                        fn: e => e.reduce(((e, t) => (e[t.gapId] = !0, e)), {}),
                        target: this.setGapsCorrectnessMap
                    }), this.$answerStatus.on(e, (() => r.iP.EVALUATED))
                }

                handleHideCorrectAnswer() {
                    const e = (0, n.guard)({source: this.events.showCorrectAnswers, filter: e => !e});
                    this.$answer.on(e, (() => ({}))), this.$answerStatus.on(e, (() => r.iP.DEFAULT))
                }

                validateAnswer(e) {
                    return e && this.showValidAnswer(), this
                }

                getContentStore() {
                    return this.$content
                }

                getAnswerStore() {
                    return this.$answer
                }

                getWidgetStatusStore() {
                    return this.$widgetStatus
                }

                getAnswerStatusStore() {
                    return this.$answerStatus
                }

                getCopy() {
                    const e = this.$content.getState(), t = e.correctAnswers?.map((e => {
                        const t = e.dropdownChoices.map((e => ({...e, gapChoiceId: (0, a.v4)()})));
                        return {...e, gapId: (0, a.v4)(), dropdownChoices: t}
                    }));
                    return {...e, correctAnswers: t}
                }

                setAnswer(e) {
                    const t = e.reduce(((e, {gapId: t, correct: s}) => (null != s && (e[t] = s), e)), {});
                    this.setGapsCorrectnessMap(t);
                    const s = e.reduce(((e, {gapId: t, gapChoiceId: s}) => (e[t] = s, e)), {});
                    return this.events.setAnswer(s), this
                }

                getAnswer() {
                    const e = [], t = this.$answer.getState();
                    return Object.entries(t).forEach((([t, s]) => {
                        e.push({gapId: t, gapChoiceId: s})
                    })), e
                }
            }

            var u = s(66531), g = s(6736), l = s.n(g), M = s(47487), N = s(95009), h = s(83343);
            const I = ({gap: e}) => null == e ? null : l().createElement("div", {className: "dropdown-gap inline-flex flex-row rounded-s border-xs"}, l().createElement(N.Typography, {
                className: "dropdown-gap__title",
                type: "paragraphMSnugNormal"
            }, e.title), l().createElement(h.Icon, {className: "dropdown-gap__icon", name: "caret-down-solid"}));
            var D = s(79902), A = s(28352), E = s(17216);
            const p = {
                removePlugins: [E.CKEditorPluginNames.Heading, E.CKEditorPluginNames.BlockQuote, E.CKEditorPluginNames.HorizontalLine, E.CKEditorPluginNames.Font, E.CKEditorPluginNames.Link, E.CKEditorPluginNames.Alignment, E.CKEditorPluginNames.Indent, E.CKEditorPluginNames.IndentBlock, E.CKEditorPluginNames.WordCount, E.CKEditorPluginNames.Image, E.CKEditorPluginNames.ImageCaption, E.CKEditorPluginNames.ImageResize, E.CKEditorPluginNames.ImageStyle, E.CKEditorPluginNames.ImageTextAlternative, E.CKEditorPluginNames.ImageToolbar, E.CKEditorPluginNames.Table, E.CKEditorPluginNames.TableToolbar, E.CKEditorPluginNames.TableProperties, E.CKEditorPluginNames.TableCellProperties, E.CKEditorPluginNames.TableCaption, E.CKEditorPluginNames.Collapse, E.CKEditorPluginNames.Media, E.CKEditorPluginNames.MediaInsert, E.CKEditorPluginNames.MediaResize, E.CKEditorPluginNames.MediaResizeButtons, E.CKEditorPluginNames.MediaResizeHandles, E.CKEditorPluginNames.MediaStyle, E.CKEditorPluginNames.MediaToolbar, E.CKEditorPluginNames.MediaUpload, E.CKEditorPluginNames.MediaEmbed, E.CKEditorPluginNames.MediaEmbedToolbar, E.CKEditorPluginNames.MediaEmbedResize, E.CKEditorPluginNames.MediaEmbedResizeButtons, E.CKEditorPluginNames.MediaEmbedResizeHandles, E.CKEditorPluginNames.Emoji, E.CKEditorPluginNames.Whitelist, E.CKEditorPluginNames.Strikethrough, E.CKEditorPluginNames.ListProperties, E.CKEditorPluginNames.MathJax, E.CKEditorPluginNames.MathLive, E.CKEditorPluginNames.MathLiveCK4],
                toolbar: [E.CKEditorToolbarButtons.Bold, E.CKEditorToolbarButtons.Italic, E.CKEditorToolbarButtons.Underline, E.CKEditorToolbarButtons.Subscript, E.CKEditorToolbarButtons.Superscript, E.CKEditorToolbarButtons.Separator, E.CKEditorToolbarButtons.SpecialCharacters]
            }, T = () => {
                const e = l().createElement("div", {className: "pt-0.5 pb-0.5 w-[220px]"}, l().createElement(N.Typography, {
                    type: "paragraphSSnugNormal",
                    color: "text-white",
                    className: "mb-1.5"
                }, "Выделите курсором слово или словосочетание, которое нужно заменить списком, и нажмите «Добавить»."), l().createElement(N.Typography, {
                    type: "paragraphSSnugNormal",
                    color: "text-white"
                }, "Помимо правильного, можно добавить от одного до четырех вариантов ответа."));
                return l().createElement(D.IconTooltip, {content: e})
            }, w = ({selectionTextLength: e, totalLength: t, hasSelectionTextSpaces: s, isError: i}) => {
                if (0 === e) return null;
                const r = s ? c.e.DropdownGapWidget.hasSpaces : c.e.DropdownGapWidget.hasNotSpaces,
                    n = i ? "text-negative" : "text-dark-500";
                return l().createElement(N.Typography, {
                    type: "paragraphSSnugNormal",
                    color: n
                }, `${c.e.DropdownGapWidget.selectionLengthText(e, t)} ${r}`)
            };
            var v = s(80667);
            const j = ({disabled: e, editor: t}) => l().createElement(v.Button, {
                disabled: e,
                withoutShadow: !0,
                iconName: "math-plus-solid",
                appearance: "solid-light",
                className: "mt-0.5 mr-0.5",
                onClick: () => {
                    t?.execute("createGap")
                }
            }, c.e.DropdownGapWidget.addGapButtonText);
            var C = s(27351);
            const m = ({onClick: e, options: t}) => {
                const [s, i] = (0, g.useState)(""), r = (0, g.useMemo)((() => t.some((e => e.text === s))), [s, t]),
                    n = "" === s || s.length > 60 || t.length >= 5 || r;
                return l().createElement("div", null, l().createElement(N.Typography, {
                    type: "paragraphMSnugSemibold",
                    className: "mt-2 mb-0.5"
                }, c.e.DropdownGapWidget.answerVariants), l().createElement("div", {className: "flex flex-row"}, l().createElement(C.Input, {
                    className: "flex-1 mr-0.5",
                    value: s,
                    onChange: e => {
                        i(e.target.value)
                    },
                    size: "l"
                }), l().createElement(v.Button, {
                    onClick: () => {
                        e(s), i("")
                    }, disabled: n, iconName: "math-plus", appearance: "solid-white", withoutShadow: !0, size: "l"
                }, c.e.DropdownGapWidget.addAnswerButton)))
            }, O = ({
                        gapId: e,
                        option: t,
                        deleteOption: s
                    }) => l().createElement("div", {className: "bg-white rounded-m p-1 border-xs border-dark-300 inline-flex flex-row items-center mr-0.5 mb-0.5"}, l().createElement(N.Typography, {
                type: "paragraphMSnugNormal",
                color: "text-dark-700"
            }, t.text), l().createElement(v.Button, {
                onClick: () => {
                    s({gapId: e, optionId: t.gapChoiceId})
                },
                iconName: "math-x-solid",
                iconColor: "text-negative",
                size: "xs",
                appearance: "transparent",
                className: "ml-0.5"
            })), z = ({
                          gap: e,
                          addIncorrectOption: t,
                          editOption: s,
                          deleteOption: i,
                          editor: r,
                          correctAnswerError: n
                      }) => {
                const {dropdownChoices: a} = e, o = a.find((e => e.correct)), d = a.filter((e => !e.correct));
                return l().createElement("div", {className: "bg-light-100 rounded-m p-1 mb-1.5"}, l().createElement("div", {className: "flex flex-row items-center justify-between"}, l().createElement(N.Typography, {
                    type: "paragraphMSnugNormal",
                    color: "text-dark-500"
                }, e.title), l().createElement(v.Button, {
                    onClick: () => {
                        r?.execute("removeGap", {id: e.gapId, replacement: o?.text ?? ""})
                    }, iconName: "editing-trash", appearance: "solid-white", withoutShadow: !0, size: "s"
                })), l().createElement(N.Typography, {
                    type: "paragraphMSnugSemibold",
                    className: "mt-1.5 mb-0.5"
                }, c.e.DropdownGapWidget.correctAnswer), l().createElement(C.Input, {
                    value: o?.text ?? "",
                    onChange: t => {
                        if (null == o) return;
                        const i = t.target.value;
                        s({gapId: e.gapId, optionId: o.gapChoiceId, text: i})
                    },
                    size: "l"
                }), l().createElement(D.ErrorMessage, {messageText: n ?? ""}), l().createElement(m, {
                    options: a,
                    onClick: s => {
                        t({gapId: e.gapId, text: s})
                    }
                }), l().createElement("div", {className: "mt-1.5"}, d.map((t => l().createElement(O, {
                    key: t.gapChoiceId,
                    gapId: e.gapId,
                    option: t,
                    deleteOption: i
                })))))
            }, L = ({
                        gaps: e,
                        addIncorrectOption: t,
                        editOption: s,
                        deleteOption: i,
                        editor: r,
                        errors: n
                    }) => l().createElement("div", {className: "mt-1.5"}, e.map(((e, a) => {
                const o = n[`correctAnswers[${a}]`]?.error.message;
                return l().createElement(z, {
                    key: e.gapId,
                    gap: e,
                    addIncorrectOption: t,
                    editOption: s,
                    deleteOption: i,
                    editor: r,
                    correctAnswerError: o
                })
            })));
            var y = s(37212), S = s.n(y);
            const U = [E.CKEditorPluginNames.Media, E.CKEditorPluginNames.MediaInsert, E.CKEditorPluginNames.MediaResize, E.CKEditorPluginNames.MediaResizeButtons, E.CKEditorPluginNames.MediaResizeHandles, E.CKEditorPluginNames.MediaStyle, E.CKEditorPluginNames.MediaToolbar, E.CKEditorPluginNames.MediaUpload, E.CKEditorPluginNames.Heading, E.CKEditorPluginNames.ListProperties, E.CKEditorPluginNames.IndentBlock, E.CKEditorPluginNames.Indent, E.CKEditorPluginNames.BlockQuote, E.CKEditorPluginNames.Alignment, E.CKEditorPluginNames.MediaEmbed, E.CKEditorPluginNames.MediaEmbedResize, E.CKEditorPluginNames.MediaEmbedResizeButtons, E.CKEditorPluginNames.MediaEmbedResizeHandles, E.CKEditorPluginNames.MediaEmbedToolbar, E.CKEditorPluginNames.Table, E.CKEditorPluginNames.TableCaption, E.CKEditorPluginNames.TableProperties, E.CKEditorPluginNames.TableToolbar, E.CKEditorPluginNames.TableCellProperties, E.CKEditorPluginNames.HorizontalLine, E.CKEditorPluginNames.MathLiveCK4, E.CKEditorPluginNames.MathLive, E.CKEditorPluginNames.Font, E.CKEditorPluginNames.Collapse, E.CKEditorPluginNames.Emoji, E.CKEditorPluginNames.Strikethrough, E.CKEditorPluginNames.Image, E.CKEditorPluginNames.ImageCaption, E.CKEditorPluginNames.ImageResize, E.CKEditorPluginNames.ImageStyle, E.CKEditorPluginNames.ImageTextAlternative, E.CKEditorPluginNames.ImageToolbar],
                k = [E.CKEditorToolbarButtons.Bold, E.CKEditorToolbarButtons.Italic, E.CKEditorToolbarButtons.Underline, E.CKEditorToolbarButtons.Subscript, E.CKEditorToolbarButtons.Superscript, E.CKEditorToolbarButtons.Separator, E.CKEditorToolbarButtons.SpecialCharacters, E.CKEditorToolbarButtons.Mathjax],
                x = ({
                         GapComponent: e,
                         isPlayer: t = !1
                     }) => ({
                    removePlugins: t ? [...U, E.CKEditorPluginNames.Link] : U,
                    toolbar: k,
                    gap: {
                        renderGap: (t, s) => {
                            S().render(l().createElement(e, {id: s}), t)
                        }
                    }
                }), Q = ({
                             data: e,
                             onChange: t,
                             isSelectionOverflown: s,
                             onSelectionChange: i,
                             onCharsCountChange: r,
                             onReady: n,
                             GapComponent: a
                         }) => {
                    const o = (0, g.useMemo)((() => {
                        let e = "dropdown-gaps-widget__content-field";
                        return s && (e += " dropdown-gaps-widget__content-field_negative"), e
                    }), [s]), c = (0, g.useCallback)((({characters: e}) => {
                        r(e)
                    }), [r]), d = (0, g.useMemo)((() => x({GapComponent: a})), [a]);
                    return l().createElement(D.CKEditorStyled, {
                        data: e,
                        onChange: t,
                        className: o,
                        onSelectionTextChange: i,
                        onCharsCountChange: c,
                        onReady: n,
                        overrideConfig: d
                    })
                }, f = ({
                            description: e,
                            imgUrl: t,
                            onDescriptionChange: s,
                            onFilesUpload: i,
                            onImageRemove: r,
                            content: n,
                            onContentChange: a,
                            hasSelectionTextSpaces: o,
                            onSelectionChange: d,
                            onHasGapInSelectionChange: u,
                            contentCharsCount: M,
                            onContentCharsCountChange: h,
                            isContentSelectionOverflown: I,
                            isCreateGapDisabled: E,
                            addGap: v,
                            deleteGap: C,
                            selectionText: m,
                            gaps: O,
                            addIncorrectOption: z,
                            editOption: y,
                            deleteOption: S,
                            GapComponent: U,
                            errors: k
                        }) => {
                    const [x, f] = (0, g.useState)(null);
                    return (0, g.useEffect)((() => {
                        if (null != x) {
                            const e = x.plugins.get("GapPlugin");
                            e.on("change:hasGapInSelection", (() => {
                                u(e.hasGapInSelection)
                            })), e.on("insertGap", ((e, t) => {
                                const {id: s, initialValue: i} = t;
                                v({gapId: s, correctAnswer: i ?? ""})
                            })), e.on("removeGap", ((e, t) => {
                                const {id: s} = t;
                                C(s)
                            }))
                        }
                    }), [v, C, x, u]), l().createElement("div", {
                        className: "p-1.5 bg-white",
                        "data-testid": `${A._8}.EDITOR`
                    }, l().createElement(D.QuestionEditor, {
                        description: e,
                        setDescription: s,
                        imgUrl: t,
                        setImgUrl: i,
                        handleDeleteImg: r,
                        ckEditorOverrideDescriptionConfig: p,
                        descriptionLabel: c.e.DropdownGapWidget.questionLabel,
                        hideTitle: !0
                    }), l().createElement("div", {className: "flex mt-1.5 mb-0.375"}, l().createElement(N.Typography, {
                        type: "paragraphMSnugSemibold",
                        className: "mr-0.5"
                    }, c.e.DropdownGapWidget.contentHint), l().createElement(T, null)), l().createElement(Q, {
                        data: n,
                        onChange: a,
                        isSelectionOverflown: I,
                        onSelectionChange: d,
                        onCharsCountChange: h,
                        onReady: f,
                        GapComponent: U
                    }), l().createElement("div", {className: "flex items-center"}, l().createElement(j, {
                        editor: x,
                        disabled: E
                    }), l().createElement(w, {
                        selectionTextLength: m.length,
                        totalLength: M,
                        hasSelectionTextSpaces: o,
                        isError: I
                    })), l().createElement(L, {
                        gaps: O,
                        addIncorrectOption: z,
                        editOption: y,
                        deleteOption: S,
                        editor: x,
                        errors: k
                    }))
                };
            var Y = s(70027), $ = s(26362);
            const F = ({isContentFilled: e, description: t, content: s, GapComponent: i, Badge: r, imgUrl: n}) => {
                const a = (0, g.useMemo)((() => x({GapComponent: i, isPlayer: !0})), [i]);
                return l().createElement("div", {
                    className: "bg-white p-1.5 rounded-s",
                    "data-testid": `${A._8}.PLAYER`
                }, e ? l().createElement(l().Fragment, null, l().createElement(N.Typography, {type: "paragraphMSnugNormal"}, l().createElement(Y.Z, {
                    description: t,
                    Badge: r,
                    imgUrl: n
                })), l().createElement(D.CKEditorStyled, {
                    data: s ?? "", overrideConfig: a, onReady: e => {
                        e.ui.view.toolbar.element.style.display = "none"
                    }, className: "dropdown-gaps-widget__player_content_field", disabled: !0
                })) : l().createElement($.t, null))
            };
            var b, P = s(21551), R = s(2284), W = s.n(R), V = s(91562), G = s(61720);
            !function (e) {
                e[e.DEFAULT = 0] = "DEFAULT", e[e.ON_CHECK = 1] = "ON_CHECK", e[e.HIGHLIGHT_CORRECTNESS = 2] = "HIGHLIGHT_CORRECTNESS"
            }(b || (b = {}));
            const B = ({options: e, selectedOption: t, gapId: s, onChange: i, gapsViewMode: r, isCorrect: n}) => {
                if (r === b.ON_CHECK) return l().createElement(N.Typography, {
                    type: "paragraphMSnugNormal",
                    className: "on-check-gap"
                }, t?.title);
                if (r === b.HIGHLIGHT_CORRECTNESS) {
                    const e = n ? "correct-gap" : "incorrect-gap";
                    return null == t ? l().createElement("div", {className: "player-view--gap-dropdown-container"}, l().createElement(V.Dropdown, {
                        selectedItem: null,
                        setSelectedItem: P.noop,
                        items: [],
                        placeholder: "...",
                        disabled: !0,
                        placeholderFontWeight: "regular",
                        withPortal: !0,
                        portalId: G.XO
                    })) : l().createElement(N.Typography, {
                        type: "paragraphMSnugNormal",
                        className: W()("inline", e)
                    }, t?.title)
                }
                return l().createElement("div", {className: "player-view--gap-dropdown-container"}, l().createElement(V.Dropdown, {
                    items: e,
                    selectedItem: t || null,
                    setSelectedItem: e => {
                        i({gapId: s, optionId: e.id})
                    },
                    placeholder: "...",
                    bordered: !0,
                    placeholderFontWeight: "regular",
                    itemsFontWeight: "regular",
                    withPortal: !0,
                    portalId: G.XO
                }))
            };

            class K {
                id;
                ViewName;
                View;

                constructor(e) {
                    this.id = e.id, this.ViewName = "DropdownGapsEditorViewModel";
                    const {events: t} = e, s = e => {
                            t.setContentField({field: "description", value: e})
                        }, i = () => {
                            t.setContentField({field: "imgUrl", value: void 0})
                        }, r = s => {
                            const {uploadFile: i} = e.ApiFunctions;
                            i?.(s[0]).then((e => {
                                t.setContentField({field: "imgUrl", value: e?.path})
                            }))
                        }, a = e => {
                            t.setContentField({field: "content", value: e})
                        }, o = e.getContentStore(), {$selectionProperties: c} = e,
                        d = c.map((({selectionText: e}) => e ?? "")), u = d.map((({length: e}) => e > 60)),
                        g = d.map((e => -1 !== e.search(/\s/))), N = (0, n.createStore)(!1);
                    (0, n.sample)({
                        clock: d,
                        source: c,
                        target: N,
                        fn: ({selectedLinesAmount: e = 0, hasOnlyWhitespaces: t = !1}) => e > 1 || t
                    });
                    const h = (0, n.combine)({
                        isContentSelectionOverflown: u,
                        selectionProperties: c,
                        hasGapInSelection: e.$hasGapInSelection,
                        isSelectionTextConsistsOfSpaces: N
                    }, (({
                             isContentSelectionOverflown: e,
                             selectionProperties: t,
                             hasGapInSelection: s,
                             isSelectionTextConsistsOfSpaces: i
                         }) => {
                        if (null == t) return !0;
                        const {isEmpty: r} = t;
                        return r || e || i || s
                    })), D = o.map((({correctAnswers: e}) => e?.map(((e, t) => ({
                        ...e,
                        title: `Список ${t + 1}`
                    }))) ?? [])), A = (0, M.createComponent)(D, (({id: e}, t) => {
                        const s = t.find((t => t.gapId === e));
                        return l().createElement(I, {gap: s})
                    })), E = (0, n.combine)({
                        widgetContent: o,
                        contentCharsCount: e.$contentCharsCount,
                        hasSelectionTextSpaces: g,
                        isContentSelectionOverflown: u,
                        isCreateGapDisabled: h,
                        selectionText: d,
                        gaps: D,
                        errors: e.$validationErrors
                    });
                    this.View = (0, M.createComponent)(E, ((t, {
                        widgetContent: n,
                        contentCharsCount: o,
                        hasSelectionTextSpaces: c,
                        isContentSelectionOverflown: d,
                        isCreateGapDisabled: u,
                        selectionText: g,
                        gaps: M,
                        errors: N
                    }) => {
                        const {description: h, imgUrl: I, content: D} = n, {getFileUrl: E} = e.ApiFunctions,
                            p = null != E && null != I ? E(I) : I;
                        return l().createElement(f, {
                            description: h,
                            onDescriptionChange: s,
                            imgUrl: p,
                            onFilesUpload: r,
                            onImageRemove: i,
                            content: D ?? "",
                            onContentChange: a,
                            onContentCharsCountChange: e.setContentCharsCount,
                            contentCharsCount: o,
                            selectionText: g,
                            hasSelectionTextSpaces: c,
                            onSelectionChange: e.setSelectionProperties,
                            onHasGapInSelectionChange: e.setHasGapInSelection,
                            isContentSelectionOverflown: d,
                            isCreateGapDisabled: u,
                            addGap: e.addGap,
                            deleteGap: e.deleteGap,
                            gaps: M,
                            addIncorrectOption: e.addIncorrectOption,
                            editOption: e.editOption,
                            deleteOption: e.deleteOption,
                            GapComponent: A,
                            errors: N
                        })
                    }))
                }
            }

            var _ = s(69983), H = s.n(_);

            class q {
                id;
                ViewName;
                View;

                constructor(e) {
                    this.id = e.id, this.ViewName = "DropdownGapsPlayerViewModel";
                    const t = q.createGapComponent(e), s = e.getContentStore(), i = s.map((({
                                                                                                description: e,
                                                                                                imgUrl: t,
                                                                                                content: s,
                                                                                                correctAnswers: i
                                                                                            }) => !!(e || t || s || i?.length))),
                        r = {content: s, isContentFilled: i};
                    this.View = (0, M.createComponent)(r, (({Badge: s}, {isContentFilled: i, content: r}) => {
                        const {getFileUrl: n} = e.ApiFunctions, {imgUrl: a} = r, o = null != n && null != a ? n(a) : a;
                        return l().createElement(F, {
                            isContentFilled: i,
                            description: r.description,
                            content: r.content,
                            GapComponent: t,
                            Badge: s,
                            imgUrl: o
                        })
                    }))
                }

                static createGapComponent(e) {
                    const t = {
                        gaps: e.getContentStore().map((e => e.correctAnswers)),
                        selectedOptionsMap: e.getAnswerStore(),
                        gapsViewMode: (0, n.combine)({
                            widgetStatus: e.getWidgetStatusStore(),
                            answerStatus: e.getAnswerStatusStore()
                        }, (({
                                 widgetStatus: e,
                                 answerStatus: t
                             }) => e === r.vQ.ON_CHECK ? b.ON_CHECK : t === r.iP.EVALUATED ? b.HIGHLIGHT_CORRECTNESS : b.DEFAULT)),
                        gapsCorrectnessMap: e.$gapsCorrectnessMap
                    };
                    return (0, M.createComponent)(t, (({id: t}, {
                        gaps: s,
                        selectedOptionsMap: i,
                        gapsViewMode: r,
                        gapsCorrectnessMap: n
                    }) => {
                        const a = s?.find((e => e.gapId === t));
                        if (null == a) return null;
                        const o = a.dropdownChoices.map((({gapChoiceId: e, text: t}) => ({id: e, title: t}))),
                            c = H()(o), d = i[a.gapId], u = c.find((e => e.id === d));
                        return l().createElement(B, {
                            options: c,
                            selectedOption: u,
                            gapId: a.gapId,
                            onChange: e.changeOption,
                            gapsViewMode: r,
                            isCorrect: n[a.gapId]
                        })
                    }))
                }
            }

            class Z extends u.$ {
                constructor(e) {
                    const {isEditorVM: t, widgetModel: s} = e;
                    super({widgetModel: s, isEditorVM: t, EditorVM: new K(s), PlayerVM: new q(s)})
                }
            }
        }, 4987: (e, t, s) => {
            "use strict";
            s.d(t, {E: () => l});
            var i = s(82623), r = s(6618), n = s(6736), a = s.n(n), o = s(83343), c = s(95009), d = s(76578);
            const u = () => a().createElement("div", {className: "p-1"}, a().createElement("div", {className: "EmptyWidget h-6 rounded-l flex flex-row items-center justify-center p-1"}, a().createElement(o.Icon, {
                name: "warning-circle-wavy-warning",
                color: "text-secondary",
                className: "mr-1"
            }), a().createElement(c.Typography, {
                as: "span",
                type: "captionXsSnugSemibold",
                color: "text-secondary"
            }, d.e.EmptyWidget.inProcesstext)));

            class g {
                View;
                ViewName;

                constructor(e) {
                    this.ViewName = `EmptyWidget${e}`, this.View = u
                }
            }

            class l extends r.Xt {
                constructor(e) {
                    super(e), this.events = {...this.events}, this.events.setHasLoaded(!0), this.template = "EMPTY", this.groupType = i.sJ.INFO
                }

                createViewModel() {
                    return new g(this.template)
                }
            }
        }, 14059: (e, t, s) => {
            "use strict";
            s.d(t, {r: () => N, v: () => h.v});
            var i = s(73850), r = s(6736), n = s.n(r), a = s(47487), o = s(63071), c = s(19501), d = s(43918),
                u = s(27351);
            const g = ({gap: e, onChange: t, onFocus: s, onBlur: i}) => {
                if (null == e) return null;
                const {value: r} = e;
                return n().createElement("div", {className: "inline-flex flex-col mr-[1px] ml-[1px] mb-0.5"}, n().createElement(u.Input, {
                    ref: e => {
                        e && (e.size = 1)
                    }, value: r, onChange: t, onFocus: s, onBlur: i, appearance: "ghost", className: "gap-input"
                }), n().createElement("span", {className: "extend-width-element"}, r))
            };

            class l {
                id;
                ViewName;
                View;
                $gapFocusedInput;
                setGapFocusedInput;
                $isInputInGapFocused;
                setIsInputInGapFocused;

                constructor(e) {
                    const {widgetModel: t} = e;
                    this.id = t.id, this.ViewName = "FillingGapEditorView";
                    const {events: i} = t, {setContentField: u, addFile: l, removeImgUrl: M} = i;
                    t.validationSchema = (0, c.Ry)({
                        title: (0, c.Z_)().max(200),
                        description: (0, c.Z_)(),
                        imgUrl: (0, c.Z_)(),
                        content: (0, c.Z_)(),
                        correctAnswers: (0, c.IX)().of((0, c.Ry)({
                            gapId: (0, c.Z_)().required(),
                            value: (0, c.Z_)().required(),
                            correct: (0, c.O7)()
                        })).notRequired(),
                        matchCase: (0, c.O7)()
                    });
                    const N = t.ContentMap((e => e)).map((e => e.correctAnswers));
                    this.setGapFocusedInput = (0, o.createEvent)(), this.$gapFocusedInput = (0, o.restore)(this.setGapFocusedInput, null), this.setIsInputInGapFocused = (0, o.createEvent)(), this.$isInputInGapFocused = (0, o.restore)(this.setIsInputInGapFocused, !1);
                    const h = {
                            setTitle: e => u({field: "title", value: e}),
                            setDescription: e => u({field: "description", value: e}),
                            setEditorContent: e => {
                                u({field: "content", value: e})
                            },
                            addFile: e => l(e[0]),
                            removeFile: M,
                            addGap: t.events.addGap,
                            deleteGap: t.events.deleteGap,
                            handleMatchCaseSetting: e => {
                                t.events.setMatchCase(e.currentTarget.checked)
                            },
                            handleRemoveGap: e => {
                                const t = this.$gapFocusedInput.getState(), s = e.plugins.get("GapPlugin");
                                this.setIsInputInGapFocused(!1), !t || s.hasGapInSelection ? e?.execute("removeSelectionGaps", N.getState()) : e?.execute("removeGap", {
                                    id: t.closest(".gap")?.id,
                                    replacement: t.value
                                })
                            }
                        },
                        I = (0, r.lazy)((() => Promise.all([s.e(7064), s.e(1096), s.e(6195), s.e(3149)]).then(s.bind(s, 13149)))),
                        D = (0, a.createComponent)(N, (({id: e, editor: s}, i) => {
                            const r = i?.find((t => t.gapId === e));
                            return n().createElement(g, {
                                gap: r, onChange: i => {
                                    const {value: n} = i.target;
                                    e && t.events.changeGapValue({
                                        gapId: e,
                                        value: n
                                    }), 0 === n.length && (this.setIsInputInGapFocused(!1), s.execute("removeGap", {id: r?.gapId}))
                                }, onFocus: e => {
                                    this.setGapFocusedInput(e.target), this.setIsInputInGapFocused(!0)
                                }, onBlur: e => {
                                    e.preventDefault(), document.addEventListener("click", (e => {
                                        "REMOVE_GAP_BTN" !== e.target.closest("button")?.id && this.setIsInputInGapFocused(!1)
                                    }), {once: !0})
                                }
                            })
                        }));
                    this.View = (0, a.createComponent)((0, o.combine)({
                        ...t.getModelStores(),
                        gapFocusedInput: this.$gapFocusedInput,
                        isInputInGapFocused: this.$isInputInGapFocused
                    }), ((e, t) => n().createElement(d.Z, null, n().createElement(I, {
                        state: t,
                        handlers: h,
                        GapComponent: D,
                        validationErrors: t.validationErrors,
                        isInputInGapFocused: t.isInputInGapFocused
                    }))))
                }
            }

            var M = s(16148);

            class N extends i.BaseVMSwitcher {
                constructor(e) {
                    const {isEditorVM: t, widgetModel: s} = e;
                    super({
                        widgetModel: s,
                        EditorVM: new l({widgetModel: s}),
                        PlayerVM: new M.v({widgetModel: s}),
                        isEditorVM: t
                    })
                }
            }

            var h = s(20029)
        }, 20029: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => o});
            var i = s(82623), r = s(6618), n = s(63071), a = s(21551);

            class o extends r.MN {
                // Тест с вводом ответов в тексте

                events = this.events;
                groupType = i.sJ.INTERACTIVE;
                template = i.hQ.FILLING_GAP.valueOf();
                $initialAnswer;

                constructor(e) {
                    super(e, {}, []), this.events = {
                        ...this.events,
                        removeImgUrl: (0, n.createEvent)(),
                        fileUploaded: (0, n.createEvent)(),
                        addGap: (0, n.createEvent)(),
                        changeGapValue: (0, n.createEvent)(),
                        deleteGap: (0, n.createEvent)(),
                        setMatchCase: (0, n.createEvent)()
                    }, this.$content.on(this.events.removeImgUrl, (e => ({
                        ...e,
                        imgUrl: ""
                    }))).on(this.events.fileUploaded, ((e, t) => ({
                        ...e,
                        imgUrl: this.ApiFunctions.getFileUrl?.(t.path) ?? t.path
                    }))).on(this.events.addGap, ((e, t) => {
                        if (e.correctAnswers?.some((({gapId: e}) => e === t.gapId))) return e;
                        const s = e.correctAnswers ?? [];
                        return {...e, correctAnswers: [...s, t]}
                    })).on(this.events.changeGapValue, ((e, {gapId: t, value: s}) => {
                        const i = e.correctAnswers?.map((e => e.gapId !== t ? e : {...e, value: s}));
                        return {...e, correctAnswers: i}
                    })).on(this.events.deleteGap, ((e, t) => {
                        const s = (e.correctAnswers ?? []).filter((e => e.gapId !== t));
                        return {...e, correctAnswers: s}
                    })).on(this.events.setMatchCase, ((e, t) => ({
                        ...e,
                        matchCase: t
                    }))), this.useFileUploader(this.events.fileUploaded), this.events.showCorrectAnswers.watch((e => {
                        this.showCorrectAnswers(e)
                    })), this.events.validateAnswer.watch((e => {
                        this.validateAnswer(e)
                    })), this.$answer.watch((e => {
                        i.iP.EVALUATED !== this.getAnswerStatus() && this.setAnswerStatus(e?.some((e => e.value && e.value.length > 0)) ? i.iP.DEFAULT : i.iP.NULL)
                    })), this.$initialAnswer = this.$content.map((({correctAnswers: e}) => e?.map((e => ({
                        ...e,
                        value: "",
                        status: i.q0.DEFAULT
                    }))) || [])), this.events.setAnswer(this.$initialAnswer.getState() || []), super.useWidgetsEdit([this.events.setContentField, this.events.addFile, this.events.removeImgUrl, this.events.setMatchCase])
                }

                showCorrectAnswers(e) {
                    const t = this.getContent();
                    let s;
                    return e ? (s = t?.correctAnswers?.map((e => ({
                        ...e,
                        status: i.q0.DEFAULT,
                        correct: !0
                    }))) || [], this.setFullAnswer(s), this.setAnswerStatus(i.iP.EVALUATED)) : (this.setFullAnswer([]), this.setAnswerStatus(i.iP.DEFAULT)), this
                }

                updateAnswerStatus() {
                    return this.showCorrectAnswers(e), this
                }

                validateAnswer(e) {
                    const t = this.getFullAnswer(), s = this.getContent();
                    if (t) if (e) {
                        const e = t.map((e => {
                            const t = s?.correctAnswers?.find((t => t.gapId === e.gapId));
                            return {...e, correct: e.value === t?.value}
                        }));
                        this.events.setAnswer(e), this.setWidgetStatus(e.every((e => e.correct)) ? i.vQ.CORRECT : i.vQ.ERROR).setAnswerStatus?.(i.iP.EVALUATED)
                    } else this.setWidgetStatus(i.vQ.DEFAULT).setAnswerStatus?.(i.iP.DEFAULT);
                    return this
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                getFullAnswer() {
                    return super.getAnswer()
                }

                getAnswer() {
                    return super.getAnswer().map((({gapId: e, value: t}) => ({gapId: e, value: t})))
                }

                setAnswer(e) {
                    const t = this.$answer.getState().map((({gapId: t, status: s}) => {
                        const i = e?.find((e => e.gapId === t));
                        return {gapId: t, value: i?.value || "", correct: i?.correct, status: s}
                    }));
                    return this.setFullAnswer(t), this
                }

                getModelStores() {
                    return {
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus,
                        validationErrors: this.$validationErrors
                    }
                }
            }
        }, 16148: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => c});
            var i = s(6736), r = s.n(i), n = s(47487), a = s(43918), o = s(63071);

            class c {
                id;
                ViewName;
                View;

                constructor(e) {
                    const {widgetModel: t} = e;
                    this.id = t.id, this.ViewName = "FillingGapPlayerView";
                    const {setAnswer: c} = t.events, d = {setAnswer: c},
                        u = (0, i.lazy)((() => s.e(6338).then(s.bind(s, 66338))));
                    this.View = (0, n.createComponent)((0, o.combine)(t.getModelStores()), (({Badge: e}, t) => r().createElement(a.Z, null, r().createElement(u, {
                        handlers: d,
                        state: t,
                        Badge: e
                    }))))
                }
            }
        }, 62439: (e, t, s) => {
            "use strict";
            s.d(t, {S8: () => r, p4: () => n, KD: () => a});
            var i = s(82623);
            const r = 200, n = {title: "", description: "", imgUrl: ""},
                a = {content: "", status: i.q0.DEFAULT, files: [], text: ""}
        }, 35478: (e, t, s) => {
            "use strict";
            s.d(t, {u: () => c});
            var i = s(63071), r = s(6618), n = s(82623), a = s(21551), o = s(62439);

            class c extends r.MN {
                events = this.events;

                constructor(e) {
                    super(e, o.p4, o.KD);
                    const {data: t} = e;
                    this.widgetNumber = t.widgetNumber || 1, this.events = {
                        ...this.events,
                        setTitle: (0, i.createEvent)(),
                        setDescription: (0, i.createEvent)(),
                        setAnswer: (0, i.createEvent)(),
                        setAnswerText: (0, i.createEvent)(),
                        attachFileToAnswer: (0, i.createEvent)(),
                        setImgUrl: (0, i.createEvent)(),
                        removeImgUrl: (0, i.createEvent)(),
                        fileUploaded: (0, i.createEvent)(),
                        deleteFile: (0, i.createEvent)()
                    }, this.groupType = n.sJ.MIXED, this.template = n.hQ.FULL_ANSWER.valueOf(), this.$content.on(this.events.setTitle, ((e, t) => ({
                        ...e,
                        title: t
                    }))).on(this.events.setDescription, ((e, t) => ({
                        ...e,
                        description: t
                    }))).on(this.events.setImgUrl, ((e, t) => ({
                        ...e,
                        imgUrl: t.path
                    }))).on(this.events.removeImgUrl, (e => ({
                        ...e,
                        imgUrl: ""
                    }))), this.$answer.on(this.events.setAnswer, ((e, t) => {
                        let s = e?.content || "";
                        return (0, a.isString)(t.content) && (s = t.content), {
                            content: s,
                            files: t.files || e?.files || [],
                            status: t.status || e?.status
                        }
                    })).on(this.events.setAnswerText, ((e, t) => ({
                        ...e,
                        content: t
                    }))).on(this.events.fileUploaded, ((e, t) => ({
                        ...e,
                        files: [...e.files || [], t]
                    }))).on(this.events.deleteFile, ((e, t) => ({
                        ...e,
                        files: e.files?.filter((e => e.id !== t))
                    }))).watch((e => {
                        if (n.iP.EVALUATED !== this.getAnswerStatus()) {
                            const t = e.content?.length || e.files?.length;
                            this.setAnswerStatus(t ? n.iP.DEFAULT : n.iP.NULL)
                        }
                    })), super.useFileUploader(this.events.setImgUrl), super.useFileUploader(this.events.fileUploaded, this.events.attachFileToAnswer), (0, i.sample)({
                        clock: [this.events.setDescription, this.events.setImgUrl],
                        fn: () => this.setIsDirty(!0)
                    }), this.useWidgetsEdit([this.events.setTitle, this.events.setDescription, this.events.setImgUrl, this.events.removeImgUrl])
                }

                updateAnswerStatus() {
                    let e = n.q0.DEFAULT, {content: t} = this.getFullAnswer();
                    switch (this.getAnswerStatus()) {
                        case n.iP.EVALUATED:
                            switch (this.getWidgetStatus()) {
                                case n.vQ.CORRECT:
                                    e = n.q0.CORRECT;
                                    break;
                                case n.vQ.ERROR:
                                    e = n.q0.ERROR;
                                    break;
                                default:
                                    e = n.q0.DEFAULT
                            }
                            break;
                        case n.iP.NULL:
                            this.$widgetStatus.getState() === n.vQ.DISABLED || (t = ""), e = n.q0.DISABLED;
                            break;
                        default:
                            e = n.q0.DEFAULT
                    }
                    return this.events.setAnswer({status: e, content: t}), this
                }

                getFullAnswer() {
                    const e = this.$answer.getState(),
                        t = e.files?.map((({error: e, ...t}) => ({...t}))).filter((e => e.path.includes("/")));
                    return {...e, files: t}
                }

                getAnswer() {
                    const e = super.getAnswer();
                    return {answer: e.content, files: e.files}
                }

                setFullAnswer(e) {
                    return super.setAnswer(e), this
                }

                setAnswer(e) {
                    const t = this.$answer.getState();
                    return this.setFullAnswer({...t, content: e?.answer || "", files: e?.files}), this
                }

                combineStores() {
                    return (0, i.combine)({
                        content: this.$content,
                        answer: this.$answer,
                        noInteractivity: this.$noInteractivity,
                        status: this.$widgetStatus,
                        validationErrors: this.$validationErrors
                    })
                }

                addCustomWatchers({initializedWatcher: e, answerWatcher: t}) {
                    return e && e(!0), t && this.$answer.watch(t), this
                }
            }
        }, 26465: (e, t, s) => {
            "use strict";
            s.d(t, {YD: () => i, yr: () => r, CY: () => n, HK: () => a, S8: () => o});
            const i = "700px", r = "100%", n = "400", a = 11, o = 60
        }, 43375: (e, t, s) => {
            "use strict";
            s.d(t, {r: () => r});
            var i = s(7508);
            const r = () => ({imageId: (0, i.v4)(), title: "", imgUrl: ""})
        }, 50872: (e, t, s) => {
            "use strict";
            s.d(t, {Ck: () => r, $5: () => n, kD: () => o});
            var i = s(63071);
            const r = (0, i.createEvent)(), n = (0, i.createEvent)(), a = {widgetId: null, card: null},
                o = (0, i.createStore)(a).on(r, ((e, t) => t)).on(n, (() => a))
        }, 18660: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => o});
            var i = s(6736), r = s.n(i), n = s(47487), a = s(76578);

            class o {
                View;
                ViewName;
                id;

                constructor(e) {
                    const {widgetModel: t} = e;
                    this.id = t.id, this.ViewName = "LineConnectorPlayerView";
                    const o = (0, i.lazy)((() => Promise.all([s.e(4950), s.e(8443)]).then(s.bind(s, 57566)))), c = {
                        events: {
                            ...t.events,
                            setHasLoaded: t.events.setHasLoaded,
                            getFileUrl: e => t.ApiFunctions.getFileUrl?.(e || "") || e || ""
                        }, index: 0
                    };
                    this.View = (0, n.createComponent)(t.combineStores(), (({Badge: e}, t) => r().createElement(i.Suspense, {fallback: r().createElement("div", null, a.e.FullAnswer.suspenseLoadingText)}, r().createElement(o, {
                        state: t,
                        additionalProps: c,
                        Badge: e
                    }))))
                }
            }
        }, 11626: (e, t, s) => {
            "use strict";
            var i;
            s.d(t, {F: () => i}), function (e) {
                e.LEFT = "LEFT", e.RIGHT = "RIGHT"
            }(i || (i = {}))
        }, 64932: (e, t, s) => {
            "use strict";
            s.d(t, {T5: () => i, MT: () => r, KV: () => n});
            const i = {iframeURL: "", filePath: "", externalTaskId: "", scormName: ""}, r = {
                msgType: "",
                type: "",
                data: {progress: "", passingScore: "", status: ""},
                correlationId: "",
                result: {errors: []}
            }, n = 45e6
        }, 48048: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => o});
            var i = s(6736), r = s.n(i), n = s(47487), a = s(76578);

            class o {
                View;
                ViewName;
                id;

                constructor(e) {
                    const {widgetModel: t} = e;
                    this.id = t.id, this.ViewName = "SimpleAnswerPlayerView";
                    const o = (0, i.lazy)((() => s.e(2002).then(s.bind(s, 92002)))), c = {
                        setAnswerText: t.events.setAnswerText,
                        getFileUrl: e => t.ApiFunctions.getFileUrl?.(e || "") || e || ""
                    };
                    this.View = (0, n.createComponent)(t.combineStores(), (({Badge: e}, t) => r().createElement(i.Suspense, {fallback: r().createElement("div", null, a.e.FullAnswer.suspenseLoadingText)}, r().createElement(o, {
                        handlers: c,
                        state: t,
                        Badge: e
                    }))))
                }
            }
        }, 76559: (e, t, s) => {
            "use strict";
            s.d(t, {H: () => n});
            var i = s(23560), r = s.n(i);

            function n(e, t) {
                return e.map((e => {
                    const s = e.columns.map((s => r()(t) ? {...s, ...t(e, s)} : s));
                    return {...e, columns: s}
                }))
            }
        }, 20936: (e, t, s) => {
            "use strict";
            s.d(t, {tp: () => r, eJ: () => n, S8: () => a, pL: () => o, Qi: () => c, MU: () => d});
            var i = s(82623);
            const r = {title: "", imgUrl: "", orderSensitive: !1, groups: [], cards: [], description: ""}, n = [{
                cardId: "",
                groupId: "",
                groupOrder: 1,
                correct: !1,
                content: "",
                imgUrl: "",
                siblingCardIds: [""],
                status: i.q0.DEFAULT
            }], a = 200, o = 6, c = 30, d = 250
        }, 9200: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => o});
            var i = s(6736), r = s.n(i), n = s(47487), a = s(76578);

            class o {
                View;
                ViewName;
                id;

                constructor(e) {
                    const {widgetModel: t, isShortImgWidth: o = !1} = e;
                    this.id = t.id, this.ViewName = "TestPlayerView";
                    const c = (0, i.lazy)((() => Promise.all([s.e(1096), s.e(836)]).then(s.bind(s, 60836)))), d = {
                        handleChoiceSelection: t.events.selectChoice,
                        setHasLoaded: t.events.setHasLoaded,
                        getFileUrl: e => t.ApiFunctions.getFileUrl?.(e || "") || e || ""
                    };
                    this.View = (0, n.createComponent)(t.combineStores(), (({Badge: e}, t) => r().createElement(i.Suspense, {fallback: r().createElement("div", null, a.e.FullAnswer.suspenseLoadingText)}, r().createElement(c, {
                        state: t,
                        events: d,
                        Badge: e,
                        isShortImgWidth: o
                    }))))
                }
            }
        }, 24138: (e, t, s) => {
            "use strict";
            s.d(t, {v: () => o});
            var i = s(6736), r = s.n(i), n = s(47487), a = s(76578);

            class o {
                View;
                ViewName;
                id;

                constructor(e) {
                    const {widgetModel: t} = e;
                    this.id = t.id, this.ViewName = "TextPlayerView";
                    const o = (0, i.lazy)((() => s.e(6546).then(s.bind(s, 66546)))),
                        c = t.ContentMap((({content: e}) => e || ""));
                    this.View = (0, n.createComponent)(c, ((e, t) => r().createElement(i.Suspense, {fallback: r().createElement("div", null, a.e.FullAnswer.suspenseLoadingText)}, r().createElement(o, {content: t}))))
                }
            }
        }, 26362: (e, t, s) => {
            "use strict";
            s.d(t, {t: () => a});
            var i = s(6736), r = s.n(i), n = s(79902);
            const a = () => r().createElement(n.WidgetStub.Interactive.Container, {
                className: "bg-white rounded-s",
                title: "Заполнение пропусков",
                subtitle: "Автор ещё не добавил сюда материал"
            }, r().createElement(n.WidgetStub.Interactive.Skeleton, {className: "flex justify-evenly"}, r().createElement(n.WidgetStub.Interactive.Skeleton, {className: "flex-shrink w-[140px] bg-white rounded-sm"}), r().createElement(n.WidgetStub.Interactive.Skeleton, {className: "flex-shrink w-[100px] bg-white rounded-sm"}), r().createElement(n.WidgetStub.Interactive.Skeleton, {className: "flex-shrink w-[140px] bg-white rounded-sm"})))
        }
    }]);
})();