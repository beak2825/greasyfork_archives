// ==UserScript==
// @name         anime365-ext-beta
// @namespace    http://tampermonkey.net/
// @version      0.35.0-beta
// @description  Расширение для сайтов anime365 и smotret-anime
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://anime-365.ru/catalog/*
// @match        https://smotret-anime.org/catalog/*
// @match        https://smotret-anime.app/catalog/*
// @match        https://hentai365.ru/catalog/*
// @match        https://h365-art.org/catalog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime-365.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537115/anime365-ext-beta.user.js
// @updateURL https://update.greasyfork.org/scripts/537115/anime365-ext-beta.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class Settings {
        static config = {
            logger: {
                ui: true,
                console: true,
                level: ['info', 'success', 'warn', 'error']
            },
            autoNextEpisode: {
                enabled: true,
                threshold: 97
            },
            theatreMode: {
                enabled: true,
                keyTrigger: "KeyT"
            },
            autoplay: {
                enabled: true,
                afterTime: 500
            }
        };
    }

    class Logger {
        static timeoutId = null;
        static hover = false;

        static init() {
            if (Settings.config.logger.ui && !document.getElementById("anime365-log")) {
                const logDiv = document.createElement("div");
                logDiv.id = "anime365-log";
                logDiv.style.cssText = `
                position: fixed;
                bottom: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                border-radius: 0.5rem;
                font-family: monospace;
                z-index: 9999;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: auto;
                cursor: default;
            `;
                logDiv.addEventListener('mouseenter', () => {
                    Logger.hover = true;
                    Logger.show();
                    if (Logger.timeoutId) {
                        clearTimeout(Logger.timeoutId);
                        Logger.timeoutId = null;
                    }
                });

                logDiv.addEventListener('mouseleave', () => {
                    Logger.hover = false;
                    Logger.startHideTimer();
                });

                document.body.appendChild(logDiv);
            }
        }

        static show() {
            const logEl = document.getElementById("anime365-log");
            if (!logEl) return;
            logEl.style.opacity = '1';
        }

        static hide() {
            const logEl = document.getElementById("anime365-log");
            if (!logEl) return;
            logEl.style.opacity = '0';
        }

        static startHideTimer() {
            if (Logger.timeoutId) clearTimeout(Logger.timeoutId);
            Logger.timeoutId = setTimeout(() => {
                if (!Logger.hover) {
                    Logger.hide();
                }
                Logger.timeoutId = null;
            }, 5000);
        }

        static log(message, type = 'info') {
            if (!Settings.config.logger.console && !Settings.config.logger.ui) return;
            if (!Settings.config.logger.level.includes(type)) return;

            const colors = {
                info: "#00aaff",
                success: "#00cc66",
                warn: "#ffaa00",
                error: "#ff4444"
            };

            if (Settings.config.logger.console) {
                const color = colors[type] || "#00aaff";
                console.log(`%c[anime365-ext] ${message}`, `color: ${color}`);
            }

            if (Settings.config.logger.ui) {
                const logEl = document.getElementById("anime365-log");
                if (!logEl) return;

                logEl.style.borderLeft = `4px solid ${colors[type] || "#00aaff"}`;
                logEl.textContent = `[anime365-ext] ${message}`;

                Logger.show();
                Logger.startHideTimer();
            }
        }
    }

    class Autoplay {
        constructor() {
            if (!Settings.config.autoplay.enabled) return;

            const seasonLink = document.querySelector("body > div.body-container > div > div > div > div.col.s12.m8.l9.col-even > a");
            if (seasonLink) {
                Logger.log("Автовоспроизведение: найден каталог сезонов, переход к видео...", 'info');
                seasonLink.click();
                setTimeout(() => this.playVideo(), Settings.config.autoplay.afterTime);
            } else {
                this.playVideo();
            }
        }

        playVideo() {
            const interval = setInterval(() => {
                const doc = document.querySelector("iframe")?.contentDocument;
                const playBtn = doc?.querySelector(".vjs-big-play-button");
                if (playBtn) {
                    playBtn.click();
                    Logger.log("Автовоспроизведение: нажата кнопка Play", 'success');
                    clearInterval(interval);
                }
            }, Settings.config.autoplay.afterTime);
        }
    }

    class TheatreMode {
        constructor() {
            if (!Settings.config.theatreMode.enabled) return;

            this.styleRef = null;
            this.closeBtn = this.createCloseButton();
            this.active = false;
            this.init();
        }

        init() {
            const bg = document.querySelector(".full-background");
            if (bg) bg.after(this.closeBtn);

            document.addEventListener("keydown", (e) => {
                if (!Settings.config.theatreMode.enabled) return;

                if (e.altKey && e.code === Settings.config.theatreMode.keyTrigger) {
                    e.preventDefault();
                    this.toggle();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    this.close();
                }
            });

            this.closeBtn.addEventListener("click", () => this.close());
        }

        getIframeDocument() {
            return document.querySelector("iframe")?.contentDocument || null;
        }

        toggle() {
            const container = this.getVideoContainer();
            if (!container) return;
            container.classList.contains("cinema-mode") ? this.close() : this.open();
        }

        open() {
            const container = this.getVideoContainer();
            if (!container) return;

            container.classList.add("cinema-mode");

            this.styleRef = document.createElement("style");
            this.styleRef.id = "cinema-mode-style";
            this.styleRef.textContent = `
                .m-translation-player > .card-image > .video-container.cinema-mode {
                    position: fixed !important;
                    z-index: 10;
                    height: 100vh;
                    width: 100vw;
                    left: 0;
                    top: 0;
                    margin: 0;
                    padding: 0;
                }
                body {
                    overflow: hidden !important;
                }
            `;
            document.head.appendChild(this.styleRef);

            this.closeBtn.style.display = "block";
            this.active = true;
            Logger.log("Включён кинотеатр", 'success');
        }

        close() {
            if (!this.active) return;

            const container = this.getVideoContainer();
            if (!container) return;

            container.classList.remove("cinema-mode");
            this.closeBtn.style.display = "none";

            if (this.styleRef) {
                this.styleRef.remove();
                this.styleRef = null;
            }

            this.active = false;
            Logger.log("Кинотеатр выключен", 'warn');
        }

        getVideoContainer() {
            return document.querySelector(".m-translation-player > .card-image > .video-container");
        }

        createCloseButton() {
            const btn = document.createElement("img");
            btn.id = "cinemaCloseButton";
            btn.style.cssText = "z-index: 20; position: fixed; top: 0; right: 0; margin: 1rem; width: 2rem; display: none; cursor: pointer;";
            btn.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M16 8L8 16M12 12L16 16M8 8L10 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z' stroke='%23fff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
            return btn;
        }
    }

    class AutoNextEpisode {
        constructor() {
            if (!Settings.config.autoNextEpisode.enabled) return;

            this.lastProgress = null;
            this.lastLoggedProgress = null;
            this.interval = setInterval(() => this.checkProgress(), 1000);
        }

        getIframeDocument() {
            return document.querySelector("iframe")?.contentDocument || null;
        }

        checkProgress() {
            const doc = this.getIframeDocument();
            if (!doc) return;

            const playProgressEl = doc.querySelector(".vjs-play-progress");
            if (!playProgressEl) return;

            const widthStyle = playProgressEl.style.width;
            if (!widthStyle.endsWith("%")) return;

            const progress = parseFloat(widthStyle);
            if (isNaN(progress)) return;

            const video = doc.querySelector("video");
            if (!video) return;

            if (!video.paused) {
                const progressFormatted = progress.toFixed(1);
                if (progressFormatted !== this.lastLoggedProgress) {
                    Logger.log(`Прогресс видео: ${progressFormatted}%`, 'info');
                    this.lastLoggedProgress = progressFormatted;
                }
            }

            if (progress >= Settings.config.autoNextEpisode.threshold) {
                Logger.log(`Видео достигло ${progress.toFixed(1)}%. Переход к следующей серии...`, 'success');
                this.goToNextEpisode();
                return;
            }

            if (this.lastProgress === 0 && progress === 0 && doc.querySelector(".vjs-big-play-button")) {
                doc.querySelector(".vjs-big-play-button").click();
                Logger.log("Прогресс 0%. Повторный запуск плеера", 'warn');
            }

            this.lastProgress = progress;
        }

        goToNextEpisode() {
            const nextLink = document.querySelector(".m-select-sibling-episode > a > .right");
            if (nextLink) {
                Logger.log("Переходим к следующей серии", 'info');
                nextLink.click();
            } else {
                Logger.log("Кнопка перехода к следующей серии не найдена", 'error');
            }
        }
    }

    function onDocumentReady(callback) {
        document.addEventListener('page:load', callback);
        document.addEventListener('turbolinks:load', callback);
        if (document.readyState !== 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    onDocumentReady(() => {
        Logger.init();
        Logger.log("Инициализация расширения...", 'info');
        new TheatreMode();
        new Autoplay();
        new AutoNextEpisode();
    });

})();
