// ==UserScript==
// @name       rarbg thumb
// @namespace  https://rarbg.to/
// @version    0.2
// @description  rarbg list thumb
// @include    http*://*rarbg*/*
// @grant      none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/21745/rarbg%20thumb.user.js
// @updateURL https://update.greasyfork.org/scripts/21745/rarbg%20thumb.meta.js
// ==/UserScript==

$(function() {
    $("table.lista2t tr.lista2").each(function() {
        var getTd = $(this).find("td:eq(1)");
        var getImgsrc = getTd.find("a").attr("onmouseover");
        getTd.find("a").off("onmouseover").removeAttr("onmouseover");
        if(getImgsrc && getImgsrc != "") {
            var imgsrc = getImgsrc.split("http")[1].split("\\")[0];
            if(imgsrc && imgsrc != "") {
                getTd.prepend('<img src="http' + imgsrc + '" alt="" style="margi-right:5x;width:150px">');
            }
        }
    });
});