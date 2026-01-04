// ==UserScript==
// @name         Sto CC One page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.sto.cc/book-*-1.html
// @grant GM_addStyle
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369993/Sto%20CC%20One%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/369993/Sto%20CC%20One%20page.meta.js
// ==/UserScript==

(function() {

    GM_addStyle("#a_d_1, #a_d_2 {display:none}");
    $("#BookContent").css("user-select", "text");
    document.body.onselectstart = function() {return true;}

    var pageUrl = [];
    var pageNum = [];

    $("#BookContent").text("");
    $("#Page_select").children().each(function() {
        var pU = this.value;
        var pN = $(this).text();
            pageUrl.push(pU);
            pageNum.push(pN);
            $("#BookContent").append("<span id='page" + pN + "'>");
    });

    while (pageUrl.length > 0) {
        $.ajax({
            url: pageUrl.shift(),
            pageNum: pageNum.shift(),
            success: function (data) {
                //.append("Page " + this.pageNum + "<br>")
                $("#page" + this.pageNum).append($(data).find("#BookContent").html().replace(/[\s]*<(span|div) id="[\w]+">[\w\s<>="/.!\-:;(){}|\[\] ]+<\/(span|div)>[\s]*/g, "").replace(/script/g, "disable"));
            },
            async: true
        });
    }
})();