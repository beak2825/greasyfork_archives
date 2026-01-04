// ==UserScript==
// @name         Contraster!
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Contrast fixer
// @author       Cyxz
// @match        https://t3.chat/*
// @grant        none
/// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530339/Contraster%21.user.js
// @updateURL https://update.greasyfork.org/scripts/530339/Contraster%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textcontrastfix = document.createElement('style');
    textcontrastfix.textContent = `
        .dark\\:prose-invert:is(.dark *) {
            --tw-prose-invert-body: #f5f5f5 !important;
            --tw-prose-body: var(--tw-prose-invert-body) !important;
            --tw-prose-headings: var(--tw-prose-invert-headings) !important;
            --tw-prose-lead: var(--tw-prose-invert-lead) !important;
            --tw-prose-links: var(--tw-prose-invert-links) !important;
            --tw-prose-bold: var(--tw-prose-invert-bold) !important;
            --tw-prose-counters: var(--tw-prose-invert-counters) !important;
            --tw-prose-bullets: var(--tw-prose-invert-bullets) !important;
            --tw-prose-hr: var(--tw-prose-invert-hr) !important;
            --tw-prose-quotes: var(--tw-prose-invert-quotes) !important;
            --tw-prose-quote-borders: var(--tw-prose-invert-quote-borders) !important;
            --tw-prose-captions: var(--tw-prose-invert-captions) !important;
            --tw-prose-kbd: var(--tw-prose-invert-kbd) !important;
            --tw-prose-kbd-shadows: var(--tw-prose-invert-kbd-shadows) !important;
            --tw-prose-code: var(--tw-prose-invert-code) !important;
            --tw-prose-pre-code: var(--tw-prose-invert-pre-code) !important;
            --tw-prose-pre-bg: var(--tw-prose-invert-pre-bg) !important;
            --tw-prose-th-borders: var(--tw-prose-invert-th-borders) !important;
            --tw-prose-td-borders: var(--tw-prose-invert-td-borders) !important;
        }
        
        .prose-pink:not(.dark *) {
            --tw-prose-links: #da006b;
            --tw-prose-invert-links: #f472b6;
            --tw-prose-body: #000000 !important;
            --tw-prose-headings: #111827 !important;
            --tw-prose-lead: #4b5563 !important;
            --tw-prose-bold: #111827 !important;
        }
    `;
    document.head.appendChild(textcontrastfix);

    const darkwineVibe = document.createElement('style');
    darkwineVibe.textContent = `
        .dark {
            --background: 313.8 24.5% 8.4%;
            --foreground: 270 20% 97.8%;
            --card: 300 15.8% 6.7%;
            --card-foreground: 240 4.8% 95.9%;
            --popover: 320 23.08% 7.1%;
            --popover-foreground: 326 33% 96%;
            --primary: 332 100% 42%;
            --primary-foreground: 326 85% 95%;
            --secondary: 273.8 15.1% 20.8%;
            --secondary-foreground: 270 30% 90%;
            --muted: 283 9% 20%;
            --muted-foreground: 326 33% 90%;
            --accent: 272 20% 27%;
            --accent-foreground: 326 33% 96%;
            --destructive: 335.82 74.44% 45.29%;
            --destructive-foreground: 0 0% 100%;
            --border: 262.5 10% 20.7%;
            --input: 326.3 20% 15.7%;
            --ring: 333.3, 71.4%, 60.6%;
            --chart-1: 220 70% 60%;
            --chart-2: 160 60% 55%;
            --chart-3: 30 80% 65%;
            --chart-4: 280 65% 70%;
            --chart-5: 340 75% 65%;
            --sidebar-background: 240 2.6% 9.6%;
            --sidebar-foreground: 240 4.8% 95.9%;
            --sidebar-primary: 224.3 76.3% 58%;
            --sidebar-primary-foreground: 0 0% 100%;
            --sidebar-accent: 318.5 20.6% 18.4%;
            --sidebar-accent-foreground: 240 4.8% 95.9%;
            --sidebar-border: 0 0% 15%;
            --sidebar-ring: 333.3, 71.4%, 60.6%;
            --gradient-noise-top: 309 15% 10%;
            --chat-border: 334.3 32.6% 20.9%;
            --chat-background: 270 16.13% 10.16%;
            --chat-accent: rgba(20, 16, 24, .33);
            --color-heading: 328.1 39% 61.8%;
        }
    `;
    document.head.appendChild(darkwineVibe);

    const lightvibe = document.createElement('style');
    lightvibe.textContent = `
        :root:not(.dark) {
            --background: 293.7 46.3% 96%;
            --foreground: 296 70% 18%;
            --card: 291 54% 98%; 
            --card-foreground: 240 20% 20%;
            --popover: 0 0% 100%;
            --popover-foreground: 296 65% 17%;
            --primary: 334.2 74.9% 48%;
            --primary-foreground: 0 0% 100%;
            --secondary: 314.7 61.6% 82%;
            --secondary-foreground: 295.8 50% 25%;
            --muted: 327.7 61.6% 75%;
            --muted-foreground: 327 90% 28%;
            --accent: 314.7 65% 80%;
            --accent-foreground: 240 20% 20%;
            --destructive: 335 94% 42%;
            --destructive-foreground: 0 0% 100%;
            --border: 304.6 30% 88%;
            --input: 317.4 44.2% 80%;
            --ring: 333.3, 71.4%, 45%;
            --chart-1: 12 76% 55%;
            --chart-2: 173 65% 35%;
            --chart-3: 197 45% 22%;
            --chart-4: 43 74% 60%;
            --chart-5: 27 87% 60%;
            --radius: 0.5rem;
            --sidebar-background: 290.3 49.2% 85%;
            --sidebar-foreground: 240 20% 25%;
            --sidebar-primary: 240 20% 25%;
            --sidebar-primary-foreground: 0 0% 98%;
            --sidebar-accent: 330 30% 75%;
            --sidebar-accent-foreground: 240 15% 20%;
            --sidebar-border: 20 6% 90%;
            --sidebar-ring: 333.3, 71.4%, 45%;
            --gradient-noise-top: 292 42.9% 90%;
            --chat-border: 304.8 61% 80%;
            --chat-background: 300 56% 98%;
            --chat-accent: #f0e7f4;
            --color-heading: 336.3 75% 16%;
        }
    `;
    document.head.appendChild(lightvibe);

    const themechangedetector = () => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        console.log('theme change detected!!:', isDarkMode ? 'dark' : 'light');
    };

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'class') {
                themechangedetector();
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true });

    themechangedetector();
})();