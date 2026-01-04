// ==UserScript==
// @name        Stripchat Hover Preview
// @name:zh-CN  Stripchat 鼠标悬浮预览
// @name:zh-TW  Stripchat 滑鼠懸停預覽
// @name:ja     Stripchat ホバーでプレビュー
// @name:ko     Stripchat 마우스 오버 미리보기
// @name:ru     Stripchat предварительный просмотр при наведении
// @name:fr     Aperçu au survol pour Stripchat
// @name:es     Vista previa al pasar el ratón - Stripchat
// @name:pt     Stripchat Pré-visualização com o cursor
// @name:de     Stripchat Vorschau beim Überfahren
// @name:it     Anteprima Stripchat al passaggio del mouse
// @name:pl     Stripchat Podgląd przy najechaniu
// @name:tr     Stripchat Üzerine Gelince Önizleme
// @name:vi     Xem trước Stripchat khi di chuột
// @name:th     แสดงตัวอย่าง Stripchat เมื่อชี้เมาส์
// @name:id     Pratinjau Hover Stripchat
// @name:nl     Stripchat Voorbeeld bij Hover
// @name:uk     Stripchat попередній перегляд при наведенні
// @name:sv     Stripchat Förhandsgranskning vid Hover
// @name:no     Stripchat Forhåndsvisning ved Hover
// @name:fi     Stripchat Esikatselu Hoverilla
// @name:ro     Stripchat Previzualizare la Hover
// @name:hu     Stripchat Előnézet Egérrel
// @name:el     Stripchat Προεπισκόπηση κατά την Αιώρηση
// @name:he     תצוגה מקדימה בהצבה על Stripchat
// @name:hi     Stripchat होवर प्रीव्यू
// @name:bn     Stripchat হোভার প্রিভিউ
// @name:ms     Pratonton Stripchat Semasa Hover
// @name:sr     Stripchat Преглед при навођењу
// @name:sk     Stripchat Náhľad pri prechode myšou
// @name:hr     Stripchat Pregled pri prelasku mišem

