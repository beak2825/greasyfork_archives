// ==UserScript==
// @name         Amazonの商品画面にサクラチェッカー用リンクを作成
// @namespace    unkomoreta
// @version      0.7
// @description  Amazonの商品画面（の購入ボタンの下あたり）にサクラチェッカー用リンクを作成し、サクラチェッカーサイト上のアソシエイトIDを書き換える
// @author       nikukoppun
// @match        https://www.amazon.co.jp/*
// @match        https://sakura-checker.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389526/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E9%9D%A2%E3%81%AB%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E7%94%A8%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E4%BD%9C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/389526/Amazon%E3%81%AE%E5%95%86%E5%93%81%E7%94%BB%E9%9D%A2%E3%81%AB%E3%82%B5%E3%82%AF%E3%83%A9%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%E7%94%A8%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E4%BD%9C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (-1 < location.href.indexOf("amazon.co.jp")) {
        jQuery.noConflict();
        (function($) {
            if (0 < $("#dp").length) {
                setCheckerButton();
                let observer = new MutationObserver(function (MutationRecords, MutationObserver) {
                    setCheckerButton();
                });
                observer.observe($("#desktop_buybox").get(0), {
                    childList: true
                });
                function setCheckerButton() {
                    let asin = "";
                    if (0 < $("#ASIN").length) {
                        asin = $("#ASIN").val();
                    }
                    let buttonHtml = "";
                    if (asin != "") {
                        let targetURL = "https://sakura-checker.jp/search/" + asin + "/";
                        buttonHtml = `
                            <div class='sakurachecker'>
                                <a href='${targetURL}' target='_blank'>サクラチェッカーで確認</a>
                            </div>`
                    } else {
                        buttonHtml = `
                            <div class='sakurachecker'>
                                <a href='#' onclick='return false;'>ASINが見つかりません</a>
                            </div>`;
                    }
                    var addCount = 0;
                    if (0 < $("#dealsAccordionRow").length && $("#dealsAccordionRow").is(":visible")) {
                        $("#dealsAccordionRow .a-button-stack:visible").closest(".a-section").after(getStyle(++addCount) + buttonHtml);
                    } else if (0 < $("#buyNow").length && $("#buyNow").is(":visible")) {
                        $("#buyNow").closest("#buyNow_feature_div").after(getStyle(++addCount) + buttonHtml);
                    } else if (0 < $("#add-to-cart-button").length) {
                        $("#add-to-cart-button").closest("div.a-button-stack").after(getStyle(++addCount) + buttonHtml);
                    } else if (0 < $("#outOfStock").length) {
                        $("#outOfStock .a-box-inner:first").prepend(getStyle(++addCount) + buttonHtml);
                    }
                    if (0 < $("#rcx-subscribe-submit-button-announce").length) {
                        $("#rcx-subscribe-submit-button-announce").closest("div.a-section").after(getStyle(++addCount) + buttonHtml);
                    }
                    if (addCount < 1) {
                        if (0 < $("#buybox-see-all-buying-choices").length) {
                            $("#buybox-see-all-buying-choices").closest(".a-button-stack").after(getStyle(++addCount) + buttonHtml);
                        }
                    }
                }
                function getStyle(addCount) {
                    if (1 < addCount) {
                        return "";
                    }
                    let styleHtml = `
                        <style>
                            .sakurachecker a {
                                display: inline-block;
                                border: 0;
                                height: 31px;
                                line-height: 31px;
                                margin-bottom: 2ex;
                                width: 100%;
                                text-align: center;
                                color: black;
                                border-radius: 19px;
                                background: gold;
                                box-shadow: 0 2px 5px 0 rgb(213 217 217 / 50%);
                            }
                            .sakurachecker a:hover {
                                text-decoration: none;
                                background: orange;
                            }
                        </style>`;
                    return styleHtml;
                }
            }
        })(jQuery);
    } else {
        // かきかえてね
        let associateId = "nigaurime02-22";
        replaceURLAll();
        let observer = new MutationObserver(function (MutationRecords, MutationObserver) {
            replaceURLAjax();
        });
        observer.observe($(".section.selectBlock").get(0), {
            childList: true,
            subtree: true,
        });
        function replaceURLAll() {
            $("a").each(function(){
                replaceURL($(this), "href");
            });
            $("iframe").each(function(){
                replaceURL($(this), "src");
            });
        }
        function replaceURLAjax() {
            $(".section.selectBlock a").each(function(){
                replaceURL($(this), "href");
            });
            $(".section.selectBlock iframe").each(function(){
                replaceURL($(this), "src");
            });
        }
        function replaceURL($target, attrName) {
            let url = $target.attr(attrName);
            if (typeof url === "string" && url.match(/(\/|.+\.)amazon(\.co\.|\.)jp\//)) {
                if (!$(location).attr("href").match(/\/astore\.amazon\./) && url.match(/\/astore\.amazon\./)) {
                    return true;
                };
                if (url.match(/[\w-]*-22/)) {
                    url = decodeURIComponent(url);
                    $target.attr(attrName, url.replace(/[\w-]*-22/, associateId));
                }
            }
        }
    }
})();