// ==UserScript==
// @name         dblp-bibtex
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  add bibtex info on PapersWithCode
// @author       You
// @match        https://paperswithcode.com/paper/*
// @icon         https://paperswithcode.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @connect      dblp.uni-trier.de
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/444617/dblp-bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/444617/dblp-bibtex.meta.js
// ==/UserScript==

(
    function () {
        'use strict';
        $(document).ready(function () {
            let cleanString = function (str) {
                // remove all non-alphanumeric characters except space and hyphen
                return str.replace(/[^a-zA-Z0-9 -]/g, "").replace(/\s+/g, " ").trim();
            }

            let getBibtexByTitle = function (query, format = 1) {
                // get bibtex by title
                // @param query: title of the paper
                // @param format: 0 condensed, 1 standard, 2 with crossref
                query = encodeURIComponent(cleanString(query));
                var request_url = `https://dblp.uni-trier.de/search/publ/bibtex${format}?q=${query}`;
                console.log(request_url);
                var bibitem = $('a.badge.badge-light:last').clone();
                bibitem.attr("href", request_url);
                bibitem.attr("target", "_blank");
                bibitem.attr("onclick", "");
                bibitem.children("span:last")[0].innerHTML = "BibTeX";
                $('a.badge.badge-light:last').after(bibitem);
            };
            let getGithubUrl = function (query, format = 0) {
                var implitem = $('.paper-impl-cell:first').clone();
                // var codeitem = $('a.code-table-link:first').clone();
                // var staritem = $('span[data-name=star]:first').clone();
                var codeitem = implitem.children()[0];
                console.log(codeitem);
                var request_url = codeitem.href.replace("github.com", "hub.fastgit.xyz");
                console.log(request_url);
                implitem.children()[0].href = request_url;
                // codeitem.attr("href", request_url);
                // $('a.code-table-link:first').after(codeitem);
                // $('span[data-name=star]:first').after(staritem);
                $('.paper-impl-cell:first').after(implitem);
            };
            var title = $("h1").text().trim();
            console.log(title);
            getBibtexByTitle(title);
            getGithubUrl(title);
        })
    })();