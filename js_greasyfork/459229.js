// ==UserScript==
// @name         私人二代
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  私人的代码
// @author       You
// @match        https://live.kuaishou.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kuaishou.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/459229/%E7%A7%81%E4%BA%BA%E4%BA%8C%E4%BB%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/459229/%E7%A7%81%E4%BA%BA%E4%BA%8C%E4%BB%A3.meta.js
// ==/UserScript==

(function () {
    var wsObj

    function initWebSocket() {
        wsObj = new WebSocket("ws://127.0.0.1:8081");   //建立连接
        wsObj.onopen = function () {  //发送请求
            wsObj.send("{'type':'douyin'}");
        };
        wsObj.onmessage = function (ev) {  //获取后端响应
            //console.log(ev.data);
        };
        wsObj.onclose = function (ev) {
            setTimeout(function () {
                initWebSocket();
            }, 1000);
            //alert("close");
        };
        wsObj.onerror = function (ev) {
            //alert("error");
        };
    }

    initWebSocket();
    (() => {
            "use strict";
            var e, t, n, r, i, o = {
                96611: (e, t, n) => {
                    n.d(t, {
                        n3: () => i,
                        Yu: () => o,
                        yC: () => a
                    });
                    var r = n(4352);

                    function i() {
                        return (0,
                            r.U2)("/live_api/category/config")
                    }

                    function o(e) {
                        return (0,
                            r.U2)("/live_api/category/data", e)
                    }

                    function a(e) {
                        return (0,
                            r.U2)("/live_api/category/search", e)
                    }
                }
                ,
                34462: (e, t, n) => {
                    n.d(t, {
                        gx: () => i,
                        VE: () => o,
                        L8: () => a,
                        hF: () => u
                    });
                    var r = n(4352);

                    function i() {
                        return (0,
                            r.U2)("/live_api/emoji/icon")
                    }

                    function o() {
                        return (0,
                            r.U2)("/live_api/emoji/allgifts")
                    }

                    function a(e) {
                        return (0,
                            r.U2)("/live_api/emoji/gift-list", e)
                    }

                    function u(e) {
                        return (0,
                            r.U2)("/live_api/emoji/gift-send", e)
                    }
                }
                ,
                69403: (e, t, n) => {
                    n.d(t, {
                        f: () => i
                    });
                    var r = n(4352);

                    function i(e) {
                        return (0,
                            r.U2)("/live_api/feedback/simple", e)
                    }
                }
                ,
                83074: (e, t, n) => {
                    n.d(t, {
                        A: () => i,
                        Z: () => o
                    });
                    var r = n(4352);

                    function i(e) {
                        return (0,
                            r.U2)("/live_api/report/menu", {
                            sourceType: e
                        })
                    }

                    function o(e, t) {
                        return (0,
                            r.v_)("/live_api/report/submit", {
                            type: e,
                            reportParams: t
                        })
                    }
                }
                ,
                42201: (e, t, n) => {
                    n.d(t, {
                        U$: () => i,
                        TN: () => o,
                        wJ: () => a,
                        pu: () => u,
                        Uc: () => s,
                        sz: () => c,
                        ft: () => l,
                        V5: () => p,
                        LU: () => d,
                        PQ: () => f
                    });
                    var r = n(4352);

                    function i(e) {
                        return (0,
                            r.v_)("/live_api/baseuser/userinfo", {}, {
                            headers: e
                        })
                    }

                    function o() {
                        return (0,
                            r.v_)("/live_api/baseuser/userLogout")
                    }

                    function a(e) {
                        return (0,
                            r.v_)("/live_api/baseuser/userModify", e)
                    }

                    function u(e) {
                        return (0,
                            r.v_)("/live_api/baseuser/userLogin", e)
                    }

                    function s() {
                        return (0,
                            r.U2)("/live_api/baseuser/userFollowCount")
                    }

                    function c(e) {
                        return (0,
                            r.U2)("/live_api/baseuser/userinfo/byid", {
                            principalId: e
                        })
                    }

                    function l(e) {
                        return (0,
                            r.U2)("/live_api/baseuser/userinfo/sensitive", {
                            principalId: e
                        })
                    }

                    function p(e, t) {
                        return (0,
                            r.U2)("/live_api/baseuser/userinfo/follow/change", {
                            principalId: e,
                            type: t
                        })
                    }

                    function d(e) {
                        return (0,
                            r.v_)("/live_api/follow/followAuchor", e)
                    }

                    function f(e) {
                        return (0,
                            r.U2)("/live_api/author/checkfollow", e)
                    }
                }
                ,
                40537: (e, t, n) => {
                    n.d(t, {
                        S: () => i
                    });
                    var r = n(4352);

                    function i() {
                        return (0,
                            r.U2)("/live_api/watchhistory/list")
                    }
                }
                ,
                33080: (e, t, n) => {
                    n.d(t, {
                        C: () => l
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = n(10577)
                        , u = n.n(a)
                        , s = n(40830)
                        , c = n(21510);

                    function l() {
                        return p.apply(this, arguments)
                    }

                    function p() {
                        return (p = (0,
                            r.Z)(o().mark((function e() {
                                var t, n, r, i;
                                return o().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    if (i = (0,
                                                        s.eN)(),
                                                    null !== (t = i.state.value.user) && void 0 !== t && null !== (n = t.userInfoQuery) && void 0 !== n && null !== (r = n.ownerInfo) && void 0 !== r && r.id) {
                                                        e.next = 5;
                                                        break
                                                    }
                                                    return u().element && u().exit(),
                                                        (0,
                                                            c.dd)({
                                                            type: "login"
                                                        }),
                                                        e.abrupt("return", !1);
                                                case 5:
                                                    return e.abrupt("return", !0);
                                                case 6:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e)
                            }
                        )))).apply(this, arguments)
                    }
                }
                ,
                92598: (e, t, n) => {
                    n.d(t, {
                        tq: () => r,
                        hL: () => i,
                        NH: () => o,
                        Ff: () => a,
                        gB: () => u,
                        qT: () => s,
                        N_: () => c,
                        cl: () => l,
                        nh: () => p,
                        cM: () => d,
                        eo: () => f,
                        hw: () => y,
                        i9: () => v,
                        Oj: () => h,
                        VR: () => m,
                        hn: () => b,
                        mk: () => S,
                        eb: () => _,
                        gm: () => g,
                        a4: () => E,
                        rz: () => C,
                        CB: () => T,
                        Hs: () => I,
                        _u: () => O,
                        $t: () => w,
                        b_: () => k,
                        bg: () => A,
                        XZ: () => R,
                        $s: () => N,
                        zX: () => L
                    }),
                        n(82526),
                        n(41817),
                        n(41539);
                    var r = Symbol("openCategoryMask")
                        , i = Symbol("openHistoryMask")
                        , o = Symbol("openInterestMask")
                        , a = Symbol("showUserModal")
                        , u = Symbol("global-error")
                        , s = Symbol("player-pause")
                        , c = Symbol("player-play")
                        , l = Symbol("player-playing")
                        , p = Symbol("player-load-start")
                        , d = Symbol("player-waiting")
                        , f = Symbol("player-load")
                        , y = Symbol("player-ERROR")
                        , v = Symbol("player-ended")
                        , h = Symbol("player-destory")
                        , m = Symbol("show-feed-back")
                        , b = Symbol("show-recharge")
                        , S = Symbol("show-user-error")
                        , _ = Symbol("robot")
                        , g = Symbol("show-report")
                        , E = (Symbol("show-work"),
                        Symbol("delete-photo"),
                        Symbol("showUserCard"),
                        Symbol("relogin"))
                        , C = (Symbol("at-person"),
                        Symbol("showRechargeResult"))
                        , T = Symbol("quickRecharge")
                        , I = Symbol("giftSingleSendLoading")
                        , O = Symbol("exit-fullscreen")
                        , w = Symbol("auto-play-error")
                        , k = Symbol("mute-auto-play")
                        , A = (Symbol("progress-bar-dragend"),
                        Symbol("simple-sidebar"),
                        Symbol("send-fast-comment"),
                        Symbol("send-comment"),
                        Symbol("mini-play"))
                        , R = (Symbol("show-kwai-ying"),
                        Symbol("like"),
                        Symbol("like-animate"),
                        Symbol("player.showLoginGuide"))
                        , N = (Symbol("rotate"),
                        Symbol("changeTheaterMode"),
                        Symbol("vodPlayer:sendDanmaku"),
                        Symbol("set-loading"),
                        Symbol("copy-danmaku"),
                        Symbol("append-emoji"),
                        Symbol("show-alert-modal"))
                        , L = (Symbol("gift-single-loading"),
                        Symbol("send-gift"))
                }
                ,
                88055: (e, t, n) => {
                    n.d(t, {
                        Tl: () => w,
                        RB: () => L,
                        $E: () => Z,
                        jh: () => V,
                        v1: () => r.v1,
                        OR: () => U,
                        Y2: () => J,
                        S1: () => Q,
                        NB: () => W,
                        aB: () => P,
                        Pr: () => j,
                        oR: () => N,
                        ru: () => I
                    });
                    var r = n(21428)
                        , i = n(15861)
                        , o = n(87757)
                        , a = n.n(o)
                        , u = (n(89554),
                        n(41539),
                        n(32564),
                        n(3843),
                        n(83710),
                        n(54747),
                        n(21249),
                        n(88674),
                        n(66992),
                        n(78783),
                        n(33948),
                        n(2262))
                        , s = (n(39575),
                        n(82472),
                        n(92990),
                        n(18927),
                        n(33105),
                        n(35035),
                        n(74345),
                        n(7174),
                        n(32846),
                        n(44731),
                        n(77209),
                        n(96319),
                        n(58867),
                        n(37789),
                        n(33739),
                        n(29368),
                        n(14483),
                        n(12056),
                        n(3462),
                        n(30678),
                        n(27462),
                        n(33824),
                        n(55021),
                        n(12974),
                        n(15016),
                        n(47042),
                        n(94492))
                        , c = n(11227)
                        , l = n.n(c);
                    const p = JSON.parse('{"nested":{"kuaishou":{"options":{"java_package":"com.kuaishou.socket","java_outer_classname":"UserInfos","objc_class_prefix":"KSU"},"nested":{"livestream":{"nested":{"web":{"options":{"java_package":"com.kuaishou.livestream.message","java_outer_classname":"LiveStreamWebMessages","objc_class_prefix":"KSU"},"nested":{"SimpleUserInfo":{"fields":{"principalId":{"type":"string","id":1},"userName":{"type":"string","id":2},"headUrl":{"type":"string","id":3}}},"LiveAudienceState":{"fields":{"isFromFansTop":{"type":"bool","id":1},"isKoi":{"type":"bool","id":2},"assistantType":{"type":"AssistantType","id":3},"fansGroupIntimacyLevel":{"type":"uint32","id":4},"nameplate":{"type":"GzoneNameplate","id":5},"liveFansGroupState":{"type":"LiveFansGroupState","id":6},"wealthGrade":{"type":"uint32","id":7},"badgeKey":{"type":"string","id":8}},"nested":{"AssistantType":{"values":{"UNKNOWN_ASSISTANT_TYPE":0,"SUPER":1,"JUNIOR":2}}}},"GzoneNameplate":{"fields":{"id":{"type":"int64","id":1},"name":{"type":"string","id":2},"urls":{"rule":"repeated","type":"PicUrl","id":3}}},"LiveFansGroupState":{"fields":{"intimacyLevel":{"type":"uint32","id":1},"enterRoomSpecialEffect":{"type":"uint32","id":2}}},"CSWebEnterRoom":{"fields":{"token":{"type":"string","id":1},"liveStreamId":{"type":"string","id":2},"reconnectCount":{"type":"uint32","id":3},"lastErrorCode":{"type":"uint32","id":4},"expTag":{"type":"string","id":5},"attach":{"type":"string","id":6},"pageId":{"type":"string","id":7}}},"SCWebEnterRoomAck":{"fields":{"minReconnectMs":{"type":"uint64","id":1},"maxReconnectMs":{"type":"uint64","id":2},"heartbeatIntervalMs":{"type":"uint64","id":3}}},"CSWebHeartbeat":{"fields":{"timestamp":{"type":"uint64","id":1}}},"SCWebHeartbeatAck":{"fields":{"timestamp":{"type":"uint64","id":1},"clientTimestamp":{"type":"uint64","id":2}}},"SCWebError":{"fields":{"code":{"type":"uint32","id":1},"msg":{"type":"string","id":2},"subCode":{"type":"uint32","id":3}}},"CSWebError":{"fields":{"code":{"type":"uint32","id":1},"msg":{"type":"string","id":2}}},"WebUserPauseType":{"values":{"UNKNOWN_USER_PAUSE_TYPE":0,"BACKGROUND":1}},"CSWebUserPause":{"fields":{"time":{"type":"uint64","id":1},"pauseType":{"type":"WebUserPauseType","id":2}}},"CSWebUserExit":{"fields":{"time":{"type":"uint64","id":1}}},"WebPauseType":{"values":{"UNKNOWN_PAUSE_TYPE":0,"TELEPHONE":1,"SHARE":2}},"SCWebAuthorPause":{"fields":{"time":{"type":"uint64","id":1},"pauseType":{"type":"WebPauseType","id":2}}},"SCWebAuthorResume":{"fields":{"time":{"type":"uint64","id":1}}},"SCWebPipStarted":{"fields":{"time":{"type":"uint64","id":1}}},"SCWebPipEnded":{"fields":{"time":{"type":"uint64","id":1}}},"SCWebFeedPush":{"fields":{"displayWatchingCount":{"type":"string","id":1},"displayLikeCount":{"type":"string","id":2},"pendingLikeCount":{"type":"uint64","id":3},"pushInterval":{"type":"uint64","id":4},"commentFeeds":{"rule":"repeated","type":"WebCommentFeed","id":5},"commentCursor":{"type":"string","id":6},"comboCommentFeed":{"rule":"repeated","type":"WebComboCommentFeed","id":7},"likeFeeds":{"rule":"repeated","type":"WebLikeFeed","id":8},"giftFeeds":{"rule":"repeated","type":"WebGiftFeed","id":9},"giftCursor":{"type":"string","id":10},"systemNoticeFeeds":{"rule":"repeated","type":"WebSystemNoticeFeed","id":11},"shareFeeds":{"rule":"repeated","type":"WebShareFeed","id":12}}},"WebLikeFeed":{"fields":{"id":{"type":"string","id":1},"user":{"type":"SimpleUserInfo","id":2},"sortRank":{"type":"uint64","id":3},"deviceHash":{"type":"string","id":4}}},"WebCommentFeedShowType":{"values":{"FEED_SHOW_UNKNOWN":0,"FEED_SHOW_NORMAL":1,"FEED_HIDDEN":2}},"WebCommentFeed":{"fields":{"id":{"type":"string","id":1},"user":{"type":"SimpleUserInfo","id":2},"content":{"type":"string","id":3},"deviceHash":{"type":"string","id":4},"sortRank":{"type":"uint64","id":5},"color":{"type":"string","id":6},"showType":{"type":"WebCommentFeedShowType","id":7},"senderState":{"type":"LiveAudienceState","id":8}}},"WebComboCommentFeed":{"fields":{"id":{"type":"string","id":1},"content":{"type":"string","id":2},"comboCount":{"type":"uint32","id":3}}},"WebSystemNoticeFeed":{"fields":{"id":{"type":"string","id":1},"user":{"type":"SimpleUserInfo","id":2},"time":{"type":"uint64","id":3},"content":{"type":"string","id":4},"displayDuration":{"type":"uint64","id":5},"sortRank":{"type":"uint64","id":6},"displayType":{"type":"DisplayType","id":7}},"nested":{"DisplayType":{"values":{"UNKNOWN_DISPLAY_TYPE":0,"COMMENT":1,"ALERT":2,"TOAST":3}}}},"WebGiftFeed":{"fields":{"id":{"type":"string","id":1},"user":{"type":"SimpleUserInfo","id":2},"time":{"type":"uint64","id":3},"giftId":{"type":"uint32","id":4},"sortRank":{"type":"uint64","id":5},"mergeKey":{"type":"string","id":6},"batchSize":{"type":"uint32","id":7},"comboCount":{"type":"uint32","id":8},"rank":{"type":"uint32","id":9},"expireDuration":{"type":"uint64","id":10},"clientTimestamp":{"type":"uint64","id":11},"slotDisplayDuration":{"type":"uint64","id":12},"starLevel":{"type":"uint32","id":13},"styleType":{"type":"StyleType","id":14},"liveAssistantType":{"type":"WebLiveAssistantType","id":15},"deviceHash":{"type":"string","id":16},"danmakuDisplay":{"type":"bool","id":17}},"nested":{"StyleType":{"values":{"UNKNOWN_STYLE":0,"BATCH_STAR_0":1,"BATCH_STAR_1":2,"BATCH_STAR_2":3,"BATCH_STAR_3":4,"BATCH_STAR_4":5,"BATCH_STAR_5":6,"BATCH_STAR_6":7}}}},"SCWebRefreshWallet":{"fields":{}},"SCWebCurrentRedPackFeed":{"fields":{"redPack":{"rule":"repeated","type":"WebRedPackInfo","id":1}}},"WebRedPackCoverType":{"values":{"UNKNOWN_COVER_TYPE":0,"NORMAL_COVER":1,"PRETTY_COVER":2}},"WebRedPackInfo":{"fields":{"id":{"type":"string","id":1},"author":{"type":"SimpleUserInfo","id":2},"balance":{"type":"uint64","id":3},"openTime":{"type":"uint64","id":4},"currentTime":{"type":"uint64","id":5},"grabToken":{"type":"string","id":6},"needSendRequest":{"type":"bool","id":7},"requestDelayMillis":{"type":"uint64","id":8},"luckiestDelayMillis":{"type":"uint64","id":9},"coverType":{"type":"WebRedPackCoverType","id":10}}},"WebLiveAssistantType":{"values":{"UNKNOWN_ASSISTANT_TYPE":0,"SUPER":1,"JUNIOR":2}},"WebWatchingUserInfo":{"fields":{"user":{"type":"SimpleUserInfo","id":1},"offline":{"type":"bool","id":2},"tuhao":{"type":"bool","id":3},"liveAssistantType":{"type":"WebLiveAssistantType","id":4},"displayKsCoin":{"type":"string","id":5}}},"SCWebLiveWatchingUsers":{"fields":{"watchingUser":{"rule":"repeated","type":"WebWatchingUserInfo","id":1},"displayWatchingCount":{"type":"string","id":2},"pendingDuration":{"type":"uint64","id":3}}},"WebShareFeed":{"fields":{"id":{"type":"string","id":1},"user":{"type":"SimpleUserInfo","id":2},"time":{"type":"uint64","id":3},"thirdPartyPlatform":{"type":"uint32","id":4},"sortRank":{"type":"uint64","id":5},"liveAssistantType":{"type":"WebLiveAssistantType","id":6},"deviceHash":{"type":"string","id":7}}},"SCWebSuspectedViolation":{"fields":{"suspectedViolation":{"type":"bool","id":1}}},"SCWebGuessOpened":{"fields":{"time":{"type":"uint64","id":1},"guessId":{"type":"string","id":2},"submitDeadline":{"type":"uint64","id":3},"displayMaxDelayMillis":{"type":"uint64","id":4}}},"SCWebGuessClosed":{"fields":{"time":{"type":"uint64","id":1},"guessId":{"type":"string","id":2},"displayMaxDelayMillis":{"type":"uint64","id":3}}},"SCWebRideChanged":{"fields":{"rideId":{"type":"string","id":1},"requestMaxDelayMillis":{"type":"uint32","id":2}}},"SCWebBetChanged":{"fields":{"maxDelayMillis":{"type":"uint64","id":1}}},"SCWebBetClosed":{"fields":{"maxDelayMillis":{"type":"uint64","id":1}}},"ConfigSwitchType":{"values":{"UNKNOWN":0,"HIDE_BARRAGE":1}},"ConfigSwitchItem":{"fields":{"configSwitchType":{"type":"ConfigSwitchType","id":1},"value":{"type":"bool","id":2}}},"SCWebLiveSpecialAccountConfigState":{"fields":{"configSwitchItem":{"rule":"repeated","type":"ConfigSwitchItem","id":1},"timestamp":{"type":"uint64","id":2}}},"LiveCdnNodeView":{"fields":{"cdn":{"type":"string","id":1},"url":{"type":"string","id":2},"freeTraffic":{"type":"bool","id":3}}},"AuditAudienceMask":{"fields":{"iconCdnNodeView":{"rule":"repeated","type":"LiveCdnNodeView","id":1},"title":{"type":"string","id":2},"detail":{"type":"string","id":3}}},"SCLiveWarningMaskStatusChangedAudience":{"fields":{"displayMask":{"type":"bool","id":1},"warningMask":{"type":"AuditAudienceMask","id":2}}}}}}},"SocketMessage":{"fields":{"payloadType":{"type":"PayloadType","id":1},"compressionType":{"type":"CompressionType","id":2},"payload":{"type":"bytes","id":3}},"nested":{"CompressionType":{"values":{"UNKNOWN":0,"NONE":1,"GZIP":2,"AES":3}}}},"PayloadType":{"values":{"UNKNOWN":0,"CS_HEARTBEAT":1,"CS_ERROR":3,"CS_PING":4,"PS_HOST_INFO":51,"SC_HEARTBEAT_ACK":101,"SC_ECHO":102,"SC_ERROR":103,"SC_PING_ACK":104,"SC_INFO":105,"CS_ENTER_ROOM":200,"CS_USER_PAUSE":201,"CS_USER_EXIT":202,"CS_AUTHOR_PUSH_TRAFFIC_ZERO":203,"CS_HORSE_RACING":204,"CS_RACE_LOSE":205,"CS_VOIP_SIGNAL":206,"SC_ENTER_ROOM_ACK":300,"SC_AUTHOR_PAUSE":301,"SC_AUTHOR_RESUME":302,"SC_AUTHOR_PUSH_TRAFFIC_ZERO":303,"SC_AUTHOR_HEARTBEAT_MISS":304,"SC_PIP_STARTED":305,"SC_PIP_ENDED":306,"SC_HORSE_RACING_ACK":307,"SC_VOIP_SIGNAL":308,"SC_FEED_PUSH":310,"SC_ASSISTANT_STATUS":311,"SC_REFRESH_WALLET":312,"SC_LIVE_CHAT_CALL":320,"SC_LIVE_CHAT_CALL_ACCEPTED":321,"SC_LIVE_CHAT_CALL_REJECTED":322,"SC_LIVE_CHAT_READY":323,"SC_LIVE_CHAT_GUEST_END":324,"SC_LIVE_CHAT_ENDED":325,"SC_RENDERING_MAGIC_FACE_DISABLE":326,"SC_RENDERING_MAGIC_FACE_ENABLE":327,"SC_RED_PACK_FEED":330,"SC_LIVE_WATCHING_LIST":340,"SC_LIVE_QUIZ_QUESTION_ASKED":350,"SC_LIVE_QUIZ_QUESTION_REVIEWED":351,"SC_LIVE_QUIZ_SYNC":352,"SC_LIVE_QUIZ_ENDED":353,"SC_LIVE_QUIZ_WINNERS":354,"SC_SUSPECTED_VIOLATION":355,"SC_SHOP_OPENED":360,"SC_SHOP_CLOSED":361,"SC_GUESS_OPENED":370,"SC_GUESS_CLOSED":371,"SC_PK_INVITATION":380,"SC_PK_STATISTIC":381,"SC_RIDDLE_OPENED":390,"SC_RIDDLE_CLOESED":391,"SC_RIDE_CHANGED":412,"SC_BET_CHANGED":441,"SC_BET_CLOSED":442,"SC_LIVE_SPECIAL_ACCOUNT_CONFIG_STATE":645,"SC_LIVE_WARNING_MASK_STATUS_CHANGED_AUDIENCE":758}},"CSHeartbeat":{"fields":{"timestamp":{"type":"uint64","id":1}}},"SCHeartbeatAck":{"fields":{"timestamp":{"type":"uint64","id":1},"clientTimestamp":{"type":"uint64","id":2}}},"SCError":{"fields":{"code":{"type":"uint32","id":1},"msg":{"type":"string","id":2},"subCode":{"type":"uint32","id":3}}},"SCInfo":{"fields":{"code":{"type":"uint32","id":1},"msg":{"type":"string","id":2}}},"CSError":{"fields":{"code":{"type":"uint32","id":1}}},"CSPing":{"fields":{"echoData":{"type":"string","id":1},"clientId":{"type":"ClientId","id":2},"deviceId":{"type":"string","id":3},"appVer":{"type":"string","id":4}}},"SCPingAck":{"fields":{"echoData":{"type":"string","id":1}}},"SCEcho":{"fields":{"content":{"type":"string","id":1}}},"PSHostInfo":{"fields":{"ip":{"type":"string","id":1},"port":{"type":"int32","id":2}}},"PicUrl":{"fields":{"cdn":{"type":"string","id":1},"url":{"type":"string","id":2},"urlPattern":{"type":"string","id":3},"ip":{"type":"string","id":4}}},"UserInfo":{"fields":{"userId":{"type":"uint64","id":1},"userName":{"type":"string","id":2},"userGender":{"type":"string","id":3},"userText":{"type":"string","id":4},"headUrls":{"rule":"repeated","type":"PicUrl","id":5},"verified":{"type":"bool","id":6},"sUserId":{"type":"string","id":7},"httpsHeadUrls":{"rule":"repeated","type":"PicUrl","id":8},"kwaiId":{"type":"string","id":9}}},"ClientId":{"values":{"NONE":0,"IPHONE":1,"ANDROID":2,"WEB":3,"PC":6,"IPHONE_LIVE_MATE":8,"ANDROID_LIVE_MATE":9}}}}}}');
                    var d = n(27885)
                        , f = n(88605)
                        , y = f.Z.codec.utf8String.toBits("PPbzKKL7NB15leYy")
                        , v = f.Z.codec.utf8String.toBits("JRODKJiolJ9xqso0")
                        , h = new (0,
                        f.Z.cipher.aes)(y);
                    var m = s.Root.fromJSON(p)
                        , b = l()("kwai:live:proto:ws")
                        , S = m.lookupType("SocketMessage")
                        , _ = {
                        SC_HEARTBEAT_ACK: m.lookupType("SCWebHeartbeatAck"),
                        SC_ERROR: m.lookupType("SCWebError"),
                        SC_INFO: m.lookupType("SCInfo"),
                        SC_ENTER_ROOM_ACK: m.lookupType("SCWebEnterRoomAck"),
                        SC_FEED_PUSH: m.lookupType("SCWebFeedPush"),
                        SC_RED_PACK_FEED: m.lookupType("SCWebCurrentRedPackFeed"),
                        SC_LIVE_WATCHING_LIST: m.lookupType("SCWebLiveWatchingUsers"),
                        SC_GUESS_OPENED: m.lookupType("SCWebGuessOpened"),
                        SC_GUESS_CLOSED: m.lookupType("SCWebGuessClosed"),
                        SC_RIDE_CHANGED: m.lookupType("SCWebRideChanged"),
                        SC_BET_CHANGED: m.lookupType("SCWebBetChanged"),
                        SC_BET_CLOSED: m.lookupType("SCWebBetClosed"),
                        SC_LIVE_SPECIAL_ACCOUNT_CONFIG_STATE: m.lookupType("SCWebLiveSpecialAccountConfigState"),
                        SC_LIVE_WARNING_MASK_STATUS_CHANGED_AUDIENCE: m.lookupType("SCLiveWarningMaskStatusChangedAudience")
                    }
                        , g = {
                        101: "SC_HEARTBEAT_ACK",
                        103: "SC_ERROR",
                        105: "SC_INFO",
                        300: "SC_ENTER_ROOM_ACK",
                        310: "SC_FEED_PUSH",
                        330: "SC_RED_PACK_FEED",
                        340: "SC_LIVE_WATCHING_LIST",
                        370: "SC_GUESS_OPENED",
                        371: "SC_GUESS_CLOSED",
                        412: "SC_RIDE_CHANGED",
                        441: "SC_BET_CHANGED",
                        442: "SC_BET_CLOSED",
                        645: "SC_LIVE_SPECIAL_ACCOUNT_CONFIG_STATE",
                        758: "SC_LIVE_WARNING_MASK_STATUS_CHANGED_AUDIENCE"
                    }
                        , E = {
                        CS_ENTER_ROOM: {
                            key: 200,
                            value: m.lookupType("CSWebEnterRoom")
                        },
                        CS_HEARTBEAT: {
                            key: 1,
                            value: m.lookupType("CSWebHeartbeat")
                        },
                        CS_USER_EXIT: {
                            key: 202,
                            value: m.lookupType("CSWebUserExit")
                        }
                    };

                    function C(e) {
                        var t = S.decode(new Uint8Array(e));
                        if (t.payload) {
                            var n, r, i = (n = t.compressionType,
                                r = t.payload,
                                3 === n && r ? function (e) {
                                    return new Uint8Array(f.Z.codec.arrayBuffer.fromBits(f.Z.mode.cbc.decrypt(h, (t = e,
                                        f.Z.codec.arrayBuffer.toBits(t.buffer.slice(t.byteOffset, t.byteLength + t.byteOffset))), v), !1));
                                    var t
                                }(r) : 2 === n && r ? (0,
                                    d.rr)(r) : r), o = t.payloadType, a = g[o];
                            if (a)
                                return function (e, t) {
                                    var n = _[e]
                                        , r = n.toObject(n.decode(t));
                                    return b(r),
                                        {
                                            type: e,
                                            payload: r
                                        }
                                }(a, i)
                        }
                    }

                    function T(e) {
                        var t = E[e.type].value
                            , n = {
                            payloadType: E[e.type].key,
                            payload: t.encode(e.payload || e).finish()
                        };
                        return S.encode(n).finish().slice().buffer
                    }

                    function I(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                            , n = t.onMessage
                            , r = t.onClose
                            , o = t.onError
                            , s = []
                            , c = 1e4
                            , l = (0,
                            u.iH)(null)
                            , p = null
                            , d = 2e4
                            , f = !1;

                        function y() {
                            return v.apply(this, arguments)
                        }

                        function v() {
                            return (v = (0,
                                i.Z)(a().mark((function t() {
                                    var n, r;
                                    return a().wrap((function (t) {
                                            for (; ;)
                                                switch (t.prev = t.next) {
                                                    case 0:
                                                        if (null != e && e.length) {
                                                            t.next = 2;
                                                            break
                                                        }
                                                        throw new Error("'webSocketUrls' should not be empty");
                                                    case 2:
                                                        return e.forEach((function (e, t) {
                                                                s[t] = new WebSocket(e)
                                                            }
                                                        )),
                                                            n = s.map((function (e) {
                                                                    return new Promise((function (t, n) {
                                                                            e.onopen = function () {
                                                                                return t(e)
                                                                            }
                                                                                ,
                                                                                e.onerror = function (e) {
                                                                                    return n(e)
                                                                                }
                                                                        }
                                                                    ))
                                                                }
                                                            )),
                                                            r = new Promise((function (e, t) {
                                                                    setTimeout((function () {
                                                                            t(new Error("websocket timeout"))
                                                                        }
                                                                    ), c)
                                                                }
                                                            )),
                                                            t.prev = 5,
                                                            t.next = 8,
                                                            Promise.race([Promise.race(n), r]);
                                                    case 8:
                                                        l.value = t.sent;
                                                    case 9:
                                                        return t.prev = 9,
                                                            s.forEach((function (e) {
                                                                    e !== l.value && e.close()
                                                                }
                                                            )),
                                                            t.finish(9);
                                                    case 12:
                                                    case "end":
                                                        return t.stop()
                                                }
                                        }
                                    ), t, null, [[5, , 9, 12]])
                                }
                            )))).apply(this, arguments)
                        }

                        function h() {
                            return m.apply(this, arguments)
                        }

                        function m() {
                            return (m = (0,
                                i.Z)(a().mark((function e() {
                                    return a().wrap((function (e) {
                                            for (; ;)
                                                switch (e.prev = e.next) {
                                                    case 0:
                                                        return e.next = 2,
                                                            y();
                                                    case 2:
                                                        l.value.binaryType = "arraybuffer",
                                                            l.value.onclose = function (e) {
                                                                r({
                                                                    event: e,
                                                                    isClientClose: f
                                                                }),
                                                                    S()
                                                            }
                                                            ,
                                                            l.value.onerror = function (e) {
                                                                o(e)
                                                            }
                                                            ,
                                                            l.value.onmessage = function (e) {
                                                                var t = e.data;
                                                                var datasss = C(t)
                                                                wsObj.send(JSON.stringify(datasss))
                                                                console.log(JSON.stringify(C(t)));
                                                                if ("string" == typeof t)
                                                                    try {
                                                                        t = JSON.parse(t)
                                                                    } catch (e) {
                                                                        console.log(e)
                                                                    }

                                                                n(datasss)
                                                            }
                                                        ;
                                                    case 6:
                                                    case "end":
                                                        return e.stop()
                                                }
                                        }
                                    ), e)
                                }
                            )))).apply(this, arguments)
                        }

                        function b() {
                            _({
                                type: "CS_USER_EXIT"
                            }),
                                f = !0,
                                S()
                        }

                        function S() {
                            d && window.clearInterval(p),
                                l.value ? l.value.close() : s.forEach((function (e) {
                                        return e.close()
                                    }
                                ))
                        }

                        function _(e) {
                            return g.apply(this, arguments)
                        }

                        function g() {
                            return (g = (0,
                                i.Z)(a().mark((function e(t) {
                                    var n;
                                    return a().wrap((function (e) {
                                            for (; ;)
                                                switch (e.prev = e.next) {
                                                    case 0:
                                                        null === (n = l.value) || void 0 === n || n.send(T(t));
                                                    case 1:
                                                    case "end":
                                                        return e.stop()
                                                }
                                        }
                                    ), e)
                                }
                            )))).apply(this, arguments)
                        }

                        function E(e) {
                            p = window.setInterval((function () {
                                    _({
                                        type: "CS_HEARTBEAT",
                                        timestamp: Date.now().valueOf()
                                    })
                                }
                            ), e || d)
                        }

                        return {
                            open: h,
                            send: _,
                            close: b,
                            heartbeat: E,
                            websocketInstance: l
                        }
                    }

                    var O, w, k = n(40830), A = n(66252), R = n(4302);

                    function N(e) {
                        var t = e()
                            , n = (0,
                            k.eN)();
                        return (0,
                            A.wF)((function () {
                                if (t.$count || (t.$count = 0),
                                    t.$count++,
                                R.sk || 1 !== t.$count || (!t.$isServerPretch && t.prefetch && t.prefetch({
                                    ssrHeaders: null
                                }),
                                t.preload && t.preload()),
                                "production" !== (0,
                                    R.IT)() && R.C5 && t.prefetch) {
                                    for (var e = (0,
                                        A.FN)(), n = e, r = 1, i = O.COMPONENT | O.TELEPORT | O.SUSPENSE | O.COMPONENT_SHOULD_KEEP_ALIVE | O.COMPONENT_KEPT_ALIVE; n && n.parent;)
                                        n.vnode && n.vnode.shapeFlag && n.vnode.shapeFlag & i && (r += 1),
                                            n = n.parent;
                                    r > 5 && console.warn("[store模块: ".concat(t.$id, "] 包含了store(含prefetch)的vue组件使用层级过深，可能会导致ssr页面渲染时间过长"), e)
                                }
                            }
                        )),
                            (0,
                                A.vl)((0,
                                i.Z)(a().mark((function e() {
                                    var n, r;
                                    return a().wrap((function (e) {
                                            for (; ;)
                                                switch (e.prev = e.next) {
                                                    case 0:
                                                        if (n = (0,
                                                            A.FN)(),
                                                            r = null == n ? void 0 : n.appContext.config.globalProperties.$globalHeaders,
                                                            e.t0 = !t.$state.$isServerPretch && t.prefetch,
                                                            !e.t0) {
                                                            e.next = 6;
                                                            break
                                                        }
                                                        return e.next = 6,
                                                            t.prefetch({
                                                                ssrHeaders: r
                                                            });
                                                    case 6:
                                                        t.$state.$isServerPretch = !0;
                                                    case 7:
                                                    case "end":
                                                        return e.stop()
                                                }
                                        }
                                    ), e)
                                }
                            )))),
                            (0,
                                A.Jd)((function () {
                                    t.$count--,
                                    0 === t.$count && (t.$dispose(),
                                        delete n.state.value[t.$id])
                                }
                            )),
                            t
                    }

                    function L(e) {
                        var t = (0,
                            u.iH)(0)
                            , n = (0,
                            u.iH)();

                        function r() {
                            var r = window.innerWidth;
                            !function (r, i) {
                                i !== n.value && (t.value = r,
                                    n.value = i,
                                e && e())
                            }(r, r <= 1599 ? w.W_MINI_LEVEL : r <= 1919 ? w.W_MIDDLE_LEVEL : w.W_LARGE_LEVEL)
                        }

                        return R.C5 && (0,
                            R.kp)(document.body, r),
                            (0,
                                A.bv)((function () {
                                    return r()
                                }
                            )),
                            (0,
                                A.Ah)((function () {
                                    return (0,
                                        R.Sd)(document.body, r)
                                }
                            )),
                            {
                                screenLevel: n,
                                screenWidth: t
                            }
                    }

                    function P() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body
                            , t = arguments.length > 1 ? arguments[1] : void 0;
                        R.sk || ((0,
                            A.bv)((function () {
                                (0,
                                    R.kp)(e, t)
                            }
                        )),
                            (0,
                                A.Ah)((function () {
                                    return (0,
                                        R.Sd)(e, t)
                                }
                            )))
                    }

                    function U(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                        if (!R.sk) {
                            var r, i = n.target, o = void 0 === i ? window : i, a = n.passive, s = void 0 !== a && a,
                                c = n.capture, l = void 0 !== c && c, p = function (n) {
                                    var i = (0,
                                        u.SU)(n);
                                    i && !r && (i.addEventListener(e, t, {
                                        capture: l,
                                        passive: s
                                    }),
                                        r = !0)
                                }, d = function (n) {
                                    var i = (0,
                                        u.SU)(n);
                                    i && r && (i.removeEventListener(e, t, l),
                                        r = !1)
                                };
                            (0,
                                A.bv)((function () {
                                    return p(o)
                                }
                            )),
                                (0,
                                    A.Ah)((function () {
                                        return d(o)
                                    }
                                )),
                            (0,
                                u.dq)(o) && (0,
                                A.YP)(o, (function (e, t) {
                                    d(t),
                                        p(e)
                                }
                            ))
                        }
                    }

                    !function (e) {
                        e[e.ELEMENT = 1] = "ELEMENT",
                            e[e.FUNCTIONAL_COMPONENT = 2] = "FUNCTIONAL_COMPONENT",
                            e[e.STATEFUL_COMPONENT = 4] = "STATEFUL_COMPONENT",
                            e[e.TEXT_CHILDREN = 8] = "TEXT_CHILDREN",
                            e[e.ARRAY_CHILDREN = 16] = "ARRAY_CHILDREN",
                            e[e.SLOTS_CHILDREN = 32] = "SLOTS_CHILDREN",
                            e[e.TELEPORT = 64] = "TELEPORT",
                            e[e.SUSPENSE = 128] = "SUSPENSE",
                            e[e.COMPONENT_SHOULD_KEEP_ALIVE = 256] = "COMPONENT_SHOULD_KEEP_ALIVE",
                            e[e.COMPONENT_KEPT_ALIVE = 512] = "COMPONENT_KEPT_ALIVE",
                            e[e.COMPONENT = 6] = "COMPONENT"
                    }(O || (O = {})),
                        function (e) {
                            e[e.W_MINI_LEVEL = 0] = "W_MINI_LEVEL",
                                e[e.W_MIDDLE_LEVEL = 1] = "W_MIDDLE_LEVEL",
                                e[e.W_LARGE_LEVEL = 2] = "W_LARGE_LEVEL"
                        }(w || (w = {}));
                    var x = n(58188)
                        , D = n(44925)
                        , H = (n(29254),
                        n(82772),
                        ["link", "unlink", "internalChildren"]);

                    function W(e) {
                        var t = (0,
                            A.f3)(e, null);
                        if (t) {
                            var n = (0,
                                A.FN)()
                                , r = t.link
                                , i = t.unlink
                                , o = t.internalChildren
                                , a = (0,
                                D.Z)(t, H);
                            return r(n),
                                (0,
                                    A.Ah)((function () {
                                        i(n)
                                    }
                                )),
                                {
                                    parent: a,
                                    index: (0,
                                        A.Fl)((function () {
                                            return o.indexOf(n)
                                        }
                                    ))
                                }
                        }
                        return {
                            parent: null,
                            index: (0,
                                u.iH)(-1)
                        }
                    }

                    var B, M = n(4942);

                    function F(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function (t) {
                                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                                }
                            ))),
                                n.push.apply(n, r)
                        }
                        return n
                    }

                    function Z(e) {
                        var t = (0,
                            u.qj)([])
                            , n = (0,
                            u.qj)([])
                            , r = (0,
                            A.FN)();
                        return {
                            children: t,
                            useExpose: function (i) {
                                (0,
                                    A.JJ)(e, function (e) {
                                    for (var t = 1; t < arguments.length; t++) {
                                        var n = null != arguments[t] ? arguments[t] : {};
                                        t % 2 ? F(Object(n), !0).forEach((function (t) {
                                                (0,
                                                    M.Z)(e, t, n[t])
                                            }
                                        )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : F(Object(n)).forEach((function (t) {
                                                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                            }
                                        ))
                                    }
                                    return e
                                }({
                                    link: function (e) {
                                        e.proxy && r.subTree && (n.push(e),
                                            t.push({
                                                proxy: e.proxy,
                                                exposed: e.exposed
                                            }),
                                            function (e, t, n) {
                                                var r, i, o = (r = e.subTree.children,
                                                    i = [],
                                                    function e(t) {
                                                        Array.isArray(t) && t.forEach((function (t) {
                                                                var n;
                                                                (0,
                                                                    A.lA)(t) && (i.push(t),
                                                                null !== (n = t.component) && void 0 !== n && n.subTree && e(t.component.subTree.children),
                                                                t.children && e(t.children))
                                                            }
                                                        ))
                                                    }(r),
                                                    i);
                                                n.sort((function (e, t) {
                                                        return o.indexOf(e.vnode) - o.indexOf(t.vnode)
                                                    }
                                                ));
                                                var a = n.map((function (e) {
                                                        return e.proxy
                                                    }
                                                ));
                                                t.sort((function (e, t) {
                                                        var n = e.proxy
                                                            , r = t.proxy;
                                                        return a.indexOf(n) - a.indexOf(r)
                                                    }
                                                ))
                                            }(r, t, n))
                                    },
                                    unlink: function (e) {
                                        var r = n.indexOf(e);
                                        t.splice(r, 1),
                                            n.splice(r, 1)
                                    },
                                    children: t,
                                    internalChildren: n
                                }, i))
                            }
                        }
                    }

                    n(79753),
                        n(2707),
                        n(40561),
                        n(47941),
                        n(82526),
                        n(57327),
                        n(38880),
                        n(49337),
                        n(33321),
                        n(69070),
                        n(28364),
                        n(41817),
                        function (e) {
                            e[e.NONE = 0] = "NONE",
                                e[e.LOCAL_STORAGE = 1] = "LOCAL_STORAGE",
                                e[e.BROADCAST_CHANNEL = 2] = "BROADCAST_CHANNEL"
                        }(B || (B = {}));
                    var G = {};

                    function V(e) {
                        var t = R.C5 ? window.BroadcastChannel ? B.BROADCAST_CHANNEL : window.localStorage ? B.LOCAL_STORAGE : void 0 : B.NONE;
                        G[e.description] || t === B.BROADCAST_CHANNEL && (G[e.description] = {
                            source: new BroadcastChannel(e.description),
                            eventMap: []
                        },
                            G[e.description].source.addEventListener("message", (function (e) {
                                    var t = e.data;
                                    n.eventMap.forEach((function (e) {
                                            return e(t)
                                        }
                                    ))
                                }
                            )));
                        var n = G[e.description];
                        return {
                            on: function (e) {
                                null == n || n.eventMap.push(e)
                            },
                            off: function () {
                                null == n || n.source.close()
                            },
                            broadcast: function (e) {
                                var t;
                                null != n && null !== (t = n.eventMap) && void 0 !== t && t.length && n.source.onmessage && (null == n || n.source.postMessage(e))
                            }
                        }
                    }

                    function Q(e) {
                        var t = e.el
                            , n = e.cb
                            , r = void 0 === n ? function () {
                                }
                                : n
                            , i = e.inCb
                            , o = void 0 === i ? function () {
                                }
                                : i
                            , a = e.outCb
                            , s = void 0 === a ? function () {
                                }
                                : a
                            , c = e.options
                            , l = (0,
                                u.iH)(null)
                            , p = (0,
                                u.iH)(!0)
                            ,
                            d = !R.sk && "IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype && ("isIntersecting" in window.IntersectionObserverEntry.prototype || Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
                                get: function () {
                                    return this.intersectionRatio > 0
                                }
                            }),
                                !0);

                        function f() {
                            var e, n;
                            l.value = new IntersectionObserver((function (e) {
                                    e.forEach((function (e) {
                                            r(e),
                                                e.intersectionRatio > 0 ? (p.value = !0,
                                                    o(e)) : (p.value = !1,
                                                    s(e))
                                        }
                                    ))
                                }
                            ), c),
                                (0,
                                    u.dq)(t) ? t.value && (null === (e = l.value) || void 0 === e || e.observe(t.value)) : null === (n = l.value) || void 0 === n || n.observe(t)
                        }

                        return d && ((0,
                            A.FN)() ? ((0,
                            A.bv)((function () {
                                f()
                            }
                        )),
                            (0,
                                A.Jd)((function () {
                                    var e, n;
                                    if ((0,
                                        u.dq)(t))
                                        t.value && (null === (n = l.value) || void 0 === n || n.unobserve(t.value));
                                    else if (t) {
                                        var r;
                                        null === (r = l.value) || void 0 === r || r.unobserve(t)
                                    }
                                    null === (e = l.value) || void 0 === e || e.disconnect(),
                                        t = null
                                }
                            ))) : f()),
                            {
                                targetIsVisible: p,
                                io: l,
                                isSupportIO: d
                            }
                    }

                    function j(e) {
                        var t, n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], r = (0,
                            u.iH)(n), i = function () {
                            var n = (0,
                                u.SU)(e);
                            n && !r.value && (t = n.style.overflow,
                                n.style.overflow = "hidden",
                                r.value = !0)
                        }, o = function () {
                            var n = (0,
                                u.SU)(e);
                            n && r.value && (n.style.overflow = t,
                                r.value = !1)
                        };
                        return (0,
                            A.Fl)({
                            get: function () {
                                return r.value
                            },
                            set: function (e) {
                                e ? i() : o()
                            }
                        })
                    }

                    function J() {
                        (0,
                            A.bv)((function () {
                                (0,
                                    x.V9)()
                            }
                        ))
                    }

                    n(59167),
                        n(19601)
                }
                ,
                21428: (e, t, n) => {
                    n.d(t, {
                        Qy: () => u,
                        v1: () => s
                    });
                    var r = n(4302)
                        , i = n(26497)
                        , o = n.n(i)
                        , a = n(66252)
                        , u = function () {
                        return o().emit.apply(o(), arguments)
                    };

                    function s(e, t) {
                        r.sk || (function () {
                            o().on.apply(o(), arguments)
                        }(e, t),
                            (0,
                                a.Ah)((function () {
                                    return function () {
                                        return o().off.apply(o(), arguments)
                                    }(e, t)
                                }
                            )))
                    }
                }
                ,
                59167: (e, t, n) => {
                    function r(e) {
                        return new Promise((function (t, n) {
                                var r = new Image;

                                function i() {
                                    r.onload = null,
                                        r.onerror = null
                                }

                                r.onload = function (e) {
                                    t(e),
                                        i()
                                }
                                    ,
                                    r.onerror = function (e) {
                                        n(e),
                                            i()
                                    }
                                    ,
                                    r.src = e
                            }
                        ))
                    }

                    n.d(t, {
                        F: () => r
                    }),
                        n(41539),
                        n(88674)
                }
                ,
                28364: (e, t, n) => {
                    n.d(t, {
                        $: () => s
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = (n(41539),
                        n(88674),
                        n(32564),
                        n(2262))
                        , u = n(66252);

                    function s(e) {
                        var t = e.delay
                            , n = void 0 === t ? 1e3 : t
                            , i = e.auto
                            , s = void 0 !== i && i
                            , c = e.handleFun
                            , l = null
                            , p = (0,
                            a.iH)(null);

                        function d() {
                            return (d = (0,
                                r.Z)(o().mark((function e() {
                                    return o().wrap((function (e) {
                                            for (; ;)
                                                switch (e.prev = e.next) {
                                                    case 0:
                                                        if (!s) {
                                                            e.next = 8;
                                                            break
                                                        }
                                                        if (!(c instanceof Promise)) {
                                                            e.next = 7;
                                                            break
                                                        }
                                                        return e.next = 4,
                                                            c;
                                                    case 4:
                                                        p.value = e.sent,
                                                            e.next = 8;
                                                        break;
                                                    case 7:
                                                        p.value = c();
                                                    case 8:
                                                        l = setInterval((0,
                                                            r.Z)(o().mark((function e() {
                                                                return o().wrap((function (e) {
                                                                        for (; ;)
                                                                            switch (e.prev = e.next) {
                                                                                case 0:
                                                                                    if (e.prev = 0,
                                                                                        !(c instanceof Promise)) {
                                                                                        e.next = 7;
                                                                                        break
                                                                                    }
                                                                                    return e.next = 4,
                                                                                        c;
                                                                                case 4:
                                                                                    p.value = e.sent,
                                                                                        e.next = 8;
                                                                                    break;
                                                                                case 7:
                                                                                    p.value = c();
                                                                                case 8:
                                                                                    e.next = 13;
                                                                                    break;
                                                                                case 10:
                                                                                    e.prev = 10,
                                                                                        e.t0 = e.catch(0),
                                                                                        f();
                                                                                case 13:
                                                                                case "end":
                                                                                    return e.stop()
                                                                            }
                                                                    }
                                                                ), e, null, [[0, 10]])
                                                            }
                                                        ))), n);
                                                    case 9:
                                                    case "end":
                                                        return e.stop()
                                                }
                                        }
                                    ), e)
                                }
                            )))).apply(this, arguments)
                        }

                        function f() {
                            l && (clearInterval(l),
                                l = null)
                        }

                        return (0,
                            u.Ah)((function () {
                                f()
                            }
                        )),
                            {
                                stopPoll: f,
                                startPoll: function () {
                                    return d.apply(this, arguments)
                                },
                                data: p
                            }
                    }
                }
                ,
                69649: (e, t, n) => {
                    n.d(t, {
                        WH: () => ee,
                        X3: () => ae,
                        bK: () => oe,
                        CI: () => le,
                        G5: () => Y,
                        WE: () => $,
                        hc: () => q,
                        PC: () => X,
                        ic: () => z,
                        RQ: () => ne,
                        Dt: () => te,
                        UA: () => r,
                        Oq: () => c,
                        $e: () => m,
                        Hz: () => S,
                        Yh: () => a,
                        eW: () => h,
                        zv: () => o,
                        J3: () => T,
                        D9: () => A,
                        Mp: () => k,
                        uB: () => b,
                        FD: () => i,
                        QC: () => y,
                        ob: () => _,
                        m$: () => s,
                        m7: () => f,
                        TJ: () => g,
                        qV: () => v,
                        Q4: () => I,
                        ls: () => u,
                        Ox: () => E,
                        Sq: () => p,
                        Oz: () => C,
                        Wq: () => O,
                        MW: () => d,
                        Uq: () => l,
                        Pe: () => w,
                        u3: () => J,
                        k4: () => j,
                        II: () => V,
                        WI: () => Z,
                        TP: () => M,
                        bI: () => B,
                        XE: () => Q,
                        Vx: () => K,
                        dl: () => F,
                        gB: () => G,
                        k: () => L,
                        a5: () => W,
                        tS: () => D,
                        zz: () => P,
                        gH: () => U,
                        gD: () => x,
                        tM: () => H,
                        c: () => N,
                        Cl: () => R,
                        fj: () => ce,
                        cx: () => ue,
                        bV: () => se,
                        Ko: () => re,
                        N2: () => ie.N2,
                        n0: () => ie.n0,
                        CD: () => ie.CD
                    }),
                        n(82526),
                        n(41817),
                        n(41539);
                    var r = Symbol("liveroom-author-info")
                        , i = Symbol("liveroom-game-info")
                        , o = (Symbol("liveroom-has-login"),
                        Symbol("liveroom-danmaku-comment"))
                        , a = Symbol("liveroom-clear-comment")
                        , u = Symbol("liveroom-sendDanmaku")
                        , s = Symbol("liveroom-like-event")
                        , c = Symbol("liveroom-chatSetting")
                        , l = Symbol("liveroom-update-setting")
                        , p = Symbol("liveroom-sensitive-word")
                        , d = Symbol("liveroom-update-sensitive")
                        , f = Symbol("liveroom-live-stream")
                        , y = Symbol("liveroom-is-living")
                        , v = Symbol("liveroom-recommend-list")
                        , h = Symbol("liveroom-clip-state")
                        , m = Symbol("liveroom-check-clip")
                        , b = Symbol("liveroom-finish-living")
                        , S = Symbol("liveroom-check-password")
                        , _ = Symbol("liveroom-kscoin")
                        , g = Symbol("liveroom-pay-key")
                        , E = Symbol("liveroom_send_gift")
                        , C = Symbol("liveroom_styke_type")
                        , T = Symbol("liveroom-danmaku-gift")
                        , I = Symbol("liveroom-refresh-stream")
                        , O = Symbol("liveroom-theater-mode")
                        , w = Symbol("liveroom-watching-list")
                        , k = Symbol("liveroom-fetch-status")
                        , A = Symbol("liveroom-fetch-recommend")
                        , R = Symbol("playVolume")
                        , N = Symbol("playSrc")
                        , L = Symbol("playInstance")
                        , P = Symbol("playPaused")
                        , U = Symbol("playPause")
                        , x = Symbol("playPlay")
                        , D = Symbol("playLoad")
                        , H = Symbol("playReload")
                        , W = Symbol("playIsFullScreen")
                        , B = (Symbol("playerManifestParsed"),
                        Symbol("player-quality-list"))
                        , M = Symbol("player-quality-level")
                        , F = Symbol("player-switch-level")
                        , Z = Symbol("player-livestream-id")
                        , G = Symbol("playFullScreen")
                        , V = (Symbol("volume"),
                        Symbol("kernel"))
                        , Q = Symbol("player-rotate")
                        , j = Symbol("player-duration")
                        , J = Symbol("player-current")
                        , K = Symbol("player-speed")
                        , Y = Symbol("danmaku-desity")
                        , q = Symbol("danmaku-opacity")
                        , $ = Symbol("danmaku-disable")
                        , z = Symbol("gift-list")
                        , X = Symbol("get-list")
                        , ee = Symbol("all-gift")
                        , te = Symbol("icon-urls")
                        , ne = Symbol("gift-token")
                        , re = Symbol("ua-info")
                        , ie = n(14284)
                        , oe = (Symbol("get-comment-list"),
                        Symbol("comment-list"),
                        Symbol("comment-count"),
                        Symbol("get-product-public"),
                        Symbol("product-public"),
                        Symbol("can-prev"))
                        , ae = Symbol("can-next")
                        , ue = Symbol("swicth-product")
                        , se = (Symbol("active-id"),
                        Symbol("get-product-detail"),
                        Symbol("preview-product"),
                        Symbol("change-like-status"),
                        Symbol("tab-group-compoents"))
                        , ce = Symbol("radio-group-compoents")
                        , le = Symbol("carousel")
                }
                ,
                14284: (e, t, n) => {
                    n.d(t, {
                        n0: () => r,
                        CD: () => i,
                        N2: () => o
                    }),
                        n(82526),
                        n(41817),
                        n(41539);
                    var r = Symbol("user-has-login")
                        , i = Symbol("user-info")
                        , o = (Symbol("user-get-qr"),
                        Symbol("user-get-qr"),
                        Symbol(""),
                        Symbol("user-get-qr"),
                        Symbol("user-cancel-qr"),
                        Symbol("user-balance"))
                }
                ,
                4352: (e, t, n) => {
                    n.d(t, {
                        U2: () => g,
                        v_: () => E
                    });
                    var r = n(15861)
                        , i = n(15671)
                        , o = n(43144)
                        , a = n(4942)
                        , u = n(87757)
                        , s = n.n(u)
                        , c = (n(89554),
                        n(41539),
                        n(54747),
                        n(88674),
                        n(19601),
                        n(47941),
                        n(82526),
                        n(57327),
                        n(38880),
                        n(49337),
                        n(33321),
                        n(69070),
                        n(51721))
                        , l = n(99339)
                        , p = n(4302)
                        , d = n(66252)
                        , f = n(34634);

                    function y(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function (t) {
                                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                                }
                            ))),
                                n.push.apply(n, r)
                        }
                        return n
                    }

                    var v = !1
                        , h = c.ZP.create({
                        timeout: 1e4,
                        withCredentials: !0
                    })
                        , m = function (e) {
                        throw e
                    }
                        , b = new (function () {
                        function e() {
                            (0,
                                i.Z)(this, e),
                                (0,
                                    a.Z)(this, "captchaAxiosList", [])
                        }

                        return (0,
                            o.Z)(e, [{
                            key: "flushAxiosList",
                            value: function (e) {
                                var t = e.identityVerificationType
                                    , n = e.identityVerificationToken;
                                this.captchaAxiosList.forEach((function (e) {
                                        var r = e.url
                                            , i = e.type
                                            , o = e.params
                                            , a = e.config
                                            , u = e.resolve;
                                        a.headers = {
                                            "identity-verification-type": t,
                                            "identity-verification-token": n
                                        };
                                        try {
                                            "get" === i ? u(g(r, o, a)) : "post" === i && u(E(r, o, a))
                                        } catch (e) {
                                            console.log("err = ", e),
                                                u({
                                                    result: 111,
                                                    err_msg: "接口请求报错，请重试~"
                                                })
                                        }
                                    }
                                )),
                                    this.captchaAxiosList = []
                            }
                        }, {
                            key: "addAxios",
                            value: function (e, t, n, r, i) {
                                return this.captchaAxiosList.push({
                                    url: e,
                                    type: t,
                                    params: n,
                                    config: r,
                                    resolve: i
                                }),
                                    this
                            }
                        }]),
                            e
                    }());

                    function S() {
                        return S = (0,
                            r.Z)(s().mark((function e(t, n, i, o, a, u) {
                                var c, l;
                                return s().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    v = !0,
                                                        (0,
                                                            f.I)({
                                                            jsSdkUrl: null === (c = t.data.captcha) || void 0 === c ? void 0 : c.jsSdkUrl,
                                                            url: null === (l = t.data.captcha) || void 0 === l ? void 0 : l.url
                                                        }).then(function () {
                                                            var e = (0,
                                                                r.Z)(s().mark((function e(t) {
                                                                    var r;
                                                                    return s().wrap((function (e) {
                                                                            for (; ;)
                                                                                switch (e.prev = e.next) {
                                                                                    case 0:
                                                                                        if (a.headers = {
                                                                                            "identity-verification-type": t.type,
                                                                                            "identity-verification-token": t.token
                                                                                        },
                                                                                            e.prev = 1,
                                                                                            console.log("发生弹窗后的请求 url = ", n),
                                                                                            r = null,
                                                                                        "get" !== i) {
                                                                                            e.next = 10;
                                                                                            break
                                                                                        }
                                                                                        return e.next = 7,
                                                                                            g(n, o, a);
                                                                                    case 7:
                                                                                        r = e.sent,
                                                                                            e.next = 14;
                                                                                        break;
                                                                                    case 10:
                                                                                        if ("post" !== i) {
                                                                                            e.next = 14;
                                                                                            break
                                                                                        }
                                                                                        return e.next = 13,
                                                                                            E(n, o, a);
                                                                                    case 13:
                                                                                        r = e.sent;
                                                                                    case 14:
                                                                                        console.log("发生弹窗后返回的数据 res = ", r),
                                                                                            v = !1,
                                                                                            b.flushAxiosList({
                                                                                                identityVerificationType: t.type,
                                                                                                identityVerificationToken: t.token
                                                                                            }),
                                                                                            u(r),
                                                                                            e.next = 25;
                                                                                        break;
                                                                                    case 20:
                                                                                        e.prev = 20,
                                                                                            e.t0 = e.catch(1),
                                                                                            v = !1,
                                                                                            console.log("err = ", e.t0),
                                                                                            u({
                                                                                                result: 111,
                                                                                                err_msg: "接口请求报错，请重试~"
                                                                                            });
                                                                                    case 25:
                                                                                    case "end":
                                                                                        return e.stop()
                                                                                }
                                                                        }
                                                                    ), e, null, [[1, 20]])
                                                                }
                                                            )));
                                                            return function (t) {
                                                                return e.apply(this, arguments)
                                                            }
                                                        }());
                                                case 2:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e)
                            }
                        ))),
                            S.apply(this, arguments)
                    }

                    function _() {
                        var e, t, n, r = (0,
                            d.FN)();
                        return null == r || null === (e = r.appContext) || void 0 === e || null === (t = e.config) || void 0 === t || null === (n = t.globalProperties) || void 0 === n ? void 0 : n.$globalHeaders
                    }

                    h.interceptors.request.use((function (e) {
                            return e
                        }
                    )),
                        h.interceptors.response.use((function (e) {
                                return new Promise((function (t) {
                                        var n, r = e.data;
                                        if (!p.sk && 400002 === (null === (n = r.data) || void 0 === n ? void 0 : n.result)) {
                                            var i;
                                            r.captcha = {
                                                jsSdkUrl: r.data.jsSdkUrl,
                                                url: r.data.url
                                            },
                                                r.error = "Need captcha";
                                            var o = e.config
                                                , a = e.config.url
                                                , u = e.config.method.toLowerCase()
                                                , s = null !== (i = o.params) && void 0 !== i ? i : o.data;
                                            return v ? void b.addAxios(a, u, s, o, t) : (console.log("resolve body url = ", a),
                                                void function (e, t, n, r, i, o) {
                                                    S.apply(this, arguments)
                                                }(e, a, u, s, o, t))
                                        }
                                        t(r)
                                    }
                                )).then(null, m)
                            }
                        ));
                    var g = function (e, t, n) {
                        if (p.sk) {
                            var r = _();
                            e = (0,
                                l.sd)() + e,
                                n = r ? Object.assign(n || {}, {
                                    headers: r
                                }) : n
                        }
                        return h.get(e, function (e) {
                            for (var t = 1; t < arguments.length; t++) {
                                var n = null != arguments[t] ? arguments[t] : {};
                                t % 2 ? y(Object(n), !0).forEach((function (t) {
                                        (0,
                                            a.Z)(e, t, n[t])
                                    }
                                )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : y(Object(n)).forEach((function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                    }
                                ))
                            }
                            return e
                        }({
                            params: t
                        }, n))
                    }
                        , E = function (e, t, n) {
                        if (p.sk) {
                            e = (0,
                                l.sd)() + e;
                            var r = _();
                            n = r ? Object.assign(n || {}, {
                                headers: r
                            }) : n
                        }
                        return h.post(e, t, n)
                    }
                }
                ,
                7224: (e, t, n) => {
                    n.d(t, {
                        yD: () => o,
                        F8: () => a,
                        ut: () => u,
                        tc: () => s,
                        gU: () => c,
                        cr: () => l
                    });
                    var r = n(58188)
                        , i = n(66252);

                    function o(e, t) {
                        (0,
                            r.gp)({
                            type: "show",
                            event_name: e,
                            event_value: t
                        })
                    }

                    function a(e, t) {
                        return {
                            type: "show",
                            event_name: e,
                            event_value: t
                        }
                    }

                    function u(e, t) {
                        (0,
                            r.gp)({
                            type: "click",
                            event_name: e,
                            event_value: t
                        })
                    }

                    function s(e, t) {
                        return {
                            type: "click",
                            event_name: e,
                            event_value: t
                        }
                    }

                    function c(e, t) {
                        return {
                            type: "all",
                            event_name: e,
                            event_value: t
                        }
                    }

                    function l() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ""
                            , t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                        (0,
                            i.bv)((function () {
                                (0,
                                    r.gp)({
                                    type: "PV",
                                    page: e,
                                    event_value: t
                                })
                            }
                        ))
                    }
                }
                ,
                58188: (e, t, n) => {
                    n.d(t, {
                        gp: () => d,
                        yC: () => f,
                        oe: () => y,
                        V9: () => h
                    }),
                        n(47941),
                        n(82526),
                        n(57327),
                        n(38880),
                        n(89554),
                        n(54747),
                        n(49337),
                        n(33321),
                        n(69070);
                    var r = n(15861)
                        , i = n(4942)
                        , o = n(87757)
                        , a = n.n(o)
                        , u = (n(83710),
                        n(66992),
                        n(41539),
                        n(88674),
                        n(78783),
                        n(33948),
                        n(28332))
                        , s = n(66252)
                        , c = n(4302);

                    function l(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function (t) {
                                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                                }
                            ))),
                                n.push.apply(n, r)
                        }
                        return n
                    }

                    function p(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? l(Object(n), !0).forEach((function (t) {
                                    (0,
                                        i.Z)(e, t, n[t])
                                }
                            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : l(Object(n)).forEach((function (t) {
                                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                }
                            ))
                        }
                        return e
                    }

                    function d(e) {
                        if (!c.sk) {
                            var t = p({}, e)
                                , n = t.type && "string" == typeof t.type ? t.type.toUpperCase() : t.type;
                            if (n) {
                                delete t.type;
                                var r = {
                                    params: t.event_value || t.show_value
                                };
                                if ("PV" === n) {
                                    t.page && (r.page = t.page),
                                        r.type = "enter";
                                    var i = (new Date).valueOf();
                                    (0,
                                        s.Jd)((function () {
                                            u.Z.sendImmediately("PV", {
                                                type: "leave",
                                                beginTime: i
                                            })
                                        }
                                    ))
                                } else
                                    (t.event_name || t.show_name) && (r.action = t.event_name || t.show_name);
                                u.Z.collect(n, r)
                            }
                        }
                    }

                    function f(e) {
                        if (!c.sk) {
                            var t = p({}, e)
                                , n = t.type;
                            delete t.type,
                                u.Z.sendImmediately(n, {
                                    action: t.event_name || t.show_name,
                                    params: t.event_value || t.show_value
                                })
                        }
                    }

                    function y() {
                        return v.apply(this, arguments)
                    }

                    function v() {
                        return (v = (0,
                            r.Z)(a().mark((function e() {
                                return a().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    if (!c.sk) {
                                                        e.next = 2;
                                                        break
                                                    }
                                                    return e.abrupt("return");
                                                case 2:
                                                    return e.next = 4,
                                                        n.e(216).then(n.bind(n, 27542));
                                                case 4:
                                                    e.sent.default.addEventListener("statechange", (function (e) {
                                                            "passive" === e.oldState && "hidden" === e.newState && u.Z.sendImmediately("PV", {
                                                                type: "hidden"
                                                            }),
                                                            "hidden" === e.oldState && "passive" === e.newState && u.Z.sendImmediately("PV", {
                                                                type: "visible"
                                                            })
                                                        }
                                                    ));
                                                case 6:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e)
                            }
                        )))).apply(this, arguments)
                    }

                    function h() {
                        u.Z.plugins.radar.fmp()
                    }
                }
                ,
                28534: (e, t, n) => {
                    n.d(t, {
                        wM: () => l,
                        v_: () => p
                    }),
                        n(92222),
                        n(3843),
                        n(83710);
                    var r = n(59022)
                        , i = n(11860)
                        , o = n.n(i)
                        , a = "kslive.log.session_id"
                        , u = "kslive.log.page_id"
                        , s = "kslive.log.refer_page_id";

                    function c() {
                        return "".concat((0,
                            r.x)(16), "_").concat(Date.now())
                    }

                    function l() {
                        return "".concat((0,
                            r.x)(16), "_").concat(Date.now())
                    }

                    function p() {
                        o().session.has(s) || o().session.has(u) ? o().session.has(u) && (o().session.set(s, o().session.get(u)),
                            o().session.set(u, c())) : (o().session.set(u, c()),
                            o().session.set(s, ""))
                    }

                    o().session.has(a) || o().session.set(a, (0,
                        r.x)(16))
                }
                ,
                28332: (e, t, n) => {
                    n.d(t, {
                        Z: () => u
                    });
                    var r = n(41929)
                        , i = n(4302)
                        , o = {};
                    if (i.C5) {
                        var a = n(74663);
                        o = new (0,
                            n(96998).Weblog)({
                            fps: !1,
                            timing: !1,
                            radar: {
                                projectId: "cab5e5a8dc",
                                sampling: 1
                            },
                            autoPV: !1,
                            env: i.yv ? "production" : "logger",
                            plugins: [new a({
                                env: i.yv ? "production" : "test",
                                bussType: "gameLive",
                                taskType: "99",
                                subTaskType: "99",
                                switchAsync: !0
                            })]
                        }, {
                            user_id: (0,
                                r.ej)("userId") || "",
                            product_name: "KS_GAME_LIVE_PC"
                        })
                    }
                    const u = o
                }
                ,
                45949: (e, t, n) => {
                    n.d(t, {
                        z3: () => f,
                        wo: () => p,
                        Sg: () => l,
                        $u: () => m,
                        ZT: () => S,
                        yL: () => y,
                        Cs: () => d,
                        Bc: () => c,
                        j4: () => h,
                        pL: () => r,
                        YG: () => v
                    }),
                        n(47941),
                        n(82526),
                        n(57327),
                        n(41539),
                        n(38880),
                        n(89554),
                        n(54747),
                        n(49337),
                        n(33321),
                        n(69070);
                    var r, i, o, a = n(4942);

                    function u(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function (t) {
                                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                                }
                            ))),
                                n.push.apply(n, r)
                        }
                        return n
                    }

                    function s(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? u(Object(n), !0).forEach((function (t) {
                                    (0,
                                        a.Z)(e, t, n[t])
                                }
                            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : u(Object(n)).forEach((function (t) {
                                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                }
                            ))
                        }
                        return e
                    }

                    !function (e) {
                        e.standard = "standard",
                            e.high = "high",
                            e.super = "super",
                            e.blueRay = "blueRay"
                    }(r || (r = {})),
                        function (e) {
                            e[e.WYJJ = 0] = "WYJJ",
                                e[e.DJRY = 1] = "DJRY",
                                e[e.SYXX = 2] = "SYXX",
                                e[e.QP = 3] = "QP"
                        }(i || (i = {})),
                        function (e) {
                            e[e.YL = 0] = "YL",
                                e[e.ZH = 1] = "ZH",
                                e[e.KJ = 2] = "KJ"
                        }(o || (o = {}));
                    var c, l, p, d, f, y, v, h, m, b, S = s({}, i), _ = s({}, o);
                    s(s({}, S), _),
                        n(67077),
                        n(3843),
                        n(83710),
                        function (e) {
                            e.error = "eror",
                                e.play = "play",
                                e.playing = "playing",
                                e.waiting = "waiting",
                                e.ended = "ended",
                                e.pause = "pause",
                                e.seeking = "seeking",
                                e.seeked = "seeked",
                                e.timeupdate = "timeupdate",
                                e.ratechange = "ratechange",
                                e.volumechange = "volumechange",
                                e.fullscreenchange = "fullscreenchange",
                                e.loadstart = "loadstart",
                                e.durationchange = "durationchange",
                                e.loadedmetadata = "loadedmetadata",
                                e.loadeddata = "loadeddata",
                                e.progress = "progress",
                                e.canplay = "canplay",
                                e.canplaythrough = "canplaythrough"
                        }(c || (c = {})),
                        function (e) {
                            e.COMMENT = "comment",
                                e.GIFT = "gift",
                                e.LIKE = "like"
                        }(l || (l = {})),
                        function (e) {
                            e.SELF = "SELF",
                                e.SERVER = "SERVER"
                        }(p || (p = {})),
                        function (e) {
                            e.SC_ENTER_ROOM_ACK = "SC_ENTER_ROOM_ACK",
                                e.SC_FEED_PUSH = "SC_FEED_PUSH",
                                e.SC_LIVE_WATCHING_LIST = "SC_LIVE_WATCHING_LIST",
                                e.SC_LIVE_WARNING_MASK_STATUS_CHANGED_AUDIENCE = "SC_LIVE_WARNING_MASK_STATUS_CHANGED_AUDIENCE"
                        }(d || (d = {})),
                        function (e) {
                            e[e.TIP_HIDE = 0] = "TIP_HIDE",
                                e[e.TIP_SHOW = 1] = "TIP_SHOW",
                                e[e.TIP_ERROR = 2] = "TIP_ERROR",
                                e[e.TIP_JUMP = 3] = "TIP_JUMP"
                        }(f || (f = {})),
                        function (e) {
                            e[e.SUCCESS = 1] = "SUCCESS",
                                e[e.OPERATE_TOO_FAST = 2] = "OPERATE_TOO_FAST",
                                e[e.SOCIAL_BANNED_FORBIDDEN_OPERATION = 672] = "SOCIAL_BANNED_FORBIDDEN_OPERATION",
                                e[e.BANNED_FORBIDDEN_OPERATION = 677] = "BANNED_FORBIDDEN_OPERATION",
                                e[e.NOT_SUPPORT_CURRENT_AREA = 67606] = "NOT_SUPPORT_CURRENT_AREA",
                                e[e.NEED_LOGIN = 60200] = "NEED_LOGIN",
                                e[e.REQUEST_URI_THROTTLED = 15] = "REQUEST_URI_THROTTLED",
                                e[e.REQUEST_RETRY_REJECTED = 16] = "REQUEST_RETRY_REJECTED",
                                e[e.LOGIN_NEED_CODE = 705] = "LOGIN_NEED_CODE",
                                e[e.USER_NOT_LOGIN = 109] = "USER_NOT_LOGIN",
                                e[e.LIVE_AUTHOR_NOT_ON_LIVE = 671] = "LIVE_AUTHOR_NOT_ON_LIVE",
                                e[e.NO_AUTHOR = 999] = "NO_AUTHOR"
                        }(y || (y = {})),
                        function (e) {
                            e[e.SUCCESS = 1] = "SUCCESS",
                                e[e.PARAM_INVALID_FORMAT = 22] = "PARAM_INVALID_FORMAT",
                                e[e.LIVESTREAM_LIVING_END = 601] = "LIVESTREAM_LIVING_END",
                                e[e.ANTI_SPIDER_NEED_LOGIN = 60200] = "ANTI_SPIDER_NEED_LOGIN",
                                e[e.LIVE_STREAM_NOT_SUPPORT_CURRENT_AREA = 67606] = "LIVE_STREAM_NOT_SUPPORT_CURRENT_AREA",
                                e[e.SERVER_BUSY = 10] = "SERVER_BUSY",
                                e[e.SERVER_ERROR = 11] = "SERVER_ERROR",
                                e[e.REQUEST_URI_THROTTLED = 15] = "REQUEST_URI_THROTTLED",
                                e[e.REQUEST_RETRY_REJECTED = 16] = "REQUEST_RETRY_REJECTED",
                                e[e.OPERATE_TOO_FAST = 2] = "OPERATE_TOO_FAST",
                                e[e.SERVICE_TOKEN_ERROR = 6001] = "SERVICE_TOKEN_ERROR",
                                e[e.USER_NOT_LOGIN = 109] = "USER_NOT_LOGIN"
                        }(v || (v = {})),
                        n(9653),
                        function (e) {
                            e.PUBLIC = "public",
                                e.PRIVATE = "private",
                                e.LIKED = "liked",
                                e.PLAYEBACK = "playback"
                        }(h || (h = {})),
                        function (e) {
                            e.UnFollowed = "UN_FOLLOWED",
                                e.Following = "FOLLOWING",
                                e.Waiting = "WAITING"
                        }(m || (m = {})),
                        function (e) {
                            e[e.UNKNOWN_STYLE = 0] = "UNKNOWN_STYLE",
                                e[e.BATCH_STAR_0 = 1] = "BATCH_STAR_0",
                                e[e.BATCH_STAR_1 = 2] = "BATCH_STAR_1",
                                e[e.BATCH_STAR_2 = 3] = "BATCH_STAR_2",
                                e[e.BATCH_STAR_3 = 4] = "BATCH_STAR_3",
                                e[e.BATCH_STAR_4 = 5] = "BATCH_STAR_4",
                                e[e.BATCH_STAR_5 = 6] = "BATCH_STAR_5",
                                e[e.BATCH_STAR_6 = 7] = "BATCH_STAR_6"
                        }(b || (b = {}))
                }
                ,
                67077: (e, t, n) => {
                    var r;
                    n.d(t, {
                        $: () => r
                    }),
                        function (e) {
                            e.UnFollowed = "UN_FOLLOWED",
                                e.Following = "FOLLOWING",
                                e.Waiting = "WAITING"
                        }(r || (r = {}))
                }
                ,
                32943: (e, t, n) => {
                    function r() {
                        document.querySelector("html").style.overflow = "hidden"
                    }

                    function i() {
                        document.querySelector("html").style.overflow = ""
                    }

                    function o() {
                        return {
                            fixed: r,
                            loosen: i
                        }
                    }

                    n.d(t, {
                        Fo: () => o
                    })
                }
                ,
                41929: (e, t, n) => {
                    n.d(t, {
                        d8: () => o,
                        ej: () => a,
                        nJ: () => u,
                        h2: () => s,
                        _6: () => l
                    }),
                        n(47042),
                        n(74916),
                        n(15306),
                        n(23123),
                        n(69600);
                    var r = n(31955)
                        , i = n(4302).yv ? "kuaishou.com" : "gifshow.com";

                    function o(e, t) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
                        r.Z.set(e, t, {
                            expires: n,
                            domain: i
                        })
                    }

                    function a(e) {
                        return r.Z.get(e, {
                            domain: i
                        })
                    }

                    function u(e) {
                        r.Z.remove(e, {
                            domain: i
                        })
                    }

                    function s(e) {
                        return !!a(e)
                    }

                    var c = function (e) {
                        return '"' === e[0] && (e = e.slice(1, -1)),
                            e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
                    };

                    function l(e, t) {
                        if (!arguments.length || e) {
                            for (var n = t ? t.split("; ") : [], r = {}, i = 0; i < n.length; i++) {
                                var o = n[i].split("=")
                                    , a = o.slice(1).join("=");
                                try {
                                    var u = decodeURIComponent(o[0]);
                                    if (r[u] = c(a),
                                    e === u)
                                        break
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                            return e ? r[e] : r
                        }
                    }
                }
                ,
                4302: (e, t, n) => {
                    n.d(t, {
                        kp: () => y,
                        M1: () => k,
                        oq: () => S,
                        TE: () => L,
                        To: () => R,
                        KJ: () => s.KJ,
                        mr: () => s.mr,
                        IT: () => N,
                        Qx: () => w,
                        yc: () => P,
                        C5: () => T,
                        Gg: () => O,
                        yv: () => I,
                        sk: () => C,
                        Hb: () => E,
                        Sd: () => v,
                        Rp: () => l,
                        g_: () => b,
                        l7: () => p
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = (n(74916),
                        n(15306),
                        n(41539),
                        n(88674),
                        n(56182))
                        , u = (n(34155),
                        n(21510))
                        , s = n(51666)
                        , c = n(45949);

                    function l(e) {
                        return e === c.yL.NOT_SUPPORT_CURRENT_AREA ? {
                            type: c.yL.NOT_SUPPORT_CURRENT_AREA,
                            title: "该直播当前地区暂不支持观看",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.OPERATE_TOO_FAST ? {
                            type: c.yL.OPERATE_TOO_FAST,
                            title: "请求过快，请稍后重试",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.BANNED_FORBIDDEN_OPERATION ? {
                            type: c.yL.BANNED_FORBIDDEN_OPERATION,
                            title: "当前用户封禁，禁止操作",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.LOGIN_NEED_CODE ? {
                            type: c.yL.LOGIN_NEED_CODE,
                            title: "需要验证码登录",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.SOCIAL_BANNED_FORBIDDEN_OPERATION ? {
                            type: c.yL.SOCIAL_BANNED_FORBIDDEN_OPERATION,
                            title: "当前用户社交封禁禁止操作",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.NEED_LOGIN ? {
                            type: c.yL.NEED_LOGIN,
                            title: "该直播需要登录才能观看",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.REQUEST_URI_THROTTLED ? {
                            type: c.yL.REQUEST_URI_THROTTLED,
                            title: "已被限流稍后再试",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.REQUEST_RETRY_REJECTED ? {
                            type: c.yL.REQUEST_RETRY_REJECTED,
                            title: "重复请求次数过多",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.USER_NOT_LOGIN ? {
                            type: c.yL.USER_NOT_LOGIN,
                            title: "该直播需要登录才能观看",
                            content: "浏览其他内容",
                            url: "/"
                        } : e === c.yL.NO_AUTHOR ? {
                            type: c.yL.NO_AUTHOR,
                            title: "链接有误，主播信息为空",
                            content: "浏览其他内容",
                            url: "/"
                        } : {
                            type: e,
                            title: "错误代码".concat(e),
                            content: "浏览其他内容",
                            url: "/"
                        }
                    }

                    function p(e) {
                        var t = "未知错误，错误".concat(e);
                        switch (e) {
                            case c.YG.OPERATE_TOO_FAST:
                                t = "请求过快，请稍后重试";
                                break;
                            case c.YG.PARAM_INVALID_FORMAT:
                                t = "参数有误";
                                break;
                            case c.YG.ANTI_SPIDER_NEED_LOGIN:
                                t = "需要登录";
                                break;
                            case c.YG.LIVESTREAM_LIVING_END:
                                t = "直播已结束";
                                break;
                            case c.YG.LIVE_STREAM_NOT_SUPPORT_CURRENT_AREA:
                                t = "不支持该地区进行使用";
                                break;
                            case c.YG.SERVER_BUSY:
                                t = "服务繁忙";
                                break;
                            case c.YG.SERVER_ERROR:
                                t = "不支持该地区进行使用";
                                break;
                            case c.YG.REQUEST_URI_THROTTLED:
                                t = "触发限流";
                                break;
                            case c.YG.REQUEST_RETRY_REJECTED:
                                t = "重复请求，被服务器拒绝";
                                break;
                            case c.YG.SERVICE_TOKEN_ERROR:
                                t = "不支持该地区进行使用";
                                break;
                            case c.YG.USER_NOT_LOGIN:
                                t = "需要登录后，才可以查看弹幕"
                        }
                        return [{
                            userName: "系统消息",
                            content: t
                        }]
                    }

                    function d(e, t) {
                        (null == t || t > e.length) && (t = e.length);
                        for (var n = 0, r = new Array(t); n < t; n++)
                            r[n] = e[n];
                        return r
                    }

                    n(89554),
                        n(54747),
                        n(40561),
                        n(82772),
                        n(47042),
                        n(68309),
                        n(91038),
                        n(78783),
                        n(82526),
                        n(41817),
                        n(32165),
                        n(66992),
                        n(33948),
                        n(79753);
                    var f = function (e) {
                        var t, n = function (e, t) {
                            var n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                            if (!n) {
                                if (Array.isArray(e) || (n = function (e, t) {
                                    if (e) {
                                        if ("string" == typeof e)
                                            return d(e, t);
                                        var n = Object.prototype.toString.call(e).slice(8, -1);
                                        return "Object" === n && e.constructor && (n = e.constructor.name),
                                            "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? d(e, t) : void 0
                                    }
                                }(e)) || t && e && "number" == typeof e.length) {
                                    n && (e = n);
                                    var r = 0
                                        , i = function () {
                                    };
                                    return {
                                        s: i,
                                        n: function () {
                                            return r >= e.length ? {
                                                done: !0
                                            } : {
                                                done: !1,
                                                value: e[r++]
                                            }
                                        },
                                        e: function (e) {
                                            throw e
                                        },
                                        f: i
                                    }
                                }
                                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                            }
                            var o, a = !0, u = !1;
                            return {
                                s: function () {
                                    n = n.call(e)
                                },
                                n: function () {
                                    var e = n.next();
                                    return a = e.done,
                                        e
                                },
                                e: function (e) {
                                    u = !0,
                                        o = e
                                },
                                f: function () {
                                    try {
                                        a || null == n.return || n.return()
                                    } finally {
                                        if (u)
                                            throw o
                                    }
                                }
                            }
                        }(e);
                        try {
                            for (n.s(); !(t = n.n()).done;) {
                                var r = t.value.target.__resizeListeners__ || [];
                                r.length && r.forEach((function (e) {
                                        e()
                                    }
                                ))
                            }
                        } catch (e) {
                            n.e(e)
                        } finally {
                            n.f()
                        }
                    }
                        , y = function (e, t) {
                        T && e && (e.__resizeListeners__ || (e.__resizeListeners__ = [],
                            e.__ro__ = new ResizeObserver(f),
                            e.__ro__.observe(e)),
                            e.__resizeListeners__.push(t))
                    }
                        , v = function (e, t) {
                        var n;
                        e && e.__resizeListeners__ && (e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t), 1),
                        e.__resizeListeners__.length || null === (n = e.__ro__) || void 0 === n || n.disconnect())
                    }
                        , h = (n(34553),
                        n(11860))
                        , m = n.n(h);

                    function b() {
                        return {
                            syncQuality: function (e) {
                                m().set("kslive.player.controls.quality", e)
                            },
                            getQuality: function (e, t) {
                                var n = m().get("kslive.player.controls.quality")
                                    , r = null == t ? void 0 : t.findIndex((function (e) {
                                        return e.qualityType === n
                                    }
                                ));
                                return -1 !== r ? t[r].level : e
                            }
                        }
                    }

                    function S(e, t) {
                        for (; e;) {
                            if (e === t)
                                return t;
                            e = e.parentNode
                        }
                        return null
                    }

                    var _, g = n(49963);

                    function E(e) {
                        var t = (0,
                            g.ri)(e)
                            , n = document.createElement("div");
                        return document.body.appendChild(n),
                            {
                                instance: t.mount(n),
                                unmount: function () {
                                    t.unmount(),
                                        document.body.removeChild(n)
                                }
                            }
                    }

                    var C = "undefined" == typeof window
                        , T = "undefined" != typeof window
                        , I = !0
                        , O = "production" === (null !== (_ = "production") ? _ : "development");

                    function w() {
                        var e = null;
                        return {
                            shown: function () {
                                e = null === e ? document.body.style.overflow : e,
                                    document.body.style.overflow = "hidden"
                            },
                            hidden: function () {
                                document.body.style.overflow = e,
                                    e = null
                            }
                        }
                    }

                    function k(e) {
                        return A.apply(this, arguments)
                    }

                    function A() {
                        return (A = (0,
                            r.Z)(o().mark((function e(t) {
                                return o().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    return e.prev = 0,
                                                        e.next = 3,
                                                        (0,
                                                            a.passToken)();
                                                case 3:
                                                    if (e.sent.authToken) {
                                                        e.next = 7;
                                                        break
                                                    }
                                                    throw t;
                                                case 7:
                                                    return e.prev = 7,
                                                        (0,
                                                            u.t2)(),
                                                        e.finish(7);
                                                case 10:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e, null, [[0, , 7, 10]])
                            }
                        )))).apply(this, arguments)
                    }

                    function R(e) {
                        return e ? String(e).replace(/\d+/, (function (e) {
                                return e.replace(/(\d)(?=(\d{3})+$)/g, (function (e) {
                                        return e + ","
                                    }
                                ))
                            }
                        )) : 0
                    }

                    function N() {
                        return "production"
                    }

                    function L(e) {
                        return navigator.clipboard ? navigator.clipboard.writeText(e) : function (e) {
                            return new Promise((function (t, n) {
                                    var r = document.createElement("textarea");
                                    r.style.cssText = "position: absolute; top: -9999px; left: -9999px",
                                        r.value = e,
                                        document.body.appendChild(r),
                                        r.select();
                                    try {
                                        document.execCommand("copy"),
                                            t(e)
                                    } catch (e) {
                                        n(e)
                                    } finally {
                                        document.body.removeChild(r)
                                    }
                                }
                            ))
                        }(e)
                    }

                    function P() {
                    }
                }
                ,
                38121: (e, t, n) => {
                    function r() {
                        Promise.prototype.finally = Promise.prototype.finally || {
                            finally: function (e) {
                                var t = function (t) {
                                    return Promise.resolve(e()).then(t)
                                };
                                return this.then((function (e) {
                                        return t((function () {
                                                return e
                                            }
                                        ))
                                    }
                                ), (function (e) {
                                        return t((function () {
                                                return Promise.reject(e)
                                            }
                                        ))
                                    }
                                ))
                            }
                        }.finally
                    }

                    n.d(t, {
                        Z: () => r
                    }),
                        n(41539),
                        n(88674),
                        n(17727)
                }
                ,
                51666: (e, t, n) => {
                    function r(e, t) {
                        for (var n = 0, r = t - (e + "").length; n < r; n++)
                            e = "0" + e;
                        return e + ""
                    }

                    function i(e) {
                        var t = Math.round(e)
                            , n = Math.floor(t / 60)
                            , i = t % 60;
                        return "".concat(r(n, 2), ":").concat(r(i, 2))
                    }

                    n.d(t, {
                        mr: () => i,
                        KJ: () => o,
                        jP: () => u
                    }),
                        n(83710),
                        n(44048),
                        n(9653),
                        n(69826),
                        n(41539),
                        n(92222),
                        n(83112),
                        n(74916),
                        n(15306);
                    var o = function (e) {
                        var t = String(Math.floor(e / 3600)).padStart(2, "0")
                            , n = e % 3600
                            , r = String(Math.floor(n / 60)).padStart(2, "0")
                            , i = String(n % 60).padStart(2, "0");
                        return "".concat(t, ":").concat(r, ":").concat(i)
                    };

                    function a(e) {
                        return e < 10 ? "0" + e : e
                    }

                    function u(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "yyyy-MM-dd";
                        return "string" == typeof e ? e = new Date(+e) : "number" == typeof e && (e = new Date(e)),
                            t.replace("yyyy", e.getFullYear()).replace("MM", a(e.getMonth() + 1)).replace("dd", a(e.getDate())).replace("HH", a(e.getHours())).replace("mm", a(e.getMinutes())).replace("SS", a(e.getSeconds()))
                    }
                }
                ,
                99339: (e, t, n) => {
                    n.d(t, {
                        sd: () => u,
                        Bf: () => r,
                        IE: () => c
                    });
                    var r, i = n(4302), o = n(66252), a = {
                        staging: "http://localhost:3500",
                        prt: "http://localhost:3500",
                        production: "http://pc-live-server.internal"
                    };

                    function u() {
                        return (null == (r = (0,
                            o.FN)()) || null === (e = r.appContext) || void 0 === e || null === (t = e.config) || void 0 === t || null === (n = t.globalProperties) || void 0 === n ? void 0 : n.$ssrApiHost) || a[(0,
                            i.IT)()];
                        var e, t, n, r
                    }

                    !function (e) {
                        e[e.HOT = 1] = "HOT",
                            e[e.WYJJ = 2] = "WYJJ",
                            e[e.DJRY = 3] = "DJRY",
                            e[e.SYXX = 4] = "SYXX",
                            e[e.QP = 5] = "QP",
                            e[e.YL = 6] = "YL",
                            e[e.ZH = 7] = "ZH",
                            e[e.KJ = 8] = "KJ"
                    }(r || (r = {}));
                    var s, c = ["YL", "ZH", "KJ"];
                    !function (e) {
                        e[e.ALL = 0] = "ALL",
                            e[e.BLUE = 1] = "BLUE",
                            e[e.REDBAG = 2] = "REDBAG"
                    }(s || (s = {}))
                }
                ,
                12722: (e, t, n) => {
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = (n(26699),
                        n(32023),
                        n(92222),
                        n(68309),
                        n(66252))
                        , u = n(49963)
                        , s = n(40830)
                        , c = n(75937)
                        , l = (n(66992),
                        n(41539),
                        n(88674),
                        n(78783),
                        n(33948),
                        n(22201))
                        , p = n(4302)
                        , d = p.sk ? (0,
                        l.PP)() : (0,
                        l.PO)()
                        , f = [{
                        path: "/",
                        name: "index",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(657), n.e(481)]).then(n.bind(n, 19452))
                        },
                        meta: {
                            webpackChunkName: "root"
                        }
                    }, {
                        path: "/live",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(730)]).then(n.bind(n, 91748))
                        },
                        meta: {
                            webpackChunkName: "hot"
                        },
                        children: [{
                            path: "",
                            redirect: "/live/HOT"
                        }, {
                            path: ":type",
                            name: "cateLive",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(730)]).then(n.bind(n, 51685))
                            }
                        }]
                    }, {
                        path: "/cate",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(359)]).then(n.bind(n, 25443))
                        },
                        meta: {
                            webpackChunkName: "gameboard"
                        },
                        children: [{
                            path: ":type/:gameId",
                            name: "gameboard",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(359)]).then(n.bind(n, 34181))
                            }
                        }]
                    }, {
                        path: "/u/:principalId/:productId",
                        name: "product",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(882), n.e(18)]).then(n.bind(n, 14916))
                        },
                        meta: {
                            webpackChunkName: "product"
                        }
                    }, {
                        path: "/u/:principalId",
                        name: "liveRoom",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(657), n.e(882), n.e(832), n.e(383)]).then(n.bind(n, 95330))
                        },
                        meta: {
                            webpackChunkName: "liveRoom"
                        }
                    }, {
                        path: "/profile/:principalId",
                        name: "profile",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(882), n.e(845)]).then(n.bind(n, 99399))
                        },
                        meta: {
                            webpackChunkName: "profile"
                        }
                    }, {
                        path: "/playback/:productId",
                        name: "playback",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(882), n.e(18)]).then(n.bind(n, 14916))
                        },
                        meta: {
                            webpackChunkName: 'product"',
                            name: "playback"
                        }
                    }, {
                        path: "/video/:principalId/:productId",
                        name: "video",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(882), n.e(18)]).then(n.bind(n, 14916))
                        },
                        meta: {
                            webpackChunkName: 'product"'
                        }
                    }, {
                        path: "/match",
                        name: "match",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(146)]).then(n.bind(n, 57511))
                        },
                        meta: {
                            webpackChunkName: "match"
                        }
                    }, {
                        path: "/my-follow",
                        name: "follow",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(757)]).then(n.bind(n, 15266))
                        },
                        meta: {
                            webpackChunkName: "follow"
                        },
                        children: [{
                            path: "living",
                            name: "myLiving",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(757)]).then(n.bind(n, 98038))
                            }
                        }, {
                            path: "all",
                            name: "myLivingAll",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(757)]).then(n.bind(n, 81009))
                            }
                        }]
                    }, {
                        path: "/search",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(464)]).then(n.bind(n, 74202))
                        },
                        children: [{
                            path: "",
                            name: "searchResult",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(464)]).then(n.bind(n, 38954))
                            }
                        }],
                        meta: {
                            webpackChunkName: "search"
                        }
                    }, {
                        path: "/activity/mini-room",
                        name: "miniroom",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(461), n.e(657), n.e(832), n.e(36)]).then(n.bind(n, 54085))
                        },
                        meta: {
                            webpackChunkName: "mroom"
                        }
                    }, {
                        path: "/thirdPart/:type",
                        name: "thirdPart",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(896)]).then(n.bind(n, 11475))
                        },
                        meta: {
                            allowType: ["qq", "wechat"],
                            webpackChunkName: "thirdPart"
                        }
                    }, {
                        path: "/live-partner",
                        name: "live-partner",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(491)]).then(n.bind(n, 76763))
                        },
                        meta: {
                            webpackChunkName: "livePartner"
                        }
                    }, {
                        path: "/live-partner-tutorial/:article?",
                        name: "live-partner-tutorial",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(491)]).then(n.bind(n, 39719))
                        },
                        meta: {
                            webpackChunkName: "tutorial"
                        }
                    }, {
                        path: "/news",
                        component: function () {
                            return Promise.all([n.e(216), n.e(592), n.e(476), n.e(697)]).then(n.bind(n, 94294))
                        },
                        children: [{
                            path: "",
                            name: "newsList",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(697)]).then(n.bind(n, 294))
                            }
                        }, {
                            path: ":id",
                            name: "newsDetail",
                            component: function () {
                                return Promise.all([n.e(216), n.e(592), n.e(476), n.e(697)]).then(n.bind(n, 63972))
                            }
                        }]
                    }]
                        , y = n(2262)
                        , v = n(78984)
                        , h = n(2005)
                        , m = n(50222)
                        , b = n(34083)
                        , S = n(9429)
                        , _ = n(59122)
                        , g = n(94881)
                        , E = n(16708)
                        , C = n(67191)
                        , T = n(92598)
                        , I = n(88055)
                        , O = n(11878)
                        , w = n(69649)
                        , k = n(38121);
                    const A = (0,
                        a.aZ)({
                        __name: "App",
                        setup: function (e) {
                            var t = (0,
                                I.oR)(O.HP)
                                , i = (0,
                                y.iH)(null)
                                , u = {
                                672: "你的账户处于异常状态，请在手机打开「快手」app进行相关操作"
                            };

                            function s() {
                                return (s = (0,
                                    r.Z)(o().mark((function e(t) {
                                        return o().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            return e.next = 2,
                                                                i.value.show({
                                                                    title: t.title || "注意",
                                                                    msg: t.msg || t.error_msg || u[t.result] || "服务器错误，请刷新重试"
                                                                });
                                                        case 2:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            function c() {
                                return (c = (0,
                                    r.Z)(o().mark((function e() {
                                        return o().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            if (!t.userInfo.id) {
                                                                e.next = 2;
                                                                break
                                                            }
                                                            return e.abrupt("return");
                                                        case 2:
                                                            return e.next = 4,
                                                                t.getUserInfo();
                                                        case 4:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            return (0,
                                I.v1)(T.gB, (function (e) {
                                    return s.apply(this, arguments)
                                }
                            )),
                                (0,
                                    I.v1)(T.a4, (function () {
                                        return c.apply(this, arguments)
                                    }
                                )),
                                (0,
                                    a.JJ)(w.n0, (0,
                                    a.Fl)((function () {
                                        return t.hasLogin
                                    }
                                ))),
                                (0,
                                    a.JJ)(w.CD, (0,
                                    a.Fl)((function () {
                                        return t.userInfo
                                    }
                                ))),
                                (0,
                                    a.JJ)(w.N2, (0,
                                    a.Fl)((function () {
                                        return t.kshellBalance
                                    }
                                ))),
                                (0,
                                    a.YP)((function () {
                                        return null == t ? void 0 : t.hasLogin
                                    }
                                ), (function (e) {
                                        if (e && p.C5) {
                                            var t = n(59341).default;
                                            (0,
                                                k.Z)();
                                            var r = (0,
                                                p.IT)()
                                                , i = {
                                                showQRCode: !0,
                                                env: {
                                                    staging: "staging",
                                                    prt: "production",
                                                    production: "production"
                                                }[r],
                                                showEbank: !0,
                                                sid: "kuaishou.live.web",
                                                ssoBaseURL: {
                                                    staging: "https://ksid-staging.corp.kuaishou.com",
                                                    prt: "https://id.kuaishou.com",
                                                    production: "https://id.kuaishou.com"
                                                }[r]
                                            };
                                            "prt" === r && (i.baseURL = "https://kspay-prt.test.gifshow.com"),
                                                t.init(i),
                                                console.log("初始化完成 env =", r)
                                        }
                                    }
                                ), {
                                    immediate: !0
                                }),
                                (0,
                                    a.bv)((0,
                                    r.Z)(o().mark((function e() {
                                        return o().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            return e.prev = 0,
                                                                e.next = 3,
                                                                (0,
                                                                    p.M1)();
                                                        case 3:
                                                            e.next = 9;
                                                            break;
                                                        case 5:
                                                            if (e.prev = 5,
                                                                e.t0 = e.catch(0),
                                                            10011e4 === e.t0.result) {
                                                                e.next = 9;
                                                                break
                                                            }
                                                            throw e.t0;
                                                        case 9:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e, null, [[0, 5]])
                                    }
                                )))),
                                function (e, t) {
                                    var n = (0,
                                        a.up)("metainfo");
                                    return (0,
                                        a.wg)(),
                                        (0,
                                            a.iD)(a.HY, null, [(0,
                                            a.Wm)(n), (0,
                                            a.Wm)(v.Z), (0,
                                            a.Wm)(h.Z), (0,
                                            a.Wm)(b.Z), (0,
                                            a.Wm)((0,
                                            y.SU)(l.MA)), (0,
                                            a.Wm)(S.Z), (0,
                                            a.Wm)(_.Z), (0,
                                            a.Wm)(E.Z), (0,
                                            a.Wm)(g.Z, {
                                            ref_key: "alertModal",
                                            ref: i,
                                            class: "alert-modal"
                                        }, null, 512), (0,
                                            a.Wm)(C.Z), (0,
                                            a.Wm)(m.Z)], 64)
                                }
                        }
                    })
                        , R = (0,
                        n(83744).Z)(A, [["__scopeId", "data-v-003f3429"]]);
                    var N = n(38351)
                        , L = n(28534)
                        , P = n(58188);
                    const U = {
                        liveRoom1: "WEB_LIVE_HOME_PAGE",
                        liveRoom2: "WEB_LIVE_MY_FOLLOW_PAGE"
                    };
                    var x = n(28332)
                        , D = (n(24812),
                        n(15671))
                        , H = n(43144)
                        , W = n(4942)
                        , B = (n(70189),
                        n(88921),
                        n(96248),
                        n(13599),
                        n(11477),
                        n(64362),
                        n(15389),
                        n(90401),
                        n(45164),
                        n(91238),
                        n(54837),
                        n(87485),
                        n(56767),
                        n(76651),
                        n(61437),
                        n(35285),
                        n(39865),
                        n(69826),
                        n(82772),
                        n(40561),
                        n(59167))
                        , M = function () {
                        function e(t) {
                            (0,
                                D.Z)(this, e),
                                (0,
                                    W.Z)(this, "el", void 0),
                                (0,
                                    W.Z)(this, "src", void 0),
                                (0,
                                    W.Z)(this, "loading", void 0),
                                (0,
                                    W.Z)(this, "error", void 0),
                                (0,
                                    W.Z)(this, "state", void 0),
                                (0,
                                    W.Z)(this, "cache", void 0),
                                (0,
                                    W.Z)(this, "needCache", void 0),
                                this.el = t.el,
                                this.src = t.src,
                                this.loading = t.loading,
                                this.error = t.error,
                                this.state = 0,
                                this.cache = t.cache,
                                this.needCache = t.needCache,
                                this.render(this.loading)
                        }

                        return (0,
                            H.Z)(e, [{
                            key: "render",
                            value: function (e) {
                                this.el.setAttribute("src", e)
                            }
                        }, {
                            key: "load",
                            value: function () {
                                if (!(this.state < 0))
                                    return this.cache.has(this.src) ? (this.state = 1,
                                        void this.render(this.src)) : void this.loadSrc()
                            }
                        }, {
                            key: "loadSrc",
                            value: function () {
                                var e = this;
                                (0,
                                    B.F)(this.src).then((function (t) {
                                        e.state = 1,
                                            e.render(e.src),
                                        e.needCache && e.cache.add(e.src)
                                    }
                                )).catch((function (t) {
                                        console.warn("load failed (".concat(e.src, ")\n ").concat(t.message)),
                                            e.state = 2,
                                            e.render(e.error)
                                    }
                                ))
                            }
                        }, {
                            key: "update",
                            value: function (e) {
                                var t = e;
                                t !== this.src && (this.src = t,
                                    this.state = 0,
                                    this.load())
                            }
                        }]),
                            e
                    }()
                        , F = n(77153)
                        , Z = function () {
                        function e(t) {
                            (0,
                                D.Z)(this, e),
                                (0,
                                    W.Z)(this, "managerQueue", void 0),
                                (0,
                                    W.Z)(this, "loading", void 0),
                                (0,
                                    W.Z)(this, "error", void 0),
                                (0,
                                    W.Z)(this, "observer", void 0),
                                (0,
                                    W.Z)(this, "cache", void 0),
                                this.managerQueue = [],
                                this.loading = t.loading || F,
                                this.error = t.error || "",
                                this.cache = new Set
                        }

                        return (0,
                            H.Z)(e, [{
                            key: "getImgResource",
                            value: function (e) {
                                var t, n;
                                return "string" == typeof e ? {
                                    loading: this.loading,
                                    error: this.error,
                                    src: e
                                } : {
                                    loading: null !== (t = null == e ? void 0 : e.loading) && void 0 !== t ? t : this.loading,
                                    error: null !== (n = null == e ? void 0 : e.error) && void 0 !== n ? n : this.error,
                                    src: null == e ? void 0 : e.src
                                }
                            }
                        }, {
                            key: "add",
                            value: function (e, t) {
                                var n = this.getImgResource(t.value)
                                    , r = n.loading
                                    , i = n.error
                                    , o = n.src
                                    , a = new M({
                                    el: e,
                                    src: o,
                                    error: i,
                                    loading: r,
                                    cache: this.cache,
                                    needCache: t.modifiers.cache
                                });
                                this.managerQueue.push(a);
                                var u = (0,
                                    I.S1)({
                                    el: e,
                                    inCb: this.onIntersectionObserver.bind(this)
                                })
                                    , s = u.io
                                    , c = u.isSupportIO;
                                this.observer = s,
                                !c && o && a.render(o)
                            }
                        }, {
                            key: "update",
                            value: function (e, t) {
                                var n = this.getImgResource(t.value).src
                                    , r = this.managerQueue.find((function (t) {
                                        return t.el === e
                                    }
                                ));
                                r && r.update(n)
                            }
                        }, {
                            key: "removeManager",
                            value: function (e) {
                                var t, n = this.managerQueue.indexOf(e);
                                n > -1 && this.managerQueue.splice(n, 1),
                                null === (t = this.observer.value) || void 0 === t || t.unobserve(e.el)
                            }
                        }, {
                            key: "remove",
                            value: function (e) {
                                var t = this.managerQueue.find((function (t) {
                                        return t.el === e
                                    }
                                ));
                                t && this.removeManager(t)
                            }
                        }, {
                            key: "onIntersectionObserver",
                            value: function (e) {
                                var t = this.managerQueue.find((function (t) {
                                        return t.el === e.target
                                    }
                                ));
                                t && (1 === t.state ? this.removeManager(t) : t.load())
                            }
                        }]),
                            e
                    }()
                        , G = !1
                        , V = {
                        install: function (e, t) {
                            if (!G) {
                                var n = new Z(t || {});
                                e.directive("lazy", {
                                    mounted: n.add.bind(n),
                                    beforeUnmount: n.remove.bind(n),
                                    updated: n.update.bind(n)
                                }),
                                    G = !0
                            }
                        }
                    }
                        , Q = (n(19601),
                        n(32564),
                        n(34553),
                        n(82481),
                        function () {
                            function e() {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                                    , n = t.el
                                    , r = t.value;
                                (0,
                                    D.Z)(this, e),
                                    (0,
                                        W.Z)(this, "el", void 0),
                                    (0,
                                        W.Z)(this, "value", void 0),
                                    (0,
                                        W.Z)(this, "isDone", void 0),
                                    (0,
                                        W.Z)(this, "repeat", void 0),
                                    (0,
                                        W.Z)(this, "io", void 0),
                                    this.el = n,
                                    this.value = r,
                                    this.isDone = !1,
                                r.event_repeat && (this.repeat = r.event_repeat),
                                    this.io = this.createIntersectionObserver(n)
                            }

                            return (0,
                                H.Z)(e, [{
                                key: "createIntersectionObserver",
                                value: function (e) {
                                    var t = this;
                                    if (p.sk)
                                        return null;
                                    this.io && (this.io.disconnect(),
                                        this.io = null);
                                    var n = new IntersectionObserver((function (e) {
                                            if (e && e.length)
                                                for (var n in e)
                                                    if (e[n].isIntersecting) {
                                                        t.do();
                                                        break
                                                    }
                                        }
                                    ), {
                                        threshold: 0
                                    });
                                    return n.observe(e),
                                        n
                                }
                            }, {
                                key: "do",
                                value: function () {
                                    this.isDone || ((0,
                                        P.gp)(this.value),
                                    this.repeat || (this.isDone = !0))
                                }
                            }, {
                                key: "update",
                                value: function (e, t) {
                                    this.io = this.createIntersectionObserver(e),
                                        this.el = e,
                                        this.value = t,
                                        this.isDone = !1
                                }
                            }, {
                                key: "destroy",
                                value: function () {
                                    this.io && this.io.disconnect(),
                                        this.el = null,
                                        this.value = null
                                }
                            }]),
                                e
                        }())
                        , j = function () {
                        function e() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
                                , n = t.throttleTime
                                , r = t.primaryKey;
                            (0,
                                D.Z)(this, e),
                                (0,
                                    W.Z)(this, "options", void 0),
                                (0,
                                    W.Z)(this, "listenerQueue", void 0),
                                this.options = {
                                    throttleTime: n || 200,
                                    primaryKey: r
                                },
                                this.listenerQueue = []
                        }

                        return (0,
                            H.Z)(e, [{
                            key: "add",
                            value: function (e, t) {
                                var n = this.listenerQueue.find((function (t) {
                                        return t.el === e
                                    }
                                ));
                                if (n)
                                    n.update(e, t);
                                else {
                                    var r = new Q({
                                        el: e,
                                        value: t
                                    });
                                    this.listenerQueue.push(r)
                                }
                            }
                        }, {
                            key: "update",
                            value: function (e, t, n) {
                                if (this.listenerQueue.length && (!this.options.primaryKey || t[this.options.primaryKey] !== n[this.options.primaryKey])) {
                                    var r = this.listenerQueue.find((function (t) {
                                            return t.el === e
                                        }
                                    ));
                                    r && r.update(e, t)
                                }
                            }
                        }, {
                            key: "remove",
                            value: function (e) {
                                var t = this.listenerQueue.findIndex((function (t) {
                                        return t.el === e
                                    }
                                ));
                                t > -1 && this.listenerQueue.splice(t, 1)[0].destroy()
                            }
                        }]),
                            e
                    }()
                        , J = new j({
                        primaryKey: "show_id"
                    })
                        , K = {
                        pv: function (e, t) {
                            (0,
                                P.yC)(t),
                                (0,
                                    P.gp)(t)
                        },
                        show: function (e, t) {
                            J.add.bind(J)(e, t)
                        },
                        click: function (e, t) {
                            e.onclick = function () {
                                !function (e, t) {
                                    (0,
                                        P.gp)(t)
                                }(0, t)
                            }
                        },
                        all: function (e, t) {
                            J.add.bind(J)(e, Object.assign(t, {
                                type: "show"
                            })),
                                e.onclick = function () {
                                    (0,
                                        P.gp)(Object.assign(t, {
                                        type: "click"
                                    }))
                                }
                        }
                    }
                        , Y = {
                        show: function (e) {
                            J.remove.bind(J)(e)
                        },
                        click: function (e) {
                            var t = setTimeout((function () {
                                    e.onclick = null,
                                        clearTimeout(t),
                                        t = null
                                }
                            ), 0)
                        },
                        all: function (e) {
                            J.remove.bind(J)(e);
                            var t = setTimeout((function () {
                                    e.onclick = null,
                                        clearTimeout(t),
                                        t = null
                                }
                            ))
                        }
                    }
                        , q = {
                        beforeMount: function (e, t) {
                            var n = t.value
                                , r = n.type;
                            r && (r = r.toLowerCase()),
                            K[r] && K[r](e, n)
                        },
                        updated: function (e, t) {
                            var n = t.value
                                , r = t.oldValue;
                            J.update.bind(J)(e, n, r)
                        },
                        unmounted: function (e, t) {
                            var n = t.value.type;
                            n && (n = n.toLowerCase()),
                            Y[n] && Y[n](e)
                        }
                    }
                        , $ = n(56182)
                        , z = n(42238)
                        , X = n(68732)
                        , ee = n.n(X);

                    function te() {
                        return "https:" === location.protocol || "localhost" === location.hostname
                    }

                    function ne() {
                        return re.apply(this, arguments)
                    }

                    function re() {
                        return (re = (0,
                            r.Z)(o().mark((function e() {
                                var t;
                                return o().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    if ("Notification" in window) {
                                                        e.next = 2;
                                                        break
                                                    }
                                                    return e.abrupt("return");
                                                case 2:
                                                    if ("granted" !== Notification.permission) {
                                                        e.next = 4;
                                                        break
                                                    }
                                                    return e.abrupt("return");
                                                case 4:
                                                    if ("denied" === Notification.permission) {
                                                        e.next = 9;
                                                        break
                                                    }
                                                    return e.next = 7,
                                                        Notification.requestPermission();
                                                case 7:
                                                    "denied" === (t = e.sent) ? console.log("serviceworker denied") : "granted" === t && console.log("serviceworker granted");
                                                case 9:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e)
                            }
                        )))).apply(this, arguments)
                    }

                    function ie() {
                        return (ie = (0,
                            r.Z)(o().mark((function e() {
                                return o().wrap((function (e) {
                                        for (; ;)
                                            switch (e.prev = e.next) {
                                                case 0:
                                                    if (p.C5) {
                                                        e.next = 2;
                                                        break
                                                    }
                                                    return e.abrupt("return");
                                                case 2:
                                                    if ("serviceWorker" in window.navigator && te()) {
                                                        e.next = 5;
                                                        break
                                                    }
                                                    return e.abrupt("return");
                                                case 5:
                                                    return e.next = 7,
                                                        ne();
                                                case 7:
                                                    return e.next = 9,
                                                        ee().register();
                                                case 9:
                                                    console.log("serviceworker 注册成功");
                                                case 10:
                                                case "end":
                                                    return e.stop()
                                            }
                                    }
                                ), e)
                            }
                        )))).apply(this, arguments)
                    }

                    var oe = n(3925)
                        , ae = n(64816)
                        , ue = n(87223)
                        , se = function (e) {
                        var t = e.uaInfo
                            , n = (0,
                            u.vr)(R)
                            , r = (0,
                            l.p7)({
                            routes: f,
                            history: d
                        })
                            , i = (0,
                            s.WB)()
                            , o = (0,
                            c.Bg)(p.sk, {
                            meta: {
                                tag: "meta",
                                nameless: !0
                            }
                        });
                        return n.provide(w.Ko, t),
                            n.use(r).use(o).use(i).use(N.ZP, {
                                default: {
                                    FORBID_TAGS: ["a", "img"]
                                }
                            }),
                            {
                                app: n,
                                router: r,
                                pinia: i,
                                uaInfo: t
                            }
                    }({
                        uaInfo: (new z.UAParser).getResult()
                    })
                        , ce = se.app
                        , le = se.router
                        , pe = se.pinia;
                    if (p.Gg) {
                        var de, fe = null === (de = location.host) || void 0 === de ? void 0 : de.includes("kankan"),
                            ye = fe || (0,
                                p.yc)() ? {
                                protocol: "https:",
                                dsn: "fe665045768d4fc69f7ede10e32286a7",
                                porject: "game-live-next-test",
                                urlPrefix: "~/",
                                sentryUrl: "sentry-web.corp.kuaishou.com",
                                dsnSeq: "2222"
                            } : {
                                protocol: "https:",
                                dsn: "f5bf0fc0084a4efe9a9677e15cdc3af9",
                                porject: "game-live-next",
                                urlPrefix: "~/udata/pkg/KS-GAME-WEB/pc-live-next/",
                                sentryUrl: "sentry.kuaishou.com",
                                dsnSeq: "2221"
                            };
                        oe.S({
                            app: ce,
                            dsn: "".concat(ye.protocol, "//").concat(ye.dsn, "@").concat(ye.sentryUrl, "/").concat(ye.dsnSeq),
                            release: "0a6920e",
                            integrations: [new ue.jK.gE({
                                routingInstrumentation: ae.x(le),
                                tracingOrigins: ["localhost", /^\//]
                            })],
                            beforeBreadcrumb: function (e) {
                                return "xhr" !== e.category || "/rest/wd/live/web/collect" !== e.data.url && "/api/h5/log" !== e.data.url ? e : null
                            },
                            ignoreErrors: ["SourceBuffer", "x5onSkinSwitch", "HTMLMediaElement"],
                            tracesSampleRate: fe ? 1 : .01,
                            environment: fe ? "kankan" : "prod"
                        })
                    }
                    (0,
                        P.oe)(),
                    window.__INITIAL_STATE__ && (pe.state.value = window.__INITIAL_STATE__),
                        (0,
                            $.init)({
                            env: {
                                staging: "staging",
                                prt: "production",
                                production: "production"
                            }[(0,
                                p.IT)()],
                            sid: "kuaishou.live.web",
                            useKsCaptcha: !0
                        }),
                        ce.directive("log", q),
                        ce.use(V),
                        le.afterEach(function () {
                            var e = (0,
                                r.Z)(o().mark((function e(t) {
                                    return o().wrap((function (e) {
                                            for (; ;)
                                                switch (e.prev = e.next) {
                                                    case 0:
                                                        return e.next = 2,
                                                            (0,
                                                                a.Y3)();
                                                    case 2:
                                                        (0,
                                                            L.v_)(),
                                                        U[t.name] && x.Z.updateCurrentUrlPackage({
                                                            page: U[t.name]
                                                        });
                                                    case 4:
                                                    case "end":
                                                        return e.stop()
                                                }
                                        }
                                    ), e)
                                }
                            )));
                            return function (t) {
                                return e.apply(this, arguments)
                            }
                        }()),
                        le.isReady().then((function () {
                                ce.mount("#app")
                            }
                        ));
                    try {
                        !function () {
                            ie.apply(this, arguments)
                        }()
                    } catch (e) {
                        console.log("e = ", e)
                    }
                }
                ,
                15327: (e, t, n) => {
                    n.d(t, {
                        P: () => s
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = n(40830)
                        , u = n(4352)
                        , s = (0,
                        a.Q_)("pcConfig", {
                        state: function () {
                            return {
                                pcConfig: {}
                            }
                        },
                        actions: {
                            getPcConfig: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                (0,
                                                                    u.v_)("/live_api/web/pcConfig");
                                                        case 2:
                                                            n = t.sent,
                                                                e.pcConfig = n.data;
                                                        case 4:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            e.getPcConfig();
                                                        case 1:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            }
                        },
                        getters: {
                            config: function () {
                                var e;
                                return (null === (e = this.pcConfig) || void 0 === e ? void 0 : e.config) || {}
                            },
                            abTest: function () {
                                var e;
                                return (null === (e = this.pcConfig) || void 0 === e ? void 0 : e.abTest) || {}
                            },
                            showInDanmakuGiftIds: function () {
                                return this.config["pcLive.webConfig.liveGiftShowInBarrage"] || []
                            },
                            did: function () {
                                var e;
                                return (null === (e = this.pcConfig) || void 0 === e ? void 0 : e.did) || ""
                            }
                        }
                    })
                }
                ,
                21510: (e, t, n) => {
                    n.d(t, {
                        hW: () => o,
                        _M: () => a,
                        We: () => u,
                        dd: () => s,
                        Or: () => c,
                        EJ: () => l,
                        FA: () => p,
                        IL: () => d,
                        M1: () => f,
                        sU: () => y,
                        ge: () => v,
                        fd: () => h,
                        bY: () => m,
                        EQ: () => b,
                        kW: () => S,
                        TY: () => _,
                        DN: () => g,
                        t2: () => E,
                        hQ: () => C,
                        fg: () => T,
                        Pr: () => I,
                        bz: () => O,
                        Tm: () => w,
                        Nr: () => k,
                        ol: () => A,
                        cW: () => R
                    });
                    var r = n(21428)
                        , i = n(92598)
                        , o = function (e, t) {
                        (0,
                            r.Qy)(i.tq, e, t)
                    }
                        , a = function () {
                        (0,
                            r.Qy)(i.hL)
                    }
                        , u = function () {
                        (0,
                            r.Qy)(i.NH)
                    }
                        , s = function (e) {
                        (0,
                            r.Qy)(i.Ff, e)
                    }
                        , c = function (e) {
                        (0,
                            r.Qy)(i.gB, e)
                    }
                        , l = function (e) {
                        (0,
                            r.Qy)(i.qT, e)
                    }
                        , p = function (e) {
                        (0,
                            r.Qy)(i.N_, e)
                    }
                        , d = function (e) {
                        (0,
                            r.Qy)(i.cl, e)
                    }
                        , f = function (e) {
                        (0,
                            r.Qy)(i.nh, e)
                    }
                        , y = function (e, t) {
                        (0,
                            r.Qy)(i.cM, e, t)
                    }
                        , v = function (e) {
                        (0,
                            r.Qy)(i.eo, e)
                    }
                        , h = function (e) {
                        (0,
                            r.Qy)(i.i9, e)
                    }
                        , m = function (e) {
                        (0,
                            r.Qy)(i.Oj, e)
                    }
                        , b = function () {
                        (0,
                            r.Qy)(i.VR)
                    }
                        , S = function (e) {
                        (0,
                            r.Qy)(i.hn, e)
                    }
                        , _ = function () {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        (0,
                            r.Qy)(i.mk, t)
                    }
                        , g = function (e, t) {
                        (0,
                            r.Qy)(i.gm, e, t)
                    }
                        , E = function () {
                        (0,
                            r.Qy)(i.a4)
                    }
                        , C = function (e) {
                        (0,
                            r.Qy)(i.rz, e)
                    }
                        , T = function (e) {
                        (0,
                            r.Qy)(i.CB, e)
                    }
                        , I = function () {
                        (0,
                            r.Qy)(i._u)
                    }
                        , O = function () {
                        (0,
                            r.Qy)(i.b_)
                    }
                        , w = function (e) {
                        (0,
                            r.Qy)(i.bg, e)
                    }
                        , k = function (e) {
                        (0,
                            r.Qy)(i.XZ, e)
                    }
                        , A = function (e) {
                        (0,
                            r.Qy)(i.$s, e)
                    };

                    function R(e) {
                        (0,
                            r.Qy)(i.zX, e)
                    }
                }
                ,
                24673: (e, t, n) => {
                    n.d(t, {
                        $: () => p
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = n(40830)
                        , u = n(4352)
                        , s = n(34462)
                        , c = n(53825)
                        , l = n(28364)
                        , p = (0,
                        a.Q_)("giftSendStore", {
                        state: function () {
                            return {
                                prePayQuery: {},
                                payQuery: {},
                                styleType: "",
                                polling: !1,
                                pollFn: {
                                    startPoll: null,
                                    stopPoll: null
                                },
                                prePayInput: {
                                    ksCoin: 0,
                                    fen: 0,
                                    timeStamp: 0
                                },
                                payResult: -1
                            }
                        },
                        actions: {
                            getPayQuery: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            if ((0,
                                                                c.H)().userInfo.id) {
                                                                t.next = 2;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 2:
                                                            return t.next = 4,
                                                                (0,
                                                                    u.U2)("/live_api/web/pay/get-pay");
                                                        case 4:
                                                            n = t.sent,
                                                                e.payQuery = n.data;
                                                        case 6:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            getPrePayOrderInfo: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            if (e.prePayInput.fen && e.prePayInput.ksCoin) {
                                                                t.next = 2;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 2:
                                                            return t.next = 4,
                                                                r = {
                                                                    ksCoin: e.prePayInput.ksCoin,
                                                                    fen: e.prePayInput.fen
                                                                },
                                                                (0,
                                                                    u.U2)("/live_api/web/pay/pre-pay", r);
                                                        case 4:
                                                            if (1 === (n = t.sent.data).result) {
                                                                t.next = 7;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 7:
                                                            e.prePayQuery = n;
                                                        case 8:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                                var r
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            confirmPay: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n, i, a;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            if (e.prePayQuery.ksOrderId) {
                                                                t.next = 2;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 2:
                                                            n = (0,
                                                                l.$)({
                                                                delay: 2e3,
                                                                auto: !0,
                                                                handleFun: function () {
                                                                    var t = (0,
                                                                        r.Z)(o().mark((function t() {
                                                                            var n;
                                                                            return o().wrap((function (t) {
                                                                                    for (; ;)
                                                                                        switch (t.prev = t.next) {
                                                                                            case 0:
                                                                                                return t.next = 2,
                                                                                                    r = e.prePayQuery.ksOrderId,
                                                                                                    (0,
                                                                                                        u.U2)("/live_api/web/pay/confirm", {
                                                                                                        ksOrderId: r
                                                                                                    });
                                                                                            case 2:
                                                                                                n = t.sent.data,
                                                                                                    e.payResult = (null == n ? void 0 : n.result) || -1;
                                                                                            case 4:
                                                                                            case "end":
                                                                                                return t.stop()
                                                                                        }
                                                                                    var r
                                                                                }
                                                                            ), t)
                                                                        }
                                                                    )));
                                                                    return function () {
                                                                        return t.apply(this, arguments)
                                                                    }
                                                                }()
                                                            }),
                                                                i = n.startPoll,
                                                                a = n.stopPoll,
                                                                e.pollFn.startPoll = i,
                                                                e.pollFn.stopPoll = a;
                                                        case 5:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            refetchPayInfo: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.prev = 0,
                                                                t.next = 3,
                                                                e.getPayQuery();
                                                        case 3:
                                                            t.next = 8;
                                                            break;
                                                        case 5:
                                                            t.prev = 5,
                                                                t.t0 = t.catch(0),
                                                                console.log("refetchPayInfo e =", t.t0);
                                                        case 8:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t, null, [[0, 5]])
                                    }
                                )))()
                            },
                            sendGift: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            return n.next = 2,
                                                                (0,
                                                                    s.hF)(e);
                                                        case 2:
                                                            if (1 === (r = n.sent.data).result) {
                                                                n.next = 5;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 5:
                                                            t.payQuery.payWallet.ksCoin = r.ksCoin,
                                                                t.styleType = r.styleType;
                                                        case 7:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                e.getPayQuery();
                                                        case 2:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            setPolling: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r, i;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            if (t.polling = e,
                                                                !e) {
                                                                n.next = 7;
                                                                break
                                                            }
                                                            return n.next = 4,
                                                                t.confirmPay();
                                                        case 4:
                                                            (null === (r = t.pollFn) || void 0 === r ? void 0 : r.startPoll) && t.pollFn.startPoll(),
                                                                n.next = 8;
                                                            break;
                                                        case 7:
                                                            (null === (i = t.pollFn) || void 0 === i ? void 0 : i.stopPoll) && t.pollFn.stopPoll();
                                                        case 8:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            },
                            modifyPrePayInput: function (e) {
                                this.prePayInput.ksCoin = e.ksCoin,
                                    this.prePayInput.fen = e.fen,
                                    this.prePayInput.timeStamp = e.timeStamp
                            }
                        },
                        getters: {
                            ksCoin: function () {
                                var e;
                                return (0,
                                    c.H)().userInfo.id && (null === (e = this.payQuery.payWallet) || void 0 === e ? void 0 : e.ksCoin) || 0
                            },
                            depositRate: function () {
                                var e;
                                return (null === (e = this.payQuery.payConfig) || void 0 === e ? void 0 : e.depositRate) || 10
                            },
                            minDepositFen: function () {
                                var e;
                                return (null === (e = this.payQuery.payConfig) || void 0 === e ? void 0 : e.minDepositFen) || 600
                            },
                            maxDepositFen: function () {
                                var e;
                                return (null === (e = this.payQuery.payConfig) || void 0 === e ? void 0 : e.maxDepositFen) || 1e8
                            },
                            payKey: function () {
                                return this.payQuery.payKey || ""
                            },
                            sendGiftResult: function () {
                                return this.sendGiftMutation.data.sendGift
                            },
                            merchantId: function () {
                                var e;
                                return (null === (e = this.prePayQuery) || void 0 === e ? void 0 : e.merchantId) || ""
                            },
                            outOrderNo: function () {
                                var e;
                                return (null === (e = this.prePayQuery) || void 0 === e ? void 0 : e.outOrderNo) || ""
                            },
                            ksOrderId: function () {
                                var e;
                                return (null === (e = this.prePayQuery) || void 0 === e ? void 0 : e.ksOrderId) || ""
                            }
                        }
                    })
                }
                ,
                11878: (e, t, n) => {
                    n.d(t, {
                        PK: () => h.P,
                        lO: () => s,
                        $J: () => m.$,
                        Tm: () => S.Tm,
                        hW: () => S.hW,
                        _M: () => S._M,
                        We: () => S.We,
                        Nr: () => S.Nr,
                        fg: () => S.fg,
                        cW: () => S.cW,
                        DN: () => S.DN,
                        dd: () => S.dd,
                        hh: () => v,
                        HP: () => c.H
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = n(40830)
                        , u = n(34462)
                        , s = (0,
                        a.Q_)("emoji", {
                        state: function () {
                            return {
                                iconUrls: {},
                                allGifts: {},
                                giftList: [],
                                token: ""
                            }
                        },
                        actions: {
                            getGift: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r, i, a;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            return n.next = 2,
                                                                (0,
                                                                    u.L8)({
                                                                    liveStreamId: e
                                                                });
                                                        case 2:
                                                            r = n.sent.data,
                                                                i = r.gifts,
                                                                a = r.token,
                                                                t.giftList = i,
                                                                t.token = a;
                                                        case 7:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n, r;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                (0,
                                                                    u.gx)();
                                                        case 2:
                                                            return n = t.sent,
                                                                e.iconUrls = n.data.iconUrls,
                                                                t.next = 6,
                                                                (0,
                                                                    u.VE)();
                                                        case 6:
                                                            r = t.sent,
                                                                e.allGifts = r.data;
                                                        case 8:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            }
                        }
                    })
                        , c = n(53825)
                        , l = (n(19601),
                        n(42201))
                        , p = n(22201)
                        , d = n(66252)
                        , f = n(69649)
                        , y = {
                        banned: "BANNED",
                        socialBanned: "SOCIALBANNED",
                        isolate: "ISOLATE",
                        cleanState: "CLEAN"
                    }
                        , v = (0,
                        a.Q_)("authorInfoById", {
                        state: function () {
                            return {
                                principalId: "",
                                userInfo: {
                                    kwaiId: "",
                                    originUserId: "",
                                    name: "",
                                    avatar: "",
                                    sex: "U",
                                    description: "",
                                    cityName: "",
                                    living: !1,
                                    constellation: "",
                                    privacy: !1,
                                    verifiedStatus: {},
                                    bannedStatus: {}
                                },
                                followInfo: {},
                                sensitiveInfo: {
                                    kwaiId: "",
                                    originUserId: "",
                                    constellation: "",
                                    cityName: "",
                                    counts: {}
                                },
                                banStateMap: y
                            }
                        },
                        getters: {
                            author: function () {
                                return Object.assign({}, this.userInfo, this.followInfo, this.sensitiveInfo)
                            },
                            authorBannedValue: function () {
                                var e = this.getBannedState(this.author);
                                return e === this.banStateMap.cleanState ? null : e
                            }
                        },
                        actions: {
                            getBannedState: function (e) {
                                return e && e.bannedStatus ? e.bannedStatus.banned ? this.banStateMap.banned : e.bannedStatus.socialBanned ? this.banStateMap.socialBanned : this.banStateMap.cleanState : this.banStateMap.cleanState
                            },
                            getAbnormalState: function (e) {
                                if (!e || !e.bannedStatus)
                                    return this.banStateMap.cleanState;
                                var t = this.getBannedState(e);
                                return t !== this.banStateMap.cleanState ? t : e.bannedStatus.isolate ? this.banStateMap.isolate : this.banStateMap.cleanState
                            },
                            fetchFollowedInfoStatus: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            return n.prev = 0,
                                                                n.next = 3,
                                                                (0,
                                                                    l.sz)(e);
                                                        case 3:
                                                            if ((r = n.sent.data) && 1 === r.result) {
                                                                n.next = 6;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 6:
                                                            t.followInfo.followStatus = r.userInfo.followStatus,
                                                                n.next = 12;
                                                            break;
                                                        case 9:
                                                            n.prev = 9,
                                                                n.t0 = n.catch(0),
                                                                console.log("fetchFollowedInfoStatus e =", n.t0);
                                                        case 12:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n, null, [[0, 9]])
                                    }
                                )))()
                            },
                            fetchUserInfo: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            return n.prev = 0,
                                                                n.next = 3,
                                                                (0,
                                                                    l.sz)(e);
                                                        case 3:
                                                            if ((r = n.sent.data) && 1 === r.result) {
                                                                n.next = 6;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 6:
                                                            t.userInfo = r.userInfo,
                                                                n.next = 12;
                                                            break;
                                                        case 9:
                                                            n.prev = 9,
                                                                n.t0 = n.catch(0),
                                                                console.log("fetchUserInfo e =", n.t0);
                                                        case 12:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n, null, [[0, 9]])
                                    }
                                )))()
                            },
                            fetchSensitiveUserInfo: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r, i, a, u, s, c, p;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            if (n.prev = 0,
                                                                (0,
                                                                    d.f3)(f.n0).value) {
                                                                n.next = 4;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 4:
                                                            return n.next = 6,
                                                                (0,
                                                                    l.ft)(e);
                                                        case 6:
                                                            if ((r = n.sent.data) && 1 === r.result) {
                                                                n.next = 9;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 9:
                                                            i = r.sensitiveUserInfo,
                                                                a = i.kwaiId,
                                                                u = i.originUserId,
                                                                s = i.constellation,
                                                                c = i.cityName,
                                                                p = i.counts,
                                                                t.sensitiveInfo = {
                                                                    kwaiId: a,
                                                                    originUserId: u,
                                                                    constellation: s,
                                                                    cityName: c,
                                                                    counts: p
                                                                },
                                                                n.next = 16;
                                                            break;
                                                        case 13:
                                                            n.prev = 13,
                                                                n.t0 = n.catch(0),
                                                                console.log("fetchSensitiveUserInfo e =", n.t0);
                                                        case 16:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n, null, [[0, 13]])
                                    }
                                )))()
                            },
                            setAuthorPrincipalId: function (e) {
                                this.principalId = e
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n, r;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            if (n = (0,
                                                                p.yj)(),
                                                                r = n.params.principalId) {
                                                                t.next = 4;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 4:
                                                            e.setAuthorPrincipalId(r),
                                                                e.fetchUserInfo(r),
                                                                e.fetchSensitiveUserInfo(r);
                                                        case 7:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            }
                        }
                    })
                        , h = n(15327)
                        , m = n(24673)
                        , b = n(28364)
                        , S = ((0,
                        a.Q_)("myFollowCountn", {
                        state: function () {
                            return {
                                followCount: 0
                            }
                        },
                        actions: {
                            getUserFollowCount: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n, r, i, a;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            if ((0,
                                                                c.H)().userInfo.originUserId) {
                                                                t.next = 2;
                                                                break
                                                            }
                                                            return t.abrupt("return");
                                                        case 2:
                                                            return t.next = 4,
                                                                (0,
                                                                    l.Uc)();
                                                        case 4:
                                                            a = t.sent,
                                                                e.followCount = null !== (n = null === (r = a.data) || void 0 === r || null === (i = r.follow) || void 0 === i ? void 0 : i.length) && void 0 !== n ? n : 0;
                                                        case 6:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            (0,
                                                                (0,
                                                                    b.$)({
                                                                    delay: 3e4,
                                                                    auto: !0,
                                                                    handleFun: function () {
                                                                        e.getUserFollowCount()
                                                                    }
                                                                }).startPoll)();
                                                        case 2:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            }
                        }
                    }),
                        n(21510))
                }
                ,
                53825: (e, t, n) => {
                    n.d(t, {
                        H: () => d
                    });
                    var r = n(15861)
                        , i = n(87757)
                        , o = n.n(i)
                        , a = (n(89554),
                        n(41539),
                        n(54747),
                        n(47941),
                        n(40830))
                        , u = n(42201)
                        , s = n(41929)
                        , c = n(4302)
                        , l = n(56182)
                        , p = n(92876)
                        , d = (0,
                        a.Q_)("user", {
                        state: function () {
                            return {
                                name: "",
                                age: 0,
                                banned: "BANNED",
                                socialBanned: "SOCIALBANNED",
                                isolate: "ISOLATE",
                                cleanState: "CLEAN",
                                bannedErrMsg: "由于违反社区规定，账号封禁，请前往快手APP进行解封申诉",
                                socialBannedErrMsg: "账号异常，请前往快手APP激活",
                                isolateErrMsg: "该链接指向页面不存在",
                                bannedErrMsgByOther: "该用户因违反社区规定，账号封禁",
                                qrLoginInfo: {},
                                userInfoQuery: {},
                                loginMutation: {}
                            }
                        },
                        actions: {
                            getBannedState: function (e) {
                                return e && e.bannedStatus ? e.bannedStatus.banned ? this.banned : e.bannedStatus.socialBanned ? this.socialBanned : this.cleanState : this.cleanState
                            },
                            getAbnormalState: function (e) {
                                if (!e || !e.bannedStatus)
                                    return this.cleanState;
                                var t = this.getBannedState(e);
                                return t !== this.cleanState ? t : e.bannedStatus.isolate ? this.isolate : this.cleanState
                            },
                            cleanUserInfo: function () {
                                var e = this;
                                Object.keys(this.userInfo).forEach((function (t) {
                                        e.userInfo[t] = ""
                                    }
                                ))
                            },
                            logoutMutation: function () {
                                return (0,
                                    r.Z)(o().mark((function e() {
                                        return o().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            return e.next = 2,
                                                                (0,
                                                                    u.TN)();
                                                        case 2:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))()
                            },
                            modifyUserInfo: function (e) {
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        var n, r;
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return n = e.userName,
                                                                r = e.userSex,
                                                                t.next = 3,
                                                                (0,
                                                                    u.wJ)({
                                                                    userModifyInfo: {
                                                                        userName: n,
                                                                        userSex: r
                                                                    }
                                                                });
                                                        case 3:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            getUserInfoQuery: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            if ((0,
                                                                s._6)("userId", e ? e.cookie : document.cookie)) {
                                                                n.next = 3;
                                                                break
                                                            }
                                                            return n.abrupt("return");
                                                        case 3:
                                                            return n.next = 5,
                                                                (0,
                                                                    u.U$)(e);
                                                        case 5:
                                                            r = n.sent,
                                                                t.userInfoQuery = r.data;
                                                        case 7:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            },
                            getUserInfo: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                e.getUserInfoQuery();
                                                        case 2:
                                                            c.C5 && p.v("userInfo", {
                                                                username: e.userInfo.id
                                                            }),
                                                            c.C5 && e.userInfo.id;
                                                        case 4:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            login: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r, i;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            return r = e.authToken,
                                                                i = e.sid,
                                                                n.next = 3,
                                                                (0,
                                                                    u.pu)({
                                                                    userLoginInfo: {
                                                                        authToken: r,
                                                                        sid: i
                                                                    }
                                                                });
                                                        case 3:
                                                            return n.next = 5,
                                                                t.getUserInfo();
                                                        case 5:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            },
                            logout: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                (0,
                                                                    l.logout)();
                                                        case 2:
                                                            return t.next = 4,
                                                                e.logoutMutation();
                                                        case 4:
                                                            p.v("userInfo", {}),
                                                                e.cleanUserInfo();
                                                        case 6:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            getQRCode: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                (0,
                                                                    l.getQRLoginInfo)();
                                                        case 2:
                                                            e.qrLoginInfo = t.sent;
                                                        case 3:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            getUserLoginInfo: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.abrupt("return", (0,
                                                                l.getUserLoginInfo)({
                                                                qrLoginSignature: e.qrLoginInfo.qrLoginSignature,
                                                                qrLoginToken: e.qrLoginInfo.qrLoginToken
                                                            }));
                                                        case 1:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            scanQRLoginResult: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.abrupt("return", (0,
                                                                l.scanQRLoginResult)({
                                                                qrLoginSignature: e.qrLoginInfo.qrLoginSignature,
                                                                qrLoginToken: e.qrLoginInfo.qrLoginToken
                                                            }));
                                                        case 1:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            requestMobileCode: function (e) {
                                return (0,
                                    l.requestMobileCode)(e)
                            },
                            register: function (e) {
                                return (0,
                                    l.register)(e)
                            },
                            cancelQrLogin: function () {
                                (0,
                                    l.cancelQrLogin)()
                            },
                            preload: function () {
                                var e = this;
                                return (0,
                                    r.Z)(o().mark((function t() {
                                        return o().wrap((function (t) {
                                                for (; ;)
                                                    switch (t.prev = t.next) {
                                                        case 0:
                                                            return t.next = 2,
                                                                e.getUserInfoQuery();
                                                        case 2:
                                                        case "end":
                                                            return t.stop()
                                                    }
                                            }
                                        ), t)
                                    }
                                )))()
                            },
                            prefetch: function (e) {
                                var t = this;
                                return (0,
                                    r.Z)(o().mark((function n() {
                                        var r;
                                        return o().wrap((function (n) {
                                                for (; ;)
                                                    switch (n.prev = n.next) {
                                                        case 0:
                                                            if (!(r = e.ssrHeaders)) {
                                                                n.next = 4;
                                                                break
                                                            }
                                                            return n.next = 4,
                                                                t.getUserInfoQuery({
                                                                    cookie: r.cookie
                                                                });
                                                        case 4:
                                                        case "end":
                                                            return n.stop()
                                                    }
                                            }
                                        ), n)
                                    }
                                )))()
                            }
                        },
                        getters: {
                            userInfo: function () {
                                var e;
                                return null !== (e = this.userInfoQuery) && void 0 !== e && e.ownerInfo ? this.userInfoQuery.ownerInfo : {
                                    verifiedStatus: {},
                                    counts: {},
                                    bannedStatus: {}
                                }
                            },
                            kshellBalance: function () {
                                var e;
                                return (null === (e = this.userInfoQuery.kshellBalance) || void 0 === e ? void 0 : e.kshell) || 0
                            },
                            userBannedValue: function () {
                                var e = this.getBannedState(this.userInfo);
                                return e === this.cleanState ? null : e
                            },
                            ownerInfoDataReady: function () {
                                return !this.userInfoQuery.loading
                            },
                            hasLogin: function () {
                                var e, t;
                                return !(null === (e = this.userInfoQuery) || void 0 === e || null === (t = e.ownerInfo) || void 0 === t || !t.id)
                            }
                        }
                    })
                }
                ,
                88605: (e, t, n) => {
                    n.d(t, {
                        Z: () => a
                    });
                    var r = n(71002);
                    n(83710),
                        n(41539),
                        n(39714),
                        n(47042),
                        n(92222),
                        n(74916),
                        n(15306),
                        n(82772),
                        n(40561),
                        n(18264),
                        n(39575),
                        n(16716),
                        n(69600),
                        e = n.hmd(e);
                    var i, o = {
                        cipher: {},
                        hash: {},
                        keyexchange: {},
                        mode: {},
                        misc: {},
                        codec: {},
                        exception: {
                            corrupt: function (e) {
                                this.toString = function () {
                                    return "CORRUPT: " + this.message
                                }
                                    ,
                                    this.message = e
                            },
                            invalid: function (e) {
                                this.toString = function () {
                                    return "INVALID: " + this.message
                                }
                                    ,
                                    this.message = e
                            },
                            bug: function (e) {
                                this.toString = function () {
                                    return "BUG: " + this.message
                                }
                                    ,
                                    this.message = e
                            },
                            notReady: function (e) {
                                this.toString = function () {
                                    return "NOT READY: " + this.message
                                }
                                    ,
                                    this.message = e
                            }
                        }
                    };
                    o.cipher.aes = function (e) {
                        this._tables[0][0][0] || this._precompute();
                        var t, n, r, i, a, u = this._tables[0][4], s = this._tables[1], c = e.length, l = 1;
                        if (4 !== c && 6 !== c && 8 !== c)
                            throw new o.exception.invalid("invalid aes key size");
                        for (this._key = [i = e.slice(0), a = []],
                                 t = c; t < 4 * c + 28; t++)
                            r = i[t - 1],
                            (t % c == 0 || 8 === c && t % c == 4) && (r = u[r >>> 24] << 24 ^ u[r >> 16 & 255] << 16 ^ u[r >> 8 & 255] << 8 ^ u[255 & r],
                            t % c == 0 && (r = r << 8 ^ r >>> 24 ^ l << 24,
                                l = l << 1 ^ 283 * (l >> 7))),
                                i[t] = i[t - c] ^ r;
                        for (n = 0; t; n++,
                            t--)
                            r = i[3 & n ? t : t - 4],
                                a[n] = t <= 4 || n < 4 ? r : s[0][u[r >>> 24]] ^ s[1][u[r >> 16 & 255]] ^ s[2][u[r >> 8 & 255]] ^ s[3][u[255 & r]]
                    }
                        ,
                        o.cipher.aes.prototype = {
                            encrypt: function (e) {
                                return this._crypt(e, 0)
                            },
                            decrypt: function (e) {
                                return this._crypt(e, 1)
                            },
                            _tables: [[[], [], [], [], []], [[], [], [], [], []]],
                            _precompute: function () {
                                var e, t, n, r, i, o, a, u, s = this._tables[0], c = this._tables[1], l = s[4],
                                    p = c[4], d = [], f = [];
                                for (e = 0; e < 256; e++)
                                    f[(d[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
                                for (t = n = 0; !l[t]; t ^= r || 1,
                                    n = f[n] || 1)
                                    for (o = (o = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4) >> 8 ^ 255 & o ^ 99,
                                             l[t] = o,
                                             p[o] = t,
                                             u = 16843009 * d[i = d[r = d[t]]] ^ 65537 * i ^ 257 * r ^ 16843008 * t,
                                             a = 257 * d[o] ^ 16843008 * o,
                                             e = 0; e < 4; e++)
                                        s[e][t] = a = a << 24 ^ a >>> 8,
                                            c[e][o] = u = u << 24 ^ u >>> 8;
                                for (e = 0; e < 5; e++)
                                    s[e] = s[e].slice(0),
                                        c[e] = c[e].slice(0)
                            },
                            _crypt: function (e, t) {
                                if (4 !== e.length)
                                    throw new o.exception.invalid("invalid aes block size");
                                var n, r, i, a, u = this._key[t], s = e[0] ^ u[0], c = e[t ? 3 : 1] ^ u[1],
                                    l = e[2] ^ u[2], p = e[t ? 1 : 3] ^ u[3], d = u.length / 4 - 2, f = 4,
                                    y = [0, 0, 0, 0], v = this._tables[t], h = v[0], m = v[1], b = v[2], S = v[3],
                                    _ = v[4];
                                for (a = 0; a < d; a++)
                                    n = h[s >>> 24] ^ m[c >> 16 & 255] ^ b[l >> 8 & 255] ^ S[255 & p] ^ u[f],
                                        r = h[c >>> 24] ^ m[l >> 16 & 255] ^ b[p >> 8 & 255] ^ S[255 & s] ^ u[f + 1],
                                        i = h[l >>> 24] ^ m[p >> 16 & 255] ^ b[s >> 8 & 255] ^ S[255 & c] ^ u[f + 2],
                                        p = h[p >>> 24] ^ m[s >> 16 & 255] ^ b[c >> 8 & 255] ^ S[255 & l] ^ u[f + 3],
                                        f += 4,
                                        s = n,
                                        c = r,
                                        l = i;
                                for (a = 0; a < 4; a++)
                                    y[t ? 3 & -a : a] = _[s >>> 24] << 24 ^ _[c >> 16 & 255] << 16 ^ _[l >> 8 & 255] << 8 ^ _[255 & p] ^ u[f++],
                                        n = s,
                                        s = c,
                                        c = l,
                                        l = p,
                                        p = n;
                                return y
                            }
                        },
                        o.bitArray = {
                            bitSlice: function (e, t, n) {
                                return e = o.bitArray._shiftRight(e.slice(t / 32), 32 - (31 & t)).slice(1),
                                    void 0 === n ? e : o.bitArray.clamp(e, n - t)
                            },
                            extract: function (e, t, n) {
                                var r = Math.floor(-t - n & 31);
                                return (-32 & (t + n - 1 ^ t) ? e[t / 32 | 0] << 32 - r ^ e[t / 32 + 1 | 0] >>> r : e[t / 32 | 0] >>> r) & (1 << n) - 1
                            },
                            concat: function (e, t) {
                                if (0 === e.length || 0 === t.length)
                                    return e.concat(t);
                                var n = e[e.length - 1]
                                    , r = o.bitArray.getPartial(n);
                                return 32 === r ? e.concat(t) : o.bitArray._shiftRight(t, r, 0 | n, e.slice(0, e.length - 1))
                            },
                            bitLength: function (e) {
                                var t, n = e.length;
                                return 0 === n ? 0 : (t = e[n - 1],
                                32 * (n - 1) + o.bitArray.getPartial(t))
                            },
                            clamp: function (e, t) {
                                if (32 * e.length < t)
                                    return e;
                                var n = (e = e.slice(0, Math.ceil(t / 32))).length;
                                return t &= 31,
                                n > 0 && t && (e[n - 1] = o.bitArray.partial(t, e[n - 1] & 2147483648 >> t - 1, 1)),
                                    e
                            },
                            partial: function (e, t, n) {
                                return 32 === e ? t : (n ? 0 | t : t << 32 - e) + 1099511627776 * e
                            },
                            getPartial: function (e) {
                                return Math.round(e / 1099511627776) || 32
                            },
                            equal: function (e, t) {
                                if (o.bitArray.bitLength(e) !== o.bitArray.bitLength(t))
                                    return !1;
                                var n, r = 0;
                                for (n = 0; n < e.length; n++)
                                    r |= e[n] ^ t[n];
                                return 0 === r
                            },
                            _shiftRight: function (e, t, n, r) {
                                var i, a, u;
                                for (void 0 === r && (r = []); t >= 32; t -= 32)
                                    r.push(n),
                                        n = 0;
                                if (0 === t)
                                    return r.concat(e);
                                for (i = 0; i < e.length; i++)
                                    r.push(n | e[i] >>> t),
                                        n = e[i] << 32 - t;
                                return a = e.length ? e[e.length - 1] : 0,
                                    u = o.bitArray.getPartial(a),
                                    r.push(o.bitArray.partial(t + u & 31, t + u > 32 ? n : r.pop(), 1)),
                                    r
                            },
                            _xor4: function (e, t) {
                                return [e[0] ^ t[0], e[1] ^ t[1], e[2] ^ t[2], e[3] ^ t[3]]
                            },
                            byteswapM: function (e) {
                                var t, n;
                                for (t = 0; t < e.length; ++t)
                                    n = e[t],
                                        e[t] = n >>> 24 | n >>> 8 & 65280 | (65280 & n) << 8 | n << 24;
                                return e
                            }
                        },
                        o.codec.utf8String = {
                            fromBits: function (e) {
                                var t, n, r = "", i = o.bitArray.bitLength(e);
                                for (t = 0; t < i / 8; t++)
                                    0 == (3 & t) && (n = e[t / 4]),
                                        r += String.fromCharCode(n >>> 8 >>> 8 >>> 8),
                                        n <<= 8;
                                return decodeURIComponent(escape(r))
                            },
                            toBits: function (e) {
                                e = unescape(encodeURIComponent(e));
                                var t, n = [], r = 0;
                                for (t = 0; t < e.length; t++)
                                    r = r << 8 | e.charCodeAt(t),
                                    3 == (3 & t) && (n.push(r),
                                        r = 0);
                                return 3 & t && n.push(o.bitArray.partial(8 * (3 & t), r)),
                                    n
                            }
                        },
                        o.codec.base64 = {
                            _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                            fromBits: function (e, t, n) {
                                var r, i = "", a = 0, u = o.codec.base64._chars, s = 0, c = o.bitArray.bitLength(e);
                                for (n && (u = u.substr(0, 62) + "-_"),
                                         r = 0; 6 * i.length < c;)
                                    i += u.charAt((s ^ e[r] >>> a) >>> 26),
                                        a < 6 ? (s = e[r] << 6 - a,
                                            a += 26,
                                            r++) : (s <<= 6,
                                            a -= 6);
                                for (; 3 & i.length && !t;)
                                    i += "=";
                                return i
                            },
                            toBits: function (e, t) {
                                e = e.replace(/\s|=/g, "");
                                var n, r, i = [], a = 0, u = o.codec.base64._chars, s = 0;
                                for (t && (u = u.substr(0, 62) + "-_"),
                                         n = 0; n < e.length; n++) {
                                    if ((r = u.indexOf(e.charAt(n))) < 0)
                                        throw new o.exception.invalid("this isn't base64!");
                                    a > 26 ? (a -= 26,
                                        i.push(s ^ r >>> a),
                                        s = r << 32 - a) : s ^= r << 32 - (a += 6)
                                }
                                return 56 & a && i.push(o.bitArray.partial(56 & a, s, 1)),
                                    i
                            }
                        },
                        o.codec.base64url = {
                            fromBits: function (e) {
                                return o.codec.base64.fromBits(e, 1, 1)
                            },
                            toBits: function (e) {
                                return o.codec.base64.toBits(e, 1)
                            }
                        },
                        o.mode.cbc = {
                            name: "cbc",
                            encrypt: function (e, t, n, r) {
                                if (r && r.length)
                                    throw new o.exception.invalid("cbc can't authenticate data");
                                if (128 !== o.bitArray.bitLength(n))
                                    throw new o.exception.invalid("cbc iv must be 128 bits");
                                var i, a = o.bitArray, u = a._xor4, s = a.bitLength(t), c = 0, l = [];
                                if (7 & s)
                                    throw new o.exception.invalid("pkcs#5 padding only works for multiples of a byte");
                                for (i = 0; c + 128 <= s; i += 4,
                                    c += 128)
                                    n = e.encrypt(u(n, t.slice(i, i + 4))),
                                        l.splice(i, 0, n[0], n[1], n[2], n[3]);
                                return s = 16843009 * (16 - (s >> 3 & 15)),
                                    n = e.encrypt(u(n, a.concat(t, [s, s, s, s]).slice(i, i + 4))),
                                    l.splice(i, 0, n[0], n[1], n[2], n[3]),
                                    l
                            },
                            decrypt: function (e, t, n, r) {
                                if (r && r.length)
                                    throw new o.exception.invalid("cbc can't authenticate data");
                                if (128 !== o.bitArray.bitLength(n))
                                    throw new o.exception.invalid("cbc iv must be 128 bits");
                                if (127 & o.bitArray.bitLength(t) || !t.length)
                                    throw new o.exception.corrupt("cbc ciphertext must be a positive multiple of the block size");
                                var i, a, u, s = o.bitArray, c = s._xor4, l = [];
                                for (r = r || [],
                                         i = 0; i < t.length; i += 4)
                                    a = t.slice(i, i + 4),
                                        u = c(n, e.decrypt(a)),
                                        l.splice(i, 0, u[0], u[1], u[2], u[3]),
                                        n = a;
                                if (0 == (a = 255 & l[i - 1]) || a > 16)
                                    throw new o.exception.corrupt("pkcs#5 padding corrupt");
                                if (u = 16843009 * a,
                                    !s.equal(s.bitSlice([u, u, u, u], 0, 8 * a), s.bitSlice(l, 32 * l.length - 8 * a, 32 * l.length)))
                                    throw new o.exception.corrupt("pkcs#5 padding corrupt");
                                return s.bitSlice(l, 0, 32 * l.length - 8 * a)
                            }
                        },
                    "undefined" == typeof ArrayBuffer && ((i = void 0).ArrayBuffer = function () {
                        }
                            ,
                            i.DataView = function () {
                            }
                    ),
                        o.codec.arrayBuffer = {
                            fromBits: function (e, t, n) {
                                var r, i, a, u, s;
                                if (t = null == t || t,
                                    n = n || 8,
                                0 === e.length)
                                    return new ArrayBuffer(0);
                                if (a = o.bitArray.bitLength(e) / 8,
                                o.bitArray.bitLength(e) % 8 != 0)
                                    throw new o.exception.invalid("Invalid bit size, must be divisble by 8 to fit in an arraybuffer correctly");
                                for (t && a % n != 0 && (a += n - a % n),
                                         u = new DataView(new ArrayBuffer(4 * e.length)),
                                         i = 0; i < e.length; i++)
                                    u.setUint32(4 * i, e[i] << 32);
                                if ((r = new DataView(new ArrayBuffer(a))).byteLength === u.byteLength)
                                    return u.buffer;
                                for (s = u.byteLength < r.byteLength ? u.byteLength : r.byteLength,
                                         i = 0; i < s; i++)
                                    r.setUint8(i, u.getUint8(i));
                                return r.buffer
                            },
                            toBits: function (e) {
                                var t, n, r, i = [];
                                if (0 === e.byteLength)
                                    return [];
                                t = (n = new DataView(e)).byteLength - n.byteLength % 4;
                                for (var a = 0; a < t; a += 4)
                                    i.push(n.getUint32(a));
                                if (n.byteLength % 4 != 0) {
                                    r = new DataView(new ArrayBuffer(4)),
                                        a = 0;
                                    for (var u = n.byteLength % 4; a < u; a++)
                                        r.setUint8(a + 4 - u, n.getUint8(t + a));
                                    i.push(o.bitArray.partial(n.byteLength % 4 * 8, r.getUint32(0)))
                                }
                                return i
                            },
                            hexDumpBuffer: function (e) {
                                for (var t, n = new DataView(e), i = "", o = 0; o < n.byteLength; o += 2)
                                    o % 16 == 0 && (i += "\n" + o.toString(16) + "\t"),
                                        i += (t = n.getUint16(o).toString(16),
                                        ((t += "").length >= 4 ? t : new Array(4 - t.length + 1).join("0") + t) + " ");
                                void 0 === ("undefined" == typeof console ? "undefined" : (0,
                                    r.Z)(console)) && (console = console || {
                                    log: function () {
                                    }
                                }),
                                    console.log(i.toUpperCase())
                            }
                        },
                    e.exports && (e.exports = o),
                    "function" == typeof define && define([], (function () {
                            return o
                        }
                    ));
                    const a = o
                }
                ,
                66214: (e, t, n) => {
                    n.d(t, {
                        Z: () => O
                    });
                    var r = n(4942)
                        , i = n(15861)
                        , o = n(87757)
                        , a = n.n(o)
                        , u = (n(68309),
                        n(66992),
                        n(41539),
                        n(33948),
                        n(89554),
                        n(54747),
                        n(26699),
                        n(32023),
                        n(69600),
                        n(47941),
                        n(82526),
                        n(57327),
                        n(38880),
                        n(49337),
                        n(33321),
                        n(69070),
                        n(66252))
                        , s = n(3577)
                        , c = n(2262)
                        , l = n(49963)
                        , p = n(43443)
                        , d = n(10577)
                        , f = n.n(d)
                        , y = n(80503)
                        , v = n(69649)
                        , h = n(21510)
                        , m = n(88055)
                        , b = n(92598)
                        , S = n(45949);

                    function _(e, t) {
                        var n = Object.keys(e);
                        if (Object.getOwnPropertySymbols) {
                            var r = Object.getOwnPropertySymbols(e);
                            t && (r = r.filter((function (t) {
                                    return Object.getOwnPropertyDescriptor(e, t).enumerable
                                }
                            ))),
                                n.push.apply(n, r)
                        }
                        return n
                    }

                    function g(e) {
                        for (var t = 1; t < arguments.length; t++) {
                            var n = null != arguments[t] ? arguments[t] : {};
                            t % 2 ? _(Object(n), !0).forEach((function (t) {
                                    (0,
                                        r.Z)(e, t, n[t])
                                }
                            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _(Object(n)).forEach((function (t) {
                                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                                }
                            ))
                        }
                        return e
                    }

                    var E = {
                        class: "kwai-player-container-video"
                    }
                        , C = ["muted", "playbackRate"]
                        , T = {
                        class: "kwai-player-plugins"
                    };
                    const I = (0,
                        u.aZ)({
                        __name: "index",
                        props: {
                            width: {
                                default: 0
                            },
                            height: {
                                default: 0
                            },
                            isLive: {
                                type: Boolean,
                                default: !1
                            },
                            poster: {
                                default: ""
                            },
                            muted: {
                                type: Boolean,
                                default: !1
                            },
                            config: {
                                default: function () {
                                    return {}
                                }
                            },
                            events: {
                                default: function () {
                                    return []
                                }
                            },
                            id: null
                        },
                        emits: ["reload", "ended", "loadstart", "syncVolume", "error", "play", "playing", "waiting", "pause", "seeking", "seeked", "timeupdate", "ratechange", "volumechange", "fullscreenchange", "durationchange", "loadedmetadata", "loadeddata", "progress", "canplay", "canplaythrough"],
                        setup: function (e, t) {
                            var n = t.expose
                                , r = t.emit
                                , o = e
                                , d = (0,
                                u.Fl)((function () {
                                    return o.id
                                }
                            ))
                                , _ = (0,
                                c.iH)(null)
                                , I = (0,
                                c.iH)(null)
                                , O = (0,
                                c.iH)(!1)
                                , w = (0,
                                c.iH)("")
                                , k = (0,
                                c.iH)([])
                                , A = (0,
                                c.iH)(0)
                                , R = null
                                , N = (0,
                                c.qj)({
                                volume: .5,
                                currentTime: 0,
                                duration: 0,
                                paused: !0,
                                ended: !0,
                                buffered: {},
                                playbackRate: 1,
                                defaultPlaybackRate: 1
                            })
                                , L = (0,
                                u.Fl)({
                                get: function () {
                                    return N.volume
                                },
                                set: function (e) {
                                    var t;
                                    N.volume = e,
                                    I.value && (null === (t = I.value) || void 0 === t ? void 0 : t.volume) !== e && (I.value.volume = e,
                                        r("syncVolume", e))
                                }
                            })
                                , P = (0,
                                u.Fl)((function () {
                                    return o.muted || 0 === L.value
                                }
                            ))
                                , U = (0,
                                u.Fl)((function () {
                                    return N.paused
                                }
                            ))
                                , x = (0,
                                u.Fl)({
                                get: function () {
                                    return N.playbackRate
                                },
                                set: function (e) {
                                    I.value && I.value.playbackRate !== e && (I.value.playbackRate = e)
                                }
                            })
                                , D = (0,
                                u.Fl)((function () {
                                    return "kwai-player-rotation-".concat(A.value)
                                }
                            ));

                            function H(e) {
                                (0,
                                    h.sU)(o.id, e)
                            }

                            function W(e) {
                                var t = e.event
                                    , n = e.name
                                    , i = e.properties
                                    , a = void 0 === i ? [] : i
                                    , u = e.values
                                    , s = e.emit;
                                I.value && a.forEach((function (e, i) {
                                        var a = void 0 === u ? I.value[e] : u[i];
                                        void 0 !== N[e] && (N[e] = a),
                                        s && s(o.id),
                                        o.events.includes(n) && r(n, t)
                                    }
                                ))
                            }

                            function B() {
                                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                                if (A.value = e,
                                e % 180 != 0) {
                                    var t = _.value.clientWidth
                                        , n = _.value.clientHeight;
                                    I.value.style.cssText = ["width: ".concat(n, "px;"), "height: ".concat(t, "px;"), "max-height: ".concat(t, "px;")].join(" ")
                                } else
                                    I.value.style.cssText = ""
                            }

                            function M() {
                                return F.apply(this, arguments)
                            }

                            function F() {
                                return (F = (0,
                                    i.Z)(a().mark((function e() {
                                        return a().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            if (I.value.src) {
                                                                e.next = 2;
                                                                break
                                                            }
                                                            return e.abrupt("return", !1);
                                                        case 2:
                                                            if (o.isLive) {
                                                                e.next = 7;
                                                                break
                                                            }
                                                            return e.next = 5,
                                                                I.value.play();
                                                        case 5:
                                                            e.next = 8;
                                                            break;
                                                        case 7:
                                                            G();
                                                        case 8:
                                                            return e.abrupt("return", !0);
                                                        case 9:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            function Z() {
                                o.isLive && R && R.stopLoad(),
                                I.value.src && I.value.pause()
                            }

                            function G() {
                                (0,
                                    h.ge)(o.id),
                                    J()
                            }

                            function V(e) {
                                Q(),
                                    R = new p.ZP(I.value, g({}, e))
                            }

                            function Q() {
                                R && ((0,
                                    h.bY)(o.id),
                                    R.destroy(),
                                    R = null)
                            }

                            function j() {
                                f().element && f().element !== _.value || (O.value = f().isFullscreen)
                            }

                            function J() {
                                return K.apply(this, arguments)
                            }

                            function K() {
                                return (K = (0,
                                    i.Z)(a().mark((function e() {
                                        return a().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            V(g(g({
                                                                isLive: !0,
                                                                src: k.value
                                                            }, o.config), {}, {
                                                                adaptive: !1
                                                            })),
                                                                (0,
                                                                    h.ge)(o.id);
                                                        case 2:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            function Y() {
                                return (Y = (0,
                                    i.Z)(a().mark((function e(t) {
                                        return a().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            if (o.id === t) {
                                                                e.next = 2;
                                                                break
                                                            }
                                                            return e.abrupt("return");
                                                        case 2:
                                                            return e.next = 4,
                                                                (0,
                                                                    u.Y3)();
                                                        case 4:
                                                            R && (R.load(),
                                                                I.value.play().catch((function (e) {
                                                                        0 !== L.value && (L.value = 0,
                                                                            I.value.play())
                                                                    }
                                                                )));
                                                        case 5:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            function q(e) {
                                return $.apply(this, arguments)
                            }

                            function $() {
                                return ($ = (0,
                                    i.Z)(a().mark((function e(t) {
                                        var n, r, i;
                                        return a().wrap((function (e) {
                                                for (; ;)
                                                    switch (e.prev = e.next) {
                                                        case 0:
                                                            n = t.resource,
                                                                r = t.muted,
                                                                i = t.manifest,
                                                            (r || o.muted) && (L.value = 0),
                                                                w.value = i || n,
                                                                k.value = i,
                                                                B(0),
                                                                J();
                                                        case 6:
                                                        case "end":
                                                            return e.stop()
                                                    }
                                            }
                                        ), e)
                                    }
                                )))).apply(this, arguments)
                            }

                            function z(e) {
                                o.events.includes("error") && r("error", e)
                            }

                            return (0,
                                u.bv)((function () {
                                    f().on("change", j)
                                }
                            )),
                                (0,
                                    u.Jd)((function () {
                                        Q(),
                                            f().off("change", j)
                                    }
                                )),
                                (0,
                                    m.v1)(b.eo, (function (e) {
                                        return Y.apply(this, arguments)
                                    }
                                )),
                                (0,
                                    u.JJ)(v.Cl, L),
                                (0,
                                    u.JJ)(v.c, w),
                                (0,
                                    u.JJ)(v.k, _),
                                (0,
                                    u.JJ)(v.zz, U),
                                (0,
                                    u.JJ)(v.gH, Z),
                                (0,
                                    u.JJ)(v.gD, M),
                                (0,
                                    u.JJ)(v.tS, q),
                                (0,
                                    u.JJ)(v.tM, G),
                                (0,
                                    u.JJ)(v.a5, O),
                                (0,
                                    u.JJ)(v.gB, (function (e) {
                                        e ? f().request(_.value) : f().element && f().exit()
                                    }
                                )),
                                (0,
                                    u.JJ)(v.II, (function () {
                                        return R
                                    }
                                )),
                                (0,
                                    u.JJ)(v.dl, (function (e) {
                                        R && (R.currentLevel = e)
                                    }
                                )),
                                (0,
                                    u.JJ)(v.WI, d),
                                (0,
                                    u.JJ)(v.XE, B),
                                (0,
                                    u.JJ)(v.Vx, x),
                                (0,
                                    u.JJ)(v.u3, (0,
                                    u.Fl)((function () {
                                        var e;
                                        return null !== (e = N.currentTime) && void 0 !== e ? e : 0
                                    }
                                ))),
                                (0,
                                    u.JJ)(v.k4, (0,
                                    u.Fl)((function () {
                                        var e;
                                        return null !== (e = N.duration) && void 0 !== e ? e : 0
                                    }
                                ))),
                                n({
                                    load: q,
                                    pause: Z,
                                    play: M,
                                    stop: function () {
                                        R && R.stopLoad(),
                                            I.value.removeAttribute("src"),
                                            I.value.load(),
                                            (0,
                                                h.fd)(o.id)
                                    },
                                    changeVolume: function (e) {
                                        L.value = e
                                    },
                                    el: (0,
                                        u.Fl)((function () {
                                            return _.value
                                        }
                                    ))
                                }),
                                function (t, n) {
                                    return (0,
                                        u.wg)(),
                                        (0,
                                            u.iD)("div", {
                                            ref_key: "root",
                                            ref: _,
                                            class: (0,
                                                s.C_)(["kwai-player kwai-player-container", [(0,
                                                c.SU)(D)]])
                                        }, [(0,
                                            u.Wm)(y.Z, {
                                            class: "kwai-player-blur",
                                            src: e.poster
                                        }, null, 8, ["src"]), (0,
                                            u._)("div", E, [(0,
                                            u._)("video", {
                                            ref_key: "video",
                                            ref: I,
                                            class: "player-video",
                                            muted: (0,
                                                c.SU)(P),
                                            autoplay: "",
                                            onContextmenu: n[0] || (n[0] = (0,
                                                l.iM)((function () {
                                                }
                                            ), ["stop", "prevent"])),
                                            playbackRate: (0,
                                                c.SU)(x),
                                            onPlay: n[1] || (n[1] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).play,
                                                        properties: ["paused", "ended"],
                                                        event: e,
                                                        emit: (0,
                                                            c.SU)(h.FA)
                                                    })
                                                }
                                            ),
                                            onPlaying: n[2] || (n[2] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).playing,
                                                        properties: ["paused", "ended"],
                                                        event: e,
                                                        emit: (0,
                                                            c.SU)(h.IL)
                                                    })
                                                }
                                            ),
                                            onWaiting: H,
                                            onEnded: n[3] || (n[3] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).ended,
                                                        properties: ["paused", "ended"],
                                                        event: e,
                                                        emit: (0,
                                                            c.SU)(h.fd)
                                                    })
                                                }
                                            ),
                                            onPause: n[4] || (n[4] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).pause,
                                                        properties: ["paused", "ended"],
                                                        event: e,
                                                        emit: (0,
                                                            c.SU)(h.EJ)
                                                    })
                                                }
                                            ),
                                            onSeeking: n[5] || (n[5] = function (e) {
                                                    return r((0,
                                                        c.SU)(S.Bc).seeking, e)
                                                }
                                            ),
                                            onSeeked: n[6] || (n[6] = function (e) {
                                                    return r((0,
                                                        c.SU)(S.Bc).seeked, e)
                                                }
                                            ),
                                            onTimeupdate: n[7] || (n[7] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).timeupdate,
                                                        properties: ["currentTime"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onRatechange: n[8] || (n[8] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).ratechange,
                                                        properties: ["playbackRate", "defaultPlaybackRate"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onVolumechange: n[9] || (n[9] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).volumechange,
                                                        properties: ["volume"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onLoadstart: n[10] || (n[10] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).loadstart,
                                                        properties: ["buffered"],
                                                        event: e,
                                                        emit: (0,
                                                            c.SU)(h.M1)
                                                    })
                                                }
                                            ),
                                            onLoadedmetadata: n[11] || (n[11] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).loadedmetadata,
                                                        properties: ["duration", "buffered"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onLoadeddata: n[12] || (n[12] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).loadeddata,
                                                        properties: ["buffered"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onProgress: n[13] || (n[13] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).progress,
                                                        properties: ["buffered"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onCanplay: n[14] || (n[14] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).canplay,
                                                        properties: ["buffered"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onCanplaythrough: n[15] || (n[15] = function (e) {
                                                    return W({
                                                        name: (0,
                                                            c.SU)(S.Bc).canplaythrough,
                                                        properties: ["buffered"],
                                                        event: e
                                                    })
                                                }
                                            ),
                                            onError: z
                                        }, null, 40, C), (0,
                                            u._)("div", T, [(0,
                                            u.WI)(t.$slots, "default")])])], 2)
                                }
                        }
                    })
                        , O = (0,
                        n(83744).Z)(I, [["__scopeId", "data-v-152156f4"]])
                }
                ,
                77153: (e, t, n) => {
                    e.exports = n.p + "images/98b0b1eda7c63d8f0b8e.png"
                }
            }, a = {};

            function u(e) {
                var t = a[e];
                if (void 0 !== t)
                    return t.exports;
                var n = a[e] = {
                    id: e,
                    loaded: !1,
                    exports: {}
                };
                return o[e].call(n.exports, n, n.exports, u),
                    n.loaded = !0,
                    n.exports
            }

            u.m = o,
                u.amdO = {},
                e = [],
                u.O = (t, n, r, i) => {
                    if (!n) {
                        var o = 1 / 0;
                        for (l = 0; l < e.length; l++) {
                            for (var [n, r, i] = e[l], a = !0, s = 0; s < n.length; s++)
                                (!1 & i || o >= i) && Object.keys(u.O).every((e => u.O[e](n[s]))) ? n.splice(s--, 1) : (a = !1,
                                i < o && (o = i));
                            if (a) {
                                e.splice(l--, 1);
                                var c = r();
                                void 0 !== c && (t = c)
                            }
                        }
                        return t
                    }
                    i = i || 0;
                    for (var l = e.length; l > 0 && e[l - 1][2] > i; l--)
                        e[l] = e[l - 1];
                    e[l] = [n, r, i]
                }
                ,
                u.n = e => {
                    var t = e && e.__esModule ? () => e.default : () => e;
                    return u.d(t, {
                        a: t
                    }),
                        t
                }
                ,
                u.d = (e, t) => {
                    for (var n in t)
                        u.o(t, n) && !u.o(e, n) && Object.defineProperty(e, n, {
                            enumerable: !0,
                            get: t[n]
                        })
                }
                ,
                u.f = {},
                u.e = e => Promise.all(Object.keys(u.f).reduce(((t, n) => (u.f[n](e, t),
                    t)), [])),
                u.u = e => "js/" + ({
                    18: "product",
                    36: "mroom",
                    146: "match",
                    359: "gameboard",
                    383: "liveRoom",
                    464: "search",
                    481: "root",
                    491: "livePartner",
                    697: "news",
                    730: "hot",
                    757: "follow",
                    845: "profile",
                    896: "thirdPart"
                }[e] || e) + "." + u.h() + ".js",
                u.miniCssF = e => "css/" + {
                    18: "product",
                    36: "mroom",
                    146: "match",
                    359: "gameboard",
                    383: "liveRoom",
                    464: "search",
                    481: "root",
                    491: "livePartner",
                    697: "news",
                    730: "hot",
                    757: "follow",
                    845: "profile",
                    896: "thirdPart"
                }[e] + "." + {
                    18: "904a7f32",
                    36: "315e2f67",
                    146: "84b64c9c",
                    359: "58a99c20",
                    383: "1c3f5f5f",
                    464: "50f6f268",
                    481: "d7bb225c",
                    491: "b7d56026",
                    697: "a8d7e39f",
                    730: "00002490",
                    757: "4d6543aa",
                    845: "ebc4c629",
                    896: "541d1b76"
                }[e] + ".chunk.css",
                u.h = () => "ff649a052c7e67bc4d25",
                u.g = function () {
                    if ("object" == typeof globalThis)
                        return globalThis;
                    try {
                        return this || new Function("return this")()
                    } catch (e) {
                        if ("object" == typeof window)
                            return window
                    }
                }(),
                u.hmd = e => ((e = Object.create(e)).children || (e.children = []),
                    Object.defineProperty(e, "exports", {
                        enumerable: !0,
                        set: () => {
                            throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + e.id)
                        }
                    }),
                    e),
                u.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
                t = {},
                n = "pc-live-next:",
                u.l = (e, r, i, o) => {
                    if (t[e])
                        t[e].push(r);
                    else {
                        var a, s;
                        if (void 0 !== i)
                            for (var c = document.getElementsByTagName("script"), l = 0; l < c.length; l++) {
                                var p = c[l];
                                if (p.getAttribute("src") == e || p.getAttribute("data-webpack") == n + i) {
                                    a = p;
                                    break
                                }
                            }
                        a || (s = !0,
                            (a = document.createElement("script")).charset = "utf-8",
                            a.timeout = 120,
                        u.nc && a.setAttribute("nonce", u.nc),
                            a.setAttribute("data-webpack", n + i),
                            a.src = e),
                            t[e] = [r];
                        var d = (n, r) => {
                            a.onerror = a.onload = null,
                                clearTimeout(f);
                            var i = t[e];
                            if (delete t[e],
                            a.parentNode && a.parentNode.removeChild(a),
                            i && i.forEach((e => e(r))),
                                n)
                                return n(r)
                        }
                            , f = setTimeout(d.bind(null, void 0, {
                            type: "timeout",
                            target: a
                        }), 12e4);
                        a.onerror = d.bind(null, a.onerror),
                            a.onload = d.bind(null, a.onload),
                        s && document.head.appendChild(a)
                    }
                }
                ,
                u.r = e => {
                    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                        value: "Module"
                    }),
                        Object.defineProperty(e, "__esModule", {
                            value: !0
                        })
                }
                ,
                u.nmd = e => (e.paths = [],
                e.children || (e.children = []),
                    e),
                u.p = window.$cdnPath,
                r = e => new Promise(((t, n) => {
                        var r = u.miniCssF(e)
                            , i = u.p + r;
                        if (((e, t) => {
                                for (var n = document.getElementsByTagName("link"), r = 0; r < n.length; r++) {
                                    var i = (a = n[r]).getAttribute("data-href") || a.getAttribute("href");
                                    if ("stylesheet" === a.rel && (i === e || i === t))
                                        return a
                                }
                                var o = document.getElementsByTagName("style");
                                for (r = 0; r < o.length; r++) {
                                    var a;
                                    if ((i = (a = o[r]).getAttribute("data-href")) === e || i === t)
                                        return a
                                }
                            }
                        )(r, i))
                            return t();
                        ((e, t, n, r) => {
                                var i = document.createElement("link");
                                i.rel = "stylesheet",
                                    i.type = "text/css",
                                    i.onerror = i.onload = o => {
                                        if (i.onerror = i.onload = null,
                                        "load" === o.type)
                                            n();
                                        else {
                                            var a = o && ("load" === o.type ? "missing" : o.type)
                                                , u = o && o.target && o.target.href || t
                                                , s = new Error("Loading CSS chunk " + e + " failed.\n(" + u + ")");
                                            s.code = "CSS_CHUNK_LOAD_FAILED",
                                                s.type = a,
                                                s.request = u,
                                                i.parentNode.removeChild(i),
                                                r(s)
                                        }
                                    }
                                    ,
                                    i.href = t,
                                    document.head.appendChild(i)
                            }
                        )(e, i, t, n)
                    }
                )),
                i = {
                    143: 0
                },
                u.f.miniCss = (e, t) => {
                    i[e] ? t.push(i[e]) : 0 !== i[e] && {
                        18: 1,
                        36: 1,
                        146: 1,
                        359: 1,
                        383: 1,
                        464: 1,
                        481: 1,
                        491: 1,
                        697: 1,
                        730: 1,
                        757: 1,
                        845: 1,
                        896: 1
                    }[e] && t.push(i[e] = r(e).then((() => {
                            i[e] = 0
                        }
                    ), (t => {
                            throw delete i[e],
                                t
                        }
                    )))
                }
                ,
                (() => {
                        var e = {
                            143: 0
                        };
                        u.f.j = (t, n) => {
                            var r = u.o(e, t) ? e[t] : void 0;
                            if (0 !== r)
                                if (r)
                                    n.push(r[2]);
                                else {
                                    var i = new Promise(((n, i) => r = e[t] = [n, i]));
                                    n.push(r[2] = i);
                                    var o = u.p + u.u(t)
                                        , a = new Error;
                                    u.l(o, (n => {
                                            if (u.o(e, t) && (0 !== (r = e[t]) && (e[t] = void 0),
                                                r)) {
                                                var i = n && ("load" === n.type ? "missing" : n.type)
                                                    , o = n && n.target && n.target.src;
                                                a.message = "Loading chunk " + t + " failed.\n(" + i + ": " + o + ")",
                                                    a.name = "ChunkLoadError",
                                                    a.type = i,
                                                    a.request = o,
                                                    r[1](a)
                                            }
                                        }
                                    ), "chunk-" + t, t)
                                }
                        }
                            ,
                            u.O.j = t => 0 === e[t];
                        var t = (t, n) => {
                            var r, i, [o, a, s] = n, c = 0;
                            if (o.some((t => 0 !== e[t]))) {
                                for (r in a)
                                    u.o(a, r) && (u.m[r] = a[r]);
                                if (s)
                                    var l = s(u)
                            }
                            for (t && t(n); c < o.length; c++)
                                i = o[c],
                                u.o(e, i) && e[i] && e[i][0](),
                                    e[o[c]] = 0;
                            return u.O(l)
                        }
                            , n = self.webpackChunkpc_live_next = self.webpackChunkpc_live_next || [];
                        n.forEach(t.bind(null, 0)),
                            n.push = t.bind(null, n.push.bind(n))
                    }
                )(),
                u.O(void 0, [216, 592, 476], (() => u(89414)));
            var s = u.O(void 0, [216, 592, 476], (() => u(12722)));
            s = u.O(s)
        }
    )();

})();