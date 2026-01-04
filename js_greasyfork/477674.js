// ==UserScript==
// @name         HackIUniversityVideo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Completare la % di visione dei video
// @author       You
// @match    https://lms-courses.pegaso.multiversity.click/main/lp-video_student_view/lesson_student_view.php*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
 // @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/477674/HackIUniversityVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/477674/HackIUniversityVideo.meta.js
// ==/UserScript==
/* global $ */
(function() {
    console.log("Welcome in HackIUniversityVideo");
    'use strict';

function Video(e, t, r, o, n, i, a, l, c, s, u) {
    var d, p, m, v, f, _, w, g, h, b = 0, x = 0, F = 20, T = 0, S = 0, k = 0, z = 0, y = null;
    var pause = true;
    (new Date).getTime();
    function j(e) {
        var t = Math.round(e)
            , r = Math.floor(t / 3600)
            , o = Math.floor((t - 3600 * r) / 60)
            , n = t - 3600 * r - 60 * o;
        return r < 10 && r > 0 && (r = "0" + r),
        o < 10 && (o = "0" + o),
        n < 10 && (n = "0" + n),
            r > 0 ? r + ":" + o + ":" + n : o + ":" + n
    }
    function E() {
        $.ajax({
            method: "POST",
            url: d + "lp.ajax.php?a=track_silent",
            global: !0,
            success: function(e) {}
        })
    }
    function showVideoBanner(){
        if(!pause){
            $('.lessonTitle').show(200);
            $('.profName').show(200);
            setTimeout(function(){
                if(!pause) {
                    $('.lessonTitle').hide(400);
                }
            },3000);
            setTimeout(function(){
                if(!pause) {
                    $('.profName').hide(400);
                }
            },3000);
        }
    }
    function O() {
        m.pause(),
            m.exitFullscreen ? m.exitFullscreen() : m.webkitExitFullscreen ? m.webkitExitFullscreen() : m.mozCancelFullScreen ? m.mozCancelFullScreen() : m.msExitFullscreen && m.msExitFullscreen(),
            $("#control-play").show(),
            $("#control-pause").hide(),
            $.ajax({
                method: "POST",
                url: d + "lp.ajax.php?a=pauseVideo",
                global: !0,
                data: {
                    course_code: v,
                    lp_item_id: f,
                    lp_view_id: _,
                    current_time: S
                },
                success: function(e) {},
                error: function() {}
            })
    }
    p = e,
        d = i,
        v = t,
        f = r,
        _ = o,
        w = n,
        g = l,
        h = c,
    u > 0 && (b = u),
        (m = videojs("my-video", {
            autoplay: !1,
            controls: a,
            type: "video/mp4"
        })).src(p),
        $(window).on("mousemove", function(e) {
            y = e.timeStamp
        }),
        m.on("play", function() {
        console.log("PLAY");
            var e = {
                command: "subscribe_videoLesson",
                user_id: h
            };
            JSON.stringify(e);
            a && E()
            pause = false;
            showVideoBanner()

        }),
        m.on("contextmenu", function(e) {
            e.preventDefault()
        }),
        m.on("ended", function(e) {
            window.location.reload()
        }),
        m.on("loadedmetadata", function(e) {
            !function() {
                $("#row_control_player").show(100),
                    T = parseInt(m.duration()),
                a || w > 5 && T > w && m.currentTime(w - 5);
                S = m.currentTime(),
                    k = S;
                var e = parseInt(T / 10);
                F = e,
                    $("#row_alert_video").html(""),
                    t = s,
                    $.ajax({
                        url: t + "/vtt/" + v + "/" + g,
                        type: "GET",
                        headers: { "Access-Control-Request-method":"GET" },
                        success: function(e) {
                            var t = e.data.vttUrl;
                            m.addRemoteTextTrack({
                                src: t,
                                srclang: "it",
                                label: "Annotazioni docente"
                            }, !0),
                                m.textTracks()[0].mode = "showing"
                        }
                    }),
                    $.ajax({
                        method: "POST",
                        url: d + "lp.ajax.php?a=setTrackingStart",
                        global: !0,
                        data: {
                            duration: parseInt(m.duration()),
                            course_code: v,
                            lp_item_id: f,
                            lp_view_id: _,
                            current_time: S
                        },
                        success: function(e) {},
                        error: function(e) {}
                    }),
                    $("#duration_box").html(j(T)),
                    $("#currenttime_box").html(j(S));
                var t
            }()
        }),
        m.on("loadeddata", function(e) {}),
        m.on("loadstart", function(e) {
            $("#row_alert_video").html("<div class='alert alert-info'>Attendere caricamento video</div>")
        }),
        m.on("pause", function() {
            var e = {
                command: "unsubscribe_videoLesson",
                user_id: h
            };
            $('.lessonTitle').show(200);
            $('.profName').show(200);
            JSON.stringify(e);
            a && E()
            pause = true;
        }),
        m.on("mouseover", function() {
            $('.lessonTitle').show(200);
            $('.profName').show(200);
        }),
        m.on("mouseleave", function() {
            if(!pause){
                $('.lessonTitle').hide(200);
                $('.profName').hide(200);
            }
        }),
        m.on("click", function() {
            $('.lessonTitle').show(200);
            $('.profName').show(200);
        }),
        m.on("doubleclick", function() {
            $('.lessonTitle').show(200);
            $('.profName').show(200);
        }),
    a || m.ready(function() {
        this.on("timeupdate", function(e) {
            !function() {
                if ((S = parseInt(m.currentTime())) > k) {
                    var e = new Date
                        , t = e.getTime()
                        , r = parseInt(t)
                        , o = r - z
                        , n = S - k;
                    if (z > 0 && o + 700 < 1e3 * n)
                        return O(),
                            !1;
                    z = r
                }
                if (S > k + 5)
                    return window.location.reload(),
                        !1;
                k = S,
                    $("#currenttime_box").html(j(S)),
                parseInt(S) > F / 2 && T > 0 && (S > x && S % F == 0 && $.ajax({
                    method: "POST",
                    url: d + "lp.ajax.php?a=get_percent",
                    global: !0,
                    data: {
                        course_code: v,
                        lp_item_id: f,
                        lp_view_id: _,
                        max_second: x,
                        duration: T,
                        second_to_save: F,
                        lesson_random_id: b
                    },
                    success: function(e) {
                        var t = JSON.parse(e);
                        "true" === t.save ? ($("#progressbar").attr("aria-valuenow", t.percent),
                            $("#progressbar").attr("style", "width:" + t.percent + "%"),
                            $("#progressbar").html(t.percent + "%"),
                        "true" === t.pause && (O(),
                        y < 3e3 && (window.location.reload(),
                            $.ajax({
                                method: "POST",
                                url: d + "lp.ajax.php?a=save_error",
                                global: !0,
                                data: {
                                    mouseMoveTime: y
                                },
                                success: function(e) {}
                            })))) : ("forwarded" === t.status && ($("#col_center").html("<div class=\"alert alert-danger\">Errore - 112, <strong>La preghiamo di controllare la connessione Internet.</strong><br> Se il problema persiste contatti il supporto tecnico all'indirizzo e-mail supporto@unipegaso.it.<br> Per permetterci di individuare e correggere velocemente l'eventuale problematica, la preghiamo di specificare dispositivo e browser utilizzati.</div>"),
                            O(),
                            setTimeout(function() {
                                window.location.reload()
                            }, 2e3)),
                        "doublelesson" === t.status && (O(),
                            $("#col_center").html('<div class="alert alert-danger">Errore - 120, <strong>Non &egrave; possibile visualizzare pi&ugrave; di una videolezione alla volta</strong><br> Se il problema persiste contattare il supporto tecnico</div>'),
                            setTimeout(function() {
                                window.location.reload()
                            }, 2e3)))
                    },
                    error: function(e) {
                        $("#col_center").html("<div class=\"alert alert-danger\">Errore - 111, <strong>La preghiamo di controllare la connessione Internet.</strong><br> Se il problema persiste contatti il supporto tecnico all'indirizzo e-mail supporto@unipegaso.it.<br> Per permetterci di individuare e correggere velocemente l'eventuale problematica, la preghiamo di specificare dispositivo e browser utilizzati.</div>"),
                            O()
                    }
                }),
                S > x && (x = S),
                S == T && window.location.reload())
            }()
        })
    }),
        $(function() {
            $("#set-start").click(function() {
                var e = m.currentTime();
                $("#startime").val(moment.utc(1e3 * e).format("HH:mm:ss"))
            }),
                $("#set-end").click(function() {
                    var e = m.currentTime();
                    $("#endtime").val(moment.utc(1e3 * e).format("HH:mm:ss"))
                }),
                $("#control-play").on("click", function() {
                console.log("control-play");
                    m.play(),
                        $("#control-pause").show(),
                        $("#control-play").hide(),
                        $.ajax({
                            method: "POST",
                            url: d + "lp.ajax.php?a=startVideo",
                            global: !0,
                            data: {
                                course_code: v,
                                lp_item_id: f,
                                lp_view_id: _,
                                duration: T
                            },
                            success: function() {},
                            error: function() {
                                window.location.reload(!0)
                            }
                        })
                }),
                $("#control-fullscreen").click(function() {
                    m.requestFullscreen ? m.requestFullscreen() : m.msRequestFullscreen ? m.msRequestFullscreen() : m.mozRequestFullScreen ? m.mozRequestFullScreen() : m.webkitRequestFullscreen && m.webkitRequestFullscreen()
                }),
                $("#control-pause").click(function() {
                    O()
                }),
                $("#control-rewind").click(function() {
                    var e = m.currentTime();
                    (e -= 10) < 0 && (e = 0),
                        m.currentTime(e)
                }),
                $("#control-restart").click(function() {
                    m.currentTime(0)
                }),
                $("#list-par").find("a").click(function(e) {
                    m.pause(),
                        m.exitFullscreen ? m.exitFullscreen() : m.webkitExitFullscreen ? m.webkitExitFullscreen() : m.mozCancelFullScreen ? m.mozCancelFullScreen() : m.msExitFullscreen && m.msExitFullscreen(),
                        $("#control-play").show(),
                        $("#control-pause").hide()
                })
        })
}
})();