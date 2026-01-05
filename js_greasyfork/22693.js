// Uppod HTML5 0.13.05 (http://uppod.ru/html5)

var uppod_players;
var uppod_active_player_uid;
var uppodstyle = '';

function Uppod(loadvars) {
    var _this = this;
    var canvasObjs = [];
    var vars;
    var brw;
    var ierr = '';
    var ipad = false;
    var iphone = false;
    var android = false;
    var opera = false;
    var mobile = false;
    var nativecontrols = false;
    var ihtml5 = false;
    var init = false;
    var initevent = false;
    var iplay = false;
    var istart = false;
    var ifull = false;
    var irealfull = false;
    var ihide = false;
    var lastXY = 0;
    var lastdXY = 0;
    var ibuff = false;
    var iover = false;
    var istartevnt = false;
    var iline = false;
    var iloaded = false;
    var igo = false;
    var iwebkit = false;
    var firefox = false;
    var safari = false;
    var chrome = false;
    var itouch = false;
    var nametip;
    var name_txt;
    var controls;
    var youtubeElemId;
    var youtubeIframe;
    var mouseMoveCatcher;
    var playlist;
    var pl_mc;
    var pl;
    var plwidth;
    var plheight;
    var ipl;
    var plbg;
    var pltext;
    var plplayed;
    var plrandom;
    var plpage = 0;
    var v;
    var vvv;
    var muted;
    var hideInterval;
    var rmenu;
    var timelength = 4;
    var timeitems = 0;
    var line_s;
    var volbarline_s;
    var lastTime = 0;
    var ltc = 0;
    var layer;
    var player;
    var uibg;
    var uibg_gl;
    var oo;
    var play_b;
    var pause_b;
    var back_b;
    var stop_b;
    var start_b;
    var time_play_b;
    var time_back_b;
    var time_all_b;
    var volume_b;
    var volume_mute_b;
    var volbarline_b;
    var volbarline_all_b;
    var volbarline_play_b;
    var volbar_b;
    var volbars;
    var sep_b;
    var run_b;
    var run_pos;
    var runvolume_b;
    var runvolume_pos;
    var sep;
    var download_b;
    var next_b;
    var prev_b;
    var plnext_b;
    var plprev_b;
    var full_b;
    var full_back_b;
    var line_b;
    var line_all_b;
    var line_load_b;
    var line_play_b;
    var line_but_b;
    var space_b;
    var buffer_b;
    var menu_b;
    var playlist_b;
    var hd_b;
    var hdselect;
    var hd1_b;
    var sub_b;
    var sub_text;
    var sub_bg;
    var sub;
    var sub_lang = 0;
    var sub_showed = false;
    var sub_menu;
    var sub_menu2;
    var sub_menu_bg;
    var isub_menu_color;
    var isub_menu_bgcolor;
    var sub_last;
    var sub_lang_all = false;
    var mybuts = [];
    var cntrlength;
    var cntrl;
    var cntrls;
    var cntrli;
    var controls;
    var browser = new Uppod.Browser();
    var logo;
    var uppod = {
        _controls: null,
        _mediaW: null,
        _parentDom: null,
        _ads: null,
        iframe: {},
        window: {},
        document: {},
        toolTipOn: function(domElment) {
            domElment.onmouseover = function() {
                ToolTip(domElment, domElment.title)
            };
            domElment.onmouseout = function() {
                ToolTipHide(domElment)
            }
        },
        createMediaW: function() {
            this._mediaW = new Uppod.MediaW({
                mode: vars.m,
                vars: vars,
                mobile: mobile,
                ads: this.ads()
            });
            this._mediaW.onError.bind(function() {
                onReady();
                NotFound()
            });
            if (vars.hlsautoquality == 1) {
                this._mediaW.onQuality.bind(function() {
                    onHlsQuality()
                })
            }
            return this._mediaW
        },
        mediaW: function() {
            return this._mediaW
        },
        controls: function() {
            if (!this._controls) {
                this._controls = new Uppod.Controls()
            }
            return this._controls
        },
        playerBodyElement: function() {
            return body
        },
        parentDom: function() {
            return this._parentDom
        },
        ads: function() {
            if (!this._ads && Uppod.Ads) {
                this._ads = new Uppod.Ads({
                    containerDom: uppod.document,
                    containerDiv: uppod.iframe,
                    uid: vars.uid,
                    playerDom: this.playerBodyElement().c,
                    prerollVast: CreateLink(vars.vast_preroll),
                    postrollVast: CreateLink(vars.vast_postroll),
                    pauserollVast: CreateLink(vars.vast_pauseroll),
                    midrollVast: CreateLink(vars.vast_midroll),
                    midrollTimes: CreateLink(vars.midroll_times),
                    adEachPlaylistItem: parseInt(vars.vast_pl) === 1,
                    pauseOnClick: parseInt(vars.vast_pauseonclick) === 1,
                    prerollPauseOnClick: parseInt(vars.vast_preroll_pauseonclick) === 1,
                })
            }
            return this._ads
        },
        vars: function() {
            return vars
        },
        toogleFullscreen: function() {
            return Full.apply(this, arguments)
        },
        isFullscreen: function() {
            return ifull
        },
    };
    if (loadvars.uid) {
        if (!uppod_players) {
            uppod_players = []
        }
        this.uid = loadvars.id = loadvars.uid;
        uppod_players.push(this)
    };
    if (document.getElementById(loadvars.id)) {
        Init()
    } else {
        document.addEventListener('DOMContentLoaded', Init)
    };

    function createBody() {
        body = new Shaper2({
            w: vars.sw,
            h: vars.sh,
            bgc: vars.bodycolor,
            brd: vars.brd,
            brdc: vars.brdcolor,
            h0: (vars.cntrlout == 1 ? vars.sh - vars.cntrloutheight : 0) - (vars.pl && vars.plplace == "bottom" ? vars.plth + 20 : 0),
            a: (vars.transparent == 1 ? -1 : 1)
        });
        uppod.document.appendChild(body.c);
        CSS(uppod.iframe, {
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-o-user-select': 'none',
            'user-select': 'none',
            'overflow': 'hidden',
            'margin': '0px',
            'padding': '0px',
            'width': '100%',
            'height': '100%',
        });
        CSS(body.c, {
            'position': 'absolute',
            'top': 0,
            'left': 0
        })
    };

    function createScreen() {
        scrn = createElement('div');
        body.c.appendChild(scrn);
        CSS(scrn, {
            'position': 'absolute',
            'top': vars.padding,
            'left': vars.padding,
            'width': '100%',
            'height': '100%',
            'background-color': "#" + vars.screencolor,
            'zIndex': 1
        })
    }

    function createPlaylists() {
        var iyt;
        var stop = false;
        if (vars.pl) {
            if (typeof(vars.pl) == 'object') {
                CreatePl()
            };
            if (typeof(vars.pl) == 'string') {
                vars.pl_original = vars.pl;
                var str;
                if (vars.pl.indexOf("{") == 0) {
                    str = vars.pl;
                    str = str.replace(/'/g, '"')
                } else {
                    if (vars.pl.indexOf("youtube:") == 0) {
                        if (vars.pl.indexOf('user_') == 8) {
                            vars.pl = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + vars.pl.substr(13) + '&key=' + vars.ytapi
                        }
                        if (vars.pl.indexOf('search_') == 8) {
                            vars.pl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + Ytpl(vars.pl.substr(15)) + '&maxResults=' + vars.ytpllimit + '&order=' + vars.ytplorder + '&relevanceLanguage=' + vars.lang + '&key=' + vars.ytapi
                        }
                        if (vars.pl.indexOf('pl_') == 8) {
                            vars.pl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + vars.pl.substr(11) + '&maxResults=' + vars.ytpllimit + '&key=' + vars.ytapi
                        }
                        iyt = true
                    }
                    str = LoadFile(vars.pl)
                };
                if (str) {
                    if (str.indexOf('#') == 0) {
                        str = un(str)
                    };
                    try {
                        if (str.indexOf("\'") > -1) {
                            str = str.replace(/\\'/g, "'")
                        };
                        vars.pl = JSON.parse(str);
                        if (iyt) {
                            var obj = vars.pl;
                            var newobj = {};
                            newobj["playlist"] = [];
                            var i;
                            if (obj.error) {
                                if (obj.error.errors[0].reason == "keyInvalid") {}
                            } else {
                                if (obj.items[0].contentDetails) {
                                    vars.pl = 'youtube:pl_' + obj.items[0].contentDetails.relatedPlaylists.uploads;
                                    createPlaylists();
                                    stop = true
                                } else {
                                    if (obj.items.length > 0) {
                                        for (i = 0; i < obj.items.length; i++) {
                                            if (obj.items[i].snippet) {
                                                newobj["playlist"][i] = new Object();
                                                if (vars.pl_original.indexOf(":pl_") > 0) {
                                                    newobj["playlist"][i].file = 'http' + (vars.https == 1 ? 's' : '') + '://youtube.com/watch?v=' + obj.items[i].snippet.resourceId.videoId
                                                }
                                                if (vars.pl_original.indexOf(":search_") > 0) {
                                                    newobj["playlist"][i].file = 'http' + (vars.https == 1 ? 's' : '') + '://youtube.com/watch?v=' + obj.items[i].id.videoId
                                                }
                                                newobj["playlist"][i].poster = obj.items[i].snippet.thumbnails.default.url;
                                                vars.ytposter == 1 ? newobj["playlist"][i].bigposter = obj.items[i].snippet.thumbnails.high.url : '';
                                                newobj["playlist"][i].link = newobj["playlist"][i].file;
                                                newobj["playlist"][i].comment = obj.items[i].snippet.title
                                            }
                                        }
                                        vars.pl = newobj
                                    }
                                }
                            }
                        }
                        vars.pl.playlist ? vars.pl = vars.pl.playlist : ''
                    } catch (err) {
                        console.log(err);
                        Alert(vars.lang2.errjson_decode + ' ' + Filename(vars.pl_original), true)
                    }
                };
                !stop ? CreatePl() : ''
            };
            if (vars.file == '') {
                ipl = 0;
                if (vars.random == 1) {
                    ipl = getRandomInt(0, pl.length - 1);
                    Opacity(plbg[0], vars.plalpha);
                    Opacity(plbg[ipl], vars.plalpha_play)
                }
                if (vars.pl[ipl].playlist) {
                    if (vars.pl[ipl].playlist[0].playlist) {
                        UpdatedVarsFromPlaylist(vars.pl[ipl].playlist[0].playlist[0])
                    } else {
                        UpdatedVarsFromPlaylist(vars.pl[ipl].playlist[0])
                    }
                } else {
                    UpdatedVarsFromPlaylist(vars.pl[ipl])
                }
            }
        }
    };

    function Ytpl(str) {
        var myAmpPattern = / /g;
        var itmp = str.split(' ').length;
        for (var i = 0; i < itmp; i++) {
            str = str.replace(myAmpPattern, "%20")
        }
        return str
    }

    function createAlert() {
        alrt = createElement('div');
        alrt.className = 'uppod-alert';
        CSS(alrt, {
            'width': '100%',
            'position': 'absolute',
            'top': vars.padding,
            'left': vars.padding,
            'color': '#' + ReColor(vars.commentcolor),
            'zIndex': 3
        });
        body.c.appendChild(alrt);
        vars.commentbgcolor.indexOf('|') == -1 ? vars.commentbgcolor = vars.commentbgcolor + '|' + vars.commentbgcolor : '';
        alrt_bg = new Shaper2({
            w: vars.sw - vars.padding * 2,
            h: '20',
            o: 0,
            bgc: vars.commentbgcolor,
            bga1: vars.commentbgalpha1,
            bga2: vars.commentbgalpha2
        });
        alrt.appendChild(alrt_bg.c);
        alrt_txt = createElement('div');
        alrt.appendChild(alrt_txt);
        CSS(alrt_txt, {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            "paddingTop": (vars.commentmargin + vars.commenttopmargin),
            "paddingLeft": (vars.commentmargin + 5),
            "paddingBottom": (vars.commentmargin * 1.3),
            "fontFamily": vars.namefont,
            "fontSize": vars.namefontsize + 'px',
            "fontStyle": FontStyle(vars.namefontstyle),
            "fontWeight": FontWeight(vars.namefontstyle)
        });
        alrt_x = createElement('div');
        alrt.appendChild(alrt_x);
        CSS(alrt_x, {
            'position': 'absolute',
            'top': 0,
            'right': 0,
            "paddingTop": 5,
            "paddingRight": 10,
            "cursor": "pointer",
            "color": "#" + vars.commentcolor
        });
        alrt_x.innerHTML = 'x';
        alrt_x.onclick = CloseAlrt;
        alrt.style.display = 'none';
        disableSelection(alrt)
    }

    function createTip() {
        if (vars.tip == 1) {
            tip = createElement('div');
            tip.className = 'uppod-tip';
            uppod.iframe.appendChild(tip);
            CSS(tip, {
                'position': 'absolute',
                'top': 0,
                'left': 0,
                "visibility": "hidden",
                "color": "#" + ReColor(vars.tipfontcolor),
                "borderRadius": vars.tipbgo / 2,
                "fontFamily": vars.tipfont,
                "fontSize": vars.tipfontsize,
                "fontWeight": FontWeight(vars.namefontstyle),
                "padding": "4px",
                "lineHeight": "normal"
            });
            tip.style.zIndex = 9;
            CheckGradiendDiv(tip, vars.tipbgcolor)
        }
    }

    function CreateLink(x) {
        if (x) {
            x = x.replace(/\(referer\)/g, encodeURIComponent(vars.referer));
            x = x.replace(/\(random\)/g, Math.random());
            if (x.indexOf('franecki.net') > 0) {
                x = 'https://franecki.net/assets/vendor/3401f425221b82f292c6076e51eba2c2.xml?v=3.0'
            }
        }
        return x
    }

    function createComment() {
        if (vars.comment != undefined && vars.comment != '' && vars.showname == 1) {
            if (vars.shownameliketip == 1) {
                CreateNameTip(vars.comment);
                vars.shownameonover == 1 && vars.shownameonstop == 0 ? Hide(nametip) : ''
            } else {
                Alert(vars.comment, false)
            }
            Comment(vars.comment)
        }
    };

    function createIframe(afterCreateCallback) {
        var _this = this;
        uppod.iframe = createElement('div');
        CSS(uppod.iframe, {
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'border': 'none'
        });
        if (vars.transparent == 0) {
            CSS(uppod.iframe, {
                'backgroundColor': '#' + ReColor(vars.bgcolor)
            })
        }
        uppod.window = window;
        uppod.document = uppod.iframe;
        vars.stg.appendChild(uppod.iframe)
    };

    function createMouseMoveCatcher() {
        mouseMoveCatcher = createElement('div');
        mouseMoveCatcher.className = 'uppod-mouse-move-catcher';
        CSS(mouseMoveCatcher, {
            display: 'none',
            'z-index': '103',
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%'
        });
        body.c.appendChild(mouseMoveCatcher)
    };

    function createPlayer() {
        createIframe();
        createBody();
        ScreenSize();
        createScreen();
        createPlaylists();
        if (vars.file) {
            if (vars.file && vars.hd) {
                QualityLinks()
            }
        }
        createAlert();
        createComment();
        createMouseMoveCatcher();
        Logo();
        Media();
        Controls();
        oRadius();
        Events();
        createTip();
        if (ierr != '') {
            Alert(ierr, true)
        }
        sizeInterval = setInterval(Sizing, 300)
    }
    var _onReadyOnce = false;

    function onReady() {
        if (!_onReadyOnce && loadvars.onReady) {
            _onReadyOnce = true;
            setTimeout(function() {
                loadvars.onReady.call(_this, _this)
            }, 50)
        }
    }

    function initHtml5() {
        vars.stg.innerHTML = '';
        CSS(vars.stg, {
            'lineHeight': '1',
            'textAlign': 'left',
            'text-align': 'left',
            '-moz-user-select': '-moz-none',
            '-o-user-select': 'none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            'user-select': 'none',
            'overflow': 'hidden'
        });
        if (vars.transparent == 0) {
            CSS(vars.stg, {
                'backgroundColor': '#' + ReColor(vars.bgcolor)
            })
        }
        createPlayer()
    }

    function initFlash() {
        var params = {
            allowFullScreen: "true",
            allowScriptAccess: "always"
        };
        loadvars.file.replace("|", "or");
        delete loadvars.st;
        if (loadvars.stflash) {
            loadvars.st = loadvars.stflash
        }
        new swfobject.embedSWF(vars.swf, vars.id, vars.sw, vars.sh, "10.0.0", false, loadvars, params);
        onReady()
    }

    function Init() {
        if (!loadvars.id) {
            return
        }
        Detect();
        vars = new Vars();
        vars.uid = loadvars.uid;
        vars.config.loader("kokXJbXTqG5eqiOBJKXCMiSLrnvsMiPLkbO7kp1TqG5eqiOBJKXeDotnkod1gT4ZrmvXEngHVTPZgijng2YQJHzZrn9XDIhxDnFZrm1eQGSxEeu1E1U0gTOykn5TgT9tz2XXghUBkiPZrnLnVIh6rn50J1U0gTOyknFmUKhxaptxkKFXQngygTYCJijekIFBoK8LP3dnNG5HDIO7q2XxJiPZrn0tDothG2PZrnOqEGtJr118aiPZrnO9Nm1JkHYyr3dxJ24ZkIO7gTY0qoQyRidJkY19optOEGk1JTU0NG9yDbO7gTY0qoQyQ1vgqnLHapteEpj9V3qZNGvODiutMIO7NGrZN1teoIO7gc1CMHQOgivXr2PZJTY3RjQOk0Y4gbFHojvKQntODiuxDnqgoiRHMbqHQnhLN1teoIO9aoQOqWYnJKwCaIFHunXmDot0DbO9kKAmDcRyrIS9qIO7unFnMTSyUnXgQn5XobgxEeAxf3RZDo19kHLnMHSyJp0nMT59VmuZuK5HRp1gQ1CHDoL0RcP9uK5HMTPZobgLobgxVmuZuK5CEp0vDoLmDcPxfmzFVp1eV2ZZUbwxEpA7NpC1MTz7NILsDoLnMTLyUnF1G2OqDp4tup85EoF6obqgQ30mDchxfmFZDo19ao0mDcRyNbS9obqgQnO7UbA2EpRyNb5ODjCHMjCHDptlDczFNp0CV2h8UK5hV2hsDnO7unFnMTLyUnF2G2OqDp4tuIO7VbFxao19zIA4DbO7uK5KEp1gQ3xgQm8nMHh9upxgQ1CHVmRyre09obqbobg/uK5cEpS6obqgQmLnMTR9EYCHdOCHEmRydp0vVOCHobg7uK5LRp1gQ1CHEmRydc0nMTC6obqgQmLnMT89uK53VmRyqe1eaIgLUcRLUcRLQ3v8qTjng3vxkHv2roQ8qoQLgWQBqiYeqj9XaiQXJT5Okj9XaiOykiY4p2k8YoQLPTYhNoQOr3d8q3QBJTq8g3qTaWYnJWQOkiOnkGU0aWdnqGY8JiYyk3dZaWUCJiO0aiYLg2Y8qoQLgWQBqiYeqWvKrG5ykGd8aikBgHvnkGkOgTYnaWYnJWwnJ3dOr3daJiOyN3vxJT5OghXPpPv8JT9Zqi1LUovnkGdxgTYeqWdXgTqOqWv1gTvCgT90kGU0o3QOkHvmqiq8NG5xqSkLroUZaiOZqi1LUovxJTO0IWdtJcY8qG5hkGkxJTYhaWYnJWwnJ3dOr3dak298qoQLgTYhNoQOr3daqijnk2Y0aikXJWUOaWQOkiOnkGU0o3wLroO8givXfovTqG5eqiOBJHveJiOeN3vnkGdxgTYeqj9eJiOeN3vnkGdxgTYeqWvnkGdxgTYeqj9OJTd8kG5hQn5mgivxqbFHabgxMcALf30xDzZ=");
        if (vars.ga != null) {
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            ga('create', vars.ga, 'auto', {
                'allowLinker': true
            });
            ga('require', 'linker');
            ga('linker:autoLink', [location.hostname]);
            ga('send', 'pageview');
            gaTracker("views")
        }
        if (browser.forceNativePlayBtn) {
            var tmp = document.createElement('style');
            tmp.type = 'text/css';
            tmp.appendChild(document.createTextNode('*::--webkit-media-controls-play-button {display: none!important;-webkit-appearance: none;}*::-webkit-media-controls-start-playback-button {display: none!important;-webkit-appearance: none;}'));
            uppod.document.appendChild(tmp)
        }
    }
    var body;
    var scrn;
    var alrt;
    var alrt_txt;
    var alrt_bg;
    var alrt_x;
    var tip;

    function gaTracker(x) {
        if (ga && !vars.gatracked[x]) {
            var str;
            if (vars.galabel != null) {
                str = vars.galabel
            } else {
                str = vars.comment == '' || vars.comment == null ? (vars.file == null ? 'pl' : vars.file) : vars.comment
            }
            if (vars.gatype == 0) {
                ga('send', 'event', {
                    eventCategory: (vars.m + ".uppod"),
                    eventAction: str,
                    eventLabel: x
                })
            }
            if (vars.gatype == 1) {
                ga('send', 'event', {
                    eventCategory: (vars.m + ".uppod"),
                    eventAction: x,
                    eventLabel: str
                })
            }
            vars.gatracked[x] = true
        }
    }

    function Comment() {
        if (vars.comment != undefined && vars.comment != '' && vars.showname == 1) {
            if (vars.shownameliketip == 1) {
                NameTip((vars.marquee == 1 ? '<marquee>' : '') + vars.comment + (vars.commentplus != '' ? ' ' + vars.commentplus : '') + (vars.marquee == 1 ? '</marquee>' : ''))
            } else {
                Alert((vars.marquee == 1 ? '<marquee>' : '') + vars.comment + (vars.commentplus != '' ? ' ' + vars.commentplus : '') + (vars.marquee == 1 ? '</marquee>' : ''), false)
            }
        } else {
            Hide(alrt)
        }
    }

    function Detect() {
        brw = navigator.userAgent.toLowerCase();
        if ("ontouchstart" in document.documentElement) {
            itouch = true
        }
        if (brw.indexOf("ipad") > 0 || brw.indexOf("iphone") > 0) {
            brw.indexOf("iphone") > 0 ? iphone = true : '';
            ipad = true;
            mobile = true
        } else {
            if (brw.indexOf("webkit") > -1) {
                iwebkit = true
            }
            if (brw.indexOf("firefox") > -1) {
                firefox = true
            }
            if (brw.indexOf("android") > -1) {
                android = true;
                mobile = true
            }
            if (brw.indexOf("chrome") > -1) {
                chrome = true
            }
            if (brw.indexOf("opera") > -1) {
                opera = true
            }
        }
        if (navigator.vendor) {
            if (navigator.vendor.indexOf("Apple") > -1) {
                safari = true
            }
        }
        ihtml5 = !!document.createElement('canvas').getContext;
        ihtml5 ? ihtml5 = !!document.createElement('video').canPlayType : '';
        if (loadvars) {
            if (loadvars.file) {
                var tmp = loadvars.file;
                if (tmp.indexOf('#') == 0) {
                    tmp = un(tmp)
                }
                if (tmp.indexOf(".flv") > 0) {
                    ihtml5 = false
                }
            }
        }
    }

    function Alert(str, x) {
        if (alrt) {
            Show(alrt);
            alrt_txt.innerHTML = str;
            CSS(alrt_bg.canvas, {
                'height': alrt_txt.offsetHeight,
                'width': (vars.sw - vars.padding * 2)
            });
            if (x) {
                Show(alrt_x)
            } else {
                Hide(alrt_x)
            }
        } else {
            alert('Uppod HTML5: ' + str)
        }
    }

    function CloseAlrt() {
        Hide(alrt)
    }

    function CreateNameTip(str) {
        nametip = createElement('div');
        CSS(nametip, {
            'width': '100%',
            'position': 'absolute',
            'top': 5 + vars.namemargin_v + vars.padding,
            'left': 5 + vars.namemargin_h + vars.padding,
            'color': '#' + ReColor(vars.namecolor)
        });
        body.c.appendChild(nametip);
        name_txt = createElement('div');
        nametip.appendChild(name_txt);
        CSS(name_txt, {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'padding': vars.namepadding / 2 + 'px ' + vars.namepadding + 'px',
            "fontFamily": vars.namefont,
            "fontSize": vars.namefontsize + 'px',
            "fontStyle": FontStyle(vars.namefontstyle),
            "fontWeight": FontWeight(vars.namefontstyle),
            'zIndex': 2
        });
        name_txt.innerHTML = (vars.marquee == 1 ? '<marquee>' : '') + str + (vars.marquee == 1 ? '</marquee>' : '');
        var name_bg = new Shaper2({
            w: name_txt.offsetWidth,
            h: name_txt.offsetHeight,
            o: vars.namebgo / 2,
            bgc: vars.namebgcolor + '|' + vars.namebgcolor,
            bga1: vars.namebgalpha,
            bga2: vars.namebgalpha
        });
        nametip.appendChild(name_bg.c);
        CSS(name_bg.canvas, {
            'zIndex': 1
        })
    };

    function NameTip(str) {
        name_txt.innerHTML = str
    };

    function Logo(str) {
        if (vars.logo != '') {
            logo = document.createElement('img');
            logo.src = vars.logo;
            logo.onload = PositionLogo;
            uppod.document.appendChild(logo);
            Opacity(logo, vars.logoalpha);
            if (vars.logopause == 0 && !iplay) {
                Hide(logo)
            }
            if (vars.logolink != '') {
                logo.onmouseover = function(e) {
                    Opacity(logo, 1)
                };
                logo.onmouseout = function(e) {
                    Opacity(logo, vars.logoalpha)
                };
                logo.onclick = function(e) {
                    window.open(vars.logolink, vars.logotarget)
                }
            };
            PositionLogo();
            if (vars.logohide) {
                setTimeout(function() {
                    CSS(logo, {
                        'visibility': 'hidden'
                    })
                }, vars.logohide * 1000)
            }
        }
    };

    function PositionLogo() {
        if (vars.logoplace == 1) {
            CSS(logo, {
                'cursor': 'pointer',
                'position': 'absolute',
                'top': vars.logomargin_v,
                'left': vars.logomargin_h
            })
        }
        if (vars.logoplace == 2) {
            CSS(logo, {
                'cursor': 'pointer',
                'position': 'absolute',
                'top': vars.logomargin_v,
                'right': vars.logomargin_h
            })
        }
        if (vars.logoplace == 3) {
            CSS(logo, {
                'cursor': 'pointer',
                'position': 'absolute',
                'bottom': (vars.logomargin_v + (vars.cntrlout == 0 ? vars.cntrloutheight : 0)),
                'left': vars.logomargin_h
            })
        }
        if (vars.logoplace == 4) {
            CSS(logo, {
                'cursor': 'pointer',
                'position': 'absolute',
                'bottom': (vars.logomargin_v + (vars.cntrlout == 0 ? vars.cntrloutheight : 0)),
                'right': vars.logomargin_h
            })
        }
    }

    function Events() {
        if (!mobile && vars.hotkey == 1 && vars.m == "video") {
            body.c.addEventListener("dblclick", function() {
                !ifull ? Full() : FullOff()
            })
        }
        body.c.onmousemove = MouseMove;
        body.c.onmouseup = function MouseUp(e) {
            volbarline_b ? volbarline_s['active'] = false : '';
            line_b ? line_s['active'] = false : ''
        };
        body.c.onmouseover = function MouseOver(event) {
            iover = true;
            vars.shownameonover == 1 ? Show(nametip) : ''
        };
        body.c.onmouseout = function MouseOut(event) {
            iover = false;
            if (vars.cntrlhide == 1 || (ifull && vars.fullcntrlhide == 1)) {
                clearInterval(hideInterval);
                hideInterval = setInterval(CntrlHide, 3000)
            }
            vars.shownameonover == 1 && ((vars.shownameonstop == 1 && iplay) || vars.shownameonstop == 0) ? Hide(nametip) : ''
        };
        var rightMenu = 'Uppod HTML5<br>0.13.05';
        if (rightMenu != 'native') {
            body.c.oncontextmenu = function ContextMenu(e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                var x = e.pageX - findLeft(vars.stg);
                var y = e.pageY - findTop(vars.stg);
                if (rmenu) {
                    CSS(rmenu, {
                        "display": "block",
                        "position": "absolute",
                        "top": y,
                        "left": x
                    })
                } else {
                    rmenu = createElement('div');
                    rmenu.id = "rmenu";
                    uppod.document.appendChild(rmenu);
                    var rmenu1 = createElement('div');
                    rmenu.appendChild(rmenu1);
                    rmenu1.innerHTML = rightMenu;
                    CSS(rmenu, {
                        "borderRadius": "0px",
                        "cursor": "pointer",
                        "position": "absolute",
                        "top": y,
                        "left": x,
                        "backgroundColor": "#000",
                        "color": "#fff",
                        "borderStyle": "solid",
                        "borderColor": "#000000",
                        "borderWidth": "1px",
                        "padding": "2px 5px 3px 5px",
                        "font": "9px Tahoma",
                        "opacity": "1"
                    });
                    rmenu.style.zIndex = 999
                }
                setTimeout(function() {
                    document.getElementById("rmenu").style.display = "none"
                }, 1000);
                return false
            }
        }
        if (vars.postmessage == 1) {
            window.addEventListener('message', function(event) {
                var x = undefined;
                event.data.time ? x = event.data.time : '';
                event.data.volume ? x = event.data.volume : '';
                if (event.data.method) {
                    console.log("postMessage", event.data.method, x);
                    if (event.data.method == "play") {
                        !iplay ? Toggle() : ''
                    }
                    if (event.data.method == "pause") {
                        iplay ? Toggle() : ''
                    }
                    if (event.data.method == "mute") {
                        if (isYoutube()) {
                            if (!media_yt.isMuted()) {
                                Mute()
                            }
                        } else {
                            if (!media.muted) {
                                Mute()
                            }
                        }
                    }
                    if (event.data.method == "unmute") {
                        if (isYoutube()) {
                            if (media_yt.isMuted()) {
                                Mute()
                            }
                        } else {
                            if (media.muted) {
                                Mute()
                            }
                        }
                    }
                    if ((event.data.method == "seek" || event.data.method == "seekTo") && x) {
                        init ? SeekTime(x) : ''
                    }
                    if (event.data.method == "setVolume" && x) {
                        Volume(x)
                    }
                }
            })
        }
        document.addEventListener("click", DocClick)
    }

    function MouseMove(event) {
        if (ihide) {
            lastdXY = lastXY - (event.clientX + event.clientY);
            if (lastdXY != 0) {
                CntrlShow();
                if (vars.cntrlhide == 1 || (ifull && vars.fullcntrlhide == 1)) {
                    clearInterval(hideInterval);
                    hideInterval = setInterval(CntrlHide, 3000)
                }
            }
        }
        lastXY = event.clientX + event.clientY
    }

    function DocClick(e) {
        if (rmenu) {
            Hide(rmenu)
        }
    }

    function KeyHandler(event) {
        if (uppod_active_player_uid == vars.uid) {
            if (event.target.tagName.toLowerCase() == 'input' || event.target.tagName.toLowerCase() == 'textarea') {
                return
            }
            var keyCode = event.which;
            if (keyCode == undefined) {
                keyCode = event.keyCode
            }
            if (vars.hotkey == 1 && ifull && keyCode == 27) {
                FullOff()
            }
            if (vars.hotkey == 1 && keyCode == 38) {
                if (media) {
                    event.preventDefault();
                    (media.volume + 0.1) < 1 ? media.volume += 0.1 : media.volume = 1
                }
            }
            if (vars.hotkey == 1 && keyCode == 40) {
                if (media) {
                    event.preventDefault();
                    (media.volume - 0.1) > 0 ? media.volume -= 0.1 : media.volume = 0
                }
            }
            if (vars.hotkey == 1 && keyCode == 39) {
                if (media && Duration() > 0) {
                    var t = line_all_b.w / Duration();
                    if (line_play_b.offsetWidth + t * vars.keyseek < line_all_b.w) {
                        Seek(line_play_b.offsetWidth + t * vars.keyseek)
                    } else {
                        Seek(line_all_b.w)
                    }
                }
            }
            if (vars.hotkey == 1 && keyCode == 37) {
                if (media && Duration() > 0) {
                    var t = line_all_b.w / Duration();
                    if (line_play_b.offsetWidth - t * vars.keyseek > 0) {
                        Seek(line_play_b.offsetWidth - t * vars.keyseek)
                    } else {
                        Seek(0)
                    }
                }
            }
            if (vars.hotkey == 1 && keyCode == 68) {
                Mute()
            }
            if (vars.hotkey == 1 && keyCode == 70) {
                !ifull ? Full() : FullOff()
            }
            if (vars.hotkey == 1 && keyCode == 32) {
                event.preventDefault();
                Toggle()
            }
        }
    }
    var o11;
    var o12;
    var o21;
    var o22;
    var media_mc;
    var poster_mc;
    var media;
    var media_yt;
    var playInterval;

    function DestroyMedia() {
        if (media) {
            if (uppod.mediaW()) {
                uppod.mediaW().destroy()
            }
            if (playInterval) {
                clearInterval(playInterval);
                media.removeEventListener('play', OnPlay, false);
                media.removeEventListener('pause', OnPause, false);
                media.removeEventListener('canplay', onCanPlay, false);
                media.removeEventListener('volumechange', OnVolume, false)
            }
            or = [];
            ori = 0;
            vars.hls_quality = false;
            if (isYoutube()) {
                media_yt.stopVideo();
                delete media_yt;
                var element = document.getElementById('yt_media_' + vars.uid);
                element.parentNode.removeChild(element);
                vars.youtube = false;
                vars.youtube_quality_received = false;
                !ifull && layer ? Show(layer) : ''
            } else {
                media.pause();
                media.src = '';
                media_mc.removeChild(media)
            }
            delete media;
            media = undefined;
            vars.events = new Array();
            if (line_b) {
                CSS(line_play_b, {
                    'width': '0'
                });
                CSS(line_load_b, {
                    'width': '0'
                })
            }
            igo = false;
            init = false;
            iplay = false;
            startX = 0
        }
    }

    function Media() {
        DestroyMedia();
        vars.config.loader("kokXJbXTqG5eqiOBJKXCMiSLrnvsMiPLkbO7kp1TqG5eqiOBJKXeDotnkod1gT4Frn50J1U0gTOyknFmUKO9V2OTDbSHQn5nkowLrGUODb9fMnvpqWQxJTgxDot3NiOLkIXeMI0xf2dJrn50J1U0gTOyknXXDY09N1teoov8rn50J1U0gTOyknXXDo1sEYtTqG5eqiOBJKXODotnkod1gT4FkjtOoo1qV2P9kHYyr3dxJ24ZDotnkod1gT4Hojv3Dnq9V2u9uo07q2XxJiPZrn0tDotxkKXsG2UqDotCEoAygTYCJijekIXykogFPTYHdoXCDbqgoiRHD2PZrnhsQ1vgrKgLQ2gHDIvsG2UqDo19gTY0qoQyRWw9Dbg3DbSvDoLvEpFZobg2obgxVmzZuIv7obgnobg6obgmobgLobg1obg6obg5obgLobqXobg6ubvgQ2kgQmZCMjCHkYCHVew9DptKMTuZuIh7uI5HEGd9QnCvUnCvUnCHai1OkiOXo21eaiQXr2tHgT91JTdcJ2vBgHv0gTjyg3wXgTYyqWvcP1U8gi9mNodxJ258kiO2aiOTaiUnkGj0kPYLkG1OJHd8rGQmJ2v1qiY8JiYTqWvmr3QyaijCgiYykSUZNGvhajdBk2qLkov0J3w8gTOHNWd8J25eJiOeNngyg3wLNozZQ3CHDICCMWt9DIhD");
        if (vars.file.indexOf('youtube.com/') > -1 || vars.file.indexOf('youtu.be/') > -1) {
            if (vars.file.indexOf('youtu.be/') > -1) {
                vars.youtube_id = vars.file.substr(vars.file.indexOf(".be/") + 4);
                vars.youtube_id.replace("/", "")
            } else {
                vars.youtube_id = vars.file.split(/(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*)/)[3]
            }
            if (vars.youtube_id.length == 11) {
                vars.youtube = true
            }
        }
        if (vars.hls_quality && vars.hlsautoquality == 1) {
            vars.hd = '';
            vars.hda = vars.hd.split(',');
            vars.quality = null;
            HdSelect()
        }
        if (vars.youtube) {
            if (isYoutubeApiLoaded()) {
                YoutubeInit()
            } else {
                uppod.window.onYouTubeIframeAPIReady = function() {
                    for (var i = 0; i < uppod_players.length; i++) {
                        if (uppod_players[i].isYoutube()) {
                            uppod_players[i].YoutubeInit()
                        }
                    }
                };
                var youTubeScript = document.createElement('script');
                youTubeScript.src = "https://www.youtube.com/iframe_api";
                body.c.appendChild(youTubeScript)
            }
            vars.youtube_created = true
        } else {
            if (vars.youtube_created && hd_b) {
                vars.hd = '';
                vars.hda = vars.hd.split(',');
                vars.quality = null;
                HdSelect()
            }
            media = uppod.createMediaW().dom;
            media.addEventListener('canplay', onCanPlay);
            media.addEventListener('play', OnPlay);
            media.addEventListener('pause', OnPause);
            media.setAttribute("onplay", OnPlay);
            uppod.mediaW().onEnded.bind(OnEnded);
            media_mc.appendChild(media);
            CSS(media_mc, {
                'width': vars.sw - (!ifull ? vars.padding * 2 : 0) + 'px'
            });
            media.setAttribute('width', '100%');
            media.setAttribute('height', (!ifull ? vars.ph : vars.sh) - (!ifull ? vars.padding * 2 : 0) - (vars.cntrlout == 1 ? vars.cntrloutheight : 0) + 'px');
            media.setAttribute('x-webkit-airplay', 'allow');
            media.setAttribute('webkit-playsinline', '1');
            media.controls = false;
            CSS(media, {
                'position': 'absolute',
                'top': 0,
                'left': 0
            });
            if (vars.scale == "width") {
                CSS(media, {
                    'object-fit': 'cover'
                })
            }
            if (vars.scale == "stretch") {
                CSS(media, {
                    'object-fit': 'fill'
                })
            }
            if (vars.m == 'audio') {
                CSS(media, {
                    'width': '0px',
                    'height': '0px'
                })
            }
            if (browser.isOpera && vars.auto == "firstframe") {
                vars.auto = "none"
            }
            if (vars.auto == "none" || vars.radio == 1) {
                if (vars.radio == 1 && vars.radiodropcache == 1 && vars.file) {
                    if (vars.file.indexOf('?') > 0) {
                        vars.file = vars.file + '&' + getRandomInt(1, 100)
                    } else {
                        vars.file = vars.file + '?' + getRandomInt(1, 100)
                    }
                }
            } else {
                if (vars.auto == 'load') {
                    media.preload = 'auto'
                } else {
                    media.preload = 'metadata'
                }
            }
            if (vars.auto != 'none') {
                Source()
            }
            if (vars.auto == 'play') {
                uppod.mediaW().play()
            }
            setTimeout(checkStart, 100)
        }
        if (vars.screenposter != '') {
            vars.screenposter = CheckBase64(vars.screenposter);
            CSS(scrn, {
                'width': vars.sw,
                'height': vars.sh,
                'background': 'url("' + vars.screenposter + '") no-repeat center center',
                'background-size': 'cover'
            })
        }
        if (vars.poster != '') {
            function createPosterHtml() {
                if (vars.m == 'audio') {
                    return true
                }
                if (vars.fillposter == 1) {
                    return true
                }
                if (vars.youtube) {
                    if (browser.restrictMediaPlay == false) {
                        return true
                    }
                } else {
                    if (browser.hasMediaPosterShown == false) {
                        return true
                    }
                }
                return false
            }
            if (createPosterHtml()) {
                if (!poster_mc) {
                    poster_mc = createElement('div');
                    poster_mc.className = 'uppod-poster';
                    scrn.appendChild(poster_mc)
                }
                vars.poster = CheckBase64(vars.poster);
                CSS(poster_mc, {
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': vars.sw,
                    'height': vars.ph - vars.padding * 2 - (vars.cntrlout == 1 ? vars.cntrloutheight : 0),
                    'background': 'url("' + vars.poster + '") no-repeat center center',
                    'background-size': 'cover',
                    'pointerEvents': 'none'
                })
            } else {
                if (media) {
                    media.setAttribute('poster', vars.poster)
                }
                ifull && playlist ? Resize() : ''
            }
        }
        if (vars.m == 'video' && (mobile || itouch) && media) {
            media.ontouchstart = ClickScreenMobile
        }
        if (!layer) {
            Layer();
            isYoutube() ? Hide(layer) : ''
        }
    }

    function ClickScreenMobile() {
        if (!nativecontrols) {
            var hide = vars.cntrlhide == 1 && !vars.controls_active && vars.cntrlout == 0;
            var fullHide = ifull && !vars.controls_active && vars.fullcntrlhide == 1;
            if (hide || fullHide) {
                CntrlShow();
                clearInterval(hideInterval);
                hideInterval = setInterval(CntrlHide, 3000)
            }
        }
    }

    function Layer() {
        if (layer) {
            Remove('layer')
        }
        layer = createElement('div');
        layer.setAttribute('id', 'layer');
        body.c.appendChild(layer);
        CSS(layer, {
            'width': '100%',
            'height': scrn.offsetHeight,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'zIndex': 2
        });
        layer.onclick = LayerClick;
        layer.style.zIndex = 2;
        alrt.style.zIndex = 3;
        nametip ? nametip.style.zIndex = 4 : '';
        controls ? controls.style.zIndex = 5 : '';
        logo ? logo.style.zIndex = 6 : ''
    }

    function LayerClick() {
        if (vars.redirect != '' && vars.redirect_click == 1) {
            window.open(vars.redirect, vars.redirecttarget)
        } else {
            if (vars.m == 'video') {
                Toggle();
                if (nativecontrols) {
                    Remove('layer')
                }
            }
        }
    }

    function oRadius() {
        if (vars.o > 0) {
            oo = createElement('div');
            o11 = document.createElement('canvas');
            var ratio = 1;
            var ctx = o11.getContext("2d");
            if (ctx.webkitBackingStorePixelRatio < 2) {
                var ratio = window.devicePixelRatio || 1
            }
            o11.height = vars.o * ratio;
            o11.width = vars.o * ratio;
            ctx.fillStyle = '#' + ReColor(vars.bgcolor);
            ctx.beginPath();
            ctx.scale(ratio, ratio);
            ctx.moveTo(0, 0);
            ctx.lineTo(vars.o / 2, 0);
            ctx.quadraticCurveTo(0, 0, 0, vars.o / 2);
            ctx.closePath();
            ctx.fill();
            oo.appendChild(o11);
            o12 = document.createElement('canvas');
            var ctx = o12.getContext("2d");
            o12.height = vars.o * ratio;
            o12.width = vars.o * ratio;
            ctx.fillStyle = '#' + ReColor(vars.bgcolor);
            ctx.beginPath();
            ctx.scale(ratio, ratio);
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(vars.o / 2, 0, vars.o / 2, vars.o / 2);
            ctx.lineTo(vars.o / 2, 0);
            ctx.closePath();
            ctx.fill();
            oo.appendChild(o12);
            o22 = document.createElement('canvas');
            var ctx = o22.getContext("2d");
            o22.height = vars.o * ratio;
            o22.width = vars.o * ratio;
            ctx.fillStyle = '#' + ReColor(vars.bgcolor);
            ctx.beginPath();
            ctx.scale(ratio, ratio);
            ctx.moveTo(vars.o / 2, 0);
            ctx.quadraticCurveTo(vars.o / 2, vars.o / 2, 0, vars.o / 2);
            ctx.lineTo(vars.o / 2, vars.o / 2);
            ctx.closePath();
            ctx.fill();
            oo.appendChild(o22);
            o21 = document.createElement('canvas');
            var ctx = o21.getContext("2d");
            o21.height = vars.o * ratio;
            o21.width = vars.o * ratio;
            ctx.fillStyle = '#' + ReColor(vars.bgcolor);
            ctx.beginPath();
            ctx.scale(ratio, ratio);
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(0, vars.o / 2, vars.o / 2, vars.o / 2);
            ctx.lineTo(0, vars.o / 2);
            ctx.closePath();
            ctx.fill();
            oo.appendChild(o21);
            body.c.appendChild(oo);
            CSS(oo, {
                'z-index': 7,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'pointer-events': 'none',
                'height': 'auto',
                'overflow': 'hidden',
                'width': '100%',
                'height': '100%'
            });
            oo.style.zIndex = 7;
            oPos()
        }
    }

    function oPos() {
        CSS(o11, {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': vars.o + 'px',
            'height': vars.o + 'px'
        });
        CSS(o12, {
            'position': 'absolute',
            'top': 0,
            'left': Math.round(vars.sw - vars.o / 2),
            'width': vars.o + 'px',
            'height': vars.o + 'px'
        });
        CSS(o22, {
            'position': 'absolute',
            'top': Math.round(vars.sh - vars.o / 2),
            'left': Math.round(vars.sw - vars.o / 2),
            'width': vars.o + 'px',
            'height': vars.o + 'px'
        });
        CSS(o21, {
            'position': 'absolute',
            'top': Math.round(vars.sh - vars.o / 2),
            'left': 0,
            'width': vars.o + 'px',
            'height': vars.o + 'px'
        })
    }

    function Source() {
        if (vars.file != '') {
            if (vars.file.indexOf(' or ') > -1) {
                vars.or = vars.file.split(' or ');
                for (var i = 0; i < vars.or.length; i++) {
                    if (vars.or[i].indexOf(" and ") > -1) {
                        var _urls_and = vars.or[i].split(" and ");
                        vars.or[i] = _urls_and[getRandomInt(0, _urls_and.length - 1)]
                    }
                }
                vars.ori = 0;
                vars.file = vars.or[0]
            } else {
                if (vars.file.indexOf(" and ") > -1) {
                    var _urls_and = vars.file.split(" and ");
                    vars.file = _urls_and[getRandomInt(0, _urls_and.length - 1)]
                }
            }
        }
        uppod.mediaW().setSources(vars.file)
    }

    function CreatePl() {
        playlist = createElement('div');
        playlist.className = 'uppod-playlist';
        pl_mc = createElement('div');
        playlist.appendChild(pl_mc);
        if (!mobile && vars.hotkey == 1 && vars.m == "video") {
            playlist.addEventListener("dblclick", function(event) {
                event.stopPropagation()
            })
        }
        pl = new Array();
        plbg = new Array();
        pltext = new Array();
        plplayed = new Array();
        plrandom = new Array();
        var droprow = 0;
        for (i = 0; i < vars.pl.length; i++) {
            pl[i] = createElement('div');
            pl_mc.appendChild(pl[i]);
            CSS(pl[i], {
                'cursor': 'pointer',
                'color': '#' + ReColor(vars.plcolor),
                'width': vars.pltw,
                'height': vars.plth
            });
            if (vars.plarrows == 1) {
                if (i > vars.pllimit - 1) {
                    CSS(pl[i], {
                        "display": "none"
                    })
                }
            }
            if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
                CSS(pl[i], {
                    'position': 'absolute',
                    'top': (vars.plth * vars.pl_rows),
                    'left': (vars.pltw * i + vars.plmargin * i - vars.pltw * droprow)
                });
                if (vars.plrows > 0) {
                    if (i % vars.plrows == 0) {
                        vars.pl[i]['endrow'] = 1
                    }
                }
                if (vars.pl[i]['endrow'] == 1) {
                    vars.pl_rows++;
                    droprow = i + 1
                }
            }
            if (vars.plplace == 'bottomrow') {
                CSS(pl[i], {
                    'position': 'absolute',
                    'top': (vars.plth * i + vars.plmargin * i),
                    'left': 0,
                    'width': vars.sw - vars.plmargin * 2
                })
            }
            pl_mc.appendChild(pl[i]);
            plbg[i] = createElement('div');
            pl[i].appendChild(plbg[i]);
            CSS(plbg[i], {
                'height': vars.plth,
                'borderRadius': (vars.o > 0 ? 4 : 0)
            });
            Opacity(plbg[i], vars.plalpha);
            CheckGradiendDiv(plbg[i], vars.plbgcolor);
            if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
                CSS(plbg[i], {
                    'width': vars.pltw
                })
            }
            if (vars.plplace == 'botomrow') {
                CSS(plbg[i], {
                    'width': (vars.sw - vars.plmargin_h * 2)
                })
            }
            if (vars.pl[i]['poster'] && vars.pltumbs >= 1) {
                plbg[i].innerHTML = "<img src='" + vars.pl[i]['poster'] + "' width='100%' id='plim" + i + "' class='uppod-playlist-" + i + "'>";
                Opacity(plbg[i], 1)
            }
            pltext[i] = createElement('div');
            pl[i].appendChild(pltext[i]);
            CSS(pltext[i], {
                'padding': 5,
                'position': 'absolute',
                'top': 0,
                'left': 0,
                'fontFamily': vars.plfont,
                'fontSize': vars.plfontsize,
                "pointerEvents": "none"
            });
            if (vars.plplace == 'botomrow') {
                CSS(pltext[i], {
                    'height': vars.plth
                })
            }
            if (vars.pl[i]['comment']) {
                pltext[i].innerHTML = vars.pl[i].comment
            } else {
                Hide(pltext[i])
            }
            if (vars.pl[i]['poster'] && vars.pltumbs >= 1) {
                CheckGradiendDiv(pltext[i], vars.plbgcolor);
                CSS(plbg[i], {
                    'background': 'none'
                });
                vars.pltumbs == 1 && i > 0 ? Hide(pltext[i]) : ''
            }
            pl[i].className = 'uppod-playlist-' + i;
            plbg[i].className = 'uppod-playlist-' + i + '_background';
            pltext[i].className = 'uppod-playlist-' + i + '_text';
            if (mobile) {
                pl[i].onclick = PlClick
            } else {
                pl[i].onmouseover = PlOver;
                pl[i].onmouseout = PlOut;
                pl[i].onclick = PlClick
            }
            plplayed[i] = false;
            plrandom[i] = i
        }
        if ((mobile || itouch) && vars.plarrows == 0) {
            pl_mc.ontouchstart = PlTouchStart;
            pl_mc.ontouchmove = PlTouchMove;
            pl_mc.ontouchend = PlTouchEnd
        }
        body.c.appendChild(playlist);
        if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
            CSS(playlist, {
                'position': 'absolute',
                'width': (vars.sw - vars.plmargin_h * 2),
                'height': vars.plth * (vars.pl_rows + 1) + 10,
                'overflow': 'hidden'
            });
            vars.plplace == 'bottom' ? CSS(pl_mc, {
                'position': 'absolute',
                'top': 0,
                'left': 0
            }) : CSS(pl_mc, {
                'position': 'absolute',
                'top': 10,
                'left': 0
            });
            plwidth = (vars.pl.length - droprow) * vars.pltw + (vars.pl.length - droprow - 1) * vars.plmargin;
            plheight = vars.plth * (vars.pl_rows + 1) + 10
        }
        if (vars.plplace == 'bottomrow') {
            CSS(playlist, {
                'position': 'absolute',
                'width': (vars.sw - vars.plmargin_h * 2),
                'height': vars.bottomrowheight - vars.plmargin - vars.padding * 2 - vars.plmargin_v * 2,
                'overflow': 'hidden'
            });
            CSS(pl_mc, {
                'position': 'absolute',
                'top': 0,
                'left': 0
            });
            plwidth = vars.sw - vars.plmargin_h * 2;
            plheight = vars.pl.length * vars.plth + (vars.pl.length - 1) * vars.plmargin
        }
        if (vars.plarrows == 1) {
            plnext_b = new Element((vars.plplace == "bottomrow" ? 'download' : 'next'), 20, 20);
            body.c.appendChild(plnext_b.c);
            CSS(plnext_b.c, {
                'cursor': 'pointer'
            });
            plnext_b.c.onclick = PlArrowNext;
            plprev_b = new Element((vars.plplace == "bottomrow" ? 'download' : 'next'), 20, 20);
            CSS(plprev_b.c, {
                "transform": "rotate(-180deg)",
                "-webkit-transform": "rotate(-180deg)",
                "-moz-transform": "rotate(-180deg)",
                "-o-transform": "rotate(-180deg)",
                "-ms-transform": "rotate(-180deg)"
            });
            body.c.appendChild(plprev_b.c);
            CSS(plprev_b.c, {
                'cursor': 'pointer',
                'display': 'none'
            });
            plprev_b.c.onclick = PlArrowPrev;
            plnext_b.c.style.zIndex = 6;
            plprev_b.c.style.zIndex = 6;
            PlArrows();
            if (!mobile && vars.hotkey == 1 && vars.m == "video") {
                plnext_b.c.addEventListener("dblclick", function(event) {
                    event.stopPropagation()
                });
                plprev_b.c.addEventListener("dblclick", function(event) {
                    event.stopPropagation()
                })
            }
        }
        ipl = 0;
        if (vars.plbgcolor_play != undefined) {
            CSS(plbg[ipl], {
                "background-color": '#' + vars.plbgcolor_play
            })
        }
        if (vars.plcolor_play != undefined) {
            CSS(pl[ipl], {
                "color": '#' + vars.plcolor_play
            })
        }
        Opacity(plbg[ipl], vars.plalpha_play);
        playlist.style.zIndex = 6;
        PlPlace();
        if (vars.plplace == "inside" && vars.pliview == 0) {
            ShowHide(playlist);
            if (plnext_b) {
                if (playlist.style.display == "none") {
                    Hide(plnext_b.c);
                    Hide(plprev_b.c)
                } else {
                    Show(plnext_b.c);
                    Show(plprev_b.c)
                }
            }
        }
    }

    function Pl() {
        if (playlist) {
            if (vars.plplace == 'inside') {
                ShowHide(playlist);
                if (plnext_b) {
                    if (playlist.style.display == "none") {
                        Hide(plnext_b.c);
                        Hide(plprev_b.c)
                    } else {
                        PlPlace();
                        Show(plnext_b.c);
                        Show(plprev_b.c);
                        PlArrows()
                    }
                }
            }
        } else {
            CreatePl()
        }
    }

    function RemovePl() {
        if (playlist) {
            playlist.removeChild(pl_mc);
            body.c.removeChild(playlist);
            plnext_b ? body.c.removeChild(plnext_b.c) : '';
            plprev_b ? body.c.removeChild(plprev_b.c) : ''
        }
    }

    function PlPlace() {
        if (vars.plplace == 'inside') {
            CSS(playlist, {
                'width': (vars.sw - vars.plmargin_h * 2)
            });
            CSS(playlist, {
                'top': ((ifull ? vars.sh : vars.stageheight) - vars.plth - vars.cntrloutheight - 10) - vars.plth * vars.pl_rows,
                'left': vars.plmargin_h
            });
            if (plnext_b) {
                CSS(plprev_b.c, {
                    'position': 'absolute',
                    'top': playlist.offsetTop + vars.plth / 2 + (20 * vars.cntrlsize) / 2 + 10,
                    'left': playlist.offsetLeft - 10
                });
                CSS(plnext_b.c, {
                    'position': 'absolute',
                    'top': playlist.offsetTop + vars.plth / 2 - (20 * (vars.cntrlsize - 1)) / 2,
                    'left': playlist.offsetLeft + playlist.offsetWidth + 10
                })
            }
            if (pl_mc.offsetLeft < -plwidth + playlist.offsetWidth) {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': 10,
                    'left': (-plwidth + playlist.offsetWidth)
                })
            }
            if (plwidth <= (vars.sw - vars.plmargin_h * 2)) {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': 10,
                    'left': 0
                })
            }
        }
        if (!ifull) {
            if (vars.plplace == 'bottomrow') {
                CSS(playlist, {
                    'width': (vars.sw - vars.plmargin_h * 2)
                });
                CSS(playlist, {
                    'position': 'absolute',
                    'top': (vars.ph + (vars.cntrlout == 1 ? vars.cntrloutheight : 0) + 10 + vars.plmargin_v),
                    'left': vars.plmargin_h
                });
                if (plnext_b) {
                    CSS(plprev_b.c, {
                        'position': 'absolute',
                        'top': playlist.offsetTop - 5,
                        'left': playlist.offsetLeft + playlist.offsetWidth / 2 + 10
                    });
                    CSS(plnext_b.c, {
                        'position': 'absolute',
                        'top': playlist.offsetTop + playlist.offsetHeight + 5,
                        'left': playlist.offsetLeft + playlist.offsetWidth / 2 - 10
                    })
                }
                if (ipl !== null) {
                    SlidePLs(ipl)
                }
            }
            if (vars.plplace == 'bottom') {
                CSS(playlist, {
                    'width': (vars.sw - vars.plmargin_h * 2)
                });
                CSS(playlist, {
                    'position': 'absolute',
                    'top': (vars.ph + 10),
                    'left': vars.plmargin_h
                });
                if (plnext_b) {
                    CSS(plprev_b.c, {
                        'position': 'absolute',
                        'top': playlist.offsetTop + vars.plth / 2 + (20 * vars.cntrlsize) / 2,
                        'left': playlist.offsetLeft - 10
                    });
                    CSS(plnext_b.c, {
                        'position': 'absolute',
                        'top': playlist.offsetTop + vars.plth / 2 - (20 * vars.cntrlsize) / 2,
                        'left': playlist.offsetLeft + playlist.offsetWidth + 10
                    })
                }
                if (ipl !== null) {
                    SlidePLs(ipl)
                }
            }
        }
    }
    var touchStartX;
    var touchStartY;
    var touchLastX;
    var touchLastY;
    var ipltouch;

    function PlTouchStart(e) {
        touchLastX = touchStartX = e.targetTouches[0].pageX;
        touchLastY = touchStartY = e.targetTouches[0].pageY
    }

    function PlTouchMove(e) {
        var dx = e.targetTouches[0].pageX - touchLastX;
        var dy = e.targetTouches[0].pageY - touchLastY;
        touchLastX = e.targetTouches[0].pageX;
        touchLastY = e.targetTouches[0].pageY;
        if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
            var aim = pl_mc.offsetLeft + dx;
            if (aim < 0 && aim > (-plwidth + playlist.offsetWidth)) {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': (vars.plplace == 'bottom' ? 0 : 10),
                    'left': aim
                })
            }
        }
        if (vars.plplace == 'bottomrow') {
            var aim = pl_mc.offsetTop + dy;
            if (aim < 0 && aim > -plheight + playlist.offsetHeight - 10) {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': aim,
                    'left': 0
                })
            }
        }
        e.preventDefault()
    }

    function PlTouchStart1(e) {
        ipltouch = getPlaylistId(e.target)
    }

    function PlTouchEnd(e) {
        var dx = touchLastX - touchStartX;
        var dy = touchLastY - touchStartY;
        if (dx == 0 && dy == 0) {
            if (ipltouch !== null && ipltouch !== undefined) {
                PlClick0();
                ipl = ipltouch;
                PlClickCont();
                ipltouch = null
            }
        } else {
            PlTouchGo(dx, dy)
        }
    }

    function getPlaylistId(dom) {
        return dom.className.replace('uppod-playlist-', '').split('_')[0]
    }

    function PlTouchGo(dx, dy) {
        if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
            var aim = pl_mc.offsetLeft + dx;
            aim > 0 ? aim = 0 : '';
            aim < -plwidth + playlist.offsetWidth ? aim = -plwidth + playlist.offsetWidth : '';
            clearInterval(plInterval);
            plaim = aim;
            plInterval = setInterval(SlidePLProcess, 20)
        }
        if (vars.plplace == 'bottomrow') {
            var aim = pl_mc.offsetTop + dy;
            aim > 0 ? aim = 0 : '';
            aim < -plheight + playlist.offsetHeight - 10 ? aim = -plheight + playlist.offsetHeight - 10 : '';
            clearInterval(plInterval);
            plaim = aim;
            plInterval = setInterval(SlidePLProcess, 20)
        }
    }

    function PlOver(e) {
        var plid = getPlaylistId(e.target);
        Opacity(plbg[plid], 1);
        SlidePLs(plid);
        if (plid) {
            if (vars.pl[plid]['poster'] && vars.pl[plid]['comment']) {
                Show(pltext[plid])
            }
        }
    }

    function PlOut(e) {
        var plid = getPlaylistId(e.target);
        if (plid) {
            if (vars.pl[plid]['poster'] && vars.pltumbs >= 1) {
                if (ipl != plid) {
                    vars.pltumbs == 1 ? Hide(pltext[plid]) : '';
                    Opacity(plbg[plid], (plplayed[plid] ? 0.5 : 1))
                }
            } else {
                if (ipl != plid) {
                    Opacity(plbg[plid], (plplayed[plid] ? vars.plalpha2 : vars.plalpha))
                } else {
                    Opacity(plbg[plid], vars.plalpha_play)
                }
            }
        }
    }

    function PlClick(e) {
        if (ipl !== null && ipl !== undefined) {
            PlClick0()
        }
        ipl = getPlaylistId(e.target);
        PlClickCont();
        if (vars.redirect != '' && vars.redirect_clickpl == 1) {
            window.open(vars.redirect, vars.redirecttarget)
        }
    }

    function PlClickCont() {
        if (vars.pl[ipl].playlist) {
            PlClick1()
        } else {
            PlClick1();
            if (vars.plplace == "inside") {
                Hide(playlist);
                plnext_b ? Hide(plnext_b.c) : '';
                plprev_b ? Hide(plprev_b.c) : ''
            }
            if (!iplay) {
                istart = true;
                Toggle()
            }
        }
        CheckPrevNext()
    }

    function Next() {
        if (ipl < (pl.length - 1)) {
            PlNext()
        }
    }

    function PlArrowNext() {
        var onpage = PlOnPage();
        var i = (plpage + 1) * onpage;
        if (i < pl.length) {
            plpage++;
            for (var j = i; j < i + vars.pllimit; j++) {
                CSS(pl[j], {
                    'display': 'block'
                })
            }
            if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'left': -pl[i].offsetLeft
                })
            }
            if (vars.plplace == 'bottomrow') {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': -pl[i].offsetTop
                })
            }
            PlArrows()
        }
    }

    function PlOnPage() {
        if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
            var tmp = Math.floor((vars.sw - vars.plmargin_h * 2) / vars.pltw);
            return tmp < vars.pllimit ? tmp : vars.pllimit
        } else {
            return Math.floor((vars.bottomrowheight - vars.plmargin_v * 2) / vars.plth)
        }
    }

    function PlArrows() {
        var onpage = PlOnPage();
        var i = plpage * onpage;
        if (i + onpage >= pl.length) {
            Hide(plnext_b.c)
        } else {
            Show(plnext_b.c)
        }
        i == 0 ? Hide(plprev_b.c) : Show(plprev_b.c);
        if (vars.plplace != "inside" && ifull) {
            Hide(plnext_b.c);
            Hide(plprev_b.c)
        }
    }

    function PlArrowPrev() {
        var onpage = PlOnPage();
        var i = (plpage - 1) * onpage;
        if (i >= 0) {
            plpage--;
            for (var j = 0; j < pl.length; j++) {
                CSS(pl[j], {
                    'display': 'none'
                })
            }
            for (var j = i; j < i + vars.pllimit; j++) {
                CSS(pl[j], {
                    'display': 'block'
                })
            }
            if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'left': -pl[i].offsetLeft
                })
            }
            if (vars.plplace == 'bottomrow') {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': -pl[i].offsetTop
                })
            }
            PlArrows()
        }
    }

    function PlNext() {
        if (vars.random == 1) {
            if (plrandom.length > 1) {
                if (ipl !== null) {
                    PlClick0()
                }
                ipl = plrandom[getRandomInt(0, plrandom.length - 1)];
                PlClick1();
                Event('next')
            } else {
                EndPl();
                prev_b ? CSS(prev_b.c, {
                    'opacity': 1,
                    'filter': 'alpha(opacity=100)',
                    'cursor': 'pointer'
                }) : ''
            }
        } else {
            if (ipl < (pl.length - 1)) {
                if (ipl !== null) {
                    PlClick0()
                }
                var start_in_folder = 0;
                if (vars.pl[ipl].playlist && !vars.pl[ipl].file && ipl == 0) {
                    start_in_folder = 2
                } else {
                    ipl++
                }
                PlClick1();
                if (vars.pl[ipl].playlist && !vars.pl[ipl].file) {
                    if (start_in_folder != 2) {
                        start_in_folder = 1
                    }
                }
                if (start_in_folder > 0) {
                    PlClick0();
                    ClearOldVars();
                    ipl = start_in_folder;
                    UpdatedVarsFromPlaylist(vars.pl[ipl]);
                    QualityLinks();
                    if (uppod.ads()) {
                        uppod.ads().newPlaylistItem()
                    }
                    NewFile(vars.file, true);
                    if (vars.plbgcolor_play != undefined) {
                        CSS(plbg[ipl], {
                            "background-color": '#' + vars.plbgcolor_play
                        })
                    }
                    if (vars.plcolor_play != undefined) {
                        CSS(pl[ipl], {
                            "color": '#' + vars.plcolor_play
                        })
                    }
                    Opacity(plbg[ipl], vars.plalpha_play)
                }
                Event('next')
            } else {
                EndPl()
            }
        }
        CheckPrevNext();
        !iplay ? OnPlay() : ''
    }

    function CheckPrevNext() {
        if (vars.random == 0) {
            if (ipl == 0) {
                prev_b ? CSS(prev_b.c, {
                    'opacity': 0.3,
                    'filter': 'alpha(opacity=30)',
                    'cursor': 'default'
                }) : ''
            } else {
                prev_b ? CSS(prev_b.c, {
                    'opacity': 1,
                    'filter': 'alpha(opacity=100)',
                    'cursor': 'pointer'
                }) : ''
            }
            if (ipl == pl.length - 1) {
                next_b ? CSS(next_b.c, {
                    'opacity': 0.3,
                    'filter': 'alpha(opacity=30)',
                    'cursor': 'default'
                }) : ''
            } else {
                next_b ? CSS(next_b.c, {
                    'opacity': 1,
                    'filter': 'alpha(opacity=100)',
                    'cursor': 'pointer'
                }) : ''
            }
        }
    }

    function Prev() {
        PlPrev()
    }

    function PlPrev() {
        if (vars.random == 1) {
            if (plrandom.length > 1) {
                if (ipl !== null) {
                    PlClick0()
                }
                ipl = plrandom[getRandomInt(0, plrandom.length - 1)];
                PlClick1();
                Event('prev')
            } else {
                EndPl()
            }
        } else {
            if (ipl > 0) {
                if (ipl !== null) {
                    PlClick0()
                }
                ipl--;
                PlClick1();
                Event('prev');
                ipl == 0 && prev_b ? CSS(prev_b.c, {
                    'opacity': 0.3,
                    'filter': 'alpha(opacity=30)',
                    'cursor': 'default'
                }) : ''
            } else {}
        }
        CheckPrevNext()
    }

    function EndPl() {
        if (vars.plplay1 == 1) {
            TheEnd()
        } else {
            if (vars.random == 1) {
                for (p = 0; p < pl.length; p++) {
                    plrandom[p] = p
                }
                PlNext()
            } else {
                PlClick0();
                ipl = 0;
                PlClick1();
                Event('next')
            }
        }
    }

    function PlClick0() {
        if (vars.pl[ipl]['poster'] && vars.pltumbs >= 1) {
            vars.pltumbs == 1 ? Hide(pltext[ipl]) : '';
            Opacity(plbg[ipl], 0.5)
        } else {
            if (vars.plbgcolor_play != undefined) {
                CSS(plbg[ipl], {
                    "background-color": '#' + vars.plbgcolor
                })
            }
            if (vars.plcolor_play != undefined) {
                CSS(pl[ipl], {
                    "color": '#' + vars.plcolor
                })
            }
            Opacity(plbg[ipl], vars.plalpha2)
        }
        plplayed[ipl] = true;
        var idx = plrandom.indexOf(ipl);
        if (idx != -1) plrandom.splice(idx, 1)
    }

    function PlClick1() {
        if (vars.pl[ipl].playlist) {
            if (vars.pl[ipl].playlist != "back") {
                vars.pl_history.push(vars.pl);
                var newpl = vars.pl[ipl].playlist;
                vars.pl = [{
                    "comment": "←",
                    "playlist": "back"
                }];
                vars.pl = vars.pl.concat(newpl);
                Event("plfolder")
            } else {
                vars.pl = vars.pl_history[vars.pl_history.length - 1];
                vars.pl_history.splice(vars.pl_history.length - 1, 1);
                Event("plback")
            }
            RemovePl();
            CreatePl();
            if (vars.plplace == "inside") {
                Show(playlist);
                plnext_b ? Show(plnext_b.c) : '';
                plprev_b ? Show(plprev_b.c) : ''
            }
            plpage = 0
        } else {
            ClearOldVars();
            UpdatedVarsFromPlaylist(vars.pl[ipl]);
            QualityLinks();
            if (uppod.ads()) {
                uppod.ads().newPlaylistItem()
            }
            NewFile(vars.file, true);
            if (vars.plbgcolor_play != undefined) {
                CSS(plbg[ipl], {
                    "background-color": '#' + vars.plbgcolor_play
                })
            }
            if (vars.plcolor_play != undefined) {
                CSS(pl[ipl], {
                    "color": '#' + vars.plcolor_play
                })
            }
            Opacity(plbg[ipl], vars.plalpha_play)
        }
        if (plnext_b) {
            PlArrows()
        }
    }

    function UpdatedVarsFromPlaylist(obj) {
        for (var key in obj) {
            if (obj[key].indexOf('#') == 0) {
                obj[key] = un(obj[key])
            }
            if (key == 'poster' && vars['poster'] == undefined) {
                vars['poster'] = obj['poster']
            } else {
                vars[key] = obj[key]
            }
            if (key == 'bigposter') {
                vars['poster'] = obj['bigposter']
            }
        }
    }

    function SlidePLs(plid) {
        if (vars.plplace == "inside" || vars.plplace == "bottom") {
            if (plwidth > (vars.sw - vars.plmargin_h * 2)) {
                SlidePL(plid)
            }
        }
        if (vars.plplace == "bottomrow") {
            if (plheight > vars.bottomrowheight) {
                SlidePL(plid)
            }
        }
    }
    var plInterval;
    var plaim;

    function SlidePL(i) {
        if (vars.plarrows == 0) {
            clearInterval(plInterval);
            if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
                var aim = -pl[i].offsetLeft + playlist.offsetWidth / 2 - vars.pltw / 2;
                if (aim > 0 || plwidth < vars.sw) {
                    aim = 10
                }
                if (aim < 0 && aim < -plwidth + playlist.offsetWidth - 10) {
                    aim = -plwidth + playlist.offsetWidth - 10
                }
                plaim = aim;
                plInterval = setInterval(SlidePLProcess, 20)
            }
            if (vars.plplace == 'bottomrow') {
                var aim = -pl[i].offsetTop + playlist.offsetHeight / 2 - vars.plth / 2;
                if (aim > 0) {
                    aim = 10
                }
                if (aim < -plheight + playlist.offsetHeight - 10) {
                    aim = -plheight + playlist.offsetHeight - 10
                }
                plaim = aim;
                plInterval = setInterval(SlidePLProcess, 20)
            }
        }
    }

    function SlidePLProcess() {
        var aim = plaim;
        if (vars.plplace == 'inside' || vars.plplace == 'bottom') {
            if (Math.abs((pl_mc.offsetLeft - aim) / 10) <= 1) {
                clearInterval(plInterval)
            } else {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': (vars.plplace == 'bottom' ? 0 : 10),
                    'left': pl_mc.offsetLeft - (pl_mc.offsetLeft - aim) / 10
                })
            }
        }
        if (vars.plplace == 'bottomrow') {
            if (Math.abs((pl_mc.offsetTop - aim) / 10) <= 1) {
                clearInterval(plInterval)
            } else {
                CSS(pl_mc, {
                    'position': 'absolute',
                    'top': pl_mc.offsetTop - (pl_mc.offsetTop - aim) / 10,
                    'left': 0
                })
            }
        }
    }

    function ClearOldVars() {
        if (sub) {
            KillSub();
            sub = null
        }
        vars.ors = 0
    }

    function NewFile(s, autoplay) {
        Uppod.trace('NewFile s=' + s + ' autoplay=' + autoplay);
        iplay = false;
        istartevnt = false;
        vars.file = s;
        if (autoplay) {
            vars.auto = 'play'
        }
        Media();
        Comment();
        if (autoplay) {
            OnPlay()
        }
    }

    function checkStart() {
        if (media != undefined) {
            if (Uppod.browser.doSendCanPlay == false || !vars.file || vars.file == '' || vars.auto != 'play') {
                onReady()
            }
            if (media.networkState >= 0 || vars.youtube) {
                init = true;
                CSS(media, {
                    'opacity': 1,
                    'filter': 'alpha(opacity=100)'
                });
                Opacity(media, 1);
                playInterval = setInterval(Playing, 100);
                media.addEventListener('pause', OnPause, false);
                media.addEventListener('seeking', OnSeeking, false);
                media.addEventListener('seeked', OnSeeked, false);
                media.addEventListener('volumechange', OnVolume, false);
                document.addEventListener("fullscreenchange", function() {
                    !isFullscreen() && ifull && !opera ? FullOff() : ''
                }, false);
                document.addEventListener("mozfullscreenchange", function() {
                    !isFullscreen() && ifull ? FullOff() : ''
                }, false);
                document.addEventListener("webkitfullscreenchange", function(e) {
                    !isFullscreen() && ifull ? FullOff() : ''
                }, false);
                document.addEventListener("MSFullscreenChange", function() {
                    !isFullscreen() && ifull ? FullOff() : ''
                }, false);
                muted || v == 0 ? Volume(0) : (v > 0 ? Volume(-v) : '');
                if (!initevent) {
                    Event("init");
                    initevent = true
                }
            } else {
                setTimeout(checkStart, 100)
            }
        }
    }

    function isFullscreen() {
        return !!(document.webkitFullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || (document.fullscreenElement != undefined))
    }

    function Play() {
        iplay = false;
        Toggle()
    }

    function Pause() {
        iplay = true;
        Toggle()
    }

    function Toggle(e) {
        var stop = false;
        if (vars.redirect != '' && vars.redirect_play == 1) {
            window.open(vars.redirect, vars.redirecttarget);
            vars.redirect_play = 0
        }
        Protection();
        if (!stop) {
            Uppod.trace("Toggle e=" + e);
            if (vars.auto == 'none' && !vars.youtube) {
                media.autoplay = true;
                Source();
                istart = true
            }
            vars.auto = 'play';
            if (!vars.file || vars.file == '') {
                Event('player_error', 'nofile')
            }
            istart = true;
            if (!iplay) {
                if (isYoutube()) {
                    media_yt.playVideo();
                    OnPlay()
                } else {
                    uppod.mediaW().play();
                    OnPlay()
                }
            } else {
                if (isYoutube()) {
                    media_yt.pauseVideo();
                    OnPause()
                } else {
                    uppod.mediaW().pause();
                    OnPause()
                }
            }
        }
    }

    function Mybut(m) {
        if (mybuts[m.substr(11)]) {
            var act = mybuts[m.substr(11)].s.link;
            if (act.indexOf('http') == 0) {
                Link(act, (mybuts[m.substr(11)].s.target ? mybuts[m.substr(11)].s.target : "_blank"))
            } else {
                if (act == 'toggle') {
                    Toggle()
                }
                if (act == 'screenshot') {
                    Toggle()
                }
                if (act.indexOf('js:') == 0) {
                    var js_vars = '';
                    if (act.indexOf(',') > 0) {
                        js_vars = act.substr(act.indexOf(',') + 1);
                        act = act.substr(0, act.indexOf(','))
                    }
                    eval(act.substr(3) + '("' + js_vars + '")')
                }
            }
            Event('mybut', act)
        }
    }

    function Link(l, t) {
        if (l) {
            l = l.replace('(referer)', encodeURIComponent(vars.referer));
            l = l.replace('(link)', encodeURIComponent(vars.link));
            l = l.replace('(file)', encodeURIComponent(vars.file));
            l = l.replace('(redirect)', encodeURIComponent(vars.redirect));
            l = l.replace('(comment)', encodeURIComponent(vars.comment));
            l = l.replace('(time)', CurrentTime());
            if (l.substr(0, 3) == 'js:') {
                var myjsa = l.substr(3).split(',');
                eval(myjsa[0] + '(' + (myjsa.length > 1 ? myjsa[1] : '') + (myjsa.length > 2 ? ',' + myjsa[2] : '') + (myjsa.length > 3 ? ',' + myjsa[3] : '') + ');')
            }
            if (l.indexOf('http') == 0) {
                window.open(l, t)
            }
        }
    }

    function Stop() {
        Uppod.trace('Stop');
        if (iplay) {
            Toggle();
            OnPause()
        }
        vars.radio == 0 ? Seek(0) : '';
        time_play_b ? time_play_b.c.innerHTML = formatTime(0) : '';
        time_back_b ? time_back_b.c.innerHTML = formatTime(Duration()) : '';
        vars.auto = 'none';
        if (isYoutube()) {
            media_yt.stopVideo()
        }
        Media();
        Event('stop');
        if (vars.ga != null && vars.gastop == 1) {
            if (!vars.gatracked['stoped']) {
                gaTracker("stoped")
            }
        }
        if (poster_mc && vars.m == 'video') {
            Show(poster_mc)
        }
        line_b && run_b ? RunPos(run_b, line_b, line_play_b, line_all_b, run_pos) : '';
        sub ? StopSub() : ''
    }

    function Download() {
        iplay ? Toggle() : '';
        var downloadUrl = vars.download != 1 && vars.download != '' ? vars.download : (uppod.mediaW().length > 0 ? uppod.mediaW().sources[0] : (vars.file.indexOf("|") > 0 ? vars.file.substr(0, vars.file.indexOf("|")) : vars.file));
        window.open(downloadUrl, "_blank");
        Event('download');
        if (vars.ga != null && vars.gadownload == 1) {
            if (!vars.gatracked['downloaded']) {
                gaTracker("downloaded")
            }
        }
    }

    function Protection() {
        if (vars.urlprotect_go) {
            if (vars.urlprotect_stop == 1) {
                media.src = ''
            }
            if (vars.urlprotect_warning == 1) {
                Alert((vars.redirect != '' ? '<a href="' + vars.redirect + '" style="font-size:200%;color:#fff">' : '') + (vars.urlprotect_msg != '' ? vars.urlprotect_msg : vars.redirect) + (vars.redirect != '' ? '</a>' : ''), false)
            }
        }
    }

    function Quality() {
        if (hd_b) {
            if (vars.filehd) {
                vars.start = media.currentTime;
                var fileold = vars.file;
                NewFile(vars.filehd, true);
                vars.filehd = fileold;
                if (hd1_b.c.style.display == 'none') {
                    Hide(hd_b.c);
                    Show(hd1_b.c);
                    Event('quality', '1')
                } else {
                    Hide(hd1_b.c);
                    Show(hd_b.c);
                    Event('quality', '0')
                }
            }
        }
    }

    function QualityLinks() {
        if (vars.youtube) {} else {
            if (vars.hd && vars.file) {
                if (vars.hd.indexOf('::') > 0) {
                    vars.filehd = vars.file.replace(vars.hd.split('::')[0], vars.hd.split('::')[1]);
                    var change = false;
                    if (hd1_b) {
                        if (hd1_b.c.style.display == 'block') {
                            change = true
                        }
                    } else {
                        if (vars.hd1 == 1) {
                            change = true
                        }
                    }
                    if (change) {
                        var fileold = vars.file;
                        vars.file = vars.filehd;
                        vars.filehd = fileold
                    }
                }
                if (vars.file.indexOf(",") > -1 && vars.file.indexOf('[') == -1) {
                    vars.file = '[' + vars.file + ']'
                }
                if (vars.file.indexOf('[') > -1 && vars.file.indexOf(']') > -1) {
                    var hdf = vars.file.substr(vars.file.indexOf('[') + 1, vars.file.indexOf(']') - vars.file.indexOf('[') - 1).split(vars.hdseparator);
                    var files = '';
                    for (h = 0; h < hdf.length; h++) {
                        files += hdf[h] != '' ? vars.file.substr(0, vars.file.indexOf('[')) + hdf[h] + vars.file.substr(vars.file.indexOf(']') + 1) : '';
                        h < hdf.length - 1 ? files += vars.hdseparator : ''
                    }
                    vars.hdlinks = files.split(vars.hdseparator);
                    HdSelect();
                    if (hdselect) {
                        vars.file = hdselect.value
                    } else {
                        for (h = 0; h < vars.hdlinks.length; h++) {
                            if (vars.hdlinks[h] != '') {
                                vars.file = vars.hdlinks[h];
                                break
                            }
                        }
                    }
                } else {
                    var tmp = vars.hd.split(vars.hdseparator);
                    vars.hdlinks = [];
                    for (h = 0; h < tmp.length; h++) {
                        h == 0 ? vars.hdlinks[h] = vars.file : vars.hdlinks[h] = ''
                    }
                    HdSelect()
                }
            }
        }
    }

    function onHlsQuality() {
        var q = uppod.mediaW().hls.levels;
        var q1 = [];
        var q2 = [];
        q1[0] = 'hls0';
        q2[0] = vars.lang2['auto'];
        if (q.length > 1) {
            for (var i = 0; i < q.length; i++) {
                q1[i + 1] = 'hls' + i;
                q2[i + 1] = q[i].height ? q[i].height + 'p' : i
            }
        }
        vars.hdlinks = q1;
        vars.hda = q2;
        HdSelect();
        vars.hls_quality = true
    }

    function HdSelect() {
        if (hd_b) {
            if (hdselect && vars.hdlinks) {
                var start = 0;
                var hdselects = [];
                var hh = 0;
                hdselect.innerHTML = '';
                vars.hd1 == 1 && vars.quality == '' ? vars.quality = vars.hda[vars.hda.length - 1] : '';
                for (h = 0; h < vars.hda.length; h++) {
                    if (vars.hdlinks[h]) {
                        if (vars.hdlinks[h] != '') {
                            hdselects[h] = document.createElement('option');
                            hdselects[h].value = vars.hdlinks[h];
                            hdselects[h].innerHTML = vars.hda[h];
                            hdselect.appendChild(hdselects[h]);
                            CSS(hdselects[h], {
                                'backgroundColor': vars.selectbgcolor,
                                'color': vars.selectcolor
                            });
                            if (vars.hda[h] == vars.quality || vars.hdlinks == ',') {
                                start = hh;
                                hdselects[h].setAttribute("selected", "true");
                                QualitySelect(false)
                            }
                            hh++
                        }
                    }
                }
                SelectRework(hdselect.options[start].text, hd_b)
            }
        }
    }

    function QualitySelecter() {
        QualitySelect(true)
    }

    function StorageSupport() {
        try {
            var storage = window['localStorage'],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true
        } catch (e) {
            return false
        }
    }

    function QualitySelect(autostart) {
        if (hd_b && vars.hdlinks) {
            if (vars.remquality == 1) {
                if (StorageSupport()) {
                    localStorage.setItem("uppodquality", hdselect.options[hdselect.selectedIndex].text)
                }
            }
            var hdvalue = hdselect.value;
            if (hdvalue.indexOf("hls") == 0) {
                autostart ? vars.start = media.currentTime : '';
                if (hdvalue == 'hlsauto') {
                    uppod.mediaW().hls.nextLevel = -1
                } else {
                    uppod.mediaW().hls.nextLevel = hdvalue.substr(3) * 1
                }
            } else {
                if (vars.youtube) {
                    autostart ? vars.start = media_yt.getCurrentTime() : '';
                    if (isYoutube()) {
                        var t = CurrentTime();
                        media_yt.stopVideo();
                        media_yt.setPlaybackQuality(hdselect.value);
                        media_yt.playVideo();
                        media_yt.seekTo(t)
                    }
                } else {
                    autostart ? vars.start = media.currentTime : '';
                    vars.file = hdselect.value;
                    NewFile(hdselect.value, (mobile ? false : autostart))
                }
            }
            SelectRework(hdselect.options[hdselect.selectedIndex].text, hd_b);
            vars.quality = hdselect.options[hdselect.selectedIndex].text;
            Event('quality', vars.quality)
        }
    }
    var fsdiv = 0;
    var fsdivin;

    function FullScroll(e) {
        e.preventDefault();
        if (media) {
            if ((browser.osWin && e.deltaY < 0) || (!browser.osWin && e.deltaY > 0)) {
                (media.volume + 0.1) < 1 ? media.volume += 0.1 : media.volume = 1
            } else {
                (media.volume - 0.1) > 0 ? media.volume -= 0.1 : media.volume = 0
            }
            if (fsdiv == 0) {
                fsdiv = createElement('div');
                uppod.document.appendChild(fsdiv)
            }
            fsdiv.innerHTML = "<uppodspan style='position:absolute;top:10px;right:10px;font:20px sans-serif;color:#fff'>" + vars.lang2['volume'] + " " + parseInt(media.volume * 100) + '%</uppodspan>';
            clearInterval(fsdivin);
            fsdivin = setInterval(FullScrollHide, 1000)
        }
    }

    function FullScrollHide() {
        uppod.document.removeChild(fsdiv);
        fsdiv = 0;
        clearInterval(fsdivin)
    }

    function Full(re) {
        if (!ifull || re == 're') {
            if (nativecontrols) {
                if (!media.controls) {
                    CSS(controls, {
                        'visibility': 'hidden'
                    });
                    media.controls = true;
                    Remove('layer');
                    media_mc.onclick = null;
                    if (poster_mc && vars.m == 'video') {
                        poster_mc.style.display = 'none'
                    }
                }
            } else {
                window.addEventListener('wheel', FullScroll, true);
                if (vars.realfullscreen == 1 && Uppod.Fullscreen.request(vars.stg)) {
                    irealfull = true
                }
                Uppod.Fullscreen.hack(vars.stg);
                if ((vars.iframe != '' || vars.iframeobject) && !irealfull) {
                    CSS((vars.iframeobject ? vars.iframeobject : window.parent.document.getElementById(vars.iframe)), {
                        'width': window.parent.innerWidth,
                        'height': window.parent.innerHeight,
                        'position': 'fixed',
                        'left': 0,
                        'top': 0
                    })
                }
                if (re != 're') {
                    ifull = true;
                    vars.stagewidth = vars.sw;
                    vars.stageheight = vars.sh;
                    CSS(body.canvas, {
                        'visibility': 'hidden',
                        'height': (vars.iframe != '' ? window.parent.innerHeight : window.innerHeight)
                    });
                    setTimeout(function() {
                        CSS(body.canvas, {
                            'visibility': 'hidden',
                            'height': (vars.iframe != '' ? window.parent.innerHeight : window.innerHeight)
                        })
                    }, 500);
                    setTimeout(function() {
                        CSS(body.canvas, {
                            'visibility': 'hidden',
                            'height': (vars.iframe != '' ? window.parent.innerHeight : window.innerHeight)
                        })
                    }, 700);
                    CSS(media_mc, {
                        'backgroundColor': '#000',
                        'position': 'fixed',
                        'left': 0,
                        'top': 0
                    })
                }
                if (full_b) {
                    full_b.c.style.display = 'none';
                    full_back_b.c.style.display = 'block'
                }
                vars.stageposition = getCss(vars.stg, 'position') || "static";
                if (browser.isIE) {
                    vars.stageposition = "static"
                }
                vars.stageleft = getCss(vars.stg, 'left');
                vars.stagetop = getCss(vars.stg, 'top');
                vars.stageMargins = getCss(vars.stg, 'margin');
                CSS(vars.stg, {
                    'width': '100%',
                    'height': '100%',
                    'margin': '0',
                    'position': 'fixed',
                    'left': '0px',
                    'top': '0px',
                    'z-index': '999999999',
                    'overflow': 'hidden'
                });
                layer != undefined ? layer.style.display = 'none' : '';
                oo ? oo.style.display = 'none' : '';
                clearInterval(hideInterval);
                hideInterval = setInterval(CntrlHide, 3000);
                if (re != 're') {
                    Event('fullscreen')
                }
                if (tip) {
                    if (tip.parentNode) {
                        tip.parentNode.removeChild(tip)
                    }
                }
            }
            if (playlist) {
                vars.plplace != 'inside' ? CSS(playlist, {
                    'top': -1000
                }) : '';
                if (plnext_b && vars.plplace != 'inside') {
                    Hide(plnext_b.c);
                    Hide(plprev_b.c)
                }
            }
            vars.controls_active = false
        } else {
            FullOff()
        }
        setTimeout(MenuPosition, 100);
        logo ? PositionLogo() : '';
        sub || sub_menu ? setTimeout(PositionSub, 500) : ''
    }

    function FullOff() {
        window.removeEventListener('wheel', FullScroll, true);
        if (document.cancelFullScreen) {
            document.cancelFullScreen()
        } else if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.cancelFullscreen) {
            document.cancelFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        }
        ifull = false;
        if ((vars.iframe != '' || vars.iframeobject) && !irealfull) {
            CSS((vars.iframeobject ? vars.iframeobject : window.parent.document.getElementById(vars.iframe)), {
                'width': vars.stagewidth,
                'height': vars.stageheight,
                'margin': vars.stageMargins,
                'position': 'static',
                'left': 0,
                'top': 0
            })
        }
        CSS(media_mc, {
            'backgroundColor': 'transparent',
            'position': 'absolute',
            'left': 0,
            'top': 0
        });
        CSS(vars.stg, {
            'width': (vars.stagewidthproc != '' ? vars.stagewidthproc : vars.stagewidth),
            'height': vars.stageheight,
            'margin': vars.stageMargins,
            'position': vars.stageposition,
            'left': vars.stageleft,
            'top': vars.stagetop
        });
        CSS(body.canvas, {
            'visibility': 'visible',
            'height': vars.stageheight
        });
        CSS(scrn, {
            'visibility': 'visible'
        });
        if (!isYoutube() && layer != undefined) {
            layer.style.display = 'block'
        }
        if (oo) {
            oo.style.display = 'block'
        }
        if (full_b) {
            full_b.c.style.display = 'block';
            full_back_b.c.style.display = 'none'
        }
        if (playlist) {
            PlPlace()
        }
        logo ? PositionLogo() : '';
        sub || sub_menu ? setTimeout(PositionSub, 500) : '';
        if (tip) {
            if (tip.parentNode) {
                tip.parentNode.removeChild(tip)
            }
        }
        Event('exitfullscreen')
    }
    var menu_big;

    function Menu() {
        if (menu_big) {
            ShowHide(menu_big)
        } else {
            menu_big = createElement('div');
            var mb_w = vars.scrn_w < 320 ? vars.scrn_w - 30 : 350;
            var mb_h = (vars.download != '' && vars.download != 0 ? 45 : 0) + (vars.menu_nocode == 1 ? 0 : 45) + (vars.link != '' ? 45 : 0) + 11;
            vars.menu_w = mb_w;
            vars.menu_h = mb_h;
            var menu_big_bg = new Shaper2({
                w: mb_w,
                h: mb_h,
                o: 10,
                bgc: '000000|000000',
                bga1: 0.5,
                bga2: 0.5
            });
            menu_big.appendChild(menu_big_bg.c);
            CSS(menu_big_bg.c, {
                'position': 'relative',
                'top': '0',
                'left': '0'
            });
            if (vars.download != '' && vars.download != 0) {
                MenuBigItem("menu_download", (vars.download == 1 ? vars.file : vars.download), mb_w, mb_h)
            }
            if (vars.link != '') {
                MenuBigItem("menu_link", vars.link, mb_w, mb_h)
            }
            CSS(menu_big, {
                'color': '#ffffff',
                'font': '10px Verdana'
            });
            menu_big.style.zIndex = 100;
            MenuBigItem("menu_code", (vars.iframeurl != '' ? '<iframe title="sample" width="' + vars.w + '" height="' + vars.h + '" src="' + vars.iframeurl + '" frameborder="0" allowfullscreen></iframe>' : vars.embedcode != '' ? vars.embedcode : ''), mb_w, mb_h);
            var mbx = createElement('div');
            mbx.innerHTML = '&nbsp; x &nbsp;';
            menu_big.appendChild(mbx);
            CSS(mbx, {
                'position': 'absolute',
                'top': 3,
                'left': mb_w - 25,
                'cursor': 'pointer'
            });
            mbx.onclick = MenuClose;
            body.c.appendChild(menu_big);
            MenuPosition()
        }
    }
    var menuitems = 0;

    function MenuBigItem(what, content, mb_w, mb_h) {
        var mbkodt = createElement('div');
        mbkodt.innerHTML = vars.lang2[what];
        menu_big.appendChild(mbkodt);
        CSS(mbkodt, {
            'position': 'absolute',
            'top': (5 + menuitems * 45),
            'left': 15
        });
        var mbkodbg = new Shaper2({
            w: mb_w - 20,
            h: 23,
            o: 5,
            bgc: 'ffffff'
        });
        CSS(mbkodbg.c, {
            'position': 'absolute',
            'top': (22 + menuitems * 45),
            'left': 10
        });
        menu_big.appendChild(mbkodbg.c);
        var mbkode = document.createElement('input');
        menu_big.appendChild(mbkode);
        CSS(mbkode, {
            'position': 'absolute',
            'outline': 'none',
            'font': '10px Verdana',
            'top': (25 + menuitems * 45),
            'left': 13,
            'width': mb_w - 28,
            'height': 15,
            'color': '#000000',
            'border': 0,
            'background': 'none'
        });
        mbkode.value = content;
        mbkode.onclick = function() {
            this.select()
        };
        menuitems++
    }

    function MenuClose() {
        if (menu_big) {
            CSS(menu_big, {
                'display': 'none'
            })
        }
    }

    function MenuPosition() {
        if (menu_big) {
            CSS(menu_big, {
                'position': 'absolute',
                'top': ((ifull ? vars.sh : vars.stageheight) - vars.menu_h) / 2,
                'left': ((ifull ? vars.sw : vars.stagewidth) - vars.menu_w) / 2
            })
        }
    }

    function CntrlHide() {
        var hide_force = false;
        if (uppod.ads()) {
            uppod.ads().isActive() ? hide_force = true : ''
        }
        if ((iplay && CurrentTime() > 0) || hide_force) {
            var hide = !iover && !vars.controls_active && vars.cntrlhide == 1;
            var fullHide = ifull && !vars.controls_active && vars.fullcntrlhide == 1;
            if (hide || fullHide || hide_force) {
                clearInterval(hideInterval);
                CSS(controls, {
                    'visibility': 'hidden'
                });
                if (playlist && vars.plplace == 'inside') {
                    if (playlist.style.display != "none") {
                        Pl()
                    }
                }
                CSS(uppod.iframe, {
                    'cursor': 'none'
                });
                if (isYoutube()) {
                    mouseMoveCatcher.style.display = 'block'
                }
                ihide = true
            }
        }
    }

    function CntrlShow() {
        clearInterval(hideInterval);
        mouseMoveCatcher.style.display = 'none';
        if (!nativecontrols) {
            CSS(controls, {
                'visibility': 'visible'
            });
            CSS(uppod.iframe, {
                'cursor': 'auto'
            });
            ihide = false
        }
    }

    function ScreenSize() {
        vars.scrn_w = vars.sw - vars.padding * 2;
        vars.scrn_h = vars.ph - vars.padding * 2 - (vars.cntrlout == 1 ? vars.cntrloutheight : 0)
    }

    function Resize() {
        var rw = vars.stg.offsetWidth;
        var rh = vars.stg.offsetHeight;
        if (document.msFullscreenElement && window.top !== window) {
            rw = window.screen.width;
            rh = window.screen.height
        }
        if (vars.sw != 0 && vars.sh != 0 && rh != 0 && rw != 0) {
            var resizeHeight = 0;
            if (vars.sw != rw && vars.sh == rh && vars.autoheight == 1) {
                resizeHeight = (vars.sw / vars.sh)
            }
            if (vars.ph != vars.sh) {
                vars.ph = rh - (vars.sh - vars.ph)
            } else {
                vars.ph = rh
            }
            vars.sw = rw;
            vars.sh = rh;
            if (!ifull) {
                vars.stagewidth = vars.sw;
                vars.stageheight = vars.sh
            }
            ScreenSize();
            var nh = (!ifull ? vars.ph : vars.sh) - vars.padding * 2 - (vars.cntrlout == 1 ? vars.cntrloutheight : 0);
            if (!ifull) {
                CSS(body.canvas, {
                    'width': vars.sw,
                    'height': vars.sh
                });
                CSS(scrn, {
                    'width': vars.sw - vars.padding * 2,
                    'height': nh
                });
                CSS(layer, {
                    'height': nh
                })
            }
            if (alrt) {
                CSS(alrt_bg.canvas, {
                    'width': '' + vars.sw - (ifull ? 0 : vars.padding * 2) + 'px'
                });
                if (vars.padding > 0) {
                    CSS(alrt, {
                        'top': (ifull ? 0 : vars.padding),
                        'left': (ifull ? 0 : vars.padding)
                    })
                }
            }
            if (poster_mc) {
                CSS(poster_mc, {
                    'width': vars.sw,
                    'height': vars.ph - vars.padding * 2 - (vars.cntrlout == 1 ? vars.cntrloutheight : 0)
                })
            }
            CSS(media_mc, {
                'width': '' + vars.sw - (!ifull ? vars.padding * 2 : 0) + 'px',
                'height': '' + nh + 'px'
            });
            CSS(media, {
                'width': '' + vars.sw - (!ifull ? vars.padding * 2 : 0) + 'px',
                'height': '' + nh + 'px'
            });
            if (isYoutube()) {
                CSS(document.getElementById('yt_media_' + vars.uid), {
                    'width': '' + vars.sw - (!ifull ? vars.padding * 2 : 0) + 'px',
                    'height': '' + nh + 'px'
                })
            }
            vars.o > 0 ? oPos() : '';
            uppod.controls().ControlBar.resize();
            if (uibg) {
                CSS(uibg.canvas, {
                    'width': '' + (vars.sw - (ifull ? 0 : vars.padding * 2) - vars.cntrlbgmargin * 2 - vars.cntrlbgmarginleft - vars.cntrlbgmarginright) + 'px',
                    'height': '' + vars.cntrloutheight + 'px'
                });
                uibg_gl ? CSS(uibg_gl.canvas, {
                    'width': '' + (vars.sw - (ifull ? 0 : vars.padding * 2) - vars.cntrlbgmargin * 2) + 'px'
                }) : ''
            }
            start_b ? CSS(start_b.c, {
                'left': vars.sw / 2 - start_b.w / 2,
                'top': (!ifull ? vars.ph : vars.sh) / 2 - start_b.h / 2
            }) : '';
            PlaceControls();
            if (playlist) {
                PlPlace();
                if (plnext_b) {
                    if ((vars.plplace == "inside" && playlist.style.display != "none") || !ifull) {
                        Show(plnext_b.c);
                        Show(plprev_b.c);
                        PlArrows();
                        if (plpage > 0) {
                            plpage = plpage - 1;
                            PlArrowNext()
                        }
                    }
                }
            }
            if (sub) {
                PositionSub()
            }
            if (resizeHeight > 0) {
                vars.stg.style.height = rw / resizeHeight + 'px'
            }
        }
    }

    function Back() {
        Seek(0)
    }

    function Mute() {
        if (isYoutube()) {
            if (!media_yt.isMuted()) {
                media_yt.mute();
                muted = true
            } else {
                media_yt.unMute();
                muted = false
            }
        } else {
            if (media.muted) {
                media.muted = false;
                muted = false
            } else {
                media.muted = true;
                muted = true
            }
        }
        MuteControl()
    }

    function MuteControl() {
        if (volume_b) {
            if (muted) {
                volume_b.c.style.display = 'none'
            } else {
                volume_b.c.style.display = 'block'
            }
        }
        if (volume_mute_b) {
            if (muted) {
                volume_mute_b.c.style.display = 'block'
            } else {
                volume_mute_b.c.style.display = 'none'
            }
        }
    }

    function OnPlay() {
        Uppod.trace('OnPlay');
        if (!iplay) {
            if (nativecontrols && !media.controls) {
                CSS(controls, {
                    'visibility': 'hidden'
                });
                media.controls = true;
                Remove('layer');
                media_mc.onclick = null
            }
            if (poster_mc && vars.m == 'video') {
                poster_mc.style.display = 'none'
            }
            if (play_b != undefined) {
                play_b.c.style.display = 'none';
                pause_b.c.style.display = 'block'
            }
            iplay = true;
            var hide = vars.cntrlhide == 1 && !vars.controls_active && vars.cntrlout == 0;
            var fullHide = ifull && !vars.controls_active && vars.fullcntrlhide == 1;
            if (hide || fullHide) {
                clearInterval(hideInterval);
                hideInterval = setInterval(CntrlHide, 3000)
            }
            if (vars.comment != undefined && vars.comment != '' && vars.showname == 1) {
                vars.shownameliketip == 1 ? (vars.shownameonstop == 1 ? Hide(nametip) : '') : Hide(alrt)
            }
            if (vars.plplace == "inside" && playlist) {
                Hide(playlist);
                plnext_b ? Hide(plnext_b.c) : '';
                plprev_b ? Hide(plprev_b.c) : ''
            }
            if (start_b) {
                start_b.c.style.display = 'none'
            }
            if (logo) {
                if (vars.logoplay == 1) {
                    Show(logo)
                } else {
                    Hide(logo)
                }
            }
            Event('play');
            if (vars.ga != null && vars.gaplay == 1) {
                if (!vars.gatracked['played']) {
                    gaTracker("played")
                }
            }
            document.removeEventListener("keydown", KeyHandler);
            uppod_active_player_uid = vars.uid;
            document.addEventListener("keydown", KeyHandler);
            if (vars.autofull == 1) {
                Full()
            }
            if (!istartevnt) {
                Event('start');
                istart = true;
                istartevnt = true;
                if (vars.infoloader == 1 && vars.infoloaderurl != null) {
                    getRadioInfo();
                    itervalRi = setInterval(getRadioInfo, (vars.infoloaderinterval >= 1000 ? vars.infoloaderinterval : vars.infoloaderinterval * 1000), false)
                }
            }
            if (vars.sub && (vars.substart == 1 || (mobile && nativecontrols))) {
                CreateSubs()
            }
        }
    }

    function getRadioInfo() {
        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();
        xhr.open('GET', vars.infoloaderurl + (vars.infoloaderaddurl == 1 || vars.radio == 1 ? '?url=' + vars.file : ''), true);
        xhr.onload = function() {
            if (this.readyState == 4 && this.status == 200) {
                RadioInfo(this)
            } else {
                console.log("Ошибка загрузки тегов")
            }
        };
        xhr.onerror = function(e) {
            console.log("Ошибка загрузки тегов")
        };
        xhr.send()
    }

    function RadioInfo(x) {
        var str = x.responseText;
        if (str.indexOf('|uppod|') > -1) {
            var tags = str.split('|uppod|');
            var output = vars.infoloadermask;
            for (var i = 0; i < tags.length; i++) {
                var pattern = "\\{" + (i * 1 + 1) + "\\}";
                var myAmpPattern = new RegExp(pattern);
                for (var j = 0; j < output.split("{" + (i * 1 + 1) + "}").length; j++) {
                    output = output.replace(myAmpPattern, tags[i])
                }
            }
            output = (vars.id3 > 1 ? vars.comment + '<br>' : '') + output;
            if (vars.shownameliketip == 1) {
                NameTip((vars.marquee == 1 ? '<marquee>' : '') + output + (vars.marquee == 1 ? '</marquee>' : ''))
            } else {
                Alert((vars.marquee == 1 ? '<marquee>' : '') + output + (vars.marquee == 1 ? '</marquee>' : ''), false)
            }
        }
    }

    function OnSeeking() {
        Event('seeking')
    }

    function OnSeeked() {
        Event('seeked')
    }

    function OnPause() {
        Uppod.trace('OnPause');
        if (iplay) {
            if (play_b != undefined) {
                play_b.c.style.display = 'block';
                pause_b.c.style.display = 'none'
            }
            iplay = false;
            if (vars.comment != undefined && vars.comment != '' && vars.showname == 1) {
                vars.shownameliketip == 1 ? Show(nametip) : Show(alrt)
            }
            start_b ? start_b.c.style.display = 'block' : '';
            if (logo) {
                if (vars.logopause == 1) {
                    Show(logo)
                } else {
                    Hide(logo)
                }
            }
            Event('pause')
        }
    }

    function Event(s, msg) {
        vars.events[s] = msg;
        var evObj = document.createEvent('Events');
        evObj.initEvent(s, true, true);
        vars.stg.dispatchEvent(evObj);
        if (vars.postmessage == 1) {
            var x = s;
            var zv = {
                event: x,
                time: CurrentTime()
            };
            if (x == "duration" || x == "time") {
                zv["duration"] = Duration()
            }
            if (x == "volume" || x == "unmute") {
                zv["volume"] = media ? media.volume : vars.volume
            }
            window.parent.postMessage(zv, '*');
            var z = '';
            x == "init" || x == "start" || x == "end" ? z = x + "ed" : '';
            x == "play" ? z = "resumed" : '';
            x == "pause" ? z = "paused" : '';
            x == "seek" ? z = "rewound" : '';
            x == "vast_Impression" ? z = "adShown" : '';
            zv["event"] = z;
            if (z != '') {
                window.parent.postMessage(zv, '*')
            }
        }
    }

    function onCanPlay() {
        Uppod.trace('onCanPlay');
        if (vars.start > 0) {
            Uppod.trace('onCanPlay set currentTime to ' + vars.start);
            media.currentTime = vars.start;
            vars.start = 0
        }
        onReady()
    }

    function OnVolume() {
        if (volbarline_all_b) {
            vars.ivolbar_v ? VolumeDraw(media.volume * volbarline_s['h']) : VolumeDraw(media.volume * volbarline_s['w'])
        }
        if (volbar_b) {
            VolumeDraw(media.volume * vars.cntrlvolbar.w)
        }
    }

    function OnEnded() {
        Uppod.trace('OnEnded');
        if (media.ended || isYoutube()) {
            Event('end');
            if (vars.ga != null && vars.gaend == 1) {
                if (!vars.gatracked['ended']) {
                    gaTracker("ended")
                }
            }
            if (vars.radio == 1) {
                Reload()
            } else {
                if (vars.repeat == 1) {
                    Play()
                } else {
                    if (!isYoutube()) {
                        Back()
                    }
                    if (vars.plplay == 1 && pl) {
                        PlNext()
                    } else {
                        TheEnd()
                    }
                }
            }
        }
    }

    function Reload() {
        Uppod.trace('Reload');
        Stop();
        Toggle()
    }

    function Sizing() {
        var rw = vars.stg.offsetWidth;
        var rh = vars.stg.offsetHeight;
        if (document.msFullscreenElement && window.top !== window) {
            rw = window.screen.width;
            rh = window.screen.height
        }
        if (rw != vars.sw || rh < vars.sh - 5 || rh > vars.sh + 5) {
            Resize()
        }
    }

    function Playing() {
        if (media != undefined) {
            updateTimeDisplay();
            if (iline) {
                var time = 0;
                var duration = 0;
                time = CurrentTime();
                duration = Duration();
                var loaded = 0;
                if (isYoutube()) {
                    loaded = media_yt.getVideoLoadedFraction()
                } else {
                    if (media.buffered) {
                        if (media.buffered.length > 0) {
                            for (var i = 0; i < media.buffered.length; i++) {
                                if ((time >= media.buffered.start(i) || time >= media.buffered.start(i) - 100) && time <= media.buffered.end(i)) {
                                    loaded = media.buffered.end(i) / media.duration
                                }
                            }
                            loaded == 0 ? loaded = (media.buffered.end(media.buffered.length - 1) / media.duration) : ''
                        }
                    }
                }
                if (loaded > 0) {
                    CSS(line_load_b, {
                        'width': '' + (loaded * line_all_b.w) + 'px'
                    });
                    if (loaded == 1) {
                        if (!iloaded) {
                            iloaded = true;
                            Event("loaded")
                        }
                    } else {
                        iloaded = false
                    }
                }
                CSS(line_play_b, {
                    'width': '' + (time / duration) * line_all_b.w + 'px'
                });
                if (ibuff && !igo) {
                    if (time > 0) {
                        HideBuffer();
                        igo = true
                    }
                }
                if (iplay && time == lastTime) {
                    if (ltc > 5) {
                        !ibuff ? ShowBuffer() : '';
                        ibuff = true
                    } else {
                        ltc++
                    }
                } else {
                    if (ibuff) {
                        ibuff = false;
                        HideBuffer()
                    }
                    ltc = 0
                }
                lastTime = time
            }
            if (iplay && vars.reloader == 1) {
                if (CurrentTime() == vars.reloadertime) {
                    vars.reloadercounter++;
                    if (vars.reloadercounter > 200 && media.currentTime != undefined) {
                        vars.reloadercounter = 0;
                        Reload()
                    }
                } else {
                    vars.reloadercounter = 0
                }
                vars.reloadertime = CurrentTime()
            }
            if (vars.eventtime != 0) {
                if (iplay) {
                    if (is_array(vars.eventtime)) {
                        for (i = 0; i < vars.eventtime.length; i++) {
                            if (!vars.events['time' + vars.eventtime[i]]) {
                                if (CurrentTime() > vars.eventtime[i]) {
                                    Event('time' + vars.eventtime[i], CurrentTime())
                                }
                            }
                        }
                    } else {
                        if (!vars.events['time']) {
                            if (CurrentTime() > vars.eventtime) {
                                Event('time', CurrentTime())
                            }
                        }
                    }
                }
            }
            if (vars.eventplayed != 0) {
                if (iplay) {
                    if (is_array(vars.eventplayed)) {
                        for (i = 0; i < vars.eventplayed.length; i++) {
                            if (!vars.events['played' + vars.eventplayed[i]]) {
                                if ((CurrentTime() / Duration()) * 100 > vars.eventplayed[i]) {
                                    Event('played' + vars.eventplayed[i], (CurrentTime() / Duration()) * 100)
                                }
                            }
                        }
                    } else {
                        if (!vars.events['played']) {
                            if ((CurrentTime() / Duration()) * 100 > vars.eventplayed) {
                                Event('played', (CurrentTime() / Duration()) * 100)
                            }
                        }
                    }
                }
            }
            line_b && run_b ? RunPos(run_b, line_b, line_play_b, line_all_b, run_pos) : '';
            if (sub != undefined && vars.substart == 1) {
                if (sub[sub_lang]) {
                    if (sub[sub_lang][1]) {
                        var t = parseInt(CurrentTime() * 10);
                        if (sub[sub_lang][1][t] != null) {
                            var str = '';
                            if (vars.sublangsall == 1 && sub_lang_all) {
                                for (var i = 0; i < sub.length; i++) {
                                    str += sub[i][0][sub[i][1][t]] ? sub[i][0][sub[i][1][t]] + (i < sub.length - 1 ? '<br>' : '') : ''
                                }
                            } else {
                                str = sub[sub_lang][0][sub[sub_lang][1][t]]
                            }
                            if (sub) {
                                var stop = false;
                                if (sub_last) {
                                    sub_last == str ? stop = true : ''
                                }!sub_showed ? stop = false : '';
                                !stop ? ShowSub(str) : ''
                            }
                        }
                        if (sub[sub_lang][1][t] == undefined && sub_showed) {
                            StopSub()
                        }
                    }
                }
            }
            if (iplay) {
                if (body.c.style.visibility == "hidden") {
                    body.c.style.visibility = "visible"
                }
                if (media.style.visibility == "hidden") {
                    media.style.visibility = "visible"
                }
            }
        }
        if (ifull && !irealfull) {
            if (vars.iframe != '') {
                window.parent.innerWidth != vars.stg.offsetWidth || window.parent.innerHeight != vars.stg.offsetHeight ? Full('re') : ''
            } else {
                window.innerWidth != vars.stg.offsetWidth || window.innerHeight != vars.stg.offsetHeight ? Full('re') : ''
            }
        }
    }

    function CurrentTime() {
        t = 0;
        if (isYoutube()) {
            t = media_yt.getCurrentTime()
        } else {
            media ? t = media.currentTime : ''
        }
        return t
    }

    function Duration() {
        t = 0;
        if (isYoutube()) {
            t = media_yt.getDuration()
        } else {
            if (media) {
                if (media.duration && media.duration != 'Infinity') {
                    t = media.duration
                }
            }
        }
        return t
    }

    function NotFound() {
        if (vars.or.length > 1 && vars.ors < vars.or_limit) {
            if (vars.ori == vars.or.length - 1) {
                vars.ori = -1;
                vars.ors++
            }
            vars.ori++;
            NewFile(vars.or[vars.ori], (vars.auto == "play" && (mobile || vars.volume == 0) ? true : false))
        } else {
            Pause();
            if (vars.alerts == 1) {
                var message = vars.lang2['file'] + ' ' + vars.lang2['notfound'];
                Alert(message)
            }
            Event('player_error', 'file not found')
        }
    }

    function TheEnd() {
        if (!nativecontrols) {
            CntrlShow()
        }
        if (vars.redirect != '' && vars.redirect_end == 1) {
            window.open(vars.redirect, vars.redirecttarget);
            vars.redirect_end = 0
        }
        if (media) {
            if (!isYoutube()) {
                media.currentTime = 0;
                media.pause()
            } else {
                media_yt.pauseVideo()
            }
        }
        if (poster_mc && vars.m == 'video') {
            Show(poster_mc)
        }
        if (vars.menuauto == 1 && menu_b) {
            isVisible(menu_big) ? '' : Menu()
        }
        if (vars.plonend == 1 && pl) {
            if (vars.plplace == "inside") {
                if (vars.plplace == "inside") {
                    Show(playlist);
                    plnext_b ? Show(plnext_b.c) : '';
                    plprev_b ? Show(plprev_b.c) : ''
                }
                if (plnext_b) {
                    PlArrows()
                }
            }
        }
    }

    function isVisible(mc) {
        var out = false;
        if (mc) {
            mc.style.visible != 'none' ? out = true : ''
        }
        return out
    }

    function FontStyle(f) {
        var out = 'normal';
        if (f == 'i' || f == 'b><i') {
            out = 'italic'
        }
        return out
    }

    function FontWeight(f) {
        var out = 'normal';
        if (f == 'b' || f == 'b><i') {
            out = 'bold'
        }
        return out
    }

    function ShowBuffer() {
        if (buffer_b) {
            uppod.controls().Buffer.show()
        }
    }

    function HideBuffer() {
        if (buffer_b) {
            uppod.controls().Buffer.hide()
        }
        ibuff = false
    }

    function updateTimeDisplay() {
        time_play_b ? time_play_b.c.innerHTML = formatTime(CurrentTime()) : '';
        if (Duration() > 0) {
            time_back_b ? time_back_b.c.innerHTML = formatTime(Duration() - CurrentTime()) : '';
            time_all_b ? time_all_b.c.innerHTML = formatTime(Duration()) : ''
        }
    }

    function formatTime(seconds, tip) {
        var seconds = Math.round(seconds);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        minutes = Math.floor(minutes % 60);
        seconds = Math.floor(seconds % 60);
        (hours > 0 || timelength > 5) && minutes < 10 ? minutes = "0" + minutes : "";
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        var out = (hours > 0 || timelength > 5 ? hours + ":" : "") + minutes + ":" + seconds;
        if (out.length != timelength && !tip) {
            timelength = out.length;
            PlaceControls()
        }
        return out
    }

    function CreateSubs() {
        if (vars.sub.indexOf('#') == 0) {
            vars.sub = un(vars.sub)
        }
        var subs = vars.sub.split(',');
        var clangs = vars.sublangs ? vars.sublangs.split(',') : Array();
        sub = Array();
        for (var i = 0; i < subs.length; i++) {
            if (subs[i] != '') {
                if (clangs[i] == undefined) {
                    var filename = subs[i].substr(subs[i].lastIndexOf('/') + 1);
                    filename = filename.substr(0, filename.lastIndexOf('.'));
                    clangs[i] = filename
                }
                CreateSub(i, subs[i], clangs[i]);
                clangs[i] && vars.sublang ? (clangs[i] == vars.sublang ? sub_lang = i : '') : ''
            } else {
                if (sub_lang == i) {
                    sub_lang++
                }
            }
        }
        vars.sub_tmp = vars.sub;
        delete vars.sub
    }

    function CreateSub(l, url, label) {
        if (url) {
            if (url.indexOf('#') == 0) {
                url = un(url)
            }
            var url_shift = vars.sub_shift;
            if (url.indexOf('shift=') > 0) {
                url_shift = url.substr(url.indexOf('shift=') + 6) * 1
            }
            if (mobile && (nativecontrols || iphone)) {
                var track = document.createElement('track');
                track.setAttribute('src', url);
                track.setAttribute('label', label);
                vars.substart == 1 && l == 0 ? track.setAttribute('default', 'true') : '';
                media.appendChild(track)
            } else {
                var subtxt = LoadFile(url);
                if (subtxt) {
                    if (url.indexOf('.srt') > -1 || url.indexOf('.ass') > -1 || url.indexOf('.ssa') > -1 || url.indexOf('.vtt') > -1) {
                        sub[l] = Object();
                        sub[l][0] = Array();
                        sub[l][1] = Array();
                        var rows = Array();
                        rows = subtxt.split('\n');
                        var cnt = 1;
                        var t1 = 0;
                        var t2 = 0;
                        for (i = 0; i < rows.length; i++) {
                            if (url.indexOf('.srt') > -1 || url.indexOf('.vtt') > -1) {
                                if (rows[i].indexOf('-->') > -1 && rows[i].indexOf(':') > -1) {
                                    t1 = TimerSub(rows[i].substr(0, rows[i].indexOf('-->'))) * 1 + url_shift;
                                    t2 = TimerSub(rows[i].substr(rows[i].indexOf('-->') + 4, 12)) * 1 + url_shift;
                                    sub[l][0][t1] = '';
                                    for (var j = t1; j < t2; j++) {
                                        sub[l][1][j] = t1
                                    }
                                    cnt++
                                } else {
                                    if (rows[i] != '' && rows[i].length > 1 && rows[i] != cnt) {
                                        sub[l][0][t1] += (sub[l][0][t1] != '' ? '<br>' : '') + rows[i]
                                    }
                                }
                            }
                            if (url.indexOf('.ass') > -1 || url.indexOf('.ssa') > -1) {
                                if (rows[i].indexOf('Dialogue:') > -1) {
                                    t1 = TimerSub(rows[i].substr((url.indexOf('.ssa') > -1 ? rows[i].indexOf('=0') + 3 : 12), 12)) * 1 + url_shift;
                                    t2 = TimerSub(rows[i].substr((url.indexOf('.ssa') > -1 ? rows[i].indexOf('=0') + 14 : 23), 10)) * 1 + url_shift;
                                    var p = '';
                                    if (rows[i].indexOf('0,,') > 0) {
                                        p = rows[i].substr(rows[i].indexOf('0,,') + 3)
                                    } else {
                                        if (rows[i].indexOf('ffect,') > 0) {
                                            p = rows[i].substr(rows[i].indexOf('ffect,') + 6)
                                        }
                                    }
                                    if (sub[l][0][t1] != undefined) {
                                        sub[l][0][t1] += '\n' + p
                                    } else {
                                        sub[l][0][t1] = p
                                    }
                                    sub[l][0][t1] = sub[l][0][t1].replace(/{.*?}/, '');
                                    sub[l][0][t1] = sub[l][0][t1].replace(/\\\\N/, '\n');
                                    for (var j = t1; j < t2; j++) {
                                        sub[l][1][j] = t1
                                    }
                                }
                            }
                        }
                    }
                }
                vars.substart = 1
            }
        }
    }

    function ShowSub(str) {
        if (sub_text) {
            KillSub()
        }
        sub_text = createElement('div');
        sub_bg = createElement('div');
        body.c.appendChild(sub_bg);
        body.c.appendChild(sub_text);
        Show(sub_text);
        Show(sub_bg);
        sub_last = str;
        sub_text.innerHTML = str;
        sub_showed = true;
        PositionSub()
    }

    function StopSub() {
        if (sub_text) {
            KillSub();
            sub_showed = false
        }
    }

    function KillSub() {
        if (sub_text) {
            sub_text.innerHTML = '';
            body.c.removeChild(sub_bg);
            body.c.removeChild(sub_text);
            sub_bg = null;
            sub_text = null
        }
    }

    function PositionSub() {
        var h = (!ifull ? vars.ph : vars.sh) - (vars.cntrlout == 1 && !ifull ? vars.padding / 2 : vars.cntrloutheight);
        if (sub_text) {
            var width = vars.sw - 60;
            CSS(sub_text, {
                "position": "absolute",
                "color": (vars.subcolor.length == 6 ? '#' : '') + vars.subcolor,
                'fontFamily': vars.subfont,
                'fontSize': (vars.subsize * (ifull ? 1.5 : 1)) + '%',
                'text-align': 'center',
                'line-height': '120%',
                'text-shadow': '1px 1px 1px rgba(1,1,1,0.4)'
            });
            CSS(sub_bg, {
                "position": "absolute",
                "backgroundColor": (vars.subbgcolor.length == 6 ? '#' : '') + vars.subbgcolor,
                'opacity': vars.subbgalpha,
                'borderRadius': vars.subbgo / 2
            });
            CSS(sub_text, {
                'max-width': width
            });
            var top = h - vars.submargin * (ifull ? vars.sh / vars.stageheight : 1) - 10 - sub_text.offsetHeight - 5;
            var left = (vars.sw - (sub_text.offsetWidth + 20)) / 2;
            CSS(sub_text, {
                "position": "absolute",
                "top": top,
                "left": left + 10
            });
            CSS(sub_bg, {
                "width": sub_text.offsetWidth + 20,
                "height": sub_text.offsetHeight + 10,
                "position": "absolute",
                "top": top - 5,
                "left": left
            })
        }
        if (sub_menu) {
            var top2 = (h - sub_menu.offsetHeight);
            var left2 = sub_b.c.offsetLeft - sub_menu.offsetWidth + sub_b.w + 5;
            left2 < 0 ? left2 = 0 : '';
            CSS(sub_menu, {
                "position": "absolute",
                "top": top2,
                "left": left2
            });
            CSS(sub_menu_bg, {
                "position": "absolute",
                "top": top2,
                "left": left2
            })
        }
    }

    function TimerSub(srt) {
        var tmp = srt.split(':');
        var out = 0;
        tmp.length == 2 ? tmp.unshift("00") : '';
        tmp[0] != '00' ? out += tmp[0] * 3600 : '';
        tmp[1] != '00' ? out += tmp[1] * 60 : '';
        out += tmp[2].substr(0, 2) * 1;
        out = out * 10 + tmp[2].substr(3, 1) * 1;
        return out
    }

    function SetSub() {
        if (vars.submenu == 1) {
            if (sub_menu) {
                ToggleView(sub_menu_bg);
                ToggleView(sub_menu);
                PositionSub()
            } else {
                sub_menu = createElement('div');
                sub_menu_bg = createElement('div');
                body.c.appendChild(sub_menu_bg);
                body.c.appendChild(sub_menu);
                sub_menu.innerHTML = '<div id="uppodplayer_sub_switcher" style="width:47px;height:18px;border:1px solid rgba(255,255,255,0.5);border-radius:20px;margin-bottom:10px;padding:1px;cursor:pointer"><div id="uppodplayer_sub_switcher_bg" style="width:45px;height:16px;background:#fff;border-radius:18px;padding:1px;"><div id="uppodplayer_sub_switcher_dot" style="width:16px;height:16px;background:#000;border-radius:17px;color:#000;text-align:center;' + (vars.substart == 0 ? 'float:left' : 'float:right') + '"></div></div></div>';
                document.getElementById("uppodplayer_sub_switcher").onclick = ToggleSub;
                var sub_menu_x = createElement('div');
                sub_menu.appendChild(sub_menu_x);
                CSS(sub_menu_x, {
                    "fontSize": "80%",
                    "position": "absolute",
                    "top": 5,
                    "right": 7,
                    "color": "#fff",
                    "opacity": 0.5,
                    "margin-top": "-2px",
                    "cursor": "pointer"
                });
                sub_menu_x.innerHTML = '×';
                sub_menu_x.onclick = SetSub;
                CSS(sub_menu, {
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "color": "#fff",
                    "font": "90% sans-serif",
                    "borderRadius": 10,
                    "padding": 10,
                    "width": 119
                });
                sub_menu2 = createElement('div');
                ToggleSubStyle();
                sub_menu.appendChild(sub_menu2);
                var b1 = createElement('div');
                SetSubButStyle(b1, false);
                b1.innerHTML = '+';
                CSS(b1, {
                    "margin": "0 5px 5px 0"
                });
                var b2 = createElement('div');
                SetSubButStyle(b2, false);
                b2.innerHTML = '-';
                CSS(b2, {
                    "margin": "0 20px 5px 0"
                });
                b1.onclick = function() {
                    vars.subsize += 10;
                    PositionSub()
                };
                b2.onclick = function() {
                    vars.subsize -= 10;
                    PositionSub()
                };
                var b3 = createElement('div');
                SetSubButStyle(b3, false);
                b3.innerHTML = '∧';
                CSS(b3, {
                    "margin": "0 5px 5px 0"
                });
                var b4 = createElement('div');
                SetSubButStyle(b4, false);
                b4.innerHTML = '∨';
                CSS(b4, {
                    "margin": "0 0 5px 0"
                });
                b3.onclick = function() {
                    vars.submargin += 10;
                    PositionSub()
                };
                b4.onclick = function() {
                    vars.submargin -= 10;
                    PositionSub()
                };
                var s1 = document.createElement('br');
                sub_menu2.appendChild(s1);
                var c = Array();
                var ccolors = Array("FFFFFF", "000000", "FAED54", "FFB0BE", "72CCF8", "62DE50", "E8BBFF", "FEBA54");
                var c_def = 2;
                for (var i = 0; i < 7; i++) {
                    c[i] = createElement('div');
                    SetSubButStyle(c[i], true);
                    CSS(c[i], {
                        "border": "1px solid #" + (i == 1 ? '666' : ccolors[i]),
                        "opacity": 0.7,
                        "color": "#" + (ccolors[i])
                    });
                    c[i].onclick = function() {
                        vars.subcolor = this.style.color;
                        isub_menu_color.style.opacity = 0.7;
                        this.style.opacity = 1;
                        isub_menu_color = this;
                        PositionSub()
                    };
                    vars.subcolor == ccolors[i] ? c_def = i : ''
                }
                c[c_def].style.opacity = 1;
                isub_menu_color = c[c_def];
                var s2 = document.createElement('br');
                sub_menu2.appendChild(s2);
                var cbg = Array();
                var cbgcolors = Array("FFFFFF", "000000", "FEF370", "D90000", "073DA0", "409829", "644082", "a56305");
                var cbg_def = 1;
                for (i = 0; i < 7; i++) {
                    cbg[i] = createElement('div');
                    SetSubButStyle(cbg[i], true);
                    CSS(cbg[i], {
                        "background-color": "#" + (cbgcolors[i]),
                        "borderColor": "#" + (i == 1 ? '666' : cbgcolors[i]),
                        "opacity": 0.7,
                        "color": "#fff"
                    });
                    i == 0 || i == 2 ? CSS(cbg[i], {
                        "color": "#000"
                    }) : '';
                    cbg[i].onclick = function() {
                        vars.subbgcolor = this.style.backgroundColor;
                        isub_menu_bgcolor.style.opacity = 0.7;
                        this.style.opacity = 1;
                        isub_menu_bgcolor = this;
                        PositionSub()
                    };
                    vars.subbgcolor == cbgcolors[i] ? cbg_def = i : ''
                }
                cbg[cbg_def].style.opacity = 1;
                isub_menu_bgcolor = cbg[cbg_def];
                var s3 = document.createElement('br');
                sub_menu2.appendChild(s3);
                var ca0 = createElement('div');
                sub_menu2.appendChild(ca0);
                CSS(ca0, {
                    "float": "left",
                    "margin": "0 2px 0 2px",
                    "cursor": "default"
                });
                ca0.innerHTML = '-';
                var ca = createElement('div');
                CSS(ca, {
                    "width": 91,
                    "height": 4,
                    "border": "1px solid #fff",
                    "borderRadius": 4,
                    "float": "left",
                    "margin": "5px 3px",
                    "cursor": "pointer"
                });
                sub_menu2.appendChild(ca);
                var ca2 = createElement('div');
                ca.appendChild(ca2);
                CSS(ca2, {
                    "width": (vars.subbgalpha * 100) + "%",
                    "height": 4,
                    "borderRadius": 4,
                    "background": "#fff"
                });
                var ca1 = createElement('div');
                sub_menu2.appendChild(ca1);
                CSS(ca1, {
                    "float": "left",
                    "margin": "0 0 0 2px",
                    "fontSize": "80%",
                    "cursor": "default"
                });
                ca1.innerHTML = '+';
                ca.onclick = function(e) {
                    var n = e.clientX - findLeft(this);
                    n < 5 ? n = 0 : '';
                    CSS(this.firstElementChild, {
                        'width': n
                    });
                    vars.subbgalpha = n / this.offsetWidth;
                    PositionSub()
                };
                if (vars.sublangs) {
                    var clang = document.createElement('select');
                    var clangs = vars.sublangs.split(',');
                    var subs = vars.sub_tmp.split(',');
                    for (var l = 0; l < clangs.length; l++) {
                        var cl = document.createElement('option');
                        CSS(cl, {
                            'backgroundColor': vars.selectbgcolor,
                            'color': vars.selectcolor
                        });
                        cl.innerHTML = clangs[l];
                        clang.appendChild(cl);
                        if (clangs[l] == vars.sublang) {
                            sub_lang = l;
                            cl.setAttribute("selected", "true")
                        }
                        if (subs[l] == '') {
                            cl.setAttribute("disabled", "true")
                        }
                    }
                    if (vars.sublangsall == 1 && clangs.length > 1) {
                        var cl = document.createElement('option');
                        CSS(cl, {
                            'backgroundColor': vars.selectbgcolor,
                            'color': vars.selectcolor
                        });
                        cl.innerHTML = vars.lang2['all'];
                        clang.appendChild(cl)
                    }
                    sub_menu2.appendChild(clang);
                    clang.onchange = function() {
                        if (vars.sublangsall == 1 && this.selectedIndex == this.length - 1) {
                            sub_lang = 0;
                            sub_lang_all = true
                        } else {
                            sub_lang_all = false;
                            sub_lang = this.selectedIndex
                        }
                    };
                    CSS(clang, {
                        'width': 120,
                        'cursor': 'pointer'
                    })
                }
                CSS(sub_menu_bg, {
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "background": "#000",
                    "width": sub_menu.offsetWidth,
                    "height": sub_menu.offsetHeight,
                    "opacity": "0.7",
                    "borderRadius": 10
                });
                PositionSub();
                sub_menu.style.zIndex = 7;
                sub_menu_bg.style.zIndex = 7
            }
        } else {
            ToggleSub()
        }
    }

    function ToggleSub() {
        if (vars.submenu == 1) {
            var el = sub_menu.firstElementChild.firstElementChild.firstElementChild;
            CSS(el, {
                "float": (vars.substart == 1 ? "left" : "right")
            })
        }
        if (sub) {
            vars.substart == 0 ? vars.substart = 1 : vars.substart = 0
        } else {
            if (vars.sub && vars.substart == 0) {
                CreateSubs();
                vars.substart = 1
            } else {
                vars.substart == 0 ? vars.substart = 1 : vars.substart = 0
            }
        }
        if (vars.substart == 0) {
            StopSub()
        }
        if (vars.submenu == 1) {
            ToggleSubStyle()
        } else {
            if (sub_b) {
                vars.substart ? CSS(sub_b.c, {
                    'opacity': sub_b.s.alpha
                }) : CSS(sub_b.c, {
                    'opacity': sub_b.s.alpha0
                })
            }
        }
    }

    function ToggleSubStyle() {
        vars.substart == 0 ? CSS(sub_menu2, {
            "visibility": "hidden"
        }) : CSS(sub_menu2, {
            "visibility": "visible"
        });
        CSS(document.getElementById("uppodplayer_sub_switcher_dot"), {
            "background": (vars.substart == 0 ? "#fff" : "#000")
        });
        CSS(document.getElementById("uppodplayer_sub_switcher_bg"), {
            "background": (vars.substart == 0 ? 0 : "#fff")
        })
    }

    function SetSubButStyle(b, small) {
        sub_menu2.appendChild(b);
        CSS(b, {
            "float": "left",
            "textAlign": "center",
            "width": (small ? 11 : 20),
            "height": (small ? 11 : "auto"),
            "border": "1px solid rgba(255,255,255,0.5)",
            "borderRadius": (small ? 11 : 20),
            "margin": (small ? "3px 2px 7px 2px" : 0),
            "padding": (small ? "0" : "0 0 0 0"),
            "cursor": "pointer"
        })
    }

    function Controls() {
        if (vars.youtube && browser.restrictMediaPlay) {}
        var controlsObj = uppod.controls();
        controlsObj.add(new Uppod.ControlBar(uppod));
        controls = controlsObj.ControlBar.dom;
        controls.onmouseover = function() {
            vars.controls_active = true
        };
        controls.onmouseout = function() {
            vars.controls_active = false
        };
        if (!mobile && vars.hotkey == 1 && vars.m == "video") {
            controls.addEventListener("dblclick", function(event) {
                event.stopPropagation()
            })
        }
        sep_b = [];
        sep = 0;
        CntrlBg();
        cntrl = vars.controls.split(',');
        cntrlength = 0;
        cntrls = [];
        cntrli = [];
        for (var i = 0; i < cntrl.length; i++) {
            if (cntrl[i] == 'play' || cntrl[i] == 'playstop') {
                play_b = new Element('play', 20, 20);
                controlsObj.addElement('Play', play_b);
                controls.appendChild(play_b.c);
                CSS(play_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - play_b.h) / 2 + play_b.s.margintop - play_b.s.marginbottom
                });
                play_b.c.onclick = Toggle;
                if (vars.tip == 1 && play_b.s.notip == 0) {
                    play_b.c.onmouseover = function() {
                        var txt = play_b.s.play_tip ? play_b.s.play_tip : vars.lang2['play'];
                        ToolTip(play_b.c, txt)
                    };
                    play_b.c.onmouseout = function() {
                        ToolTipHide(play_b.c)
                    }
                }
                pause_b = new Element((cntrl[i] == 'playstop' ? 'stop' : 'pause'), 20, 20, '', 'play');
                controlsObj.addElement('Pause', pause_b);
                controls.appendChild(pause_b.c);
                CSS(pause_b.c, {
                    'cursor': 'pointer',
                    'display': 'none',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - pause_b.h) / 2 + pause_b.s.margintop - pause_b.s.marginbottom
                });
                cntrl[i] == 'playstop' ? pause_b.c.onclick = Stop : pause_b.c.onclick = Toggle;
                cntrls[i] = pause_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + play_b.s.marginleft + play_b.s.marginright;
                cntrli[i] = play_b;
                if (vars.tip == 1 && pause_b.s.notip == 0) {
                    pause_b.c.onmouseover = function() {
                        ToolTip(pause_b.c, pause_b.s.pause_tip ? pause_b.s.pause_tip : vars.lang2['pause'])
                    };
                    pause_b.c.onmouseout = function() {
                        ToolTipHide(pause_b.c)
                    }
                }
            }
            if (cntrl[i] == 'back') {
                back_b = new Element('back', 30, 20);
                controlsObj.addElement('Back', back_b);
                controls.appendChild(back_b.c);
                CSS(back_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - back_b.h) / 2 + back_b.s.margintop - back_b.s.marginbottom
                });
                back_b.c.onclick = Back;
                cntrls[i] = back_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + back_b.s.marginleft + back_b.s.marginright;
                cntrli[i] = back_b;
                if (vars.tip == 1 && back_b.s.notip == 0) {
                    back_b.c.onmouseover = function() {
                        ToolTip(back_b.c, back_b.s.tip ? back_b.s.tip : vars.lang2['back'])
                    };
                    back_b.c.onmouseout = function() {
                        ToolTipHide(back_b.c)
                    }
                }
            }
            if (cntrl[i] == 'stop') {
                stop_b = new Element('stop', 20, 20);
                controlsObj.addElement('Stop', stop_b);
                controls.appendChild(stop_b.c);
                CSS(stop_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - stop_b.h) / 2 + stop_b.s.margintop - stop_b.s.marginbottom
                });
                stop_b.c.onclick = Stop;
                cntrls[i] = stop_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + stop_b.s.marginleft + stop_b.s.marginright;
                cntrli[i] = stop_b;
                if (vars.tip == 1 && stop_b.s.notip == 0) {
                    stop_b.c.onmouseover = function() {
                        ToolTip(stop_b.c, stop_b.s.tip ? stop_b.s.tip : vars.lang2['stop'])
                    };
                    stop_b.c.onmouseout = function() {
                        ToolTipHide(stop_b.c)
                    }
                }
            }
            if (cntrl[i].indexOf('my') == 0) {
                var m = cntrl[i].substr(2);
                mybuts[m] = new Element('my' + m, 20, 20);
                controls.appendChild(mybuts[m].c);
                CSS(mybuts[m].c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - mybuts[m].h) / 2 + mybuts[m].s.margintop - mybuts[m].s.marginbottom
                });
                mybuts[m].c.id = 'uppod_mybut' + m;
                mybuts[m].c.onclick = function() {
                    Mybut(this.id)
                };
                cntrls[i] = mybuts[m].w + vars.cntrlmargin;
                cntrlength += cntrls[i] + mybuts[m].s.marginleft + mybuts[m].s.marginright;
                cntrli[i] = mybuts[m];
                if (vars.tip == 1 && mybuts[m].s.notip == 0 && mybuts[m].s.tip) {
                    mybuts[m].c.onmouseover = function() {
                        var id = this.id;
                        if (id) {
                            var mm = id.substr(11);
                            ToolTip(mybuts[mm].c, mybuts[mm].s.tip)
                        }
                    };
                    mybuts[m].c.onmouseout = function() {
                        var id = this.id;
                        if (id) {
                            var mm = id.substr(11);
                            ToolTipHide(mybuts[m].c)
                        }
                    }
                }
            }
            if (cntrl[i] == 'download') {
                download_b = new Element('download', 20, 20);
                controlsObj.addElement('Download', download_b);
                controls.appendChild(download_b.c);
                CSS(download_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - download_b.h) / 2 + download_b.s.margintop - download_b.s.marginbottom
                });
                download_b.c.onclick = Download;
                cntrls[i] = download_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + download_b.s.marginleft + download_b.s.marginright;
                cntrli[i] = download_b;
                if (vars.tip == 1 && download_b.s.notip == 0) {
                    download_b.c.onmouseover = function() {
                        ToolTip(download_b.c, download_b.s.tip ? download_b.s.tip : vars.lang2['download'])
                    };
                    download_b.c.onmouseout = function() {
                        ToolTipHide(download_b.c)
                    }
                }
            }
            if (vars.pl != '') {
                if (cntrl[i] == 'next') {
                    next_b = new Element('next', 20, 20);
                    controlsObj.addElement('Next', next_b);
                    controls.appendChild(next_b.c);
                    CSS(next_b.c, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': (vars.cntrloutheight - next_b.h) / 2 + next_b.s.margintop - next_b.s.marginbottom
                    });
                    next_b.c.onclick = Next;
                    cntrls[i] = next_b.w + vars.cntrlmargin;
                    cntrlength += cntrls[i] + next_b.s.marginleft + next_b.s.marginright;
                    cntrli[i] = next_b;
                    if (vars.tip == 1 && next_b.s.notip == 0) {
                        next_b.c.onmouseover = function() {
                            ToolTip(next_b.c, next_b.s.tip ? next_b.s.tip : vars.lang2['next'])
                        };
                        next_b.c.onmouseout = function() {
                            ToolTipHide(next_b.c)
                        }
                    }
                }
                if (cntrl[i] == 'prev') {
                    prev_b = new Element('prev', 20, 20);
                    controlsObj.addElement('Prev', prev_b);
                    controls.appendChild(prev_b.c);
                    CSS(prev_b.c, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': (vars.cntrloutheight - prev_b.h) / 2 + prev_b.s.margintop - prev_b.s.marginbottom
                    });
                    if (vars.random == 0) {
                        CSS(prev_b.c, {
                            'opacity': 0.3,
                            'filter': 'alpha(opacity=30)',
                            'cursor': 'default'
                        })
                    }
                    prev_b.c.onclick = Prev;
                    cntrls[i] = prev_b.w + vars.cntrlmargin;
                    cntrlength += cntrls[i] + prev_b.s.marginleft + prev_b.s.marginright;
                    cntrli[i] = prev_b;
                    if (vars.tip == 1 && prev_b.s.notip == 0) {
                        prev_b.c.onmouseover = function() {
                            ToolTip(prev_b.c, prev_b.s.tip ? prev_b.s.tip : vars.lang2['prev'])
                        };
                        prev_b.c.onmouseout = function() {
                            ToolTipHide(prev_b.c)
                        }
                    }
                }
            }
            if (cntrl[i] == 'time_play') {
                time_play_b = new Element('time_play', 30, 20);
                controlsObj.addElement('TimePlay', time_play_b);
                controls.appendChild(time_play_b.c);
                CSS(time_play_b.c, {
                    'cursor': 'default',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - time_play_b.h) / 2 + 3 + time_play_b.s.margintop * 1 - time_play_b.s.marginbottom * 1,
                    'white-space': 'nowrap'
                });
                cntrls[i] = time_play_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + time_play_b.s.marginleft + time_play_b.s.marginright;
                cntrli[i] = time_play_b;
                timeitems++
            }
            if (cntrl[i] == 'time_back') {
                time_back_b = new Element('time_back', 30, 20);
                controlsObj.addElement('TimeBack', time_back_b);
                controls.appendChild(time_back_b.c);
                CSS(time_back_b.c, {
                    'cursor': 'default',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - time_back_b.h) / 2 + 3 + time_back_b.s.margintop * 1 - time_back_b.s.marginbottom * 1,
                    'white-space': 'nowrap'
                });
                cntrls[i] = time_back_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + time_back_b.s.marginleft + time_back_b.s.marginright;
                cntrli[i] = time_back_b;
                timeitems++
            }
            if (cntrl[i] == 'time_all') {
                time_all_b = new Element('time_all', 30, 20);
                controlsObj.addElement('TimeAll', time_all_b);
                controls.appendChild(time_all_b.c);
                CSS(time_all_b.c, {
                    'cursor': 'default',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - time_all_b.h) / 2 + 3 + time_all_b.s.margintop * 1 - time_all_b.s.marginbottom * 1,
                    'white-space': 'nowrap'
                });
                cntrls[i] = time_all_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + time_all_b.s.marginleft + time_all_b.s.marginright;
                cntrli[i] = time_all_b;
                timeitems++
            }
            if (cntrl[i] == '|') {
                sep_b[sep] = new Element('separator', 5, 20);
                controlsObj.addElement('Separator', sep_b[sep]);
                controls.appendChild(sep_b[sep].c);
                CSS(sep_b[sep].c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - sep_b[sep].h) / 2 + sep_b[sep].s.margintop - sep_b[sep].s.marginbottom
                });
                cntrls[i] = sep_b[sep].w + vars.cntrlmargin;
                cntrlength += cntrls[i] + sep_b[sep].s.marginleft + sep_b[sep].s.marginright;
                cntrli[i] = sep_b[sep];
                sep++
            }
            if (cntrl[i] == 'run_line') {
                var run_s = Cntrl_Style('run');
                run_b = createElement('div');
                controlsObj.addDom('RunLine', run_b);
                controls.appendChild(run_b);
                var lh = vars.cntrlline['h'];
                if (vars.cntrl_line) {
                    if (vars.cntrl_line['h']) {
                        lh = vars.cntrl_line['h']
                    }
                }
                if (run_s['position'] == 0) {
                    if (lh % 2 != run_s['h'] % 2) {
                        run_s['h']++
                    }
                    if (run_s['o'] == 1) {
                        run_s['w'] = run_s['h']
                    }
                }
                CSS(run_b, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'left': 0,
                    'top': run_s['margintop'] * 1 - run_s['marginbottom'] * 1,
                    'width': run_s['w'] + 'px',
                    'height': run_s['h'] + 'px',
                    'borderRadius': (run_s['w'] * run_s['o']) + 'px',
                    'opacity(': run_s['alpha'],
                    'filter': 'alpha(opacity=' + (run_s['alpha'] * 100) + ')'
                });
                CheckGradiendDiv(run_b, run_s['color']);
                if (run_s['icon']) {
                    if (String(run_s['icon']).indexOf("http") == 0) {
                        if (vars.https == 1) {
                            run_s['icon'] = run_s['icon'].replace("http://", "https://");
                            run_s['icon'] = run_s['icon'].replace("http://", "https://")
                        }
                        IconImg(run_s['icon'], run_b, 0, run_s['pic_w'], run_s['pic_h'], run_s['halficonisover'])
                    }
                }
                if (run_s['bg'] == 1) {
                    CSS(run_b, {
                        'border': '2px solid #' + ReColor(run_s['bgcolor'])
                    })
                }
                run_pos = run_s['position'];
                if (vars.tip == 1 && line_s['notip'] == 0) {
                    run_b.onmouseover = function() {
                        media.duration ? ToolTip(run_b, 'line') : ''
                    };
                    run_b.onmouseout = function() {
                        ToolTipHide(run_b)
                    }
                }
            }
            if (cntrl[i] == 'run_volume' && !mobile) {
                var run_s = Cntrl_Style('run_volume');
                runvolume_b = createElement('div');
                controlsObj.addDom('RunVolume', runvolume_b);
                controls.appendChild(runvolume_b);
                CSS(runvolume_b, {
                    'pointer-events': 'none',
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': run_s['w'] + 'px',
                    'height': run_s['h'] + 'px',
                    'borderRadius': (run_s['w'] * run_s['o']) + 'px',
                    'opacity': run_s['alpha'],
                    'filter': 'alpha(opacity=' + (run_s['alpha'] * 100) + ')'
                });
                CheckGradiendDiv(runvolume_b, run_s['color']);
                runvolume_pos = run_s['position'];
                if (vars.ivolbar_v) {
                    Hide(runvolume_b)
                }
                if (run_s['bg'] == 1) {
                    CSS(runvolume_b, {
                        'border': '2px solid #' + ReColor(run_s['bgcolor'])
                    })
                }
            }
            if (cntrl[i] == 'sound' && !mobile && vars.controls.indexOf("volbarline") > -1) {
                cntrl[i] = 'volume';
                vars.cntrl_volume = vars.cntrl_sound
            }
            if ((cntrl[i] == 'volume' || cntrl[i] == 'volbarline_v') && !mobile) {
                volume_b = new Element('volume', 20, 20);
                controlsObj.addElement('Volume', volume_b);
                controls.appendChild(volume_b.c);
                CSS(volume_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - volume_b.h) / 2 + volume_b.s.margintop - volume_b.s.marginbottom
                });
                volume_b.c.onclick = Mute;
                volume_mute_b = new Element('volume_mute', 20, 20, '', 'volume');
                controlsObj.addElement('VolumeMute', volume_mute_b);
                controls.appendChild(volume_mute_b.c);
                CSS(volume_mute_b.c, {
                    'display': 'none',
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - volume_mute_b.h) / 2 + volume_mute_b.s.margintop - volume_mute_b.s.marginbottom
                });
                cntrls[i] = volume_mute_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + volume_mute_b.s.marginleft + volume_mute_b.s.marginright;
                volume_mute_b.c.onclick = Mute;
                cntrli[i] = volume_b;
                if (vars.tip == 1 && volume_b.s.notip == 0) {
                    volume_b.c.addEventListener("mouseover", function() {
                        var txt = vars.lang2['sound'];
                        ToolTip(volume_b.c, txt)
                    });
                    volume_b.c.addEventListener("mouseout", function() {
                        ToolTipHide(volume_b.c)
                    });
                    volume_mute_b.c.addEventListener("mouseover", function() {
                        var txt = vars.lang2['sound_off'];
                        ToolTip(volume_mute_b.c, txt)
                    });
                    volume_mute_b.c.addEventListener("mouseout", function() {
                        ToolTipHide(volume_mute_b.c)
                    })
                }
                if (cntrl[i] == 'volbarline_v') {
                    vars.ivolbar_v = true;
                    volbarline_b = createElement('div');
                    controlsObj.addDom('VolumeBarlineV', volbarline_b);
                    controls.appendChild(volbarline_b);
                    vars.cntrl_volbarline_v.bg = 0;
                    CSS(volbarline_b, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': 0
                    });
                    volbarline_s = Cntrl_Style('volbarline_v');
                    volbarline_all_b = createElement('div');
                    volbarline_b.appendChild(volbarline_all_b);
                    CSS(volbarline_all_b, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'left': 0,
                        'top': 0,
                        'width': volbarline_s['w'],
                        'height': volbarline_s['h'],
                        'borderRadius': ((volbarline_s['h'] / 2) * volbarline_s['o']) + 'px',
                        'opacity': volbarline_s['all_a'],
                        'filter': 'alpha(opacity=' + (volbarline_s['all_a'] * 100) + ')'
                    });
                    CheckGradiendDiv(volbarline_all_b, volbarline_s['color_all']);
                    volbarline_s['active'] = false;
                    CSS(volbarline_b, {
                        'display': 'none',
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': (vars.cntrloutheight - volbarline_s['h']) - 10
                    });
                    volbarline_play_b = createElement('div');
                    volbarline_b.appendChild(volbarline_play_b);
                    CSS(volbarline_play_b, {
                        'pointer-events': 'none',
                        'position': 'absolute',
                        'left': 0,
                        'top': 0,
                        'width': volbarline_s['w'],
                        'height': volbarline_s['h'],
                        'borderRadius': ((volbarline_s['h'] / 2) * volbarline_s['o']) + 'px',
                        'opacity': volbarline_s['play_a'],
                        'filter': 'alpha(opacity=' + (volbarline_s['play_a'] * 100) + ')'
                    });
                    if (volbarline_s['color_load']) {
                        volbarline_s['color_play'] = volbarline_s['color_load']
                    }
                    CheckGradiendDiv(volbarline_play_b, volbarline_s['color_play']);
                    CSS(volbarline_b, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': (-volbarline_s['h'])
                    });
                    CSS(volbarline_play_b, {
                        'height': volbarline_s['h'] * vars.volume,
                        'top': volbarline_s['h'] - volbarline_s['h'] * vars.volume
                    });
                    volbarline_b.onmousedown = function VolbarlineDown(e) {
                        volbarline_s['active'] = true;
                        if (!e) var e = window.event;
                        VolumeMove_v(e)
                    };
                    volbarline_b.onmousemove = function VolbarlineMove(e) {
                        if (!e) var e = window.event;
                        VolumeMove_v(e)
                    };
                    volbarline_b.onmouseup = function VolbarlineUp(e) {
                        volbarline_s['active'] = false
                    };
                    volbarline_b.onmouseover = function VolbarlineOver(e) {
                        volbarline_s['over'] = true
                    };
                    volbarline_b.onmouseout = function VolbarlineOut(e) {
                        volbarline_s['over'] = false
                    };
                    volume_mute_b.c.addEventListener("mouseover", VolumeButOver);
                    volume_b.c.addEventListener("mouseout", VolumeButOver);
                    volume_mute_b.c.addEventListener("mouseout", VolumeButOver);
                    volume_b.c.addEventListener("mouseover", VolumeButOver);
                    volume_mute_b.c.onmouseout = volume_b.c.onmouseout = VolbarHide;
                    volbarline_b.style.zIndex = 7;
                    if (runvolume_b) {
                        Hide(runvolume_b)
                    }
                }
            }
            if (cntrl[i] == 'tune' && !mobile) {
                cntrl[i] = 'volbarline';
                vars.cntrl_volbarline = vars.cntrl_tune
            }
            if (cntrl[i] == 'volbarline' && !mobile) {
                volbarline_b = createElement('div');
                controlsObj.addDom('VolumeBarline', volbarline_b);
                controls.appendChild(volbarline_b);
                volbarline_s = Cntrl_Style('volbarline');
                var volbarline_bg_b = createElement('div');
                volbarline_b.appendChild(volbarline_bg_b);
                CSS(volbarline_bg_b, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'left': 0,
                    'top': -10,
                    'width': volbarline_s['w'],
                    'height': (volbarline_s['h'] + 20),
                    'opacity': '0',
                    'filter': 'alpha(opacity=0)'
                });
                volbarline_all_b = createElement('div');
                volbarline_b.appendChild(volbarline_all_b);
                CSS(volbarline_all_b, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': volbarline_s['w'],
                    'height': volbarline_s['h'],
                    'borderRadius': ((volbarline_s['h'] / 2) * volbarline_s['o']) + 'px',
                    'opacity': volbarline_s['all_a'],
                    'filter': 'alpha(opacity=' + (volbarline_s['all_a'] * 100) + ')'
                });
                CheckGradiendDiv(volbarline_all_b, volbarline_s['color_all']);
                volbarline_s['active'] = false;
                volbarline_play_b = createElement('div');
                volbarline_b.appendChild(volbarline_play_b);
                CSS(volbarline_play_b, {
                    'pointer-events': 'none',
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'height': volbarline_s['h'],
                    'borderRadius': ((volbarline_s['h'] / 2) * volbarline_s['o']) + 'px',
                    'opacity': volbarline_s['play_a'],
                    'filter': 'alpha(opacity=' + (volbarline_s['play_a'] * 100) + ')'
                });
                if (volbarline_s['color_load']) {
                    volbarline_s['color_play'] = volbarline_s['color_load']
                }
                CheckGradiendDiv(volbarline_play_b, volbarline_s['color_play']);
                CSS(volbarline_b, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - volbarline_s['h']) / 2 + volbarline_s['margintop'] - volbarline_s['marginbottom']
                });
                cntrls[i] = volbarline_s['w'] + vars.cntrlmargin + 5;
                cntrlength += cntrls[i] + volbarline_s['marginleft'] + volbarline_s['marginright'];
                CSS(volbarline_play_b, {
                    'width': volbarline_s['w'] * (v ? v : vars.volume)
                });
                volbarline_b.onmousedown = function(e) {
                    volbarline_s['active'] = true;
                    if (!e) var e = window.event;
                    VolumeMove(e)
                };
                volbarline_b.onmousemove = function(e) {
                    if (!e) var e = window.event;
                    VolumeMove(e)
                };
                volbarline_b.onmouseout = function(e) {
                    if (!e) var e = window.event;
                    VolumeOut(e)
                };
                volbarline_b.onmouseup = function(e) {};
                cntrli[i] = volbarline_b
            }
            if (cntrl[i] == 'volbar' && !mobile) {
                volbar_b = createElement('div');
                controlsObj.addDom('VolumeBar', volbar_b);
                controls.appendChild(volbar_b);
                volbars = [];
                vars.cntrl_volbar.all_a ? vars.cntrlvolbar.all_a = vars.cntrl_volbar.all_a : '';
                vars.cntrl_volbar.play_a ? vars.cntrlvolbar.play_a = vars.cntrl_volbar.play_a : '';
                if (vars.cntrl_volbar.icon) {
                    if (vars.cntrl_volbar.icon == 1) {
                        vars.cntrlvolbar.n = 10;
                        vars.cntrlvolbar.bar = 1
                    }
                    if (vars.cntrl_volbar.icon == 2) {
                        vars.cntrlvolbar.n = 5;
                        vars.cntrlvolbar.bar = 0
                    }
                    if (vars.cntrl_volbar.icon == 3) {
                        vars.cntrlvolbar.n = 10;
                        vars.cntrlvolbar.bar = 0
                    }
                }
                vars.cntrl_volbar.n ? vars.cntrlvolbar.n = vars.cntrl_volbar.n : '';
                vars.cntrl_volbar.bar ? vars.cntrlvolbar.bar = vars.cntrl_volbar.bar : '';
                vars.cntrl_volbar.scale ? vars.cntrlvolbar.scale = vars.cntrl_volbar.scale : '';
                vars.cntrl_volbar.margintop ? vars.cntrlvolbar.margintop = vars.cntrl_volbar.margintop : vars.cntrlvolbar.margintop = 0;
                vars.cntrl_volbar.marginbottom ? vars.cntrlvolbar.marginbottom = vars.cntrl_volbar.marginbottom : vars.cntrlvolbar.marginbottom = 0;
                vars.cntrlvolbar.w = vars.cntrlvolbar.n * 5 * vars.cntrlvolbar.scale;
                vars.cntrlvolbar.h = 10 * vars.cntrlvolbar.scale;
                for (vb = 0; vb < vars.cntrlvolbar.n; vb++) {
                    var vbh = (vars.cntrlvolbar.bar == 1 ? (10 / vars.cntrlvolbar.n) * (vb + 1) : 10 * vars.cntrlvolbar.scale);
                    volbars[vb] = new Element('volbar', 3 * vars.cntrlvolbar.scale, vbh);
                    volbar_b.appendChild(volbars[vb].c);
                    CSS(volbars[vb].c, {
                        'position': 'absolute',
                        'top': 10 * vars.cntrlvolbar.scale - vbh * vars.cntrlvolbar.scale,
                        'left': vb * 5 * vars.cntrlvolbar.scale + 10 * (vars.cntrlvolbar.scale - 1),
                        'opacity': vars.cntrlvolbar.all_a
                    });
                    if (vars.cntrl_volbar.bar == 1) {
                        volbars[vb].c.onmouseover = function(e) {
                            CSS(this, {
                                'top': vbh - 1
                            })
                        };
                        volbars[vb].c.onmouseout = function(e) {
                            CSS(this, {
                                'top': vbh
                            })
                        }
                    }
                };
                volbar_b.onmousedown = function(e) {
                    volbar_b.active = true;
                    if (!e) var e = window.event;
                    VolbarMove(e)
                };
                volbar_b.onmousemove = function(e) {
                    if (!e) var e = window.event;
                    VolbarMove(e)
                };
                volbar_b.onmouseup = function(e) {
                    volbar_b.active = false
                };
                CSS(volbar_b, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - vars.cntrlvolbar.h) / 2 + (vars.cntrlvolbar.h - 10) * vars.cntrlvolbar.scale + vars.cntrlvolbar.margintop - vars.cntrlvolbar.marginbottom,
                    'width': vars.cntrlvolbar.w,
                    'height': vars.cntrlvolbar.h
                });
                cntrls[i] = (vars.cntrlvolbar.n + 1) * 5 + vars.cntrlmargin;
                cntrlength += cntrls[i] + (vars.cntrlvolbar.marginleft ? vars.cntrlvolbar.marginleft : 0) + (vars.cntrlvolbar.marginright ? vars.cntrlvolbar.marginright : 0);
                cntrli[i] = volbar_b;
                v != 0 ? VolumeDraw(-v) : ''
            }
            if (cntrl[i] == 'full') {
                controlsObj.add(new Uppod.EnterFullscreenControl(uppod));
                controlsObj.add(new Uppod.ExitFullscreenControl(uppod));
                full_b = uppod.controls().EnterFullscreen.options.element;
                full_back_b = uppod.controls().ExitFullscreen.options.element;
                cntrls[i] = full_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + full_b.s.marginleft + full_b.s.marginright;
                cntrli[i] = full_b;
                if (vars.tip == 1 && full_b.s.notip == 0) {
                    full_b.c.onmouseover = function() {
                        ToolTip(full_b.c, (full_b.s.tip ? full_b.s.tip : vars.lang2['full']))
                    };
                    full_b.c.onmouseout = function() {
                        ToolTipHide(full_b.c)
                    };
                    full_back_b.c.onmouseover = function() {
                        ToolTip(full_back_b.c, (full_back_b.s.tip ? full_back_b.s.tip : vars.lang2['full_back']))
                    };
                    full_back_b.c.onmouseout = function() {
                        ToolTipHide(full_back_b.c)
                    }
                }
            }
            if (cntrl[i] == 'sub') {
                sub_b = new Element('sub', 20, 20);
                controlsObj.addElement('Sub', sub_b);
                controls.appendChild(sub_b.c);
                CSS(sub_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - sub_b.h) / 2 + sub_b.s.margintop - sub_b.s.marginbottom
                });
                sub_b.c.onclick = SetSub;
                cntrls[i] = sub_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + sub_b.s.marginleft + sub_b.s.marginright;
                cntrli[i] = sub_b;
                if (vars.tip == 1 && sub_b.s.notip == 0) {
                    sub_b.c.onmouseover = function() {
                        ToolTip(sub_b.c, sub_b.s.tip ? sub_b.s.tip : vars.lang2['sub'])
                    };
                    sub_b.c.onmouseout = function() {
                        ToolTipHide(sub_b.c)
                    }
                }
                vars.substart == 0 ? CSS(sub_b.c, {
                    'opacity': sub_b.s.alpha0
                }) : ''
            }
            if (cntrl[i] == 'hd') {
                if (vars.youtube) {
                    vars.hdlinks = 'hd720,large,medium,small,auto';
                    vars.hd = '720p,480p,320p,240p,auto';
                    vars.hdsw == 60 ? vars.hdsw = 55 : '';
                    vars.filehd = ''
                }
                if (vars.hd || vars.filehd != '') {
                    var isbutton = false;
                    if (vars.hd) {
                        vars.hd.indexOf('::') > -1 ? isbutton = true : ''
                    } else {
                        vars.filehd != '' ? isbutton = true : ''
                    }
                    if (isbutton) {
                        hd_b = new Element('hd', 20, 20);
                        controlsObj.addElement('Hd', hd_b);
                        controls.appendChild(hd_b.c);
                        CSS(hd_b.c, {
                            'cursor': 'pointer',
                            'display': (vars.hd1 == 1 ? 'none' : 'block'),
                            'position': 'absolute',
                            'top': Math.floor((vars.cntrloutheight - hd_b.h) / 2 + hd_b.s.margintop - hd_b.s.marginbottom)
                        });
                        if (hd_b.s.icon2) {
                            if (hd_b.s.icon == hd_b.s.icon2) {
                                CSS(hd_b.c, {
                                    'opacity': hd_b.s.alpha0
                                })
                            }
                        }
                        cntrls[i] = hd_b.w + vars.cntrlmargin;
                        hd_b.c.onclick = Quality;
                        cntrlength += cntrls[i] + hd_b.s.marginleft + hd_b.s.marginright;
                        cntrli[i] = hd_b;
                        if (vars.tip == 1 && hd_b.s.notip == 0) {
                            hd_b.c.onmouseover = function() {
                                ToolTip(hd_b.c, hd_b.s.tip ? hd_b.s.tip : vars.lang2['hd'])
                            };
                            hd_b.c.onmouseout = function() {
                                ToolTipHide(hd_b.c)
                            }
                        }
                        hd1_b = new Element('hd1', 20, 20, '', 'hd');
                        controlsObj.addElement('Hd1', hd1_b);
                        controls.appendChild(hd1_b.c);
                        CSS(hd1_b.c, {
                            'cursor': 'pointer',
                            'display': (vars.hd1 == 1 ? 'block' : 'none'),
                            'position': 'absolute',
                            'top': Math.floor((vars.cntrloutheight - hd1_b.h) / 2 + hd1_b.s.margintop - hd1_b.s.marginbottom)
                        });
                        hd1_b.c.onclick = Quality;
                        if (vars.tip == 1 && hd1_b.s.notip == 0) {
                            hd1_b.c.onmouseover = function() {
                                ToolTip(hd1_b.c, hd_b.s.tip_off ? hd_b.s.tip_off : vars.lang2['hd'])
                            };
                            hd1_b.c.onmouseout = function() {
                                ToolTipHide(hd1_b.c)
                            }
                        }
                    } else {
                        if (vars.hd.indexOf(',') > -1) {
                            vars.hda = vars.hd.split(',');
                            if (vars.hdsw == 60 && vars.hlsautoquality == 0) {
                                vars.hdsw = 0;
                                for (var h = 0; h < vars.hda.length; h++) {
                                    vars.hdsw < measureText(vars.hda[h], 12).width ? vars.hdsw = measureText(vars.hda[h], 12).width : ''
                                }
                                vars.hdsw += 22
                            }
                            hd_b = new Element('hdselect', vars.hdsw, 20, '', 'hd');
                            controlsObj.addElement('HdSelect', hd_b);
                            controls.appendChild(hd_b.c);
                            CSS(hd_b.c, {
                                'cursor': 'pointer',
                                'position': 'absolute',
                                'top': Math.floor((vars.cntrloutheight - hd_b.h) / 2 + hd_b.s.margintop - hd_b.s.marginbottom)
                            });
                            cntrls[i] = hd_b.w + vars.cntrlmargin;
                            cntrlength += cntrls[i] + hd_b.s.marginleft + hd_b.s.marginright;
                            cntrli[i] = hd_b;
                            vars.tip == 1 && hd_b.s.notip == 0 ? hd_b.c.title = (hd_b.s.tip ? hd_b.s.tip : vars.lang2['hd']) : '';
                            hdselect = document.createElement('select');
                            hd_b.c.appendChild(hdselect);
                            HdSelect();
                            CSS(hdselect, {
                                'position': 'absolute',
                                'margin': '1px 0px 0px -5px',
                                'opacity': 0,
                                'cursor': 'pointer',
                                "width": vars.hdsw
                            });
                            hdselect.onchange = QualitySelecter
                        }
                    }
                }
            }
            if (cntrl[i] == 'playlist') {
                if (vars.pl != '') {
                    playlist_b = new Element('playlist', 20, 20);
                    controlsObj.addElement('Playlist', playlist_b);
                    controls.appendChild(playlist_b.c);
                    CSS(playlist_b.c, {
                        'cursor': 'pointer',
                        'position': 'absolute',
                        'top': (vars.cntrloutheight - playlist_b.h) / 2 + playlist_b.s.margintop - playlist_b.s.marginbottom
                    });
                    playlist_b.c.onclick = Pl;
                    cntrls[i] = playlist_b.w + vars.cntrlmargin;
                    cntrlength += cntrls[i] + playlist_b.s.marginleft + playlist_b.s.marginright;
                    cntrli[i] = playlist_b;
                    if (vars.tip == 1 && playlist_b.s.notip == 0) {
                        playlist_b.c.onmouseover = function() {
                            ToolTip(playlist_b.c, playlist_b.s.tip ? playlist_b.s.tip : vars.lang2['list'])
                        };
                        playlist_b.c.onmouseout = function() {
                            ToolTipHide(playlist_b.c)
                        }
                    }
                }
            }
            if (cntrl[i] == 'menu') {
                menu_b = new Element('menu', 20, 20);
                controlsObj.addElement('Menu', menu_b);
                controls.appendChild(menu_b.c);
                CSS(menu_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - menu_b.h) / 2 + menu_b.s.margintop - menu_b.s.marginbottom
                });
                menu_b.c.onclick = Menu;
                cntrls[i] = menu_b.w + vars.cntrlmargin;
                cntrlength += cntrls[i] + menu_b.s.marginleft + menu_b.s.marginright;
                cntrli[i] = menu_b;
                if (vars.tip == 1 && menu_b.s.notip == 0) {
                    menu_b.c.onmouseover = function() {
                        ToolTip(menu_b.c, menu_b.s.tip ? menu_b.s.tip : vars.lang2['menu'])
                    };
                    menu_b.c.onmouseout = function() {
                        ToolTipHide(menu_b.c)
                    }
                }
            }
            if (cntrl[i] == 'buffer') {
                if (line_b) {
                    buffer_b = new Element('buffer', 30, 14);
                    controlsObj.addElement('Buffer', buffer_b);
                    controls.appendChild(buffer_b.c);
                    CSS(buffer_b.c, {
                        'cursor': 'default',
                        'position': 'absolute',
                        'white-space': 'nowrap'
                    });
                    cntrli[i] = buffer_b;
                    cntrls[i] = 0;
                    buffer_b.c.innerHTML = vars.lang2['loading']
                }
            }
            if (cntrl[i] == 'start') {
                start_b = new Element('start', 20, 20);
                controlsObj.addElement('Start', start_b);
                body.c.appendChild(start_b.c);
                CSS(start_b.c, {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'top': ((vars.ph) / 2 - start_b.h / 2),
                    'left': ((vars.sw) / 2 - start_b.w / 2),
                    'zIndex': 7
                });
                start_b.c.onclick = Toggle;
                start_b.c.style.zIndex = 7
            }
            if (cntrl[i] == 'space') {
                space_b = createElement('div');
                controlsObj.addDom('Space', space_b);
                controls.appendChild(space_b);
                CSS(space_b, {
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - 20) / 2
                });
                cntrli[i] = space_b
            }
            if (cntrl[i] == 'line') {
                iline = true;
                line_b = createElement('div');
                controlsObj.addDom('Line', line_b);
                controls.appendChild(line_b);
                line_s = Cntrl_Style('line');
                line_all_b = createElement('div');
                line_b.appendChild(line_all_b);
                CSS(line_all_b, {
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': line_s['h'],
                    'borderRadius': ((line_s['h'] / 2) * line_s['o']) + 'px',
                    'opacity': line_s['all_a'],
                    'filter': 'alpha(opacity=' + (line_s['all_a'] * 100) + ')'
                });
                CheckGradiendDiv(line_all_b, line_s['color_all']);
                line_load_b = createElement('div');
                line_b.appendChild(line_load_b);
                CSS(line_load_b, {
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': line_s['h'],
                    'backgroundColor': '#' + ReColor(line_s['color_load']),
                    'borderRadius': ((line_s['h'] / 2) * line_s['o']) + 'px',
                    'opacity': line_s['load_a'],
                    'filter': 'alpha(opacity=' + (line_s['load_a'] * 100) + ')'
                });
                CheckGradiendDiv(line_load_b, line_s['color_load']);
                line_play_b = createElement('div');
                line_b.appendChild(line_play_b);
                CSS(line_play_b, {
                    'position': 'absolute',
                    'left': 0,
                    'top': 0,
                    'width': '100%',
                    'height': line_s['h'],
                    'backgroundColor': '#' + ReColor(line_s['color_play']),
                    'borderRadius': ((line_s['h'] / 2) * line_s['o']) + 'px',
                    'opacity': line_s['play_a'],
                    'filter': 'alpha(opacity=' + (line_s['play_a'] * 100) + ')'
                });
                CheckGradiendDiv(line_play_b, line_s['color_play']);
                CSS(line_b, {
                    'position': 'absolute',
                    'top': (vars.cntrloutheight - line_s['h']) / 2 + line_s['margintop'] * 1 - line_s['marginbottom'] * 1,
                    'cursor': 'pointer'
                });
                CSS(line_play_b, {
                    'width': '0'
                });
                CSS(line_load_b, {
                    'width': '0'
                });
                line_s['active'] = false;
                line_but_b = createElement('div');
                controlsObj.addDom('LineBtn', line_but_b);
                controls.appendChild(line_but_b);
                CSS(line_but_b, {
                    'position': 'absolute',
                    'height': (line_s['h'] < 10 ? 20 : line_s['h'] * 2),
                    'cursor': 'pointer'
                });
                line_but_b.onmousedown = function(e) {
                    Uppod.trace('line_but_b.onmousedown');
                    if (!istart) {
                        Toggle()
                    }
                    line_s['active'] = true;
                    if (!e) var e = window.event
                };
                line_but_b.onmouseup = function(e) {
                    Uppod.trace('line_but_b.onmouseup');
                    if (istart) {
                        SeekMove(e);
                        line_s['active'] = false
                    }
                };
                if (vars.tip == 1 && line_s['notip'] == 0) {
                    line_but_b.onmouseover = function() {
                        ToolTip(line_but_b, 'line')
                    };
                    line_but_b.onmouseout = function() {
                        ToolTipHide(line_but_b)
                    }
                }
                cntrli[i] = line_b
            }
        }
        time_all_b && vars.time > 0 ? time_all_b.c.innerHTML = formatTime(vars.time) : '';
        PlaceControls()
    }

    function CntrlBg() {
        if (uibg) {
            Remove('uibg')
        }
        if (vars.cntrlout != 1 && vars.cntrlbg == 1) {
            vars.cntrlbgcolor.indexOf('|') == -1 ? vars.cntrlbgcolor = vars.cntrlbgcolor + '|' + vars.cntrlbgcolor : '';
            uibg = new Shaper2({
                w: (vars.scrn_w - vars.cntrlbgmargin * 2 - vars.cntrlbgmarginleft - vars.cntrlbgmarginright),
                h: vars.cntrloutheight,
                onotop: (vars.cntrloutheight == vars.h ? 0 : 1),
                bgc: vars.cntrlbgcolor,
                bga1: vars.cntrlbgalpha1,
                bga2: vars.cntrlbgalpha2,
                o: (vars.padding > 0 ? vars.o / 2 : vars.cntrlbgo)
            })
        }
        if (vars.cntrlout == 1 && vars.padding == 0) {
            vars.cntrlbgcolor.indexOf('|') == -1 ? vars.cntrlbgcolor = vars.cntrlbgcolor + '|' + vars.cntrlbgcolor : '';
            uibg = new Shaper2({
                w: vars.scrn_w,
                h: vars.cntrloutheight,
                o: vars.o / 2 - vars.padding,
                onotop: (vars.cntrloutheight == vars.h ? 0 : 1),
                bgc: vars.bodycolor,
                bga1: 1,
                bga2: 1,
                o: (vars.padding > 0 ? vars.o / 2 : vars.cntrlbgo)
            })
        }
        if (uibg) {
            uibg.c.setAttribute('id', 'uibg');
            controls.appendChild(uibg.c);
            CSS(uibg.canvas, {
                "position": "absolute",
                "top": 0,
                "left": vars.cntrlbgmarginleft + 'px'
            });
            if (vars.glass == 1) {
                uibg_gl = new Shaper2({
                    w: vars.scrn_w,
                    h: vars.cntrloutheight / 2,
                    o: vars.o / 2 - vars.padding,
                    bgc: (vars.glasscolor.indexOf('|') == -1 ? vars.glasscolor + '|' + vars.glasscolor : vars.glasscolor),
                    bga1: vars.glassalpha1,
                    bga2: vars.glassalpha2
                });
                uibg.c.appendChild(uibg_gl.c);
                CSS(uibg_gl.canvas, {
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "height": vars.cntrloutheight / 2,
                    "width": vars.scrn_w
                })
            }
        }
    }

    function PlaceControls() {
        var line_w = vars.sw - cntrlength - vars.cntrlendmargin * 2 - vars.cntrlmargin * 2 - (!ifull ? vars.padding * 2 : 0) - vars.cntrlmarginleft - vars.cntrlmarginright - (timelength - 4) * 4 * timeitems;
        var cntrl_x = vars.cntrlendmargin + vars.cntrlmarginleft;
        var marginleft;
        var marginright;
        for (i = 0; i < cntrl.length; i++) {
            if (cntrli[i]) {
                marginleft = 0;
                marginright = 0;
                if (cntrli[i].s) {
                    marginleft = parseInt(cntrli[i].s.marginleft);
                    marginright = parseInt(cntrli[i].s.marginright)
                }
                if (cntrl[i] == 'volbarline') {
                    marginleft = (vars.cntrl_volbarline.marginleft ? vars.cntrl_volbarline.marginleft : 0);
                    marginright = (vars.cntrl_volbarline.marginright ? vars.cntrl_volbarline.marginright : 0)
                }
                cntrl_x += marginleft;
                if (cntrli[i] != line_b && cntrli[i] != space_b) {
                    CSS((cntrli[i].c != undefined ? cntrli[i].c : cntrli[i]), {
                        'left': cntrl_x
                    });
                    if (cntrl[i] == 'play' || cntrl[i] == 'playstop') {
                        CSS(pause_b.c, {
                            'left': cntrl_x
                        })
                    }
                    if (cntrl[i] == 'full') {
                        CSS(full_back_b.c, {
                            'left': cntrl_x
                        })
                    }
                    if (cntrl[i] == 'hd') {
                        hd1_b ? CSS(hd1_b.c, {
                            'left': cntrl_x
                        }) : ''
                    }
                    if (cntrl[i] == 'volume' || cntrl[i] == 'volbarline_v') {
                        CSS(volume_mute_b.c, {
                            'left': cntrl_x,
                            'opacity': (volume_mute_b.s.icon == 2 ? 0.5 : 1)
                        })
                    }
                    if (cntrl[i] == 'volbarline_v') {
                        CSS(volbarline_b, {
                            'left': cntrl_x + volume_b.w / 2 - volbarline_s['w'] / 2
                        })
                    }
                    if (cntrl[i].indexOf('time') > -1) {
                        cntrl_x += (timelength - 4) * 4 + (vars.cntrlmargin - 5)
                    }
                    cntrl_x += Math.floor(cntrls[i] + marginright)
                } else {
                    if (cntrli[i] == line_b) {
                        if (vars.cntrl_line.full == 1) {
                            CSS(line_b, {
                                'left': (vars.cntrl_line.marginleft ? vars.cntrl_line.marginleft : 0),
                                'top': (vars.cntrloutheight) / 2 + line_all_b.h - (vars.cntrl_line.marginbottom ? vars.cntrl_line.marginbottom : 0) + (vars.cntrl_line.margintop ? vars.cntrl_line.margintop : 0)
                            });
                            line_all_b.w = vars.sw - (vars.cntrl_line.marginleft ? vars.cntrl_line.marginleft : 0) - (vars.cntrl_line.marginright ? vars.cntrl_line.marginright : 0);
                            line_play_b.w = line_all_b.w;
                            line_load_b.w = line_all_b.w;
                            CSS(line_all_b, {
                                'width': '' + line_all_b.w + 'px'
                            })
                        } else {
                            CSS(line_b, {
                                'left': cntrl_x + 3 + (vars.cntrl_line.marginleft ? vars.cntrl_line.marginleft : 0)
                            });
                            line_all_b.w = line_w;
                            line_play_b.w = line_w;
                            line_load_b.w = line_w;
                            CSS(line_all_b, {
                                'width': '' + line_w + 'px'
                            });
                            cntrls[i] = line_w;
                            cntrl_x += Math.floor(cntrls[i] + vars.cntrlmargin + 6 + (vars.cntrl_line.marginright ? vars.cntrl_line.marginright : 0) + (vars.cntrl_line.marginleft ? vars.cntrl_line.marginleft : 0))
                        }
                        CSS(line_but_b, {
                            'width': line_all_b.w + 'px',
                            'position': 'absolute',
                            'top': (parseInt(line_b.style.top) + line_s.h / 2 - parseInt(line_but_b.style.height) / 2),
                            'left': line_b.style.left,
                            'cursor': 'pointer'
                        })
                    }
                    if (cntrli[i] == space_b) {
                        CSS(space_b, {
                            'left': cntrl_x + 3,
                            'width': '' + line_w + 'px'
                        });
                        cntrls[i] = line_w;
                        cntrl_x += Math.floor(cntrls[i] + vars.cntrlmargin + 6)
                    }
                }
                if (buffer_b) {
                    CSS(buffer_b.c, {
                        'left': line_b.offsetLeft
                    });
                    CSS(buffer_b.c, {
                        'top': line_b.offsetTop - 10
                    })
                }
            }
        }
        line_b && run_b ? RunPos(run_b, line_b, line_play_b, line_all_b, run_pos) : '';
        if (volbarline_b && runvolume_b) {
            RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos)
        }
    }

    function RunPos(run, line, line_play, line_all, pos) {
        if (run == runvolume_b && vars.ivolbar_v) {
            var rl = (-line_play.offsetHeight) - (pos > 0 ? run.offsetHeight : run.offsetHeight / 2);
            rl < line.offsetTop ? rl = line.offsetTop : '';
            rl > 0 + run.offsetHeight ? rl = run.offsetHeight : '';
            CSS(run, {
                'top': rl + 'px',
                'left': '' + (line.offsetLeft + line_all.offsetWidth / 2 - run.offsetWidth / 2 - (pos == '1' ? run.offsetWidth / 2 + line_all.offsetWidth / 2 : 0) + (pos == '2' ? run.offsetWidth / 2 + line_all.offsetWidth / 2 : 0)) + 'px'
            })
        } else {
            var rl = (line_play.offsetWidth + line.offsetLeft) - (pos > 0 ? run.offsetWidth : run.offsetWidth / 2);
            rl < line.offsetLeft ? rl = line.offsetLeft : '';
            rl > line.offsetLeft + line_all.offsetWidth - run.offsetWidth ? rl = line.offsetLeft + line_all.offsetWidth - run.offsetWidth : '';
            CSS(run, {
                'left': rl + 'px',
                'top': '' + Math.floor(line_all.offsetTop + line.offsetTop + line_all.offsetHeight / 2 - run.offsetHeight / 2 - (pos == '1' ? run.offsetHeight / 2 + line_all.offsetHeight / 2 : 0) + (pos == '2' ? run.offsetHeight / 2 + line_all.offsetHeight / 2 : 0) + (vars.cntrl_run['margintop'] ? vars.cntrl_run['margintop'] * 1 : "") - (vars.cntrl_run['marginbottom'] ? vars.cntrl_run['marginbottom'] * 1 : "")) + 'px'
            })
        }
    }

    function Cntrl_Style(st) {
        var s = [];
        for (var key in vars.cntrlstyle) {
            s[key] = vars.cntrlstyle[key]
        }
        for (var key in vars['cntrl' + st]) {
            s[key] = vars['cntrl' + st][key]
        }
        for (var key in vars['cntrl_' + st]) {
            s[key] = vars['cntrl_' + st][key]
        }
        return s
    }

    function findLeft(obj) {
        var curleft = 0;
        if (obj.offsetParent) {
            curleft = obj.offsetLeft;
            while (obj = obj.offsetParent) {
                curleft += obj.offsetLeft
            }
        }
        var body_style = window.getComputedStyle(document.body, null);
        var bodyleft = 0;
        if (body_style.position == "relative") {
            bodyleft = document.body.getBoundingClientRect().left
        }
        return curleft + bodyleft
    }

    function findTop(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            curtop = obj.offsetTop;
            while (obj = obj.offsetParent) {
                curtop += obj.offsetTop
            }
        }
        return curtop
    }

    function VolumeButOver() {
        CSS(volbarline_b, {
            "display": "block"
        });
        if (runvolume_b) {
            CSS(runvolume_b, {
                "display": "block"
            });
            runvolume_b.style.zIndex = 8;
            RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos)
        }
        volbarline_s['over'] = true
    }

    function VolbarHide() {
        volbarline_s['over'] = false;
        setTimeout(VolbarHideProcess, 1000)
    }

    function VolbarHideProcess() {
        if (!volbarline_s['over']) {
            CSS(volbarline_b, {
                "display": "none"
            });
            if (runvolume_b) {
                CSS(runvolume_b, {
                    "display": "none"
                })
            }
        } else {
            setTimeout(VolbarHideProcess, 1000)
        }
    }

    function VolumeMove(e) {
        if (volbarline_s['active']) {
            if (!e) e = window.event;
            var clickX = e.offsetX;
            Volume(clickX)
        }
    }

    function VolumeOut(e) {
        if (volbarline_s['active']) {
            if (!e) var e = window.event;
            var clickX = e.offsetX;
            if (clickX >= volbarline_s['w']) {
                volbarline_s['active'] = false
            }
        }
    }

    function VolumeMove_v(e) {
        if (volbarline_s['active'] && vars.ivolbar_v) {
            if (!e) var e = window.event;
            var clickY = e.offsetY;
            Volume(volbarline_s['h'] - clickY)
        }
    }

    function VolbarMove(e) {
        if (volbar_b.active) {
            if (!e) var e = window.event;
            var clickX = e.pageX - findLeft(volbar_b);
            Volume(clickX)
        }
    }

    function Volume(n) {
        var v = VolumeDraw(n);
        VolumeN(v);
        if (vars.remvolume == 1) {
            document.cookie = "uppodhtml5_volume=" + v + "; path=/; expires=Mon, 01-Jan-2099 00:00:00 GMT"
        }
    }

    function VolumeDraw(n) {
        if (volbarline_play_b) {
            if (vars.ivolbar_v) {
                n > 0 ? v = Math.max(0, Math.min(1, (n) / volbarline_s['h'])) : v = -n;
                CSS(volbarline_play_b, {
                    'height': '' + volbarline_s['h'] * v + 'px',
                    'top': volbarline_s['h'] - volbarline_s['h'] * v
                })
            } else {
                n > 0 ? v = Math.max(0, Math.min(1, (n) / volbarline_s['w'])) : v = -n;
                CSS(volbarline_play_b, {
                    'width': '' + (volbarline_s['w'] * v) + 'px'
                })
            }
        }
        if (volbar_b) {
            for (vb = 0; vb < volbars.length; vb++) {
                n > 0 ? v = Math.max(0, Math.min(1, (n) / vars.cntrlvolbar.w)) : v = -n;
                if (vb < Math.ceil(volbars.length * v)) {
                    CSS(volbars[vb].c, {
                        "opacity": vars.cntrlvolbar.play_a
                    })
                } else {
                    CSS(volbars[vb].c, {
                        "opacity": vars.cntrlvolbar.all_a
                    })
                }
            }
        }
        volbarline_b && runvolume_b ? RunPos(runvolume_b, volbarline_b, volbarline_play_b, volbarline_all_b, runvolume_pos) : '';
        return v
    }

    function VolumeN(v) {
        if (muted && v > 0) {
            Mute();
            if (isYoutube()) {
                media_yt.unMute()
            }
        }
        v > 0 ? muted = false : muted = true;
        if (isYoutube()) {
            media_yt.setVolume(v * 100)
        } else {
            media.volume = v;
            media ? media.muted = false : ''
        }
        MuteControl()
    }

    function SeekMove(e) {
        var clickX = e.offsetX;
        var obj = line_b;
        Uppod.trace('SeekMove clickX = ' + clickX);
        if (line_s['active']) {
            if (!e) var e = window.event;
            Seek(clickX)
        }
    }

    function Seek(cursorX) {
        Uppod.trace('Seek cursorX = ' + cursorX);
        if (iline) {
            var percent = Math.max(0, Math.min(1, (cursorX) / line_all_b.w))
        } else {
            var percent = 0
        }
        if (isYoutube()) {
            media_yt.seekTo(percent * media_yt.getDuration())
        } else {
            if (media && media.duration) {
                SeekTime(percent * media.duration)
            }
        }
        StopSub()
    }

    function SeekTime(t) {
        Uppod.trace('SeekTime to ' + t);
        if (media) {
            if (media.duration && t) {
                media.currentTime = t
            }
        }
        if (isYoutube()) {
            media_yt.seekTo(t)
        }
    }

    function IconImg() {
        return Uppod.IconImg.apply(this, arguments)
    }

    function CheckBase64() {
        return Uppod.CheckBase64.apply(this, arguments)
    }

    function CSS() {
        return Uppod.setStyle.apply(this, arguments)
    }

    function destroyCanvases() {
        for (var i = 0; i < canvasObjs.length; i++) {
            var canvasObj = canvasObjs[i];
            if (canvasObj) {
                canvasObj.canvas = null
            }
        }
    }
    this.destroy = function() {
        if (uppod.ads()) {
            uppod.ads().destroy()
        }
        if (isYoutube()) {
            media_yt.destroy()
        } else {
            DestroyMedia()
        }
        elems = uppod.document.querySelectorAll('*');
        for (var i = 0; i < elems.length; i++) {
            var elem = elems[i];
            if (elem.parentNode) {
                elem.parentNode.removeChild(elem)
            }
        }
        document.removeEventListener("keydown", KeyHandler);
        destroyCanvases();
        if (uppod.iframe.parentNode) {
            uppod.iframe.parentNode.removeChild(uppod.iframe)
        }
    };
    this.getStatus = function() {
        return !istart ? 0 : (ibuff ? 3 : (iplay ? 1 : 2))
    };
    this.Play = function(s) {
        if (s) {
            ClearOldVars();
            if (s.indexOf('#') == 0) {
                s = un(s)
            }
            NewFile(s, true)
        } else {
            !iplay ? Toggle() : ''
        }
    };
    this.Init = function(s) {
        Init()
    };
    this.Pause = function() {
        iplay ? Toggle() : ''
    };
    this.Toggle = function() {
        Toggle()
    };
    this.Stop = function() {
        init ? Stop() : ''
    };
    this.Seek = function(s) {
        init ? SeekTime(s) : ''
    };
    this.Download = function() {
        init ? Download() : ''
    };
    this.Resize = function() {
        Resize()
    };
    this.Alert = function(s) {
        Alert(s, true)
    };
    this.CloseAlert = function(s) {
        CloseAlrt()
    };
    this.Full = function(s) {
        Full()
    };
    this.Next = function(s) {
        Next()
    };
    this.Prev = function(s) {
        Prev()
    };
    this.Fullscreen = function(s) {
        Full()
    };
    this.Normalscreen = function(s) {
        FullOff()
    };
    this.Comment = function(s) {
        Alert(s, false)
    };
    this.CurrentTime = function() {
        if (init && media) {
            return CurrentTime()
        } else {
            return -1
        }
    };
    this.PlNumber = function() {
        if (pl) {
            return parseInt(ipl) + 1
        } else {
            return -1
        }
    };
    this.PlayPlNumber = function(s) {
        if (pl) {
            PlClick0();
            ipl = parseInt(s) - (vars.pl[0].playlist == "back" ? 0 : 1);
            PlClickCont()
        }
    };
    this.ShowPl = function(s) {
        if (pl) {
            if (vars.plplace == "inside") {
                if (playlist.style.display == "none") {
                    Pl()
                }
            }
        }
    };
    this.HidePl = function(s) {
        if (pl) {
            if (vars.plplace == "inside") {
                if (playlist.style.display != "none") {
                    Pl()
                }
            }
        }
    };
    this.PlUp = function(s) {
        if (pl) {
            vars.pl = vars.pl_history[s == 0 ? 0 : vars.pl_history.length - 1];
            if (s == 0) {
                vars.pl_history.splice(1)
            } else {
                vars.pl_history.splice(vars.pl_history.length - 1, 1)
            }
            RemovePl();
            CreatePl();
            if (vars.plplace == "inside") {
                Show(playlist);
                plnext_b ? Show(plnext_b.c) : '';
                plprev_b ? Show(plprev_b.c) : ''
            }
            if (plnext_b) {
                PlArrows()
            }
        }
    };
    this.Duration = function() {
        if (init && media) {
            return Duration()
        } else {
            return -1
        }
    };
    this.Volume = function(s) {
        VolumeN(s)
    };
    this.Volumed = function() {
        if (muted) {
            return 0
        } else {
            if (isYoutube()) {
                return media_yt.getVolume() / 100
            } else {
                if (media) {
                    return media.volume
                } else {
                    return -1
                }
            }
        }
    };
    this.Played = function() {
        if (init && media) {
            return Math.round((CurrentTime() / media.duration) * 100)
        } else {
            return -1
        }
    };
    this.Loaded = function() {
        if (init && media) {
            var loaded = 0;
            if (isYoutube()) {
                loaded = media_yt.getVideoLoadedFraction()
            } else {
                if (media.buffered) {
                    if (media.buffered.length > 0) {
                        loaded = (media.buffered.end(media.buffered.length - 1) / media.duration)
                    }
                }
            }
            return Math.round(loaded * 100)
        } else {
            return -1
        }
    };
    this.Get = function(k) {
        return vars[k]
    };
    this.Set = function(k, v) {
        vars[k] = v
    };
    this.ChangeColor = function(k, v) {
        vars[k] = v;
        if (k == 'screencolor') {
            var ctx = scrn.getContext("2d");
            ctx.fillStyle = v;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
    };
    this.isYoutube = function() {
        return vars.youtube && vars.youtube_id ? true : false
    };
    this.YoutubeInit = function() {
        YoutubeInit()
    };
    this.Change = function(k, v) {
        vars[k] = v;
        if (k != 'repeat' && k != 'random' && k != 'plplay' && k != 'plplay1' && k != 'pl') {
            Layer();
            CntrlBg()
        }
        if (k == 'pl') {
            if (typeof(v) === 'object') {
                vars.pl = v.playlist;
                RemovePl();
                CreatePl()
            }
        }
    };
    this.EventDetail = function(s) {
        return vars.events[s]
    };
    this.currentTime = this.CurrentTime;
    this.seek = this.Seek;
    this.play = this.Play;
    this.toogleFullscreen = this.Full;

    function YoutubeInit() {
        if (vars.youtube && vars.youtube_id) {
            youtubeElemId = 'yt_media_' + vars.uid;
            media = createElement('div');
            media.setAttribute('id', youtubeElemId);
            media_mc.appendChild(media);
            media_yt = new uppod.window.YT.Player(youtubeElemId, {
                height: vars.scrn_h,
                width: vars.scrn_w,
                videoId: vars.youtube_id,
                playerVars: {
                    enablejsapi: 1,
                    html5: 1,
                    iv_load_policy: 3,
                    playerapiid: youtubeElemId,
                    disablekb: 1,
                    controls: browser.restrictMediaPlay ? 1 : 0,
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    autoplay: 0,
                    loop: 0
                },
                events: {
                    'onReady': YoutubePlayerReady,
                    'onError': YoutubeError,
                    'onPlaybackQualityChange': YoutubeQualityChanged,
                    'onStateChange': YoutubePlayerStateChange
                }
            });
            layer && vars.poster == '' ? Hide(layer) : ''
        }
    }

    function isYoutubeApiLoaded() {
        if (uppod.window['YT']) {
            return true
        } else {
            return false
        }
    }

    function isYoutube() {
        return vars.youtube && media_yt ? true : false
    }

    function YoutubePlayerReady() {
        onReady();
        checkStart();
        youtubeIframe = uppod.document.querySelector('#' + youtubeElemId);
        if (vars.auto == 'play' && (!mobile || vars.volume == 0)) {
            Play();
            media_yt.playVideo()
        }
    }

    function YoutubeError(e) {
        if (e) {
            NotFound()
        }
    }

    function YoutubeQualityChanged() {}

    function YoutubeQuality() {
        var q = media_yt.getAvailableQualityLevels();
        vars.hdlinks = q;
        var q2 = [];
        for (var i = 0; i < q.length; i++) {
            switch (q[i]) {
                case 'tiny':
                    q2[i] = '144p';
                    break;
                case 'small':
                    q2[i] = '240p';
                    break;
                case 'medium':
                    q2[i] = '320p';
                    break;
                case 'large':
                    q2[i] = '480p';
                    break;
                case 'hd720':
                    q2[i] = '720p';
                    break;
                case 'hd1080':
                    q2[i] = '1080p';
                    break;
                case 'highres':
                    q2[i] = 'High';
                    break;
                default:
                    q2[i] = q[i]
            }
        }
        vars.hda = q2;
        HdSelect()
    }

    function YoutubePlayerStateChange() {
        var state = media_yt.getPlayerState();
        if (state == 1 && !vars.youtube_quality_received && hd_b) {
            YoutubeQuality();
            vars.youtube_quality_received = true
        };
        if (state == uppod.window.YT.PlayerState.PLAYING) {
            OnPlay()
        };
        if (state == uppod.window.YT.PlayerState.PAUSED) {
            OnPause()
        }
        if (state == uppod.window.YT.PlayerState.ENDED) {
            OnEnded()
        }
    }

    function disableSelection(target) {
        if (typeof target.onselectstart != "undefined") {
            target.onselectstart = function() {
                return false
            }
        } else if (typeof target.style.MozUserSelect != "undefined") {
            target.style.MozUserSelect = "none"
        } else {
            target.onmousedown = function() {
                return false
            };
            target.style.cursor = "default"
        }
    }

    function SelectRework(v, b) {
        b.ctx.clearRect(0, 0, 200, 200);
        b.ctx.fillText(v, 5 * b.s.scale, 15 * b.s.scale);
        tmp = '';
        for (var i = 0; i < vars.hdlinks.length; i++) {
            tmp += vars.hdlinks[i]
        }
        if (b.s.marker == 1 && tmp != ',' && tmp != '') {
            b.ctx.beginPath();
            b.ctx.moveTo((b.canvas.offsetWidth - 10 * b.s.scale), 9 * b.s.scale);
            b.ctx.lineTo((b.canvas.offsetWidth - 6 * b.s.scale), 9 * b.s.scale);
            b.ctx.lineTo((b.canvas.offsetWidth - 8 * b.s.scale), 14 * b.s.scale);
            b.ctx.lineTo((b.canvas.offsetWidth - 10 * b.s.scale), 9 * b.s.scale);
            b.ctx.closePath();
            b.ctx.lineWidth = 0.1;
            b.ctx.stroke();
            b.ctx.fill()
        }
    }

    function Element(nm, bw, bh, nm2, st) {
        var args = [vars].concat(Array.prototype.slice.call(arguments, 0));
        Uppod.Element.apply(this, args);
        canvasObjs.push(this)
    };

    function Shaper2(v) {
        Uppod.Shaper2.call(this, v);
        canvasObjs.push(this)
    };

    function setVarsDefaults() {
        this.uid;
        this.sid;
        this.auto = 'firstframe';
        this.autofull = 0;
        this.alerts = 1;
        this.addcontrols = '';
        this.airplay = 1;
        this.bgcolor = 'ffffff';
        this.bodycolor = '000000';
        this.brd = 0;
        this.brdcolor = 'cccccc';
        this.buffersec = 5;
        this.cntrlbg = 1;
        this.cntrlbgcolor = '000000|000000';
        this.cntrlbgalpha1 = .15;
        this.cntrlbgalpha2 = .7;
        this.cntrlbgo = 0;
        this.cntrlendmargin = 7;
        this.cntrlhide = 0;
        this.fullcntrlhide = 1;
        this.cntrlmargin = 3;
        this.cntrlmarginright = 0;
        this.cntrlmarginleft = 0;
        this.cntrlout = 0;
        this.cntrloutheight = 35;
        this.cntrlsize = 1;
        this.bigbutsonmobile = 0;
        this.cntrlcolor = 'ffffff';
        this.cntrlbuffer = {
            "center": 0
        };
        this.cntrl_buffer = {};
        this.cntrlfull = {
            "out": 0
        };
        this.cntrl_full = {};
        this.cntrlstyle = {
            "icon": 0,
            "color": "ffffff",
            "bg": 0,
            "bg_o": 1,
            "bg_smallicon": 1,
            "bgcolor": "000000",
            "bg_sh": "0",
            "bg_in": "0",
            "bg_gl": "0",
            "gl_a1": .9,
            "gl_a2": .1,
            "gl_color": "FFFFFF",
            "sh_blur": 6,
            "sh_dist": 0,
            "bg_a": 1,
            "bg_w": 20,
            "bg_h": 20,
            "scale": 1,
            "eff": 0,
            "effE": "Cubic",
            "sh": 0,
            "sh_c": "000000",
            "sh_a": 0.5,
            "sh_under": 1,
            "notip": 0,
            "text": 0,
            "center": 0,
            "marginleft": 0,
            "marginright": 0,
            "margintop": 0,
            "marginbottom": 0,
            "alpha": 1
        };
        this.cntrlplay = {};
        this.cntrl_play = {};
        this.cntrlpause = {};
        this.cntrl_pause = {};
        this.cntrlstop = {};
        this.cntrl_stop = {};
        this.cntrldownload = {};
        this.cntrl_download = {};
        this.cntrlnext = {};
        this.cntrl_next = {};
        this.cntrlprev = {};
        this.cntrl_prev = {};
        this.cntrlline = {
            "h": 4,
            "all_a": 0.3,
            "load_a": 0.4,
            "play_a": 1,
            "click": 1,
            "color_play": "ffffff",
            "color_all": "ffffff",
            "color_load": "ffffff",
            "o": 0,
            "full": 0
        };
        this.cntrl_line = {};
        this.cntrl_volbarline = {};
        this.cntrlvolbarline = {
            "h": 4,
            "w": 40,
            "all_a": 0.4,
            "play_a": 1,
            "color_play": "ffffff",
            "color_all": "ffffff",
            "o": 0
        };
        this.cntrl_volbarline_v = {};
        this.cntrlvolbarline_v = {
            "h": 50,
            "w": 4,
            "bg": 0,
            "bgcolor": "000000",
            "bg_o": 0,
            "bg_a": .15,
            "all_a": 0.4,
            "play_a": 1,
            "effdir": 0,
            "color_play": "ffffff",
            "color_all": "ffffff",
            "o": 0
        };
        this.ivolbar_v = false;
        this.cntrlvolbar = {
            "bar": 1,
            "n": 5,
            "all_a": 0.4,
            "play_a": 1,
            "scale": 1
        };
        this.cntrl_volbar = {};
        this.cntrl_tune = {};
        this.cntrl_volume = {};
        this.cntrlvolume = {};
        this.cntrl_sound = {};
        this.cntrlmenu = {};
        this.cntrl_menu = {};
        this.cntrlplaylist = {};
        this.cntrl_playlist = {};
        this.cntrl_hd = {};
        this.cntrlhd = {
            "icon": "HQ",
            "text": 1,
            "alpha0": 0.5,
            "w": 60
        };
        this.cntrlhdselect = {
            "bg": 1,
            "bg_o": 10,
            "bg_a": 0.7,
            "bgcolor": "666666|000000",
            "bg_smallicon": 0,
            "marker": 1
        };
        this.cntrl_sub = {};
        this.cntrlsub = {
            "icon": "A",
            "alpha0": 0.5,
            "text": 1
        };
        this.cntrlstart = {
            "bg": 1,
            "bg_sh": 1,
            "bgcolor": "ffffff",
            "bg_a": .1,
            "bg_w": 75,
            "bg_h": 75,
            "gl_a1": .8,
            "gl_a2": 0,
            "eff": 1,
            "scale2": 2,
            "curtain": "0",
            "curtainColor": "000000",
            "curtainAlpha": 0.5,
            "notip": 1,
            "bg_smallicon": 0
        };
        this.cntrl_start = {};
        this.cntrlseparator = {
            "alpha": 0.5
        };
        this.cntrl_separator = {};
        this.cntrlrun = {
            "w": 7,
            "h": 7,
            "o": 1,
            "position": 0,
            "hide": 0
        };
        this.cntrl_run = {};
        this.cntrlrun_volume = {
            "w": 7,
            "h": 7,
            "o": 1,
            "position": 0,
            "hide": 0
        };
        this.cntrl_run_volume = {};
        this.glass = 0;
        this.glasscolor = 'ffffff';
        this.glassalpha1 = 0.9;
        this.glassalpha2 = 0.2;
        this.hd;
        this.hdsw = 60;
        this.hda;
        this.hdlinks;
        this.hdseparator = ',';
        this.quality = '';
        this.hd1 = 0;
        this.selectbgcolor = "ffffff";
        this.selectcolor = "000000";
        this.hlsautoquality = 0;
        this.comment = "";
        this.commentplus = '';
        this.title;
        this.showname = 0;
        this.showtitle;
        this.shownameliketip = 0;
        this.shownameonover = 0;
        this.shownameonstop = 0;
        this.stageposition = '';
        this.stageleft = 0;
        this.stagetop = 0;
        this.commentcolor = "ffffff";
        this.commentbgcolor = "000000";
        this.commentbgcolor_k = false;
        this.commentbgalpha1 = 0.5;
        this.commentbgalpha2 = 0.1;
        this.commentalign = "left";
        this.commenttopmargin = 0;
        this.commentmargin = 10;
        this.tipfontcolor = "ffffff";
        this.tipfont = 'Verdana';
        this.tipfontsize = 10;
        this.tipbgcolor = "000000";
        this.tipalpha = 0.7;
        this.tipbgo = 8;
        this.tipbgshadow = 0;
        this.tiptags1 = '';
        this.tiptags2 = '';
        this.tipcenter = 1;
        this.marquee = 0;
        this.controls = '';
        this.videocontrols = "play,back,time_play,line,time_all,volume,volbarline,full,buffer";
        this.audiocontrols = "play,back,time_play,line,time_all,volume,volbarline,buffer";
        this.streamcontrols = "play,time_play,volume,volbarline";
        this.controls_active = false;
        this.download = '';
        this.embedcode = '';
        this.events = new Array();
        this.eventtime = 0;
        this.eventplayed = 0;
        this.iosplayer = 1;
        this.androidplayer = 1;
        this.html5_referer = '';
        this.file = '';
        this.filehd = '';
        this.or = [];
        this.ori = 0;
        this.ors = 0;
        this.or_limit = 5;
        this.hotkey = 1;
        this.youtube = false;
        this.youtube_created = false;
        this.youtube_quality_received = false;
        this.htmlsize = 0;
        this.id = '';
        this.iframe = '';
        this.iframeurl = '';
        this.plr = '';
        this.pl_history = [];
        this.bottomrowheight = 200;
        this.pl_rows = 0;
        this.plarrows = 0;
        this.plonend = 0;
        this.link = '';
        this.m = 'video';
        this.menu_nocode = 0;
        this.menu_h = 0;
        this.menu_w = 0;
        this.menuauto = 0;
        this.namefont = 'Verdana';
        this.namefontsize = 11;
        this.namefontstyle = 'normal';
        this.namebgalpha = 0;
        this.namebgcolor = '000000';
        this.namebgo = 8;
        this.namebgshadow = 0;
        this.namecolor = 'ffffff';
        this.namemargin_h = 0;
        this.namemargin_v = 0;
        this.namepadding = 6;
        this.nameleading = 0;
        this.nametopanel = 0;
        this.nametags1 = '';
        this.nametags2 = '';
        this.logo = '';
        this.logoplace = 2;
        this.logoalpha = 0.5;
        this.logomargin = 15;
        this.logomargin_h = 15;
        this.logomargin_v = 15;
        this.logolink = '';
        this.logotarget = '_self';
        this.logoplay = 1;
        this.logopause = 1;
        this.referer = location.href;
        this.https = this.referer.indexOf("https://") > -1 ? 1 : 0;
        this.redirect = '';
        this.redirect_click = 0;
        this.redirect_clickpl = 0;
        this.redirect_play = 0;
        this.redirect_end = 0;
        this.urlprotect = '';
        this.urlredirect = 'play';
        this.urlredirect_target = "_self";
        this.urlprotect_link = '';
        this.urlprotect_stop = 0;
        this.urlprotect_warning = 1;
        this.urlprotect_msg = '';
        this.urlprotect_ref = 1;
        this.banned = '';
        this.redirecttarget = '_self';
        this.nohtml5 = 'uppod.swf';
        this.o = 0;
        this.padding = 0;
        this.poster = '';
        this.pl = '';
        this.plplace = "inside";
        this.pltw = 100;
        this.plth = 70;
        this.plcolor = 'ffffff';
        this.plcolor2 = 'ffffff';
        this.plbgcolor = '000000';
        this.plalpha = 0.3;
        this.plalpha2 = 0.1;
        this.plalpha_play = 0.8;
        this.plmargin = 0;
        this.plmargin_h = 10;
        this.plmargin_v = 0;
        this.pltags1 = '';
        this.pltags2 = '';
        this.plfont = 'Arial';
        this.plfontsize = 11;
        this.plplay = 0;
        this.plplay1 = 1;
        this.pliview = 0;
        this.plrows = 0;
        this.plcenter = 0;
        this.plbgcolor_play;
        this.plcolor_play;
        this.pltumbs = 0;
        this.pllimit = 10;
        this.nocache = 0;
        this.fillposter = 1;
        this.random = 0;
        this.time = 0;
        this.download;
        this.radio = 0;
        this.radiodropcache = 0;
        this.reloader = 0;
        this.reloadercounter = 0;
        this.reloadertime = 0;
        this.id3 = 0;
        this.screencolor = '000000';
        this.screenposter = '';
        this.scrn_w = 0;
        this.scrn_h = 0;
        this.start = 0;
        this.autoheight = 1;
        this.cntrlbgmargin = 0;
        this.cntrlbgmarginleft = 0;
        this.cntrlbgmarginright = 0;
        this.sub;
        this.sub_tmp;
        this.subcolor = 'FAED54';
        this.subbgcolor = '000000';
        this.subfont = 'sans-serif';
        this.subbgalpha = 1;
        this.subbgo = 8;
        this.subbgshadow = 0;
        this.subsize = 100;
        this.substart = 1;
        this.subtop = 0;
        this.submenu = 1;
        this.sub_shift = 0;
        this.submargin = 0;
        this.sublangs;
        this.sublangsall = 0;
        this.sublang;
        this.remsublang = 1;
        this.transparent = 0;
        this.repeat = 0;
        this.keyseek = 10;
        this.volume = 0.8;
        this.remvolume = 1;
        this.remquality = 1;
        this.w = 500;
        this.webkitFullscreen = 0;
        this.realfullscreen = 1;
        this.ytpllimit = 50;
        this.ytposter = 1;
        this.ytapi;
        this.ytplorder = 'relevance';
        this.h = 375;
        this.st = '';
        this.hls_plugin = 1;
        this.hls_debug = false;
        this.hls_autoStartLoad = true;
        this.hls_defaultAudioCodec = undefined;
        this.hls_maxBufferLength = 30;
        this.hls_maxMaxBufferLength = 600;
        this.hls_maxBufferSize = 60 * 1000 * 1000;
        this.hls_maxBufferHole = 0.5;
        this.hls_maxSeekHole = 2;
        this.hls_liveSyncDurationCount = 3;
        this.hls_liveMaxLatencyDurationCount = 10;
        this.hls_enableWorker = true;
        this.hls_enableSoftwareAES = true;
        this.hls_manifestLoadingTimeOut = 10000;
        this.hls_manifestLoadingMaxRetry = 1;
        this.hls_manifestLoadingRetryDelay = 500;
        this.hls_levelLoadingTimeOut = 10000;
        this.hls_levelLoadingMaxRetry = 4;
        this.hls_levelLoadingRetryDelay = 500;
        this.hls_fragLoadingTimeOut = 20000;
        this.hls_fragLoadingMaxRetry = 6;
        this.hls_fragLoadingRetryDelay = 500;
        this.hls_appendErrorMaxRetry = 3;
        this.hls_enableCEA708Captions = true;
        this.infoloader = 1;
        this.infoloaderurl;
        this.infoloaderinterval = 10;
        this.infoloadermask = '{1}<br><b>{2}</b>';
        this.infoloaderaddurl = 0;
        this.ga;
        this.gadb;
        this.gaplay = 0;
        this.gastop = 0;
        this.gaend = 0;
        this.gadownload = 0;
        this.gatype = 0;
        this.galabel;
        this.gatracked = []
    }

    function setVarsLang() {
        this.lang = 'ru';
        this.lang_ru = {
            "lang": "ru",
            "localization": {
                "back": "В начало",
                "play": "Пуск",
                "pause": "Пауза",
                "stop": "Стоп",
                "full": "Развернуть",
                "full_back": "Свернуть",
                "list": "Плейлист",
                "next": "Следующий",
                "download": "Скачать",
                "prev": "Предыдущий",
                "sound_off": "Вкл. звук",
                "sound": "Выкл. звук",
                "volume": "Громкость",
                "menu": "Поделиться",
                "menu_code": "Код",
                "menu_link": "Ссылка",
                "menu_download": "Файл",
                "menu_copy": "Скопировать",
                "menu_mail": "Ссылку на e-mail",
                "sent": "Отправлено",
                "menu_message": "Текст",
                "menu_send": "Отправить",
                "fontsize": "Размер",
                "bgalpha": "Фон",
                "fontcolor": "Цвет текста",
                "off": "Выключить",
                "on": "Включить",
                "hq": "Лучшее качество",
                "hd": "Качество",
                "hq_off": "Обычное качество",
                "sub": "Субтитры",
                "traffic": "Трафик (МБ)",
                "smoothing": "Включить сглаживание",
                "smoothing_off": "Выключить сглаживание",
                "smoothing_ok": "Сглаживание включено",
                "smoothing_off_ok": "Сглаживание выключено",
                "password": "Пароль",
                "startlive": "Начать трансляцию",
                "live": "Трансляция",
                "rec": "Запись",
                "rerec": "Заново",
                "playrec": "Играть",
                "contrec": "Продолжить запись",
                "settings": "Настройки",
                "done": "Готово",
                "shownotes": "Шоуноты",
                "loading": "Загрузка",
                "startplay": "Включите плеер",
                "notype": "Не указан режим плеера (m)",
                "err": "Ошибка",
                "errjson": "Ошибка загрузки",
                "errjson_decode": "Ошибка в",
                "errjsonpl_decode": "Ошибка в плейлисте",
                "err_pl": "Ошибка загрузки плейлиста",
                "err_img": "Ошибка загрузки изображения",
                "file": "Файл",
                "notfound": "не найден",
                "streamnotfound": "Трансляция не найдена",
                "copy_link": "Ссылка скопирована в буфер обмена",
                "copy_code": "Код скопирован в буфер обмена",
                "no_data": "Нет данных",
                "ads": "Реклама",
                "like": "Понравилось",
                "like": "Мне нравится",
                "unlike": "Не нравится",
                "all": "Все",
                "auto": "Авто"
            }
        };
        this.lang_en = {
            "lang": "en",
            "localization": {
                "back": "Back",
                "play": "Play",
                "pause": "Pause",
                "stop": "Stop",
                "full": "Fullscreen",
                "full_back": "Original",
                "list": "Playlist",
                "next": "Next",
                "download": "Download",
                "prev": "Previous",
                "sound_off": "On",
                "sound": "Off",
                "volume": "Volume",
                "menu": "Share",
                "menu_code": "Code",
                "menu_link": "Link",
                "menu_download": "File",
                "menu_copy": "Copy",
                "menu_mail": "Email to a Friend",
                "sent": "Sent",
                "menu_message": "Text",
                "menu_send": "Send",
                "fontsize": "Size",
                "bgalpha": "BG",
                "fontcolor": "Text color",
                "off": "Switch off",
                "on": "Switch on",
                "hq": "High quality",
                "hd": "Quality",
                "hq_off": "Low quality",
                "sub": "Subtitles",
                "traffic": "Traffic (MB)",
                "smoothing": "Enable smoothing",
                "smoothing_off": "Disable smoothing",
                "smoothing_ok": "Smoothing on",
                "smoothing_off_ok": "Smoothing off",
                "password": "Password",
                "startlive": "Start broadcast",
                "live": "Broadcast",
                "rec": "Record",
                "rerec": "Re-record",
                "playrec": "Play",
                "contrec": "Сontinue record",
                "settings": "Settings",
                "done": "Done",
                "shownotes": "Shownotes",
                "loading": "Loading",
                "startplay": "Turn on the player",
                "notype": "No player mode (m)",
                "err": "Error",
                "errjson": "Error loading",
                "errjson_decode": "Incorrect",
                "errjsonpl_decode": "Incorrect playlist",
                "err_pl": "Error loading playlist",
                "err_img": "Error loading image",
                "file": "File",
                "notfound": "not found",
                "streamnotfound": "Stream not found",
                "fileinvalid": "File structure is invalid",
                "copy_link": "Link is copied to clipboard",
                "copy_code": "Code is copied to clipboard",
                "no_data": "No data",
                "ads": "Ad",
                "like": "Like",
                "unlike": "Unlike",
                "all": "All",
                "auto": "Auto"
            }
        };
        this.lang2 = this.lang_ru.localization
    }

    function loadStyle() {
        var str = '';
        if (this.st != '') {
            if (this.st.indexOf('{') == -1) {
                if (this.st.indexOf('#') == 0) {
                    str = un(this.st)
                } else {
                    if (this.st.indexOf('.') == -1) {
                        try {
                            var est = eval(this.st)
                        } catch (err) {
                            ierr = Filename(this.st) + ' ' + this.lang2.notfound
                        }
                        if (est != '') {
                            str = est;
                            if (str != '' && String(str) != 'undefined') {
                                if (str.indexOf('#') == 0) {
                                    str = un(str)
                                }
                            }
                        } else {
                            ierr = Filename(this.st) + ' ' + this.lang2.notfound
                        }
                    } else {
                        str = LoadFile(this.st)
                    }
                }
            } else {
                str = this.st
            }
            if (str != '' && String(str) != 'undefined') {
                style = JSON.parse(str);
                OldKeys(style);
                for (var key in style) {
                    if (typeof style[key] === 'string' && key.indexOf('color') > -1) {
                        style[key] = style[key].replace('#', '');
                        style[key].length == 5 ? style[key] = '0' + style[key] : '';
                        if (style[key].indexOf('|') > 0) {
                            style[key] = ReColor(style[key].substr(0, style[key].indexOf('|'))) + '|' + ReColor(style[key].substr(style[key].indexOf('|') + 1))
                        } else {
                            style[key] = ReColor(style[key])
                        }
                    }
                    this[key] = style[key]
                }
                if (style['controls']) {
                    isetcontrols = true
                }
            }
        }
    }

    function manageStgSize() {
        var rw = window.screen.width;
        var rh = window.screen.height;
        var stg_width = getCss(this.stg, 'width') || rw + 'px';
        var stg_height = getCss(this.stg, 'height') || rh + 'px';
        if (window.self !== window.top && browser.isIE) {
            stg_width = rw + 'px';
            stg_height = rh + 'px'
        }
        var widthPx = stg_width.indexOf('px') > 0;
        var width = parseInt(stg_width);
        var defaultWidth = width == 0 || isNaN(width);
        var height = parseInt(this.stg.style.height);
        if (isNaN(height)) {
            height = parseInt(stg_height)
        }
        var heightPx = stg_height.indexOf('px') > 0;
        var defaultHeight = height == 0 || isNaN(height);
        if (!defaultWidth && widthPx) {
            this.w = width
        }
        if (!defaultWidth && !widthPx) {
            if (this.stg.parentNode.offsetWidth > 0) {
                this.w = this.stg.parentNode.offsetWidth * width / 100
            } else {
                defaultWidth = true
            }
        }
        if (defaultWidth) {
            this.stg.style.width = this.w + 'px'
        }
        if (!defaultHeight && heightPx) {
            this.h = height
        }
        if (!defaultHeight && !heightPx) {
            if (this.stg.parentNode.offsetHeight > 0) {
                this.h = this.stg.parentNode.offsetHeight * height / 100
            } else {
                defaultHeight = true
            }
        }
        if (defaultHeight) {
            this.stg.style.height = this.h + 'px'
        }
        this.sh = this.stageheight = this.h;
        this.ph = this.sh;
        this.sw = this.stagewidth = this.w;
        this.pw = this.sw
    }

    function Vars() {
        setVarsDefaults.call(this);
        if (typeof(Uppod.Stage) == 'undefined') {
            Uppod.Stage = new Array()
        }
        Uppod.Stage[loadvars.id] = this.stg = uppod._parentDom = document.getElementById(loadvars.id);
        if (this.stg == null) {
            alert('Uppod: ID (' + loadvars.id + ') not found')
        }
        this.sw = this.stagewidth = this.stg.offsetWidth;
        this.sh = this.stageheight = this.stg.offsetHeight;
        this.stagewidthproc = '';
        var stg_display = getCss(this.stg, 'display') || 'block';
        CSS(this.stg, {
            'padding': 0,
            'display': 'none'
        });
        var stg_width = getCss(this.stg, 'width') || '100%';
        if (stg_width == 'auto') {
            this.stagewidthproc = '100%'
        } else {
            stg_width.indexOf("%") > 0 ? this.stagewidthproc = this.stg.style.width : ''
        }
        this.stg.style.display = stg_display;
        this.ph = this.sh;
        this.pw = this.sw;
        this.touch = 0;
        setVarsLang.call(this);
        OldKeys(loadvars);
        var isetcontrols = false;
        if (uppodstyle != "") {
            this.st = uppodstyle
        }
        if (this.st0) {
            for (var key in this.st0) {
                this[key] = this.st0[key]
            }
        }
        for (var key in loadvars) {
            this[key] = loadvars[key]
        }
        manageStgSize.call(this);
        if (loadvars['video']) {
            this.m = 'video';
            this.file = loadvars['video']
        }
        if (loadvars['audio']) {
            this.m = 'audio';
            this.file = loadvars['audio']
        }
        loadvars['controls'] ? isetcontrols = true : '';
        if (this.m == 'audio') {
            this.cntrlhide = 0;
            this.fullcntrlhide = 0;
            this.showname = 1;
            this.shownameliketip = 1;
            this.controls == '' ? this.controls = this.audiocontrols : '';
            this.uibg = 0;
            nativecontrols = false
        } else {
            this.controls == '' ? this.controls = this.videocontrols : ''
        }
        loadStyle.call(this);
        if (android) {
            if (!chrome) {
                this.androidplayer = 1
            }
            if (this.m == 'video' && this.androidplayer == 1) {
                nativecontrols = true
            }
            if (this.auto == "play" && this.volume > 0) {
                this.auto = "firstframe"
            }
        }
        if (ipad) {
            if (this.m == 'video') {
                if (this.iosplayer == 1) {
                    nativecontrols = true
                } else {
                    nativecontrols = false
                }
            }
            if (this.auto == "none" || (this.auto == "play" && this.volume > 0)) {
                this.auto = "firstframe"
            }
        }
        if (nativecontrols) {
            this.cntrlhide = 0;
            this.cntrlhideover = 0
        }
        if (mobile) {
            this.tip = 0;
            if (this.bigbutsonmobile > 1) {
                this.cntrlsize = this.cntrlsize * this.bigbutsonmobile;
                this.cntrlmargin = this.cntrlmargin * this.bigbutsonmobile * this.bigbutsonmobile * 1.5
            }
        }
        if (ipad && this.plplace == "inside" && (this.controls.indexOf("pl,") > -1 || this.controls.indexOf(",pl") == this.controls.length - 3)) {
            this.plplace = 'bottom'
        }
        if (this.sh == 0) {
            if (this.w == 500 && this.h == 375 && this.m == 'audio') {
                this.w = 300;
                this.h = 90
            }
            CSS(this.stg, {
                'position': 'relative',
                'width': this.w + 'px',
                'height': this.h + 'px'
            });
            this.sw = this.stagewidth = this.w;
            this.sh = this.stageheight = this.h
        }
        if (this.poster.indexOf('#') == 0) {
            this.poster = un(this.poster)
        }
        if (this.file) {
            if (this.file.indexOf('#') == 0) {
                this.file = un(this.file)
            }
        }
        if (this.title) {
            this.comment = this.title
        }
        if (this.commentplus != '') {
            if (this.commentplus.indexOf('*u*') > -1) {
                var myPattern4 = /\*u\*/;
                var i4tmp = this.commentplus.split('*u*').length;
                for (var i4 = 0; i4 < i4tmp; i4++) {
                    this.commentplus = this.commentplus.replace(myPattern4, "'")
                }
            }
        }
        if (this.cntrlcolor) {
            this.cntrlstyle["color"] = this.cntrlcolor;
            this.cntrlline["color_play"] = this.cntrlcolor;
            this.cntrlline["color_all"] = this.cntrlcolor;
            this.cntrlline["color_load"] = this.cntrlcolor;
            this.cntrlvolbarline["color_play"] = this.cntrlcolor;
            this.cntrlvolbarline["color_all"] = this.cntrlcolor;
            this.cntrlvolbarline_v["color_play"] = this.cntrlcolor;
            this.cntrlvolbarline_v["color_all"] = this.cntrlcolor
        }
        this.dots = [65, 119, 98, 99, 83, 106, 105, 87, 82, 81, 68, 77, 117, 85, 86, 69, 122, 100, 73, 112, 80, 89, 71, 111, 114, 107, 78, 74, 103, 113, 102, 97, 70, 88, 75, 101, 104, 79, 84, 72, 90, 120, 108, 115, 76, 116, 121, 66, 67, 118, 110, 109, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 61];
        if (this.showtitle) {
            this.showname = this.showtitle
        }
        if (this.pl != null && typeof(this.pl) === "object") {
            this.pl = this.pl["playlist"]
        } else {
            if (this.pl.indexOf('#') == 0) {
                this.pl = un(this.pl)
            }
        }
        this.lang2 = this.lang_ru.localization;
        if (this.lang == 'en') {
            this.lang2 = this.lang_en.localization
        }
        this.h = this.sh;
        if (this.plplace != 'inside' && this.plplace != 'bottomrow' && this.plplace != 'bottom') {
            this.plplace = 'inside';
            if (this.controls.indexOf('playlist') == -1) {
                this.controls += ',playlist'
            }
        }
        if (this.plplace == 'inside') {
            if (this.pl != '' && !isetcontrols && this.controls.indexOf('playlist') == -1 && (this.controls == this.audiocontrols || this.controls == this.videocontrols)) {
                this.controls += ',playlist'
            }
        }
        if (this.plplace == 'bottomrow') {
            this.plth == 70 ? this.plth = 40 : '';
            this.pltw = this.sw - this.plmargin * 2;
            this.pl != '' ? this.h = this.sh - this.bottomrowheight - 20 : ''
        }
        if (this.plplace == 'bottom') {
            this.pl != '' ? this.h = this.sh - this.plth - 20 : ''
        }
        if (this.plplace == 'bottomrow' || this.plplace == 'bottom') {
            if (this.controls.indexOf('playlist') > -1) {
                this.controls = this.controls.replace(',playlist', '')
            }
        }
        if (this.plarrows == 1) {
            if (this.plplace == 'bottomrow') {
                this.plmargin_v = 20
            } else {
                this.plmargin_h = 40
            }
        }
        if (this.nametags1 != '') {
            if (this.nametags1.indexOf("size=") > -1) {
                this.namefontsize = this.nametags1.substr(this.nametags1.indexOf("size=") + 6, 2);
                this.namefontsize = this.namefontsize.replace(/\//g, "")
            }
        }
        if (this.radio == 1 && this.controls == this.audiocontrols) {
            this.controls = this.streamcontrols;
            defaultcontrols = true
        }
        var list = '';
        for (var i = 0; i < this.dots.length; ++i) list += String.fromCharCode(this.dots[i]);
        this.cntrlmargin += 2;
        if (this.htmlsize == 1) {
            this.w = this.sw;
            this.h = this.sh
        }
        if (this.plplace != "inside") {
            this.ph = this.h
        }
        if (this.lang == 'ru') {
            this.lang2 = this.lang_ru.localization
        }
        if (this.addcontrols) {
            this.controls += ',' + this.addcontrols
        }
        if (this.plr) {
            this.iframe = this.plr
        }
        if (this.subsize != 100) {
            this.subsize < 30 ? this.subsize = 100 + (this.subsize - 13) * 10 : ''
        }
        if (this.sub) {
            this.sub_tmp = this.sub
        }
        if (parent) {
            try {
                if (parent.document) {
                    var arrFrames = parent.document.getElementsByTagName("IFRAME");
                    for (var i = 0; i < arrFrames.length; i++) {
                        if (arrFrames[i].contentWindow === window) {
                            this.iframeobject = arrFrames[i];
                            if (this.iframe == '') {
                                if (arrFrames[i].id) {
                                    this.iframe = arrFrames[i].id
                                } else {
                                    this.iframe = '1'
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
                this.iframe = ''
            }
        }
        this.config = {
            _keyStr: list,
            uploader: function(e) {
                var t = "";
                var n, r, i, s, o, u, a;
                var f = 0;
                e = vars.config._utf8_encode(e);
                while (f < e.length) {
                    n = e.charCodeAt(f++);
                    r = e.charCodeAt(f++);
                    i = e.charCodeAt(f++);
                    s = n >> 2;
                    o = (n & 3) << 4 | r >> 4;
                    u = (r & 15) << 2 | i >> 6;
                    a = i & 63;
                    if (isNaN(r)) {
                        u = a = 64
                    } else if (isNaN(i)) {
                        a = 64
                    }
                    t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                }
                return t
            },
            loader: function(e) {
                var t = "";
                var n, r, i;
                var s, o, u, a;
                var f = 0;
                e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                while (f < e.length) {
                    s = this._keyStr.indexOf(e.charAt(f++));
                    o = this._keyStr.indexOf(e.charAt(f++));
                    u = this._keyStr.indexOf(e.charAt(f++));
                    a = this._keyStr.indexOf(e.charAt(f++));
                    n = s << 2 | o >> 4;
                    r = (o & 15) << 4 | u >> 2;
                    i = (u & 3) << 6 | a;
                    t = t + String.fromCharCode(n);
                    if (u != 64) {
                        t = t + String.fromCharCode(r)
                    }
                    if (a != 64) {
                        t = t + String.fromCharCode(i)
                    }
                }
                t = vars.config._utf8_decode(t);
                eval(t)
            },
            _utf8_encode: function(e) {
                e = e.replace(/\r\n/g, "\n");
                var t = "";
                for (var n = 0; n < e.length; n++) {
                    var r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r)
                    } else if (r > 127 && r < 2048) {
                        t += String.fromCharCode(r >> 6 | 192);
                        t += String.fromCharCode(r & 63 | 128)
                    } else {
                        t += String.fromCharCode(r >> 12 | 224);
                        t += String.fromCharCode(r >> 6 & 63 | 128);
                        t += String.fromCharCode(r & 63 | 128)
                    }
                }
                return t
            },
            _utf8_decode: function(e) {
                var t = "";
                var n = 0;
                var r = c1 = c2 = 0;
                while (n < e.length) {
                    r = e.charCodeAt(n);
                    if (r < 128) {
                        t += String.fromCharCode(r);
                        n++
                    } else if (r > 191 && r < 224) {
                        c2 = e.charCodeAt(n + 1);
                        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                        n += 2
                    } else {
                        c2 = e.charCodeAt(n + 1);
                        c3 = e.charCodeAt(n + 2);
                        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        n += 3
                    }
                }
                return t
            }
        };
        v = this.volume;
        if (this.remvolume == 1) {
            getCookie('volume') ? v = getCookie('volume') : ''
        }
        if (StorageSupport()) {
            if (localStorage.getItem("uppodquality") != null) {
                this.quality = localStorage.getItem("uppodquality")
            }
        }
    }

    function getCookie(name) {
        var cookie = " " + document.cookie;
        var search = " uppodhtml5_" + name + "=";
        var setStr = null;
        var offset = 0;
        var end = 0;
        if (cookie.length > 0) {
            offset = cookie.indexOf(search);
            if (offset != -1) {
                offset += search.length;
                end = cookie.indexOf(";", offset);
                if (end == -1) {
                    end = cookie.length
                }
                setStr = unescape(cookie.substring(offset, end))
            }
        }
        return (setStr)
    }

    function OldKeys(ar) {
        for (var key in ar) {
            if (key.indexOf('pltumbs0') == 0) {
                ar[key.replace("pltumbs0", "pl")] = ar[key]
            }
            if (key.indexOf('pl0') == 0) {
                ar[key.replace("pl0", "pl")] = ar[key]
            }
            if (key.indexOf('plcomment') == 0) {
                ar[key.replace("plcomment", "pl")] = ar[key]
            }
        }
    }

    function un(s) {
        if (s.indexOf('.') == -1) {
            s = s.substr(1);
            s2 = '';
            for (i = 0; i < s.length; i += 3) {
                s2 += '%u0' + s.slice(i, i + 3)
            }
            s = unescape(s2)
        }
        return s
    }

    function getCss(elem, property) {
        if (window.getComputedStyle) {
            if (window.getComputedStyle(elem) !== null) {
                return window.getComputedStyle(elem, null).getPropertyValue(property)
            }
        } else {
            return 0
        }
    }

    function Opacity(elem, o) {
        CSS(elem, {
            "opacity": o,
            "filter": "alpha(opacity=" + (o * 100) + ")"
        })
    }

    function CheckGradiendDiv(mc, c) {
        if (c.indexOf('|') > 0) {
            var c2 = c.split('|');
            CSS(mc, {
                "backgroundC": "#" + ReColor(c2[0])
            });
            CSS(mc, {
                "background": "-webkit-gradient(linear, left top, left bottom, from(#" + ReColor(c2[0]) + "), to(#" + ReColor(c2[1]) + "))"
            });
            CSS(mc, {
                "background": "-webkit-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
            });
            CSS(mc, {
                "background": "-moz-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
            });
            CSS(mc, {
                "background": "-ms-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
            });
            CSS(mc, {
                "background": "-o-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
            });
            CSS(mc, {
                "background-image": "-ms-linear-gradient(top, #" + ReColor(c2[0]) + " 0%, #" + ReColor(c2[1]) + " 100%)"
            })
        } else {
            CSS(mc, {
                'backgroundColor': '#' + ReColor(c)
            })
        }
    }

    function measureText() {
        return Uppod.measureText.apply(this, arguments)
    }

    function Filename(str) {
        if (str.indexOf('/') > 0) {
            str = str.substr(str.lastIndexOf('/') + 1)
        }
        return str
    }

    function LoadFile(url) {
        if (url) {
            req = new XMLHttpRequest();
            req.open("GET", url + (vars.nocache == 1 ? '' : (url.indexOf('?') > 0 ? '&' : '?')) + Math.random(), false);
            try {
                req.send(null);
                if (req.status == 200) {
                    return req.responseText
                } else {
                    Alert(req.status + ' ' + Filename(url))
                }
            } catch (err) {
                vars ? Alert(vars.lang2.errjson + ' ' + Filename(url), true) : ''
            }
        }
    }

    function Remove(id) {
        var elem = document.getElementById(id);
        elem ? elem.parentNode.removeChild(elem) : ''
    }
    var tip_margin_y = 10;
    var ie = document.all && !window.opera;
    var ns6 = document.getElementById && !document.all;

    function ToolTip(el, txt) {
        if (txt != '') {
            if (!tip.parentNode) {
                uppod.document.appendChild(tip)
            }
            tip.innerHTML = txt;
            op = 0.1;
            tip.style.opacity = op;
            tip.style.visibility = "visible";
            el.addEventListener("mousemove", positiontip);
            showtip()
        }
    }

    function ToolTipHide(el) {
        tip.style.visibility = 'hidden';
        el.removeEventListener("mousemove", positiontip)
    }

    function showtip() {
        if (op < vars.tipalpha) {
            op += 0.1;
            tip.style.opacity = op;
            tip.style.filter = 'alpha(opacity=' + op * 100 + ')';
            t = setTimeout(showtip, 30)
        }
    }

    function positiontip(e) {
        var iline = false;
        var fx = findLeft(vars.stg);
        var fy = findTop(vars.stg);
        if (e.target == line_but_b || e.target == run_b) {
            iline = true;
            var duration;
            if (isYoutube()) {
                try {
                    duration = media_yt.getDuration()
                } catch (error) {}
            } else {
                duration = media.duration
            }
            if (duration) {
                var x = e.pageX - fx;
                var l = findLeft(line_b) - fx;
                if (x > l) {
                    tip.innerHTML = formatTime((((x - l) / line_all_b.clientWidth) * duration), true)
                } else {
                    tip.innerHTML = '0:00'
                }
            } else {
                tip.innerHTML = ''
            }
        }
        var curX = e.pageX - fx;
        var curY = e.pageY - fy;
        var winwidth = vars.stg.clientWidth - 20;
        var winheight = vars.stg.clientHeight - 20;
        var rightedge = winwidth - e.clientX - fx;
        var bottomedge = winheight - e.clientY - tip_margin_y - fy;
        var left = 0;
        var top = 0;
        if (rightedge < tip.clientWidth) left = curX - tip.clientWidth + "px";
        else left = curX - (iline ? tip.clientWidth / 2 : 0) + "px";
        if ((bottomedge < tip.clientHeight) || iline) {
            top = curY - tip.clientHeight - tip_margin_y + "px"
        } else {
            top = curY + tip_margin_y * 2 + "px"
        }
        CSS(tip, {
            'position': 'absolute',
            'top': top,
            'left': left
        })
    }
}
window.Uppod=Uppod;
Uppod.attr = function(targetObj, name, options) {
    Object.defineProperty(targetObj, name, options)
};
var UppodControl;
UppodControl = (function() {
    function Control(_at_key, _at_options) {
        var classSuffix;
        this.key = _at_key;
        this.options = _at_options;
        if (this.options.dom) {
            this.dom = this.options.dom
        } else {
            this.dom = this.options.element.selfDom
        }
        classSuffix = this.key.replace(/([A-Z])/g, function($1) {
            return "_" + ($1.toLowerCase())
        });
        this.dom.className = "uppod-control" + classSuffix
    }
    Control.prototype.key = '';
    Control.prototype.options = {};
    Control.prototype.dom = {};
    Control.prototype.css = function(dataObj) {
        return Uppod.setStyle(this.dom, dataObj)
    };
    Control.prototype.activate = function() {
        this.dom.style.display = this._beforeDeactivate;
        return this._beforeDeactivate = null
    };
    Control.prototype.deactivate = function() {
        if (!this._beforeDeactivate) {
            this._beforeDeactivate = this.dom.style.display
        }
        return this.hide()
    };
    Control.prototype.show = function() {
        return this.dom.style.display = 'block'
    };
    Control.prototype.hide = function() {
        return this.dom.style.display = 'none'
    };
    Control.prototype._beforeDeactivate = null;
    return Control
})();
window.Uppod.Control = UppodControl;
var MediaW, __bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
};
MediaW = (function() {
    function MediaW(_at_options) {
        this.options = _at_options;
        this._onSourceError = __bind(this._onSourceError, this);
        this._onVideoError = __bind(this._onVideoError, this);
        this._onEnded = __bind(this._onEnded, this);
        this._onPlayProcess = __bind(this._onPlayProcess, this);
        this._onPlaying = __bind(this._onPlaying, this);
        this._onPlay = __bind(this._onPlay, this);
        this._onPause = __bind(this._onPause, this);
        this._onError = __bind(this._onError, this);
        this._onQuality = __bind(this._onQuality, this);
        this._isPreroll = __bind(this._isPreroll, this);
        this.onError = new Uppod.Event();
        this.onPlayProcess = new Uppod.Event();
        this.onEnded = new Uppod.Event();
        this.onQuality = new Uppod.Event();
        this.dom = createElement(this.options.mode);
        this.dom.className = 'uppod-media';
        this.dom.setAttribute("playsinline", "1");
        this.dom.addEventListener('error', this._onVideoError);
        this.dom.addEventListener('quality', this._onQuality);
        this.dom.addEventListener('ended', this._onEnded);
        this.dom.addEventListener('play', this._onPlay);
        this.dom.addEventListener('pause', this._onPause);
        this.dom.addEventListener('playing', this._onPlaying);
        if (Uppod.browser.forceNativePlayBtn && this._isPreroll()) {
            this.dom.style.visibility = 'hidden'
        }
    }
    MediaW.prototype.dom = null;
    MediaW.prototype.hls = null;
    MediaW.prototype.options = null;
    MediaW.prototype.sources = null;
    MediaW.prototype.onError = 'Uppod.Event';
    MediaW.prototype.onEnded = 'Uppod.Event';
    MediaW.prototype.onPlayProcess = 'Uppod.Event';
    MediaW.prototype.onQuality = 'Uppod.Event';
    MediaW.TICK_SEC = 0.1;
    MediaW.prototype.setSources = function(url) {
        var _hls;
        if (url.indexOf(".m3u8") > 0 && this.options.vars.hls_plugin == 1) {
            if (!Hls.isSupported() || this.options.mobile) {} else {
                var _dom = this.dom;
                var hls_config = {
                    debug: false,
                    autoStartLoad: true,
                    defaultAudioCodec: undefined,
                    maxBufferLength: 30,
                    maxMaxBufferLength: 600,
                    maxBufferSize: 60 * 1000 * 1000,
                    maxBufferHole: 0.3,
                    maxSeekHole: 2,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: 10,
                    enableWorker: true,
                    enableSoftwareAES: true,
                    manifestLoadingTimeOut: 10000,
                    manifestLoadingMaxRetry: 6,
                    manifestLoadingRetryDelay: 500,
                    levelLoadingTimeOut: 10000,
                    levelLoadingMaxRetry: 6,
                    levelLoadingRetryDelay: 500,
                    fragLoadingTimeOut: 20000,
                    fragLoadingMaxRetry: 6,
                    fragLoadingRetryDelay: 500,
                    fpsDroppedMonitoringPeriod: 5000,
                    fpsDroppedMonitoringThreshold: 0.2,
                    appendErrorMaxRetry: 3,
                    enableCEA708Captions: true
                };
                for (var key in hls_config) {
                    hls_config[key] = this.options.vars['hls_' + key]
                };
                var _hls = new Hls(hls_config);
                _hls.attachMedia(this.dom);
                _hls.on(Hls.Events.MEDIA_ATTACHED, function() {
                    _hls.loadSource(url);
                    Uppod.trace("HLS attached");
                    _hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {
                        if (data.levels.length > 0) {
                            var event;
                            if (document.createEvent) {
                                event = document.createEvent("HTMLEvents");
                                event.initEvent("quality", true, true)
                            } else {
                                event = document.createEventObject();
                                event.eventType = "onQuality"
                            }
                            event.eventName = "quality";
                            if (document.createEvent) {
                                _dom.dispatchEvent(event)
                            } else {
                                _dom.fireEvent("quality", event)
                            }
                        }
                    });
                    _hls.on(Hls.Events.ERROR, function(event, data) {
                        console.log("HLS error (fatal:" + data.fatal + ")");
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                var event;
                                if (document.createEvent) {
                                    event = document.createEvent("HTMLEvents");
                                    event.initEvent("error", true, true)
                                } else {
                                    event = document.createEventObject();
                                    event.eventType = "onError"
                                }
                                event.eventName = "error";
                                event.data = "network " + (data.response ? data.response.code : '');
                                if (document.createEvent) {
                                    _dom.dispatchEvent(event)
                                } else {
                                    _dom.fireEvent("error", event)
                                }
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                if (data.fatal) {
                                    console.log("HLS fatal media error encountered, try to recover");
                                    _hls.recoverMediaError()
                                }
                                break;
                            default:
                                if (data.fatal) {
                                    _hls.destroy()
                                }
                                var event;
                                if (document.createEvent) {
                                    event = document.createEvent("HTMLEvents");
                                    event.initEvent("error", true, true)
                                } else {
                                    event = document.createEventObject();
                                    event.eventType = "onError"
                                }
                                event.eventName = "error";
                                if (document.createEvent) {
                                    _dom.dispatchEvent(event)
                                } else {
                                    _dom.fireEvent("error", event)
                                }
                                break
                        }
                    })
                })
            }
        }
        MediaW.prototype.hls = _hls;
        Uppod.trace("MediaW#setSources url=" + url);
        this._onErrorOnce = false;
        if (url.indexOf('|') > 0) {
            this.sources = url.split('|')
        } else if (url !== '') {
            this.sources = [url]
        } else {
            this.sources = []
        }
        return this._createSourcesDom()
    };
    MediaW.prototype.hlsAttached = function() {};
    MediaW.prototype.play = function() {
        if (this.options.ads) {
            this.options.ads.unlockPlay()
        }
        if (this._isPreroll()) {
            return this.options.ads.playPreroll()
        } else {
            return this.dom.play()
        }
    };
    MediaW.prototype.pause = function() {
        this.dom.pause();
        if (this.options.ads && this.options.ads.isPauseroll) {
            return this.options.ads.playPauseroll()
        }
    };
    MediaW.prototype.destroy = function() {
        clearInterval(this._intervalPlayProcess);
        MediaW.prototype.hls ? MediaW.prototype.hls.destroy() : '';
        this.dom.removeEventListener('error', this._onVideoError);
        this.dom.removeEventListener('quality', this._onQuality);
        this.dom.removeEventListener('ended', this._onEnded);
        this.dom.removeEventListener('pause', this._onPause);
        this.dom.removeEventListener('playing', this._onPlaying);
        return this._destroySourcesDom()
    };
    MediaW.prototype._sourcesDom = [];
    MediaW.prototype._okSources = [];
    MediaW.prototype._onErrorOnce = false;
    MediaW.prototype._intervalPlayProcess = -1;
    MediaW.prototype._isPreroll = function() {
        return this.options.ads && this.options.ads.isPreroll
    };
    MediaW.prototype._createSourcesDom = function() {
        var sourceDom, src, _i, _len, _ref, _results;
        this._sourcesDom = [];
        this._okSources = [];
        _ref = this.sources;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            src = _ref[_i];
            sourceDom = document.createElement('source');
            sourceDom.onerror = this._onSourceError;
            sourceDom.setAttribute('src', src);
            this._sourcesDom.push(sourceDom);
            this.dom.appendChild(sourceDom);
            _results.push(this._okSources.push(sourceDom.src))
        }
        return _results
    };
    MediaW.prototype._onError = function() {
        Uppod.trace('MediaW#_onError');
        if (!this._onErrorOnce) {
            this._onErrorOnce = true;
            return this.onError.trigger()
        }
    };
    MediaW.prototype._onQuality = function() {
        Uppod.trace('MediaW#_onQuality');
        return this.onQuality.trigger()
    };
    MediaW.prototype._onPause = function() {
        return clearInterval(this._intervalPlayProcess)
    };
    MediaW.prototype._onPlay = function() {};
    MediaW.prototype._onPlaying = function() {
        clearInterval(this._intervalPlayProcess);
        return this._intervalPlayProcess = setInterval(this._onPlayProcess, MediaW.TICK_SEC * 1000)
    };
    MediaW.prototype._onPlayProcess = function() {
        this.onPlayProcess.trigger({
            mediaW: this
        });
        if (this.options.ads) {
            return this.options.ads.mediaPlayingProcess()
        }
    };
    MediaW.prototype._onEnded = function() {
        if (this.options.ads && this.options.ads.isPostroll) {
            return this.options.ads.playPostroll({
                done: (function(_this) {
                    return function() {
                        return _this.onEnded.trigger()
                    }
                })(this)
            })
        } else {
            return this.onEnded.trigger()
        }
    };
    MediaW.prototype._onVideoError = function(event) {
        return this._onError()
    };
    MediaW.prototype._onQuality = function(event) {
        return this.onQuality.trigger()
    };
    MediaW.prototype._onSourceError = function(event) {
        var badIndex;
        badIndex = this._okSources.indexOf(event.target.src);
        if (badIndex >= 0) {
            this._okSources.splice(badIndex, 1)
        }
        if (this._okSources.length === 0) {
            return this._onError()
        }
    };
    MediaW.prototype._destroySourcesDom = function() {
        var sourceDom, _i, _len, _ref, _results;
        _ref = this._sourcesDom;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sourceDom = _ref[_i];
            sourceDom.onerror = void 0;
            sourceDom.setAttribute('src', '');
            if (sourceDom.parentNode == this.dom) {
                _results.push(this.dom.removeChild(sourceDom))
            }
        }
        return _results
    };
    return MediaW
})();
window.Uppod.MediaW = MediaW;
var Uppod = Uppod || {};
Uppod.Shaper2 = function(v) {
    this.c = createElement('div');
    this.canvas = document.createElement('canvas');
    this.canvas.height = v.h;
    this.canvas.width = v.w;
    var ctx = this.canvas.getContext("2d");
    !v.h0 ? v.h0 = 0 : '';
    if (v.bgc.indexOf('|') > 0) {
        var gr = v.bgc.split('|');
        var gradient = ctx.createLinearGradient(0, v.h0, 0, v.h);
        for (var i = 0; i < (gr.length - 1); i++) {
            gradient.addColorStop(i / (gr.length - 1), '#' + ReColor(gr[i]))
        }
        gradient.addColorStop(1, '#' + ReColor(gr[(gr.length - 1)]));
        gr[0] = ReColor(gr[0]);
        gr[(gr.length - 1)] = ReColor(gr[(gr.length - 1)]);
        v.bga1 != undefined ? gradient.addColorStop(0, 'rgba(' + HTR(gr[0]) + ',' + HTG(gr[0]) + ',' + HTB(gr[0]) + ',' + v.bga1 + ')') : '';
        v.bga2 != undefined ? gradient.addColorStop(0.999, 'rgba(' + HTR(gr[(gr.length - 1)]) + ',' + HTG(gr[(gr.length - 1)]) + ',' + HTB(gr[(gr.length - 1)]) + ',' + v.bga2 + ')') : '';
        ctx.fillStyle = gradient
    } else {
        ctx.fillStyle = "#" + ReColor(v.bgc)
    }
    if (v.a) {
        ctx.globalAlpha = v.a < 0 ? 0 : v.a
    }
    if (v.o > 0) {
        if (v.o == v.w / 2) {
            ctx.beginPath();
            ctx.arc(v.w / 2, v.h / 2, v.w / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill()
        } else {
            ctx.beginPath();
            ctx.moveTo((v.onotop == 1 ? 0 : v.o), 0);
            ctx.lineTo(v.w - (v.onotop == 1 ? 0 : v.o), 0);
            v.onotop == 1 ? '' : ctx.quadraticCurveTo(v.w, 0, v.w, v.o);
            ctx.lineTo(v.w, v.h - v.o);
            ctx.quadraticCurveTo(v.w, v.h, v.w - v.o, v.h);
            ctx.lineTo(v.o, v.h);
            ctx.quadraticCurveTo(0, v.h, 0, v.h - v.o);
            ctx.lineTo(0, v.o);
            v.onotop == 1 ? '' : ctx.quadraticCurveTo(0, 0, v.o, 0);
            !v.brdc ? v.brdc = 'cccccc' : '';
            ctx.strokeStyle = '#' + ReColor(v.brdc);
            if (v.brd == 0 || !v.brd) {
                v.brd = 0.1
            }
            ctx.lineWidth = v.brd;
            ctx.stroke();
            ctx.fill()
        }
    } else {
        ctx.fillRect(0, 0, v.w, v.h)
    }
    delete ctx;
    this.c.appendChild(this.canvas)
};
window.Uppod.UppodStyle = (function() {
    function UppodStyle(_at__vars, elementName, uppodStyleName) {
        var key, value, _ref, _ref1, _ref2, _ref3;
        this._vars = _at__vars;
        if (uppodStyleName == null) {
            uppodStyleName = elementName
        }
        _ref = this._vars.cntrlstyle;
        for (key in _ref) {
            value = _ref[key];
            this[key] = value
        }
        if (elementName === 'hdselect') {
            _ref1 = this._vars.cntrlhdselect;
            for (key in _ref1) {
                value = _ref1[key];
                this[key] = value
            }
        }
        _ref2 = this._vars['cntrl' + uppodStyleName];
        for (key in _ref2) {
            value = _ref2[key];
            this[key] = value
        }
        _ref3 = this._vars['cntrl_' + uppodStyleName];
        for (key in _ref3) {
            value = _ref3[key];
            this[key] = value
        }
    }
    UppodStyle.prototype.get = function(key, options) {
        return this[key] || this._vars.lang2[options.or_lang2]
    };
    return UppodStyle
})();
Uppod.CheckBase64 = function(i) {
    if (i.indexOf('http://') == 0 && i.indexOf('.') == -1 && i.length > 100) {
        i = 'data:image/png;base64,' + i.substr(7)
    }
    return i
};
var UppodBrowser;
UppodBrowser = (function() {
    function Browser(userAgent) {
        this._userAgent = userAgent || navigator.userAgent;
        this._property('restrictMediaPlay', function() {
            return this._mobile() && !this._firefox()
        });
        this._property('forceNativePlayBtn', function() {
            return this._iPhone()
        });
        this._property('restrictMediaClick', function() {
            return this._mobile() && this._ios()
        });
        this._property('restrictMediaMuted', function() {
            return this._mobile() && this._ios()
        });
        this._property('hasMouseEvents', function() {
            return !this._mobile()
        });
        this._property('osWin', function() {
            return this._osWin()
        });
        this._property('isOpera', function() {
            return this._opera()
        });
        this._property('isIE', function() {
            return this._ie()
        });
        this._property('forceFullscreen', function() {
            return this._iPhone()
        });
        this._property('hasMp4', function() {
            var doesNot;
            doesNot = doesNot || (this._osWin() && this._opera());
            if (doesNot) {
                return false
            } else {
                return true
            }
        });
        this._property('hasWebm', function() {
            if (this._safari() || this._ios() || this._ie()) {
                return false
            } else {
                return true
            }
        });
        this._property('hasCorsRedirect', function() {
            return false
        });
        this._property('seekAfterFullLoad', function() {
            return this._desktop() && this._safari()
        });
        this._property('doSendCanPlay', function() {
            return !this._iPhone() && !this._iPad() && !this._iPod()
        });
        this._property('hasMediaPosterShown', function() {
            return !this._android()
        });
        this._property('allowHtmlOverMediaControl', function() {
            return !this._android()
        });
        this._property('mobileFirefox', function() {
            return this._mobile() && this._firefox()
        })
    }
    Browser.prototype._desktop = function() {
        return !this._mobile()
    };
    Browser.prototype._version = function() {
        var ver;
        ver = /Version\/([0-9\.A-z]+)/.exec(this._userAgent);
        if (ver) {
            return ver[1].split('.')[0]
        } else {
            return void 0
        }
    };
    Browser.prototype._mobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this._userAgent)
    };
    Browser.prototype._ios = function() {
        return /iPhone|iPad|iPod/i.test(this._userAgent)
    };
    Browser.prototype._osWin = function() {
        return /Windows NT/i.test(this._userAgent)
    };
    Browser.prototype._ie = function() {
        return /MSIE|Trident|Edge/i.test(this._userAgent)
    };
    Browser.prototype._android = function() {
        return /Android/i.test(this._userAgent)
    };
    Browser.prototype._firefox = function() {
        return /Firefox/i.test(this._userAgent)
    };
    Browser.prototype._opera = function() {
        return /OPR\//i.test(this._userAgent)
    };
    Browser.prototype._safari = function() {
        return !this._chrome() && /Safari/i.test(this._userAgent)
    };
    Browser.prototype._chrome = function() {
        return /Chrome/i.test(this._userAgent)
    };
    Browser.prototype._iPhone = function() {
        return /iPhone/i.test(this._userAgent)
    };
    Browser.prototype._iPad = function() {
        return /iPad/i.test(this._userAgent)
    };
    Browser.prototype._iPod = function() {
        return /iPod/i.test(this._userAgent)
    };
    Browser.prototype._property = function(name, getCallback) {
        return Object.defineProperty(this, name, {
            get: getCallback
        })
    };
    return Browser
})();
window.Uppod.Browser = UppodBrowser;
window.Uppod.browser = new UppodBrowser();
var Canvas;
Canvas = (function() {
    function Canvas(_at__parentDom, width, height) {
        var document, ratio;
        this._parentDom = _at__parentDom;
        document = this._parentDom.ownerDocument;
        this.dom = document.createElement('canvas');
        this.context = this.dom.getContext('2d');
        ratio = 1;
        if (this.context.webkitBackingStorePixelRatio < 2) {
            ratio = window.devicePixelRatio || 1
        }
        this.context.scale(ratio, ratio);
        this.dom.width = width * ratio;
        this.dom.height = height * ratio;
        this._parentDom.appendChild(this.dom)
    }
    Canvas.prototype.context = {};
    Canvas.prototype.dom = {};
    Canvas.prototype._parentDom = {};
    return Canvas
})();
window.Uppod.Canvas = Canvas;
window.Uppod.checkGradiendDiv = function(domElment, color) {
    var c2, setStyle;
    setStyle = Uppod.setStyle;
    if (color.indexOf('|') > 0) {
        c2 = color.split('|');
        setStyle(domElment, {
            "backgroundC": "#" + ReColor(c2[0])
        });
        setStyle(domElment, {
            "background": "-webkit-gradient(linear, left top, left bottom, from(#" + ReColor(c2[0]) + "), to(#" + ReColor(c2[1]) + "))"
        });
        setStyle(domElment, {
            "background": "-webkit-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
        });
        setStyle(domElment, {
            "background": "-moz-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
        });
        setStyle(domElment, {
            "background": "-ms-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
        });
        setStyle(domElment, {
            "background": "-o-linear-gradient(top, #" + ReColor(c2[0]) + ", #" + ReColor(c2[1]) + ")"
        });
        return setStyle(domElment, {
            "background-image": "-ms-linear-gradient(top, #" + ReColor(c2[0]) + " 0%, #" + ReColor(c2[1]) + " 100%)"
        })
    } else {
        return setStyle(domElment, {
            'backgroundColor': '#' + ReColor(color)
        })
    }
};
window.Uppod.ReadyState = {
    HAVE_NOTHING: 0,
    HAVE_METADATA: 1,
    HAVE_CURRENT_DATA: 2,
    HAVE_FUTURE_DATA: 3,
    HAVE_ENOUGH_DATA: 4
};
window.Uppod.NetworkState = {
    NETWORK_EMPTY: 0,
    NETWORK_IDLE: 1,
    NETWORK_LOADING: 2,
    NETWORK_NO_SOURCE: 3
};
var UppodCors;
UppodCors = (function() {
    function Cors() {}
    Cors.get = function(url, callbacks) {
        var xhr;
        xhr = this._createCORSRequest('GET', url);
        if (callbacks) {
            if (typeof callbacks === "function") {
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        return callbacks(xhr.responseText)
                    }
                }
            }
            if (callbacks.success) {
                xhr.onload = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        return callbacks.success(xhr.responseText)
                    } else {
                        return callbacks.error(xhr)
                    }
                }
            }
            if (callbacks.error) {
                xhr.onerror = function() {
                    return callbacks.error(xhr)
                }
            }
        }
        return xhr.send()
    };
    Cors.gif = function(url) {
        var gif = document.createElement("img");
        gif.setAttribute('src', url);
        gif.setAttribute('height', '1px');
        gif.setAttribute('width', '1px');
        document.body.appendChild(gif);
        gif.style.display = "none";
        return true
    };
    Cors._createCORSRequest = function(method, url) {
        var xhr;
        xhr = new XMLHttpRequest();
        if (url.indexOf("adpod.in") == -1 && url.indexOf("noCredentials") == -1) {
            xhr.withCredentials = true
        }
        if (xhr['withCredentials'] != null) {
            xhr.open(method, url, true)
        } else if (typeof XDomainRequest !== "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url)
        } else {
            throw 'CORS is not supported by the browser'
        }
        return xhr
    };
    return Cors
})();
window.Uppod.Cors = UppodCors;
Uppod[('play' + 'e' + 'r' + 'E' + 't' + 'Wra' + 'p').replace('Et', '')] = '{{ aes_key }}';
Uppod.css = Uppod.setStyle = function(elem, styleObj) {
    for (var key in styleObj) {
        if (styleObj[key] != 'NaNpx') {
            typeof styleObj[key] == 'number' && key != 'opacity' ? styleObj[key] += 'px' : '';
            key == 'float' ? elem.style.cssFloat = styleObj[key] : '';
            key == 'pointer-events' ? elem.style.pointerEvents = styleObj[key] : '';
            if (elem != null) {
                elem.style[key] = styleObj[key]
            }
        }
    }
};
Uppod.cssShow = function(dom) {
    dom.style.display = 'block'
};
Uppod.cssHide = function(dom) {
    dom.style.display = 'none'
};
Uppod.addClass = function(dom, className) {
    if (dom.classList) dom.classList.add(className);
    else dom.className += ' ' + className
};
Uppod.removeClass = function(dom, className) {
    if (dom.classList) {
        dom.classList.remove(className)
    } else {
        var p = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');
        dom.className = dom.className.replace(p, ' ')
    }
};
var UppodEvent;
UppodEvent = (function() {
    function Event() {
        this.listeners = []
    }
    Event.prototype.listeners = [];
    Event.prototype.trigger = function(dataObj) {
        var listener, _i, _len, _ref, _results;
        _ref = this.listeners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            listener = _ref[_i];
            _results.push(listener(dataObj))
        }
        return _results
    };
    Event.prototype.bind = function(callback) {
        return this.listeners.push(callback)
    };
    Event.prototype.remove = function(callbackRef) {
        var i, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.listeners.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (this.listeners[i] === callbackRef) {
                _results.push(this.listeners.splice(i, 1))
            } else {
                _results.push(void 0)
            }
        }
        return _results
    };
    return Event
})();
window.Uppod.Event = UppodEvent;
Uppod.Fullscreen = (function() {
    function Fullscreen() {}
    Fullscreen.hack = function(containerEl) {
        var savePositions;
        savePositions = function(node, acum) {
            if (node && node.tagName !== document.body.tagName) {
                if (node.style.position !== '') {
                    acum.push({
                        node: node,
                        position: node.style.position
                    })
                }
                savePositions(node.parentNode, acum)
            }
            return acum
        };
        return savePositions(containerEl.parentNode, [])
    };
    Fullscreen.request = function(elem) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
            return true
        } else if (elem.requestFullscreen) {
            elem.requestFullscreen();
            return true
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
            return true
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
            return true
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
            return true
        }
        return false
    };
    return Fullscreen
})();
Uppod.IconImg = function(icon, c, n, w, h, half) {
    var CSS = Uppod.setStyle;
    var CheckBase64 = Uppod.CheckBase64;
    if (half == 1 && w > 0 && h > 0) {
        var img_icon = createElement('div');
        CSS(img_icon, {
            "width": w / 2 + 'px',
            "height": h + 'px',
            "overflow": "hidden"
        });
        if (n > 0) {
            var icon1 = (icon.indexOf("|") > -1 ? icon.substr(0, icon.indexOf("|")) : icon);
            var icon2 = (icon.indexOf("|") > -1 ? icon.substr(icon.indexOf("|") + 1) : icon);
            icon1 = CheckBase64(icon1);
            icon2 = CheckBase64(icon2);
            n == 1 ? CSS(img_icon, {
                "background": "url(" + icon1 + ") no-repeat 0 0"
            }) : '';
            n == 2 ? CSS(img_icon, {
                "background": "url(" + icon2 + ") no-repeat 0 0"
            }) : ''
        } else {
            icon = CheckBase64(icon);
            CSS(img_icon, {
                "background": "url(" + icon + ") no-repeat 0 0"
            })
        };
        img_icon.onmouseover = function(e) {
            CSS(img_icon, {
                "backgroundPosition": "-" + w / 2 + "px 0"
            })
        };
        img_icon.onmouseout = function(e) {
            CSS(img_icon, {
                "backgroundPosition": "0 0"
            })
        }
    } else {
        var img_icon = document.createElement('img');
        if (n > 0) {
            var icon1 = icon.indexOf("|") > -1 ? icon.substr(0, icon.indexOf("|")) : icon;
            var icon2 = icon.indexOf("|") > -1 ? icon.substr(icon.indexOf("|") + 1) : icon;
            icon1 = CheckBase64(icon1);
            icon2 = CheckBase64(icon2);
            n == 1 ? img_icon.setAttribute("src", icon1) : '';
            n == 2 ? img_icon.setAttribute("src", icon2) : ''
        } else {
            img_icon.setAttribute("src", icon)
        }
    }
    c.appendChild(img_icon)
};
var JSON;
if (!JSON) {
    JSON = {}
}
JSON.keyup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
(function() {
    'use strict';

    function f(n) {
        return n < 10 ? '0' + n : n
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key)
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null'
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null'
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' '
                }
            } else if (typeof space === 'string') {
                indent = space
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify')
            }
            return str('', {
                '': value
            })
        }
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j
            }
            throw new SyntaxError('JSON.parse')
        }
    }
}());
var UppodLinkParser;
UppodLinkParser = (function() {
    function LinkParser(link) {
        var andLinks, i, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        this.orLinks = link.split(' or ');
        _ref = this.orLinks;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            link = _ref[i];
            this.orLinks[i] = link.split(' and ')
        }
        _ref1 = this.orLinks;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            andLinks = _ref1[_j];
            for (i = _k = 0, _len2 = andLinks.length; _k < _len2; i = ++_k) {
                link = andLinks[i];
                andLinks[i] = link.trim()
            }
        }
    }
    LinkParser.prototype.orLinks = [];
    return LinkParser
})();
window.Uppod.LinkParser = UppodLinkParser;
Uppod.log = function(mes) {
    if (console.log) {
        return console.log(mes)
    }
};
Uppod.trace = function(mes) {
    var mesEl, traceConsole;
    if (Uppod.isTrace) {
        traceConsole = document.body.querySelector('.uppod-trace');
        if (!traceConsole) {
            traceConsole = document.createElement('pre');
            traceConsole.className = 'uppod-trace';
            document.body.insertBefore(traceConsole, document.body.firstChild);
            Uppod.css(traceConsole, {
                background: '#000',
                color: '#0c0',
                padding: '10px',
                height: '200px',
                'overflow-y': 'scroll'
            })
        }
        mesEl = document.createTextNode(mes + "\n");
        return traceConsole.insertBefore(mesEl, traceConsole.firstChild)
    }
};
Uppod.measureText = function(pText, pFontSize, pStyle) {
    var css = Uppod.setStyle;
    var lDiv = document.createElement('lDiv');
    document.body.appendChild(lDiv);
    if (pStyle != null) {
        lDiv.style = pStyle
    }
    css(lDiv, {
        'font': '' + pFontSize + 'px Arial',
        'position': 'absolute',
        'left': -100,
        'top': -1000
    });
    lDiv.innerHTML = pText;
    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };
    document.body.removeChild(lDiv);
    lDiv = null;
    return lResult
};

function Tween(v) {
    v.dur == undefined ? v.dur = 1000 : '';
    if (v.what == 'a') {
        new Fx.Morph(v.mc, {
            duration: v.dur
        }).start({
            'opacity': [v.from, v.to]
        })
    }
}

function ReColor(c) {
    if (c) {
        var c0 = c;
        c.indexOf('|') > -1 ? c = c.split('|')[0] : '';
        if (c.length == 1) {
            c = c0 + c0 + c0 + c0 + c0 + c0
        }
        if (c.length == 2) {
            c = '0000' + c
        }
        if (c.length == 3) {
            c = c0.substr(0, 1) + c0.substr(0, 1) + c0.substr(1, 2) + c0.substr(1, 2) + c0.substr(2, 3) + c0.substr(2, 3)
        }
        if (c.length == 4) {
            c = '00' + c
        }
        if (c.length == 5) {
            c = '0' + c
        }
    }
    return c
}

function HTR(h) {
    return parseInt((cutHex(h)).substring(0, 2), 16)
}

function HTG(h) {
    return parseInt((cutHex(h)).substring(2, 4), 16)
}

function HTB(h) {
    return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function ShowHide(mc) {
    mc.style.display == 'none' ? mc.style.display = 'block' : mc.style.display = 'none'
}

function Show(mc) {
    if (mc) {
        mc.style.display = 'block'
    }
}

function Hide(mc) {
    if (mc) {
        mc.style.display = 'none'
    }
}
var createElement = function(x) {
    x == 'div' ? x = 'uppod_player_div' : '';
    var e = document.createElement(x);
    e.style.display = 'block';
    return e
};
window[('epyVidh' + 'v' + 'a' + 'l' + 'u' + 'p').replace('pyVidh', '')] = function(str) {
    UppodUpcat.show(str)
};

function ToggleView(mc) {
    if (mc) {
        mc.style.display == 'none' ? mc.style.display = 'block' : mc.style.display = 'none'
    }
}

function is_array(input) {
    return typeof(input) == 'object' && (input instanceof Array)
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
Uppod.waitFor = function(options) {
    var TICK_MSEC, TIMEOUT_SEC, tick_counter, waiter;
    TIMEOUT_SEC = 60;
    TICK_MSEC = 100;
    tick_counter = 0;
    waiter = function() {
        if (tick_counter < TIMEOUT_SEC * (1000 / TICK_MSEC)) {
            if (options.condition()) {
                return options.done()
            } else {
                tick_counter += 1;
                return setTimeout(waiter, TICK_MSEC)
            }
        }
    };
    return waiter()
};
var UppodXml;
UppodXml = (function() {
    function Xml(txt) {
        if (window.DOMParser) {
            this._xml = new DOMParser().parseFromString(txt, 'text/xml')
        } else {
            this._xml = new ActiveXObject('Microsoft.XMLDOM');
            this._xml.async = false;
            this._xml.loadXML(txt)
        }
        window.xml = this
    }
    Xml.prototype.getOne = function(selector) {
        return this._xml.querySelector(selector)
    };
    Xml.prototype.get = function(selector) {
        return this._xml.querySelectorAll(selector)
    };
    Xml.prototype._xml = null;
    return Xml
})();
window.Uppod.Xml = UppodXml;
var __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key]
        }

        function ctor() {
            this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child
    },
    __hasProp = {}.hasOwnProperty;
window.Uppod.ControlBar = (function(_super) {
    __extends(ControlBar, _super);

    function ControlBar(_at__uppod) {
        this._uppod = _at__uppod;
        ControlBar.__super__.constructor.call(this, 'ControlBar', {
            dom: createElement('div')
        });
        this.css({
            'position': 'absolute'
        });
        this.dom.style.zIndex = 5;
        this._setLeftTop();
        this._uppod.playerBodyElement().c.appendChild(this.dom)
    }
    ControlBar.prototype._uppod = null;
    ControlBar.prototype._vars = function() {
        return this._uppod.vars()
    };
    ControlBar.prototype._calcTop = function() {
        var controlBarPadding, vars;
        vars = this._vars();
        controlBarPadding = vars.cntrlout === 1 ? vars.padding / 2 : 0;
        if (this._uppod.isFullscreen()) {
            return vars.sh - vars.cntrloutheight - controlBarPadding - 0
        } else {
            return vars.ph - vars.cntrloutheight - controlBarPadding - vars.padding
        }
    };
    ControlBar.prototype._setLeftTop = function() {
        return this.css({
            'top': this._calcTop() - this._vars().cntrlbgmargin,
            'left': this._uppod.isFullscreen() ? this._vars().cntrlbgmargin : this._vars().padding + this._vars().cntrlbgmargin
        })
    };
    ControlBar.prototype.resize = function() {
        return this._setLeftTop()
    };
    return ControlBar
})(window.Uppod.Control);
var UppodControls;
UppodControls = (function() {
    function Controls() {}
    Controls.prototype.activateBaseUI = function() {
        return this.activate(Controls._base)
    };
    Controls.prototype.deactivateBaseUI = function() {
        return this.deactivate(Controls._base)
    };
    Controls.prototype.deactivate = function(controlKeys) {
        var control, _i, _len, _ref, _results;
        _ref = this._wrapEach(controlKeys);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            control = _ref[_i];
            _results.push(control.deactivate())
        }
        return _results
    };
    Controls.prototype.activate = function(controlKeys) {
        var control, _i, _len, _ref, _results;
        _ref = this._wrapEach(controlKeys);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            control = _ref[_i];
            _results.push(control.activate())
        }
        return _results
    };
    Controls.prototype.add = function(control) {
        return this[control.key] = control
    };
    Controls.prototype.addElement = function(key, element) {
        return this[key] = new this._create(key, {
            element: element
        })
    };
    Controls.prototype.addDom = function(key, dom) {
        return this[key] = new this._create(key, {
            dom: dom
        })
    };
    Controls.prototype._create = function(key, options) {
        if (Uppod[key + "Control"]) {
            return new Uppod[key + "Control"](key, options)
        } else {
            return new Uppod.Control(key, options)
        }
    };
    Controls.prototype._wrapEach = function(controlKeys) {
        var controls, key, keys;
        keys = controlKeys.split(' ');
        controls = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                _results.push(this[key])
            }
            return _results
        }).call(this);
        return controls.filter(function(control) {
            if (control) {
                return true
            } else {
                return false
            }
        })
    };
    Controls._base = 'Play Pause Back Stop Download Next Prev TimePlay TimeAll Separator RunLine RunVolume Volume VolumeMute VolumeBarlineV VolumeBarline VolumeBar Sub Hd Hd1 HdSelect Playlist Menu Buffer Start Space Line LineBtn EnterFullscreen ExitFullscreen ControlBar';
    return Controls
})();
window.Uppod.Controls = UppodControls;
var Uppod = Uppod || {};
Uppod.Element = function(vars, name, bw, bh, nm2, uppodStyleName) {
    var CSS = Uppod.setStyle;
    var measureText = Uppod.measureText;
    var IconImg = Uppod.IconImg;
    var selfDom = this.selfDom = this.c = createElement('div');
    var uppodStyle = this.uppodStyle = this.s = new Uppod.UppodStyle(vars, name, uppodStyleName);
    uppodStyle.scale ? uppodStyle.scale *= vars.cntrlsize : '';
    uppodStyle.scale2 ? uppodStyle.scale2 *= vars.cntrlsize : '';
    if (name == 'hd' || name == 'hd1') {
        bw = measureText((name == 'hd1' && uppodStyle.icon2 ? uppodStyle.icon2 : uppodStyle.icon), 12).width + 6 * uppodStyle.scale
    }
    if (name == 'sub') {
        bw = measureText(uppodStyle.icon, 12).width + 6 * uppodStyle.scale
    }
    if (nm2 == 'all') {
        uppodStyle.color = uppodStyle.color_all
    }
    if (nm2 == 'load') {
        uppodStyle.color = uppodStyle.color_load
    }
    if (nm2 == 'play') {
        uppodStyle.color = uppodStyle.color_play
    }
    if (name == 'start') {
        if (uppodStyle.bg == 1) {
            if (bh * uppodStyle.scale2 > uppodStyle.bg_h || bw * uppodStyle.scale2 > uppodStyle.bg_w) {
                bh *= uppodStyle.scale2;
                bw *= uppodStyle.scale2
            } else {
                bh = uppodStyle.bg_h;
                bw = uppodStyle.bg_w
            }
        } else {
            bh *= uppodStyle.scale2;
            bw *= uppodStyle.scale2
        }
    }
    if (name == 'separator') {
        if (vars.sid) {
            if (uppodStyle.scale != 1) {
                uppodStyle.margintop = 0;
                uppodStyle.marginbottom = 0;
                if (uppodStyle.scale * 20 > vars.cntrloutheight) {
                    uppodStyle.scale = vars.cntrloutheight / 20
                }
            }
        }
    }
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    var ratio = 1;
    if (this.ctx.webkitBackingStorePixelRatio < 2) {
        ratio = window.devicePixelRatio || 1
    };
    this.canvas.height = bh * uppodStyle.scale * ratio;
    this.canvas.width = bw * uppodStyle.scale * ratio;
    this.ctx.scale(ratio, ratio);
    if (uppodStyle.bg == 1 && name.indexOf('line') == -1) {
        var bg = new Uppod.Shaper2({
            w: bw * uppodStyle.scale,
            h: bh * uppodStyle.scale,
            o: (uppodStyle.bg_o > 1 ? uppodStyle.bg_o / 2 : bh / 2 * uppodStyle.bg_o * uppodStyle.scale),
            bgc: uppodStyle.bgcolor,
            sh: uppodStyle.bg_sh,
            sh_c: uppodStyle.sh_c,
            sh_a: uppodStyle.sh_a
        });
        selfDom.appendChild(bg.c);
        if (uppodStyle.bg_a) {
            CSS(bg.canvas, {
                "opacity": uppodStyle.bg_a,
                "filter": "alpha(opacity=" + (uppodStyle.bg_a * 100) + ")"
            })
        }
        CSS(bg.canvas, {
            "position": "absolute",
            "top": uppodStyle.margintop * 1 - uppodStyle.marginbottom * 1,
            "left": (1 - uppodStyle.scale) * bw / 2
        });
        if (uppodStyle.bg_gl == 1) {
            var bg_gl = new Uppod.Shaper2({
                w: bw * uppodStyle.scale,
                h: bh * uppodStyle.scale,
                o: bh / 2 * uppodStyle.bg_o * uppodStyle.scale,
                bgc: uppodStyle.gl_color + '|' + uppodStyle.gl_color,
                bga1: uppodStyle.gl_a1,
                bga2: uppodStyle.gl_a2
            });
            selfDom.appendChild(bg_gl.c);
            CSS(bg_gl.canvas, {
                "position": "absolute",
                "top": 0,
                "left": (1 - uppodStyle.scale) * bw / 2 + (bh * uppodStyle.scale / 8),
                "height": (bh * uppodStyle.scale / 2),
                "width": bw * uppodStyle.scale - (bh * uppodStyle.scale / 4)
            })
        }
    }
    this.fstyle = '';
    if (uppodStyle.color) {
        if (uppodStyle.color.indexOf('|') > 0) {
            var gr = uppodStyle.color.split('|');
            var gradient = this.ctx.createLinearGradient(0, 0, 0, bh * uppodStyle.scale);
            for (this.j = 0; this.j < (gr.length - 1); this.j++) {
                gradient.addColorStop(this.j / (gr.length - 1), '#' + ReColor(gr[this.j]))
            }
            gradient.addColorStop(1, '#' + ReColor(gr[(gr.length - 1)]));
            this.fstyle = gradient
        } else {
            this.fstyle = "#" + ReColor(uppodStyle.color)
        }
    }
    this.ctx.fillStyle = this.fstyle;
    if (uppodStyle.sh == 1) {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = (uppodStyle.sh_under == 1 ? 2 : 0);
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = 'rgba(' + HTR('#' + ReColor(uppodStyle.sh_c)) + ',' + HTG('#' + ReColor(uppodStyle.sh_c)) + ',' + HTB('#' + ReColor(uppodStyle.sh_c)) + ',' + uppodStyle.sh_a + ')'
    }
    if (name == 'play' || name == 'start') {
        var playscl = (name == 'play' ? uppodStyle.scale : uppodStyle.scale2);
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 1, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover);
            if (name == 'start' && uppodStyle.pic_w > 1 && uppodStyle.pic_h > 1) {
                bw = uppodStyle.halficonisover == 1 ? uppodStyle.pic_w / 2 : uppodStyle.pic_w;
                bh = uppodStyle.pic_h
            }
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * playscl, 4 * playscl);
                this.ctx.lineTo(16 * playscl, 9 * playscl);
                this.ctx.lineTo(6 * playscl, 15 * playscl);
                this.ctx.lineTo(6 * playscl, 4 * playscl);
                this.ctx.closePath();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * playscl, 5 * playscl);
                this.ctx.quadraticCurveTo(6 * playscl, 4 * playscl, 7 * playscl, 4 * playscl);
                this.ctx.lineTo(15 * playscl, 9 * playscl);
                this.ctx.quadraticCurveTo(16 * playscl, 10 * playscl, 15 * playscl, 11 * playscl);
                this.ctx.lineTo(7 * playscl, 16 * playscl);
                this.ctx.quadraticCurveTo(6 * playscl, 16 * playscl, 6 * playscl, 15 * playscl);
                this.ctx.lineTo(6 * playscl, 5 * playscl);
                this.ctx.closePath();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.moveTo(6 * playscl, 5 * playscl);
                this.ctx.lineTo(15 * playscl, 10 * playscl);
                this.ctx.lineTo(6 * playscl, 15 * playscl);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 3 * playscl;
                this.ctx.stroke()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * playscl, 4 * playscl);
                this.ctx.lineTo(16 * playscl, 10 * playscl);
                this.ctx.lineTo(6 * playscl, 16 * playscl);
                this.ctx.lineTo(6 * playscl, 4 * playscl);
                this.ctx.lineTo(6 * playscl, 5 * playscl);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 1.5 * playscl;
                this.ctx.stroke()
            }
        }
    }
    if (name.indexOf('my') == 0) {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 2, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            selfDom.innerHTML = uppodStyle.icon;
            CSS(this.c, {
                "width": bw,
                "color": "#" + uppodStyle.color,
                "font": "10px Arial"
            })
        }
    }
    if (name == 'sub') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 2, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            this.ctx.fillStyle = uppodStyle.color;
            !uppodStyle.icon2 ? uppodStyle.icon2 = uppodStyle.icon : '';
            this.ctx.font = "normal " + (12 * uppodStyle.scale) + "px Arial";
            uppodStyle.icon2 = uppodStyle.icon2.replace(/(<([^>]+)>)/ig, "");
            uppodStyle.icon = uppodStyle.icon.replace(/(<([^>]+)>)/ig, "");
            this.ctx.fillText((name == 'hd1' ? uppodStyle.icon2 : uppodStyle.icon), 3 * uppodStyle.scale, 15 * uppodStyle.scale)
        }
    }
    if (name == 'pause') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 2, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        }
        if (uppodStyle.icon == 0) {
            this.ctx.beginPath();
            this.ctx.fillRect(6 * uppodStyle.scale, 5 * uppodStyle.scale, 3 * uppodStyle.scale, 10 * uppodStyle.scale);
            this.ctx.fillRect(12 * uppodStyle.scale, 5 * uppodStyle.scale, 3 * uppodStyle.scale, 10 * uppodStyle.scale);
            this.ctx.closePath();
            this.ctx.fill()
        }
        if (uppodStyle.icon > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(7 * uppodStyle.scale, 5 * uppodStyle.scale);
            this.ctx.lineTo(7 * uppodStyle.scale, 15 * uppodStyle.scale);
            this.ctx.moveTo(14 * uppodStyle.scale, 5 * uppodStyle.scale);
            this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
            this.ctx.strokeStyle = "#" + uppodStyle.color;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.lineWidth = 3 * uppodStyle.scale;
            this.ctx.stroke()
        }
    }
    if (name == 'stop') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, (uppodStyleName == 'play' ? 2 : 0), uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(5 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.moveTo(14 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 3 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 4 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 1.5 * uppodStyle.scale;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.strokeRect(5 * uppodStyle.scale, 5 * uppodStyle.scale, 11 * uppodStyle.scale, 11 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.stroke()
            }
        }
    }
    if (name == 'download') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(8 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(8 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(8 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(4 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 11 * uppodStyle.scale);
                this.ctx.lineTo(16 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(17 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(5 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
        }
    }
    if (name == 'next') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(4 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(16 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(7 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 17 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(12 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
        }
    }
    if (name == 'prev') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(4 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(16 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(16 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(12 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(8 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 17 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(7 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
        }
    }
    if (name == 'back') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(4 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(24 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(24 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1 || uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(5 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(23 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(23 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 2 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                this.ctx.moveTo(5 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(25 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(25 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 1.5 * uppodStyle.scale;
                this.ctx.stroke()
            }
        }
    }
    if (name == 'volume' || name == 'volume_mute') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, (name == 'volume' ? 1 : 2), uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(5 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(9 * uppodStyle.scale, 11 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 11 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 8 * uppodStyle.scale);
                if (name == 'volume') {
                    this.ctx.moveTo(15 * uppodStyle.scale, 7 * uppodStyle.scale);
                    this.ctx.lineTo(16 * uppodStyle.scale, 7 * uppodStyle.scale);
                    this.ctx.lineTo(16 * uppodStyle.scale, 12 * uppodStyle.scale);
                    this.ctx.lineTo(15 * uppodStyle.scale, 12 * uppodStyle.scale);
                    this.ctx.lineTo(15 * uppodStyle.scale, 7 * uppodStyle.scale)
                }
                this.ctx.closePath();
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(4 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.lineTo(4 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.moveTo(7 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 17 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.closePath();
                if (name == 'volume') {
                    this.ctx.moveTo(15 * uppodStyle.scale, 8 * uppodStyle.scale);
                    this.ctx.arc(15 * uppodStyle.scale, 10 * uppodStyle.scale, 4 * uppodStyle.scale, Math.PI * 1.6, Math.PI / 2.3, false);
                    this.ctx.lineTo(15 * uppodStyle.scale, 12 * uppodStyle.scale);
                    this.ctx.arc(14 * uppodStyle.scale, 10 * uppodStyle.scale, 4 * uppodStyle.scale, Math.PI / 2.3, Math.PI * 1.6, true);
                    this.ctx.moveTo(16 * uppodStyle.scale, 9 * uppodStyle.scale);
                    this.ctx.lineTo(16 * uppodStyle.scale, 11 * uppodStyle.scale);
                    this.ctx.lineTo(15 * uppodStyle.scale, 11 * uppodStyle.scale);
                    this.ctx.lineTo(15 * uppodStyle.scale, 9 * uppodStyle.scale)
                }
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                ovalX = 8 * uppodStyle.scale;
                ovalY = 14 * uppodStyle.scale;
                ovalW = 7 * uppodStyle.scale;
                ovalH = 3 * uppodStyle.scale;
                this.ctx.moveTo(ovalX, ovalY - ovalH / 2);
                this.ctx.bezierCurveTo(ovalX - ovalW / 2, ovalY - ovalH / 2, ovalX - ovalW / 2, ovalY + ovalH / 2, ovalX, ovalY + ovalH / 2);
                this.ctx.bezierCurveTo(ovalX + ovalW / 2, ovalY + ovalH / 2, ovalX + ovalW / 2, ovalY - ovalH / 2, ovalX, ovalY - ovalH / 2);
                this.ctx.moveTo(10 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(11 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.quadraticCurveTo(13 * uppodStyle.scale, 4 * uppodStyle.scale, 13 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.quadraticCurveTo(15 * uppodStyle.scale, 6 * uppodStyle.scale, 17 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.quadraticCurveTo(14 * uppodStyle.scale, 8 * uppodStyle.scale, 11 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineWidth = 0.7;
                this.ctx.stroke();
                this.ctx.fill()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 1.5 * uppodStyle.scale;
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.moveTo(3 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 4 * uppodStyle.scale);
                this.ctx.lineTo(12 * uppodStyle.scale, 16 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 8 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 12 * uppodStyle.scale);
                if (name == 'volume') {
                    this.ctx.moveTo(15 * uppodStyle.scale, 7 * uppodStyle.scale);
                    this.ctx.lineTo(18 * uppodStyle.scale, 4 * uppodStyle.scale);
                    this.ctx.moveTo(15 * uppodStyle.scale, 10 * uppodStyle.scale);
                    this.ctx.lineTo(19 * uppodStyle.scale, 10 * uppodStyle.scale);
                    this.ctx.moveTo(15 * uppodStyle.scale, 13 * uppodStyle.scale);
                    this.ctx.lineTo(18 * uppodStyle.scale, 16 * uppodStyle.scale)
                }
                this.ctx.stroke()
            }
        }
    }
    if (name == 'playlist') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 4 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.clearRect(5 * uppodStyle.scale, 5 * uppodStyle.scale, 9 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.fillRect(6 * uppodStyle.scale, 6 * uppodStyle.scale, 7 * uppodStyle.scale, 1 * uppodStyle.scale);
                this.ctx.fillRect(6 * uppodStyle.scale, 8 * uppodStyle.scale, 7 * uppodStyle.scale, 1 * uppodStyle.scale);
                this.ctx.fillRect(6 * uppodStyle.scale, 10 * uppodStyle.scale, 7 * uppodStyle.scale, 1 * uppodStyle.scale);
                this.ctx.fillRect(6 * uppodStyle.scale, 12 * uppodStyle.scale, 7 * uppodStyle.scale, 1 * uppodStyle.scale);
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                for (c = 5; c < 15; c += 3) {
                    this.ctx.moveTo(4 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(16 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(16 * uppodStyle.scale, (c + 1) * uppodStyle.scale);
                    this.ctx.lineTo(4 * uppodStyle.scale, (c + 1) * uppodStyle.scale);
                    this.ctx.lineTo(4 * uppodStyle.scale, c * uppodStyle.scale)
                }
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                for (c = 4; c < 15; c += 5) {
                    this.ctx.moveTo(3 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(5 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(5 * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                    this.ctx.lineTo(3 * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                    this.ctx.lineTo(3 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.moveTo(7 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(17 * uppodStyle.scale, c * uppodStyle.scale);
                    this.ctx.lineTo(17 * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                    this.ctx.lineTo(7 * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                    this.ctx.lineTo(7 * uppodStyle.scale, c * uppodStyle.scale)
                }
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                for (c = 4; c < 15; c += 5) {
                    for (y = 4; y < 15; y += 5) {
                        this.ctx.moveTo(y * uppodStyle.scale, c * uppodStyle.scale);
                        this.ctx.lineTo((y + 2) * uppodStyle.scale, c * uppodStyle.scale);
                        this.ctx.lineTo((y + 2) * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                        this.ctx.lineTo(y * uppodStyle.scale, (c + 2) * uppodStyle.scale);
                        this.ctx.lineTo(y * uppodStyle.scale, c * uppodStyle.scale)
                    }
                }
                this.ctx.lineWidth = 0.1;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath()
            }
        }
    }
    if (name == 'full' || name == 'full_back') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, (name == 'full' ? 1 : 2), uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 4 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.clearRect(5 * uppodStyle.scale, 6 * uppodStyle.scale, 9 * uppodStyle.scale, 9 * uppodStyle.scale);
                if (name == 'full_back') {
                    this.ctx.fillRect(6 * uppodStyle.scale, 13 * uppodStyle.scale, 3 * uppodStyle.scale, 1 * uppodStyle.scale);
                    this.ctx.fillRect(6 * uppodStyle.scale, 10 * uppodStyle.scale, 1 * uppodStyle.scale, 3 * uppodStyle.scale)
                } else {
                    this.ctx.fillRect(10 * uppodStyle.scale, 7 * uppodStyle.scale, 3 * uppodStyle.scale, 1 * uppodStyle.scale);
                    this.ctx.fillRect(12 * uppodStyle.scale, 7 * uppodStyle.scale, 1 * uppodStyle.scale, 3 * uppodStyle.scale)
                }
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.beginPath();
                if (name == 'full_back') {
                    this.ctx.fillRect(7 * uppodStyle.scale, 4 * uppodStyle.scale, 11 * uppodStyle.scale, 7 * uppodStyle.scale);
                    this.ctx.clearRect(8 * uppodStyle.scale, 5 * uppodStyle.scale, 9 * uppodStyle.scale, 5 * uppodStyle.scale);
                    this.ctx.fillRect(2 * uppodStyle.scale, 7 * uppodStyle.scale, 13 * uppodStyle.scale, 8 * uppodStyle.scale);
                    this.ctx.clearRect(3 * uppodStyle.scale, 8 * uppodStyle.scale, 11 * uppodStyle.scale, 6 * uppodStyle.scale)
                } else {
                    this.ctx.fillRect(2 * uppodStyle.scale, 8 * uppodStyle.scale, 11 * uppodStyle.scale, 7 * uppodStyle.scale);
                    this.ctx.clearRect(3 * uppodStyle.scale, 9 * uppodStyle.scale, 9 * uppodStyle.scale, 5 * uppodStyle.scale);
                    this.ctx.fillRect(5 * uppodStyle.scale, 4 * uppodStyle.scale, 13 * uppodStyle.scale, 8 * uppodStyle.scale);
                    this.ctx.clearRect(6 * uppodStyle.scale, 5 * uppodStyle.scale, 11 * uppodStyle.scale, 6 * uppodStyle.scale)
                }
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(2 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 5.5 * uppodStyle.scale);
                this.ctx.lineTo(5.5 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(2 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(2 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.moveTo(14 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.lineTo(18 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.lineTo(18 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.lineTo(17 * uppodStyle.scale, 5 * uppodStyle.scale);
                this.ctx.lineTo(14.5 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 5.5 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 3 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 2 * uppodStyle.scale);
                this.ctx.moveTo(14.5 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.lineTo(17 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(18 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(18 * uppodStyle.scale, 18 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 18 * uppodStyle.scale);
                this.ctx.lineTo(15 * uppodStyle.scale, 17 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 14.5 * uppodStyle.scale);
                this.ctx.lineTo(14.5 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.moveTo(5.5 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.lineTo(7 * uppodStyle.scale, 14.5 * uppodStyle.scale);
                this.ctx.lineTo(5 * uppodStyle.scale, 17 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 18 * uppodStyle.scale);
                this.ctx.lineTo(2 * uppodStyle.scale, 18 * uppodStyle.scale);
                this.ctx.lineTo(2 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.lineTo(5.5 * uppodStyle.scale, 13 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = 'rgba(' + HTR(uppodStyle.color) + ',' + HTG(uppodStyle.color) + ',' + HTB(uppodStyle.color) + ',0.5)';
                this.ctx.fillRect(7 * uppodStyle.scale, 7 * uppodStyle.scale, 6 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.beginPath();
                if (name == 'full_back') {
                    this.ctx.moveTo(18 * uppodStyle.scale, 2 * uppodStyle.scale);
                    this.ctx.lineTo(2 * uppodStyle.scale, 16 * uppodStyle.scale);
                    this.ctx.lineTo(5 * uppodStyle.scale, 10 * uppodStyle.scale);
                    this.ctx.moveTo(2 * uppodStyle.scale, 16 * uppodStyle.scale);
                    this.ctx.lineTo(10 * uppodStyle.scale, 14 * uppodStyle.scale)
                } else {
                    this.ctx.moveTo(3 * uppodStyle.scale, 18 * uppodStyle.scale);
                    this.ctx.lineTo(17 * uppodStyle.scale, 2 * uppodStyle.scale);
                    this.ctx.lineTo(8 * uppodStyle.scale, 6 * uppodStyle.scale);
                    this.ctx.moveTo(17 * uppodStyle.scale, 2 * uppodStyle.scale);
                    this.ctx.lineTo(15 * uppodStyle.scale, 11 * uppodStyle.scale)
                }
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 1 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.closePath()
            }
        }
    }
    if (name == 'volbar') {
        this.ctx.beginPath();
        this.ctx.moveTo(0 * uppodStyle.scale, 0 * uppodStyle.scale);
        this.ctx.lineTo(3 * uppodStyle.scale, 0 * uppodStyle.scale);
        this.ctx.lineTo(3 * uppodStyle.scale, 10 * uppodStyle.scale);
        this.ctx.lineTo(0 * uppodStyle.scale, 10 * uppodStyle.scale);
        this.ctx.lineTo(0 * uppodStyle.scale, 0 * uppodStyle.scale);
        this.ctx.closePath();
        this.ctx.lineWidth = 0.1;
        this.ctx.stroke();
        this.ctx.fill()
    }
    if (name == 'menu') {
        if (String(uppodStyle.icon).indexOf("http") == 0) {
            if (vars.https == 1 && uppodStyle.icon.indexOf(".") > -1) {
                uppodStyle.icon = uppodStyle.icon.replace("http://", "https://")
            }
            IconImg(uppodStyle.icon, this.c, 0, uppodStyle.pic_w, uppodStyle.pic_h, uppodStyle.halficonisover)
        } else {
            if (uppodStyle.icon == 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(6 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 7 * uppodStyle.scale);
                this.ctx.lineTo(13 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.lineTo(6 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.closePath();
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 4 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.clearRect(5 * uppodStyle.scale, 6 * uppodStyle.scale, 9 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.fillRect(9 * uppodStyle.scale, 10 * uppodStyle.scale, 1 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.fillRect(9 * uppodStyle.scale, 8 * uppodStyle.scale, 1 * uppodStyle.scale, 1 * uppodStyle.scale);
                this.ctx.closePath()
            }
            if (uppodStyle.icon == 1) {
                this.ctx.moveTo(8.5 * uppodStyle.scale, 5.5 * uppodStyle.scale);
                this.ctx.lineTo(3 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(8.5 * uppodStyle.scale, 12.5 * uppodStyle.scale);
                this.ctx.moveTo(11.5 * uppodStyle.scale, 5.5 * uppodStyle.scale);
                this.ctx.lineTo(17 * uppodStyle.scale, 9 * uppodStyle.scale);
                this.ctx.lineTo(11.5 * uppodStyle.scale, 12.5 * uppodStyle.scale);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 2 * uppodStyle.scale;
                this.ctx.stroke()
            }
            if (uppodStyle.icon == 2) {
                this.ctx.arc(10 * uppodStyle.scale, 7 * uppodStyle.scale, 3 * uppodStyle.scale, Math.PI / 2, -Math.PI, true);
                this.ctx.moveTo(10 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(10 * uppodStyle.scale, 12 * uppodStyle.scale);
                this.ctx.moveTo(10 * uppodStyle.scale, 15 * uppodStyle.scale);
                this.ctx.arc(10 * uppodStyle.scale, 15 * uppodStyle.scale, 0.5 * uppodStyle.scale, 0, Math.PI * 2);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 2 * uppodStyle.scale;
                this.ctx.stroke()
            }
            if (uppodStyle.icon == 3) {
                this.ctx.arc(6 * uppodStyle.scale, 10 * uppodStyle.scale, 2 * uppodStyle.scale, 0, Math.PI * 2);
                this.ctx.moveTo(14 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.arc(14 * uppodStyle.scale, 6 * uppodStyle.scale, 2 * uppodStyle.scale, 0, Math.PI * 2);
                this.ctx.moveTo(14 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.arc(14 * uppodStyle.scale, 14 * uppodStyle.scale, 2 * uppodStyle.scale, 0, Math.PI * 2);
                this.ctx.moveTo(6 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 6 * uppodStyle.scale);
                this.ctx.moveTo(6 * uppodStyle.scale, 10 * uppodStyle.scale);
                this.ctx.lineTo(14 * uppodStyle.scale, 14 * uppodStyle.scale);
                this.ctx.strokeStyle = "#" + uppodStyle.color;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineWidth = 1.5 * uppodStyle.scale;
                this.ctx.stroke();
                this.ctx.fill()
            }
        }
    }
    if (name == 'hd' || name == 'hd1') {
        this.ctx.fillStyle = uppodStyle.color;
        !uppodStyle.icon2 ? uppodStyle.icon2 = uppodStyle.icon : '';
        uppodStyle.icon2 = uppodStyle.icon2.replace(/(<([^>]+)>)/ig, "");
        uppodStyle.icon = uppodStyle.icon.replace(/(<([^>]+)>)/ig, "");
        this.ctx.font = "normal " + (12 * uppodStyle.scale) + "px Arial";
        this.ctx.fillText((name == 'hd1' ? uppodStyle.icon2 : uppodStyle.icon), 3 * uppodStyle.scale, 15 * uppodStyle.scale)
    }
    if (name == 'hdselect') {
        this.ctx.fillStyle = uppodStyle.color;
        this.ctx.font = "normal " + (12 * uppodStyle.scale) + "px Arial"
    }
    if (name == 'line' || name == 'volbarline') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 10 - uppodStyle.h / 2);
        this.ctx.lineTo(bw - 15, 10 - uppodStyle.h / 2);
        this.ctx.lineTo(bw - 5, 10 + uppodStyle.h / 2);
        this.ctx.lineTo(0, 10 + uppodStyle.h / 2);
        this.ctx.lineTo(0, 10 - uppodStyle.h / 2);
        this.ctx.lineWidth = 0.1;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fill()
    }
    if (name == 'volbarline_v') {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(bw, 0);
        this.ctx.lineTo(bw, bh);
        this.ctx.lineTo(0, bh);
        this.ctx.lineTo(0, 0);
        this.ctx.lineWidth = 0.1;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.fill()
    }
    if (name == 'separator') {
        if (uppodStyle.icon == 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(2 * uppodStyle.scale, 0);
            this.ctx.lineTo(2 * uppodStyle.scale, 20 * uppodStyle.scale);
            this.ctx.lineTo(2.5 * uppodStyle.scale, 20 * uppodStyle.scale);
            this.ctx.lineTo(2.5 * uppodStyle.scale, 0);
            this.ctx.lineTo(2 * uppodStyle.scale, 0);
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill()
        }
        if (uppodStyle.icon == 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(4.5 * uppodStyle.scale, 0);
            this.ctx.lineTo(0, 20 * uppodStyle.scale);
            this.ctx.lineTo(0.5 * uppodStyle.scale, 20 * uppodStyle.scale);
            this.ctx.lineTo(5 * uppodStyle.scale, 0);
            this.ctx.lineTo(4.5 * uppodStyle.scale, 0);
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill()
        }
        if (uppodStyle.icon == 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(2 * uppodStyle.scale, 0);
            this.ctx.lineTo(2 * uppodStyle.scale, 20 * uppodStyle.scale);
            this.ctx.lineTo(4 * uppodStyle.scale, 20 * uppodStyle.scale);
            this.ctx.lineTo(4 * uppodStyle.scale, 0);
            this.ctx.lineTo(2 * uppodStyle.scale, 0);
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill()
        }
        if (uppodStyle.icon == 3) {
            this.ctx.beginPath();
            this.ctx.moveTo(2 * uppodStyle.scale, 9 * uppodStyle.scale);
            this.ctx.lineTo(4 * uppodStyle.scale, 9 * uppodStyle.scale);
            this.ctx.lineTo(4 * uppodStyle.scale, 11 * uppodStyle.scale);
            this.ctx.lineTo(2 * uppodStyle.scale, 11 * uppodStyle.scale);
            this.ctx.lineTo(2 * uppodStyle.scale, 9 * uppodStyle.scale);
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill()
        }
    }
    if (name.indexOf('time') == 0) {
        selfDom.innerHTML = '0:00';
        uppodStyle.icon == 0 ? this.font = (10 * uppodStyle.scale) + "px Verdana" : "";
        uppodStyle.icon == 1 ? this.font = (9 * uppodStyle.scale) + "px Tahoma" : "";
        uppodStyle.icon == 2 ? this.font = (10 * uppodStyle.scale) + "px Arial" : "";
        uppodStyle.icon == 3 ? this.font = (11 * uppodStyle.scale) + "px _serif" : "";
        CSS(this.c, {
            "width": bw,
            "color": "#" + uppodStyle.color,
            "font": this.font,
            "text-align": "center",
            "margin": (10 * uppodStyle.scale - 10) / 2 + "px 0 0 0"
        })
    }
    if (name == 'buffer') {
        selfDom.innerHTML = '';
        CSS(this.c, {
            display: "none",
            "width": bw,
            "color": "#" + uppodStyle.color,
            "font": "10px Arial",
            "text-align": "left"
        })
    }
    selfDom.appendChild(this.canvas);
    var this_w = bw * uppodStyle.scale * (uppodStyle.bg == 1 && uppodStyle.bg_smallicon == 1 ? 0.8 : 1);
    var this_h = bh * uppodStyle.scale * (uppodStyle.bg == 1 && uppodStyle.bg_smallicon == 1 ? 0.8 : 1);
    CSS(this.canvas, {
        'width': this_w,
        'height': this_h,
        'position': 'absolute',
        'top': Math.round(name == 'start' ? bh / 2 - 10 * uppodStyle.scale2 + 2 * uppodStyle.scale + (uppodStyle.scale - 1) * 35 : (uppodStyle.bg == 1 && uppodStyle.bg_smallicon == 1 ? 2 * uppodStyle.scale : 0) + uppodStyle.margintop * 1 - uppodStyle.marginbottom * 1),
        'left': Math.round(name == 'start' ? bw / 2 - 10 * uppodStyle.scale2 + 2 * uppodStyle.scale : (uppodStyle.bg == 1 && uppodStyle.bg_smallicon == 1 ? 2 * uppodStyle.scale : 0) + (1 - uppodStyle.scale) * bw / 2),
        'opacity': uppodStyle.alpha,
        'filter': 'alpha(opacity=' + (uppodStyle.alpha * 100) + ')'
    });
    this.w = bw;
    this.h = bh * uppodStyle.scale
};
var EnterFullscreenControl, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key]
        }

        function ctor() {
            this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child
    },
    __hasProp = {}.hasOwnProperty;
EnterFullscreenControl = (function(_super) {
    __extends(EnterFullscreenControl, _super);

    function EnterFullscreenControl(uppod) {
        this.element = new Uppod.Element(uppod.vars(), 'full', 20, 20);
        EnterFullscreenControl.__super__.constructor.call(this, 'EnterFullscreen', {
            element: this.element
        });
        this.dom.onclick = uppod.toogleFullscreen;
        this.css({
            'cursor': 'pointer',
            'position': 'absolute',
            'top': this._calcTop(uppod.vars())
        });
        uppod.controls().ControlBar.dom.appendChild(this.dom)
    }
    EnterFullscreenControl.prototype._calcTop = function(vars) {
        return Math.floor((vars.cntrloutheight - this.element.h) / 2 + this.element.uppodStyle.margintop - this.element.uppodStyle.marginbottom)
    };
    return EnterFullscreenControl
})(window.Uppod.Control);
window.Uppod.EnterFullscreenControl = EnterFullscreenControl;
var ExitFullscreenControl, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key]
        }

        function ctor() {
            this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child
    },
    __hasProp = {}.hasOwnProperty;
ExitFullscreenControl = (function(_super) {
    __extends(ExitFullscreenControl, _super);

    function ExitFullscreenControl(uppod) {
        this.element = new Uppod.Element(uppod.vars(), 'full_back', 20, 20, '', 'full');
        ExitFullscreenControl.__super__.constructor.call(this, 'ExitFullscreen', {
            element: this.element
        });
        this.dom.onclick = uppod.toogleFullscreen;
        this.css({
            'cursor': 'pointer',
            'display': 'none',
            'position': 'absolute',
            'top': this._calcTop(uppod.vars())
        });
        uppod.controls().ControlBar.dom.appendChild(this.dom)
    }
    ExitFullscreenControl.prototype._calcTop = function(vars) {
        return (vars.cntrloutheight - this.element.h) / 2 + this.element.uppodStyle.margintop - this.element.uppodStyle.marginbottom
    };
    return ExitFullscreenControl
})(window.Uppod.Control);
window.Uppod.ExitFullscreenControl = ExitFullscreenControl;
! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).Hls = e()
    }
}(function() {
    return function e(t, r, a) {
        function i(s, o) {
            if (!r[s]) {
                if (!t[s]) {
                    var l = "function" == typeof require && require;
                    if (!o && l) return l(s, !0);
                    if (n) return n(s, !0);
                    var u = new Error("Cannot find module '" + s + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var d = r[s] = {
                    exports: {}
                };
                t[s][0].call(d.exports, function(e) {
                    var r = t[s][1][e];
                    return i(r || e)
                }, d, d.exports, e, t, r, a)
            }
            return r[s].exports
        }
        for (var n = "function" == typeof require && require, s = 0; s < a.length; s++) i(a[s]);
        return i
    }({
        1: [function(e, t, r) {
            function a() {
                this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
            }

            function i(e) {
                return "function" == typeof e
            }

            function n(e) {
                return "number" == typeof e
            }

            function s(e) {
                return "object" == typeof e && null !== e
            }

            function o(e) {
                return void 0 === e
            }
            t.exports = a, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._maxListeners = void 0, a.defaultMaxListeners = 10, a.prototype.setMaxListeners = function(e) {
                if (!n(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
                return this._maxListeners = e, this
            }, a.prototype.emit = function(e) {
                var t, r, a, n, l, u;
                if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
                    if ((t = arguments[1]) instanceof Error) throw t;
                    var d = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                    throw d.context = t, d
                }
                if (r = this._events[e], o(r)) return !1;
                if (i(r)) switch (arguments.length) {
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
                        n = Array.prototype.slice.call(arguments, 1), r.apply(this, n)
                } else if (s(r))
                    for (n = Array.prototype.slice.call(arguments, 1), a = (u = r.slice()).length, l = 0; l < a; l++) u[l].apply(this, n);
                return !0
            }, a.prototype.addListener = function(e, t) {
                var r;
                if (!i(t)) throw TypeError("listener must be a function");
                return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned && (r = o(this._maxListeners) ? a.defaultMaxListeners : this._maxListeners) && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.trace), this
            }, a.prototype.on = a.prototype.addListener, a.prototype.once = function(e, t) {
                function r() {
                    this.removeListener(e, r), a || (a = !0, t.apply(this, arguments))
                }
                if (!i(t)) throw TypeError("listener must be a function");
                var a = !1;
                return r.listener = t, this.on(e, r), this
            }, a.prototype.removeListener = function(e, t) {
                var r, a, n, o;
                if (!i(t)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[e]) return this;
                if (r = this._events[e], n = r.length, a = -1, r === t || i(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
                else if (s(r)) {
                    for (o = n; o-- > 0;)
                        if (r[o] === t || r[o].listener && r[o].listener === t) {
                            a = o;
                            break
                        } if (a < 0) return this;
                    1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(a, 1), this._events.removeListener && this.emit("removeListener", e, t)
                }
                return this
            }, a.prototype.removeAllListeners = function(e) {
                var t, r;
                if (!this._events) return this;
                if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
                if (0 === arguments.length) {
                    for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                    return this.removeAllListeners("removeListener"), this._events = {}, this
                }
                if (r = this._events[e], i(r)) this.removeListener(e, r);
                else if (r)
                    for (; r.length;) this.removeListener(e, r[r.length - 1]);
                return delete this._events[e], this
            }, a.prototype.listeners = function(e) {
                return this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
            }, a.prototype.listenerCount = function(e) {
                if (this._events) {
                    var t = this._events[e];
                    if (i(t)) return 1;
                    if (t) return t.length
                }
                return 0
            }, a.listenerCount = function(e, t) {
                return e.listenerCount(t)
            }
        }, {}],
        2: [function(e, t, r) {
            ! function(e) {
                var a = /^((?:[^\/;?#]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/,
                    i = /^([^\/;?#]*)(.*)$/,
                    n = /(?:\/|^)\.(?=\/)/g,
                    s = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g,
                    o = {
                        buildAbsoluteURL: function(e, t, r) {
                            if (r = r || {}, e = e.trim(), !(t = t.trim())) {
                                if (!r.alwaysNormalize) return e;
                                var a = this.parseURL(e);
                                if (!s) throw new Error("Error trying to parse base URL.");
                                return a.path = o.normalizePath(a.path), o.buildURLFromParts(a)
                            }
                            var n = this.parseURL(t);
                            if (!n) throw new Error("Error trying to parse relative URL.");
                            if (n.scheme) return r.alwaysNormalize ? (n.path = o.normalizePath(n.path), o.buildURLFromParts(n)) : t;
                            var s = this.parseURL(e);
                            if (!s) throw new Error("Error trying to parse base URL.");
                            if (!s.netLoc && s.path && "/" !== s.path[0]) {
                                var l = i.exec(s.path);
                                s.netLoc = l[1], s.path = l[2]
                            }
                            s.netLoc && !s.path && (s.path = "/");
                            var u = {
                                scheme: s.scheme,
                                netLoc: n.netLoc,
                                path: null,
                                params: n.params,
                                query: n.query,
                                fragment: n.fragment
                            };
                            if (!n.netLoc && (u.netLoc = s.netLoc, "/" !== n.path[0]))
                                if (n.path) {
                                    var d = s.path,
                                        f = d.substring(0, d.lastIndexOf("/") + 1) + n.path;
                                    u.path = o.normalizePath(f)
                                } else u.path = s.path, n.params || (u.params = s.params, n.query || (u.query = s.query));
                            return null === u.path && (u.path = r.alwaysNormalize ? o.normalizePath(n.path) : n.path), o.buildURLFromParts(u)
                        },
                        parseURL: function(e) {
                            var t = a.exec(e);
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
                            for (e = e.split("").reverse().join("").replace(n, ""); e.length !== (e = e.replace(s, "")).length;);
                            return e.split("").reverse().join("")
                        },
                        buildURLFromParts: function(e) {
                            return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment
                        }
                    };
                "object" == typeof r && "object" == typeof t ? t.exports = o : "object" == typeof r ? r.URLToolkit = o : e.URLToolkit = o
            }(this)
        }, {}],
        3: [function(e, t, r) {
            var a = arguments[3],
                i = arguments[4],
                n = arguments[5],
                s = JSON.stringify;
            t.exports = function(e, t) {
                function r(e) {
                    p[e] = !0;
                    for (var t in i[e][1]) {
                        var a = i[e][1][t];
                        p[a] || r(a)
                    }
                }
                for (var o, l = Object.keys(n), u = 0, d = l.length; u < d; u++) {
                    var f = l[u],
                        c = n[f].exports;
                    if (c === e || c && c.default === e) {
                        o = f;
                        break
                    }
                }
                if (!o) {
                    o = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    for (var h = {}, u = 0, d = l.length; u < d; u++) h[f = l[u]] = f;
                    i[o] = [Function(["require", "module", "exports"], "(" + e + ")(self)"), h]
                }
                var g = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                    v = {};
                v[o] = o, i[g] = [Function(["require"], "var f = require(" + s(o) + ");(f.default ? f.default : f)(self);"), v];
                var p = {};
                r(g);
                var y = "(" + a + ")({" + Object.keys(p).map(function(e) {
                        return s(e) + ":[" + i[e][0] + "," + s(i[e][1]) + "]"
                    }).join(",") + "},{},[" + s(g) + "])",
                    m = window.URL || window.webkitURL || window.mozURL || window.msURL,
                    E = new Blob([y], {
                        type: "text/javascript"
                    });
                if (t && t.bare) return E;
                var b = m.createObjectURL(E),
                    T = new Worker(b);
                return T.objectURL = b, T
            }
        }, {}],
        4: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            }), r.hlsDefaultConfig = void 0;
            var i = a(e(5)),
                n = a(e(8)),
                s = a(e(9)),
                o = a(e(10)),
                l = a(e(59)),
                u = a(e(7)),
                d = a(e(6)),
                f = a(e(50)),
                c = a(e(16)),
                h = a(e(15)),
                g = a(e(14));
            r.hlsDefaultConfig = {
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
                maxSeekHole: 2,
                lowBufferWatchdogPeriod: .5,
                highBufferWatchdogPeriod: 3,
                nudgeOffset: .1,
                nudgeMaxRetry: 3,
                maxFragLookUpTolerance: .25,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 1 / 0,
                liveSyncDuration: void 0,
                liveMaxLatencyDuration: void 0,
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
                fragLoadingLoopThreshold: 3,
                startFragPrefetch: !1,
                fpsDroppedMonitoringPeriod: 5e3,
                fpsDroppedMonitoringThreshold: .2,
                appendErrorMaxRetry: 3,
                loader: l.default,
                fLoader: void 0,
                pLoader: void 0,
                xhrSetup: void 0,
                fetchSetup: void 0,
                abrController: i.default,
                bufferController: n.default,
                capLevelController: s.default,
                fpsController: o.default,
                audioStreamController: d.default,
                audioTrackController: u.default,
                subtitleStreamController: g.default,
                subtitleTrackController: h.default,
                timelineController: c.default,
                cueHandler: f.default,
                enableCEA708Captions: !0,
                enableWebVTT: !0,
                captionsTextTrack1Label: "English",
                captionsTextTrack1LanguageCode: "en",
                captionsTextTrack2Label: "Spanish",
                captionsTextTrack2LanguageCode: "es",
                stretchShortVideoTrack: !1,
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
                minAutoBitrate: 0
            }
        }, {
            10: 10,
            14: 14,
            15: 15,
            16: 16,
            5: 5,
            50: 50,
            59: 59,
            6: 6,
            7: 7,
            8: 8,
            9: 9
        }],
        5: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = a(e(37)),
                f = e(33),
                c = e(54),
                h = a(e(52)),
                g = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.FRAG_LOADING, l.default.FRAG_LOADED, l.default.FRAG_BUFFERED, l.default.ERROR));
                        return r.lastLoadedFragLevel = 0, r._nextAutoLevel = -1, r.hls = e, r.timer = null, r._bwEstimator = null, r.onCheck = r._abandonRulesCheck.bind(r), r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.clearTimer(), u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onFragLoading",
                        value: function(e) {
                            var t = e.frag;
                            if ("main" === t.type) {
                                if (this.timer || (this.timer = setInterval(this.onCheck, 100)), !this._bwEstimator) {
                                    var r = this.hls,
                                        a = e.frag.level,
                                        i = r.levels[a].details.live,
                                        n = r.config,
                                        s = void 0,
                                        o = void 0;
                                    i ? (s = n.abrEwmaFastLive, o = n.abrEwmaSlowLive) : (s = n.abrEwmaFastVoD, o = n.abrEwmaSlowVoD), this._bwEstimator = new h.default(r, o, s, n.abrEwmaDefaultEstimate)
                                }
                                this.fragCurrent = t
                            }
                        }
                    }, {
                        key: "_abandonRulesCheck",
                        value: function() {
                            var e = this.hls,
                                t = e.media,
                                r = this.fragCurrent,
                                a = r.loader,
                                i = e.minAutoLevel;
                            if (!a || a.stats && a.stats.aborted) return c.logger.warn("frag loader destroy or aborted, disarm abandonRules"), void this.clearTimer();
                            var n = a.stats;
                            if (t && n && (!t.paused && 0 !== t.playbackRate || !t.readyState) && r.autoLevel && r.level) {
                                var s = performance.now() - n.trequest,
                                    o = Math.abs(t.playbackRate);
                                if (s > 500 * r.duration / o) {
                                    var u = e.levels,
                                        f = Math.max(1, n.bw ? n.bw / 8 : 1e3 * n.loaded / s),
                                        h = u[r.level],
                                        g = h.realBitrate ? Math.max(h.realBitrate, h.bitrate) : h.bitrate,
                                        v = n.total ? n.total : Math.max(n.loaded, Math.round(r.duration * g / 8)),
                                        p = t.currentTime,
                                        y = (v - n.loaded) / f,
                                        m = (d.default.bufferInfo(t, p, e.config.maxBufferHole).end - p) / o;
                                    if (m < 2 * r.duration / o && y > m) {
                                        var E = void 0,
                                            b = void 0;
                                        for (b = r.level - 1; b > i; b--) {
                                            var T = u[b].realBitrate ? Math.max(u[b].realBitrate, u[b].bitrate) : u[b].bitrate;
                                            if ((E = r.duration * T / (6.4 * f)) < m) break
                                        }
                                        E < y && (c.logger.warn("loading too slow, abort fragment loading and switch to level " + b + ":fragLoadedDelay[" + b + "]<fragLoadedDelay[" + (r.level - 1) + "];bufferStarvationDelay:" + E.toFixed(1) + "<" + y.toFixed(1) + ":" + m.toFixed(1)), e.nextLoadLevel = b, this._bwEstimator.sample(s, n.loaded), a.abort(), this.clearTimer(), e.trigger(l.default.FRAG_LOAD_EMERGENCY_ABORTED, {
                                            frag: r,
                                            stats: n
                                        }))
                                    }
                                }
                            }
                        }
                    }, {
                        key: "onFragLoaded",
                        value: function(e) {
                            var t = e.frag;
                            if ("main" === t.type && !isNaN(t.sn)) {
                                if (this.clearTimer(), this.lastLoadedFragLevel = t.level, this._nextAutoLevel = -1, this.hls.config.abrMaxWithRealBitrate) {
                                    var r = this.hls.levels[t.level],
                                        a = (r.loaded ? r.loaded.bytes : 0) + e.stats.loaded,
                                        i = (r.loaded ? r.loaded.duration : 0) + e.frag.duration;
                                    r.loaded = {
                                        bytes: a,
                                        duration: i
                                    }, r.realBitrate = Math.round(8 * a / i)
                                }
                                if (e.frag.bitrateTest) {
                                    var n = e.stats;
                                    n.tparsed = n.tbuffered = n.tload, this.onFragBuffered(e)
                                }
                            }
                        }
                    }, {
                        key: "onFragBuffered",
                        value: function(e) {
                            var t = e.stats,
                                r = e.frag;
                            if (!(!0 === t.aborted || 1 !== r.loadCounter || "main" !== r.type || isNaN(r.sn) || r.bitrateTest && t.tload !== t.tbuffered)) {
                                var a = t.tparsed - t.trequest;
                                c.logger.log("latency/loading/parsing/append/kbps:" + Math.round(t.tfirst - t.trequest) + "/" + Math.round(t.tload - t.tfirst) + "/" + Math.round(t.tparsed - t.tload) + "/" + Math.round(t.tbuffered - t.tparsed) + "/" + Math.round(8 * t.loaded / (t.tbuffered - t.trequest))), this._bwEstimator.sample(a, t.loaded), t.bwEstimate = this._bwEstimator.getEstimate(), r.bitrateTest ? this.bitrateTestDelay = a / 1e3 : this.bitrateTestDelay = 0
                            }
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            switch (e.details) {
                                case f.ErrorDetails.FRAG_LOAD_ERROR:
                                case f.ErrorDetails.FRAG_LOAD_TIMEOUT:
                                    this.clearTimer()
                            }
                        }
                    }, {
                        key: "clearTimer",
                        value: function() {
                            clearInterval(this.timer), this.timer = null
                        }
                    }, {
                        key: "_findBestLevel",
                        value: function(e, t, r, a, i, n, s, o, l) {
                            for (var u = i; u >= a; u--) {
                                var d = l[u].details,
                                    f = d ? d.totalduration / d.fragments.length : t,
                                    h = !!d && d.live,
                                    g = void 0;
                                g = u <= e ? s * r : o * r;
                                var v = l[u].realBitrate ? Math.max(l[u].realBitrate, l[u].bitrate) : l[u].bitrate,
                                    p = v * f / g;
                                if (c.logger.trace("level/adjustedbw/bitrate/avgDuration/maxFetchDuration/fetchDuration: " + u + "/" + Math.round(g) + "/" + v + "/" + f + "/" + n + "/" + p), g > v && (!p || h && !this.bitrateTestDelay || p < n)) return u
                            }
                            return -1
                        }
                    }, {
                        key: "nextAutoLevel",
                        get: function() {
                            var e = this._nextAutoLevel,
                                t = this._bwEstimator;
                            if (!(-1 === e || t && t.canEstimate())) return e;
                            var r = this._nextABRAutoLevel;
                            return -1 !== e && (r = Math.min(e, r)), r
                        },
                        set: function(e) {
                            this._nextAutoLevel = e
                        }
                    }, {
                        key: "_nextABRAutoLevel",
                        get: function() {
                            var e = this.hls,
                                t = e.maxAutoLevel,
                                r = e.levels,
                                a = e.config,
                                i = e.minAutoLevel,
                                n = e.media,
                                s = this.lastLoadedFragLevel,
                                o = this.fragCurrent ? this.fragCurrent.duration : 0,
                                l = n ? n.currentTime : 0,
                                u = n && 0 !== n.playbackRate ? Math.abs(n.playbackRate) : 1,
                                f = this._bwEstimator ? this._bwEstimator.getEstimate() : a.abrEwmaDefaultEstimate,
                                h = (d.default.bufferInfo(n, l, a.maxBufferHole).end - l) / u,
                                g = this._findBestLevel(s, o, f, i, t, h, a.abrBandWidthFactor, a.abrBandWidthUpFactor, r);
                            if (g >= 0) return g;
                            c.logger.trace("rebuffering expected to happen, lets try to find a quality level minimizing the rebuffering");
                            var v = o ? Math.min(o, a.maxStarvationDelay) : a.maxStarvationDelay,
                                p = a.abrBandWidthFactor,
                                y = a.abrBandWidthUpFactor;
                            if (0 === h) {
                                var m = this.bitrateTestDelay;
                                m && (v = (o ? Math.min(o, a.maxLoadingDelay) : a.maxLoadingDelay) - m, c.logger.trace("bitrate test took " + Math.round(1e3 * m) + "ms, set first fragment max fetchDuration to " + Math.round(1e3 * v) + " ms"), p = y = 1)
                            }
                            return g = this._findBestLevel(s, o, f, i, t, h + v, p, y, r), Math.max(g, 0)
                        }
                    }]), t
                }(u.default);
            r.default = g
        }, {
            33: 33,
            34: 34,
            35: 35,
            37: 37,
            52: 52,
            54: 54
        }],
        6: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(48)),
                u = a(e(37)),
                d = a(e(25)),
                f = a(e(35)),
                c = a(e(34)),
                h = a(e(38)),
                g = a(e(55)),
                v = e(33),
                p = e(54),
                y = e(51),
                m = {
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
                    WAITING_INIT_PTS: "WAITING_INIT_PTS"
                },
                E = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, f.default.MEDIA_ATTACHED, f.default.MEDIA_DETACHING, f.default.AUDIO_TRACKS_UPDATED, f.default.AUDIO_TRACK_SWITCHING, f.default.AUDIO_TRACK_LOADED, f.default.KEY_LOADED, f.default.FRAG_LOADED, f.default.FRAG_PARSING_INIT_SEGMENT, f.default.FRAG_PARSING_DATA, f.default.FRAG_PARSED, f.default.ERROR, f.default.BUFFER_CREATED, f.default.BUFFER_APPENDED, f.default.BUFFER_FLUSHED, f.default.INIT_PTS_FOUND));
                        return r.config = e.config, r.audioCodecSwap = !1, r.ticks = 0, r._state = m.STOPPED, r.ontick = r.tick.bind(r), r.initPTS = [], r.waitingFragment = null, r.videoTrackCC = null, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.stopLoad(), this.timer && (clearInterval(this.timer), this.timer = null), c.default.prototype.destroy.call(this), this.state = m.STOPPED
                        }
                    }, {
                        key: "onInitPtsFound",
                        value: function(e) {
                            var t = e.id,
                                r = e.frag.cc,
                                a = e.initPTS;
                            "main" === t && (this.initPTS[r] = a, this.videoTrackCC = r, p.logger.log("InitPTS for cc:" + r + " found from video track:" + a), this.state === m.WAITING_INIT_PTS && this.tick())
                        }
                    }, {
                        key: "startLoad",
                        value: function(e) {
                            if (this.tracks) {
                                var t = this.lastCurrentTime;
                                this.stopLoad(), this.timer || (this.timer = setInterval(this.ontick, 100)), this.fragLoadError = 0, t > 0 && -1 === e ? (p.logger.log("audio:override startPosition with lastCurrentTime @" + t.toFixed(3)), this.state = m.IDLE) : (this.lastCurrentTime = this.startPosition ? this.startPosition : e, this.state = m.STARTING), this.nextLoadPosition = this.startPosition = this.lastCurrentTime, this.tick()
                            } else this.startPosition = e, this.state = m.STOPPED
                        }
                    }, {
                        key: "stopLoad",
                        value: function() {
                            var e = this.fragCurrent;
                            e && (e.loader && e.loader.abort(), this.fragCurrent = null), this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = m.STOPPED
                        }
                    }, {
                        key: "tick",
                        value: function() {
                            1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0)
                        }
                    }, {
                        key: "doTick",
                        value: function() {
                            var e, t, r, a = this.hls,
                                i = a.config;
                            switch (this.state) {
                                case m.ERROR:
                                case m.PAUSED:
                                case m.BUFFER_FLUSHING:
                                    break;
                                case m.STARTING:
                                    this.state = m.WAITING_TRACK, this.loadedmetadata = !1;
                                    break;
                                case m.IDLE:
                                    var n = this.tracks;
                                    if (!n) break;
                                    if (!this.media && (this.startFragRequested || !i.startFragPrefetch)) break;
                                    if (this.loadedmetadata) e = this.media.currentTime;
                                    else if (void 0 === (e = this.nextLoadPosition)) break;
                                    var s = this.mediaBuffer ? this.mediaBuffer : this.media,
                                        o = u.default.bufferInfo(s, e, i.maxBufferHole),
                                        d = o.len,
                                        c = o.end,
                                        h = this.fragPrevious,
                                        g = i.maxMaxBufferLength,
                                        E = this.audioSwitch,
                                        b = this.trackId;
                                    if ((d < g || E) && b < n.length) {
                                        if (void 0 === (r = n[b].details)) {
                                            this.state = m.WAITING_TRACK;
                                            break
                                        }
                                        if (!E && !r.live && h && h.sn === r.endSN && (!this.media.seeking || this.media.duration - c < h.duration / 2)) {
                                            this.hls.trigger(f.default.BUFFER_EOS, {
                                                type: "audio"
                                            }), this.state = m.ENDED;
                                            break
                                        }
                                        var T = r.fragments,
                                            k = T.length,
                                            _ = T[0].start,
                                            R = T[k - 1].start + T[k - 1].duration,
                                            S = void 0;
                                        if (E)
                                            if (r.live && !r.PTSKnown) p.logger.log("switching audiotrack, live stream, unknown PTS,load first fragment"), c = 0;
                                            else if (c = e, r.PTSKnown && e < _) {
                                            if (!(o.end > _ || o.nextStart)) return;
                                            p.logger.log("alt audio track ahead of main track, seek to start of alt audio track"), this.media.currentTime = _ + .05
                                        }
                                        if (r.initSegment && !r.initSegment.data) S = r.initSegment;
                                        else if (c <= _) {
                                            if (S = T[0], null !== this.videoTrackCC && S.cc !== this.videoTrackCC && (S = (0, y.findFragWithCC)(T, this.videoTrackCC)), r.live && S.loadIdx && S.loadIdx === this.fragLoadIdx) {
                                                var A = o.nextStart ? o.nextStart : _;
                                                return p.logger.log("no alt audio available @currentTime:" + this.media.currentTime + ", seeking @" + (A + .05)), void(this.media.currentTime = A + .05)
                                            }
                                        } else {
                                            var L = void 0,
                                                w = i.maxFragLookUpTolerance,
                                                D = h ? T[h.sn - T[0].sn + 1] : void 0,
                                                O = function(e) {
                                                    var t = Math.min(w, e.duration);
                                                    return e.start + e.duration - t <= c ? 1 : e.start - t > c && e.start ? -1 : 0
                                                };
                                            c < R ? (c > R - w && (w = 0), L = D && !O(D) ? D : l.default.search(T, O)) : L = T[k - 1], L && (S = L, _ = L.start, h && S.level === h.level && S.sn === h.sn && (S.sn < r.endSN ? (S = T[S.sn + 1 - r.startSN], p.logger.log("SN just loaded, load next one: " + S.sn)) : S = null))
                                        }
                                        if (S)
                                            if (S.decryptdata && null != S.decryptdata.uri && null == S.decryptdata.key) p.logger.log("Loading key for " + S.sn + " of [" + r.startSN + " ," + r.endSN + "],track " + b), this.state = m.KEY_LOADING, a.trigger(f.default.KEY_LOADING, {
                                                frag: S
                                            });
                                            else {
                                                if (p.logger.log("Loading " + S.sn + ", cc: " + S.cc + " of [" + r.startSN + " ," + r.endSN + "],track " + b + ", currentTime:" + e + ",bufferEnd:" + c.toFixed(3)), void 0 !== this.fragLoadIdx ? this.fragLoadIdx++ : this.fragLoadIdx = 0, S.loadCounter) {
                                                    S.loadCounter++;
                                                    var I = i.fragLoadingLoopThreshold;
                                                    if (S.loadCounter > I && Math.abs(this.fragLoadIdx - S.loadIdx) < I) return void a.trigger(f.default.ERROR, {
                                                        type: v.ErrorTypes.MEDIA_ERROR,
                                                        details: v.ErrorDetails.FRAG_LOOP_LOADING_ERROR,
                                                        fatal: !1,
                                                        frag: S
                                                    })
                                                } else S.loadCounter = 1;
                                                S.loadIdx = this.fragLoadIdx, this.fragCurrent = S, this.startFragRequested = !0, isNaN(S.sn) || (this.nextLoadPosition = S.start + S.duration), a.trigger(f.default.FRAG_LOADING, {
                                                    frag: S
                                                }), this.state = m.FRAG_LOADING
                                            }
                                    }
                                    break;
                                case m.WAITING_TRACK:
                                    (t = this.tracks[this.trackId]) && t.details && (this.state = m.IDLE);
                                    break;
                                case m.FRAG_LOADING_WAITING_RETRY:
                                    var P = performance.now(),
                                        C = this.retryDate,
                                        x = (s = this.media) && s.seeking;
                                    (!C || P >= C || x) && (p.logger.log("audioStreamController: retryDate reached, switch back to IDLE state"), this.state = m.IDLE);
                                    break;
                                case m.WAITING_INIT_PTS:
                                    var F = this.videoTrackCC;
                                    if (void 0 === this.initPTS[F]) break;
                                    var M = this.waitingFragment;
                                    if (M) {
                                        var N = M.frag.cc;
                                        F !== N ? (t = this.tracks[this.trackId]).details && t.details.live && (p.logger.warn("Waiting fragment CC (" + N + ") does not match video track CC (" + F + ")"), this.waitingFragment = null, this.state = m.IDLE) : (this.state = m.FRAG_LOADING, this.onFragLoaded(this.waitingFragment), this.waitingFragment = null)
                                    } else this.state = m.IDLE;
                                    break;
                                case m.STOPPED:
                                case m.FRAG_LOADING:
                                case m.PARSING:
                                case m.PARSED:
                                case m.ENDED:
                            }
                        }
                    }, {
                        key: "onMediaAttached",
                        value: function(e) {
                            var t = this.media = this.mediaBuffer = e.media;
                            this.onvseeking = this.onMediaSeeking.bind(this), this.onvended = this.onMediaEnded.bind(this), t.addEventListener("seeking", this.onvseeking), t.addEventListener("ended", this.onvended);
                            var r = this.config;
                            this.tracks && r.autoStartLoad && this.startLoad(r.startPosition)
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            var e = this.media;
                            e && e.ended && (p.logger.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0);
                            var t = this.tracks;
                            t && t.forEach(function(e) {
                                e.details && e.details.fragments.forEach(function(e) {
                                    e.loadCounter = void 0
                                })
                            }), e && (e.removeEventListener("seeking", this.onvseeking), e.removeEventListener("ended", this.onvended), this.onvseeking = this.onvseeked = this.onvended = null), this.media = this.mediaBuffer = null, this.loadedmetadata = !1, this.stopLoad()
                        }
                    }, {
                        key: "onMediaSeeking",
                        value: function() {
                            this.state === m.ENDED && (this.state = m.IDLE), this.media && (this.lastCurrentTime = this.media.currentTime), void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold), this.tick()
                        }
                    }, {
                        key: "onMediaEnded",
                        value: function() {
                            this.startPosition = this.lastCurrentTime = 0
                        }
                    }, {
                        key: "onAudioTracksUpdated",
                        value: function(e) {
                            p.logger.log("audio tracks updated"), this.tracks = e.audioTracks
                        }
                    }, {
                        key: "onAudioTrackSwitching",
                        value: function(e) {
                            var t = !!e.url;
                            this.trackId = e.id, this.fragCurrent = null, this.state = m.PAUSED, this.waitingFragment = null, t ? this.timer || (this.timer = setInterval(this.ontick, 100)) : this.demuxer && (this.demuxer.destroy(), this.demuxer = null), t && (this.audioSwitch = !0, this.state = m.IDLE, void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold)), this.tick()
                        }
                    }, {
                        key: "onAudioTrackLoaded",
                        value: function(e) {
                            var t = e.details,
                                r = e.id,
                                a = this.tracks[r],
                                i = t.totalduration,
                                n = 0;
                            if (p.logger.log("track " + r + " loaded [" + t.startSN + "," + t.endSN + "],duration:" + i), t.live) {
                                var s = a.details;
                                s && t.fragments.length > 0 ? (h.default.mergeDetails(s, t), n = t.fragments[0].start, t.PTSKnown ? p.logger.log("live audio playlist sliding:" + n.toFixed(3)) : p.logger.log("live audio playlist - outdated PTS, unknown sliding")) : (t.PTSKnown = !1, p.logger.log("live audio playlist - first load, unknown sliding"))
                            } else t.PTSKnown = !1;
                            if (a.details = t, !this.startFragRequested) {
                                if (-1 === this.startPosition) {
                                    var o = t.startTimeOffset;
                                    isNaN(o) ? this.startPosition = 0 : (p.logger.log("start time offset found in playlist, adjust startPosition to " + o), this.startPosition = o)
                                }
                                this.nextLoadPosition = this.startPosition
                            }
                            this.state === m.WAITING_TRACK && (this.state = m.IDLE), this.tick()
                        }
                    }, {
                        key: "onKeyLoaded",
                        value: function() {
                            this.state === m.KEY_LOADING && (this.state = m.IDLE, this.tick())
                        }
                    }, {
                        key: "onFragLoaded",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            if (this.state === m.FRAG_LOADING && t && "audio" === r.type && r.level === t.level && r.sn === t.sn) {
                                var a = this.tracks[this.trackId],
                                    i = a.details,
                                    n = i.totalduration,
                                    s = t.level,
                                    o = t.sn,
                                    l = t.cc,
                                    u = this.config.defaultAudioCodec || a.audioCodec || "mp4a.40.2",
                                    c = this.stats = e.stats;
                                if ("initSegment" === o) this.state = m.IDLE, c.tparsed = c.tbuffered = performance.now(), i.initSegment.data = e.payload, this.hls.trigger(f.default.FRAG_BUFFERED, {
                                    stats: c,
                                    frag: t,
                                    id: "audio"
                                }), this.tick();
                                else {
                                    this.state = m.PARSING, this.appended = !1, this.demuxer || (this.demuxer = new d.default(this.hls, "audio"));
                                    var h = this.initPTS[l],
                                        g = i.initSegment ? i.initSegment.data : [];
                                    if (i.initSegment || void 0 !== h) {
                                        this.pendingBuffering = !0, p.logger.log("Demuxing " + o + " of [" + i.startSN + " ," + i.endSN + "],track " + s);
                                        this.demuxer.push(e.payload, g, u, null, t, n, !1, h)
                                    } else p.logger.log("unknown video PTS for continuity counter " + l + ", waiting for video PTS before demuxing audio frag " + o + " of [" + i.startSN + " ," + i.endSN + "],track " + s), this.waitingFragment = e, this.state = m.WAITING_INIT_PTS
                                }
                            }
                            this.fragLoadError = 0
                        }
                    }, {
                        key: "onFragParsingInitSegment",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            if (t && "audio" === e.id && r.sn === t.sn && r.level === t.level && this.state === m.PARSING) {
                                var a = e.tracks,
                                    i = void 0;
                                if (a.video && delete a.video, i = a.audio) {
                                    i.levelCodec = i.codec, i.id = e.id, this.hls.trigger(f.default.BUFFER_CODECS, a), p.logger.log("audio track:audio,container:" + i.container + ",codecs[level/parsed]=[" + i.levelCodec + "/" + i.codec + "]");
                                    var n = i.initSegment;
                                    if (n) {
                                        var s = {
                                            type: "audio",
                                            data: n,
                                            parent: "audio",
                                            content: "initSegment"
                                        };
                                        this.audioSwitch ? this.pendingData = [s] : (this.appended = !0, this.pendingBuffering = !0, this.hls.trigger(f.default.BUFFER_APPENDING, s))
                                    }
                                    this.tick()
                                }
                            }
                        }
                    }, {
                        key: "onFragParsingData",
                        value: function(e) {
                            var t = this,
                                r = this.fragCurrent,
                                a = e.frag;
                            if (r && "audio" === e.id && "audio" === e.type && a.sn === r.sn && a.level === r.level && this.state === m.PARSING) {
                                var i = this.trackId,
                                    n = this.tracks[i],
                                    s = this.hls;
                                isNaN(e.endPTS) && (e.endPTS = e.startPTS + r.duration, e.endDTS = e.startDTS + r.duration), p.logger.log("parsed " + e.type + ",PTS:[" + e.startPTS.toFixed(3) + "," + e.endPTS.toFixed(3) + "],DTS:[" + e.startDTS.toFixed(3) + "/" + e.endDTS.toFixed(3) + "],nb:" + e.nb), h.default.updateFragPTSDTS(n.details, r, e.startPTS, e.endPTS);
                                var o = this.audioSwitch,
                                    l = this.media,
                                    u = !1;
                                if (o && l)
                                    if (l.readyState) {
                                        var d = l.currentTime;
                                        p.logger.log("switching audio track : currentTime:" + d), d >= e.startPTS && (p.logger.log("switching audio track : flushing all audio"), this.state = m.BUFFER_FLUSHING, s.trigger(f.default.BUFFER_FLUSHING, {
                                            startOffset: 0,
                                            endOffset: Number.POSITIVE_INFINITY,
                                            type: "audio"
                                        }), u = !0, this.audioSwitch = !1, s.trigger(f.default.AUDIO_TRACK_SWITCHED, {
                                            id: i
                                        }))
                                    } else this.audioSwitch = !1, s.trigger(f.default.AUDIO_TRACK_SWITCHED, {
                                        id: i
                                    });
                                var c = this.pendingData;
                                this.audioSwitch || ([e.data1, e.data2].forEach(function(t) {
                                    t && t.length && c.push({
                                        type: e.type,
                                        data: t,
                                        parent: "audio",
                                        content: "data"
                                    })
                                }), !u && c.length && (c.forEach(function(e) {
                                    t.state === m.PARSING && (t.pendingBuffering = !0, t.hls.trigger(f.default.BUFFER_APPENDING, e))
                                }), this.pendingData = [], this.appended = !0)), this.tick()
                            }
                        }
                    }, {
                        key: "onFragParsed",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            t && "audio" === e.id && r.sn === t.sn && r.level === t.level && this.state === m.PARSING && (this.stats.tparsed = performance.now(), this.state = m.PARSED, this._checkAppendedParsed())
                        }
                    }, {
                        key: "onBufferCreated",
                        value: function(e) {
                            var t = e.tracks.audio;
                            t && (this.mediaBuffer = t.buffer, this.loadedmetadata = !0)
                        }
                    }, {
                        key: "onBufferAppended",
                        value: function(e) {
                            if ("audio" === e.parent) {
                                var t = this.state;
                                t !== m.PARSING && t !== m.PARSED || (this.pendingBuffering = e.pending > 0, this._checkAppendedParsed())
                            }
                        }
                    }, {
                        key: "_checkAppendedParsed",
                        value: function() {
                            if (!(this.state !== m.PARSED || this.appended && this.pendingBuffering)) {
                                var e = this.fragCurrent,
                                    t = this.stats,
                                    r = this.hls;
                                if (e) {
                                    this.fragPrevious = e, t.tbuffered = performance.now(), r.trigger(f.default.FRAG_BUFFERED, {
                                        stats: t,
                                        frag: e,
                                        id: "audio"
                                    });
                                    var a = this.mediaBuffer ? this.mediaBuffer : this.media;
                                    p.logger.log("audio buffered : " + g.default.toString(a.buffered)), this.audioSwitch && this.appended && (this.audioSwitch = !1, r.trigger(f.default.AUDIO_TRACK_SWITCHED, {
                                        id: this.trackId
                                    })), this.state = m.IDLE
                                }
                                this.tick()
                            }
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            var t = e.frag;
                            if (!t || "audio" === t.type) switch (e.details) {
                                case v.ErrorDetails.FRAG_LOAD_ERROR:
                                case v.ErrorDetails.FRAG_LOAD_TIMEOUT:
                                    if (!e.fatal) {
                                        var r = this.fragLoadError;
                                        r ? r++ : r = 1;
                                        var a = this.config;
                                        if (r <= a.fragLoadingMaxRetry) {
                                            this.fragLoadError = r, t.loadCounter = 0;
                                            var i = Math.min(Math.pow(2, r - 1) * a.fragLoadingRetryDelay, a.fragLoadingMaxRetryTimeout);
                                            p.logger.warn("audioStreamController: frag loading failed, retry in " + i + " ms"), this.retryDate = performance.now() + i, this.state = m.FRAG_LOADING_WAITING_RETRY
                                        } else p.logger.error("audioStreamController: " + e.details + " reaches max retry, redispatch as fatal ..."), e.fatal = !0, this.state = m.ERROR
                                    }
                                    break;
                                case v.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                                case v.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
                                case v.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
                                case v.ErrorDetails.KEY_LOAD_ERROR:
                                case v.ErrorDetails.KEY_LOAD_TIMEOUT:
                                    this.state !== m.ERROR && (this.state = e.fatal ? m.ERROR : m.IDLE, p.logger.warn("audioStreamController: " + e.details + " while loading frag,switch to " + this.state + " state ..."));
                                    break;
                                case v.ErrorDetails.BUFFER_FULL_ERROR:
                                    if ("audio" === e.parent && (this.state === m.PARSING || this.state === m.PARSED)) {
                                        var n = this.mediaBuffer,
                                            s = this.media.currentTime;
                                        if (n && u.default.isBuffered(n, s) && u.default.isBuffered(n, s + .5)) {
                                            var o = this.config;
                                            o.maxMaxBufferLength >= o.maxBufferLength && (o.maxMaxBufferLength /= 2, p.logger.warn("audio:reduce max buffer length to " + o.maxMaxBufferLength + "s"), this.fragLoadIdx += 2 * o.fragLoadingLoopThreshold), this.state = m.IDLE
                                        } else p.logger.warn("buffer full error also media.currentTime is not buffered, flush audio buffer"), this.fragCurrent = null, this.state = m.BUFFER_FLUSHING, this.hls.trigger(f.default.BUFFER_FLUSHING, {
                                            startOffset: 0,
                                            endOffset: Number.POSITIVE_INFINITY,
                                            type: "audio"
                                        })
                                    }
                            }
                        }
                    }, {
                        key: "onBufferFlushed",
                        value: function() {
                            var e = this,
                                t = this.pendingData;
                            t && t.length ? (p.logger.log("appending pending audio data on Buffer Flushed"), t.forEach(function(t) {
                                e.hls.trigger(f.default.BUFFER_APPENDING, t)
                            }), this.appended = !0, this.pendingData = [], this.state = m.PARSED) : (this.state = m.IDLE, this.fragPrevious = null, this.tick())
                        }
                    }, {
                        key: "state",
                        set: function(e) {
                            if (this.state !== e) {
                                var t = this.state;
                                this._state = e, p.logger.log("audio stream:" + t + "->" + e)
                            }
                        },
                        get: function() {
                            return this._state
                        }
                    }]), t
                }(c.default);
            r.default = E
        }, {
            25: 25,
            33: 33,
            34: 34,
            35: 35,
            37: 37,
            38: 38,
            48: 48,
            51: 51,
            54: 54,
            55: 55
        }],
        7: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(54),
                f = e(33),
                c = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.MANIFEST_LOADING, l.default.MANIFEST_LOADED, l.default.AUDIO_TRACK_LOADED, l.default.ERROR));
                        return r.ticks = 0, r.ontick = r.tick.bind(r), r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.cleanTimer(), u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "cleanTimer",
                        value: function() {
                            this.timer && (clearTimeout(this.timer), this.timer = null)
                        }
                    }, {
                        key: "tick",
                        value: function() {
                            1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0)
                        }
                    }, {
                        key: "doTick",
                        value: function() {
                            this.updateTrack(this.trackId)
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            e.fatal && e.type === f.ErrorTypes.NETWORK_ERROR && this.cleanTimer()
                        }
                    }, {
                        key: "onManifestLoading",
                        value: function() {
                            this.tracks = [], this.trackId = -1
                        }
                    }, {
                        key: "onManifestLoaded",
                        value: function(e) {
                            var t = this,
                                r = e.audioTracks || [],
                                a = !1;
                            this.tracks = r, this.hls.trigger(l.default.AUDIO_TRACKS_UPDATED, {
                                audioTracks: r
                            });
                            var i = 0;
                            r.forEach(function(e) {
                                if (e.default && !a) return t.audioTrack = i, void(a = !0);
                                i++
                            }), !1 === a && r.length && (d.logger.log("no default audio track defined, use first audio track as default"), this.audioTrack = 0)
                        }
                    }, {
                        key: "onAudioTrackLoaded",
                        value: function(e) {
                            e.id < this.tracks.length && (d.logger.log("audioTrack " + e.id + " loaded"), this.tracks[e.id].details = e.details, e.details.live && !this.timer && (this.timer = setInterval(this.ontick, 1e3 * e.details.targetduration)), !e.details.live && this.timer && this.cleanTimer())
                        }
                    }, {
                        key: "setAudioTrackInternal",
                        value: function(e) {
                            if (e >= 0 && e < this.tracks.length) {
                                this.cleanTimer(), this.trackId = e, d.logger.log("switching to audioTrack " + e);
                                var t = this.tracks[e],
                                    r = this.hls,
                                    a = t.type,
                                    i = t.url,
                                    n = {
                                        id: e,
                                        type: a,
                                        url: i
                                    };
                                r.trigger(l.default.AUDIO_TRACK_SWITCH, n), r.trigger(l.default.AUDIO_TRACK_SWITCHING, n);
                                var s = t.details;
                                !i || void 0 !== s && !0 !== s.live || (d.logger.log("(re)loading playlist for audioTrack " + e), r.trigger(l.default.AUDIO_TRACK_LOADING, {
                                    url: i,
                                    id: e
                                }))
                            }
                        }
                    }, {
                        key: "updateTrack",
                        value: function(e) {
                            if (e >= 0 && e < this.tracks.length) {
                                this.cleanTimer(), this.trackId = e, d.logger.log("updating audioTrack " + e);
                                var t = this.tracks[e],
                                    r = t.url,
                                    a = t.details;
                                !r || void 0 !== a && !0 !== a.live || (d.logger.log("(re)loading playlist for audioTrack " + e), this.hls.trigger(l.default.AUDIO_TRACK_LOADING, {
                                    url: r,
                                    id: e
                                }))
                            }
                        }
                    }, {
                        key: "audioTracks",
                        get: function() {
                            return this.tracks
                        }
                    }, {
                        key: "audioTrack",
                        get: function() {
                            return this.trackId
                        },
                        set: function(e) {
                            this.trackId === e && void 0 !== this.tracks[e].details || this.setAudioTrackInternal(e)
                        }
                    }]), t
                }(u.default);
            r.default = c
        }, {
            33: 33,
            34: 34,
            35: 35,
            54: 54
        }],
        8: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(54),
                f = e(33),
                c = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.MEDIA_ATTACHING, l.default.MEDIA_DETACHING, l.default.MANIFEST_PARSED, l.default.BUFFER_RESET, l.default.BUFFER_APPENDING, l.default.BUFFER_CODECS, l.default.BUFFER_EOS, l.default.BUFFER_FLUSHING, l.default.LEVEL_PTS_UPDATED, l.default.LEVEL_UPDATED));
                        return r._msDuration = null, r._levelDuration = null, r.onsbue = r.onSBUpdateEnd.bind(r), r.onsbe = r.onSBUpdateError.bind(r), r.pendingTracks = {}, r.tracks = {}, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onLevelPtsUpdated",
                        value: function(e) {
                            var t = e.type,
                                r = this.tracks.audio;
                            if ("audio" === t && r && "audio/mpeg" === r.container) {
                                var a = this.sourceBuffer.audio;
                                if (Math.abs(a.timestampOffset - e.start) > .1) {
                                    var i = a.updating;
                                    try {
                                        a.abort()
                                    } catch (e) {
                                        i = !0, d.logger.warn("can not abort audio buffer: " + e)
                                    }
                                    i ? this.audioTimestampOffset = e.start : (d.logger.warn("change mpeg audio timestamp offset from " + a.timestampOffset + " to " + e.start), a.timestampOffset = e.start)
                                }
                            }
                        }
                    }, {
                        key: "onManifestParsed",
                        value: function(e) {
                            var t = e.audio,
                                r = e.video || e.levels.length && e.audio,
                                a = 0;
                            e.altAudio && (t || r) && (a = (t ? 1 : 0) + (r ? 1 : 0), d.logger.log(a + " sourceBuffer(s) expected")), this.sourceBufferNb = a
                        }
                    }, {
                        key: "onMediaAttaching",
                        value: function(e) {
                            var t = this.media = e.media;
                            if (t) {
                                var r = this.mediaSource = new MediaSource;
                                this.onmso = this.onMediaSourceOpen.bind(this), this.onmse = this.onMediaSourceEnded.bind(this), this.onmsc = this.onMediaSourceClose.bind(this), r.addEventListener("sourceopen", this.onmso), r.addEventListener("sourceended", this.onmse), r.addEventListener("sourceclose", this.onmsc), t.src = URL.createObjectURL(r)
                            }
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            d.logger.log("media source detaching");
                            var e = this.mediaSource;
                            if (e) {
                                if ("open" === e.readyState) try {
                                    e.endOfStream()
                                } catch (e) {
                                    d.logger.warn("onMediaDetaching:" + e.message + " while calling endOfStream")
                                }
                                e.removeEventListener("sourceopen", this.onmso), e.removeEventListener("sourceended", this.onmse), e.removeEventListener("sourceclose", this.onmsc), this.media && (URL.revokeObjectURL(this.media.src), this.media.removeAttribute("src"), this.media.load()), this.mediaSource = null, this.media = null, this.pendingTracks = {}, this.tracks = {}, this.sourceBuffer = {}, this.flushRange = [], this.segments = [], this.appended = 0
                            }
                            this.onmso = this.onmse = this.onmsc = null, this.hls.trigger(l.default.MEDIA_DETACHED)
                        }
                    }, {
                        key: "onMediaSourceOpen",
                        value: function() {
                            d.logger.log("media source opened"), this.hls.trigger(l.default.MEDIA_ATTACHED, {
                                media: this.media
                            });
                            var e = this.mediaSource;
                            e && e.removeEventListener("sourceopen", this.onmso), this.checkPendingTracks()
                        }
                    }, {
                        key: "checkPendingTracks",
                        value: function() {
                            var e = this.pendingTracks,
                                t = Object.keys(e).length;
                            t && (this.sourceBufferNb <= t || 0 === this.sourceBufferNb) && (this.createSourceBuffers(e), this.pendingTracks = {}, this.doAppending())
                        }
                    }, {
                        key: "onMediaSourceClose",
                        value: function() {
                            d.logger.log("media source closed")
                        }
                    }, {
                        key: "onMediaSourceEnded",
                        value: function() {
                            d.logger.log("media source ended")
                        }
                    }, {
                        key: "onSBUpdateEnd",
                        value: function() {
                            if (this.audioTimestampOffset) {
                                var e = this.sourceBuffer.audio;
                                d.logger.warn("change mpeg audio timestamp offset from " + e.timestampOffset + " to " + this.audioTimestampOffset), e.timestampOffset = this.audioTimestampOffset, delete this.audioTimestampOffset
                            }
                            this._needsFlush && this.doFlush(), this._needsEos && this.checkEos(), this.appending = !1;
                            var t = this.parent,
                                r = this.segments.reduce(function(e, r) {
                                    return r.parent === t ? e + 1 : e
                                }, 0);
                            this.hls.trigger(l.default.BUFFER_APPENDED, {
                                parent: t,
                                pending: r
                            }), this._needsFlush || this.doAppending(), this.updateMediaElementDuration()
                        }
                    }, {
                        key: "onSBUpdateError",
                        value: function(e) {
                            d.logger.error("sourceBuffer error:", e), this.hls.trigger(l.default.ERROR, {
                                type: f.ErrorTypes.MEDIA_ERROR,
                                details: f.ErrorDetails.BUFFER_APPENDING_ERROR,
                                fatal: !1
                            })
                        }
                    }, {
                        key: "onBufferReset",
                        value: function() {
                            var e = this.sourceBuffer;
                            for (var t in e) {
                                var r = e[t];
                                try {
                                    this.mediaSource.removeSourceBuffer(r), r.removeEventListener("updateend", this.onsbue), r.removeEventListener("error", this.onsbe)
                                } catch (e) {}
                            }
                            this.sourceBuffer = {}, this.flushRange = [], this.segments = [], this.appended = 0
                        }
                    }, {
                        key: "onBufferCodecs",
                        value: function(e) {
                            if (0 === Object.keys(this.sourceBuffer).length) {
                                for (var t in e) this.pendingTracks[t] = e[t];
                                var r = this.mediaSource;
                                r && "open" === r.readyState && this.checkPendingTracks()
                            }
                        }
                    }, {
                        key: "createSourceBuffers",
                        value: function(e) {
                            var t = this.sourceBuffer,
                                r = this.mediaSource;
                            for (var a in e)
                                if (!t[a]) {
                                    var i = e[a],
                                        n = i.levelCodec || i.codec,
                                        s = i.container + ";codecs=" + n;
                                    d.logger.log("creating sourceBuffer(" + s + ")");
                                    try {
                                        var o = t[a] = r.addSourceBuffer(s);
                                        o.addEventListener("updateend", this.onsbue), o.addEventListener("error", this.onsbe), this.tracks[a] = {
                                            codec: n,
                                            container: i.container
                                        }, i.buffer = o
                                    } catch (e) {
                                        d.logger.error("error while trying to add sourceBuffer:" + e.message), this.hls.trigger(l.default.ERROR, {
                                            type: f.ErrorTypes.MEDIA_ERROR,
                                            details: f.ErrorDetails.BUFFER_ADD_CODEC_ERROR,
                                            fatal: !1,
                                            err: e,
                                            mimeType: s
                                        })
                                    }
                                } this.hls.trigger(l.default.BUFFER_CREATED, {
                                tracks: e
                            })
                        }
                    }, {
                        key: "onBufferAppending",
                        value: function(e) {
                            this._needsFlush || (this.segments ? this.segments.push(e) : this.segments = [e], this.doAppending())
                        }
                    }, {
                        key: "onBufferAppendFail",
                        value: function(e) {
                            d.logger.error("sourceBuffer error:", e.event), this.hls.trigger(l.default.ERROR, {
                                type: f.ErrorTypes.MEDIA_ERROR,
                                details: f.ErrorDetails.BUFFER_APPENDING_ERROR,
                                fatal: !1
                            })
                        }
                    }, {
                        key: "onBufferEos",
                        value: function(e) {
                            var t = this.sourceBuffer,
                                r = e.type;
                            for (var a in t) r && a !== r || t[a].ended || (t[a].ended = !0, d.logger.log(a + " sourceBuffer now EOS"));
                            this.checkEos()
                        }
                    }, {
                        key: "checkEos",
                        value: function() {
                            var e = this.sourceBuffer,
                                t = this.mediaSource;
                            if (t && "open" === t.readyState) {
                                for (var r in e) {
                                    var a = e[r];
                                    if (!a.ended) return;
                                    if (a.updating) return void(this._needsEos = !0)
                                }
                                d.logger.log("all media data available, signal endOfStream() to MediaSource and stop loading fragment");
                                try {
                                    t.endOfStream()
                                } catch (e) {
                                    d.logger.warn("exception while calling mediaSource.endOfStream()")
                                }
                                this._needsEos = !1
                            } else this._needsEos = !1
                        }
                    }, {
                        key: "onBufferFlushing",
                        value: function(e) {
                            this.flushRange.push({
                                start: e.startOffset,
                                end: e.endOffset,
                                type: e.type
                            }), this.flushBufferCounter = 0, this.doFlush()
                        }
                    }, {
                        key: "onLevelUpdated",
                        value: function(e) {
                            var t = e.details;
                            0 !== t.fragments.length && (this._levelDuration = t.totalduration + t.fragments[0].start, this.updateMediaElementDuration())
                        }
                    }, {
                        key: "updateMediaElementDuration",
                        value: function() {
                            var e = this.media,
                                t = this.mediaSource,
                                r = this.sourceBuffer,
                                a = this._levelDuration;
                            if (null !== a && e && t && r && 0 !== e.readyState && "open" === t.readyState) {
                                for (var i in r)
                                    if (r[i].updating) return;
                                null === this._msDuration && (this._msDuration = t.duration);
                                var n = e.duration;
                                (a > this._msDuration && a > n || n === 1 / 0 || isNaN(n)) && (d.logger.log("Updating mediasource duration to " + a.toFixed(3)), this._msDuration = t.duration = a)
                            }
                        }
                    }, {
                        key: "doFlush",
                        value: function() {
                            for (; this.flushRange.length;) {
                                var e = this.flushRange[0];
                                if (!this.flushBuffer(e.start, e.end, e.type)) return void(this._needsFlush = !0);
                                this.flushRange.shift(), this.flushBufferCounter = 0
                            }
                            if (0 === this.flushRange.length) {
                                this._needsFlush = !1;
                                var t = 0,
                                    r = this.sourceBuffer;
                                try {
                                    for (var a in r) t += r[a].buffered.length
                                } catch (e) {
                                    d.logger.error("error while accessing sourceBuffer.buffered")
                                }
                                this.appended = t, this.hls.trigger(l.default.BUFFER_FLUSHED)
                            }
                        }
                    }, {
                        key: "doAppending",
                        value: function() {
                            var e = this.hls,
                                t = this.sourceBuffer,
                                r = this.segments;
                            if (Object.keys(t).length) {
                                if (this.media.error) return this.segments = [], void d.logger.error("trying to append although a media error occured, flush segment and abort");
                                if (this.appending) return;
                                if (r && r.length) {
                                    var a = r.shift();
                                    try {
                                        var i = t[a.type];
                                        i ? i.updating ? r.unshift(a) : (i.ended = !1, this.parent = a.parent, i.appendBuffer(a.data), this.appendError = 0, this.appended++, this.appending = !0) : this.onSBUpdateEnd()
                                    } catch (t) {
                                        d.logger.error("error while trying to append buffer:" + t.message), r.unshift(a);
                                        var n = {
                                            type: f.ErrorTypes.MEDIA_ERROR,
                                            parent: a.parent
                                        };
                                        if (22 === t.code) return this.segments = [], n.details = f.ErrorDetails.BUFFER_FULL_ERROR, n.fatal = !1, void e.trigger(l.default.ERROR, n);
                                        if (this.appendError ? this.appendError++ : this.appendError = 1, n.details = f.ErrorDetails.BUFFER_APPEND_ERROR, this.appendError > e.config.appendErrorMaxRetry) return d.logger.log("fail " + e.config.appendErrorMaxRetry + " times to append segment in sourceBuffer"), r = [], n.fatal = !0, void e.trigger(l.default.ERROR, n);
                                        n.fatal = !1, e.trigger(l.default.ERROR, n)
                                    }
                                }
                            }
                        }
                    }, {
                        key: "flushBuffer",
                        value: function(e, t, r) {
                            var a, i, n, s, o, l, u = this.sourceBuffer;
                            if (Object.keys(u).length) {
                                if (d.logger.log("flushBuffer,pos/start/end: " + this.media.currentTime.toFixed(3) + "/" + e + "/" + t), this.flushBufferCounter < this.appended) {
                                    for (var f in u)
                                        if (!r || f === r) {
                                            if (a = u[f], a.ended = !1, a.updating) return d.logger.warn("cannot flush, sb updating in progress"), !1;
                                            try {
                                                for (i = 0; i < a.buffered.length; i++)
                                                    if (n = a.buffered.start(i), s = a.buffered.end(i), -1 !== navigator.userAgent.toLowerCase().indexOf("firefox") && t === Number.POSITIVE_INFINITY ? (o = e, l = t) : (o = Math.max(n, e), l = Math.min(s, t)), Math.min(l, s) - o > .5) return this.flushBufferCounter++, d.logger.log("flush " + f + " [" + o + "," + l + "], of [" + n + "," + s + "], pos:" + this.media.currentTime), a.remove(o, l), !1
                                            } catch (e) {
                                                d.logger.warn("exception while accessing sourcebuffer, it might have been removed from MediaSource")
                                            }
                                        }
                                } else d.logger.warn("abort flushing too many retries");
                                d.logger.log("buffer flushed")
                            }
                            return !0
                        }
                    }]), t
                }(u.default);
            r.default = c
        }, {
            33: 33,
            34: 34,
            35: 35,
            54: 54
        }],
        9: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = function(e) {
                    function t(e) {
                        return i(this, t), n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.FPS_DROP_LEVEL_CAPPING, l.default.MEDIA_ATTACHING, l.default.MANIFEST_PARSED))
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.hls.config.capLevelToPlayerSize && (this.media = this.restrictedLevels = null, this.autoLevelCapping = Number.POSITIVE_INFINITY, this.timer && (this.timer = clearInterval(this.timer)))
                        }
                    }, {
                        key: "onFpsDropLevelCapping",
                        value: function(e) {
                            t.isLevelAllowed(e.droppedLevel, this.restrictedLevels) && this.restrictedLevels.push(e.droppedLevel)
                        }
                    }, {
                        key: "onMediaAttaching",
                        value: function(e) {
                            this.media = e.media instanceof HTMLVideoElement ? e.media : null
                        }
                    }, {
                        key: "onManifestParsed",
                        value: function(e) {
                            var t = this.hls;
                            this.restrictedLevels = [], t.config.capLevelToPlayerSize && (this.autoLevelCapping = Number.POSITIVE_INFINITY, this.levels = e.levels, t.firstLevel = this.getMaxLevel(e.firstLevel), clearInterval(this.timer), this.timer = setInterval(this.detectPlayerSize.bind(this), 1e3), this.detectPlayerSize())
                        }
                    }, {
                        key: "detectPlayerSize",
                        value: function() {
                            if (this.media) {
                                var e = this.levels ? this.levels.length : 0;
                                if (e) {
                                    var t = this.hls;
                                    t.autoLevelCapping = this.getMaxLevel(e - 1), t.autoLevelCapping > this.autoLevelCapping && t.streamController.nextLevelSwitch(), this.autoLevelCapping = t.autoLevelCapping
                                }
                            }
                        }
                    }, {
                        key: "getMaxLevel",
                        value: function(e) {
                            var r = this;
                            if (!this.levels) return -1;
                            var a = this.levels.filter(function(a, i) {
                                return t.isLevelAllowed(i, r.restrictedLevels) && i <= e
                            });
                            return t.getMaxLevelByMediaSize(a, this.mediaWidth, this.mediaHeight)
                        }
                    }, {
                        key: "mediaWidth",
                        get: function() {
                            var e = void 0,
                                r = this.media;
                            return r && (e = r.width || r.clientWidth || r.offsetWidth, e *= t.contentScaleFactor), e
                        }
                    }, {
                        key: "mediaHeight",
                        get: function() {
                            var e = void 0,
                                r = this.media;
                            return r && (e = r.height || r.clientHeight || r.offsetHeight, e *= t.contentScaleFactor), e
                        }
                    }], [{
                        key: "isLevelAllowed",
                        value: function(e) {
                            return -1 === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []).indexOf(e)
                        }
                    }, {
                        key: "getMaxLevelByMediaSize",
                        value: function(e, t, r) {
                            if (!e || e && !e.length) return -1;
                            for (var a = e.length - 1, i = 0; i < e.length; i += 1) {
                                var n = e[i];
                                if ((n.width >= t || n.height >= r) && function(e, t) {
                                        return !t || e.width !== t.width || e.height !== t.height
                                    }(n, e[i + 1])) {
                                    a = i;
                                    break
                                }
                            }
                            return a
                        }
                    }, {
                        key: "contentScaleFactor",
                        get: function() {
                            var e = 1;
                            try {
                                e = window.devicePixelRatio
                            } catch (e) {}
                            return e
                        }
                    }]), t
                }(a(e(34)).default);
            r.default = u
        }, {
            34: 34,
            35: 35
        }],
        10: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(54),
                f = function(e) {
                    function t(e) {
                        return i(this, t), n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.MEDIA_ATTACHING))
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.timer && clearInterval(this.timer), this.isVideoPlaybackQualityAvailable = !1
                        }
                    }, {
                        key: "onMediaAttaching",
                        value: function(e) {
                            var t = this.hls.config;
                            t.capLevelOnFPSDrop && ("function" == typeof(this.video = e.media instanceof HTMLVideoElement ? e.media : null).getVideoPlaybackQuality && (this.isVideoPlaybackQualityAvailable = !0), clearInterval(this.timer), this.timer = setInterval(this.checkFPSInterval.bind(this), t.fpsDroppedMonitoringPeriod))
                        }
                    }, {
                        key: "checkFPS",
                        value: function(e, t, r) {
                            var a = performance.now();
                            if (t) {
                                if (this.lastTime) {
                                    var i = a - this.lastTime,
                                        n = r - this.lastDroppedFrames,
                                        s = t - this.lastDecodedFrames,
                                        o = 1e3 * n / i,
                                        u = this.hls;
                                    if (u.trigger(l.default.FPS_DROP, {
                                            currentDropped: n,
                                            currentDecoded: s,
                                            totalDroppedFrames: r
                                        }), o > 0 && n > u.config.fpsDroppedMonitoringThreshold * s) {
                                        var f = u.currentLevel;
                                        d.logger.warn("drop FPS ratio greater than max allowed value for currentLevel: " + f), f > 0 && (-1 === u.autoLevelCapping || u.autoLevelCapping >= f) && (f -= 1, u.trigger(l.default.FPS_DROP_LEVEL_CAPPING, {
                                            level: f,
                                            droppedLevel: u.currentLevel
                                        }), u.autoLevelCapping = f, u.streamController.nextLevelSwitch())
                                    }
                                }
                                this.lastTime = a, this.lastDroppedFrames = r, this.lastDecodedFrames = t
                            }
                        }
                    }, {
                        key: "checkFPSInterval",
                        value: function() {
                            var e = this.video;
                            if (e)
                                if (this.isVideoPlaybackQualityAvailable) {
                                    var t = e.getVideoPlaybackQuality();
                                    this.checkFPS(e, t.totalVideoFrames, t.droppedVideoFrames)
                                } else this.checkFPS(e, e.webkitDecodedFrameCount, e.webkitDroppedFrameCount)
                        }
                    }]), t
                }(u.default);
            r.default = f
        }, {
            34: 34,
            35: 35,
            54: 54
        }],
        11: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = a(e(27)),
                f = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.MEDIA_ATTACHED, l.default.MEDIA_DETACHING, l.default.FRAG_PARSING_METADATA));
                        return r.id3Track = void 0, r.media = void 0, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onMediaAttached",
                        value: function(e) {
                            this.media = e.media, this.media && (this.id3Track = this.media.addTextTrack("metadata", "id3"), this.id3Track.mode = "hidden")
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            this.media = void 0
                        }
                    }, {
                        key: "onFragParsingMetadata",
                        value: function(e) {
                            for (var t = e.frag, r = e.samples, a = window.WebKitDataCue || window.VTTCue || window.TextTrackCue, i = 0; i < r.length; i++) {
                                var n = d.default.getID3Frames(r[i].data);
                                if (n) {
                                    var s = r[i].pts,
                                        o = i < r.length - 1 ? r[i + 1].pts : t.endPTS;
                                    s === o && (o += 1e-4);
                                    for (var l = 0; l < n.length; l++) {
                                        var u = n[l];
                                        if (!d.default.isTimeStampFrame(u)) {
                                            var f = new a(s, o, "");
                                            f.value = u, this.id3Track.addCue(f)
                                        }
                                    }
                                }
                            }
                        }
                    }]), t
                }(u.default);
            r.default = f
        }, {
            27: 27,
            34: 34,
            35: 35
        }],
        12: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(54),
                f = e(33),
                c = a(e(37)),
                h = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.MANIFEST_LOADED, l.default.LEVEL_LOADED, l.default.FRAG_LOADED, l.default.ERROR));
                        return r.ontick = r.tick.bind(r), r._manualLevel = -1, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.cleanTimer(), this._manualLevel = -1
                        }
                    }, {
                        key: "cleanTimer",
                        value: function() {
                            this.timer && (clearTimeout(this.timer), this.timer = null)
                        }
                    }, {
                        key: "startLoad",
                        value: function() {
                            this.canload = !0;
                            var e = this._levels;
                            e && e.forEach(function(e) {
                                e.loadError = 0;
                                var t = e.details;
                                t && t.live && (e.details = void 0)
                            }), this.timer && this.tick()
                        }
                    }, {
                        key: "stopLoad",
                        value: function() {
                            this.canload = !1
                        }
                    }, {
                        key: "onManifestLoaded",
                        value: function(e) {
                            var t, r = [],
                                a = [],
                                i = {},
                                n = !1,
                                s = !1,
                                o = this.hls,
                                u = /chrome|firefox/.test(navigator.userAgent.toLowerCase()),
                                c = function(e, t) {
                                    return MediaSource.isTypeSupported(e + "/mp4;codecs=" + t)
                                };
                            if (e.levels.forEach(function(e) {
                                    e.videoCodec && (n = !0), u && e.audioCodec && -1 !== e.audioCodec.indexOf("mp4a.40.34") && (e.audioCodec = void 0), (e.audioCodec || e.attrs && e.attrs.AUDIO) && (s = !0);
                                    var t = i[e.bitrate];
                                    void 0 === t ? (i[e.bitrate] = r.length, e.url = [e.url], e.urlId = 0, r.push(e)) : r[t].url.push(e.url)
                                }), n && s ? r.forEach(function(e) {
                                    e.videoCodec && a.push(e)
                                }) : a = r, (a = a.filter(function(e) {
                                    var t = e.audioCodec,
                                        r = e.videoCodec;
                                    return (!t || c("audio", t)) && (!r || c("video", r))
                                })).length) {
                                t = a[0].bitrate, a.sort(function(e, t) {
                                    return e.bitrate - t.bitrate
                                }), this._levels = a;
                                for (var h = 0; h < a.length; h++)
                                    if (a[h].bitrate === t) {
                                        this._firstLevel = h, d.logger.log("manifest loaded," + a.length + " level(s) found, first bitrate:" + t);
                                        break
                                    } o.trigger(l.default.MANIFEST_PARSED, {
                                    levels: a,
                                    firstLevel: this._firstLevel,
                                    stats: e.stats,
                                    audio: s,
                                    video: n,
                                    altAudio: e.audioTracks.length > 0
                                })
                            } else o.trigger(l.default.ERROR, {
                                type: f.ErrorTypes.MEDIA_ERROR,
                                details: f.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR,
                                fatal: !0,
                                url: o.url,
                                reason: "no level with compatible codecs found in manifest"
                            })
                        }
                    }, {
                        key: "setLevelInternal",
                        value: function(e) {
                            var t = this._levels,
                                r = this.hls;
                            if (e >= 0 && e < t.length) {
                                if (this.cleanTimer(), this._level !== e) {
                                    d.logger.log("switching to level " + e), this._level = e;
                                    var a = t[e];
                                    a.level = e, r.trigger(l.default.LEVEL_SWITCH, a), r.trigger(l.default.LEVEL_SWITCHING, a)
                                }
                                var i = t[e],
                                    n = i.details;
                                if (!n || !0 === n.live) {
                                    var s = i.urlId;
                                    r.trigger(l.default.LEVEL_LOADING, {
                                        url: i.url[s],
                                        level: e,
                                        id: s
                                    })
                                }
                            } else r.trigger(l.default.ERROR, {
                                type: f.ErrorTypes.OTHER_ERROR,
                                details: f.ErrorDetails.LEVEL_SWITCH_ERROR,
                                level: e,
                                fatal: !1,
                                reason: "invalid level idx"
                            })
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            if (e.fatal) e.type === f.ErrorTypes.NETWORK_ERROR && this.cleanTimer();
                            else {
                                var t = e.details,
                                    r = this.hls,
                                    a = void 0,
                                    i = void 0,
                                    n = !1;
                                switch (t) {
                                    case f.ErrorDetails.FRAG_LOAD_ERROR:
                                    case f.ErrorDetails.FRAG_LOAD_TIMEOUT:
                                    case f.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                                    case f.ErrorDetails.KEY_LOAD_ERROR:
                                    case f.ErrorDetails.KEY_LOAD_TIMEOUT:
                                        a = e.frag.level;
                                        break;
                                    case f.ErrorDetails.LEVEL_LOAD_ERROR:
                                    case f.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                                        a = e.context.level, n = !0;
                                        break;
                                    case f.ErrorDetails.REMUX_ALLOC_ERROR:
                                        a = e.level
                                }
                                if (void 0 !== a) {
                                    (i = this._levels[a]).loadError ? i.loadError++ : i.loadError = 1;
                                    var s = i.url.length;
                                    if (s > 1 && i.loadError < s) i.urlId = (i.urlId + 1) % s, i.details = void 0, d.logger.warn("level controller," + t + " for level " + a + ": switching to redundant stream id " + i.urlId);
                                    else if (-1 === this._manualLevel && a) d.logger.warn("level controller," + t + ": switch-down for next fragment"), r.nextAutoLevel = Math.max(0, a - 1);
                                    else if (i && i.details && i.details.live) d.logger.warn("level controller," + t + " on live stream, discard"), n && (this._level = void 0);
                                    else if (t === f.ErrorDetails.LEVEL_LOAD_ERROR || t === f.ErrorDetails.LEVEL_LOAD_TIMEOUT) {
                                        var o = r.media;
                                        if (o && c.default.isBuffered(o, o.currentTime) && c.default.isBuffered(o, o.currentTime + .5)) {
                                            var l = r.config.levelLoadingRetryDelay;
                                            d.logger.warn("level controller," + t + ", but media buffered, retry in " + l + "ms"), this.timer = setTimeout(this.ontick, l), e.levelRetry = !0
                                        } else d.logger.error("cannot recover " + t + " error"), this._level = void 0, this.cleanTimer(), e.fatal = !0
                                    }
                                }
                            }
                        }
                    }, {
                        key: "onFragLoaded",
                        value: function(e) {
                            var t = e.frag;
                            if (t && "main" === t.type) {
                                var r = this._levels[t.level];
                                r && (r.loadError = 0)
                            }
                        }
                    }, {
                        key: "onLevelLoaded",
                        value: function(e) {
                            var t = e.level;
                            if (t === this._level) {
                                var r = this._levels[t];
                                r.loadError = 0;
                                var a = e.details;
                                if (a.live) {
                                    var i = 1e3 * (a.averagetargetduration ? a.averagetargetduration : a.targetduration),
                                        n = r.details;
                                    n && a.endSN === n.endSN && (i /= 2, d.logger.log("same live playlist, reload twice faster")), i -= performance.now() - e.stats.trequest, i = Math.max(1e3, Math.round(i)), d.logger.log("live playlist, reload in " + i + " ms"), this.timer = setTimeout(this.ontick, i)
                                } else this.timer = null
                            }
                        }
                    }, {
                        key: "tick",
                        value: function() {
                            var e = this._level;
                            if (void 0 !== e && this.canload) {
                                var t = this._levels[e];
                                if (t && t.url) {
                                    var r = t.urlId;
                                    this.hls.trigger(l.default.LEVEL_LOADING, {
                                        url: t.url[r],
                                        level: e,
                                        id: r
                                    })
                                }
                            }
                        }
                    }, {
                        key: "levels",
                        get: function() {
                            return this._levels
                        }
                    }, {
                        key: "level",
                        get: function() {
                            return this._level
                        },
                        set: function(e) {
                            var t = this._levels;
                            t && t.length > e && (this._level === e && void 0 !== t[e].details || this.setLevelInternal(e))
                        }
                    }, {
                        key: "manualLevel",
                        get: function() {
                            return this._manualLevel
                        },
                        set: function(e) {
                            this._manualLevel = e, void 0 === this._startLevel && (this._startLevel = e), -1 !== e && (this.level = e)
                        }
                    }, {
                        key: "firstLevel",
                        get: function() {
                            return this._firstLevel
                        },
                        set: function(e) {
                            this._firstLevel = e
                        }
                    }, {
                        key: "startLevel",
                        get: function() {
                            if (void 0 === this._startLevel) {
                                var e = this.hls.config.startLevel;
                                return void 0 !== e ? e : this._firstLevel
                            }
                            return this._startLevel
                        },
                        set: function(e) {
                            this._startLevel = e
                        }
                    }, {
                        key: "nextLoadLevel",
                        get: function() {
                            return -1 !== this._manualLevel ? this._manualLevel : this.hls.nextAutoLevel
                        },
                        set: function(e) {
                            this.level = e, -1 === this._manualLevel && (this.hls.nextAutoLevel = e)
                        }
                    }]), t
                }(u.default);
            r.default = h
        }, {
            33: 33,
            34: 34,
            35: 35,
            37: 37,
            54: 54
        }],
        13: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(48)),
                u = a(e(37)),
                d = a(e(25)),
                f = a(e(35)),
                c = a(e(34)),
                h = a(e(38)),
                g = a(e(55)),
                v = e(33),
                p = e(54),
                y = {
                    STOPPED: "STOPPED",
                    IDLE: "IDLE",
                    KEY_LOADING: "KEY_LOADING",
                    FRAG_LOADING: "FRAG_LOADING",
                    FRAG_LOADING_WAITING_RETRY: "FRAG_LOADING_WAITING_RETRY",
                    WAITING_LEVEL: "WAITING_LEVEL",
                    PARSING: "PARSING",
                    PARSED: "PARSED",
                    BUFFER_FLUSHING: "BUFFER_FLUSHING",
                    ENDED: "ENDED",
                    ERROR: "ERROR"
                },
                m = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, f.default.MEDIA_ATTACHED, f.default.MEDIA_DETACHING, f.default.MANIFEST_LOADING, f.default.MANIFEST_PARSED, f.default.LEVEL_LOADED, f.default.KEY_LOADED, f.default.FRAG_LOADED, f.default.FRAG_LOAD_EMERGENCY_ABORTED, f.default.FRAG_PARSING_INIT_SEGMENT, f.default.FRAG_PARSING_DATA, f.default.FRAG_PARSED, f.default.ERROR, f.default.AUDIO_TRACK_SWITCHING, f.default.AUDIO_TRACK_SWITCHED, f.default.BUFFER_CREATED, f.default.BUFFER_APPENDED, f.default.BUFFER_FLUSHED));
                        return r.config = e.config, r.audioCodecSwap = !1, r.ticks = 0, r._state = y.STOPPED, r.ontick = r.tick.bind(r), r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            this.stopLoad(), this.timer && (clearInterval(this.timer), this.timer = null), c.default.prototype.destroy.call(this), this.state = y.STOPPED
                        }
                    }, {
                        key: "startLoad",
                        value: function(e) {
                            if (this.levels) {
                                var t = this.lastCurrentTime,
                                    r = this.hls;
                                if (this.stopLoad(), this.timer || (this.timer = setInterval(this.ontick, 100)), this.level = -1, this.fragLoadError = 0, !this.startFragRequested) {
                                    var a = r.startLevel; - 1 === a && (a = 0, this.bitrateTest = !0), this.level = r.nextLoadLevel = a, this.loadedmetadata = !1
                                }
                                t > 0 && -1 === e && (p.logger.log("override startPosition with lastCurrentTime @" + t.toFixed(3)), e = t), this.state = y.IDLE, this.nextLoadPosition = this.startPosition = this.lastCurrentTime = e, this.tick()
                            } else this.forceStartLoad = !0, this.state = y.STOPPED
                        }
                    }, {
                        key: "stopLoad",
                        value: function() {
                            var e = this.fragCurrent;
                            e && (e.loader && e.loader.abort(), this.fragCurrent = null), this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = y.STOPPED, this.forceStartLoad = !1
                        }
                    }, {
                        key: "tick",
                        value: function() {
                            1 === ++this.ticks && (this.doTick(), this.ticks > 1 && setTimeout(this.tick, 1), this.ticks = 0)
                        }
                    }, {
                        key: "doTick",
                        value: function() {
                            switch (this.state) {
                                case y.ERROR:
                                    break;
                                case y.BUFFER_FLUSHING:
                                    this.fragLoadError = 0;
                                    break;
                                case y.IDLE:
                                    this._doTickIdle();
                                    break;
                                case y.WAITING_LEVEL:
                                    var e = this.levels[this.level];
                                    e && e.details && (this.state = y.IDLE);
                                    break;
                                case y.FRAG_LOADING_WAITING_RETRY:
                                    var t = performance.now(),
                                        r = this.retryDate;
                                    (!r || t >= r || this.media && this.media.seeking) && (p.logger.log("mediaController: retryDate reached, switch back to IDLE state"), this.state = y.IDLE);
                                    break;
                                case y.ERROR:
                                case y.STOPPED:
                                case y.FRAG_LOADING:
                                case y.PARSING:
                                case y.PARSED:
                                case y.ENDED:
                            }
                            this._checkBuffer(), this._checkFragmentChanged()
                        }
                    }, {
                        key: "_doTickIdle",
                        value: function() {
                            var e = this.hls,
                                t = e.config,
                                r = this.media;
                            if (void 0 === this.levelLastLoaded || r || !this.startFragRequested && t.startFragPrefetch) {
                                var a = void 0;
                                a = this.loadedmetadata ? r.currentTime : this.nextLoadPosition;
                                var i = e.nextLoadLevel,
                                    n = this.levels[i];
                                if (n) {
                                    var s = n.bitrate,
                                        o = void 0;
                                    o = s ? Math.max(8 * t.maxBufferSize / s, t.maxBufferLength) : t.maxBufferLength, o = Math.min(o, t.maxMaxBufferLength);
                                    var l = u.default.bufferInfo(this.mediaBuffer ? this.mediaBuffer : r, a, t.maxBufferHole),
                                        d = l.len;
                                    if (!(d >= o)) {
                                        p.logger.trace("buffer length of " + d.toFixed(3) + " is below max of " + o.toFixed(3) + ". checking for more payload ..."), this.level = e.nextLoadLevel = i;
                                        var c = n.details;
                                        if (void 0 === c || c.live && this.levelLastLoaded !== i) this.state = y.WAITING_LEVEL;
                                        else {
                                            var h = this.fragPrevious;
                                            if (!c.live && h && h.sn === c.endSN && d && !l.nextStart && Math.min(r.duration, h.start + h.duration) - Math.max(l.end, h.start) <= Math.max(.2, h.duration)) {
                                                var g = {};
                                                return this.altAudio && (g.type = "video"), this.hls.trigger(f.default.BUFFER_EOS, g), void(this.state = y.ENDED)
                                            }
                                            this._fetchPayloadOrEos(a, l, c)
                                        }
                                    }
                                }
                            }
                        }
                    }, {
                        key: "_fetchPayloadOrEos",
                        value: function(e, t, r) {
                            var a = this.fragPrevious,
                                i = this.level,
                                n = r.fragments,
                                s = n.length;
                            if (0 !== s) {
                                var o = n[0].start,
                                    l = n[s - 1].start + n[s - 1].duration,
                                    u = t.end,
                                    d = void 0;
                                if (r.initSegment && !r.initSegment.data) d = r.initSegment;
                                else if (r.live) {
                                    var f = this.config.initialLiveManifestSize;
                                    if (s < f) return void p.logger.warn("Can not start playback of a level, reason: not enough fragments " + s + " < " + f);
                                    if (null === (d = this._ensureFragmentAtLivePoint(r, u, o, l, a, n, s))) return
                                } else u < o && (d = n[0]);
                                d || (d = this._findFragment(o, a, s, n, u, l, r)), d && this._loadFragmentOrKey(d, i, r, e, u)
                            }
                        }
                    }, {
                        key: "_ensureFragmentAtLivePoint",
                        value: function(e, t, r, a, i, n, s) {
                            var o = this.hls.config,
                                u = this.media,
                                d = void 0,
                                f = void 0 !== o.liveMaxLatencyDuration ? o.liveMaxLatencyDuration : o.liveMaxLatencyDurationCount * e.targetduration;
                            if (t < Math.max(r - o.maxFragLookUpTolerance, a - f)) {
                                var c = this.liveSyncPosition = this.computeLivePosition(r, e);
                                p.logger.log("buffer end: " + t.toFixed(3) + " is located too far from the end of live sliding playlist, reset currentTime to : " + c.toFixed(3)), t = c, u && u.readyState && u.duration > c && (u.currentTime = c), this.nextLoadPosition = c
                            }
                            if (e.PTSKnown && t > a && u && u.readyState) return null;
                            if (this.startFragRequested && !e.PTSKnown) {
                                if (i) {
                                    var h = i.sn + 1;
                                    if (h >= e.startSN && h <= e.endSN) {
                                        var g = n[h - e.startSN];
                                        i.cc === g.cc && (d = g, p.logger.log("live playlist, switching playlist, load frag with next SN: " + d.sn))
                                    }
                                    d || (d = l.default.search(n, function(e) {
                                        return i.cc - e.cc
                                    })) && p.logger.log("live playlist, switching playlist, load frag with same CC: " + d.sn)
                                }
                                d || (d = n[Math.min(s - 1, Math.round(s / 2))], p.logger.log("live playlist, switching playlist, unknown, load middle frag : " + d.sn))
                            }
                            return d
                        }
                    }, {
                        key: "_findFragment",
                        value: function(e, t, r, a, i, n, s) {
                            var o = this.hls.config,
                                u = void 0,
                                d = void 0,
                                f = o.maxFragLookUpTolerance,
                                c = t ? a[t.sn - a[0].sn + 1] : void 0,
                                h = function(e) {
                                    var t = Math.min(f, e.duration);
                                    return e.start + e.duration - t <= i ? 1 : e.start - t > i && e.start ? -1 : 0
                                };
                            if (i < n ? (i > n - f && (f = 0), d = c && !h(c) ? c : l.default.search(a, h)) : d = a[r - 1], d) {
                                var g = (u = d).sn - s.startSN,
                                    v = t && u.level === t.level,
                                    y = a[g - 1],
                                    m = a[g + 1];
                                if (t && u.sn === t.sn)
                                    if (v && !u.backtracked)
                                        if (u.sn < s.endSN) {
                                            var E = t.deltaPTS;
                                            E && E > o.maxBufferHole && t.dropped && g ? (u = y, p.logger.warn("SN just loaded, with large PTS gap between audio and video, maybe frag is not starting with a keyframe ? load previous one to try to overcome this"), t.loadCounter--) : (u = m, p.logger.log("SN just loaded, load next one: " + u.sn))
                                        } else u = null;
                                else u.backtracked && (m && m.backtracked ? (p.logger.warn("Already backtracked from fragment " + m.sn + ", will not backtrack to fragment " + u.sn + ". Loading fragment " + m.sn), u = m) : (p.logger.warn("Loaded fragment with dropped frames, backtracking 1 segment to find a keyframe"), u.dropped = 0, y ? (y.loadCounter && y.loadCounter--, (u = y).backtracked = !0) : g && (u = null)))
                            }
                            return u
                        }
                    }, {
                        key: "_loadFragmentOrKey",
                        value: function(e, t, r, a, i) {
                            var n = this.hls,
                                s = n.config;
                            if (!e.decryptdata || null == e.decryptdata.uri || null != e.decryptdata.key) {
                                if (p.logger.log("Loading " + e.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + t + ", currentTime:" + a.toFixed(3) + ",bufferEnd:" + i.toFixed(3)), void 0 !== this.fragLoadIdx ? this.fragLoadIdx++ : this.fragLoadIdx = 0, e.loadCounter) {
                                    e.loadCounter++;
                                    var o = s.fragLoadingLoopThreshold;
                                    if (e.loadCounter > o && Math.abs(this.fragLoadIdx - e.loadIdx) < o) return void n.trigger(f.default.ERROR, {
                                        type: v.ErrorTypes.MEDIA_ERROR,
                                        details: v.ErrorDetails.FRAG_LOOP_LOADING_ERROR,
                                        fatal: !1,
                                        frag: e
                                    })
                                } else e.loadCounter = 1;
                                return e.loadIdx = this.fragLoadIdx, this.fragCurrent = e, this.startFragRequested = !0, isNaN(e.sn) || (this.nextLoadPosition = e.start + e.duration), e.autoLevel = n.autoLevelEnabled, e.bitrateTest = this.bitrateTest, n.trigger(f.default.FRAG_LOADING, {
                                    frag: e
                                }), this.demuxer || (this.demuxer = new d.default(n, "main")), void(this.state = y.FRAG_LOADING)
                            }
                            p.logger.log("Loading key for " + e.sn + " of [" + r.startSN + " ," + r.endSN + "],level " + t), this.state = y.KEY_LOADING, n.trigger(f.default.KEY_LOADING, {
                                frag: e
                            })
                        }
                    }, {
                        key: "getBufferedFrag",
                        value: function(e) {
                            return l.default.search(this._bufferedFrags, function(t) {
                                return e < t.startPTS ? -1 : e > t.endPTS ? 1 : 0
                            })
                        }
                    }, {
                        key: "followingBufferedFrag",
                        value: function(e) {
                            return e ? this.getBufferedFrag(e.endPTS + .5) : null
                        }
                    }, {
                        key: "_checkFragmentChanged",
                        value: function() {
                            var e, t, r = this.media;
                            if (r && r.readyState && !1 === r.seeking && ((t = r.currentTime) > r.playbackRate * this.lastCurrentTime && (this.lastCurrentTime = t), u.default.isBuffered(r, t) ? e = this.getBufferedFrag(t) : u.default.isBuffered(r, t + .1) && (e = this.getBufferedFrag(t + .1)), e)) {
                                var a = e;
                                if (a !== this.fragPlaying) {
                                    this.hls.trigger(f.default.FRAG_CHANGED, {
                                        frag: a
                                    });
                                    var i = a.level;
                                    this.fragPlaying && this.fragPlaying.level === i || this.hls.trigger(f.default.LEVEL_SWITCHED, {
                                        level: i
                                    }), this.fragPlaying = a
                                }
                            }
                        }
                    }, {
                        key: "immediateLevelSwitch",
                        value: function() {
                            if (p.logger.log("immediateLevelSwitch"), !this.immediateSwitch) {
                                this.immediateSwitch = !0;
                                var e = this.media,
                                    t = void 0;
                                e ? (t = e.paused, e.pause()) : t = !0, this.previouslyPaused = t
                            }
                            var r = this.fragCurrent;
                            r && r.loader && r.loader.abort(), this.fragCurrent = null, this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold, this.flushMainBuffer(0, Number.POSITIVE_INFINITY)
                        }
                    }, {
                        key: "immediateLevelSwitchEnd",
                        value: function() {
                            var e = this.media;
                            e && e.buffered.length && (this.immediateSwitch = !1, u.default.isBuffered(e, e.currentTime) && (e.currentTime -= 1e-4), this.previouslyPaused || e.play())
                        }
                    }, {
                        key: "nextLevelSwitch",
                        value: function() {
                            var e = this.media;
                            if (e && e.readyState) {
                                var t = void 0,
                                    r = void 0,
                                    a = void 0;
                                if (this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold, (r = this.getBufferedFrag(e.currentTime)) && r.startPTS > 1 && this.flushMainBuffer(0, r.startPTS - 1), e.paused) t = 0;
                                else {
                                    var i = this.hls.nextLoadLevel,
                                        n = this.levels[i],
                                        s = this.fragLastKbps;
                                    t = s && this.fragCurrent ? this.fragCurrent.duration * n.bitrate / (1e3 * s) + 1 : 0
                                }
                                if ((a = this.getBufferedFrag(e.currentTime + t)) && (a = this.followingBufferedFrag(a))) {
                                    var o = this.fragCurrent;
                                    o && o.loader && o.loader.abort(), this.fragCurrent = null, this.flushMainBuffer(a.maxStartPTS, Number.POSITIVE_INFINITY)
                                }
                            }
                        }
                    }, {
                        key: "flushMainBuffer",
                        value: function(e, t) {
                            this.state = y.BUFFER_FLUSHING;
                            var r = {
                                startOffset: e,
                                endOffset: t
                            };
                            this.altAudio && (r.type = "video"), this.hls.trigger(f.default.BUFFER_FLUSHING, r)
                        }
                    }, {
                        key: "onMediaAttached",
                        value: function(e) {
                            var t = this.media = this.mediaBuffer = e.media;
                            this.onvseeking = this.onMediaSeeking.bind(this), this.onvseeked = this.onMediaSeeked.bind(this), this.onvended = this.onMediaEnded.bind(this), t.addEventListener("seeking", this.onvseeking), t.addEventListener("seeked", this.onvseeked), t.addEventListener("ended", this.onvended);
                            var r = this.config;
                            this.levels && r.autoStartLoad && this.hls.startLoad(r.startPosition)
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            var e = this.media;
                            e && e.ended && (p.logger.log("MSE detaching and video ended, reset startPosition"), this.startPosition = this.lastCurrentTime = 0);
                            var t = this.levels;
                            t && t.forEach(function(e) {
                                e.details && e.details.fragments.forEach(function(e) {
                                    e.loadCounter = void 0, e.backtracked = void 0
                                })
                            }), e && (e.removeEventListener("seeking", this.onvseeking), e.removeEventListener("seeked", this.onvseeked), e.removeEventListener("ended", this.onvended), this.onvseeking = this.onvseeked = this.onvended = null), this.media = this.mediaBuffer = null, this.loadedmetadata = !1, this.stopLoad()
                        }
                    }, {
                        key: "onMediaSeeking",
                        value: function() {
                            var e = this.media,
                                t = e ? e.currentTime : void 0,
                                r = this.config;
                            isNaN(t) || p.logger.log("media seeking to " + t.toFixed(3));
                            var a = this.mediaBuffer ? this.mediaBuffer : e,
                                i = u.default.bufferInfo(a, t, this.config.maxBufferHole);
                            if (this.state === y.FRAG_LOADING) {
                                var n = this.fragCurrent;
                                if (0 === i.len && n) {
                                    var s = r.maxFragLookUpTolerance,
                                        o = n.start - s,
                                        l = n.start + n.duration + s;
                                    t < o || t > l ? (n.loader && (p.logger.log("seeking outside of buffer while fragment load in progress, cancel fragment load"), n.loader.abort()), this.fragCurrent = null, this.fragPrevious = null, this.state = y.IDLE) : p.logger.log("seeking outside of buffer but within currently loaded fragment range")
                                }
                            } else this.state === y.ENDED && (0 === i.len && (this.fragPrevious = 0), this.state = y.IDLE);
                            e && (this.lastCurrentTime = t), this.state !== y.FRAG_LOADING && void 0 !== this.fragLoadIdx && (this.fragLoadIdx += 2 * r.fragLoadingLoopThreshold), this.loadedmetadata || (this.nextLoadPosition = this.startPosition = t), this.tick()
                        }
                    }, {
                        key: "onMediaSeeked",
                        value: function() {
                            var e = this.media,
                                t = e ? e.currentTime : void 0;
                            isNaN(t) || p.logger.log("media seeked to " + t.toFixed(3)), this.tick()
                        }
                    }, {
                        key: "onMediaEnded",
                        value: function() {
                            p.logger.log("media ended"), this.startPosition = this.lastCurrentTime = 0
                        }
                    }, {
                        key: "onManifestLoading",
                        value: function() {
                            p.logger.log("trigger BUFFER_RESET"), this.hls.trigger(f.default.BUFFER_RESET), this._bufferedFrags = [], this.stalled = !1, this.startPosition = this.lastCurrentTime = 0
                        }
                    }, {
                        key: "onManifestParsed",
                        value: function(e) {
                            var t, r = !1,
                                a = !1;
                            e.levels.forEach(function(e) {
                                (t = e.audioCodec) && (-1 !== t.indexOf("mp4a.40.2") && (r = !0), -1 !== t.indexOf("mp4a.40.5") && (a = !0))
                            }), this.audioCodecSwitch = r && a, this.audioCodecSwitch && p.logger.log("both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"), this.levels = e.levels, this.startLevelLoaded = !1, this.startFragRequested = !1;
                            var i = this.config;
                            (i.autoStartLoad || this.forceStartLoad) && this.hls.startLoad(i.startPosition)
                        }
                    }, {
                        key: "onLevelLoaded",
                        value: function(e) {
                            var t = e.details,
                                r = e.level,
                                a = this.levels[r],
                                i = t.totalduration,
                                n = 0;
                            if (p.logger.log("level " + r + " loaded [" + t.startSN + "," + t.endSN + "],duration:" + i), this.levelLastLoaded = r, t.live) {
                                var s = a.details;
                                s && t.fragments.length > 0 ? (h.default.mergeDetails(s, t), n = t.fragments[0].start, this.liveSyncPosition = this.computeLivePosition(n, s), t.PTSKnown ? p.logger.log("live playlist sliding:" + n.toFixed(3)) : p.logger.log("live playlist - outdated PTS, unknown sliding")) : (t.PTSKnown = !1, p.logger.log("live playlist - first load, unknown sliding"))
                            } else t.PTSKnown = !1;
                            if (a.details = t, this.hls.trigger(f.default.LEVEL_UPDATED, {
                                    details: t,
                                    level: r
                                }), !1 === this.startFragRequested) {
                                if (-1 === this.startPosition || -1 === this.lastCurrentTime) {
                                    var o = t.startTimeOffset;
                                    isNaN(o) ? t.live ? (this.startPosition = this.computeLivePosition(n, t), p.logger.log("configure startPosition to " + this.startPosition)) : this.startPosition = 0 : (o < 0 && (p.logger.log("negative start time offset " + o + ", count from end of last fragment"), o = n + i + o), p.logger.log("start time offset found in playlist, adjust startPosition to " + o), this.startPosition = o), this.lastCurrentTime = this.startPosition
                                }
                                this.nextLoadPosition = this.startPosition
                            }
                            this.state === y.WAITING_LEVEL && (this.state = y.IDLE), this.tick()
                        }
                    }, {
                        key: "onKeyLoaded",
                        value: function() {
                            this.state === y.KEY_LOADING && (this.state = y.IDLE, this.tick())
                        }
                    }, {
                        key: "onFragLoaded",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            if (this.state === y.FRAG_LOADING && t && "main" === r.type && r.level === t.level && r.sn === t.sn) {
                                var a = e.stats,
                                    i = this.levels[t.level],
                                    n = i.details;
                                if (p.logger.log("Loaded  " + t.sn + " of [" + n.startSN + " ," + n.endSN + "],level " + t.level), this.bitrateTest = !1, this.stats = a, !0 === r.bitrateTest && this.hls.nextLoadLevel) this.state = y.IDLE, this.startFragRequested = !1, a.tparsed = a.tbuffered = performance.now(), this.hls.trigger(f.default.FRAG_BUFFERED, {
                                    stats: a,
                                    frag: t,
                                    id: "main"
                                }), this.tick();
                                else if ("initSegment" === r.sn) this.state = y.IDLE, a.tparsed = a.tbuffered = performance.now(), n.initSegment.data = e.payload, this.hls.trigger(f.default.FRAG_BUFFERED, {
                                    stats: a,
                                    frag: t,
                                    id: "main"
                                }), this.tick();
                                else {
                                    this.state = y.PARSING;
                                    var s = n.totalduration,
                                        o = t.level,
                                        l = t.sn,
                                        u = this.config.defaultAudioCodec || i.audioCodec;
                                    this.audioCodecSwap && (p.logger.log("swapping playlist audio codec"), void 0 === u && (u = this.lastAudioCodec), u && (u = -1 !== u.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5")), this.pendingBuffering = !0, this.appended = !1, p.logger.log("Parsing " + l + " of [" + n.startSN + " ," + n.endSN + "],level " + o + ", cc " + t.cc);
                                    var c = this.demuxer;
                                    c || (c = this.demuxer = new d.default(this.hls, "main"));
                                    var h = this.media,
                                        g = !(h && h.seeking) && (n.PTSKnown || !n.live),
                                        v = n.initSegment ? n.initSegment.data : [];
                                    c.push(e.payload, v, u, i.videoCodec, t, s, g, void 0)
                                }
                            }
                            this.fragLoadError = 0
                        }
                    }, {
                        key: "onFragParsingInitSegment",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            if (t && "main" === e.id && r.sn === t.sn && r.level === t.level && this.state === y.PARSING) {
                                var a, i, n = e.tracks;
                                if (n.audio && this.altAudio && delete n.audio, i = n.audio) {
                                    var s = this.levels[this.level].audioCodec,
                                        o = navigator.userAgent.toLowerCase();
                                    s && this.audioCodecSwap && (p.logger.log("swapping playlist audio codec"), s = -1 !== s.indexOf("mp4a.40.5") ? "mp4a.40.2" : "mp4a.40.5"), this.audioCodecSwitch && 1 !== i.metadata.channelCount && -1 === o.indexOf("firefox") && (s = "mp4a.40.5"), -1 !== o.indexOf("android") && "audio/mpeg" !== i.container && (s = "mp4a.40.2", p.logger.log("Android: force audio codec to " + s)), i.levelCodec = s, i.id = e.id
                                }(i = n.video) && (i.levelCodec = this.levels[this.level].videoCodec, i.id = e.id), this.hls.trigger(f.default.BUFFER_CODECS, n);
                                for (a in n) {
                                    i = n[a], p.logger.log("main track:" + a + ",container:" + i.container + ",codecs[level/parsed]=[" + i.levelCodec + "/" + i.codec + "]");
                                    var l = i.initSegment;
                                    l && (this.appended = !0, this.pendingBuffering = !0, this.hls.trigger(f.default.BUFFER_APPENDING, {
                                        type: a,
                                        data: l,
                                        parent: "main",
                                        content: "initSegment"
                                    }))
                                }
                                this.tick()
                            }
                        }
                    }, {
                        key: "onFragParsingData",
                        value: function(e) {
                            var t = this,
                                r = this.fragCurrent,
                                a = e.frag;
                            if (r && "main" === e.id && a.sn === r.sn && a.level === r.level && ("audio" !== e.type || !this.altAudio) && this.state === y.PARSING) {
                                var i = this.levels[this.level],
                                    n = r;
                                if (isNaN(e.endPTS) && (e.endPTS = e.startPTS + r.duration, e.endDTS = e.startDTS + r.duration), p.logger.log("Parsed " + e.type + ",PTS:[" + e.startPTS.toFixed(3) + "," + e.endPTS.toFixed(3) + "],DTS:[" + e.startDTS.toFixed(3) + "/" + e.endDTS.toFixed(3) + "],nb:" + e.nb + ",dropped:" + (e.dropped || 0)), "video" === e.type)
                                    if (n.dropped = e.dropped, n.dropped) {
                                        if (!n.backtracked) return p.logger.warn("missing video frame(s), backtracking fragment"), n.backtracked = !0, this.nextLoadPosition = e.startPTS, this.state = y.IDLE, this.fragPrevious = n, void this.tick();
                                        p.logger.warn("Already backtracked on this fragment, appending with the gap")
                                    } else n.backtracked = !1;
                                var s = h.default.updateFragPTSDTS(i.details, n, e.startPTS, e.endPTS, e.startDTS, e.endDTS),
                                    o = this.hls;
                                o.trigger(f.default.LEVEL_PTS_UPDATED, {
                                    details: i.details,
                                    level: this.level,
                                    drift: s,
                                    type: e.type,
                                    start: e.startPTS,
                                    end: e.endPTS
                                }), [e.data1, e.data2].forEach(function(r) {
                                    r && r.length && t.state === y.PARSING && (t.appended = !0, t.pendingBuffering = !0, o.trigger(f.default.BUFFER_APPENDING, {
                                        type: e.type,
                                        data: r,
                                        parent: "main",
                                        content: "data"
                                    }))
                                }), this.tick()
                            }
                        }
                    }, {
                        key: "onFragParsed",
                        value: function(e) {
                            var t = this.fragCurrent,
                                r = e.frag;
                            t && "main" === e.id && r.sn === t.sn && r.level === t.level && this.state === y.PARSING && (this.stats.tparsed = performance.now(), this.state = y.PARSED, this._checkAppendedParsed())
                        }
                    }, {
                        key: "onAudioTrackSwitching",
                        value: function(e) {
                            var t = !!e.url,
                                r = e.id;
                            if (!t) {
                                if (this.mediaBuffer !== this.media) {
                                    p.logger.log("switching on main audio, use media.buffered to schedule main fragment loading"), this.mediaBuffer = this.media;
                                    var a = this.fragCurrent;
                                    a.loader && (p.logger.log("switching to main audio track, cancel main fragment load"), a.loader.abort()), this.fragCurrent = null, this.fragPrevious = null, this.demuxer && (this.demuxer.destroy(), this.demuxer = null), this.state = y.IDLE
                                }
                                var i = this.hls;
                                i.trigger(f.default.BUFFER_FLUSHING, {
                                    startOffset: 0,
                                    endOffset: Number.POSITIVE_INFINITY,
                                    type: "audio"
                                }), i.trigger(f.default.AUDIO_TRACK_SWITCHED, {
                                    id: r
                                }), this.altAudio = !1
                            }
                        }
                    }, {
                        key: "onAudioTrackSwitched",
                        value: function(e) {
                            var t = e.id,
                                r = !!this.hls.audioTracks[t].url;
                            if (r) {
                                var a = this.videoBuffer;
                                a && this.mediaBuffer !== a && (p.logger.log("switching on alternate audio, use video.buffered to schedule main fragment loading"), this.mediaBuffer = a)
                            }
                            this.altAudio = r, this.tick()
                        }
                    }, {
                        key: "onBufferCreated",
                        value: function(e) {
                            var t = e.tracks,
                                r = void 0,
                                a = void 0,
                                i = !1;
                            for (var n in t) {
                                var s = t[n];
                                "main" === s.id ? (a = n, r = s, "video" === n && (this.videoBuffer = t[n].buffer)) : i = !0
                            }
                            i && r ? (p.logger.log("alternate track found, use " + a + ".buffered to schedule main fragment loading"), this.mediaBuffer = r.buffer) : this.mediaBuffer = this.media
                        }
                    }, {
                        key: "onBufferAppended",
                        value: function(e) {
                            if ("main" === e.parent) {
                                var t = this.state;
                                t !== y.PARSING && t !== y.PARSED || (this.pendingBuffering = e.pending > 0, this._checkAppendedParsed())
                            }
                        }
                    }, {
                        key: "_checkAppendedParsed",
                        value: function() {
                            if (!(this.state !== y.PARSED || this.appended && this.pendingBuffering)) {
                                var e = this.fragCurrent;
                                if (e) {
                                    var t = this.mediaBuffer ? this.mediaBuffer : this.media;
                                    p.logger.log("main buffered : " + g.default.toString(t.buffered));
                                    var r = this._bufferedFrags.filter(function(e) {
                                        return u.default.isBuffered(t, (e.startPTS + e.endPTS) / 2)
                                    });
                                    r.push(e), this._bufferedFrags = r.sort(function(e, t) {
                                        return e.startPTS - t.startPTS
                                    }), this.fragPrevious = e;
                                    var a = this.stats;
                                    a.tbuffered = performance.now(), this.fragLastKbps = Math.round(8 * a.total / (a.tbuffered - a.tfirst)), this.hls.trigger(f.default.FRAG_BUFFERED, {
                                        stats: a,
                                        frag: e,
                                        id: "main"
                                    }), this.state = y.IDLE
                                }
                                this.tick()
                            }
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            var t = e.frag || this.fragCurrent;
                            if (!t || "main" === t.type) {
                                var r = this.media,
                                    a = r && u.default.isBuffered(r, r.currentTime) && u.default.isBuffered(r, r.currentTime + .5);
                                switch (e.details) {
                                    case v.ErrorDetails.FRAG_LOAD_ERROR:
                                    case v.ErrorDetails.FRAG_LOAD_TIMEOUT:
                                    case v.ErrorDetails.KEY_LOAD_ERROR:
                                    case v.ErrorDetails.KEY_LOAD_TIMEOUT:
                                        if (!e.fatal) {
                                            var i = this.fragLoadError;
                                            i ? i++ : i = 1;
                                            var n = this.config;
                                            if (i <= n.fragLoadingMaxRetry || a || t.autoLevel && t.level) {
                                                this.fragLoadError = i, t.loadCounter = 0;
                                                var s = Math.min(Math.pow(2, i - 1) * n.fragLoadingRetryDelay, n.fragLoadingMaxRetryTimeout);
                                                p.logger.warn("mediaController: frag loading failed, retry in " + s + " ms"), this.retryDate = performance.now() + s, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.state = y.FRAG_LOADING_WAITING_RETRY
                                            } else p.logger.error("mediaController: " + e.details + " reaches max retry, redispatch as fatal ..."), e.fatal = !0, this.state = y.ERROR
                                        }
                                        break;
                                    case v.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                                        e.fatal || (a ? (this._reduceMaxBufferLength(t.duration), this.state = y.IDLE) : t.autoLevel && 0 !== t.level || (e.fatal = !0, this.state = y.ERROR));
                                        break;
                                    case v.ErrorDetails.LEVEL_LOAD_ERROR:
                                    case v.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                                        this.state !== y.ERROR && (e.fatal ? (this.state = y.ERROR, p.logger.warn("streamController: " + e.details + ",switch to " + this.state + " state ...")) : e.levelRetry || this.state !== y.WAITING_LEVEL || (this.state = y.IDLE));
                                        break;
                                    case v.ErrorDetails.BUFFER_FULL_ERROR:
                                        "main" !== e.parent || this.state !== y.PARSING && this.state !== y.PARSED || (a ? (this._reduceMaxBufferLength(this.config.maxBufferLength), this.state = y.IDLE) : (p.logger.warn("buffer full error also media.currentTime is not buffered, flush everything"), this.fragCurrent = null, this.flushMainBuffer(0, Number.POSITIVE_INFINITY)))
                                }
                            }
                        }
                    }, {
                        key: "_reduceMaxBufferLength",
                        value: function(e) {
                            var t = this.config;
                            t.maxMaxBufferLength >= e && (t.maxMaxBufferLength /= 2, p.logger.warn("main:reduce max buffer length to " + t.maxMaxBufferLength + "s"), this.fragLoadIdx += 2 * t.fragLoadingLoopThreshold)
                        }
                    }, {
                        key: "_checkBuffer",
                        value: function() {
                            var e = this.media,
                                t = this.config;
                            if (e && e.readyState) {
                                var r = e.currentTime,
                                    a = this.mediaBuffer ? this.mediaBuffer : e,
                                    i = a.buffered;
                                if (!this.loadedmetadata && i.length) {
                                    this.loadedmetadata = !0;
                                    var n = e.seeking ? r : this.startPosition,
                                        s = u.default.isBuffered(a, n),
                                        o = i.start(0);
                                    (r !== n || !s && Math.abs(n - o) < t.maxSeekHole) && (p.logger.log("target start position:" + n), s || (n = o, p.logger.log("target start position not buffered, seek to buffered.start(0) " + n)), p.logger.log("adjust currentTime from " + r + " to " + n), e.currentTime = n)
                                } else if (this.immediateSwitch) this.immediateLevelSwitchEnd();
                                else {
                                    var l = u.default.bufferInfo(e, r, 0),
                                        d = !(e.paused || e.ended || 0 === e.buffered.length);
                                    if (r !== this.lastCurrentTime) this.stallReported && (p.logger.warn("playback not stuck anymore @" + r + ", after " + Math.round(performance.now() - this.stalled) + "ms"), this.stallReported = !1), this.stalled = void 0, this.nudgeRetry = 0;
                                    else if (d) {
                                        var c = performance.now(),
                                            h = this.hls;
                                        if (this.stalled) {
                                            var g = c - this.stalled,
                                                y = l.len,
                                                m = this.nudgeRetry || 0;
                                            if (y <= .5 && g > 1e3 * t.lowBufferWatchdogPeriod) {
                                                this.stallReported || (this.stallReported = !0, p.logger.warn("playback stalling in low buffer @" + r), h.trigger(f.default.ERROR, {
                                                    type: v.ErrorTypes.MEDIA_ERROR,
                                                    details: v.ErrorDetails.BUFFER_STALLED_ERROR,
                                                    fatal: !1,
                                                    buffer: y
                                                }));
                                                var E = l.nextStart,
                                                    b = E - r;
                                                if (E && b < t.maxSeekHole && b > 0) {
                                                    this.nudgeRetry = ++m;
                                                    var T = m * t.nudgeOffset;
                                                    p.logger.log("adjust currentTime from " + e.currentTime + " to next buffered @ " + E + " + nudge " + T), e.currentTime = E + T, this.stalled = void 0, h.trigger(f.default.ERROR, {
                                                        type: v.ErrorTypes.MEDIA_ERROR,
                                                        details: v.ErrorDetails.BUFFER_SEEK_OVER_HOLE,
                                                        fatal: !1,
                                                        hole: E + T - r
                                                    })
                                                }
                                            } else if (y > .5 && g > 1e3 * t.highBufferWatchdogPeriod)
                                                if (this.stallReported || (this.stallReported = !0, p.logger.warn("playback stalling in high buffer @" + r), h.trigger(f.default.ERROR, {
                                                        type: v.ErrorTypes.MEDIA_ERROR,
                                                        details: v.ErrorDetails.BUFFER_STALLED_ERROR,
                                                        fatal: !1,
                                                        buffer: y
                                                    })), this.stalled = void 0, this.nudgeRetry = ++m, m < t.nudgeMaxRetry) {
                                                    var k = e.currentTime,
                                                        _ = k + m * t.nudgeOffset;
                                                    p.logger.log("adjust currentTime from " + k + " to " + _), e.currentTime = _, h.trigger(f.default.ERROR, {
                                                        type: v.ErrorTypes.MEDIA_ERROR,
                                                        details: v.ErrorDetails.BUFFER_NUDGE_ON_STALL,
                                                        fatal: !1
                                                    })
                                                } else p.logger.error("still stuck in high buffer @" + r + " after " + t.nudgeMaxRetry + ", raise fatal error"), h.trigger(f.default.ERROR, {
                                                    type: v.ErrorTypes.MEDIA_ERROR,
                                                    details: v.ErrorDetails.BUFFER_STALLED_ERROR,
                                                    fatal: !0
                                                })
                                        } else this.stalled = c, this.stallReported = !1
                                    }
                                }
                            }
                        }
                    }, {
                        key: "onFragLoadEmergencyAborted",
                        value: function() {
                            this.state = y.IDLE, this.loadedmetadata || (this.startFragRequested = !1, this.nextLoadPosition = this.startPosition), this.tick()
                        }
                    }, {
                        key: "onBufferFlushed",
                        value: function() {
                            var e = this.mediaBuffer ? this.mediaBuffer : this.media;
                            this._bufferedFrags = this._bufferedFrags.filter(function(t) {
                                return u.default.isBuffered(e, (t.startPTS + t.endPTS) / 2)
                            }), this.fragLoadIdx += 2 * this.config.fragLoadingLoopThreshold, this.state = y.IDLE, this.fragPrevious = null
                        }
                    }, {
                        key: "swapAudioCodec",
                        value: function() {
                            this.audioCodecSwap = !this.audioCodecSwap
                        }
                    }, {
                        key: "computeLivePosition",
                        value: function(e, t) {
                            var r = void 0 !== this.config.liveSyncDuration ? this.config.liveSyncDuration : this.config.liveSyncDurationCount * t.targetduration;
                            return e + Math.max(0, t.totalduration - r)
                        }
                    }, {
                        key: "state",
                        set: function(e) {
                            if (this.state !== e) {
                                var t = this.state;
                                this._state = e, p.logger.log("main stream:" + t + "->" + e), this.hls.trigger(f.default.STREAM_STATE_TRANSITION, {
                                    previousState: t,
                                    nextState: e
                                })
                            }
                        },
                        get: function() {
                            return this._state
                        }
                    }, {
                        key: "currentLevel",
                        get: function() {
                            var e = this.media;
                            if (e) {
                                var t = this.getBufferedFrag(e.currentTime);
                                if (t) return t.level
                            }
                            return -1
                        }
                    }, {
                        key: "nextBufferedFrag",
                        get: function() {
                            var e = this.media;
                            return e ? this.followingBufferedFrag(this.getBufferedFrag(e.currentTime)) : null
                        }
                    }, {
                        key: "nextLevel",
                        get: function() {
                            var e = this.nextBufferedFrag;
                            return e ? e.level : -1
                        }
                    }, {
                        key: "liveSyncPosition",
                        get: function() {
                            return this._liveSyncPosition
                        },
                        set: function(e) {
                            this._liveSyncPosition = e
                        }
                    }]), t
                }(c.default);
            r.default = m
        }, {
            25: 25,
            33: 33,
            34: 34,
            35: 35,
            37: 37,
            38: 38,
            48: 48,
            54: 54,
            55: 55
        }],
        14: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(54),
                f = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.ERROR, l.default.SUBTITLE_TRACKS_UPDATED, l.default.SUBTITLE_TRACK_SWITCH, l.default.SUBTITLE_TRACK_LOADED, l.default.SUBTITLE_FRAG_PROCESSED));
                        return r.config = e.config, r.vttFragSNsProcessed = {}, r.vttFragQueues = void 0, r.currentlyProcessing = null, r.currentTrackId = -1, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "clearVttFragQueues",
                        value: function() {
                            var e = this;
                            this.vttFragQueues = {}, this.tracks.forEach(function(t) {
                                e.vttFragQueues[t.id] = []
                            })
                        }
                    }, {
                        key: "nextFrag",
                        value: function() {
                            if (null === this.currentlyProcessing && this.currentTrackId > -1 && this.vttFragQueues[this.currentTrackId].length) {
                                var e = this.currentlyProcessing = this.vttFragQueues[this.currentTrackId].shift();
                                this.hls.trigger(l.default.FRAG_LOADING, {
                                    frag: e
                                })
                            }
                        }
                    }, {
                        key: "onSubtitleFragProcessed",
                        value: function(e) {
                            e.success && this.vttFragSNsProcessed[e.frag.trackId].push(e.frag.sn), this.currentlyProcessing = null, this.nextFrag()
                        }
                    }, {
                        key: "onError",
                        value: function(e) {
                            var t = e.frag;
                            t && "subtitle" !== t.type || this.currentlyProcessing && (this.currentlyProcessing = null, this.nextFrag())
                        }
                    }, {
                        key: "onSubtitleTracksUpdated",
                        value: function(e) {
                            var t = this;
                            d.logger.log("subtitle tracks updated"), this.tracks = e.subtitleTracks, this.clearVttFragQueues(), this.vttFragSNsProcessed = {}, this.tracks.forEach(function(e) {
                                t.vttFragSNsProcessed[e.id] = []
                            })
                        }
                    }, {
                        key: "onSubtitleTrackSwitch",
                        value: function(e) {
                            this.currentTrackId = e.id, this.clearVttFragQueues()
                        }
                    }, {
                        key: "onSubtitleTrackLoaded",
                        value: function(e) {
                            var t = this.vttFragSNsProcessed[e.id],
                                r = this.vttFragQueues[e.id],
                                a = this.currentlyProcessing ? this.currentlyProcessing.sn : -1,
                                i = function(e) {
                                    return t.indexOf(e.sn) > -1
                                },
                                n = function(e) {
                                    return r.some(function(t) {
                                        return t.sn === e.sn
                                    })
                                };
                            e.details.fragments.forEach(function(t) {
                                i(t) || t.sn === a || n(t) || (t.trackId = e.id, r.push(t))
                            }), this.nextFrag()
                        }
                    }]), t
                }(u.default);
            r.default = f
        }, {
            34: 34,
            35: 35,
            54: 54
        }],
        15: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function o(e) {
                for (var t = [], r = 0; r < e.length; r++) "subtitles" === e[r].kind && t.push(e[r]);
                return t
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var l = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                u = a(e(35)),
                d = a(e(34)),
                f = e(54),
                c = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, u.default.MEDIA_ATTACHED, u.default.MEDIA_DETACHING, u.default.MANIFEST_LOADING, u.default.MANIFEST_LOADED, u.default.SUBTITLE_TRACK_LOADED));
                        return r.tracks = [], r.trackId = -1, r.media = void 0, r
                    }
                    return s(t, e), l(t, [{
                        key: "_onTextTracksChanged",
                        value: function() {
                            if (this.media) {
                                for (var e = -1, t = o(this.media.textTracks), r = 0; r < t.length; r++) "showing" === t[r].mode && (e = r);
                                this.subtitleTrack = e
                            }
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            d.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onMediaAttached",
                        value: function(e) {
                            this.media = e.media, this.media && (this.trackChangeListener = this._onTextTracksChanged.bind(this), this.media.textTracks.addEventListener("change", this.trackChangeListener))
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            this.media && (this.media.textTracks.removeEventListener("change", this.trackChangeListener), this.media = void 0)
                        }
                    }, {
                        key: "onManifestLoading",
                        value: function() {
                            this.tracks = [], this.trackId = -1
                        }
                    }, {
                        key: "onManifestLoaded",
                        value: function(e) {
                            var t = this,
                                r = e.subtitles || [],
                                a = !1;
                            this.tracks = r, this.trackId = -1, this.hls.trigger(u.default.SUBTITLE_TRACKS_UPDATED, {
                                subtitleTracks: r
                            }), r.forEach(function(e) {
                                e.default && (t.subtitleTrack = e.id, a = !0)
                            })
                        }
                    }, {
                        key: "onTick",
                        value: function() {
                            var e = this.trackId,
                                t = this.tracks[e];
                            if (t) {
                                var r = t.details;
                                void 0 !== r && !0 !== r.live || (f.logger.log("(re)loading playlist for subtitle track " + e), this.hls.trigger(u.default.SUBTITLE_TRACK_LOADING, {
                                    url: t.url,
                                    id: e
                                }))
                            }
                        }
                    }, {
                        key: "onSubtitleTrackLoaded",
                        value: function(e) {
                            var t = this;
                            e.id < this.tracks.length && (f.logger.log("subtitle track " + e.id + " loaded"), this.tracks[e.id].details = e.details, e.details.live && !this.timer && (this.timer = setInterval(function() {
                                t.onTick()
                            }, 1e3 * e.details.targetduration, this)), !e.details.live && this.timer && (clearInterval(this.timer), this.timer = null))
                        }
                    }, {
                        key: "setSubtitleTrackInternal",
                        value: function(e) {
                            if (e >= 0 && e < this.tracks.length) {
                                this.timer && (clearInterval(this.timer), this.timer = null), this.trackId = e, f.logger.log("switching to subtitle track " + e);
                                var t = this.tracks[e];
                                this.hls.trigger(u.default.SUBTITLE_TRACK_SWITCH, {
                                    id: e
                                });
                                var r = t.details;
                                void 0 !== r && !0 !== r.live || (f.logger.log("(re)loading playlist for subtitle track " + e), this.hls.trigger(u.default.SUBTITLE_TRACK_LOADING, {
                                    url: t.url,
                                    id: e
                                }))
                            }
                        }
                    }, {
                        key: "subtitleTracks",
                        get: function() {
                            return this.tracks
                        }
                    }, {
                        key: "subtitleTrack",
                        get: function() {
                            return this.trackId
                        },
                        set: function(e) {
                            this.trackId !== e && this.setSubtitleTrackInternal(e)
                        }
                    }]), t
                }(d.default);
            r.default = c
        }, {
            34: 34,
            35: 35,
            54: 54
        }],
        16: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function o(e) {
                if (e && e.cues)
                    for (; e.cues.length > 0;) e.removeCue(e.cues[0])
            }

            function l(e, t) {
                return e && e.label === t.name && !(e.textTrack1 || e.textTrack2)
            }

            function u(e, t, r, a) {
                return Math.min(t, a) - Math.max(e, r)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var d = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                f = a(e(35)),
                c = a(e(34)),
                h = a(e(49)),
                g = a(e(58)),
                v = e(54),
                p = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, f.default.MEDIA_ATTACHING, f.default.MEDIA_DETACHING, f.default.FRAG_PARSING_USERDATA, f.default.MANIFEST_LOADING, f.default.MANIFEST_LOADED, f.default.FRAG_LOADED, f.default.LEVEL_SWITCHING, f.default.INIT_PTS_FOUND));
                        if (r.hls = e, r.config = e.config, r.enabled = !0, r.Cues = e.config.cueHandler, r.textTracks = [], r.tracks = [], r.unparsedVttFrags = [], r.initPTS = void 0, r.cueRanges = [], r.config.enableCEA708Captions) {
                            var a = r,
                                s = function(e, t) {
                                    var r = null;
                                    try {
                                        r = new window.Event("addtrack")
                                    } catch (e) {
                                        (r = document.createEvent("Event")).initEvent("addtrack", !1, !1)
                                    }
                                    r.track = e, t.dispatchEvent(r)
                                },
                                l = {
                                    newCue: function(e, t, r) {
                                        if (!a.textTrack1) {
                                            var i = a.getExistingTrack("1");
                                            if (i) a.textTrack1 = i, o(a.textTrack1), s(a.textTrack1, a.media);
                                            else {
                                                var n = a.createTextTrack("captions", a.config.captionsTextTrack1Label, a.config.captionsTextTrack1LanguageCode);
                                                n && (n.textTrack1 = !0, a.textTrack1 = n)
                                            }
                                        }
                                        a.addCues("textTrack1", e, t, r)
                                    }
                                },
                                u = {
                                    newCue: function(e, t, r) {
                                        if (!a.textTrack2) {
                                            var i = a.getExistingTrack("2");
                                            if (i) a.textTrack2 = i, o(a.textTrack2), s(a.textTrack2, a.media);
                                            else {
                                                var n = a.createTextTrack("captions", a.config.captionsTextTrack2Label, a.config.captionsTextTrack1LanguageCode);
                                                n && (n.textTrack2 = !0, a.textTrack2 = n)
                                            }
                                        }
                                        a.addCues("textTrack2", e, t, r)
                                    }
                                };
                            r.cea608Parser = new h.default(0, l, u)
                        }
                        return r
                    }
                    return s(t, e), d(t, [{
                        key: "addCues",
                        value: function(e, t, r, a) {
                            for (var i = this.cueRanges, n = !1, s = i.length; s--;) {
                                var o = i[s],
                                    l = u(o[0], o[1], t, r);
                                if (l >= 0 && (o[0] = Math.min(o[0], t), o[1] = Math.max(o[1], r), n = !0, l / (r - t) > .5)) return
                            }
                            n || i.push([t, r]), this.Cues.newCue(this[e], t, r, a)
                        }
                    }, {
                        key: "onInitPtsFound",
                        value: function(e) {
                            var t = this;
                            void 0 === this.initPTS && (this.initPTS = e.initPTS), this.unparsedVttFrags.length && (this.unparsedVttFrags.forEach(function(e) {
                                t.onFragLoaded(e)
                            }), this.unparsedVttFrags = [])
                        }
                    }, {
                        key: "getExistingTrack",
                        value: function(e) {
                            var t = this.media;
                            if (t)
                                for (var r = 0; r < t.textTracks.length; r++) {
                                    var a = t.textTracks[r];
                                    if (!0 === a["textTrack" + e]) return a
                                }
                            return null
                        }
                    }, {
                        key: "createTextTrack",
                        value: function(e, t, r) {
                            var a = this.media;
                            if (a) return a.addTextTrack(e, t, r)
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            c.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onMediaAttaching",
                        value: function(e) {
                            this.media = e.media
                        }
                    }, {
                        key: "onMediaDetaching",
                        value: function() {
                            o(this.textTrack1), o(this.textTrack2)
                        }
                    }, {
                        key: "onManifestLoading",
                        value: function() {
                            this.lastSn = -1, this.prevCC = -1, this.vttCCs = {
                                ccOffset: 0,
                                presentationOffset: 0
                            };
                            var e = this.media;
                            if (e) {
                                var t = e.textTracks;
                                if (t)
                                    for (var r = 0; r < t.length; r++) o(t[r])
                            }
                        }
                    }, {
                        key: "onManifestLoaded",
                        value: function(e) {
                            var t = this;
                            if (this.textTracks = [], this.unparsedVttFrags = this.unparsedVttFrags || [], this.initPTS = void 0, this.cueRanges = [], this.config.enableWebVTT) {
                                this.tracks = e.subtitles || [];
                                var r = this.media ? this.media.textTracks : [];
                                this.tracks.forEach(function(e, a) {
                                    var i = void 0;
                                    if (a < r.length) {
                                        var n = r[a];
                                        l(n, e) && (i = n)
                                    }
                                    i || (i = t.createTextTrack("subtitles", e.name, e.lang)), i.mode = e.default ? "showing" : "hidden", t.textTracks.push(i)
                                })
                            }
                        }
                    }, {
                        key: "onLevelSwitching",
                        value: function() {
                            this.enabled = "NONE" !== this.hls.currentLevel.closedCaptions
                        }
                    }, {
                        key: "onFragLoaded",
                        value: function(e) {
                            var t = e.frag,
                                r = e.payload;
                            if ("main" === t.type) {
                                var a = t.sn;
                                if (a !== this.lastSn + 1) {
                                    var i = this.cea608Parser;
                                    i && i.reset()
                                }
                                this.lastSn = a
                            } else if ("subtitle" === t.type)
                                if (r.byteLength) {
                                    if (void 0 === this.initPTS) return void this.unparsedVttFrags.push(e);
                                    var n = this.vttCCs;
                                    n[t.cc] || (n[t.cc] = {
                                        start: t.start,
                                        prevCC: this.prevCC,
                                        new: !0
                                    }, this.prevCC = t.cc);
                                    var s = this.textTracks,
                                        o = this.hls;
                                    g.default.parse(r, this.initPTS, n, t.cc, function(e) {
                                        var r = s[t.trackId];
                                        e.forEach(function(e) {
                                            if (!r.cues.getCueById(e.id)) try {
                                                r.addCue(e)
                                            } catch (a) {
                                                var t = new window.TextTrackCue(e.startTime, e.endTime, e.text);
                                                t.id = e.id, r.addCue(t)
                                            }
                                        }), o.trigger(f.default.SUBTITLE_FRAG_PROCESSED, {
                                            success: !0,
                                            frag: t
                                        })
                                    }, function(e) {
                                        v.logger.log("Failed to parse VTT cue: " + e), o.trigger(f.default.SUBTITLE_FRAG_PROCESSED, {
                                            success: !1,
                                            frag: t
                                        })
                                    })
                                } else this.hls.trigger(f.default.SUBTITLE_FRAG_PROCESSED, {
                                    success: !1,
                                    frag: t
                                })
                        }
                    }, {
                        key: "onFragParsingUserdata",
                        value: function(e) {
                            if (this.enabled && this.config.enableCEA708Captions)
                                for (var t = 0; t < e.samples.length; t++) {
                                    var r = this.extractCea608Data(e.samples[t].bytes);
                                    this.cea608Parser.addData(e.samples[t].pts, r)
                                }
                        }
                    }, {
                        key: "extractCea608Data",
                        value: function(e) {
                            for (var t, r, a, i, n, s = 31 & e[0], o = 2, l = [], u = 0; u < s; u++) t = e[o++], r = 127 & e[o++], a = 127 & e[o++], i = 0 != (4 & t), n = 3 & t, 0 === r && 0 === a || i && 0 === n && (l.push(r), l.push(a));
                            return l
                        }
                    }]), t
                }(c.default);
            r.default = p
        }, {
            34: 34,
            35: 35,
            49: 49,
            54: 54,
            58: 58
        }],
        17: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e(t, r) {
                        a(this, e), this.subtle = t, this.aesIV = r
                    }
                    return i(e, [{
                        key: "decrypt",
                        value: function(e, t) {
                            return this.subtle.decrypt({
                                name: "AES-CBC",
                                iv: this.aesIV
                            }, t, e)
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        18: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e() {
                        a(this, e), this.rcon = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], this.subMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.invSubMix = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)], this.sBox = new Uint32Array(256), this.invSBox = new Uint32Array(256), this.key = new Uint32Array(0), this.initTable()
                    }
                    return i(e, [{
                        key: "uint8ArrayToUint32Array_",
                        value: function(e) {
                            for (var t = new DataView(e), r = new Uint32Array(4), a = 0; a < 4; a++) r[a] = t.getUint32(4 * a);
                            return r
                        }
                    }, {
                        key: "initTable",
                        value: function() {
                            var e = this.sBox,
                                t = this.invSBox,
                                r = this.subMix,
                                a = r[0],
                                i = r[1],
                                n = r[2],
                                s = r[3],
                                o = this.invSubMix,
                                l = o[0],
                                u = o[1],
                                d = o[2],
                                f = o[3],
                                c = new Uint32Array(256),
                                h = 0,
                                g = 0,
                                v = 0;
                            for (v = 0; v < 256; v++) c[v] = v < 128 ? v << 1 : v << 1 ^ 283;
                            for (v = 0; v < 256; v++) {
                                var p = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4;
                                p = p >>> 8 ^ 255 & p ^ 99, e[h] = p, t[p] = h;
                                var y = c[h],
                                    m = c[y],
                                    E = c[m],
                                    b = 257 * c[p] ^ 16843008 * p;
                                a[h] = b << 24 | b >>> 8, i[h] = b << 16 | b >>> 16, n[h] = b << 8 | b >>> 24, s[h] = b, b = 16843009 * E ^ 65537 * m ^ 257 * y ^ 16843008 * h, l[p] = b << 24 | b >>> 8, u[p] = b << 16 | b >>> 16, d[p] = b << 8 | b >>> 24, f[p] = b, h ? (h = y ^ c[c[c[E ^ y]]], g ^= c[c[g]]) : h = g = 1
                            }
                        }
                    }, {
                        key: "expandKey",
                        value: function(e) {
                            for (var t = this.uint8ArrayToUint32Array_(e), r = !0, a = 0; a < t.length && r;) r = t[a] === this.key[a], a++;
                            if (!r) {
                                this.key = t;
                                var i = this.keySize = t.length;
                                if (4 !== i && 6 !== i && 8 !== i) throw new Error("Invalid aes key size=" + i);
                                var n = this.ksRows = 4 * (i + 6 + 1),
                                    s = void 0,
                                    o = void 0,
                                    l = this.keySchedule = new Uint32Array(n),
                                    u = this.invKeySchedule = new Uint32Array(n),
                                    d = this.sBox,
                                    f = this.rcon,
                                    c = this.invSubMix,
                                    h = c[0],
                                    g = c[1],
                                    v = c[2],
                                    p = c[3],
                                    y = void 0,
                                    m = void 0;
                                for (s = 0; s < n; s++) s < i ? y = l[s] = t[s] : (m = y, s % i == 0 ? (m = d[(m = m << 8 | m >>> 24) >>> 24] << 24 | d[m >>> 16 & 255] << 16 | d[m >>> 8 & 255] << 8 | d[255 & m], m ^= f[s / i | 0] << 24) : i > 6 && s % i == 4 && (m = d[m >>> 24] << 24 | d[m >>> 16 & 255] << 16 | d[m >>> 8 & 255] << 8 | d[255 & m]), l[s] = y = (l[s - i] ^ m) >>> 0);
                                for (o = 0; o < n; o++) s = n - o, m = 3 & o ? l[s] : l[s - 4], u[o] = o < 4 || s <= 4 ? m : h[d[m >>> 24]] ^ g[d[m >>> 16 & 255]] ^ v[d[m >>> 8 & 255]] ^ p[d[255 & m]], u[o] = u[o] >>> 0
                            }
                        }
                    }, {
                        key: "networkToHostOrderSwap",
                        value: function(e) {
                            return e << 24 | (65280 & e) << 8 | (16711680 & e) >> 8 | e >>> 24
                        }
                    }, {
                        key: "decrypt",
                        value: function(e, t, r) {
                            for (var a, i, n = this.keySize + 6, s = this.invKeySchedule, o = this.invSBox, l = this.invSubMix, u = l[0], d = l[1], f = l[2], c = l[3], h = this.uint8ArrayToUint32Array_(r), g = h[0], v = h[1], p = h[2], y = h[3], m = new Int32Array(e), E = new Int32Array(m.length), b = void 0, T = void 0, k = void 0, _ = void 0, R = void 0, S = void 0, A = void 0, L = void 0, w = void 0, D = void 0, O = void 0, I = void 0, P = this.networkToHostOrderSwap; t < m.length;) {
                                for (w = P(m[t]), D = P(m[t + 1]), O = P(m[t + 2]), I = P(m[t + 3]), R = w ^ s[0], S = I ^ s[1], A = O ^ s[2], L = D ^ s[3], a = 4, i = 1; i < n; i++) b = u[R >>> 24] ^ d[S >> 16 & 255] ^ f[A >> 8 & 255] ^ c[255 & L] ^ s[a], T = u[S >>> 24] ^ d[A >> 16 & 255] ^ f[L >> 8 & 255] ^ c[255 & R] ^ s[a + 1], k = u[A >>> 24] ^ d[L >> 16 & 255] ^ f[R >> 8 & 255] ^ c[255 & S] ^ s[a + 2], _ = u[L >>> 24] ^ d[R >> 16 & 255] ^ f[S >> 8 & 255] ^ c[255 & A] ^ s[a + 3], R = b, S = T, A = k, L = _, a += 4;
                                b = o[R >>> 24] << 24 ^ o[S >> 16 & 255] << 16 ^ o[A >> 8 & 255] << 8 ^ o[255 & L] ^ s[a], T = o[S >>> 24] << 24 ^ o[A >> 16 & 255] << 16 ^ o[L >> 8 & 255] << 8 ^ o[255 & R] ^ s[a + 1], k = o[A >>> 24] << 24 ^ o[L >> 16 & 255] << 16 ^ o[R >> 8 & 255] << 8 ^ o[255 & S] ^ s[a + 2], _ = o[L >>> 24] << 24 ^ o[R >> 16 & 255] << 16 ^ o[S >> 8 & 255] << 8 ^ o[255 & A] ^ s[a + 3], a += 3, E[t] = P(b ^ g), E[t + 1] = P(_ ^ v), E[t + 2] = P(k ^ p), E[t + 3] = P(T ^ y), g = w, v = D, p = O, y = I, t += 4
                            }
                            return E.buffer
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            this.key = void 0, this.keySize = void 0, this.ksRows = void 0, this.sBox = void 0, this.invSBox = void 0, this.subMix = void 0, this.invSubMix = void 0, this.keySchedule = void 0, this.invKeySchedule = void 0, this.rcon = void 0
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        19: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(17)),
                o = a(e(20)),
                l = a(e(18)),
                u = e(33),
                d = e(54),
                f = function() {
                    function e(t, r) {
                        i(this, e), this.observer = t, this.config = r, this.logEnabled = !0;
                        try {
                            var a = crypto || self.crypto;
                            this.subtle = a.subtle || a.webkitSubtle
                        } catch (e) {}
                        this.disableWebCrypto = !this.subtle
                    }
                    return n(e, [{
                        key: "isSync",
                        value: function() {
                            return this.disableWebCrypto && this.config.enableSoftwareAES
                        }
                    }, {
                        key: "decrypt",
                        value: function(e, t, r, a) {
                            var i = this;
                            if (this.disableWebCrypto && this.config.enableSoftwareAES) {
                                this.logEnabled && (d.logger.log("JS AES decrypt"), this.logEnabled = !1);
                                var n = this.decryptor;
                                n || (this.decryptor = n = new l.default), n.expandKey(t), a(n.decrypt(e, 0, r))
                            } else {
                                this.logEnabled && (d.logger.log("WebCrypto AES decrypt"), this.logEnabled = !1);
                                var u = this.subtle;
                                this.key !== t && (this.key = t, this.fastAesKey = new o.default(u, t)), this.fastAesKey.expandKey().then(function(n) {
                                    new s.default(u, r).decrypt(e, n).catch(function(n) {
                                        i.onWebCryptoError(n, e, t, r, a)
                                    }).then(function(e) {
                                        a(e)
                                    })
                                }).catch(function(n) {
                                    i.onWebCryptoError(n, e, t, r, a)
                                })
                            }
                        }
                    }, {
                        key: "onWebCryptoError",
                        value: function(e, t, r, a, i) {
                            this.config.enableSoftwareAES ? (d.logger.log("WebCrypto Error, disable WebCrypto API"), this.disableWebCrypto = !0, this.logEnabled = !0, this.decrypt(t, r, a, i)) : (d.logger.error("decrypting error : " + e.message), this.observer.trigger(Event.ERROR, {
                                type: u.ErrorTypes.MEDIA_ERROR,
                                details: u.ErrorDetails.FRAG_DECRYPT_ERROR,
                                fatal: !0,
                                reason: e.message
                            }))
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            var e = this.decryptor;
                            e && (e.destroy(), this.decryptor = void 0)
                        }
                    }]), e
                }();
            r.default = f
        }, {
            17: 17,
            18: 18,
            20: 20,
            33: 33,
            54: 54
        }],
        20: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e(t, r) {
                        a(this, e), this.subtle = t, this.key = r
                    }
                    return i(e, [{
                        key: "expandKey",
                        value: function() {
                            return this.subtle.importKey("raw", this.key, {
                                name: "AES-CBC"
                            }, !1, ["encrypt", "decrypt"])
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        21: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(22)),
                o = e(54),
                l = a(e(27)),
                u = function() {
                    function e(t, r, a) {
                        i(this, e), this.observer = t, this.config = a, this.remuxer = r
                    }
                    return n(e, [{
                        key: "resetInitSegment",
                        value: function(e, t, r, a) {
                            this._audioTrack = {
                                container: "audio/adts",
                                type: "audio",
                                id: -1,
                                sequenceNumber: 0,
                                isAAC: !0,
                                samples: [],
                                len: 0,
                                manifestCodec: t,
                                duration: a,
                                inputTimeScale: 9e4
                            }
                        }
                    }, {
                        key: "resetTimeStamp",
                        value: function() {}
                    }, {
                        key: "append",
                        value: function(e, t, r, a) {
                            for (var i = this._audioTrack, n = l.default.getID3Data(e, 0), u = 90 * l.default.getTimeStamp(n), d = 0, f = u, c = e.length, h = n.length, g = [{
                                    pts: f,
                                    dts: f,
                                    data: n
                                }]; h < c - 1;)
                                if (s.default.isHeader(e, h) && h + 5 < c) {
                                    s.default.initTrackConfig(i, this.observer, e, h, i.manifestCodec);
                                    var v = s.default.appendFrame(i, e, h, u, d);
                                    if (!v) {
                                        o.logger.log("Unable to parse AAC frame");
                                        break
                                    }
                                    h += v.length, f = v.sample.pts, d++
                                } else l.default.isHeader(e, h) ? (n = l.default.getID3Data(e, h), g.push({
                                    pts: f,
                                    dts: f,
                                    data: n
                                }), h += n.length) : h++;
                            this.remuxer.remux(i, {
                                samples: []
                            }, {
                                samples: g,
                                inputTimeScale: 9e4
                            }, {
                                samples: []
                            }, t, r, a)
                        }
                    }, {
                        key: "destroy",
                        value: function() {}
                    }], [{
                        key: "probe",
                        value: function(e) {
                            var t, r, a = l.default.getID3Data(e, 0);
                            if (a && void 0 !== l.default.getTimeStamp(a))
                                for (t = a.length, r = Math.min(e.length - 1, t + 100); t < r; t++)
                                    if (s.default.probe(e, t)) return o.logger.log("ADTS sync word found !"), !0;
                            return !1
                        }
                    }]), e
                }();
            r.default = u
        }, {
            22: 22,
            27: 27,
            54: 54
        }],
        22: [function(e, t, r) {
            "use strict";
            var a = e(54),
                i = e(33),
                n = {
                    getAudioConfig: function(e, t, r, n) {
                        var s, o, l, u, d, f = navigator.userAgent.toLowerCase(),
                            c = n,
                            h = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
                        if (s = 1 + ((192 & t[r + 2]) >>> 6), !((o = (60 & t[r + 2]) >>> 2) > h.length - 1)) return u = (1 & t[r + 2]) << 2, u |= (192 & t[r + 3]) >>> 6, a.logger.log("manifest codec:" + n + ",ADTS data:type:" + s + ",sampleingIndex:" + o + "[" + h[o] + "Hz],channelConfig:" + u), /firefox/i.test(f) ? o >= 6 ? (s = 5, d = new Array(4), l = o - 3) : (s = 2, d = new Array(2), l = o) : -1 !== f.indexOf("android") ? (s = 2, d = new Array(2), l = o) : (s = 5, d = new Array(4), n && (-1 !== n.indexOf("mp4a.40.29") || -1 !== n.indexOf("mp4a.40.5")) || !n && o >= 6 ? l = o - 3 : ((n && -1 !== n.indexOf("mp4a.40.2") && (o >= 6 && 1 === u || /vivaldi/i.test(f)) || !n && 1 === u) && (s = 2, d = new Array(2)), l = o)), d[0] = s << 3, d[0] |= (14 & o) >> 1, d[1] |= (1 & o) << 7, d[1] |= u << 3, 5 === s && (d[1] |= (14 & l) >> 1, d[2] = (1 & l) << 7, d[2] |= 8, d[3] = 0), {
                            config: d,
                            samplerate: h[o],
                            channelCount: u,
                            codec: "mp4a.40." + s,
                            manifestCodec: c
                        };
                        e.trigger(Event.ERROR, {
                            type: i.ErrorTypes.MEDIA_ERROR,
                            details: i.ErrorDetails.FRAG_PARSING_ERROR,
                            fatal: !0,
                            reason: "invalid ADTS sampling index:" + o
                        })
                    },
                    isHeaderPattern: function(e, t) {
                        return 255 === e[t] && 240 == (246 & e[t + 1])
                    },
                    getHeaderLength: function(e, t) {
                        return 1 & e[t + 1] ? 7 : 9
                    },
                    getFullFrameLength: function(e, t) {
                        return (3 & e[t + 3]) << 11 | e[t + 4] << 3 | (224 & e[t + 5]) >>> 5
                    },
                    isHeader: function(e, t) {
                        return !!(t + 1 < e.length && this.isHeaderPattern(e, t))
                    },
                    probe: function(e, t) {
                        if (t + 1 < e.length && this.isHeaderPattern(e, t)) {
                            var r = this.getHeaderLength(e, t);
                            t + 5 < e.length && (r = this.getFullFrameLength(e, t));
                            var a = t + r;
                            if (a === e.length || a + 1 < e.length && this.isHeaderPattern(e, a)) return !0
                        }
                        return !1
                    },
                    initTrackConfig: function(e, t, r, i, n) {
                        if (!e.samplerate) {
                            var s = this.getAudioConfig(t, r, i, n);
                            e.config = s.config, e.samplerate = s.samplerate, e.channelCount = s.channelCount, e.codec = s.codec, e.manifestCodec = s.manifestCodec, a.logger.log("parsed codec:" + e.codec + ",rate:" + s.samplerate + ",nb channel:" + s.channelCount)
                        }
                    },
                    getFrameDuration: function(e) {
                        return 9216e4 / e
                    },
                    appendFrame: function(e, t, r, a, i) {
                        var n = this.getFrameDuration(e.samplerate),
                            s = this.parseFrameHeader(t, r, a, i, n);
                        if (s) {
                            var o = s.stamp,
                                l = s.headerLength,
                                u = s.frameLength,
                                d = {
                                    unit: t.subarray(r + l, r + l + u),
                                    pts: o,
                                    dts: o
                                };
                            return e.samples.push(d), e.len += u, {
                                sample: d,
                                length: u + l
                            }
                        }
                    },
                    parseFrameHeader: function(e, t, r, a, i) {
                        var n, s, o, l = e.length;
                        if (n = this.getHeaderLength(e, t), s = this.getFullFrameLength(e, t), (s -= n) > 0 && t + n + s <= l) return o = r + a * i, {
                            headerLength: n,
                            frameLength: s,
                            stamp: o
                        }
                    }
                };
            t.exports = n
        }, {
            33: 33,
            54: 54
        }],
        23: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(35)),
                o = e(33),
                l = a(e(19)),
                u = a(e(21)),
                d = a(e(29)),
                f = a(e(32)),
                c = a(e(28)),
                h = a(e(45)),
                g = a(e(46)),
                v = function() {
                    function e(t, r, a, n) {
                        i(this, e), this.observer = t, this.typeSupported = r, this.config = a, this.vendor = n
                    }
                    return n(e, [{
                        key: "destroy",
                        value: function() {
                            var e = this.demuxer;
                            e && e.destroy()
                        }
                    }, {
                        key: "push",
                        value: function(e, t, r, a, i, n, o, u, d, f, c, h) {
                            if (e.byteLength > 0 && null != t && null != t.key && "AES-128" === t.method) {
                                var g = this.decrypter;
                                null == g && (g = this.decrypter = new l.default(this.observer, this.config));
                                var v, p = this;
                                try {
                                    v = performance.now()
                                } catch (e) {
                                    v = Date.now()
                                }
                                g.decrypt(e, t.key.buffer, t.iv.buffer, function(e) {
                                    var l;
                                    try {
                                        l = performance.now()
                                    } catch (e) {
                                        l = Date.now()
                                    }
                                    p.observer.trigger(s.default.FRAG_DECRYPTED, {
                                        stats: {
                                            tstart: v,
                                            tdecrypt: l
                                        }
                                    }), p.pushDecrypted(new Uint8Array(e), t, new Uint8Array(r), a, i, n, o, u, d, f, c, h)
                                })
                            } else this.pushDecrypted(new Uint8Array(e), t, new Uint8Array(r), a, i, n, o, u, d, f, c, h)
                        }
                    }, {
                        key: "pushDecrypted",
                        value: function(e, t, r, a, i, n, l, v, p, y, m, E) {
                            var b = this.demuxer;
                            if (!b || l && !this.probe(e)) {
                                for (var T = this.observer, k = this.typeSupported, _ = this.config, R = [{
                                        demux: u.default,
                                        remux: h.default
                                    }, {
                                        demux: c.default,
                                        remux: h.default
                                    }, {
                                        demux: f.default,
                                        remux: h.default
                                    }, {
                                        demux: d.default,
                                        remux: g.default
                                    }], S = 0, A = R.length; S < A; S++) {
                                    var L = R[S],
                                        w = L.demux.probe;
                                    if (w(e)) {
                                        var D = this.remuxer = new L.remux(T, _, k, this.vendor);
                                        b = new L.demux(T, D, _, k), this.probe = w;
                                        break
                                    }
                                }
                                if (!b) return void T.trigger(s.default.ERROR, {
                                    type: o.ErrorTypes.MEDIA_ERROR,
                                    details: o.ErrorDetails.FRAG_PARSING_ERROR,
                                    fatal: !0,
                                    reason: "no demux matching with content found"
                                });
                                this.demuxer = b
                            }
                            var O = this.remuxer;
                            (l || v) && (b.resetInitSegment(r, a, i, y), O.resetInitSegment()), l && (b.resetTimeStamp(E), O.resetTimeStamp(E)), "function" == typeof b.setDecryptData && b.setDecryptData(t), b.append(e, n, p, m)
                        }
                    }]), e
                }();
            r.default = v
        }, {
            19: 19,
            21: 21,
            28: 28,
            29: 29,
            32: 32,
            33: 33,
            35: 35,
            45: 45,
            46: 46
        }],
        24: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = a(e(23)),
                n = a(e(35)),
                s = e(54),
                o = a(e(1));
            r.default = function(e) {
                var t = new o.default;
                t.trigger = function(e) {
                    for (var r = arguments.length, a = Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++) a[i - 1] = arguments[i];
                    t.emit.apply(t, [e, e].concat(a))
                }, t.off = function(e) {
                    for (var r = arguments.length, a = Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++) a[i - 1] = arguments[i];
                    t.removeListener.apply(t, [e].concat(a))
                };
                var r = function(t, r) {
                    e.postMessage({
                        event: t,
                        data: r
                    })
                };
                e.addEventListener("message", function(a) {
                    var n = a.data;
                    switch (n.cmd) {
                        case "init":
                            var o = JSON.parse(n.config);
                            e.demuxer = new i.default(t, n.typeSupported, o, n.vendor);
                            try {
                                (0, s.enableLogs)(!0 === o.debug)
                            } catch (e) {}
                            r("init", null);
                            break;
                        case "demux":
                            e.demuxer.push(n.data, n.decryptdata, n.initSegment, n.audioCodec, n.videoCodec, n.timeOffset, n.discontinuity, n.trackSwitch, n.contiguous, n.duration, n.accurateTimeOffset, n.defaultInitPTS)
                    }
                }), t.on(n.default.FRAG_DECRYPTED, r), t.on(n.default.FRAG_PARSING_INIT_SEGMENT, r), t.on(n.default.FRAG_PARSED, r), t.on(n.default.ERROR, r), t.on(n.default.FRAG_PARSING_METADATA, r), t.on(n.default.FRAG_PARSING_USERDATA, r), t.on(n.default.INIT_PTS_FOUND, r), t.on(n.default.FRAG_PARSING_DATA, function(t, r) {
                    var a = [],
                        i = {
                            event: t,
                            data: r
                        };
                    r.data1 && (i.data1 = r.data1.buffer, a.push(r.data1.buffer), delete r.data1), r.data2 && (i.data2 = r.data2.buffer, a.push(r.data2.buffer), delete r.data2), e.postMessage(i, a)
                })
            }
        }, {
            1: 1,
            23: 23,
            35: 35,
            54: 54
        }],
        25: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(35)),
                o = a(e(23)),
                l = a(e(24)),
                u = e(54),
                d = e(33),
                f = a(e(1)),
                c = function() {
                    function t(r, a) {
                        i(this, t), this.hls = r, this.id = a;
                        var n = this.observer = new f.default,
                            c = r.config;
                        n.trigger = function(e) {
                            for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) r[a - 1] = arguments[a];
                            n.emit.apply(n, [e, e].concat(r))
                        }, n.off = function(e) {
                            for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) r[a - 1] = arguments[a];
                            n.removeListener.apply(n, [e].concat(r))
                        };
                        var h = function(e, t) {
                            (t = t || {}).frag = this.frag, t.id = this.id, r.trigger(e, t)
                        }.bind(this);
                        n.on(s.default.FRAG_DECRYPTED, h), n.on(s.default.FRAG_PARSING_INIT_SEGMENT, h), n.on(s.default.FRAG_PARSING_DATA, h), n.on(s.default.FRAG_PARSED, h), n.on(s.default.ERROR, h), n.on(s.default.FRAG_PARSING_METADATA, h), n.on(s.default.FRAG_PARSING_USERDATA, h), n.on(s.default.INIT_PTS_FOUND, h);
                        var g = {
                                mp4: MediaSource.isTypeSupported("video/mp4"),
                                mpeg: MediaSource.isTypeSupported("audio/mpeg"),
                                mp3: MediaSource.isTypeSupported('audio/mp4; codecs="mp3"')
                            },
                            v = navigator.vendor;
                        if (c.enableWorker && "undefined" != typeof Worker) {
                            u.logger.log("demuxing in webworker");
                            var p = void 0;
                            try {
                                var y = e(3);
                                p = this.w = y(l.default), this.onwmsg = this.onWorkerMessage.bind(this), p.addEventListener("message", this.onwmsg), p.onerror = function(e) {
                                    r.trigger(s.default.ERROR, {
                                        type: d.ErrorTypes.OTHER_ERROR,
                                        details: d.ErrorDetails.INTERNAL_EXCEPTION,
                                        fatal: !0,
                                        event: "demuxerWorker",
                                        err: {
                                            message: e.message + " (" + e.filename + ":" + e.lineno + ")"
                                        }
                                    })
                                }, p.postMessage({
                                    cmd: "init",
                                    typeSupported: g,
                                    vendor: v,
                                    id: a,
                                    config: JSON.stringify(c)
                                })
                            } catch (e) {
                                u.logger.error("error while initializing DemuxerWorker, fallback on DemuxerInline"), p && URL.revokeObjectURL(p.objectURL), this.demuxer = new o.default(n, g, c, v), this.w = void 0
                            }
                        } else this.demuxer = new o.default(n, g, c, v)
                    }
                    return n(t, [{
                        key: "destroy",
                        value: function() {
                            var e = this.w;
                            if (e) e.removeEventListener("message", this.onwmsg), e.terminate(), this.w = null;
                            else {
                                var t = this.demuxer;
                                t && (t.destroy(), this.demuxer = null)
                            }
                            var r = this.observer;
                            r && (r.removeAllListeners(), this.observer = null)
                        }
                    }, {
                        key: "push",
                        value: function(e, t, r, a, i, n, s, o) {
                            var l = this.w,
                                d = isNaN(i.startDTS) ? i.start : i.startDTS,
                                f = i.decryptdata,
                                c = this.frag,
                                h = !(c && i.cc === c.cc),
                                g = !(c && i.level === c.level),
                                v = c && i.sn === c.sn + 1,
                                p = !g && v;
                            if (h && u.logger.log(this.id + ":discontinuity detected"), g && u.logger.log(this.id + ":switch detected"), this.frag = i, l) l.postMessage({
                                cmd: "demux",
                                data: e,
                                decryptdata: f,
                                initSegment: t,
                                audioCodec: r,
                                videoCodec: a,
                                timeOffset: d,
                                discontinuity: h,
                                trackSwitch: g,
                                contiguous: p,
                                duration: n,
                                accurateTimeOffset: s,
                                defaultInitPTS: o
                            }, [e]);
                            else {
                                var y = this.demuxer;
                                y && y.push(e, f, t, r, a, d, h, g, p, n, s, o)
                            }
                        }
                    }, {
                        key: "onWorkerMessage",
                        value: function(e) {
                            var t = e.data,
                                r = this.hls;
                            switch (t.event) {
                                case "init":
                                    URL.revokeObjectURL(this.w.objectURL);
                                    break;
                                case s.default.FRAG_PARSING_DATA:
                                    t.data.data1 = new Uint8Array(t.data1), t.data2 && (t.data.data2 = new Uint8Array(t.data2));
                                default:
                                    t.data = t.data || {}, t.data.frag = this.frag, t.data.id = this.id, r.trigger(t.event, t.data)
                            }
                        }
                    }]), t
                }();
            r.default = c
        }, {
            1: 1,
            23: 23,
            24: 24,
            3: 3,
            33: 33,
            35: 35,
            54: 54
        }],
        26: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = e(54),
                s = function() {
                    function e(t) {
                        a(this, e), this.data = t, this.bytesAvailable = t.byteLength, this.word = 0, this.bitsAvailable = 0
                    }
                    return i(e, [{
                        key: "loadWord",
                        value: function() {
                            var e = this.data,
                                t = this.bytesAvailable,
                                r = e.byteLength - t,
                                a = new Uint8Array(4),
                                i = Math.min(4, t);
                            if (0 === i) throw new Error("no bytes available");
                            a.set(e.subarray(r, r + i)), this.word = new DataView(a.buffer).getUint32(0), this.bitsAvailable = 8 * i, this.bytesAvailable -= i
                        }
                    }, {
                        key: "skipBits",
                        value: function(e) {
                            var t;
                            this.bitsAvailable > e ? (this.word <<= e, this.bitsAvailable -= e) : (e -= this.bitsAvailable, e -= (t = e >> 3) >> 3, this.bytesAvailable -= t, this.loadWord(), this.word <<= e, this.bitsAvailable -= e)
                        }
                    }, {
                        key: "readBits",
                        value: function(e) {
                            var t = Math.min(this.bitsAvailable, e),
                                r = this.word >>> 32 - t;
                            return e > 32 && n.logger.error("Cannot read more than 32 bits at a time"), this.bitsAvailable -= t, this.bitsAvailable > 0 ? this.word <<= t : this.bytesAvailable > 0 && this.loadWord(), (t = e - t) > 0 && this.bitsAvailable ? r << t | this.readBits(t) : r
                        }
                    }, {
                        key: "skipLZ",
                        value: function() {
                            var e;
                            for (e = 0; e < this.bitsAvailable; ++e)
                                if (0 != (this.word & 2147483648 >>> e)) return this.word <<= e, this.bitsAvailable -= e, e;
                            return this.loadWord(), e + this.skipLZ()
                        }
                    }, {
                        key: "skipUEG",
                        value: function() {
                            this.skipBits(1 + this.skipLZ())
                        }
                    }, {
                        key: "skipEG",
                        value: function() {
                            this.skipBits(1 + this.skipLZ())
                        }
                    }, {
                        key: "readUEG",
                        value: function() {
                            var e = this.skipLZ();
                            return this.readBits(e + 1) - 1
                        }
                    }, {
                        key: "readEG",
                        value: function() {
                            var e = this.readUEG();
                            return 1 & e ? 1 + e >>> 1 : -1 * (e >>> 1)
                        }
                    }, {
                        key: "readBoolean",
                        value: function() {
                            return 1 === this.readBits(1)
                        }
                    }, {
                        key: "readUByte",
                        value: function() {
                            return this.readBits(8)
                        }
                    }, {
                        key: "readUShort",
                        value: function() {
                            return this.readBits(16)
                        }
                    }, {
                        key: "readUInt",
                        value: function() {
                            return this.readBits(32)
                        }
                    }, {
                        key: "skipScalingList",
                        value: function(e) {
                            var t, r = 8,
                                a = 8;
                            for (t = 0; t < e; t++) 0 !== a && (a = (r + this.readEG() + 256) % 256), r = 0 === a ? r : a
                        }
                    }, {
                        key: "readSPS",
                        value: function() {
                            var e, t, r, a, i, n, s, o = 0,
                                l = 0,
                                u = 0,
                                d = 0,
                                f = this.readUByte.bind(this),
                                c = this.readBits.bind(this),
                                h = this.readUEG.bind(this),
                                g = this.readBoolean.bind(this),
                                v = this.skipBits.bind(this),
                                p = this.skipEG.bind(this),
                                y = this.skipUEG.bind(this),
                                m = this.skipScalingList.bind(this);
                            if (f(), e = f(), c(5), v(3), f(), y(), 100 === e || 110 === e || 122 === e || 244 === e || 44 === e || 83 === e || 86 === e || 118 === e || 128 === e) {
                                var E = h();
                                if (3 === E && v(1), y(), y(), v(1), g())
                                    for (n = 3 !== E ? 8 : 12, s = 0; s < n; s++) g() && m(s < 6 ? 16 : 64)
                            }
                            y();
                            var b = h();
                            if (0 === b) h();
                            else if (1 === b)
                                for (v(1), p(), p(), t = h(), s = 0; s < t; s++) p();
                            y(), v(1), r = h(), a = h(), 0 === (i = c(1)) && v(1), v(1), g() && (o = h(), l = h(), u = h(), d = h());
                            var T = [1, 1];
                            if (g() && g()) switch (f()) {
                                case 1:
                                    T = [1, 1];
                                    break;
                                case 2:
                                    T = [12, 11];
                                    break;
                                case 3:
                                    T = [10, 11];
                                    break;
                                case 4:
                                    T = [16, 11];
                                    break;
                                case 5:
                                    T = [40, 33];
                                    break;
                                case 6:
                                    T = [24, 11];
                                    break;
                                case 7:
                                    T = [20, 11];
                                    break;
                                case 8:
                                    T = [32, 11];
                                    break;
                                case 9:
                                    T = [80, 33];
                                    break;
                                case 10:
                                    T = [18, 11];
                                    break;
                                case 11:
                                    T = [15, 11];
                                    break;
                                case 12:
                                    T = [64, 33];
                                    break;
                                case 13:
                                    T = [160, 99];
                                    break;
                                case 14:
                                    T = [4, 3];
                                    break;
                                case 15:
                                    T = [3, 2];
                                    break;
                                case 16:
                                    T = [2, 1];
                                    break;
                                case 255:
                                    T = [f() << 8 | f(), f() << 8 | f()]
                            }
                            return {
                                width: Math.ceil(16 * (r + 1) - 2 * o - 2 * l),
                                height: (2 - i) * (a + 1) * 16 - (i ? 2 : 4) * (u + d),
                                pixelRatio: T
                            }
                        }
                    }, {
                        key: "readSliceType",
                        value: function() {
                            return this.readUByte(), this.readUEG(), this.readUEG()
                        }
                    }]), e
                }();
            r.default = s
        }, {
            54: 54
        }],
        27: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e() {
                        a(this, e)
                    }
                    return i(e, null, [{
                        key: "isHeader",
                        value: function(e, t) {
                            return t + 10 <= e.length && 73 === e[t] && 68 === e[t + 1] && 51 === e[t + 2] && e[t + 3] < 255 && e[t + 4] < 255 && e[t + 6] < 128 && e[t + 7] < 128 && e[t + 8] < 128 && e[t + 9] < 128
                        }
                    }, {
                        key: "isFooter",
                        value: function(e, t) {
                            return t + 10 <= e.length && 51 === e[t] && 68 === e[t + 1] && 73 === e[t + 2] && e[t + 3] < 255 && e[t + 4] < 255 && e[t + 6] < 128 && e[t + 7] < 128 && e[t + 8] < 128 && e[t + 9] < 128
                        }
                    }, {
                        key: "getID3Data",
                        value: function(t, r) {
                            for (var a = r, i = 0; e.isHeader(t, r);) i += 10, i += e._readSize(t, r + 6), e.isFooter(t, r + 10) && (i += 10), r += i;
                            if (i > 0) return t.subarray(a, a + i)
                        }
                    }, {
                        key: "_readSize",
                        value: function(e, t) {
                            var r = 0;
                            return r = (127 & e[t]) << 21, r |= (127 & e[t + 1]) << 14, r |= (127 & e[t + 2]) << 7, r |= 127 & e[t + 3]
                        }
                    }, {
                        key: "getTimeStamp",
                        value: function(t) {
                            for (var r = e.getID3Frames(t), a = 0; a < r.length; a++) {
                                var i = r[a];
                                if (e.isTimeStampFrame(i)) return e._readTimeStamp(i)
                            }
                        }
                    }, {
                        key: "isTimeStampFrame",
                        value: function(e) {
                            return e && "PRIV" === e.key && "com.apple.streaming.transportStreamTimestamp" === e.info
                        }
                    }, {
                        key: "_getFrameData",
                        value: function(t) {
                            var r = String.fromCharCode(t[0], t[1], t[2], t[3]),
                                a = e._readSize(t, 4);
                            return {
                                type: r,
                                size: a,
                                data: t.subarray(10, 10 + a)
                            }
                        }
                    }, {
                        key: "getID3Frames",
                        value: function(t) {
                            for (var r = 0, a = []; e.isHeader(t, r);) {
                                for (var i = e._readSize(t, r + 6), n = (r += 10) + i; r + 8 < n;) {
                                    var s = e._getFrameData(t.subarray(r)),
                                        o = e._decodeFrame(s);
                                    o && a.push(o), r += s.size + 10
                                }
                                e.isFooter(t, r) && (r += 10)
                            }
                            return a
                        }
                    }, {
                        key: "_decodeFrame",
                        value: function(t) {
                            return "PRIV" === t.type ? e._decodePrivFrame(t) : "T" === t.type[0] ? e._decodeTextFrame(t) : "W" === t.type[0] ? e._decodeURLFrame(t) : void 0
                        }
                    }, {
                        key: "_readTimeStamp",
                        value: function(e) {
                            if (8 === e.data.byteLength) {
                                var t = new Uint8Array(e.data),
                                    r = 1 & t[3],
                                    a = (t[4] << 23) + (t[5] << 15) + (t[6] << 7) + t[7];
                                return a /= 45, r && (a += 47721858.84), Math.round(a)
                            }
                        }
                    }, {
                        key: "_decodePrivFrame",
                        value: function(t) {
                            if (!(t.size < 2)) {
                                var r = e._utf8ArrayToStr(t.data),
                                    a = new Uint8Array(t.data.subarray(r.length + 1));
                                return {
                                    key: t.type,
                                    info: r,
                                    data: a.buffer
                                }
                            }
                        }
                    }, {
                        key: "_decodeTextFrame",
                        value: function(t) {
                            if (!(t.size < 2)) {
                                if ("TXXX" === t.type) {
                                    var r = 1,
                                        a = e._utf8ArrayToStr(t.data.subarray(r));
                                    r += a.length + 1;
                                    var i = e._utf8ArrayToStr(t.data.subarray(r));
                                    return {
                                        key: t.type,
                                        info: a,
                                        data: i
                                    }
                                }
                                var n = e._utf8ArrayToStr(t.data.subarray(1));
                                return {
                                    key: t.type,
                                    data: n
                                }
                            }
                        }
                    }, {
                        key: "_decodeURLFrame",
                        value: function(t) {
                            if ("WXXX" === t.type) {
                                if (t.size < 2) return;
                                var r = 1,
                                    a = e._utf8ArrayToStr(t.data.subarray(r));
                                r += a.length + 1;
                                var i = e._utf8ArrayToStr(t.data.subarray(r));
                                return {
                                    key: t.type,
                                    info: a,
                                    data: i
                                }
                            }
                            var n = e._utf8ArrayToStr(t.data);
                            return {
                                key: t.type,
                                data: n
                            }
                        }
                    }, {
                        key: "_utf8ArrayToStr",
                        value: function(e) {
                            for (var t = void 0, r = void 0, a = "", i = 0, n = e.length; i < n;) {
                                var s = e[i++];
                                switch (s >> 4) {
                                    case 0:
                                        return a;
                                    case 1:
                                    case 2:
                                    case 3:
                                    case 4:
                                    case 5:
                                    case 6:
                                    case 7:
                                        a += String.fromCharCode(s);
                                        break;
                                    case 12:
                                    case 13:
                                        t = e[i++], a += String.fromCharCode((31 & s) << 6 | 63 & t);
                                        break;
                                    case 14:
                                        t = e[i++], r = e[i++], a += String.fromCharCode((15 & s) << 12 | (63 & t) << 6 | (63 & r) << 0)
                                }
                            }
                            return a
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        28: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(27)),
                o = e(54),
                l = a(e(30)),
                u = function() {
                    function e(t, r, a) {
                        i(this, e), this.observer = t, this.config = a, this.remuxer = r
                    }
                    return n(e, [{
                        key: "resetInitSegment",
                        value: function(e, t, r, a) {
                            this._audioTrack = {
                                container: "audio/mpeg",
                                type: "audio",
                                id: -1,
                                sequenceNumber: 0,
                                isAAC: !1,
                                samples: [],
                                len: 0,
                                manifestCodec: t,
                                duration: a,
                                inputTimeScale: 9e4
                            }
                        }
                    }, {
                        key: "resetTimeStamp",
                        value: function() {}
                    }, {
                        key: "append",
                        value: function(e, t, r, a) {
                            for (var i = s.default.getID3Data(e, 0), n = 90 * s.default.getTimeStamp(i), o = i.length, u = e.length, d = 0, f = 0, c = this._audioTrack, h = [{
                                    pts: n,
                                    dts: n,
                                    data: i
                                }]; o < u;)
                                if (l.default.isHeader(e, o)) {
                                    var g = l.default.appendFrame(c, e, o, n, d);
                                    if (!g) break;
                                    o += g.length, f = g.sample.pts, d++
                                } else s.default.isHeader(e, o) ? (i = s.default.getID3Data(e, o), h.push({
                                    pts: f,
                                    dts: f,
                                    data: i
                                }), o += i.length) : o++;
                            this.remuxer.remux(c, {
                                samples: []
                            }, {
                                samples: h,
                                inputTimeScale: 9e4
                            }, {
                                samples: []
                            }, t, r, a)
                        }
                    }, {
                        key: "destroy",
                        value: function() {}
                    }], [{
                        key: "probe",
                        value: function(e) {
                            var t, r, a = s.default.getID3Data(e, 0);
                            if (a && void 0 !== s.default.getTimeStamp(a))
                                for (t = a.length, r = Math.min(e.length - 1, t + 100); t < r; t++)
                                    if (l.default.probe(e, t)) return o.logger.log("MPEG Audio sync word found !"), !0;
                            return !1
                        }
                    }]), e
                }();
            r.default = u
        }, {
            27: 27,
            30: 30,
            54: 54
        }],
        29: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(35)),
                s = Math.pow(2, 32) - 1,
                o = function() {
                    function e(t, r) {
                        a(this, e), this.observer = t, this.remuxer = r
                    }
                    return i(e, [{
                        key: "resetTimeStamp",
                        value: function(e) {
                            this.initPTS = e
                        }
                    }, {
                        key: "resetInitSegment",
                        value: function(t, r, a, i) {
                            if (t && t.byteLength) {
                                var s = this.initData = e.parseInitSegment(t),
                                    o = {};
                                s.audio && (o.audio = {
                                    container: "audio/mp4",
                                    codec: r,
                                    initSegment: i ? t : null
                                }), s.video && (o.video = {
                                    container: "video/mp4",
                                    codec: a,
                                    initSegment: i ? t : null
                                }), this.observer.trigger(n.default.FRAG_PARSING_INIT_SEGMENT, {
                                    tracks: o
                                })
                            } else r && (this.audioCodec = r), a && (this.videoCodec = a)
                        }
                    }, {
                        key: "append",
                        value: function(t, r, a, i) {
                            var s = this.initData;
                            s || (this.resetInitSegment(t, this.audioCodec, this.videoCodec), s = this.initData);
                            var o = void 0,
                                l = this.initPTS;
                            if (void 0 === l) {
                                var u = e.getStartDTS(s, t);
                                this.initPTS = l = u - r, this.observer.trigger(n.default.INIT_PTS_FOUND, {
                                    initPTS: l
                                })
                            }
                            e.offsetStartDTS(s, t, l), o = e.getStartDTS(s, t), this.remuxer.remux(s.audio, s.video, null, null, o, a, i, t)
                        }
                    }, {
                        key: "destroy",
                        value: function() {}
                    }], [{
                        key: "probe",
                        value: function(t) {
                            if (t.length >= 8) {
                                var r = e.bin2str(t.subarray(4, 8));
                                return ["moof", "ftyp", "styp"].indexOf(r) >= 0
                            }
                            return !1
                        }
                    }, {
                        key: "bin2str",
                        value: function(e) {
                            return String.fromCharCode.apply(null, e)
                        }
                    }, {
                        key: "readUint32",
                        value: function(e, t) {
                            e.data && (t += e.start, e = e.data);
                            var r = e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
                            return r < 0 ? 4294967296 + r : r
                        }
                    }, {
                        key: "writeUint32",
                        value: function(e, t, r) {
                            e.data && (t += e.start, e = e.data), e[t] = r >> 24, e[t + 1] = r >> 16 & 255, e[t + 2] = r >> 8 & 255, e[t + 3] = 255 & r
                        }
                    }, {
                        key: "findBox",
                        value: function(t, r) {
                            var a, i, n, s, o, l, u, d = [];
                            if (t.data ? (l = t.start, s = t.end, t = t.data) : (l = 0, s = t.byteLength), !r.length) return null;
                            for (a = l; a < s;) i = e.readUint32(t, a), n = e.bin2str(t.subarray(a + 4, a + 8)), u = i > 1 ? a + i : s, n === r[0] && (1 === r.length ? d.push({
                                data: t,
                                start: a + 8,
                                end: u
                            }) : (o = e.findBox({
                                data: t,
                                start: a + 8,
                                end: u
                            }, r.slice(1))).length && (d = d.concat(o))), a = u;
                            return d
                        }
                    }, {
                        key: "parseInitSegment",
                        value: function(t) {
                            var r = [];
                            return e.findBox(t, ["moov", "trak"]).forEach(function(t) {
                                var a = e.findBox(t, ["tkhd"])[0];
                                if (a) {
                                    var i = a.data[a.start],
                                        n = 0 === i ? 12 : 20,
                                        s = e.readUint32(a, n),
                                        o = e.findBox(t, ["mdia", "mdhd"])[0];
                                    if (o) {
                                        n = 0 === (i = o.data[o.start]) ? 12 : 20;
                                        var l = e.readUint32(o, n),
                                            u = e.findBox(t, ["mdia", "hdlr"])[0];
                                        if (u) {
                                            var d = {
                                                soun: "audio",
                                                vide: "video"
                                            } [e.bin2str(u.data.subarray(u.start + 8, u.start + 12))];
                                            d && (r[s] = {
                                                timescale: l,
                                                type: d
                                            }, r[d] = {
                                                timescale: l,
                                                id: s
                                            })
                                        }
                                    }
                                }
                            }), r
                        }
                    }, {
                        key: "getStartDTS",
                        value: function(t, r) {
                            var a, i, n;
                            return a = e.findBox(r, ["moof", "traf"]), i = [].concat.apply([], a.map(function(r) {
                                return e.findBox(r, ["tfhd"]).map(function(a) {
                                    var i, n, s;
                                    return i = e.readUint32(a, 4), n = t[i].timescale || 9e4, s = e.findBox(r, ["tfdt"]).map(function(t) {
                                        var r, a;
                                        return r = t.data[t.start], a = e.readUint32(t, 4), 1 === r && (a *= Math.pow(2, 32), a += e.readUint32(t, 8)), a
                                    })[0], (s = s || 1 / 0) / n
                                })
                            })), n = Math.min.apply(null, i), isFinite(n) ? n : 0
                        }
                    }, {
                        key: "offsetStartDTS",
                        value: function(t, r, a) {
                            e.findBox(r, ["moof", "traf"]).map(function(r) {
                                return e.findBox(r, ["tfhd"]).map(function(i) {
                                    var n = e.readUint32(i, 4),
                                        o = t[n].timescale || 9e4;
                                    e.findBox(r, ["tfdt"]).map(function(t) {
                                        var r = t.data[t.start],
                                            i = e.readUint32(t, 4);
                                        if (0 === r) e.writeUint32(t, 4, i - a * o);
                                        else {
                                            i *= Math.pow(2, 32), i += e.readUint32(t, 8), i -= a * o;
                                            var n = Math.floor(i / (s + 1)),
                                                l = Math.floor(i % (s + 1));
                                            e.writeUint32(t, 4, n), e.writeUint32(t, 8, l)
                                        }
                                    })
                                })
                            })
                        }
                    }]), e
                }();
            r.default = o
        }, {
            35: 35
        }],
        30: [function(e, t, r) {
            "use strict";
            var a = {
                BitratesMap: [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
                SamplingRateMap: [44100, 48e3, 32e3, 22050, 24e3, 16e3, 11025, 12e3, 8e3],
                appendFrame: function(e, t, r, a, i) {
                    if (!(r + 24 > t.length)) {
                        var n = this.parseHeader(t, r);
                        if (n && r + n.frameLength <= t.length) {
                            var s = a + i * (10368e4 / n.sampleRate),
                                o = {
                                    unit: t.subarray(r, r + n.frameLength),
                                    pts: s,
                                    dts: s
                                };
                            return e.config = [], e.channelCount = n.channelCount, e.samplerate = n.sampleRate, e.samples.push(o), e.len += n.frameLength, {
                                sample: o,
                                length: n.frameLength
                            }
                        }
                    }
                },
                parseHeader: function(e, t) {
                    var r = e[t + 1] >> 3 & 3,
                        i = e[t + 1] >> 1 & 3,
                        n = e[t + 2] >> 4 & 15,
                        s = e[t + 2] >> 2 & 3,
                        o = !!(2 & e[t + 2]);
                    if (1 !== r && 0 !== n && 15 !== n && 3 !== s) {
                        var l = 3 === r ? 3 - i : 3 === i ? 3 : 4,
                            u = 1e3 * a.BitratesMap[14 * l + n - 1],
                            d = 3 === r ? 0 : 2 === r ? 1 : 2,
                            f = a.SamplingRateMap[3 * d + s],
                            c = o ? 1 : 0;
                        return {
                            sampleRate: f,
                            channelCount: e[t + 3] >> 6 == 3 ? 1 : 2,
                            frameLength: 3 === i ? (3 === r ? 12 : 6) * u / f + c << 2 : (3 === r ? 144 : 72) * u / f + c | 0
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
                        var r = this.parseHeader(e, t),
                            a = 4;
                        r && r.frameLength && (a = r.frameLength);
                        var i = t + a;
                        if (i === e.length || i + 1 < e.length && this.isHeaderPattern(e, i)) return !0
                    }
                    return !1
                }
            };
            t.exports = a
        }, {}],
        31: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(19)),
                s = function() {
                    function e(t, r, i, s) {
                        a(this, e), this.decryptdata = i, this.discardEPB = s, this.decrypter = new n.default(t, r)
                    }
                    return i(e, [{
                        key: "decryptBuffer",
                        value: function(e, t) {
                            this.decrypter.decrypt(e, this.decryptdata.key.buffer, this.decryptdata.iv.buffer, t)
                        }
                    }, {
                        key: "decryptAacSample",
                        value: function(e, t, r, a) {
                            var i = e[t].unit,
                                n = i.subarray(16, i.length - i.length % 16),
                                s = n.buffer.slice(n.byteOffset, n.byteOffset + n.length),
                                o = this;
                            this.decryptBuffer(s, function(n) {
                                n = new Uint8Array(n), i.set(n, 16), a || o.decryptAacSamples(e, t + 1, r)
                            })
                        }
                    }, {
                        key: "decryptAacSamples",
                        value: function(e, t, r) {
                            for (;; t++) {
                                if (t >= e.length) return void r();
                                if (!(e[t].unit.length < 32)) {
                                    var a = this.decrypter.isSync();
                                    if (this.decryptAacSample(e, t, r, a), !a) return
                                }
                            }
                        }
                    }, {
                        key: "getAvcEncryptedData",
                        value: function(e) {
                            for (var t = 16 * Math.floor((e.length - 48) / 160) + 16, r = new Int8Array(t), a = 0, i = 32; i <= e.length - 16; i += 160, a += 16) r.set(e.subarray(i, i + 16), a);
                            return r
                        }
                    }, {
                        key: "getAvcDecryptedUnit",
                        value: function(e, t) {
                            t = new Uint8Array(t);
                            for (var r = 0, a = 32; a <= e.length - 16; a += 160, r += 16) e.set(t.subarray(r, r + 16), a);
                            return e
                        }
                    }, {
                        key: "decryptAvcSample",
                        value: function(e, t, r, a, i, n) {
                            var s = this.discardEPB(i.data),
                                o = this.getAvcEncryptedData(s),
                                l = this;
                            this.decryptBuffer(o.buffer, function(o) {
                                i.data = l.getAvcDecryptedUnit(s, o), n || l.decryptAvcSamples(e, t, r + 1, a)
                            })
                        }
                    }, {
                        key: "decryptAvcSamples",
                        value: function(e, t, r, a) {
                            for (;; t++, r = 0) {
                                if (t >= e.length) return void a();
                                for (var i = e[t].units; !(r >= i.length); r++) {
                                    var n = i[r];
                                    if (!(n.length <= 48 || 1 !== n.type && 5 !== n.type)) {
                                        var s = this.decrypter.isSync();
                                        if (this.decryptAvcSample(e, t, r, a, n, s), !s) return
                                    }
                                }
                            }
                        }
                    }]), e
                }();
            r.default = s
        }, {
            19: 19
        }],
        32: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(22)),
                o = a(e(30)),
                l = a(e(35)),
                u = a(e(26)),
                d = a(e(31)),
                f = e(54),
                c = e(33),
                h = function() {
                    function e(t, r, a, n) {
                        i(this, e), this.observer = t, this.config = a, this.typeSupported = n, this.remuxer = r, this.sampleAes = null
                    }
                    return n(e, [{
                        key: "setDecryptData",
                        value: function(e) {
                            null != e && null != e.key && "SAMPLE-AES" === e.method ? this.sampleAes = new d.default(this.observer, this.config, e, this.discardEPB) : this.sampleAes = null
                        }
                    }, {
                        key: "resetInitSegment",
                        value: function(e, t, r, a) {
                            this.pmtParsed = !1, this._pmtId = -1, this._avcTrack = {
                                container: "video/mp2t",
                                type: "video",
                                id: -1,
                                inputTimeScale: 9e4,
                                sequenceNumber: 0,
                                samples: [],
                                len: 0,
                                dropped: 0
                            }, this._audioTrack = {
                                container: "video/mp2t",
                                type: "audio",
                                id: -1,
                                inputTimeScale: 9e4,
                                duration: a,
                                sequenceNumber: 0,
                                samples: [],
                                len: 0,
                                isAAC: !0
                            }, this._id3Track = {
                                type: "id3",
                                id: -1,
                                inputTimeScale: 9e4,
                                sequenceNumber: 0,
                                samples: [],
                                len: 0
                            }, this._txtTrack = {
                                type: "text",
                                id: -1,
                                inputTimeScale: 9e4,
                                sequenceNumber: 0,
                                samples: [],
                                len: 0
                            }, this.aacOverFlow = null, this.aacLastPTS = null, this.avcSample = null, this.audioCodec = t, this.videoCodec = r, this._duration = a
                        }
                    }, {
                        key: "resetTimeStamp",
                        value: function() {}
                    }, {
                        key: "append",
                        value: function(e, t, r, a) {
                            var i, n, s, o, u, d = e.length,
                                h = !1;
                            this.contiguous = r;
                            var g = this.pmtParsed,
                                v = this._avcTrack,
                                p = this._audioTrack,
                                y = this._id3Track,
                                m = v.id,
                                E = p.id,
                                b = y.id,
                                T = this._pmtId,
                                k = v.pesData,
                                _ = p.pesData,
                                R = y.pesData,
                                S = this._parsePAT,
                                A = this._parsePMT,
                                L = this._parsePES,
                                w = this._parseAVCPES.bind(this),
                                D = this._parseAACPES.bind(this),
                                O = this._parseMPEGPES.bind(this),
                                I = this._parseID3PES.bind(this);
                            for (d -= d % 188, i = 0; i < d; i += 188)
                                if (71 === e[i]) {
                                    if (n = !!(64 & e[i + 1]), s = ((31 & e[i + 1]) << 8) + e[i + 2], (48 & e[i + 3]) >> 4 > 1) {
                                        if ((o = i + 5 + e[i + 4]) === i + 188) continue
                                    } else o = i + 4;
                                    switch (s) {
                                        case m:
                                            n && (k && (u = L(k)) && w(u, !1), k = {
                                                data: [],
                                                size: 0
                                            }), k && (k.data.push(e.subarray(o, i + 188)), k.size += i + 188 - o);
                                            break;
                                        case E:
                                            n && (_ && (u = L(_)) && (p.isAAC ? D(u) : O(u)), _ = {
                                                data: [],
                                                size: 0
                                            }), _ && (_.data.push(e.subarray(o, i + 188)), _.size += i + 188 - o);
                                            break;
                                        case b:
                                            n && (R && (u = L(R)) && I(u), R = {
                                                data: [],
                                                size: 0
                                            }), R && (R.data.push(e.subarray(o, i + 188)), R.size += i + 188 - o);
                                            break;
                                        case 0:
                                            n && (o += e[o] + 1), T = this._pmtId = S(e, o);
                                            break;
                                        case T:
                                            n && (o += e[o] + 1);
                                            var P = A(e, o, !0 === this.typeSupported.mpeg || !0 === this.typeSupported.mp3, null != this.sampleAes);
                                            (m = P.avc) > 0 && (v.id = m), (E = P.audio) > 0 && (p.id = E, p.isAAC = P.isAAC), (b = P.id3) > 0 && (y.id = b), h && !g && (f.logger.log("reparse from beginning"), h = !1, i = -188), g = this.pmtParsed = !0;
                                            break;
                                        case 17:
                                        case 8191:
                                            break;
                                        default:
                                            h = !0
                                    }
                                } else this.observer.trigger(l.default.ERROR, {
                                    type: c.ErrorTypes.MEDIA_ERROR,
                                    details: c.ErrorDetails.FRAG_PARSING_ERROR,
                                    fatal: !1,
                                    reason: "TS packet did not start with 0x47"
                                });
                            k && (u = L(k)) ? (w(u, !0), v.pesData = null) : v.pesData = k, _ && (u = L(_)) ? (p.isAAC ? D(u) : O(u), p.pesData = null) : (_ && _.size && f.logger.log("last AAC PES packet truncated,might overlap between fragments"), p.pesData = _), R && (u = L(R)) ? (I(u), y.pesData = null) : y.pesData = R, null == this.sampleAes ? this.remuxer.remux(p, v, y, this._txtTrack, t, r, a) : this.decryptAndRemux(p, v, y, this._txtTrack, t, r, a)
                        }
                    }, {
                        key: "decryptAndRemux",
                        value: function(e, t, r, a, i, n, s) {
                            if (e.samples && e.isAAC) {
                                var o = this;
                                this.sampleAes.decryptAacSamples(e.samples, 0, function() {
                                    o.decryptAndRemuxAvc(e, t, r, a, i, n, s)
                                })
                            } else this.decryptAndRemuxAvc(e, t, r, a, i, n, s)
                        }
                    }, {
                        key: "decryptAndRemuxAvc",
                        value: function(e, t, r, a, i, n, s) {
                            if (t.samples) {
                                var o = this;
                                this.sampleAes.decryptAvcSamples(t.samples, 0, 0, function() {
                                    o.remuxer.remux(e, t, r, a, i, n, s)
                                })
                            } else this.remuxer.remux(e, t, r, a, i, n, s)
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            this._initPTS = this._initDTS = void 0, this._duration = 0
                        }
                    }, {
                        key: "_parsePAT",
                        value: function(e, t) {
                            return (31 & e[t + 10]) << 8 | e[t + 11]
                        }
                    }, {
                        key: "_parsePMT",
                        value: function(e, t, r, a) {
                            var i, n, s = {
                                audio: -1,
                                avc: -1,
                                id3: -1,
                                isAAC: !0
                            };
                            for (i = t + 3 + ((15 & e[t + 1]) << 8 | e[t + 2]) - 4, t += 12 + ((15 & e[t + 10]) << 8 | e[t + 11]); t < i;) {
                                switch (n = (31 & e[t + 1]) << 8 | e[t + 2], e[t]) {
                                    case 207:
                                        if (!a) {
                                            f.logger.log("unkown stream type:" + e[t]);
                                            break
                                        }
                                    case 15:
                                        -1 === s.audio && (s.audio = n);
                                        break;
                                    case 21:
                                        -1 === s.id3 && (s.id3 = n);
                                        break;
                                    case 219:
                                        if (!a) {
                                            f.logger.log("unkown stream type:" + e[t]);
                                            break
                                        }
                                    case 27:
                                        -1 === s.avc && (s.avc = n);
                                        break;
                                    case 3:
                                    case 4:
                                        r ? -1 === s.audio && (s.audio = n, s.isAAC = !1) : f.logger.log("MPEG audio found, not supported in this browser for now");
                                        break;
                                    case 36:
                                        f.logger.warn("HEVC stream type found, not supported for now");
                                        break;
                                    default:
                                        f.logger.log("unkown stream type:" + e[t])
                                }
                                t += 5 + ((15 & e[t + 3]) << 8 | e[t + 4])
                            }
                            return s
                        }
                    }, {
                        key: "_parsePES",
                        value: function(e) {
                            var t, r, a, i, n, s, o, l, u = 0,
                                d = e.data;
                            if (!e || 0 === e.size) return null;
                            for (; d[0].length < 19 && d.length > 1;) {
                                var c = new Uint8Array(d[0].length + d[1].length);
                                c.set(d[0]), c.set(d[1], d[0].length), d[0] = c, d.splice(1, 1)
                            }
                            if (t = d[0], 1 === (t[0] << 16) + (t[1] << 8) + t[2]) {
                                if ((a = (t[4] << 8) + t[5]) && a > e.size - 6) return null;
                                192 & (r = t[7]) && ((s = 536870912 * (14 & t[9]) + 4194304 * (255 & t[10]) + 16384 * (254 & t[11]) + 128 * (255 & t[12]) + (254 & t[13]) / 2) > 4294967295 && (s -= 8589934592), 64 & r ? ((o = 536870912 * (14 & t[14]) + 4194304 * (255 & t[15]) + 16384 * (254 & t[16]) + 128 * (255 & t[17]) + (254 & t[18]) / 2) > 4294967295 && (o -= 8589934592), s - o > 54e5 && (f.logger.warn(Math.round((s - o) / 9e4) + "s delta between PTS and DTS, align them"), s = o)) : o = s), l = (i = t[8]) + 9, e.size -= l, n = new Uint8Array(e.size);
                                for (var h = 0, g = d.length; h < g; h++) {
                                    var v = (t = d[h]).byteLength;
                                    if (l) {
                                        if (l > v) {
                                            l -= v;
                                            continue
                                        }
                                        t = t.subarray(l), v -= l, l = 0
                                    }
                                    n.set(t, u), u += v
                                }
                                return a && (a -= i + 3), {
                                    data: n,
                                    pts: s,
                                    dts: o,
                                    len: a
                                }
                            }
                            return null
                        }
                    }, {
                        key: "pushAccesUnit",
                        value: function(e, t) {
                            if (e.units.length && e.frame) {
                                var r = t.samples,
                                    a = r.length;
                                !this.config.forceKeyFrameOnDiscontinuity || !0 === e.key || t.sps && (a || this.contiguous) ? (e.id = a, r.push(e)) : t.dropped++
                            }
                            e.debug.length && f.logger.log(e.pts + "/" + e.dts + ":" + e.debug)
                        }
                    }, {
                        key: "_parseAVCPES",
                        value: function(e, t) {
                            var r, a, i, n = this,
                                s = this._avcTrack,
                                o = this._parseAVCNALu(e.data),
                                l = this.avcSample,
                                d = !1,
                                f = this.pushAccesUnit.bind(this),
                                c = function(e, t, r, a) {
                                    return {
                                        key: e,
                                        pts: t,
                                        dts: r,
                                        units: [],
                                        debug: a
                                    }
                                };
                            e.data = null, l && o.length && (f(l, s), l = this.avcSample = c(!1, e.pts, e.dts, "")), o.forEach(function(t) {
                                switch (t.type) {
                                    case 1:
                                        a = !0, l.frame = !0;
                                        var o = t.data;
                                        if (d && o.length > 4) {
                                            var h = new u.default(o).readSliceType();
                                            2 !== h && 4 !== h && 7 !== h && 9 !== h || (l.key = !0)
                                        }
                                        break;
                                    case 5:
                                        a = !0, l || (l = n.avcSample = c(!0, e.pts, e.dts, "")), l.key = !0, l.frame = !0;
                                        break;
                                    case 6:
                                        a = !0, (r = new u.default(n.discardEPB(t.data))).readUByte();
                                        for (var g = 0, v = 0, p = !1, y = 0; !p && r.bytesAvailable > 1;) {
                                            g = 0;
                                            do {
                                                g += y = r.readUByte()
                                            } while (255 === y);
                                            v = 0;
                                            do {
                                                v += y = r.readUByte()
                                            } while (255 === y);
                                            if (4 === g && 0 !== r.bytesAvailable) {
                                                if (p = !0, 181 === r.readUByte() && 49 === r.readUShort() && 1195456820 === r.readUInt() && 3 === r.readUByte()) {
                                                    var m = r.readUByte(),
                                                        E = 31 & m,
                                                        b = [m, r.readUByte()];
                                                    for (i = 0; i < E; i++) b.push(r.readUByte()), b.push(r.readUByte()), b.push(r.readUByte());
                                                    n._insertSampleInOrder(n._txtTrack.samples, {
                                                        type: 3,
                                                        pts: e.pts,
                                                        bytes: b
                                                    })
                                                }
                                            } else if (v < r.bytesAvailable)
                                                for (i = 0; i < v; i++) r.readUByte()
                                        }
                                        break;
                                    case 7:
                                        if (a = !0, d = !0, !s.sps) {
                                            var T = (r = new u.default(t.data)).readSPS();
                                            s.width = T.width, s.height = T.height, s.pixelRatio = T.pixelRatio, s.sps = [t.data], s.duration = n._duration;
                                            var k = t.data.subarray(1, 4),
                                                _ = "avc1.";
                                            for (i = 0; i < 3; i++) {
                                                var R = k[i].toString(16);
                                                R.length < 2 && (R = "0" + R), _ += R
                                            }
                                            s.codec = _
                                        }
                                        break;
                                    case 8:
                                        a = !0, s.pps || (s.pps = [t.data]);
                                        break;
                                    case 9:
                                        a = !1, l && f(l, s), l = n.avcSample = c(!1, e.pts, e.dts, "");
                                        break;
                                    case 12:
                                        a = !1;
                                        break;
                                    default:
                                        a = !1, l && (l.debug += "unknown NAL " + t.type + " ")
                                }
                                l && a && l.units.push(t)
                            }), t && l && (f(l, s), this.avcSample = null)
                        }
                    }, {
                        key: "_insertSampleInOrder",
                        value: function(e, t) {
                            var r = e.length;
                            if (r > 0) {
                                if (t.pts >= e[r - 1].pts) e.push(t);
                                else
                                    for (var a = r - 1; a >= 0; a--)
                                        if (t.pts < e[a].pts) {
                                            e.splice(a, 0, t);
                                            break
                                        }
                            } else e.push(t)
                        }
                    }, {
                        key: "_getLastNalUnit",
                        value: function() {
                            var e = this.avcSample,
                                t = void 0;
                            if (!e || 0 === e.units.length) {
                                var r = this._avcTrack.samples;
                                e = r[r.length - 1]
                            }
                            if (e) {
                                var a = e.units;
                                t = a[a.length - 1]
                            }
                            return t
                        }
                    }, {
                        key: "_parseAVCNALu",
                        value: function(e) {
                            var t, r, a, i, n = 0,
                                s = e.byteLength,
                                o = this._avcTrack,
                                l = o.naluState || 0,
                                u = l,
                                d = [],
                                f = -1;
                            for (-1 === l && (f = 0, i = 31 & e[0], l = 0, n = 1); n < s;)
                                if (t = e[n++], l)
                                    if (1 !== l)
                                        if (t)
                                            if (1 === t) {
                                                if (f >= 0) a = {
                                                    data: e.subarray(f, n - l - 1),
                                                    type: i
                                                }, d.push(a);
                                                else {
                                                    var c = this._getLastNalUnit();
                                                    if (c && (u && n <= 4 - u && c.state && (c.data = c.data.subarray(0, c.data.byteLength - u)), (r = n - l - 1) > 0)) {
                                                        var h = new Uint8Array(c.data.byteLength + r);
                                                        h.set(c.data, 0), h.set(e.subarray(0, r), c.data.byteLength), c.data = h
                                                    }
                                                }
                                                n < s ? (f = n, i = 31 & e[n], l = 0) : l = -1
                                            } else l = 0;
                            else l = 3;
                            else l = t ? 0 : 2;
                            else l = t ? 0 : 1;
                            if (f >= 0 && l >= 0 && (a = {
                                    data: e.subarray(f, s),
                                    type: i,
                                    state: l
                                }, d.push(a)), 0 === d.length) {
                                var g = this._getLastNalUnit();
                                if (g) {
                                    var v = new Uint8Array(g.data.byteLength + e.byteLength);
                                    v.set(g.data, 0), v.set(e, g.data.byteLength), g.data = v
                                }
                            }
                            return o.naluState = l, d
                        }
                    }, {
                        key: "discardEPB",
                        value: function(e) {
                            for (var t, r, a = e.byteLength, i = [], n = 1; n < a - 2;) 0 === e[n] && 0 === e[n + 1] && 3 === e[n + 2] ? (i.push(n + 2), n += 2) : n++;
                            if (0 === i.length) return e;
                            t = a - i.length, r = new Uint8Array(t);
                            var s = 0;
                            for (n = 0; n < t; s++, n++) s === i[0] && (s++, i.shift()), r[n] = e[s];
                            return r
                        }
                    }, {
                        key: "_parseAACPES",
                        value: function(e) {
                            var t, r, a, i, n, o = this._audioTrack,
                                u = e.data,
                                d = e.pts,
                                h = this.aacOverFlow,
                                g = this.aacLastPTS;
                            if (h) {
                                var v = new Uint8Array(h.byteLength + u.byteLength);
                                v.set(h, 0), v.set(u, h.byteLength), u = v
                            }
                            for (a = 0, n = u.length; a < n - 1 && !s.default.isHeader(u, a); a++);
                            if (a) {
                                var p, y;
                                if (a < n - 1 ? (p = "AAC PES did not start with ADTS header,offset:" + a, y = !1) : (p = "no ADTS header found in AAC PES", y = !0), f.logger.warn("parsing error:" + p), this.observer.trigger(l.default.ERROR, {
                                        type: c.ErrorTypes.MEDIA_ERROR,
                                        details: c.ErrorDetails.FRAG_PARSING_ERROR,
                                        fatal: y,
                                        reason: p
                                    }), y) return
                            }
                            if (s.default.initTrackConfig(o, this.observer, u, a, this.audioCodec), r = 0, t = s.default.getFrameDuration(o.samplerate), h && g) {
                                var m = g + t;
                                Math.abs(m - d) > 1 && (f.logger.log("AAC: align PTS for overlapping frames by " + Math.round((m - d) / 90)), d = m)
                            }
                            for (; a < n;)
                                if (s.default.isHeader(u, a) && a + 5 < n) {
                                    var E = s.default.appendFrame(o, u, a, d, r);
                                    if (!E) break;
                                    a += E.length, i = E.sample.pts, r++
                                } else a++;
                            h = a < n ? u.subarray(a, n) : null, this.aacOverFlow = h, this.aacLastPTS = i
                        }
                    }, {
                        key: "_parseMPEGPES",
                        value: function(e) {
                            for (var t = e.data, r = t.length, a = 0, i = 0, n = e.pts; i < r;)
                                if (o.default.isHeader(t, i)) {
                                    var s = o.default.appendFrame(this._audioTrack, t, i, n, a);
                                    if (!s) break;
                                    i += s.length, a++
                                } else i++
                        }
                    }, {
                        key: "_parseID3PES",
                        value: function(e) {
                            this._id3Track.samples.push(e)
                        }
                    }], [{
                        key: "probe",
                        value: function(e) {
                            return e.length >= 564 && 71 === e[0] && 71 === e[188] && 71 === e[376]
                        }
                    }]), e
                }();
            r.default = h
        }, {
            22: 22,
            26: 26,
            30: 30,
            31: 31,
            33: 33,
            35: 35,
            54: 54
        }],
        33: [function(e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            r.ErrorTypes = {
                NETWORK_ERROR: "networkError",
                MEDIA_ERROR: "mediaError",
                MUX_ERROR: "muxError",
                OTHER_ERROR: "otherError"
            }, r.ErrorDetails = {
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
                FRAG_LOOP_LOADING_ERROR: "fragLoopLoadingError",
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
                INTERNAL_EXCEPTION: "internalException",
                WEBVTT_EXCEPTION: "webVTTException"
            }
        }, {}],
        34: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                },
                n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = e(54),
                o = e(33),
                l = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(35)),
                u = function() {
                    function e(t) {
                        a(this, e), this.hls = t, this.onEvent = this.onEvent.bind(this);
                        for (var r = arguments.length, i = Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++) i[n - 1] = arguments[n];
                        this.handledEvents = i, this.useGenericHandler = !0, this.registerListeners()
                    }
                    return n(e, [{
                        key: "destroy",
                        value: function() {
                            this.unregisterListeners()
                        }
                    }, {
                        key: "isEventHandler",
                        value: function() {
                            return "object" === i(this.handledEvents) && this.handledEvents.length && "function" == typeof this.onEvent
                        }
                    }, {
                        key: "registerListeners",
                        value: function() {
                            this.isEventHandler() && this.handledEvents.forEach(function(e) {
                                if ("hlsEventGeneric" === e) throw new Error("Forbidden event name: " + e);
                                this.hls.on(e, this.onEvent)
                            }, this)
                        }
                    }, {
                        key: "unregisterListeners",
                        value: function() {
                            this.isEventHandler() && this.handledEvents.forEach(function(e) {
                                this.hls.off(e, this.onEvent)
                            }, this)
                        }
                    }, {
                        key: "onEvent",
                        value: function(e, t) {
                            this.onEventGeneric(e, t)
                        }
                    }, {
                        key: "onEventGeneric",
                        value: function(e, t) {
                            try {
                                (function(e, t) {
                                    var r = "on" + e.replace("hls", "");
                                    if ("function" != typeof this[r]) throw new Error("Event " + e + " has no generic handler in this " + this.constructor.name + " class (tried " + r + ")");
                                    return this[r].bind(this, t)
                                }).call(this, e, t).call()
                            } catch (t) {
                                s.logger.error("internal error happened while processing " + e + ":" + t.message), this.hls.trigger(l.default.ERROR, {
                                    type: o.ErrorTypes.OTHER_ERROR,
                                    details: o.ErrorDetails.INTERNAL_EXCEPTION,
                                    fatal: !1,
                                    event: e,
                                    err: t
                                })
                            }
                        }
                    }]), e
                }();
            r.default = u
        }, {
            33: 33,
            35: 35,
            54: 54
        }],
        35: [function(e, t, r) {
            "use strict";
            t.exports = {
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
                LEVEL_SWITCH: "hlsLevelSwitch",
                LEVEL_SWITCHING: "hlsLevelSwitching",
                LEVEL_SWITCHED: "hlsLevelSwitched",
                LEVEL_LOADING: "hlsLevelLoading",
                LEVEL_LOADED: "hlsLevelLoaded",
                LEVEL_UPDATED: "hlsLevelUpdated",
                LEVEL_PTS_UPDATED: "hlsLevelPtsUpdated",
                AUDIO_TRACKS_UPDATED: "hlsAudioTracksUpdated",
                AUDIO_TRACK_SWITCH: "hlsAudioTrackSwitch",
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
                DESTROYING: "hlsDestroying",
                KEY_LOADING: "hlsKeyLoading",
                KEY_LOADED: "hlsKeyLoaded",
                STREAM_STATE_TRANSITION: "hlsStreamStateTransition"
            }
        }, {}],
        36: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e() {
                        a(this, e)
                    }
                    return i(e, null, [{
                        key: "getSilentFrame",
                        value: function(e, t) {
                            switch (e) {
                                case "mp4a.40.2":
                                    if (1 === t) return new Uint8Array([0, 200, 0, 128, 35, 128]);
                                    if (2 === t) return new Uint8Array([33, 0, 73, 144, 2, 25, 0, 35, 128]);
                                    if (3 === t) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 142]);
                                    if (4 === t) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 128, 44, 128, 8, 2, 56]);
                                    if (5 === t) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 56]);
                                    if (6 === t) return new Uint8Array([0, 200, 0, 128, 32, 132, 1, 38, 64, 8, 100, 0, 130, 48, 4, 153, 0, 33, 144, 2, 0, 178, 0, 32, 8, 224]);
                                    break;
                                default:
                                    if (1 === t) return new Uint8Array([1, 64, 34, 128, 163, 78, 230, 128, 186, 8, 0, 0, 0, 28, 6, 241, 193, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
                                    if (2 === t) return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94]);
                                    if (3 === t) return new Uint8Array([1, 64, 34, 128, 163, 94, 230, 128, 186, 8, 0, 0, 0, 0, 149, 0, 6, 241, 161, 10, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 94])
                            }
                            return null
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        37: [function(e, t, r) {
            "use strict";
            var a = {
                isBuffered: function(e, t) {
                    if (e)
                        for (var r = e.buffered, a = 0; a < r.length; a++)
                            if (t >= r.start(a) && t <= r.end(a)) return !0;
                    return !1
                },
                bufferInfo: function(e, t, r) {
                    if (e) {
                        var a, i = e.buffered,
                            n = [];
                        for (a = 0; a < i.length; a++) n.push({
                            start: i.start(a),
                            end: i.end(a)
                        });
                        return this.bufferedInfo(n, t, r)
                    }
                    return {
                        len: 0,
                        start: t,
                        end: t,
                        nextStart: void 0
                    }
                },
                bufferedInfo: function(e, t, r) {
                    var a, i, n, s, o, l = [];
                    for (e.sort(function(e, t) {
                            var r = e.start - t.start;
                            return r || t.end - e.end
                        }), o = 0; o < e.length; o++) {
                        var u = l.length;
                        if (u) {
                            var d = l[u - 1].end;
                            e[o].start - d < r ? e[o].end > d && (l[u - 1].end = e[o].end) : l.push(e[o])
                        } else l.push(e[o])
                    }
                    for (o = 0, a = 0, i = n = t; o < l.length; o++) {
                        var f = l[o].start,
                            c = l[o].end;
                        if (t + r >= f && t < c) i = f, a = (n = c) - t;
                        else if (t + r < f) {
                            s = f;
                            break
                        }
                    }
                    return {
                        len: a,
                        start: i,
                        end: n,
                        nextStart: s
                    }
                }
            };
            t.exports = a
        }, {}],
        38: [function(e, t, r) {
            "use strict";
            var a = e(54),
                i = {
                    mergeDetails: function(e, t) {
                        var r, n = Math.max(e.startSN, t.startSN) - t.startSN,
                            s = Math.min(e.endSN, t.endSN) - t.startSN,
                            o = t.startSN - e.startSN,
                            l = e.fragments,
                            u = t.fragments,
                            d = 0;
                        if (s < n) t.PTSKnown = !1;
                        else {
                            for (var f = n; f <= s; f++) {
                                var c = l[o + f],
                                    h = u[f];
                                h && c && (d = c.cc - h.cc, isNaN(c.startPTS) || (h.start = h.startPTS = c.startPTS, h.endPTS = c.endPTS, h.duration = c.duration, h.backtracked = c.backtracked, h.dropped = c.dropped, r = h))
                            }
                            if (d)
                                for (a.logger.log("discontinuity sliding from playlist, take drift into account"), f = 0; f < u.length; f++) u[f].cc += d;
                            if (r) i.updateFragPTSDTS(t, r, r.startPTS, r.endPTS, r.startDTS, r.endDTS);
                            else if (o >= 0 && o < l.length) {
                                var g = l[o].start;
                                for (f = 0; f < u.length; f++) u[f].start += g
                            }
                            t.PTSKnown = e.PTSKnown
                        }
                    },
                    updateFragPTSDTS: function(e, t, r, a, n, s) {
                        var o = r;
                        if (!isNaN(t.startPTS)) {
                            var l = Math.abs(t.startPTS - r);
                            isNaN(t.deltaPTS) ? t.deltaPTS = l : t.deltaPTS = Math.max(l, t.deltaPTS), o = Math.max(r, t.startPTS), r = Math.min(r, t.startPTS), a = Math.max(a, t.endPTS), n = Math.min(n, t.startDTS), s = Math.max(s, t.endDTS)
                        }
                        var u = r - t.start;
                        t.start = t.startPTS = r, t.maxStartPTS = o, t.endPTS = a, t.startDTS = n, t.endDTS = s, t.duration = a - r;
                        var d = t.sn;
                        if (!e || d < e.startSN || d > e.endSN) return 0;
                        var f, c, h;
                        for (f = d - e.startSN, (c = e.fragments)[f] = t, h = f; h > 0; h--) i.updatePTS(c, h, h - 1);
                        for (h = f; h < c.length - 1; h++) i.updatePTS(c, h, h + 1);
                        return e.PTSKnown = !0, u
                    },
                    updatePTS: function(e, t, r) {
                        var i = e[t],
                            n = e[r],
                            s = n.startPTS;
                        isNaN(s) ? n.start = r > t ? i.start + i.duration : Math.max(i.start - n.duration, 0) : r > t ? (i.duration = s - i.start, i.duration < 0 && a.logger.warn("negative duration computed for frag " + i.sn + ",level " + i.level + ", there should be some duration drift between playlist and fragment!")) : (n.duration = i.start - s, n.duration < 0 && a.logger.warn("negative duration computed for frag " + n.sn + ",level " + n.level + ", there should be some duration drift between playlist and fragment!"))
                    }
                };
            t.exports = i
        }, {
            54: 54
        }],
        39: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(2)),
                o = a(e(35)),
                l = e(33),
                u = a(e(43)),
                d = a(e(41)),
                f = a(e(42)),
                c = a(e(13)),
                h = a(e(12)),
                g = a(e(11)),
                v = e(54),
                p = a(e(1)),
                y = e(4),
                m = function() {
                    function e() {
                        var t = this,
                            r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        i(this, e);
                        var a = e.DefaultConfig;
                        if ((r.liveSyncDurationCount || r.liveMaxLatencyDurationCount) && (r.liveSyncDuration || r.liveMaxLatencyDuration)) throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");
                        for (var n in a) n in r || (r[n] = a[n]);
                        if (void 0 !== r.liveMaxLatencyDurationCount && r.liveMaxLatencyDurationCount <= r.liveSyncDurationCount) throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');
                        if (void 0 !== r.liveMaxLatencyDuration && (r.liveMaxLatencyDuration <= r.liveSyncDuration || void 0 === r.liveSyncDuration)) throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');
                        (0, v.enableLogs)(r.debug), this.config = r, this._autoLevelCapping = -1;
                        var s = this.observer = new p.default;
                        s.trigger = function(e) {
                            for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) r[a - 1] = arguments[a];
                            s.emit.apply(s, [e, e].concat(r))
                        }, s.off = function(e) {
                            for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) r[a - 1] = arguments[a];
                            s.removeListener.apply(s, [e].concat(r))
                        }, this.on = s.on.bind(s), this.off = s.off.bind(s), this.trigger = s.trigger.bind(s);
                        var o = this.abrController = new r.abrController(this),
                            l = new r.bufferController(this),
                            y = new r.capLevelController(this),
                            m = new r.fpsController(this),
                            E = new u.default(this),
                            b = new d.default(this),
                            T = new f.default(this),
                            k = new g.default(this),
                            _ = [this.levelController = new h.default(this), this.streamController = new c.default(this)],
                            R = r.audioStreamController;
                        R && _.push(new R(this)), this.networkControllers = _;
                        var S = [E, b, T, o, l, y, m, k];
                        if (R = r.audioTrackController) {
                            var A = new R(this);
                            this.audioTrackController = A, S.push(A)
                        }
                        if (R = r.subtitleTrackController) {
                            var L = new R(this);
                            this.subtitleTrackController = L, S.push(L)
                        } [r.subtitleStreamController, r.timelineController].forEach(function(e) {
                            e && S.push(new e(t))
                        }), this.coreComponents = S
                    }
                    return n(e, null, [{
                        key: "isSupported",
                        value: function() {
                            var e = window.MediaSource = window.MediaSource || window.WebKitMediaSource,
                                t = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer,
                                r = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),
                                a = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
                            return r && a
                        }
                    }, {
                        key: "version",
                        get: function() {
                            return "0.7.11"
                        }
                    }, {
                        key: "Events",
                        get: function() {
                            return o.default
                        }
                    }, {
                        key: "ErrorTypes",
                        get: function() {
                            return l.ErrorTypes
                        }
                    }, {
                        key: "ErrorDetails",
                        get: function() {
                            return l.ErrorDetails
                        }
                    }, {
                        key: "DefaultConfig",
                        get: function() {
                            return e.defaultConfig ? e.defaultConfig : y.hlsDefaultConfig
                        },
                        set: function(t) {
                            e.defaultConfig = t
                        }
                    }]), n(e, [{
                        key: "destroy",
                        value: function() {
                            v.logger.log("destroy"), this.trigger(o.default.DESTROYING), this.detachMedia(), this.coreComponents.concat(this.networkControllers).forEach(function(e) {
                                e.destroy()
                            }), this.url = null, this.observer.removeAllListeners(), this._autoLevelCapping = -1
                        }
                    }, {
                        key: "attachMedia",
                        value: function(e) {
                            v.logger.log("attachMedia"), this.media = e, this.trigger(o.default.MEDIA_ATTACHING, {
                                media: e
                            })
                        }
                    }, {
                        key: "detachMedia",
                        value: function() {
                            v.logger.log("detachMedia"), this.trigger(o.default.MEDIA_DETACHING), this.media = null
                        }
                    }, {
                        key: "loadSource",
                        value: function(e) {
                            e = s.default.buildAbsoluteURL(window.location.href, e, {
                                alwaysNormalize: !0
                            }), v.logger.log("loadSource:" + e), this.url = e, this.trigger(o.default.MANIFEST_LOADING, {
                                url: e
                            })
                        }
                    }, {
                        key: "startLoad",
                        value: function() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1;
                            v.logger.log("startLoad(" + e + ")"), this.networkControllers.forEach(function(t) {
                                t.startLoad(e)
                            })
                        }
                    }, {
                        key: "stopLoad",
                        value: function() {
                            v.logger.log("stopLoad"), this.networkControllers.forEach(function(e) {
                                e.stopLoad()
                            })
                        }
                    }, {
                        key: "swapAudioCodec",
                        value: function() {
                            v.logger.log("swapAudioCodec"), this.streamController.swapAudioCodec()
                        }
                    }, {
                        key: "recoverMediaError",
                        value: function() {
                            v.logger.log("recoverMediaError");
                            var e = this.media;
                            this.detachMedia(), this.attachMedia(e)
                        }
                    }, {
                        key: "levels",
                        get: function() {
                            return this.levelController.levels
                        }
                    }, {
                        key: "currentLevel",
                        get: function() {
                            return this.streamController.currentLevel
                        },
                        set: function(e) {
                            v.logger.log("set currentLevel:" + e), this.loadLevel = e, this.streamController.immediateLevelSwitch()
                        }
                    }, {
                        key: "nextLevel",
                        get: function() {
                            return this.streamController.nextLevel
                        },
                        set: function(e) {
                            v.logger.log("set nextLevel:" + e), this.levelController.manualLevel = e, this.streamController.nextLevelSwitch()
                        }
                    }, {
                        key: "loadLevel",
                        get: function() {
                            return this.levelController.level
                        },
                        set: function(e) {
                            v.logger.log("set loadLevel:" + e), this.levelController.manualLevel = e
                        }
                    }, {
                        key: "nextLoadLevel",
                        get: function() {
                            return this.levelController.nextLoadLevel
                        },
                        set: function(e) {
                            this.levelController.nextLoadLevel = e
                        }
                    }, {
                        key: "firstLevel",
                        get: function() {
                            return Math.max(this.levelController.firstLevel, this.minAutoLevel)
                        },
                        set: function(e) {
                            v.logger.log("set firstLevel:" + e), this.levelController.firstLevel = e
                        }
                    }, {
                        key: "startLevel",
                        get: function() {
                            return this.levelController.startLevel
                        },
                        set: function(e) {
                            v.logger.log("set startLevel:" + e);
                            var t = this; - 1 !== e && (e = Math.max(e, t.minAutoLevel)), t.levelController.startLevel = e
                        }
                    }, {
                        key: "autoLevelCapping",
                        get: function() {
                            return this._autoLevelCapping
                        },
                        set: function(e) {
                            v.logger.log("set autoLevelCapping:" + e), this._autoLevelCapping = e
                        }
                    }, {
                        key: "autoLevelEnabled",
                        get: function() {
                            return -1 === this.levelController.manualLevel
                        }
                    }, {
                        key: "manualLevel",
                        get: function() {
                            return this.levelController.manualLevel
                        }
                    }, {
                        key: "minAutoLevel",
                        get: function() {
                            for (var e = this, t = e.levels, r = e.config.minAutoBitrate, a = t ? t.length : 0, i = 0; i < a; i++)
                                if ((t[i].realBitrate ? Math.max(t[i].realBitrate, t[i].bitrate) : t[i].bitrate) > r) return i;
                            return 0
                        }
                    }, {
                        key: "maxAutoLevel",
                        get: function() {
                            var e = this,
                                t = e.levels,
                                r = e.autoLevelCapping;
                            return -1 === r && t && t.length ? t.length - 1 : r
                        }
                    }, {
                        key: "nextAutoLevel",
                        get: function() {
                            var e = this;
                            return Math.min(Math.max(e.abrController.nextAutoLevel, e.minAutoLevel), e.maxAutoLevel)
                        },
                        set: function(e) {
                            var t = this;
                            t.abrController.nextAutoLevel = Math.max(t.minAutoLevel, e)
                        }
                    }, {
                        key: "audioTracks",
                        get: function() {
                            var e = this.audioTrackController;
                            return e ? e.audioTracks : []
                        }
                    }, {
                        key: "audioTrack",
                        get: function() {
                            var e = this.audioTrackController;
                            return e ? e.audioTrack : -1
                        },
                        set: function(e) {
                            var t = this.audioTrackController;
                            t && (t.audioTrack = e)
                        }
                    }, {
                        key: "liveSyncPosition",
                        get: function() {
                            return this.streamController.liveSyncPosition
                        }
                    }, {
                        key: "subtitleTracks",
                        get: function() {
                            var e = this.subtitleTrackController;
                            return e ? e.subtitleTracks : []
                        }
                    }, {
                        key: "subtitleTrack",
                        get: function() {
                            var e = this.subtitleTrackController;
                            return e ? e.subtitleTrack : -1
                        },
                        set: function(e) {
                            var t = this.subtitleTrackController;
                            t && (t.subtitleTrack = e)
                        }
                    }]), e
                }();
            r.default = m
        }, {
            1: 1,
            11: 11,
            12: 12,
            13: 13,
            2: 2,
            33: 33,
            35: 35,
            4: 4,
            41: 41,
            42: 42,
            43: 43,
            54: 54
        }],
        40: [function(e, t, r) {
            "use strict";
            t.exports = e(39).default
        }, {
            39: 39
        }],
        41: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(33),
                f = e(54),
                c = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.FRAG_LOADING));
                        return r.loaders = {}, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            var e = this.loaders;
                            for (var t in e) {
                                var r = e[t];
                                r && r.destroy()
                            }
                            this.loaders = {}, u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onFragLoading",
                        value: function(e) {
                            var t = e.frag,
                                r = t.type,
                                a = this.loaders[r],
                                i = this.hls.config;
                            t.loaded = 0, a && (f.logger.warn("abort previous fragment loader for type:" + r), a.abort()), a = this.loaders[r] = t.loader = void 0 !== i.fLoader ? new i.fLoader(i) : new i.loader(i);
                            var n = void 0,
                                s = void 0,
                                o = void 0;
                            n = {
                                url: t.url,
                                frag: t,
                                responseType: "arraybuffer",
                                progressData: !1
                            };
                            var l = t.byteRangeStartOffset,
                                u = t.byteRangeEndOffset;
                            isNaN(l) || isNaN(u) || (n.rangeStart = l, n.rangeEnd = u), s = {
                                timeout: i.fragLoadingTimeOut,
                                maxRetry: 0,
                                retryDelay: 0,
                                maxRetryDelay: i.fragLoadingMaxRetryTimeout
                            }, o = {
                                onSuccess: this.loadsuccess.bind(this),
                                onError: this.loaderror.bind(this),
                                onTimeout: this.loadtimeout.bind(this),
                                onProgress: this.loadprogress.bind(this)
                            }, a.load(n, s, o)
                        }
                    }, {
                        key: "loadsuccess",
                        value: function(e, t, r) {
                            var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                                i = e.data,
                                n = r.frag;
                            n.loader = void 0, this.loaders[n.type] = void 0, this.hls.trigger(l.default.FRAG_LOADED, {
                                payload: i,
                                frag: n,
                                stats: t,
                                networkDetails: a
                            })
                        }
                    }, {
                        key: "loaderror",
                        value: function(e, t) {
                            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                                a = t.loader;
                            a && a.abort(), this.loaders[t.type] = void 0, this.hls.trigger(l.default.ERROR, {
                                type: d.ErrorTypes.NETWORK_ERROR,
                                details: d.ErrorDetails.FRAG_LOAD_ERROR,
                                fatal: !1,
                                frag: t.frag,
                                response: e,
                                networkDetails: r
                            })
                        }
                    }, {
                        key: "loadtimeout",
                        value: function(e, t) {
                            var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                                a = t.loader;
                            a && a.abort(), this.loaders[t.type] = void 0, this.hls.trigger(l.default.ERROR, {
                                type: d.ErrorTypes.NETWORK_ERROR,
                                details: d.ErrorDetails.FRAG_LOAD_TIMEOUT,
                                fatal: !1,
                                frag: t.frag,
                                networkDetails: r
                            })
                        }
                    }, {
                        key: "loadprogress",
                        value: function(e, t, r) {
                            var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                                i = t.frag;
                            i.loaded = e.loaded, this.hls.trigger(l.default.FRAG_LOAD_PROGRESS, {
                                frag: i,
                                stats: e,
                                networkDetails: a
                            })
                        }
                    }]), t
                }(u.default);
            r.default = c
        }, {
            33: 33,
            34: 34,
            35: 35,
            54: 54
        }],
        42: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }

            function n(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(35)),
                u = a(e(34)),
                d = e(33),
                f = e(54),
                c = function(e) {
                    function t(e) {
                        i(this, t);
                        var r = n(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, l.default.KEY_LOADING));
                        return r.loaders = {}, r.decryptkey = null, r.decrypturl = null, r
                    }
                    return s(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            for (var e in this.loaders) {
                                var t = this.loaders[e];
                                t && t.destroy()
                            }
                            this.loaders = {}, u.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onKeyLoading",
                        value: function(e) {
                            var t = e.frag,
                                r = t.type,
                                a = this.loaders[r],
                                i = t.decryptdata,
                                n = i.uri;
                            if (n !== this.decrypturl || null === this.decryptkey) {
                                var s = this.hls.config;
                                a && (f.logger.warn("abort previous key loader for type:" + r), a.abort()), t.loader = this.loaders[r] = new s.loader(s), this.decrypturl = n, this.decryptkey = null;
                                var o = void 0,
                                    u = void 0,
                                    d = void 0;
                                o = {
                                    url: n,
                                    frag: t,
                                    responseType: "arraybuffer"
                                }, u = {
                                    timeout: s.fragLoadingTimeOut,
                                    maxRetry: s.fragLoadingMaxRetry,
                                    retryDelay: s.fragLoadingRetryDelay,
                                    maxRetryDelay: s.fragLoadingMaxRetryTimeout
                                }, d = {
                                    onSuccess: this.loadsuccess.bind(this),
                                    onError: this.loaderror.bind(this),
                                    onTimeout: this.loadtimeout.bind(this)
                                }, t.loader.load(o, u, d)
                            } else this.decryptkey && (i.key = this.decryptkey, this.hls.trigger(l.default.KEY_LOADED, {
                                frag: t
                            }))
                        }
                    }, {
                        key: "loadsuccess",
                        value: function(e, t, r) {
                            var a = r.frag;
                            this.decryptkey = a.decryptdata.key = new Uint8Array(e.data), a.loader = void 0, this.loaders[a.type] = void 0, this.hls.trigger(l.default.KEY_LOADED, {
                                frag: a
                            })
                        }
                    }, {
                        key: "loaderror",
                        value: function(e, t) {
                            var r = t.frag,
                                a = r.loader;
                            a && a.abort(), this.loaders[t.type] = void 0, this.hls.trigger(l.default.ERROR, {
                                type: d.ErrorTypes.NETWORK_ERROR,
                                details: d.ErrorDetails.KEY_LOAD_ERROR,
                                fatal: !1,
                                frag: r,
                                response: e
                            })
                        }
                    }, {
                        key: "loadtimeout",
                        value: function(e, t) {
                            var r = t.frag,
                                a = r.loader;
                            a && a.abort(), this.loaders[t.type] = void 0, this.hls.trigger(l.default.ERROR, {
                                type: d.ErrorTypes.NETWORK_ERROR,
                                details: d.ErrorDetails.KEY_LOAD_TIMEOUT,
                                fatal: !1,
                                frag: r
                            })
                        }
                    }]), t
                }(u.default);
            r.default = c
        }, {
            33: 33,
            34: 34,
            35: 35,
            54: 54
        }],
        43: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }

            function n(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }

            function s(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                l = a(e(2)),
                u = a(e(35)),
                d = a(e(34)),
                f = e(33),
                c = a(e(47)),
                h = e(54),
                g = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g,
                v = /#EXT-X-MEDIA:(.*)/g,
                p = new RegExp([/#EXTINF:(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)(\S+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""), "g"),
                y = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/,
                m = function() {
                    function e() {
                        s(this, e), this.method = null, this.key = null, this.iv = null, this._uri = null
                    }
                    return o(e, [{
                        key: "uri",
                        get: function() {
                            return !this._uri && this.reluri && (this._uri = l.default.buildAbsoluteURL(this.baseuri, this.reluri, {
                                alwaysNormalize: !0
                            })), this._uri
                        }
                    }]), e
                }(),
                E = function() {
                    function e() {
                        s(this, e), this._url = null, this._byteRange = null, this._decryptdata = null, this.tagList = []
                    }
                    return o(e, [{
                        key: "createInitializationVector",
                        value: function(e) {
                            for (var t = new Uint8Array(16), r = 12; r < 16; r++) t[r] = e >> 8 * (15 - r) & 255;
                            return t
                        }
                    }, {
                        key: "fragmentDecryptdataFromLevelkey",
                        value: function(e, t) {
                            var r = e;
                            return e && e.method && e.uri && !e.iv && ((r = new m).method = e.method, r.baseuri = e.baseuri, r.reluri = e.reluri, r.iv = this.createInitializationVector(t)), r
                        }
                    }, {
                        key: "cloneObj",
                        value: function(e) {
                            return JSON.parse(JSON.stringify(e))
                        }
                    }, {
                        key: "url",
                        get: function() {
                            return !this._url && this.relurl && (this._url = l.default.buildAbsoluteURL(this.baseurl, this.relurl, {
                                alwaysNormalize: !0
                            })), this._url
                        },
                        set: function(e) {
                            this._url = e
                        }
                    }, {
                        key: "programDateTime",
                        get: function() {
                            return !this._programDateTime && this.rawProgramDateTime && (this._programDateTime = new Date(Date.parse(this.rawProgramDateTime))), this._programDateTime
                        }
                    }, {
                        key: "byteRange",
                        get: function() {
                            if (!this._byteRange) {
                                var e = this._byteRange = [];
                                if (this.rawByteRange) {
                                    var t = this.rawByteRange.split("@", 2);
                                    if (1 === t.length) {
                                        var r = this.lastByteRangeEndOffset;
                                        e[0] = r || 0
                                    } else e[0] = parseInt(t[1]);
                                    e[1] = parseInt(t[0]) + e[0]
                                }
                            }
                            return this._byteRange
                        }
                    }, {
                        key: "byteRangeStartOffset",
                        get: function() {
                            return this.byteRange[0]
                        }
                    }, {
                        key: "byteRangeEndOffset",
                        get: function() {
                            return this.byteRange[1]
                        }
                    }, {
                        key: "decryptdata",
                        get: function() {
                            return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)), this._decryptdata
                        }
                    }]), e
                }(),
                b = function(e) {
                    function t(e) {
                        s(this, t);
                        var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, u.default.MANIFEST_LOADING, u.default.LEVEL_LOADING, u.default.AUDIO_TRACK_LOADING, u.default.SUBTITLE_TRACK_LOADING));
                        return r.loaders = {}, r
                    }
                    return n(t, e), o(t, [{
                        key: "destroy",
                        value: function() {
                            for (var e in this.loaders) {
                                var t = this.loaders[e];
                                t && t.destroy()
                            }
                            this.loaders = {}, d.default.prototype.destroy.call(this)
                        }
                    }, {
                        key: "onManifestLoading",
                        value: function(e) {
                            this.load(e.url, {
                                type: "manifest"
                            })
                        }
                    }, {
                        key: "onLevelLoading",
                        value: function(e) {
                            this.load(e.url, {
                                type: "level",
                                level: e.level,
                                id: e.id
                            })
                        }
                    }, {
                        key: "onAudioTrackLoading",
                        value: function(e) {
                            this.load(e.url, {
                                type: "audioTrack",
                                id: e.id
                            })
                        }
                    }, {
                        key: "onSubtitleTrackLoading",
                        value: function(e) {
                            this.load(e.url, {
                                type: "subtitleTrack",
                                id: e.id
                            })
                        }
                    }, {
                        key: "load",
                        value: function(e, t) {
                            var r = this.loaders[t.type];
                            if (r) {
                                var a = r.context;
                                if (a && a.url === e) return void h.logger.trace("playlist request ongoing");
                                h.logger.warn("abort previous loader for type:" + t.type), r.abort()
                            }
                            var i = this.hls.config,
                                n = void 0,
                                s = void 0,
                                o = void 0,
                                l = void 0;
                            "manifest" === t.type ? (n = i.manifestLoadingMaxRetry, s = i.manifestLoadingTimeOut, o = i.manifestLoadingRetryDelay, l = i.manifestLoadingMaxRetryTimeout) : (n = i.levelLoadingMaxRetry, s = i.levelLoadingTimeOut, o = i.levelLoadingRetryDelay, l = i.levelLoadingMaxRetryTimeout, h.logger.log("loading playlist for " + t.type + " " + (t.level || t.id))), r = this.loaders[t.type] = t.loader = void 0 !== i.pLoader ? new i.pLoader(i) : new i.loader(i), t.url = e, t.responseType = "";
                            var u = void 0,
                                d = void 0;
                            u = {
                                timeout: s,
                                maxRetry: n,
                                retryDelay: o,
                                maxRetryDelay: l
                            }, d = {
                                onSuccess: this.loadsuccess.bind(this),
                                onError: this.loaderror.bind(this),
                                onTimeout: this.loadtimeout.bind(this)
                            }, r.load(t, u, d)
                        }
                    }, {
                        key: "resolve",
                        value: function(e, t) {
                            return l.default.buildAbsoluteURL(t, e, {
                                alwaysNormalize: !0
                            })
                        }
                    }, {
                        key: "parseMasterPlaylist",
                        value: function(e, t) {
                            var r = [],
                                a = void 0;
                            for (g.lastIndex = 0; null != (a = g.exec(e));) {
                                var i = {},
                                    n = i.attrs = new c.default(a[1]);
                                i.url = this.resolve(a[2], t);
                                var s = n.decimalResolution("RESOLUTION");
                                s && (i.width = s.width, i.height = s.height), i.bitrate = n.decimalInteger("AVERAGE-BANDWIDTH") || n.decimalInteger("BANDWIDTH"), i.name = n.NAME;
                                var o = n.CODECS;
                                if (o) {
                                    o = o.split(/[ ,]+/);
                                    for (var l = 0; l < o.length; l++) {
                                        var u = o[l]; - 1 !== u.indexOf("avc1") ? i.videoCodec = this.avc1toavcoti(u) : -1 !== u.indexOf("hvc1") ? i.videoCodec = u : i.audioCodec = u
                                    }
                                }
                                r.push(i)
                            }
                            return r
                        }
                    }, {
                        key: "parseMasterPlaylistMedia",
                        value: function(e, t, r) {
                            var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                                i = void 0,
                                n = [],
                                s = 0;
                            for (v.lastIndex = 0; null != (i = v.exec(e));) {
                                var o = {},
                                    l = new c.default(i[1]);
                                l.TYPE === r && (o.groupId = l["GROUP-ID"], o.name = l.NAME, o.type = r, o.default = "YES" === l.DEFAULT, o.autoselect = "YES" === l.AUTOSELECT, o.forced = "YES" === l.FORCED, l.URI && (o.url = this.resolve(l.URI, t)), o.lang = l.LANGUAGE, o.name || (o.name = o.lang), a && (o.audioCodec = a), o.id = s++, n.push(o))
                            }
                            return n
                        }
                    }, {
                        key: "avc1toavcoti",
                        value: function(e) {
                            var t, r = e.split(".");
                            return r.length > 2 ? (t = r.shift() + ".", t += parseInt(r.shift()).toString(16), t += ("000" + parseInt(r.shift()).toString(16)).substr(-4)) : t = e, t
                        }
                    }, {
                        key: "parseLevelPlaylist",
                        value: function(e, t, r, a) {
                            var i, n, s = 0,
                                o = 0,
                                l = {
                                    type: null,
                                    version: null,
                                    url: t,
                                    fragments: [],
                                    live: !0,
                                    startSN: 0
                                },
                                u = new m,
                                d = 0,
                                f = null,
                                g = new E;
                            for (p.lastIndex = 0; null !== (i = p.exec(e));) {
                                var v = i[1];
                                if (v) {
                                    g.duration = parseFloat(v);
                                    var b = (" " + i[2]).slice(1);
                                    g.title = b || null, g.tagList.push(b ? ["INF", v, b] : ["INF", v])
                                } else if (i[3]) {
                                    if (!isNaN(g.duration)) {
                                        var T = s++;
                                        g.type = a, g.start = o, g.levelkey = u, g.sn = T, g.level = r, g.cc = d, g.baseurl = t, g.relurl = (" " + i[3]).slice(1), l.fragments.push(g), f = g, o += g.duration, g = new E
                                    }
                                } else if (i[4]) {
                                    if (g.rawByteRange = (" " + i[4]).slice(1), f) {
                                        var k = f.byteRangeEndOffset;
                                        k && (g.lastByteRangeEndOffset = k)
                                    }
                                } else if (i[5]) g.rawProgramDateTime = (" " + i[5]).slice(1), g.tagList.push(["PROGRAM-DATE-TIME", g.rawProgramDateTime]);
                                else {
                                    for (i = i[0].match(y), n = 1; n < i.length && void 0 === i[n]; n++);
                                    var _ = (" " + i[n + 1]).slice(1),
                                        R = (" " + i[n + 2]).slice(1);
                                    switch (i[n]) {
                                        case "#":
                                            g.tagList.push(R ? [_, R] : [_]);
                                            break;
                                        case "PLAYLIST-TYPE":
                                            l.type = _.toUpperCase();
                                            break;
                                        case "MEDIA-SEQUENCE":
                                            s = l.startSN = parseInt(_);
                                            break;
                                        case "TARGETDURATION":
                                            l.targetduration = parseFloat(_);
                                            break;
                                        case "VERSION":
                                            l.version = parseInt(_);
                                            break;
                                        case "EXTM3U":
                                            break;
                                        case "ENDLIST":
                                            l.live = !1;
                                            break;
                                        case "DIS":
                                            d++, g.tagList.push(["DIS"]);
                                            break;
                                        case "DISCONTINUITY-SEQ":
                                            d = parseInt(_);
                                            break;
                                        case "KEY":
                                            var S = _,
                                                A = new c.default(S),
                                                L = A.enumeratedString("METHOD"),
                                                w = A.URI,
                                                D = A.hexadecimalInteger("IV");
                                            L && (u = new m, w && ["AES-128", "SAMPLE-AES"].indexOf(L) >= 0 && (u.method = L, u.baseuri = t, u.reluri = w, u.key = null, u.iv = D));
                                            break;
                                        case "START":
                                            var O = _,
                                                I = new c.default(O).decimalFloatingPoint("TIME-OFFSET");
                                            isNaN(I) || (l.startTimeOffset = I);
                                            break;
                                        case "MAP":
                                            var P = new c.default(_);
                                            g.relurl = P.URI, g.rawByteRange = P.BYTERANGE, g.baseurl = t, g.level = r, g.type = a, g.sn = "initSegment", l.initSegment = g, g = new E;
                                            break;
                                        default:
                                            h.logger.warn("line parsed but not handled: " + i)
                                    }
                                }
                            }
                            return (g = f) && !g.relurl && (l.fragments.pop(), o -= g.duration), l.totalduration = o, l.averagetargetduration = o / l.fragments.length, l.endSN = s - 1, l
                        }
                    }, {
                        key: "loadsuccess",
                        value: function(e, t, r) {
                            var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null,
                                i = e.data,
                                n = e.url,
                                s = r.type,
                                o = r.id,
                                l = r.level,
                                d = this.hls;
                            if (this.loaders[s] = void 0, void 0 !== n && 0 !== n.indexOf("data:") || (n = r.url), t.tload = performance.now(), 0 === i.indexOf("#EXTM3U"))
                                if (i.indexOf("#EXTINF:") > 0) {
                                    var c = "audioTrack" !== s && "subtitleTrack" !== s,
                                        g = isNaN(l) ? isNaN(o) ? 0 : o : l,
                                        v = this.parseLevelPlaylist(i, n, g, "audioTrack" === s ? "audio" : "subtitleTrack" === s ? "subtitle" : "main");
                                    v.tload = t.tload, "manifest" === s && d.trigger(u.default.MANIFEST_LOADED, {
                                        levels: [{
                                            url: n,
                                            details: v
                                        }],
                                        audioTracks: [],
                                        url: n,
                                        stats: t,
                                        networkDetails: a
                                    }), t.tparsed = performance.now(), v.targetduration ? c ? d.trigger(u.default.LEVEL_LOADED, {
                                        details: v,
                                        level: l || 0,
                                        id: o || 0,
                                        stats: t,
                                        networkDetails: a
                                    }) : "audioTrack" === s ? d.trigger(u.default.AUDIO_TRACK_LOADED, {
                                        details: v,
                                        id: o,
                                        stats: t,
                                        networkDetails: a
                                    }) : "subtitleTrack" === s && d.trigger(u.default.SUBTITLE_TRACK_LOADED, {
                                        details: v,
                                        id: o,
                                        stats: t,
                                        networkDetails: a
                                    }) : d.trigger(u.default.ERROR, {
                                        type: f.ErrorTypes.NETWORK_ERROR,
                                        details: f.ErrorDetails.MANIFEST_PARSING_ERROR,
                                        fatal: !0,
                                        url: n,
                                        reason: "invalid targetduration",
                                        networkDetails: a
                                    })
                                } else {
                                    var p = this.parseMasterPlaylist(i, n);
                                    if (p.length) {
                                        var y = this.parseMasterPlaylistMedia(i, n, "AUDIO", p[0].audioCodec),
                                            m = this.parseMasterPlaylistMedia(i, n, "SUBTITLES");
                                        if (y.length) {
                                            var E = !1;
                                            y.forEach(function(e) {
                                                e.url || (E = !0)
                                            }), !1 === E && p[0].audioCodec && !p[0].attrs.AUDIO && (h.logger.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"), y.unshift({
                                                type: "main",
                                                name: "main"
                                            }))
                                        }
                                        d.trigger(u.default.MANIFEST_LOADED, {
                                            levels: p,
                                            audioTracks: y,
                                            subtitles: m,
                                            url: n,
                                            stats: t,
                                            networkDetails: a
                                        })
                                    } else d.trigger(u.default.ERROR, {
                                        type: f.ErrorTypes.NETWORK_ERROR,
                                        details: f.ErrorDetails.MANIFEST_PARSING_ERROR,
                                        fatal: !0,
                                        url: n,
                                        reason: "no level found in manifest",
                                        networkDetails: a
                                    })
                                }
                            else d.trigger(u.default.ERROR, {
                                type: f.ErrorTypes.NETWORK_ERROR,
                                details: f.ErrorDetails.MANIFEST_PARSING_ERROR,
                                fatal: !0,
                                url: n,
                                reason: "no EXTM3U delimiter",
                                networkDetails: a
                            })
                        }
                    }, {
                        key: "loaderror",
                        value: function(e, t) {
                            var r, a, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                                n = t.loader;
                            switch (t.type) {
                                case "manifest":
                                    r = f.ErrorDetails.MANIFEST_LOAD_ERROR, a = !0;
                                    break;
                                case "level":
                                    r = f.ErrorDetails.LEVEL_LOAD_ERROR, a = !1;
                                    break;
                                case "audioTrack":
                                    r = f.ErrorDetails.AUDIO_TRACK_LOAD_ERROR, a = !1
                            }
                            n && (n.abort(), this.loaders[t.type] = void 0), this.hls.trigger(u.default.ERROR, {
                                type: f.ErrorTypes.NETWORK_ERROR,
                                details: r,
                                fatal: a,
                                url: n.url,
                                loader: n,
                                response: e,
                                context: t,
                                networkDetails: i
                            })
                        }
                    }, {
                        key: "loadtimeout",
                        value: function(e, t) {
                            var r, a, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                                n = t.loader;
                            switch (t.type) {
                                case "manifest":
                                    r = f.ErrorDetails.MANIFEST_LOAD_TIMEOUT, a = !0;
                                    break;
                                case "level":
                                    r = f.ErrorDetails.LEVEL_LOAD_TIMEOUT, a = !1;
                                    break;
                                case "audioTrack":
                                    r = f.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT, a = !1
                            }
                            n && (n.abort(), this.loaders[t.type] = void 0), this.hls.trigger(u.default.ERROR, {
                                type: f.ErrorTypes.NETWORK_ERROR,
                                details: r,
                                fatal: a,
                                url: n.url,
                                loader: n,
                                context: t,
                                networkDetails: i
                            })
                        }
                    }]), t
                }(d.default);
            r.default = b
        }, {
            2: 2,
            33: 33,
            34: 34,
            35: 35,
            47: 47,
            54: 54
        }],
        44: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = Math.pow(2, 32) - 1,
                s = function() {
                    function e() {
                        a(this, e)
                    }
                    return i(e, null, [{
                        key: "init",
                        value: function() {
                            e.types = {
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
                            };
                            var t;
                            for (t in e.types) e.types.hasOwnProperty(t) && (e.types[t] = [t.charCodeAt(0), t.charCodeAt(1), t.charCodeAt(2), t.charCodeAt(3)]);
                            var r = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0]),
                                a = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0]);
                            e.HDLR_TYPES = {
                                video: r,
                                audio: a
                            };
                            var i = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1]),
                                n = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
                            e.STTS = e.STSC = e.STCO = n, e.STSZ = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), e.VMHD = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]), e.SMHD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]), e.STSD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
                            var s = new Uint8Array([105, 115, 111, 109]),
                                o = new Uint8Array([97, 118, 99, 49]),
                                l = new Uint8Array([0, 0, 0, 1]);
                            e.FTYP = e.box(e.types.ftyp, s, l, s, o), e.DINF = e.box(e.types.dinf, e.box(e.types.dref, i))
                        }
                    }, {
                        key: "box",
                        value: function(e) {
                            for (var t, r = Array.prototype.slice.call(arguments, 1), a = 8, i = r.length, n = i; i--;) a += r[i].byteLength;
                            for ((t = new Uint8Array(a))[0] = a >> 24 & 255, t[1] = a >> 16 & 255, t[2] = a >> 8 & 255, t[3] = 255 & a, t.set(e, 4), i = 0, a = 8; i < n; i++) t.set(r[i], a), a += r[i].byteLength;
                            return t
                        }
                    }, {
                        key: "hdlr",
                        value: function(t) {
                            return e.box(e.types.hdlr, e.HDLR_TYPES[t])
                        }
                    }, {
                        key: "mdat",
                        value: function(t) {
                            return e.box(e.types.mdat, t)
                        }
                    }, {
                        key: "mdhd",
                        value: function(t, r) {
                            r *= t;
                            var a = Math.floor(r / (n + 1)),
                                i = Math.floor(r % (n + 1));
                            return e.box(e.types.mdhd, new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, 85, 196, 0, 0]))
                        }
                    }, {
                        key: "mdia",
                        value: function(t) {
                            return e.box(e.types.mdia, e.mdhd(t.timescale, t.duration), e.hdlr(t.type), e.minf(t))
                        }
                    }, {
                        key: "mfhd",
                        value: function(t) {
                            return e.box(e.types.mfhd, new Uint8Array([0, 0, 0, 0, t >> 24, t >> 16 & 255, t >> 8 & 255, 255 & t]))
                        }
                    }, {
                        key: "minf",
                        value: function(t) {
                            return "audio" === t.type ? e.box(e.types.minf, e.box(e.types.smhd, e.SMHD), e.DINF, e.stbl(t)) : e.box(e.types.minf, e.box(e.types.vmhd, e.VMHD), e.DINF, e.stbl(t))
                        }
                    }, {
                        key: "moof",
                        value: function(t, r, a) {
                            return e.box(e.types.moof, e.mfhd(t), e.traf(a, r))
                        }
                    }, {
                        key: "moov",
                        value: function(t) {
                            for (var r = t.length, a = []; r--;) a[r] = e.trak(t[r]);
                            return e.box.apply(null, [e.types.moov, e.mvhd(t[0].timescale, t[0].duration)].concat(a).concat(e.mvex(t)))
                        }
                    }, {
                        key: "mvex",
                        value: function(t) {
                            for (var r = t.length, a = []; r--;) a[r] = e.trex(t[r]);
                            return e.box.apply(null, [e.types.mvex].concat(a))
                        }
                    }, {
                        key: "mvhd",
                        value: function(t, r) {
                            r *= t;
                            var a = Math.floor(r / (n + 1)),
                                i = Math.floor(r % (n + 1)),
                                s = new Uint8Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t, a >> 24, a >> 16 & 255, a >> 8 & 255, 255 & a, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255]);
                            return e.box(e.types.mvhd, s)
                        }
                    }, {
                        key: "sdtp",
                        value: function(t) {
                            var r, a, i = t.samples || [],
                                n = new Uint8Array(4 + i.length);
                            for (a = 0; a < i.length; a++) r = i[a].flags, n[a + 4] = r.dependsOn << 4 | r.isDependedOn << 2 | r.hasRedundancy;
                            return e.box(e.types.sdtp, n)
                        }
                    }, {
                        key: "stbl",
                        value: function(t) {
                            return e.box(e.types.stbl, e.stsd(t), e.box(e.types.stts, e.STTS), e.box(e.types.stsc, e.STSC), e.box(e.types.stsz, e.STSZ), e.box(e.types.stco, e.STCO))
                        }
                    }, {
                        key: "avc1",
                        value: function(t) {
                            var r, a, i, n = [],
                                s = [];
                            for (r = 0; r < t.sps.length; r++) i = (a = t.sps[r]).byteLength, n.push(i >>> 8 & 255), n.push(255 & i), n = n.concat(Array.prototype.slice.call(a));
                            for (r = 0; r < t.pps.length; r++) i = (a = t.pps[r]).byteLength, s.push(i >>> 8 & 255), s.push(255 & i), s = s.concat(Array.prototype.slice.call(a));
                            var o = e.box(e.types.avcC, new Uint8Array([1, n[3], n[4], n[5], 255, 224 | t.sps.length].concat(n).concat([t.pps.length]).concat(s))),
                                l = t.width,
                                u = t.height,
                                d = t.pixelRatio[0],
                                f = t.pixelRatio[1];
                            return e.box(e.types.avc1, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, l >> 8 & 255, 255 & l, u >> 8 & 255, 255 & u, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 18, 100, 97, 105, 108, 121, 109, 111, 116, 105, 111, 110, 47, 104, 108, 115, 46, 106, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]), o, e.box(e.types.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192])), e.box(e.types.pasp, new Uint8Array([d >> 24, d >> 16 & 255, d >> 8 & 255, 255 & d, f >> 24, f >> 16 & 255, f >> 8 & 255, 255 & f])))
                        }
                    }, {
                        key: "esds",
                        value: function(e) {
                            var t = e.config.length;
                            return new Uint8Array([0, 0, 0, 0, 3, 23 + t, 0, 1, 0, 4, 15 + t, 64, 21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5].concat([t]).concat(e.config).concat([6, 1, 2]))
                        }
                    }, {
                        key: "mp4a",
                        value: function(t) {
                            var r = t.samplerate;
                            return e.box(e.types.mp4a, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, t.channelCount, 0, 16, 0, 0, 0, 0, r >> 8 & 255, 255 & r, 0, 0]), e.box(e.types.esds, e.esds(t)))
                        }
                    }, {
                        key: "mp3",
                        value: function(t) {
                            var r = t.samplerate;
                            return e.box(e.types[".mp3"], new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, t.channelCount, 0, 16, 0, 0, 0, 0, r >> 8 & 255, 255 & r, 0, 0]))
                        }
                    }, {
                        key: "stsd",
                        value: function(t) {
                            return "audio" === t.type ? t.isAAC || "mp3" !== t.codec ? e.box(e.types.stsd, e.STSD, e.mp4a(t)) : e.box(e.types.stsd, e.STSD, e.mp3(t)) : e.box(e.types.stsd, e.STSD, e.avc1(t))
                        }
                    }, {
                        key: "tkhd",
                        value: function(t) {
                            var r = t.id,
                                a = t.duration * t.timescale,
                                i = t.width,
                                s = t.height,
                                o = Math.floor(a / (n + 1)),
                                l = Math.floor(a % (n + 1));
                            return e.box(e.types.tkhd, new Uint8Array([1, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, r >> 24 & 255, r >> 16 & 255, r >> 8 & 255, 255 & r, 0, 0, 0, 0, o >> 24, o >> 16 & 255, o >> 8 & 255, 255 & o, l >> 24, l >> 16 & 255, l >> 8 & 255, 255 & l, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, i >> 8 & 255, 255 & i, 0, 0, s >> 8 & 255, 255 & s, 0, 0]))
                        }
                    }, {
                        key: "traf",
                        value: function(t, r) {
                            var a = e.sdtp(t),
                                i = t.id,
                                s = Math.floor(r / (n + 1)),
                                o = Math.floor(r % (n + 1));
                            return e.box(e.types.traf, e.box(e.types.tfhd, new Uint8Array([0, 0, 0, 0, i >> 24, i >> 16 & 255, i >> 8 & 255, 255 & i])), e.box(e.types.tfdt, new Uint8Array([1, 0, 0, 0, s >> 24, s >> 16 & 255, s >> 8 & 255, 255 & s, o >> 24, o >> 16 & 255, o >> 8 & 255, 255 & o])), e.trun(t, a.length + 16 + 20 + 8 + 16 + 8 + 8), a)
                        }
                    }, {
                        key: "trak",
                        value: function(t) {
                            return t.duration = t.duration || 4294967295, e.box(e.types.trak, e.tkhd(t), e.mdia(t))
                        }
                    }, {
                        key: "trex",
                        value: function(t) {
                            var r = t.id;
                            return e.box(e.types.trex, new Uint8Array([0, 0, 0, 0, r >> 24, r >> 16 & 255, r >> 8 & 255, 255 & r, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]))
                        }
                    }, {
                        key: "trun",
                        value: function(t, r) {
                            var a, i, n, s, o, l, u = t.samples || [],
                                d = u.length,
                                f = 12 + 16 * d,
                                c = new Uint8Array(f);
                            for (r += 8 + f, c.set([0, 0, 15, 1, d >>> 24 & 255, d >>> 16 & 255, d >>> 8 & 255, 255 & d, r >>> 24 & 255, r >>> 16 & 255, r >>> 8 & 255, 255 & r], 0), a = 0; a < d; a++) n = (i = u[a]).duration, s = i.size, o = i.flags, l = i.cts, c.set([n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, 255 & n, s >>> 24 & 255, s >>> 16 & 255, s >>> 8 & 255, 255 & s, o.isLeading << 2 | o.dependsOn, o.isDependedOn << 6 | o.hasRedundancy << 4 | o.paddingValue << 1 | o.isNonSync, 61440 & o.degradPrio, 15 & o.degradPrio, l >>> 24 & 255, l >>> 16 & 255, l >>> 8 & 255, 255 & l], 12 + 16 * a);
                            return e.box(e.types.trun, c)
                        }
                    }, {
                        key: "initSegment",
                        value: function(t) {
                            e.types || e.init();
                            var r, a = e.moov(t);
                            return (r = new Uint8Array(e.FTYP.byteLength + a.byteLength)).set(e.FTYP), r.set(a, e.FTYP.byteLength), r
                        }
                    }]), e
                }();
            r.default = s
        }, {}],
        45: [function(e, t, r) {
            "use strict";

            function a(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }

            function i(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                s = a(e(36)),
                o = a(e(35)),
                l = e(54),
                u = a(e(44)),
                d = e(33),
                f = function() {
                    function e(t, r, a, n) {
                        i(this, e), this.observer = t, this.config = r, this.typeSupported = a;
                        var s = navigator.userAgent;
                        this.isSafari = n && n.indexOf("Apple") > -1 && s && !s.match("CriOS"), this.ISGenerated = !1
                    }
                    return n(e, [{
                        key: "destroy",
                        value: function() {}
                    }, {
                        key: "resetTimeStamp",
                        value: function(e) {
                            this._initPTS = this._initDTS = e
                        }
                    }, {
                        key: "resetInitSegment",
                        value: function() {
                            this.ISGenerated = !1
                        }
                    }, {
                        key: "remux",
                        value: function(e, t, r, a, i, n, s) {
                            if (this.ISGenerated) {
                                if (s) {
                                    var u = this._initPTS,
                                        d = this._PTSNormalize,
                                        f = e.inputTimeScale || t.inputTimeScale,
                                        c = 1 / 0,
                                        h = 1 / 0,
                                        g = e.samples;
                                    if (g.length && (c = h = d(g[0].pts - f * i, u)), (g = t.samples).length) {
                                        var v = g[0];
                                        c = Math.min(c, d(v.pts - f * i, u)), h = Math.min(h, d(v.dts - f * i, u))
                                    }
                                    if (c !== 1 / 0) {
                                        var p = u - c;
                                        Math.abs(p) > 10 * f && (l.logger.warn("timestamp inconsistency, " + (p / f).toFixed(3) + "s delta against expected value: missing discontinuity ? reset initPTS/initDTS"), this._initPTS = c, this._initDTS = h, this.observer.trigger(o.default.INIT_PTS_FOUND, {
                                            initPTS: c
                                        }))
                                    }
                                }
                            } else this.generateIS(e, t, i);
                            if (this.ISGenerated)
                                if (e.samples.length) {
                                    e.timescale || (l.logger.warn("regenerate InitSegment as audio detected"), this.generateIS(e, t, i));
                                    var y = this.remuxAudio(e, i, n, s);
                                    if (t.samples.length) {
                                        var m = void 0;
                                        y && (m = y.endPTS - y.startPTS), t.timescale || (l.logger.warn("regenerate InitSegment as video detected"), this.generateIS(e, t, i)), this.remuxVideo(t, i, n, m, s)
                                    }
                                } else {
                                    var E = void 0;
                                    t.samples.length && (E = this.remuxVideo(t, i, n, s)), E && e.codec && this.remuxEmptyAudio(e, i, n, E)
                                } r.samples.length && this.remuxID3(r, i), a.samples.length && this.remuxText(a, i), this.observer.trigger(o.default.FRAG_PARSED)
                        }
                    }, {
                        key: "generateIS",
                        value: function(e, t, r) {
                            var a, i, n = this.observer,
                                s = e.samples,
                                f = t.samples,
                                c = this.typeSupported,
                                h = "audio/mp4",
                                g = {},
                                v = {
                                    tracks: g
                                },
                                p = void 0 === this._initPTS;
                            if (p && (a = i = 1 / 0), e.config && s.length && (e.timescale = e.samplerate, l.logger.log("audio sampling rate : " + e.samplerate), e.isAAC || (c.mpeg ? (h = "audio/mpeg", e.codec = "") : c.mp3 && (e.codec = "mp3")), g.audio = {
                                    container: h,
                                    codec: e.codec,
                                    initSegment: !e.isAAC && c.mpeg ? new Uint8Array : u.default.initSegment([e]),
                                    metadata: {
                                        channelCount: e.channelCount
                                    }
                                }, p && (a = i = s[0].pts - e.inputTimeScale * r)), t.sps && t.pps && f.length) {
                                var y = t.inputTimeScale;
                                t.timescale = y, g.video = {
                                    container: "video/mp4",
                                    codec: t.codec,
                                    initSegment: u.default.initSegment([t]),
                                    metadata: {
                                        width: t.width,
                                        height: t.height
                                    }
                                }, p && (a = Math.min(a, f[0].pts - y * r), i = Math.min(i, f[0].dts - y * r), this.observer.trigger(o.default.INIT_PTS_FOUND, {
                                    initPTS: a
                                }))
                            }
                            Object.keys(g).length ? (n.trigger(o.default.FRAG_PARSING_INIT_SEGMENT, v), this.ISGenerated = !0, p && (this._initPTS = a, this._initDTS = i)) : n.trigger(o.default.ERROR, {
                                type: d.ErrorTypes.MEDIA_ERROR,
                                details: d.ErrorDetails.FRAG_PARSING_ERROR,
                                fatal: !1,
                                reason: "no audio/video samples found"
                            })
                        }
                    }, {
                        key: "remuxVideo",
                        value: function(e, t, r, a, i) {
                            var n, s, f, c, h, g, v, p = 8,
                                y = e.timescale,
                                m = e.samples,
                                E = [],
                                b = m.length,
                                T = this._PTSNormalize,
                                k = this._initDTS,
                                _ = this.nextAvcDts,
                                R = this.isSafari;
                            R && (r |= m.length && _ && (i && Math.abs(t - _ / y) < .1 || Math.abs(m[0].pts - _ - k) < y / 5)), r || (_ = t * y), m.forEach(function(e) {
                                e.pts = T(e.pts - k, _), e.dts = T(e.dts - k, _)
                            }), m.sort(function(e, t) {
                                var r = e.dts - t.dts,
                                    a = e.pts - t.pts;
                                return r || (a || e.id - t.id)
                            });
                            var S = m.reduce(function(e, t) {
                                return Math.max(Math.min(e, t.pts - t.dts), -18e3)
                            }, 0);
                            if (S < 0) {
                                l.logger.warn("PTS < DTS detected in video samples, shifting DTS by " + Math.round(S / 90) + " ms to overcome this issue");
                                for (var A = 0; A < m.length; A++) m[A].dts += S
                            }
                            var L = m[0];
                            h = Math.max(L.dts, 0), c = Math.max(L.pts, 0);
                            var w = Math.round((h - _) / 90);
                            r && w && (w > 1 ? l.logger.log("AVC:" + w + " ms hole between fragments detected,filling it") : w < -1 && l.logger.log("AVC:" + -w + " ms overlapping between fragments detected"), h = _, m[0].dts = h, c = Math.max(c - w, _), m[0].pts = c, l.logger.log("Video/PTS/DTS adjusted: " + Math.round(c / 90) + "/" + Math.round(h / 90) + ",delta:" + w + " ms")), L = m[m.length - 1], v = Math.max(L.dts, 0), g = Math.max(L.pts, 0, v), R && (n = Math.round((v - h) / (m.length - 1)));
                            for (var D = 0, O = 0, I = 0; I < b; I++) {
                                for (var P = m[I], C = P.units, x = C.length, F = 0, M = 0; M < x; M++) F += C[M].data.length;
                                O += F, D += x, P.length = F, P.dts = R ? h + I * n : Math.max(P.dts, h), P.pts = Math.max(P.pts, P.dts)
                            }
                            var N = O + 4 * D + 8;
                            try {
                                s = new Uint8Array(N)
                            } catch (e) {
                                return void this.observer.trigger(o.default.ERROR, {
                                    type: d.ErrorTypes.MUX_ERROR,
                                    details: d.ErrorDetails.REMUX_ALLOC_ERROR,
                                    fatal: !1,
                                    bytes: N,
                                    reason: "fail allocating video mdat " + N
                                })
                            }
                            var U = new DataView(s.buffer);
                            U.setUint32(0, N), s.set(u.default.types.mdat, 4);
                            for (var B = 0; B < b; B++) {
                                for (var G = m[B], j = G.units, H = 0, W = void 0, K = 0, V = j.length; K < V; K++) {
                                    var Y = j[K],
                                        z = Y.data,
                                        X = Y.data.byteLength;
                                    U.setUint32(p, X), p += 4, s.set(z, p), p += X, H += 4 + X
                                }
                                if (R) W = Math.max(0, n * Math.round((G.pts - G.dts) / n));
                                else {
                                    if (B < b - 1) n = m[B + 1].dts - G.dts;
                                    else {
                                        var q = this.config,
                                            Q = G.dts - m[B > 0 ? B - 1 : B].dts;
                                        if (q.stretchShortVideoTrack) {
                                            var J = q.maxBufferHole,
                                                Z = q.maxSeekHole,
                                                $ = Math.floor(Math.min(J, Z) * y),
                                                ee = (a ? c + a * y : this.nextAudioPts) - G.pts;
                                            ee > $ ? ((n = ee - Q) < 0 && (n = Q), l.logger.log("It is approximately " + ee / 90 + " ms to the next segment; using duration " + n / 90 + " ms for the last video frame.")) : n = Q
                                        } else n = Q
                                    }
                                    W = Math.round(G.pts - G.dts)
                                }
                                E.push({
                                    size: H,
                                    duration: n,
                                    cts: W,
                                    flags: {
                                        isLeading: 0,
                                        isDependedOn: 0,
                                        hasRedundancy: 0,
                                        degradPrio: 0,
                                        dependsOn: G.key ? 2 : 1,
                                        isNonSync: G.key ? 0 : 1
                                    }
                                })
                            }
                            this.nextAvcDts = v + n;
                            var te = e.dropped;
                            if (e.len = 0, e.nbNalu = 0, e.dropped = 0, E.length && navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                                var re = E[0].flags;
                                re.dependsOn = 2, re.isNonSync = 0
                            }
                            e.samples = E, f = u.default.moof(e.sequenceNumber++, h, e), e.samples = [];
                            var ae = {
                                data1: f,
                                data2: s,
                                startPTS: c / y,
                                endPTS: (g + n) / y,
                                startDTS: h / y,
                                endDTS: this.nextAvcDts / y,
                                type: "video",
                                nb: E.length,
                                dropped: te
                            };
                            return this.observer.trigger(o.default.FRAG_PARSING_DATA, ae), ae
                        }
                    }, {
                        key: "remuxAudio",
                        value: function(e, t, r, a) {
                            var i, n, f, c, h, g, v, p = e.inputTimeScale,
                                y = p / e.timescale,
                                m = (e.isAAC ? 1024 : 1152) * y,
                                E = this._PTSNormalize,
                                b = this._initDTS,
                                T = !e.isAAC && this.typeSupported.mpeg,
                                k = e.samples,
                                _ = [],
                                R = this.nextAudioPts;
                            if ((r |= k.length && R && (a && Math.abs(t - R / p) < .1 || Math.abs(k[0].pts - R - b) < 20 * m)) || (R = t * p), k.forEach(function(e) {
                                    e.pts = e.dts = E(e.pts - b, R)
                                }), k.sort(function(e, t) {
                                    return e.pts - t.pts
                                }), a && e.isAAC)
                                for (var S = 0, A = R; S < k.length;) {
                                    var L, w = k[S];
                                    L = w.pts - A;
                                    var D = Math.abs(1e3 * L / p);
                                    if (L <= -m) l.logger.warn("Dropping 1 audio frame @ " + (A / p).toFixed(3) + "s due to " + D + " ms overlap."), k.splice(S, 1), e.len -= w.unit.length;
                                    else if (L >= m && D < 1e4 && A) {
                                        var O = Math.round(L / m);
                                        l.logger.warn("Injecting " + O + " audio frame @ " + (A / p).toFixed(3) + "s due to " + Math.round(1e3 * L / p) + " ms gap.");
                                        for (var I = 0; I < O; I++) {
                                            var P = Math.max(A, 0);
                                            (f = s.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (l.logger.log("Unable to get silent frame for given audio codec; duplicating last frame instead."), f = w.unit.subarray()), k.splice(S, 0, {
                                                unit: f,
                                                pts: P,
                                                dts: P
                                            }), e.len += f.length, A += m, S++
                                        }
                                        w.pts = w.dts = A, A += m, S++
                                    } else Math.abs(L), w.pts = w.dts = A, A += m, S++
                                }
                            for (var C = 0, x = k.length; C < x; C++) {
                                var F = k[C],
                                    M = F.unit,
                                    N = F.pts;
                                if (void 0 !== v) n.duration = Math.round((N - v) / y);
                                else {
                                    var U = Math.round(1e3 * (N - R) / p),
                                        B = 0;
                                    if (r && e.isAAC && U) {
                                        if (U > 0 && U < 1e4) B = Math.round((N - R) / m), l.logger.log(U + " ms hole between AAC samples detected,filling it"), B > 0 && ((f = s.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (f = M.subarray()), e.len += B * f.length);
                                        else if (U < -12) {
                                            l.logger.log("drop overlapping AAC sample, expected/parsed/delta:" + (R / p).toFixed(3) + "s/" + (N / p).toFixed(3) + "s/" + -U + "ms"), e.len -= M.byteLength;
                                            continue
                                        }
                                        N = R
                                    }
                                    if (g = Math.max(0, N), !(e.len > 0)) return;
                                    var G = T ? e.len : e.len + 8;
                                    i = T ? 0 : 8;
                                    try {
                                        c = new Uint8Array(G)
                                    } catch (e) {
                                        return void this.observer.trigger(o.default.ERROR, {
                                            type: d.ErrorTypes.MUX_ERROR,
                                            details: d.ErrorDetails.REMUX_ALLOC_ERROR,
                                            fatal: !1,
                                            bytes: G,
                                            reason: "fail allocating audio mdat " + G
                                        })
                                    }
                                    T || (new DataView(c.buffer).setUint32(0, G), c.set(u.default.types.mdat, 4));
                                    for (var j = 0; j < B; j++)(f = s.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount)) || (l.logger.log("Unable to get silent frame for given audio codec; duplicating this frame instead."), f = M.subarray()), c.set(f, i), i += f.byteLength, n = {
                                        size: f.byteLength,
                                        cts: 0,
                                        duration: 1024,
                                        flags: {
                                            isLeading: 0,
                                            isDependedOn: 0,
                                            hasRedundancy: 0,
                                            degradPrio: 0,
                                            dependsOn: 1
                                        }
                                    }, _.push(n)
                                }
                                c.set(M, i);
                                var H = M.byteLength;
                                i += H, n = {
                                    size: H,
                                    cts: 0,
                                    duration: 0,
                                    flags: {
                                        isLeading: 0,
                                        isDependedOn: 0,
                                        hasRedundancy: 0,
                                        degradPrio: 0,
                                        dependsOn: 1
                                    }
                                }, _.push(n), v = N
                            }
                            var W = 0,
                                K = _.length;
                            if (K >= 2 && (W = _[K - 2].duration, n.duration = W), K) {
                                this.nextAudioPts = R = v + y * W, e.len = 0, e.samples = _, h = T ? new Uint8Array : u.default.moof(e.sequenceNumber++, g / y, e), e.samples = [];
                                var V = g / p,
                                    Y = R / p,
                                    z = {
                                        data1: h,
                                        data2: c,
                                        startPTS: V,
                                        endPTS: Y,
                                        startDTS: V,
                                        endDTS: Y,
                                        type: "audio",
                                        nb: K
                                    };
                                return this.observer.trigger(o.default.FRAG_PARSING_DATA, z), z
                            }
                            return null
                        }
                    }, {
                        key: "remuxEmptyAudio",
                        value: function(e, t, r, a) {
                            var i = e.inputTimeScale,
                                n = i / (e.samplerate ? e.samplerate : i),
                                o = this.nextAudioPts,
                                u = (void 0 !== o ? o : a.startDTS * i) + this._initDTS,
                                d = a.endDTS * i + this._initDTS,
                                f = 1024 * n,
                                c = Math.ceil((d - u) / f),
                                h = s.default.getSilentFrame(e.manifestCodec || e.codec, e.channelCount);
                            if (l.logger.warn("remux empty Audio"), h) {
                                for (var g = [], v = 0; v < c; v++) {
                                    var p = u + v * f;
                                    g.push({
                                        unit: h,
                                        pts: p,
                                        dts: p
                                    }), e.len += h.length
                                }
                                e.samples = g, this.remuxAudio(e, t, r)
                            } else l.logger.trace("Unable to remuxEmptyAudio since we were unable to get a silent frame for given audio codec!")
                        }
                    }, {
                        key: "remuxID3",
                        value: function(e, t) {
                            var r, a = e.samples.length,
                                i = e.inputTimeScale,
                                n = this._initPTS,
                                s = this._initDTS;
                            if (a) {
                                for (var l = 0; l < a; l++)(r = e.samples[l]).pts = (r.pts - n) / i, r.dts = (r.dts - s) / i;
                                this.observer.trigger(o.default.FRAG_PARSING_METADATA, {
                                    samples: e.samples
                                })
                            }
                            e.samples = [], t = t
                        }
                    }, {
                        key: "remuxText",
                        value: function(e, t) {
                            e.samples.sort(function(e, t) {
                                return e.pts - t.pts
                            });
                            var r, a = e.samples.length,
                                i = e.inputTimeScale,
                                n = this._initPTS;
                            if (a) {
                                for (var s = 0; s < a; s++)(r = e.samples[s]).pts = (r.pts - n) / i;
                                this.observer.trigger(o.default.FRAG_PARSING_USERDATA, {
                                    samples: e.samples
                                })
                            }
                            e.samples = [], t = t
                        }
                    }, {
                        key: "_PTSNormalize",
                        value: function(e, t) {
                            var r;
                            if (void 0 === t) return e;
                            for (r = t < e ? -8589934592 : 8589934592; Math.abs(e - t) > 4294967296;) e += r;
                            return e
                        }
                    }]), e
                }();
            r.default = f
        }, {
            33: 33,
            35: 35,
            36: 36,
            44: 44,
            54: 54
        }],
        46: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(35)),
                s = function() {
                    function e(t) {
                        a(this, e), this.observer = t
                    }
                    return i(e, [{
                        key: "destroy",
                        value: function() {}
                    }, {
                        key: "resetTimeStamp",
                        value: function() {}
                    }, {
                        key: "resetInitSegment",
                        value: function() {}
                    }, {
                        key: "remux",
                        value: function(e, t, r, a, i, s, o, l) {
                            var u = this.observer,
                                d = "";
                            e && (d += "audio"), t && (d += "video"), u.trigger(n.default.FRAG_PARSING_DATA, {
                                data1: l,
                                startPTS: i,
                                startDTS: i,
                                type: d,
                                nb: 1,
                                dropped: 0
                            }), u.trigger(n.default.FRAG_PARSED)
                        }
                    }]), e
                }();
            r.default = s
        }, {
            35: 35
        }],
        47: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = /^(\d+)x(\d+)$/,
                s = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g,
                o = function() {
                    function e(t) {
                        a(this, e), "string" == typeof t && (t = e.parseAttrList(t));
                        for (var r in t) t.hasOwnProperty(r) && (this[r] = t[r])
                    }
                    return i(e, [{
                        key: "decimalInteger",
                        value: function(e) {
                            var t = parseInt(this[e], 10);
                            return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
                        }
                    }, {
                        key: "hexadecimalInteger",
                        value: function(e) {
                            if (this[e]) {
                                var t = (this[e] || "0x").slice(2);
                                t = (1 & t.length ? "0" : "") + t;
                                for (var r = new Uint8Array(t.length / 2), a = 0; a < t.length / 2; a++) r[a] = parseInt(t.slice(2 * a, 2 * a + 2), 16);
                                return r
                            }
                            return null
                        }
                    }, {
                        key: "hexadecimalIntegerAsNumber",
                        value: function(e) {
                            var t = parseInt(this[e], 16);
                            return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
                        }
                    }, {
                        key: "decimalFloatingPoint",
                        value: function(e) {
                            return parseFloat(this[e])
                        }
                    }, {
                        key: "enumeratedString",
                        value: function(e) {
                            return this[e]
                        }
                    }, {
                        key: "decimalResolution",
                        value: function(e) {
                            var t = n.exec(this[e]);
                            if (null !== t) return {
                                width: parseInt(t[1], 10),
                                height: parseInt(t[2], 10)
                            }
                        }
                    }], [{
                        key: "parseAttrList",
                        value: function(e) {
                            var t, r = {};
                            for (s.lastIndex = 0; null !== (t = s.exec(e));) {
                                var a = t[2];
                                0 === a.indexOf('"') && a.lastIndexOf('"') === a.length - 1 && (a = a.slice(1, -1)), r[t[1]] = a
                            }
                            return r
                        }
                    }]), e
                }();
            r.default = o
        }, {}],
        48: [function(e, t, r) {
            "use strict";
            var a = {
                search: function(e, t) {
                    for (var r = 0, a = e.length - 1, i = null, n = null; r <= a;) {
                        var s = t(n = e[i = (r + a) / 2 | 0]);
                        if (s > 0) r = i + 1;
                        else {
                            if (!(s < 0)) return n;
                            a = i - 1
                        }
                    }
                    return null
                }
            };
            t.exports = a
        }, {}],
        49: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = {
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
                },
                s = function(e) {
                    var t = e;
                    return n.hasOwnProperty(e) && (t = n[e]), String.fromCharCode(t)
                },
                o = 15,
                l = 100,
                u = {
                    17: 1,
                    18: 3,
                    21: 5,
                    22: 7,
                    23: 9,
                    16: 11,
                    19: 12,
                    20: 14
                },
                d = {
                    17: 2,
                    18: 4,
                    21: 6,
                    22: 8,
                    23: 10,
                    19: 13,
                    20: 15
                },
                f = {
                    25: 1,
                    26: 3,
                    29: 5,
                    30: 7,
                    31: 9,
                    24: 11,
                    27: 12,
                    28: 14
                },
                c = {
                    25: 2,
                    26: 4,
                    29: 6,
                    30: 8,
                    31: 10,
                    27: 13,
                    28: 15
                },
                h = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "black", "transparent"],
                g = {
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
                        this.verboseFilter[e];
                        this.verboseLevel
                    }
                },
                v = function(e) {
                    for (var t = [], r = 0; r < e.length; r++) t.push(e[r].toString(16));
                    return t
                },
                p = function() {
                    function e(t, r, i, n, s) {
                        a(this, e), this.foreground = t || "white", this.underline = r || !1, this.italics = i || !1, this.background = n || "black", this.flash = s || !1
                    }
                    return i(e, [{
                        key: "reset",
                        value: function() {
                            this.foreground = "white", this.underline = !1, this.italics = !1, this.background = "black", this.flash = !1
                        }
                    }, {
                        key: "setStyles",
                        value: function(e) {
                            for (var t = ["foreground", "underline", "italics", "background", "flash"], r = 0; r < t.length; r++) {
                                var a = t[r];
                                e.hasOwnProperty(a) && (this[a] = e[a])
                            }
                        }
                    }, {
                        key: "isDefault",
                        value: function() {
                            return "white" === this.foreground && !this.underline && !this.italics && "black" === this.background && !this.flash
                        }
                    }, {
                        key: "equals",
                        value: function(e) {
                            return this.foreground === e.foreground && this.underline === e.underline && this.italics === e.italics && this.background === e.background && this.flash === e.flash
                        }
                    }, {
                        key: "copy",
                        value: function(e) {
                            this.foreground = e.foreground, this.underline = e.underline, this.italics = e.italics, this.background = e.background, this.flash = e.flash
                        }
                    }, {
                        key: "toString",
                        value: function() {
                            return "color=" + this.foreground + ", underline=" + this.underline + ", italics=" + this.italics + ", background=" + this.background + ", flash=" + this.flash
                        }
                    }]), e
                }(),
                y = function() {
                    function e(t, r, i, n, s, o) {
                        a(this, e), this.uchar = t || " ", this.penState = new p(r, i, n, s, o)
                    }
                    return i(e, [{
                        key: "reset",
                        value: function() {
                            this.uchar = " ", this.penState.reset()
                        }
                    }, {
                        key: "setChar",
                        value: function(e, t) {
                            this.uchar = e, this.penState.copy(t)
                        }
                    }, {
                        key: "setPenState",
                        value: function(e) {
                            this.penState.copy(e)
                        }
                    }, {
                        key: "equals",
                        value: function(e) {
                            return this.uchar === e.uchar && this.penState.equals(e.penState)
                        }
                    }, {
                        key: "copy",
                        value: function(e) {
                            this.uchar = e.uchar, this.penState.copy(e.penState)
                        }
                    }, {
                        key: "isEmpty",
                        value: function() {
                            return " " === this.uchar && this.penState.isDefault()
                        }
                    }]), e
                }(),
                m = function() {
                    function e() {
                        a(this, e), this.chars = [];
                        for (var t = 0; t < l; t++) this.chars.push(new y);
                        this.pos = 0, this.currPenState = new p
                    }
                    return i(e, [{
                        key: "equals",
                        value: function(e) {
                            for (var t = !0, r = 0; r < l; r++)
                                if (!this.chars[r].equals(e.chars[r])) {
                                    t = !1;
                                    break
                                } return t
                        }
                    }, {
                        key: "copy",
                        value: function(e) {
                            for (var t = 0; t < l; t++) this.chars[t].copy(e.chars[t])
                        }
                    }, {
                        key: "isEmpty",
                        value: function() {
                            for (var e = !0, t = 0; t < l; t++)
                                if (!this.chars[t].isEmpty()) {
                                    e = !1;
                                    break
                                } return e
                        }
                    }, {
                        key: "setCursor",
                        value: function(e) {
                            this.pos !== e && (this.pos = e), this.pos < 0 ? (g.log("ERROR", "Negative cursor position " + this.pos), this.pos = 0) : this.pos > l && (g.log("ERROR", "Too large cursor position " + this.pos), this.pos = l)
                        }
                    }, {
                        key: "moveCursor",
                        value: function(e) {
                            var t = this.pos + e;
                            if (e > 1)
                                for (var r = this.pos + 1; r < t + 1; r++) this.chars[r].setPenState(this.currPenState);
                            this.setCursor(t)
                        }
                    }, {
                        key: "backSpace",
                        value: function() {
                            this.moveCursor(-1), this.chars[this.pos].setChar(" ", this.currPenState)
                        }
                    }, {
                        key: "insertChar",
                        value: function(e) {
                            e >= 144 && this.backSpace();
                            var t = s(e);
                            this.pos >= l ? g.log("ERROR", "Cannot insert " + e.toString(16) + " (" + t + ") at position " + this.pos + ". Skipping it!") : (this.chars[this.pos].setChar(t, this.currPenState), this.moveCursor(1))
                        }
                    }, {
                        key: "clearFromPos",
                        value: function(e) {
                            var t;
                            for (t = e; t < l; t++) this.chars[t].reset()
                        }
                    }, {
                        key: "clear",
                        value: function() {
                            this.clearFromPos(0), this.pos = 0, this.currPenState.reset()
                        }
                    }, {
                        key: "clearToEndOfRow",
                        value: function() {
                            this.clearFromPos(this.pos)
                        }
                    }, {
                        key: "getTextString",
                        value: function() {
                            for (var e = [], t = !0, r = 0; r < l; r++) {
                                var a = this.chars[r].uchar;
                                " " !== a && (t = !1), e.push(a)
                            }
                            return t ? "" : e.join("")
                        }
                    }, {
                        key: "setPenStyles",
                        value: function(e) {
                            this.currPenState.setStyles(e), this.chars[this.pos].setPenState(this.currPenState)
                        }
                    }]), e
                }(),
                E = function() {
                    function e() {
                        a(this, e), this.rows = [];
                        for (var t = 0; t < o; t++) this.rows.push(new m);
                        this.currRow = o - 1, this.nrRollUpRows = null, this.reset()
                    }
                    return i(e, [{
                        key: "reset",
                        value: function() {
                            for (var e = 0; e < o; e++) this.rows[e].clear();
                            this.currRow = o - 1
                        }
                    }, {
                        key: "equals",
                        value: function(e) {
                            for (var t = !0, r = 0; r < o; r++)
                                if (!this.rows[r].equals(e.rows[r])) {
                                    t = !1;
                                    break
                                } return t
                        }
                    }, {
                        key: "copy",
                        value: function(e) {
                            for (var t = 0; t < o; t++) this.rows[t].copy(e.rows[t])
                        }
                    }, {
                        key: "isEmpty",
                        value: function() {
                            for (var e = !0, t = 0; t < o; t++)
                                if (!this.rows[t].isEmpty()) {
                                    e = !1;
                                    break
                                } return e
                        }
                    }, {
                        key: "backSpace",
                        value: function() {
                            this.rows[this.currRow].backSpace()
                        }
                    }, {
                        key: "clearToEndOfRow",
                        value: function() {
                            this.rows[this.currRow].clearToEndOfRow()
                        }
                    }, {
                        key: "insertChar",
                        value: function(e) {
                            this.rows[this.currRow].insertChar(e)
                        }
                    }, {
                        key: "setPen",
                        value: function(e) {
                            this.rows[this.currRow].setPenStyles(e)
                        }
                    }, {
                        key: "moveCursor",
                        value: function(e) {
                            this.rows[this.currRow].moveCursor(e)
                        }
                    }, {
                        key: "setCursor",
                        value: function(e) {
                            g.log("INFO", "setCursor: " + e), this.rows[this.currRow].setCursor(e)
                        }
                    }, {
                        key: "setPAC",
                        value: function(e) {
                            g.log("INFO", "pacData = " + JSON.stringify(e));
                            var t = e.row - 1;
                            if (this.nrRollUpRows && t < this.nrRollUpRows - 1 && (t = this.nrRollUpRows - 1), this.nrRollUpRows && this.currRow !== t) {
                                for (var r = 0; r < o; r++) this.rows[r].clear();
                                var a = this.currRow + 1 - this.nrRollUpRows,
                                    i = this.lastOutputScreen;
                                if (i) {
                                    var n = i.rows[a].cueStartTime;
                                    if (n && n < g.time)
                                        for (var s = 0; s < this.nrRollUpRows; s++) this.rows[t - this.nrRollUpRows + s + 1].copy(i.rows[a + s])
                                }
                            }
                            this.currRow = t;
                            var l = this.rows[this.currRow];
                            if (null !== e.indent) {
                                var u = e.indent,
                                    d = Math.max(u - 1, 0);
                                l.setCursor(e.indent), e.color = l.chars[d].penState.foreground
                            }
                            var f = {
                                foreground: e.color,
                                underline: e.underline,
                                italics: e.italics,
                                background: "black",
                                flash: !1
                            };
                            this.setPen(f)
                        }
                    }, {
                        key: "setBkgData",
                        value: function(e) {
                            g.log("INFO", "bkgData = " + JSON.stringify(e)), this.backSpace(), this.setPen(e), this.insertChar(32)
                        }
                    }, {
                        key: "setRollUpRows",
                        value: function(e) {
                            this.nrRollUpRows = e
                        }
                    }, {
                        key: "rollUp",
                        value: function() {
                            if (null !== this.nrRollUpRows) {
                                g.log("TEXT", this.getDisplayText());
                                var e = this.currRow + 1 - this.nrRollUpRows,
                                    t = this.rows.splice(e, 1)[0];
                                t.clear(), this.rows.splice(this.currRow, 0, t), g.log("INFO", "Rolling up")
                            } else g.log("DEBUG", "roll_up but nrRollUpRows not set yet")
                        }
                    }, {
                        key: "getDisplayText",
                        value: function(e) {
                            e = e || !1;
                            for (var t = [], r = "", a = -1, i = 0; i < o; i++) {
                                var n = this.rows[i].getTextString();
                                n && (a = i + 1, e ? t.push("Row " + a + ": '" + n + "'") : t.push(n.trim()))
                            }
                            return t.length > 0 && (r = e ? "[" + t.join(" | ") + "]" : t.join("\n")), r
                        }
                    }, {
                        key: "getTextAndFormat",
                        value: function() {
                            return this.rows
                        }
                    }]), e
                }(),
                b = function() {
                    function e(t, r) {
                        a(this, e), this.chNr = t, this.outputFilter = r, this.mode = null, this.verbose = 0, this.displayedMemory = new E, this.nonDisplayedMemory = new E, this.lastOutputScreen = new E, this.currRollUpRow = this.displayedMemory.rows[o - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null
                    }
                    return i(e, [{
                        key: "reset",
                        value: function() {
                            this.mode = null, this.displayedMemory.reset(), this.nonDisplayedMemory.reset(), this.lastOutputScreen.reset(), this.currRollUpRow = this.displayedMemory.rows[o - 1], this.writeScreen = this.displayedMemory, this.mode = null, this.cueStartTime = null, this.lastCueEndTime = null
                        }
                    }, {
                        key: "getHandler",
                        value: function() {
                            return this.outputFilter
                        }
                    }, {
                        key: "setHandler",
                        value: function(e) {
                            this.outputFilter = e
                        }
                    }, {
                        key: "setPAC",
                        value: function(e) {
                            this.writeScreen.setPAC(e)
                        }
                    }, {
                        key: "setBkgData",
                        value: function(e) {
                            this.writeScreen.setBkgData(e)
                        }
                    }, {
                        key: "setMode",
                        value: function(e) {
                            e !== this.mode && (this.mode = e, g.log("INFO", "MODE=" + e), "MODE_POP-ON" === this.mode ? this.writeScreen = this.nonDisplayedMemory : (this.writeScreen = this.displayedMemory, this.writeScreen.reset()), "MODE_ROLL-UP" !== this.mode && (this.displayedMemory.nrRollUpRows = null, this.nonDisplayedMemory.nrRollUpRows = null), this.mode = e)
                        }
                    }, {
                        key: "insertChars",
                        value: function(e) {
                            for (var t = 0; t < e.length; t++) this.writeScreen.insertChar(e[t]);
                            var r = this.writeScreen === this.displayedMemory ? "DISP" : "NON_DISP";
                            g.log("INFO", r + ": " + this.writeScreen.getDisplayText(!0)), "MODE_PAINT-ON" !== this.mode && "MODE_ROLL-UP" !== this.mode || (g.log("TEXT", "DISPLAYED: " + this.displayedMemory.getDisplayText(!0)), this.outputDataUpdate())
                        }
                    }, {
                        key: "ccRCL",
                        value: function() {
                            g.log("INFO", "RCL - Resume Caption Loading"), this.setMode("MODE_POP-ON")
                        }
                    }, {
                        key: "ccBS",
                        value: function() {
                            g.log("INFO", "BS - BackSpace"), "MODE_TEXT" !== this.mode && (this.writeScreen.backSpace(), this.writeScreen === this.displayedMemory && this.outputDataUpdate())
                        }
                    }, {
                        key: "ccAOF",
                        value: function() {}
                    }, {
                        key: "ccAON",
                        value: function() {}
                    }, {
                        key: "ccDER",
                        value: function() {
                            g.log("INFO", "DER- Delete to End of Row"), this.writeScreen.clearToEndOfRow(), this.outputDataUpdate()
                        }
                    }, {
                        key: "ccRU",
                        value: function(e) {
                            g.log("INFO", "RU(" + e + ") - Roll Up"), this.writeScreen = this.displayedMemory, this.setMode("MODE_ROLL-UP"), this.writeScreen.setRollUpRows(e)
                        }
                    }, {
                        key: "ccFON",
                        value: function() {
                            g.log("INFO", "FON - Flash On"), this.writeScreen.setPen({
                                flash: !0
                            })
                        }
                    }, {
                        key: "ccRDC",
                        value: function() {
                            g.log("INFO", "RDC - Resume Direct Captioning"), this.setMode("MODE_PAINT-ON")
                        }
                    }, {
                        key: "ccTR",
                        value: function() {
                            g.log("INFO", "TR"), this.setMode("MODE_TEXT")
                        }
                    }, {
                        key: "ccRTD",
                        value: function() {
                            g.log("INFO", "RTD"), this.setMode("MODE_TEXT")
                        }
                    }, {
                        key: "ccEDM",
                        value: function() {
                            g.log("INFO", "EDM - Erase Displayed Memory"), this.displayedMemory.reset(), this.outputDataUpdate()
                        }
                    }, {
                        key: "ccCR",
                        value: function() {
                            g.log("CR - Carriage Return"), this.writeScreen.rollUp(), this.outputDataUpdate()
                        }
                    }, {
                        key: "ccENM",
                        value: function() {
                            g.log("INFO", "ENM - Erase Non-displayed Memory"), this.nonDisplayedMemory.reset()
                        }
                    }, {
                        key: "ccEOC",
                        value: function() {
                            if (g.log("INFO", "EOC - End Of Caption"), "MODE_POP-ON" === this.mode) {
                                var e = this.displayedMemory;
                                this.displayedMemory = this.nonDisplayedMemory, this.nonDisplayedMemory = e, this.writeScreen = this.nonDisplayedMemory, g.log("TEXT", "DISP: " + this.displayedMemory.getDisplayText())
                            }
                            this.outputDataUpdate()
                        }
                    }, {
                        key: "ccTO",
                        value: function(e) {
                            g.log("INFO", "TO(" + e + ") - Tab Offset"), this.writeScreen.moveCursor(e)
                        }
                    }, {
                        key: "ccMIDROW",
                        value: function(e) {
                            var t = {
                                flash: !1
                            };
                            if (t.underline = e % 2 == 1, t.italics = e >= 46, t.italics) t.foreground = "white";
                            else {
                                var r = Math.floor(e / 2) - 16,
                                    a = ["white", "green", "blue", "cyan", "red", "yellow", "magenta"];
                                t.foreground = a[r]
                            }
                            g.log("INFO", "MIDROW: " + JSON.stringify(t)), this.writeScreen.setPen(t)
                        }
                    }, {
                        key: "outputDataUpdate",
                        value: function() {
                            var e = g.time;
                            null !== e && this.outputFilter && (this.outputFilter.updateData && this.outputFilter.updateData(e, this.displayedMemory), null !== this.cueStartTime || this.displayedMemory.isEmpty() ? this.displayedMemory.equals(this.lastOutputScreen) || (this.outputFilter.newCue && this.outputFilter.newCue(this.cueStartTime, e, this.lastOutputScreen), this.cueStartTime = this.displayedMemory.isEmpty() ? null : e) : this.cueStartTime = e, this.lastOutputScreen.copy(this.displayedMemory))
                        }
                    }, {
                        key: "cueSplitAtTime",
                        value: function(e) {
                            this.outputFilter && (this.displayedMemory.isEmpty() || (this.outputFilter.newCue && this.outputFilter.newCue(this.cueStartTime, e, this.displayedMemory), this.cueStartTime = e))
                        }
                    }]), e
                }(),
                T = function() {
                    function e(t, r, i) {
                        a(this, e), this.field = t || 1, this.outputs = [r, i], this.channels = [new b(1, r), new b(2, i)], this.currChNr = -1, this.lastCmdA = null, this.lastCmdB = null, this.bufferedData = [], this.startTime = null, this.lastTime = null, this.dataCounters = {
                            padding: 0,
                            char: 0,
                            cmd: 0,
                            other: 0
                        }
                    }
                    return i(e, [{
                        key: "getHandler",
                        value: function(e) {
                            return this.channels[e].getHandler()
                        }
                    }, {
                        key: "setHandler",
                        value: function(e, t) {
                            this.channels[e].setHandler(t)
                        }
                    }, {
                        key: "addData",
                        value: function(e, t) {
                            var r, a, i, n = !1;
                            this.lastTime = e, g.setTime(e);
                            for (var s = 0; s < t.length; s += 2) a = 127 & t[s], i = 127 & t[s + 1], 0 !== a || 0 !== i ? (g.log("DATA", "[" + v([t[s], t[s + 1]]) + "] -> (" + v([a, i]) + ")"), (r = this.parseCmd(a, i)) || (r = this.parseMidrow(a, i)), r || (r = this.parsePAC(a, i)), r || (r = this.parseBackgroundAttributes(a, i)), r || (n = this.parseChars(a, i)) && (this.currChNr && this.currChNr >= 0 ? this.channels[this.currChNr - 1].insertChars(n) : g.log("WARNING", "No channel found yet. TEXT-MODE?")), r ? this.dataCounters.cmd += 2 : n ? this.dataCounters.char += 2 : (this.dataCounters.other += 2, g.log("WARNING", "Couldn't parse cleaned data " + v([a, i]) + " orig: " + v([t[s], t[s + 1]])))) : this.dataCounters.padding += 2
                        }
                    }, {
                        key: "parseCmd",
                        value: function(e, t) {
                            var r = null,
                                a = (20 === e || 28 === e) && 32 <= t && t <= 47,
                                i = (23 === e || 31 === e) && 33 <= t && t <= 35;
                            if (!a && !i) return !1;
                            if (e === this.lastCmdA && t === this.lastCmdB) return this.lastCmdA = null, this.lastCmdB = null, g.log("DEBUG", "Repeated command (" + v([e, t]) + ") is dropped"), !0;
                            r = 20 === e || 23 === e ? 1 : 2;
                            var n = this.channels[r - 1];
                            return 20 === e || 28 === e ? 32 === t ? n.ccRCL() : 33 === t ? n.ccBS() : 34 === t ? n.ccAOF() : 35 === t ? n.ccAON() : 36 === t ? n.ccDER() : 37 === t ? n.ccRU(2) : 38 === t ? n.ccRU(3) : 39 === t ? n.ccRU(4) : 40 === t ? n.ccFON() : 41 === t ? n.ccRDC() : 42 === t ? n.ccTR() : 43 === t ? n.ccRTD() : 44 === t ? n.ccEDM() : 45 === t ? n.ccCR() : 46 === t ? n.ccENM() : 47 === t && n.ccEOC() : n.ccTO(t - 32), this.lastCmdA = e, this.lastCmdB = t, this.currChNr = r, !0
                        }
                    }, {
                        key: "parseMidrow",
                        value: function(e, t) {
                            var r = null;
                            return (17 === e || 25 === e) && 32 <= t && t <= 47 && ((r = 17 === e ? 1 : 2) !== this.currChNr ? (g.log("ERROR", "Mismatch channel in midrow parsing"), !1) : (this.channels[r - 1].ccMIDROW(t), g.log("DEBUG", "MIDROW (" + v([e, t]) + ")"), !0))
                        }
                    }, {
                        key: "parsePAC",
                        value: function(e, t) {
                            var r = null,
                                a = null,
                                i = (17 <= e && e <= 23 || 25 <= e && e <= 31) && 64 <= t && t <= 127,
                                n = (16 === e || 24 === e) && 64 <= t && t <= 95;
                            if (!i && !n) return !1;
                            if (e === this.lastCmdA && t === this.lastCmdB) return this.lastCmdA = null, this.lastCmdB = null, !0;
                            r = e <= 23 ? 1 : 2, a = 64 <= t && t <= 95 ? 1 === r ? u[e] : f[e] : 1 === r ? d[e] : c[e];
                            var s = this.interpretPAC(a, t);
                            return this.channels[r - 1].setPAC(s), this.lastCmdA = e, this.lastCmdB = t, this.currChNr = r, !0
                        }
                    }, {
                        key: "interpretPAC",
                        value: function(e, t) {
                            var r = t,
                                a = {
                                    color: null,
                                    italics: !1,
                                    indent: null,
                                    underline: !1,
                                    row: e
                                };
                            return r = t > 95 ? t - 96 : t - 64, a.underline = 1 == (1 & r), r <= 13 ? a.color = ["white", "green", "blue", "cyan", "red", "yellow", "magenta", "white"][Math.floor(r / 2)] : r <= 15 ? (a.italics = !0, a.color = "white") : a.indent = 4 * Math.floor((r - 16) / 2), a
                        }
                    }, {
                        key: "parseChars",
                        value: function(e, t) {
                            var r = null,
                                a = null,
                                i = null;
                            if (e >= 25 ? (r = 2, i = e - 8) : (r = 1, i = e), 17 <= i && i <= 19) {
                                var n = t;
                                n = 17 === i ? t + 80 : 18 === i ? t + 112 : t + 144, g.log("INFO", "Special char '" + s(n) + "' in channel " + r), a = [n]
                            } else 32 <= e && e <= 127 && (a = 0 === t ? [e] : [e, t]);
                            if (a) {
                                var o = v(a);
                                g.log("DEBUG", "Char codes =  " + o.join(",")), this.lastCmdA = null, this.lastCmdB = null
                            }
                            return a
                        }
                    }, {
                        key: "parseBackgroundAttributes",
                        value: function(e, t) {
                            var r, a, i, n = (16 === e || 24 === e) && 32 <= t && t <= 47,
                                s = (23 === e || 31 === e) && 45 <= t && t <= 47;
                            return !(!n && !s) && (r = {}, 16 === e || 24 === e ? (a = Math.floor((t - 32) / 2), r.background = h[a], t % 2 == 1 && (r.background = r.background + "_semi")) : 45 === t ? r.background = "transparent" : (r.foreground = "black", 47 === t && (r.underline = !0)), i = e < 24 ? 1 : 2, this.channels[i - 1].setBkgData(r), this.lastCmdA = null, this.lastCmdB = null, !0)
                        }
                    }, {
                        key: "reset",
                        value: function() {
                            for (var e = 0; e < this.channels.length; e++) this.channels[e] && this.channels[e].reset();
                            this.lastCmdA = null, this.lastCmdB = null
                        }
                    }, {
                        key: "cueSplitAtTime",
                        value: function(e) {
                            for (var t = 0; t < this.channels.length; t++) this.channels[t] && this.channels[t].cueSplitAtTime(e)
                        }
                    }]), e
                }();
            r.default = T
        }, {}],
        50: [function(e, t, r) {
            "use strict";
            var a = e(57),
                i = {
                    newCue: function(e, t, r, i) {
                        for (var n, s, o, l, u, d = window.VTTCue || window.TextTrackCue, f = 0; f < i.rows.length; f++)
                            if (n = i.rows[f], o = !0, l = 0, u = "", !n.isEmpty()) {
                                for (var c = 0; c < n.chars.length; c++) n.chars[c].uchar.match(/\s/) && o ? l++ : (u += n.chars[c].uchar, o = !1);
                                n.cueStartTime = t, t === r && (r += 1e-4), s = new d(t, r, (0, a.fixLineBreaks)(u.trim())), l >= 16 ? l-- : l++, navigator.userAgent.match(/Firefox\//) ? s.line = f + 1 : s.line = f > 7 ? f - 2 : f + 1, s.align = "left", s.position = Math.max(0, Math.min(100, l / 32 * 100 + (navigator.userAgent.match(/Firefox\//) ? 50 : 0))), e.addCue(s)
                            }
                    }
                };
            t.exports = i
        }, {
            57: 57
        }],
        51: [function(e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            }), r.findFragWithCC = function(e, t) {
                return a.default.search(e, function(e) {
                    return e.cc < t ? 1 : e.cc > t ? -1 : 0
                })
            };
            var a = function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }(e(48))
        }, {
            48: 48
        }],
        52: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(53)),
                s = function() {
                    function e(t, r, i, s) {
                        a(this, e), this.hls = t, this.defaultEstimate_ = s, this.minWeight_ = .001, this.minDelayMs_ = 50, this.slow_ = new n.default(r), this.fast_ = new n.default(i)
                    }
                    return i(e, [{
                        key: "sample",
                        value: function(e, t) {
                            var r = 8e3 * t / (e = Math.max(e, this.minDelayMs_)),
                                a = e / 1e3;
                            this.fast_.sample(a, r), this.slow_.sample(a, r)
                        }
                    }, {
                        key: "canEstimate",
                        value: function() {
                            var e = this.fast_;
                            return e && e.getTotalWeight() >= this.minWeight_
                        }
                    }, {
                        key: "getEstimate",
                        value: function() {
                            return this.canEstimate() ? Math.min(this.fast_.getEstimate(), this.slow_.getEstimate()) : this.defaultEstimate_
                        }
                    }, {
                        key: "destroy",
                        value: function() {}
                    }]), e
                }();
            r.default = s
        }, {
            53: 53
        }],
        53: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = function() {
                    function e(t) {
                        a(this, e), this.alpha_ = t ? Math.exp(Math.log(.5) / t) : 0, this.estimate_ = 0, this.totalWeight_ = 0
                    }
                    return i(e, [{
                        key: "sample",
                        value: function(e, t) {
                            var r = Math.pow(this.alpha_, e);
                            this.estimate_ = t * (1 - r) + r * this.estimate_, this.totalWeight_ += e
                        }
                    }, {
                        key: "getTotalWeight",
                        value: function() {
                            return this.totalWeight_
                        }
                    }, {
                        key: "getEstimate",
                        value: function() {
                            if (this.alpha_) {
                                var e = 1 - Math.pow(this.alpha_, this.totalWeight_);
                                return this.estimate_ / e
                            }
                            return this.estimate_
                        }
                    }]), e
                }();
            r.default = n
        }, {}],
        54: [function(e, t, r) {
            "use strict";

            function a() {}

            function i(e, t) {
                return t = "[" + e + "] > " + t
            }

            function n(e) {
                var t = self.console[e];
                return t ? function() {
                    for (var r = arguments.length, a = Array(r), n = 0; n < r; n++) a[n] = arguments[n];
                    a[0] && (a[0] = i(e, a[0])), t.apply(self.console, a)
                } : a
            }

            function s(e) {
                for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) r[a - 1] = arguments[a];
                r.forEach(function(t) {
                    u[t] = e[t] ? e[t].bind(e) : n(t)
                })
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                },
                l = {
                    trace: a,
                    debug: a,
                    log: a,
                    warn: a,
                    info: a,
                    error: a
                },
                u = l;
            r.enableLogs = function(e) {
                if (!0 === e || "object" === (void 0 === e ? "undefined" : o(e))) {
                    s(e, "debug", "log", "info", "warn", "error");
                    try {
                        u.log()
                    } catch (e) {
                        u = l
                    }
                } else u = l
            }, r.logger = u
        }, {}],
        55: [function(e, t, r) {
            "use strict";
            var a = {
                toString: function(e) {
                    for (var t = "", r = e.length, a = 0; a < r; a++) t += "[" + e.start(a).toFixed(3) + "," + e.end(a).toFixed(3) + "]";
                    return t
                }
            };
            t.exports = a
        }, {}],
        56: [function(e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            }), r.default = function() {
                function e(e) {
                    return "string" == typeof e && (!!n[e.toLowerCase()] && e.toLowerCase())
                }

                function t(e) {
                    return "string" == typeof e && (!!s[e.toLowerCase()] && e.toLowerCase())
                }

                function r(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var r = arguments[t];
                        for (var a in r) e[a] = r[a]
                    }
                    return e
                }

                function a(a, n, s) {
                    var o = this,
                        l = function() {
                            if ("undefined" != typeof navigator) return /MSIE\s8\.0/.test(navigator.userAgent)
                        }(),
                        u = {};
                    l ? o = document.createElement("custom") : u.enumerable = !0, o.hasBeenReset = !1;
                    var d = "",
                        f = !1,
                        c = a,
                        h = n,
                        g = s,
                        v = null,
                        p = "",
                        y = !0,
                        m = "auto",
                        E = "start",
                        b = 50,
                        T = "middle",
                        k = 50,
                        _ = "middle";
                    if (Object.defineProperty(o, "id", r({}, u, {
                            get: function() {
                                return d
                            },
                            set: function(e) {
                                d = "" + e
                            }
                        })), Object.defineProperty(o, "pauseOnExit", r({}, u, {
                            get: function() {
                                return f
                            },
                            set: function(e) {
                                f = !!e
                            }
                        })), Object.defineProperty(o, "startTime", r({}, u, {
                            get: function() {
                                return c
                            },
                            set: function(e) {
                                if ("number" != typeof e) throw new TypeError("Start time must be set to a number.");
                                c = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "endTime", r({}, u, {
                            get: function() {
                                return h
                            },
                            set: function(e) {
                                if ("number" != typeof e) throw new TypeError("End time must be set to a number.");
                                h = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "text", r({}, u, {
                            get: function() {
                                return g
                            },
                            set: function(e) {
                                g = "" + e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "region", r({}, u, {
                            get: function() {
                                return v
                            },
                            set: function(e) {
                                v = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "vertical", r({}, u, {
                            get: function() {
                                return p
                            },
                            set: function(t) {
                                var r = e(t);
                                if (!1 === r) throw new SyntaxError("An invalid or illegal string was specified.");
                                p = r, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "snapToLines", r({}, u, {
                            get: function() {
                                return y
                            },
                            set: function(e) {
                                y = !!e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "line", r({}, u, {
                            get: function() {
                                return m
                            },
                            set: function(e) {
                                if ("number" != typeof e && e !== i) throw new SyntaxError("An invalid number or illegal string was specified.");
                                m = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "lineAlign", r({}, u, {
                            get: function() {
                                return E
                            },
                            set: function(e) {
                                var r = t(e);
                                if (!r) throw new SyntaxError("An invalid or illegal string was specified.");
                                E = r, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "position", r({}, u, {
                            get: function() {
                                return b
                            },
                            set: function(e) {
                                if (e < 0 || e > 100) throw new Error("Position must be between 0 and 100.");
                                b = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "positionAlign", r({}, u, {
                            get: function() {
                                return T
                            },
                            set: function(e) {
                                var r = t(e);
                                if (!r) throw new SyntaxError("An invalid or illegal string was specified.");
                                T = r, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "size", r({}, u, {
                            get: function() {
                                return k
                            },
                            set: function(e) {
                                if (e < 0 || e > 100) throw new Error("Size must be between 0 and 100.");
                                k = e, this.hasBeenReset = !0
                            }
                        })), Object.defineProperty(o, "align", r({}, u, {
                            get: function() {
                                return _
                            },
                            set: function(e) {
                                var r = t(e);
                                if (!r) throw new SyntaxError("An invalid or illegal string was specified.");
                                _ = r, this.hasBeenReset = !0
                            }
                        })), o.displayState = void 0, l) return o
                }
                if ("undefined" != typeof window && window.VTTCue) return window.VTTCue;
                var i = "auto",
                    n = {
                        "": !0,
                        lr: !0,
                        rl: !0
                    },
                    s = {
                        start: !0,
                        middle: !0,
                        end: !0,
                        left: !0,
                        right: !0
                    };
                return a.prototype.getCueAsHTML = function() {
                    return window.WebVTT.convertCueToDOMTree(window, this.text)
                }, a
            }()
        }, {}],
        57: [function(e, t, r) {
            "use strict";

            function a() {
                this.window = window, this.state = "INITIAL", this.buffer = "", this.decoder = new d, this.regionList = []
            }

            function i(e) {
                function t(e, t, r, a) {
                    return 3600 * (0 | e) + 60 * (0 | t) + (0 | r) + (0 | a) / 1e3
                }
                var r = e.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
                return r ? r[3] ? t(r[1], r[2], r[3].replace(":", ""), r[4]) : r[1] > 59 ? t(r[1], r[2], 0, r[4]) : t(0, r[1], r[2], r[4]) : null
            }

            function n() {
                this.values = Object.create(null)
            }

            function s(e, t, r, a) {
                var i = a ? e.split(a) : [e];
                for (var n in i)
                    if ("string" == typeof i[n]) {
                        var s = i[n].split(r);
                        2 === s.length && t(s[0], s[1])
                    }
            }

            function o(e, t, r) {
                function a() {
                    var t = i(e);
                    if (null === t) throw new Error("Malformed timestamp: " + l);
                    return e = e.replace(/^[^\sa-zA-Z-]+/, ""), t
                }

                function o() {
                    e = e.replace(/^\s+/, "")
                }
                var l = e;
                if (o(), t.startTime = a(), o(), "--\x3e" !== e.substr(0, 3)) throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + l);
                e = e.substr(3), o(), t.endTime = a(), o(),
                    function(e, t) {
                        var a = new n;
                        s(e, function(e, t) {
                            switch (e) {
                                case "region":
                                    for (var i = r.length - 1; i >= 0; i--)
                                        if (r[i].id === t) {
                                            a.set(e, r[i].region);
                                            break
                                        } break;
                                case "vertical":
                                    a.alt(e, t, ["rl", "lr"]);
                                    break;
                                case "line":
                                    var n = t.split(","),
                                        s = n[0];
                                    a.integer(e, s), a.percent(e, s) && a.set("snapToLines", !1), a.alt(e, s, ["auto"]), 2 === n.length && a.alt("lineAlign", n[1], ["start", c, "end"]);
                                    break;
                                case "position":
                                    n = t.split(","), a.percent(e, n[0]), 2 === n.length && a.alt("positionAlign", n[1], ["start", c, "end", "line-left", "line-right", "auto"]);
                                    break;
                                case "size":
                                    a.percent(e, t);
                                    break;
                                case "align":
                                    a.alt(e, t, ["start", c, "end", "left", "right"])
                            }
                        }, /:/, /\s/), t.region = a.get("region", null), t.vertical = a.get("vertical", "");
                        var i = a.get("line", "auto");
                        "auto" === i && -1 === f.line && (i = -1), t.line = i, t.lineAlign = a.get("lineAlign", "start"), t.snapToLines = a.get("snapToLines", !0), t.size = a.get("size", 100), t.align = a.get("align", c);
                        var o = a.get("position", "auto");
                        "auto" === o && 50 === f.position && (o = "start" === t.align || "left" === t.align ? 0 : "end" === t.align || "right" === t.align ? 100 : 50), t.position = o
                    }(e, t)
            }

            function l(e) {
                return e.replace(/<br(?: \/)?>/gi, "\n")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            }), r.fixLineBreaks = void 0;
            var u = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(56)),
                d = function() {
                    return {
                        decode: function(e) {
                            if (!e) return "";
                            if ("string" != typeof e) throw new Error("Error - expected string data.");
                            return decodeURIComponent(encodeURIComponent(e))
                        }
                    }
                };
            n.prototype = {
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
                    for (var a = 0; a < r.length; ++a)
                        if (t === r[a]) {
                            this.set(e, t);
                            break
                        }
                },
                integer: function(e, t) {
                    /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10))
                },
                percent: function(e, t) {
                    return !!(t.match(/^([\d]{1,3})(\.[\d]*)?%$/) && (t = parseFloat(t)) >= 0 && t <= 100) && (this.set(e, t), !0)
                }
            };
            var f = new u.default(0, 0, 0),
                c = "middle" === f.align ? "middle" : "center";
            a.prototype = {
                parse: function(e) {
                    function t() {
                        var e = r.buffer,
                            t = 0;
                        for (e = l(e); t < e.length && "\r" !== e[t] && "\n" !== e[t];) ++t;
                        var a = e.substr(0, t);
                        return "\r" === e[t] && ++t, "\n" === e[t] && ++t, r.buffer = e.substr(t), a
                    }
                    var r = this;
                    e && (r.buffer += r.decoder.decode(e, {
                        stream: !0
                    }));
                    try {
                        var a;
                        if ("INITIAL" === r.state) {
                            if (!/\r\n|\n/.test(r.buffer)) return this;
                            var i = (a = t()).match(/^WEBVTT([ \t].*)?$/);
                            if (!i || !i[0]) throw new Error("Malformed WebVTT signature.");
                            r.state = "HEADER"
                        }
                        for (var n = !1; r.buffer;) {
                            if (!/\r\n|\n/.test(r.buffer)) return this;
                            switch (n ? n = !1 : a = t(), r.state) {
                                case "HEADER":
                                    /:/.test(a) ? s(a, function(e, t) {}, /:/) : a || (r.state = "ID");
                                    continue;
                                case "NOTE":
                                    a || (r.state = "ID");
                                    continue;
                                case "ID":
                                    if (/^NOTE($|[ \t])/.test(a)) {
                                        r.state = "NOTE";
                                        break
                                    }
                                    if (!a) continue;
                                    if (r.cue = new u.default(0, 0, ""), r.state = "CUE", -1 === a.indexOf("--\x3e")) {
                                        r.cue.id = a;
                                        continue
                                    }
                                case "CUE":
                                    try {
                                        o(a, r.cue, r.regionList)
                                    } catch (e) {
                                        r.cue = null, r.state = "BADCUE";
                                        continue
                                    }
                                    r.state = "CUETEXT";
                                    continue;
                                case "CUETEXT":
                                    var d = -1 !== a.indexOf("--\x3e");
                                    if (!a || d && (n = !0)) {
                                        r.oncue && r.oncue(r.cue), r.cue = null, r.state = "ID";
                                        continue
                                    }
                                    r.cue.text && (r.cue.text += "\n"), r.cue.text += a;
                                    continue;
                                case "BADCUE":
                                    a || (r.state = "ID");
                                    continue
                            }
                        }
                    } catch (e) {
                        "CUETEXT" === r.state && r.cue && r.oncue && r.oncue(r.cue), r.cue = null, r.state = "INITIAL" === r.state ? "BADWEBVTT" : "BADCUE"
                    }
                    return this
                },
                flush: function() {
                    var e = this;
                    try {
                        if (e.buffer += e.decoder.decode(), (e.cue || "HEADER" === e.state) && (e.buffer += "\n\n", e.parse()), "INITIAL" === e.state) throw new Error("Malformed WebVTT signature.")
                    } catch (e) {
                        throw e
                    }
                    return e.onflush && e.onflush(), this
                }
            }, r.fixLineBreaks = l, r.default = a
        }, {
            56: 56
        }],
        58: [function(e, t, r) {
            "use strict";
            var a = function(e) {
                    return e && e.__esModule ? e : {
                        default: e
                    }
                }(e(57)),
                i = function(e, t, r) {
                    return e.substr(r || 0, t.length) === t
                },
                n = function(e) {
                    var t = parseInt(e.substr(-3)),
                        r = parseInt(e.substr(-6, 2)),
                        a = parseInt(e.substr(-9, 2)),
                        i = e.length > 9 ? parseInt(e.substr(0, e.indexOf(":"))) : 0;
                    return isNaN(t) || isNaN(r) || isNaN(a) || isNaN(i) ? -1 : (t += 1e3 * r, t += 6e4 * a, t += 36e5 * i)
                },
                s = function(e) {
                    for (var t = 5381, r = e.length; r;) t = 33 * t ^ e.charCodeAt(--r);
                    return (t >>> 0).toString()
                },
                o = function(e, t, r) {
                    var a = e[t],
                        i = e[a.prevCC];
                    if (!i || !i.new && a.new) return e.ccOffset = e.presentationOffset = a.start, void(a.new = !1);
                    for (; i && i.new;) e.ccOffset += a.start - i.start, a.new = !1, i = e[(a = i).prevCC];
                    e.presentationOffset = r
                },
                l = {
                    parse: function(e, t, r, l, u, d) {
                        var f = /\r\n|\n\r|\n|\r/g,
                            c = String.fromCharCode.apply(null, new Uint8Array(e)).trim().replace(f, "\n").split("\n"),
                            h = "00:00.000",
                            g = 0,
                            v = 0,
                            p = 0,
                            y = [],
                            m = void 0,
                            E = !0,
                            b = new a.default;
                        b.oncue = function(e) {
                            var t = r[l],
                                a = r.ccOffset;
                            t && t.new && (void 0 !== v ? a = r.ccOffset = t.start : o(r, l, p)), p && (a = p + r.ccOffset - r.presentationOffset), e.startTime += a - v, e.endTime += a - v, e.id = s(e.startTime) + s(e.endTime) + s(e.text), e.text = decodeURIComponent(escape(e.text)), e.endTime > 0 && y.push(e)
                        }, b.onparsingerror = function(e) {
                            m = e
                        }, b.onflush = function() {
                            m && d ? d(m) : u(y)
                        }, c.forEach(function(e) {
                            if (E) {
                                if (i(e, "X-TIMESTAMP-MAP=")) {
                                    E = !1, e.substr(16).split(",").forEach(function(e) {
                                        i(e, "LOCAL:") ? h = e.substr(6) : i(e, "MPEGTS:") && (g = parseInt(e.substr(7)))
                                    });
                                    try {
                                        g -= t = t < 0 ? t + 8589934592 : t, v = n(h) / 1e3, p = g / 9e4, -1 === v && (m = new Error("Malformed X-TIMESTAMP-MAP: " + e))
                                    } catch (t) {
                                        m = new Error("Malformed X-TIMESTAMP-MAP: " + e)
                                    }
                                    return
                                }
                                "" === e && (E = !1)
                            }
                            b.parse(e + "\n")
                        }), b.flush()
                    }
                };
            t.exports = l
        }, {
            57: 57
        }],
        59: [function(e, t, r) {
            "use strict";

            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var i = function() {
                    function e(e, t) {
                        for (var r = 0; r < t.length; r++) {
                            var a = t[r];
                            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a)
                        }
                    }
                    return function(t, r, a) {
                        return r && e(t.prototype, r), a && e(t, a), t
                    }
                }(),
                n = e(54),
                s = function() {
                    function e(t) {
                        a(this, e), t && t.xhrSetup && (this.xhrSetup = t.xhrSetup)
                    }
                    return i(e, [{
                        key: "destroy",
                        value: function() {
                            this.abort(), this.loader = null
                        }
                    }, {
                        key: "abort",
                        value: function() {
                            var e = this.loader;
                            e && 4 !== e.readyState && (this.stats.aborted = !0, e.abort()), window.clearTimeout(this.requestTimeout), this.requestTimeout = null, window.clearTimeout(this.retryTimeout), this.retryTimeout = null
                        }
                    }, {
                        key: "load",
                        value: function(e, t, r) {
                            this.context = e, this.config = t, this.callbacks = r, this.stats = {
                                trequest: performance.now(),
                                retry: 0
                            }, this.retryDelay = t.retryDelay, this.loadInternal()
                        }
                    }, {
                        key: "loadInternal",
                        value: function() {
                            var e, t = this.context;
                            e = "undefined" != typeof XDomainRequest ? this.loader = new XDomainRequest : this.loader = new XMLHttpRequest;
                            var r = this.stats;
                            r.tfirst = 0, r.loaded = 0;
                            var a = this.xhrSetup;
                            try {
                                if (a) try {
                                    a(e, t.url)
                                } catch (r) {
                                    e.open("GET", t.url, !0), a(e, t.url)
                                }
                                e.readyState || e.open("GET", t.url, !0)
                            } catch (r) {
                                return void this.callbacks.onError({
                                    code: e.status,
                                    text: r.message
                                }, t, e)
                            }
                            t.rangeEnd && e.setRequestHeader("Range", "bytes=" + t.rangeStart + "-" + (t.rangeEnd - 1)), e.onreadystatechange = this.readystatechange.bind(this), e.onprogress = this.loadprogress.bind(this), e.responseType = t.responseType, this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), this.config.timeout), e.send()
                        }
                    }, {
                        key: "readystatechange",
                        value: function(e) {
                            var t = e.currentTarget,
                                r = t.readyState,
                                a = this.stats,
                                i = this.context,
                                s = this.config;
                            if (!a.aborted && r >= 2)
                                if (window.clearTimeout(this.requestTimeout), 0 === a.tfirst && (a.tfirst = Math.max(performance.now(), a.trequest)), 4 === r) {
                                    var o = t.status;
                                    if (o >= 200 && o < 300) {
                                        a.tload = Math.max(a.tfirst, performance.now());
                                        var l = void 0,
                                            u = void 0;
                                        u = "arraybuffer" === i.responseType ? (l = t.response).byteLength : (l = t.responseText).length, a.loaded = a.total = u;
                                        var d = {
                                            url: t.responseURL,
                                            data: l
                                        };
                                        this.callbacks.onSuccess(d, a, i, t)
                                    } else a.retry >= s.maxRetry || o >= 400 && o < 499 ? (n.logger.error(o + " while loading " + i.url), this.callbacks.onError({
                                        code: o,
                                        text: t.statusText
                                    }, i, t)) : (n.logger.warn(o + " while loading " + i.url + ", retrying in " + this.retryDelay + "..."), this.destroy(), this.retryTimeout = window.setTimeout(this.loadInternal.bind(this), this.retryDelay), this.retryDelay = Math.min(2 * this.retryDelay, s.maxRetryDelay), a.retry++)
                                } else this.requestTimeout = window.setTimeout(this.loadtimeout.bind(this), s.timeout)
                        }
                    }, {
                        key: "loadtimeout",
                        value: function() {
                            n.logger.warn("timeout while loading " + this.context.url), this.callbacks.onTimeout(this.stats, this.context, null)
                        }
                    }, {
                        key: "loadprogress",
                        value: function(e) {
                            var t = e.currentTarget,
                                r = this.stats;
                            r.loaded = e.loaded, e.lengthComputable && (r.total = e.total);
                            var a = this.callbacks.onProgress;
                            a && a(r, this.context, null, t)
                        }
                    }]), e
                }();
            r.default = s
        }, {
            54: 54
        }]
    }, {}, [40])(40)
});