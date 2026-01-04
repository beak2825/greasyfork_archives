// ==UserScript==
// @name         iKanBot ArtPlayer
// @namespace    https://github.com/sffxzzp
// @version      0.33
// @description  Replace ikanbot.com's default player to artplayer
// @author       sffxzzp
// @require      https://fastly.jsdelivr.net/npm/hls.js@1.5.5/dist/hls.min.js
// @require      https://fastly.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js
// @require      https://fastly.jsdelivr.net/npm/dashjs@4.7.3/dist/dash.all.min.js
// @require      https://fastly.jsdelivr.net/npm/artplayer@5.1.1/dist/artplayer.js
// @match        *://*.ikanbot.com/play/*
// @grant        GM_webRequest
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474897/iKanBot%20ArtPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/474897/iKanBot%20ArtPlayer.meta.js
// ==/UserScript==

(function() {
    // try to unload player
    function unload() {
        if (unsafeWindow.videojs.players.hasOwnProperty('ikanbot-player')) {
            unsafeWindow.videojs.players['ikanbot-player'].unloadTech_();
            clearInterval(intID);
        }
    }
    let intID = setInterval(function () {unload()}, 1000);

    // the rest of the code should run when document loaded instead of document-start
    document.addEventListener('DOMContentLoaded', init);
    function init() {
        var playM3u8 = function (video, url, art) {
            if (Hls.isSupported()) {
                if (art.hls) {
                    art.hls.destroy();
                }
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.on('destroy', function () {
                    hls.destroy();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Unsupported: m3u8';
            }
        };
        var playFlv = function (video, url, art) {
            if (flvjs.isSupported()) {
                if (art.flv) {
                    art.flv.destroy();
                }
                const flv = flvjs.createPlayer({ type: 'flv', url });
                flv.attachMediaElement(video);
                flv.load();
                art.flv = flv;
                art.on('destroy', function () {
                    flv.destroy();
                });
            } else {
                art.notice.show = 'Unsupported: flv'
            }
        };
        var playMpd = function (video, url, art) {
            if (dashjs.supportsMediaSource()) {
                if (art.dash) {
                    art.dash.destroy();
                }
                const dash = dashjs.MediaPlayer().create();
                dash.initialize(video, url, art.option.autoplay);
                art.dash = dash;
                art.on('destroy', function () {
                    dash.destroy();
                });
            } else {
                art.notice.show = 'Unsupported: mpd'
            }
        };

        var hideScrollBar = function (fullscreen) {
            if (fullscreen) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        };

        Artplayer.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8];

        document.querySelector('video').pause();
        let container = document.querySelector('#pc-player').parentNode;
        container.innerHTML = '';
        container.style.height = '600px';
        const art = new Artplayer({
            container: container,
            url: '',
            volume: 1,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            setting: true,
            pip: true,
            fullscreen: true,
            fullscreenWeb: true,
            miniProgressBar: true,
            fastForward: true,
            autoOrientation: true,
            airplay: true,
            customType: {
                m3u8: playM3u8,
                flv: playFlv,
                mpd: playMpd,
            },
        });
        art.isFocus = true;
        art.pause();
        art.on('fullscreen', hideScrollBar);
        art.on('fullscreenWeb', hideScrollBar);
        let dp = null;

        document.onkeydown = function() {
            let video = art || document.querySelector('video');
            let pbrate = video.playbackRate || 1;
            let step = 30;
            function toggleFullscreen() { if (art) { art.fullscreen = !art.fullscreen; } else if (dp) { if (dp.fullScreen.isFullScreen()) { dp.fullScreen.cancel(); } else { dp.fullScreen.request(); }} else { if (!document.fullscreenElement) { video.requestFullscreen(); } else { document.exitFullscreen(); }}}
            function notice(text) {if (art) { art.notice.show = text; } else if (dp) { dp.notice(text); }}
            if (event.key == ">" && event.shiftKey) {video.currentTime += step;notice(`快进 ${step} 秒`);}
            if (event.key == "<" && event.shiftKey) {video.currentTime -= step;notice(`快退 ${step} 秒`);}
            if (event.key == "f") {toggleFullscreen();}
            if (event.key == "=" && event.repeat === false) {pbrate = pbrate * 2;}
            if (event.key == "-" && event.repeat === false) {pbrate = pbrate / 2;}
            if (event.key == " " && event.shiftKey) { if (art) {art.toggle()} else {video.paused == true ? video.play() : video.pause()} }
            if (event.key == "+" && event.shiftKey) {pbrate += 0.5;}
            if (event.key == "_" && event.shiftKey) {pbrate -= 0.5;}
            if (event.key == "!" && event.shiftKey) {pbrate = 1;}
            if (event.key == "@" && event.shiftKey) {pbrate = 2;}
            if (event.key == "#" && event.shiftKey) {pbrate = 3;}
            if (event.key == "$" && event.shiftKey) {pbrate = 4;}
            if (event.key == "%" && event.shiftKey) {pbrate = 5;}
            if (event.key == "^" && event.shiftKey) {pbrate = 6;}
            if (event.key == "&" && event.shiftKey) {pbrate = 7;}
            if (event.key == "*" && event.shiftKey) {pbrate = 8;}
            if (pbrate != video.playbackRate) {video.playbackRate = pbrate; notice(`速度：${pbrate}x`);}
        };
        document.onkeyup = function() {
            let video = art || document.querySelector('video');
            let pbrate = video.playbackRate || 1;
            function notice(text) {if (art) { art.notice.show = text; } else if (dp) { dp.notice(text); }}
            if (event.key == "=") {pbrate = pbrate / 2;}
            if (event.key == "-") {pbrate = pbrate * 2;}
            video.playbackRate = pbrate;
            if (pbrate != video.playbackRate) {notice(`速度：${pbrate}x`);}
        };
        function load() {
            let video = art.video || document.querySelector('video');
            let videoId = document.getElementById("current_id").value;
            document.querySelectorAll('div[name=lineData]').forEach(function (node) {
                var link = node.getAttribute('udata');
                let vbtn = document.createElement('div');
                vbtn.innerHTML = node.innerHTML;
                vbtn.setAttribute('link', link);
                vbtn.setAttribute('class', 'lineData');
                vbtn.id = node.id;
                vbtn.onclick = function () {
                    art.switchUrl(this.getAttribute('link'));
                    document.querySelectorAll('div.lineData').forEach(function (node) {
                        node.style.background = "white";
                    })
                    this.style.background = "cyan";
                    unsafeWindow.savePlayHistory({
                        videoId: videoId,
                        lineId: this.id,
                        title: document.getElementById("video_title").innerText,
                        name: this.innerText,
                        date: (new Date()).getTime(),
                    })
                    video.scrollIntoView({behavior: "smooth", block: "center"});
                };
                node.parentNode.appendChild(vbtn);
                node.parentNode.removeChild(node);
            });
            let historyV = unsafeWindow.getPlayHistory(videoId);
            if (historyV) {
                try { if (historyV.lineId) { document.getElementById(historyV.lineId).click(); }} catch (e) {}
            } else {
                document.querySelector('div.lineData').click();
            }
        }
        var lineData = document.getElementById('lineContent');
        var observer = new MutationObserver(function (recs) {
            load();
        });
        observer.observe(lineData, { childList: true, subtree: true });
    }
})();
