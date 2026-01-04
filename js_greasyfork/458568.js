// ==UserScript==
// @name         Wikipedia Vector 2022 Redesign
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  various typographic improvements and bug fixes to wikipedia's vector 2022 theme
// @author       tinytinytinytiny
// @run-at       document-start
// @match        http://wikipedia.org/*
// @match        https://wikipedia.org/*
// @match        http://*.wikipedia.org/*
// @match        https://*.wikipedia.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458568/Wikipedia%20Vector%202022%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/458568/Wikipedia%20Vector%202022%20Redesign.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=1');

    const styles = {
        ':root': {
            '--link-color': '#0645ad',
            '--step--1': 'clamp(0.915rem, 0.885rem + 0.17vw, 1.0125rem)',
            '--step-0': 'clamp(1.00rem, 0.96rem + 0.22vw, 1.125rem)',
            '--step-1': 'clamp(1.20rem, 1.15rem + 0.26vw, 1.35rem)',
            '--step-2': 'clamp(1.44rem, 1.33rem + 0.55vw, 1.8rem)',
            '--step-3': 'clamp(1.73rem, 1.56rem + 0.82vw, 2.20rem)'
        },
        'body.skin-vector-2022': {
            'background-color': 'unset',
            'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Lato", "Helvetica", "Arial", sans-serif',
            'font-size': 'var(--step-0)',
            'overflow': 'hidden auto'
        },
        '.skin-vector-2022 a': {
            'color': 'var(--link-color)',
            'text-decoration-thickness': 'from-font',
            'text-underline-position': 'under'
        },
        '.skin-vector-2022 a:hover, .skin-vector-2022 a:active': {
            'text-decoration': 'underline',
        },
        '.skin-vector-2022 a:active, .skin-vector-2022 .mw-parser-output a.extiw:active, .skin-vector-2022 .mw-parser-output a.external:active': {
            'color': 'var(--link-color)',
            'text-decoration-thickness': '2px'
        },
        '.skin-vector-2022 div:has(> table)': {
            'overflow-x': 'auto'
        },
        '.vector-feature-page-tools-disabled .vector-main-menu': {
            'background-color': 'unset'
        },
        '.skin-vector-2022 .mw-header': {
            'position': 'relative'
        },
        '.skin-vector-2022 .mw-header::before': {
            'background-color': '#f8f9fa',
            'content': '""',
            'inset': '0 50%',
            'margin-inline': '-50vw',
            'position': 'absolute',
            'z-index': '-1'
        },
        '.skin-vector-2022 .mw-parser-output': {
            'overflow': 'visible'
        },
        '.skin-vector-2022 .mw-body': {
            'padding': '1.5em 0'
        },
        '.skin-vector-2022 .vector-body': {
            'font-family': 'var(--font-serif)',
            'font-size': 'inherit',
            'line-height': '1.65',
            'position': 'static',
            'z-index': 'auto'
        },
        '.skin-vector-2022 .mw-body h1, .skin-vector-2022 .mw-body-content h1': {
            'font-size': 'var(--step-3)'
        },
        '.skin-vector-2022 .vector-body h2': {
            'font-size': 'var(--step-2)',
            'margin-top': '1.5em'
        },
        '.skin-vector-2022 .vector-body h3': {
            'font-size': 'var(--step-1)'
        },
        '.skin-vector-2022 .vector-body .mp-h2': {
            'margin-top': '0.5em'
        },
        '.skin-vector-2022 .vector-body p': {
            'margin': '0.5em 0 1em 0'
        },
        '.skin-vector-2022 .vector-page-toolbar-container, .skin-vector-2022 table, .skin-vector-2022 .catlinks, .skin-vector-2022 .reflist, .skin-vector-2022 .thumbcaption, .vector-toc .vector-toc-list-item a': {
            'font-size': 'var(--step--1)'
        },
        '.skin-vector-2022 .vector-body-before-content': {
            'align-items': 'baseline',
            'display': 'flex',
            'flex-direction': 'row-reverse'
        },
        '.skin-vector-2022 .vector-body #siteSub': {
            'flex-grow': '1',
            'font-size': '0.75em',
            'margin': '0',
            'padding-top': '0.5em'
        },
        '.skin-vector-2022 .mw-indicators img': {
            'vertical-align': 'text-bottom'
        },
        '.skin-vector-2022 #coordinates': {
            'top': '2.65em'
        },
        '.vector-toc-pinned #vector-toc-pinned-container': {
            'padding-top': '0'
        },
        '.skin-vector-2022 .vector-toc': {
            'max-height': '100dvh',
            'overscroll-behavior': 'contain',
            'padding-bottom': '30px'
        },
        '.skin-vector-2022 .vector-toc .vector-toc-contents, .skin-vector-2022 .vector-toc .vector-toc-list': {
            'line-height': 'inherit'
        },
        '.skin-vector-2022 .vector-toc-toggle': {
            'top': '0.2em'
        },
        '.skin-vector-2022 .infobox': {
            'margin-left': '2em',
            'line-height': '1.55'
        }
    };

    const stylesheet = new CSSStyleSheet();
    stylesheet.replace(
        Object.entries(styles)
        .map(([selector, properties]) =>
             `${selector} { ${Object.entries(properties).map(([prop, value]) => `${prop}: ${value};`).join(' ')} }`)
        .join(' ')
    ).then(() => {
        document.adoptedStyleSheets = [stylesheet];
    });
})();