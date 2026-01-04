// ==UserScript==
// @name         MCBBS茶馆新帖提醒
// @namespace    https://www.mcbbs.net/?3074655
// @version      0.2
// @description  提醒在矿工茶馆发布的新帖
// @author       开心的阿诺
// @match        https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=52&filter=author&orderby=dateline
// @icon         https://www.mcbbs.net/favicon.ico
// @grant        unsafeWindow
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/471738/MCBBS%E8%8C%B6%E9%A6%86%E6%96%B0%E5%B8%96%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/471738/MCBBS%E8%8C%B6%E9%A6%86%E6%96%B0%E5%B8%96%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let $ = unsafeWindow.jQuery;
    function refresh() {
        $.get("/forum.php?mod=forumdisplay&fid=52&filter=author&orderby=dateline", (data) => {
            let dom = $(data);
            let threadlist = dom.find("#threadlist");
            let lastId = $("#threadlist tbody[id^=normalthread]")[0].id;
            $("#threadlist").html(threadlist.html());
            $("#threadlist tbody[id^=normalthread]").each((i, v) => {
                if (v.id <= lastId) return false;
                Notification.requestPermission(function(status) {
                    let n = new Notification("茶馆新帖", { icon: "https://www.mcbbs.net/favicon.ico", body: v.children[0].children[1].children[3].innerHTML });
                    n.onclick = (event) => {
                        window.open(v.children[0].children[1].children[3].href)
                    };
                });
            });
        });
    }
    setInterval(refresh, 30000);
})();