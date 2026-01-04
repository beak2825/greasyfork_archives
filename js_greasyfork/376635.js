// ==UserScript==
// @name         storiesonline depaginator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  De-paginates stories on storiesonline.net
// @author       You
// @match        https://storiesonline.net/s/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376635/storiesonline%20depaginator.user.js
// @updateURL https://update.greasyfork.org/scripts/376635/storiesonline%20depaginator.meta.js
// ==/UserScript==

let scr = document.createElement("script");

scr.src = "https://code.jquery.com/jquery-3.3.1.min.js";

scr.onload = function() {
    if (!document.querySelector(".pager")) {
        let arr = Array.from($(".tolink"));

        if (arr.length === 0) arr = Array.from($(".link"));

        arr.forEach(el => $(el).load(el.children[0].href + " article"));

        let chapters = arr.length;

        setTimeout(function() {
            Array.from($(".end")).forEach(el => el.remove());
            Array.from($(".date")).forEach(el => el.remove());
        }, chapters * 1000);
    } else {
        let moreChapters = Number(document.querySelector(".pager").children[document.querySelector(".pager").children.length - 2].innerText);
        for (let i = 1; i < moreChapters; i++) {
            $.ajax({
              type: "GET",
              url: window.location.href + "?page=" + i.toString(),
              async: false,
              success: function(data) {
                  $("article")[0].innerHTML += $($.parseHTML(data)).find("article")[0].innerHTML;
              }
            });
        }
        Array.from($(".pager")).forEach(el => el.remove());
        Array.from($(".conTag")).forEach(el => el.remove());
        Array.from($("header")).forEach((el, i) => {if (i !== 0) el.remove();});
        Array.from($(".end")).forEach(el => el.remove());
    }
};

document.querySelector("head").appendChild(scr);


for (let sheet of document.styleSheets) {
    sheet.disabled = true;
}