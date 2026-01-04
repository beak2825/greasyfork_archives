// ==UserScript==
// @name         p bandai list
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  trying to take over the world!
// @author       You
// @match        https://p-bandai.com/hk/search?sort=relevance&character=03-001&shop=05-002&sellDate=1&text=
// @match        https://p-bandai.com/hk/search?sort=relevance&character=03-001&shop=05-002&sellDate=0&text=
// @icon         https://p-bandai.com/_ui/responsive/common/images/favicon.ico
// @grant        GM_notification
// @grant        GM_openInTab
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/448915/p%20bandai%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/448915/p%20bandai%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function () {
        //random second
        var random = Math.floor((Math.random() * 15) + 2) * 1000;

        function reloadTimer () {
            var timer = setTimeout( function() {
                console.log("reload");
                location.reload()
            }, random);
        }

        var error = $("body").find(".p-error");
        if (error.length > 0) {
            console.log("error!");
            reloadTimer();
        }

        var keyword = ["VICTORY DAISHOGUN", "RICK DIAS", "HG 1/144 ZETA GUNDAM"];

        var t = $(".p-search__items").find(".m-card__overlay").find(".m-card__name");

        function searchStringInArray (str, strArray) {
            for (var j=0; j<strArray.length; j++) {
                if (str.indexOf(strArray[j]) >= 0){
                    return j;
                }
            }
            return -1;
        }

        if(t) {
            t.each(function(item) {
                console.log($(this).text());
                //if($(this).text().indexOf(keyword) >= 0) {
                if(searchStringInArray($(this).text(), keyword) >= 0) {
                    console.log("Match");
                    //$(this).closest(".m-card").find("div").click();
                    var endpoint = $(this).closest(".m-card__overlay").find("div").attr("href");
                    GM_notification({text:$(this).text(), title:"STOCK!", onclick: function(){
                        GM_openInTab("https://p-bandai.com" + endpoint);
                    }});
                } else {
                    console.log("No match");
                }
            });
        }
        reloadTimer();
        console.log("ramdom", random);
    })
})();