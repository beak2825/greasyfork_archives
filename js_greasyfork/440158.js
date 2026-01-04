// ==UserScript==
// @name         Top comments in the bottom of osnova platforms' articles.
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  osnova, why did you do that? :(
// @author       curoviyxru
// @match        https://dtf.ru/*-*
// @match        https://tjournal.ru/*-*
// @match        https://vc.ru/*-*
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/440158/Top%20comments%20in%20the%20bottom%20of%20osnova%20platforms%27%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/440158/Top%20comments%20in%20the%20bottom%20of%20osnova%20platforms%27%20articles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function($){
        console.log("Fetching top comments...");
        $.get("https://api." + window.location.hostname + "/v1.9/entry/" + $(".l-entry").attr("data-content-id") + "/widgets", function (data) {
            //console.log(data);

            var color = "blue";
            switch (window.location.hostname) {
                case "dtf.ru":
                    color = "blue";
                    break;
                case "vc.ru":
                    color = "pink";
                    break;
                case "tjournal.ru":
                    color = "yellow";
                    break;
            }

            $(".comments").parent().after(
                "<div class=\"l-island-round lm-pv-15 lm-mt-20 l-mt-28\"><div class=\"widget_wrapper widget_wrapper--type-" + color + " l-pt-20 l-island-round\" data-gtm=\"Feed — Best Comments Widget — Clicked\">"
                + "<div class=\"l-island-a\">"

                + "<div class=\"widget_wrapper__title l-fs-15 l-lh-18 l-iflex l-fa-center\">Лучшие комментарии</div>"

                + "<div class=\"widget_wrapper__content l-pt-15 l-pb-18\">"

                + "<div class=\"widget_comment widget_wrapper__item\">"
                + "<div class=\"widget_comment__head l-flex l-fa-center\">"
                + "<a href=\"https://" + window.location.hostname + "/u/" + data.result[1].items[0].author.id + "-" + data.result[1].items[0].author.name.toLowerCase() + "\" class=\"widget_comment__author l-flex l-fa-center t-link\">"
                + "<img class=\"andropov_image widget_comment__author__avatar andropov_image--bordered\" air-module=\"module.andropov\" data-andropov-type=\"image\" data-image-src=\"" + data.result[1].items[0].author.avatar_url + "\" data-image-name=\"\" style=\"background-color: transparent; --darkreader-inline-bgcolor:transparent;\" src=\"" + data.result[1].items[0].author.avatar_url + "-/scale_crop/64x64/-/format/webp/\" data-darkreader-inline-bgcolor=\"\">"
                + "<div class=\"widget_comment__author__name l-fs-15 l-fw-500 l-ml-10\">" + data.result[1].items[0].author.name + "</div>"
                + "</a>"
                + "<div class=\"widget_comment__label l-fs-15 l-ml-20 lm-hidden\">" + data.result[1].title + "</div>"
                + "<air module=\"module.comments_admin\"></air>"
                + "<div class=\"etc_control l-ml-20\" air-module=\"module.etc_controls\" data-permissions=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImhpZGVfdG9wX2NvbW1lbnQiOm51bGx9LCJpYXQiOjE2NDUwNDI0OTUsImV4cCI6MTY0NTEyODg5NX0.E9PkLS9P6gh8bNecrYMP6Zypx7bcM4LKh3xx6IBmktA\" data-url=\"/admin/comments/hide_top_comment_of_the_day/" + data.result[1].items[0].id + "\"><svg class=\"icon icon--ui_etc\" width=\"14\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><use xlink:href=\"#ui_etc\"></use></svg></div>   "
                + "<div class=\"widget_comment__likes l-ml-auto l-fs-16\">" + data.result[1].items[0].likes.count + "</div>"
                + "</div>"
                + "<a href=\"" + data.result[1].items[0].entry.url + "?comment=" + data.result[1].items[0].id + "\" class=\"widget_comment__content l-block l-pv-15\"><div class=\"widget_comment__content__text l-fs-15 l-lh-22\">" + data.result[1].items[0].text + "</div></a>"
                + "<a href=\"" + data.result[1].items[0].entry.url + "\" class=\"widget_comment__entry l-inline-block l-fs-13 l-lh-20 l-fw-500 t-link\">" + data.result[1].items[0].entry.title + "</a>"
                + "</div>"

                + "<div class=\"widget_comment widget_wrapper__item\">"
                + "<div class=\"widget_comment__head l-flex l-fa-center\">"
                + "<a href=\"https://" + window.location.hostname + "/u/" + data.result[2].items[0].author.id + "-" + data.result[2].items[0].author.name.toLowerCase() + "\" class=\"widget_comment__author l-flex l-fa-center t-link\">"
                + "<img class=\"andropov_image widget_comment__author__avatar andropov_image--bordered\" air-module=\"module.andropov\" data-andropov-type=\"image\" data-image-src=\"" + data.result[2].items[0].author.avatar_url + "\" data-image-name=\"\" style=\"background-color: transparent; --darkreader-inline-bgcolor:transparent;\" src=\"" + data.result[2].items[0].author.avatar_url + "-/scale_crop/64x64/-/format/webp/\" data-darkreader-inline-bgcolor=\"\">"
                + "<div class=\"widget_comment__author__name l-fs-15 l-fw-500 l-ml-10\">" + data.result[2].items[0].author.name + "</div>"
                + "</a>"
                + "<div class=\"widget_comment__label l-fs-15 l-ml-20 lm-hidden\">" + data.result[2].title + "</div>"
                + "<air module=\"module.comments_admin\"></air>"
                + "<div class=\"etc_control l-ml-20\" air-module=\"module.etc_controls\" data-permissions=\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImhpZGVfdG9wX2NvbW1lbnQiOm51bGx9LCJpYXQiOjE2NDUwNDI0OTUsImV4cCI6MTY0NTEyODg5NX0.E9PkLS9P6gh8bNecrYMP6Zypx7bcM4LKh3xx6IBmktA\" data-url=\"/admin/comments/hide_top_comment_of_the_day/" + data.result[2].items[0].id + "\"><svg class=\"icon icon--ui_etc\" width=\"14\" height=\"7\" xmlns=\"http://www.w3.org/2000/svg\"><use xlink:href=\"#ui_etc\"></use></svg></div>   "
                + "<div class=\"widget_comment__likes l-ml-auto l-fs-16\">" + data.result[2].items[0].likes.count + "</div>"
                + "</div>"
                + "<a href=\"" + data.result[2].items[0].entry.url + "?comment=" + data.result[2].items[0].id + "\" class=\"widget_comment__content l-block l-pv-15\"><div class=\"widget_comment__content__text l-fs-15 l-lh-22\">" + data.result[2].items[0].text + "</div></a>"
                + "<a href=\"" + data.result[2].items[0].entry.url + "\" class=\"widget_comment__entry l-inline-block l-fs-13 l-lh-20 l-fw-500 t-link\">" + data.result[2].items[0].entry.title + "</a>"
                + "</div>"

                + "</div>"

                + "</div>"
                + "</div></div>");
        });
    })(jQuery);
})();