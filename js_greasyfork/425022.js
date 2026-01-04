// ==UserScript==
// @name         SakuraKeepaLinker
// @namespace    http://hitoriblog.com/
// @version      0.2
// @description  try to take over the world
// @author       moyashi ( @hitoriblog )
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/*/gp/*
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/gp/*
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425022/SakuraKeepaLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/425022/SakuraKeepaLinker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var old_asin = "";

    function searchASIN() {
        var asin;

        if (typeof($("#ASIN")[0]) == "object") {
            asin = $("#ASIN")[0].value;
        } else {
            asin = $("#ASIN").value;
        }
        return asin;
    }

    function ASINWatcher() {
        var asin = searchASIN();
        if (old_asin == "") {
            old_asin = asin;
        } else if (asin != old_asin)  {
            injectLinks();
            old_asin = asin;
        }
    }

    function injectLinks() {
        if ($("#ASIN") != null) {
            if ($(".lnkKeepa")) {
                $(".lnkKeepa").remove();
            }
            var asin = searchASIN();
            var str = document.createTextNode("Keepaで見る");
            var aa = document.createElement("div");
            aa.style.border = "1px solid #999";
            aa.style.borderRadius = "3px";
            aa.style.margin = "7px";
            aa.style.padding = "7px";
            aa.style.fontWeight = "bold";
            aa.style.backgroundColor = "rgb(202, 230, 252)";
            aa.appendChild(str);
            var a = document.createElement("a");
            a.classList.add("lnkKeepa");
            a.href = "https://keepa.com/#!product/5-" + asin;
            a.target = "_blank";
            a.appendChild(aa);

            if ($(".lnkSakuraChecker")) {
                $(".lnkSakuraChecker").remove();
            }
            var str2 = document.createTextNode("サクラチェッカーで見る");
            var bb = document.createElement("div");
            bb.style.border = "1px solid #999";
            bb.style.borderRadius = "3px";
            bb.style.margin = "7px";
            bb.style.padding = "7px";
            bb.style.fontWeight = "bold";
            bb.style.backgroundColor = "rgb(255, 235, 250)";
            bb.appendChild(str2);
            var b = document.createElement("a");
            b.classList.add("lnkSakuraChecker");
            b.href = "https://sakura-checker.jp/search/" + asin + "/";
            b.target = "_blank";
            b.appendChild(bb);
            if ($("#booksTitle").length > 0) {
              $("#booksTitle").append(a);
              $("#booksTitle").append(b);
            } else if ($("#titleSection").length > 0) {
              $("#titleSection").append(a);
              $("#titleSection").append(b);
            }
        }
    }
    $(document).ready(function(){
        injectLinks();
        setInterval(ASINWatcher, 1000);
    });
})();