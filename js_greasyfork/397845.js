!function() {
    var ctoplayer = function(e) {
        this.isEmpty = !1,
        this.debug = !1,
        this.warm = !1,
        this.isDestory = !1,
        this.startH5Video = !1,
        this.startVideoListerner = !1,
        this.startPlay = !1,
        this.suspend = !1,
        this.isFirstSucess = !0,
        this.isFirst = !0,
        this.isStartSeek = !1,
        this.isSeekEmpty = !1,
        this.curAdType = "preroll",
        this.curPlayState = "idle",
        this.playStatus = 0,
        this.curRole = "idle",
        this.head = !1,
        this.tail = !1,
        this.hasTrack = !1,
        this.headover = !1,
        this.tailover = !1,
        this.isTail = !1,
        this.djsClosed = !1,
        this.bufferTime = 0,
        this.isKaTime = 0,
        this.isKaLen = 0,
        this.trackElement = [],
        this.elementArr = [],
        this.track = [],
        this.trackOriginRate = 1,
        this.trackIndex = 0,
        this.nowTrackShow = {
            sn: ""
        },
        this.bST = -1,
        this.sbST = -1,
        this.cbST = -1,
        this.kbST = -1,
        this.fontFamily = '"Microsoft YaHei"; YaHei; "FAE8F6F96C59ED1"; SimHei; "9ED1F53";Arial',
        this.trackObj = {
            type: "text",
            color: "#FFFFFF",
            font: '"SimSun","B8BF53"',
            size: 28,
            alpha: 1,
            leading: 0,
            lineHeight: 30
        },
        this.warmLaguage = ["当前浏览器版本过低，请使用火狐或者谷歌浏览器进行观看", "抱歉，连接失败，请您检查网络或进行刷新操作", "抱歉，连接失败，请您检查网络或切换线路尝试", "播放卡顿？建议您检查网络或切换线路尝试"],
        this.videoErrorObj = [["411", "You aborted the video playback"], ["412", "A network error caused the video download to fail part-way"], ["413", "The video playback was aborted due to a corruption problem or because the video used features your browser did not support"], ["414", "The video could not be loaded, either because the server or network failed or because the format is not supported"]],
        this.coreErrorObj = {
            manifestLoadError: "421",
            manifestLoadTimeOut: "422",
            manifestParsingError: "423",
            manifestNoKey: "424",
            manifestLoadOverDue: "425",
            keyLoadError: "426",
            keyLoadTimeOut: "427",
            binDecriptError: "428",
            fragLoadError: "429",
            fragLoadTimeOut: "430",
            manifestIncompatibleCodecsError: "431",
            fragDecryptError: "432",
            fragParsingError: "433",
            bufferAddCodecError: "434",
            bufferAppendError: "435",
            bufferAppendingError: "436",
            bufferStalledError: "437",
            bufferFullError: "438",
            bufferSeekOverHole: "439",
            bufferNudgeOnStall: "440",
            remuxAllocError: "441",
            internalException: "442"
        },
        e && this.embed(e)
    };
    ctoplayer.prototype = {
        embed: function(e) {
            null != e && e ? ("object" != typeof e && this.log("Variables type is not a object"),
            this.vars = this.standardization({}, e),
            this.parseVars(),
            this.initialize()) : this.log("Object does not exist")
        },
        initialize: function() {
            this.mainLoading(),
            this.registerKeypress(),
            this.loadIdApi()
        },
        parseVars: function() {
            this.domId = this.vars.container,
            this.dom = $("#" + this.domId),
            this.version = "v2.1.0-20190709",
            this.oriralConf = this.vars.conf ? this.vars.conf : "",
            this.debug = !!this.vars.debug && this.vars.debug,
            this.cs = this.vars.cs ? parseInt(this.vars.cs) : 0,
            this.lid = this.vars.lid ? this.vars.lid : "",
            this.cid = this.vars.cid ? this.vars.cid : "",
            this.part = this.vars.part ? this.vars.part : "0",
            this.uid = this.vars.userId ? this.vars.userId : "",
            this.centerURL = this.vars.centerURL ? this.vars.centerURL : "",
            this.emptyDelay = this.vars.emptyDelay ? parseInt(this.vars.emptyDelay) : "",
            this.emptyCallback = this.vars.emptyCallback ? this.vars.emptyCallback : "",
            this.Conf = JSON.parse(this.base64decode(this.oriralConf)),
            this.oriralSign = "eDu_51Cto_siyuanTlw",
            this.sign = this.MD5(this.lid + this.oriralSign).toString(),
            this.Conf.controlsTrigger = this.Conf.controlsTrigger ? this.Conf.controlsTrigger : "click",
            this.Conf.heartIntervalTime = this.Conf.heartIntervalTime ? parseInt(this.Conf.heartIntervalTime) : 3e4,
            this.ht = 0,
            this.pt = -1,
            this.cdn = "auto",
            this.playStatus = 0,
            this.fs = 0,
            this.uuid = this.MD5("" + (new Date).getTime() + this.uid + Math.random()).toString(),
            this.timerF = "",
            this.memTime = 0,
            this.sd = 1,
            this.netTest = !1,
            this.isMute = this.getCookie("isMute") ? this.getCookie("isMute") : "0",
            this.def = this.getCookie("playDEF") ? this.getCookie("playDEF") : "auto",
            this.initHeart()
        },
        initHeart: function() {
            var e = this;
            this.Conf.kernel.statFlag && (this.heartTimer = setInterval(function() {
                e.heart()
            }, this.Conf.heartIntervalTime))
        },
        mainLoading: function() {
            this.isLoading = !0,
            this.loadingDom = $('<div class="error Loading"><p>课程加载中，请稍后...</p></div>'),
            this.dom.append(this.loadingDom)
        },
        initSaver: function() {
            this.Conf.skin.saver && this.Saver(this.Conf.skin.saverate)
        },
        loadIdApi: function() {
            var t = this;
            $.get(this.Conf.url_auth, {
                sign: this.sign,
                lesson_id: this.lid
            }, function(e) {
                t.setConfig(e)
            }, "json")
        },
        setConfig: function(e) {
            if (this.config = e,
            this.initSaver(),
            null != e && null != e.ad && (null != e.ad.head && null != e.ad.head[0].url && (this.head = !0,
            this.headUrl = e.ad.head[0].url),
            null != e.ad.tail && null != e.ad.tail[0].url && (this.tail = !0,
            this.tailUrl = e.ad.tail[0].url)),
            null != e && null != e.subtitleUrl && "" != e.subtitleUrl && (this.hasTrack = !0,
            this.subtitleUrl = e.subtitleUrl,
            this.loadTrack()),
            this.supportVideo())
                if (this.head && !this.headover)
                    if (this.curAdType = "preroll",
                    this.curRole = "head",
                    ".mp4" == this.getFileExt(this.headUrl)) {
                        var t = this.processAdData(this.headUrl);
                        this.playheadtail(t)
                    } else
                        this.playmain();
                else
                    this.playmain();
            else
                this.showWarm(0, null)
        },
        loadTrack: function() {
            var t = this
              , e = {
                type: "GET",
                url: this.subtitleUrl,
                dataType: "text",
                error: function(e) {
                    t.log("传输失败:" + e)
                },
                success: function(e) {
                    t.track = t.parseSrtSubtitles(e),
                    t.trackIndex = 0,
                    t.nowTrackShow = {
                        sn: ""
                    }
                }
            };
            $.ajax(e)
        },
        parseSrtSubtitles: function(e) {
            function t(e) {
                return null != e ? e.replace(/<[^>]+>/g, "") : ""
            }
            var r = []
              , i = []
              , a = 0
              , n = e.split("\n")
              , s = [];
            for (a = 0; a < n.length; a++)
                0 < n[a].replace(/\s/g, "").length ? s.push(n[a]) : (0 < s.length && i.push(s),
                s = []);
            for (a = 0; a < i.length; ++a) {
                var o = i[a];
                if (2 <= o.length) {
                    var l = o[0]
                      , u = this.toSeconds(this.trim(o[1].split(" --\x3e ")[0]))
                      , d = this.toSeconds(this.trim(o[1].split(" --\x3e ")[1]))
                      , c = [t(o[2])];
                    if (2 < o.length)
                        for (var h = 3; h < o.length; h++)
                            c.push(t(o[h]));
                    var f = {
                        sn: l,
                        startTime: u,
                        endTime: d,
                        content: c
                    };
                    r.push(f)
                }
            }
            return r
        },
        resetTrack: function() {
            this.trackIndex = 0,
            this.nowTrackShow = {
                sn: ""
            }
        },
        trackShowHandler: function() {
            if ("main" == this.curRole && !(this.track.length < 1)) {
                this.trackIndex >= this.track.length && (this.trackIndex = 0);
                var e = this.track[this.trackIndex];
                if (this.ht >= e.startTime && this.ht <= e.endTime)
                    this.nowTrackShow.sn != e.sn && (this.trackHide(),
                    this.trackShow(e));
                else
                    this.trackHide(),
                    this.checkTrack()
            }
        },
        trackShow: function(e) {
            for (var t = (this.nowTrackShow = e).content, r = 0; r < t.length; r++) {
                var i = {
                    text: t[r]
                }
                  , a = this.addElement(i);
                this.trackElement.push(a)
            }
        },
        trackHide: function() {
            for (var e = 0; e < this.trackElement.length; e++)
                this.deleteElement(this.trackElement[e]);
            this.trackElement = []
        },
        checkTrack: function() {
            var e = this.trackIndex
              , t = this.track
              , r = 0;
            for (r = e; r < t.length; r++)
                if (this.ht >= t[r].startTime && this.ht <= t[r].endTime) {
                    this.trackIndex = r;
                    break
                }
        },
        addElement: function(e) {
            var t = this.standardization(this.trackObj, e);
            this.trackEl = $("<div></div>"),
            this.trackEl.attr("class", "subtitle"),
            this.dom.append(this.trackEl);
            parseInt(this.dom[0].offsetWidth);
            this.trackEl.css({
                position: "absolute",
                filter: "alpha(opacity:" + this.trackObj.alpha + ")",
                opacity: this.trackObj.alpha.toString(),
                width: "800px",
                zIndex: "20"
            }),
            this.isUndefined(this.trackObj) || "text" == this.trackObj.type && (this.trackElTxt = $('<div class="subtitle_text">' + t.text + "</div>")),
            this.trackEl.append(this.trackElTxt),
            this.trackElTxt.css({
                filter: "alpha(opacity:" + t.alpha + ")",
                opacity: t.alpha.toString(),
                color: t.color.replace("0x", "#"),
                lineHeight: 0 < t.leading ? t.leading + "px" : "",
                "-webkit-text-stroke": "0.5px black",
                "text-shadow": "3px 2px 3px #000000",
                "white-space": "pre-wrap",
                "font-weight": "900",
                "word-reak": "break-all",
                "font-family": '"SimSun","B8BF53"',
                "text-align": "center",
                position: "absolute",
                zIndex: "2",
                cursor: "pointer"
            });
            var r = this.trackElTxt.width() + 5
              , i = this.dom[0].offsetWidth;
            this.trackOriginRate = r / i,
            this.resizeTrackEl(this.trackEl);
            var a = this.calculationTrackCoor(this.trackEl);
            return a.x && a.y && this.trackEl.css({
                left: a.x + "px",
                bottom: a.y + "px"
            }),
            this.elementArr.push(this.trackEl.attr("class")),
            this.trackEl
        },
        changeElementCoor: function() {
            for (var e = 0; e < this.elementArr.length; e++) {
                var t = "." + this.elementArr[e]
                  , r = this.dom.find(t);
                if (r != []) {
                    this.resizeTrackEl(r);
                    var i = this.calculationTrackCoor(r);
                    i.x && i.y && r.css({
                        left: i.x + "px",
                        bottom: i.y + "px"
                    })
                }
            }
        },
        resizeTrackEl: function(e, t) {
            if (e != []) {
                var r = parseInt(this.dom[0].offsetWidth - 100);
                if (this.trackElTxt) {
                    var i = this.trackElTxt.height();
                    e.css({
                        width: r + "px",
                        height: i + "px"
                    })
                }
            }
        },
        calculationTrackCoor: function(e) {
            if (e != []) {
                var t = this.dom[0].offsetWidth
                  , r = (this.dom[0].offsetHeight,
                e[0].offsetWidth);
                e[0].offsetHeight;
                return {
                    x: parseInt(.5 * (t - r)),
                    y: parseInt(70)
                }
            }
        },
        deleteElement: function(e) {
            var t = this.arrIndexOf(this.elementArr, e.attr("class"));
            -1 < t && this.elementArr.splice(t, 1),
            e && e.remove()
        },
        randomString: function(e) {
            e = e || 16;
            var t = "abcdefghijklmnopqrstuvwxyz"
              , r = t.length
              , a = "";
            for (i = 0; i < e; i++)
                a += t.charAt(Math.floor(Math.random() * r));
            return "ch" + a
        },
        checkLogin: function() {
            var e = !1;
            return "" != this.uid && (e = !0),
            e
        },
        checkBuffer: function(e) {
            var t = 0;
            if (null != this.v && this.startPlay) {
                var r = this.v.buffered
                  , i = r.length;
                if (r)
                    for (var a = e, n = 0; n < i; n++) {
                        r.start(n),
                        r.end(n);
                        a >= r.start(n) && a < r.end(n) && (t = Math.round(r.end(n) - a))
                    }
            }
            return t
        },
        processAdData: function(e) {
            var t = []
              , r = []
              , i = ""
              , a = "";
            return i = e.toLowerCase(),
            a = "video/mp4",
            r.push(e),
            r.push("video/mp4"),
            t.push(r),
            r = [],
            i = i.replace(".mp4", ".ogg"),
            a = a.replace("video/mp4", "video/ogg"),
            r.push(i),
            r.push(a),
            t.push(r),
            r = [],
            i = i.replace(".ogg", ".webm"),
            a = a.replace("video/ogg", "video/webm"),
            r.push(i),
            r.push(a),
            t.push(r),
            t
        },
        playheadtail: function(e) {
            var t = this
              , r = "";
            if (this.isLoading = !1,
            this.dom.onselectstart = this.dom.ondrag = function() {
                return !1
            }
            ,
            e) {
                var a = e;
                for (a = this.arrSort(a),
                i = 0; i < a.length; i++) {
                    var n = ""
                      , s = a[i];
                    s[1] && (n = ' type="' + s[1] + '"'),
                    r += '<source src="' + s[0] + '"' + n + ">"
                }
            }
            this.advideo = $('<video muted style="width:100%;height:100%;" muted>' + r + "</video>"),
            this.dom.empty().append(this.advideo),
            this.av && (this.av = null),
            this.av = this.advideo[0];
            var o = function(e) {
                u()
            };
            this.addListener("ended", o);
            var l = function(e) {
                u(),
                t.playmain()
            };
            function u() {
                t.advideo.remove(),
                t.removeListener("error", l),
                t.removeListener("ended", o),
                "preroll" == t.curAdType ? (t.headover = !0,
                t.curAdType = "postroll",
                t.playmain()) : t.video_Stop()
            }
            this.addListener("error", l),
            this.av.play()
        },
        playmain: function() {
            var r = this;
            this.isLoading = !1,
            this.curRole = "main";
            var e = parseInt(this.getCookie("playTime" + r.lid));
            this.playTime = e || (location.href.match(/playTime=(\d*)/) ? location.href.match(/playTime=(\d*)/)[1] : 0),
            0 == this.playTime && this.config.htime && (this.playTime = this.config.htime);
            var t = 1 < this.config.dispatch.length ? this.config.dispatch[1].url : this.config.dispatch[0].url
              , i = this.getCookie("playDEF");
            i && "auto" != i ? $.each(r.config.dispatch, function(e, t) {
                t.name == i && r.switchDef(e, r.playTime)
            }) : this.initMain(t, 0)
        },
        initMain: function(o, e) {
            var l = this;
            if (this.dom.empty(),
            this.video = $('<video style="width:100%;height:100%;"></video>'),
            this.pausedMask = $('<div class="pasue error"><button>&nbsp;</button></div>').click(function() {
                l.video_Play()
            }),
            this.dom.append(this.video).append(this.pausedMask),
            this.v && (this.v = null),
            this.v = this.video[0],
            this.v.canPlayType) {
                var t = function(e) {
                    var t, r, i, a;
                    if (l.log("--------videoEventError-------"),
                    l.curPlayState = e.type,
                    "error" === e.type) {
                        var n = e.currentTarget.error;
                        switch (n.code) {
                        case 1:
                            i = l.videoErrorObj[0][0],
                            t = l.videoErrorObj[0][1];
                            break;
                        case 2:
                            i = l.videoErrorObj[1][0],
                            t = l.videoErrorObj[1][1];
                            break;
                        case 3:
                            i = l.videoErrorObj[2][0],
                            t = l.videoErrorObj[2][1],
                            a = !0;
                            break;
                        case 4:
                            i = l.videoErrorObj[3][0],
                            t = l.videoErrorObj[3][1]
                        }
                    }
                    var s = {
                        eType: "videoError",
                        content: t + "( " + i + " )"
                    };
                    try {
                        n.message && (r = n.message)
                    } catch (e) {
                        r = t
                    }
                    s.message = r,
                    l.repeatError(s),
                    a ? l.jumpCurErrorPos() : l.showWarm(1, i)
                }
                  , r = function(e) {
                    l.isDestory ? h() : l.playStatus && (l.curPlayState = e.type,
                    $(".bufferLoading").hide(),
                    l.isEndStartSeek && (l.onPlayIngHandler(),
                    l.playStatus = 1,
                    l.ht = l.v.currentTime > l.dt ? l.dt : l.v.currentTime,
                    l.timeUpdateHandler(),
                    l.hasTrack && l.trackShowHandler()))
                }
                  , i = function(e) {
                    l.log("--------eventWaiting-------"),
                    l.curPlayState = e.type,
                    l.emptyST && clearTimeout(l.emptyST),
                    $(".bufferLoading").show(),
                    l.isEmpty = !0,
                    l.bufferTime = l.checkBuffer(l.ht),
                    l.startPlay && (l.log("--------eventWaiting--startPlay=ture---111-------"),
                    3 != l.playStatus && (l.log("--------eventWaiting--startPlay=ture---222-------"),
                    5 != l.playStatus ? (l.log("--------eventWaiting--startPlay=ture---333-------"),
                    l.isSeekEmpty = !1,
                    l.bST = (new Date).getTime(),
                    "" != l.emptyDelay && (l.emptyST = setTimeout(function() {}
                    .bind(this), l.emptyDelay))) : (l.log("--------eventWaiting--startPlay=ture---444-------"),
                    l.isSeekEmpty = !0,
                    l.sST = (new Date).getTime()))),
                    l.log("-------- playstatus = 3 (eventWaiting) --------"),
                    l.playStatus = 3
                }
                  , a = function(e) {
                    l.log("--------eventSeeked-------"),
                    l.isEndStartSeek = !0,
                    l.seekedHandler()
                }
                  , n = function(e) {
                    l.log("--------eventSeeking-------"),
                    l.emptyST && clearTimeout(l.emptyST),
                    l.startPlay && (l.log("--------playstatus = 5 (eventSeeking) -------"),
                    l.playStatus = 5)
                }
                  , s = function() {
                    l.log("--------canplay-------")
                }
                  , u = function() {}
                  , d = function() {
                    l.isDestory ? h() : (l.log("--------playstatus = 1  videoEventPlaying -------"),
                    l.playStatus = 1,
                    l.isEndStartSeek && l.onPlayFullHandler(),
                    l.isStartSeek && (l.isEndStartSeek = !0))
                }
                  , c = function(e) {
                    if (l.log("--------eventEnded-------"),
                    l.curPlayState = e.type,
                    l.emptyST && clearTimeout(l.emptyST),
                    l.tail && !l.tailover)
                        if (l.curAdType = "postroll",
                        l.curRole = "tail",
                        ".mp4" == l.getFileExt(l.tailUrl)) {
                            var t = l.processAdData(l.tailUrl);
                            l.playheadtail(t)
                        } else
                            l.curRole = "idle",
                            l.tailover = !0,
                            l.video_Stop(),
                            h(),
                            l.nextJump();
                    else
                        l.curRole = "idle",
                        l.tailover = !0,
                        l.video_Stop(),
                        l.nextJump()
                };
                function h() {
                    l.removeListener("ended", c),
                    l.removeListener("waiting", i),
                    l.removeListener("emptied", i),
                    l.removeListener("progress", u),
                    l.removeListener("seeked", a),
                    l.removeListener("seeking", n),
                    l.removeListener("timeupdate", r),
                    l.removeListener("error", t),
                    l.removeListener("canplay", s),
                    l.removeListener("playing", d)
                }
                this.startH5Video = !0,
                l.addListener("ended", c),
                l.addListener("waiting", i),
                l.addListener("emptied", i),
                l.addListener("progress", u),
                l.addListener("seeked", a),
                l.addListener("seeking", n),
                l.addListener("timeupdate", r),
                l.addListener("error", t),
                l.addListener("canplay", s),
                l.addListener("playing", d),
                this.initMainView(),
                Hls.isSupported() ? (this.hls && (this.hls.destroy(),
                this.hls = null),
                this.hls = new Hls,
                this.hls.attachMedia(this.v),
                this.cST = (new Date).getTime(),
                this.hls.loadSource(o, this.cid, this.lid, this.sign, this.part),
                this.hls.on(Hls.Events.MANIFEST_PARSED, function(e, t) {
                    l.playerLoad(),
                    l.dt = parseInt(t.levels[0].details.totalduration);
                    var r = parseInt(l.getCookie("playTime" + l.lid));
                    l.playTime = parseInt(l.playTime) < r ? r : parseInt(l.playTime),
                    parseInt(l.playTime) == parseInt(l.dt) && (l.playTime = 0),
                    l.dt - parseInt(l.playTime) <= 10 && (l.playTime = 0),
                    l.heart(),
                    l.duration.find("span").eq(1).html(l.sTo(l.dt)),
                    l.getCookie("h5playersd") && (l.v.playbackRate = l.getCookie("h5playersd")),
                    l.dom.addClass("pause"),
                    l.playBtn.removeClass("ps"),
                    l.pausedMask.show(),
                    l.v.play(),
                    0 < l.errorTime ? l.video_seek(l.errorTime) : 0 < l.playTime ? (setTimeout(function() {
                        l.seekTipShow()
                    }, 1500),
                    l.video_seek(l.playTime)) : (l.isEndStartSeek = !0,
                    l.isStartSeek = !1)
                }),
                this.hls.on(Hls.Events.FRAG_DECRYPTED, function(e, t) {
                    t.type,
                    t.details
                }),
                this.hls.on(Hls.Events.FOUND_SIDX, function(e, t) {
                    var r = {
                        eType: "foundSidx",
                        content: "sidxUrl: = ( " + t.url + ")---【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.MP4_REGEX_SUFFIX, function(e, t) {
                    var r = {
                        eType: "mp4RegexSuffix",
                        content: "reurl: = ( " + t.url + ")---【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.PARSE_M3U8_RANGE, function(e, t) {
                    var r = {
                        eType: "parseM3u8Range",
                        content: "reason: = 【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.SET_RANGE_END, function(e, t) {
                    var r = t.rangeStart
                      , i = t.rangeEnd
                      , a = {
                        eType: "setRangeEnd",
                        content: "url: = ( " + t.url + ")---【rangeStart = " + r + "@rangeEnd" + i + "】"
                    };
                    l.repeatError(a)
                }),
                this.hls.on(Hls.Events.SET_SIDX_FRAG_RANGE_ONE, function(e, t) {
                    var r = {
                        eType: "setSidxFragRangeOne",
                        content: "reason: = 【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.SET_SIDX_FRAG_RANGE_TWO, function(e, t) {
                    var r = {
                        eType: "setSidxFragRangeTwo",
                        content: "reason: = 【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.SET_RAWBYTERANGE, function(e, t) {
                    var r = {
                        eType: "setRawByteRange",
                        content: "mapAttrsURI: = ( " + t.url + ")---【" + t.reason + "】"
                    };
                    l.repeatError(r)
                }),
                this.hls.on(Hls.Events.ERROR, function(e, t) {
                    t.type;
                    var r, i = t.details, a = (t.fatal,
                    ""), n = l.justifyObjContains(i, l.coreErrorObj), s = {
                        eType: "kernelError",
                        content: t.details
                    };
                    switch (t.details) {
                    case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        l.log("error while loading manifest! CODE = " + t.response.code + "TExT =" + t.response.text);
                        try {
                            0 === t.response.code && (r = "this might be a CORS issue, consider installing Allow-Control-Allow-Origin Chrome Extension")
                        } catch (e) {
                            r = "cannot Load" + o + "Reason:Load " + t.response.text
                        }
                        r = t.response.text;
                        break;
                    case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                        r = "timeout while loading manifest";
                        break;
                    case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                        r = "由于缓冲区数据耗尽而导致播放停止时引发";
                        break;
                    case Hls.ErrorDetails.BUFFER_FULL_ERROR:
                        r = "当媒体缓冲区中没有数据可以再添加时，引发它，因为它已满。通过减少最大缓冲区长度来恢复此错误";
                        break;
                    case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                        r = "尽管currentTime位于缓冲区域，但在播放被卡住时引发";
                        break;
                    case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                        r = t.reason,
                        s.url = t.url,
                        s.type = 2;
                        break;
                    case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                        r = "error while loading level playlist";
                        break;
                    case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        r = "timeout while loading level playlist";
                        break;
                    case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                        r = "error while trying to switch to level " + t.level;
                        break;
                    case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                        r = "error while loading fragment " + t.frag.url;
                        break;
                    case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        r = "timeout while loading fragment " + t.frag.url;
                        break;
                    case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                        r = "Frag Loop Loading Error ";
                        break;
                    case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                        r = "Decrypting Error:" + t.reason;
                        break;
                    case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                        r = "Parsing Error:" + t.reason;
                        break;
                    case Hls.ErrorDetails.KEY_LOAD_ERROR:
                        r = "error while loading key " + t.frag.decryptdata.uri;
                        break;
                    case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
                        r = "timeout while loading key " + t.frag.decryptdata.uri;
                        break;
                    case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                        r = "Buffer Append Error ";
                        break;
                    case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
                        thisTemp.log("Buffer Add Codec Error for " + t.mimeType + ":" + t.err.message),
                        r = "Buffer Add Codec Error for " + t.mimeType + ":" + t.err.message;
                        break;
                    case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
                        thisTemp.log("Buffer Appending Error"),
                        r = "Buffer Appending Error";
                        break;
                    default:
                        r = t.details
                    }
                    if (t.fatal)
                        switch (l.hls.destroy(),
                        t.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            a = "fatal network error encountered --- ",
                            t.frag && (s.ts_url = t.frag.relurl,
                            s.type = 1),
                            l.showWarm(1, n);
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            a = "fatal media error encountered --- ",
                            l.showWarm(2, n);
                            break;
                        default:
                            a = "fatal unrecoverable error encountered --- ",
                            l.showWarm(2, n)
                        }
                    else
                        a = "非fatal error --- ";
                    r = a + ("" != r) ? r : i,
                    s.message = r,
                    s.fatal = t.fatal,
                    l.repeatError(s)
                }),
                this.hls.on(Hls.Events.FRAG_LOADED, function(e, t) {
                    setTimeout(function() {
                        l.memTime = Math.round(t.frag.endDTS);
                        var e = Math.round(l.memTime / l.dt * 100);
                        l.cts.find(".mem").width(e + "%")
                    }, 1e3)
                })) : l.showWarm(0, 408)
            } else
                l.showWarm(0, 407)
        },
        initMainView: function() {
            var s = this
              , e = $('<div class="controls"></div>');
            this.dom.append(e);
            var t = $('<div class="bufferLoading"></div>');
            this.dom.append(t),
            this.cts = $('<div class="cts"><div class="mem"></div><div class="played"></div><div class="ps"><p></p></div></div>').mousemove(function(e) {
                var t = e.clientX - $(this).offset().left;
                $(this).find(".ps").css("left", t + "px").find("p").html(s.sTo(parseInt(s.dt * (t / $(this).width()))))
            }).mousedown(function(e) {
                e.clientX,
                this.offsetLeft;
                var t = $(this).find(".played")
                  , r = $(this).offset().left
                  , i = e.clientX - r
                  , a = $(this).width()
                  , n = i / a;
                t.width(i),
                document.onmousemove = function(e) {
                    i = e.clientX - r,
                    t.width(i),
                    (n = i / a) <= 0 && (n = 0),
                    1 <= n && (n = 1),
                    n = parseInt(1e4 * n) / 1e4
                }
                ,
                document.onmouseup = function() {
                    s.video_seek(parseInt(n * s.dt)),
                    document.onmousemove = null,
                    document.onmouseup = null
                }
            }),
            e.append(this.cts),
            this.playBtn = $('<div class="play icons fl"></div>'),
            e.append(this.playBtn),
            this.playBtn.click(function() {
                0 === s.playStatus || 4 === s.playStatus ? s.video_Play() : 1 === s.playStatus && s.video_pause()
            });
            var r = $('<div class="prev icons fl"></div>').click(function() {
                return s.jump(.1, !1),
                !1
            })
              , i = $('<div class="next icons fl"></div>').click(function() {
                return s.jump(.1, !0),
                !1
            });
            function a(e) {
                var t = s.voice.find(".sv").offset().top
                  , r = 0
                  , i = 110 - (e.clientY - t);
                100 <= i && (i = 100),
                i <= 0 && (i = 0),
                1 <= (r = i / 100) && (r = 1),
                r <= 0 && (r = 0),
                r = parseInt(100 * r) / 100,
                s.setCookie("h5playervoice", r, 31536e3),
                n(r)
            }
            function n(e) {
                s.voice.find(".a").height(100 * e + "%"),
                0 == (s.v.volume = e) && (s.voice.addClass("ed"),
                s.isMute),
                0 < e && (s.voice.removeClass("ed"),
                s.isMute)
            }
            this.config.prevurl && e.append(r),
            this.config.nexturl && e.append(i),
            this.duration = $('<div class="time fl"><span class="curTime">00:00</span> / <span class="allTime">00:00</span></div>'),
            e.append(this.duration),
            this.full = $('<div class="full icons fr"></div>').click(function() {
                0 === s.fs ? s.fullScreen() : s.exitFullScreen()
            }),
            e.append(this.full),
            this.ListenerFullScreen(),
            this.voice = $('<div class="voice icons fr"><div class="vc" style="height:30px;width:30px;">&nbsp;</div><div class="sv"><div class="c"><div class="b"></div><div class="a"></div></div></div></div>'),
            e.append(this.voice),
            this.getCookie("h5playervoice") && setTimeout(function() {
                n(Math.abs(s.getCookie("h5playervoice")))
            }, 100),
            this.getCookie("isMute") && setTimeout(function() {
                n(0)
            }, 0),
            this.voice.find(".sv").mousedown(function(e) {
                a(e),
                document.onmousemove = function(e) {
                    a(e)
                }
                ,
                document.onmouseup = function() {
                    document.onmousemove = null,
                    document.onmouseup = null
                }
            }).mouseleave(function() {
                document.onmousemove = null,
                document.onmouseup = null
            }),
            "click" == this.Conf.controlsTrigger ? (this.voice.find(".vc").click(function() {
                s.voice.toggleClass("active")
            }),
            this.voice.on("mouseleave", function() {
                s.voice.removeClass("active")
            })) : s.voice.addClass("trigger-over"),
            this.getCookie("h5playervoice") && n(parseFloat(this.getCookie("h5playervoice"))),
            1 == this.Conf.skin.network && (this.route = $('<div class="route hl fr"><span>网络：自动</span><ul><li>点击测速</li></ul></div>').click(function(e) {
                if ("LI" != e.target.tagName)
                    return !1;
                if (0 === $(e.target).index())
                    return 1 == s.netTest || s.testSpeed(s.playStatus),
                    !1;
                if (2 != s.netTest)
                    return !1;
                var t = parseInt($(e.target).attr("val"))
                  , r = s.config.dispatch_list[t];
                if (0 === r.sp)
                    return !1;
                s.config.dispatch = r.value,
                s.cdn = r.code,
                s.switchDef("hd" == s.def ? 0 : 1, s.ht),
                s.route.find("span").eq(0).text("网络：" + r.name)
            }),
            2 == this.netTest && (s.route.find("li").text("重新测速"),
            $.each(s.config.dispatch_list, function(e, t) {
                s.route.find("ul").append('<li val="' + e + '">' + t.name + ": " + t.sp + "K/s</li>")
            })),
            e.append(this.route)),
            1 < this.config.dispatch.length && (this.defDom = $('<div class="def hl fr"><span>流畅</span><ul><li>高清</li><li>流畅</li></ul></div>').click(function(e) {
                if ("LI" == e.target.tagName) {
                    var t = $(e.target).index();
                    s.def = 1 == t ? "low" : "hd",
                    s.switchDef(t, s.ht)
                }
            }),
            e.append(this.defDom));
            var o = "倍速"
              , l = $("<ul></ul>");
            if (this.getCookie("h5playersd")) {
                var u = parseFloat(this.getCookie("h5playersd"));
                o = 1 == (u = 2 == u ? u + ".0" : u) ? o : u + "x"
            }
            $.each(["2.0", "1.75", "1.5", "1.25", "1.0"], function(e, t) {
                l.append("<li>" + t + "x</li>")
            }),
            this.speed = $('<div class="speed hl fr"><span>' + o + "</span></div>").append(l).click(function(e) {
                if ("LI" == e.target.tagName) {
                    var t = $(e.target).text();
                    s.setSpeed(t)
                }
            }),
            e.append(this.speed),
            this.video.click(function() {
                0 === s.playStatus ? s.video_Play() : 1 === s.playStatus && s.video_pause()
            }),
            this.Tips = $('<div class="Tips"></div>'),
            this.dom.append(this.Tips);
            var d = e.find("div.hl");
            "click" == this.Conf.controlsTrigger ? (d.on("click", function(e) {
                $(this).toggleClass("active")
            }),
            d.on("mouseleave", function(e) {
                $(this).removeClass("active")
            })) : d.addClass("trigger-over");
            var c = setTimeout(function() {
                h()
            }, 5e3);
            function h() {
                e.hide(),
                s.dom.addClass("noMouse")
            }
            this.dom.unbind().mousemove(function() {
                e.show(),
                s.dom.removeClass("noMouse"),
                clearTimeout(c),
                c = setTimeout(function() {
                    h()
                }, 5e3)
            }).mouseleave(function() {
                h()
            }).dblclick(function() {
                0 === s.fs ? s.fullScreen() : s.exitFullScreen()
            });
            this.addListener("resize", function() {
                s.changeElementCoor()
            }, window)
        },
        video_Play: function() {
            this.emptyST && clearTimeout(this.emptyST),
            null != this.v && (this.video && this.video.show(),
            this.v && this.v.play(),
            this.log("----------- playstatus = 1 (video_Play) ---------------"),
            this.playStatus = 1,
            this.playStatusHandler())
        },
        playerLoad: function() {
            var e = this;
            this.isFirst && (this.isFirst = !1,
            window.setTimeout(function() {
                e.loadedHandler()
            }, 1))
        },
        loadedHandler: function() {
            if ("" != this.vars.loaded)
                try {
                    eval(this.vars.loaded + "()")
                } catch (e) {}
        },
        playStatusHandler: function() {
            var e = !0
              , t = this;
            this.pausedMask && this.pausedMask.hide(),
            this.playBtn.addClass("ps"),
            this.dom.removeClass("pause"),
            this.Conf.kernel.loginCheckFlag && (e = this.checkLogin()),
            this.timerF && window.clearTimeout(this.timerF),
            this.timerF = setTimeout(function() {
                t.timer(e)
            }, 1e3)
        },
        nextJump: function() {
            window.playerFinishCallback ? playerFinishCallback() : this.config.nexturl && this.jump(.1, !0)
        },
        seekedHandler: function() {
            this.resetTrack()
        },
        onPlayIngHandler: function() {
            0 <= this.ht && !this.isFirstSucess && 0 < this.ht && (this.isFirstSucess = !0,
            this.onPlayFullHandler())
        },
        onPlayFullHandler: function() {
            if (this.startPlay) {
                if ($(".bufferLoading").hide(),
                !this.isEmpty)
                    return;
                var e;
                if (this.isEmpty)
                    if (this.isEmpty = !1,
                    e = (new Date).getTime(),
                    this.isSeekEmpty) {
                        if (-1 != this.sST) {
                            r = {
                                eType: "seekVideoBuffer",
                                content: e - this.sST,
                                bst: this.sST,
                                bet: e
                            };
                            this.repeatError(r),
                            this.sST = -1,
                            this.isStartSeek = !1
                        }
                    } else if (-1 != this.bST) {
                        r = {
                            eType: "VideoBuffer",
                            content: e - this.bST,
                            bst: this.bST,
                            bet: e
                        };
                        this.repeatError(r),
                        this.bST = -1
                    }
            } else if (this.startPlay = !0,
            this.isEmpty && (this.isEmpty = !1),
            this.playStatusHandler(),
            -1 != this.cST) {
                var t = (new Date).getTime()
                  , r = {
                    eType: "connectBuffer",
                    content: t - this.cST,
                    bst: this.cST,
                    bet: t
                };
                this.repeatError(r)
            }
            this.emptyST && clearTimeout(this.emptyST)
        },
        playOrPause: function() {
            null != this.v && (this.v.paused ? this.video_Play() : this.video_pause())
        },
        kernel_seek: function(e) {
            this.hls && this.hls.startLoad(e)
        },
        video_seek: function(e) {
            if (this.isStartSeek = !0,
            this.isEndStartSeek = !1,
            this.emptyST && clearTimeout(this.emptyST),
            this.isFirstSucess || this.startPlay) {
                var t = this.getMetaDate().duration;
                0 < t && t < e && (e = t),
                this.v && (this.v.currentTime = e,
                this.ht = e)
            }
        },
        video_Stop: function() {
            this.emptyST && clearTimeout(this.emptyST),
            this.log("----------- playstatus = 4 (video_Stop) ---------------"),
            this.playStatus = 4,
            this.dom.addClass("pause"),
            this.playBtn.removeClass("ps"),
            clearTimeout(this.timerF),
            this.pausedMask.show(),
            $(".saver").remove(),
            this.heart()
        },
        video_pause: function() {
            this.emptyST && clearTimeout(this.emptyST),
            this.v && this.v.pause(),
            this.log("----------- playstatus = 0 (video_pause) ---------------"),
            this.playStatus = 0,
            this.dom.addClass("pause"),
            this.playBtn.removeClass("ps"),
            this.pausedMask.show(),
            clearTimeout(this.timerF)
        },
        timeUpdateHandler: function() {
            if (!this.isUndefined(this.ht)) {
                var e = parseInt(this.ht);
                this.duration.find("span").eq(0).html(this.sTo(e)),
                this.cts.find(".played").width(Math.round(e / this.dt * 1e4) / 100 + "%")
            }
        },
        fullScreen: function(e) {
            this.fs = 1,
            this.dom.addClass("off"),
            this.fontSize = 40;
            var t = this.dom[0];
            if (t)
                if (t.requestFullscreen)
                    try {
                        t.requestFullscreen()
                    } catch (e) {}
                else if (t.mozRequestFullScreen)
                    try {
                        t.mozRequestFullScreen()
                    } catch (e) {}
                else if (t.webkitRequestFullScreen)
                    try {
                        t.webkitRequestFullScreen()
                    } catch (e) {}
                else if (t.msRequestFullscreen)
                    try {
                        t.msRequestFullscreen()
                    } catch (e) {}
            this.setCookie("playFullScreen", 1)
        },
        exitFullScreen: function() {
            this.fs = 0,
            this.dom.removeClass("off"),
            this.fontSize = 28;
            var e = document;
            if (71 <= this.getChromeVersion()) {
                var t;
                if (e)
                    e.exitFullscreen ? t = e.exitFullscreen() : e.mozCancelFullScreen ? t = e.mozCancelFullScreen() : e.webkitExitFullscreen ? t = e.webkitExitFullscreen() : e.msExitFullscreen && (t = e.msExitFullscreen());
                t.catch && t.catch(function() {})
            } else if (e)
                if (e.exitFullscreen)
                    try {
                        e.exitFullscreen()
                    } catch (e) {}
                else if (e.mozCancelFullScreen)
                    try {
                        e.mozCancelFullScreen()
                    } catch (e) {}
                else if (e.webkitExitFullscreen)
                    try {
                        e.webkitExitFullscreen()
                    } catch (e) {}
                else if (e.msExitFullscreen)
                    try {
                        e.msExitFullscreen()
                    } catch (e) {}
            this.removeCookie("playFullScreen")
        },
        ListenerFullScreen: function() {
            var e = document
              , t = this;
            e.addEventListener("fullscreenchange", function() {
                e.fullscreen || t.exitFullScreen()
            }, !1),
            e.addEventListener("mozfullscreenchange", function() {
                e.mozFullScreen || t.exitFullScreen()
            }, !1),
            e.addEventListener("webkitfullscreenchange", function() {
                e.webkitIsFullScreen || t.exitFullScreen()
            }, !1),
            e.addEventListener("msfullscreenchange", function() {
                e.msFullscreenElement || t.exitFullScreen()
            }, !1)
        },
        setSpeed: function(e) {
            this.sd = parseFloat(e.replace("x", "")),
            this.speed.find("span").html(e),
            this.v.playbackRate = this.sd,
            this.setCookie("h5playersd", this.sd, 259200)
        },
        destroy: function() {
            this.warm = !1,
            this.isDestory = !0,
            this.dom.empty(),
            this.destroyKernel(),
            this.v = null,
            this.log("----------- playstatus = 4 (destroy) ---------------"),
            this.playStatus = 4
        },
        destroyKernel: function() {
            this.startPlay = !1,
            this.hls && (this.hls.destroy(),
            this.hls.bufferTimer && (clearInterval(this.hls.bufferTimer),
            this.hls.bufferTimer = void 0),
            this.hls = null)
        },
        addListener: function(e, t, r, i) {
            this.isUndefined(i) && (i = !1);
            var a = this.v;
            if (a = this.head ? this.headover ? "ended" == this.curPlayState ? this.av : this.v : this.av : this.v,
            this.isUndefined(r) || (a = r),
            a.addEventListener)
                try {
                    a.addEventListener(e, t, i)
                } catch (e) {}
            else if (a.attachEvent)
                try {
                    a.attachEvent("on" + e, t)
                } catch (e) {}
            else
                a["on" + e] = t
        },
        removeListener: function(e, t, r, i) {
            var a;
            if (this.isUndefined(i) && (i = !1),
            a = this.head ? this.headover ? "ended" == this.curPlayState ? this.av : this.v : this.av : this.v)
                if (this.isUndefined(r) || (a = r),
                a.removeEventListener)
                    try {
                        a.removeEventListener(e, t, i)
                    } catch (e) {}
                else if (a.detachEvent)
                    try {
                        a.detachEvent("on" + e, t)
                    } catch (e) {}
                else
                    a["on" + e] = null
        },
        isProcessSeek: function(e) {
            var t;
            e ? -1 != this.seekStartTime && e && (t = (new Date).getTime() - this.seekStartTime,
            this.isSeekVideoBuffer = 1e3 < t) : this.seekStartTime = (new Date).getTime()
        },
        iska: function(e) {
            if (-1 != e) {
                if (!(e < 1e3)) {
                    var t = !1;
                    5e3 < e && (t = !0),
                    this.isKaTime++,
                    this.isKaLen += e;
                    var r = this.isKaLen / this.isKaTime;
                    if ((new Date).getTime() - this.kaStartTime < 6e5 && 3e3 < r && 5 <= this.isKaTime && (t = !0),
                    t) {
                        this.repeatError({
                            eType: "videoKa",
                            content: null,
                            message: null
                        })
                    }
                }
            } else
                this.kaStartTime < 0 && (this.kaStartTime = (new Date).getTime())
        },
        jumpCurErrorPos: function() {
            var e = "hd" == this.def ? 0 : 1;
            this.errorTime = this.ht + 1,
            this.switchDef(e, this.ht + 1)
        },
        showWarm: function(num, ecode) {
            if (!this.warm) {
                var me = this, txt;
                this.warm = !0,
                this.startH5Video && (this.video_Stop(),
                this.destroyKernel());
                var code = "", useFlash;
                switch (num) {
                case 0:
                    txt = this.warmLaguage[0];
                    break;
                case 1:
                    txt = this.warmLaguage[1];
                    break;
                case 2:
                    txt = this.warmLaguage[2];
                    break;
                case 3:
                    txt = this.warmLaguage[3],
                    useFlash = !0;
                    break;
                default:
                    txt = this.warmLaguage[2]
                }
                if (ecode && (code = " (" + ecode + " )"),
                error = $('<div class="error cantPlay"><p>' + txt + code + "</p></div>"),
                this.dom.empty().append(error),
                this.cs) {
                    var _contactService = $('<div class="answer"><p>如果问题仍未解决，请<span class="blue service">  联系客服</span></p></div>');
                    _contactService.find(".service").click(function() {
                        if (me.emptyCallback)
                            try {
                                eval(me.emptyCallback + "()")
                            } catch (e) {}
                    }),
                    error.append(_contactService)
                }
            }
        },
        registerKeypress: function() {
            var t = this
              , r = "";
            $("body").keyup(function(e) {
                if ("textarea" === (r = e.target.nodeName.toLocaleLowerCase()) || "input" === r)
                    return !1;
                32 == e.keyCode && (0 === t.playStatus ? t.video_Play() : t.video_pause()),
                37 == e.keyCode && t.video_seek(t.ht - 5),
                39 == e.keyCode && t.video_seek(t.ht + 5)
            })
        },
        switchDef: function(e, t) {
            this.isFirstSucess = !0,
            this.startPlay = !1,
            this.isEmpty = !1,
            this.initMain(this.config.dispatch[e].url, t),
            this.defDom.find("span").text("hd" == this.def ? "高清" : "流畅"),
            this.setCookie("playDEF", this.def, 31536e3)
        },
        seekTipShow: function() {
            var e = this
              , t = $('<span class="blue">从头观看</span>').click(function() {
                r.remove(),
                i.remove(),
                e.video_seek(.1)
            });
            this.playTime = this.playTime > this.dt ? this.dt : this.playTime;
            var r = $('<div class="lastLearn"><i>!</i>您上次学习到 ' + e.sTo(this.playTime) + " 已自动为您续播　</div>")
              , i = $('<div class="closeTip"></div>').click(function() {
                r.remove(),
                i.remove(),
                e.TipsHide()
            });
            r.append(t),
            this.Tips.empty().append(r).append(i).show(),
            setTimeout(function() {
                r.remove(),
                i.remove(),
                e.TipsHide()
            }, 5e3)
        },
        TipsHide: function() {
            15 < this.dt - parseInt(this.ht) && this.Tips.hide()
        },
        Saver: function(e) {
            var t = this;
            setTimeout(function() {
                t.SaverShow(e)
            }, 1e3 * (parseInt(10 * Math.random()) + 5))
        },
        SaverShow: function(e) {
            var t = this;
            var r, i = parseInt(100 * Math.random()) / 100 * t.dom.height();
            i > t.dom.height() - 20 && (i = t.dom.height() - 20),
            r = $('<div class="saver" style="animation-duration:10s;top:' + i + "px;color:rgba(" + parseInt(100 * Math.random()) + "," + parseInt(100 * Math.random()) + "," + parseInt(100 * Math.random()) + ",1);width:" + 16 * t.config.saverText.length + 'px;">' + t.config.saverText + "</div>"),
            1 == t.playStatus && t.dom.append(r),
            setTimeout(function() {
                r.addClass("overtime"),
                1 == t.playStatus && (r.andSelf(),
                r.remove())
            }, 1e4),
            setTimeout(function() {
                t.SaverShow(e, 10)
            }, 1e3 * (parseInt(21 * Math.random()) - 10 + e))
        },
        testSpeed: function(e) {
            this.video_pause(),
            this.dln = 0,
            this.netTest = 1,
            this.route.find("ul").find("li:gt(0)").remove(),
            this.testSpeedIng(this.dln++, e)
        },
        testSpeedIng: function(i, a) {
            var n = this
              , s = this.route.find("ul")
              , o = (new Date).getTime()
              , l = this.config.dispatch_list[i];
            s.children().eq(0).text("测速中"),
            $.ajax({
                url: l.test,
                cache: !1,
                complete: function(e) {
                    if (4 == e.readyState)
                        var t = (new Date).getTime()
                          , r = parseInt(2048e3 / (t - o));
                    else
                        r = 0;
                    l.sp = r,
                    s.append('<li val="' + i + '">' + l.name + ": " + r + "K/s</li>"),
                    s.children().eq(0).text("重新测速"),
                    i < n.config.dispatch_list.length - 1 ? n.testSpeedIng(n.dln++, a) : (n.netTest = 2,
                    1 == a && n.video_Play())
                }
            })
        },
        setUid: function(e) {
            this.uid = e
        },
        getuuid: function() {
            return this.uuid
        },
        timer: function(e) {
            var t = this;
            if (this.timerF && window.clearTimeout(this.timerF),
            this.timerF = setTimeout(function() {
                t.timer(e)
            }, 1e3),
            this.isLoading)
                return !1;
            1 == this.playStatus && (this.pt++,
            this.Conf.kernel.loginCheckTime = 10,
            "login" != e && 1 != e && 298 < this.ht && this.noLogin()),
            this.setCookie("playTime" + this.lid, this.ht, 604800);
            var r = this.dt - parseInt(this.ht);
            if (this.Tips.show().find(".rest").remove(),
            r < 16 && this.config.nexturl && !t.djsClosed) {
                var i = $('<div class="rest"><i>!</i><span class="blue">' + r + "s</span>后为您播放下一节</div>")
                  , a = $('<div class="closeTip"></div>').click(function() {
                    i.remove(),
                    a.remove(),
                    t.TipsHide(),
                    t.djsClosed = !0
                });
                this.Tips.empty().append(i).append(a)
            }
            0 == this.Tips.children().length && this.TipsHide()
        },
        noLogin: function() {
            this.video_Stop(),
            this.dom.empty().append('<div class="error noLogin"><p>未登录用户只能试看5分钟，更多内容请登录后观看<a href="' + this.Conf.url_login + '">登录/注册</a></p></div>')
        },
        jump: function(e, t) {
            var r = t ? this.config.nexturl : this.config.prevurl;
            setTimeout(function() {
                window.location = r
            }, 1e3 * e)
        },
        heart: function(e) {
            var t = window.navigator.userAgent;
            var r, i = {
                m: "time",
                id: this.lid,
                uid: this.uid,
                uuid: this.uuid,
                ref: location.href,
                os: t.indexOf("Windows") ? "Windows" : "other",
                br: (r = t,
                -1 < r.indexOf("Opera") ? "Opera" : -1 < r.indexOf("Firefox") ? "FF" : -1 < r.indexOf("Chrome") ? "Chrome" : -1 < r.indexOf("Safari") ? "Safari" : -1 < r.indexOf("compatible") && -1 < r.indexOf("MSIE") && !isOpera ? "IE" : void 0),
                fp: 0,
                htime: this.ht,
                dt: this.dt,
                pt: this.pt,
                t: (new Date).getTime(),
                sgin: this.MD5("" + (new Date).getTime() + this.ht + this.dt + this.pt + "eDu_51Cto_siyuanTlw").toString(),
                cdn: this.cdn,
                def: this.def,
                switchDef: this.def,
                ver: this.version,
                platform: 4
            };
            e && $.extend(i, e),
            $.get(this.Conf.url_stat, i)
        },
        repeatError: function(e) {
            var t = {
                m: "time",
                video_id: this.lid,
                user_id: this.uid,
                uuid: this.uuid,
                type: 0,
                speed: 0,
                htime: this.ht,
                btime: this.bufferTime,
                dt: this.dt,
                pt: this.pt,
                time: (new Date).getTime(),
                sign: this.MD5(this.uid + this.lid + this.ht + this.pt + (new Date).getTime() + "eDu_51Cto_siyuanTlw").toString(),
                cdn: this.cdn,
                warm: this.warm,
                ts_url: "",
                platform: 4
            };
            e && $.extend(t, e),
            $.get(this.Conf.url_lag, t)
        },
        Barrage: function() {},
        arrSort: function(e) {
            for (var t = [], r = 0; r < e.length; r++)
                for (var i = 0; i < e.length - r; i++)
                    !this.isUndefined(e[i + 1]) && e[i][3] < e[i + 1][3] && (t = e[i + 1],
                    e[i + 1] = e[i],
                    e[i] = t);
            return e
        },
        isMsie: function() {
            var e = navigator.appName
              , t = navigator.appVersion.split(";")
              , r = "";
            return 1 < t.length && (r = t[1].replace(/[ ]/g, "")),
            "Microsoft Internet Explorer" != e || "MSIE6.0" != r && "MSIE7.0" != r && "MSIE8.0" != r && "MSIE9.0" != r && "MSIE10.0" != r
        },
        supportVideo: function() {
            if (!this.isMsie())
                return !1;
            if (document.createElement("video").canPlayType) {
                var t, r, e = document.createElement("video");
                try {
                    t = e.canPlayType('video/ogg; codecs="theora, vorbis"')
                } catch (e) {
                    t = !1
                }
                if (t)
                    return "probably" == t;
                try {
                    r = e.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
                } catch (e) {
                    r = !1
                }
                return !!r && "probably" == r
            }
            return !1
        },
        isUndefined: function(e) {
            try {
                if ("undefined" == e || null == e)
                    return !0
            } catch (e) {}
            return !1
        },
        getMetaDate: function() {
            if (!this.startPlay || null == this.v)
                return !1;
            var e = 0;
            try {
                e = isNaN(this.v.duration) ? 0 : this.v.duration
            } catch (e) {}
            return {
                duration: e,
                volume: this.v.volume,
                width: this.dom.offsetWidth || this.v.offsetWidth || this.v.width,
                height: this.dom.offsetHeight || this.v.offsetHeight || this.v.height,
                videoWidth: this.v.videoWidth,
                videoHeight: this.v.videoHeight,
                paused: this.v.paused
            }
        },
        getV: function() {
            return this.v
        },
        getVersion: function() {
            return this.version
        },
        sTo: function(e) {
            if (e < 0)
                return "00:00";
            var t, r = 0 != (r = (r = Math.floor(e / 3600)) < 10 ? "0" + r : r) ? r + ":" : "", i = (i = Math.floor(e / 60 % 60)) < 10 ? "0" + i : i;
            return r + (i += ":") + (t = (t = Math.floor(e % 60)) < 10 ? "0" + t : t)
        },
        MD5: function(e) {
            var a = 0
              , n = 8;
            function t(e) {
                return s(r(i(e), e.length * n))
            }
            function r(e, t) {
                e[t >> 5] |= 128 << t % 32,
                e[14 + (t + 64 >>> 9 << 4)] = t;
                for (var r = 1732584193, i = -271733879, a = -1732584194, n = 271733878, s = 0; s < e.length; s += 16) {
                    var o = r
                      , l = i
                      , u = a
                      , d = n;
                    i = p(i = p(i = p(i = p(i = f(i = f(i = f(i = f(i = h(i = h(i = h(i = h(i = c(i = c(i = c(i = c(i, a = c(a, n = c(n, r = c(r, i, a, n, e[s + 0], 7, -680876936), i, a, e[s + 1], 12, -389564586), r, i, e[s + 2], 17, 606105819), n, r, e[s + 3], 22, -1044525330), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 4], 7, -176418897), i, a, e[s + 5], 12, 1200080426), r, i, e[s + 6], 17, -1473231341), n, r, e[s + 7], 22, -45705983), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 8], 7, 1770035416), i, a, e[s + 9], 12, -1958414417), r, i, e[s + 10], 17, -42063), n, r, e[s + 11], 22, -1990404162), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 12], 7, 1804603682), i, a, e[s + 13], 12, -40341101), r, i, e[s + 14], 17, -1502002290), n, r, e[s + 15], 22, 1236535329), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 1], 5, -165796510), i, a, e[s + 6], 9, -1069501632), r, i, e[s + 11], 14, 643717713), n, r, e[s + 0], 20, -373897302), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 5], 5, -701558691), i, a, e[s + 10], 9, 38016083), r, i, e[s + 15], 14, -660478335), n, r, e[s + 4], 20, -405537848), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 9], 5, 568446438), i, a, e[s + 14], 9, -1019803690), r, i, e[s + 3], 14, -187363961), n, r, e[s + 8], 20, 1163531501), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 13], 5, -1444681467), i, a, e[s + 2], 9, -51403784), r, i, e[s + 7], 14, 1735328473), n, r, e[s + 12], 20, -1926607734), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 5], 4, -378558), i, a, e[s + 8], 11, -2022574463), r, i, e[s + 11], 16, 1839030562), n, r, e[s + 14], 23, -35309556), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 1], 4, -1530992060), i, a, e[s + 4], 11, 1272893353), r, i, e[s + 7], 16, -155497632), n, r, e[s + 10], 23, -1094730640), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 13], 4, 681279174), i, a, e[s + 0], 11, -358537222), r, i, e[s + 3], 16, -722521979), n, r, e[s + 6], 23, 76029189), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 9], 4, -640364487), i, a, e[s + 12], 11, -421815835), r, i, e[s + 15], 16, 530742520), n, r, e[s + 2], 23, -995338651), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 0], 6, -198630844), i, a, e[s + 7], 10, 1126891415), r, i, e[s + 14], 15, -1416354905), n, r, e[s + 5], 21, -57434055), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 12], 6, 1700485571), i, a, e[s + 3], 10, -1894986606), r, i, e[s + 10], 15, -1051523), n, r, e[s + 1], 21, -2054922799), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 8], 6, 1873313359), i, a, e[s + 15], 10, -30611744), r, i, e[s + 6], 15, -1560198380), n, r, e[s + 13], 21, 1309151649), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 4], 6, -145523070), i, a, e[s + 11], 10, -1120210379), r, i, e[s + 2], 15, 718787259), n, r, e[s + 9], 21, -343485551),
                    r = g(r, o),
                    i = g(i, l),
                    a = g(a, u),
                    n = g(n, d)
                }
                return Array(r, i, a, n)
            }
            function o(e, t, r, i, a, n) {
                return g(function(e, t) {
                    return e << t | e >>> 32 - t
                }(g(g(t, e), g(i, n)), a), r)
            }
            function c(e, t, r, i, a, n, s) {
                return o(t & r | ~t & i, e, t, a, n, s)
            }
            function h(e, t, r, i, a, n, s) {
                return o(t & i | r & ~i, e, t, a, n, s)
            }
            function f(e, t, r, i, a, n, s) {
                return o(t ^ r ^ i, e, t, a, n, s)
            }
            function p(e, t, r, i, a, n, s) {
                return o(r ^ (t | ~i), e, t, a, n, s)
            }
            function g(e, t) {
                var r = (65535 & e) + (65535 & t);
                return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
            }
            function i(e) {
                for (var t = Array(), r = (1 << n) - 1, i = 0; i < e.length * n; i += n)
                    t[i >> 5] |= (e.charCodeAt(i / n) & r) << i % 32;
                return t
            }
            function s(e) {
                for (var t = a ? "0123456789ABCDEF" : "0123456789abcdef", r = "", i = 0; i < 4 * e.length; i++)
                    r += t.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + t.charAt(e[i >> 2] >> i % 4 * 8 & 15);
                return r
            }
            return t(e)
        },
        Base64: function() {
            _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            this.encode = function(e) {
                var t, r, i, a, n, s, o, l = "", u = 0;
                for (e = _utf8_encode(e); u < e.length; )
                    a = (t = e.charCodeAt(u++)) >> 2,
                    n = (3 & t) << 4 | (r = e.charCodeAt(u++)) >> 4,
                    s = (15 & r) << 2 | (i = e.charCodeAt(u++)) >> 6,
                    o = 63 & i,
                    isNaN(r) ? s = o = 64 : isNaN(i) && (o = 64),
                    l = l + _keyStr.charAt(a) + _keyStr.charAt(n) + _keyStr.charAt(s) + _keyStr.charAt(o);
                return l
            }
            ,
            this.decode = function(e) {
                var t, r, i, a, n, s, o = "", l = 0;
                for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < e.length; )
                    t = _keyStr.indexOf(e.charAt(l++)) << 2 | (a = _keyStr.indexOf(e.charAt(l++))) >> 4,
                    r = (15 & a) << 4 | (n = _keyStr.indexOf(e.charAt(l++))) >> 2,
                    i = (3 & n) << 6 | (s = _keyStr.indexOf(e.charAt(l++))),
                    o += String.fromCharCode(t),
                    64 != n && (o += String.fromCharCode(r)),
                    64 != s && (o += String.fromCharCode(i));
                return o = _utf8_decode(o)
            }
            ,
            _utf8_encode = function(e) {
                e = e.replace(/\r\n/g, "\n");
                for (var t = "", r = 0; r < e.length; r++) {
                    var i = e.charCodeAt(r);
                    i < 128 ? t += String.fromCharCode(i) : (127 < i && i < 2048 ? t += String.fromCharCode(i >> 6 | 192) : (t += String.fromCharCode(i >> 12 | 224),
                    t += String.fromCharCode(i >> 6 & 63 | 128)),
                    t += String.fromCharCode(63 & i | 128))
                }
                return t
            }
            ,
            _utf8_decode = function(e) {
                for (var t = "", r = 0, i = c1 = c2 = 0; r < e.length; )
                    (i = e.charCodeAt(r)) < 128 ? (t += String.fromCharCode(i),
                    r++) : 191 < i && i < 224 ? (c2 = e.charCodeAt(r + 1),
                    t += String.fromCharCode((31 & i) << 6 | 63 & c2),
                    r += 2) : (c2 = e.charCodeAt(r + 1),
                    c3 = e.charCodeAt(r + 2),
                    t += String.fromCharCode((15 & i) << 12 | (63 & c2) << 6 | 63 & c3),
                    r += 3);
                return t
            }
        },
        base64decode: function(e) {
            var t, r, i, a, n, s, o, l = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);
            for (s = e.length,
            n = 0,
            o = ""; n < s; ) {
                for (; t = l[255 & e.charCodeAt(n++)],
                n < s && -1 == t; )
                    ;
                if (-1 == t)
                    break;
                for (; r = l[255 & e.charCodeAt(n++)],
                n < s && -1 == r; )
                    ;
                if (-1 == r)
                    break;
                o += String.fromCharCode(t << 2 | (48 & r) >> 4);
                do {
                    if (61 == (i = 255 & e.charCodeAt(n++)))
                        return o;
                    i = l[i]
                } while (n < s && -1 == i);if (-1 == i)
                    break;
                o += String.fromCharCode((15 & r) << 4 | (60 & i) >> 2);
                do {
                    if (61 == (a = 255 & e.charCodeAt(n++)))
                        return o;
                    a = l[a]
                } while (n < s && -1 == a);if (-1 == a)
                    break;
                o += String.fromCharCode((3 & i) << 6 | a)
            }
            return o
        },
        getFileExt: function(e) {
            return "" == e ? "" : (-1 < e.indexOf("?") && (e = e.split("?")[0]),
            "." + e.replace(/.+\./, ""))
        },
        standardization: function(e, t) {
            var r, i = {};
            for (r in e)
                i[r] = e[r];
            for (r in t) {
                switch (typeof i[r]) {
                case "number":
                    i[r] = parseFloat(t[r]);
                    break;
                case "string":
                    "string" != typeof t[r] && void 0 !== t[r] ? i[r] = t[r].toString() : i[r] = t[r];
                    break;
                default:
                    i[r] = t[r]
                }
            }
            return i
        },
        request: function(e, t, r, i, a, n, s) {
            var o = this;
            $.ajax({
                async: e,
                cache: t,
                type: r,
                url: i,
                dataType: a,
                data: n,
                beforSend: function() {},
                error: function(e) {
                    o.log("传输失败:" + e)
                },
                success: function(e) {
                    s(e)
                }
            })
        },
        log: function(e) {
            if (0 != this.debug)
                try {
                    console.log("[" + this.getNowDate() + "] :" + e)
                } catch (e) {}
        },
        getNowDate: function() {
            var e = new Date
              , t = e.getMonth() + 1
              , r = e.getDate()
              , i = e.getHours()
              , a = e.getMinutes()
              , n = e.getSeconds();
            return (t < 10 ? "0" + t : t + "") + "/" + (r < 10 ? "0" + r : r + "") + " " + (i < 10 ? "0" + i : i + "") + ":" + (a < 10 ? "0" + a : a + "") + ":" + (n < 10 ? "0" + n : n + "")
        },
        justifyObjContains: function(e, t) {
            return t[e] ? t[e] : -1
        },
        arrIndexOf: function(e, t) {
            var r = new RegExp(t,[""]);
            return e.toString().replace(r, "┢").replace(/[^,┢]/g, "").indexOf("┢")
        },
        getChromeVersion: function() {
            for (var e = navigator.userAgent.split(" "), t = "", r = 0; r < e.length; r++)
                /chrome/i.test(e[r]) && (t = e[r]);
            return !!t && Number(t.split("/")[1].split(".")[0])
        },
        toSeconds: function(e) {
            var t = 0;
            if (e) {
                var r = e.split(":");
                for (i = 0; i < r.length; i++)
                    t = 60 * t + parseFloat(r[i].replace(",", "."))
            }
            return t
        },
        trim: function(e) {
            return "" != e ? e.replace(/(^\s*)|(\s*$)/g, "") : ""
        },
        setCookie: function(e, t, r) {
            var i = new Date;
            i.setTime(i.getTime() + 1e3 * r);
            var a = 0 == r ? "" : ";expires=" + i.toGMTString();
            document.cookie = e + "=" + t + a + ";path=/"
        },
        getCookie: function(e) {
            var t = document.cookie.split("; ")
              , r = 0;
            for (r = 0; r < t.length; r++) {
                var i = t[r].split("=");
                if (i[0] == e)
                    return i[1]
            }
            return ""
        },
        removeCookie: function(e) {
            this.setCookie(e, "", -1)
        }
    },
    window.ctoplayer = ctoplayer
}(),
"undefined" != typeof window && function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Hls = t() : e.Hls = t()
}(this, function() {
    return function(r) {
        var i = {};
        function a(e) {
            if (i[e])
                return i[e].exports;
            var t = i[e] = {
                i: e,
                l: !1,
                exports: {}
            };
            return r[e].call(t.exports, t, t.exports, a),
            t.l = !0,
            t.exports
        }
        return a.m = r,
        a.c = i,
        a.d = function(e, t, r) {
            a.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: r
            })
        }
        ,
        a.r = function(e) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
        ,
        a.t = function(t, e) {
            if (1 & e && (t = a(t)),
            8 & e)
                return t;
            if (4 & e && "object" == typeof t && t && t.__esModule)
                return t;
            var r = Object.create(null);
            if (a.r(r),
            Object.defineProperty(r, "default", {
                enumerable: !0,
                value: t
            }),
            2 & e && "string" != typeof t)
                for (var i in t)
                    a.d(r, i, function(e) {
                        return t[e]
                    }
                    .bind(null, i));
            return r
        }
        ,
        a.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e.default
            }
            : function() {
                return e
            }
            ;
            return a.d(t, "a", t),
            t
        }
        ,
        a.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        a.p = "/dist/",
        a(a.s = 31)
    }([function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(6);
        function s() {}
        var a = {
            trace: s,
            debug: s,
            log: s,
            warn: s,
            info: s,
            error: s
        }
          , o = a
          , l = i.getSelfScope();
        t.enableLogs = function(e) {
            if (!0 === e || "object" == typeof e) {
                !function(t) {
                    for (var e = [], r = 1; r < arguments.length; r++)
                        e[r - 1] = arguments[r];
                    e.forEach(function(e) {
                        var a, n;
                        o[e] = t[e] ? t[e].bind(t) : (a = e,
                        (n = l.console[a]) ? function() {
                            for (var e = [], t = 0; t < arguments.length; t++)
                                e[t] = arguments[t];
                            var r, i;
                            e[0] && (e[0] = (r = a,
                            i = e[0],
                            "[" + r + "] > " + i)),
                            n.apply(l.console, e)
                        }
                        : s)
                    })
                }(e, "debug", "log", "info", "warn", "error");
                try {
                    o.log()
                } catch (e) {
                    o = a
                }
            } else
                o = a
        }
        ,
        t.logger = o
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = {
            MEDIA_ATTACHING: "hlsMediaAttaching",
            MEDIA_ATTACHED: "hlsMediaAttached",
            MEDIA_DETACHING: "hlsMediaDetaching",
            MEDIA_DETACHED: "hlsMediaDetached",
            BUFFER_RESET: "hlsBufferReset",
            BUFFER_CODECS: "hlsBufferCodecs",
            BUFFER_CREATED: "hlsBufferCreated",
            BUFFER_APPENDING: "hlsBufferAppending",
            BUFFER_APPENDED: "hlsBufferAppended",
            BUFFER_EOS: "hlsBufferEos",
            BUFFER_FLUSHING: "hlsBufferFlushing",
            BUFFER_FLUSHED: "hlsBufferFlushed",
            MANIFEST_LOADING: "hlsManifestLoading",
            MANIFEST_LOADED: "hlsManifestLoaded",
            MANIFEST_PARSED: "hlsManifestParsed",
            LEVEL_SWITCHING: "hlsLevelSwitching",
            LEVEL_SWITCHED: "hlsLevelSwitched",
            LEVEL_LOADING: "hlsLevelLoading",
            LEVEL_LOADED: "hlsLevelLoaded",
            LEVEL_UPDATED: "hlsLevelUpdated",
            LEVEL_PTS_UPDATED: "hlsLevelPtsUpdated",
            AUDIO_TRACKS_UPDATED: "hlsAudioTracksUpdated",
            AUDIO_TRACK_SWITCHING: "hlsAudioTrackSwitching",
            AUDIO_TRACK_SWITCHED: "hlsAudioTrackSwitched",
            AUDIO_TRACK_LOADING: "hlsAudioTrackLoading",
            AUDIO_TRACK_LOADED: "hlsAudioTrackLoaded",
            SUBTITLE_TRACKS_UPDATED: "hlsSubtitleTracksUpdated",
            SUBTITLE_TRACK_SWITCH: "hlsSubtitleTrackSwitch",
            SUBTITLE_TRACK_LOADING: "hlsSubtitleTrackLoading",
            SUBTITLE_TRACK_LOADED: "hlsSubtitleTrackLoaded",
            SUBTITLE_FRAG_PROCESSED: "hlsSubtitleFragProcessed",
            INIT_PTS_FOUND: "hlsInitPtsFound",
            FRAG_LOADING: "hlsFragLoading",
            FRAG_LOAD_PROGRESS: "hlsFragLoadProgress",
            FRAG_LOAD_EMERGENCY_ABORTED: "hlsFragLoadEmergencyAborted",
            FRAG_LOADED: "hlsFragLoaded",
            FRAG_DECRYPTED: "hlsFragDecrypted",
            FRAG_PARSING_INIT_SEGMENT: "hlsFragParsingInitSegment",
            FRAG_PARSING_USERDATA: "hlsFragParsingUserdata",
            FRAG_PARSING_METADATA: "hlsFragParsingMetadata",
            FRAG_PARSING_DATA: "hlsFragParsingData",
            FRAG_PARSED: "hlsFragParsed",
            FRAG_BUFFERED: "hlsFragBuffered",
            FRAG_CHANGED: "hlsFragChanged",
            FPS_DROP: "hlsFpsDrop",
            FPS_DROP_LEVEL_CAPPING: "hlsFpsDropLevelCapping",
            ERROR: "hlsError",
            FOUND_SIDX: "foundSidx",
            MP4_REGEX_SUFFIX: "mp4_regex_suffix",
            PARSE_M3U8_RANGE: "parse_m3u8_range",
            SET_RANGE_END: "setRangeEnd",
            SET_SIDX_FRAG_RANGE_ONE: "setSidxFragRangeOne",
            SET_SIDX_FRAG_RANGE_TWO: "setSidxFragRangeTwo",
            SET_RAWBYTERANGE: "setRawByteRange",
            DESTROYING: "hlsDestroying",
            KEY_LOADING: "hlsKeyLoading",
            KEY_LOADED: "hlsKeyLoaded",
            STREAM_STATE_TRANSITION: "hlsStreamStateTransition"
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(6).getSelfScope().Number;
        (t.Number = i).isFinite = i.isFinite || function(e) {
            return "number" == typeof e && isFinite(e)
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.ErrorTypes = {
            NETWORK_ERROR: "networkError",
            MEDIA_ERROR: "mediaError",
            KEY_SYSTEM_ERROR: "keySystemError",
            MUX_ERROR: "muxError",
            OTHER_ERROR: "otherError"
        },
        t.ErrorDetails = {
            KEY_SYSTEM_NO_KEYS: "keySystemNoKeys",
            KEY_SYSTEM_NO_ACCESS: "keySystemNoAccess",
            KEY_SYSTEM_NO_SESSION: "keySystemNoSession",
            KEY_SYSTEM_LICENSE_REQUEST_FAILED: "keySystemLicenseRequestFailed",
            MANIFEST_LOAD_ERROR: "manifestLoadError",
            MANIFEST_LOAD_TIMEOUT: "manifestLoadTimeOut",
            MANIFEST_PARSING_ERROR: "manifestParsingError",
            MANIFEST_INCOMPATIBLE_CODECS_ERROR: "manifestIncompatibleCodecsError",
            LEVEL_LOAD_ERROR: "levelLoadError",
            LEVEL_LOAD_TIMEOUT: "levelLoadTimeOut",
            LEVEL_SWITCH_ERROR: "levelSwitchError",
            AUDIO_TRACK_LOAD_ERROR: "audioTrackLoadError",
            AUDIO_TRACK_LOAD_TIMEOUT: "audioTrackLoadTimeOut",
            FRAG_LOAD_ERROR: "fragLoadError",
            FRAG_LOAD_TIMEOUT: "fragLoadTimeOut",
            FRAG_DECRYPT_ERROR: "fragDecryptError",
            FRAG_PARSING_ERROR: "fragParsingError",
            REMUX_ALLOC_ERROR: "remuxAllocError",
            KEY_LOAD_ERROR: "keyLoadError",
            KEY_LOAD_TIMEOUT: "keyLoadTimeOut",
            BUFFER_ADD_CODEC_ERROR: "bufferAddCodecError",
            BUFFER_APPEND_ERROR: "bufferAppendError",
            BUFFER_APPENDING_ERROR: "bufferAppendingError",
            BUFFER_STALLED_ERROR: "bufferStalledError",
            BUFFER_FULL_ERROR: "bufferFullError",
            BUFFER_SEEK_OVER_HOLE: "bufferSeekOverHole",
            BUFFER_NUDGE_ON_STALL: "bufferNudgeOnStall",
            INTERNAL_EXCEPTION: "internalException"
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(0)
          , a = r(3)
          , n = r(1)
          , s = {
            hlsEventGeneric: !0,
            hlsHandlerDestroying: !0,
            hlsHandlerDestroyed: !0
        }
          , o = function() {
            function e(e) {
                for (var t = [], r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                this.hls = e,
                this.onEvent = this.onEvent.bind(this),
                this.handledEvents = t,
                this.useGenericHandler = !0,
                this.registerListeners()
            }
            return e.prototype.destroy = function() {
                this.onHandlerDestroying(),
                this.unregisterListeners(),
                this.onHandlerDestroyed()
            }
            ,
            e.prototype.onHandlerDestroying = function() {}
            ,
            e.prototype.onHandlerDestroyed = function() {}
            ,
            e.prototype.isEventHandler = function() {
                return "object" == typeof this.handledEvents && this.handledEvents.length && "function" == typeof this.onEvent
            }
            ,
            e.prototype.registerListeners = function() {
                this.isEventHandler() && this.handledEvents.forEach(function(e) {
                    if (s[e])
                        throw new Error("Forbidden event-name: " + e);
                    this.hls.on(e, this.onEvent)
                }, this)
            }
            ,
            e.prototype.unregisterListeners = function() {
                this.isEventHandler() && this.handledEvents.forEach(function(e) {
                    this.hls.off(e, this.onEvent)
                }, this)
            }
            ,
            e.prototype.onEvent = function(e, t) {
                this.onEventGeneric(e, t)
            }
            ,
            e.prototype.onEventGeneric = function(e, t) {
                try {
                    (function(e, t) {
                        var r = "on" + e.replace("hls", "");
                        if ("function" != typeof this[r])
                            throw new Error("Event " + e + " has no generic handler in this " + this.constructor.name + " class (tried " + r + ")");
                        return this[r].bind(this, t)
                    }
                    ).call(this, e, t).call()
                } catch (t) {
                    i.logger.error("An internal error happened while handling event " + e + '. Error message: "' + t.message + '". Here is a stacktrace:', t),
                    this.hls.trigger(n.default.ERROR, {
                        type: a.ErrorTypes.OTHER_ERROR,
                        details: a.ErrorDetails.INTERNAL_EXCEPTION,
                        fatal: !1,
                        event: e,
                        err: t
                    })
                }
            }
            ,
            e
        }();
        t.default = o
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {}
            return e.isBuffered = function(e, t) {
                try {
                    if (e)
                        for (var r = e.buffered, i = 0; i < r.length; i++)
                            if (t >= r.start(i) && t <= r.end(i))
                                return !0
                } catch (e) {}
                return !1
            }
            ,
            e.bufferInfo = function(e, t, r) {
                try {
                    if (e) {
                        var i = e.buffered
                          , a = []
                          , n = void 0;
                        for (n = 0; n < i.length; n++)
                            a.push({
                                start: i.start(n),
                                end: i.end(n)
                            });
                        return this.bufferedInfo(a, t, r)
                    }
                } catch (e) {}
                return {
                    len: 0,
                    start: t,
                    end: t,
                    nextStart: void 0
                }
            }
            ,
            e.bufferedInfo = function(e, t, r) {
                var i, a, n, s, o, l = [];
                for (e.sort(function(e, t) {
                    return e.start - t.start || t.end - e.end
                }),
                o = 0; o < e.length; o++) {
                    var u = l.length;
                    if (u) {
                        var d = l[u - 1].end;
                        e[o].start - d < r ? e[o].end > d && (l[u - 1].end = e[o].end) : l.push(e[o])
                    } else
                        l.push(e[o])
                }
                for (i = o = 0,
                a = n = t; o < l.length; o++) {
                    var c = l[o].start
                      , h = l[o].end;
                    if (c <= t + r && t < h)
                        a = c,
                        i = (n = h) - t;
                    else if (t + r < c) {
                        s = c;
                        break
                    }
                }
                return {
                    len: i,
                    start: a,
                    end: n,
                    nextStart: s
                }
            }
            ,
            e
        }();
        t.BufferHelper = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.getSelfScope = function() {
            return "undefined" == typeof window ? self : window
        }
    }
    , function(e, o, r) {
        "use strict";
        (function(i) {
            var a, t = this && this.__extends || (a = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                a(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(o, "__esModule", {
                value: !0
            });
            var n = r(4)
              , s = r(1);
            o.FragmentState = {
                NOT_LOADED: "NOT_LOADED",
                APPENDING: "APPENDING",
                PARTIAL: "PARTIAL",
                OK: "OK"
            };
            var e = function(r) {
                function e(e) {
                    var t = r.call(this, e, s.default.BUFFER_APPENDED, s.default.FRAG_BUFFERED, s.default.FRAG_LOADED) || this;
                    return t.bufferPadding = .2,
                    t.fragments = Object.create(null),
                    t.timeRanges = Object.create(null),
                    t.config = e.config,
                    t
                }
                return t(e, r),
                e.prototype.destroy = function() {
                    this.fragments = null,
                    this.timeRanges = null,
                    this.config = null,
                    n.default.prototype.destroy.call(this),
                    r.prototype.destroy.call(this)
                }
                ,
                e.prototype.getBufferedFrag = function(i, a) {
                    var n = this.fragments
                      , e = Object.keys(n).filter(function(e) {
                        var t = n[e];
                        if (t.body.type !== a)
                            return !1;
                        if (!t.buffered)
                            return !1;
                        var r = t.body;
                        return r.startPTS <= i && i <= r.endPTS
                    });
                    if (0 === e.length)
                        return null;
                    var t = e.pop();
                    return n[t].body
                }
                ,
                e.prototype.detectEvictedFragments = function(a, n) {
                    var s, o, l = this;
                    Object.keys(this.fragments).forEach(function(e) {
                        var t = l.fragments[e];
                        if (!0 === t.buffered) {
                            var r = t.range[a];
                            if (r) {
                                s = r.time;
                                for (var i = 0; i < s.length; i++)
                                    if (o = s[i],
                                    !1 === l.isTimeBuffered(o.startPTS, o.endPTS, n)) {
                                        l.removeFragment(t.body);
                                        break
                                    }
                            }
                        }
                    })
                }
                ,
                e.prototype.detectPartialFragments = function(r) {
                    var i = this
                      , e = this.getFragmentKey(r)
                      , a = this.fragments[e];
                    a && (a.buffered = !0,
                    Object.keys(this.timeRanges).forEach(function(e) {
                        if (r.hasElementaryStream(e)) {
                            var t = i.timeRanges[e];
                            a.range[e] = i.getBufferedTimes(r.startPTS, r.endPTS, t)
                        }
                    }))
                }
                ,
                e.prototype.getBufferedTimes = function(e, t, r) {
                    for (var i, a, n = [], s = !1, o = 0; o < r.length; o++) {
                        if (i = r.start(o) - this.bufferPadding,
                        a = r.end(o) + this.bufferPadding,
                        i <= e && t <= a) {
                            n.push({
                                startPTS: Math.max(e, r.start(o)),
                                endPTS: Math.min(t, r.end(o))
                            });
                            break
                        }
                        if (e < a && i < t)
                            n.push({
                                startPTS: Math.max(e, r.start(o)),
                                endPTS: Math.min(t, r.end(o))
                            }),
                            s = !0;
                        else if (t <= i)
                            break
                    }
                    return {
                        time: n,
                        partial: s
                    }
                }
                ,
                e.prototype.getFragmentKey = function(e) {
                    return e.type + "_" + e.level + "_" + e.urlId + "_" + e.sn
                }
                ,
                e.prototype.getPartialFragment = function(r) {
                    var i, a, n, s = this, o = null, l = 0;
                    return Object.keys(this.fragments).forEach(function(e) {
                        var t = s.fragments[e];
                        s.isPartial(t) && (a = t.body.startPTS - s.bufferPadding,
                        n = t.body.endPTS + s.bufferPadding,
                        a <= r && r <= n && (i = Math.min(r - a, n - r),
                        l <= i && (o = t.body,
                        l = i)))
                    }),
                    o
                }
                ,
                e.prototype.getState = function(e) {
                    var t = this.getFragmentKey(e)
                      , r = this.fragments[t]
                      , i = o.FragmentState.NOT_LOADED;
                    return void 0 !== r && (i = r.buffered ? !0 === this.isPartial(r) ? o.FragmentState.PARTIAL : o.FragmentState.OK : o.FragmentState.APPENDING),
                    i
                }
                ,
                e.prototype.isPartial = function(e) {
                    return !0 === e.buffered && (void 0 !== e.range.video && !0 === e.range.video.partial || void 0 !== e.range.audio && !0 === e.range.audio.partial)
                }
                ,
                e.prototype.isTimeBuffered = function(e, t, r) {
                    for (var i, a, n = 0; n < r.length; n++) {
                        if (i = r.start(n) - this.bufferPadding,
                        a = r.end(n) + this.bufferPadding,
                        i <= e && t <= a)
                            return !0;
                        if (t <= i)
                            return !1
                    }
                    return !1
                }
                ,
                e.prototype.onFragLoaded = function(e) {
                    var t = e.frag;
                    i.isFinite(t.sn) && !t.bitrateTest && (this.fragments[this.getFragmentKey(t)] = {
                        body: t,
                        range: Object.create(null),
                        buffered: !1
                    })
                }
                ,
                e.prototype.onBufferAppended = function(e) {
                    var r = this;
                    this.timeRanges = e.timeRanges,
                    Object.keys(this.timeRanges).forEach(function(e) {
                        var t = r.timeRanges[e];
                        r.detectEvictedFragments(e, t)
                    })
                }
                ,
                e.prototype.onFragBuffered = function(e) {
                    this.detectPartialFragments(e.frag)
                }
                ,
                e.prototype.hasFragment = function(e) {
                    var t = this.getFragmentKey(e);
                    return void 0 !== this.fragments[t]
                }
                ,
                e.prototype.removeFragment = function(e) {
                    var t = this.getFragmentKey(e);
                    delete this.fragments[t]
                }
                ,
                e.prototype.removeAllFragments = function() {
                    this.fragments = Object.create(null)
                }
                ,
                e
            }(n.default);
            o.FragmentTracker = e
        }
        ).call(this, r(2).Number)
    }
    , function(e, t, r) {
        var i, d, a, n, c;
        i = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/?#]*)?((?:[^\/\?#]*\/)*.*?)??(;.*?)?(\?.*?)?(#.*?)?$/,
        d = /^([^\/?#]*)(.*)$/,
        a = /(?:\/|^)\.(?=\/)/g,
        n = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g,
        c = {
            buildAbsoluteURL: function(e, t, r) {
                if (r = r || {},
                e = e.trim(),
                !(t = t.trim())) {
                    if (!r.alwaysNormalize)
                        return e;
                    var i = c.parseURL(e);
                    if (!i)
                        throw new Error("Error trying to parse base URL.");
                    return i.path = c.normalizePath(i.path),
                    c.buildURLFromParts(i)
                }
                var a = c.parseURL(t);
                if (!a)
                    throw new Error("Error trying to parse relative URL.");
                if (a.scheme)
                    return r.alwaysNormalize ? (a.path = c.normalizePath(a.path),
                    c.buildURLFromParts(a)) : t;
                var n = c.parseURL(e);
                if (!n)
                    throw new Error("Error trying to parse base URL.");
                if (!n.netLoc && n.path && "/" !== n.path[0]) {
                    var s = d.exec(n.path);
                    n.netLoc = s[1],
                    n.path = s[2]
                }
                n.netLoc && !n.path && (n.path = "/");
                var o = {
                    scheme: n.scheme,
                    netLoc: a.netLoc,
                    path: null,
                    params: a.params,
                    query: a.query,
                    fragment: a.fragment
                };
                if (!a.netLoc && (o.netLoc = n.netLoc,
                "/" !== a.path[0]))
                    if (a.path) {
                        var l = n.path
                          , u = l.substring(0, l.lastIndexOf("/") + 1) + a.path;
                        o.path = c.normalizePath(u)
                    } else
                        o.path = n.path,
                        a.params || (o.params = n.params,
                        a.query || (o.query = n.query));
                return null === o.path && (o.path = r.alwaysNormalize ? c.normalizePath(a.path) : a.path),
                c.buildURLFromParts(o)
            },
            parseURL: function(e) {
                var t = i.exec(e);
                return t ? {
                    scheme: t[1] || "",
                    netLoc: t[2] || "",
                    path: t[3] || "",
                    params: t[4] || "",
                    query: t[5] || "",
                    fragment: t[6] || ""
                } : null
            },
            normalizePath: function(e) {
                for (e = e.split("").reverse().join("").replace(a, ""); e.length !== (e = e.replace(n, "")).length; )
                    ;
                return e.split("").reverse().join("")
            },
            buildURLFromParts: function(e) {
                return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment
            }
        },
        e.exports = c
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = {
            search: function(e, t) {
                for (var r = 0, i = e.length - 1, a = null, n = null; r <= i; ) {
                    var s = t(n = e[a = (r + i) / 2 | 0]);
                    if (0 < s)
                        r = a + 1;
                    else {
                        if (!(s < 0))
                            return n;
                        i = a - 1
                    }
                }
                return null
            }
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function o() {}
            return o.isHeader = function(e, t) {
                return t + 10 <= e.length && 73 === e[t] && 68 === e[t + 1] && 51 === e[t + 2] && e[t + 3] < 255 && e[t + 4] < 255 && e[t + 6] < 128 && e[t + 7] < 128 && e[t + 8] < 128 && e[t + 9] < 128
            }
            ,
            o.isFooter = function(e, t) {
                return t + 10 <= e.length && 51 === e[t] && 68 === e[t + 1] && 73 === e[t + 2] && e[t + 3] < 255 && e[t + 4] < 255 && e[t + 6] < 128 && e[t + 7] < 128 && e[t + 8] < 128 && e[t + 9] < 128
            }
            ,
            o.getID3Data = function(e, t) {
                for (var r = t, i = 0; o.isHeader(e, t); )
                    i += 10,
                    i += o._readSize(e, t + 6),
                    o.isFooter(e, t + 10) && (i += 10),
                    t += i;
                if (0 < i)
                    return e.subarray(r, r + i)
            }
            ,
            o._readSize = function(e, t) {
                var r = 0;
                return r = (127 & e[t]) << 21,
                r |= (127 & e[t + 1]) << 14,
                (r |= (127 & e[t + 2]) << 7) | 127 & e[t + 3]
            }
            ,
            o.getTimeStamp = function(e) {
                for (var t = o.getID3Frames(e), r = 0; r < t.length; r++) {
                    var i = t[r];
                    if (o.isTimeStampFrame(i))
                        return o._readTimeStamp(i)
                }
            }
            ,
            o.isTimeStampFrame = function(e) {
                return e && "PRIV" === e.key && "com.apple.streaming.transportStreamTimestamp" === e.info
            }
            ,
            o._getFrameData = function(e) {
                var t = String.fromCharCode(e[0], e[1], e[2], e[3])
                  , r = o._readSize(e, 4);
                return {
                    type: t,
                    size: r,
                    data: e.subarray(10, 10 + r)
                }
            }
            ,
            o.getID3Frames = function(e) {
                for (var t = 0, r = []; o.isHeader(e, t); ) {
                    for (var i = o._readSize(e, t + 6), a = (t += 10) + i; t + 8 < a; ) {
                        var n = o._getFrameData(e.subarray(t))
                          , s = o._decodeFrame(n);
                        s && r.push(s),
                        t += n.size + 10
                    }
                    o.isFooter(e, t) && (t += 10)
                }
                return r
            }
            ,
            o._decodeFrame = function(e) {
                return "PRIV" === e.type ? o._decodePrivFrame(e) : "T" === e.type[0] ? o._decodeTextFrame(e) : "W" === e.type[0] ? o._decodeURLFrame(e) : void 0
            }
            ,
            o._readTimeStamp = function(e) {
                if (8 === e.data.byteLength) {
                    var t = new Uint8Array(e.data)
                      , r = 1 & t[3]
                      , i = (t[4] << 23) + (t[5] << 15) + (t[6] << 7) + t[7];
                    return i /= 45,
                    r && (i += 47721858.84),
                    Math.round(i)
                }
            }
            ,
            o._decodePrivFrame = function(e) {
                if (!(e.size < 2)) {
                    var t = o._utf8ArrayToStr(e.data, !0)
                      , r = new Uint8Array(e.data.subarray(t.length + 1));
                    return {
                        key: e.type,
                        info: t,
                        data: r.buffer
                    }
                }
            }
            ,
            o._decodeTextFrame = function(e) {
                if (!(e.size < 2)) {
                    if ("TXXX" === e.type) {
                        var t = 1
                          , r = o._utf8ArrayToStr(e.data.subarray(t));
                        t += r.length + 1;
                        var i = o._utf8ArrayToStr(e.data.subarray(t));
                        return {
                            key: e.type,
                            info: r,
                            data: i
                        }
                    }
                    var a = o._utf8ArrayToStr(e.data.subarray(1));
                    return {
                        key: e.type,
                        data: a
                    }
                }
            }
            ,
            o._decodeURLFrame = function(e) {
                if ("WXXX" === e.type) {
                    if (e.size < 2)
                        return;
                    var t = 1
                      , r = o._utf8ArrayToStr(e.data.subarray(t));
                    t += r.length + 1;
                    var i = o._utf8ArrayToStr(e.data.subarray(t));
                    return {
                        key: e.type,
                        info: r,
                        data: i
                    }
                }
                var a = o._utf8ArrayToStr(e.data);
                return {
                    key: e.type,
                    data: a
                }
            }
            ,
            o._utf8ArrayToStr = function(e, t) {
                void 0 === t && (t = !1);
                for (var r, i, a, n = e.length, s = "", o = 0; o < n; ) {
                    if (0 === (r = e[o++]) && t)
                        return s;
                    if (0 !== r && 3 !== r)
                        switch (r >> 4) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                            s += String.fromCharCode(r);
                            break;
                        case 12:
                        case 13:
                            i = e[o++],
                            s += String.fromCharCode((31 & r) << 6 | 63 & i);
                            break;
                        case 14:
                            i = e[o++],
                            a = e[o++],
                            s += String.fromCharCode((15 & r) << 12 | (63 & i) << 6 | (63 & a) << 0)
                        }
                }
                return s
            }
            ,
            o
        }()
          , a = i._utf8ArrayToStr;
        t.utf8ArrayToStr = a,
        t.default = i
    }
    , function(e, a, n) {
        "use strict";
        (function(r) {
            Object.defineProperty(a, "__esModule", {
                value: !0
            });
            var e = n(8)
              , i = n(18)
              , t = function() {
                function t() {
                    var e;
                    this._url = null,
                    this._byteRange = null,
                    this._decryptdata = null,
                    this.tagList = [],
                    this.programDateTime = null,
                    this.rawProgramDateTime = null,
                    this._elementaryStreams = ((e = {})[t.ElementaryStreamTypes.AUDIO] = !1,
                    e[t.ElementaryStreamTypes.VIDEO] = !1,
                    e)
                }
                return Object.defineProperty(t, "ElementaryStreamTypes", {
                    get: function() {
                        return {
                            AUDIO: "audio",
                            VIDEO: "video"
                        }
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "url", {
                    get: function() {
                        return !this._url && this.relurl && (this._url = e.buildAbsoluteURL(this.baseurl, this.relurl, {
                            alwaysNormalize: !0
                        })),
                        this._url
                    },
                    set: function(e) {
                        this._url = e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "byteRange", {
                    get: function() {
                        if (!this._byteRange && !this.rawByteRange)
                            return [];
                        if (this._byteRange)
                            return this._byteRange;
                        var e = [];
                        if (this.rawByteRange) {
                            var t = this.rawByteRange.split("@", 2);
                            if (1 === t.length) {
                                var r = this.lastByteRangeEndOffset;
                                e[0] = r || 0
                            } else
                                e[0] = parseInt(t[1]);
                            e[1] = parseInt(t[0]) + e[0],
                            this._byteRange = e
                        }
                        return e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "byteRangeStartOffset", {
                    get: function() {
                        return this.byteRange[0]
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "byteRangeEndOffset", {
                    get: function() {
                        return this.byteRange[1]
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "decryptdata", {
                    get: function() {
                        return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)),
                        this._decryptdata
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "endProgramDateTime", {
                    get: function() {
                        if (!r.isFinite(this.programDateTime))
                            return null;
                        var e = r.isFinite(this.duration) ? this.duration : 0;
                        return this.programDateTime + 1e3 * e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(t.prototype, "encrypted", {
                    get: function() {
                        return !(!this.decryptdata || null === this.decryptdata.uri || null !== this.decryptdata.key)
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                t.prototype.addElementaryStream = function(e) {
                    this._elementaryStreams[e] = !0
                }
                ,
                t.prototype.hasElementaryStream = function(e) {
                    return !0 === this._elementaryStreams[e]
                }
                ,
                t.prototype.createInitializationVector = function(e) {
                    for (var t = new Uint8Array(16), r = 12; r < 16; r++)
                        t[r] = e >> 8 * (15 - r) & 255;
                    return t
                }
                ,
                t.prototype.fragmentDecryptdataFromLevelkey = function(e, t) {
                    var r = e;
                    return e && e.method && e.uri && !e.iv && ((r = new i.default).method = e.method,
                    r.baseuri = e.baseuri,
                    r.reluri = e.reluri,
                    r.iv = this.createInitializationVector(t)),
                    r
                }
                ,
                t
            }();
            a.default = t
        }
        ).call(this, n(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(3)
          , s = r(0)
          , o = r(1)
          , l = r(6).getSelfScope()
          , u = r(39)
          , i = r(40)
          , d = i.base64ToArrayBuffer
          , c = i.arrayBufferToBase64
          , h = i.dec
          , a = (i.eeb64,
        i.bu,
        i.base64decode,
        i.MD5,
        function() {
            function e(e, t, r) {
                var i = (void 0 === r ? {} : r).removePKCS7Padding
                  , a = void 0 === i || i;
                if (this.logEnabled = !0,
                this.observer = e,
                this.config = t,
                this.removePKCS7Padding = a)
                    try {
                        var n = l.crypto;
                        n && (this.subtle = n.subtle || n.webkitSubtle)
                    } catch (e) {}
                this.disableWebCrypto = !this.subtle
            }
            return e.prototype.isSync = function() {
                return this.disableWebCrypto && this.config.enableSoftwareAES
            }
            ,
            e.prototype.decrypt = function(e, t, r, i, a, n) {
                var s = parseInt(n.match(/(\d*)\.ts$/)[0].replace(".ts", ""));
                if ("0" == a.part || "1" == a.part && 30 <= s && s % 6 == 0) {
                    var o = {
                        mode: u.mode.ECB,
                        padding: u.pad.Pkcs7
                    };
                    t = u.lib.WordArray.create(new Uint8Array(t)).toString(u.enc.Utf8),
                    t = h(t, a._lid.replace(/_\d*/, "")),
                    t = u.enc.Utf8.parse(t),
                    e = u.AES.decrypt(c(e), t, o),
                    e = d(e.toString(u.enc.Base64))
                }
                i(e)
            }
            ,
            e.prototype.onWebCryptoError = function(e, t, r, i, a) {
                this.config.enableSoftwareAES ? (s.logger.log("WebCrypto Error, disable WebCrypto API"),
                this.disableWebCrypto = !0,
                this.logEnabled = !0,
                this.decrypt(t, r, i, a)) : (s.logger.error("decrypting error : " + e.message),
                this.observer.trigger(o.default.ERROR, {
                    type: n.ErrorTypes.MEDIA_ERROR,
                    details: n.ErrorDetails.FRAG_DECRYPT_ERROR,
                    fatal: !0,
                    reason: e.message
                }))
            }
            ,
            e.prototype.destroy = function() {
                var e = this.decryptor;
                e && (e.destroy(),
                this.decryptor = void 0)
            }
            ,
            e
        }());
        t.default = a
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.getMediaSource = function() {
            if ("undefined" != typeof window)
                return window.MediaSource || window.WebKitMediaSource
        }
    }
    , function(e, t, r) {
        "use strict";
        (function(f) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var p = r(0);
            function g(e, t, r) {
                var i = e[t]
                  , a = e[r]
                  , n = a.startPTS;
                f.isFinite(n) ? t < r ? (i.duration = n - i.start,
                i.duration < 0 && p.logger.warn("negative duration computed for frag " + i.sn + ",level " + i.level + ", there should be some duration drift between playlist and fragment!")) : (a.duration = i.start - n,
                a.duration < 0 && p.logger.warn("negative duration computed for frag " + a.sn + ",level " + a.level + ", there should be some duration drift between playlist and fragment!")) : a.start = t < r ? i.start + i.duration : Math.max(i.start - a.duration, 0)
            }
            function v(e, t, r, i, a, n) {
                var s = r;
                if (f.isFinite(t.startPTS)) {
                    var o = Math.abs(t.startPTS - r);
                    f.isFinite(t.deltaPTS) ? t.deltaPTS = Math.max(o, t.deltaPTS) : t.deltaPTS = o,
                    s = Math.max(r, t.startPTS),
                    r = Math.min(r, t.startPTS),
                    i = Math.max(i, t.endPTS),
                    a = Math.min(a, t.startDTS),
                    n = Math.max(n, t.endDTS)
                }
                var l = r - t.start;
                t.start = t.startPTS = r,
                t.maxStartPTS = s,
                t.endPTS = i,
                t.startDTS = a,
                t.endDTS = n,
                t.duration = i - r;
                var u, d, c, h = t.sn;
                if (!e || h < e.startSN || h > e.endSN)
                    return 0;
                for (u = h - e.startSN,
                (d = e.fragments)[u] = t,
                c = u; 0 < c; c--)
                    g(d, c, c - 1);
                for (c = u; c < d.length - 1; c++)
                    g(d, c, c + 1);
                return e.PTSKnown = !0,
                l
            }
            t.addGroupId = function(e, t, r) {
                switch (t) {
                case "audio":
                    e.audioGroupIds || (e.audioGroupIds = []),
                    e.audioGroupIds.push(r);
                    break;
                case "text":
                    e.textGroupIds || (e.textGroupIds = []),
                    e.textGroupIds.push(r)
                }
            }
            ,
            t.updatePTS = g,
            t.updateFragPTSDTS = v,
            t.mergeDetails = function(e, t) {
                var r, i = Math.max(e.startSN, t.startSN) - t.startSN, a = Math.min(e.endSN, t.endSN) - t.startSN, n = t.startSN - e.startSN, s = e.fragments, o = t.fragments, l = 0;
                if (t.initSegment && e.initSegment && (t.initSegment = e.initSegment),
                a < i)
                    t.PTSKnown = !1;
                else {
                    for (var u = i; u <= a; u++) {
                        var d = s[n + u]
                          , c = o[u];
                        c && d && (l = d.cc - c.cc,
                        f.isFinite(d.startPTS) && (c.start = c.startPTS = d.startPTS,
                        c.endPTS = d.endPTS,
                        c.duration = d.duration,
                        c.backtracked = d.backtracked,
                        c.dropped = d.dropped,
                        r = c))
                    }
                    if (l)
                        for (p.logger.log("discontinuity sliding from playlist, take drift into account"),
                        u = 0; u < o.length; u++)
                            o[u].cc += l;
                    if (r)
                        v(t, r, r.startPTS, r.endPTS, r.startDTS, r.endDTS);
                    else if (0 <= n && n < s.length) {
                        var h = s[n].start;
                        for (u = 0; u < o.length; u++)
                            o[u].start += h
                    }
                    t.PTSKnown = e.PTSKnown
                }
            }
        }
        ).call(this, r(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        var i, n = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var a = function(a) {
            function e(e) {
                for (var t = [], r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                var i = a.apply(this, [e].concat(t)) || this;
                return i._tickInterval = null,
                i._tickTimer = null,
                i._tickCallCount = 0,
                i._boundTick = i.tick.bind(i),
                i
            }
            return n(e, a),
            e.prototype.onHandlerDestroying = function() {
                this.clearNextTick(),
                this.clearInterval()
            }
            ,
            e.prototype.hasInterval = function() {
                return !!this._tickInterval
            }
            ,
            e.prototype.hasNextTick = function() {
                return !!this._tickTimer
            }
            ,
            e.prototype.setInterval = function(e) {
                return !this._tickInterval && (this._tickInterval = setInterval(this._boundTick, e),
                !0)
            }
            ,
            e.prototype.clearInterval = function() {
                return !!this._tickInterval && (clearInterval(this._tickInterval),
                !(this._tickInterval = null))
            }
            ,
            e.prototype.clearNextTick = function() {
                return !!this._tickTimer && (clearTimeout(this._tickTimer),
                !(this._tickTimer = null))
            }
            ,
            e.prototype.tick = function() {
                this._tickCallCount++,
                1 === this._tickCallCount && (this.doTick(),
                1 < this._tickCallCount && (this.clearNextTick(),
                this._tickTimer = setTimeout(this._boundTick, 0)),
                this._tickCallCount = 0)
            }
            ,
            e.prototype.doTick = function() {}
            ,
            e
        }(r(4).default);
        t.default = a
    }
    , function(e, n, o) {
        "use strict";
        (function(v) {
            var i, e = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(n, "__esModule", {
                value: !0
            });
            var m = o(1)
              , t = o(4)
              , l = o(3)
              , h = o(0)
              , s = o(17)
              , y = o(32)
              , _ = window.performance
              , E = {
                MANIFEST: "manifest",
                LEVEL: "level",
                AUDIO_TRACK: "audioTrack",
                SUBTITLE_TRACK: "subtitleTrack"
            }
              , a = {
                MAIN: "main",
                AUDIO: "audio",
                SUBTITLE: "subtitle"
            }
              , r = function(r) {
                function g(e) {
                    var t = r.call(this, e, m.default.MANIFEST_LOADING, m.default.LEVEL_LOADING, m.default.AUDIO_TRACK_LOADING, m.default.SUBTITLE_TRACK_LOADING) || this;
                    return t.loaders = {},
                    t
                }
                return e(g, r),
                Object.defineProperty(g, "ContextType", {
                    get: function() {
                        return E
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(g, "LevelType", {
                    get: function() {
                        return a
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                g.canHaveQualityLevels = function(e) {
                    return e !== E.AUDIO_TRACK && e !== E.SUBTITLE_TRACK
                }
                ,
                g.mapContextToLevelType = function(e) {
                    switch (e.type) {
                    case E.AUDIO_TRACK:
                        return a.AUDIO;
                    case E.SUBTITLE_TRACK:
                        return a.SUBTITLE;
                    default:
                        return a.MAIN
                    }
                }
                ,
                g.getResponseUrl = function(e, t) {
                    var r = e.url;
                    return void 0 !== r && 0 !== r.indexOf("data:") || (r = t.url),
                    r
                }
                ,
                g.prototype.createInternalLoader = function(e) {
                    var t = this.hls.config
                      , r = t.pLoader
                      , i = t.loader
                      , a = new (r || i)(t);
                    return e.loader = a,
                    this.loaders[e.type] = a
                }
                ,
                g.prototype.getInternalLoader = function(e) {
                    return this.loaders[e.type]
                }
                ,
                g.prototype.resetInternalLoader = function(e) {
                    this.loaders[e] && delete this.loaders[e]
                }
                ,
                g.prototype.destroyInternalLoaders = function() {
                    for (var e in this.loaders) {
                        var t = this.loaders[e];
                        t && t.destroy(),
                        this.resetInternalLoader(e)
                    }
                }
                ,
                g.prototype.destroy = function() {
                    this.destroyInternalLoaders(),
                    r.prototype.destroy.call(this)
                }
                ,
                g.prototype.onManifestLoading = function(e) {
                    this.load(e.url, {
                        type: E.MANIFEST,
                        level: 0,
                        id: null
                    })
                }
                ,
                g.prototype.onLevelLoading = function(e) {
                    this.load(e.url, {
                        type: E.LEVEL,
                        level: e.level,
                        id: e.id
                    })
                }
                ,
                g.prototype.onAudioTrackLoading = function(e) {
                    this.load(e.url, {
                        type: E.AUDIO_TRACK,
                        level: null,
                        id: e.id
                    })
                }
                ,
                g.prototype.onSubtitleTrackLoading = function(e) {
                    this.load(e.url, {
                        type: E.SUBTITLE_TRACK,
                        level: null,
                        id: e.id
                    })
                }
                ,
                g.prototype.load = function(e, t) {
                    var r = this.hls.config;
                    h.logger.debug("Loading playlist of type " + t.type + ", level: " + t.level + ", id: " + t.id);
                    var i, a, n, s, o = this.getInternalLoader(t);
                    if (o) {
                        var l = o.context;
                        if (l && l.url === e)
                            return h.logger.trace("playlist request ongoing"),
                            !1;
                        h.logger.warn("aborting previous loader for type: " + t.type),
                        o.abort()
                    }
                    switch (t.type) {
                    case E.MANIFEST:
                        i = r.manifestLoadingMaxRetry,
                        a = r.manifestLoadingTimeOut,
                        n = r.manifestLoadingRetryDelay,
                        s = r.manifestLoadingMaxRetryTimeout;
                        break;
                    case E.LEVEL:
                        i = 0,
                        a = r.levelLoadingTimeOut;
                        break;
                    default:
                        i = r.levelLoadingMaxRetry,
                        a = r.levelLoadingTimeOut,
                        n = r.levelLoadingRetryDelay,
                        s = r.levelLoadingMaxRetryTimeout
                    }
                    o = this.createInternalLoader(t),
                    t.url = e,
                    t.responseType = t.responseType || "";
                    var u = {
                        timeout: a,
                        maxRetry: i,
                        retryDelay: n,
                        maxRetryDelay: s
                    }
                      , d = {
                        onSuccess: this.loadsuccess.bind(this),
                        onError: this.loaderror.bind(this),
                        onTimeout: this.loadtimeout.bind(this)
                    };
                    return h.logger.debug("Calling internal loader delegate for URL: " + e),
                    o.load(t, u, d),
                    !0
                }
                ,
                g.prototype.loadsuccess = function(e, t, r, i) {
                    if (void 0 === i && (i = null),
                    r.isSidxRequest)
                        return this._handleSidxRequest(e, r),
                        void this._handlePlaylistLoaded(e, t, r, i);
                    this.resetInternalLoader(r.type);
                    var a = e.data;
                    t.tload = _.now(),
                    0 === a.indexOf("#EXTM3U") ? 0 < a.indexOf("#EXTINF:") || 0 < a.indexOf("#EXT-X-TARGETDURATION:") ? this._handleTrackOrLevelPlaylist(e, t, r, i) : this._handleMasterPlaylist(e, t, r, i) : this._handleManifestParsingError(e, r, "no EXTM3U delimiter", i)
                }
                ,
                g.prototype.loaderror = function(e, t, r) {
                    void 0 === r && (r = null),
                    this._handleNetworkError(t, r, !1, e)
                }
                ,
                g.prototype.loadtimeout = function(e, t, r) {
                    void 0 === r && (r = null),
                    this._handleNetworkError(t, r, !0)
                }
                ,
                g.prototype._handleMasterPlaylist = function(e, t, r, i) {
                    var a = this.hls
                      , n = e.data
                      , s = g.getResponseUrl(e, r)
                      , o = y.default.parseMasterPlaylist(n, s);
                    if (o.length) {
                        var l = o.map(function(e) {
                            return {
                                id: e.attrs.AUDIO,
                                codec: e.audioCodec
                            }
                        })
                          , u = y.default.parseMasterPlaylistMedia(n, s, "AUDIO", l)
                          , d = y.default.parseMasterPlaylistMedia(n, s, "SUBTITLES");
                        if (u.length) {
                            var c = !1;
                            u.forEach(function(e) {
                                e.url || (c = !0)
                            }),
                            !1 === c && o[0].audioCodec && !o[0].attrs.AUDIO && (h.logger.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"),
                            u.unshift({
                                type: "main",
                                name: "main"
                            }))
                        }
                        a.trigger(m.default.MANIFEST_LOADED, {
                            levels: o,
                            audioTracks: u,
                            subtitles: d,
                            url: s,
                            stats: t,
                            networkDetails: i
                        })
                    } else
                        this._handleManifestParsingError(e, r, "no level found in manifest", i)
                }
                ,
                g.prototype._handleTrackOrLevelPlaylist = function(e, t, r, i) {
                    var a = this.hls
                      , n = r.id
                      , s = r.level
                      , o = r.type
                      , l = g.getResponseUrl(e, r)
                      , u = v.isFinite(n) ? n : 0
                      , d = v.isFinite(s) ? s : u
                      , c = g.mapContextToLevelType(r)
                      , h = y.default.parseLevelPlaylist(e.data, l, d, c, u);
                    if (h.tload = t.tload,
                    o === E.MANIFEST) {
                        var f = {
                            url: l,
                            details: h
                        };
                        a.trigger(m.default.MANIFEST_LOADED, {
                            levels: [f],
                            audioTracks: [],
                            url: l,
                            stats: t,
                            networkDetails: i
                        })
                    }
                    if (t.tparsed = _.now(),
                    h.needSidxRanges) {
                        var p = h.initSegment.url;
                        return this.load(p, {
                            isSidxRequest: !0,
                            type: o,
                            level: s,
                            levelDetails: h,
                            id: n,
                            rangeStart: 0,
                            rangeEnd: 2048,
                            responseType: "arraybuffer"
                        }),
                        void a.trigger(m.default.FOUND_SIDX, {
                            url: p,
                            reason: "playlist-loader.js --- _handleTrackOrLevelPlaylistneed --- sidxUrl请求: 加载碎片的时候contentisSidxRequest置为true"
                        })
                    }
                    r.levelDetails = h,
                    this._handlePlaylistLoaded(e, t, r, i)
                }
                ,
                g.prototype._handleSidxRequest = function(e, t) {
                    var a = this
                      , r = s.default.parseSegmentIndex(new Uint8Array(e.data));
                    if (r) {
                        var i = r.references
                          , n = t.levelDetails;
                        i.forEach(function(e, t) {
                            var r = e.info
                              , i = n.fragments[t];
                            0 === i.byteRange.length && (i.rawByteRange = String(1 + r.end - r.start) + "@" + String(r.start),
                            a.hls.trigger(m.default.SET_SIDX_FRAG_RANGE_ONE, {
                                reason: i.rawByteRange
                            }))
                        }),
                        n.initSegment.rawByteRange = String(r.moovEndOffset) + "@0",
                        this.hls.trigger(m.default.SET_SIDX_FRAG_RANGE_TWO, {
                            reason: n.initSegment.rawByteRange
                        })
                    }
                }
                ,
                g.prototype._handleManifestParsingError = function(e, t, r, i) {
                    this.hls.trigger(m.default.ERROR, {
                        type: l.ErrorTypes.NETWORK_ERROR,
                        details: l.ErrorDetails.MANIFEST_PARSING_ERROR,
                        fatal: !0,
                        url: e.url,
                        reason: r,
                        networkDetails: i
                    })
                }
                ,
                g.prototype._handleNetworkError = function(e, t, r, i) {
                    var a, n;
                    void 0 === r && (r = !1),
                    void 0 === i && (i = null),
                    h.logger.info("A network error occured while loading a " + e.type + "-type playlist");
                    var s = this.getInternalLoader(e);
                    switch (e.type) {
                    case E.MANIFEST:
                        a = r ? l.ErrorDetails.MANIFEST_LOAD_TIMEOUT : l.ErrorDetails.MANIFEST_LOAD_ERROR,
                        n = !0;
                        break;
                    case E.LEVEL:
                        a = r ? l.ErrorDetails.LEVEL_LOAD_TIMEOUT : l.ErrorDetails.LEVEL_LOAD_ERROR,
                        n = !1;
                        break;
                    case E.AUDIO_TRACK:
                        a = r ? l.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT : l.ErrorDetails.AUDIO_TRACK_LOAD_ERROR,
                        n = !1;
                        break;
                    default:
                        n = !1
                    }
                    s && (s.abort(),
                    this.resetInternalLoader(e.type));
                    var o = {
                        type: l.ErrorTypes.NETWORK_ERROR,
                        details: a,
                        fatal: n,
                        url: s.url,
                        loader: s,
                        context: e,
                        networkDetails: t
                    };
                    i && (o.response = i),
                    this.hls.trigger(m.default.ERROR, o)
                }
                ,
                g.prototype._handlePlaylistLoaded = function(e, t, r, i) {
                    var a = r.type
                      , n = r.level
                      , s = r.id
                      , o = r.levelDetails;
                    if (o.targetduration)
                        if (g.canHaveQualityLevels(r.type))
                            this.hls.trigger(m.default.LEVEL_LOADED, {
                                details: o,
                                level: n || 0,
                                id: s || 0,
                                stats: t,
                                networkDetails: i
                            });
                        else
                            switch (a) {
                            case E.AUDIO_TRACK:
                                this.hls.trigger(m.default.AUDIO_TRACK_LOADED, {
                                    details: o,
                                    id: s,
                                    stats: t,
                                    networkDetails: i
                                });
                                break;
                            case E.SUBTITLE_TRACK:
                                this.hls.trigger(m.default.SUBTITLE_TRACK_LOADED, {
                                    details: o,
                                    id: s,
                                    stats: t,
                                    networkDetails: i
                                })
                            }
                    else
                        this._handleManifestParsingError(e, r, "invalid target duration", i)
                }
                ,
                g
            }(t.default);
            n.default = r
        }
        ).call(this, o(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var h = r(0)
          , l = r(1)
          , o = Math.pow(2, 32) - 1
          , i = function() {
            function g(e, t) {
                this.observer = e,
                this.remuxer = t
            }
            return g.prototype.resetTimeStamp = function(e) {
                this.initPTS = e
            }
            ,
            g.prototype.resetInitSegment = function(e, t, r, i) {
                if (e && e.byteLength) {
                    var a = this.initData = g.parseInitSegment(e);
                    null == t && (t = "mp4a.40.5"),
                    null == r && (r = "avc1.42e01e");
                    var n = {};
                    a.audio && a.video ? n.audiovideo = {
                        container: "video/mp4",
                        codec: t + "," + r,
                        initSegment: i ? e : null
                    } : (a.audio && (n.audio = {
                        container: "audio/mp4",
                        codec: t,
                        initSegment: i ? e : null
                    }),
                    a.video && (n.video = {
                        container: "video/mp4",
                        codec: r,
                        initSegment: i ? e : null
                    })),
                    this.observer.trigger(l.default.FRAG_PARSING_INIT_SEGMENT, {
                        tracks: n
                    })
                } else
                    t && (this.audioCodec = t),
                    r && (this.videoCodec = r)
            }
            ,
            g.probe = function(e) {
                return 0 < g.findBox({
                    data: e,
                    start: 0,
                    end: Math.min(e.length, 16384)
                }, ["moof"]).length
            }
            ,
            g.bin2str = function(e) {
                return String.fromCharCode.apply(null, e)
            }
            ,
            g.readUint16 = function(e, t) {
                e.data && (t += e.start,
                e = e.data);
                var r = e[t] << 8 | e[t + 1];
                return r < 0 ? 65536 + r : r
            }
            ,
            g.readUint32 = function(e, t) {
                e.data && (t += e.start,
                e = e.data);
                var r = e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
                return r < 0 ? 4294967296 + r : r
            }
            ,
            g.writeUint32 = function(e, t, r) {
                e.data && (t += e.start,
                e = e.data),
                e[t] = r >> 24,
                e[t + 1] = r >> 16 & 255,
                e[t + 2] = r >> 8 & 255,
                e[t + 3] = 255 & r
            }
            ,
            g.findBox = function(e, t) {
                var r, i, a, n, s, o, l = [];
                if (e.data ? (s = e.start,
                a = e.end,
                e = e.data) : (s = 0,
                a = e.byteLength),
                !t.length)
                    return null;
                for (r = s; r < a; )
                    o = 1 < (i = g.readUint32(e, r)) ? r + i : a,
                    g.bin2str(e.subarray(r + 4, r + 8)) === t[0] && (1 === t.length ? l.push({
                        data: e,
                        start: r + 8,
                        end: o
                    }) : (n = g.findBox({
                        data: e,
                        start: r + 8,
                        end: o
                    }, t.slice(1))).length && (l = l.concat(n))),
                    r = o;
                return l
            }
            ,
            g.parseSegmentIndex = function(e) {
                var t, r = g.findBox(e, ["moov"])[0], i = r ? r.end : null, a = 0, n = g.findBox(e, ["sidx"]);
                if (!n || !n[0])
                    return null;
                t = [];
                var s = (n = n[0]).data[0]
                  , o = g.readUint32(n, a = 0 === s ? 8 : 16);
                a += 4,
                a += 0 === s ? 8 : 16,
                a += 2;
                var l = n.end + 0
                  , u = g.readUint16(n, a);
                a += 2;
                for (var d = 0; d < u; d++) {
                    var c = a
                      , h = g.readUint32(n, c);
                    c += 4;
                    var f = 2147483647 & h;
                    if (1 == (2147483648 & h) >>> 31)
                        return void console.warn("SIDX has hierarchical references (not supported)");
                    var p = g.readUint32(n, c);
                    c += 4,
                    t.push({
                        referenceSize: f,
                        subsegmentDuration: p,
                        info: {
                            duration: p / o,
                            start: l,
                            end: l + f - 1
                        }
                    }),
                    l += f,
                    a = c += 4
                }
                return {
                    earliestPresentationTime: 0,
                    timescale: o,
                    version: s,
                    referencesCount: u,
                    references: t,
                    moovEndOffset: i
                }
            }
            ,
            g.parseInitSegment = function(e) {
                var c = [];
                return g.findBox(e, ["moov", "trak"]).forEach(function(e) {
                    var t = g.findBox(e, ["tkhd"])[0];
                    if (t) {
                        var r = t.data[t.start]
                          , i = 0 === r ? 12 : 20
                          , a = g.readUint32(t, i)
                          , n = g.findBox(e, ["mdia", "mdhd"])[0];
                        if (n) {
                            i = 0 === (r = n.data[n.start]) ? 12 : 20;
                            var s = g.readUint32(n, i)
                              , o = g.findBox(e, ["mdia", "hdlr"])[0];
                            if (o) {
                                var l = {
                                    soun: "audio",
                                    vide: "video"
                                }[g.bin2str(o.data.subarray(o.start + 8, o.start + 12))];
                                if (l) {
                                    var u = g.findBox(e, ["mdia", "minf", "stbl", "stsd"]);
                                    if (u.length) {
                                        u = u[0];
                                        var d = g.bin2str(u.data.subarray(u.start + 12, u.start + 16));
                                        h.logger.log("MP4Demuxer:" + l + ":" + d + " found")
                                    }
                                    c[a] = {
                                        timescale: s,
                                        type: l
                                    },
                                    c[l] = {
                                        timescale: s,
                                        id: a
                                    }
                                }
                            }
                        }
                    }
                }),
                c
            }
            ,
            g.getStartDTS = function(a, e) {
                var t, r, i;
                return t = g.findBox(e, ["moof", "traf"]),
                r = [].concat.apply([], t.map(function(i) {
                    return g.findBox(i, ["tfhd"]).map(function(e) {
                        var t, r;
                        return t = g.readUint32(e, 4),
                        r = a[t].timescale || 9e4,
                        g.findBox(i, ["tfdt"]).map(function(e) {
                            var t, r;
                            return t = e.data[e.start],
                            r = g.readUint32(e, 4),
                            1 === t && (r *= Math.pow(2, 32),
                            r += g.readUint32(e, 8)),
                            r
                        })[0] / r
                    })
                })),
                i = Math.min.apply(null, r),
                isFinite(i) ? i : 0
            }
            ,
            g.offsetStartDTS = function(i, e, s) {
                g.findBox(e, ["moof", "traf"]).map(function(r) {
                    return g.findBox(r, ["tfhd"]).map(function(e) {
                        var t = g.readUint32(e, 4)
                          , n = i[t].timescale || 9e4;
                        g.findBox(r, ["tfdt"]).map(function(e) {
                            var t = e.data[e.start]
                              , r = g.readUint32(e, 4);
                            if (0 === t)
                                g.writeUint32(e, 4, r - s * n);
                            else {
                                r *= Math.pow(2, 32),
                                r += g.readUint32(e, 8),
                                r -= s * n,
                                r = Math.max(r, 0);
                                var i = Math.floor(r / (1 + o))
                                  , a = Math.floor(r % (1 + o));
                                g.writeUint32(e, 4, i),
                                g.writeUint32(e, 8, a)
                            }
                        })
                    })
                })
            }
            ,
            g.prototype.append = function(e, t, r, i) {
                var a = this.initData;
                a || (this.resetInitSegment(e, this.audioCodec, this.videoCodec, !1),
                a = this.initData);
                var n, s = this.initPTS;
                if (void 0 === s) {
                    var o = g.getStartDTS(a, e);
                    this.initPTS = s = o - t,
                    this.observer.trigger(l.default.INIT_PTS_FOUND, {
                        initPTS: s
                    })
                }
                g.offsetStartDTS(a, e, s),
                n = g.getStartDTS(a, e),
                this.remuxer.remux(a.audio, a.video, null, null, n, r, i, e)
            }
            ,
            g.prototype.destroy = function() {}
            ,
            g
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(8)
          , a = function() {
            function e() {
                this.method = null,
                this.key = null,
                this.iv = null,
                this._uri = null
            }
            return Object.defineProperty(e.prototype, "uri", {
                get: function() {
                    return !this._uri && this.reluri && (this._uri = i.buildAbsoluteURL(this.baseuri, this.reluri, {
                        alwaysNormalize: !0
                    })),
                    this._uri
                },
                enumerable: !0,
                configurable: !0
            }),
            e
        }();
        t.default = a
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = {
            audio: {
                a3ds: !0,
                "ac-3": !0,
                "ac-4": !0,
                alac: !0,
                alaw: !0,
                dra1: !0,
                "dts+": !0,
                "dts-": !0,
                dtsc: !0,
                dtse: !0,
                dtsh: !0,
                "ec-3": !0,
                enca: !0,
                g719: !0,
                g726: !0,
                m4ae: !0,
                mha1: !0,
                mha2: !0,
                mhm1: !0,
                mhm2: !0,
                mlpa: !0,
                mp4a: !0,
                "raw ": !0,
                Opus: !0,
                samr: !0,
                sawb: !0,
                sawp: !0,
                sevc: !0,
                sqcp: !0,
                ssmv: !0,
                twos: !0,
                ulaw: !0
            },
            video: {
                avc1: !0,
                avc2: !0,
                avc3: !0,
                avc4: !0,
                avcp: !0,
                drac: !0,
                dvav: !0,
                dvhe: !0,
                encv: !0,
                hev1: !0,
                hvc1: !0,
                mjp2: !0,
                mp4v: !0,
                mvc1: !0,
                mvc2: !0,
                mvc3: !0,
                mvc4: !0,
                resv: !0,
                rv60: !0,
                s263: !0,
                svc1: !0,
                svc2: !0,
                "vc-1": !0,
                vp08: !0,
                vp09: !0
            }
        };
        t.isCodecType = function(e, t) {
            var r = i[t];
            return !!r && !0 === r[e.slice(0, 4)]
        }
        ,
        t.isCodecSupportedInMp4 = function(e, t) {
            return window.MediaSource.isTypeSupported((t || "video") + '/mp4;codecs="' + e + '"')
        }
    }
    , function(e, i, a) {
        "use strict";
        (function(y) {
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var u = a(38)
              , d = a(1)
              , c = a(21)
              , _ = a(0)
              , h = a(3)
              , e = a(13)
              , t = a(6)
              , f = a(24)
              , p = t.getSelfScope()
              , g = e.getMediaSource()
              , r = function() {
                function e(r, e) {
                    var i = this;
                    this.hls = r,
                    this.id = e;
                    function t(e, t) {
                        (t = t || {}).frag = i.frag,
                        t.id = i.id,
                        r.trigger(e, t)
                    }
                    var a = this.observer = new f.Observer
                      , n = r.config;
                    a.on(d.default.FRAG_DECRYPTED, t),
                    a.on(d.default.FRAG_PARSING_INIT_SEGMENT, t),
                    a.on(d.default.FRAG_PARSING_DATA, t),
                    a.on(d.default.FRAG_PARSED, t),
                    a.on(d.default.ERROR, t),
                    a.on(d.default.FRAG_PARSING_METADATA, t),
                    a.on(d.default.FRAG_PARSING_USERDATA, t),
                    a.on(d.default.INIT_PTS_FOUND, t);
                    var s = {
                        mp4: g.isTypeSupported("video/mp4"),
                        mpeg: g.isTypeSupported("audio/mpeg"),
                        mp3: g.isTypeSupported('audio/mp4; codecs="mp3"')
                    }
                      , o = navigator.vendor;
                    if (n.enableWorker && "undefined" != typeof Worker) {
                        _.logger.log("demuxing in webworker");
                        var l = void 0;
                        try {
                            l = this.w = u(51),
                            this.onwmsg = this.onWorkerMessage.bind(this),
                            l.addEventListener("message", this.onwmsg),
                            l.onerror = function(e) {
                                r.trigger(d.default.ERROR, {
                                    type: h.ErrorTypes.OTHER_ERROR,
                                    details: h.ErrorDetails.INTERNAL_EXCEPTION,
                                    fatal: !0,
                                    event: "demuxerWorker",
                                    err: {
                                        message: e.message + " (" + e.filename + ":" + e.lineno + ")"
                                    }
                                })
                            }
                            ,
                            l.postMessage({
                                cmd: "init",
                                typeSupported: s,
                                vendor: o,
                                id: e,
                                config: JSON.stringify(n)
                            })
                        } catch (r) {
                            _.logger.warn("Error in worker:", r),
                            _.logger.error("Error while initializing DemuxerWorker, fallback on DemuxerInline"),
                            l && p.URL.revokeObjectURL(l.objectURL),
                            this.demuxer = new c.default(a,s,n,o),
                            this.w = void 0
                        }
                    } else
                        this.demuxer = new c.default(a,s,n,o)
                }
                return e.prototype.destroy = function() {
                    var e = this.w;
                    if (e)
                        e.removeEventListener("message", this.onwmsg),
                        e.terminate(),
                        this.w = null;
                    else {
                        var t = this.demuxer;
                        t && (t.destroy(),
                        this.demuxer = null)
                    }
                    var r = this.observer;
                    r && (r.removeAllListeners(),
                    this.observer = null)
                }
                ,
                e.prototype.push = function(e, t, r, i, a, n, s, o, l) {
                    var u = this.w
                      , d = y.isFinite(a.startPTS) ? a.startPTS : a.start
                      , c = a.decryptdata
                      , h = this.frag
                      , f = !(h && a.cc === h.cc)
                      , p = !(h && a.level === h.level)
                      , g = h && a.sn === h.sn + 1
                      , v = !p && g;
                    if (f && _.logger.log(this.id + ":discontinuity detected"),
                    p && _.logger.log(this.id + ":switch detected"),
                    this.frag = a,
                    u)
                        u.postMessage({
                            cmd: "demux",
                            data: e,
                            decryptdata: c,
                            initSegment: t,
                            audioCodec: r,
                            videoCodec: i,
                            timeOffset: d,
                            discontinuity: f,
                            trackSwitch: p,
                            contiguous: v,
                            duration: n,
                            accurateTimeOffset: s,
                            defaultInitPTS: o,
                            url: l
                        }, e instanceof ArrayBuffer ? [e] : []);
                    else {
                        var m = this.demuxer;
                        m && m.push(e, c, t, r, i, d, f, p, v, n, s, o, l)
                    }
                }
                ,
                e.prototype.onWorkerMessage = function(e) {
                    var t = e.data
                      , r = this.hls;
                    switch (t.event) {
                    case "init":
                        p.URL.revokeObjectURL(this.w.objectURL);
                        break;
                    case d.default.FRAG_PARSING_DATA:
                        t.data.data1 = new Uint8Array(t.data1),
                        t.data2 && (t.data.data2 = new Uint8Array(t.data2));
                    default:
                        t.data = t.data || {},
                        t.data.frag = this.frag,
                        t.data.id = this.id,
                        r.trigger(t.event, t.data)
                    }
                }
                ,
                e
            }();
            i.default = r
        }
        ).call(this, a(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var v, A = r(1), R = r(3), m = r(12), D = r(41), k = r(17), w = r(42), L = r(45), O = r(46), C = r(49), i = r(6), a = r(0), n = i.getSelfScope();
        try {
            v = n.performance.now.bind(n.performance)
        } catch (e) {
            a.logger.debug("Unable to use Performance API on this environment"),
            v = n.Date.now
        }
        var s = function() {
            function e(e, t, r, i) {
                this.observer = e,
                this.typeSupported = t,
                this.config = r,
                this.vendor = i
            }
            return e.prototype.destroy = function() {
                var e = this.demuxer;
                e && e.destroy()
            }
            ,
            e.prototype.push = function(e, r, i, a, n, s, o, l, u, d, c, h, t) {
                var f = this;
                if (0 < e.byteLength && null != r && null != r.key && "AES-128" === r.method) {
                    var p = this.decrypter;
                    null == p && (p = this.decrypter = new m.default(this.observer,this.config));
                    var g = v();
                    p.decrypt(e, r.key, r.iv, function(e) {
                        var t = v();
                        f.observer.trigger(A.default.FRAG_DECRYPTED, {
                            stats: {
                                tstart: g,
                                tdecrypt: t
                            }
                        }),
                        f.pushDecrypted(new Uint8Array(e), r, new Uint8Array(i), a, n, s, o, l, u, d, c, h)
                    }, r, t)
                } else
                    this.pushDecrypted(new Uint8Array(e), r, new Uint8Array(i), a, n, s, o, l, u, d, c, h)
            }
            ,
            e.prototype.pushDecrypted = function(e, t, r, i, a, n, s, o, l, u, d, c, h) {
                var f = this.demuxer;
                if (!f || (s || o) && !this.probe(e)) {
                    for (var p = this.observer, g = this.typeSupported, v = this.config, m = [{
                        demux: w.default,
                        remux: O.default
                    }, {
                        demux: k.default,
                        remux: C.default
                    }, {
                        demux: D.default,
                        remux: O.default
                    }, {
                        demux: L.default,
                        remux: O.default
                    }], y = 0, _ = m.length; y < _; y++) {
                        var E = m[y]
                          , S = E.demux.probe;
                        if (S(e)) {
                            var T = this.remuxer = new E.remux(p,v,g,this.vendor);
                            f = new E.demux(p,T,v,g),
                            this.probe = S;
                            break
                        }
                    }
                    if (!f)
                        return void p.trigger(A.default.ERROR, {
                            type: R.ErrorTypes.MEDIA_ERROR,
                            details: R.ErrorDetails.FRAG_PARSING_ERROR,
                            fatal: !0,
                            reason: "no demux matching with content found"
                        });
                    this.demuxer = f
                }
                var b = this.remuxer;
                (s || o) && (f.resetInitSegment(r, i, a, u),
                b.resetInitSegment()),
                s && (f.resetTimeStamp(c),
                b.resetTimeStamp(c)),
                "function" == typeof f.setDecryptData && f.setDecryptData(t),
                f.append(e, n, l, d)
            }
            ,
            e
        }();
        t.default = s
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var h = r(0)
          , f = r(3)
          , p = r(1);
        function s(e, t, r, i) {
            var a, n, s, o, l, u = navigator.userAgent.toLowerCase(), d = i, c = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
            if (a = 1 + ((192 & t[r + 2]) >>> 6),
            !((n = (60 & t[r + 2]) >>> 2) > c.length - 1))
                return o = (1 & t[r + 2]) << 2,
                o |= (192 & t[r + 3]) >>> 6,
                h.logger.log("manifest codec:" + i + ",ADTS data:type:" + a + ",sampleingIndex:" + n + "[" + c[n] + "Hz],channelConfig:" + o),
                s = /firefox/i.test(u) ? 6 <= n ? (a = 5,
                l = new Array(4),
                n - 3) : (a = 2,
                l = new Array(2),
                n) : -1 !== u.indexOf("android") ? (a = 2,
                l = new Array(2),
                n) : (a = 5,
                l = new Array(4),
                i && (-1 !== i.indexOf("mp4a.40.29") || -1 !== i.indexOf("mp4a.40.5")) || !i && 6 <= n ? n - 3 : ((i && -1 !== i.indexOf("mp4a.40.2") && (6 <= n && 1 == o || /vivaldi/i.test(u)) || !i && 1 == o) && (a = 2,
                l = new Array(2)),
                n)),
                l[0] = a << 3,
                l[0] |= (14 & n) >> 1,
                l[1] |= (1 & n) << 7,
                l[1] |= o << 3,
                5 === a && (l[1] |= (14 & s) >> 1,
                l[2] = (1 & s) << 7,
                l[2] |= 8,
                l[3] = 0),
                {
                    config: l,
                    samplerate: c[n],
                    channelCount: o,
                    codec: "mp4a.40." + a,
                    manifestCodec: d
                };
            e.trigger(p.default.ERROR, {
                type: f.ErrorTypes.MEDIA_ERROR,
                details: f.ErrorDetails.FRAG_PARSING_ERROR,
                fatal: !0,
                reason: "invalid ADTS sampling index:" + n
            })
        }
        function a(e, t) {
            return 255 === e[t] && 240 == (246 & e[t + 1])
        }
        function l(e, t) {
            return 1 & e[t + 1] ? 7 : 9
        }
        function u(e, t) {
            return (3 & e[t + 3]) << 11 | e[t + 4] << 3 | (224 & e[t + 5]) >>> 5
        }
        function d(e) {
            return 9216e4 / e
        }
        function c(e, t, r, i, a) {
            var n, s, o = e.length;
            if (n = l(e, t),
            s = u(e, t),
            0 < (s -= n) && t + n + s <= o)
                return {
                    headerLength: n,
                    frameLength: s,
                    stamp: r + i * a
                }
        }
        t.getAudioConfig = s,
        t.isHeaderPattern = a,
        t.getHeaderLength = l,
        t.getFullFrameLength = u,
        t.isHeader = function(e, t) {
            return !!(t + 1 < e.length && a(e, t))
        }
        ,
        t.probe = function(e, t) {
            if (t + 1 < e.length && a(e, t)) {
                var r = l(e, t);
                t + 5 < e.length && (r = u(e, t));
                var i = t + r;
                if (i === e.length || i + 1 < e.length && a(e, i))
                    return !0
            }
            return !1
        }
        ,
        t.initTrackConfig = function(e, t, r, i, a) {
            if (!e.samplerate) {
                var n = s(t, r, i, a);
                e.config = n.config,
                e.samplerate = n.samplerate,
                e.channelCount = n.channelCount,
                e.codec = n.codec,
                e.manifestCodec = n.manifestCodec,
                h.logger.log("parsed codec:" + e.codec + ",rate:" + n.samplerate + ",nb channel:" + n.channelCount)
            }
        }
        ,
        t.getFrameDuration = d,
        t.parseFrameHeader = c,
        t.appendFrame = function(e, t, r, i, a) {
            var n = c(t, r, i, a, d(e.samplerate));
            if (n) {
                var s = n.stamp
                  , o = n.headerLength
                  , l = n.frameLength
                  , u = {
                    unit: t.subarray(r + o, r + o + l),
                    pts: s,
                    dts: s
                };
                return e.samples.push(u),
                e.len += l,
                {
                    sample: u,
                    length: l + o
                }
            }
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var g = {
            BitratesMap: [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
            SamplingRateMap: [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3],
            SamplesCoefficients: [[0, 72, 144, 12], [0, 0, 0, 0], [0, 72, 144, 12], [0, 144, 144, 12]],
            BytesInSlot: [0, 1, 1, 4],
            appendFrame: function(e, t, r, i, a) {
                if (!(r + 24 > t.length)) {
                    var n = this.parseHeader(t, r);
                    if (n && r + n.frameLength <= t.length) {
                        var s = i + a * (9e4 * n.samplesPerFrame / n.sampleRate)
                          , o = {
                            unit: t.subarray(r, r + n.frameLength),
                            pts: s,
                            dts: s
                        };
                        return e.config = [],
                        e.channelCount = n.channelCount,
                        e.samplerate = n.sampleRate,
                        e.samples.push(o),
                        e.len += n.frameLength,
                        {
                            sample: o,
                            length: n.frameLength
                        }
                    }
                }
            },
            parseHeader: function(e, t) {
                var r = e[t + 1] >> 3 & 3
                  , i = e[t + 1] >> 1 & 3
                  , a = e[t + 2] >> 4 & 15
                  , n = e[t + 2] >> 2 & 3
                  , s = e[t + 2] >> 1 & 1;
                if (1 != r && 0 != a && 15 != a && 3 != n) {
                    var o = 3 == r ? 3 - i : 3 == i ? 3 : 4
                      , l = 1e3 * g.BitratesMap[14 * o + a - 1]
                      , u = 3 == r ? 0 : 2 == r ? 1 : 2
                      , d = g.SamplingRateMap[3 * u + n]
                      , c = e[t + 3] >> 6 == 3 ? 1 : 2
                      , h = g.SamplesCoefficients[r][i]
                      , f = g.BytesInSlot[i]
                      , p = 8 * h * f;
                    return {
                        sampleRate: d,
                        channelCount: c,
                        frameLength: parseInt(h * l / d + s, 10) * f,
                        samplesPerFrame: p
                    }
                }
            },
            isHeaderPattern: function(e, t) {
                return 255 === e[t] && 224 == (224 & e[t + 1]) && 0 != (6 & e[t + 1])
            },
            isHeader: function(e, t) {
                return !!(t + 1 < e.length && this.isHeaderPattern(e, t))
            },
            probe: function(e, t) {
                if (t + 1 < e.length && this.isHeaderPattern(e, t)) {
                    var r = this.parseHeader(e, t)
                      , i = 4;
                    r && r.frameLength && (i = r.frameLength);
                    var a = t + i;
                    if (a === e.length || a + 1 < e.length && this.isHeaderPattern(e, a))
                        return !0
                }
                return !1
            }
        };
        t.default = g
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e) {
            function t() {
                return null !== e && e.apply(this, arguments) || this
            }
            return a(t, e),
            t.prototype.trigger = function(e) {
                for (var t = [], r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                this.emit.apply(this, [e, e].concat(t))
            }
            ,
            t
        }(r(50).EventEmitter);
        t.Observer = n
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = {
            toString: function(e) {
                for (var t = "", r = e.length, i = 0; i < r; i++)
                    t += "[" + e.start(i).toFixed(3) + "," + e.end(i).toFixed(3) + "]";
                return t
            }
        }
    }
    , function(e, t, c) {
        "use strict";
        (function(a) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var r = c(9)
              , n = c(0);
            function s(e, t) {
                for (var r = null, i = 0; i < e.length; i += 1) {
                    var a = e[i];
                    if (a && a.cc === t) {
                        r = a;
                        break
                    }
                }
                return r
            }
            function o(e, t, r) {
                var i = !1;
                return t && t.details && r && (r.endCC > r.startCC || e && e.cc < r.startCC) && (i = !0),
                i
            }
            function l(e, t) {
                var r = e.fragments
                  , i = t.fragments;
                if (i.length && r.length) {
                    var a = s(r, i[0].cc);
                    if (a && (!a || a.startPTS))
                        return a;
                    n.logger.log("No frag in previous level to align on")
                } else
                    n.logger.log("No fragments to align")
            }
            function u(r, e) {
                e.fragments.forEach(function(e) {
                    if (e) {
                        var t = e.start + r;
                        e.start = e.startPTS = t,
                        e.endPTS = t + e.duration
                    }
                }),
                e.PTSKnown = !0
            }
            function i(e, t, r) {
                if (o(e, r, t)) {
                    var i = l(r.details, t);
                    i && (n.logger.log("Adjusting PTS using last level due to CC increase within current level"),
                    u(i.start, t))
                }
            }
            function d(e, t) {
                if (t && t.fragments.length) {
                    if (!e.hasProgramDateTime || !t.hasProgramDateTime)
                        return;
                    var r = t.fragments[0].programDateTime
                      , i = (e.fragments[0].programDateTime - r) / 1e3 + t.fragments[0].start;
                    a.isFinite(i) && (n.logger.log("adjusting PTS using programDateTime delta, sliding:" + i.toFixed(3)),
                    u(i, e))
                }
            }
            t.findFirstFragWithCC = s,
            t.findFragWithCC = function(e, t) {
                return r.default.search(e, function(e) {
                    return e.cc < t ? 1 : e.cc > t ? -1 : 0
                })
            }
            ,
            t.shouldAlignOnDiscontinuities = o,
            t.findDiscontinuousReferenceFrag = l,
            t.adjustPts = u,
            t.alignStream = function(e, t, r) {
                i(e, r, t),
                !r.PTSKnown && t && d(r, t.details)
            }
            ,
            t.alignDiscontinuities = i,
            t.alignPDT = d
        }
        ).call(this, c(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        (function(n) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var s = r(9);
            function o(e, t, r) {
                void 0 === e && (e = 0),
                void 0 === t && (t = 0);
                var i = Math.min(t, r.duration + (r.deltaPTS ? r.deltaPTS : 0));
                return r.start + r.duration - i <= e ? 1 : r.start - i > e && r.start ? -1 : 0
            }
            function l(e, t, r) {
                var i = 1e3 * Math.min(t, r.duration + (r.deltaPTS ? r.deltaPTS : 0));
                return r.endProgramDateTime - i > e
            }
            t.findFragmentByPDT = function(e, t, r) {
                if (!Array.isArray(e) || !e.length || !n.isFinite(t))
                    return null;
                if (t < e[0].programDateTime)
                    return null;
                if (t >= e[e.length - 1].endProgramDateTime)
                    return null;
                r = r || 0;
                for (var i = 0; i < e.length; ++i) {
                    var a = e[i];
                    if (l(t, r, a))
                        return a
                }
                return null
            }
            ,
            t.findFragmentByPTS = function(e, t, r, i) {
                void 0 === r && (r = 0),
                void 0 === i && (i = 0);
                var a = e ? t[e.sn - t[0].sn + 1] : null;
                return a && !o(r, i, a) ? a : s.default.search(t, o.bind(null, r, i))
            }
            ,
            t.fragmentWithinToleranceTest = o,
            t.pdtWithinToleranceTest = l
        }
        ).call(this, r(2).Number)
    }
    , function(e, f, a) {
        "use strict";
        (function(d) {
            var i, r = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(f, "__esModule", {
                value: !0
            });
            var e = a(15)
              , n = a(7)
              , c = a(5)
              , h = a(0);
            f.State = {
                STOPPED: "STOPPED",
                STARTING: "STARTING",
                IDLE: "IDLE",
                PAUSED: "PAUSED",
                KEY_LOADING: "KEY_LOADING",
                FRAG_LOADING: "FRAG_LOADING",
                FRAG_LOADING_WAITING_RETRY: "FRAG_LOADING_WAITING_RETRY",
                WAITING_TRACK: "WAITING_TRACK",
                PARSING: "PARSING",
                PARSED: "PARSED",
                BUFFER_FLUSHING: "BUFFER_FLUSHING",
                ENDED: "ENDED",
                ERROR: "ERROR",
                WAITING_INIT_PTS: "WAITING_INIT_PTS",
                WAITING_LEVEL: "WAITING_LEVEL"
            };
            var t = function(e) {
                function t() {
                    return null !== e && e.apply(this, arguments) || this
                }
                return r(t, e),
                t.prototype.doTick = function() {}
                ,
                t.prototype._streamEnded = function(e, t) {
                    var r = this.fragCurrent
                      , i = this.fragmentTracker;
                    if (t.live || !r || r.backtracked || r.sn !== t.endSN || e.nextStart)
                        return !1;
                    var a = i.getState(r);
                    return a === n.FragmentState.PARTIAL || a === n.FragmentState.OK
                }
                ,
                t.prototype.onMediaSeeking = function() {
                    var e = this.config
                      , t = this.media
                      , r = this.mediaBuffer
                      , i = this.state
                      , a = t ? t.currentTime : null
                      , n = c.BufferHelper.bufferInfo(r || t, a, this.config.maxBufferHole);
                    if (d.isFinite(a) && h.logger.log("media seeking to " + a.toFixed(3)),
                    i === f.State.FRAG_LOADING) {
                        var s = this.fragCurrent;
                        if (0 === n.len && s) {
                            var o = e.maxFragLookUpTolerance
                              , l = s.start - o
                              , u = s.start + s.duration + o;
                            a < l || u < a ? (s.loader && (h.logger.log("seeking outside of buffer while fragment load in progress, cancel fragment load"),
                            s.loader.abort()),
                            this.fragCurrent = null,
                            this.fragPrevious = null,
                            this.state = f.State.IDLE) : h.logger.log("seeking outside of buffer but within currently loaded fragment range")
                        }
                    } else
                        i === f.State.ENDED && (0 === n.len && (this.fragPrevious = null,
                        this.fragCurrent = null),
                        this.state = f.State.IDLE);
                    t && (this.lastCurrentTime = a),
                    this.loadedmetadata || (this.nextLoadPosition = this.startPosition = a),
                    this.tick()
                }
                ,
                t.prototype.onMediaEnded = function() {
                    this.startPosition = this.lastCurrentTime = 0
                }
                ,
                t
            }(e.default);
            f.default = t
        }
        ).call(this, a(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.sendAddTrackEvent = function(e, t) {
            var r = null;
            try {
                r = new window.Event("addtrack")
            } catch (e) {
                (r = document.createEvent("Event")).initEvent("addtrack", !1, !1)
            }
            r.track = e,
            t.dispatchEvent(r)
        }
        ,
        t.clearCurrentCues = function(e) {
            if (e && e.cues)
                for (; 0 < e.cues.length; )
                    e.removeCue(e.cues[0])
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        function i() {
            return {
                decode: function(e) {
                    if (!e)
                        return "";
                    if ("string" != typeof e)
                        throw new Error("Error - expected string data.");
                    return decodeURIComponent(encodeURIComponent(e))
                }
            }
        }
        var o = r(68);
        function a() {
            this.window = window,
            this.state = "INITIAL",
            this.buffer = "",
            this.decoder = new i,
            this.regionList = []
        }
        function l() {
            this.values = Object.create(null)
        }
        function u(e, t, r, i) {
            var a = i ? e.split(i) : [e];
            for (var n in a)
                if ("string" == typeof a[n]) {
                    var s = a[n].split(r);
                    2 === s.length && t(s[0], s[1])
                }
        }
        l.prototype = {
            set: function(e, t) {
                this.get(e) || "" === t || (this.values[e] = t)
            },
            get: function(e, t, r) {
                return r ? this.has(e) ? this.values[e] : t[r] : this.has(e) ? this.values[e] : t
            },
            has: function(e) {
                return e in this.values
            },
            alt: function(e, t, r) {
                for (var i = 0; i < r.length; ++i)
                    if (t === r[i]) {
                        this.set(e, t);
                        break
                    }
            },
            integer: function(e, t) {
                /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10))
            },
            percent: function(e, t) {
                return !!(t.match(/^([\d]{1,3})(\.[\d]*)?%$/) && 0 <= (t = parseFloat(t)) && t <= 100) && (this.set(e, t),
                !0)
            }
        };
        var d = new o.default(0,0,0)
          , c = "middle" === d.align ? "middle" : "center";
        function h(i, e, s) {
            var t = i;
            function r() {
                var e = function(e) {
                    function t(e, t, r, i) {
                        return 3600 * (0 | e) + 60 * (0 | t) + (0 | r) + (0 | i) / 1e3
                    }
                    var r = i.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
                    return r ? r[3] ? t(r[1], r[2], r[3].replace(":", ""), r[4]) : 59 < r[1] ? t(r[1], r[2], 0, r[4]) : t(0, r[1], r[2], r[4]) : null
                }();
                if (null === e)
                    throw new Error("Malformed timestamp: " + t);
                return i = i.replace(/^[^\sa-zA-Z-]+/, ""),
                e
            }
            function a() {
                i = i.replace(/^\s+/, "")
            }
            if (a(),
            e.startTime = r(),
            a(),
            "--\x3e" !== i.substr(0, 3))
                throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + t);
            i = i.substr(3),
            a(),
            e.endTime = r(),
            a(),
            function(e, t) {
                var n = new l;
                u(e, function(e, t) {
                    switch (e) {
                    case "region":
                        for (var r = s.length - 1; 0 <= r; r--)
                            if (s[r].id === t) {
                                n.set(e, s[r].region);
                                break
                            }
                        break;
                    case "vertical":
                        n.alt(e, t, ["rl", "lr"]);
                        break;
                    case "line":
                        var i = t.split(",")
                          , a = i[0];
                        n.integer(e, a),
                        n.percent(e, a) && n.set("snapToLines", !1),
                        n.alt(e, a, ["auto"]),
                        2 === i.length && n.alt("lineAlign", i[1], ["start", c, "end"]);
                        break;
                    case "position":
                        i = t.split(","),
                        n.percent(e, i[0]),
                        2 === i.length && n.alt("positionAlign", i[1], ["start", c, "end", "line-left", "line-right", "auto"]);
                        break;
                    case "size":
                        n.percent(e, t);
                        break;
                    case "align":
                        n.alt(e, t, ["start", c, "end", "left", "right"])
                    }
                }, /:/, /\s/),
                t.region = n.get("region", null),
                t.vertical = n.get("vertical", "");
                var r = n.get("line", "auto");
                "auto" === r && -1 === d.line && (r = -1),
                t.line = r,
                t.lineAlign = n.get("lineAlign", "start"),
                t.snapToLines = n.get("snapToLines", !0),
                t.size = n.get("size", 100),
                t.align = n.get("align", c);
                var i = n.get("position", "auto");
                "auto" === i && 50 === d.position && (i = "start" === t.align || "left" === t.align ? 0 : "end" === t.align || "right" === t.align ? 100 : 50),
                t.position = i
            }(i, e)
        }
        function f(e) {
            return e.replace(/<br(?: \/)?>/gi, "\n")
        }
        t.fixLineBreaks = f,
        a.prototype = {
            parse: function(e) {
                var i = this;
                function t() {
                    var e = i.buffer
                      , t = 0;
                    for (e = f(e); t < e.length && "\r" !== e[t] && "\n" !== e[t]; )
                        ++t;
                    var r = e.substr(0, t);
                    return "\r" === e[t] && ++t,
                    "\n" === e[t] && ++t,
                    i.buffer = e.substr(t),
                    r
                }
                e && (i.buffer += i.decoder.decode(e, {
                    stream: !0
                }));
                try {
                    var r = void 0;
                    if ("INITIAL" === i.state) {
                        if (!/\r\n|\n/.test(i.buffer))
                            return this;
                        var a = (r = t()).match(/^(ï»¿)?WEBVTT([ \t].*)?$/);
                        if (!a || !a[0])
                            throw new Error("Malformed WebVTT signature.");
                        i.state = "HEADER"
                    }
                    for (var n = !1; i.buffer; ) {
                        if (!/\r\n|\n/.test(i.buffer))
                            return this;
                        switch (n ? n = !1 : r = t(),
                        i.state) {
                        case "HEADER":
                            /:/.test(r) ? u(r, function(e, t) {}, /:/) : r || (i.state = "ID");
                            continue;
                        case "NOTE":
                            r || (i.state = "ID");
                            continue;
                        case "ID":
                            if (/^NOTE($|[ \t])/.test(r)) {
                                i.state = "NOTE";
                                break
                            }
                            if (!r)
                                continue;
                            if (i.cue = new o.default(0,0,""),
                            i.state = "CUE",
                            -1 === r.indexOf("--\x3e")) {
                                i.cue.id = r;
                                continue
                            }
                        case "CUE":
                            try {
                                h(r, i.cue, i.regionList)
                            } catch (e) {
                                i.cue = null,
                                i.state = "BADCUE";
                                continue
                            }
                            i.state = "CUETEXT";
                            continue;
                        case "CUETEXT":
                            var s = -1 !== r.indexOf("--\x3e");
                            if (!r || s && (n = !0)) {
                                i.oncue && i.oncue(i.cue),
                                i.cue = null,
                                i.state = "ID";
                                continue
                            }
                            i.cue.text && (i.cue.text += "\n"),
                            i.cue.text += r;
                            continue;
                        case "BADCUE":
                            r || (i.state = "ID");
                            continue
                        }
                    }
                } catch (e) {
                    "CUETEXT" === i.state && i.cue && i.oncue && i.oncue(i.cue),
                    i.cue = null,
                    i.state = "INITIAL" === i.state ? "BADWEBVTT" : "BADCUE"
                }
                return this
            },
            flush: function() {
                try {
                    if (this.buffer += this.decoder.decode(),
                    (this.cue || "HEADER" === this.state) && (this.buffer += "\n\n",
                    this.parse()),
                    "INITIAL" === this.state)
                        throw new Error("Malformed WebVTT signature.")
                } catch (e) {
                    throw e
                }
                return this.onflush && this.onflush(),
                this
            }
        },
        t.default = a
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(8)
          , s = r(3)
          , T = r(16)
          , b = r(35)
          , A = r(36)
          , R = r(7)
          , D = r(37)
          , k = r(54)
          , w = r(55)
          , o = r(56)
          , L = r(0)
          , l = r(57)
          , u = r(1)
          , d = function(E) {
            function S(e) {
                void 0 === e && (e = {});
                var t = E.call(this) || this
                  , r = S.DefaultConfig;
                if ((e.liveSyncDurationCount || e.liveMaxLatencyDurationCount) && (e.liveSyncDuration || e.liveMaxLatencyDuration))
                    throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");
                for (var i in r)
                    i in e || (e[i] = r[i]);
                if (void 0 !== e.liveMaxLatencyDurationCount && e.liveMaxLatencyDurationCount <= e.liveSyncDurationCount)
                    throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');
                if (void 0 !== e.liveMaxLatencyDuration && (e.liveMaxLatencyDuration <= e.liveSyncDuration || void 0 === e.liveSyncDuration))
                    throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');
                L.enableLogs(e.debug),
                t.config = e,
                t._autoLevelCapping = -1;
                var a = t.abrController = new e.abrController(t)
                  , n = new e.bufferController(t)
                  , s = new e.capLevelController(t)
                  , o = new e.fpsController(t)
                  , l = new T.default(t)
                  , u = new b.default(t)
                  , d = new A.default(t)
                  , c = new w.default(t)
                  , h = t.levelController = new k.default(t)
                  , f = new R.FragmentTracker(t)
                  , p = [h, t.streamController = new D.default(t,f)]
                  , g = e.audioStreamController;
                g && p.push(new g(t,f)),
                t.networkControllers = p;
                var v = [l, u, d, a, n, s, o, c, f];
                if (g = e.audioTrackController) {
                    var m = new g(t);
                    t.audioTrackController = m,
                    v.push(m)
                }
                if (g = e.subtitleTrackController) {
                    var y = new g(t);
                    t.subtitleTrackController = y,
                    v.push(y)
                }
                if (g = e.emeController) {
                    var _ = new g(t);
                    t.emeController = _,
                    v.push(_)
                }
                return (g = e.subtitleStreamController) && v.push(new g(t,f)),
                (g = e.timelineController) && v.push(new g(t)),
                t.coreComponents = v,
                t
            }
            return a(S, E),
            Object.defineProperty(S, "version", {
                get: function() {
                    return "0.1.0-SNAPSHOT"
                },
                enumerable: !0,
                configurable: !0
            }),
            S.isSupported = function() {
                return o.isSupported()
            }
            ,
            Object.defineProperty(S, "Events", {
                get: function() {
                    return u.default
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S, "ErrorTypes", {
                get: function() {
                    return s.ErrorTypes
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S, "ErrorDetails", {
                get: function() {
                    return s.ErrorDetails
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S, "DefaultConfig", {
                get: function() {
                    return S.defaultConfig ? S.defaultConfig : l.hlsDefaultConfig
                },
                set: function(e) {
                    S.defaultConfig = e
                },
                enumerable: !0,
                configurable: !0
            }),
            S.prototype.destroy = function() {
                L.logger.log("destroy"),
                this.trigger(u.default.DESTROYING),
                this.detachMedia(),
                this.coreComponents.concat(this.networkControllers).forEach(function(e) {
                    e.destroy()
                }),
                this.url = null,
                this.removeAllListeners(),
                this._autoLevelCapping = -1
            }
            ,
            S.prototype.attachMedia = function(e) {
                L.logger.log("attachMedia"),
                this.media = e,
                this.trigger(u.default.MEDIA_ATTACHING, {
                    media: e
                })
            }
            ,
            S.prototype.detachMedia = function() {
                L.logger.log("detachMedia"),
                this.trigger(u.default.MEDIA_DETACHING),
                this.media = null
            }
            ,
            S.prototype.loadSource = function(e, t, r, i, a) {
                e = n.buildAbsoluteURL(window.location.href, e, {
                    alwaysNormalize: !0
                }),
                L.logger.log("loadSource:" + e),
                this.url = e,
                this.cid = t,
                this.lid = r,
                this.sign = i,
                this.part = a,
                this.trigger(u.default.MANIFEST_LOADING, {
                    url: e
                })
            }
            ,
            S.prototype.startLoad = function(t) {
                void 0 === t && (t = -1),
                L.logger.log("startLoad(" + t + ")"),
                this.networkControllers.forEach(function(e) {
                    e.startLoad(t)
                })
            }
            ,
            S.prototype.stopLoad = function() {
                L.logger.log("stopLoad"),
                this.networkControllers.forEach(function(e) {
                    e.stopLoad()
                })
            }
            ,
            S.prototype.swapAudioCodec = function() {
                L.logger.log("swapAudioCodec"),
                this.streamController.swapAudioCodec()
            }
            ,
            S.prototype.recoverMediaError = function() {
                L.logger.log("recoverMediaError");
                var e = this.media;
                this.detachMedia(),
                this.attachMedia(e)
            }
            ,
            Object.defineProperty(S.prototype, "levels", {
                get: function() {
                    return this.levelController.levels
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "currentLevel", {
                get: function() {
                    return this.streamController.currentLevel
                },
                set: function(e) {
                    L.logger.log("set currentLevel:" + e),
                    this.loadLevel = e,
                    this.streamController.immediateLevelSwitch()
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "nextLevel", {
                get: function() {
                    return this.streamController.nextLevel
                },
                set: function(e) {
                    L.logger.log("set nextLevel:" + e),
                    this.levelController.manualLevel = e,
                    this.streamController.nextLevelSwitch()
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "loadLevel", {
                get: function() {
                    return this.levelController.level
                },
                set: function(e) {
                    L.logger.log("set loadLevel:" + e),
                    this.levelController.manualLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "nextLoadLevel", {
                get: function() {
                    return this.levelController.nextLoadLevel
                },
                set: function(e) {
                    this.levelController.nextLoadLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "firstLevel", {
                get: function() {
                    return Math.max(this.levelController.firstLevel, this.minAutoLevel)
                },
                set: function(e) {
                    L.logger.log("set firstLevel:" + e),
                    this.levelController.firstLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "startLevel", {
                get: function() {
                    return this.levelController.startLevel
                },
                set: function(e) {
                    L.logger.log("set startLevel:" + e),
                    -1 !== e && (e = Math.max(e, this.minAutoLevel)),
                    this.levelController.startLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "autoLevelCapping", {
                get: function() {
                    return this._autoLevelCapping
                },
                set: function(e) {
                    L.logger.log("set autoLevelCapping:" + e),
                    this._autoLevelCapping = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "autoLevelEnabled", {
                get: function() {
                    return -1 === this.levelController.manualLevel
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "manualLevel", {
                get: function() {
                    return this.levelController.manualLevel
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "minAutoLevel", {
                get: function() {
                    for (var e = this.levels, t = this.config.minAutoBitrate, r = e ? e.length : 0, i = 0; i < r; i++)
                        if ((e[i].realBitrate ? Math.max(e[i].realBitrate, e[i].bitrate) : e[i].bitrate) > t)
                            return i;
                    return 0
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "maxAutoLevel", {
                get: function() {
                    var e = this.levels
                      , t = this.autoLevelCapping;
                    return -1 === t && e && e.length ? e.length - 1 : t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "nextAutoLevel", {
                get: function() {
                    return Math.min(Math.max(this.abrController.nextAutoLevel, this.minAutoLevel), this.maxAutoLevel)
                },
                set: function(e) {
                    this.abrController.nextAutoLevel = Math.max(this.minAutoLevel, e)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "audioTracks", {
                get: function() {
                    var e = this.audioTrackController;
                    return e ? e.audioTracks : []
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "audioTrack", {
                get: function() {
                    var e = this.audioTrackController;
                    return e ? e.audioTrack : -1
                },
                set: function(e) {
                    var t = this.audioTrackController;
                    t && (t.audioTrack = e)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "liveSyncPosition", {
                get: function() {
                    return this.streamController.liveSyncPosition
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "subtitleTracks", {
                get: function() {
                    var e = this.subtitleTrackController;
                    return e ? e.subtitleTracks : []
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "subtitleTrack", {
                get: function() {
                    var e = this.subtitleTrackController;
                    return e ? e.subtitleTrack : -1
                },
                set: function(e) {
                    var t = this.subtitleTrackController;
                    t && (t.subtitleTrack = e)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(S.prototype, "subtitleDisplay", {
                get: function() {
                    var e = this.subtitleTrackController;
                    return !!e && e.subtitleDisplay
                },
                set: function(e) {
                    var t = this.subtitleTrackController;
                    t && (t.subtitleDisplay = e)
                },
                enumerable: !0,
                configurable: !0
            }),
            S
        }(r(24).Observer);
        t.default = d
    }
    , function(e, t, i) {
        "use strict";
        (function(C) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var r = i(8)
              , I = i(11)
              , P = i(33)
              , x = i(18)
              , F = i(34)
              , M = i(0)
              , l = i(19)
              , u = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g
              , c = /#EXT-X-MEDIA:(.*)/g
              , B = new RegExp([/#EXTINF:\s*(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)([\S+ ?]+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""),"g")
              , N = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)([^:]*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/
              , U = /\.(mp4|m4s|m4v|m4a)$/i
              , e = function() {
                function d() {}
                return d.findGroup = function(e, t) {
                    if (!e)
                        return null;
                    for (var r = null, i = 0; i < e.length; i++) {
                        var a = e[i];
                        a.id === t && (r = a)
                    }
                    return r
                }
                ,
                d.convertAVC1ToAVCOTI = function(e) {
                    var t, r = e.split(".");
                    return 2 < r.length ? (t = r.shift() + ".",
                    t += parseInt(r.shift()).toString(16),
                    t += ("000" + parseInt(r.shift()).toString(16)).substr(-4)) : t = e,
                    t
                }
                ,
                d.resolve = function(e, t) {
                    return r.buildAbsoluteURL(t, e, {
                        alwaysNormalize: !0
                    })
                }
                ,
                d.parseMasterPlaylist = function(e, t) {
                    var r, i = [];
                    function a(i, a) {
                        ["video", "audio"].forEach(function(t) {
                            var r = i.filter(function(e) {
                                return l.isCodecType(e, t)
                            });
                            if (r.length) {
                                var e = r.filter(function(e) {
                                    return 0 === e.lastIndexOf("avc1", 0) || 0 === e.lastIndexOf("mp4a", 0)
                                });
                                a[t + "Codec"] = 0 < e.length ? e[0] : r[0],
                                i = i.filter(function(e) {
                                    return -1 === r.indexOf(e)
                                })
                            }
                        }),
                        a.unknownCodecs = i
                    }
                    for (u.lastIndex = 0; null != (r = u.exec(e)); ) {
                        var n = {}
                          , s = n.attrs = new F.default(r[1]);
                        n.url = d.resolve(r[2], t);
                        var o = s.decimalResolution("RESOLUTION");
                        o && (n.width = o.width,
                        n.height = o.height),
                        n.bitrate = s.decimalInteger("AVERAGE-BANDWIDTH") || s.decimalInteger("BANDWIDTH"),
                        n.name = s.NAME,
                        a([].concat((s.CODECS || "").split(/[ ,]+/)), n),
                        n.videoCodec && -1 !== n.videoCodec.indexOf("avc1") && (n.videoCodec = d.convertAVC1ToAVCOTI(n.videoCodec)),
                        i.push(n)
                    }
                    return i
                }
                ,
                d.parseMasterPlaylistMedia = function(e, t, r, i) {
                    var a;
                    void 0 === i && (i = []);
                    var n = []
                      , s = 0;
                    for (c.lastIndex = 0; null !== (a = c.exec(e)); ) {
                        var o = {}
                          , l = new F.default(a[1]);
                        if (l.TYPE === r) {
                            if (o.groupId = l["GROUP-ID"],
                            o.name = l.NAME,
                            o.type = r,
                            o.default = "YES" === l.DEFAULT,
                            o.autoselect = "YES" === l.AUTOSELECT,
                            o.forced = "YES" === l.FORCED,
                            l.URI && (o.url = d.resolve(l.URI, t)),
                            o.lang = l.LANGUAGE,
                            o.name || (o.name = o.lang),
                            i.length) {
                                var u = d.findGroup(i, o.groupId);
                                o.audioCodec = u ? u.codec : i[0].codec
                            }
                            o.id = s++,
                            n.push(o)
                        }
                    }
                    return n
                }
                ,
                d.parseLevelPlaylist = function(e, t, r, i, a) {
                    var n, s, o, l, u = 0, d = 0, c = new P.default(t), h = new x.default, f = 0, p = null, g = new I.default, v = null;
                    for (B.lastIndex = 0; null !== (n = B.exec(e)); ) {
                        var m = n[1];
                        if (m) {
                            g.duration = parseFloat(m);
                            var y = (" " + n[2]).slice(1);
                            g.title = y || null,
                            g.tagList.push(y ? ["INF", m, y] : ["INF", m])
                        } else if (n[3]) {
                            if (C.isFinite(g.duration)) {
                                var _ = u++;
                                g.type = i,
                                g.start = d,
                                g.levelkey = h,
                                g.sn = _,
                                g.level = r,
                                g.cc = f,
                                g.urlId = a,
                                g.baseurl = t,
                                g.relurl = (" " + n[3]).slice(1),
                                l = p,
                                (o = g).rawProgramDateTime ? o.programDateTime = Date.parse(o.rawProgramDateTime) : l && l.programDateTime && (o.programDateTime = l.endProgramDateTime),
                                C.isFinite(o.programDateTime) || (o.programDateTime = null,
                                o.rawProgramDateTime = null),
                                c.fragments.push(g),
                                d += (p = g).duration,
                                g = new I.default
                            }
                        } else if (n[4]) {
                            if (g.rawByteRange = (" " + n[4]).slice(1),
                            hls.trigger(Event.PARSE_M3U8_RANGE, {
                                reason: "m3u8-parser.js --- parseLevelPlaylist --- ByteRange tag parse 值=" + n[4]
                            }),
                            p) {
                                var E = p.byteRangeEndOffset;
                                E && (g.lastByteRangeEndOffset = E)
                            }
                        } else if (n[5])
                            g.rawProgramDateTime = (" " + n[5]).slice(1),
                            g.tagList.push(["PROGRAM-DATE-TIME", g.rawProgramDateTime]),
                            null === v && (v = c.fragments.length);
                        else {
                            for (n = n[0].match(N),
                            s = 1; s < n.length && void 0 === n[s]; s++)
                                ;
                            var S = (" " + n[s + 1]).slice(1)
                              , T = (" " + n[s + 2]).slice(1);
                            switch (n[s]) {
                            case "#":
                                g.tagList.push(T ? [S, T] : [S]);
                                break;
                            case "PLAYLIST-TYPE":
                                c.type = S.toUpperCase();
                                break;
                            case "MEDIA-SEQUENCE":
                                u = c.startSN = parseInt(S);
                                break;
                            case "TARGETDURATION":
                                c.targetduration = parseFloat(S);
                                break;
                            case "VERSION":
                                c.version = parseInt(S);
                                break;
                            case "EXTM3U":
                                break;
                            case "ENDLIST":
                                c.live = !1;
                                break;
                            case "DIS":
                                f++,
                                g.tagList.push(["DIS"]);
                                break;
                            case "DISCONTINUITY-SEQ":
                                f = parseInt(S);
                                break;
                            case "KEY":
                                var b = S
                                  , A = new F.default(b)
                                  , R = A.enumeratedString("METHOD")
                                  , D = A.URI
                                  , k = A.hexadecimalInteger("IV");
                                R && (h = new x.default,
                                D && 0 <= ["AES-128", "SAMPLE-AES", "SAMPLE-AES-CENC"].indexOf(R) && (h.method = R,
                                h.baseuri = t,
                                h.reluri = D,
                                h.key = null,
                                h.iv = k));
                                break;
                            case "START":
                                var w = S
                                  , L = new F.default(w).decimalFloatingPoint("TIME-OFFSET");
                                C.isFinite(L) && (c.startTimeOffset = L);
                                break;
                            case "MAP":
                                var O = new F.default(S);
                                g.relurl = O.URI,
                                g.rawByteRange = O.BYTERANGE,
                                g.baseurl = t,
                                g.level = r,
                                g.type = i,
                                g.sn = "initSegment",
                                c.initSegment = g,
                                (g = new I.default).rawProgramDateTime = c.initSegment.rawProgramDateTime,
                                hls.trigger(Event.SET_RAWBYTERANGE, {
                                    url: g.relurl,
                                    reason: "m3u8-parser.js --- parseLevelPlaylist --- MAP tag parse"
                                });
                                break;
                            default:
                                M.logger.warn("line parsed but not handled: " + n)
                            }
                        }
                    }
                    return (g = p) && !g.relurl && (c.fragments.pop(),
                    d -= g.duration),
                    c.totalduration = d,
                    c.averagetargetduration = d / c.fragments.length,
                    c.endSN = u - 1,
                    c.startCC = c.fragments[0] ? c.fragments[0].cc : 0,
                    c.endCC = f,
                    !c.initSegment && c.fragments.length && c.fragments.every(function(e) {
                        return U.test(e.relurl)
                    }) && (M.logger.warn("MP4 fragments found but no init segment (probably no MAP, incomplete M3U8), trying to fetch SIDX"),
                    hls.trigger(Event.MP4_REGEX_SUFFIX, {
                        url: g.relurl,
                        reason: "m3u8-parser.js --- parseLevelPlaylist --- MP4 fragments found but no init segment (probably no MAP, incomplete M3U8), trying to fetch SIDX"
                    }),
                    (g = new I.default).relurl = c.fragments[0].relurl,
                    g.baseurl = t,
                    g.level = r,
                    g.type = i,
                    g.sn = "initSegment",
                    c.initSegment = g,
                    c.needSidxRanges = !0),
                    v && function(e, t) {
                        for (var r = e[t], i = t - 1; 0 <= i; i--) {
                            var a = e[i];
                            a.programDateTime = r.programDateTime - 1e3 * a.duration,
                            r = a
                        }
                    }(c.fragments, v),
                    c
                }
                ,
                d
            }();
            t.default = e
        }
        ).call(this, i(2).Number)
    }
    , function(e, r, t) {
        "use strict";
        (function(t) {
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var e = function() {
                function e(e) {
                    this.endCC = 0,
                    this.endSN = 0,
                    this.fragments = [],
                    this.initSegment = null,
                    this.live = !0,
                    this.needSidxRanges = !1,
                    this.startCC = 0,
                    this.startSN = 0,
                    this.startTimeOffset = null,
                    this.targetduration = 0,
                    this.totalduration = 0,
                    this.type = null,
                    this.url = e,
                    this.version = null
                }
                return Object.defineProperty(e.prototype, "hasProgramDateTime", {
                    get: function() {
                        return !(!this.fragments[0] || !t.isFinite(this.fragments[0].programDateTime))
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e
            }();
            r.default = e
        }
        ).call(this, t(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        (function(i) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var a = /^(\d+)x(\d+)$/
              , n = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g
              , e = function() {
                function r(e) {
                    for (var t in "string" == typeof e && (e = r.parseAttrList(e)),
                    e)
                        e.hasOwnProperty(t) && (this[t] = e[t])
                }
                return r.prototype.decimalInteger = function(e) {
                    var t = parseInt(this[e], 10);
                    return t > i.MAX_SAFE_INTEGER ? 1 / 0 : t
                }
                ,
                r.prototype.hexadecimalInteger = function(e) {
                    if (this[e]) {
                        var t = (this[e] || "0x").slice(2);
                        t = (1 & t.length ? "0" : "") + t;
                        for (var r = new Uint8Array(t.length / 2), i = 0; i < t.length / 2; i++)
                            r[i] = parseInt(t.slice(2 * i, 2 * i + 2), 16);
                        return r
                    }
                    return null
                }
                ,
                r.prototype.hexadecimalIntegerAsNumber = function(e) {
                    var t = parseInt(this[e], 16);
                    return t > i.MAX_SAFE_INTEGER ? 1 / 0 : t
                }
                ,
                r.prototype.decimalFloatingPoint = function(e) {
                    return parseFloat(this[e])
                }
                ,
                r.prototype.enumeratedString = function(e) {
                    return this[e]
                }
                ,
                r.prototype.decimalResolution = function(e) {
                    var t = a.exec(this[e]);
                    if (null !== t)
                        return {
                            width: parseInt(t[1], 10),
                            height: parseInt(t[2], 10)
                        }
                }
                ,
                r.parseAttrList = function(e) {
                    var t, r = {};
                    for (n.lastIndex = 0; null !== (t = n.exec(e)); ) {
                        var i = t[2];
                        0 === i.indexOf('"') && i.lastIndexOf('"') === i.length - 1 && (i = i.slice(1, -1)),
                        r[t[1]] = i
                    }
                    return r
                }
                ,
                r
            }();
            t.default = e
        }
        ).call(this, r(2).Number)
    }
    , function(e, a, s) {
        "use strict";
        (function(f) {
            var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(a, "__esModule", {
                value: !0
            });
            var p = s(1)
              , e = s(4)
              , n = s(3)
              , g = s(0)
              , r = function(i) {
                function e(e) {
                    var t = i.call(this, e, p.default.FRAG_LOADING) || this;
                    return t.loaders = {},
                    t
                }
                return t(e, i),
                e.prototype.destroy = function() {
                    var e = this.loaders;
                    for (var t in e) {
                        var r = e[t];
                        r && r.destroy()
                    }
                    this.loaders = {},
                    i.prototype.destroy.call(this)
                }
                ,
                e.prototype.onFragLoading = function(e) {
                    var t = e.frag
                      , r = t.type
                      , i = this.loaders
                      , a = this.hls.config
                      , n = a.fLoader
                      , s = a.loader;
                    t.loaded = 0;
                    var o, l, u, d = i[r];
                    d && (g.logger.warn("abort previous fragment loader for type: " + r),
                    d.abort()),
                    d = i[r] = t.loader = a.fLoader ? new n(a) : new s(a),
                    o = {
                        url: t.url,
                        frag: t,
                        responseType: "arraybuffer",
                        progressData: !1
                    };
                    var c = t.byteRangeStartOffset
                      , h = t.byteRangeEndOffset;
                    f.isFinite(c) && f.isFinite(h) && (o.rangeStart = c,
                    o.rangeEnd = h,
                    this.hls.trigger(p.default.SET_RANGE_END, {
                        rangeStart: c,
                        rangeEnd: h,
                        url: t.url
                    })),
                    l = {
                        timeout: a.fragLoadingTimeOut,
                        maxRetry: 0,
                        retryDelay: 0,
                        maxRetryDelay: a.fragLoadingMaxRetryTimeout
                    },
                    u = {
                        onSuccess: this.loadsuccess.bind(this),
                        onError: this.loaderror.bind(this),
                        onTimeout: this.loadtimeout.bind(this),
                        onProgress: this.loadprogress.bind(this)
                    },
                    d.load(o, l, u)
                }
                ,
                e.prototype.loadsuccess = function(e, t, r, i) {
                    void 0 === i && (i = null);
                    var a = e.data
                      , n = r.frag;
                    n.loader = void 0,
                    this.loaders[n.type] = void 0,
                    this.hls.trigger(p.default.FRAG_LOADED, {
                        payload: a,
                        frag: n,
                        stats: t,
                        networkDetails: i,
                        url: r.url
                    })
                }
                ,
                e.prototype.loaderror = function(e, t, r) {
                    void 0 === r && (r = null);
                    var i = t.frag
                      , a = i.loader;
                    a && a.abort(),
                    this.loaders[i.type] = void 0,
                    this.hls.trigger(p.default.ERROR, {
                        type: n.ErrorTypes.NETWORK_ERROR,
                        details: n.ErrorDetails.FRAG_LOAD_ERROR,
                        fatal: !1,
                        frag: t.frag,
                        response: e,
                        networkDetails: r
                    })
                }
                ,
                e.prototype.loadtimeout = function(e, t, r) {
                    void 0 === r && (r = null);
                    var i = t.frag
                      , a = i.loader;
                    a && a.abort(),
                    this.loaders[i.type] = void 0,
                    this.hls.trigger(p.default.ERROR, {
                        type: n.ErrorTypes.NETWORK_ERROR,
                        details: n.ErrorDetails.FRAG_LOAD_TIMEOUT,
                        fatal: !1,
                        frag: t.frag,
                        networkDetails: r
                    })
                }
                ,
                e.prototype.loadprogress = function(e, t, r, i) {
                    void 0 === i && (i = null);
                    var a = t.frag;
                    a.loaded = e.loaded,
                    this.hls.trigger(p.default.FRAG_LOAD_PROGRESS, {
                        frag: a,
                        stats: e,
                        networkDetails: i
                    })
                }
                ,
                e
            }(e.default);
            a.default = r
        }
        ).call(this, s(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var d = r(1)
          , n = r(4)
          , s = r(3)
          , c = r(0)
          , dec = r(40)
          , parser = r(39)
          , o = function(r) {
            function e(e) {
                var t = r.call(this, e, d.default.KEY_LOADING) || this;
                return t.loaders = {},
                t.decryptkey = null,
                t.decrypturl = null,
                t
            }
            return a(e, r),
            e.prototype.destroy = function() {
                for (var e in this.loaders) {
                    var t = this.loaders[e];
                    t && t.destroy()
                }
                this.loaders = {},
                n.default.prototype.destroy.call(this)
            }
            ,
            e.prototype.onKeyLoading = function(e) {
                var t = e.frag
                  , r = t.type
                  , i = this.loaders[r]
                  , a = t.decryptdata
                  , n = a.uri;
                if (n !== this.decrypturl || null === this.decryptkey) {
                    var s, o, l, u = this.hls.config;
                    i && (c.logger.warn("abort previous key loader for type:" + r),
                    i.abort()),
                    t.loader = this.loaders[r] = new u.loader(u),
                    this.decrypturl = n,
                    this.decryptkey = null,
                    s = {
                        url: n + "&sign=" + this.hls.sign,
                        frag: t,
                        responseType: "arraybuffer"
                    },
                    o = {
                        timeout: u.fragLoadingTimeOut,
                        maxRetry: 0,
                        retryDelay: u.fragLoadingRetryDelay,
                        maxRetryDelay: u.fragLoadingMaxRetryTimeout
                    },
                    l = {
                        onSuccess: this.loadsuccess.bind(this),
                        onError: this.loaderror.bind(this),
                        onTimeout: this.loadtimeout.bind(this)
                    },
                    t.loader.load(s, o, l)
                } else
                    this.decryptkey && (a.key = this.decryptkey,
                    this.hls.trigger(d.default.KEY_LOADED, {
                        frag: t
                    }))
            }
            ,
            e.prototype.loadsuccess = function(e, t, r) {
                var i = r.frag;
                this.decryptkey = i.decryptdata.key = e.data,
                i.decryptdata._cid = this.hls.cid,
                i.decryptdata._lid = this.hls.lid,
                i.decryptdata.part = this.hls.part,
                i.loader = void 0,
                this.loaders[i.type] = void 0,
                this.hls.trigger(d.default.KEY_LOADED, {
                    frag: i
                });
                var decryptkey = parser.lib.WordArray.create(new Uint8Array(i.decryptdata.key)).toString(parser.enc.Utf8),
                decryptkey_bytes_string = dec.dec(decryptkey, i.decryptdata._lid.replace(/_\d*/, ""));
				var s = 'N_m3u8DL-CLI_v2.6.0.exe "' + edu_h5_player.config.dispatch[0].url.replace('https','http') + '" --saveName '+$('li.lesson.cur>a>*').slice(0,2).text()+' --useKeyBase64 "'+btoa(decryptkey_bytes_string)+'" --enableDelAfterDone ';
                prompt(s);//"decryptkey_base64_string",btoa(decryptkey_bytes_string));
            }
            ,
            e.prototype.loaderror = function(e, t) {
                var r = t.frag
                  , i = r.loader;
                i && i.abort(),
                this.loaders[t.type] = void 0,
                this.hls.trigger(d.default.ERROR, {
                    type: s.ErrorTypes.NETWORK_ERROR,
                    details: s.ErrorDetails.KEY_LOAD_ERROR,
                    fatal: !1,
                    frag: r,
                    response: e
                })
            }
            ,
            e.prototype.loadtimeout = function(e, t) {
                var r = t.frag
                  , i = r.loader;
                i && i.abort(),
                this.loaders[t.type] = void 0,
                this.hls.trigger(d.default.ERROR, {
                    type: s.ErrorTypes.NETWORK_ERROR,
                    details: s.ErrorDetails.KEY_LOAD_TIMEOUT,
                    fatal: !1,
                    frag: r
                })
            }
            ,
            e
        }(n.default);
        t.default = o
    }
    , function(e, l, E) {
        "use strict";
        (function(u) {
            var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(l, "__esModule", {
                value: !0
            });
            var p = E(9)
              , h = E(5)
              , f = E(20)
              , g = E(1)
              , r = E(7)
              , d = E(11)
              , a = E(16)
              , c = E(14)
              , n = E(25)
              , s = E(3)
              , v = E(0)
              , m = E(26)
              , y = E(27)
              , o = E(53)
              , _ = E(28)
              , e = function(i) {
                function e(e, t) {
                    var r = i.call(this, e, g.default.MEDIA_ATTACHED, g.default.MEDIA_DETACHING, g.default.MANIFEST_LOADING, g.default.MANIFEST_PARSED, g.default.LEVEL_LOADED, g.default.KEY_LOADED, g.default.FRAG_LOADED, g.default.FRAG_LOAD_EMERGENCY_ABORTED, g.default.FRAG_PARSING_INIT_SEGMENT, g.default.FRAG_PARSING_DATA, g.default.FRAG_PARSED, g.default.ERROR, g.default.AUDIO_TRACK_SWITCHING, g.default.AUDIO_TRACK_SWITCHED, g.default.BUFFER_CREATED, g.default.BUFFER_APPENDED, g.default.BUFFER_FLUSHED) || this;
                    return r.fragmentTracker = t,
                    r.config = e.config,
                    r.audioCodecSwap = !1,
                    r._state = _.State.STOPPED,
                    r.stallReported = !1,
                    r.gapController = null,
                    r
                }
                return t(e, i),
                e.prototype.onHandlerDestroying = function() {
                    this.stopLoad(),
                    i.prototype.onHandlerDestroying.call(this)
                }
                ,
                e.prototype.onHandlerDestroyed = function() {
                    this.state = _.State.STOPPED,
                    this.fragmentTracker = null,
                    i.prototype.onHandlerDestroyed.call(this)
                }
                ,
                e.prototype.startLoad = function(e) {
                    if (this.levels) {
                        var t = this.lastCurrentTime
                          , r = this.hls;
                        if (this.stopLoad(),
                        this.setInterval(100),
                        this.level = -1,
                        this.fragLoadError = 0,
                        !this.startFragRequested) {
                            var i = r.startLevel;
                            -1 === i && (i = 0,
                            this.bitrateTest = !0),
                            this.level = r.nextLoadLevel = i,
                            this.loadedmetadata = !1
                        }
                        0 < t && -1 === e && (v.logger.log("override startPosition with lastCurrentTime @" + t.toFixed(3)),
                        e = t),
                        this.state = _.State.IDLE,
                        this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e,
                        this.tick()
                    } else
                        this.forceStartLoad = !0,
                        this.state = _.State.STOPPED
                }
                ,
                e.prototype.stopLoad = function() {
                    var e = this.fragCurrent;
                    e && (e.loader && e.loader.abort(),
                    this.fragmentTracker.removeFragment(e),
                    this.fragCurrent = null),
                    this.fragPrevious = null,
                    this.demuxer && (this.demuxer.destroy(),
                    this.demuxer = null),
                    this.clearInterval(),
                    this.state = _.State.STOPPED,
                    this.forceStartLoad = !1
                }
                ,
                e.prototype.doTick = function() {
                    switch (this.state) {
                    case _.State.BUFFER_FLUSHING:
                        this.fragLoadError = 0;
                        break;
                    case _.State.IDLE:
                        this._doTickIdle();
                        break;
                    case _.State.WAITING_LEVEL:
                        var e = this.levels[this.level];
                        e && e.details && (this.state = _.State.IDLE);
                        break;
                    case _.State.FRAG_LOADING_WAITING_RETRY:
                        var t = window.performance.now()
                          , r = this.retryDate;
                        (!r || r <= t || this.media && this.media.seeking) && (v.logger.log("mediaController: retryDate reached, switch back to IDLE state"),
                        this.state = _.State.IDLE);
                        break;
                    case _.State.ERROR:
                    case _.State.STOPPED:
                    case _.State.FRAG_LOADING:
                    case _.State.PARSING:
                    case _.State.PARSED:
                    case _.State.ENDED:
                    }
                    this._checkBuffer(),
                    this._checkFragmentChanged()
                }
                ,
                e.prototype._doTickIdle = function() {
                    var e = this.hls
                      , t = e.config
                      , r = this.media;
                    if (void 0 !== this.levelLastLoaded && (r || !this.startFragRequested && t.startFragPrefetch)) {
                        var i;
                        i = this.loadedmetadata ? r.currentTime : this.nextLoadPosition;
                        var a = e.nextLoadLevel
                          , n = this.levels[a];
                        if (n) {
                            var s, o = n.bitrate;
                            s = o ? Math.max(8 * t.maxBufferSize / o, t.maxBufferLength) : t.maxBufferLength,
                            s = Math.min(s, t.maxMaxBufferLength);
                            var l = h.BufferHelper.bufferInfo(this.mediaBuffer ? this.mediaBuffer : r, i, t.maxBufferHole)
                              , u = l.len;
                            if (!(s <= u)) {
                                v.logger.trace("buffer length of " + u.toFixed(3) + " is below max of " + s.toFixed(3) + ". checking for more payload ..."),
                                this.level = e.nextLoadLevel = a;
                                var d = n.details;
                                if (!d || d.live && this.levelLastLoaded !== a)
                                    this.state = _.State.WAITING_LEVEL;
                                else {
                                    if (this._streamEnded(l, d)) {
                                        var c = {};
                                        return this.altAudio && (c.type = "video"),
                                        this.hls.trigger(g.default.BUFFER_EOS, c),
                                        void (this.state = _.State.ENDED)
                                    }
                                    this._fetchPayloadOrEos(i, l, d)
                                }
                            }
                        }
                    }
                }
                ,
                e.prototype._fetchPayloadOrEos = function(e, t, r) {
                    var i = this.fragPrevious
                      , a = this.level
                      , n = r.fragments
                      , s = n.length;
                    if (0 !== s) {
                        var o, l = n[0].start, u = n[s - 1].start + n[s - 1].duration, d = t.end;
                        if (r.initSegment && !r.initSegment.data)
                            o = r.initSegment;
                        else if (r.live) {
                            var c = this.config.initialLiveManifestSize;
                            if (s < c)
                                return void v.logger.warn("Can not start playback of a level, reason: not enough fragments " + s + " < " + c);
                            if (null === (o = this._ensureFragmentAtLivePoint(r, d, l, u, i, n, s)))
                                return
                        } else
                            d < l && (o = n[0],
                            this.media.currentTime = l);
                        o || (o = this._findFragment(l, i, s, n, d, u, r)),
                        o && (o.encrypted ? (v.logger.log("Loading key for " + o.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + a),
                        this._loadKey(o)) : (v.logger.log("Loading " + o.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + a + ", currentTime:" + e.toFixed(3) + ",bufferEnd:" + d.toFixed(3)),
                        this._loadFragment(o)))
                    }
                }
                ,
                e.prototype._ensureFragmentAtLivePoint = function(e, t, r, i, a, n, s) {
                    var o, l = this.hls.config, u = this.media, d = void 0 !== l.liveMaxLatencyDuration ? l.liveMaxLatencyDuration : l.liveMaxLatencyDurationCount * e.targetduration;
                    if (t < Math.max(r - l.maxFragLookUpTolerance, i - d)) {
                        var c = this.liveSyncPosition = this.computeLivePosition(r, e);
                        v.logger.log("buffer end: " + t.toFixed(3) + " is located too far from the end of live sliding playlist, reset currentTime to : " + c.toFixed(3)),
                        t = c,
                        u && u.readyState && u.duration > c && (u.currentTime = c),
                        this.nextLoadPosition = c
                    }
                    if (e.PTSKnown && i < t && u && u.readyState)
                        return null;
                    if (this.startFragRequested && !e.PTSKnown) {
                        if (a)
                            if (e.hasProgramDateTime)
                                v.logger.log("live playlist, switching playlist, load frag with same PDT: " + a.programDateTime),
                                o = y.findFragmentByPDT(n, a.endProgramDateTime, l.maxFragLookUpTolerance);
                            else {
                                var h = a.sn + 1;
                                if (h >= e.startSN && h <= e.endSN) {
                                    var f = n[h - e.startSN];
                                    a.cc === f.cc && (o = f,
                                    v.logger.log("live playlist, switching playlist, load frag with next SN: " + o.sn))
                                }
                                o || (o = p.default.search(n, function(e) {
                                    return a.cc - e.cc
                                })) && v.logger.log("live playlist, switching playlist, load frag with same CC: " + o.sn)
                            }
                        o || (o = n[Math.min(s - 1, Math.round(s / 2))],
                        v.logger.log("live playlist, switching playlist, unknown, load middle frag : " + o.sn))
                    }
                    return o
                }
                ,
                e.prototype._findFragment = function(e, t, r, i, a, n, s) {
                    var o, l = this.hls.config;
                    if (a < n) {
                        var u = a > n - l.maxFragLookUpTolerance ? 0 : l.maxFragLookUpTolerance;
                        o = y.findFragmentByPTS(t, i, a, u)
                    } else
                        o = i[r - 1];
                    if (o) {
                        var d = o.sn - s.startSN
                          , c = t && o.level === t.level
                          , h = i[d - 1]
                          , f = i[1 + d];
                        if (t && o.sn === t.sn)
                            if (c && !o.backtracked)
                                if (o.sn < s.endSN) {
                                    var p = t.deltaPTS;
                                    p && p > l.maxBufferHole && t.dropped && d ? (o = h,
                                    v.logger.warn("SN just loaded, with large PTS gap between audio and video, maybe frag is not starting with a keyframe ? load previous one to try to overcome this")) : (o = f,
                                    v.logger.log("SN just loaded, load next one: " + o.sn, o))
                                } else
                                    o = null;
                            else
                                o.backtracked && (f && f.backtracked ? (v.logger.warn("Already backtracked from fragment " + f.sn + ", will not backtrack to fragment " + o.sn + ". Loading fragment " + f.sn),
                                o = f) : (v.logger.warn("Loaded fragment with dropped frames, backtracking 1 segment to find a keyframe"),
                                o.dropped = 0,
                                h ? (o = h).backtracked = !0 : d && (o = null)))
                    }
                    return o
                }
                ,
                e.prototype._loadKey = function(e) {
                    this.state = _.State.KEY_LOADING,
                    this.hls.trigger(g.default.KEY_LOADING, {
                        frag: e
                    })
                }
                ,
                e.prototype._loadFragment = function(e) {
                    var t = this.fragmentTracker.getState(e);
                    this.fragCurrent = e,
                    this.startFragRequested = !0,
                    u.isFinite(e.sn) && !e.bitrateTest && (this.nextLoadPosition = e.start + e.duration),
                    e.backtracked || t === r.FragmentState.NOT_LOADED || t === r.FragmentState.PARTIAL ? (e.autoLevel = this.hls.autoLevelEnabled,
                    e.bitrateTest = this.bitrateTest,
                    this.hls.trigger(g.default.FRAG_LOADING, {
                        frag: e
                    }),
                    this.demuxer || (this.demuxer = new f.default(this.hls,"main")),
                    this.state = _.State.FRAG_LOADING) : t === r.FragmentState.APPENDING && this._reduceMaxBufferLength(e.duration) && this.fragmentTracker.removeFragment(e)
                }
                ,
                Object.defineProperty(e.prototype, "state", {
                    get: function() {
                        return this._state
                    },
                    set: function(e) {
                        if (this.state !== e) {
                            var t = this.state;
                            this._state = e,
                            v.logger.log("main stream:" + t + "->" + e),
                            this.hls.trigger(g.default.STREAM_STATE_TRANSITION, {
                                previousState: t,
                                nextState: e
                            })
                        }
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e.prototype.getBufferedFrag = function(e) {
                    return this.fragmentTracker.getBufferedFrag(e, a.default.LevelType.MAIN)
                }
                ,
                Object.defineProperty(e.prototype, "currentLevel", {
                    get: function() {
                        var e = this.media;
                        if (e) {
                            var t = this.getBufferedFrag(e.currentTime);
                            if (t)
                                return t.level
                        }
                        return -1
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "nextBufferedFrag", {
                    get: function() {
                        var e = this.media;
                        return e ? this.followingBufferedFrag(this.getBufferedFrag(e.currentTime)) : null
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e.prototype.followingBufferedFrag = function(e) {
                    return e ? this.getBufferedFrag(e.endPTS + .5) : null
                }
                ,
                Object.defineProperty(e.prototype, "nextLevel", {
                    get: function() {
                        var e = this.nextBufferedFrag;
                        return e ? e.level : -1
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e.prototype._checkFragmentChanged = function() {
                    var e, t, r = this.media;
                    if (r && r.readyState && !1 === r.seeking && ((t = r.currentTime) > this.lastCurrentTime && (this.lastCurrentTime = t),
                    h.BufferHelper.isBuffered(r, t) ? e = this.getBufferedFrag(t) : h.BufferHelper.isBuffered(r, t + .1) && (e = this.getBufferedFrag(t + .1)),
                    e)) {
                        var i = e;
                        if (i !== this.fragPlaying) {
                            this.hls.trigger(g.default.FRAG_CHANGED, {
                                frag: i
                            });
                            var a = i.level;
                            this.fragPlaying && this.fragPlaying.level === a || this.hls.trigger(g.default.LEVEL_SWITCHED, {
                                level: a
                            }),
                            this.fragPlaying = i
                        }
                    }
                }
                ,
                e.prototype.immediateLevelSwitch = function() {
                    if (v.logger.log("immediateLevelSwitch"),
                    !this.immediateSwitch) {
                        this.immediateSwitch = !0;
                        var e = this.media
                          , t = void 0;
                        e ? (t = e.paused,
                        e.pause()) : t = !0,
                        this.previouslyPaused = t
                    }
                    var r = this.fragCurrent;
                    r && r.loader && r.loader.abort(),
                    this.fragCurrent = null,
                    this.flushMainBuffer(0, u.POSITIVE_INFINITY)
                }
                ,
                e.prototype.immediateLevelSwitchEnd = function() {
                    var e = this.media;
                    e && e.buffered.length && (this.immediateSwitch = !1,
                    h.BufferHelper.isBuffered(e, e.currentTime) && (e.currentTime -= 1e-4),
                    this.previouslyPaused || e.play())
                }
                ,
                e.prototype.nextLevelSwitch = function() {
                    var e = this.media;
                    if (e && e.readyState) {
                        var t, r = void 0, i = void 0;
                        if ((t = this.getBufferedFrag(e.currentTime)) && 1 < t.startPTS && this.flushMainBuffer(0, t.startPTS - 1),
                        e.paused)
                            r = 0;
                        else {
                            var a = this.hls.nextLoadLevel
                              , n = this.levels[a]
                              , s = this.fragLastKbps;
                            r = s && this.fragCurrent ? this.fragCurrent.duration * n.bitrate / (1e3 * s) + 1 : 0
                        }
                        if ((i = this.getBufferedFrag(e.currentTime + r)) && (i = this.followingBufferedFrag(i))) {
                            var o = this.fragCurrent;
                            o && o.loader && o.loader.abort(),
                            this.fragCurrent = null,
                            this.flushMainBuffer(i.maxStartPTS, u.POSITIVE_INFINITY)
                        }
                    }
                }
                ,
                e.prototype.flushMainBuffer = function(e, t) {
                    this.state = _.State.BUFFER_FLUSHING;
                    var r = {
                        startOffset: e,
                        endOffset: t
                    };
                    this.altAudio && (r.type = "video"),
                    this.hls.trigger(g.default.BUFFER_FLUSHING, r)
                }
                ,
                e.prototype.onMediaAttached = function(e) {
                    var t = this.media = this.mediaBuffer = e.media;
                    this.onvseeking = this.onMediaSeeking.bind(this),
                    this.onvseeked = this.onMediaSeeked.bind(this),
                    this.onvended = this.onMediaEnded.bind(this),
                    t.addEventListener("seeking", this.onvseeking),
                    t.addEventListener("seeked", this.onvseeked),
                    t.addEventListener("ended", this.onvended);
                    var r = this.config;
                    this.levels && r.autoStartLoad && this.hls.startLoad(r.startPosition),
                    this.gapController = new o.default(r,t,this.fragmentTracker,this.hls)
                }
                ,
                e.prototype.onMediaDetaching = function() {
                    var e = this.media;
                    e && e.ended && (v.logger.log("MSE detaching and video ended, reset startPosition"),
                    this.startPosition = this.lastCurrentTime = 0);
                    var t = this.levels;
                    t && t.forEach(function(e) {
                        e.details && e.details.fragments.forEach(function(e) {
                            e.backtracked = void 0
                        })
                    }),
                    e && (e.removeEventListener("seeking", this.onvseeking),
                    e.removeEventListener("seeked", this.onvseeked),
                    e.removeEventListener("ended", this.onvended),
                    this.onvseeking = this.onvseeked = this.onvended = null),
                    this.media = this.mediaBuffer = null,
                    this.loadedmetadata = !1,
                    this.stopLoad()
                }
                ,
                e.prototype.onMediaSeeked = function() {
                    var e = this.media
                      , t = e ? e.currentTime : void 0;
                    u.isFinite(t) && v.logger.log("media seeked to " + t.toFixed(3)),
                    this.tick()
                }
                ,
                e.prototype.onManifestLoading = function() {
                    v.logger.log("trigger BUFFER_RESET"),
                    this.hls.trigger(g.default.BUFFER_RESET),
                    this.fragmentTracker.removeAllFragments(),
                    this.stalled = !1,
                    this.startPosition = this.lastCurrentTime = 0
                }
                ,
                e.prototype.onManifestParsed = function(e) {
                    var t, r = !1, i = !1;
                    e.levels.forEach(function(e) {
                        (t = e.audioCodec) && (-1 !== t.indexOf("mp4a.40.2") && (r = !0),
                        -1 !== t.indexOf("mp4a.40.5") && (i = !0))
                    }),
                    this.audioCodecSwitch = r && i,
                    this.audioCodecSwitch && v.logger.log("both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"),
                    this.levels = e.levels,
                    this.startFragRequested = !1;
                    var a = this.config;
                    (a.autoStartLoad || this.forceStartLoad) && this.hls.startLoad(a.startPosition)
                }
                ,
                e.prototype.onLevelLoaded = function(e) {
                    var t = e.details
                      , r = e.level
                      , i = this.levels[this.levelLastLoaded]
                      , a = this.levels[r]
                      , n = t.totalduration
                      , s = 0;
                    if (v.logger.log("level " + r + " loaded [" + t.startSN + "," + t.endSN + "],duration:" + n),
                    t.live) {
                        var o = a.details;
                        o && 0 < t.fragments.length ? (c.mergeDetails(o, t),
                        s = t.fragments[0].start,
                        this.liveSyncPosition = this.computeLivePosition(s, o),
                        t.PTSKnown && u.isFinite(s) ? v.logger.log("live playlist sliding:" + s.toFixed(3)) : (v.logger.log("live playlist - outdated PTS, unknown sliding"),
                        m.alignStream(this.fragPrevious, i, t))) : (v.logger.log("live playlist - first load, unknown sliding"),
                        t.PTSKnown = !1,
                        m.alignStream(this.fragPrevious, i, t))
                    } else
                        t.PTSKnown = !1;
                    if (a.details = t,
                    this.levelLastLoaded = r,
                    this.hls.trigger(g.default.LEVEL_UPDATED, {
                        details: t,
                        level: r
                    }),
                    !1 === this.startFragRequested) {
                        if (-1 === this.startPosition || -1 === this.lastCurrentTime) {
                            var l = t.startTimeOffset;
                            u.isFinite(l) ? (l < 0 && (v.logger.log("negative start time offset " + l + ", count from end of last fragment"),
                            l = s + n + l),
                            v.logger.log("start time offset found in playlist, adjust startPosition to " + l),
                            this.startPosition = l) : t.live ? (this.startPosition = this.computeLivePosition(s, t),
                            v.logger.log("configure startPosition to " + this.startPosition)) : this.startPosition = 0,
                            this.lastCurrentTime = this.startPosition
                        }
                        this.nextLoadPosition = this.startPosition
                    }
                    this.state === _.State.WAITING_LEVEL && (this.state = _.State.IDLE),
                    this.tick()
                }
                ,
                e.prototype.onKeyLoaded = function() {
                    this.state === _.State.KEY_LOADING && (this.state = _.State.IDLE,
                    this.tick())
                }
                ,
                e.prototype.onFragLoaded = function(e) {
                    var t = this.fragCurrent
                      , r = this.hls
                      , i = this.levels
                      , a = this.media
                      , n = e.frag;
                    if (this.state === _.State.FRAG_LOADING && t && "main" === n.type && n.level === t.level && n.sn === t.sn) {
                        var s = e.stats
                          , o = i[t.level]
                          , l = o.details;
                        if (this.bitrateTest = !1,
                        this.stats = s,
                        v.logger.log("Loaded " + t.sn + " of [" + l.startSN + " ," + l.endSN + "],level " + t.level),
                        n.bitrateTest && r.nextLoadLevel)
                            this.state = _.State.IDLE,
                            this.startFragRequested = !1,
                            s.tparsed = s.tbuffered = window.performance.now(),
                            r.trigger(g.default.FRAG_BUFFERED, {
                                stats: s,
                                frag: t,
                                id: "main"
                            }),
                            this.tick();
                        else if ("initSegment" === n.sn)
                            this.state = _.State.IDLE,
                            s.tparsed = s.tbuffered = window.performance.now(),
                            l.initSegment.data = e.payload,
                            r.trigger(g.default.FRAG_BUFFERED, {
                                stats: s,
                                frag: t,
                                id: "main"
                            }),
                            this.tick();
                        else {
                            v.logger.log("Parsing " + t.sn + " of [" + l.startSN + " ," + l.endSN + "],level " + t.level + ", cc " + t.cc),
                            this.state = _.State.PARSING,
                            this.pendingBuffering = !0,
                            this.appended = !1,
                            n.bitrateTest && (n.bitrateTest = !1,
                            this.fragmentTracker.onFragLoaded({
                                frag: n
                            }));
                            var u = !(a && a.seeking) && (l.PTSKnown || !l.live)
                              , d = l.initSegment ? l.initSegment.data : []
                              , c = this._getAudioCodec(o);
                            (this.demuxer = this.demuxer || new f.default(this.hls,"main")).push(e.payload, d, c, o.videoCodec, t, l.totalduration, u, void 0, e.url)
                        }
                    }
                    this.fragLoadError = 0
                }
                ,
                e.prototype.onFragParsingInitSegment = function(e) {
                    var t = this.fragCurrent
                      , r = e.frag;
                    if (t && "main" === e.id && r.sn === t.sn && r.level === t.level && this.state === _.State.PARSING) {
                        var i = e.tracks
                          , a = void 0
                          , n = void 0;
                        if (i.audio && this.altAudio && delete i.audio,
                        n = i.audio) {
                            var s = this.levels[this.level].audioCodec
                              , o = navigator.userAgent.toLowerCase();
                            s && this.audioCodecSwap && (v.logger.log("swapping playlist audio codec"),
                            s = -1 !== s.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5"),
                            this.audioCodecSwitch && 1 !== n.metadata.channelCount && -1 === o.indexOf("firefox") && (s = "mp4a.40.5"),
                            -1 !== o.indexOf("android") && "audio/mpeg" !== n.container && (s = "mp4a.40.2",
                            v.logger.log("Android: force audio codec to " + s)),
                            n.levelCodec = s,
                            n.id = e.id
                        }
                        for (a in (n = i.video) && (n.levelCodec = this.levels[this.level].videoCodec,
                        n.id = e.id),
                        this.hls.trigger(g.default.BUFFER_CODECS, i),
                        i) {
                            n = i[a],
                            v.logger.log("main track:" + a + ",container:" + n.container + ",codecs[level/parsed]=[" + n.levelCodec + "/" + n.codec + "]");
                            var l = n.initSegment;
                            l && (this.appended = !0,
                            this.pendingBuffering = !0,
                            this.hls.trigger(g.default.BUFFER_APPENDING, {
                                type: a,
                                data: l,
                                parent: "main",
                                content: "initSegment"
                            }))
                        }
                        this.tick()
                    }
                }
                ,
                e.prototype.onFragParsingData = function(t) {
                    var r = this
                      , e = this.fragCurrent
                      , i = t.frag;
                    if (e && "main" === t.id && i.sn === e.sn && i.level === e.level && ("audio" !== t.type || !this.altAudio) && this.state === _.State.PARSING) {
                        var a = this.levels[this.level]
                          , n = e;
                        if (u.isFinite(t.endPTS) || (t.endPTS = t.startPTS + e.duration,
                        t.endDTS = t.startDTS + e.duration),
                        !0 === t.hasAudio && n.addElementaryStream(d.default.ElementaryStreamTypes.AUDIO),
                        !0 === t.hasVideo && n.addElementaryStream(d.default.ElementaryStreamTypes.VIDEO),
                        v.logger.log("Parsed " + t.type + ",PTS:[" + t.startPTS.toFixed(3) + "," + t.endPTS.toFixed(3) + "],DTS:[" + t.startDTS.toFixed(3) + "/" + t.endDTS.toFixed(3) + "],nb:" + t.nb + ",dropped:" + (t.dropped || 0)),
                        "video" === t.type)
                            if (n.dropped = t.dropped,
                            n.dropped)
                                if (n.backtracked)
                                    v.logger.warn("Already backtracked on this fragment, appending with the gap", n.sn);
                                else {
                                    var s = a.details;
                                    if (!s || n.sn !== s.startSN)
                                        return v.logger.warn("missing video frame(s), backtracking fragment", n.sn),
                                        this.fragmentTracker.removeFragment(n),
                                        n.backtracked = !0,
                                        this.nextLoadPosition = t.startPTS,
                                        this.state = _.State.IDLE,
                                        this.fragPrevious = n,
                                        void this.tick();
                                    v.logger.warn("missing video frame(s) on first frag, appending with gap", n.sn)
                                }
                            else
                                n.backtracked = !1;
                        var o = c.updateFragPTSDTS(a.details, n, t.startPTS, t.endPTS, t.startDTS, t.endDTS)
                          , l = this.hls;
                        l.trigger(g.default.LEVEL_PTS_UPDATED, {
                            details: a.details,
                            level: this.level,
                            drift: o,
                            type: t.type,
                            start: t.startPTS,
                            end: t.endPTS
                        }),
                        [t.data1, t.data2].forEach(function(e) {
                            e && e.length && r.state === _.State.PARSING && (r.appended = !0,
                            r.pendingBuffering = !0,
                            l.trigger(g.default.BUFFER_APPENDING, {
                                type: t.type,
                                data: e,
                                parent: "main",
                                content: "data"
                            }))
                        }),
                        this.tick()
                    }
                }
                ,
                e.prototype.onFragParsed = function(e) {
                    var t = this.fragCurrent
                      , r = e.frag;
                    t && "main" === e.id && r.sn === t.sn && r.level === t.level && this.state === _.State.PARSING && (this.stats.tparsed = window.performance.now(),
                    this.state = _.State.PARSED,
                    this._checkAppendedParsed())
                }
                ,
                e.prototype.onAudioTrackSwitching = function(e) {
                    var t = !!e.url
                      , r = e.id;
                    if (!t) {
                        if (this.mediaBuffer !== this.media) {
                            v.logger.log("switching on main audio, use media.buffered to schedule main fragment loading"),
                            this.mediaBuffer = this.media;
                            var i = this.fragCurrent;
                            i.loader && (v.logger.log("switching to main audio track, cancel main fragment load"),
                            i.loader.abort()),
                            this.fragCurrent = null,
                            this.fragPrevious = null,
                            this.demuxer && (this.demuxer.destroy(),
                            this.demuxer = null),
                            this.state = _.State.IDLE
                        }
                        var a = this.hls;
                        a.trigger(g.default.BUFFER_FLUSHING, {
                            startOffset: 0,
                            endOffset: u.POSITIVE_INFINITY,
                            type: "audio"
                        }),
                        a.trigger(g.default.AUDIO_TRACK_SWITCHED, {
                            id: r
                        }),
                        this.altAudio = !1
                    }
                }
                ,
                e.prototype.onAudioTrackSwitched = function(e) {
                    var t = e.id
                      , r = !!this.hls.audioTracks[t].url;
                    if (r) {
                        var i = this.videoBuffer;
                        i && this.mediaBuffer !== i && (v.logger.log("switching on alternate audio, use video.buffered to schedule main fragment loading"),
                        this.mediaBuffer = i)
                    }
                    this.altAudio = r,
                    this.tick()
                }
                ,
                e.prototype.onBufferCreated = function(e) {
                    var t, r, i = e.tracks, a = !1;
                    for (var n in i) {
                        var s = i[n];
                        "main" === s.id ? (t = s,
                        "video" === (r = n) && (this.videoBuffer = i[n].buffer)) : a = !0
                    }
                    a && t ? (v.logger.log("alternate track found, use " + r + ".buffered to schedule main fragment loading"),
                    this.mediaBuffer = t.buffer) : this.mediaBuffer = this.media
                }
                ,
                e.prototype.onBufferAppended = function(e) {
                    if ("main" === e.parent) {
                        var t = this.state;
                        t !== _.State.PARSING && t !== _.State.PARSED || (this.pendingBuffering = 0 < e.pending,
                        this._checkAppendedParsed())
                    }
                }
                ,
                e.prototype._checkAppendedParsed = function() {
                    if (!(this.state !== _.State.PARSED || this.appended && this.pendingBuffering)) {
                        var e = this.fragCurrent;
                        if (e) {
                            var t = this.mediaBuffer ? this.mediaBuffer : this.media;
                            v.logger.log("main buffered : " + n.default.toString(t.buffered)),
                            this.fragPrevious = e;
                            var r = this.stats;
                            r.tbuffered = window.performance.now(),
                            this.fragLastKbps = Math.round(8 * r.total / (r.tbuffered - r.tfirst)),
                            this.hls.trigger(g.default.FRAG_BUFFERED, {
                                stats: r,
                                frag: e,
                                id: "main"
                            }),
                            this.state = _.State.IDLE
                        }
                        this.tick()
                    }
                }
                ,
                e.prototype.onError = function(e) {
                    var t = e.frag || this.fragCurrent;
                    if (!t || "main" === t.type) {
                        var r = !!this.media && h.BufferHelper.isBuffered(this.media, this.media.currentTime) && h.BufferHelper.isBuffered(this.media, this.media.currentTime + .5);
                        switch (e.details) {
                        case s.ErrorDetails.FRAG_LOAD_ERROR:
                        case s.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        case s.ErrorDetails.KEY_LOAD_ERROR:
                        case s.ErrorDetails.KEY_LOAD_TIMEOUT:
                            if (!e.fatal)
                                if (this.fragLoadError + 1 <= this.config.fragLoadingMaxRetry) {
                                    var i = Math.min(Math.pow(2, this.fragLoadError) * this.config.fragLoadingRetryDelay, this.config.fragLoadingMaxRetryTimeout);
                                    v.logger.warn("mediaController: frag loading failed, retry in " + i + " ms"),
                                    this.retryDate = window.performance.now() + i,
                                    this.loadedmetadata || (this.startFragRequested = !1,
                                    this.nextLoadPosition = this.startPosition),
                                    this.fragLoadError++,
                                    this.state = _.State.FRAG_LOADING_WAITING_RETRY
                                } else
                                    v.logger.error("mediaController: " + e.details + " reaches max retry, redispatch as fatal ..."),
                                    e.fatal = !0,
                                    this.state = _.State.ERROR;
                            break;
                        case s.ErrorDetails.LEVEL_LOAD_ERROR:
                        case s.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                            this.state !== _.State.ERROR && (e.fatal ? (this.state = _.State.ERROR,
                            v.logger.warn("streamController: " + e.details + ",switch to " + this.state + " state ...")) : e.levelRetry || this.state !== _.State.WAITING_LEVEL || (this.state = _.State.IDLE));
                            break;
                        case s.ErrorDetails.BUFFER_FULL_ERROR:
                            "main" !== e.parent || this.state !== _.State.PARSING && this.state !== _.State.PARSED || (r ? (this._reduceMaxBufferLength(this.config.maxBufferLength),
                            this.state = _.State.IDLE) : (v.logger.warn("buffer full error also media.currentTime is not buffered, flush everything"),
                            this.fragCurrent = null,
                            this.flushMainBuffer(0, u.POSITIVE_INFINITY)))
                        }
                    }
                }
                ,
                e.prototype._reduceMaxBufferLength = function(e) {
                    var t = this.config;
                    return t.maxMaxBufferLength >= e && (t.maxMaxBufferLength /= 2,
                    v.logger.warn("main:reduce max buffer length to " + t.maxMaxBufferLength + "s"),
                    !0)
                }
                ,
                e.prototype._checkBuffer = function() {
                    var e = this.media;
                    if (e && 0 !== e.readyState) {
                        var t = (this.mediaBuffer ? this.mediaBuffer : e).buffered;
                        !this.loadedmetadata && t.length ? (this.loadedmetadata = !0,
                        this._seekToStartPos()) : this.immediateSwitch ? this.immediateLevelSwitchEnd() : this.gapController.poll(this.lastCurrentTime, t)
                    }
                }
                ,
                e.prototype.onFragLoadEmergencyAborted = function() {
                    this.state = _.State.IDLE,
                    this.loadedmetadata || (this.startFragRequested = !1,
                    this.nextLoadPosition = this.startPosition),
                    this.tick()
                }
                ,
                e.prototype.onBufferFlushed = function() {
                    var e = this.mediaBuffer ? this.mediaBuffer : this.media;
                    e && this.fragmentTracker.detectEvictedFragments(d.default.ElementaryStreamTypes.VIDEO, e.buffered),
                    this.state = _.State.IDLE,
                    this.fragPrevious = null
                }
                ,
                e.prototype.swapAudioCodec = function() {
                    this.audioCodecSwap = !this.audioCodecSwap
                }
                ,
                e.prototype.computeLivePosition = function(e, t) {
                    var r = void 0 !== this.config.liveSyncDuration ? this.config.liveSyncDuration : this.config.liveSyncDurationCount * t.targetduration;
                    return e + Math.max(0, t.totalduration - r)
                }
                ,
                e.prototype._seekToStartPos = function() {
                    var e = this.media
                      , t = e.currentTime
                      , r = e.seeking ? t : this.startPosition;
                    t !== r && (v.logger.log("target start position not buffered, seek to buffered.start(0) " + r + " from current time " + t + " "),
                    e.currentTime = r)
                }
                ,
                e.prototype._getAudioCodec = function(e) {
                    var t = this.config.defaultAudioCodec || e.audioCodec;
                    return this.audioCodecSwap && (v.logger.log("swapping playlist audio codec"),
                    t && (t = -1 !== t.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5")),
                    t
                }
                ,
                Object.defineProperty(e.prototype, "liveSyncPosition", {
                    get: function() {
                        return this._liveSyncPosition
                    },
                    set: function(e) {
                        this._liveSyncPosition = e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e
            }(_.default);
            l.default = e
        }
        ).call(this, E(2).Number)
    }
    , function(e, t, f) {
        function o(r) {
            var i = {};
            function a(e) {
                if (i[e])
                    return i[e].exports;
                var t = i[e] = {
                    i: e,
                    l: !1,
                    exports: {}
                };
                return r[e].call(t.exports, t, t.exports, a),
                t.l = !0,
                t.exports
            }
            a.m = r,
            a.c = i,
            a.i = function(e) {
                return e
            }
            ,
            a.d = function(e, t, r) {
                a.o(e, t) || Object.defineProperty(e, t, {
                    configurable: !1,
                    enumerable: !0,
                    get: r
                })
            }
            ,
            a.r = function(e) {
                Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            }
            ,
            a.n = function(e) {
                var t = e && e.__esModule ? function() {
                    return e.default
                }
                : function() {
                    return e
                }
                ;
                return a.d(t, "a", t),
                t
            }
            ,
            a.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }
            ,
            a.p = "/",
            a.oe = function(e) {
                throw console.error(e),
                e
            }
            ;
            var e = a(a.s = ENTRY_MODULE);
            return e.default || e
        }
        var p = "[\\.|\\-|\\+|\\w|/|@]+"
          , g = "\\((/\\*.*?\\*/)?s?.*?(" + p + ").*?\\)";
        function v(e) {
            return (e + "").replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
        }
        function m(e, t, r) {
            var i = {};
            i[r] = [];
            var a, n = t.toString(), s = n.match(/^function\s?\(\w+,\s*\w+,\s*(\w+)\)/);
            if (!s)
                return i;
            for (var o, l = s[1], u = new RegExp("(\\\\n|\\W)" + v(l) + g,"g"); o = u.exec(n); )
                "dll-reference" !== o[3] && i[r].push(o[3]);
            for (u = new RegExp("\\(" + v(l) + '\\("(dll-reference\\s(' + p + '))"\\)\\)' + g,"g"); o = u.exec(n); )
                e[o[2]] || (i[r].push(o[1]),
                e[o[2]] = f(o[1]).m),
                i[o[2]] = i[o[2]] || [],
                i[o[2]].push(o[4]);
            for (var d = Object.keys(i), c = 0; c < d.length; c++)
                for (var h = 0; h < i[d[c]].length; h++)
                    a = i[d[c]][h],
                    !isNaN(1 * a) && (i[d[c]][h] = 1 * i[d[c]][h]);
            return i
        }
        function y(r) {
            return Object.keys(r).reduce(function(e, t) {
                return e || 0 < r[t].length
            }, !1)
        }
        e.exports = function(h, e) {
            e = e || {};
            var r = {
                main: f.m
            }
              , i = e.all ? {
                main: Object.keys(r.main)
            } : function(e, t) {
                for (var r = {
                    main: [h]
                }, i = {
                    main: []
                }, a = {
                    main: {}
                }; y(r); )
                    for (var n = Object.keys(r), s = 0; s < n.length; s++) {
                        var o = n[s]
                          , l = r[o].pop();
                        if (a[o] = a[o] || {},
                        !a[o][l] && e[o][l]) {
                            a[o][l] = !0,
                            i[o] = i[o] || [],
                            i[o].push(l);
                            for (var u = m(e, e[o][l], o), d = Object.keys(u), c = 0; c < d.length; c++)
                                r[d[c]] = r[d[c]] || [],
                                r[d[c]] = r[d[c]].concat(u[d[c]])
                        }
                    }
                return i
            }(r)
              , a = "";
            Object.keys(i).filter(function(e) {
                return "main" !== e
            }).forEach(function(t) {
                for (var e = 0; i[t][e]; )
                    e++;
                i[t].push(e),
                r[t][e] = "(function(module, exports, __webpack_require__) { module.exports = __webpack_require__; })",
                a = a + "var " + t + " = (" + o.toString().replace("ENTRY_MODULE", JSON.stringify(e)) + ")({" + i[t].map(function(e) {
                    return JSON.stringify(e) + ": " + r[t][e].toString()
                }).join(",") + "});\n"
            }),
            a = a + "new ((" + o.toString().replace("ENTRY_MODULE", JSON.stringify(h)) + ")({" + i.main.map(function(e) {
                return JSON.stringify(e) + ": " + r.main[e].toString()
            }).join(",") + "}))(self);";
            var t = new window.Blob([a],{
                type: "text/javascript"
            });
            if (e.bare)
                return t;
            var n = (window.URL || window.webkitURL || window.mozURL || window.msURL).createObjectURL(t)
              , s = new window.Worker(n);
            return s.objectURL = n,
            s
        }
    }
    , function(e, t, r) {
        var d, i, a, n, s, c, o, l, u, h, f, p, g, v, m, y, _, E, S, T, b, A, R, D, k, w, L, O, C, I, P, x, F, M, B, N, U, G, H, j, K, W, z, V, Y, q, X, $, Q, J, Z, ee, te, re, ie, ae, ne, se, oe, le, ue, de, ce, he, fe, pe, ge, ve, me, ye, _e, Ee, Se, Te, be, Ae, Re, De, ke, we, Le, Oe;
        e.exports = (Oe = Oe || (d = Math,
        i = Object.create || function() {
            function r() {}
            return function(e) {
                var t;
                return r.prototype = e,
                t = new r,
                r.prototype = null,
                t
            }
        }(),
        n = (a = {}).lib = {},
        s = n.Base = {
            extend: function(e) {
                var t = i(this);
                return e && t.mixIn(e),
                t.hasOwnProperty("init") && this.init !== t.init || (t.init = function() {
                    t.$super.init.apply(this, arguments)
                }
                ),
                (t.init.prototype = t).$super = this,
                t
            },
            create: function() {
                var e = this.extend();
                return e.init.apply(e, arguments),
                e
            },
            init: function() {},
            mixIn: function(e) {
                for (var t in e)
                    e.hasOwnProperty(t) && (this[t] = e[t]);
                e.hasOwnProperty("toString") && (this.toString = e.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        c = n.WordArray = s.extend({
            init: function(e, t) {
                e = this.words = e || [],
                this.sigBytes = null != t ? t : 4 * e.length
            },
            toString: function(e) {
                return (e || l).stringify(this)
            },
            concat: function(e) {
                var t = this.words
                  , r = e.words
                  , i = this.sigBytes
                  , a = e.sigBytes;
                if (this.clamp(),
                i % 4)
                    for (var n = 0; n < a; n++) {
                        var s = r[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                        t[i + n >>> 2] |= s << 24 - (i + n) % 4 * 8
                    }
                else
                    for (n = 0; n < a; n += 4)
                        t[i + n >>> 2] = r[n >>> 2];
                return this.sigBytes += a,
                this
            },
            clamp: function() {
                var e = this.words
                  , t = this.sigBytes;
                e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8,
                e.length = d.ceil(t / 4)
            },
            clone: function() {
                var e = s.clone.call(this);
                return e.words = this.words.slice(0),
                e
            },
            random: function(e) {
                function t(t) {
                    t = t;
                    var r = 987654321
                      , i = 4294967295;
                    return function() {
                        var e = ((r = 36969 * (65535 & r) + (r >> 16) & i) << 16) + (t = 18e3 * (65535 & t) + (t >> 16) & i) & i;
                        return e /= 4294967296,
                        (e += .5) * (.5 < d.random() ? 1 : -1)
                    }
                }
                for (var r, i = [], a = 0; a < e; a += 4) {
                    var n = t(4294967296 * (r || d.random()));
                    r = 987654071 * n(),
                    i.push(4294967296 * n() | 0)
                }
                return new c.init(i,e)
            }
        }),
        o = a.enc = {},
        l = o.Hex = {
            stringify: function(e) {
                for (var t = e.words, r = e.sigBytes, i = [], a = 0; a < r; a++) {
                    var n = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                    i.push((n >>> 4).toString(16)),
                    i.push((15 & n).toString(16))
                }
                return i.join("")
            },
            parse: function(e) {
                for (var t = e.length, r = [], i = 0; i < t; i += 2)
                    r[i >>> 3] |= parseInt(e.substr(i, 2), 16) << 24 - i % 8 * 4;
                return new c.init(r,t / 2)
            }
        },
        u = o.Latin1 = {
            stringify: function(e) {
                for (var t = e.words, r = e.sigBytes, i = [], a = 0; a < r; a++) {
                    var n = t[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                    i.push(String.fromCharCode(n))
                }
                return i.join("")
            },
            parse: function(e) {
                for (var t = e.length, r = [], i = 0; i < t; i++)
                    r[i >>> 2] |= (255 & e.charCodeAt(i)) << 24 - i % 4 * 8;
                return new c.init(r,t)
            }
        },
        h = o.Utf8 = {
            stringify: function(e) {
                try {
                    return decodeURIComponent(escape(u.stringify(e)))
                } catch (e) {
                    throw new Error("Malformed UTF-8 data")
                }
            },
            parse: function(e) {
                return u.parse(unescape(encodeURIComponent(e)))
            }
        },
        f = n.BufferedBlockAlgorithm = s.extend({
            reset: function() {
                this._data = new c.init,
                this._nDataBytes = 0
            },
            _append: function(e) {
                "string" == typeof e && (e = h.parse(e)),
                this._data.concat(e),
                this._nDataBytes += e.sigBytes
            },
            _process: function(e) {
                var t = this._data
                  , r = t.words
                  , i = t.sigBytes
                  , a = this.blockSize
                  , n = i / (4 * a)
                  , s = (n = e ? d.ceil(n) : d.max((0 | n) - this._minBufferSize, 0)) * a
                  , o = d.min(4 * s, i);
                if (s) {
                    for (var l = 0; l < s; l += a)
                        this._doProcessBlock(r, l);
                    var u = r.splice(0, s);
                    t.sigBytes -= o
                }
                return new c.init(u,o)
            },
            clone: function() {
                var e = s.clone.call(this);
                return e._data = this._data.clone(),
                e
            },
            _minBufferSize: 0
        }),
        n.Hasher = f.extend({
            cfg: s.extend(),
            init: function(e) {
                this.cfg = this.cfg.extend(e),
                this.reset()
            },
            reset: function() {
                f.reset.call(this),
                this._doReset()
            },
            update: function(e) {
                return this._append(e),
                this._process(),
                this
            },
            finalize: function(e) {
                return e && this._append(e),
                this._doFinalize()
            },
            blockSize: 16,
            _createHelper: function(r) {
                return function(e, t) {
                    return new r.init(t).finalize(e)
                }
            },
            _createHmacHelper: function(r) {
                return function(e, t) {
                    return new p.HMAC.init(r,t).finalize(e)
                }
            }
        }),
        p = a.algo = {},
        a),
        Le = (we = Oe).lib.WordArray,
        we.enc.Base64 = {
            stringify: function(e) {
                var t = e.words
                  , r = e.sigBytes
                  , i = this._map;
                e.clamp();
                for (var a = [], n = 0; n < r; n += 3)
                    for (var s = (t[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 16 | (t[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255) << 8 | t[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255, o = 0; o < 4 && n + .75 * o < r; o++)
                        a.push(i.charAt(s >>> 6 * (3 - o) & 63));
                var l = i.charAt(64);
                if (l)
                    for (; a.length % 4; )
                        a.push(l);
                return a.join("")
            },
            parse: function(e) {
                var t = e.length
                  , r = this._map
                  , i = this._reverseMap;
                if (!i) {
                    i = this._reverseMap = [];
                    for (var a = 0; a < r.length; a++)
                        i[r.charCodeAt(a)] = a
                }
                var n = r.charAt(64);
                if (n) {
                    var s = e.indexOf(n);
                    -1 !== s && (t = s)
                }
                return function(e, t, r) {
                    for (var i = [], a = 0, n = 0; n < t; n++)
                        if (n % 4) {
                            var s = r[e.charCodeAt(n - 1)] << n % 4 * 2
                              , o = r[e.charCodeAt(n)] >>> 6 - n % 4 * 2;
                            i[a >>> 2] |= (s | o) << 24 - a % 4 * 8,
                            a++
                        }
                    return Le.create(i, a)
                }(e, t, i)
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        },
        function(d) {
            var e = Oe
              , t = e.lib
              , r = t.WordArray
              , i = t.Hasher
              , a = e.algo
              , D = [];
            !function() {
                for (var e = 0; e < 64; e++)
                    D[e] = 4294967296 * d.abs(d.sin(e + 1)) | 0
            }();
            var n = a.MD5 = i.extend({
                _doReset: function() {
                    this._hash = new r.init([1732584193, 4023233417, 2562383102, 271733878])
                },
                _doProcessBlock: function(e, t) {
                    for (var r = 0; r < 16; r++) {
                        var i = t + r
                          , a = e[i];
                        e[i] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                    }
                    var n = this._hash.words
                      , s = e[t + 0]
                      , o = e[t + 1]
                      , l = e[t + 2]
                      , u = e[t + 3]
                      , d = e[t + 4]
                      , c = e[t + 5]
                      , h = e[t + 6]
                      , f = e[t + 7]
                      , p = e[t + 8]
                      , g = e[t + 9]
                      , v = e[t + 10]
                      , m = e[t + 11]
                      , y = e[t + 12]
                      , _ = e[t + 13]
                      , E = e[t + 14]
                      , S = e[t + 15]
                      , T = n[0]
                      , b = n[1]
                      , A = n[2]
                      , R = n[3];
                    b = O(b = O(b = O(b = O(b = L(b = L(b = L(b = L(b = w(b = w(b = w(b = w(b = k(b = k(b = k(b = k(b, A = k(A, R = k(R, T = k(T, b, A, R, s, 7, D[0]), b, A, o, 12, D[1]), T, b, l, 17, D[2]), R, T, u, 22, D[3]), A = k(A, R = k(R, T = k(T, b, A, R, d, 7, D[4]), b, A, c, 12, D[5]), T, b, h, 17, D[6]), R, T, f, 22, D[7]), A = k(A, R = k(R, T = k(T, b, A, R, p, 7, D[8]), b, A, g, 12, D[9]), T, b, v, 17, D[10]), R, T, m, 22, D[11]), A = k(A, R = k(R, T = k(T, b, A, R, y, 7, D[12]), b, A, _, 12, D[13]), T, b, E, 17, D[14]), R, T, S, 22, D[15]), A = w(A, R = w(R, T = w(T, b, A, R, o, 5, D[16]), b, A, h, 9, D[17]), T, b, m, 14, D[18]), R, T, s, 20, D[19]), A = w(A, R = w(R, T = w(T, b, A, R, c, 5, D[20]), b, A, v, 9, D[21]), T, b, S, 14, D[22]), R, T, d, 20, D[23]), A = w(A, R = w(R, T = w(T, b, A, R, g, 5, D[24]), b, A, E, 9, D[25]), T, b, u, 14, D[26]), R, T, p, 20, D[27]), A = w(A, R = w(R, T = w(T, b, A, R, _, 5, D[28]), b, A, l, 9, D[29]), T, b, f, 14, D[30]), R, T, y, 20, D[31]), A = L(A, R = L(R, T = L(T, b, A, R, c, 4, D[32]), b, A, p, 11, D[33]), T, b, m, 16, D[34]), R, T, E, 23, D[35]), A = L(A, R = L(R, T = L(T, b, A, R, o, 4, D[36]), b, A, d, 11, D[37]), T, b, f, 16, D[38]), R, T, v, 23, D[39]), A = L(A, R = L(R, T = L(T, b, A, R, _, 4, D[40]), b, A, s, 11, D[41]), T, b, u, 16, D[42]), R, T, h, 23, D[43]), A = L(A, R = L(R, T = L(T, b, A, R, g, 4, D[44]), b, A, y, 11, D[45]), T, b, S, 16, D[46]), R, T, l, 23, D[47]), A = O(A, R = O(R, T = O(T, b, A, R, s, 6, D[48]), b, A, f, 10, D[49]), T, b, E, 15, D[50]), R, T, c, 21, D[51]), A = O(A, R = O(R, T = O(T, b, A, R, y, 6, D[52]), b, A, u, 10, D[53]), T, b, v, 15, D[54]), R, T, o, 21, D[55]), A = O(A, R = O(R, T = O(T, b, A, R, p, 6, D[56]), b, A, S, 10, D[57]), T, b, h, 15, D[58]), R, T, _, 21, D[59]), A = O(A, R = O(R, T = O(T, b, A, R, d, 6, D[60]), b, A, m, 10, D[61]), T, b, l, 15, D[62]), R, T, g, 21, D[63]),
                    n[0] = n[0] + T | 0,
                    n[1] = n[1] + b | 0,
                    n[2] = n[2] + A | 0,
                    n[3] = n[3] + R | 0
                },
                _doFinalize: function() {
                    var e = this._data
                      , t = e.words
                      , r = 8 * this._nDataBytes
                      , i = 8 * e.sigBytes;
                    t[i >>> 5] |= 128 << 24 - i % 32;
                    var a = d.floor(r / 4294967296)
                      , n = r;
                    t[15 + (64 + i >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                    t[14 + (64 + i >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                    e.sigBytes = 4 * (t.length + 1),
                    this._process();
                    for (var s = this._hash, o = s.words, l = 0; l < 4; l++) {
                        var u = o[l];
                        o[l] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8)
                    }
                    return s
                },
                clone: function() {
                    var e = i.clone.call(this);
                    return e._hash = this._hash.clone(),
                    e
                }
            });
            function k(e, t, r, i, a, n, s) {
                var o = e + (t & r | ~t & i) + a + s;
                return (o << n | o >>> 32 - n) + t
            }
            function w(e, t, r, i, a, n, s) {
                var o = e + (t & i | r & ~i) + a + s;
                return (o << n | o >>> 32 - n) + t
            }
            function L(e, t, r, i, a, n, s) {
                var o = e + (t ^ r ^ i) + a + s;
                return (o << n | o >>> 32 - n) + t
            }
            function O(e, t, r, i, a, n, s) {
                var o = e + (r ^ (t | ~i)) + a + s;
                return (o << n | o >>> 32 - n) + t
            }
            e.MD5 = i._createHelper(n),
            e.HmacMD5 = i._createHmacHelper(n)
        }(Math),
        be = (Te = Oe).lib,
        Ae = be.WordArray,
        Re = be.Hasher,
        De = [],
        ke = Te.algo.SHA1 = Re.extend({
            _doReset: function() {
                this._hash = new Ae.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(e, t) {
                for (var r = this._hash.words, i = r[0], a = r[1], n = r[2], s = r[3], o = r[4], l = 0; l < 80; l++) {
                    if (l < 16)
                        De[l] = 0 | e[t + l];
                    else {
                        var u = De[l - 3] ^ De[l - 8] ^ De[l - 14] ^ De[l - 16];
                        De[l] = u << 1 | u >>> 31
                    }
                    var d = (i << 5 | i >>> 27) + o + De[l];
                    d += l < 20 ? 1518500249 + (a & n | ~a & s) : l < 40 ? 1859775393 + (a ^ n ^ s) : l < 60 ? (a & n | a & s | n & s) - 1894007588 : (a ^ n ^ s) - 899497514,
                    o = s,
                    s = n,
                    n = a << 30 | a >>> 2,
                    a = i,
                    i = d
                }
                r[0] = r[0] + i | 0,
                r[1] = r[1] + a | 0,
                r[2] = r[2] + n | 0,
                r[3] = r[3] + s | 0,
                r[4] = r[4] + o | 0
            },
            _doFinalize: function() {
                var e = this._data
                  , t = e.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * e.sigBytes;
                return t[i >>> 5] |= 128 << 24 - i % 32,
                t[14 + (64 + i >>> 9 << 4)] = Math.floor(r / 4294967296),
                t[15 + (64 + i >>> 9 << 4)] = r,
                e.sigBytes = 4 * t.length,
                this._process(),
                this._hash
            },
            clone: function() {
                var e = Re.clone.call(this);
                return e._hash = this._hash.clone(),
                e
            }
        }),
        Te.SHA1 = Re._createHelper(ke),
        Te.HmacSHA1 = Re._createHmacHelper(ke),
        function(a) {
            var e = Oe
              , t = e.lib
              , r = t.WordArray
              , i = t.Hasher
              , n = e.algo
              , s = []
              , _ = [];
            !function() {
                function e(e) {
                    for (var t = a.sqrt(e), r = 2; r <= t; r++)
                        if (!(e % r))
                            return !1;
                    return !0
                }
                function t(e) {
                    return 4294967296 * (e - (0 | e)) | 0
                }
                for (var r = 2, i = 0; i < 64; )
                    e(r) && (i < 8 && (s[i] = t(a.pow(r, .5))),
                    _[i] = t(a.pow(r, 1 / 3)),
                    i++),
                    r++
            }();
            var E = []
              , o = n.SHA256 = i.extend({
                _doReset: function() {
                    this._hash = new r.init(s.slice(0))
                },
                _doProcessBlock: function(e, t) {
                    for (var r = this._hash.words, i = r[0], a = r[1], n = r[2], s = r[3], o = r[4], l = r[5], u = r[6], d = r[7], c = 0; c < 64; c++) {
                        if (c < 16)
                            E[c] = 0 | e[t + c];
                        else {
                            var h = E[c - 15]
                              , f = (h << 25 | h >>> 7) ^ (h << 14 | h >>> 18) ^ h >>> 3
                              , p = E[c - 2]
                              , g = (p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10;
                            E[c] = f + E[c - 7] + g + E[c - 16]
                        }
                        var v = i & a ^ i & n ^ a & n
                          , m = (i << 30 | i >>> 2) ^ (i << 19 | i >>> 13) ^ (i << 10 | i >>> 22)
                          , y = d + ((o << 26 | o >>> 6) ^ (o << 21 | o >>> 11) ^ (o << 7 | o >>> 25)) + (o & l ^ ~o & u) + _[c] + E[c];
                        d = u,
                        u = l,
                        l = o,
                        o = s + y | 0,
                        s = n,
                        n = a,
                        a = i,
                        i = y + (m + v) | 0
                    }
                    r[0] = r[0] + i | 0,
                    r[1] = r[1] + a | 0,
                    r[2] = r[2] + n | 0,
                    r[3] = r[3] + s | 0,
                    r[4] = r[4] + o | 0,
                    r[5] = r[5] + l | 0,
                    r[6] = r[6] + u | 0,
                    r[7] = r[7] + d | 0
                },
                _doFinalize: function() {
                    var e = this._data
                      , t = e.words
                      , r = 8 * this._nDataBytes
                      , i = 8 * e.sigBytes;
                    return t[i >>> 5] |= 128 << 24 - i % 32,
                    t[14 + (64 + i >>> 9 << 4)] = a.floor(r / 4294967296),
                    t[15 + (64 + i >>> 9 << 4)] = r,
                    e.sigBytes = 4 * t.length,
                    this._process(),
                    this._hash
                },
                clone: function() {
                    var e = i.clone.call(this);
                    return e._hash = this._hash.clone(),
                    e
                }
            });
            e.SHA256 = i._createHelper(o),
            e.HmacSHA256 = i._createHmacHelper(o)
        }(Math),
        function() {
            var e = Oe
              , a = e.lib.WordArray
              , t = e.enc;
            function s(e) {
                return e << 8 & 4278255360 | e >>> 8 & 16711935
            }
            t.Utf16 = t.Utf16BE = {
                stringify: function(e) {
                    for (var t = e.words, r = e.sigBytes, i = [], a = 0; a < r; a += 2) {
                        var n = t[a >>> 2] >>> 16 - a % 4 * 8 & 65535;
                        i.push(String.fromCharCode(n))
                    }
                    return i.join("")
                },
                parse: function(e) {
                    for (var t = e.length, r = [], i = 0; i < t; i++)
                        r[i >>> 1] |= e.charCodeAt(i) << 16 - i % 2 * 16;
                    return a.create(r, 2 * t)
                }
            },
            t.Utf16LE = {
                stringify: function(e) {
                    for (var t = e.words, r = e.sigBytes, i = [], a = 0; a < r; a += 2) {
                        var n = s(t[a >>> 2] >>> 16 - a % 4 * 8 & 65535);
                        i.push(String.fromCharCode(n))
                    }
                    return i.join("")
                },
                parse: function(e) {
                    for (var t = e.length, r = [], i = 0; i < t; i++)
                        r[i >>> 1] |= s(e.charCodeAt(i) << 16 - i % 2 * 16);
                    return a.create(r, 2 * t)
                }
            }
        }(),
        function() {
            if ("function" == typeof ArrayBuffer) {
                var e = Oe.lib.WordArray
                  , a = e.init;
                (e.init = function(e) {
                    if (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
                    (e instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer,e.byteOffset,e.byteLength)),
                    e instanceof Uint8Array) {
                        for (var t = e.byteLength, r = [], i = 0; i < t; i++)
                            r[i >>> 2] |= e[i] << 24 - i % 4 * 8;
                        a.call(this, r, t)
                    } else
                        a.apply(this, arguments)
                }
                ).prototype = e
            }
        }(),
        function(e) {
            var t = Oe
              , r = t.lib
              , i = r.WordArray
              , a = r.Hasher
              , n = t.algo
              , b = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13])
              , A = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11])
              , R = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6])
              , D = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11])
              , k = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838])
              , w = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0])
              , s = n.RIPEMD160 = a.extend({
                _doReset: function() {
                    this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                },
                _doProcessBlock: function(e, t) {
                    for (var r = 0; r < 16; r++) {
                        var i = t + r
                          , a = e[i];
                        e[i] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                    }
                    var n, s, o, l, u, d, c, h, f, p, g, v = this._hash.words, m = k.words, y = w.words, _ = b.words, E = A.words, S = R.words, T = D.words;
                    for (d = n = v[0],
                    c = s = v[1],
                    h = o = v[2],
                    f = l = v[3],
                    p = u = v[4],
                    r = 0; r < 80; r += 1)
                        g = n + e[t + _[r]] | 0,
                        g += r < 16 ? L(s, o, l) + m[0] : r < 32 ? O(s, o, l) + m[1] : r < 48 ? C(s, o, l) + m[2] : r < 64 ? I(s, o, l) + m[3] : P(s, o, l) + m[4],
                        g = (g = x(g |= 0, S[r])) + u | 0,
                        n = u,
                        u = l,
                        l = x(o, 10),
                        o = s,
                        s = g,
                        g = d + e[t + E[r]] | 0,
                        g += r < 16 ? P(c, h, f) + y[0] : r < 32 ? I(c, h, f) + y[1] : r < 48 ? C(c, h, f) + y[2] : r < 64 ? O(c, h, f) + y[3] : L(c, h, f) + y[4],
                        g = (g = x(g |= 0, T[r])) + p | 0,
                        d = p,
                        p = f,
                        f = x(h, 10),
                        h = c,
                        c = g;
                    g = v[1] + o + f | 0,
                    v[1] = v[2] + l + p | 0,
                    v[2] = v[3] + u + d | 0,
                    v[3] = v[4] + n + c | 0,
                    v[4] = v[0] + s + h | 0,
                    v[0] = g
                },
                _doFinalize: function() {
                    var e = this._data
                      , t = e.words
                      , r = 8 * this._nDataBytes
                      , i = 8 * e.sigBytes;
                    t[i >>> 5] |= 128 << 24 - i % 32,
                    t[14 + (64 + i >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8),
                    e.sigBytes = 4 * (t.length + 1),
                    this._process();
                    for (var a = this._hash, n = a.words, s = 0; s < 5; s++) {
                        var o = n[s];
                        n[s] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8)
                    }
                    return a
                },
                clone: function() {
                    var e = a.clone.call(this);
                    return e._hash = this._hash.clone(),
                    e
                }
            });
            function L(e, t, r) {
                return e ^ t ^ r
            }
            function O(e, t, r) {
                return e & t | ~e & r
            }
            function C(e, t, r) {
                return (e | ~t) ^ r
            }
            function I(e, t, r) {
                return e & r | t & ~r
            }
            function P(e, t, r) {
                return e ^ (t | ~r)
            }
            function x(e, t) {
                return e << t | e >>> 32 - t
            }
            t.RIPEMD160 = a._createHelper(s),
            t.HmacRIPEMD160 = a._createHmacHelper(s)
        }(Math),
        Ee = (_e = Oe).lib.Base,
        Se = _e.enc.Utf8,
        _e.algo.HMAC = Ee.extend({
            init: function(e, t) {
                e = this._hasher = new e.init,
                "string" == typeof t && (t = Se.parse(t));
                var r = e.blockSize
                  , i = 4 * r;
                t.sigBytes > i && (t = e.finalize(t)),
                t.clamp();
                for (var a = this._oKey = t.clone(), n = this._iKey = t.clone(), s = a.words, o = n.words, l = 0; l < r; l++)
                    s[l] ^= 1549556828,
                    o[l] ^= 909522486;
                a.sigBytes = n.sigBytes = i,
                this.reset()
            },
            reset: function() {
                var e = this._hasher;
                e.reset(),
                e.update(this._iKey)
            },
            update: function(e) {
                return this._hasher.update(e),
                this
            },
            finalize: function(e) {
                var t = this._hasher
                  , r = t.finalize(e);
                return t.reset(),
                t.finalize(this._oKey.clone().concat(r))
            }
        }),
        he = (ce = Oe).lib,
        fe = he.Base,
        pe = he.WordArray,
        ge = ce.algo,
        ve = ge.SHA1,
        me = ge.HMAC,
        ye = ge.PBKDF2 = fe.extend({
            cfg: fe.extend({
                keySize: 4,
                hasher: ve,
                iterations: 1
            }),
            init: function(e) {
                this.cfg = this.cfg.extend(e)
            },
            compute: function(e, t) {
                for (var r = this.cfg, i = me.create(r.hasher, e), a = pe.create(), n = pe.create([1]), s = a.words, o = n.words, l = r.keySize, u = r.iterations; s.length < l; ) {
                    var d = i.update(t).finalize(n);
                    i.reset();
                    for (var c = d.words, h = c.length, f = d, p = 1; p < u; p++) {
                        f = i.finalize(f),
                        i.reset();
                        for (var g = f.words, v = 0; v < h; v++)
                            c[v] ^= g[v]
                    }
                    a.concat(d),
                    o[0]++
                }
                return a.sigBytes = 4 * l,
                a
            }
        }),
        ce.PBKDF2 = function(e, t, r) {
            return ye.create(r).compute(e, t)
        }
        ,
        ne = (ae = Oe).lib,
        se = ne.Base,
        oe = ne.WordArray,
        le = ae.algo,
        ue = le.MD5,
        de = le.EvpKDF = se.extend({
            cfg: se.extend({
                keySize: 4,
                hasher: ue,
                iterations: 1
            }),
            init: function(e) {
                this.cfg = this.cfg.extend(e)
            },
            compute: function(e, t) {
                for (var r = this.cfg, i = r.hasher.create(), a = oe.create(), n = a.words, s = r.keySize, o = r.iterations; n.length < s; ) {
                    l && i.update(l);
                    var l = i.update(e).finalize(t);
                    i.reset();
                    for (var u = 1; u < o; u++)
                        l = i.finalize(l),
                        i.reset();
                    a.concat(l)
                }
                return a.sigBytes = 4 * s,
                a
            }
        }),
        ae.EvpKDF = function(e, t, r) {
            return de.create(r).compute(e, t)
        }
        ,
        ee = (Z = Oe).lib.WordArray,
        te = Z.algo,
        re = te.SHA256,
        ie = te.SHA224 = re.extend({
            _doReset: function() {
                this._hash = new ee.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
            },
            _doFinalize: function() {
                var e = re._doFinalize.call(this);
                return e.sigBytes -= 4,
                e
            }
        }),
        Z.SHA224 = re._createHelper(ie),
        Z.HmacSHA224 = re._createHmacHelper(ie),
        X = (q = Oe).lib,
        $ = X.Base,
        Q = X.WordArray,
        (J = q.x64 = {}).Word = $.extend({
            init: function(e, t) {
                this.high = e,
                this.low = t
            }
        }),
        J.WordArray = $.extend({
            init: function(e, t) {
                e = this.words = e || [],
                this.sigBytes = null != t ? t : 8 * e.length
            },
            toX32: function() {
                for (var e = this.words, t = e.length, r = [], i = 0; i < t; i++) {
                    var a = e[i];
                    r.push(a.high),
                    r.push(a.low)
                }
                return Q.create(r, this.sigBytes)
            },
            clone: function() {
                for (var e = $.clone.call(this), t = e.words = this.words.slice(0), r = t.length, i = 0; i < r; i++)
                    t[i] = t[i].clone();
                return e
            }
        }),
        function(h) {
            var e = Oe
              , t = e.lib
              , f = t.WordArray
              , i = t.Hasher
              , d = e.x64.Word
              , r = e.algo
              , L = []
              , O = []
              , C = [];
            !function() {
                for (var e = 1, t = 0, r = 0; r < 24; r++) {
                    L[e + 5 * t] = (r + 1) * (r + 2) / 2 % 64;
                    var i = (2 * e + 3 * t) % 5;
                    e = t % 5,
                    t = i
                }
                for (e = 0; e < 5; e++)
                    for (t = 0; t < 5; t++)
                        O[e + 5 * t] = t + (2 * e + 3 * t) % 5 * 5;
                for (var a = 1, n = 0; n < 24; n++) {
                    for (var s = 0, o = 0, l = 0; l < 7; l++) {
                        if (1 & a) {
                            var u = (1 << l) - 1;
                            u < 32 ? o ^= 1 << u : s ^= 1 << u - 32
                        }
                        128 & a ? a = a << 1 ^ 113 : a <<= 1
                    }
                    C[n] = d.create(s, o)
                }
            }();
            var I = [];
            !function() {
                for (var e = 0; e < 25; e++)
                    I[e] = d.create()
            }();
            var a = r.SHA3 = i.extend({
                cfg: i.cfg.extend({
                    outputLength: 512
                }),
                _doReset: function() {
                    for (var e = this._state = [], t = 0; t < 25; t++)
                        e[t] = new d.init;
                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                },
                _doProcessBlock: function(e, t) {
                    for (var r = this._state, i = this.blockSize / 2, a = 0; a < i; a++) {
                        var n = e[t + 2 * a]
                          , s = e[t + 2 * a + 1];
                        n = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                        s = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                        (A = r[a]).high ^= s,
                        A.low ^= n
                    }
                    for (var o = 0; o < 24; o++) {
                        for (var l = 0; l < 5; l++) {
                            for (var u = 0, d = 0, c = 0; c < 5; c++)
                                u ^= (A = r[l + 5 * c]).high,
                                d ^= A.low;
                            var h = I[l];
                            h.high = u,
                            h.low = d
                        }
                        for (l = 0; l < 5; l++) {
                            var f = I[(l + 4) % 5]
                              , p = I[(l + 1) % 5]
                              , g = p.high
                              , v = p.low;
                            for (u = f.high ^ (g << 1 | v >>> 31),
                            d = f.low ^ (v << 1 | g >>> 31),
                            c = 0; c < 5; c++)
                                (A = r[l + 5 * c]).high ^= u,
                                A.low ^= d
                        }
                        for (var m = 1; m < 25; m++) {
                            var y = (A = r[m]).high
                              , _ = A.low
                              , E = L[m];
                            d = E < 32 ? (u = y << E | _ >>> 32 - E,
                            _ << E | y >>> 32 - E) : (u = _ << E - 32 | y >>> 64 - E,
                            y << E - 32 | _ >>> 64 - E);
                            var S = I[O[m]];
                            S.high = u,
                            S.low = d
                        }
                        var T = I[0]
                          , b = r[0];
                        for (T.high = b.high,
                        T.low = b.low,
                        l = 0; l < 5; l++)
                            for (c = 0; c < 5; c++) {
                                var A = r[m = l + 5 * c]
                                  , R = I[m]
                                  , D = I[(l + 1) % 5 + 5 * c]
                                  , k = I[(l + 2) % 5 + 5 * c];
                                A.high = R.high ^ ~D.high & k.high,
                                A.low = R.low ^ ~D.low & k.low
                            }
                        A = r[0];
                        var w = C[o];
                        A.high ^= w.high,
                        A.low ^= w.low
                    }
                },
                _doFinalize: function() {
                    var e = this._data
                      , t = e.words
                      , r = (this._nDataBytes,
                    8 * e.sigBytes)
                      , i = 32 * this.blockSize;
                    t[r >>> 5] |= 1 << 24 - r % 32,
                    t[(h.ceil((1 + r) / i) * i >>> 5) - 1] |= 128,
                    e.sigBytes = 4 * t.length,
                    this._process();
                    for (var a = this._state, n = this.cfg.outputLength / 8, s = n / 8, o = [], l = 0; l < s; l++) {
                        var u = a[l]
                          , d = u.high
                          , c = u.low;
                        d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                        c = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8),
                        o.push(c),
                        o.push(d)
                    }
                    return new f.init(o,n)
                },
                clone: function() {
                    for (var e = i.clone.call(this), t = e._state = this._state.slice(0), r = 0; r < 25; r++)
                        t[r] = t[r].clone();
                    return e
                }
            });
            e.SHA3 = i._createHelper(a),
            e.HmacSHA3 = i._createHmacHelper(a)
        }(Math),
        function() {
            var e = Oe
              , t = e.lib.Hasher
              , r = e.x64
              , i = r.Word
              , a = r.WordArray
              , n = e.algo;
            function s() {
                return i.create.apply(i, arguments)
            }
            var be = [s(1116352408, 3609767458), s(1899447441, 602891725), s(3049323471, 3964484399), s(3921009573, 2173295548), s(961987163, 4081628472), s(1508970993, 3053834265), s(2453635748, 2937671579), s(2870763221, 3664609560), s(3624381080, 2734883394), s(310598401, 1164996542), s(607225278, 1323610764), s(1426881987, 3590304994), s(1925078388, 4068182383), s(2162078206, 991336113), s(2614888103, 633803317), s(3248222580, 3479774868), s(3835390401, 2666613458), s(4022224774, 944711139), s(264347078, 2341262773), s(604807628, 2007800933), s(770255983, 1495990901), s(1249150122, 1856431235), s(1555081692, 3175218132), s(1996064986, 2198950837), s(2554220882, 3999719339), s(2821834349, 766784016), s(2952996808, 2566594879), s(3210313671, 3203337956), s(3336571891, 1034457026), s(3584528711, 2466948901), s(113926993, 3758326383), s(338241895, 168717936), s(666307205, 1188179964), s(773529912, 1546045734), s(1294757372, 1522805485), s(1396182291, 2643833823), s(1695183700, 2343527390), s(1986661051, 1014477480), s(2177026350, 1206759142), s(2456956037, 344077627), s(2730485921, 1290863460), s(2820302411, 3158454273), s(3259730800, 3505952657), s(3345764771, 106217008), s(3516065817, 3606008344), s(3600352804, 1432725776), s(4094571909, 1467031594), s(275423344, 851169720), s(430227734, 3100823752), s(506948616, 1363258195), s(659060556, 3750685593), s(883997877, 3785050280), s(958139571, 3318307427), s(1322822218, 3812723403), s(1537002063, 2003034995), s(1747873779, 3602036899), s(1955562222, 1575990012), s(2024104815, 1125592928), s(2227730452, 2716904306), s(2361852424, 442776044), s(2428436474, 593698344), s(2756734187, 3733110249), s(3204031479, 2999351573), s(3329325298, 3815920427), s(3391569614, 3928383900), s(3515267271, 566280711), s(3940187606, 3454069534), s(4118630271, 4000239992), s(116418474, 1914138554), s(174292421, 2731055270), s(289380356, 3203993006), s(460393269, 320620315), s(685471733, 587496836), s(852142971, 1086792851), s(1017036298, 365543100), s(1126000580, 2618297676), s(1288033470, 3409855158), s(1501505948, 4234509866), s(1607167915, 987167468), s(1816402316, 1246189591)]
              , Ae = [];
            !function() {
                for (var e = 0; e < 80; e++)
                    Ae[e] = s()
            }();
            var o = n.SHA512 = t.extend({
                _doReset: function() {
                    this._hash = new a.init([new i.init(1779033703,4089235720), new i.init(3144134277,2227873595), new i.init(1013904242,4271175723), new i.init(2773480762,1595750129), new i.init(1359893119,2917565137), new i.init(2600822924,725511199), new i.init(528734635,4215389547), new i.init(1541459225,327033209)])
                },
                _doProcessBlock: function(e, t) {
                    for (var r = this._hash.words, i = r[0], a = r[1], n = r[2], s = r[3], o = r[4], l = r[5], u = r[6], d = r[7], c = i.high, h = i.low, f = a.high, p = a.low, g = n.high, v = n.low, m = s.high, y = s.low, _ = o.high, E = o.low, S = l.high, T = l.low, b = u.high, A = u.low, R = d.high, D = d.low, k = c, w = h, L = f, O = p, C = g, I = v, P = m, x = y, F = _, M = E, B = S, N = T, U = b, G = A, H = R, j = D, K = 0; K < 80; K++) {
                        var W = Ae[K];
                        if (K < 16)
                            var z = W.high = 0 | e[t + 2 * K]
                              , V = W.low = 0 | e[t + 2 * K + 1];
                        else {
                            var Y = Ae[K - 15]
                              , q = Y.high
                              , X = Y.low
                              , $ = (q >>> 1 | X << 31) ^ (q >>> 8 | X << 24) ^ q >>> 7
                              , Q = (X >>> 1 | q << 31) ^ (X >>> 8 | q << 24) ^ (X >>> 7 | q << 25)
                              , J = Ae[K - 2]
                              , Z = J.high
                              , ee = J.low
                              , te = (Z >>> 19 | ee << 13) ^ (Z << 3 | ee >>> 29) ^ Z >>> 6
                              , re = (ee >>> 19 | Z << 13) ^ (ee << 3 | Z >>> 29) ^ (ee >>> 6 | Z << 26)
                              , ie = Ae[K - 7]
                              , ae = ie.high
                              , ne = ie.low
                              , se = Ae[K - 16]
                              , oe = se.high
                              , le = se.low;
                            z = (z = (z = $ + ae + ((V = Q + ne) >>> 0 < Q >>> 0 ? 1 : 0)) + te + ((V += re) >>> 0 < re >>> 0 ? 1 : 0)) + oe + ((V += le) >>> 0 < le >>> 0 ? 1 : 0),
                            W.high = z,
                            W.low = V
                        }
                        var ue, de = F & B ^ ~F & U, ce = M & N ^ ~M & G, he = k & L ^ k & C ^ L & C, fe = w & O ^ w & I ^ O & I, pe = (k >>> 28 | w << 4) ^ (k << 30 | w >>> 2) ^ (k << 25 | w >>> 7), ge = (w >>> 28 | k << 4) ^ (w << 30 | k >>> 2) ^ (w << 25 | k >>> 7), ve = (F >>> 14 | M << 18) ^ (F >>> 18 | M << 14) ^ (F << 23 | M >>> 9), me = (M >>> 14 | F << 18) ^ (M >>> 18 | F << 14) ^ (M << 23 | F >>> 9), ye = be[K], _e = ye.high, Ee = ye.low, Se = H + ve + ((ue = j + me) >>> 0 < j >>> 0 ? 1 : 0), Te = ge + fe;
                        H = U,
                        j = G,
                        U = B,
                        G = N,
                        B = F,
                        N = M,
                        F = P + (Se = (Se = (Se = Se + de + ((ue += ce) >>> 0 < ce >>> 0 ? 1 : 0)) + _e + ((ue += Ee) >>> 0 < Ee >>> 0 ? 1 : 0)) + z + ((ue += V) >>> 0 < V >>> 0 ? 1 : 0)) + ((M = x + ue | 0) >>> 0 < x >>> 0 ? 1 : 0) | 0,
                        P = C,
                        x = I,
                        C = L,
                        I = O,
                        L = k,
                        O = w,
                        k = Se + (pe + he + (Te >>> 0 < ge >>> 0 ? 1 : 0)) + ((w = ue + Te | 0) >>> 0 < ue >>> 0 ? 1 : 0) | 0
                    }
                    h = i.low = h + w,
                    i.high = c + k + (h >>> 0 < w >>> 0 ? 1 : 0),
                    p = a.low = p + O,
                    a.high = f + L + (p >>> 0 < O >>> 0 ? 1 : 0),
                    v = n.low = v + I,
                    n.high = g + C + (v >>> 0 < I >>> 0 ? 1 : 0),
                    y = s.low = y + x,
                    s.high = m + P + (y >>> 0 < x >>> 0 ? 1 : 0),
                    E = o.low = E + M,
                    o.high = _ + F + (E >>> 0 < M >>> 0 ? 1 : 0),
                    T = l.low = T + N,
                    l.high = S + B + (T >>> 0 < N >>> 0 ? 1 : 0),
                    A = u.low = A + G,
                    u.high = b + U + (A >>> 0 < G >>> 0 ? 1 : 0),
                    D = d.low = D + j,
                    d.high = R + H + (D >>> 0 < j >>> 0 ? 1 : 0)
                },
                _doFinalize: function() {
                    var e = this._data
                      , t = e.words
                      , r = 8 * this._nDataBytes
                      , i = 8 * e.sigBytes;
                    return t[i >>> 5] |= 128 << 24 - i % 32,
                    t[30 + (128 + i >>> 10 << 5)] = Math.floor(r / 4294967296),
                    t[31 + (128 + i >>> 10 << 5)] = r,
                    e.sigBytes = 4 * t.length,
                    this._process(),
                    this._hash.toX32()
                },
                clone: function() {
                    var e = t.clone.call(this);
                    return e._hash = this._hash.clone(),
                    e
                },
                blockSize: 32
            });
            e.SHA512 = t._createHelper(o),
            e.HmacSHA512 = t._createHmacHelper(o)
        }(),
        j = (H = Oe).x64,
        K = j.Word,
        W = j.WordArray,
        z = H.algo,
        V = z.SHA512,
        Y = z.SHA384 = V.extend({
            _doReset: function() {
                this._hash = new W.init([new K.init(3418070365,3238371032), new K.init(1654270250,914150663), new K.init(2438529370,812702999), new K.init(355462360,4144912697), new K.init(1731405415,4290775857), new K.init(2394180231,1750603025), new K.init(3675008525,1694076839), new K.init(1203062813,3204075428)])
            },
            _doFinalize: function() {
                var e = V._doFinalize.call(this);
                return e.sigBytes -= 16,
                e
            }
        }),
        H.SHA384 = V._createHelper(Y),
        H.HmacSHA384 = V._createHmacHelper(Y),
        Oe.lib.Cipher || (A = (b = Oe).lib,
        R = A.Base,
        D = A.WordArray,
        k = A.BufferedBlockAlgorithm,
        (w = b.enc).Utf8,
        L = w.Base64,
        O = b.algo.EvpKDF,
        C = A.Cipher = k.extend({
            cfg: R.extend(),
            createEncryptor: function(e, t) {
                return this.create(this._ENC_XFORM_MODE, e, t)
            },
            createDecryptor: function(e, t) {
                return this.create(this._DEC_XFORM_MODE, e, t)
            },
            init: function(e, t, r) {
                this.cfg = this.cfg.extend(r),
                this._xformMode = e,
                this._key = t,
                this.reset()
            },
            reset: function() {
                k.reset.call(this),
                this._doReset()
            },
            process: function(e) {
                return this._append(e),
                this._process()
            },
            finalize: function(e) {
                return e && this._append(e),
                this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function() {
                function a(e) {
                    return "string" == typeof e ? G : N
                }
                return function(i) {
                    return {
                        encrypt: function(e, t, r) {
                            return a(t).encrypt(i, e, t, r)
                        },
                        decrypt: function(e, t, r) {
                            return a(t).decrypt(i, e, t, r)
                        }
                    }
                }
            }()
        }),
        A.StreamCipher = C.extend({
            _doFinalize: function() {
                return this._process(!0)
            },
            blockSize: 1
        }),
        I = b.mode = {},
        P = A.BlockCipherMode = R.extend({
            createEncryptor: function(e, t) {
                return this.Encryptor.create(e, t)
            },
            createDecryptor: function(e, t) {
                return this.Decryptor.create(e, t)
            },
            init: function(e, t) {
                this._cipher = e,
                this._iv = t
            }
        }),
        x = I.CBC = function() {
            var e = P.extend();
            function n(e, t, r) {
                var i = this._iv;
                if (i) {
                    var a = i;
                    this._iv = void 0
                } else
                    a = this._prevBlock;
                for (var n = 0; n < r; n++)
                    e[t + n] ^= a[n]
            }
            return e.Encryptor = e.extend({
                processBlock: function(e, t) {
                    var r = this._cipher
                      , i = r.blockSize;
                    n.call(this, e, t, i),
                    r.encryptBlock(e, t),
                    this._prevBlock = e.slice(t, t + i)
                }
            }),
            e.Decryptor = e.extend({
                processBlock: function(e, t) {
                    var r = this._cipher
                      , i = r.blockSize
                      , a = e.slice(t, t + i);
                    r.decryptBlock(e, t),
                    n.call(this, e, t, i),
                    this._prevBlock = a
                }
            }),
            e
        }(),
        F = (b.pad = {}).Pkcs7 = {
            pad: function(e, t) {
                for (var r = 4 * t, i = r - e.sigBytes % r, a = i << 24 | i << 16 | i << 8 | i, n = [], s = 0; s < i; s += 4)
                    n.push(a);
                var o = D.create(n, i);
                e.concat(o)
            },
            unpad: function(e) {
                var t = 255 & e.words[e.sigBytes - 1 >>> 2];
                e.sigBytes -= t
            }
        },
        A.BlockCipher = C.extend({
            cfg: C.cfg.extend({
                mode: x,
                padding: F
            }),
            reset: function() {
                C.reset.call(this);
                var e = this.cfg
                  , t = e.iv
                  , r = e.mode;
                if (this._xformMode == this._ENC_XFORM_MODE)
                    var i = r.createEncryptor;
                else
                    i = r.createDecryptor,
                    this._minBufferSize = 1;
                this._mode && this._mode.__creator == i ? this._mode.init(this, t && t.words) : (this._mode = i.call(r, this, t && t.words),
                this._mode.__creator = i)
            },
            _doProcessBlock: function(e, t) {
                this._mode.processBlock(e, t)
            },
            _doFinalize: function() {
                var e = this.cfg.padding;
                if (this._xformMode == this._ENC_XFORM_MODE) {
                    e.pad(this._data, this.blockSize);
                    var t = this._process(!0)
                } else
                    t = this._process(!0),
                    e.unpad(t);
                return t
            },
            blockSize: 4
        }),
        M = A.CipherParams = R.extend({
            init: function(e) {
                this.mixIn(e)
            },
            toString: function(e) {
                return (e || this.formatter).stringify(this)
            }
        }),
        B = (b.format = {}).OpenSSL = {
            stringify: function(e) {
                var t = e.ciphertext
                  , r = e.salt;
                if (r)
                    var i = D.create([1398893684, 1701076831]).concat(r).concat(t);
                else
                    i = t;
                return i.toString(L)
            },
            parse: function(e) {
                var t = L.parse(e)
                  , r = t.words;
                if (1398893684 == r[0] && 1701076831 == r[1]) {
                    var i = D.create(r.slice(2, 4));
                    r.splice(0, 4),
                    t.sigBytes -= 16
                }
                return M.create({
                    ciphertext: t,
                    salt: i
                })
            }
        },
        N = A.SerializableCipher = R.extend({
            cfg: R.extend({
                format: B
            }),
            encrypt: function(e, t, r, i) {
                i = this.cfg.extend(i);
                var a = e.createEncryptor(r, i)
                  , n = a.finalize(t)
                  , s = a.cfg;
                return M.create({
                    ciphertext: n,
                    key: r,
                    iv: s.iv,
                    algorithm: e,
                    mode: s.mode,
                    padding: s.padding,
                    blockSize: e.blockSize,
                    formatter: i.format
                })
            },
            decrypt: function(e, t, r, i) {
                return i = this.cfg.extend(i),
                t = this._parse(t, i.format),
                e.createDecryptor(r, i).finalize(t.ciphertext)
            },
            _parse: function(e, t) {
                return "string" == typeof e ? t.parse(e, this) : e
            }
        }),
        U = (b.kdf = {}).OpenSSL = {
            execute: function(e, t, r, i) {
                i || (i = D.random(8));
                var a = O.create({
                    keySize: t + r
                }).compute(e, i)
                  , n = D.create(a.words.slice(t), 4 * r);
                return a.sigBytes = 4 * t,
                M.create({
                    key: a,
                    iv: n,
                    salt: i
                })
            }
        },
        G = A.PasswordBasedCipher = N.extend({
            cfg: N.cfg.extend({
                kdf: U
            }),
            encrypt: function(e, t, r, i) {
                var a = (i = this.cfg.extend(i)).kdf.execute(r, e.keySize, e.ivSize);
                i.iv = a.iv;
                var n = N.encrypt.call(this, e, t, a.key, i);
                return n.mixIn(a),
                n
            },
            decrypt: function(e, t, r, i) {
                i = this.cfg.extend(i),
                t = this._parse(t, i.format);
                var a = i.kdf.execute(r, e.keySize, e.ivSize, t.salt);
                return i.iv = a.iv,
                N.decrypt.call(this, e, t, a.key, i)
            }
        })),
        Oe.mode.CFB = function() {
            var e = Oe.lib.BlockCipherMode.extend();
            function n(e, t, r, i) {
                var a = this._iv;
                if (a) {
                    var n = a.slice(0);
                    this._iv = void 0
                } else
                    n = this._prevBlock;
                i.encryptBlock(n, 0);
                for (var s = 0; s < r; s++)
                    e[t + s] ^= n[s]
            }
            return e.Encryptor = e.extend({
                processBlock: function(e, t) {
                    var r = this._cipher
                      , i = r.blockSize;
                    n.call(this, e, t, i, r),
                    this._prevBlock = e.slice(t, t + i)
                }
            }),
            e.Decryptor = e.extend({
                processBlock: function(e, t) {
                    var r = this._cipher
                      , i = r.blockSize
                      , a = e.slice(t, t + i);
                    n.call(this, e, t, i, r),
                    this._prevBlock = a
                }
            }),
            e
        }(),
        Oe.mode.ECB = ((T = Oe.lib.BlockCipherMode.extend()).Encryptor = T.extend({
            processBlock: function(e, t) {
                this._cipher.encryptBlock(e, t)
            }
        }),
        T.Decryptor = T.extend({
            processBlock: function(e, t) {
                this._cipher.decryptBlock(e, t)
            }
        }),
        T),
        Oe.pad.AnsiX923 = {
            pad: function(e, t) {
                var r = e.sigBytes
                  , i = 4 * t
                  , a = i - r % i
                  , n = r + a - 1;
                e.clamp(),
                e.words[n >>> 2] |= a << 24 - n % 4 * 8,
                e.sigBytes += a
            },
            unpad: function(e) {
                var t = 255 & e.words[e.sigBytes - 1 >>> 2];
                e.sigBytes -= t
            }
        },
        Oe.pad.Iso10126 = {
            pad: function(e, t) {
                var r = 4 * t
                  , i = r - e.sigBytes % r;
                e.concat(Oe.lib.WordArray.random(i - 1)).concat(Oe.lib.WordArray.create([i << 24], 1))
            },
            unpad: function(e) {
                var t = 255 & e.words[e.sigBytes - 1 >>> 2];
                e.sigBytes -= t
            }
        },
        Oe.pad.Iso97971 = {
            pad: function(e, t) {
                e.concat(Oe.lib.WordArray.create([2147483648], 1)),
                Oe.pad.ZeroPadding.pad(e, t)
            },
            unpad: function(e) {
                Oe.pad.ZeroPadding.unpad(e),
                e.sigBytes--
            }
        },
        Oe.mode.OFB = (E = Oe.lib.BlockCipherMode.extend(),
        S = E.Encryptor = E.extend({
            processBlock: function(e, t) {
                var r = this._cipher
                  , i = r.blockSize
                  , a = this._iv
                  , n = this._keystream;
                a && (n = this._keystream = a.slice(0),
                this._iv = void 0),
                r.encryptBlock(n, 0);
                for (var s = 0; s < i; s++)
                    e[t + s] ^= n[s]
            }
        }),
        E.Decryptor = S,
        E),
        Oe.pad.NoPadding = {
            pad: function() {},
            unpad: function() {}
        },
        y = (m = Oe).lib.CipherParams,
        _ = m.enc.Hex,
        m.format.Hex = {
            stringify: function(e) {
                return e.ciphertext.toString(_)
            },
            parse: function(e) {
                var t = _.parse(e);
                return y.create({
                    ciphertext: t
                })
            }
        },
        function() {
            var e = Oe
              , t = e.lib.BlockCipher
              , r = e.algo
              , u = []
              , d = []
              , c = []
              , h = []
              , f = []
              , p = []
              , g = []
              , v = []
              , m = []
              , y = [];
            !function() {
                for (var e = [], t = 0; t < 256; t++)
                    e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
                var r = 0
                  , i = 0;
                for (t = 0; t < 256; t++) {
                    var a = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4;
                    a = a >>> 8 ^ 255 & a ^ 99,
                    u[r] = a;
                    var n = e[d[a] = r]
                      , s = e[n]
                      , o = e[s]
                      , l = 257 * e[a] ^ 16843008 * a;
                    c[r] = l << 24 | l >>> 8,
                    h[r] = l << 16 | l >>> 16,
                    f[r] = l << 8 | l >>> 24,
                    p[r] = l,
                    l = 16843009 * o ^ 65537 * s ^ 257 * n ^ 16843008 * r,
                    g[a] = l << 24 | l >>> 8,
                    v[a] = l << 16 | l >>> 16,
                    m[a] = l << 8 | l >>> 24,
                    y[a] = l,
                    r ? (r = n ^ e[e[e[o ^ n]]],
                    i ^= e[e[i]]) : r = i = 1
                }
            }();
            var _ = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
              , i = r.AES = t.extend({
                _doReset: function() {
                    if (!this._nRounds || this._keyPriorReset !== this._key) {
                        for (var e = this._keyPriorReset = this._key, t = e.words, r = e.sigBytes / 4, i = 4 * (1 + (this._nRounds = 6 + r)), a = this._keySchedule = [], n = 0; n < i; n++)
                            if (n < r)
                                a[n] = t[n];
                            else {
                                var s = a[n - 1];
                                n % r ? 6 < r && n % r == 4 && (s = u[s >>> 24] << 24 | u[s >>> 16 & 255] << 16 | u[s >>> 8 & 255] << 8 | u[255 & s]) : (s = u[(s = s << 8 | s >>> 24) >>> 24] << 24 | u[s >>> 16 & 255] << 16 | u[s >>> 8 & 255] << 8 | u[255 & s],
                                s ^= _[n / r | 0] << 24),
                                a[n] = a[n - r] ^ s
                            }
                        for (var o = this._invKeySchedule = [], l = 0; l < i; l++)
                            n = i - l,
                            s = l % 4 ? a[n] : a[n - 4],
                            o[l] = l < 4 || n <= 4 ? s : g[u[s >>> 24]] ^ v[u[s >>> 16 & 255]] ^ m[u[s >>> 8 & 255]] ^ y[u[255 & s]]
                    }
                },
                encryptBlock: function(e, t) {
                    this._doCryptBlock(e, t, this._keySchedule, c, h, f, p, u)
                },
                decryptBlock: function(e, t) {
                    var r = e[t + 1];
                    e[t + 1] = e[t + 3],
                    e[t + 3] = r,
                    this._doCryptBlock(e, t, this._invKeySchedule, g, v, m, y, d),
                    r = e[t + 1],
                    e[t + 1] = e[t + 3],
                    e[t + 3] = r
                },
                _doCryptBlock: function(e, t, r, i, a, n, s, o) {
                    for (var l = this._nRounds, u = e[t] ^ r[0], d = e[t + 1] ^ r[1], c = e[t + 2] ^ r[2], h = e[t + 3] ^ r[3], f = 4, p = 1; p < l; p++) {
                        var g = i[u >>> 24] ^ a[d >>> 16 & 255] ^ n[c >>> 8 & 255] ^ s[255 & h] ^ r[f++]
                          , v = i[d >>> 24] ^ a[c >>> 16 & 255] ^ n[h >>> 8 & 255] ^ s[255 & u] ^ r[f++]
                          , m = i[c >>> 24] ^ a[h >>> 16 & 255] ^ n[u >>> 8 & 255] ^ s[255 & d] ^ r[f++]
                          , y = i[h >>> 24] ^ a[u >>> 16 & 255] ^ n[d >>> 8 & 255] ^ s[255 & c] ^ r[f++];
                        u = g,
                        d = v,
                        c = m,
                        h = y
                    }
                    g = (o[u >>> 24] << 24 | o[d >>> 16 & 255] << 16 | o[c >>> 8 & 255] << 8 | o[255 & h]) ^ r[f++],
                    v = (o[d >>> 24] << 24 | o[c >>> 16 & 255] << 16 | o[h >>> 8 & 255] << 8 | o[255 & u]) ^ r[f++],
                    m = (o[c >>> 24] << 24 | o[h >>> 16 & 255] << 16 | o[u >>> 8 & 255] << 8 | o[255 & d]) ^ r[f++],
                    y = (o[h >>> 24] << 24 | o[u >>> 16 & 255] << 16 | o[d >>> 8 & 255] << 8 | o[255 & c]) ^ r[f++],
                    e[t] = g,
                    e[t + 1] = v,
                    e[t + 2] = m,
                    e[t + 3] = y
                },
                keySize: 8
            });
            e.AES = t._createHelper(i)
        }(),
        function() {
            var e = Oe
              , t = e.lib
              , r = t.WordArray
              , i = t.BlockCipher
              , a = e.algo
              , u = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
              , d = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
              , c = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]
              , h = [{
                0: 8421888,
                268435456: 32768,
                536870912: 8421378,
                805306368: 2,
                1073741824: 512,
                1342177280: 8421890,
                1610612736: 8389122,
                1879048192: 8388608,
                2147483648: 514,
                2415919104: 8389120,
                2684354560: 33280,
                2952790016: 8421376,
                3221225472: 32770,
                3489660928: 8388610,
                3758096384: 0,
                4026531840: 33282,
                134217728: 0,
                402653184: 8421890,
                671088640: 33282,
                939524096: 32768,
                1207959552: 8421888,
                1476395008: 512,
                1744830464: 8421378,
                2013265920: 2,
                2281701376: 8389120,
                2550136832: 33280,
                2818572288: 8421376,
                3087007744: 8389122,
                3355443200: 8388610,
                3623878656: 32770,
                3892314112: 514,
                4160749568: 8388608,
                1: 32768,
                268435457: 2,
                536870913: 8421888,
                805306369: 8388608,
                1073741825: 8421378,
                1342177281: 33280,
                1610612737: 512,
                1879048193: 8389122,
                2147483649: 8421890,
                2415919105: 8421376,
                2684354561: 8388610,
                2952790017: 33282,
                3221225473: 514,
                3489660929: 8389120,
                3758096385: 32770,
                4026531841: 0,
                134217729: 8421890,
                402653185: 8421376,
                671088641: 8388608,
                939524097: 512,
                1207959553: 32768,
                1476395009: 8388610,
                1744830465: 2,
                2013265921: 33282,
                2281701377: 32770,
                2550136833: 8389122,
                2818572289: 514,
                3087007745: 8421888,
                3355443201: 8389120,
                3623878657: 0,
                3892314113: 33280,
                4160749569: 8421378
            }, {
                0: 1074282512,
                16777216: 16384,
                33554432: 524288,
                50331648: 1074266128,
                67108864: 1073741840,
                83886080: 1074282496,
                100663296: 1073758208,
                117440512: 16,
                134217728: 540672,
                150994944: 1073758224,
                167772160: 1073741824,
                184549376: 540688,
                201326592: 524304,
                218103808: 0,
                234881024: 16400,
                251658240: 1074266112,
                8388608: 1073758208,
                25165824: 540688,
                41943040: 16,
                58720256: 1073758224,
                75497472: 1074282512,
                92274688: 1073741824,
                109051904: 524288,
                125829120: 1074266128,
                142606336: 524304,
                159383552: 0,
                176160768: 16384,
                192937984: 1074266112,
                209715200: 1073741840,
                226492416: 540672,
                243269632: 1074282496,
                260046848: 16400,
                268435456: 0,
                285212672: 1074266128,
                301989888: 1073758224,
                318767104: 1074282496,
                335544320: 1074266112,
                352321536: 16,
                369098752: 540688,
                385875968: 16384,
                402653184: 16400,
                419430400: 524288,
                436207616: 524304,
                452984832: 1073741840,
                469762048: 540672,
                486539264: 1073758208,
                503316480: 1073741824,
                520093696: 1074282512,
                276824064: 540688,
                293601280: 524288,
                310378496: 1074266112,
                327155712: 16384,
                343932928: 1073758208,
                360710144: 1074282512,
                377487360: 16,
                394264576: 1073741824,
                411041792: 1074282496,
                427819008: 1073741840,
                444596224: 1073758224,
                461373440: 524304,
                478150656: 0,
                494927872: 16400,
                511705088: 1074266128,
                528482304: 540672
            }, {
                0: 260,
                1048576: 0,
                2097152: 67109120,
                3145728: 65796,
                4194304: 65540,
                5242880: 67108868,
                6291456: 67174660,
                7340032: 67174400,
                8388608: 67108864,
                9437184: 67174656,
                10485760: 65792,
                11534336: 67174404,
                12582912: 67109124,
                13631488: 65536,
                14680064: 4,
                15728640: 256,
                524288: 67174656,
                1572864: 67174404,
                2621440: 0,
                3670016: 67109120,
                4718592: 67108868,
                5767168: 65536,
                6815744: 65540,
                7864320: 260,
                8912896: 4,
                9961472: 256,
                11010048: 67174400,
                12058624: 65796,
                13107200: 65792,
                14155776: 67109124,
                15204352: 67174660,
                16252928: 67108864,
                16777216: 67174656,
                17825792: 65540,
                18874368: 65536,
                19922944: 67109120,
                20971520: 256,
                22020096: 67174660,
                23068672: 67108868,
                24117248: 0,
                25165824: 67109124,
                26214400: 67108864,
                27262976: 4,
                28311552: 65792,
                29360128: 67174400,
                30408704: 260,
                31457280: 65796,
                32505856: 67174404,
                17301504: 67108864,
                18350080: 260,
                19398656: 67174656,
                20447232: 0,
                21495808: 65540,
                22544384: 67109120,
                23592960: 256,
                24641536: 67174404,
                25690112: 65536,
                26738688: 67174660,
                27787264: 65796,
                28835840: 67108868,
                29884416: 67109124,
                30932992: 67174400,
                31981568: 4,
                33030144: 65792
            }, {
                0: 2151682048,
                65536: 2147487808,
                131072: 4198464,
                196608: 2151677952,
                262144: 0,
                327680: 4198400,
                393216: 2147483712,
                458752: 4194368,
                524288: 2147483648,
                589824: 4194304,
                655360: 64,
                720896: 2147487744,
                786432: 2151678016,
                851968: 4160,
                917504: 4096,
                983040: 2151682112,
                32768: 2147487808,
                98304: 64,
                163840: 2151678016,
                229376: 2147487744,
                294912: 4198400,
                360448: 2151682112,
                425984: 0,
                491520: 2151677952,
                557056: 4096,
                622592: 2151682048,
                688128: 4194304,
                753664: 4160,
                819200: 2147483648,
                884736: 4194368,
                950272: 4198464,
                1015808: 2147483712,
                1048576: 4194368,
                1114112: 4198400,
                1179648: 2147483712,
                1245184: 0,
                1310720: 4160,
                1376256: 2151678016,
                1441792: 2151682048,
                1507328: 2147487808,
                1572864: 2151682112,
                1638400: 2147483648,
                1703936: 2151677952,
                1769472: 4198464,
                1835008: 2147487744,
                1900544: 4194304,
                1966080: 64,
                2031616: 4096,
                1081344: 2151677952,
                1146880: 2151682112,
                1212416: 0,
                1277952: 4198400,
                1343488: 4194368,
                1409024: 2147483648,
                1474560: 2147487808,
                1540096: 64,
                1605632: 2147483712,
                1671168: 4096,
                1736704: 2147487744,
                1802240: 2151678016,
                1867776: 4160,
                1933312: 2151682048,
                1998848: 4194304,
                2064384: 4198464
            }, {
                0: 128,
                4096: 17039360,
                8192: 262144,
                12288: 536870912,
                16384: 537133184,
                20480: 16777344,
                24576: 553648256,
                28672: 262272,
                32768: 16777216,
                36864: 537133056,
                40960: 536871040,
                45056: 553910400,
                49152: 553910272,
                53248: 0,
                57344: 17039488,
                61440: 553648128,
                2048: 17039488,
                6144: 553648256,
                10240: 128,
                14336: 17039360,
                18432: 262144,
                22528: 537133184,
                26624: 553910272,
                30720: 536870912,
                34816: 537133056,
                38912: 0,
                43008: 553910400,
                47104: 16777344,
                51200: 536871040,
                55296: 553648128,
                59392: 16777216,
                63488: 262272,
                65536: 262144,
                69632: 128,
                73728: 536870912,
                77824: 553648256,
                81920: 16777344,
                86016: 553910272,
                90112: 537133184,
                94208: 16777216,
                98304: 553910400,
                102400: 553648128,
                106496: 17039360,
                110592: 537133056,
                114688: 262272,
                118784: 536871040,
                122880: 0,
                126976: 17039488,
                67584: 553648256,
                71680: 16777216,
                75776: 17039360,
                79872: 537133184,
                83968: 536870912,
                88064: 17039488,
                92160: 128,
                96256: 553910272,
                100352: 262272,
                104448: 553910400,
                108544: 0,
                112640: 553648128,
                116736: 16777344,
                120832: 262144,
                124928: 537133056,
                129024: 536871040
            }, {
                0: 268435464,
                256: 8192,
                512: 270532608,
                768: 270540808,
                1024: 268443648,
                1280: 2097152,
                1536: 2097160,
                1792: 268435456,
                2048: 0,
                2304: 268443656,
                2560: 2105344,
                2816: 8,
                3072: 270532616,
                3328: 2105352,
                3584: 8200,
                3840: 270540800,
                128: 270532608,
                384: 270540808,
                640: 8,
                896: 2097152,
                1152: 2105352,
                1408: 268435464,
                1664: 268443648,
                1920: 8200,
                2176: 2097160,
                2432: 8192,
                2688: 268443656,
                2944: 270532616,
                3200: 0,
                3456: 270540800,
                3712: 2105344,
                3968: 268435456,
                4096: 268443648,
                4352: 270532616,
                4608: 270540808,
                4864: 8200,
                5120: 2097152,
                5376: 268435456,
                5632: 268435464,
                5888: 2105344,
                6144: 2105352,
                6400: 0,
                6656: 8,
                6912: 270532608,
                7168: 8192,
                7424: 268443656,
                7680: 270540800,
                7936: 2097160,
                4224: 8,
                4480: 2105344,
                4736: 2097152,
                4992: 268435464,
                5248: 268443648,
                5504: 8200,
                5760: 270540808,
                6016: 270532608,
                6272: 270540800,
                6528: 270532616,
                6784: 8192,
                7040: 2105352,
                7296: 2097160,
                7552: 0,
                7808: 268435456,
                8064: 268443656
            }, {
                0: 1048576,
                16: 33555457,
                32: 1024,
                48: 1049601,
                64: 34604033,
                80: 0,
                96: 1,
                112: 34603009,
                128: 33555456,
                144: 1048577,
                160: 33554433,
                176: 34604032,
                192: 34603008,
                208: 1025,
                224: 1049600,
                240: 33554432,
                8: 34603009,
                24: 0,
                40: 33555457,
                56: 34604032,
                72: 1048576,
                88: 33554433,
                104: 33554432,
                120: 1025,
                136: 1049601,
                152: 33555456,
                168: 34603008,
                184: 1048577,
                200: 1024,
                216: 34604033,
                232: 1,
                248: 1049600,
                256: 33554432,
                272: 1048576,
                288: 33555457,
                304: 34603009,
                320: 1048577,
                336: 33555456,
                352: 34604032,
                368: 1049601,
                384: 1025,
                400: 34604033,
                416: 1049600,
                432: 1,
                448: 0,
                464: 34603008,
                480: 33554433,
                496: 1024,
                264: 1049600,
                280: 33555457,
                296: 34603009,
                312: 1,
                328: 33554432,
                344: 1048576,
                360: 1025,
                376: 34604032,
                392: 33554433,
                408: 34603008,
                424: 0,
                440: 34604033,
                456: 1049601,
                472: 1024,
                488: 33555456,
                504: 1048577
            }, {
                0: 134219808,
                1: 131072,
                2: 134217728,
                3: 32,
                4: 131104,
                5: 134350880,
                6: 134350848,
                7: 2048,
                8: 134348800,
                9: 134219776,
                10: 133120,
                11: 134348832,
                12: 2080,
                13: 0,
                14: 134217760,
                15: 133152,
                2147483648: 2048,
                2147483649: 134350880,
                2147483650: 134219808,
                2147483651: 134217728,
                2147483652: 134348800,
                2147483653: 133120,
                2147483654: 133152,
                2147483655: 32,
                2147483656: 134217760,
                2147483657: 2080,
                2147483658: 131104,
                2147483659: 134350848,
                2147483660: 0,
                2147483661: 134348832,
                2147483662: 134219776,
                2147483663: 131072,
                16: 133152,
                17: 134350848,
                18: 32,
                19: 2048,
                20: 134219776,
                21: 134217760,
                22: 134348832,
                23: 131072,
                24: 0,
                25: 131104,
                26: 134348800,
                27: 134219808,
                28: 134350880,
                29: 133120,
                30: 2080,
                31: 134217728,
                2147483664: 131072,
                2147483665: 2048,
                2147483666: 134348832,
                2147483667: 133152,
                2147483668: 32,
                2147483669: 134348800,
                2147483670: 134217728,
                2147483671: 134219808,
                2147483672: 134350880,
                2147483673: 134217760,
                2147483674: 134219776,
                2147483675: 0,
                2147483676: 133120,
                2147483677: 2080,
                2147483678: 131104,
                2147483679: 134350848
            }]
              , f = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679]
              , n = a.DES = i.extend({
                _doReset: function() {
                    for (var e = this._key.words, t = [], r = 0; r < 56; r++) {
                        var i = u[r] - 1;
                        t[r] = e[i >>> 5] >>> 31 - i % 32 & 1
                    }
                    for (var a = this._subKeys = [], n = 0; n < 16; n++) {
                        var s = a[n] = []
                          , o = c[n];
                        for (r = 0; r < 24; r++)
                            s[r / 6 | 0] |= t[(d[r] - 1 + o) % 28] << 31 - r % 6,
                            s[4 + (r / 6 | 0)] |= t[28 + (d[r + 24] - 1 + o) % 28] << 31 - r % 6;
                        for (s[0] = s[0] << 1 | s[0] >>> 31,
                        r = 1; r < 7; r++)
                            s[r] = s[r] >>> 4 * (r - 1) + 3;
                        s[7] = s[7] << 5 | s[7] >>> 27
                    }
                    var l = this._invSubKeys = [];
                    for (r = 0; r < 16; r++)
                        l[r] = a[15 - r]
                },
                encryptBlock: function(e, t) {
                    this._doCryptBlock(e, t, this._subKeys)
                },
                decryptBlock: function(e, t) {
                    this._doCryptBlock(e, t, this._invSubKeys)
                },
                _doCryptBlock: function(e, t, r) {
                    this._lBlock = e[t],
                    this._rBlock = e[t + 1],
                    p.call(this, 4, 252645135),
                    p.call(this, 16, 65535),
                    g.call(this, 2, 858993459),
                    g.call(this, 8, 16711935),
                    p.call(this, 1, 1431655765);
                    for (var i = 0; i < 16; i++) {
                        for (var a = r[i], n = this._lBlock, s = this._rBlock, o = 0, l = 0; l < 8; l++)
                            o |= h[l][((s ^ a[l]) & f[l]) >>> 0];
                        this._lBlock = s,
                        this._rBlock = n ^ o
                    }
                    var u = this._lBlock;
                    this._lBlock = this._rBlock,
                    this._rBlock = u,
                    p.call(this, 1, 1431655765),
                    g.call(this, 8, 16711935),
                    g.call(this, 2, 858993459),
                    p.call(this, 16, 65535),
                    p.call(this, 4, 252645135),
                    e[t] = this._lBlock,
                    e[t + 1] = this._rBlock
                },
                keySize: 2,
                ivSize: 2,
                blockSize: 2
            });
            function p(e, t) {
                var r = (this._lBlock >>> e ^ this._rBlock) & t;
                this._rBlock ^= r,
                this._lBlock ^= r << e
            }
            function g(e, t) {
                var r = (this._rBlock >>> e ^ this._lBlock) & t;
                this._lBlock ^= r,
                this._rBlock ^= r << e
            }
            e.DES = i._createHelper(n);
            var s = a.TripleDES = i.extend({
                _doReset: function() {
                    var e = this._key.words;
                    this._des1 = n.createEncryptor(r.create(e.slice(0, 2))),
                    this._des2 = n.createEncryptor(r.create(e.slice(2, 4))),
                    this._des3 = n.createEncryptor(r.create(e.slice(4, 6)))
                },
                encryptBlock: function(e, t) {
                    this._des1.encryptBlock(e, t),
                    this._des2.decryptBlock(e, t),
                    this._des3.encryptBlock(e, t)
                },
                decryptBlock: function(e, t) {
                    this._des3.decryptBlock(e, t),
                    this._des2.encryptBlock(e, t),
                    this._des1.decryptBlock(e, t)
                },
                keySize: 6,
                ivSize: 2,
                blockSize: 2
            });
            e.TripleDES = i._createHelper(s)
        }(),
        function() {
            var e = Oe
              , t = e.lib.StreamCipher
              , r = e.algo
              , i = r.RC4 = t.extend({
                _doReset: function() {
                    for (var e = this._key, t = e.words, r = e.sigBytes, i = this._S = [], a = 0; a < 256; a++)
                        i[a] = a;
                    for (var n = a = 0; a < 256; a++) {
                        var s = a % r
                          , o = t[s >>> 2] >>> 24 - s % 4 * 8 & 255;
                        n = (n + i[a] + o) % 256;
                        var l = i[a];
                        i[a] = i[n],
                        i[n] = l
                    }
                    this._i = this._j = 0
                },
                _doProcessBlock: function(e, t) {
                    e[t] ^= a.call(this)
                },
                keySize: 8,
                ivSize: 0
            });
            function a() {
                for (var e = this._S, t = this._i, r = this._j, i = 0, a = 0; a < 4; a++) {
                    r = (r + e[t = (t + 1) % 256]) % 256;
                    var n = e[t];
                    e[t] = e[r],
                    e[r] = n,
                    i |= e[(e[t] + e[r]) % 256] << 24 - 8 * a
                }
                return this._i = t,
                this._j = r,
                i
            }
            e.RC4 = t._createHelper(i);
            var n = r.RC4Drop = i.extend({
                cfg: i.cfg.extend({
                    drop: 192
                }),
                _doReset: function() {
                    i._doReset.call(this);
                    for (var e = this.cfg.drop; 0 < e; e--)
                        a.call(this)
                }
            });
            e.RC4Drop = t._createHelper(n)
        }(),
        Oe.mode.CTRGladman = function() {
            var e = Oe.lib.BlockCipherMode.extend();
            function u(e) {
                if (255 == (e >> 24 & 255)) {
                    var t = e >> 16 & 255
                      , r = e >> 8 & 255
                      , i = 255 & e;
                    255 === t ? (t = 0,
                    255 === r ? (r = 0,
                    255 === i ? i = 0 : ++i) : ++r) : ++t,
                    e = 0,
                    e += t << 16,
                    e += r << 8,
                    e += i
                } else
                    e += 1 << 24;
                return e
            }
            var t = e.Encryptor = e.extend({
                processBlock: function(e, t) {
                    var r, i = this._cipher, a = i.blockSize, n = this._iv, s = this._counter;
                    n && (s = this._counter = n.slice(0),
                    this._iv = void 0),
                    0 === ((r = s)[0] = u(r[0])) && (r[1] = u(r[1]));
                    var o = s.slice(0);
                    i.encryptBlock(o, 0);
                    for (var l = 0; l < a; l++)
                        e[t + l] ^= o[l]
                }
            });
            return e.Decryptor = t,
            e
        }(),
        function() {
            var e = Oe
              , t = e.lib.StreamCipher
              , a = []
              , l = []
              , u = []
              , r = e.algo.Rabbit = t.extend({
                _doReset: function() {
                    for (var e = this._key.words, t = this.cfg.iv, r = 0; r < 4; r++)
                        e[r] = 16711935 & (e[r] << 8 | e[r] >>> 24) | 4278255360 & (e[r] << 24 | e[r] >>> 8);
                    var i = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16]
                      , a = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]];
                    for (r = this._b = 0; r < 4; r++)
                        h.call(this);
                    for (r = 0; r < 8; r++)
                        a[r] ^= i[r + 4 & 7];
                    if (t) {
                        var n = t.words
                          , s = n[0]
                          , o = n[1]
                          , l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                          , u = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8)
                          , d = l >>> 16 | 4294901760 & u
                          , c = u << 16 | 65535 & l;
                        for (a[0] ^= l,
                        a[1] ^= d,
                        a[2] ^= u,
                        a[3] ^= c,
                        a[4] ^= l,
                        a[5] ^= d,
                        a[6] ^= u,
                        a[7] ^= c,
                        r = 0; r < 4; r++)
                            h.call(this)
                    }
                },
                _doProcessBlock: function(e, t) {
                    var r = this._X;
                    h.call(this),
                    a[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
                    a[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
                    a[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
                    a[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
                    for (var i = 0; i < 4; i++)
                        a[i] = 16711935 & (a[i] << 8 | a[i] >>> 24) | 4278255360 & (a[i] << 24 | a[i] >>> 8),
                        e[t + i] ^= a[i]
                },
                blockSize: 4,
                ivSize: 2
            });
            function h() {
                for (var e = this._X, t = this._C, r = 0; r < 8; r++)
                    l[r] = t[r];
                for (t[0] = t[0] + 1295307597 + this._b | 0,
                t[1] = t[1] + 3545052371 + (t[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0,
                t[2] = t[2] + 886263092 + (t[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0,
                t[3] = t[3] + 1295307597 + (t[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0,
                t[4] = t[4] + 3545052371 + (t[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0,
                t[5] = t[5] + 886263092 + (t[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0,
                t[6] = t[6] + 1295307597 + (t[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0,
                t[7] = t[7] + 3545052371 + (t[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0,
                this._b = t[7] >>> 0 < l[7] >>> 0 ? 1 : 0,
                r = 0; r < 8; r++) {
                    var i = e[r] + t[r]
                      , a = 65535 & i
                      , n = i >>> 16
                      , s = ((a * a >>> 17) + a * n >>> 15) + n * n
                      , o = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                    u[r] = s ^ o
                }
                e[0] = u[0] + (u[7] << 16 | u[7] >>> 16) + (u[6] << 16 | u[6] >>> 16) | 0,
                e[1] = u[1] + (u[0] << 8 | u[0] >>> 24) + u[7] | 0,
                e[2] = u[2] + (u[1] << 16 | u[1] >>> 16) + (u[0] << 16 | u[0] >>> 16) | 0,
                e[3] = u[3] + (u[2] << 8 | u[2] >>> 24) + u[1] | 0,
                e[4] = u[4] + (u[3] << 16 | u[3] >>> 16) + (u[2] << 16 | u[2] >>> 16) | 0,
                e[5] = u[5] + (u[4] << 8 | u[4] >>> 24) + u[3] | 0,
                e[6] = u[6] + (u[5] << 16 | u[5] >>> 16) + (u[4] << 16 | u[4] >>> 16) | 0,
                e[7] = u[7] + (u[6] << 8 | u[6] >>> 24) + u[5] | 0
            }
            e.Rabbit = t._createHelper(r)
        }(),
        Oe.mode.CTR = (g = Oe.lib.BlockCipherMode.extend(),
        v = g.Encryptor = g.extend({
            processBlock: function(e, t) {
                var r = this._cipher
                  , i = r.blockSize
                  , a = this._iv
                  , n = this._counter;
                a && (n = this._counter = a.slice(0),
                this._iv = void 0);
                var s = n.slice(0);
                r.encryptBlock(s, 0),
                n[i - 1] = n[i - 1] + 1 | 0;
                for (var o = 0; o < i; o++)
                    e[t + o] ^= s[o]
            }
        }),
        g.Decryptor = v,
        g),
        function() {
            var e = Oe
              , t = e.lib.StreamCipher
              , a = []
              , l = []
              , u = []
              , r = e.algo.RabbitLegacy = t.extend({
                _doReset: function() {
                    for (var e = this._key.words, t = this.cfg.iv, r = this._X = [e[0], e[3] << 16 | e[2] >>> 16, e[1], e[0] << 16 | e[3] >>> 16, e[2], e[1] << 16 | e[0] >>> 16, e[3], e[2] << 16 | e[1] >>> 16], i = this._C = [e[2] << 16 | e[2] >>> 16, 4294901760 & e[0] | 65535 & e[1], e[3] << 16 | e[3] >>> 16, 4294901760 & e[1] | 65535 & e[2], e[0] << 16 | e[0] >>> 16, 4294901760 & e[2] | 65535 & e[3], e[1] << 16 | e[1] >>> 16, 4294901760 & e[3] | 65535 & e[0]], a = this._b = 0; a < 4; a++)
                        h.call(this);
                    for (a = 0; a < 8; a++)
                        i[a] ^= r[a + 4 & 7];
                    if (t) {
                        var n = t.words
                          , s = n[0]
                          , o = n[1]
                          , l = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                          , u = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8)
                          , d = l >>> 16 | 4294901760 & u
                          , c = u << 16 | 65535 & l;
                        for (i[0] ^= l,
                        i[1] ^= d,
                        i[2] ^= u,
                        i[3] ^= c,
                        i[4] ^= l,
                        i[5] ^= d,
                        i[6] ^= u,
                        i[7] ^= c,
                        a = 0; a < 4; a++)
                            h.call(this)
                    }
                },
                _doProcessBlock: function(e, t) {
                    var r = this._X;
                    h.call(this),
                    a[0] = r[0] ^ r[5] >>> 16 ^ r[3] << 16,
                    a[1] = r[2] ^ r[7] >>> 16 ^ r[5] << 16,
                    a[2] = r[4] ^ r[1] >>> 16 ^ r[7] << 16,
                    a[3] = r[6] ^ r[3] >>> 16 ^ r[1] << 16;
                    for (var i = 0; i < 4; i++)
                        a[i] = 16711935 & (a[i] << 8 | a[i] >>> 24) | 4278255360 & (a[i] << 24 | a[i] >>> 8),
                        e[t + i] ^= a[i]
                },
                blockSize: 4,
                ivSize: 2
            });
            function h() {
                for (var e = this._X, t = this._C, r = 0; r < 8; r++)
                    l[r] = t[r];
                for (t[0] = t[0] + 1295307597 + this._b | 0,
                t[1] = t[1] + 3545052371 + (t[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0,
                t[2] = t[2] + 886263092 + (t[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0,
                t[3] = t[3] + 1295307597 + (t[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0,
                t[4] = t[4] + 3545052371 + (t[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0,
                t[5] = t[5] + 886263092 + (t[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0,
                t[6] = t[6] + 1295307597 + (t[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0,
                t[7] = t[7] + 3545052371 + (t[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0,
                this._b = t[7] >>> 0 < l[7] >>> 0 ? 1 : 0,
                r = 0; r < 8; r++) {
                    var i = e[r] + t[r]
                      , a = 65535 & i
                      , n = i >>> 16
                      , s = ((a * a >>> 17) + a * n >>> 15) + n * n
                      , o = ((4294901760 & i) * i | 0) + ((65535 & i) * i | 0);
                    u[r] = s ^ o
                }
                e[0] = u[0] + (u[7] << 16 | u[7] >>> 16) + (u[6] << 16 | u[6] >>> 16) | 0,
                e[1] = u[1] + (u[0] << 8 | u[0] >>> 24) + u[7] | 0,
                e[2] = u[2] + (u[1] << 16 | u[1] >>> 16) + (u[0] << 16 | u[0] >>> 16) | 0,
                e[3] = u[3] + (u[2] << 8 | u[2] >>> 24) + u[1] | 0,
                e[4] = u[4] + (u[3] << 16 | u[3] >>> 16) + (u[2] << 16 | u[2] >>> 16) | 0,
                e[5] = u[5] + (u[4] << 8 | u[4] >>> 24) + u[3] | 0,
                e[6] = u[6] + (u[5] << 16 | u[5] >>> 16) + (u[4] << 16 | u[4] >>> 16) | 0,
                e[7] = u[7] + (u[6] << 8 | u[6] >>> 24) + u[5] | 0
            }
            e.RabbitLegacy = t._createHelper(r)
        }(),
        Oe.pad.ZeroPadding = {
            pad: function(e, t) {
                var r = 4 * t;
                e.clamp(),
                e.sigBytes += r - (e.sigBytes % r || r)
            },
            unpad: function(e) {
                for (var t = e.words, r = e.sigBytes - 1; !(t[r >>> 2] >>> 24 - r % 4 * 8 & 255); )
                    r--;
                e.sigBytes = r + 1
            }
        },
        Oe)
    }
    , function(e, v) {
        var s = ["s", "i", "y", "u", "a", "n", "t", "l", "w", "x"]
          , o = [function(e) {
            return e
        }
        , function(e, t, r) {
            r = r || "eDu_51Cto_siyuanTlw";
            for (var i = v.base64decode(e).split(""), a = v.MD5(t + r).toString(), n = a.length - 1; 0 <= n; n--) {
                var s = a[n].charCodeAt() % (i.length - 1);
                i.splice(s, 1)
            }
            return i.join("")
        }
        , function(e, t, r) {
            for (var i = t % 7, a = e.length, n = "", s = 0; s < a / 2; s++) {
                var o = 2 * s;
                n += 0 == i || s % i == 0 ? e[o] + e[o + 1] : e[o + 1] ? e[o + 1] + e[o] : e[o]
            }
            var l = v.base64decode(n)
              , u = (l.length - 1) / 2
              , d = "";
            for (s = 0; s < u; s++)
                o = 2 * s,
                i < s && o++,
                d += s % 3 == 0 ? l[o] : l[o + 1];
            return d
        }
        , function(e) {
            return e
        }
        , function(e) {
            return e
        }
        , function(e, t, r) {
            var i, a, n, s, o, l, u, d = e.slice(0, 7) + e.slice(10, 12) + e.slice(15, -3), c = "", h = 0, f = 0, p = "";
            d = d.split("").reverse().join(""),
            i = v.eeb64(d),
            a = parseInt(i.substr(0, 1)),
            s = (n = i.slice(6, -3)).match(/^\d*/),
            o = n.match(/\d*$/),
            l = s[0],
            u = o[0],
            n = n.replace(/^\d*/, "").replace(/\d*$/, "");
            for (var g = 0; g < u.length; g++)
                c += v.bu(parseInt(u[g]).toString(2), 3);
            for (c = c.substr(a),
            g = 0; g < c.length; g++)
                1 == c[g] ? (p += l[f],
                f++) : (p += n[h],
                h++);
            return p
        }
        , function(e, t, r) {
            for (var i, a = {
                B: "0",
                q: "1",
                r: "2",
                C: "3",
                w: "4",
                x: "5",
                V: "6",
                e: "7",
                f: "8",
                D: "9",
                9: "a",
                4: "b",
                5: "c",
                7: "d",
                m: "e",
                n: "f",
                o: "g",
                H: "h",
                I: "i",
                N: "j",
                O: "k",
                P: "l",
                Q: "m",
                R: "n",
                S: "o",
                U: "p",
                X: "q",
                L: "r",
                M: "s",
                a: "t",
                b: "u",
                F: "v",
                c: "w",
                d: "x",
                g: "y",
                h: "z",
                i: "A",
                j: "B",
                y: "C",
                z: "D",
                k: "E",
                l: "F",
                6: "G",
                G: "H",
                A: "I",
                p: "J",
                s: "K",
                t: "L",
                u: "M",
                J: "N",
                K: "O",
                v: "P",
                W: "Q",
                0: "R",
                Y: "S",
                Z: "T",
                2: "U",
                3: "V",
                E: "W",
                T: "X",
                8: "Y",
                1: "Z"
            }, n = 5, s = "", o = 0, l = "", u = 0, d = 0; d < e.length; d++) {
                var c = e[d];
                s += a[c] ? a[c] : c
            }
            for (d = 0; d < 8; d++)
                i = 7 == d ? 32 - u : Math.abs(8 - n++),
                l += s.substr(o++, 1),
                o += i,
                u += i;
            return l += s.substr(40),
            v.eeb64(l.split("").reverse().join(""))
        }
        , function(e, t, r) {
            r = r || "eDu_51Cto_siyuanTlw";
            var i = v.eeb64(e)
              , a = v.MD5(r + t).toString().slice(0, 16)
              , n = i.indexOf(a)
              , s = parseInt(i.slice(0, n), 16);
            if (!n)
                return !1;
            var o = i.substr(16 + n);
            return o.length == s && o
        }
        ];
        v.bu = function(e, t) {
            for (var r = t - (e += "").length; 0 < r; r--)
                e = "0" + e;
            return e
        }
        ,
        v.MD5 = function(e) {
            var t, a = 0, n = 8;
            function o(e, t, r, i, a, n) {
                return g((s = g(g(t, e), g(i, n))) << a | s >>> 32 - a, r);
                var s
            }
            function c(e, t, r, i, a, n, s) {
                return o(t & r | ~t & i, e, t, a, n, s)
            }
            function h(e, t, r, i, a, n, s) {
                return o(t & i | r & ~i, e, t, a, n, s)
            }
            function f(e, t, r, i, a, n, s) {
                return o(t ^ r ^ i, e, t, a, n, s)
            }
            function p(e, t, r, i, a, n, s) {
                return o(r ^ (t | ~i), e, t, a, n, s)
            }
            function g(e, t) {
                var r = (65535 & e) + (65535 & t);
                return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
            }
            return function(e) {
                for (var t = a ? "0123456789ABCDEF" : "0123456789abcdef", r = "", i = 0; i < 4 * e.length; i++)
                    r += t.charAt(e[i >> 2] >> i % 4 * 8 + 4 & 15) + t.charAt(e[i >> 2] >> i % 4 * 8 & 15);
                return r
            }(function(e, t) {
                e[t >> 5] |= 128 << t % 32,
                e[14 + (t + 64 >>> 9 << 4)] = t;
                for (var r = 1732584193, i = -271733879, a = -1732584194, n = 271733878, s = 0; s < e.length; s += 16) {
                    var o = r
                      , l = i
                      , u = a
                      , d = n;
                    i = p(i = p(i = p(i = p(i = f(i = f(i = f(i = f(i = h(i = h(i = h(i = h(i = c(i = c(i = c(i = c(i, a = c(a, n = c(n, r = c(r, i, a, n, e[s + 0], 7, -680876936), i, a, e[s + 1], 12, -389564586), r, i, e[s + 2], 17, 606105819), n, r, e[s + 3], 22, -1044525330), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 4], 7, -176418897), i, a, e[s + 5], 12, 1200080426), r, i, e[s + 6], 17, -1473231341), n, r, e[s + 7], 22, -45705983), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 8], 7, 1770035416), i, a, e[s + 9], 12, -1958414417), r, i, e[s + 10], 17, -42063), n, r, e[s + 11], 22, -1990404162), a = c(a, n = c(n, r = c(r, i, a, n, e[s + 12], 7, 1804603682), i, a, e[s + 13], 12, -40341101), r, i, e[s + 14], 17, -1502002290), n, r, e[s + 15], 22, 1236535329), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 1], 5, -165796510), i, a, e[s + 6], 9, -1069501632), r, i, e[s + 11], 14, 643717713), n, r, e[s + 0], 20, -373897302), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 5], 5, -701558691), i, a, e[s + 10], 9, 38016083), r, i, e[s + 15], 14, -660478335), n, r, e[s + 4], 20, -405537848), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 9], 5, 568446438), i, a, e[s + 14], 9, -1019803690), r, i, e[s + 3], 14, -187363961), n, r, e[s + 8], 20, 1163531501), a = h(a, n = h(n, r = h(r, i, a, n, e[s + 13], 5, -1444681467), i, a, e[s + 2], 9, -51403784), r, i, e[s + 7], 14, 1735328473), n, r, e[s + 12], 20, -1926607734), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 5], 4, -378558), i, a, e[s + 8], 11, -2022574463), r, i, e[s + 11], 16, 1839030562), n, r, e[s + 14], 23, -35309556), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 1], 4, -1530992060), i, a, e[s + 4], 11, 1272893353), r, i, e[s + 7], 16, -155497632), n, r, e[s + 10], 23, -1094730640), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 13], 4, 681279174), i, a, e[s + 0], 11, -358537222), r, i, e[s + 3], 16, -722521979), n, r, e[s + 6], 23, 76029189), a = f(a, n = f(n, r = f(r, i, a, n, e[s + 9], 4, -640364487), i, a, e[s + 12], 11, -421815835), r, i, e[s + 15], 16, 530742520), n, r, e[s + 2], 23, -995338651), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 0], 6, -198630844), i, a, e[s + 7], 10, 1126891415), r, i, e[s + 14], 15, -1416354905), n, r, e[s + 5], 21, -57434055), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 12], 6, 1700485571), i, a, e[s + 3], 10, -1894986606), r, i, e[s + 10], 15, -1051523), n, r, e[s + 1], 21, -2054922799), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 8], 6, 1873313359), i, a, e[s + 15], 10, -30611744), r, i, e[s + 6], 15, -1560198380), n, r, e[s + 13], 21, 1309151649), a = p(a, n = p(n, r = p(r, i, a, n, e[s + 4], 6, -145523070), i, a, e[s + 11], 10, -1120210379), r, i, e[s + 2], 15, 718787259), n, r, e[s + 9], 21, -343485551),
                    r = g(r, o),
                    i = g(i, l),
                    a = g(a, u),
                    n = g(n, d)
                }
                return Array(r, i, a, n)
            }(function(e) {
                for (var t = Array(), r = (1 << n) - 1, i = 0; i < e.length * n; i += n)
                    t[i >> 5] |= (e.charCodeAt(i / n) & r) << i % 32;
                return t
            }(t = e), t.length * n))
        }
        ,
        v.eeb64 = function(e) {
            for (var t = "", r = "", i = 0; i < e.length; i++)
                t += v.bu("BqrCwxVefD9457mnoHINOPQRSUXLMabFcdghijyzkl6GApstuJKvW0YZ23ET81=_".indexOf(e[i]).toString(2), 6);
            for (t = t.substring(t.length % 8),
            i = 0; i < Math.ceil(t.length / 8); i++)
                r += String.fromCharCode(parseInt(t.substr(8 * i, 8), 2));
            return v.base64decode(r)
        }
        ,
        v.dec = function(e, t) {
            function r(e) {
                for (var t = 0; t < s.length; t++)
                    if (s[t] == e)
                        return t
            }
            e[1];
            var i = [o[r(e[13])], o[r(e[8])], o[r(e[4])]]
              , a = e.substr(0, 1) + e.substr(2, 2) + e.substr(5, 3) + e.substr(9, 4) + e.substr(14);
            for (var n in i)
                a = i[n](a, t);
            return a
        }
        ,
        v.base64decode = function(e) {
            var t, r, i, a, n, s, o, l = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);
            for (s = e.length,
            n = 0,
            o = ""; n < s; ) {
                for (; t = l[255 & e.charCodeAt(n++)],
                n < s && -1 == t; )
                    ;
                if (-1 == t)
                    break;
                for (; r = l[255 & e.charCodeAt(n++)],
                n < s && -1 == r; )
                    ;
                if (-1 == r)
                    break;
                o += String.fromCharCode(t << 2 | (48 & r) >> 4);
                do {
                    if (61 == (i = 255 & e.charCodeAt(n++)))
                        return o;
                    i = l[i]
                } while (n < s && -1 == i);if (-1 == i)
                    break;
                o += String.fromCharCode((15 & r) << 4 | (60 & i) >> 2);
                do {
                    if (61 == (a = 255 & e.charCodeAt(n++)))
                        return o;
                    a = l[a]
                } while (n < s && -1 == a);if (-1 == a)
                    break;
                o += String.fromCharCode((3 & i) << 6 | a)
            }
            return o
        }
        ,
        v.base64ToArrayBuffer = function(e) {
            for (var t = atob(e), r = t.length, i = new Uint8Array(r), a = 0; a < r; a++)
                i[a] = t.charCodeAt(a);
            return i.buffer
        }
        ,
        v.arrayBufferToBase64 = function(e) {
            for (var t = "", r = new Uint8Array(e), i = r.byteLength, a = 0; a < i; a++)
                t += String.fromCharCode(r[a]);
            return btoa(t)
        }
    }
    , function(e, t, r) {
        "use strict";
        (function(p) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var g = r(22)
              , v = r(0)
              , m = r(10)
              , e = function() {
                function e(e, t, r) {
                    this.observer = e,
                    this.config = r,
                    this.remuxer = t
                }
                return e.prototype.resetInitSegment = function(e, t, r, i) {
                    this._audioTrack = {
                        container: "audio/adts",
                        type: "audio",
                        id: 0,
                        sequenceNumber: 0,
                        isAAC: !0,
                        samples: [],
                        len: 0,
                        manifestCodec: t,
                        duration: i,
                        inputTimeScale: 9e4
                    }
                }
                ,
                e.prototype.resetTimeStamp = function() {}
                ,
                e.probe = function(e) {
                    if (!e)
                        return !1;
                    for (var t = (m.default.getID3Data(e, 0) || []).length, r = e.length; t < r; t++)
                        if (g.probe(e, t))
                            return v.logger.log("ADTS sync word found !"),
                            !0;
                    return !1
                }
                ,
                e.prototype.append = function(e, t, r, i) {
                    for (var a = this._audioTrack, n = m.default.getID3Data(e, 0) || [], s = m.default.getTimeStamp(n), o = p.isFinite(s) ? 90 * s : 9e4 * t, l = 0, u = o, d = e.length, c = n.length, h = [{
                        pts: u,
                        dts: u,
                        data: n
                    }]; c < d - 1; )
                        if (g.isHeader(e, c) && c + 5 < d) {
                            g.initTrackConfig(a, this.observer, e, c, a.manifestCodec);
                            var f = g.appendFrame(a, e, c, o, l);
                            if (!f) {
                                v.logger.log("Unable to parse AAC frame");
                                break
                            }
                            c += f.length,
                            u = f.sample.pts,
                            l++
                        } else
                            m.default.isHeader(e, c) ? (n = m.default.getID3Data(e, c),
                            h.push({
                                pts: u,
                                dts: u,
                                data: n
                            }),
                            c += n.length) : c++;
                    this.remuxer.remux(a, {
                        samples: []
                    }, {
                        samples: h,
                        inputTimeScale: 9e4
                    }, {
                        samples: []
                    }, t, r, i)
                }
                ,
                e.prototype.destroy = function() {}
                ,
                e
            }();
            t.default = e
        }
        ).call(this, r(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var v = r(22)
          , o = r(23)
          , I = r(1)
          , A = r(43)
          , i = r(44)
          , P = r(0)
          , x = r(3)
          , a = {
            video: 1,
            audio: 2,
            id3: 3,
            text: 4
        }
          , n = function() {
            function C(e, t, r, i) {
                this.observer = e,
                this.config = r,
                this.typeSupported = i,
                this.remuxer = t,
                this.sampleAes = null
            }
            return C.prototype.setDecryptData = function(e) {
                null != e && null != e.key && "SAMPLE-AES" === e.method ? this.sampleAes = new i.default(this.observer,this.config,e,this.discardEPB) : this.sampleAes = null
            }
            ,
            C.probe = function(e) {
                var t = C._syncOffset(e);
                return !(t < 0 || (t && P.logger.warn("MPEG2-TS detected but first sync word found @ offset " + t + ", junk ahead ?"),
                0))
            }
            ,
            C._syncOffset = function(e) {
                for (var t = Math.min(1e3, e.length - 564), r = 0; r < t; ) {
                    if (71 === e[r] && 71 === e[r + 188] && 71 === e[r + 376])
                        return r;
                    r++
                }
                return -1
            }
            ,
            C.createTrack = function(e, t) {
                return {
                    container: "video" === e || "audio" === e ? "video/mp2t" : void 0,
                    type: e,
                    id: a[e],
                    pid: -1,
                    inputTimeScale: 9e4,
                    sequenceNumber: 0,
                    samples: [],
                    len: 0,
                    dropped: "video" === e ? 0 : void 0,
                    isAAC: "audio" === e || void 0,
                    duration: "audio" === e ? t : void 0
                }
            }
            ,
            C.prototype.resetInitSegment = function(e, t, r, i) {
                this.pmtParsed = !1,
                this._pmtId = -1,
                this._avcTrack = C.createTrack("video", i),
                this._audioTrack = C.createTrack("audio", i),
                this._id3Track = C.createTrack("id3", i),
                this._txtTrack = C.createTrack("text", i),
                this.aacOverFlow = null,
                this.aacLastPTS = null,
                this.avcSample = null,
                this.audioCodec = t,
                this.videoCodec = r,
                this._duration = i
            }
            ,
            C.prototype.resetTimeStamp = function() {}
            ,
            C.prototype.append = function(e, t, r, i) {
                var a, n, s, o, l, u = e.length, d = !1;
                this.contiguous = r;
                var c = this.pmtParsed
                  , h = this._avcTrack
                  , f = this._audioTrack
                  , p = this._id3Track
                  , g = h.pid
                  , v = f.pid
                  , m = p.pid
                  , y = this._pmtId
                  , _ = h.pesData
                  , E = f.pesData
                  , S = p.pesData
                  , T = this._parsePAT
                  , b = this._parsePMT
                  , A = this._parsePES
                  , R = this._parseAVCPES.bind(this)
                  , D = this._parseAACPES.bind(this)
                  , k = this._parseMPEGPES.bind(this)
                  , w = this._parseID3PES.bind(this)
                  , L = C._syncOffset(e);
                for (u -= (u + L) % 188,
                a = L; a < u; a += 188)
                    if (71 === e[a]) {
                        if (n = !!(64 & e[a + 1]),
                        s = ((31 & e[a + 1]) << 8) + e[a + 2],
                        1 < (48 & e[a + 3]) >> 4) {
                            if ((o = a + 5 + e[a + 4]) === a + 188)
                                continue
                        } else
                            o = a + 4;
                        switch (s) {
                        case g:
                            n && (_ && (l = A(_)) && void 0 !== l.pts && R(l, !1),
                            _ = {
                                data: [],
                                size: 0
                            }),
                            _ && (_.data.push(e.subarray(o, a + 188)),
                            _.size += a + 188 - o);
                            break;
                        case v:
                            n && (E && (l = A(E)) && void 0 !== l.pts && (f.isAAC ? D(l) : k(l)),
                            E = {
                                data: [],
                                size: 0
                            }),
                            E && (E.data.push(e.subarray(o, a + 188)),
                            E.size += a + 188 - o);
                            break;
                        case m:
                            n && (S && (l = A(S)) && void 0 !== l.pts && w(l),
                            S = {
                                data: [],
                                size: 0
                            }),
                            S && (S.data.push(e.subarray(o, a + 188)),
                            S.size += a + 188 - o);
                            break;
                        case 0:
                            n && (o += e[o] + 1),
                            y = this._pmtId = T(e, o);
                            break;
                        case y:
                            n && (o += e[o] + 1);
                            var O = b(e, o, !0 === this.typeSupported.mpeg || !0 === this.typeSupported.mp3, null != this.sampleAes);
                            0 < (g = O.avc) && (h.pid = g),
                            0 < (v = O.audio) && (f.pid = v,
                            f.isAAC = O.isAAC),
                            0 < (m = O.id3) && (p.pid = m),
                            d && !c && (P.logger.log("reparse from beginning"),
                            d = !1,
                            a = L - 188),
                            c = this.pmtParsed = !0;
                            break;
                        case 17:
                        case 8191:
                            break;
                        default:
                            d = !0
                        }
                    } else
                        this.observer.trigger(I.default.ERROR, {
                            type: x.ErrorTypes.MEDIA_ERROR,
                            details: x.ErrorDetails.FRAG_PARSING_ERROR,
                            fatal: !1,
                            reason: "TS packet did not start with 0x47"
                        });
                _ && (l = A(_)) && void 0 !== l.pts ? (R(l, !0),
                h.pesData = null) : h.pesData = _,
                E && (l = A(E)) && void 0 !== l.pts ? (f.isAAC ? D(l) : k(l),
                f.pesData = null) : (E && E.size && P.logger.log("last AAC PES packet truncated,might overlap between fragments"),
                f.pesData = E),
                S && (l = A(S)) && void 0 !== l.pts ? (w(l),
                p.pesData = null) : p.pesData = S,
                null == this.sampleAes ? this.remuxer.remux(f, h, p, this._txtTrack, t, r, i) : this.decryptAndRemux(f, h, p, this._txtTrack, t, r, i)
            }
            ,
            C.prototype.decryptAndRemux = function(e, t, r, i, a, n, s) {
                if (e.samples && e.isAAC) {
                    var o = this;
                    this.sampleAes.decryptAacSamples(e.samples, 0, function() {
                        o.decryptAndRemuxAvc(e, t, r, i, a, n, s)
                    })
                } else
                    this.decryptAndRemuxAvc(e, t, r, i, a, n, s)
            }
            ,
            C.prototype.decryptAndRemuxAvc = function(e, t, r, i, a, n, s) {
                if (t.samples) {
                    var o = this;
                    this.sampleAes.decryptAvcSamples(t.samples, 0, 0, function() {
                        o.remuxer.remux(e, t, r, i, a, n, s)
                    })
                } else
                    this.remuxer.remux(e, t, r, i, a, n, s)
            }
            ,
            C.prototype.destroy = function() {
                this._initPTS = this._initDTS = void 0,
                this._duration = 0
            }
            ,
            C.prototype._parsePAT = function(e, t) {
                return (31 & e[t + 10]) << 8 | e[t + 11]
            }
            ,
            C.prototype._parsePMT = function(e, t, r, i) {
                var a, n, s = {
                    audio: -1,
                    avc: -1,
                    id3: -1,
                    isAAC: !0
                };
                for (a = t + 3 + ((15 & e[t + 1]) << 8 | e[t + 2]) - 4,
                t += 12 + ((15 & e[t + 10]) << 8 | e[t + 11]); t < a; ) {
                    switch (n = (31 & e[t + 1]) << 8 | e[t + 2],
                    e[t]) {
                    case 207:
                        if (!i) {
                            P.logger.log("unkown stream type:" + e[t]);
                            break
                        }
                    case 15:
                        -1 === s.audio && (s.audio = n);
                        break;
                    case 21:
                        -1 === s.id3 && (s.id3 = n);
                        break;
                    case 219:
                        if (!i) {
                            P.logger.log("unkown stream type:" + e[t]);
                            break
                        }
                    case 27:
                        -1 === s.avc && (s.avc = n);
                        break;
                    case 3:
                    case 4:
                        r ? -1 === s.audio && (s.audio = n,
                        s.isAAC = !1) : P.logger.log("MPEG audio found, not supported in this browser for now");
                        break;
                    case 36:
                        P.logger.warn("HEVC stream type found, not supported for now");
                        break;
                    default:
                        P.logger.log("unkown stream type:" + e[t])
                    }
                    t += 5 + ((15 & e[t + 3]) << 8 | e[t + 4])
                }
                return s
            }
            ,
            C.prototype._parsePES = function(e) {
                var t, r, i, a, n, s, o, l, u = 0, d = e.data;
                if (!e || 0 === e.size)
                    return null;
                for (; d[0].length < 19 && 1 < d.length; ) {
                    var c = new Uint8Array(d[0].length + d[1].length);
                    c.set(d[0]),
                    c.set(d[1], d[0].length),
                    d[0] = c,
                    d.splice(1, 1)
                }
                if (1 !== ((t = d[0])[0] << 16) + (t[1] << 8) + t[2])
                    return null;
                if ((i = (t[4] << 8) + t[5]) && i > e.size - 6)
                    return null;
                192 & (r = t[7]) && (4294967295 < (s = 536870912 * (14 & t[9]) + 4194304 * (255 & t[10]) + 16384 * (254 & t[11]) + 128 * (255 & t[12]) + (254 & t[13]) / 2) && (s -= 8589934592),
                64 & r ? (4294967295 < (o = 536870912 * (14 & t[14]) + 4194304 * (255 & t[15]) + 16384 * (254 & t[16]) + 128 * (255 & t[17]) + (254 & t[18]) / 2) && (o -= 8589934592),
                54e5 < s - o && (P.logger.warn(Math.round((s - o) / 9e4) + "s delta between PTS and DTS, align them"),
                s = o)) : o = s),
                l = (a = t[8]) + 9,
                e.size -= l,
                n = new Uint8Array(e.size);
                for (var h = 0, f = d.length; h < f; h++) {
                    var p = (t = d[h]).byteLength;
                    if (l) {
                        if (p < l) {
                            l -= p;
                            continue
                        }
                        t = t.subarray(l),
                        p -= l,
                        l = 0
                    }
                    n.set(t, u),
                    u += p
                }
                return i && (i -= a + 3),
                {
                    data: n,
                    pts: s,
                    dts: o,
                    len: i
                }
            }
            ,
            C.prototype.pushAccesUnit = function(e, t) {
                if (e.units.length && e.frame) {
                    var r = t.samples
                      , i = r.length;
                    !this.config.forceKeyFrameOnDiscontinuity || !0 === e.key || t.sps && (i || this.contiguous) ? (e.id = i,
                    r.push(e)) : t.dropped++
                }
                e.debug.length && P.logger.log(e.pts + "/" + e.dts + ":" + e.debug)
            }
            ,
            C.prototype._parseAVCPES = function(p, e) {
                function g(e, t, r, i) {
                    return {
                        key: e,
                        pts: t,
                        dts: r,
                        units: [],
                        debug: i
                    }
                }
                var v, m, y, _ = this, E = this._avcTrack, t = this._parseAVCNALu(p.data), S = this.avcSample, T = !1, b = this.pushAccesUnit.bind(this);
                p.data = null,
                S && t.length && !E.audFound && (b(S, E),
                S = this.avcSample = g(!1, p.pts, p.dts, "")),
                t.forEach(function(e) {
                    switch (e.type) {
                    case 1:
                        m = !0,
                        S || (S = _.avcSample = g(!0, p.pts, p.dts, "")),
                        S.frame = !0;
                        var t = e.data;
                        if (T && 4 < t.length) {
                            var r = new A.default(t).readSliceType();
                            2 !== r && 4 !== r && 7 !== r && 9 !== r || (S.key = !0)
                        }
                        break;
                    case 5:
                        m = !0,
                        S || (S = _.avcSample = g(!0, p.pts, p.dts, "")),
                        S.key = !0,
                        S.frame = !0;
                        break;
                    case 6:
                        m = !0,
                        (v = new A.default(_.discardEPB(e.data))).readUByte();
                        for (var i = 0, a = 0, n = !1, s = 0; !n && 1 < v.bytesAvailable; ) {
                            for (i = 0; i += s = v.readUByte(),
                            255 === s; )
                                ;
                            for (a = 0; a += s = v.readUByte(),
                            255 === s; )
                                ;
                            if (4 === i && 0 !== v.bytesAvailable) {
                                if (n = !0,
                                181 === v.readUByte() && 49 === v.readUShort() && 1195456820 === v.readUInt() && 3 === v.readUByte()) {
                                    var o = v.readUByte()
                                      , l = 31 & o
                                      , u = [o, v.readUByte()];
                                    for (y = 0; y < l; y++)
                                        u.push(v.readUByte()),
                                        u.push(v.readUByte()),
                                        u.push(v.readUByte());
                                    _._insertSampleInOrder(_._txtTrack.samples, {
                                        type: 3,
                                        pts: p.pts,
                                        bytes: u
                                    })
                                }
                            } else if (a < v.bytesAvailable)
                                for (y = 0; y < a; y++)
                                    v.readUByte()
                        }
                        break;
                    case 7:
                        if (T = m = !0,
                        !E.sps) {
                            var d = (v = new A.default(e.data)).readSPS();
                            E.width = d.width,
                            E.height = d.height,
                            E.pixelRatio = d.pixelRatio,
                            E.sps = [e.data],
                            E.duration = _._duration;
                            var c = e.data.subarray(1, 4)
                              , h = "avc1.";
                            for (y = 0; y < 3; y++) {
                                var f = c[y].toString(16);
                                f.length < 2 && (f = "0" + f),
                                h += f
                            }
                            E.codec = h
                        }
                        break;
                    case 8:
                        m = !0,
                        E.pps || (E.pps = [e.data]);
                        break;
                    case 9:
                        m = !1,
                        E.audFound = !0,
                        S && b(S, E),
                        S = _.avcSample = g(!1, p.pts, p.dts, "");
                        break;
                    case 12:
                        m = !1;
                        break;
                    default:
                        m = !1,
                        S && (S.debug += "unknown NAL " + e.type + " ")
                    }
                    S && m && S.units.push(e)
                }),
                e && S && (b(S, E),
                this.avcSample = null)
            }
            ,
            C.prototype._insertSampleInOrder = function(e, t) {
                var r = e.length;
                if (0 < r) {
                    if (t.pts >= e[r - 1].pts)
                        e.push(t);
                    else
                        for (var i = r - 1; 0 <= i; i--)
                            if (t.pts < e[i].pts) {
                                e.splice(i, 0, t);
                                break
                            }
                } else
                    e.push(t)
            }
            ,
            C.prototype._getLastNalUnit = function() {
                var e, t = this.avcSample;
                if (!t || 0 === t.units.length) {
                    var r = this._avcTrack.samples;
                    t = r[r.length - 1]
                }
                if (t) {
                    var i = t.units;
                    e = i[i.length - 1]
                }
                return e
            }
            ,
            C.prototype._parseAVCNALu = function(e) {
                var t, r, i, a, n = 0, s = e.byteLength, o = this._avcTrack, l = o.naluState || 0, u = l, d = [], c = -1;
                for (-1 === l && (a = 31 & e[c = 0],
                l = 0,
                n = 1); n < s; )
                    if (t = e[n++],
                    l)
                        if (1 !== l)
                            if (t)
                                if (1 === t) {
                                    var h, f;
                                    0 <= c ? (i = {
                                        data: e.subarray(c, n - l - 1),
                                        type: a
                                    },
                                    d.push(i)) : (h = this._getLastNalUnit()) && (u && n <= 4 - u && h.state && (h.data = h.data.subarray(0, h.data.byteLength - u)),
                                    0 < (r = n - l - 1) && ((f = new Uint8Array(h.data.byteLength + r)).set(h.data, 0),
                                    f.set(e.subarray(0, r), h.data.byteLength),
                                    h.data = f)),
                                    l = n < s ? (a = 31 & e[c = n],
                                    0) : -1
                                } else
                                    l = 0;
                            else
                                l = 3;
                        else
                            l = t ? 0 : 2;
                    else
                        l = t ? 0 : 1;
                return 0 <= c && 0 <= l && (i = {
                    data: e.subarray(c, s),
                    type: a,
                    state: l
                },
                d.push(i)),
                0 === d.length && (h = this._getLastNalUnit()) && ((f = new Uint8Array(h.data.byteLength + e.byteLength)).set(h.data, 0),
                f.set(e, h.data.byteLength),
                h.data = f),
                o.naluState = l,
                d
            }
            ,
            C.prototype.discardEPB = function(e) {
                for (var t, r, i = e.byteLength, a = [], n = 1; n < i - 2; )
                    0 === e[n] && 0 === e[n + 1] && 3 === e[n + 2] ? (a.push(n + 2),
                    n += 2) : n++;
                if (0 === a.length)
                    return e;
                t = i - a.length,
                r = new Uint8Array(t);
                var s = 0;
                for (n = 0; n < t; s++,
                n++)
                    s === a[0] && (s++,
                    a.shift()),
                    r[n] = e[s];
                return r
            }
            ,
            C.prototype._parseAACPES = function(e) {
                var t, r, i, a, n, s = this._audioTrack, o = e.data, l = e.pts, u = this.aacOverFlow, d = this.aacLastPTS;
                if (u) {
                    var c = new Uint8Array(u.byteLength + o.byteLength);
                    c.set(u, 0),
                    c.set(o, u.byteLength),
                    o = c
                }
                for (i = 0,
                n = o.length; i < n - 1 && !v.isHeader(o, i); i++)
                    ;
                if (i) {
                    var h = void 0
                      , f = void 0;
                    if (f = i < n - 1 ? (h = "AAC PES did not start with ADTS header,offset:" + i,
                    !1) : (h = "no ADTS header found in AAC PES",
                    !0),
                    P.logger.warn("parsing error:" + h),
                    this.observer.trigger(I.default.ERROR, {
                        type: x.ErrorTypes.MEDIA_ERROR,
                        details: x.ErrorDetails.FRAG_PARSING_ERROR,
                        fatal: f,
                        reason: h
                    }),
                    f)
                        return
                }
                if (v.initTrackConfig(s, this.observer, o, i, this.audioCodec),
                r = 0,
                t = v.getFrameDuration(s.samplerate),
                u && d) {
                    var p = d + t;
                    1 < Math.abs(p - l) && (P.logger.log("AAC: align PTS for overlapping frames by " + Math.round((p - l) / 90)),
                    l = p)
                }
                for (; i < n; )
                    if (v.isHeader(o, i) && i + 5 < n) {
                        var g = v.appendFrame(s, o, i, l, r);
                        if (!g)
                            break;
                        i += g.length,
                        a = g.sample.pts,
                        r++
                    } else
                        i++;
                u = i < n ? o.subarray(i, n) : null,
                this.aacOverFlow = u,
                this.aacLastPTS = a
            }
            ,
            C.prototype._parseMPEGPES = function(e) {
                for (var t = e.data, r = t.length, i = 0, a = 0, n = e.pts; a < r; )
                    if (o.default.isHeader(t, a)) {
                        var s = o.default.appendFrame(this._audioTrack, t, a, n, i);
                        if (!s)
                            break;
                        a += s.length,
                        i++
                    } else
                        a++
            }
            ,
            C.prototype._parseID3PES = function(e) {
                this._id3Track.samples.push(e)
            }
            ,
            C
        }();
        t.default = n
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(0)
          , a = function() {
            function e(e) {
                this.data = e,
                this.bytesAvailable = e.byteLength,
                this.word = 0,
                this.bitsAvailable = 0
            }
            return e.prototype.loadWord = function() {
                var e = this.data
                  , t = this.bytesAvailable
                  , r = e.byteLength - t
                  , i = new Uint8Array(4)
                  , a = Math.min(4, t);
                if (0 === a)
                    throw new Error("no bytes available");
                i.set(e.subarray(r, r + a)),
                this.word = new DataView(i.buffer).getUint32(0),
                this.bitsAvailable = 8 * a,
                this.bytesAvailable -= a
            }
            ,
            e.prototype.skipBits = function(e) {
                var t;
                this.bitsAvailable > e || (e -= this.bitsAvailable,
                e -= (t = e >> 3) >> 3,
                this.bytesAvailable -= t,
                this.loadWord()),
                this.word <<= e,
                this.bitsAvailable -= e
            }
            ,
            e.prototype.readBits = function(e) {
                var t = Math.min(this.bitsAvailable, e)
                  , r = this.word >>> 32 - t;
                return 32 < e && i.logger.error("Cannot read more than 32 bits at a time"),
                this.bitsAvailable -= t,
                0 < this.bitsAvailable ? this.word <<= t : 0 < this.bytesAvailable && this.loadWord(),
                0 < (t = e - t) && this.bitsAvailable ? r << t | this.readBits(t) : r
            }
            ,
            e.prototype.skipLZ = function() {
                var e;
                for (e = 0; e < this.bitsAvailable; ++e)
                    if (0 != (this.word & 2147483648 >>> e))
                        return this.word <<= e,
                        this.bitsAvailable -= e,
                        e;
                return this.loadWord(),
                e + this.skipLZ()
            }
            ,
            e.prototype.skipUEG = function() {
                this.skipBits(1 + this.skipLZ())
            }
            ,
            e.prototype.skipEG = function() {
                this.skipBits(1 + this.skipLZ())
            }
            ,
            e.prototype.readUEG = function() {
                var e = this.skipLZ();
                return this.readBits(e + 1) - 1
            }
            ,
            e.prototype.readEG = function() {
                var e = this.readUEG();
                return 1 & e ? 1 + e >>> 1 : -1 * (e >>> 1)
            }
            ,
            e.prototype.readBoolean = function() {
                return 1 === this.readBits(1)
            }
            ,
            e.prototype.readUByte = function() {
                return this.readBits(8)
            }
            ,
            e.prototype.readUShort = function() {
                return this.readBits(16)
            }
            ,
            e.prototype.readUInt = function() {
                return this.readBits(32)
            }
            ,
            e.prototype.skipScalingList = function(e) {
                var t, r = 8, i = 8;
                for (t = 0; t < e; t++)
                    0 !== i && (i = (r + this.readEG() + 256) % 256),
                    r = 0 === i ? r : i
            }
            ,
            e.prototype.readSPS = function() {
                var e, t, r, i, a, n, s, o = 0, l = 0, u = 0, d = 0, c = this.readUByte.bind(this), h = this.readBits.bind(this), f = this.readUEG.bind(this), p = this.readBoolean.bind(this), g = this.skipBits.bind(this), v = this.skipEG.bind(this), m = this.skipUEG.bind(this), y = this.skipScalingList.bind(this);
                if (c(),
                e = c(),
                h(5),
                g(3),
                c(),
                m(),
                100 === e || 110 === e || 122 === e || 244 === e || 44 === e || 83 === e || 86 === e || 118 === e || 128 === e) {
                    var _ = f();
                    if (3 === _ && g(1),
                    m(),
                    m(),
                    g(1),
                    p())
                        for (n = 3 !== _ ? 8 : 12,
                        s = 0; s < n; s++)
                            p() && y(s < 6 ? 16 : 64)
                }
                m();
                var E = f();
                if (0 === E)
                    f();
                else if (1 === E)
                    for (g(1),
                    v(),
                    v(),
                    t = f(),
                    s = 0; s < t; s++)
                        v();
                m(),
                g(1),
                r = f(),
                i = f(),
                0 === (a = h(1)) && g(1),
                g(1),
                p() && (o = f(),
                l = f(),
                u = f(),
                d = f());
                var S = [1, 1];
                if (p() && p())
                    switch (c()) {
                    case 1:
                        S = [1, 1];
                        break;
                    case 2:
                        S = [12, 11];
                        break;
                    case 3:
                        S = [10, 11];
                        break;
                    case 4:
                        S = [16, 11];
                        break;
                    case 5:
                        S = [40, 33];
                        break;
                    case 6:
                        S = [24, 11];
                        break;
                    case 7:
                        S = [20, 11];
                        break;
                    case 8:
                        S = [32, 11];
                        break;
                    case 9:
                        S = [80, 33];
                        break;
                    case 10:
                        S = [18, 11];
                        break;
                    case 11:
                        S = [15, 11];
                        break;
                    case 12:
                        S = [64, 33];
                        break;
                    case 13:
                        S = [160, 99];
                        break;
                    case 14:
                        S = [4, 3];
                        break;
                    case 15:
                        S = [3, 2];
                        break;
                    case 16:
                        S = [2, 1];
                        break;
                    case 255:
                        S = [c() << 8 | c(), c() << 8 | c()]
                    }
                return {
                    width: Math.ceil(16 * (r + 1) - 2 * o - 2 * l),
                    height: (2 - a) * (i + 1) * 16 - (a ? 2 : 4) * (u + d),
                    pixelRatio: S
                }
            }
            ,
            e.prototype.readSliceType = function() {
                return this.readUByte(),
                this.readUEG(),
                this.readUEG()
            }
            ,
            e
        }();
        t.default = a
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var a = r(12)
          , i = function() {
            function e(e, t, r, i) {
                this.decryptdata = r,
                this.discardEPB = i,
                this.decrypter = new a.default(e,t,{
                    removePKCS7Padding: !1
                })
            }
            return e.prototype.decryptBuffer = function(e, t) {
                this.decrypter.decrypt(e, this.decryptdata.key.buffer, this.decryptdata.iv.buffer, t)
            }
            ,
            e.prototype.decryptAacSample = function(t, r, i, a) {
                var n = t[r].unit
                  , e = n.subarray(16, n.length - n.length % 16)
                  , s = e.buffer.slice(e.byteOffset, e.byteOffset + e.length)
                  , o = this;
                this.decryptBuffer(s, function(e) {
                    e = new Uint8Array(e),
                    n.set(e, 16),
                    a || o.decryptAacSamples(t, r + 1, i)
                })
            }
            ,
            e.prototype.decryptAacSamples = function(e, t, r) {
                for (; ; t++) {
                    if (t >= e.length)
                        return void r();
                    if (!(e[t].unit.length < 32)) {
                        var i = this.decrypter.isSync();
                        if (this.decryptAacSample(e, t, r, i),
                        !i)
                            return
                    }
                }
            }
            ,
            e.prototype.getAvcEncryptedData = function(e) {
                for (var t = 16 * Math.floor((e.length - 48) / 160) + 16, r = new Int8Array(t), i = 0, a = 32; a <= e.length - 16; a += 160,
                i += 16)
                    r.set(e.subarray(a, a + 16), i);
                return r
            }
            ,
            e.prototype.getAvcDecryptedUnit = function(e, t) {
                t = new Uint8Array(t);
                for (var r = 0, i = 32; i <= e.length - 16; i += 160,
                r += 16)
                    e.set(t.subarray(r, r + 16), i);
                return e
            }
            ,
            e.prototype.decryptAvcSample = function(t, r, i, a, n, s) {
                var o = this.discardEPB(n.data)
                  , e = this.getAvcEncryptedData(o)
                  , l = this;
                this.decryptBuffer(e.buffer, function(e) {
                    n.data = l.getAvcDecryptedUnit(o, e),
                    s || l.decryptAvcSamples(t, r, i + 1, a)
                })
            }
            ,
            e.prototype.decryptAvcSamples = function(e, t, r, i) {
                for (; ; t++,
                r = 0) {
                    if (t >= e.length)
                        return void i();
                    for (var a = e[t].units; !(r >= a.length); r++) {
                        var n = a[r];
                        if (!(n.length <= 48 || 1 !== n.type && 5 !== n.type)) {
                            var s = this.decrypter.isSync();
                            if (this.decryptAvcSample(e, t, r, i, n, s),
                            !s)
                                return
                        }
                    }
                }
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var p = r(10)
          , a = r(0)
          , g = r(23)
          , i = function() {
            function e(e, t, r) {
                this.observer = e,
                this.config = r,
                this.remuxer = t
            }
            return e.prototype.resetInitSegment = function(e, t, r, i) {
                this._audioTrack = {
                    container: "audio/mpeg",
                    type: "audio",
                    id: -1,
                    sequenceNumber: 0,
                    isAAC: !1,
                    samples: [],
                    len: 0,
                    manifestCodec: t,
                    duration: i,
                    inputTimeScale: 9e4
                }
            }
            ,
            e.prototype.resetTimeStamp = function() {}
            ,
            e.probe = function(e) {
                var t, r, i = p.default.getID3Data(e, 0);
                if (i && void 0 !== p.default.getTimeStamp(i))
                    for (t = i.length,
                    r = Math.min(e.length - 1, t + 100); t < r; t++)
                        if (g.default.probe(e, t))
                            return a.logger.log("MPEG Audio sync word found !"),
                            !0;
                return !1
            }
            ,
            e.prototype.append = function(e, t, r, i) {
                for (var a = p.default.getID3Data(e, 0), n = p.default.getTimeStamp(a), s = n ? 90 * n : 9e4 * t, o = a.length, l = e.length, u = 0, d = 0, c = this._audioTrack, h = [{
                    pts: s,
                    dts: s,
                    data: a
                }]; o < l; )
                    if (g.default.isHeader(e, o)) {
                        var f = g.default.appendFrame(c, e, o, s, u);
                        if (!f)
                            break;
                        o += f.length,
                        d = f.sample.pts,
                        u++
                    } else
                        p.default.isHeader(e, o) ? (a = p.default.getID3Data(e, o),
                        h.push({
                            pts: d,
                            dts: d,
                            data: a
                        }),
                        o += a.length) : o++;
                this.remuxer.remux(c, {
                    samples: []
                }, {
                    samples: h,
                    inputTimeScale: 9e4
                }, {
                    samples: []
                }, t, r, i)
            }
            ,
            e.prototype.destroy = function() {}
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var K = r(47)
          , X = r(48)
          , $ = r(1)
          , Q = r(3)
          , J = r(0)
          , i = function() {
            function e(e, t, r, i) {
                this.observer = e,
                this.config = t,
                this.typeSupported = r;
                var a = navigator.userAgent;
                this.isSafari = i && -1 < i.indexOf("Apple") && a && !a.match("CriOS"),
                this.ISGenerated = !1
            }
            return e.prototype.destroy = function() {}
            ,
            e.prototype.resetTimeStamp = function(e) {
                this._initPTS = this._initDTS = e
            }
            ,
            e.prototype.resetInitSegment = function() {
                this.ISGenerated = !1
            }
            ,
            e.prototype.remux = function(e, t, r, i, a, n, s) {
                if (this.ISGenerated || this.generateIS(e, t, a),
                this.ISGenerated) {
                    var o = e.samples.length
                      , l = t.samples.length
                      , u = a
                      , d = a;
                    if (o && l) {
                        var c = (e.samples[0].pts - t.samples[0].pts) / t.inputTimeScale;
                        u += Math.max(0, c),
                        d += Math.max(0, -c)
                    }
                    if (o) {
                        e.timescale || (J.logger.warn("regenerate InitSegment as audio detected"),
                        this.generateIS(e, t, a));
                        var h = this.remuxAudio(e, u, n, s);
                        if (l) {
                            var f = void 0;
                            h && (f = h.endPTS - h.startPTS),
                            t.timescale || (J.logger.warn("regenerate InitSegment as video detected"),
                            this.generateIS(e, t, a)),
                            this.remuxVideo(t, d, n, f, s)
                        }
                    } else if (l) {
                        var p = this.remuxVideo(t, d, n, 0, s);
                        p && e.codec && this.remuxEmptyAudio(e, u, n, p)
                    }
                }
                r.samples.length && this.remuxID3(r, a),
                i.samples.length && this.remuxText(i, a),
                this.observer.trigger($.default.FRAG_PARSED)
            }
            ,
            e.prototype.generateIS = function(e, t, r) {
                var i, a, n = this.observer, s = e.samples, o = t.samples, l = this.typeSupported, u = "audio/mp4", d = {}, c = {
                    tracks: d
                }, h = void 0 === this._initPTS;
                if (h && (i = a = 1 / 0),
                e.config && s.length && (e.timescale = e.samplerate,
                J.logger.log("audio sampling rate : " + e.samplerate),
                e.isAAC || (l.mpeg ? (u = "audio/mpeg",
                e.codec = "") : l.mp3 && (e.codec = "mp3")),
                d.audio = {
                    container: u,
                    codec: e.codec,
                    initSegment: !e.isAAC && l.mpeg ? new Uint8Array : X.default.initSegment([e]),
                    metadata: {
                        channelCount: e.channelCount
                    }
                },
                h && (i = a = s[0].pts - e.inputTimeScale * r)),
                t.sps && t.pps && o.length) {
                    var f = t.inputTimeScale;
                    t.timescale = f,
                    d.video = {
                        container: "video/mp4",
                        codec: t.codec,
                        initSegment: X.default.initSegment([t]),
                        metadata: {
                            width: t.width,
                            height: t.height
                        }
                    },
                    h && (i = Math.min(i, o[0].pts - f * r),
                    a = Math.min(a, o[0].dts - f * r),
                    this.observer.trigger($.default.INIT_PTS_FOUND, {
                        initPTS: i
                    }))
                }
                Object.keys(d).length ? (n.trigger($.default.FRAG_PARSING_INIT_SEGMENT, c),
                this.ISGenerated = !0,
                h && (this._initPTS = i,
                this._initDTS = a)) : n.trigger($.default.ERROR, {
                    type: Q.ErrorTypes.MEDIA_ERROR,
                    details: Q.ErrorDetails.FRAG_PARSING_ERROR,
                    fatal: !1,
                    reason: "no audio/video samples found"
                })
            }
            ,
            e.prototype.remuxVideo = function(e, t, r, i, a) {
                var n, s, o, l, u, d, c, h = 8, f = e.timescale, p = e.samples, g = [], v = p.length, m = this._PTSNormalize, y = this._initPTS, _ = this.nextAvcDts, E = this.isSafari;
                if (0 !== v) {
                    E && (r |= p.length && _ && (a && Math.abs(t - _ / f) < .1 || Math.abs(p[0].pts - _ - y) < f / 5)),
                    r || (_ = t * f),
                    p.forEach(function(e) {
                        e.pts = m(e.pts - y, _),
                        e.dts = m(e.dts - y, _)
                    }),
                    p.sort(function(e, t) {
                        var r = e.dts - t.dts
                          , i = e.pts - t.pts;
                        return r || i || e.id - t.id
                    });
                    var S = p.reduce(function(e, t) {
                        return Math.max(Math.min(e, t.pts - t.dts), -18e3)
                    }, 0);
                    if (S < 0) {
                        J.logger.warn("PTS < DTS detected in video samples, shifting DTS by " + Math.round(S / 90) + " ms to overcome this issue");
                        for (var T = 0; T < p.length; T++)
                            p[T].dts += S
                    }
                    var b = p[0];
                    u = Math.max(b.dts, 0),
                    l = Math.max(b.pts, 0);
                    var A = Math.round((u - _) / 90);
                    r && A && (1 < A ? J.logger.log("AVC:" + A + " ms hole between fragments detected,filling it") : A < -1 && J.logger.log("AVC:" + -A + " ms overlapping between fragments detected"),
                    u = _,
                    p[0].dts = u,
                    l = Math.max(l - A, _),
                    p[0].pts = l,
                    J.logger.log("Video/PTS/DTS adjusted: " + Math.round(l / 90) + "/" + Math.round(u / 90) + ",delta:" + A + " ms")),
                    b = p[p.length - 1],
                    c = Math.max(b.dts, 0),
                    d = Math.max(b.pts, 0, c),
                    E && (n = Math.round((c - u) / (p.length - 1)));
                    var R = 0
                      , D = 0;
                    for (T = 0; T < v; T++) {
                        for (var k = p[T], w = k.units, L = w.length, O = 0, C = 0; C < L; C++)
                            O += w[C].data.length;
                        D += O,
                        R += L,
                        k.length = O,
                        k.dts = E ? u + T * n : Math.max(k.dts, u),
                        k.pts = Math.max(k.pts, k.dts)
                    }
                    var I = D + 4 * R + 8;
                    try {
                        s = new Uint8Array(I)
                    } catch (e) {
                        return void this.observer.trigger($.default.ERROR, {
                            type: Q.ErrorTypes.MUX_ERROR,
                            details: Q.ErrorDetails.REMUX_ALLOC_ERROR,
                            fatal: !1,
                            bytes: I,
                            reason: "fail allocating video mdat " + I
                        })
                    }
                    var P = new DataView(s.buffer);
                    for (P.setUint32(0, I),
                    s.set(X.default.types.mdat, 4),
                    T = 0; T < v; T++) {
                        var x = p[T]
                          , F = x.units
                          , M = 0
                          , B = void 0;
                        for (C = 0,
                        L = F.length; C < L; C++) {
                            var N = F[C]
                              , U = N.data
                              , G = N.data.byteLength;
                            P.setUint32(h, G),
                            h += 4,
                            s.set(U, h),
                            h += G,
                            M += 4 + G
                        }
                        if (E)
                            B = Math.max(0, n * Math.round((x.pts - x.dts) / n));
                        else {
                            if (T < v - 1)
                                n = p[T + 1].dts - x.dts;
                            else {
                                var H = this.config
                                  , j = x.dts - p[0 < T ? T - 1 : T].dts;
                                if (H.stretchShortVideoTrack) {
                                    var K = H.maxBufferHole
                                      , W = Math.floor(K * f)
                                      , z = (i ? l + i * f : this.nextAudioPts) - x.pts;
                                    W < z ? ((n = z - j) < 0 && (n = j),
                                    J.logger.log("It is approximately " + z / 90 + " ms to the next segment; using duration " + n / 90 + " ms for the last video frame.")) : n = j
                                } else
                                    n = j
                            }
                            B = Math.round(x.pts - x.dts)
                        }
                        g.push({
                            size: M,
                            duration: n,
                            cts: B,
                            flags: {
                                isLeading: 0,
                                isDependedOn: 0,
                                hasRedundancy: 0,
                                degradPrio: 0,
                                dependsOn: x.key ? 2 : 1,
                                isNonSync: x.key ? 0 : 1
                            }
                        })
                    }
                    this.nextAvcDts = c + n;
                    var V = e.dropped;
                    if (e.len = 0,
                    e.nbNalu = 0,
                    e.dropped = 0,
                    g.length && -1 < navigator.userAgent.toLowerCase().indexOf("chrome")) {
                        var Y = g[0].flags;
                        Y.dependsOn = 2,
                        Y.isNonSync = 0
                    }
                    e.samples = g,
                    o = X.default.moof(e.sequenceNumber++, u, e),
                    e.samples = [];
                    var q = {
                        data1: o,
                        data2: s,
                        startPTS: l / f,
                        endPTS: (d + n) / f,
                        startDTS: u / f,
                        endDTS: this.nextAvcDts / f,
                        type: "video",
                        hasAudio: !1,
                        hasVideo: !0,
                        nb: g.length,
                        dropped: V
                    };
                    return this.observer.trigger($.default.FRAG_PARSING_DATA, q),
                    q
                }
            }
            ,
            e.prototype.remuxAudio = function(e, t, r, i) {
                var a, n, s, o, l, u, d, c = e.inputTimeScale, h = e.timescale, f = c / h, p = (e.isAAC ? 1024 : 1152) * f, g = this._PTSNormalize, v = this._initPTS, m = !e.isAAC && this.typeSupported.mpeg, y = e.samples, _ = [], E = this.nextAudioPts;
                if (r |= y.length && E && (i && Math.abs(t - E / c) < .1 || Math.abs(y[0].pts - E - v) < 20 * p),
                y.forEach(function(e) {
                    e.pts = e.dts = g(e.pts - v, t * c)
                }),
                0 !== (y = y.filter(function(e) {
                    return 0 <= e.pts
                })).length) {
                    if (r || (E = i ? t * c : y[0].pts),
                    e.isAAC)
                        for (var S = this.config.maxAudioFramesDrift, T = 0, b = E; T < y.length; ) {
                            var A, R = y[T];
                            A = (P = R.pts) - b;
                            var D = Math.abs(1e3 * A / c);
                            if (A <= -S * p)
                                J.logger.warn("Dropping 1 audio frame @ " + (b / c).toFixed(3) + "s due to " + Math.round(D) + " ms overlap."),
                                y.splice(T, 1),
                                e.len -= R.unit.length;
                            else if (S * p <= A && D < 1e4 && b) {
                                var k = Math.round(A / p);
                                J.logger.warn("Injecting " + k + " audio frame @ " + (b / c).toFixed(3) + "s due to " + Math.round(1e3 * A / c) + " ms gap.");
                                for (var w = 0; w < k; w++) {
                                    var L = Math.max(b, 0);
                                    (s = K.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (J.logger.log("Unable to get silent frame for given audio codec; duplicating last frame instead."),
                                    s = R.unit.subarray()),
                                    y.splice(T, 0, {
                                        unit: s,
                                        pts: L,
                                        dts: L
                                    }),
                                    e.len += s.length,
                                    b += p,
                                    T++
                                }
                                R.pts = R.dts = b,
                                b += p,
                                T++
                            } else
                                Math.abs(A),
                                R.pts = R.dts = b,
                                b += p,
                                T++
                        }
                    w = 0;
                    for (var O = y.length; w < O; w++) {
                        var C = y[w]
                          , I = C.unit
                          , P = C.pts;
                        if (void 0 !== d)
                            n.duration = Math.round((P - d) / f);
                        else {
                            var x = Math.round(1e3 * (P - E) / c)
                              , F = 0;
                            if (r && e.isAAC && x) {
                                if (0 < x && x < 1e4)
                                    F = Math.round((P - E) / p),
                                    J.logger.log(x + " ms hole between AAC samples detected,filling it"),
                                    0 < F && ((s = K.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (s = I.subarray()),
                                    e.len += F * s.length);
                                else if (x < -12) {
                                    J.logger.log("drop overlapping AAC sample, expected/parsed/delta:" + (E / c).toFixed(3) + "s/" + (P / c).toFixed(3) + "s/" + -x + "ms"),
                                    e.len -= I.byteLength;
                                    continue
                                }
                                P = E
                            }
                            if (u = P,
                            !(0 < e.len))
                                return;
                            var M = m ? e.len : e.len + 8;
                            a = m ? 0 : 8;
                            try {
                                o = new Uint8Array(M)
                            } catch (e) {
                                return void this.observer.trigger($.default.ERROR, {
                                    type: Q.ErrorTypes.MUX_ERROR,
                                    details: Q.ErrorDetails.REMUX_ALLOC_ERROR,
                                    fatal: !1,
                                    bytes: M,
                                    reason: "fail allocating audio mdat " + M
                                })
                            }
                            for (m || (new DataView(o.buffer).setUint32(0, M),
                            o.set(X.default.types.mdat, 4)),
                            T = 0; T < F; T++)
                                (s = K.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (J.logger.log("Unable to get silent frame for given audio codec; duplicating this frame instead."),
                                s = I.subarray()),
                                o.set(s, a),
                                a += s.byteLength,
                                n = {
                                    size: s.byteLength,
                                    cts: 0,
                                    duration: 1024,
                                    flags: {
                                        isLeading: 0,
                                        isDependedOn: 0,
                                        hasRedundancy: 0,
                                        degradPrio: 0,
                                        dependsOn: 1
                                    }
                                },
                                _.push(n)
                        }
                        o.set(I, a);
                        var B = I.byteLength;
                        a += B,
                        n = {
                            size: B,
                            cts: 0,
                            duration: 0,
                            flags: {
                                isLeading: 0,
                                isDependedOn: 0,
                                hasRedundancy: 0,
                                degradPrio: 0,
                                dependsOn: 1
                            }
                        },
                        _.push(n),
                        d = P
                    }
                    var N = 0
                      , U = _.length;
                    if (2 <= U && (N = _[U - 2].duration,
                    n.duration = N),
                    U) {
                        this.nextAudioPts = E = d + f * N,
                        e.len = 0,
                        e.samples = _,
                        l = m ? new Uint8Array : X.default.moof(e.sequenceNumber++, u / f, e),
                        e.samples = [];
                        var G = u / c
                          , H = E / c
                          , j = {
                            data1: l,
                            data2: o,
                            startPTS: G,
                            endPTS: H,
                            startDTS: G,
                            endDTS: H,
                            type: "audio",
                            hasAudio: !0,
                            hasVideo: !1,
                            nb: U
                        };
                        return this.observer.trigger($.default.FRAG_PARSING_DATA, j),
                        j
                    }
                    return null
                }
            }
            ,
            e.prototype.remuxEmptyAudio = function(e, t, r, i) {
                var a = e.inputTimeScale
                  , n = a / (e.samplerate ? e.samplerate : a)
                  , s = this.nextAudioPts
                  , o = (void 0 !== s ? s : i.startDTS * a) + this._initDTS
                  , l = i.endDTS * a + this._initDTS
                  , u = 1024 * n
                  , d = Math.ceil((l - o) / u)
                  , c = K.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
                if (J.logger.warn("remux empty Audio"),
                c) {
                    for (var h = [], f = 0; f < d; f++) {
                        var p = o + f * u;
                        h.push({
                            unit: c,
                            pts: p,
                            dts: p
                        }),
                        e.len += c.length
                    }
                    e.samples = h,
                    this.remuxAudio(e, t, r)
                } else
                    J.logger.trace("Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!")
            }
            ,
            e.prototype.remuxID3 = function(e) {
                var t, r = e.samples.length, i = e.inputTimeScale, a = this._initPTS, n = this._initDTS;
                if (r) {
                    for (var s = 0; s < r; s++)
                        (t = e.samples[s]).pts = (t.pts - a) / i,
                        t.dts = (t.dts - n) / i;
                    this.observer.trigger($.default.FRAG_PARSING_METADATA, {
                        samples: e.samples
                    })
                }
                e.samples = []
            }
            ,
            e.prototype.remuxText = function(e) {
                e.samples.sort(function(e, t) {
                    return e.pts - t.pts
                });
                var t, r = e.samples.length, i = e.inputTimeScale, a = this._initPTS;
                if (r) {
                    for (var n = 0; n < r; n++)
                        (t = e.samples[n]).pts = (t.pts - a) / i;
                    this.observer.trigger($.default.FRAG_PARSING_USERDATA, {
                        samples: e.samples
                    })
                }
                e.samples = []
            }
            ,
            e.prototype._PTSNormalize = function(e, t) {
                var r;
                if (void 0 === t)
                    return e;
                for (r = t < e ? -8589934592 : 8589934592; 4294967296 < Math.abs(e - t); )
                    e += r;
                return e
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e() {}
            return e.getSilentFrame = function(e, t) {
                switch (e) {
                case "mp4a.40.2":
                    if (1 === t)
                        return new Uint8Array([0, 200, 0, 128, 35, 128]);
                    if (2 === t)
                        return new Uint8Array([33, 0, 73, 144, 2, 25, 0, 35, 128]);
                    if (3 === t)
                        return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 142]);
                    if (4 === t)
                        return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 128, 44, 128, 8, 2, 56]);
                    if (5 === t)
                        return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 56]);
                    if (6 === t)
                        return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 0, 178, 0, 32, 8, 224]);
                    break;
                default:
                    if (1 === t)
                        return new Uint8Array([1, 64, 34, 128, 163, 78, 230, 128, 186, 8, 0, 0, 0, 28, 6, 241, 193, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
                    if (2 === t)
                        return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
                    if (3 === t)
                        return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94])
                }
                return null
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = Math.pow(2, 32) - 1
          , i = function() {
            function h() {}
            return h.init = function() {
                var e;
                for (e in h.types = {
                    avc1: [],
                    avcC: [],
                    btrt: [],
                    dinf: [],
                    dref: [],
                    esds: [],
                    ftyp: [],
                    hdlr: [],
                    mdat: [],
                    mdhd: [],
                    mdia: [],
                    mfhd: [],
                    minf: [],
                    moof: [],
                    moov: [],
                    mp4a: [],
                    ".mp3": [],
                    mvex: [],
                    mvhd: [],
                    pasp: [],
                    sdtp: [],
                    stbl: [],
                    stco: [],
                    stsc: [],
                    stsd: [],
                    stsz: [],
                    stts: [],
                    tfdt: [],
                    tfhd: [],
                    traf: [],
                    trak: [],
                    trun: [],
                    trex: [],
                    tkhd: [],
                    vmhd: [],
                    smhd: []
                })
                    h.types.hasOwnProperty(e) && (h.types[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
                var t = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0])
                  , r = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0]);
                h.HDLR_TYPES = {
                    video: t,
                    audio: r
                };
                var i = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1])
                  , a = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
                h.STTS = h.STSC = h.STCO = a,
                h.STSZ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                h.VMHD = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]),
                h.SMHD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]),
                h.STSD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
                var n = new Uint8Array([105, 115, 111, 109])
                  , s = new Uint8Array([97, 118, 99, 49])
                  , o = new Uint8Array([0, 0, 0, 1]);
                h.FTYP = h.box(h.types.ftyp, n, o, n, s),
                h.DINF = h.box(h.types.dinf, h.box(h.types.dref, i))
            }
            ,
            h.box = function(e) {
                for (var t, r = Array.prototype.slice.call(arguments, 1), i = 8, a = r.length, n = a; a--; )
                    i += r[a].byteLength;
                for ((t = new Uint8Array(i))[0] = i >> 24 & 255,
                t[1] = i >> 16 & 255,
                t[2] = i >> 8 & 255,
                t[3] = 255 & i,
                t.set(e, 4),
                a = 0,
                i = 8; a < n; a++)
                    t.set(r[a], i),
                    i += r[a].byteLength;
                return t
            }
            ,
            h.hdlr = function(e) {
                return h.box(h.types.hdlr, h.HDLR_TYPES[e])
            }
            ,
            h.mdat = function(e) {
                return h.box(h.types.mdat, e)
            }
            ,
            h.mdhd = function(e, t) {
                t *= e;
                var r = Math.floor(t / (1 + o))
                  , i = Math.floor(t % (1 + o));
                return h.box(h.types.mdhd, new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, r >> 24, r >> 16 & 255, r >> 8 & 255, 255 & r, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, 85, 196, 0, 0]))
            }
            ,
            h.mdia = function(e) {
                return h.box(h.types.mdia, h.mdhd(e.timescale, e.duration), h.hdlr(e.type), h.minf(e))
            }
            ,
            h.mfhd = function(e) {
                return h.box(h.types.mfhd, new Uint8Array([0, 0, 0, 0, e >> 24, e >> 16 & 255, e >> 8 & 255, 255 & e]))
            }
            ,
            h.minf = function(e) {
                return "audio" === e.type ? h.box(h.types.minf, h.box(h.types.smhd, h.SMHD), h.DINF, h.stbl(e)) : h.box(h.types.minf, h.box(h.types.vmhd, h.VMHD), h.DINF, h.stbl(e))
            }
            ,
            h.moof = function(e, t, r) {
                return h.box(h.types.moof, h.mfhd(e), h.traf(r, t))
            }
            ,
            h.moov = function(e) {
                for (var t = e.length, r = []; t--; )
                    r[t] = h.trak(e[t]);
                return h.box.apply(null, [h.types.moov, h.mvhd(e[0].timescale, e[0].duration)].concat(r).concat(h.mvex(e)))
            }
            ,
            h.mvex = function(e) {
                for (var t = e.length, r = []; t--; )
                    r[t] = h.trex(e[t]);
                return h.box.apply(null, [h.types.mvex].concat(r))
            }
            ,
            h.mvhd = function(e, t) {
                t *= e;
                var r = Math.floor(t / (1 + o))
                  , i = Math.floor(t % (1 + o))
                  , a = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, 255 & e, r >> 24, r >> 16 & 255, r >> 8 & 255, 255 & r, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255]);
                return h.box(h.types.mvhd, a)
            }
            ,
            h.sdtp = function(e) {
                var t, r, i = e.samples || [], a = new Uint8Array(4 + i.length);
                for (r = 0; r < i.length; r++)
                    t = i[r].flags,
                    a[r + 4] = t.dependsOn << 4 | t.isDependedOn << 2 | t.hasRedundancy;
                return h.box(h.types.sdtp, a)
            }
            ,
            h.stbl = function(e) {
                return h.box(h.types.stbl, h.stsd(e), h.box(h.types.stts, h.STTS), h.box(h.types.stsc, h.STSC), h.box(h.types.stsz, h.STSZ), h.box(h.types.stco, h.STCO))
            }
            ,
            h.avc1 = function(e) {
                var t, r, i, a = [], n = [];
                for (t = 0; t < e.sps.length; t++)
                    i = (r = e.sps[t]).byteLength,
                    a.push(i >>> 8 & 255),
                    a.push(255 & i),
                    a = a.concat(Array.prototype.slice.call(r));
                for (t = 0; t < e.pps.length; t++)
                    i = (r = e.pps[t]).byteLength,
                    n.push(i >>> 8 & 255),
                    n.push(255 & i),
                    n = n.concat(Array.prototype.slice.call(r));
                var s = h.box(h.types.avcC, new Uint8Array([1, a[3], a[4], a[5], 255, 224 | e.sps.length].concat(a).concat([e.pps.length]).concat(n)))
                  , o = e.width
                  , l = e.height
                  , u = e.pixelRatio[0]
                  , d = e.pixelRatio[1];
                return h.box(h.types.avc1, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, o >> 8 & 255, 255 & o, l >> 8 & 255, 255 & l, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 18, 100, 97, 105, 108, 121, 109, 111, 116, 105, 111, 110, 47, 104, 108, 115, 46, 106, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]), s, h.box(h.types.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192])), h.box(h.types.pasp, new Uint8Array([u >> 24, u >> 16 & 255, u >> 8 & 255, 255 & u, d >> 24, d >> 16 & 255, d >> 8 & 255, 255 & d])))
            }
            ,
            h.esds = function(e) {
                var t = e.config.length;
                return new Uint8Array([0, 0, 0, 0, 3, 23 + t, 0, 1, 0, 4, 15 + t, 64, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5].concat([t]).concat(e.config).concat([6, 1, 2]))
            }
            ,
            h.mp4a = function(e) {
                var t = e.samplerate;
                return h.box(h.types.mp4a, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, e.channelCount, 0, 16, 0, 0, 0, 0, t >> 8 & 255, 255 & t, 0, 0]), h.box(h.types.esds, h.esds(e)))
            }
            ,
            h.mp3 = function(e) {
                var t = e.samplerate;
                return h.box(h.types[".mp3"], new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, e.channelCount, 0, 16, 0, 0, 0, 0, t >> 8 & 255, 255 & t, 0, 0]))
            }
            ,
            h.stsd = function(e) {
                return "audio" === e.type ? e.isAAC || "mp3" !== e.codec ? h.box(h.types.stsd, h.STSD, h.mp4a(e)) : h.box(h.types.stsd, h.STSD, h.mp3(e)) : h.box(h.types.stsd, h.STSD, h.avc1(e))
            }
            ,
            h.tkhd = function(e) {
                var t = e.id
                  , r = e.duration * e.timescale
                  , i = e.width
                  , a = e.height
                  , n = Math.floor(r / (1 + o))
                  , s = Math.floor(r % (1 + o));
                return h.box(h.types.tkhd, new Uint8Array([1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, 0, 0, 0, 0, n >> 24, n >> 16 & 255, n >> 8 & 255, 255 & n, s >> 24, s >> 16 & 255, s >> 8 & 255, 255 & s, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, i >> 8 & 255, 255 & i, 0, 0, a >> 8 & 255, 255 & a, 0, 0]))
            }
            ,
            h.traf = function(e, t) {
                var r = h.sdtp(e)
                  , i = e.id
                  , a = Math.floor(t / (1 + o))
                  , n = Math.floor(t % (1 + o));
                return h.box(h.types.traf, h.box(h.types.tfhd, new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i])), h.box(h.types.tfdt, new Uint8Array([1, 0, 0, 0, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a, n >> 24, n >> 16 & 255, n >> 8 & 255, 255 & n])), h.trun(e, r.length + 16 + 20 + 8 + 16 + 8 + 8), r)
            }
            ,
            h.trak = function(e) {
                return e.duration = e.duration || 4294967295,
                h.box(h.types.trak, h.tkhd(e), h.mdia(e))
            }
            ,
            h.trex = function(e) {
                var t = e.id;
                return h.box(h.types.trex, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, 255 & t, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]))
            }
            ,
            h.trun = function(e, t) {
                var r, i, a, n, s, o, l = e.samples || [], u = l.length, d = 12 + 16 * u, c = new Uint8Array(d);
                for (t += 8 + d,
                c.set([0, 0, 15, 1, u >>> 24 & 255, u >>> 16 & 255, u >>> 8 & 255, 255 & u, t >>> 24 & 255, t >>> 16 & 255, t >>> 8 & 255, 255 & t], 0),
                r = 0; r < u; r++)
                    a = (i = l[r]).duration,
                    n = i.size,
                    s = i.flags,
                    o = i.cts,
                    c.set([a >>> 24 & 255, a >>> 16 & 255, a >>> 8 & 255, 255 & a, n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, 255 & n, s.isLeading << 2 | s.dependsOn, s.isDependedOn << 6 | s.hasRedundancy << 4 | s.paddingValue << 1 | s.isNonSync, 61440 & s.degradPrio, 15 & s.degradPrio, o >>> 24 & 255, o >>> 16 & 255, o >>> 8 & 255, 255 & o], 12 + 16 * r);
                return h.box(h.types.trun, c)
            }
            ,
            h.initSegment = function(e) {
                h.types || h.init();
                var t, r = h.moov(e);
                return (t = new Uint8Array(h.FTYP.byteLength + r.byteLength)).set(h.FTYP),
                t.set(r, h.FTYP.byteLength),
                t
            }
            ,
            h
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var d = r(1)
          , i = function() {
            function e(e) {
                this.observer = e
            }
            return e.prototype.destroy = function() {}
            ,
            e.prototype.resetTimeStamp = function() {}
            ,
            e.prototype.resetInitSegment = function() {}
            ,
            e.prototype.remux = function(e, t, r, i, a, n, s, o) {
                var l = this.observer
                  , u = "";
                e && (u += "audio"),
                t && (u += "video"),
                l.trigger(d.default.FRAG_PARSING_DATA, {
                    data1: o,
                    startPTS: a,
                    startDTS: a,
                    type: u,
                    hasAudio: !!e,
                    hasVideo: !!t,
                    nb: 1,
                    dropped: 0
                }),
                l.trigger(d.default.FRAG_PARSED)
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        var i = Object.prototype.hasOwnProperty
          , f = "~";
        function a() {}
        function n(e, t, r, i, a) {
            if ("function" != typeof r)
                throw new TypeError("The listener must be a function");
            var n = new function(e, t, r) {
                this.fn = e,
                this.context = t,
                this.once = r || !1
            }
            (r,i || e,a)
              , s = f ? f + t : t;
            return e._events[s] ? e._events[s].fn ? e._events[s] = [e._events[s], n] : e._events[s].push(n) : (e._events[s] = n,
            e._eventsCount++),
            e
        }
        function u(e, t) {
            0 == --e._eventsCount ? e._events = new a : delete e._events[t]
        }
        function s() {
            this._events = new a,
            this._eventsCount = 0
        }
        Object.create && (a.prototype = Object.create(null),
        (new a).__proto__ || (f = !1)),
        s.prototype.eventNames = function() {
            var e, t, r = [];
            if (0 === this._eventsCount)
                return r;
            for (t in e = this._events)
                i.call(e, t) && r.push(f ? t.slice(1) : t);
            return Object.getOwnPropertySymbols ? r.concat(Object.getOwnPropertySymbols(e)) : r
        }
        ,
        s.prototype.listeners = function(e) {
            var t = f ? f + e : e
              , r = this._events[t];
            if (!r)
                return [];
            if (r.fn)
                return [r.fn];
            for (var i = 0, a = r.length, n = new Array(a); i < a; i++)
                n[i] = r[i].fn;
            return n
        }
        ,
        s.prototype.listenerCount = function(e) {
            var t = f ? f + e : e
              , r = this._events[t];
            return r ? r.fn ? 1 : r.length : 0
        }
        ,
        s.prototype.emit = function(e, t, r, i, a, n) {
            var s = f ? f + e : e;
            if (!this._events[s])
                return !1;
            var o, l, u = this._events[s], d = arguments.length;
            if (u.fn) {
                switch (u.once && this.removeListener(e, u.fn, void 0, !0),
                d) {
                case 1:
                    return u.fn.call(u.context),
                    !0;
                case 2:
                    return u.fn.call(u.context, t),
                    !0;
                case 3:
                    return u.fn.call(u.context, t, r),
                    !0;
                case 4:
                    return u.fn.call(u.context, t, r, i),
                    !0;
                case 5:
                    return u.fn.call(u.context, t, r, i, a),
                    !0;
                case 6:
                    return u.fn.call(u.context, t, r, i, a, n),
                    !0
                }
                for (l = 1,
                o = new Array(d - 1); l < d; l++)
                    o[l - 1] = arguments[l];
                u.fn.apply(u.context, o)
            } else {
                var c, h = u.length;
                for (l = 0; l < h; l++)
                    switch (u[l].once && this.removeListener(e, u[l].fn, void 0, !0),
                    d) {
                    case 1:
                        u[l].fn.call(u[l].context);
                        break;
                    case 2:
                        u[l].fn.call(u[l].context, t);
                        break;
                    case 3:
                        u[l].fn.call(u[l].context, t, r);
                        break;
                    case 4:
                        u[l].fn.call(u[l].context, t, r, i);
                        break;
                    default:
                        if (!o)
                            for (c = 1,
                            o = new Array(d - 1); c < d; c++)
                                o[c - 1] = arguments[c];
                        u[l].fn.apply(u[l].context, o)
                    }
            }
            return !0
        }
        ,
        s.prototype.on = function(e, t, r) {
            return n(this, e, t, r, !1)
        }
        ,
        s.prototype.once = function(e, t, r) {
            return n(this, e, t, r, !0)
        }
        ,
        s.prototype.removeListener = function(e, t, r, i) {
            var a = f ? f + e : e;
            if (!this._events[a])
                return this;
            if (!t)
                return u(this, a),
                this;
            var n = this._events[a];
            if (n.fn)
                n.fn !== t || i && !n.once || r && n.context !== r || u(this, a);
            else {
                for (var s = 0, o = [], l = n.length; s < l; s++)
                    (n[s].fn !== t || i && !n[s].once || r && n[s].context !== r) && o.push(n[s]);
                o.length ? this._events[a] = 1 === o.length ? o[0] : o : u(this, a)
            }
            return this
        }
        ,
        s.prototype.removeAllListeners = function(e) {
            var t;
            return e ? (t = f ? f + e : e,
            this._events[t] && u(this, t)) : (this._events = new a,
            this._eventsCount = 0),
            this
        }
        ,
        s.prototype.off = s.prototype.removeListener,
        s.prototype.addListener = s.prototype.on,
        s.prefixed = f,
        s.EventEmitter = s,
        e.exports = s
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = r(21)
          , o = r(1)
          , l = r(0)
          , u = r(52);
        t.default = function(a) {
            var i = new u.EventEmitter;
            i.trigger = function(e) {
                for (var t = [], r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                i.emit.apply(i, [e, e].concat(t))
            }
            ,
            i.off = function(e) {
                for (var t = [], r = 1; r < arguments.length; r++)
                    t[r - 1] = arguments[r];
                i.removeListener.apply(i, [e].concat(t))
            }
            ;
            function n(e, t) {
                a.postMessage({
                    event: e,
                    data: t
                })
            }
            a.addEventListener("message", function(e) {
                var t = e.data;
                switch (t.cmd) {
                case "init":
                    var r = JSON.parse(t.config);
                    a.demuxer = new s.default(i,t.typeSupported,r,t.vendor),
                    l.enableLogs(r.debug),
                    n("init", null);
                    break;
                case "demux":
                    a.demuxer.push(t.data, t.decryptdata, t.initSegment, t.audioCodec, t.videoCodec, t.timeOffset, t.discontinuity, t.trackSwitch, t.contiguous, t.duration, t.accurateTimeOffset, t.defaultInitPTS, t.url)
                }
            }),
            i.on(o.default.FRAG_DECRYPTED, n),
            i.on(o.default.FRAG_PARSING_INIT_SEGMENT, n),
            i.on(o.default.FRAG_PARSED, n),
            i.on(o.default.ERROR, n),
            i.on(o.default.FRAG_PARSING_METADATA, n),
            i.on(o.default.FRAG_PARSING_USERDATA, n),
            i.on(o.default.INIT_PTS_FOUND, n),
            i.on(o.default.FRAG_PARSING_DATA, function(e, t) {
                var r = []
                  , i = {
                    event: e,
                    data: t
                };
                t.data1 && (i.data1 = t.data1.buffer,
                r.push(t.data1.buffer),
                delete t.data1),
                t.data2 && (i.data2 = t.data2.buffer,
                r.push(t.data2.buffer),
                delete t.data2),
                a.postMessage(i, r)
            })
        }
    }
    , function(e, t) {
        function i() {
            this._events = this._events || {},
            this._maxListeners = this._maxListeners || void 0
        }
        function l(e) {
            return "function" == typeof e
        }
        function u(e) {
            return "object" == typeof e && null !== e
        }
        function d(e) {
            return void 0 === e
        }
        ((e.exports = i).EventEmitter = i).prototype._events = void 0,
        i.prototype._maxListeners = void 0,
        i.defaultMaxListeners = 10,
        i.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || e < 0 || isNaN(e))
                throw TypeError("n must be a positive number");
            return this._maxListeners = e,
            this
        }
        ,
        i.prototype.emit = function(e) {
            var t, r, i, a, n, s;
            if (this._events || (this._events = {}),
            "error" === e && (!this._events.error || u(this._events.error) && !this._events.error.length)) {
                if ((t = arguments[1])instanceof Error)
                    throw t;
                var o = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                throw o.context = t,
                o
            }
            if (d(r = this._events[e]))
                return !1;
            if (l(r))
                switch (arguments.length) {
                case 1:
                    r.call(this);
                    break;
                case 2:
                    r.call(this, arguments[1]);
                    break;
                case 3:
                    r.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    a = Array.prototype.slice.call(arguments, 1),
                    r.apply(this, a)
                }
            else if (u(r))
                for (a = Array.prototype.slice.call(arguments, 1),
                i = (s = r.slice()).length,
                n = 0; n < i; n++)
                    s[n].apply(this, a);
            return !0
        }
        ,
        i.prototype.on = i.prototype.addListener = function(e, t) {
            var r;
            if (!l(t))
                throw TypeError("listener must be a function");
            return this._events || (this._events = {}),
            this._events.newListener && this.emit("newListener", e, l(t.listener) ? t.listener : t),
            this._events[e] ? u(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t,
            u(this._events[e]) && !this._events[e].warned && (r = d(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners) && 0 < r && this._events[e].length > r && (this._events[e].warned = !0,
            console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length),
            "function" == typeof console.trace && console.trace()),
            this
        }
        ,
        i.prototype.once = function(e, t) {
            if (!l(t))
                throw TypeError("listener must be a function");
            var r = !1;
            function i() {
                this.removeListener(e, i),
                r || (r = !0,
                t.apply(this, arguments))
            }
            return i.listener = t,
            this.on(e, i),
            this
        }
        ,
        i.prototype.removeListener = function(e, t) {
            var r, i, a, n;
            if (!l(t))
                throw TypeError("listener must be a function");
            if (!this._events || !this._events[e])
                return this;
            if (a = (r = this._events[e]).length,
            i = -1,
            r === t || l(r.listener) && r.listener === t)
                delete this._events[e],
                this._events.removeListener && this.emit("removeListener", e, t);
            else if (u(r)) {
                for (n = a; 0 < n--; )
                    if (r[n] === t || r[n].listener && r[n].listener === t) {
                        i = n;
                        break
                    }
                if (i < 0)
                    return this;
                1 === r.length ? (r.length = 0,
                delete this._events[e]) : r.splice(i, 1),
                this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }
        ,
        i.prototype.removeAllListeners = function(e) {
            var t, r;
            if (!this._events)
                return this;
            if (!this._events.removeListener)
                return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e],
                this;
            if (0 === arguments.length) {
                for (t in this._events)
                    "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"),
                this._events = {},
                this
            }
            if (l(r = this._events[e]))
                this.removeListener(e, r);
            else if (r)
                for (; r.length; )
                    this.removeListener(e, r[r.length - 1]);
            return delete this._events[e],
            this
        }
        ,
        i.prototype.listeners = function(e) {
            return this._events && this._events[e] ? l(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }
        ,
        i.prototype.listenerCount = function(e) {
            if (this._events) {
                var t = this._events[e];
                if (l(t))
                    return 1;
                if (t)
                    return t.length
            }
            return 0
        }
        ,
        i.listenerCount = function(e, t) {
            return e.listenerCount(t)
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var l = r(5)
          , o = r(3)
          , u = r(1)
          , d = r(0)
          , i = function() {
            function e(e, t, r, i) {
                this.config = e,
                this.media = t,
                this.fragmentTracker = r,
                this.hls = i,
                this.stallReported = !1
            }
            return e.prototype.poll = function(e, t) {
                var r = this.config
                  , i = this.media
                  , a = i.currentTime
                  , n = window.performance.now();
                if (a !== e)
                    return this.stallReported && (d.logger.warn("playback not stuck anymore @" + a + ", after " + Math.round(n - this.stalled) + "ms"),
                    this.stallReported = !1),
                    this.stalled = null,
                    void (this.nudgeRetry = 0);
                if (!(i.ended || !i.buffered.length || 2 < i.readyState || i.seeking && l.BufferHelper.isBuffered(i, a))) {
                    var s = n - this.stalled
                      , o = l.BufferHelper.bufferInfo(i, a, r.maxBufferHole);
                    this.stalled ? (1e3 <= s && this._reportStall(o.len),
                    this._tryFixBufferStall(o, s)) : this.stalled = n
                }
            }
            ,
            e.prototype._tryFixBufferStall = function(e, t) {
                var r = this.config
                  , i = this.fragmentTracker
                  , a = this.media.currentTime
                  , n = i.getPartialFragment(a);
                n && this._trySkipBufferHole(n),
                .5 < e.len && t > 1e3 * r.highBufferWatchdogPeriod && (this.stalled = null,
                this._tryNudgeBuffer())
            }
            ,
            e.prototype._reportStall = function(e) {
                var t = this.hls
                  , r = this.media;
                this.stallReported || (this.stallReported = !0,
                d.logger.warn("Playback stalling at @" + r.currentTime + " due to low buffer"),
                t.trigger(u.default.ERROR, {
                    type: o.ErrorTypes.MEDIA_ERROR,
                    details: o.ErrorDetails.BUFFER_STALLED_ERROR,
                    fatal: !1,
                    buffer: e
                }))
            }
            ,
            e.prototype._trySkipBufferHole = function(e) {
                for (var t = this.hls, r = this.media, i = r.currentTime, a = 0, n = 0; n < r.buffered.length; n++) {
                    var s = r.buffered.start(n);
                    if (a <= i && i < s)
                        return r.currentTime = Math.max(s, r.currentTime + .1),
                        d.logger.warn("skipping hole, adjusting currentTime from " + i + " to " + r.currentTime),
                        this.stalled = null,
                        void t.trigger(u.default.ERROR, {
                            type: o.ErrorTypes.MEDIA_ERROR,
                            details: o.ErrorDetails.BUFFER_SEEK_OVER_HOLE,
                            fatal: !1,
                            reason: "fragment loaded with buffer holes, seeking from " + i + " to " + r.currentTime,
                            frag: e
                        });
                    a = r.buffered.end(n)
                }
            }
            ,
            e.prototype._tryNudgeBuffer = function() {
                var e = this.config
                  , t = this.hls
                  , r = this.media
                  , i = r.currentTime
                  , a = (this.nudgeRetry || 0) + 1;
                if ((this.nudgeRetry = a) < e.nudgeMaxRetry) {
                    var n = i + a * e.nudgeOffset;
                    d.logger.log("adjust currentTime from " + i + " to " + n),
                    r.currentTime = n,
                    t.trigger(u.default.ERROR, {
                        type: o.ErrorTypes.MEDIA_ERROR,
                        details: o.ErrorDetails.BUFFER_NUDGE_ON_STALL,
                        fatal: !1
                    })
                } else
                    d.logger.error("still stuck in high buffer @" + i + " after " + e.nudgeMaxRetry + ", raise fatal error"),
                    t.trigger(u.default.ERROR, {
                        type: o.ErrorTypes.MEDIA_ERROR,
                        details: o.ErrorDetails.BUFFER_STALLED_ERROR,
                        fatal: !0
                    })
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var u, d = r(1), n = r(4), c = r(0), h = r(3), f = r(19), p = r(14), l = window.performance, s = function(r) {
            function e(e) {
                var t = r.call(this, e, d.default.MANIFEST_LOADED, d.default.LEVEL_LOADED, d.default.AUDIO_TRACK_SWITCHED, d.default.FRAG_LOADED, d.default.ERROR) || this;
                return t.canload = !1,
                t.currentLevelIndex = null,
                t.manualLevelIndex = -1,
                t.timer = null,
                u = /chrome|firefox/.test(navigator.userAgent.toLowerCase()),
                t
            }
            return a(e, r),
            e.prototype.onHandlerDestroying = function() {
                this.clearTimer(),
                this.manualLevelIndex = -1
            }
            ,
            e.prototype.clearTimer = function() {
                null !== this.timer && (clearTimeout(this.timer),
                this.timer = null)
            }
            ,
            e.prototype.startLoad = function() {
                var e = this._levels;
                this.canload = !0,
                this.levelRetryCount = 0,
                e && e.forEach(function(e) {
                    e.loadError = 0;
                    var t = e.details;
                    t && t.live && (e.details = void 0)
                }),
                null !== this.timer && this.loadLevel()
            }
            ,
            e.prototype.stopLoad = function() {
                this.canload = !1
            }
            ,
            e.prototype.onManifestLoaded = function(e) {
                var t, r = [], i = [], a = {}, n = null, s = !1, o = !1;
                if (e.levels.forEach(function(e) {
                    var t = e.attrs;
                    e.loadError = 0,
                    e.fragmentError = !1,
                    s = s || !!e.videoCodec,
                    o = o || !!e.audioCodec,
                    u && e.audioCodec && -1 !== e.audioCodec.indexOf("mp4a.40.34") && (e.audioCodec = void 0),
                    (n = a[e.bitrate]) ? n.url.push(e.url) : (e.url = [e.url],
                    e.urlId = 0,
                    a[e.bitrate] = e,
                    r.push(e)),
                    t && (t.AUDIO && (o = !0,
                    p.addGroupId(n || e, "audio", t.AUDIO)),
                    t.SUBTITLES && p.addGroupId(n || e, "text", t.SUBTITLES))
                }),
                s && o && (r = r.filter(function(e) {
                    return !!e.videoCodec
                })),
                r = r.filter(function(e) {
                    var t = e.audioCodec
                      , r = e.videoCodec;
                    return (!t || f.isCodecSupportedInMp4(t, "audio")) && (!r || f.isCodecSupportedInMp4(r, "video"))
                }),
                e.audioTracks && (i = e.audioTracks.filter(function(e) {
                    return !e.audioCodec || f.isCodecSupportedInMp4(e.audioCodec, "audio")
                })).forEach(function(e, t) {
                    e.id = t
                }),
                0 < r.length) {
                    t = r[0].bitrate,
                    r.sort(function(e, t) {
                        return e.bitrate - t.bitrate
                    }),
                    this._levels = r;
                    for (var l = 0; l < r.length; l++)
                        if (r[l].bitrate === t) {
                            this._firstLevel = l,
                            c.logger.log("manifest loaded," + r.length + " level(s) found, first bitrate:" + t);
                            break
                        }
                    this.hls.trigger(d.default.MANIFEST_PARSED, {
                        levels: r,
                        audioTracks: i,
                        firstLevel: this._firstLevel,
                        stats: e.stats,
                        audio: o,
                        video: s,
                        altAudio: i.some(function(e) {
                            return !!e.url
                        })
                    })
                } else
                    this.hls.trigger(d.default.ERROR, {
                        type: h.ErrorTypes.MEDIA_ERROR,
                        details: h.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
                        fatal: !0,
                        url: this.hls.url,
                        reason: "no level with compatible codecs found in manifest"
                    })
            }
            ,
            Object.defineProperty(e.prototype, "levels", {
                get: function() {
                    return this._levels
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "level", {
                get: function() {
                    return this.currentLevelIndex
                },
                set: function(e) {
                    var t = this._levels;
                    t && (e = Math.min(e, t.length - 1),
                    this.currentLevelIndex === e && t[e].details || this.setLevelInternal(e))
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.setLevelInternal = function(e) {
                var t = this._levels
                  , r = this.hls;
                if (0 <= e && e < t.length) {
                    if (this.clearTimer(),
                    this.currentLevelIndex !== e) {
                        c.logger.log("switching to level " + e);
                        var i = t[this.currentLevelIndex = e];
                        i.level = e,
                        r.trigger(d.default.LEVEL_SWITCHING, i)
                    }
                    var a = t[e]
                      , n = a.details;
                    if (!n || n.live) {
                        var s = a.urlId;
                        r.trigger(d.default.LEVEL_LOADING, {
                            url: a.url[s],
                            level: e,
                            id: s
                        })
                    }
                } else
                    r.trigger(d.default.ERROR, {
                        type: h.ErrorTypes.OTHER_ERROR,
                        details: h.ErrorDetails.LEVEL_SWITCH_ERROR,
                        level: e,
                        fatal: !1,
                        reason: "invalid level idx"
                    })
            }
            ,
            Object.defineProperty(e.prototype, "manualLevel", {
                get: function() {
                    return this.manualLevelIndex
                },
                set: function(e) {
                    this.manualLevelIndex = e,
                    void 0 === this._startLevel && (this._startLevel = e),
                    -1 !== e && (this.level = e)
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "firstLevel", {
                get: function() {
                    return this._firstLevel
                },
                set: function(e) {
                    this._firstLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "startLevel", {
                get: function() {
                    if (void 0 !== this._startLevel)
                        return this._startLevel;
                    var e = this.hls.config.startLevel;
                    return void 0 !== e ? e : this._firstLevel
                },
                set: function(e) {
                    this._startLevel = e
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.onError = function(e) {
                if (e.fatal)
                    e.type === h.ErrorTypes.NETWORK_ERROR && this.clearTimer();
                else {
                    var t, r = !1, i = !1;
                    switch (e.details) {
                    case h.ErrorDetails.FRAG_LOAD_ERROR:
                    case h.ErrorDetails.FRAG_LOAD_TIMEOUT:
                    case h.ErrorDetails.KEY_LOAD_ERROR:
                    case h.ErrorDetails.KEY_LOAD_TIMEOUT:
                        t = e.frag.level,
                        i = !0;
                        break;
                    case h.ErrorDetails.LEVEL_LOAD_ERROR:
                    case h.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        t = e.context.level,
                        r = !0;
                        break;
                    case h.ErrorDetails.REMUX_ALLOC_ERROR:
                        t = e.level,
                        r = !0
                    }
                    void 0 !== t && this.recoverLevel(e, t, r, i)
                }
            }
            ,
            e.prototype.recoverLevel = function(e, t, r, i) {
                var a, n, s, o = this, l = this.hls.config, u = e.details, d = this._levels[t];
                if (d.loadError++,
                d.fragmentError = i,
                r) {
                    if (!(this.levelRetryCount + 1 <= l.levelLoadingMaxRetry))
                        return c.logger.error("level controller, cannot recover from " + u + " error"),
                        this.currentLevelIndex = null,
                        this.clearTimer(),
                        void (e.fatal = !0);
                    n = Math.min(Math.pow(2, this.levelRetryCount) * l.levelLoadingRetryDelay, l.levelLoadingMaxRetryTimeout),
                    this.timer = setTimeout(function() {
                        return o.loadLevel()
                    }, n),
                    e.levelRetry = !0,
                    this.levelRetryCount++,
                    c.logger.warn("level controller, " + u + ", retry in " + n + " ms, current retry count is " + this.levelRetryCount)
                }
                (r || i) && (1 < (a = d.url.length) && d.loadError < a ? (d.urlId = (d.urlId + 1) % a,
                d.details = void 0,
                c.logger.warn("level controller, " + u + " for level " + t + ": switching to redundant URL-id " + d.urlId)) : -1 === this.manualLevelIndex ? (s = 0 === t ? this._levels.length - 1 : t - 1,
                c.logger.warn("level controller, " + u + ": switch to " + s),
                this.hls.nextAutoLevel = this.currentLevelIndex = s) : i && (c.logger.warn("level controller, " + u + ": reload a fragment"),
                this.currentLevelIndex = null))
            }
            ,
            e.prototype.onFragLoaded = function(e) {
                var t = e.frag;
                if (void 0 !== t && "main" === t.type) {
                    var r = this._levels[t.level];
                    void 0 !== r && (r.fragmentError = !1,
                    r.loadError = 0,
                    this.levelRetryCount = 0)
                }
            }
            ,
            e.prototype.onLevelLoaded = function(e) {
                var t = this
                  , r = e.level;
                if (r === this.currentLevelIndex) {
                    var i = this._levels[r];
                    i.fragmentError || (i.loadError = 0,
                    this.levelRetryCount = 0);
                    var a = e.details;
                    if (a.live) {
                        var n = 1e3 * (a.averagetargetduration ? a.averagetargetduration : a.targetduration)
                          , s = n
                          , o = i.details;
                        o && a.endSN === o.endSN && (s /= 2,
                        c.logger.log("same live playlist, reload twice faster")),
                        s -= l.now() - e.stats.trequest,
                        s = Math.max(n / 2, Math.round(s)),
                        c.logger.log("live playlist, reload in " + Math.round(s) + " ms"),
                        this.timer = setTimeout(function() {
                            return t.loadLevel()
                        }, s)
                    } else
                        this.clearTimer()
                }
            }
            ,
            e.prototype.onAudioTrackSwitched = function(e) {
                var t = this.hls.audioTracks[e.id].groupId
                  , r = this.hls.levels[this.currentLevelIndex];
                if (r && r.audioGroupIds) {
                    var i = r.audioGroupIds.findIndex(function(e) {
                        return e === t
                    });
                    i !== r.urlId && (r.urlId = i,
                    this.startLoad())
                }
            }
            ,
            e.prototype.loadLevel = function() {
                if (c.logger.debug("call to loadLevel"),
                null !== this.currentLevelIndex && this.canload) {
                    var e = this._levels[this.currentLevelIndex];
                    if ("object" == typeof e && 0 < e.url.length) {
                        var t = this.currentLevelIndex
                          , r = e.urlId
                          , i = e.url[r];
                        c.logger.log("Attempt loading level index " + t + " with URL-id " + r),
                        this.hls.trigger(d.default.LEVEL_LOADING, {
                            url: i,
                            level: t,
                            id: r
                        })
                    }
                }
            }
            ,
            Object.defineProperty(e.prototype, "nextLoadLevel", {
                get: function() {
                    return -1 !== this.manualLevelIndex ? this.manualLevelIndex : this.hls.nextAutoLevel
                },
                set: function(e) {
                    this.level = e,
                    -1 === this.manualLevelIndex && (this.hls.nextAutoLevel = e)
                },
                enumerable: !0,
                configurable: !0
            }),
            e
        }(n.default);
        t.default = s
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(1)
          , s = r(4)
          , c = r(10)
          , o = r(29)
          , l = function(r) {
            function e(e) {
                var t = r.call(this, e, n.default.MEDIA_ATTACHED, n.default.MEDIA_DETACHING, n.default.FRAG_PARSING_METADATA) || this;
                return t.id3Track = void 0,
                t.media = void 0,
                t
            }
            return a(e, r),
            e.prototype.destroy = function() {
                s.default.prototype.destroy.call(this)
            }
            ,
            e.prototype.onMediaAttached = function(e) {
                this.media = e.media,
                this.media
            }
            ,
            e.prototype.onMediaDetaching = function() {
                o.clearCurrentCues(this.id3Track),
                this.id3Track = void 0,
                this.media = void 0
            }
            ,
            e.prototype.getID3Track = function(e) {
                for (var t = 0; t < e.length; t++) {
                    var r = e[t];
                    if ("metadata" === r.kind && "id3" === r.label)
                        return o.sendAddTrackEvent(r, this.media),
                        r
                }
                return this.media.addTextTrack("metadata", "id3")
            }
            ,
            e.prototype.onFragParsingMetadata = function(e) {
                var t = e.frag
                  , r = e.samples;
                this.id3Track || (this.id3Track = this.getID3Track(this.media.textTracks),
                this.id3Track.mode = "hidden");
                for (var i = window.WebKitDataCue || window.VTTCue || window.TextTrackCue, a = 0; a < r.length; a++) {
                    var n = c.default.getID3Frames(r[a].data);
                    if (n) {
                        var s = r[a].pts
                          , o = a < r.length - 1 ? r[a + 1].pts : t.endPTS;
                        s === o && (o += 1e-4);
                        for (var l = 0; l < n.length; l++) {
                            var u = n[l];
                            if (!c.default.isTimeStampFrame(u)) {
                                var d = new i(s,o,"");
                                d.value = u,
                                this.id3Track.addCue(d)
                            }
                        }
                    }
                }
            }
            ,
            e
        }(s.default);
        t.default = l
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var a = r(13);
        t.isSupported = function() {
            var e = a.getMediaSource()
              , t = window.SourceBuffer || window.WebKitSourceBuffer
              , r = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')
              , i = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
            return !!r && !!i
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = r(58)
          , a = r(61)
          , n = r(62)
          , s = r(63)
          , o = r(64)
          , l = r(65)
          , u = r(66)
          , d = r(67)
          , c = r(69)
          , h = r(73)
          , f = r(74)
          , p = r(75)
          , g = r(76);
        t.hlsDefaultConfig = {
            autoStartLoad: !0,
            startPosition: -1,
            defaultAudioCodec: void 0,
            debug: !1,
            capLevelOnFPSDrop: !1,
            capLevelToPlayerSize: !1,
            initialLiveManifestSize: 1,
            maxBufferLength: 30,
            maxBufferSize: 6e7,
            maxBufferHole: .5,
            lowBufferWatchdogPeriod: .5,
            highBufferWatchdogPeriod: 3,
            nudgeOffset: .1,
            nudgeMaxRetry: 3,
            maxFragLookUpTolerance: .25,
            liveSyncDurationCount: 3,
            liveMaxLatencyDurationCount: 1 / 0,
            liveSyncDuration: void 0,
            liveMaxLatencyDuration: void 0,
            liveDurationInfinity: !1,
            liveBackBufferLength: 1 / 0,
            maxMaxBufferLength: 600,
            enableWorker: !0,
            enableSoftwareAES: !0,
            manifestLoadingTimeOut: 1e4,
            manifestLoadingMaxRetry: 1,
            manifestLoadingRetryDelay: 1e3,
            manifestLoadingMaxRetryTimeout: 64e3,
            startLevel: void 0,
            levelLoadingTimeOut: 1e4,
            levelLoadingMaxRetry: 4,
            levelLoadingRetryDelay: 1e3,
            levelLoadingMaxRetryTimeout: 64e3,
            fragLoadingTimeOut: 2e4,
            fragLoadingMaxRetry: 6,
            fragLoadingRetryDelay: 1e3,
            fragLoadingMaxRetryTimeout: 64e3,
            startFragPrefetch: !1,
            fpsDroppedMonitoringPeriod: 5e3,
            fpsDroppedMonitoringThreshold: .2,
            appendErrorMaxRetry: 3,
            loader: o.default,
            fLoader: void 0,
            pLoader: void 0,
            xhrSetup: void 0,
            licenseXhrSetup: void 0,
            abrController: i.default,
            bufferController: a.default,
            capLevelController: n.default,
            fpsController: s.default,
            stretchShortVideoTrack: !1,
            maxAudioFramesDrift: 1,
            forceKeyFrameOnDiscontinuity: !0,
            abrEwmaFastLive: 3,
            abrEwmaSlowLive: 9,
            abrEwmaFastVoD: 3,
            abrEwmaSlowVoD: 9,
            abrEwmaDefaultEstimate: 5e5,
            abrBandWidthFactor: .95,
            abrBandWidthUpFactor: .7,
            abrMaxWithRealBitrate: !1,
            maxStarvationDelay: 4,
            maxLoadingDelay: 4,
            minAutoBitrate: 0,
            emeEnabled: !1,
            widevineLicenseUrl: void 0,
            requestMediaKeySystemAccessFunc: g.requestMediaKeySystemAccess
        },
        t.hlsDefaultConfig.subtitleStreamController = f.SubtitleStreamController,
        t.hlsDefaultConfig.subtitleTrackController = h.default,
        t.hlsDefaultConfig.timelineController = c.default,
        t.hlsDefaultConfig.cueHandler = d,
        t.hlsDefaultConfig.enableCEA708Captions = !0,
        t.hlsDefaultConfig.enableWebVTT = !0,
        t.hlsDefaultConfig.captionsTextTrack1Label = "English",
        t.hlsDefaultConfig.captionsTextTrack1LanguageCode = "en",
        t.hlsDefaultConfig.captionsTextTrack2Label = "Spanish",
        t.hlsDefaultConfig.captionsTextTrack2LanguageCode = "es",
        t.hlsDefaultConfig.audioStreamController = u.default,
        t.hlsDefaultConfig.audioTrackController = l.default,
        t.hlsDefaultConfig.emeController = p.default
    }
    , function(e, r, l) {
        "use strict";
        (function(s) {
            var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var _ = l(1)
              , a = l(4)
              , E = l(5)
              , n = l(3)
              , S = l(0)
              , o = l(59)
              , T = window.performance
              , e = function(r) {
                function e(e) {
                    var t = r.call(this, e, _.default.FRAG_LOADING, _.default.FRAG_LOADED, _.default.FRAG_BUFFERED, _.default.ERROR) || this;
                    return t.lastLoadedFragLevel = 0,
                    t._nextAutoLevel = -1,
                    t.hls = e,
                    t.timer = null,
                    t._bwEstimator = null,
                    t.onCheck = t._abandonRulesCheck.bind(t),
                    t
                }
                return t(e, r),
                e.prototype.destroy = function() {
                    this.clearTimer(),
                    a.default.prototype.destroy.call(this)
                }
                ,
                e.prototype.onFragLoading = function(e) {
                    var t = e.frag;
                    if ("main" === t.type && (this.timer || (this.fragCurrent = t,
                    this.timer = setInterval(this.onCheck, 100)),
                    !this._bwEstimator)) {
                        var r = this.hls
                          , i = r.config
                          , a = t.level
                          , n = void 0
                          , s = void 0;
                        s = r.levels[a].details.live ? (n = i.abrEwmaFastLive,
                        i.abrEwmaSlowLive) : (n = i.abrEwmaFastVoD,
                        i.abrEwmaSlowVoD),
                        this._bwEstimator = new o.default(r,s,n,i.abrEwmaDefaultEstimate)
                    }
                }
                ,
                e.prototype._abandonRulesCheck = function() {
                    var e = this.hls
                      , t = e.media
                      , r = this.fragCurrent;
                    if (r) {
                        var i = r.loader
                          , a = e.minAutoLevel;
                        if (!i || i.stats && i.stats.aborted)
                            return S.logger.warn("frag loader destroy or aborted, disarm abandonRules"),
                            this.clearTimer(),
                            void (this._nextAutoLevel = -1);
                        var n = i.stats;
                        if (t && n && (!t.paused && 0 !== t.playbackRate || !t.readyState) && r.autoLevel && r.level) {
                            var s = T.now() - n.trequest
                              , o = Math.abs(t.playbackRate);
                            if (s > 500 * r.duration / o) {
                                var l = e.levels
                                  , u = Math.max(1, n.bw ? n.bw / 8 : 1e3 * n.loaded / s)
                                  , d = l[r.level]
                                  , c = d.realBitrate ? Math.max(d.realBitrate, d.bitrate) : d.bitrate
                                  , h = n.total ? n.total : Math.max(n.loaded, Math.round(r.duration * c / 8))
                                  , f = t.currentTime
                                  , p = (h - n.loaded) / u
                                  , g = (E.BufferHelper.bufferInfo(t, f, e.config.maxBufferHole).end - f) / o;
                                if (g < 2 * r.duration / o && g < p) {
                                    var v = void 0
                                      , m = void 0;
                                    for (m = r.level - 1; a < m; m--) {
                                        var y = l[m].realBitrate ? Math.max(l[m].realBitrate, l[m].bitrate) : l[m].bitrate;
                                        if ((v = r.duration * y / (6.4 * u)) < g)
                                            break
                                    }
                                    v < p && (S.logger.warn("loading too slow, abort fragment loading and switch to level " + m + ":fragLoadedDelay[" + m + "]<fragLoadedDelay[" + (r.level - 1) + "];bufferStarvationDelay:" + v.toFixed(1) + "<" + p.toFixed(1) + ":" + g.toFixed(1)),
                                    e.nextLoadLevel = m,
                                    this._bwEstimator.sample(s, n.loaded),
                                    i.abort(),
                                    this.clearTimer(),
                                    e.trigger(_.default.FRAG_LOAD_EMERGENCY_ABORTED, {
                                        frag: r,
                                        stats: n
                                    }))
                                }
                            }
                        }
                    }
                }
                ,
                e.prototype.onFragLoaded = function(e) {
                    var t = e.frag;
                    if ("main" === t.type && s.isFinite(t.sn)) {
                        if (this.clearTimer(),
                        this.lastLoadedFragLevel = t.level,
                        this._nextAutoLevel = -1,
                        this.hls.config.abrMaxWithRealBitrate) {
                            var r = this.hls.levels[t.level]
                              , i = (r.loaded ? r.loaded.bytes : 0) + e.stats.loaded
                              , a = (r.loaded ? r.loaded.duration : 0) + e.frag.duration;
                            r.loaded = {
                                bytes: i,
                                duration: a
                            },
                            r.realBitrate = Math.round(8 * i / a)
                        }
                        if (e.frag.bitrateTest) {
                            var n = e.stats;
                            n.tparsed = n.tbuffered = n.tload,
                            this.onFragBuffered(e)
                        }
                    }
                }
                ,
                e.prototype.onFragBuffered = function(e) {
                    var t = e.stats
                      , r = e.frag;
                    if (!0 !== t.aborted && "main" === r.type && s.isFinite(r.sn) && (!r.bitrateTest || t.tload === t.tbuffered)) {
                        var i = t.tparsed - t.trequest;
                        S.logger.log("latency/loading/parsing/append/kbps:" + Math.round(t.tfirst - t.trequest) + "/" + Math.round(t.tload - t.tfirst) + "/" + Math.round(t.tparsed - t.tload) + "/" + Math.round(t.tbuffered - t.tparsed) + "/" + Math.round(8 * t.loaded / (t.tbuffered - t.trequest))),
                        this._bwEstimator.sample(i, t.loaded),
                        t.bwEstimate = this._bwEstimator.getEstimate(),
                        r.bitrateTest ? this.bitrateTestDelay = i / 1e3 : this.bitrateTestDelay = 0
                    }
                }
                ,
                e.prototype.onError = function(e) {
                    switch (e.details) {
                    case n.ErrorDetails.FRAG_LOAD_ERROR:
                    case n.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        this.clearTimer()
                    }
                }
                ,
                e.prototype.clearTimer = function() {
                    clearInterval(this.timer),
                    this.timer = null
                }
                ,
                Object.defineProperty(e.prototype, "nextAutoLevel", {
                    get: function() {
                        var e = this._nextAutoLevel
                          , t = this._bwEstimator;
                        if (!(-1 === e || t && t.canEstimate()))
                            return e;
                        var r = this._nextABRAutoLevel;
                        return -1 !== e && (r = Math.min(e, r)),
                        r
                    },
                    set: function(e) {
                        this._nextAutoLevel = e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "_nextABRAutoLevel", {
                    get: function() {
                        var e = this.hls
                          , t = e.maxAutoLevel
                          , r = e.levels
                          , i = e.config
                          , a = e.minAutoLevel
                          , n = e.media
                          , s = this.lastLoadedFragLevel
                          , o = this.fragCurrent ? this.fragCurrent.duration : 0
                          , l = n ? n.currentTime : 0
                          , u = n && 0 !== n.playbackRate ? Math.abs(n.playbackRate) : 1
                          , d = this._bwEstimator ? this._bwEstimator.getEstimate() : i.abrEwmaDefaultEstimate
                          , c = (E.BufferHelper.bufferInfo(n, l, i.maxBufferHole).end - l) / u
                          , h = this._findBestLevel(s, o, d, a, t, c, i.abrBandWidthFactor, i.abrBandWidthUpFactor, r);
                        if (0 <= h)
                            return h;
                        S.logger.trace("rebuffering expected to happen, lets try to find a quality level minimizing the rebuffering");
                        var f = o ? Math.min(o, i.maxStarvationDelay) : i.maxStarvationDelay
                          , p = i.abrBandWidthFactor
                          , g = i.abrBandWidthUpFactor;
                        if (0 == c) {
                            var v = this.bitrateTestDelay;
                            v && (f = (o ? Math.min(o, i.maxLoadingDelay) : i.maxLoadingDelay) - v,
                            S.logger.trace("bitrate test took " + Math.round(1e3 * v) + "ms, set first fragment max fetchDuration to " + Math.round(1e3 * f) + " ms"),
                            p = g = 1)
                        }
                        return h = this._findBestLevel(s, o, d, a, t, c + f, p, g, r),
                        Math.max(h, 0)
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e.prototype._findBestLevel = function(e, t, r, i, a, n, s, o, l) {
                    for (var u = a; i <= u; u--) {
                        var d = l[u];
                        if (d) {
                            var c, h = d.details, f = h ? h.totalduration / h.fragments.length : t, p = !!h && h.live;
                            c = u <= e ? s * r : o * r;
                            var g = l[u].realBitrate ? Math.max(l[u].realBitrate, l[u].bitrate) : l[u].bitrate
                              , v = g * f / c;
                            if (S.logger.trace("level/adjustedbw/bitrate/avgDuration/maxFetchDuration/fetchDuration: " + u + "/" + Math.round(c) + "/" + g + "/" + f + "/" + n + "/" + v),
                            g < c && (!v || p && !this.bitrateTestDelay || v < n))
                                return u
                        }
                    }
                    return -1
                }
                ,
                e
            }(a.default);
            r.default = e
        }
        ).call(this, l(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var a = r(60)
          , i = function() {
            function e(e, t, r, i) {
                this.hls = e,
                this.defaultEstimate_ = i,
                this.minWeight_ = .001,
                this.minDelayMs_ = 50,
                this.slow_ = new a.default(t),
                this.fast_ = new a.default(r)
            }
            return e.prototype.sample = function(e, t) {
                var r = 8e3 * t / (e = Math.max(e, this.minDelayMs_))
                  , i = e / 1e3;
                this.fast_.sample(i, r),
                this.slow_.sample(i, r)
            }
            ,
            e.prototype.canEstimate = function() {
                var e = this.fast_;
                return e && e.getTotalWeight() >= this.minWeight_
            }
            ,
            e.prototype.getEstimate = function() {
                return this.canEstimate() ? Math.min(this.fast_.getEstimate(), this.slow_.getEstimate()) : this.defaultEstimate_
            }
            ,
            e.prototype.destroy = function() {}
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e) {
                this.alpha_ = e ? Math.exp(Math.log(.5) / e) : 0,
                this.estimate_ = 0,
                this.totalWeight_ = 0
            }
            return e.prototype.sample = function(e, t) {
                var r = Math.pow(this.alpha_, e);
                this.estimate_ = t * (1 - r) + r * this.estimate_,
                this.totalWeight_ += e
            }
            ,
            e.prototype.getTotalWeight = function() {
                return this.totalWeight_
            }
            ,
            e.prototype.getEstimate = function() {
                if (this.alpha_) {
                    var e = 1 - Math.pow(this.alpha_, this.totalWeight_);
                    return this.estimate_ / e
                }
                return this.estimate_
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, r, o) {
        "use strict";
        (function(i) {
            var a, t = this && this.__extends || (a = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                a(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var l = o(1)
              , n = o(4)
              , u = o(0)
              , d = o(3)
              , s = o(13).getMediaSource()
              , e = function(r) {
                function e(e) {
                    var t = r.call(this, e, l.default.MEDIA_ATTACHING, l.default.MEDIA_DETACHING, l.default.MANIFEST_PARSED, l.default.BUFFER_RESET, l.default.BUFFER_APPENDING, l.default.BUFFER_CODECS, l.default.BUFFER_EOS, l.default.BUFFER_FLUSHING, l.default.LEVEL_PTS_UPDATED, l.default.LEVEL_UPDATED) || this;
                    return t._msDuration = null,
                    t._levelDuration = null,
                    t._levelTargetDuration = 10,
                    t._live = null,
                    t._objectUrl = null,
                    t.bufferCodecEventsExpected = 0,
                    t.onsbue = t.onSBUpdateEnd.bind(t),
                    t.onsbe = t.onSBUpdateError.bind(t),
                    t.pendingTracks = {},
                    t.tracks = {},
                    t
                }
                return t(e, r),
                e.prototype.destroy = function() {
                    n.default.prototype.destroy.call(this)
                }
                ,
                e.prototype.onLevelPtsUpdated = function(e) {
                    var t = e.type
                      , r = this.tracks.audio;
                    if ("audio" === t && r && "audio/mpeg" === r.container) {
                        var i = this.sourceBuffer.audio;
                        if (.1 < Math.abs(i.timestampOffset - e.start)) {
                            var a = i.updating;
                            try {
                                i.abort()
                            } catch (e) {
                                u.logger.warn("can not abort audio buffer: " + e)
                            }
                            a ? this.audioTimestampOffset = e.start : (u.logger.warn("change mpeg audio timestamp offset from " + i.timestampOffset + " to " + e.start),
                            i.timestampOffset = e.start)
                        }
                    }
                }
                ,
                e.prototype.onManifestParsed = function(e) {
                    this.bufferCodecEventsExpected = e.altAudio ? 2 : 1,
                    u.logger.log(this.bufferCodecEventsExpected + " bufferCodec event(s) expected")
                }
                ,
                e.prototype.onMediaAttaching = function(e) {
                    var t = this.media = e.media;
                    if (t) {
                        var r = this.mediaSource = new s;
                        this.onmso = this.onMediaSourceOpen.bind(this),
                        this.onmse = this.onMediaSourceEnded.bind(this),
                        this.onmsc = this.onMediaSourceClose.bind(this),
                        r.addEventListener("sourceopen", this.onmso),
                        r.addEventListener("sourceended", this.onmse),
                        r.addEventListener("sourceclose", this.onmsc),
                        t.src = window.URL.createObjectURL(r),
                        this._objectUrl = t.src
                    }
                }
                ,
                e.prototype.onMediaDetaching = function() {
                    u.logger.log("media source detaching");
                    var e = this.mediaSource;
                    if (e) {
                        if ("open" === e.readyState)
                            try {
                                e.endOfStream()
                            } catch (e) {
                                u.logger.warn("onMediaDetaching:" + e.message + " while calling endOfStream")
                            }
                        e.removeEventListener("sourceopen", this.onmso),
                        e.removeEventListener("sourceended", this.onmse),
                        e.removeEventListener("sourceclose", this.onmsc),
                        this.media && (window.URL.revokeObjectURL(this._objectUrl),
                        this.media.src === this._objectUrl ? this.media.removeAttribute("src") : u.logger.warn("media.src was changed by a third party - skip cleanup")),
                        this.mediaSource = null,
                        this.media = null,
                        this._objectUrl = null,
                        this.pendingTracks = {},
                        this.tracks = {},
                        this.sourceBuffer = {},
                        this.flushRange = [],
                        this.segments = [],
                        this.appended = 0
                    }
                    this.onmso = this.onmse = this.onmsc = null,
                    this.hls.trigger(l.default.MEDIA_DETACHED)
                }
                ,
                e.prototype.onMediaSourceOpen = function() {
                    u.logger.log("media source opened"),
                    this.hls.trigger(l.default.MEDIA_ATTACHED, {
                        media: this.media
                    });
                    var e = this.mediaSource;
                    e && e.removeEventListener("sourceopen", this.onmso),
                    this.checkPendingTracks()
                }
                ,
                e.prototype.checkPendingTracks = function() {
                    var e = this.bufferCodecEventsExpected
                      , t = this.pendingTracks
                      , r = Object.keys(t).length;
                    (r && !e || 2 === r) && (this.createSourceBuffers(t),
                    this.pendingTracks = {},
                    this.doAppending())
                }
                ,
                e.prototype.onMediaSourceClose = function() {
                    u.logger.log("media source closed")
                }
                ,
                e.prototype.onMediaSourceEnded = function() {
                    u.logger.log("media source ended")
                }
                ,
                e.prototype.onSBUpdateEnd = function() {
                    if (this.audioTimestampOffset) {
                        var e = this.sourceBuffer.audio;
                        u.logger.warn("change mpeg audio timestamp offset from " + e.timestampOffset + " to " + this.audioTimestampOffset),
                        e.timestampOffset = this.audioTimestampOffset,
                        delete this.audioTimestampOffset
                    }
                    this._needsFlush && this.doFlush(),
                    this._needsEos && this.checkEos(),
                    this.appending = !1;
                    var r = this.parent
                      , t = this.segments.reduce(function(e, t) {
                        return t.parent === r ? e + 1 : e
                    }, 0)
                      , i = {}
                      , a = this.sourceBuffer;
                    for (var n in a)
                        i[n] = a[n].buffered;
                    this.hls.trigger(l.default.BUFFER_APPENDED, {
                        parent: r,
                        pending: t,
                        timeRanges: i
                    }),
                    this._needsFlush || this.doAppending(),
                    this.updateMediaElementDuration(),
                    0 === t && this.flushLiveBackBuffer()
                }
                ,
                e.prototype.onSBUpdateError = function(e) {
                    u.logger.error("sourceBuffer error:", e),
                    this.hls.trigger(l.default.ERROR, {
                        type: d.ErrorTypes.MEDIA_ERROR,
                        details: d.ErrorDetails.BUFFER_APPENDING_ERROR,
                        fatal: !1
                    })
                }
                ,
                e.prototype.onBufferReset = function() {
                    var e = this.sourceBuffer;
                    for (var t in e) {
                        var r = e[t];
                        try {
                            this.mediaSource.removeSourceBuffer(r),
                            r.removeEventListener("updateend", this.onsbue),
                            r.removeEventListener("error", this.onsbe)
                        } catch (e) {}
                    }
                    this.sourceBuffer = {},
                    this.flushRange = [],
                    this.segments = [],
                    this.appended = 0
                }
                ,
                e.prototype.onBufferCodecs = function(t) {
                    var r = this;
                    if (!Object.keys(this.sourceBuffer).length) {
                        Object.keys(t).forEach(function(e) {
                            r.pendingTracks[e] = t[e]
                        });
                        var e = this.mediaSource;
                        this.bufferCodecEventsExpected = Math.max(this.bufferCodecEventsExpected - 1, 0),
                        e && "open" === e.readyState && this.checkPendingTracks()
                    }
                }
                ,
                e.prototype.createSourceBuffers = function(e) {
                    var t = this.sourceBuffer
                      , r = this.mediaSource;
                    for (var i in e)
                        if (!t[i]) {
                            var a = e[i]
                              , n = a.levelCodec || a.codec
                              , s = a.container + ";codecs=" + n;
                            u.logger.log("creating sourceBuffer(" + s + ")");
                            try {
                                var o = t[i] = r.addSourceBuffer(s);
                                o.addEventListener("updateend", this.onsbue),
                                o.addEventListener("error", this.onsbe),
                                this.tracks[i] = {
                                    codec: n,
                                    container: a.container
                                },
                                a.buffer = o
                            } catch (e) {
                                u.logger.error("error while trying to add sourceBuffer:" + e.message),
                                this.hls.trigger(l.default.ERROR, {
                                    type: d.ErrorTypes.MEDIA_ERROR,
                                    details: d.ErrorDetails.BUFFER_ADD_CODEC_ERROR,
                                    fatal: !1,
                                    err: e,
                                    mimeType: s
                                })
                            }
                        }
                    this.hls.trigger(l.default.BUFFER_CREATED, {
                        tracks: e
                    })
                }
                ,
                e.prototype.onBufferAppending = function(e) {
                    this._needsFlush || (this.segments ? this.segments.push(e) : this.segments = [e],
                    this.doAppending())
                }
                ,
                e.prototype.onBufferAppendFail = function(e) {
                    u.logger.error("sourceBuffer error:", e.event),
                    this.hls.trigger(l.default.ERROR, {
                        type: d.ErrorTypes.MEDIA_ERROR,
                        details: d.ErrorDetails.BUFFER_APPENDING_ERROR,
                        fatal: !1
                    })
                }
                ,
                e.prototype.onBufferEos = function(e) {
                    var t = this.sourceBuffer
                      , r = e.type;
                    for (var i in t)
                        r && i !== r || t[i].ended || (t[i].ended = !0,
                        u.logger.log(i + " sourceBuffer now EOS"));
                    this.checkEos()
                }
                ,
                e.prototype.checkEos = function() {
                    var e = this.sourceBuffer
                      , t = this.mediaSource;
                    if (t && "open" === t.readyState) {
                        for (var r in e) {
                            var i = e[r];
                            if (!i.ended)
                                return;
                            if (i.updating)
                                return void (this._needsEos = !0)
                        }
                        u.logger.log("all media data are available, signal endOfStream() to MediaSource and stop loading fragment");
                        try {
                            t.endOfStream()
                        } catch (e) {
                            u.logger.warn("exception while calling mediaSource.endOfStream()")
                        }
                        this._needsEos = !1
                    } else
                        this._needsEos = !1
                }
                ,
                e.prototype.onBufferFlushing = function(e) {
                    this.flushRange.push({
                        start: e.startOffset,
                        end: e.endOffset,
                        type: e.type
                    }),
                    this.flushBufferCounter = 0,
                    this.doFlush()
                }
                ,
                e.prototype.flushLiveBackBuffer = function() {
                    if (this._live) {
                        var e = this.hls.config.liveBackBufferLength;
                        if (isFinite(e) && !(e < 0))
                            for (var t = this.media.currentTime, r = this.sourceBuffer, i = Object.keys(r), a = t - Math.max(e, this._levelTargetDuration), n = i.length - 1; 0 <= n; n--) {
                                var s = i[n]
                                  , o = r[s].buffered;
                                0 < o.length && a > o.start(0) && this.removeBufferRange(s, r[s], 0, a)
                            }
                    }
                }
                ,
                e.prototype.onLevelUpdated = function(e) {
                    var t = e.details;
                    0 < t.fragments.length && (this._levelDuration = t.totalduration + t.fragments[0].start,
                    this._levelTargetDuration = t.averagetargetduration || t.targetduration || 10,
                    this._live = t.live,
                    this.updateMediaElementDuration())
                }
                ,
                e.prototype.updateMediaElementDuration = function() {
                    var e, t = this.hls.config;
                    if (null !== this._levelDuration && this.media && this.mediaSource && this.sourceBuffer && 0 !== this.media.readyState && "open" === this.mediaSource.readyState) {
                        for (var r in this.sourceBuffer)
                            if (!0 === this.sourceBuffer[r].updating)
                                return;
                        e = this.media.duration,
                        null === this._msDuration && (this._msDuration = this.mediaSource.duration),
                        !0 === this._live && !0 === t.liveDurationInfinity ? (u.logger.log("Media Source duration is set to Infinity"),
                        this._msDuration = this.mediaSource.duration = 1 / 0) : (this._levelDuration > this._msDuration && this._levelDuration > e || !i.isFinite(e)) && (u.logger.log("Updating Media Source duration to " + this._levelDuration.toFixed(3)),
                        this._msDuration = this.mediaSource.duration = this._levelDuration)
                    }
                }
                ,
                e.prototype.doFlush = function() {
                    for (; this.flushRange.length; ) {
                        var e = this.flushRange[0];
                        if (!this.flushBuffer(e.start, e.end, e.type))
                            return void (this._needsFlush = !0);
                        this.flushRange.shift(),
                        this.flushBufferCounter = 0
                    }
                    if (0 === this.flushRange.length) {
                        this._needsFlush = !1;
                        var t = 0
                          , r = this.sourceBuffer;
                        try {
                            for (var i in r)
                                t += r[i].buffered.length
                        } catch (e) {
                            u.logger.error("error while accessing sourceBuffer.buffered")
                        }
                        this.appended = t,
                        this.hls.trigger(l.default.BUFFER_FLUSHED)
                    }
                }
                ,
                e.prototype.doAppending = function() {
                    var e = this.hls
                      , t = this.segments
                      , r = this.sourceBuffer;
                    if (Object.keys(r).length) {
                        if (this.media.error)
                            return this.segments = [],
                            void u.logger.error("trying to append although a media error occured, flush segment and abort");
                        if (this.appending)
                            return;
                        if (t && t.length) {
                            var i = t.shift();
                            try {
                                var a = r[i.type];
                                a ? a.updating ? t.unshift(i) : (a.ended = !1,
                                this.parent = i.parent,
                                a.appendBuffer(i.data),
                                this.appendError = 0,
                                this.appended++,
                                this.appending = !0) : this.onSBUpdateEnd()
                            } catch (r) {
                                u.logger.error("error while trying to append buffer:" + r.message),
                                t.unshift(i);
                                var n = {
                                    type: d.ErrorTypes.MEDIA_ERROR,
                                    parent: i.parent
                                };
                                22 !== r.code ? (this.appendError ? this.appendError++ : this.appendError = 1,
                                n.details = d.ErrorDetails.BUFFER_APPEND_ERROR,
                                this.appendError > e.config.appendErrorMaxRetry ? (u.logger.log("fail " + e.config.appendErrorMaxRetry + " times to append segment in sourceBuffer"),
                                this.segments = [],
                                n.fatal = !0) : n.fatal = !1) : (this.segments = [],
                                n.details = d.ErrorDetails.BUFFER_FULL_ERROR,
                                n.fatal = !1),
                                e.trigger(l.default.ERROR, n)
                            }
                        }
                    }
                }
                ,
                e.prototype.flushBuffer = function(e, t, r) {
                    var i, a = this.sourceBuffer;
                    if (Object.keys(a).length) {
                        if (u.logger.log("flushBuffer,pos/start/end: " + this.media.currentTime.toFixed(3) + "/" + e + "/" + t),
                        this.flushBufferCounter < this.appended) {
                            for (var n in a)
                                if (!r || n === r) {
                                    if ((i = a[n]).ended = !1,
                                    i.updating)
                                        return u.logger.warn("cannot flush, sb updating in progress"),
                                        !1;
                                    if (this.removeBufferRange(n, i, e, t))
                                        return this.flushBufferCounter++,
                                        !1
                                }
                        } else
                            u.logger.warn("abort flushing too many retries");
                        u.logger.log("buffer flushed")
                    }
                    return !0
                }
                ,
                e.prototype.removeBufferRange = function(e, t, r, i) {
                    try {
                        for (var a = 0; a < t.buffered.length; a++) {
                            var n = t.buffered.start(a)
                              , s = t.buffered.end(a)
                              , o = Math.max(n, r)
                              , l = Math.min(s, i);
                            if (.5 < Math.min(l, s) - o)
                                return u.logger.log("sb remove " + e + " [" + o + "," + l + "], of [" + n + "," + s + "], pos:" + this.media.currentTime),
                                t.remove(o, l),
                                !0
                        }
                    } catch (e) {
                        u.logger.warn("removeBufferRange failed", e)
                    }
                    return !1
                }
                ,
                e
            }(n.default);
            r.default = e
        }
        ).call(this, o(2).Number)
    }
    , function(e, r, s) {
        "use strict";
        (function(i) {
            var a, e = this && this.__extends || (a = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                a(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = s(1)
              , t = function(r) {
                function a(e) {
                    var t = r.call(this, e, n.default.FPS_DROP_LEVEL_CAPPING, n.default.MEDIA_ATTACHING, n.default.MANIFEST_PARSED, n.default.BUFFER_CODECS, n.default.MEDIA_DETACHING) || this;
                    return t.autoLevelCapping = i.POSITIVE_INFINITY,
                    t.firstLevel = null,
                    t.levels = [],
                    t.media = null,
                    t.restrictedLevels = [],
                    t.timer = null,
                    t
                }
                return e(a, r),
                a.prototype.destroy = function() {
                    this.hls.config.capLevelToPlayerSize && (this.media = null,
                    this._stopCapping())
                }
                ,
                a.prototype.onFpsDropLevelCapping = function(e) {
                    a.isLevelAllowed(e.droppedLevel, this.restrictedLevels) && this.restrictedLevels.push(e.droppedLevel)
                }
                ,
                a.prototype.onMediaAttaching = function(e) {
                    this.media = e.media instanceof window.HTMLVideoElement ? e.media : null
                }
                ,
                a.prototype.onManifestParsed = function(e) {
                    var t = this.hls;
                    this.restrictedLevels = [],
                    this.levels = e.levels,
                    this.firstLevel = e.firstLevel,
                    t.config.capLevelToPlayerSize && e.video && this._startCapping()
                }
                ,
                a.prototype.onBufferCodecs = function(e) {
                    this.hls.config.capLevelToPlayerSize && e.video && this._startCapping()
                }
                ,
                a.prototype.onLevelsUpdated = function(e) {
                    this.levels = e.levels
                }
                ,
                a.prototype.onMediaDetaching = function() {
                    this._stopCapping()
                }
                ,
                a.prototype.detectPlayerSize = function() {
                    if (this.media) {
                        var e = this.levels ? this.levels.length : 0;
                        if (e) {
                            var t = this.hls;
                            t.autoLevelCapping = this.getMaxLevel(e - 1),
                            t.autoLevelCapping > this.autoLevelCapping && t.streamController.nextLevelSwitch(),
                            this.autoLevelCapping = t.autoLevelCapping
                        }
                    }
                }
                ,
                a.prototype.getMaxLevel = function(r) {
                    var i = this;
                    if (!this.levels)
                        return -1;
                    var e = this.levels.filter(function(e, t) {
                        return a.isLevelAllowed(t, i.restrictedLevels) && t <= r
                    });
                    return a.getMaxLevelByMediaSize(e, this.mediaWidth, this.mediaHeight)
                }
                ,
                a.prototype._startCapping = function() {
                    this.timer || (this.autoLevelCapping = i.POSITIVE_INFINITY,
                    this.hls.firstLevel = this.getMaxLevel(this.firstLevel),
                    clearInterval(this.timer),
                    this.timer = setInterval(this.detectPlayerSize.bind(this), 1e3),
                    this.detectPlayerSize())
                }
                ,
                a.prototype._stopCapping = function() {
                    this.restrictedLevels = [],
                    this.firstLevel = null,
                    this.autoLevelCapping = i.POSITIVE_INFINITY,
                    this.timer && (this.timer = clearInterval(this.timer),
                    this.timer = null)
                }
                ,
                Object.defineProperty(a.prototype, "mediaWidth", {
                    get: function() {
                        var e, t = this.media;
                        return t && (e = t.width || t.clientWidth || t.offsetWidth,
                        e *= a.contentScaleFactor),
                        e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(a.prototype, "mediaHeight", {
                    get: function() {
                        var e, t = this.media;
                        return t && (e = t.height || t.clientHeight || t.offsetHeight,
                        e *= a.contentScaleFactor),
                        e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                Object.defineProperty(a, "contentScaleFactor", {
                    get: function() {
                        var e = 1;
                        try {
                            e = window.devicePixelRatio
                        } catch (e) {}
                        return e
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                a.isLevelAllowed = function(e, t) {
                    return void 0 === t && (t = []),
                    -1 === t.indexOf(e)
                }
                ,
                a.getMaxLevelByMediaSize = function(e, t, r) {
                    if (!e || e && !e.length)
                        return -1;
                    for (var i = e.length - 1, a = 0; a < e.length; a += 1) {
                        var n = e[a];
                        if ((n.width >= t || n.height >= r) && (s = n,
                        !(o = e[a + 1]) || s.width !== o.width || s.height !== o.height)) {
                            i = a;
                            break
                        }
                    }
                    var s, o;
                    return i
                }
                ,
                a
            }(s(4).default);
            r.default = t
        }
        ).call(this, s(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var d = r(1)
          , n = r(4)
          , c = r(0)
          , h = window.performance
          , s = function(t) {
            function e(e) {
                return t.call(this, e, d.default.MEDIA_ATTACHING) || this
            }
            return a(e, t),
            e.prototype.destroy = function() {
                this.timer && clearInterval(this.timer),
                this.isVideoPlaybackQualityAvailable = !1
            }
            ,
            e.prototype.onMediaAttaching = function(e) {
                var t = this.hls.config;
                t.capLevelOnFPSDrop && ("function" == typeof (this.video = e.media instanceof window.HTMLVideoElement ? e.media : null).getVideoPlaybackQuality && (this.isVideoPlaybackQualityAvailable = !0),
                clearInterval(this.timer),
                this.timer = setInterval(this.checkFPSInterval.bind(this), t.fpsDroppedMonitoringPeriod))
            }
            ,
            e.prototype.checkFPS = function(e, t, r) {
                var i = h.now();
                if (t) {
                    if (this.lastTime) {
                        var a = i - this.lastTime
                          , n = r - this.lastDroppedFrames
                          , s = t - this.lastDecodedFrames
                          , o = 1e3 * n / a
                          , l = this.hls;
                        if (l.trigger(d.default.FPS_DROP, {
                            currentDropped: n,
                            currentDecoded: s,
                            totalDroppedFrames: r
                        }),
                        0 < o && n > l.config.fpsDroppedMonitoringThreshold * s) {
                            var u = l.currentLevel;
                            c.logger.warn("drop FPS ratio greater than max allowed value for currentLevel: " + u),
                            0 < u && (-1 === l.autoLevelCapping || l.autoLevelCapping >= u) && (u -= 1,
                            l.trigger(d.default.FPS_DROP_LEVEL_CAPPING, {
                                level: u,
                                droppedLevel: l.currentLevel
                            }),
                            l.autoLevelCapping = u,
                            l.streamController.nextLevelSwitch())
                        }
                    }
                    this.lastTime = i,
                    this.lastDroppedFrames = r,
                    this.lastDecodedFrames = t
                }
            }
            ,
            e.prototype.checkFPSInterval = function() {
                var e = this.video;
                if (e)
                    if (this.isVideoPlaybackQualityAvailable) {
                        var t = e.getVideoPlaybackQuality();
                        this.checkFPS(e, t.totalVideoFrames, t.droppedVideoFrames)
                    } else
                        this.checkFPS(e, e.webkitDecodedFrameCount, e.webkitDroppedFrameCount)
            }
            ,
            e
        }(n.default);
        t.default = s
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var d = r(0)
          , c = window.performance
          , a = window.XMLHttpRequest
          , i = function() {
            function e(e) {
                e && e.xhrSetup && (this.xhrSetup = e.xhrSetup)
            }
            return e.prototype.destroy = function() {
                this.abort(),
                this.loader = null
            }
            ,
            e.prototype.abort = function() {
                var e = this.loader;
                e && 4 !== e.readyState && (this.stats.aborted = !0,
                e.abort()),
                window.clearTimeout(this.requestTimeout),
                this.requestTimeout = null,
                window.clearTimeout(this.retryTimeout),
                this.retryTimeout = null
            }
            ,
            e.prototype.load = function(e, t, r) {
                this.context = e,
                this.config = t,
                this.callbacks = r,
                this.stats = {
                    trequest: c.now(),
                    retry: 0
                },
                this.retryDelay = t.retryDelay,
                this.loadInternal()
            }
            ,
            e.prototype.loadInternal = function() {
                var e, t = this.context;
                e = this.loader = new a;
                var r = this.stats;
                r.tfirst = 0,
                r.loaded = 0;
                var i = this.xhrSetup;
                try {
                    if (i)
                        try {
                            i(e, t.url)
                        } catch (r) {
                            e.open("GET", t.url, !0),
                            i(e, t.url)
                        }
                    e.readyState || e.open("GET", t.url, !0)
                } catch (r) {
                    return void this.callbacks.onError({
                        code: e.status,
                        text: r.message
                    }, t, e)
                }
                t.rangeEnd && e.setRequestHeader("Range", "bytes=" + t.rangeStart + "-" + (t.rangeEnd - 1)),
                e.onreadystatechange = this.readystatechange.bind(this),
                e.onprogress = this.loadprogress.bind(this),
                e.responseType = t.responseType,
                this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), this.config.timeout),
                e.send()
            }
            ,
            e.prototype.readystatechange = function(e) {
                var t = e.currentTarget
                  , r = t.readyState
                  , i = this.stats
                  , a = this.context
                  , n = this.config;
                if (!i.aborted && 2 <= r)
                    if (window.clearTimeout(this.requestTimeout),
                    0 === i.tfirst && (i.tfirst = Math.max(c.now(), i.trequest)),
                    4 === r) {
                        var s = t.status;
                        if (200 <= s && s < 300) {
                            i.tload = Math.max(i.tfirst, c.now());
                            var o, l = void 0;
                            o = "arraybuffer" === a.responseType ? (l = t.response).byteLength : (l = t.responseText).length,
                            i.loaded = i.total = o;
                            var u = {
                                url: t.responseURL,
                                data: l
                            };
                            this.callbacks.onSuccess(u, i, a, t)
                        } else
                            i.retry >= n.maxRetry || 400 <= s && s < 499 ? (d.logger.error(s + " while loading " + a.url),
                            this.callbacks.onError({
                                code: s,
                                text: t.statusText
                            }, a, t)) : (d.logger.warn(s + " while loading " + a.url + ", retrying in " + this.retryDelay + "..."),
                            this.destroy(),
                            this.retryTimeout = window.setTimeout(this.loadInternal.bind(this), this.retryDelay),
                            this.retryDelay = Math.min(2 * this.retryDelay, n.maxRetryDelay),
                            i.retry++)
                    } else
                        this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), n.timeout)
            }
            ,
            e.prototype.loadtimeout = function() {
                d.logger.warn("timeout while loading " + this.context.url),
                this.callbacks.onTimeout(this.stats, this.context, null)
            }
            ,
            e.prototype.loadprogress = function(e) {
                var t = e.currentTarget
                  , r = this.stats;
                r.loaded = e.loaded,
                e.lengthComputable && (r.total = e.total);
                var i = this.callbacks.onProgress;
                i && i(r, this.context, null, t)
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var o = r(1)
          , n = r(15)
          , l = r(0)
          , u = r(3)
          , s = function(r) {
            function e(e) {
                var t = r.call(this, e, o.default.MANIFEST_LOADING, o.default.MANIFEST_PARSED, o.default.AUDIO_TRACK_LOADED, o.default.AUDIO_TRACK_SWITCHED, o.default.LEVEL_LOADED, o.default.ERROR) || this;
                return t._trackId = -1,
                t._selectDefaultTrack = !0,
                t.tracks = [],
                t.trackIdBlacklist = Object.create(null),
                t.audioGroupId = null,
                t
            }
            return a(e, r),
            e.prototype.onManifestLoading = function() {
                this.tracks = [],
                this._trackId = -1,
                this._selectDefaultTrack = !0
            }
            ,
            e.prototype.onManifestParsed = function(e) {
                var t = this.tracks = e.audioTracks || [];
                this.hls.trigger(o.default.AUDIO_TRACKS_UPDATED, {
                    audioTracks: t
                })
            }
            ,
            e.prototype.onAudioTrackLoaded = function(e) {
                if (e.id >= this.tracks.length)
                    l.logger.warn("Invalid audio track id:", e.id);
                else {
                    if (l.logger.log("audioTrack " + e.id + " loaded"),
                    this.tracks[e.id].details = e.details,
                    e.details.live && !this.hasInterval()) {
                        var t = 1e3 * e.details.targetduration;
                        this.setInterval(t)
                    }
                    !e.details.live && this.hasInterval() && this.clearInterval()
                }
            }
            ,
            e.prototype.onAudioTrackSwitched = function(e) {
                var t = this.tracks[e.id].groupId;
                t && this.audioGroupId !== t && (this.audioGroupId = t)
            }
            ,
            e.prototype.onLevelLoaded = function(e) {
                var t = this.hls.levels[e.level];
                if (t.audioGroupIds) {
                    var r = t.audioGroupIds[t.urlId];
                    this.audioGroupId !== r && (this.audioGroupId = r,
                    this._selectInitialAudioTrack())
                }
            }
            ,
            e.prototype.onError = function(e) {
                e.type === u.ErrorTypes.NETWORK_ERROR && (e.fatal && this.clearInterval(),
                e.details === u.ErrorDetails.AUDIO_TRACK_LOAD_ERROR && (l.logger.warn("Network failure on audio-track id:", e.context.id),
                this._handleLoadError()))
            }
            ,
            Object.defineProperty(e.prototype, "audioTracks", {
                get: function() {
                    return this.tracks
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "audioTrack", {
                get: function() {
                    return this._trackId
                },
                set: function(e) {
                    this._setAudioTrack(e),
                    this._selectDefaultTrack = !1
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype._setAudioTrack = function(e) {
                if (this._trackId === e && this.tracks[this._trackId].details)
                    l.logger.debug("Same id as current audio-track passed, and track details available -> no-op");
                else if (e < 0 || e >= this.tracks.length)
                    l.logger.warn("Invalid id passed to audio-track controller");
                else {
                    var t = this.tracks[e];
                    l.logger.log("Now switching to audio-track index " + e),
                    this.clearInterval(),
                    this._trackId = e;
                    var r = t.url
                      , i = t.type
                      , a = t.id;
                    this.hls.trigger(o.default.AUDIO_TRACK_SWITCHING, {
                        id: a,
                        type: i,
                        url: r
                    }),
                    this._loadTrackDetailsIfNeeded(t)
                }
            }
            ,
            e.prototype.doTick = function() {
                this._updateTrack(this._trackId)
            }
            ,
            e.prototype._selectInitialAudioTrack = function() {
                var t = this
                  , e = this.tracks;
                if (e.length) {
                    var r = this.tracks[this._trackId]
                      , i = null;
                    if (r && (i = r.name),
                    this._selectDefaultTrack) {
                        var a = e.filter(function(e) {
                            return e.default
                        });
                        a.length ? e = a : l.logger.warn("No default audio tracks defined")
                    }
                    var n = !1
                      , s = function() {
                        e.forEach(function(e) {
                            n || t.audioGroupId && e.groupId !== t.audioGroupId || i && i !== e.name || (t._setAudioTrack(e.id),
                            n = !0)
                        })
                    };
                    s(),
                    n || (i = null,
                    s()),
                    n || (l.logger.error("No track found for running audio group-ID: " + this.audioGroupId),
                    this.hls.trigger(o.default.ERROR, {
                        type: u.ErrorTypes.MEDIA_ERROR,
                        details: u.ErrorDetails.AUDIO_TRACK_LOAD_ERROR,
                        fatal: !0
                    }))
                }
            }
            ,
            e.prototype._needsTrackLoading = function(e) {
                var t = e.details
                  , r = e.url;
                return !(t && !t.live || !r)
            }
            ,
            e.prototype._loadTrackDetailsIfNeeded = function(e) {
                if (this._needsTrackLoading(e)) {
                    var t = e.url
                      , r = e.id;
                    l.logger.log("loading audio-track playlist for id: " + r),
                    this.hls.trigger(o.default.AUDIO_TRACK_LOADING, {
                        url: t,
                        id: r
                    })
                }
            }
            ,
            e.prototype._updateTrack = function(e) {
                if (!(e < 0 || e >= this.tracks.length)) {
                    this.clearInterval(),
                    this._trackId = e,
                    l.logger.log("trying to update audio-track " + e);
                    var t = this.tracks[e];
                    this._loadTrackDetailsIfNeeded(t)
                }
            }
            ,
            e.prototype._handleLoadError = function() {
                this.trackIdBlacklist[this._trackId] = !0;
                var e = this._trackId
                  , t = this.tracks[e]
                  , r = t.name
                  , i = t.language
                  , a = t.groupId;
                l.logger.warn("Loading failed on audio track id: " + e + ", group-id: " + a + ', name/language: "' + r + '" / "' + i + '"');
                for (var n = e, s = 0; s < this.tracks.length; s++)
                    if (!this.trackIdBlacklist[s] && this.tracks[s].name === r) {
                        n = s;
                        break
                    }
                n !== e ? (l.logger.log("Attempting audio-track fallback id:", n, "group-id:", this.tracks[n].groupId),
                this._setAudioTrack(n)) : l.logger.warn('No fallback audio-track found for name/language: "' + r + '" / "' + i + '"')
            }
            ,
            e
        }(n.default);
        t.default = s
    }
    , function(e, r, n) {
        "use strict";
        (function(P) {
            var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var x = n(9)
              , F = n(5)
              , f = n(20)
              , M = n(1)
              , h = n(14)
              , a = n(25)
              , p = n(3)
              , B = n(0)
              , N = n(26)
              , U = n(7)
              , g = n(11)
              , G = n(28)
              , H = window.performance
              , e = function(i) {
                function e(e, t) {
                    var r = i.call(this, e, M.default.MEDIA_ATTACHED, M.default.MEDIA_DETACHING, M.default.AUDIO_TRACKS_UPDATED, M.default.AUDIO_TRACK_SWITCHING, M.default.AUDIO_TRACK_LOADED, M.default.KEY_LOADED, M.default.FRAG_LOADED, M.default.FRAG_PARSING_INIT_SEGMENT, M.default.FRAG_PARSING_DATA, M.default.FRAG_PARSED, M.default.ERROR, M.default.BUFFER_RESET, M.default.BUFFER_CREATED, M.default.BUFFER_APPENDED, M.default.BUFFER_FLUSHED, M.default.INIT_PTS_FOUND) || this;
                    return r.fragmentTracker = t,
                    r.config = e.config,
                    r.audioCodecSwap = !1,
                    r._state = G.State.STOPPED,
                    r.initPTS = [],
                    r.waitingFragment = null,
                    r.videoTrackCC = null,
                    r
                }
                return t(e, i),
                e.prototype.onHandlerDestroying = function() {
                    this.stopLoad(),
                    i.prototype.onHandlerDestroying.call(this)
                }
                ,
                e.prototype.onHandlerDestroyed = function() {
                    this.state = G.State.STOPPED,
                    this.fragmentTracker = null,
                    i.prototype.onHandlerDestroyed.call(this)
                }
                ,
                e.prototype.onInitPtsFound = function(e) {
                    var t = e.id
                      , r = e.frag.cc
                      , i = e.initPTS;
                    "main" === t && (this.initPTS[r] = i,
                    this.videoTrackCC = r,
                    B.logger.log("InitPTS for cc: " + r + " found from video track: " + i),
                    this.state === G.State.WAITING_INIT_PTS && this.tick())
                }
                ,
                e.prototype.startLoad = function(e) {
                    if (this.tracks) {
                        var t = this.lastCurrentTime;
                        this.stopLoad(),
                        this.setInterval(100),
                        (this.fragLoadError = 0) < t && -1 === e ? (B.logger.log("audio:override startPosition with lastCurrentTime @" + t.toFixed(3)),
                        this.state = G.State.IDLE) : (this.lastCurrentTime = this.startPosition ? this.startPosition : e,
                        this.state = G.State.STARTING),
                        this.nextLoadPosition = this.startPosition = this.lastCurrentTime,
                        this.tick()
                    } else
                        this.startPosition = e,
                        this.state = G.State.STOPPED
                }
                ,
                e.prototype.stopLoad = function() {
                    var e = this.fragCurrent;
                    e && (e.loader && e.loader.abort(),
                    this.fragmentTracker.removeFragment(e),
                    this.fragCurrent = null),
                    this.fragPrevious = null,
                    this.demuxer && (this.demuxer.destroy(),
                    this.demuxer = null),
                    this.state = G.State.STOPPED
                }
                ,
                Object.defineProperty(e.prototype, "state", {
                    get: function() {
                        return this._state
                    },
                    set: function(e) {
                        if (this.state !== e) {
                            var t = this.state;
                            this._state = e,
                            B.logger.log("audio stream:" + t + "->" + e)
                        }
                    },
                    enumerable: !0,
                    configurable: !0
                }),
                e.prototype.doTick = function() {
                    var e, t, r, i = this.hls, a = i.config;
                    switch (this.state) {
                    case G.State.ERROR:
                    case G.State.PAUSED:
                    case G.State.BUFFER_FLUSHING:
                        break;
                    case G.State.STARTING:
                        this.state = G.State.WAITING_TRACK,
                        this.loadedmetadata = !1;
                        break;
                    case G.State.IDLE:
                        var n = this.tracks;
                        if (!n)
                            break;
                        if (!this.media && (this.startFragRequested || !a.startFragPrefetch))
                            break;
                        if (this.loadedmetadata)
                            e = this.media.currentTime;
                        else if (void 0 === (e = this.nextLoadPosition))
                            break;
                        var s = this.mediaBuffer ? this.mediaBuffer : this.media
                          , o = this.videoBuffer ? this.videoBuffer : this.media
                          , l = F.BufferHelper.bufferInfo(s, e, a.maxBufferHole)
                          , u = F.BufferHelper.bufferInfo(o, e, a.maxBufferHole)
                          , d = l.len
                          , c = l.end
                          , h = this.fragPrevious
                          , f = Math.min(a.maxBufferLength, a.maxMaxBufferLength)
                          , p = Math.max(f, u.len)
                          , g = this.audioSwitch
                          , v = this.trackId;
                        if ((d < p || g) && v < n.length) {
                            if (void 0 === (r = n[v].details)) {
                                this.state = G.State.WAITING_TRACK;
                                break
                            }
                            if (!g && this._streamEnded(l, r))
                                return this.hls.trigger(M.default.BUFFER_EOS, {
                                    type: "audio"
                                }),
                                void (this.state = G.State.ENDED);
                            var m = r.fragments
                              , y = m.length
                              , _ = m[0].start
                              , E = m[y - 1].start + m[y - 1].duration
                              , S = void 0;
                            if (g)
                                if (r.live && !r.PTSKnown)
                                    B.logger.log("switching audiotrack, live stream, unknown PTS,load first fragment"),
                                    c = 0;
                                else if (c = e,
                                r.PTSKnown && e < _) {
                                    if (!(l.end > _ || l.nextStart))
                                        return;
                                    B.logger.log("alt audio track ahead of main track, seek to start of alt audio track"),
                                    this.media.currentTime = _ + .05
                                }
                            if (r.initSegment && !r.initSegment.data)
                                S = r.initSegment;
                            else if (c <= _) {
                                if (S = m[0],
                                null !== this.videoTrackCC && S.cc !== this.videoTrackCC && (S = N.findFragWithCC(m, this.videoTrackCC)),
                                r.live && S.loadIdx && S.loadIdx === this.fragLoadIdx) {
                                    var T = l.nextStart ? l.nextStart : _;
                                    return B.logger.log("no alt audio available @currentTime:" + this.media.currentTime + ", seeking @" + (T + .05)),
                                    void (this.media.currentTime = T + .05)
                                }
                            } else {
                                var b = void 0
                                  , A = a.maxFragLookUpTolerance
                                  , R = h ? m[h.sn - m[0].sn + 1] : void 0
                                  , D = function(e) {
                                    var t = Math.min(A, e.duration);
                                    return e.start + e.duration - t <= c ? 1 : e.start - t > c && e.start ? -1 : 0
                                };
                                (b = c < E ? (E - A < c && (A = 0),
                                R && !D(R) ? R : x.default.search(m, D)) : m[y - 1]) && (_ = (S = b).start,
                                h && S.level === h.level && S.sn === h.sn && (S.sn < r.endSN ? (S = m[S.sn + 1 - r.startSN],
                                B.logger.log("SN just loaded, load next one: " + S.sn)) : S = null))
                            }
                            S && (S.encrypted ? (B.logger.log("Loading key for " + S.sn + " of [" + r.startSN + " ," + r.endSN + "],track " + v),
                            this.state = G.State.KEY_LOADING,
                            i.trigger(M.default.KEY_LOADING, {
                                frag: S
                            })) : (B.logger.log("Loading " + S.sn + ", cc: " + S.cc + " of [" + r.startSN + " ," + r.endSN + "],track " + v + ", currentTime:" + e + ",bufferEnd:" + c.toFixed(3)),
                            this.fragCurrent = S,
                            (g || this.fragmentTracker.getState(S) === U.FragmentState.NOT_LOADED) && (this.startFragRequested = !0,
                            P.isFinite(S.sn) && (this.nextLoadPosition = S.start + S.duration),
                            i.trigger(M.default.FRAG_LOADING, {
                                frag: S
                            }),
                            this.state = G.State.FRAG_LOADING)))
                        }
                        break;
                    case G.State.WAITING_TRACK:
                        (t = this.tracks[this.trackId]) && t.details && (this.state = G.State.IDLE);
                        break;
                    case G.State.FRAG_LOADING_WAITING_RETRY:
                        var k = H.now()
                          , w = this.retryDate
                          , L = (s = this.media) && s.seeking;
                        (!w || w <= k || L) && (B.logger.log("audioStreamController: retryDate reached, switch back to IDLE state"),
                        this.state = G.State.IDLE);
                        break;
                    case G.State.WAITING_INIT_PTS:
                        var O = this.videoTrackCC;
                        if (void 0 === this.initPTS[O])
                            break;
                        var C = this.waitingFragment;
                        if (C) {
                            var I = C.frag.cc;
                            O !== I ? (t = this.tracks[this.trackId]).details && t.details.live && (B.logger.warn("Waiting fragment CC (" + I + ") does not match video track CC (" + O + ")"),
                            this.waitingFragment = null,
                            this.state = G.State.IDLE) : (this.state = G.State.FRAG_LOADING,
                            this.onFragLoaded(this.waitingFragment),
                            this.waitingFragment = null)
                        } else
                            this.state = G.State.IDLE;
                        break;
                    case G.State.STOPPED:
                    case G.State.FRAG_LOADING:
                    case G.State.PARSING:
                    case G.State.PARSED:
                    case G.State.ENDED:
                    }
                }
                ,
                e.prototype.onMediaAttached = function(e) {
                    var t = this.media = this.mediaBuffer = e.media;
                    this.onvseeking = this.onMediaSeeking.bind(this),
                    this.onvended = this.onMediaEnded.bind(this),
                    t.addEventListener("seeking", this.onvseeking),
                    t.addEventListener("ended", this.onvended);
                    var r = this.config;
                    this.tracks && r.autoStartLoad && this.startLoad(r.startPosition)
                }
                ,
                e.prototype.onMediaDetaching = function() {
                    var e = this.media;
                    e && e.ended && (B.logger.log("MSE detaching and video ended, reset startPosition"),
                    this.startPosition = this.lastCurrentTime = 0),
                    e && (e.removeEventListener("seeking", this.onvseeking),
                    e.removeEventListener("ended", this.onvended),
                    this.onvseeking = this.onvseeked = this.onvended = null),
                    this.media = this.mediaBuffer = this.videoBuffer = null,
                    this.loadedmetadata = !1,
                    this.stopLoad()
                }
                ,
                e.prototype.onAudioTracksUpdated = function(e) {
                    B.logger.log("audio tracks updated"),
                    this.tracks = e.audioTracks
                }
                ,
                e.prototype.onAudioTrackSwitching = function(e) {
                    var t = !!e.url;
                    this.trackId = e.id,
                    this.fragCurrent = null,
                    this.state = G.State.PAUSED,
                    this.waitingFragment = null,
                    t ? this.setInterval(100) : this.demuxer && (this.demuxer.destroy(),
                    this.demuxer = null),
                    t && (this.audioSwitch = !0,
                    this.state = G.State.IDLE),
                    this.tick()
                }
                ,
                e.prototype.onAudioTrackLoaded = function(e) {
                    var t = e.details
                      , r = e.id
                      , i = this.tracks[r]
                      , a = t.totalduration
                      , n = 0;
                    if (B.logger.log("track " + r + " loaded [" + t.startSN + "," + t.endSN + "],duration:" + a),
                    t.live) {
                        var s = i.details;
                        s && 0 < t.fragments.length ? (h.mergeDetails(s, t),
                        n = t.fragments[0].start,
                        t.PTSKnown ? B.logger.log("live audio playlist sliding:" + n.toFixed(3)) : B.logger.log("live audio playlist - outdated PTS, unknown sliding")) : (t.PTSKnown = !1,
                        B.logger.log("live audio playlist - first load, unknown sliding"))
                    } else
                        t.PTSKnown = !1;
                    if (i.details = t,
                    !this.startFragRequested) {
                        if (-1 === this.startPosition) {
                            var o = t.startTimeOffset;
                            P.isFinite(o) ? (B.logger.log("start time offset found in playlist, adjust startPosition to " + o),
                            this.startPosition = o) : this.startPosition = 0
                        }
                        this.nextLoadPosition = this.startPosition
                    }
                    this.state === G.State.WAITING_TRACK && (this.state = G.State.IDLE),
                    this.tick()
                }
                ,
                e.prototype.onKeyLoaded = function() {
                    this.state === G.State.KEY_LOADING && (this.state = G.State.IDLE,
                    this.tick())
                }
                ,
                e.prototype.onFragLoaded = function(e) {
                    var t = this.fragCurrent
                      , r = e.frag;
                    if (this.state === G.State.FRAG_LOADING && t && "audio" === r.type && r.level === t.level && r.sn === t.sn) {
                        var i = this.tracks[this.trackId]
                          , a = i.details
                          , n = a.totalduration
                          , s = t.level
                          , o = t.sn
                          , l = t.cc
                          , u = this.config.defaultAudioCodec || i.audioCodec || "mp4a.40.2"
                          , d = this.stats = e.stats;
                        if ("initSegment" === o)
                            this.state = G.State.IDLE,
                            d.tparsed = d.tbuffered = H.now(),
                            a.initSegment.data = e.payload,
                            this.hls.trigger(M.default.FRAG_BUFFERED, {
                                stats: d,
                                frag: t,
                                id: "audio"
                            }),
                            this.tick();
                        else {
                            this.state = G.State.PARSING,
                            this.appended = !1,
                            this.demuxer || (this.demuxer = new f.default(this.hls,"audio"));
                            var c = this.initPTS[l]
                              , h = a.initSegment ? a.initSegment.data : [];
                            a.initSegment || void 0 !== c ? (this.pendingBuffering = !0,
                            B.logger.log("Demuxing " + o + " of [" + a.startSN + " ," + a.endSN + "],track " + s),
                            this.demuxer.push(e.payload, h, u, null, t, n, !1, c)) : (B.logger.log("unknown video PTS for continuity counter " + l + ", waiting for video PTS before demuxing audio frag " + o + " of [" + a.startSN + " ," + a.endSN + "],track " + s),
                            this.waitingFragment = e,
                            this.state = G.State.WAITING_INIT_PTS)
                        }
                    }
                    this.fragLoadError = 0
                }
                ,
                e.prototype.onFragParsingInitSegment = function(e) {
                    var t = this.fragCurrent
                      , r = e.frag;
                    if (t && "audio" === e.id && r.sn === t.sn && r.level === t.level && this.state === G.State.PARSING) {
                        var i = e.tracks
                          , a = void 0;
                        if (i.video && delete i.video,
                        a = i.audio) {
                            a.levelCodec = a.codec,
                            a.id = e.id,
                            this.hls.trigger(M.default.BUFFER_CODECS, i),
                            B.logger.log("audio track:audio,container:" + a.container + ",codecs[level/parsed]=[" + a.levelCodec + "/" + a.codec + "]");
                            var n = a.initSegment;
                            if (n) {
                                var s = {
                                    type: "audio",
                                    data: n,
                                    parent: "audio",
                                    content: "initSegment"
                                };
                                this.audioSwitch ? this.pendingData = [s] : (this.appended = !0,
                                this.pendingBuffering = !0,
                                this.hls.trigger(M.default.BUFFER_APPENDING, s))
                            }
                            this.tick()
                        }
                    }
                }
                ,
                e.prototype.onFragParsingData = function(t) {
                    var r = this
                      , e = this.fragCurrent
                      , i = t.frag;
                    if (e && "audio" === t.id && "audio" === t.type && i.sn === e.sn && i.level === e.level && this.state === G.State.PARSING) {
                        var a = this.trackId
                          , n = this.tracks[a]
                          , s = this.hls;
                        P.isFinite(t.endPTS) || (t.endPTS = t.startPTS + e.duration,
                        t.endDTS = t.startDTS + e.duration),
                        e.addElementaryStream(g.default.ElementaryStreamTypes.AUDIO),
                        B.logger.log("parsed " + t.type + ",PTS:[" + t.startPTS.toFixed(3) + "," + t.endPTS.toFixed(3) + "],DTS:[" + t.startDTS.toFixed(3) + "/" + t.endDTS.toFixed(3) + "],nb:" + t.nb),
                        h.updateFragPTSDTS(n.details, e, t.startPTS, t.endPTS);
                        var o = this.audioSwitch
                          , l = this.media
                          , u = !1;
                        if (o && l)
                            if (l.readyState) {
                                var d = l.currentTime;
                                B.logger.log("switching audio track : currentTime:" + d),
                                d >= t.startPTS && (B.logger.log("switching audio track : flushing all audio"),
                                this.state = G.State.BUFFER_FLUSHING,
                                s.trigger(M.default.BUFFER_FLUSHING, {
                                    startOffset: 0,
                                    endOffset: P.POSITIVE_INFINITY,
                                    type: "audio"
                                }),
                                u = !0,
                                this.audioSwitch = !1,
                                s.trigger(M.default.AUDIO_TRACK_SWITCHED, {
                                    id: a
                                }))
                            } else
                                this.audioSwitch = !1,
                                s.trigger(M.default.AUDIO_TRACK_SWITCHED, {
                                    id: a
                                });
                        var c = this.pendingData;
                        if (!c)
                            return B.logger.warn("Apparently attempt to enqueue media payload without codec initialization data upfront"),
                            void s.trigger(M.default.ERROR, {
                                type: p.ErrorTypes.MEDIA_ERROR,
                                details: null,
                                fatal: !0
                            });
                        this.audioSwitch || ([t.data1, t.data2].forEach(function(e) {
                            e && e.length && c.push({
                                type: t.type,
                                data: e,
                                parent: "audio",
                                content: "data"
                            })
                        }),
                        !u && c.length && (c.forEach(function(e) {
                            r.state === G.State.PARSING && (r.pendingBuffering = !0,
                            r.hls.trigger(M.default.BUFFER_APPENDING, e))
                        }),
                        this.pendingData = [],
                        this.appended = !0)),
                        this.tick()
                    }
                }
                ,
                e.prototype.onFragParsed = function(e) {
                    var t = this.fragCurrent
                      , r = e.frag;
                    t && "audio" === e.id && r.sn === t.sn && r.level === t.level && this.state === G.State.PARSING && (this.stats.tparsed = H.now(),
                    this.state = G.State.PARSED,
                    this._checkAppendedParsed())
                }
                ,
                e.prototype.onBufferReset = function() {
                    this.mediaBuffer = this.videoBuffer = null,
                    this.loadedmetadata = !1
                }
                ,
                e.prototype.onBufferCreated = function(e) {
                    var t = e.tracks.audio;
                    t && (this.mediaBuffer = t.buffer,
                    this.loadedmetadata = !0),
                    e.tracks.video && (this.videoBuffer = e.tracks.video.buffer)
                }
                ,
                e.prototype.onBufferAppended = function(e) {
                    if ("audio" === e.parent) {
                        var t = this.state;
                        t !== G.State.PARSING && t !== G.State.PARSED || (this.pendingBuffering = 0 < e.pending,
                        this._checkAppendedParsed())
                    }
                }
                ,
                e.prototype._checkAppendedParsed = function() {
                    if (!(this.state !== G.State.PARSED || this.appended && this.pendingBuffering)) {
                        var e = this.fragCurrent
                          , t = this.stats
                          , r = this.hls;
                        if (e) {
                            this.fragPrevious = e,
                            t.tbuffered = H.now(),
                            r.trigger(M.default.FRAG_BUFFERED, {
                                stats: t,
                                frag: e,
                                id: "audio"
                            });
                            var i = this.mediaBuffer ? this.mediaBuffer : this.media;
                            B.logger.log("audio buffered : " + a.default.toString(i.buffered)),
                            this.audioSwitch && this.appended && (this.audioSwitch = !1,
                            r.trigger(M.default.AUDIO_TRACK_SWITCHED, {
                                id: this.trackId
                            })),
                            this.state = G.State.IDLE
                        }
                        this.tick()
                    }
                }
                ,
                e.prototype.onError = function(e) {
                    var t = e.frag;
                    if (!t || "audio" === t.type)
                        switch (e.details) {
                        case p.ErrorDetails.FRAG_LOAD_ERROR:
                        case p.ErrorDetails.FRAG_LOAD_TIMEOUT:
                            var r = e.frag;
                            if (r && "audio" !== r.type)
                                break;
                            if (!e.fatal) {
                                var i = this.fragLoadError;
                                if (i ? i++ : i = 1,
                                i <= (n = this.config).fragLoadingMaxRetry) {
                                    this.fragLoadError = i;
                                    var a = Math.min(Math.pow(2, i - 1) * n.fragLoadingRetryDelay, n.fragLoadingMaxRetryTimeout);
                                    B.logger.warn("AudioStreamController: frag loading failed, retry in " + a + " ms"),
                                    this.retryDate = H.now() + a,
                                    this.state = G.State.FRAG_LOADING_WAITING_RETRY
                                } else
                                    B.logger.error("AudioStreamController: " + e.details + " reaches max retry, redispatch as fatal ..."),
                                    e.fatal = !0,
                                    this.state = G.State.ERROR
                            }
                            break;
                        case p.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
                        case p.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
                        case p.ErrorDetails.KEY_LOAD_ERROR:
                        case p.ErrorDetails.KEY_LOAD_TIMEOUT:
                            this.state !== G.State.ERROR && (this.state = e.fatal ? G.State.ERROR : G.State.IDLE,
                            B.logger.warn("AudioStreamController: " + e.details + " while loading frag, now switching to " + this.state + " state ..."));
                            break;
                        case p.ErrorDetails.BUFFER_FULL_ERROR:
                            if ("audio" === e.parent && (this.state === G.State.PARSING || this.state === G.State.PARSED)) {
                                var n, s = this.mediaBuffer, o = this.media.currentTime;
                                s && F.BufferHelper.isBuffered(s, o) && F.BufferHelper.isBuffered(s, o + .5) ? ((n = this.config).maxMaxBufferLength >= n.maxBufferLength && (n.maxMaxBufferLength /= 2,
                                B.logger.warn("AudioStreamController: reduce max buffer length to " + n.maxMaxBufferLength + "s")),
                                this.state = G.State.IDLE) : (B.logger.warn("AudioStreamController: buffer full error also media.currentTime is not buffered, flush audio buffer"),
                                this.fragCurrent = null,
                                this.state = G.State.BUFFER_FLUSHING,
                                this.hls.trigger(M.default.BUFFER_FLUSHING, {
                                    startOffset: 0,
                                    endOffset: P.POSITIVE_INFINITY,
                                    type: "audio"
                                }))
                            }
                        }
                }
                ,
                e.prototype.onBufferFlushed = function() {
                    var t = this
                      , e = this.pendingData;
                    e && e.length ? (B.logger.log("AudioStreamController: appending pending audio data after buffer flushed"),
                    e.forEach(function(e) {
                        t.hls.trigger(M.default.BUFFER_APPENDING, e)
                    }),
                    this.appended = !0,
                    this.pendingData = [],
                    this.state = G.State.PARSED) : (this.state = G.State.IDLE,
                    this.fragPrevious = null,
                    this.tick())
                }
                ,
                e
            }(G.default);
            r.default = e
        }
        ).call(this, n(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var h = r(30);
        t.newCue = function(e, t, r, i) {
            for (var a, n, s, o, l, u = window.VTTCue || window.TextTrackCue, d = 0; d < i.rows.length; d++)
                if (s = !0,
                o = 0,
                l = "",
                !(a = i.rows[d]).isEmpty()) {
                    for (var c = 0; c < a.chars.length; c++)
                        a.chars[c].uchar.match(/\s/) && s ? o++ : (l += a.chars[c].uchar,
                        s = !1);
                    (a.cueStartTime = t) === r && (r += 1e-4),
                    n = new u(t,r,h.fixLineBreaks(l.trim())),
                    16 <= o ? o-- : o++,
                    navigator.userAgent.match(/Firefox\//) ? n.line = d + 1 : n.line = 7 < d ? d - 2 : d + 1,
                    n.align = "left",
                    n.position = Math.max(0, Math.min(100, o / 32 * 100 + (navigator.userAgent.match(/Firefox\//) ? 50 : 0))),
                    e.addCue(n)
                }
        }
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        t.default = function() {
            if ("undefined" != typeof window && window.VTTCue)
                return window.VTTCue;
            var E = {
                "": !0,
                lr: !0,
                rl: !0
            }
              , t = {
                start: !0,
                middle: !0,
                end: !0,
                left: !0,
                right: !0
            };
            function S(e) {
                return "string" == typeof e && !!t[e.toLowerCase()] && e.toLowerCase()
            }
            function T(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var i in r)
                        e[i] = r[i]
                }
                return e
            }
            function e(e, t, r) {
                var i = this
                  , a = function() {
                    if ("undefined" != typeof navigator)
                        return /MSIE\s8\.0/.test(navigator.userAgent)
                }()
                  , n = {};
                a ? i = document.createElement("custom") : n.enumerable = !0,
                i.hasBeenReset = !1;
                var s = ""
                  , o = !1
                  , l = e
                  , u = t
                  , d = r
                  , c = null
                  , h = ""
                  , f = !0
                  , p = "auto"
                  , g = "start"
                  , v = 50
                  , m = "middle"
                  , y = 50
                  , _ = "middle";
                if (Object.defineProperty(i, "id", T({}, n, {
                    get: function() {
                        return s
                    },
                    set: function(e) {
                        s = "" + e
                    }
                })),
                Object.defineProperty(i, "pauseOnExit", T({}, n, {
                    get: function() {
                        return o
                    },
                    set: function(e) {
                        o = !!e
                    }
                })),
                Object.defineProperty(i, "startTime", T({}, n, {
                    get: function() {
                        return l
                    },
                    set: function(e) {
                        if ("number" != typeof e)
                            throw new TypeError("Start time must be set to a number.");
                        l = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "endTime", T({}, n, {
                    get: function() {
                        return u
                    },
                    set: function(e) {
                        if ("number" != typeof e)
                            throw new TypeError("End time must be set to a number.");
                        u = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "text", T({}, n, {
                    get: function() {
                        return d
                    },
                    set: function(e) {
                        d = "" + e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "region", T({}, n, {
                    get: function() {
                        return c
                    },
                    set: function(e) {
                        c = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "vertical", T({}, n, {
                    get: function() {
                        return h
                    },
                    set: function(e) {
                        var t, r = "string" == typeof (t = e) && !!E[t.toLowerCase()] && t.toLowerCase();
                        if (!1 === r)
                            throw new SyntaxError("An invalid or illegal string was specified.");
                        h = r,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "snapToLines", T({}, n, {
                    get: function() {
                        return f
                    },
                    set: function(e) {
                        f = !!e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "line", T({}, n, {
                    get: function() {
                        return p
                    },
                    set: function(e) {
                        if ("number" != typeof e && "auto" !== e)
                            throw new SyntaxError("An invalid number or illegal string was specified.");
                        p = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "lineAlign", T({}, n, {
                    get: function() {
                        return g
                    },
                    set: function(e) {
                        var t = S(e);
                        if (!t)
                            throw new SyntaxError("An invalid or illegal string was specified.");
                        g = t,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "position", T({}, n, {
                    get: function() {
                        return v
                    },
                    set: function(e) {
                        if (e < 0 || 100 < e)
                            throw new Error("Position must be between 0 and 100.");
                        v = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "positionAlign", T({}, n, {
                    get: function() {
                        return m
                    },
                    set: function(e) {
                        var t = S(e);
                        if (!t)
                            throw new SyntaxError("An invalid or illegal string was specified.");
                        m = t,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "size", T({}, n, {
                    get: function() {
                        return y
                    },
                    set: function(e) {
                        if (e < 0 || 100 < e)
                            throw new Error("Size must be between 0 and 100.");
                        y = e,
                        this.hasBeenReset = !0
                    }
                })),
                Object.defineProperty(i, "align", T({}, n, {
                    get: function() {
                        return _
                    },
                    set: function(e) {
                        var t = S(e);
                        if (!t)
                            throw new SyntaxError("An invalid or illegal string was specified.");
                        _ = t,
                        this.hasBeenReset = !0
                    }
                })),
                i.displayState = void 0,
                a)
                    return i
            }
            return e.prototype.getCueAsHTML = function() {
                return window.WebVTT.convertCueToDOMTree(window, this.text)
            }
            ,
            e
        }()
    }
    , function(e, a, h) {
        "use strict";
        (function(s) {
            var i, t = this && this.__extends || (i = Object.setPrototypeOf || {
                __proto__: []
            }instanceof Array && function(e, t) {
                e.__proto__ = t
            }
            || function(e, t) {
                for (var r in t)
                    t.hasOwnProperty(r) && (e[r] = t[r])
            }
            ,
            function(e, t) {
                function r() {
                    this.constructor = e
                }
                i(e, t),
                e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
                new r)
            }
            );
            Object.defineProperty(a, "__esModule", {
                value: !0
            });
            var o = h(1)
              , r = h(4)
              , n = h(70)
              , l = h(71)
              , u = h(72)
              , d = h(0)
              , c = h(29);
            var e = function(a) {
                function e(e) {
                    var t = a.call(this, e, o.default.MEDIA_ATTACHING, o.default.MEDIA_DETACHING, o.default.FRAG_PARSING_USERDATA, o.default.FRAG_DECRYPTED, o.default.MANIFEST_LOADING, o.default.MANIFEST_LOADED, o.default.FRAG_LOADED, o.default.LEVEL_SWITCHING, o.default.INIT_PTS_FOUND) || this;
                    if (t.hls = e,
                    t.config = e.config,
                    t.enabled = !0,
                    t.Cues = e.config.cueHandler,
                    t.textTracks = [],
                    t.tracks = [],
                    t.unparsedVttFrags = [],
                    t.initPTS = [],
                    t.cueRanges = [],
                    t.captionsTracks = {},
                    t.captionsProperties = {
                        textTrack1: {
                            label: t.config.captionsTextTrack1Label,
                            languageCode: t.config.captionsTextTrack1LanguageCode
                        },
                        textTrack2: {
                            label: t.config.captionsTextTrack2Label,
                            languageCode: t.config.captionsTextTrack2LanguageCode
                        }
                    },
                    t.config.enableCEA708Captions) {
                        var r = new l.default(t,"textTrack1")
                          , i = new l.default(t,"textTrack2");
                        t.cea608Parser = new n.default(0,r,i)
                    }
                    return t
                }
                return t(e, a),
                e.prototype.addCues = function(e, t, r, i) {
                    for (var a = this.cueRanges, n = !1, s = a.length; s--; ) {
                        var o = a[s]
                          , l = (u = o[0],
                        d = o[1],
                        c = t,
                        h = r,
                        Math.min(d, h) - Math.max(u, c));
                        if (0 <= l && (o[0] = Math.min(o[0], t),
                        o[1] = Math.max(o[1], r),
                        n = !0,
                        .5 < l / (r - t)))
                            return
                    }
                    var u, d, c, h;
                    n || a.push([t, r]),
                    this.Cues.newCue(this.captionsTracks[e], t, r, i)
                }
                ,
                e.prototype.onInitPtsFound = function(e) {
                    var t = this;
                    if ("main" === e.id && (this.initPTS[e.frag.cc] = e.initPTS),
                    this.unparsedVttFrags.length) {
                        var r = this.unparsedVttFrags;
                        this.unparsedVttFrags = [],
                        r.forEach(function(e) {
                            t.onFragLoaded(e)
                        })
                    }
                }
                ,
                e.prototype.getExistingTrack = function(e) {
                    var t = this.media;
                    if (t)
                        for (var r = 0; r < t.textTracks.length; r++) {
                            var i = t.textTracks[r];
                            if (i[e])
                                return i
                        }
                    return null
                }
                ,
                e.prototype.createCaptionsTrack = function(e) {
                    var t = this.captionsProperties[e]
                      , r = t.label
                      , i = t.languageCode
                      , a = this.captionsTracks;
                    if (!a[e]) {
                        var n = this.getExistingTrack(e);
                        if (n)
                            a[e] = n,
                            c.clearCurrentCues(a[e]),
                            c.sendAddTrackEvent(a[e], this.media);
                        else {
                            var s = this.createTextTrack("captions", r, i);
                            s && (s[e] = !0,
                            a[e] = s)
                        }
                    }
                }
                ,
                e.prototype.createTextTrack = function(e, t, r) {
                    var i = this.media;
                    if (i)
                        return i.addTextTrack(e, t, r)
                }
                ,
                e.prototype.destroy = function() {
                    r.default.prototype.destroy.call(this)
                }
                ,
                e.prototype.onMediaAttaching = function(e) {
                    this.media = e.media,
                    this._cleanTracks()
                }
                ,
                e.prototype.onMediaDetaching = function() {
                    var t = this.captionsTracks;
                    Object.keys(t).forEach(function(e) {
                        c.clearCurrentCues(t[e]),
                        delete t[e]
                    })
                }
                ,
                e.prototype.onManifestLoading = function() {
                    this.lastSn = -1,
                    this.prevCC = -1,
                    this.vttCCs = {
                        ccOffset: 0,
                        presentationOffset: 0,
                        0: {
                            start: 0,
                            prevCC: -1,
                            new: !1
                        }
                    },
                    this._cleanTracks()
                }
                ,
                e.prototype._cleanTracks = function() {
                    var e = this.media;
                    if (e) {
                        var t = e.textTracks;
                        if (t)
                            for (var r = 0; r < t.length; r++)
                                c.clearCurrentCues(t[r])
                    }
                }
                ,
                e.prototype.onManifestLoaded = function(e) {
                    var a = this;
                    if (this.textTracks = [],
                    this.unparsedVttFrags = this.unparsedVttFrags || [],
                    this.initPTS = [],
                    this.cueRanges = [],
                    this.config.enableWebVTT) {
                        this.tracks = e.subtitles || [];
                        var n = this.media ? this.media.textTracks : [];
                        this.tracks.forEach(function(i, e) {
                            var t;
                            if (e < n.length) {
                                var r = [].slice.call(n).find(function(e) {
                                    return r = i,
                                    (t = e) && t.label === r.name && !(t.textTrack1 || t.textTrack2);
                                    var t, r
                                });
                                r && (t = r)
                            }
                            t || (t = a.createTextTrack("subtitles", i.name, i.lang)),
                            i.default ? t.mode = a.hls.subtitleDisplay ? "showing" : "hidden" : t.mode = "disabled",
                            a.textTracks.push(t)
                        })
                    }
                }
                ,
                e.prototype.onLevelSwitching = function() {
                    this.enabled = "NONE" !== this.hls.currentLevel.closedCaptions
                }
                ,
                e.prototype.onFragLoaded = function(e) {
                    var t = e.frag
                      , r = e.payload;
                    if ("main" === t.type) {
                        var i = t.sn;
                        if (i !== this.lastSn + 1) {
                            var a = this.cea608Parser;
                            a && a.reset()
                        }
                        this.lastSn = i
                    } else if ("subtitle" === t.type)
                        if (r.byteLength) {
                            if (!s.isFinite(this.initPTS[t.cc]))
                                return this.unparsedVttFrags.push(e),
                                void (this.initPTS.length && this.hls.trigger(o.default.SUBTITLE_FRAG_PROCESSED, {
                                    success: !1,
                                    frag: t
                                }));
                            var n = t.decryptdata;
                            null != n && null != n.key && "AES-128" === n.method || this._parseVTTs(t, r)
                        } else
                            this.hls.trigger(o.default.SUBTITLE_FRAG_PROCESSED, {
                                success: !1,
                                frag: t
                            })
                }
                ,
                e.prototype._parseVTTs = function(t, e) {
                    var r = this.vttCCs;
                    r[t.cc] || (r[t.cc] = {
                        start: t.start,
                        prevCC: this.prevCC,
                        new: !0
                    },
                    this.prevCC = t.cc);
                    var a = this.textTracks
                      , n = this.hls;
                    u.default.parse(e, this.initPTS[t.cc], r, t.cc, function(e) {
                        var i = a[t.trackId];
                        "disabled" !== i.mode ? (e.forEach(function(t) {
                            if (!i.cues.getCueById(t.id))
                                try {
                                    i.addCue(t)
                                } catch (e) {
                                    var r = new window.TextTrackCue(t.startTime,t.endTime,t.text);
                                    r.id = t.id,
                                    i.addCue(r)
                                }
                        }),
                        n.trigger(o.default.SUBTITLE_FRAG_PROCESSED, {
                            success: !0,
                            frag: t
                        })) : n.trigger(o.default.SUBTITLE_FRAG_PROCESSED, {
                            success: !1,
                            frag: t
                        })
                    }, function(e) {
                        d.logger.log("Failed to parse VTT cue: " + e),
                        n.trigger(o.default.SUBTITLE_FRAG_PROCESSED, {
                            success: !1,
                            frag: t
                        })
                    })
                }
                ,
                e.prototype.onFragDecrypted = function(e) {
                    var t = e.payload
                      , r = e.frag;
                    if ("subtitle" === r.type) {
                        if (!s.isFinite(this.initPTS[r.cc]))
                            return void this.unparsedVttFrags.push(e);
                        this._parseVTTs(r, t)
                    }
                }
                ,
                e.prototype.onFragParsingUserdata = function(e) {
                    if (this.enabled && this.config.enableCEA708Captions)
                        for (var t = 0; t < e.samples.length; t++) {
                            var r = this.extractCea608Data(e.samples[t].bytes);
                            this.cea608Parser.addData(e.samples[t].pts, r)
                        }
                }
                ,
                e.prototype.extractCea608Data = function(e) {
                    for (var t, r, i, a = 31 & e[0], n = 2, s = [], o = 0; o < a; o++)
                        t = e[n++],
                        r = 127 & e[n++],
                        i = 127 & e[n++],
                        0 == r && 0 == i || 0 != (4 & t) && 0 == (3 & t) && (s.push(r),
                        s.push(i));
                    return s
                }
                ,
                e
            }(r.default);
            a.default = e
        }
        ).call(this, h(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        function o(e) {
            var t = e;
            return i.hasOwnProperty(e) && (t = i[e]),
            String.fromCharCode(t)
        }
        function l(e) {
            for (var t = [], r = 0; r < e.length; r++)
                t.push(e[r].toString(16));
            return t
        }
        var i = {
            42: 225,
            92: 233,
            94: 237,
            95: 243,
            96: 250,
            123: 231,
            124: 247,
            125: 209,
            126: 241,
            127: 9608,
            128: 174,
            129: 176,
            130: 189,
            131: 191,
            132: 8482,
            133: 162,
            134: 163,
            135: 9834,
            136: 224,
            137: 32,
            138: 232,
            139: 226,
            140: 234,
            141: 238,
            142: 244,
            143: 251,
            144: 193,
            145: 201,
            146: 211,
            147: 218,
            148: 220,
            149: 252,
            150: 8216,
            151: 161,
            152: 42,
            153: 8217,
            154: 9473,
            155: 169,
            156: 8480,
            157: 8226,
            158: 8220,
            159: 8221,
            160: 192,
            161: 194,
            162: 199,
            163: 200,
            164: 202,
            165: 203,
            166: 235,
            167: 206,
            168: 207,
            169: 239,
            170: 212,
            171: 217,
            172: 249,
            173: 219,
            174: 171,
            175: 187,
            176: 195,
            177: 227,
            178: 205,
            179: 204,
            180: 236,
            181: 210,
            182: 242,
            183: 213,
            184: 245,
            185: 123,
            186: 125,
            187: 92,
            188: 94,
            189: 95,
            190: 124,
            191: 8764,
            192: 196,
            193: 228,
            194: 214,
            195: 246,
            196: 223,
            197: 165,
            198: 164,
            199: 9475,
            200: 197,
            201: 229,
            202: 216,
            203: 248,
            204: 9487,
            205: 9491,
            206: 9495,
            207: 9499
        }
          , n = {
            17: 1,
            18: 3,
            21: 5,
            22: 7,
            23: 9,
            16: 11,
            19: 12,
            20: 14
        }
          , s = {
            17: 2,
            18: 4,
            21: 6,
            22: 8,
            23: 10,
            19: 13,
            20: 15
        }
          , u = {
            25: 1,
            26: 3,
            29: 5,
            30: 7,
            31: 9,
            24: 11,
            27: 12,
            28: 14
        }
          , d = {
            25: 2,
            26: 4,
            29: 6,
            30: 8,
            31: 10,
            27: 13,
            28: 15
        }
          , c = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "black", "transparent"]
          , h = {
            verboseFilter: {
                DATA: 3,
                DEBUG: 3,
                INFO: 2,
                WARNING: 2,
                TEXT: 1,
                ERROR: 0
            },
            time: null,
            verboseLevel: 0,
            setTime: function(e) {
                this.time = e
            },
            log: function(e, t) {
                this.verboseFilter[e],
                this.verboseLevel
            }
        }
          , f = function() {
            function e(e, t, r, i, a) {
                this.foreground = e || "white",
                this.underline = t || !1,
                this.italics = r || !1,
                this.background = i || "black",
                this.flash = a || !1
            }
            return e.prototype.reset = function() {
                this.foreground = "white",
                this.underline = !1,
                this.italics = !1,
                this.background = "black",
                this.flash = !1
            }
            ,
            e.prototype.setStyles = function(e) {
                for (var t = ["foreground", "underline", "italics", "background", "flash"], r = 0; r < t.length; r++) {
                    var i = t[r];
                    e.hasOwnProperty(i) && (this[i] = e[i])
                }
            }
            ,
            e.prototype.isDefault = function() {
                return "white" === this.foreground && !this.underline && !this.italics && "black" === this.background && !this.flash
            }
            ,
            e.prototype.equals = function(e) {
                return this.foreground === e.foreground && this.underline === e.underline && this.italics === e.italics && this.background === e.background && this.flash === e.flash
            }
            ,
            e.prototype.copy = function(e) {
                this.foreground = e.foreground,
                this.underline = e.underline,
                this.italics = e.italics,
                this.background = e.background,
                this.flash = e.flash
            }
            ,
            e.prototype.toString = function() {
                return "color=" + this.foreground + ", underline=" + this.underline + ", italics=" + this.italics + ", background=" + this.background + ", flash=" + this.flash
            }
            ,
            e
        }()
          , a = function() {
            function e(e, t, r, i, a, n) {
                this.uchar = e || " ",
                this.penState = new f(t,r,i,a,n)
            }
            return e.prototype.reset = function() {
                this.uchar = " ",
                this.penState.reset()
            }
            ,
            e.prototype.setChar = function(e, t) {
                this.uchar = e,
                this.penState.copy(t)
            }
            ,
            e.prototype.setPenState = function(e) {
                this.penState.copy(e)
            }
            ,
            e.prototype.equals = function(e) {
                return this.uchar === e.uchar && this.penState.equals(e.penState)
            }
            ,
            e.prototype.copy = function(e) {
                this.uchar = e.uchar,
                this.penState.copy(e.penState)
            }
            ,
            e.prototype.isEmpty = function() {
                return " " === this.uchar && this.penState.isDefault()
            }
            ,
            e
        }()
          , p = function() {
            function e() {
                this.chars = [];
                for (var e = 0; e < 100; e++)
                    this.chars.push(new a);
                this.pos = 0,
                this.currPenState = new f
            }
            return e.prototype.equals = function(e) {
                for (var t = !0, r = 0; r < 100; r++)
                    if (!this.chars[r].equals(e.chars[r])) {
                        t = !1;
                        break
                    }
                return t
            }
            ,
            e.prototype.copy = function(e) {
                for (var t = 0; t < 100; t++)
                    this.chars[t].copy(e.chars[t])
            }
            ,
            e.prototype.isEmpty = function() {
                for (var e = !0, t = 0; t < 100; t++)
                    if (!this.chars[t].isEmpty()) {
                        e = !1;
                        break
                    }
                return e
            }
            ,
            e.prototype.setCursor = function(e) {
                this.pos !== e && (this.pos = e),
                this.pos < 0 ? (h.log("ERROR", "Negative cursor position " + this.pos),
                this.pos = 0) : 100 < this.pos && (h.log("ERROR", "Too large cursor position " + this.pos),
                this.pos = 100)
            }
            ,
            e.prototype.moveCursor = function(e) {
                var t = this.pos + e;
                if (1 < e)
                    for (var r = this.pos + 1; r < t + 1; r++)
                        this.chars[r].setPenState(this.currPenState);
                this.setCursor(t)
            }
            ,
            e.prototype.backSpace = function() {
                this.moveCursor(-1),
                this.chars[this.pos].setChar(" ", this.currPenState)
            }
            ,
            e.prototype.insertChar = function(e) {
                144 <= e && this.backSpace();
                var t = o(e);
                100 <= this.pos ? h.log("ERROR", "Cannot insert " + e.toString(16) + " (" + t + ") at position " + this.pos + ". Skipping it!") : (this.chars[this.pos].setChar(t, this.currPenState),
                this.moveCursor(1))
            }
            ,
            e.prototype.clearFromPos = function(e) {
                var t;
                for (t = e; t < 100; t++)
                    this.chars[t].reset()
            }
            ,
            e.prototype.clear = function() {
                this.clearFromPos(0),
                this.pos = 0,
                this.currPenState.reset()
            }
            ,
            e.prototype.clearToEndOfRow = function() {
                this.clearFromPos(this.pos)
            }
            ,
            e.prototype.getTextString = function() {
                for (var e = [], t = !0, r = 0; r < 100; r++) {
                    var i = this.chars[r].uchar;
                    " " !== i && (t = !1),
                    e.push(i)
                }
                return t ? "" : e.join("")
            }
            ,
            e.prototype.setPenStyles = function(e) {
                this.currPenState.setStyles(e),
                this.chars[this.pos].setPenState(this.currPenState)
            }
            ,
            e
        }()
          , g = function() {
            function e() {
                this.rows = [];
                for (var e = 0; e < 15; e++)
                    this.rows.push(new p);
                this.currRow = 14,
                this.nrRollUpRows = null,
                this.reset()
            }
            return e.prototype.reset = function() {
                for (var e = 0; e < 15; e++)
                    this.rows[e].clear();
                this.currRow = 14
            }
            ,
            e.prototype.equals = function(e) {
                for (var t = !0, r = 0; r < 15; r++)
                    if (!this.rows[r].equals(e.rows[r])) {
                        t = !1;
                        break
                    }
                return t
            }
            ,
            e.prototype.copy = function(e) {
                for (var t = 0; t < 15; t++)
                    this.rows[t].copy(e.rows[t])
            }
            ,
            e.prototype.isEmpty = function() {
                for (var e = !0, t = 0; t < 15; t++)
                    if (!this.rows[t].isEmpty()) {
                        e = !1;
                        break
                    }
                return e
            }
            ,
            e.prototype.backSpace = function() {
                this.rows[this.currRow].backSpace()
            }
            ,
            e.prototype.clearToEndOfRow = function() {
                this.rows[this.currRow].clearToEndOfRow()
            }
            ,
            e.prototype.insertChar = function(e) {
                this.rows[this.currRow].insertChar(e)
            }
            ,
            e.prototype.setPen = function(e) {
                this.rows[this.currRow].setPenStyles(e)
            }
            ,
            e.prototype.moveCursor = function(e) {
                this.rows[this.currRow].moveCursor(e)
            }
            ,
            e.prototype.setCursor = function(e) {
                h.log("INFO", "setCursor: " + e),
                this.rows[this.currRow].setCursor(e)
            }
            ,
            e.prototype.setPAC = function(e) {
                h.log("INFO", "pacData = " + JSON.stringify(e));
                var t = e.row - 1;
                if (this.nrRollUpRows && t < this.nrRollUpRows - 1 && (t = this.nrRollUpRows - 1),
                this.nrRollUpRows && this.currRow !== t) {
                    for (var r = 0; r < 15; r++)
                        this.rows[r].clear();
                    var i = this.currRow + 1 - this.nrRollUpRows
                      , a = this.lastOutputScreen;
                    if (a) {
                        var n = a.rows[i].cueStartTime;
                        if (n && n < h.time)
                            for (r = 0; r < this.nrRollUpRows; r++)
                                this.rows[t - this.nrRollUpRows + r + 1].copy(a.rows[i + r])
                    }
                }
                this.currRow = t;
                var s = this.rows[this.currRow];
                if (null !== e.indent) {
                    var o = e.indent
                      , l = Math.max(o - 1, 0);
                    s.setCursor(e.indent),
                    e.color = s.chars[l].penState.foreground
                }
                var u = {
                    foreground: e.color,
                    underline: e.underline,
                    italics: e.italics,
                    background: "black",
                    flash: !1
                };
                this.setPen(u)
            }
            ,
            e.prototype.setBkgData = function(e) {
                h.log("INFO", "bkgData = " + JSON.stringify(e)),
                this.backSpace(),
                this.setPen(e),
                this.insertChar(32)
            }
            ,
            e.prototype.setRollUpRows = function(e) {
                this.nrRollUpRows = e
            }
            ,
            e.prototype.rollUp = function() {
                if (null !== this.nrRollUpRows) {
                    h.log("TEXT", this.getDisplayText());
                    var e = this.currRow + 1 - this.nrRollUpRows
                      , t = this.rows.splice(e, 1)[0];
                    t.clear(),
                    this.rows.splice(this.currRow, 0, t),
                    h.log("INFO", "Rolling up")
                } else
                    h.log("DEBUG", "roll_up but nrRollUpRows not set yet")
            }
            ,
            e.prototype.getDisplayText = function(e) {
                e = e || !1;
                for (var t = [], r = "", i = -1, a = 0; a < 15; a++) {
                    var n = this.rows[a].getTextString();
                    n && (i = a + 1,
                    e ? t.push("Row " + i + ": '" + n + "'") : t.push(n.trim()))
                }
                return 0 < t.length && (r = e ? "[" + t.join(" | ") + "]" : t.join("\n")),
                r
            }
            ,
            e.prototype.getTextAndFormat = function() {
                return this.rows
            }
            ,
            e
        }()
          , v = function() {
            function e(e, t) {
                this.chNr = e,
                this.outputFilter = t,
                this.mode = null,
                this.verbose = 0,
                this.displayedMemory = new g,
                this.nonDisplayedMemory = new g,
                this.lastOutputScreen = new g,
                this.currRollUpRow = this.displayedMemory.rows[14],
                this.writeScreen = this.displayedMemory,
                this.mode = null,
                this.cueStartTime = null
            }
            return e.prototype.reset = function() {
                this.mode = null,
                this.displayedMemory.reset(),
                this.nonDisplayedMemory.reset(),
                this.lastOutputScreen.reset(),
                this.currRollUpRow = this.displayedMemory.rows[14],
                this.writeScreen = this.displayedMemory,
                this.mode = null,
                this.cueStartTime = null,
                this.lastCueEndTime = null
            }
            ,
            e.prototype.getHandler = function() {
                return this.outputFilter
            }
            ,
            e.prototype.setHandler = function(e) {
                this.outputFilter = e
            }
            ,
            e.prototype.setPAC = function(e) {
                this.writeScreen.setPAC(e)
            }
            ,
            e.prototype.setBkgData = function(e) {
                this.writeScreen.setBkgData(e)
            }
            ,
            e.prototype.setMode = function(e) {
                e !== this.mode && (this.mode = e,
                h.log("INFO", "MODE=" + e),
                "MODE_POP-ON" === this.mode ? this.writeScreen = this.nonDisplayedMemory : (this.writeScreen = this.displayedMemory,
                this.writeScreen.reset()),
                "MODE_ROLL-UP" !== this.mode && (this.displayedMemory.nrRollUpRows = null,
                this.nonDisplayedMemory.nrRollUpRows = null),
                this.mode = e)
            }
            ,
            e.prototype.insertChars = function(e) {
                for (var t = 0; t < e.length; t++)
                    this.writeScreen.insertChar(e[t]);
                var r = this.writeScreen === this.displayedMemory ? "DISP" : "NON_DISP";
                h.log("INFO", r + ": " + this.writeScreen.getDisplayText(!0)),
                "MODE_PAINT-ON" !== this.mode && "MODE_ROLL-UP" !== this.mode || (h.log("TEXT", "DISPLAYED: " + this.displayedMemory.getDisplayText(!0)),
                this.outputDataUpdate())
            }
            ,
            e.prototype.ccRCL = function() {
                h.log("INFO", "RCL - Resume Caption Loading"),
                this.setMode("MODE_POP-ON")
            }
            ,
            e.prototype.ccBS = function() {
                h.log("INFO", "BS - BackSpace"),
                "MODE_TEXT" !== this.mode && (this.writeScreen.backSpace(),
                this.writeScreen === this.displayedMemory && this.outputDataUpdate())
            }
            ,
            e.prototype.ccAOF = function() {}
            ,
            e.prototype.ccAON = function() {}
            ,
            e.prototype.ccDER = function() {
                h.log("INFO", "DER- Delete to End of Row"),
                this.writeScreen.clearToEndOfRow(),
                this.outputDataUpdate()
            }
            ,
            e.prototype.ccRU = function(e) {
                h.log("INFO", "RU(" + e + ") - Roll Up"),
                this.writeScreen = this.displayedMemory,
                this.setMode("MODE_ROLL-UP"),
                this.writeScreen.setRollUpRows(e)
            }
            ,
            e.prototype.ccFON = function() {
                h.log("INFO", "FON - Flash On"),
                this.writeScreen.setPen({
                    flash: !0
                })
            }
            ,
            e.prototype.ccRDC = function() {
                h.log("INFO", "RDC - Resume Direct Captioning"),
                this.setMode("MODE_PAINT-ON")
            }
            ,
            e.prototype.ccTR = function() {
                h.log("INFO", "TR"),
                this.setMode("MODE_TEXT")
            }
            ,
            e.prototype.ccRTD = function() {
                h.log("INFO", "RTD"),
                this.setMode("MODE_TEXT")
            }
            ,
            e.prototype.ccEDM = function() {
                h.log("INFO", "EDM - Erase Displayed Memory"),
                this.displayedMemory.reset(),
                this.outputDataUpdate(!0)
            }
            ,
            e.prototype.ccCR = function() {
                h.log("CR - Carriage Return"),
                this.writeScreen.rollUp(),
                this.outputDataUpdate(!0)
            }
            ,
            e.prototype.ccENM = function() {
                h.log("INFO", "ENM - Erase Non-displayed Memory"),
                this.nonDisplayedMemory.reset()
            }
            ,
            e.prototype.ccEOC = function() {
                if (h.log("INFO", "EOC - End Of Caption"),
                "MODE_POP-ON" === this.mode) {
                    var e = this.displayedMemory;
                    this.displayedMemory = this.nonDisplayedMemory,
                    this.nonDisplayedMemory = e,
                    this.writeScreen = this.nonDisplayedMemory,
                    h.log("TEXT", "DISP: " + this.displayedMemory.getDisplayText())
                }
                this.outputDataUpdate(!0)
            }
            ,
            e.prototype.ccTO = function(e) {
                h.log("INFO", "TO(" + e + ") - Tab Offset"),
                this.writeScreen.moveCursor(e)
            }
            ,
            e.prototype.ccMIDROW = function(e) {
                var t = {
                    flash: !1
                };
                if (t.underline = e % 2 == 1,
                t.italics = 46 <= e,
                t.italics)
                    t.foreground = "white";
                else {
                    var r = Math.floor(e / 2) - 16;
                    t.foreground = ["white", "green", "blue", "cyan", "red", "yellow", "magenta"][r]
                }
                h.log("INFO", "MIDROW: " + JSON.stringify(t)),
                this.writeScreen.setPen(t)
            }
            ,
            e.prototype.outputDataUpdate = function(e) {
                void 0 === e && (e = !1);
                var t = h.time;
                null !== t && this.outputFilter && (null !== this.cueStartTime || this.displayedMemory.isEmpty() ? this.displayedMemory.equals(this.lastOutputScreen) || (this.outputFilter.newCue && (this.outputFilter.newCue(this.cueStartTime, t, this.lastOutputScreen),
                !0 === e && this.outputFilter.dispatchCue && this.outputFilter.dispatchCue()),
                this.cueStartTime = this.displayedMemory.isEmpty() ? null : t) : this.cueStartTime = t,
                this.lastOutputScreen.copy(this.displayedMemory))
            }
            ,
            e.prototype.cueSplitAtTime = function(e) {
                this.outputFilter && (this.displayedMemory.isEmpty() || (this.outputFilter.newCue && this.outputFilter.newCue(this.cueStartTime, e, this.displayedMemory),
                this.cueStartTime = e))
            }
            ,
            e
        }()
          , m = function() {
            function e(e, t, r) {
                this.field = e || 1,
                this.outputs = [t, r],
                this.channels = [new v(1,t), new v(2,r)],
                this.currChNr = -1,
                this.lastCmdA = null,
                this.lastCmdB = null,
                this.bufferedData = [],
                this.startTime = null,
                this.lastTime = null,
                this.dataCounters = {
                    padding: 0,
                    char: 0,
                    cmd: 0,
                    other: 0
                }
            }
            return e.prototype.getHandler = function(e) {
                return this.channels[e].getHandler()
            }
            ,
            e.prototype.setHandler = function(e, t) {
                this.channels[e].setHandler(t)
            }
            ,
            e.prototype.addData = function(e, t) {
                var r, i, a, n = !1;
                this.lastTime = e,
                h.setTime(e);
                for (var s = 0; s < t.length; s += 2)
                    i = 127 & t[s],
                    a = 127 & t[s + 1],
                    0 != i || 0 != a ? (h.log("DATA", "[" + l([t[s], t[s + 1]]) + "] -> (" + l([i, a]) + ")"),
                    (r = this.parseCmd(i, a)) || (r = this.parseMidrow(i, a)),
                    r || (r = this.parsePAC(i, a)),
                    r || (r = this.parseBackgroundAttributes(i, a)),
                    r || (n = this.parseChars(i, a)) && (this.currChNr && 0 <= this.currChNr ? this.channels[this.currChNr - 1].insertChars(n) : h.log("WARNING", "No channel found yet. TEXT-MODE?")),
                    r ? this.dataCounters.cmd += 2 : n ? this.dataCounters.char += 2 : (this.dataCounters.other += 2,
                    h.log("WARNING", "Couldn't parse cleaned data " + l([i, a]) + " orig: " + l([t[s], t[s + 1]])))) : this.dataCounters.padding += 2
            }
            ,
            e.prototype.parseCmd = function(e, t) {
                var r;
                if (!((20 === e || 28 === e) && 32 <= t && t <= 47 || (23 === e || 31 === e) && 33 <= t && t <= 35))
                    return !1;
                if (e === this.lastCmdA && t === this.lastCmdB)
                    return this.lastCmdA = null,
                    this.lastCmdB = null,
                    h.log("DEBUG", "Repeated command (" + l([e, t]) + ") is dropped"),
                    !0;
                r = 20 === e || 23 === e ? 1 : 2;
                var i = this.channels[r - 1];
                return 20 === e || 28 === e ? 32 === t ? i.ccRCL() : 33 === t ? i.ccBS() : 34 === t ? i.ccAOF() : 35 === t ? i.ccAON() : 36 === t ? i.ccDER() : 37 === t ? i.ccRU(2) : 38 === t ? i.ccRU(3) : 39 === t ? i.ccRU(4) : 40 === t ? i.ccFON() : 41 === t ? i.ccRDC() : 42 === t ? i.ccTR() : 43 === t ? i.ccRTD() : 44 === t ? i.ccEDM() : 45 === t ? i.ccCR() : 46 === t ? i.ccENM() : 47 === t && i.ccEOC() : i.ccTO(t - 32),
                this.lastCmdA = e,
                this.lastCmdB = t,
                this.currChNr = r,
                !0
            }
            ,
            e.prototype.parseMidrow = function(e, t) {
                var r = null;
                return (17 === e || 25 === e) && 32 <= t && t <= 47 && ((r = 17 === e ? 1 : 2) !== this.currChNr ? (h.log("ERROR", "Mismatch channel in midrow parsing"),
                !1) : (this.channels[r - 1].ccMIDROW(t),
                h.log("DEBUG", "MIDROW (" + l([e, t]) + ")"),
                !0))
            }
            ,
            e.prototype.parsePAC = function(e, t) {
                var r, i;
                if (!((17 <= e && e <= 23 || 25 <= e && e <= 31) && 64 <= t && t <= 127 || (16 === e || 24 === e) && 64 <= t && t <= 95))
                    return !1;
                if (e === this.lastCmdA && t === this.lastCmdB)
                    return this.lastCmdA = null,
                    !(this.lastCmdB = null);
                r = e <= 23 ? 1 : 2,
                i = 64 <= t && t <= 95 ? 1 == r ? n[e] : u[e] : 1 == r ? s[e] : d[e];
                var a = this.interpretPAC(i, t);
                return this.channels[r - 1].setPAC(a),
                this.lastCmdA = e,
                this.lastCmdB = t,
                this.currChNr = r,
                !0
            }
            ,
            e.prototype.interpretPAC = function(e, t) {
                var r, i = {
                    color: null,
                    italics: !1,
                    indent: null,
                    underline: !1,
                    row: e
                };
                return r = 95 < t ? t - 96 : t - 64,
                i.underline = 1 == (1 & r),
                r <= 13 ? i.color = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "white"][Math.floor(r / 2)] : r <= 15 ? (i.italics = !0,
                i.color = "white") : i.indent = 4 * Math.floor((r - 16) / 2),
                i
            }
            ,
            e.prototype.parseChars = function(e, t) {
                var r = null
                  , i = null
                  , a = null;
                if (17 <= (a = 25 <= e ? (r = 2,
                e - 8) : (r = 1,
                e)) && a <= 19) {
                    var n;
                    n = 17 === a ? t + 80 : 18 === a ? t + 112 : t + 144,
                    h.log("INFO", "Special char '" + o(n) + "' in channel " + r),
                    i = [n]
                } else
                    32 <= e && e <= 127 && (i = 0 === t ? [e] : [e, t]);
                if (i) {
                    var s = l(i);
                    h.log("DEBUG", "Char codes =  " + s.join(",")),
                    this.lastCmdA = null,
                    this.lastCmdB = null
                }
                return i
            }
            ,
            e.prototype.parseBackgroundAttributes = function(e, t) {
                var r, i, a;
                return ((16 === e || 24 === e) && 32 <= t && t <= 47 || (23 === e || 31 === e) && 45 <= t && t <= 47) && (r = {},
                16 === e || 24 === e ? (i = Math.floor((t - 32) / 2),
                r.background = c[i],
                t % 2 == 1 && (r.background = r.background + "_semi")) : 45 === t ? r.background = "transparent" : (r.foreground = "black",
                47 === t && (r.underline = !0)),
                a = e < 24 ? 1 : 2,
                this.channels[a - 1].setBkgData(r),
                this.lastCmdA = null,
                !(this.lastCmdB = null))
            }
            ,
            e.prototype.reset = function() {
                for (var e = 0; e < this.channels.length; e++)
                    this.channels[e] && this.channels[e].reset();
                this.lastCmdA = null,
                this.lastCmdB = null
            }
            ,
            e.prototype.cueSplitAtTime = function(e) {
                for (var t = 0; t < this.channels.length; t++)
                    this.channels[t] && this.channels[t].cueSplitAtTime(e)
            }
            ,
            e
        }();
        t.default = m
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
            function e(e, t) {
                this.timelineController = e,
                this.trackName = t,
                this.startTime = null,
                this.endTime = null,
                this.screen = null
            }
            return e.prototype.dispatchCue = function() {
                null !== this.startTime && (this.timelineController.addCues(this.trackName, this.startTime, this.endTime, this.screen),
                this.startTime = null)
            }
            ,
            e.prototype.newCue = function(e, t, r) {
                (null === this.startTime || this.startTime > e) && (this.startTime = e),
                this.endTime = t,
                this.screen = r,
                this.timelineController.createCaptionsTrack(this.trackName)
            }
            ,
            e
        }();
        t.default = i
    }
    , function(e, t, r) {
        "use strict";
        (function(v) {
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            function m(e, t, r) {
                return e.substr(r || 0, t.length) === t
            }
            function n(e) {
                for (var t = 5381, r = e.length; r; )
                    t = 33 * t ^ e.charCodeAt(--r);
                return (t >>> 0).toString()
            }
            var y = r(30)
              , _ = r(10)
              , e = {
                parse: function(e, s, o, l, t, r) {
                    var u, i = _.utf8ArrayToStr(new Uint8Array(e)).trim().replace(/\r\n|\n\r|\n|\r/g, "\n").split("\n"), d = "00:00.000", c = 0, h = 0, f = 0, a = [], p = !0, g = new y.default;
                    g.oncue = function(e) {
                        var t = o[l]
                          , r = o.ccOffset;
                        t && t.new && (void 0 !== h ? r = o.ccOffset = t.start : function(e, t, r) {
                            var i = e[l]
                              , a = e[i.prevCC];
                            if (!a || !a.new && i.new)
                                return e.ccOffset = e.presentationOffset = i.start,
                                i.new = !1;
                            for (; a && a.new; )
                                e.ccOffset += i.start - a.start,
                                i.new = !1,
                                a = e[(i = a).prevCC];
                            e.presentationOffset = r
                        }(o, 0, f)),
                        f && (r = f - o.presentationOffset),
                        e.startTime += r - h,
                        e.endTime += r - h,
                        e.id = n(e.startTime.toString()) + n(e.endTime.toString()) + n(e.text),
                        e.text = decodeURIComponent(encodeURIComponent(e.text)),
                        0 < e.endTime && a.push(e)
                    }
                    ,
                    g.onparsingerror = function(e) {
                        u = e
                    }
                    ,
                    g.onflush = function() {
                        u && r ? r(u) : t(a)
                    }
                    ,
                    i.forEach(function(t) {
                        if (p) {
                            if (m(t, "X-TIMESTAMP-MAP=")) {
                                p = !1,
                                t.substr(16).split(",").forEach(function(e) {
                                    m(e, "LOCAL:") ? d = e.substr(6) : m(e, "MPEGTS:") && (c = parseInt(e.substr(7)))
                                });
                                try {
                                    s + (9e4 * o[l].start || 0) < 0 && (s += 8589934592),
                                    c -= s,
                                    e = d,
                                    r = parseInt(e.substr(-3)),
                                    i = parseInt(e.substr(-6, 2)),
                                    a = parseInt(e.substr(-9, 2)),
                                    n = 9 < e.length ? parseInt(e.substr(0, e.indexOf(":"))) : 0,
                                    h = (v.isFinite(r) && v.isFinite(i) && v.isFinite(a) && v.isFinite(n) ? (r += 1e3 * i,
                                    r += 6e4 * a,
                                    r += 36e5 * n) : -1) / 1e3,
                                    f = c / 9e4,
                                    -1 === h && (u = new Error("Malformed X-TIMESTAMP-MAP: " + t))
                                } catch (e) {
                                    u = new Error("Malformed X-TIMESTAMP-MAP: " + t)
                                }
                                return
                            }
                            "" === t && (p = !1)
                        }
                        var e, r, i, a, n;
                        g.parse(t + "\n")
                    }),
                    g.flush()
                }
            };
            t.default = e
        }
        ).call(this, r(2).Number)
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(1)
          , s = r(4)
          , o = r(0);
        function l(e) {
            for (var t = [], r = 0; r < e.length; r++)
                "subtitles" === e[r].kind && t.push(e[r]);
            return t
        }
        var u = function(r) {
            function e(e) {
                var t = r.call(this, e, n.default.MEDIA_ATTACHED, n.default.MEDIA_DETACHING, n.default.MANIFEST_LOADING, n.default.MANIFEST_LOADED, n.default.SUBTITLE_TRACK_LOADED) || this;
                return t.tracks = [],
                t.trackId = -1,
                t.media = null,
                t.subtitleDisplay = !0,
                t
            }
            return a(e, r),
            e.prototype._onTextTracksChanged = function() {
                if (this.media) {
                    for (var e = -1, t = l(this.media.textTracks), r = 0; r < t.length; r++)
                        if ("hidden" === t[r].mode)
                            e = r;
                        else if ("showing" === t[r].mode) {
                            e = r;
                            break
                        }
                    this.subtitleTrack = e
                }
            }
            ,
            e.prototype.destroy = function() {
                s.default.prototype.destroy.call(this)
            }
            ,
            e.prototype.onMediaAttached = function(e) {
                var t = this;
                this.media = e.media,
                this.media && (this.queuedDefaultTrack && (this.subtitleTrack = this.queuedDefaultTrack,
                delete this.queuedDefaultTrack),
                this.trackChangeListener = this._onTextTracksChanged.bind(this),
                this.useTextTrackPolling = !(this.media.textTracks && "onchange"in this.media.textTracks),
                this.useTextTrackPolling ? this.subtitlePollingInterval = setInterval(function() {
                    t.trackChangeListener()
                }, 500) : this.media.textTracks.addEventListener("change", this.trackChangeListener))
            }
            ,
            e.prototype.onMediaDetaching = function() {
                this.media && (this.useTextTrackPolling ? clearInterval(this.subtitlePollingInterval) : this.media.textTracks.removeEventListener("change", this.trackChangeListener),
                this.media = null)
            }
            ,
            e.prototype.onManifestLoading = function() {
                this.tracks = [],
                this.trackId = -1
            }
            ,
            e.prototype.onManifestLoaded = function(e) {
                var t = this
                  , r = e.subtitles || [];
                this.tracks = r,
                this.trackId = -1,
                this.hls.trigger(n.default.SUBTITLE_TRACKS_UPDATED, {
                    subtitleTracks: r
                }),
                r.forEach(function(e) {
                    e.default && (t.media ? t.subtitleTrack = e.id : t.queuedDefaultTrack = e.id)
                })
            }
            ,
            e.prototype.onTick = function() {
                var e = this.trackId
                  , t = this.tracks[e];
                if (t) {
                    var r = t.details;
                    r && !r.live || (o.logger.log("(re)loading playlist for subtitle track " + e),
                    this.hls.trigger(n.default.SUBTITLE_TRACK_LOADING, {
                        url: t.url,
                        id: e
                    }))
                }
            }
            ,
            e.prototype.onSubtitleTrackLoaded = function(e) {
                var t = this;
                e.id < this.tracks.length && (o.logger.log("subtitle track " + e.id + " loaded"),
                this.tracks[e.id].details = e.details,
                e.details.live && !this.timer && (this.timer = setInterval(function() {
                    t.onTick()
                }, 1e3 * e.details.targetduration, this)),
                !e.details.live && this.timer && this._stopTimer())
            }
            ,
            Object.defineProperty(e.prototype, "subtitleTracks", {
                get: function() {
                    return this.tracks
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "subtitleTrack", {
                get: function() {
                    return this.trackId
                },
                set: function(e) {
                    this.trackId !== e && (this._toggleTrackModes(e),
                    this.setSubtitleTrackInternal(e))
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.setSubtitleTrackInternal = function(e) {
                var t = this.hls
                  , r = this.tracks;
                if (!("number" != typeof e || e < -1 || e >= r.length) && (this._stopTimer(),
                this.trackId = e,
                o.logger.log("switching to subtitle track " + e),
                t.trigger(n.default.SUBTITLE_TRACK_SWITCH, {
                    id: e
                }),
                -1 !== e)) {
                    var i = r[e]
                      , a = i.details;
                    a && !a.live || (o.logger.log("(re)loading playlist for subtitle track " + e),
                    t.trigger(n.default.SUBTITLE_TRACK_LOADING, {
                        url: i.url,
                        id: e
                    }))
                }
            }
            ,
            e.prototype._stopTimer = function() {
                this.timer && (clearInterval(this.timer),
                this.timer = null)
            }
            ,
            e.prototype._toggleTrackModes = function(e) {
                var t = this.media
                  , r = this.subtitleDisplay
                  , i = this.trackId;
                if (t) {
                    var a = l(t.textTracks);
                    if (-1 === e)
                        [].slice.call(a).forEach(function(e) {
                            e.mode = "disabled"
                        });
                    else {
                        var n = a[i];
                        n && (n.mode = "disabled")
                    }
                    var s = a[e];
                    s && (s.mode = r ? "showing" : "hidden")
                }
            }
            ,
            e
        }(s.default);
        t.default = u
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var p = r(1)
          , g = r(0)
          , n = r(12)
          , s = r(15)
          , v = r(5)
          , m = r(27)
          , y = r(7)
          , o = window.performance;
        t.SubtitleStreamControllerState = {
            STOPPED: "STOPPED",
            IDLE: "IDLE",
            KEY_LOADING: "KEY_LOADING",
            FRAG_LOADING: "FRAG_LOADING"
        };
        var _ = t.SubtitleStreamControllerState
          , l = function(i) {
            function e(e, t) {
                var r = i.call(this, e, p.default.MEDIA_ATTACHED, p.default.MEDIA_DETACHING, p.default.ERROR, p.default.KEY_LOADED, p.default.FRAG_LOADED, p.default.SUBTITLE_TRACKS_UPDATED, p.default.SUBTITLE_TRACK_SWITCH, p.default.SUBTITLE_TRACK_LOADED, p.default.SUBTITLE_FRAG_PROCESSED) || this;
                return r.fragmentTracker = t,
                r.config = e.config,
                r.state = _.STOPPED,
                r.tracks = [],
                r.tracksBuffered = [],
                r.currentTrackId = -1,
                r.decrypter = new n.default(e,e.config),
                r
            }
            return a(e, i),
            e.prototype.onHandlerDestroyed = function() {
                this.fragmentTracker = null,
                this.state = _.STOPPED,
                i.prototype.onHandlerDestroyed.call(this)
            }
            ,
            e.prototype.onSubtitleFragProcessed = function(e) {
                if (this.state = _.IDLE,
                e.success) {
                    var t = this.tracksBuffered[this.currentTrackId]
                      , r = e.frag;
                    if (this.fragPrevious = r,
                    t) {
                        for (var i, a = 0; a < t.length; a++)
                            if (r.start >= t[a].start && r.start <= t[a].end) {
                                i = t[a];
                                break
                            }
                        i ? i.end = r.start + r.duration : t.push({
                            start: r.start,
                            end: r.start + r.duration
                        })
                    }
                }
            }
            ,
            e.prototype.onMediaAttached = function(e) {
                this.media = e.media,
                this.state = _.IDLE
            }
            ,
            e.prototype.onMediaDetaching = function() {
                this.media = null,
                this.state = _.STOPPED
            }
            ,
            e.prototype.onError = function(e) {
                var t = e.frag;
                t && "subtitle" === t.type && (this.state = _.IDLE)
            }
            ,
            e.prototype.onSubtitleTracksUpdated = function(e) {
                var t = this;
                g.logger.log("subtitle tracks updated"),
                this.tracksBuffered = [],
                this.tracks = e.subtitleTracks,
                this.tracks.forEach(function(e) {
                    t.tracksBuffered[e.id] = []
                })
            }
            ,
            e.prototype.onSubtitleTrackSwitch = function(e) {
                if (this.currentTrackId = e.id,
                this.tracks && -1 !== this.currentTrackId) {
                    var t = this.tracks[this.currentTrackId];
                    t && t.details && this.setInterval(500)
                } else
                    this.clearInterval()
            }
            ,
            e.prototype.onSubtitleTrackLoaded = function(e) {
                var t = e.id
                  , r = e.details;
                this.tracks ? (this.tracks[t] && (g.logger.log("Updating subtitle track details"),
                this.tracks[t].details = r),
                this.setInterval(500)) : g.logger.warn("Can not update subtitle details, no tracks found")
            }
            ,
            e.prototype.onKeyLoaded = function() {
                this.state === _.KEY_LOADING && (this.state = _.IDLE)
            }
            ,
            e.prototype.onFragLoaded = function(e) {
                var t = this.fragCurrent
                  , r = e.frag.decryptdata
                  , i = e.frag
                  , a = this.hls;
                if (this.state === _.FRAG_LOADING && t && "subtitle" === e.frag.type && t.sn === e.frag.sn && 0 < e.payload.byteLength && r && r.key && "AES-128" === r.method) {
                    var n = o.now();
                    this.decrypter.decrypt(e.payload, r.key.buffer, r.iv.buffer, function(e) {
                        var t = o.now();
                        a.trigger(p.default.FRAG_DECRYPTED, {
                            frag: i,
                            payload: e,
                            stats: {
                                tstart: n,
                                tdecrypt: t
                            }
                        })
                    })
                }
            }
            ,
            e.prototype.doTick = function() {
                if (this.media)
                    switch (this.state) {
                    case _.IDLE:
                        var e = this.tracks
                          , t = this.currentTrackId;
                        if (!e || !e[t] || !e[t].details)
                            break;
                        var r = e[t].details
                          , i = this.config
                          , a = i.maxBufferHole
                          , n = Math.min(i.maxBufferLength, i.maxMaxBufferLength)
                          , s = i.maxFragLookUpTolerance
                          , o = v.BufferHelper.bufferedInfo(this._getBuffered(), this.media.currentTime, a)
                          , l = o.end
                          , u = o.len
                          , d = r.fragments
                          , c = d.length
                          , h = d[c - 1].start + d[c - 1].duration
                          , f = void 0;
                        u < n && l < h ? f = m.findFragmentByPTS(this.fragPrevious, d, l, s) : r.hasProgramDateTime && this.fragPrevious && (f = m.findFragmentByPDT(d, this.fragPrevious.endProgramDateTime, s)),
                        f && f.encrypted ? (g.logger.log("Loading key for " + f.sn),
                        this.state = _.KEY_LOADING,
                        this.hls.trigger(p.default.KEY_LOADING, {
                            frag: f
                        })) : f && this.fragmentTracker.getState(f) === y.FragmentState.NOT_LOADED && (f.trackId = t,
                        this.fragCurrent = f,
                        this.state = _.FRAG_LOADING,
                        this.hls.trigger(p.default.FRAG_LOADING, {
                            frag: f
                        }))
                    }
                else
                    this.state = _.IDLE
            }
            ,
            e.prototype._getBuffered = function() {
                return this.tracksBuffered[this.currentTrackId] || []
            }
            ,
            e
        }(s.default);
        t.SubtitleStreamController = l
    }
    , function(e, t, r) {
        "use strict";
        var i, a = this && this.__extends || (i = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(e, t) {
            e.__proto__ = t
        }
        || function(e, t) {
            for (var r in t)
                t.hasOwnProperty(r) && (e[r] = t[r])
        }
        ,
        function(e, t) {
            function r() {
                this.constructor = e
            }
            i(e, t),
            e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype,
            new r)
        }
        );
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = r(4)
          , s = r(1)
          , o = r(3)
          , l = r(0)
          , u = window.XMLHttpRequest
          , d = "com.widevine.alpha"
          , c = function(r) {
            function e(e) {
                var t = r.call(this, e, s.default.MEDIA_ATTACHED, s.default.MANIFEST_PARSED) || this;
                return t._widevineLicenseUrl = e.config.widevineLicenseUrl,
                t._licenseXhrSetup = e.config.licenseXhrSetup,
                t._emeEnabled = e.config.emeEnabled,
                t._requestMediaKeySystemAccess = e.config.requestMediaKeySystemAccessFunc,
                t._mediaKeysList = [],
                t._media = null,
                t._hasSetMediaKeys = !1,
                t._isMediaEncrypted = !1,
                t._requestLicenseFailureCount = 0,
                t
            }
            return a(e, r),
            e.prototype.getLicenseServerUrl = function(e) {
                var t;
                switch (e) {
                case d:
                    t = this._widevineLicenseUrl;
                    break;
                default:
                    t = null
                }
                return t || (l.logger.error('No license server URL configured for key-system "' + e + '"'),
                this.hls.trigger(s.default.ERROR, {
                    type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                    details: o.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
                    fatal: !0
                })),
                t
            }
            ,
            e.prototype._attemptKeySystemAccess = function(t, e, r) {
                var i = this
                  , a = function(e, t, r) {
                    switch (e) {
                    case d:
                        return i = {
                            videoCapabilities: []
                        },
                        r.forEach(function(e) {
                            i.videoCapabilities.push({
                                contentType: 'video/mp4; codecs="' + e + '"'
                            })
                        }),
                        [i];
                    default:
                        throw Error("Unknown key-system: " + e)
                    }
                    var i
                }(t, 0, r);
                a ? (l.logger.log("Requesting encrypted media key-system access"),
                this.requestMediaKeySystemAccess(t, a).then(function(e) {
                    i._onMediaKeySystemAccessObtained(t, e)
                }).catch(function(e) {
                    l.logger.error('Failed to obtain key-system "' + t + '" access:', e)
                })) : l.logger.warn("Can not create config for key-system (maybe because platform is not supported):", t)
            }
            ,
            Object.defineProperty(e.prototype, "requestMediaKeySystemAccess", {
                get: function() {
                    if (!this._requestMediaKeySystemAccess)
                        throw new Error("No requestMediaKeySystemAccess function configured");
                    return this._requestMediaKeySystemAccess
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype._onMediaKeySystemAccessObtained = function(t, e) {
                var r = this;
                l.logger.log('Access for key-system "' + t + '" obtained');
                var i = {
                    mediaKeys: null,
                    mediaKeysSession: null,
                    mediaKeysSessionInitialized: !1,
                    mediaKeySystemAccess: e,
                    mediaKeySystemDomain: t
                };
                this._mediaKeysList.push(i),
                e.createMediaKeys().then(function(e) {
                    i.mediaKeys = e,
                    l.logger.log('Media-keys created for key-system "' + t + '"'),
                    r._onMediaKeysCreated()
                }).catch(function(e) {
                    l.logger.error("Failed to create media-keys:", e)
                })
            }
            ,
            e.prototype._onMediaKeysCreated = function() {
                var t = this;
                this._mediaKeysList.forEach(function(e) {
                    e.mediaKeysSession || (e.mediaKeysSession = e.mediaKeys.createSession(),
                    t._onNewMediaKeySession(e.mediaKeysSession))
                })
            }
            ,
            e.prototype._onNewMediaKeySession = function(t) {
                var r = this;
                l.logger.log("New key-system session " + t.sessionId),
                t.addEventListener("message", function(e) {
                    r._onKeySessionMessage(t, e.message)
                }, !1)
            }
            ,
            e.prototype._onKeySessionMessage = function(t, e) {
                l.logger.log("Got EME message event, creating license request"),
                this._requestLicense(e, function(e) {
                    l.logger.log("Received license data, updating key-session"),
                    t.update(e)
                })
            }
            ,
            e.prototype._onMediaEncrypted = function(e, t) {
                l.logger.log('Media is encrypted using "' + e + '" init data type'),
                this._isMediaEncrypted = !0,
                this._mediaEncryptionInitDataType = e,
                this._mediaEncryptionInitData = t,
                this._attemptSetMediaKeys(),
                this._generateRequestWithPreferredKeySession()
            }
            ,
            e.prototype._attemptSetMediaKeys = function() {
                if (!this._hasSetMediaKeys) {
                    var e = this._mediaKeysList[0];
                    if (!e || !e.mediaKeys)
                        return l.logger.error("Fatal: Media is encrypted but no CDM access or no keys have been obtained yet"),
                        void this.hls.trigger(s.default.ERROR, {
                            type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                            details: o.ErrorDetails.KEY_SYSTEM_NO_KEYS,
                            fatal: !0
                        });
                    l.logger.log("Setting keys for encrypted media"),
                    this._media.setMediaKeys(e.mediaKeys),
                    this._hasSetMediaKeys = !0
                }
            }
            ,
            e.prototype._generateRequestWithPreferredKeySession = function() {
                var t = this
                  , e = this._mediaKeysList[0];
                if (!e)
                    return l.logger.error("Fatal: Media is encrypted but not any key-system access has been obtained yet"),
                    void this.hls.trigger(s.default.ERROR, {
                        type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                        details: o.ErrorDetails.KEY_SYSTEM_NO_ACCESS,
                        fatal: !0
                    });
                if (e.mediaKeysSessionInitialized)
                    l.logger.warn("Key-Session already initialized but requested again");
                else {
                    var r = e.mediaKeysSession;
                    r || (l.logger.error("Fatal: Media is encrypted but no key-session existing"),
                    this.hls.trigger(s.default.ERROR, {
                        type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                        details: o.ErrorDetails.KEY_SYSTEM_NO_SESSION,
                        fatal: !0
                    }));
                    var i = this._mediaEncryptionInitDataType
                      , a = this._mediaEncryptionInitData;
                    l.logger.log('Generating key-session request for "' + i + '" init data type'),
                    e.mediaKeysSessionInitialized = !0,
                    r.generateRequest(i, a).then(function() {
                        l.logger.debug("Key-session generation succeeded")
                    }).catch(function(e) {
                        l.logger.error("Error generating key-session request:", e),
                        t.hls.trigger(s.default.ERROR, {
                            type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                            details: o.ErrorDetails.KEY_SYSTEM_NO_SESSION,
                            fatal: !1
                        })
                    })
                }
            }
            ,
            e.prototype._createLicenseXhr = function(e, t, r) {
                var i = new u
                  , a = this._licenseXhrSetup;
                try {
                    if (a)
                        try {
                            a(i, e)
                        } catch (t) {
                            i.open("POST", e, !0),
                            a(i, e)
                        }
                    i.readyState || i.open("POST", e, !0)
                } catch (e) {
                    return l.logger.error("Error setting up key-system license XHR", e),
                    void this.hls.trigger(s.default.ERROR, {
                        type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                        details: o.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
                        fatal: !0
                    })
                }
                return i.responseType = "arraybuffer",
                i.onreadystatechange = this._onLicenseRequestReadyStageChange.bind(this, i, e, t, r),
                i
            }
            ,
            e.prototype._onLicenseRequestReadyStageChange = function(e, t, r, i) {
                switch (e.readyState) {
                case 4:
                    if (200 === e.status)
                        this._requestLicenseFailureCount = 0,
                        l.logger.log("License request succeeded"),
                        i(e.response);
                    else {
                        if (l.logger.error("License Request XHR failed (" + t + "). Status: " + e.status + " (" + e.statusText + ")"),
                        this._requestLicenseFailureCount++,
                        this._requestLicenseFailureCount <= 3) {
                            var a = 3 - this._requestLicenseFailureCount + 1;
                            return l.logger.warn("Retrying license request, " + a + " attempts left"),
                            void this._requestLicense(r, i)
                        }
                        this.hls.trigger(s.default.ERROR, {
                            type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                            details: o.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,
                            fatal: !0
                        })
                    }
                }
            }
            ,
            e.prototype._generateLicenseRequestChallenge = function(e, t) {
                var r;
                return "com.microsoft.playready" === e.mediaKeySystemDomain ? l.logger.error("PlayReady is not supported (yet)") : e.mediaKeySystemDomain === d ? r = t : l.logger.error("Unsupported key-system:", e.mediaKeySystemDomain),
                r
            }
            ,
            e.prototype._requestLicense = function(e, t) {
                l.logger.log("Requesting content license for key-system");
                var r = this._mediaKeysList[0];
                if (!r)
                    return l.logger.error("Fatal error: Media is encrypted but no key-system access has been obtained yet"),
                    void this.hls.trigger(s.default.ERROR, {
                        type: o.ErrorTypes.KEY_SYSTEM_ERROR,
                        details: o.ErrorDetails.KEY_SYSTEM_NO_ACCESS,
                        fatal: !0
                    });
                var i = this.getLicenseServerUrl(r.mediaKeySystemDomain)
                  , a = this._createLicenseXhr(i, e, t);
                l.logger.log("Sending license request to URL: " + i),
                a.send(this._generateLicenseRequestChallenge(r, e))
            }
            ,
            e.prototype.onMediaAttached = function(e) {
                var t = this;
                if (this._emeEnabled) {
                    var r = e.media;
                    (this._media = r).addEventListener("encrypted", function(e) {
                        t._onMediaEncrypted(e.initDataType, e.initData)
                    })
                }
            }
            ,
            e.prototype.onManifestParsed = function(e) {
                if (this._emeEnabled) {
                    var t = e.levels.map(function(e) {
                        return e.audioCodec
                    })
                      , r = e.levels.map(function(e) {
                        return e.videoCodec
                    });
                    this._attemptKeySystemAccess(d, t, r)
                }
            }
            ,
            e
        }(n.default);
        t.default = c
    }
    , function(e, t, r) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = "undefined" != typeof window && window.navigator && window.navigator.requestMediaKeySystemAccess ? window.navigator.requestMediaKeySystemAccess.bind(window.navigator) : null;
        t.requestMediaKeySystemAccess = i
    }
    ]).default
});