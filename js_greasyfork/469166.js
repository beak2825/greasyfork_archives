// ==UserScript==
// @name                Weixin Official Account Assistant
// @name:zh-CN          微信公众平台助手
// @name:ug             ئۈندىدار سالون ياردەمچىسى
// @namespace           https://github.com/ShererInc/Wx-OA-Assistant
// @version             1.1.2
// @author              Sherer(شەرەر)
// @description         Easy to get video ids(wxv), audio play url and image url in Weixin Official Accounts Platform
// @description:zh-CN   一键获取微信公众号视频素材ID（wxv），音频素材播放地址和图片地址
// @description:ug      ‫ئۈندىدار سالونىدىكى سىنلارنىڭ نومۇرى (wxv)، ئۈن قويۇش ئادرېسى ۋە رەسىم ئادرېسىغا ئاسانلا ئېرىشكىلى بولىدۇ
// @license             MIT
// @supportURL          https://github.com/ShererInc/Wx-OA-Assistant
// @match               *://mp.weixin.qq.com/*
// @require             https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require             https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @run-at              document-idle
// @grant               GM_setClipboard
// @grant               GM_webRequest
// @grant               GM_xmlhttpRequest
// @icon                data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTUxIiBoZWlnaHQ9IjU1MSIgdmlld0JveD0iMCAwIDU1MSA1NTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8bWFzayBpZD0ibWFzazBfMjVfOTIiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjE1NCIgeT0iNzYiIHdpZHRoPSIyNTUiIGhlaWdodD0iMzk5Ij4NCjxwYXRoIGQ9Ik0xNTUuNDk2IDI3Ny41NjlDMTQzLjg2IDIyMy4xNjIgMzAwLjc5NyA3Ni40OTg0IDMwMC43OTcgNzYuNDk4NEMzMDAuNzk3IDc2LjQ5ODQgMjU4LjA4MyAxOTAuNDg4IDI3My4yNzkgMjQxLjc3QzI4OC40NzQgMjkzLjA1MyAzOTMuMTI1IDIyMS40NDcgNDA3LjUyNyAyNzcuNTY5QzQyMS45MjkgMzMzLjY5MSAyMjEuMjM2IDQ3NC42NjMgMjIxLjIzNiA0NzQuNjYzQzIyMS4yMzYgNDc0LjY2MyAzMDguNjgzIDM2Ny4zNTcgMjY5Ljg4OSAzMTQuOTU1QzI0MS45MjQgMjc3LjE4MSAxNjcuMTMyIDMzMS45NzUgMTU1LjQ5NiAyNzcuNTY5WiIgZmlsbD0iI0M0QzRDNCIvPg0KPC9tYXNrPg0KPGcgbWFzaz0idXJsKCNtYXNrMF8yNV85MikiPg0KPHBhdGggZD0iTTE5NC4zMzQgMjc2LjgyOEMxOTAuNDg0IDIyMi41NSAzMDIuMTkgNzkuNTQ1NCAzMDIuMTkgNzkuNTQ1NEMzMDIuMTkgNzkuNTQ1NCAyNzYuNzYyIDE4OC4zOTYgMjgzLjEzMiAyMzkuNjMyQzI4OS41MDIgMjkwLjg2NyAzNTIuMjA3IDIyNS4yMjkgMzU3LjczNCAyODEuMjYxQzM2My4yNjEgMzM3LjI5MiAyMjMuNTczIDQ3My44NzEgMjIzLjU3MyA0NzMuODcxQzIyMy41NzMgNDczLjg3MSAyODcuNTU0IDM2OC43NiAyNjUuOTYgMzE1Ljk5N0MyNTAuMzk0IDI3Ny45NjMgMTk4LjE4NCAzMzEuMTA2IDE5NC4zMzQgMjc2LjgyOFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yNV85MikiLz4NCjwvZz4NCjxtYXNrIGlkPSJwYXRoLTMtaW5zaWRlLTFfMjVfOTIiIGZpbGw9IndoaXRlIj4NCjxwYXRoIGQ9Ik00Ny4zODI1IDEyMS4wMjZDOC41Nzk3OCAxNzguMzI3IC03LjIzNjU3IDI0OC4xMzMgMy4wNzgzOCAzMTYuNTY0QzEzLjM5MzMgMzg0Ljk5NCA0OS4wODQgNDQ3LjAzNiAxMDMuMDU0IDQ5MC4zNTNDMTU3LjAyMyA1MzMuNjcxIDIyNS4zMTkgNTU1LjA5IDI5NC4zNiA1NTAuMzUzQzM2My40MDEgNTQ1LjYxNSA0MjguMTMgNTE1LjA2OCA0NzUuNjc3IDQ2NC43ODVDNTIzLjIyNCA0MTQuNTAyIDU1MC4xMDYgMzQ4LjE2NyA1NTAuOTc3IDI3OC45NjlDNTUxLjg0OSAyMDkuNzcxIDUyNi42NDYgMTQyLjc3OSA0ODAuMzggOTEuMzE1MUM0MzQuMTE0IDM5Ljg1MDcgMzcwLjE3NCA3LjY4MzMgMzAxLjI3NSAxLjIwODk0QzIzMi4zNzUgLTUuMjY1NDIgMTYzLjU2MiAxNC40Mjc2IDEwOC41MTggNTYuMzcyMUwxMjcuNDQ4IDc3LjA3OTRDMTc2LjQ1IDM5LjczODMgMjM3LjEwOCAyNS41NDkgMjk4LjQ0NiAzMS4zMTI4QzM1OS43ODQgMzcuMDc2NiA0MTYuNzA2IDY1LjcxMzYgNDU3Ljg5NCAxMTEuNTNDNDk5LjA4MiAxNTcuMzQ2IDUyMS41MTkgMjE2Ljk4NSA1MjAuNzQzIDI3OC41ODhDNTE5Ljk2OCAzNDAuMTkxIDQ5Ni4wMzYgMzk5LjI0NiA0NTMuNzA3IDQ0NC4wMTFDNDExLjM3OSA0ODguNzc1IDM1My43NTMgNTE1Ljk3IDI5Mi4yOSA1MjAuMTg3QzIzMC44MjYgNTI0LjQwNSAxNzAuMDI2IDUwNS4zMzYgMTIxLjk4IDQ2Ni43NzNDNzMuOTMzNSA0MjguMjEgNDIuMTYgMzcyLjk3NyAzMi45NzcxIDMxMi4wNTdDMjMuNzk0MiAyNTEuMTM3IDM3Ljg3NDcgMTg4Ljk5MiA3Mi40MTg4IDEzNy45OEw0Ny4zODI1IDEyMS4wMjZaIi8+DQo8L21hc2s+DQo8cGF0aCBkPSJNNDcuMzgyNSAxMjEuMDI2TDY0LjQ5ODcgOTUuNzQ5N0wzOS4yMjI1IDc4LjYzMzVMMjIuMTA2MyAxMDMuOTFMNDcuMzgyNSAxMjEuMDI2Wk0xMDguNTE4IDU2LjM3MjFMOTAuMDE2MyAzMi4wOTJMNjMuNDYxOSA1Mi4zMjczTDg1Ljk4NzYgNzYuOTY4NUwxMDguNTE4IDU2LjM3MjFaTTEyNy40NDggNzcuMDc5NEwxMDQuOTE3IDk3LjY3NThMMTIzLjc0OSAxMTguMjc3TDE0NS45NSAxMDEuMzU5TDEyNy40NDggNzcuMDc5NFpNNzIuNDE4OCAxMzcuOThMOTcuNjk1IDE1NS4wOTZMMTE0LjgxMSAxMjkuODJMODkuNTM1IDExMi43MDRMNzIuNDE4OCAxMzcuOThaTTIyLjEwNjMgMTAzLjkxQy0yMC45OTU5IDE2Ny41NiAtMzguNTY0NyAyNDUuMTAxIC0yNy4xMDY5IDMyMS4xMTRMMzMuMjYzNiAzMTIuMDE0QzI0LjA5MTYgMjUxLjE2NiAzOC4xNTU0IDE4OS4wOTQgNzIuNjU4NyAxMzguMTQyTDIyLjEwNjMgMTAzLjkxWk0tMjcuMTA2OSAzMjEuMTE0Qy0xNS42NDkgMzk3LjEyNiAyMy45OTYzIDQ2Ni4wNDMgODMuOTQ2IDUxNC4xNkwxMjIuMTYxIDQ2Ni41NDdDNzQuMTcxNiA0MjguMDI5IDQyLjQzNTYgMzcyLjg2MiAzMy4yNjM2IDMxMi4wMTRMLTI3LjEwNjkgMzIxLjExNFpNODMuOTQ2IDUxNC4xNkMxNDMuODk2IDU2Mi4yNzcgMjE5Ljc1OCA1ODYuMDcgMjk2LjQ0OSA1ODAuODA3TDI5Mi4yNyA1MTkuODk4QzIzMC44NzkgNTI0LjExMSAxNzAuMTUxIDUwNS4wNjUgMTIyLjE2MSA0NjYuNTQ3TDgzLjk0NiA1MTQuMTZaTTI5Ni40NDkgNTgwLjgwN0MzNzMuMTQgNTc1LjU0NSA0NDUuMDQyIDU0MS42MTMgNDk3Ljg1NyA0ODUuNzU5TDQ1My40OTcgNDQzLjgxMkM0MTEuMjE4IDQ4OC41MjMgMzUzLjY2MSA1MTUuNjg2IDI5Mi4yNyA1MTkuODk4TDI5Ni40NDkgNTgwLjgwN1pNNDk3Ljg1NyA0ODUuNzU5QzU1MC42NzMgNDI5LjkwNCA1ODAuNTMzIDM1Ni4yMTggNTgxLjUwMSAyNzkuMzUzTDUyMC40NTQgMjc4LjU4NEM1MTkuNjc5IDM0MC4xMTUgNDk1Ljc3NiAzOTkuMSA0NTMuNDk3IDQ0My44MTJMNDk3Ljg1NyA0ODUuNzU5Wk01ODEuNTAxIDI3OS4zNTNDNTgyLjQ2OSAyMDIuNDg4IDU1NC40NzQgMTI4LjA3NCA1MDMuMDgxIDcwLjkwNjhMNDU3LjY3OSAxMTEuNzIzQzQ5OC44MTggMTU3LjQ4NSA1MjEuMjI5IDIxNy4wNTQgNTIwLjQ1NCAyNzguNTg0TDU4MS41MDEgMjc5LjM1M1pNNTAzLjA4MSA3MC45MDY4QzQ1MS42ODkgMTMuNzQgMzgwLjY2NSAtMjEuOTkxNyAzMDQuMTMgLTI5LjE4MzRMMjk4LjQxOSAzMS42MDEzQzM1OS42ODQgMzcuMzU4MyA0MTYuNTM5IDY1Ljk2MTUgNDU3LjY3OSAxMTEuNzIzTDUwMy4wODEgNzAuOTA2OFpNMzA0LjEzIC0yOS4xODM0QzIyNy41OTYgLTM2LjM3NTIgMTUxLjE1OSAtMTQuNTAwMSA5MC4wMTYzIDMyLjA5MkwxMjcuMDIxIDgwLjY1MjJDMTc1Ljk2NSA0My4zNTUyIDIzNy4xNTMgMjUuODQ0MyAyOTguNDE5IDMxLjYwMTNMMzA0LjEzIC0yOS4xODM0Wk04NS45ODc2IDc2Ljk2ODVMMTA0LjkxNyA5Ny42NzU4TDE0OS45NzkgNTYuNDgzTDEzMS4wNDkgMzUuNzc1N0w4NS45ODc2IDc2Ljk2ODVaTTE0NS45NSAxMDEuMzU5QzE4Ny45OTcgNjkuMzE4NiAyNDAuNzQyIDU2LjU1MTIgMjk1LjU5IDYxLjcwNTJMMzAxLjMwMiAwLjkyMDQ2MkMyMzMuNDc0IC01LjQ1MzE4IDE2NC45MDMgMTAuMTU4IDEwOC45NDYgNTIuNzk5M0wxNDUuOTUgMTAxLjM1OVpNMjk1LjU5IDYxLjcwNTJDMzQ5LjI5NCA2Ni43NTE2IDM5OS4xMzEgOTEuODI0MyA0MzUuMTkzIDEzMS45MzhMNDgwLjU5NiA5MS4xMjE0QzQzNC4yODEgMzkuNjAyOSAzNzAuMjc0IDcuNDAxNjMgMzAxLjMwMiAwLjkyMDQ2MkwyOTUuNTkgNjEuNzA1MlpNNDM1LjE5MyAxMzEuOTM4QzQ3MS4yNTQgMTcyLjA1MiA0OTAuODk5IDIyNC4yNjggNDkwLjIyIDI3OC4yMDRMNTUxLjI2NyAyNzguOTcyQzU1Mi4xNCAyMDkuNzAyIDUyNi45MSAxNDIuNjQgNDgwLjU5NiA5MS4xMjE0TDQzNS4xOTMgMTMxLjkzOFpNNDkwLjIyIDI3OC4yMDRDNDg5LjU0IDMzMi4xNCA0NjguNTg4IDM4My44NDUgNDMxLjUyNyA0MjMuMDM3TDQ3NS44ODggNDY0Ljk4NEM1MjMuNDg1IDQxNC42NDggNTUwLjM5NSAzNDguMjQzIDU1MS4yNjcgMjc4Ljk3Mkw0OTAuMjIgMjc4LjIwNFpNNDMxLjUyNyA0MjMuMDM3QzM5NC40NjcgNDYyLjIzIDM0NC4wMTQgNDg2LjA0IDI5MC4yIDQ4OS43MzNMMjk0LjM3OSA1NTAuNjQyQzM2My40OTMgNTQ1LjkgNDI4LjI5MSA1MTUuMzIgNDc1Ljg4OCA0NjQuOTg0TDQzMS41MjcgNDIzLjAzN1pNMjkwLjIgNDg5LjczM0MyMzYuMzg2IDQ5My40MjUgMTgzLjE1NCA0NzYuNzMgMTQxLjA4OCA0NDIuOTY2TDEwMi44NzIgNDkwLjU3OUMxNTYuODk5IDUzMy45NDIgMjI1LjI2NiA1NTUuMzg0IDI5NC4zNzkgNTUwLjY0MkwyOTAuMiA0ODkuNzMzWk0xNDEuMDg4IDQ0Mi45NjZDOTkuMDIxMiA0MDkuMjAzIDcxLjIwMjMgMzYwLjg0NSA2My4xNjIzIDMwNy41MDdMMi43OTE4NiAzMTYuNjA3QzEzLjExNzcgMzg1LjEwOSA0OC44NDU5IDQ0Ny4yMTcgMTAyLjg3MiA0OTAuNTc5TDE0MS4wODggNDQyLjk2NlpNNjMuMTYyMyAzMDcuNTA3QzU1LjEyMjQgMjU0LjE2OSA2Ny40NTA0IDE5OS43NTkgOTcuNjk1IDE1NS4wOTZMNDcuMTQyNiAxMjAuODYzQzguMjk5MDYgMTc4LjIyNSAtNy41MzM5MyAyNDguMTA1IDIuNzkxODYgMzE2LjYwN0w2My4xNjIzIDMwNy41MDdaTTg5LjUzNSAxMTIuNzA0TDY0LjQ5ODcgOTUuNzQ5N0wzMC4yNjYzIDE0Ni4zMDJMNTUuMzAyNSAxNjMuMjU2TDg5LjUzNSAxMTIuNzA0WiIgZmlsbD0iIzgwODQ4QSIgbWFzaz0idXJsKCNwYXRoLTMtaW5zaWRlLTFfMjVfOTIpIi8+DQo8Y2lyY2xlIGN4PSI4Ny4wMDA3IiBjeT0iOTcuNjg0NSIgcj0iMjEuMzY4NCIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzI1XzkyKSIvPg0KPGRlZnM+DQo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjVfOTIiIHgxPSIyOTUuODA2IiB5MT0iNzguOTE1OSIgeDI9IjI1Ni41MzciIHkyPSI0NzcuMTIyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+DQo8c3RvcCBzdG9wLWNvbG9yPSIjRkY5OTAwIi8+DQo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkFDNzMiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMjVfOTIiIHgxPSI4Ny4wMDA3IiB5MT0iNzYuMzE2MiIgeDI9Ijg3LjAwMDciIHkyPSIxMTkuMDUzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+DQo8c3RvcCBzdG9wLWNvbG9yPSIjRkY5OTAwIi8+DQo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkFDNzMiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8L2RlZnM+DQo8L3N2Zz4NCg==
// @downloadURL https://update.greasyfork.org/scripts/469166/Weixin%20Official%20Account%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/469166/Weixin%20Official%20Account%20Assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // global variables
    const debug = false;
    const lang = navigator.language || navigator.userLanguage; // e.g. "en-US"
    const query = Object.fromEntries(new URLSearchParams(window.location.search)); // e.g. { type: "3", begin: "0", count: "20", token: "1412762085", lang: "zh_CN" }
    const pathname = window.location.pathname; // e.g. "/cgi-bin/filepage"

    // Language pack
    const languages = {
        'zh-CN': {
            dir: 'ltr',
            wxv: 'wxv',
            url: '链接',
            copy: '复制',
            copyed: '内容已复制',
            copy_url: '复制链接',
        },
        'ug': {
            dir: 'rtl',
            wxv: 'wxv',
            url: 'ئۇلانمىسى',
            copy: 'كۆچۈرۈش',
            copyed: 'ئۇچۇر كۆچۈرۈلدى',
            copy_url: 'ئۇلانمىنى كۆچۈرۈش',
        },
        'default': {
            dir: 'ltr',
            wxv: 'wxv',
            url: 'URL',
            copy: 'Copy',
            copyed: 'content has been copied',
            copy_url: 'Copy url',
        },
    };

    // Use i18n
    let tc = (key, locale = lang) => {
        if (languages[locale] && languages[locale][key]) {
            return languages[locale][key];
        } else if (languages['default'] && languages['default'][key]) {
            return languages['default'][key];
        } else {
            return key;
        }
    };

    // Toast
    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        customClass: {
            container: `${tc('dir')} sherer-font`,
        },
    });

    // Useful toast
    const message = {
        success: (text) => {
            toast.fire({ title: text, icon: 'success' });
        },
        error: (text) => {
            toast.fire({ title: text, icon: 'error' });
        },
        warning: (text) => {
            toast.fire({ title: text, icon: 'warning' });
        },
        info: (text) => {
            toast.fire({ title: text, icon: 'info' });
        },
        question: (text) => {
            toast.fire({ title: text, icon: 'question' });
        }
    };

    // Add style
    let style = document.createElement('style');
    style.innerHTML = `
        .ltr { direction: ltr !important; }
        .rtl { direction: rtl !important; }
        .sherer-btn { cursor: pointer; background-color: #f5f5f5; padding: 5px 8px; border-radius: 3px; white-space: nowrap; }
        .sherer-btn:hover { background-color: #e9e9e9; }
        .sherer-font { font-family: 'UKIJ Ekran', 'UKIJ Tor', 'UKIJ Basma', 'ALKATIP Tor', 'ALKATIP', 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
        .sherer-flex-column { display: flex; flex-direction: column; }
        .sherer-justify-between { justify-content: space-between; }
        .sherer-position-none { position: static !important; }
        .sherer-center { text-align: center; }
        .sherer-ml-5 { margin-left: 5px !important; }
        .sherer-mt-5 { margin-top: 5px !important; }
        .sherer-border { border: 1px solid rgba(7,193,96,0.3); }
    `;
    document.head.appendChild(style);

    // Parse video
    const runVideo = (list) => {
        if (pathname !== '/cgi-bin/appmsg') { return; }
        if (!list || !list.length) { return; }
        debug && console.log('run video', list);

        // Insert wxv field in thead
        let th = $(`<th class="sherer-wxv-th tc">${tc('wxv')}</th>`);
        if (!$('.sherer-wxv-th').length) { $('.weui-desktop-table__hd').find('th').eq(0).after(th); }

        // Insert wxv field in tbody
        if ($('.sherer-wxv-td').length) { return; }
        $('.weui-desktop-table__bd').find('tr').each(function (index) {
            let tr = $(this);
            let check = tr.find('.weui-desktop-simple-video__name-td');
            if (!check.length) { return; }
            let wxv = list[index].content;
            if (!wxv) {
                let url = list[index].content_url;
                if (url) { wxv = (url.match(/vid=(\w*)/) || [''])[1]; }
            }
            let td = $(`<td><span class="sherer-wxv-td sherer-btn" data-content="${wxv || ''}">${wxv || ''}</span></td>`);
            tr.find('td').eq(0).after(td);
        });

        // Set title field font
        $('.weui-desktop-simple-video__title').addClass('sherer-font');

        // Add copy all data button
        if ($('.sherer-copy-all').length) { return; }
        $('.weui-desktop-global__extra .weui-desktop-btn_wrp').find('button').eq(0).after(`<button type="button" class="weui-desktop-btn weui-desktop-btn_primary sherer-ml-5 sherer-copy-all sherer-font">${tc('copy')}</button>`);

        $('.sherer-copy-all').off('click');
        $('.sherer-copy-all').on('click', function () {
            let content = list.map(item => {
                let wxv = item.content;
                if (!wxv) {
                    let url = item.content_url;
                    if (url) { wxv = (url.match(/vid=(\w*)/) || [''])[1]; }
                }
                return wxv || '';
            }).reverse().join('\n');
            debug && console.log('copy text', content);
            GM_setClipboard(content, 'text');
            message.success(tc('copyed'));
        });
    };

    // Parse audio
    const runAudio = (list) => {
        if (pathname !== '/cgi-bin/filepage' || query.type != 3) { return; }
        if (!list || !list.length) { return; }
        debug && console.log('run audio', list);

        let view = query.view || 'card';
        if (view == 'card') {
            if ($('.weui-desktop-audio-picker__item').length > 0) { // New version
                $('.weui-desktop-audio-picker__item').each(function (index) {
                    let div = $(this);
                    let fileid = list[index].voice_encode_fileid;
                    if (!fileid) { return; }

                    div.first().addClass('sherer-font sherer-flex-column');

                    let fileUrl = `https://res.wx.qq.com/voice/getvoice?mediaid=${fileid}`;
                    div.find('label').first().after(`<span class="sherer-fileid sherer-btn sherer-font sherer-center sherer-border sherer-mt-5" data-content="${fileUrl}">${tc('copy_url')}</span>`);
                });
            } else { // Old version
                $('.weui-desktop-audio-card__info').each(function (index) {
                    let div = $(this);
                    let fileid = list[index].voice_encode_fileid;
                    if (!fileid) { return; }

                    div.addClass('sherer-font sherer-flex-column sherer-justify-between');
                    div.find('.weui-desktop-audio-card__item_left_bottom').addClass(`sherer-position-none`);

                    let fileUrl = `https://res.wx.qq.com/voice/getvoice?mediaid=${fileid}`;
                    div.find('strong').after(`<span class="sherer-fileid sherer-btn sherer-font sherer-center" data-content="${fileUrl}">${tc('copy_url')}</span>`);
                });
            }
        } else if (view == 'list') {
            // Insert fileid field in thead
            let th = $(`<th class="sherer-fileid-th sherer-font tc">${tc('url')}</th>`);
            if (!$('.sherer-fileid-th').length) { $('.weui-desktop-table-audio__content').after(th); }

            // Insert fileid field in tbody
            if ($('.sherer-fileid-td').length) { return; }
            $('.weui-desktop-table__bd').find('tr').each(function (index) {
                let tr = $(this);
                let check = tr.find('.weui-desktop-audio-player__switch');
                if (!check.length) { return; }
                let fileid = list[index].voice_encode_fileid;
                if (!fileid) { return; }

                let fileUrl = `https://res.wx.qq.com/voice/getvoice?mediaid=${fileid}`;
                let td = $(`<td><span class="sherer-fileid-td sherer-btn sherer-font" data-content="${fileUrl}">${tc('copy')}</span></td>`);
                tr.find('td').eq(1).after(td);
            });

            // Set title field font
            $('.weui-desktop-audio__title').addClass('sherer-font');
        }

        // Add copy all data button
        if ($('.sherer-copy-all').length) { return; }
        $('.weui-desktop-global__extra .weui-desktop-btn_wrp').find('button').eq(0).after(`<button type="button" class="weui-desktop-btn weui-desktop-btn_primary sherer-ml-5 sherer-copy-all sherer-font">${tc('copy')}</button>`);

        $('.sherer-copy-all').off('click');
        $('.sherer-copy-all').on('click', function () {
            let content = list.map(item => `https://res.wx.qq.com/voice/getvoice?mediaid=${item.voice_encode_fileid}`).reverse().join('\n');
            debug && console.log('copy text', content);
            GM_setClipboard(content, 'text');
            message.success(tc('copyed'));
        });
    };

    // Parse image
    // let imageTimer;
    const runImage = (list) => {
        if (pathname !== '/cgi-bin/filepage' || query.type != 2) { return; }
        // if (imageTimer) clearTimeout(imageTimer);
        if (!list || !list.length) { return; }
        debug && console.log('run image', list);

        $('.weui-desktop-img-picker__item').each(function (index) {
            let div = $(this);
            let cdn_url = list[index].cdn_url;
            if (!cdn_url) { return; }

            div.find('.sherer-cdn_url').remove();
            div.append(`<div class="sherer-cdn_url sherer-btn sherer-font" data-content="${cdn_url}">${tc('copy_url')}</div>`)
        });

        // Insert cdn_url field in thead
        let th = $(`<th class="sherer-cdn_url-th sherer-font tc">${tc('url')}</th>`);
        if (!$('.sherer-cdn_url-th').length) { $('.weui-desktop-table__hd').find("th").eq(1).after(th); }

        // Insert fileid field in tbody
        $('.weui-desktop-table__bd').find('tr').each(function (index) {
            let tr = $(this);
            let check = tr.find('.weui-desktop-img-picker__img-title');
            if (!check.length) { return; }
            let cdn_url = list[index].cdn_url;
            if (!cdn_url) { return; }

            tr.find('.sherer-cdn_url-td').remove();
            let td = $(`<td><span class="sherer-cdn_url-td sherer-btn sherer-font" data-content="${cdn_url}">${tc('copy')}</span></td>`);
            tr.find('td').eq(1).after(td);
        });

        // Set title field font
        $('.weui-desktop-image__title').removeClass('sherer-font').addClass('sherer-font');

        activeCopyEvent();
        // imageTimer = setTimeout(() => runImage(list), 500);
    };

    // Add click event for copy content
    const activeCopyEvent = () => {
        $('.sherer-btn,.sherer-copy').off('click');
        $('.sherer-btn,.sherer-copy').on('click', function () {
            let content = $(this).data('content');
            if (!content) { return; }
            debug && console.log('copy text', content);
            GM_setClipboard(content, 'text');
            message.success(tc('copyed'));
        });
    }

    // Run
    runVideo((window?.wx?.cgiData || wx?.cgiData || {}).item);
    runAudio((window?.wx?.cgiData || wx?.cgiData || {}).file_item);
    runImage(((window?.wx?.cgiData || wx?.cgiData || {}).data || {}).file_item);

    // active event
    activeCopyEvent();

    // Listen web request
    let isFirst = true;
    GM_webRequest([
        { selector: '*://mp.weixin.qq.com/cgi-bin/appmsg*', action: { redirect: { from: '([^:]+)://mp.weixin.qq.com/(.*)', to: '$1://mp.weixin.qq.com/$2' } } },
        { selector: '*://mp.weixin.qq.com/cgi-bin/filepage*type=2*', action: { redirect: { from: '([^:]+)://mp.weixin.qq.com/(.*)', to: '$1://mp.weixin.qq.com/$2' } } },
    ], function (info, message, details) {
        if (info == 'redirect' && message == 'ok' && isFirst) {
            isFirst = false;
            setTimeout(() => isFirst = true, 10);
            debug && console.log(info, message, details);

            GM_xmlhttpRequest({
                method: "GET",
                url: details.url,
                responseType: "json",
                headers: { "Content-Type": "application/json" },
                onload: function (response) {
                    debug && console.log(response);
                    runVideo((response?.response?.app_msg_info || {}).item);
                    runImage((response?.response?.page_info || {}).file_item);
                }
            });
        }
    });
})();