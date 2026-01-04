// ==UserScript==
// @name         한국기술교육대학교 온라인 강의 플레이어 단축키 패치
// @name:en      KoreaTech EL Player Shortcut Patch
// @namespace    mailto:refracta@koreatech.ac.kr
// @version      0.5
// @description  한국기술교육대학교 온라인 강의 플레이어에 키보드 단축키를 추가합니다.
// @description:en Add a keyboard shortcut to the KoreaTech online education lecture player.
// @author       refracta
// @match        https://el.koreatech.ac.kr/ilos/st/course/*
// @downloadURL https://update.greasyfork.org/scripts/398544/%ED%95%9C%EA%B5%AD%EA%B8%B0%EC%88%A0%EA%B5%90%EC%9C%A1%EB%8C%80%ED%95%99%EA%B5%90%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EA%B0%95%EC%9D%98%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%ED%8C%A8%EC%B9%98.user.js
// @updateURL https://update.greasyfork.org/scripts/398544/%ED%95%9C%EA%B5%AD%EA%B8%B0%EC%88%A0%EA%B5%90%EC%9C%A1%EB%8C%80%ED%95%99%EA%B5%90%20%EC%98%A8%EB%9D%BC%EC%9D%B8%20%EA%B0%95%EC%9D%98%20%ED%94%8C%EB%A0%88%EC%9D%B4%EC%96%B4%20%EB%8B%A8%EC%B6%95%ED%82%A4%20%ED%8C%A8%EC%B9%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pathname = location.pathname
        if (pathname.endsWith('online_view_form.acl')) {
            outerIframeLogic();
        } else if (pathname.endsWith('online_view.acl')) {
            innerIframeLogic();
        }

        /* Iframe 내부 */
    function innerIframeLogic() {
        let player = videojs('test_player');
        let playerEl = player.el();

        window.addEventListener('message', function (e) {
            e = e.data;
            eval(e.callback).apply(void 0, e.args);
        });

        if (window.parent !== window) {
            document.addEventListener('keydown', e => window.parent.postMessage(e.code));
        }
        // Source from MainPage line 389
        window.fade = (m, d) => {
            $("#alert_fadeout").text(m);
            var wrap = $("#mediaspace");
            if (wrap.length > 0) {
                var top = wrap.offset().top + (wrap.outerHeight() / 2);
                var left = wrap.offset().left + (wrap.outerWidth() / 2);
                $("#alert_fadeout").css({
                    "top": top + "px",
                    "left": left + "px"
                });
                $("#alert_fadeout").show();
                if (window.lastFade) {
                    clearInterval(lastFade);
                }
                window.lastFade = setTimeout(_ => {
                    $("#alert_fadeout").fadeOut();
                }, d * 1000);
            }
        }
    }
    /* Iframe 외부 */
    function outerIframeLogic() {
        function evalInnerIframe(callback, args) {
            callback = `(${callback.toString()})`;
            $('#contentViewer').get(0).contentWindow.postMessage({
                callback,
                args
            });
        }

        function setPlayerTimeByDelta(delta) {
            evalInnerIframe(function (d) {
                let time = player.currentTime();
                let duration = player.duration();
                time += d;
                time = time < 0 ? 0 : time;
                time = time > duration ? duration : time;
                player.currentTime(time);
            }, [delta]);
        }

        function toggleInterface() {
            evalInnerIframe(function () {
                $(playerEl).removeClass('vjs-user-inactive').addClass('vjs-user-active');
                if (window.lastTimeout) {
                    clearInterval(lastTimeout);
                }
                window.lastTimeout = setTimeout(_ => {
                    $(playerEl).removeClass('vjs-user-active').addClass('vjs-user-inactive');
                }, player.options().inactivityTimeout);
            });
        }

        function fade(msg, delay) {
            evalInnerIframe(function (m, d) {
                fade(m, d);
            }, [msg, delay]);
        }

        function setVolumeByDelta(delta) {
            evalInnerIframe(function (d) {
                player.volume((player.volume() + d).toFixed(2));
            }, [delta]);
        }

        function setPlaybackRateByDelta(delta) {
            evalInnerIframe(function (d) {
                let speed = (player.playbackRate() + d).toFixed(1);
                speed = speed < 0.2 ? 0.2 : speed;
                speed = speed > 32 ? 32 : speed;
                player.playbackRate(speed);
            }, [delta]);
        }

        function setPlaybackRate(playbackRate) {
            evalInnerIframe(function (p) {
                player.playbackRate(p);
            }, [playbackRate]);
        }

        function fadePlaybackRate() {
            evalInnerIframe(function () {
                // 미세 지연이 없으면 내부 값 갱신이 되지 않는 듯함
                setTimeout(_ => fade(`속도 ${player.playbackRate()}배`, 0.75), 0);
            });
        }

        function fadeVolume() {
            evalInnerIframe(function () {
                fade(`음량 ${Math.floor(player.volume() * 100)}%`, 0.75);
            });
        }

        function toggleTableOfContents() {
            $("#navi_").click();
        }

        function nextLecture() {
            $("#next_").click();
        }

        function prevLecture() {
            $("#prev_").click();
        }

        function closeLecture() {
            $("#close_").click();
        }

        function keyListener(eCode) {
            switch (eCode) {
            case 'ArrowLeft':
                setPlayerTimeByDelta(-10);
                fade("시간 -10초", 0.75);
                toggleInterface();
                break;
            case 'ArrowRight':
                setPlayerTimeByDelta(+10);
                fade("시간 +10초", 0.75);
                toggleInterface();
                break;
            case 'ArrowUp':
                setVolumeByDelta(+0.05);
                fadeVolume();
                toggleInterface();
                break;
            case 'ArrowDown':
                setVolumeByDelta(-0.05);
                fadeVolume();
                toggleInterface();
                break;
            case 'KeyZ':
                setPlaybackRate(1);
                fadePlaybackRate();
                toggleInterface();
                break;
            case 'KeyX':
                setPlaybackRateByDelta(-0.2);
                fadePlaybackRate();
                toggleInterface();
                break;
            case 'KeyC':
                setPlaybackRateByDelta(+0.2);
                fadePlaybackRate();
                toggleInterface();
                break;
            case 'KeyH':
                toggleTableOfContents();
                break;
            case 'KeyN':
                nextLecture();
                break;
            case 'KeyP':
                prevLecture();
                break;
            case 'KeyQ':
                closeLecture();
                break;
            case 'Space':
                evalInnerIframe(function () {
                    player.paused() ? fade('재생', 0.75) : fade('정지', 0.75);
                    player.paused() ? player.play() : player.pause();
                });
                toggleInterface();
                break;
            }
        }
        window.addEventListener('message', e => keyListener(e.data));
        document.addEventListener('keydown', e => keyListener(e.code));

        console.log('%cKoreatech EL Player Shortcut Patch', "font-size:450%;font-weight:bold;color:orange;font-family:dotum;");
        console.log('%cby refracta', "font-size:150%;font-weight:bold;");
        console.log('Mail: refracta@koreatech.ac.kr');
        console.log('←, →: 강의 시간 이동 (10초)');
        console.log('↑, ↓: 음량 조절 (5%)');
        console.log('Z: 1배속');
        console.log('X: 배속 감소 (0.2x)');
        console.log('C: 배속 증가 (0.2x)');
        console.log('Space: 재생/정지');
        console.log('H: 목차 보이기/숨기기');
        console.log('P: 이전 강의');
        console.log('N: 다음 강의');
        console.log('Q: 출석(종료)');
    }
})();