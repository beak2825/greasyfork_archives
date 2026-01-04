// ==UserScript==
// @name         freeloc
// @name:zh-CN   freeloc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  uncensor the forum
// @description:zh-cn  目田论坛
// @author       You
// @match        https://www.hostloc.com/thread-*
// @match        https://www.hostloc.com/forum.php?mod=viewthread*
// @match        https://hostloc.com/forum.php?mod=viewthread*
// @match        https://hostloc.com/thread-*
// @icon         https://www.google.com/s2/favicons?domain=hostloc.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428068/freeloc.user.js
// @updateURL https://update.greasyfork.org/scripts/428068/freeloc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keywordpairs = [{
        a: "油管|有图比|油兔",
        b: "youtube"
    }, {
        a: "北岸",
        b: "备案"
    },{
        a: "杜甫|毒妇",
        b: "独服"
    }, {
        a: "推特",
        b: "twitter"
    }, {
        a: "脸书",
        b: "facebook"
    }]

    function free4all() {
         document.querySelectorAll(".plhin td.t_f, .psti").forEach(el=>{
            let html = el.innerHTML
            keywordpairs.forEach(v=>{
                html = html.replace(new RegExp("("+v.a+")", "g"), v.b)
            });
            html = html.replace(/((<a[^>]*>|")?)((\s*)(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g, ($0, $1, $2, $3, $4)=>{
                return $1.length ? $0: $4+"<a href='"+$3+"' target='_blank'>"+$3+"</a>"
            })
            el.innerHTML = html
        })
    }

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        free4all()
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            free4all();
        });
    }
})();