// @namespace    gonnaGonna
// @version      0.12
// @description        This script enhances your Stripchat browsing experience! Shows a live preview when you hover over a thumbnail.
// @description:zh-CN  这个脚本是一个增强器，用于提升stripchat的浏览体验，功能包含鼠标移入预览，并使用当前直播画面截图替换原本的预览图。
// @description:zh-TW  此腳本能提升 Stripchat 的瀏覽體驗，支援滑鼠懸停時即時預覽直播畫面，並替換原預覽圖。
// @description:ja     このスクリプトはStripchatの閲覧体験を向上させます！サムネイルにマウスを乗せるとライブプレビューが表示されます。
// @description:ko     이 스크립트는 Stripchat의 브라우징 경험을 향상시킵니다! 썸네일 위에 마우스를 올리면 실시간 미리보기를 보여줍니다.
// @description:ru     Этот скрипт улучшает просмотр Stripchat! При наведении курсора отображается живое превью текущей трансляции.
// @description:fr     Ce script améliore votre expérience sur Stripchat ! Affiche un aperçu en direct au survol de la souris.
// @description:es     ¡Este script mejora tu experiencia en Stripchat! Muestra una vista previa en vivo al pasar el ratón por encima de una miniatura.
// @description:pt     Este script melhora sua experiência no Stripchat! Mostra uma pré-visualização ao passar o cursor sobre a miniatura.
// @description:de     Dieses Skript verbessert dein Stripchat-Erlebnis! Zeigt eine Live-Vorschau, wenn du mit der Maus über ein Vorschaubild fährst.
// @description:it     Questo script migliora la tua esperienza su Stripchat! Mostra un'anteprima live al passaggio del mouse sulle miniature.
// @description:pl     Ten skrypt ulepsza korzystanie ze Stripchat! Pokazuje podgląd na żywo po najechaniu kursorem.
// @description:tr     Bu betik Stripchat deneyiminizi geliştirir! Küçük resmin üzerine geldiğinizde canlı önizleme gösterir.
// @description:vi     Script này cải thiện trải nghiệm duyệt Stripchat của bạn! Hiển thị xem trước trực tiếp khi di chuột qua hình thu nhỏ.
// @description:th     สคริปต์นี้ช่วยปรับปรุงประสบการณ์ในการใช้งาน Stripchat! แสดงตัวอย่างสดเมื่อชี้เมาส์ไปที่รูปตัวอย่าง
// @description:id     Script ini meningkatkan pengalaman Anda di Stripchat! Menampilkan pratinjau langsung saat mengarahkan kursor ke gambar kecil.
// @description:nl     Dit script verbetert je Stripchat-ervaring! Toon live voorbeeld wanneer je met de muis over een thumbnail beweegt.
// @description:uk     Цей скрипт покращує перегляд на Stripchat! Показує живе попереднє зображення при наведенні курсору.
// @description:sv     Det här skriptet förbättrar din upplevelse av Stripchat! Visar en liveförhandsvisning vid muspekarn.
// @description:no     Dette skriptet forbedrer Stripchat-opplevelsen din! Viser direktesendt forhåndsvisning ved muspekeren.
// @description:fi     Tämä skripti parantaa Stripchat-selailua! Näyttää live-esikatselun, kun viet hiiren päälle.
// @description:ro     Acest script îmbunătățește experiența ta pe Stripchat! Afișează previzualizare live la trecerea cu mouse-ul.
// @description:hu     Ez a szkript javítja a Stripchat böngészési élményét! Élő előnézetet mutat, amikor az egér fölé kerül.
// @description:el     Αυτό το script βελτιώνει την εμπειρία σας στο Stripchat! Δείχνει ζωντανή προεπισκόπηση κατά την αιώρηση του ποντικιού.
// @description:he     הסקריפט הזה משפר את חוויית הגלישה שלך ב-Stripchat! תצוגה מקדימה חיה בעת ריחוף עם העכבר.
// @description:hi     यह स्क्रिप्ट आपकी Stripchat ब्राउज़िंग अनुभव को बेहतर बनाता है! होवर पर लाइव प्रीव्यू दिखाता है।
// @description:bn     এই স্ক্রিপ্টটি আপনার Stripchat ব্রাউজিং অভিজ্ঞতা উন্নত করে! হোভার করলে লাইভ প্রিভিউ দেখায়।
// @description:ms     Skrip ini meningkatkan pengalaman anda di Stripchat! Pratonton langsung akan dipaparkan semasa hover.
// @description:sr     Овај скрипт побољшава прегледавање Stripchat! Приказује уживо преглед приликом навођења миша.
// @description:sk     Tento skript zlepšuje váš zážitok zo Stripchat! Zobrazuje živý náhľad pri prechode kurzora.
// @description:hr     Ovaj skript poboljšava iskustvo pregledavanja Stripchat! Prikazuje pregled uživo kada prijeđete mišem.

