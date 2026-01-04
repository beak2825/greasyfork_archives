// ==UserScript==
// @name         YouTube「再生が中断されていますか？」ポップアップと再生遅延の無効化
// @name:ja      YouTube「再生が中断されていますか？」ポップアップと再生遅延の無効化
// @name:en      Disable YouTube "Experiencing interruptions?" Popup and Playback Delay
// @name:zh-CN   禁用YouTube“播放暂停，是否继续观看？”弹窗及播放延迟
// @name:zh-TW   停用YouTube「播放已暫停，是否繼續觀看？」提示視窗與播放延遲
// @name:ko      YouTube "중단되었나요?" 팝업 및 재생 지연 비활성화
// @name:fr      Désactiver la fenêtre "Lecture interrompue ?" et le délai de lecture sur YouTube
// @name:es      Desactivar el mensaje "¿Se interrumpió la reproducción?" y el retraso de reproducción en YouTube
// @name:de      Deaktiviere das YouTube-Popup "Wiedergabe unterbrochen?" und die Wiedergabeverzögerung
// @name:pt-BR   Desativar o pop-up "A reprodução foi interrompida?" e o atraso de reprodução no YouTube
// @name:ru      Отключить всплывающее окно "Воспроизведение прервано?" и задержку воспроизведения на YouTube
// @version      1.0.2
// @description         YouTubeの「再生が中断されていますか？」ポップアップ（例: "Experiencing interruptions?"）および初回再生時の遅延を自動で無効化します。
// @description:ja      YouTubeの「再生が中断されていますか？」ポップアップ（例: "Experiencing interruptions?"）および初回再生時の遅延を自動で無効化します。
// @description:en      Automatically disables YouTube’s “Experiencing interruptions?” and “Video paused. Continue watching?” popups, as well as initial playback delay.
// @description:zh-CN   自动禁用YouTube“播放暂停，是否继续观看？”弹窗以及初始播放延迟。
// @description:zh-TW   自動停用YouTube 的「播放已暫停，是否繼續觀看？」提示與初始播放延遲。
// @description:ko      YouTube의 "중단되었나요?" 팝업 및 초기 재생 지연을 자동으로 비활성화합니다。
// @description:fr      Désactive automatiquement la fenêtre "Lecture interrompue ?" et le délai de lecture initial sur YouTube.
// @description:es      Desactiva automáticamente el mensaje "¿Se interrumpió la reproducción?" y el retraso inicial de reproducción en YouTube.
// @description:de      Deaktiviert automatisch das YouTube-Popup "Wiedergabe unterbrochen?" und die initiale Wiedergabeverzögerung.
// @description:pt-BR   Desativa automaticamente o pop-up "A reprodução foi interrompida?" e o atraso inicial de reprodução no YouTube.
// @description:ru      Автоматически отключает всплывающее окно "Воспроизведение прервано?" и начальную задержку воспроизведения на YouTube.
// @namespace    https://github.com/koyasi777/youtube-disable-experiencing-interruptions
// @author       koyasi777
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/youtube-disable-experiencing-interruptions
// @supportURL   https://github.com/koyasi777/youtube-disable-experiencing-interruptions/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @compatible   firefox
// @downloadURL https://update.greasyfork.org/scripts/543231/YouTube%E3%80%8C%E5%86%8D%E7%94%9F%E3%81%8C%E4%B8%AD%E6%96%AD%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%81%8B%EF%BC%9F%E3%80%8D%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E3%81%A8%E5%86%8D%E7%94%9F%E9%81%85%E5%BB%B6%E3%81%AE%E7%84%A1%E5%8A%B9%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/543231/YouTube%E3%80%8C%E5%86%8D%E7%94%9F%E3%81%8C%E4%B8%AD%E6%96%AD%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%81%8B%EF%BC%9F%E3%80%8D%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E3%81%A8%E5%86%8D%E7%94%9F%E9%81%85%E5%BB%B6%E3%81%AE%E7%84%A1%E5%8A%B9%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // if (!navigator.userAgent.includes('Firefox')) return;

    const isWatchPage = location.pathname.startsWith('/watch');
    if (!isWatchPage) return;

    Object.defineProperty(window, 'ytInitialData', {
        configurable: true,
        set(value) {
            const patched = undefined;

            Object.defineProperty(window, 'ytInitialData', {
                value: patched,
                writable: false,
                configurable: true
            });
        },
        get() {
            return undefined;
        }
    });
})();
