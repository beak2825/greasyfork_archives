// ==UserScript==
// @name         Amazon スポンサープロダクト隠し
// @namespace    unkomoreta
// @version      0.8
// @description  Amazonの検索結果のスポンサープロダクトを非表示にする
// @author       nikukoppun
// @match        https://www.amazon.co.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387551/Amazon%20%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B5%E3%83%BC%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%88%E9%9A%A0%E3%81%97.user.js
// @updateURL https://update.greasyfork.org/scripts/387551/Amazon%20%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B5%E3%83%BC%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%88%E9%9A%A0%E3%81%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery.noConflict();

    // かきかえてね
    let associateId = "nikukoppun-22";

    (function($) {

        if (0 < $("span[data-component-type='s-search-results']").length) {
            let observer = new MutationObserver(function (MutationRecords, MutationObserver) {
                exec();
            });
            observer.observe($("span[data-component-type='s-search-results']").get(0), {
                childList: true,
                subtree: true,
            });
        }
        if (0 < $(".a-carousel-viewport .a-carousel").length) {
            let observer = new MutationObserver(function (MutationRecords, MutationObserver) {
                exec();
            });
            observer.observe($(".a-carousel-viewport .a-carousel").get(0), {
                attributes: true,
            });
        }

        exec();

        function exec() {
            if ($('span[aria-label="スポンサー広告にフィードバックを残す"]')) {
                $('span[aria-label="スポンサー広告にフィードバックを残す"]').closest('div[data-creative-type="MultiCardCreativeDesktop"]').hide();
                $('span[aria-label="スポンサー広告にフィードバックを残す"]').closest('div[data-cel-widget="MultiBrandCreativeDesktopCombined"]').hide();
            }

            if (0 < $('#search').length) {
                $("#search .s-info-icon").each(function(i, elem) {
                    if (isSponsored(elem)) {
                        $(elem).closest("div[data-asin]").hide();
                    }
                });
                $("#search .s-sponsored-label-info-icon").each(function(i, elem) {
                    $(elem).closest("div[data-asin]").hide();
                });
            } else if (0 < $("#mainResults").length) {
                $("#mainResults .s-sponsored-info-icon").each(function(i, elem) {
                    $(elem).closest("li[data-asin]").hide();
                });
            }
            $("div[data-asin],li[data-asin],div[data-p13n-asin-metadata],.octopus-pc-item").each(function(i, elem) {
                replaceHref(elem);
            });
        }

        function isSponsored(elem) {
            let targetText = null;
            if ($(elem).closest(".a-row") != null && $(elem).closest(".a-row").find(".a-size-base.a-color-secondary") != null) {
                targetText = $(elem).closest(".a-row").find(".a-size-base.a-color-secondary").text();
            } else if ($(elem).closest(".a-section") != null && $(elem).closest(".a-section").find(".a-size-base.a-color-secondary") != null) {
                targetText = $(elem).closest(".a-section").find(".a-size-base.a-color-secondary").text();
            }
            return (targetText != null && -1 < targetText.indexOf("スポンサー プロダクト"));
        }

        function replaceHref(elem, asin) {
            $(elem).find("a").each(function(j, elem2) {
                let regex = /(\/dp\/[^/?]+(\?|\/))/gim;
                let elem2Href = $(elem2).attr("href");
                if (-1 < elem2Href.indexOf(associateId)) {
                    return true;
                }
                let mat;
                while (mat = regex.exec(elem2Href)) {
                    let newHref = `${mat[1]}?tag=${associateId}`;
                    if (-1 < elem2Href.indexOf("#customerReviews")) {
                        newHref += "#customerReviews";
                    }
                    $(elem2).attr("href", newHref);
                    console.log(newHref);
                    break;
                }
            });
        }

    })(jQuery);

})();