// @author       gonna
// @match        https://*.stripchat.com/*
// @match        https://stripchat.com/*
// @icon         https://stripchat.com/favicon.ico
// @require      https://unpkg.com/hls.js@1.4.13/dist/hls.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      AGPL License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542221/Stripchat%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/542221/Stripchat%20Hover%20Preview.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    GM_addStyle(`
    .stripchat-hls-preview-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .stripchat-hls-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .model-list-item-link {
      position: relative;
      display: inline-block;
    }
    .stripchat-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 14px;
      background-color: rgba(0,0,0,0.4);
      z-index: 2;
    }
    .stripchat-error {
      color: #ff6b6b;
      font-weight: bold;
    }

    .stripchat-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 1px;
      background-color: #ff9000;
      animation: loading-bar 1s linear infinite;
      z-index: 3;
    }

    @keyframes loading-bar {
      0% { width: 0%; }
      100% { width: 100%; }
    }
  `);

    const state = {
        activePreview: null,
        pendingCleanup: null,
        maxPreviews: 3,
        activePreviews: new Map(),
        hoverTime: 300,
        hoverTimer: null,
    };

    $(document).on('mouseenter', '.model-list-item-link', function () {
        cleanupAllPreviews();

        const linkElement = this;
        const $img = $(linkElement).find('img.image-background');

        if (!$img.length) return;

        clearTimeout(state.hoverTimer);

        if (state.activePreview && state.activePreview.linkElement === linkElement) return;

        state.hoverTimer = setTimeout(() => {
            if (state.pendingCleanup) {
                cleanupPreview(state.pendingCleanup);
                state.pendingCleanup = null;
            }

            if (state.activePreviews.size >= state.maxPreviews) {
                const oldest = state.activePreviews.values().next().value;
                cleanupPreview(oldest);
                state.activePreviews.delete(oldest.id);
            }

            const modelId = linkElement.id.replace('model-list-item-', '');
            if (!modelId) return;

            const previewId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const preview = createVideoPreview(linkElement, $img[0], modelId, previewId);
            state.activePreview = preview;
        }, state.hoverTime);
    });

    $(document).on('mouseleave', '.model-list-item-link', function () {
        if (!state.activePreview) return;
        state.pendingCleanup = state.activePreview;
        state.activePreview = null;
        captureAndCleanup(state.pendingCleanup);
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
            cleanupAllPreviews();
        }
    });

    function createVideoPreview(linkElement, imgElement, modelId, previewId) {
        const $container = $('<div>')
        .addClass('stripchat-hls-preview-container')
        .attr('data-preview-id', previewId);

        const $video = $('<video>').addClass('stripchat-hls-preview')
        .prop({ controls: false, autoplay: true, muted: true, playsInline: true });

        const hls = initHlsPlayer($video[0], modelId, previewId);

        const $progress = $('<div>').addClass('stripchat-progress-bar');

        const preview = {
            id: previewId,
            linkElement,
            video: $video[0],
            container: $container[0],
            hls,
            imgElement,
            progressElement: $progress[0],
        };

        state.activePreviews.set(previewId, preview);
        $container.append($video, $progress).appendTo(linkElement);

        return preview;
    }

    function initHlsPlayer(video, modelId, previewId) {
        const hlsUrl = `https://media-hls.doppiocdn.net/b-hls-24/${modelId}/${modelId}.m3u8`;

        if (Hls.isSupported()) {
            const hls = new Hls({
                lowLatencyMode: true,
                maxBufferLength: 10,
                enableWorker: true,
            });

            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                const levels = hls.levels;
                if (levels && levels.length > 1) {
                    hls.nextLevel = levels.length > 2 ? 1 : 0;
                }
                video.play().then(()=> {
                    const preview = state.activePreviews.get(previewId);
                    $('.stripchat-error').remove();
                    if (preview.progressElement && preview.progressElement.parentNode) {
                        preview.progressElement.parentNode.removeChild(preview.progressElement);
                    }
                }).catch(e => console.warn('Autoplay error:', e));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                const preview = state.activePreviews.get(previewId);
                if (!preview) return;

                if (preview.progressElement && preview.progressElement.parentNode) {
                    preview.progressElement.parentNode.removeChild(preview.progressElement);
                }

                const $container = $(preview.container);
                $container.find('.stripchat-error').remove();

                const $error = $('<div>').addClass('stripchat-loading stripchat-error');
                $error.text(data?.response?.code === 403 ? '403 访问被拒绝' : '加载失败');
                $container.append($error);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            cleanupPreview(preview);
                            break;
                    }
                }
            });

            return hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.warn('Autoplay error:', e));
            });
            return null;
        }
    }

    function captureAndCleanup(preview) {
        if (!preview) return;

        captureVideoFrame(preview.video, preview.imgElement, () => {
            cleanupPreview(preview);
            state.activePreviews.delete(preview.id);
            if (state.pendingCleanup === preview) state.pendingCleanup = null;
        });
    }

    function captureVideoFrame(video, imgElement, callback) {
        if (!video || video.readyState === 0 || !imgElement) return callback();

        try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                if (blob) {
                    const newSrc = URL.createObjectURL(blob);
                    imgElement.onload = function () {
                        URL.revokeObjectURL(this.src);
                        callback();
                    };
                    imgElement.src = newSrc;
                } else {
                    callback();
                }
            }, 'image/jpeg', 0.8);
        } catch (e) {
            console.error('截图失败:', e);
            callback();
        }
    }

    function cleanupPreview(preview) {
        try {
            if (preview.video) {
                preview.video.pause();
                preview.video.src = '';
                preview.video.load();
            }

            if (preview.hls) {
                preview.hls.stopLoad();
                preview.hls.detachMedia();
                preview.hls.destroy();
            }

            if (preview.container && preview.container.parentNode) {
                preview.container.parentNode.removeChild(preview.container);
            }

            if (preview.progressElement && preview.progressElement.parentNode) {
                preview.progressElement.parentNode.removeChild(preview.progressElement);
            }
        } catch (e) {
            console.error('预览清理失败:', e);
        }
    }

    function cleanupAllPreviews() {
        for (const preview of state.activePreviews.values()) {
            cleanupPreview(preview);
        }
        state.activePreviews.clear();
        state.activePreview = null;
        state.pendingCleanup = null;
    }

})(jQuery);
