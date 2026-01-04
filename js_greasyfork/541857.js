// ==UserScript==
// @name         Catppuccin Theme Editor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  User script designed to work with https://userstyles.world/style/23042
// @author       imaegg11
// @match        https://summer.hackclub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hackclub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541857/Catppuccin%20Theme%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/541857/Catppuccin%20Theme%20Editor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let styles = {
        'catppuccin-frape': {
            '--neutral-100': '#292c3c',
            '--neutral-200': '#232634',
            '--neutral-300': '#414559',
            '--neutral-400': '#51576d',
            '--neutral-50': '#303446',
            '--neutral-500': '#626880',
            '--neutral-600': '#737994',
            '--neutral-700': '#838ba7',
            '--neutral-800': '#949cbb',
            '--neutral-900': '#c6d0f5',
            '--primary-100': '#eebebe',
            '--primary-200': '#f4b8e4',
            '--primary-300': '#ca9ee6',
            '--primary-400': '#e78284',
            '--primary-50': '#f2d5cf',
            '--primary-500': '#ea999c',
            '--primary-600': '#ef9f76',
            '--primary-700': '#e5c890',
            '--primary-800': '#a6d189',
            '--primary-900': '#81c8be',
            '--secondary-100': '#85c1dc',
            '--secondary-200': '#8caaee',
            '--secondary-300': '#85c1dc',
            '--secondary-400': '#babbf1',
            '--secondary-50': '#99d1db',
            '--secondary-500': '#ca9ee6',
            '--secondary-600': '#838ba7',
            '--secondary-700': '#737994',
            '--secondary-800': '#626880',
            '--secondary-900': '#51576d'
        },
        'catppuccin-latte': {
            '--neutral-100': '#e6e9ef',
            '--neutral-200': '#dce0e8',
            '--neutral-300': '#ccd0da',
            '--neutral-400': '#bcc0cc',
            '--neutral-50': '#eff1f5',
            '--neutral-500': '#acb0be',
            '--neutral-600': '#9ca0b0',
            '--neutral-700': '#8c8fa1',
            '--neutral-800': '#7c7f93',
            '--neutral-900': '#4c4f69',
            '--primary-100': '#dd7878',
            '--primary-200': '#ea76cb',
            '--primary-300': '#8839ef',
            '--primary-400': '#d20f39',
            '--primary-50': '#dc8a78',
            '--primary-500': '#e64553',
            '--primary-600': '#fe640b',
            '--primary-700': '#df8e1d',
            '--primary-800': '#40a02b',
            '--primary-900': '#179299',
            '--secondary-100': '#209fb5',
            '--secondary-200': '#1e66f5',
            '--secondary-300': '#209fb5',
            '--secondary-400': '#7287fd',
            '--secondary-50': '#04a5e5',
            '--secondary-500': '#8839ef',
            '--secondary-600': '#8c8fa1',
            '--secondary-700': '#9ca0b0',
            '--secondary-800': '#acb0be',
            '--secondary-900': '#bcc0cc'
        },
        'catppuccin-macchiato': {
            '--neutral-100': '#1e2030',
            '--neutral-200': '#181926',
            '--neutral-300': '#363a4f',
            '--neutral-400': '#494d64',
            '--neutral-50': '#24273a',
            '--neutral-500': '#5b6078',
            '--neutral-600': '#6e738d',
            '--neutral-700': '#8087a2',
            '--neutral-800': '#939ab7',
            '--neutral-900': '#cad3f5',
            '--primary-100': '#f0c6c6',
            '--primary-200': '#f5bde6',
            '--primary-300': '#c6a0f6',
            '--primary-400': '#ed8796',
            '--primary-50': '#f4dbd6',
            '--primary-500': '#ee99a0',
            '--primary-600': '#f5a97f',
            '--primary-700': '#eed49f',
            '--primary-800': '#a6da95',
            '--primary-900': '#8bd5ca',
            '--secondary-100': '#7dc4e4',
            '--secondary-200': '#8aadf4',
            '--secondary-300': '#7dc4e4',
            '--secondary-400': '#b7bdf8',
            '--secondary-50': '#91d7e3',
            '--secondary-500': '#c6a0f6',
            '--secondary-600': '#8087a2',
            '--secondary-700': '#6e738d',
            '--secondary-800': '#5b6078',
            '--secondary-900': '#494d64'
        },
        'catppuccin-mocha': {
            '--neutral-100': '#181825',
            '--neutral-200': '#11111b',
            '--neutral-300': '#313244',
            '--neutral-400': '#45475a',
            '--neutral-50': '#1e1e2e',
            '--neutral-500': '#585b70',
            '--neutral-600': '#6c7086',
            '--neutral-700': '#7f849c',
            '--neutral-800': '#9399b2',
            '--neutral-900': '#cdd6f4',
            '--primary-100': '#f2cdcd',
            '--primary-200': '#f5c2e7',
            '--primary-300': '#cba6f7',
            '--primary-400': '#f38ba8',
            '--primary-50': '#f5e0dc',
            '--primary-500': '#eba0ac',
            '--primary-600': '#fab387',
            '--primary-700': '#f9e2af',
            '--primary-800': '#a6e3a1',
            '--primary-900': '#94e2d5',
            '--secondary-100': '#74c7ec',
            '--secondary-200': '#89b4fa',
            '--secondary-300': '#74c7ec',
            '--secondary-400': '#b4befe',
            '--secondary-50': '#89dceb',
            '--secondary-500': '#cba6f7',
            '--secondary-600': '#7f849c',
            '--secondary-700': '#6c7086',
            '--secondary-800': '#585b70',
            '--secondary-900': '#45475a'
        }
    };

    let theme = window.getComputedStyle(document.body).getPropertyValue('--theme-name');
    theme = theme.substring(1, theme.length - 1);

    let theme_data = styles[theme];

    if (theme_data === undefined) {
        console.error(`No theme data for selected theme, falling back onto catppuccin-mocha\nAvailable themes: ${Object.keys(styles)}`);
    } else {
        for (let root_var of Object.keys(theme_data)) {
            document.documentElement.style.setProperty(root_var, theme_data[root_var]);
        }

        console.log("Successfully applied theme");
    }
})();