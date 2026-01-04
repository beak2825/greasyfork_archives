// ==UserScript==
// @name         Adult-FanFiction depaginator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  depaginates adult-fanfiction stories
// @author       You
// @match        http://*.adult-fanfiction.org/story.php?no=*
// @match        https://*.adult-fanfiction.org/story.php?no=*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374314/Adult-FanFiction%20depaginator.user.js
// @updateURL https://update.greasyfork.org/scripts/374314/Adult-FanFiction%20depaginator.meta.js
// ==/UserScript==

var newPStyle = `<style>
    p:empty {
        dispay: none;
    }
</style>`;
$("head").append(newPStyle);

var paths = $("div.pagination:nth-child(2) > ul:nth-child(1) > li:nth-child(4)")[0];
var currentPage = window.location.href.split("&chapter=")[0] + "&chapter=";
if (paths) {
    //last page is paths.childNodes[0].href
    var lastPage = Number(paths.childNodes[0].href.split("&chapter=")[1]);
    for (let i = 2; i <= lastPage; i++) {
        $.ajax({
            type: "GET",
            url: currentPage + i,
            async: false,
            success: function(data) {
                var newHTML = $(data).find("#contentdata > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)")[0].innerHTML;
                $("#contentdata > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)")[0].innerHTML += newHTML;
            }
        });
    }
    Array.prototype.forEach.call($("p"), function(el) {
        if (el.innerHTML === "&nbsp;") {
            el.innerText = "";
        }
    });
}

function titleFixer() {
    $("title")[0].innerText = $(`#contentdata >
                                table:nth-child(2) >
                                tbody:nth-child(1) >
                                tr:nth-child(1) >
                                td:nth-child(1) >
                                table:nth-child(1) >
                                tbody:nth-child(1) >
                                tr:nth-child(1) >
                                td:nth-child(1) >
                                h2:nth-child(1) >
                                a:nth-child(1)`)[0].innerText;
}

titleFixer();

function CSSFixer() {
    for (let i = 0; document.styleSheets.length; i++) {
        document.styleSheets[i].disabled = true;
    }
}

CSSFixer();
