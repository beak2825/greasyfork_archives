// ==UserScript==
// @name         XLSMH Mobile Ext
// @namespace    https://xlsmh.houtar.eu.org/
// @version      0.8
// @description  它提供了加载所有图像和加载失败回退的功能。
// @author       Houtar
// @match        *://m.xlsmh.com/manhua/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xlsmh.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449099/XLSMH%20Mobile%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/449099/XLSMH%20Mobile%20Ext.meta.js
// ==/UserScript==

(function () {
    "use strict";
    /* global $ */

    $(".scroll-item").each(function (index, item) {
        var $item = $(item);
        var state = $item.attr("data-state");
        var regex = /(?<=:\/\/).*?(?=\/)/gm;
        var successDomains = [$('#image').attr("src").match(regex)[0]];

        if (state === "pending") {
            $item.show();
            $item.attr("data-state", "loading");
            var img = $item.find("img");
            img.load(function () {
                console.log(index, "onload");
                $item.attr("data-state", "success");
                var cu = img.attr("src").match(regex)[0];
                if(successDomains.indexOf(cu) == -1){
                    successDomains.unshift(cu);
                }
            });
            img.error(function () {
                if ($item.attr("data-state").startsWith("fallback")) {
                    console.warn(index, "onerror, trying to " + $item.attr("data-state"));
                    $item.attr(
                        "data-state",
                        "fallback" + (+$item.attr("data-state").slice(8) + 1)
                    );
                    img.attr(
                        "src",
                        img
                        .attr("src")
                        .replace(
                            regex,
                            successDomains[+$item.attr("data-state").slice(8)]
                        )
                    );
                }

                $item.attr("data-state", "error");
                console.warn(index, "onerror, trying to fallback");
                img.attr("src", img.attr("src").replace(regex, successDomains[0]));
                $item.attr("data-state", "fallback0");
            });
            img.attr("src", img.data("src"));
        }
    });
    // var globalLoad = $("<span></span>").text("点击启用全局加载（测试版）");
    // globalLoad.click(function () {
    //   $("#fail-box").hide();
    //   document.body.innerHTML = document.body.innerHTML.replaceAll(
    //     "n1a.zmengqi",
    //     "na.dingdangmh"
    //   );
    // });
    // $("#fail-box").append($("<p></p>").append(globalLoad));
    // $("#fail-box").parent().attr("href", "#");
    // document.querySelectorAll("img").forEach(function (el) {
    //   if (!el.dataset.src && el.src.includes("n1a.zmengqi")) {
    //     el.src = el.src.replace("n1a.zmengqi", "na.dingdangmh");
    //   }
    // });
})();
