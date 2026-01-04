// ==UserScript==
// @name         Glassmorphism ChatGPT Theme
// @namespace    https://github.com/oleh-prukhnytskyi
// @version      2.3
// @description  Adds a frosted glass and background image effect to ChatGPT UI for a cleaner, modern look
// @author       Oleh Prukhnytskyi
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533522/Glassmorphism%20ChatGPT%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/533522/Glassmorphism%20ChatGPT%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

				GM_addStyle(`
								.transition-width.relative.h-full.w-full.flex-1.overflow-auto {
												background-image: url('https://images.unsplash.com/photo-1690046793146-dd1cc08ea17d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
												background-size: cover;
								}
								.flex.w-full.cursor-text.flex-col.items-center.justify-center.bg-clip-padding.contain-inline-size.overflow-clip.shadow-short.bg-token-bg-primary,
								.border-token-border-default.flex.w-full.cursor-text.flex-col.items-center {
												background-color: rgba(255,255,255,.1);
												backdrop-filter: blur(16px);
												border: 1px solid rgba(255,255,255,.3);
								}
								.border-token-border-medium.relative.bg-token-sidebar-surface-primary {
								    border-radius: 16px;
								}
								.justify-between.h-9.bg-token-sidebar-surface-primary {
								    border-top-left-radius: 16px;
												border-top-right-radius: 16px;
								}
								.content-fade::after {
								    background:none!important;
								}
								.absolute.start-0.end-0.bottom-full.z-20,
								.flex.w-full.items-start.gap-4.rounded-3xl.border.py-4.ps-5.pe-3.text-sm,
								.bg-token-bg-elevated-secondary.sticky.bottom-0.z-30,
								.group.absolute.end-2.bottom-2.z-20.flex.flex-col.gap-1,
								.bg-primary-surface-primary.absolute.start-3.end-0.bottom-3.z-2.flex.items-center,
								.relative.flex.w-full.flex-auto.flex-col > :last-child,
								.bg-primary-surface-primary.absolute.start-2.5.end-0.bottom-2.5.z-2.flex.items-center .w-full .flex.items-center {
								    display:none!important;
								}
								.text-token-text-secondary.relative.mt-auto.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs {
								    opacity: 0;
								}
								.bg-token-message-surface, p > code, p > strong > code {
								    background-color: rgb(0 0 0 / 50%);
            backdrop-filter: blur(16px);
								}
								.ProseMirror .placeholder::after {
												color: rgba(255,255,255,.6)!important;
								}
								.flex.items-end.px-3.relative.w-full {
								    padding-block: 24px;
												padding-inline: 24px;
								}
								.bg-token-sidebar-surface-primary.z-21.shrink-0.overflow-x-hidden,
								.bg-token-bg-elevated-secondary,
								.btn.relative.btn-secondary.btn.btn-secondary.text-token-text-primary.relative {
								    background-color: black;
												border: none;
								}
				`);
})();