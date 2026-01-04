// ==UserScript==
// @name            Return YouTube Trending
// @name:de         YouTube Trends wieder anzeigen
// @version         1.1.0
// @description     Re-display the Explore/Trending Button in the Side Menu on YouTube
// @description:de  Zeigt die Entdecken/Trends-Schaltfläche im Seitenmenü auf YouTube wieder an
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/return-youtube-trending
// @license         MIT
// @match           https://www.youtube.com/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/453493/Return%20YouTube%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/453493/Return%20YouTube%20Trending.meta.js
// ==/UserScript==

(function ($, undefined) { // Safe jQuery import, Thanks to https://stackoverflow.com/a/29363547
    $(function () {
        window.setInterval(() => {
            if ($('a[href="/feed/explore"]').length) { // Return when button exists
                return;
            }

            const lang = navigator.language || navigator.userLanguage;
            const translations = {
                "en": "Explore",
                "de": "Entdecken"
            };
            const translation = translations[lang] || translations["en"];
            const html_expand = `
            <div class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none" style="width: calc(100% - 12px)">
                <a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist" title="${translation}" href="/feed/explore" style="border-radius: 10px">
                    <tp-yt-paper-item class="style-scope ytd-guide-entry-renderer" role="tab" style-target="host" tabindex="0" aria-disabled="false" aria-selected="false" style="padding: 0 12px">
                        <div style="display: inline-flex; align-items: center; justify-content: center; position: relative; vertical-align: middle; fill: var(--iron-icon-fill-color, currentcolor); stroke: var(--iron-icon-stroke-color, none); margin-left: var(--iron-icon_-_margin-left); margin-bottom: var(--iron-icon_-_margin-bottom); width: var(--iron-icon_-_width, var(--iron-icon-width, 24px)); height: var(--iron-icon_-_height, var(--iron-icon-height, 24px)); margin-top: var(--iron-icon_-_margin-top);" class="guide-icon style-scope ytd-guide-entry-renderer">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                                <g class="style-scope yt-icon">
                                    <path d="M9.8,9.8l-3.83,8.23l8.23-3.83l3.83-8.23L9.8,9.8z M13.08,12.77c-0.21,0.29-0.51,0.48-0.86,0.54 c-0.07,0.01-0.15,0.02-0.22,0.02c-0.28,0-0.54-0.08-0.77-0.25c-0.29-0.21-0.48-0.51-0.54-0.86c-0.06-0.35,0.02-0.71,0.23-0.99 c0.21-0.29,0.51-0.48,0.86-0.54c0.35-0.06,0.7,0.02,0.99,0.23c0.29,0.21,0.48,0.51,0.54,0.86C13.37,12.13,13.29,12.48,13.08,12.77z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2 L12,2z" class="style-scope yt-icon"></path>
                                </g>
                            </svg>
                        </div>
                        <yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade="" hidden="">
                        </yt-img-shadow>
                        <div class="title style-scope ytd-guide-entry-renderer">${translation}</div>
                        <span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span>
                        <yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade="">
                        </yt-icon>
                        <div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div>
                    </tp-yt-paper-item>
                </a>
                <yt-interaction class="style-scope ytd-guide-entry-renderer">
                    <div class="stroke style-scope yt-interaction"></div>
                    <div class="fill style-scope yt-interaction"></div>
                </yt-interaction>
            </div>
            `.replace(/>\s+</g, '><').trim(); // Clean up formatted html, Thanks to https://stackoverflow.com/a/27841683

            const child_expand = $.parseHTML(html_expand);
            $("#items.style-scope.ytd-guide-section-renderer").children().eq(0).after(child_expand);


            const html_mini = `
            <div class="style-scope ytd-mini-guide-renderer ryt-mini-guide-entry-renderer" system-icons="" role="tab" tabindex="0" aria-selected="false" aria-label="${translation}" style="border-radius: 10px">
                <a id="endpoint" tabindex="-1" class="yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer" title="${translation}" href="/feed/explore" style="width: 64px">
                    <div style="display: inline-flex; align-items: center; justify-content: center; position: relative; vertical-align: middle; fill: var(--iron-icon-fill-color, currentcolor); stroke: var(--iron-icon-stroke-color, none); margin-left: var(--iron-icon_-_margin-left); margin-bottom: var(--iron-icon_-_margin-bottom); width: var(--iron-icon_-_width, var(--iron-icon-width, 24px)); height: var(--iron-icon_-_height, var(--iron-icon-height, 24px)); margin-top: var(--iron-icon_-_margin-top);" class="guide-icon style-scope ytd-mini-guide-renderer">
                        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon">
                            <g class="style-scope yt-icon">
                                <path d="M9.8,9.8l-3.83,8.23l8.23-3.83l3.83-8.23L9.8,9.8z M13.08,12.77c-0.21,0.29-0.51,0.48-0.86,0.54 c-0.07,0.01-0.15,0.02-0.22,0.02c-0.28,0-0.54-0.08-0.77-0.25c-0.29-0.21-0.48-0.51-0.54-0.86c-0.06-0.35,0.02-0.71,0.23-0.99 c0.21-0.29,0.51-0.48,0.86-0.54c0.35-0.06,0.7,0.02,0.99,0.23c0.29,0.21,0.48,0.51,0.54,0.86C13.37,12.13,13.29,12.48,13.08,12.77z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2 L12,2z" class="style-scope yt-icon"></path>
                            </g>
                        </svg>
                    </div>
                    <span class="title style-scope ytd-mini-guide-entry-renderer">${translation}</span>
                    <tp-yt-paper-tooltip animation-delay="0" offset="4" position="right" class="style-scope ytd-mini-guide-entry-renderer" role="tooltip" tabindex="-1" style="--paper-tooltip-delay-in: 0ms;" hidden="">
                        <div id="tooltip" class="style-scope tp-yt-paper-tooltip hidden" style-target="tooltip">${translation}</div>
                    </tp-yt-paper-tooltip>
                    <yt-interaction class="style-scope ytd-mini-guide-entry-renderer">
                        <div class="stroke style-scope yt-interaction"></div>
                        <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                </a>
            </div>
            `.replace(/>\s+</g, '><').trim();

            const child_mini = $.parseHTML(html_mini);
            $("#items.style-scope.ytd-mini-guide-renderer").children().eq(0).after(child_mini);


            const html_style = `
            <style>
                .ryt-mini-guide-entry-renderer:hover, .ryt-mini-guide-entry-renderer:focus {
                    background-color: var(--yt-spec-badge-chip-background);
                    outline: none;
                }
            </style>
            `.replace(/>\s+</g, '><').trim();

            const child_style = $.parseHTML(html_style);
            $("head").append(child_style);
        }, 500);
    });
})(window.jQuery.noConflict(true));