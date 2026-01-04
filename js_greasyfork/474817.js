// ==UserScript==
// @name                Net Disk Helper
// @name:zh-CN          网盘助手
// @name:ug             تور دىسكا ياردەمچىسى
// @namespace           https://github.com/ShererInc/NetDiskHelper
// @version             1.1.2
// @author              Sherer(شەرەر)
// @description         Easy to get material ids in net disk of Tianyi(189)
// @description:zh-CN   一键获取天翼云盘（189）素材ID
// @description:ug      ‫تىيەنيى (189) تور دىسكىسىدىكى ماتېرىياللارنىڭ نومۇرىغا ئاسانلا ئېرىشكىلى بولىدۇ
// @license             MIT
// @supportURL          https://github.com/ShererInc/NetDiskHelper
// @match               *://cloud.189.cn/web/main/*
// @require             https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require             https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @run-at              document-idle
// @grant               GM_setClipboard
// @icon                data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE3OSIgdmlld0JveD0iMCAwIDE4MCAxNzkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxtYXNrIGlkPSJtYXNrMF83MDlfMTEiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjYwIiB5PSI0MiIgd2lkdGg9IjYyIiBoZWlnaHQ9Ijk1Ij4KPHBhdGggZD0iTTYxLjExOTcgODkuODkzOUM1OC4zMjggNzcuMDAwOSA5NS45ODExIDQyLjI0NTEgOTUuOTgxMSA0Mi4yNDUxQzk1Ljk4MTEgNDIuMjQ1MSA4NS43MzI4IDY5LjI1NzggODkuMzc4NyA4MS40MTA1QzkzLjAyNDUgOTMuNTYzMiAxMTguMTMzIDc2LjU5NDMgMTIxLjU4OCA4OS44OTM5QzEyNS4wNDQgMTAzLjE5NCA3Ni44OTI0IDEzNi42MDEgNzYuODkyNCAxMzYuNjAxQzc2Ljg5MjQgMTM2LjYwMSA5Ny44NzMxIDExMS4xNzIgODguNTY1MyA5OC43NTM0QzgxLjg1NTkgODkuODAyMSA2My45MTE0IDEwMi43ODcgNjEuMTE5NyA4OS44OTM5WiIgZmlsbD0iI0M0QzRDNCIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfNzA5XzExKSI+CjxwYXRoIGQ9Ik03MC40Mzc1IDg5LjcxODRDNjkuNTEzOCA3Ni44NTU5IDk2LjMxNDkgNDIuOTY3MiA5Ni4zMTQ5IDQyLjk2NzJDOTYuMzE0OSA0Mi45NjcyIDkwLjIxNDEgNjguNzYyMSA5MS43NDI0IDgwLjkwMzdDOTMuMjcwNyA5My4wNDUzIDEwOC4zMTUgNzcuNDkwNyAxMDkuNjQxIDkwLjc2ODhDMTEwLjk2NyAxMDQuMDQ3IDc3LjQ1MjYgMTM2LjQxMyA3Ny40NTI2IDEzNi40MTNDNzcuNDUyNiAxMzYuNDEzIDkyLjgwMzMgMTExLjUwNCA4Ny42MjI0IDk5LjAwMDRDODMuODg3OCA4OS45ODczIDcxLjM2MTEgMTAyLjU4MSA3MC40Mzc1IDg5LjcxODRaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNzA5XzExKSIvPgo8L2c+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjQuNTUwNiA5OS4xMzQ4QzIzLjY4NzQgOTMuNDc4NiAyMy41ODY5IDg3Ljc4MjcgMjQuMjE3MiA4Mi4xODY3QzI1LjAzMyA3NC45NDMyIDI3LjA3MzIgNjcuODY3MiAzMC4yNjgzIDYxLjI2MTJDMzEuNDY2NSA1OC43ODQgMzIuODI3MSA1Ni4zNzI4IDM0LjM0NjQgNTQuMDQzOEMzNC42MTkyIDUzLjYyNTUgMzQuODk3MiA1My4yMDk5IDM1LjE4MDMgNTIuNzk3MUwzOS43OTk1IDU1Ljg4NjZMNDEuMTg3MSA1Ni44MTQ3TDQxLjE0MDIgNTYuODgzMkM0MC45MDQ0IDU3LjIyODIgNDAuNjcyNiA1Ny41NzUzIDQwLjQ0NDggNTcuOTI0NkMzOC41NTA4IDYwLjgyNzkgMzYuOTM0IDYzLjg3NDUgMzUuNjAzMiA2Ny4wMjU0QzMxLjQ5NDYgNzYuNzUyOSAzMC4xMTI0IDg3LjQ3NCAzMS43MjAxIDk4LjA0MDZMMzEuNzI0MSA5OC4wNjY4QzMzLjkyMjkgMTEyLjQ3NSA0MS41MjA1IDEyNS41NDEgNTMuMDEgMTM0LjY3N0w1My4wNzgxIDEzNC43MzFDNjQuNjA1NiAxNDMuODY5IDc5LjE5MyAxNDguMzg4IDkzLjkzOTcgMTQ3LjM4OUw5My45NTE4IDE0Ny4zODhDOTguMTE1NSAxNDcuMTA1IDEwMi4yMDYgMTQ2LjM4OCAxMDYuMTYxIDE0NS4yNjVDMTA3LjMzMSAxNDcuNTMgMTA4LjgyNCAxNDkuNjAxIDExMC41NzkgMTUxLjQxN0MxMDUuMzkxIDE1My4xMDQgOTkuOTcxMiAxNTQuMTYyIDk0LjQzNjMgMTU0LjUzN0w5NC40MjQyIDE1NC41MzhDNzcuODkyNyAxNTUuNjU1IDYxLjU0MDIgMTUwLjU5OSA0OC42MDU0IDE0MC4zNzNMNDguNTM3MiAxNDAuMzE5QzM1LjU5NTUgMTMwLjA1OSAyNy4wMzQ2IDExNS4zNjcgMjQuNTU0NiA5OS4xNjA5TDI0LjU1MDYgOTkuMTM0OFpNMTQ5LjY5NyAxMTcuMjVDMTUzLjcwMSAxMDguODYzIDE1NS44ODUgOTkuNjU3OSAxNTYuMDA1IDkwLjIyNzlMMTU2LjAwNSA5MC4yMjU3QzE1Ni4yMTUgNzMuODI3NCAxNTAuMTY4IDU3Ljk1MjEgMTM5LjA2NyA0NS43NTYzTDEzOS4wMDggNDUuNjkwN0MxMjcuOTEyIDMzLjUzMzIgMTEyLjU5NyAyNS45MzQ5IDk2LjA5NTQgMjQuNDAzM0w5Ni4wNzkgMjQuNDAxOEM4Ny42NTUgMjMuNjIyMSA3OS4yMzY4IDI0LjQ1MjUgNzEuMjU4NyAyNi43NzA0QzY2LjkzNDEgMjguMDI2OCA2Mi43Mzg4IDI5LjcyMDMgNTguNzQyIDMxLjgzMTNDNTguMjk3MyAzMi4wNjYxIDU3Ljg1NTEgMzIuMzA2MSA1Ny40MTU1IDMyLjU1MTNDNTQuOTkxNCAzMy45MDMxIDUyLjY0NDkgMzUuNDExMSA1MC4zOTE5IDM3LjA3MDlDNTAuMjEwMSAzNy4yMDQ4IDUwLjAyODkgMzcuMzM5OCA0OS44NDgzIDM3LjQ3NTdMNTIuMzI5MSA0MC4xNTYxTDU0LjM5IDQyLjM4MjhDNTcuNzYxNiAzOS44NDUxIDYxLjM2MzEgMzcuNzU4NyA2NS4xMzI2IDM2LjEwNTZDNzQuNTA3MyAzMS45OTQyIDg0LjkyMDUgMzAuNTYzIDk1LjQxNjcgMzEuNTM3Mkw5NS40MzMyIDMxLjUzODhDMTEwLjE0MyAzMi45MDgyIDEyMy43OTQgMzkuNjkzNCAxMzMuNjcyIDUwLjU0NjdMMTMzLjczMiA1MC42MTI0QzE0My41NzYgNjEuNDYwNCAxNDguOTM3IDc1LjU2NDkgMTQ4Ljc1MiA5MC4xMzMyTDE0OC43NTIgOTAuMTM1NUMxNDguNjU1IDk3LjcxNjkgMTQ3LjA2IDEwNS4xMzUgMTQ0LjEyNiAxMTIuMDAxQzE0Ni4yMzEgMTEzLjQ2OSAxNDguMTA5IDExNS4yMzkgMTQ5LjY5NyAxMTcuMjVaIiBmaWxsPSIjODA4NDhBIi8+CjxlbGxpcHNlIGN4PSI0NC42ODU5IiBjeT0iNDcuMjY1NyIgcng9IjUuMTI2ODEiIHJ5PSI1LjA2Mzc4IiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfNzA5XzExKSIvPgo8Y2lyY2xlIGN4PSIxMjkuMzYzIiBjeT0iMTMzLjQ4MyIgcj0iMjAuNzQ2MSIgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzcwOV8xMSkiLz4KPHBhdGggZD0iTTExNS41MTYgMTM0LjkyMkMxMTUuMDg3IDEzNC43MTMgMTE0Ljg3MyAxMzQuMzMzIDExNC44NzMgMTMzLjc4M0MxMTQuODczIDEzMy4yMzMgMTE1LjA5MyAxMzIuODQ3IDExNS41MzMgMTMyLjYyN0MxMTkuMzA3IDEzMC4zOTMgMTIxLjQ3NSAxMjkuMTA2IDEyMi4wMzYgMTI4Ljc2NUMxMjIuNTk4IDEyOC40MjQgMTIyLjkzMyAxMjguMjM3IDEyMy4wNDMgMTI4LjIwNEMxMjMuMTY0IDEyOC4xNDkgMTIzLjMwNyAxMjguMTIxIDEyMy40NzIgMTI4LjEyMUMxMjMuNzcgMTI4LjEyMSAxMjQuMDc4IDEyOC4zOTEgMTI0LjM5NyAxMjguOTNDMTI0LjYwNiAxMjkuMjcxIDEyNC43MSAxMjkuNTMgMTI0LjcxIDEyOS43MDZDMTI0LjcxIDEyOS44NzEgMTI0LjY3MiAxMzAuMDE0IDEyNC41OTUgMTMwLjEzNUMxMjQuNDk2IDEzMC4zMTEgMTI0LjI3IDEzMC41MTUgMTIzLjkxOCAxMzAuNzQ2QzEyMC42MzkgMTMyLjY4MiAxMTguOTMzIDEzMy42OTUgMTE4LjgwMSAxMzMuNzgzTDEyMy45MTggMTM2LjgyQzEyNC4xMjcgMTM2Ljk0MSAxMjQuMjc2IDEzNy4wNCAxMjQuMzY0IDEzNy4xMTdDMTI0LjYwNiAxMzcuMzE1IDEyNC43MjcgMTM3LjUzIDEyNC43MjcgMTM3Ljc2MUMxMjQuNzI3IDEzNy45ODEgMTI0LjYyOCAxMzguMjUxIDEyNC40MyAxMzguNTdDMTI0LjI0MyAxMzguODc4IDEyNC4wNzIgMTM5LjA5OCAxMjMuOTE4IDEzOS4yM0MxMjMuNzY0IDEzOS4zNjIgMTIzLjYwNSAxMzkuNDI4IDEyMy40MzkgMTM5LjQyOEMxMjMuMjE5IDEzOS40MjggMTIyLjkzMyAxMzkuMzI0IDEyMi41ODEgMTM5LjExNEwxMTUuNTE2IDEzNC45MjJaTTEyNy44NzkgMTM5LjU5M0MxMjcuNzkxIDEzOS43OCAxMjcuNzE5IDEzOS45MTggMTI3LjY2NCAxNDAuMDA2QzEyNy42MiAxNDAuMDk0IDEyNy41MzggMTQwLjE3NiAxMjcuNDE3IDE0MC4yNTNDMTI3LjMwNyAxNDAuMzQxIDEyNy4xNTggMTQwLjM4NSAxMjYuOTcxIDE0MC4zODVDMTI2Ljc4NCAxNDAuMzg1IDEyNi41MDkgMTQwLjMwMyAxMjYuMTQ2IDE0MC4xMzhDMTI1Ljc4MyAxMzkuOTczIDEyNS41MzUgMTM5LjgyNCAxMjUuNDAzIDEzOS42OTJDMTI1LjI4MiAxMzkuNTcxIDEyNS4yMjEgMTM5LjQzNCAxMjUuMjIxIDEzOS4yNzlDMTI1LjIyMSAxMzkuMTI1IDEyNS4yODcgMTM4Ljg1IDEyNS40MTkgMTM4LjQ1NEwxMzAuNzM1IDEyNy4zNDVDMTMwLjk0NCAxMjYuOTI3IDEzMS4xMzEgMTI2LjY4NSAxMzEuMjk2IDEyNi42MTlDMTMxLjM4NCAxMjYuNTc1IDEzMS41MSAxMjYuNTUzIDEzMS42NzUgMTI2LjU1M0MxMzEuODUyIDEyNi41NTMgMTMyLjEzMiAxMjYuNjQxIDEzMi41MTcgMTI2LjgxN0MxMzMuMTEyIDEyNy4xMDMgMTMzLjQwOSAxMjcuNDE3IDEzMy40MDkgMTI3Ljc1OEMxMzMuNDA5IDEyNy45MDEgMTMzLjMzMiAxMjguMTc2IDEzMy4xNzggMTI4LjU4M0wxMjcuODc5IDEzOS41OTNaTTE0My4wODggMTMyLjYyN0MxNDMuNTI4IDEzMi44NDcgMTQzLjc0OCAxMzMuMjMzIDE0My43NDggMTMzLjc4M0MxNDMuNzQ4IDEzNC4zMzMgMTQzLjUzMyAxMzQuNzEzIDE0My4xMDQgMTM0LjkyMkwxMzYuMDU2IDEzOS4xMTRDMTM1LjQ5NSAxMzkuNDc4IDEzNS4wNDMgMTM5LjUxNiAxMzQuNzAyIDEzOS4yM0MxMzQuNTQ4IDEzOS4wOTggMTM0LjM4OSAxMzguOSAxMzQuMjI0IDEzOC42MzZDMTM0LjAwMyAxMzguMjczIDEzMy44OTMgMTM4LjAwOCAxMzMuODkzIDEzNy44NDNDMTMzLjg5MyAxMzcuNjc4IDEzMy45MjYgMTM3LjUzNSAxMzMuOTkyIDEzNy40MTRDMTM0LjExMyAxMzcuMjI3IDEzNC4zNSAxMzcuMDI5IDEzNC43MDIgMTM2LjgyTDEzOS44MzYgMTMzLjc4M0wxMzQuNzE5IDEzMC43NDZDMTM0LjUyMSAxMzAuNjI1IDEzNC4zNzIgMTMwLjUyNiAxMzQuMjczIDEzMC40NDhDMTM0LjAzMSAxMzAuMjM5IDEzMy45MSAxMzAuMDE0IDEzMy45MSAxMjkuNzcyQzEzMy45MSAxMjkuNTUyIDEzNC4wMDMgMTI5LjI4OCAxMzQuMTkxIDEyOC45NzlDMTM0LjUzMiAxMjguNDA3IDEzNC44NTEgMTI4LjEyMSAxMzUuMTQ4IDEyOC4xMjFDMTM1LjQxMiAxMjguMTIxIDEzNS43MDkgMTI4LjIyNiAxMzYuMDM5IDEyOC40MzVMMTQzLjA4OCAxMzIuNjI3WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl83MDlfMTEiIHgxPSI5NC43ODMzIiB5MT0iNDIuODE4IiB4Mj0iODUuNTg5NyIgeTI9IjEzNy4yMDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGOTkwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkFDNzMiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzcwOV8xMSIgeDE9IjQ0LjY4NTkiIHkxPSI0Mi4yMDE5IiB4Mj0iNDQuNjg1OSIgeTI9IjUyLjMyOTUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0ZGOTkwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGQkFDNzMiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzcwOV8xMSIgeDE9IjExNi42OTMiIHkxPSIxMTcuNzUyIiB4Mj0iMTQ2LjM5OSIgeTI9IjE1MS4yMjkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzJEQzBGRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzODU4RkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K
// @downloadURL https://update.greasyfork.org/scripts/474817/Net%20Disk%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474817/Net%20Disk%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // global variables
    const debug = false;
    const lang = navigator.language || navigator.userLanguage; // e.g. "en-US"

    // Language pack
    const languages = {
        'zh-CN': {
            dir: 'ltr',
            copy: '复制',
            copyed: '内容已复制',
            copy_url: '复制链接',
        },
        'ug': {
            dir: 'rtl',
            copy: 'كۆچۈرۈش',
            copyed: 'ئۇچۇر كۆچۈرۈلدى',
            copy_url: 'ئۇلانمىنى كۆچۈرۈش',
        },
        'default': {
            dir: 'ltr',
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
        .sherer-btn-tianyi { margin-right: 20px; padding: 4px 12px; border-radius: 4px; color: #fff; font-size: 12px; border: 1px solid #0073e3; background: #2b89ea; cursor: pointer; }
        .sherer-font { font-family: 'UKIJ Ekran', 'UKIJ Tor', 'UKIJ Basma', 'ALKATIP Tor', 'ALKATIP', 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
        .sherer-flex-column { display: flex; flex-direction: column; }
        .sherer-justify-between { justify-content: space-between; }
        .sherer-position-none { position: static !important; }
        .sherer-center { text-align: center; }
        .sherer-m-5,.sherer-ml-5 { margin-left: 5px !important; }
        .sherer-m-5,.sherer-mr-5 { margin-right: 5px !important; }
        .sherer-m-5,.sherer-mt-5 { margin-top: 5px !important; }
        .sherer-m-5,.sherer-mb-5 { margin-bottom: 5px !important; }
        .sherer-my-5 { margin-top: 5px !important;margin-bottom: 5px !important; }
        .sherer-mx-5 {margin-left:5px !important;margin-right:5px !important;}
        .sherer-mx-auto {margin-left:auto;margin-right:auto;}
    `;
    document.head.appendChild(style);

    // Tianyi net disk
    const tianyi = () => {
        // $('.sherer-fileid').remove();
        let list = [];
        debug && console.log($('.file-list-ul .c-file-item[data-isfolder!="true"]').length);
        $('.file-list-ul .c-file-item[data-isfolder!="true"]').each(function () {
            let li = $(this);
            let fileid = li ? li.attr('data-fileid') : undefined;
            debug && console.log(fileid);
            if (!fileid) { return; }

            let _fieldid = `tianyi_${fileid}`;
            list.push(_fieldid)

            if (li.find(".sherer-fileid").length) { return; }
            li.find('.file-item').after(`<p class="sherer-fileid sherer-btn sherer-font sherer-center sherer-m-5" data-content="${_fieldid}">${tc('copy_url')}</p>`);
        });

        // Remove copy all button
        $('.sherer-copy-all').remove();

        // Add copy all data button
        if (list.length > 0) {
            // Add new copy all button
            let output = list.join('\n');
            $('.nav-opea').prepend(`<button type="button" class="sherer-btn-tianyi sherer-copy sherer-copy-all sherer-font" data-content="${output}">${tc('copy')}</button>`);
        }

        activeCopyEvent();
    };

    const copyContent = (content) => {
        if (!content) { return; }
        debug && console.log('copy text', content);
        GM_setClipboard(content, 'text');
        message.success(tc('copyed'));
    };

    // Add click event for copy content
    const activeCopyEvent = () => {
        $('.sherer-btn,.sherer-copy').off('click');
        $('.sherer-btn,.sherer-copy').on('click', function () {
            copyContent($(this).data('content'));
        });
    }

    // Analysis net disks
    if (/cloud.189.cn/.test(location.host)) {
        let observe = new MutationObserver(function (mutationsList, observer) {
            debug && console.log(mutationsList);
            let doWork = true;
            for (let i = 0; i < mutationsList.length; i++) {
                let mutation = mutationsList[i];
                if (mutation && mutation.addedNodes && mutation.addedNodes.length) {
                    let count = 0;
                    for (let j = 0; j < mutation.addedNodes.length; j++) {
                        let node = mutation.addedNodes[j];
                        if (node && node.classList && node.classList.contains('sherer-fileid')) {
                            count += 1;
                            break;
                        }
                    }
                    if (count > 0) { doWork = false; break; }
                }
            }
            doWork && tianyi();
        });

        let nodes = document.getElementsByClassName("p-view-box");
        debug && console.log(nodes);
        if (nodes && nodes.length) observe.observe(nodes.item(0), { attributes: false, childList: true, subtree: true });
        tianyi();
    }

    // active event
    activeCopyEvent();
})();