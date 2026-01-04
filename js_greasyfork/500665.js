// ==UserScript==
// @name         ks监控
// @namespace    http://tampermonkey.net/
// @version      2024-06-16
// @description  try to take over the world!
// @author       You
// @match        https://live.kuaishou.com/live_api/follow/living
// @require      https://lib.baomitu.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500665/ks%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/500665/ks%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    setInterval(function () {
        location.href = location.href;
    }, 15000);

    var body = document.querySelector("body").innerText

    var json111 = JSON.parse(body)

    var id = ["pp824520",
              //'3xqmpsbcd93mbsy',//翠兰
              //'3xasv5thsa7qy3m',//Zero
              //'Q9264587464'
             ]

    document.querySelector("body").innerText = ''
    for (var i in json111.data.list) {
        for (var e in id) {
            if (json111.data.list[i].author.id == id[e]) {
                window.location.href = ('kwai://live/play/' + json111.data.list[i].id);
            }
        }
        $('body').append(`<p><a href='kwai://live/play/${json111.data.list[i].id}'>${json111.data.list[i].author.name}</a></p>`);
    }
})();