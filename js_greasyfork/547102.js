// ==UserScript==
// @name         CORS plugin for motion-live
// @name:zh-CN   motion-live 跨域脚本
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Bypass CORS restrict for motion-live webui
// @description:zh-CN 帮助 motion-live 绕过 CORS 限制
// @author       ZZBD
// @match        https://motion-live.vercel.app
// @match        https://motion-live.js.org
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMSAxMmExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMC0yIDAiLz48cGF0aCBkPSJNNyAxMmE1IDUgMCAxIDAgMTAgMCA1IDUgMCAxIDAtMTAgMG04LjkgOC4xMXYuMDFtMy4xNC0yLjUxdi4wMU0yMC43NyAxNHYuMDFtMC00LjAxdi4wMW0tMS43My0zLjYydi4wMU0xNS45IDMuODl2LjAxTTEyIDN2LjAxbS0zLjkuODh2LjAxTTQuOTYgNi4zOXYuMDFNMy4yMyAxMHYuMDFtMCAzLjk5di4wMW0xLjczIDMuNnYuMDFtMy4xNCAyLjQ5di4wMU0xMiAyMXYuMDEiLz48L3N2Zz4=
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/547102/CORS%20plugin%20for%20motion-live.user.js
// @updateURL https://update.greasyfork.org/scripts/547102/CORS%20plugin%20for%20motion-live.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.GM_xmlHttpRequest=GM.xmlHttpRequest
})();