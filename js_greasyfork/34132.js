// ==UserScript==
// @name         kill anthena
// @namespace    https://greasyfork.org/ja/users/2332-deadman-from-sora
// @version      0.1
// @description  kill anthena all.
// @author       You
// @match        *://*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34132/kill%20anthena.user.js
// @updateURL https://update.greasyfork.org/scripts/34132/kill%20anthena.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let host_name = function (link) {

        const host_reg = [
            /^https?:\/\/(newmofu)\.doorblog\.jp\//,
            /^https?:\/\/(blog\-news)\.doorblog.jp\//,
            /^https?:\/\/(newpuru)\.doorblog\.jp\//
        ];
        let match = host_reg.find(function (element, index, array) {
            return (element.test(link));
        });
        return match != null ? match.exec(link)[1] : null;
    };

    let requestLinkPage = function (url) {

        const yql = "https://query.yahooapis.com/v1/public/yql";
        let query = "select * from htmlstring where url='" + encodeURI(url) + "' and xpath='//body'";

        return $.ajax({
            type: "get",
            dataType: "xml",
            url: yql,
            timeout: 10000,
            data: {
                q: query,
                env: "store://datatables.org/alltableswithkeys",
                diagnostics: true,
                callback: ""
            }
        });
    };

    let htmlUnescape = function (html) {

        return html.replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, " ");
    };

    let resultToJqueryObj = function (result_data) {

        return $(htmlUnescape(result_data.getElementsByTagName("results")[0].innerHTML));
    };

    let transLink = function (event) {
        let link = event.target;

        switch (host_name(link)) {
            case "newmofu":
            case "newpuru":
                let rev_url = "";
                let url_str = decodeURIComponent(link.href.match(/\?url=(.+ptth)(&noadult=1)?$/)[1]);
                for (let i = 0; i < url_str.length; i++) {
                    rev_url += url_str[url_str.length - i - 1];
                }
                link.href = rev_url;
                break;

            case "blog-news":
                let link_title_list = "", true_link_title = "";
                let reg_t = new RegExp(decodeURIComponent(link.href.match(/t=(.*)/)[1]));
                requestLinkPage(link.href)
                    .done(function (data, textStatus, jqXHR) {
                        link_title_list = Array.from(resultToJqueryObj(data).find("span.a-title"));
                        true_link_title = link_title_list.find(function (element, index, array) {
                            return reg_t.test(element.textContent);
                        });
                        if (true_link_title != null) {
                            link.href = true_link_title.parentNode.href;
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        console.log('fail', jqXHR.status);
                    });
                break;
        }
    };

    (function () {

        $("a").each(function (index, element) {
            element.addEventListener("mouseenter", transLink, false);
        });
        console.log("add event!");
    })();
})();