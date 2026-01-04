// ==UserScript==
// @name         Baidu Tieba Escape Core Area
// @version      0.1
// @description  默认进入“看贴”板块，而非“核心区”
// @author       BrainBag
// @include      *//tieba.baidu.com/f?kw=*
// @run-at       document-start
// @namespace https://greasyfork.org/users/421357
// @downloadURL https://update.greasyfork.org/scripts/393841/Baidu%20Tieba%20Escape%20Core%20Area.user.js
// @updateURL https://update.greasyfork.org/scripts/393841/Baidu%20Tieba%20Escape%20Core%20Area.meta.js
// ==/UserScript==

var url = new URL(document.location.href);
if (url && url.searchParams && url.searchParams.get && !url.searchParams.get("tab")) {
    url.searchParams.set("tab", "main");
    document.location.href = url.href;
}