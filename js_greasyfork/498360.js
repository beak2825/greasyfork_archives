// ==UserScript==
// @name         nl-sidebar-gpt-4o
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @require      https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/0.1.0-beta.4/libs/oversea/index.js#sha256=ueyZzJ8lhg8HT2SC/DgG1tYtg8HQ63sSyUe/mrA/XaA=
// @description  ⚠️预置的bot_id的额度已耗尽，更换成自己的bot_id，⚠️到coze.com发布bot到WebSDK即可得到bot_id。   Sidebar gpt4o powered by CozeWebSDK
// @author       Yearly
// @match        *://*/*
// @icon       data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSItMTIgLTE0IDU4IDU4IiBmaWxsPSIjRkZGIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiPjxmZURyb3BTaGFkb3cgZHg9IjEiIGR5PSIxIiBmbG9vZC1jb2xvcj0iIzExMUEiIHN0ZERldmlhdGlvbj0iMiIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB4PSItNyIgeT0iLTkiIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSIgZmlsbD0iIzFBQyIgcng9IjkiIHJ5PSI5IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsdGVyPSJ1cmwoI2EpIi8+PHBhdGggZD0iTTE2IDE5YTcgNyAwIDAgMS01LjgtMy4xM2wxLjctMS4xYTUgNSAwIDAgMCA4LjMzNCAwbDEuNyAxLjFBNyA3IDAgMCAxIDE2IDE5bTQtMTFhMiAyIDAgMSAwIDIgMiAyIDIgMCAwIDAtMi0ybS04IDBhMiAyIDAgMSAwIDIgMiAyIDIgMCAwIDAtMi0yIi8+PHBhdGggZD0ibTE3IDMwLTEtMSA0LTdoNmEyIDIgMCAwIDAgMi0yVjZhMiAyIDAgMCAwLTItMkg2YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmg5djJINmE0IDQgMCAwIDEtNC00VjZhNCA0IDAgMCAxIDQtNGgyMGE0IDQgMCAwIDEgNCA0djE0YTQgNCAwIDAgMS00IDRoLTQuODM1WiIvPjwvc3ZnPg==
// @license MIT
// @license      AGPL-v3.0
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498360/nl-sidebar-gpt-4o.user.js
// @updateURL https://update.greasyfork.org/scripts/498360/nl-sidebar-gpt-4o.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`iframe[src]{max-height:100vh;}`);
    if (window.self === top) {
        new CozeWebSDK.WebChatClient({
            config: {
                bot_id: '7379983973776801798',
            },
            componentProps: {
                title: 'chat-4o',
                icon: GM_info.script.icon,
                lang: 'zh-CN', // English zh-CN
                layout: 'pc', // mobile pc
            },
        });
    }
})();