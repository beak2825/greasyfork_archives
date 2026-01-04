// ==UserScript==
// @name         Market Page Jump
// @namespace    https://coding.net/u/sffxzzp
// @version      0.2.2
// @description  A script that allows user to jump pages in market items.
// @author       sffxzzp
// @match        *://steamcommunity.com/market
// @match        *://steamcommunity.com/market/
// @match        *://steamcommunity.com/market/listings/*/*
// @match        *://steamcommunity.com/market/search*
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/33936/Market%20Page%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/33936/Market%20Page%20Jump.meta.js
// ==/UserScript==

(function() {
    var ifHistory = false;
    function loadHis () {
        var list = document.getElementById('tabContentsMyMarketHistory');
        if (list.childElementCount > 1) {
            ifHistory = true;
            main();
        }
        else {
            setTimeout(function(){loadHis();}, 200);
        }
    }
    function main () {
        var oriPageDiv;
        if (window.location.pathname.replace(/\//g, '') == "market") {
            var mHistory = document.getElementById('tabMyMarketHistory');
            mHistory.onclick = function () {
                setTimeout(function(){loadHis();}, 200);
            };
            if (ifHistory) {
                oriPageDiv = document.getElementById('tabContentsMyMarketHistory_ctn');
            }
            else {
                oriPageDiv = document.getElementById('tabContentsMyActiveMarketListings_ctn');
            }
        }
        else {
            oriPageDiv = document.getElementById('searchResults_ctn');
        }
        var oriPageCtl = oriPageDiv.children[1];
        var newPageCtl = document.createElement("div");
        newPageCtl.setAttribute("style", "float: right; padding-right: 20px");
        var newPageInput = document.createElement("input");
        newPageInput.setAttribute("class", "filter_search_box market_search_filter_search_box");
        newPageInput.setAttribute("style", "width: 30px;");
        newPageInput.setAttribute("type", "text");
        newPageInput.setAttribute("autocomplete", "off");
        newPageCtl.appendChild(newPageInput);
        var newPageGo = document.createElement("span");
        newPageGo.setAttribute("class", "pagebtn");
        if (window.location.pathname.replace(/\//g, '') == "market") {
            if (ifHistory) {
                newPageGo.onclick = function () {
                    g_oMyHistory.GoToPage( (newPageInput.value-1), true );
                };
            }
            else {
                newPageGo.onclick = function () {
                    g_oMyListings.GoToPage( (newPageInput.value-1), true );
                };
            }
        }
        else {
            newPageGo.onclick = function () {
                g_oSearchResults.GoToPage( (newPageInput.value-1), true );
            };
        }
        newPageGo.innerHTML = "Go!";
        newPageCtl.appendChild(newPageGo);
        oriPageDiv.insertBefore(newPageCtl, oriPageCtl);
        if (window.location.pathname.replace(/\//g, '') != "market") {
            var newPageSizeInput = document.createElement("input");
            newPageSizeInput.setAttribute("class", "filter_search_box market_search_filter_search_box");
            newPageSizeInput.setAttribute("style", "width: 30px;");
            newPageSizeInput.setAttribute("type", "text");
            newPageSizeInput.setAttribute("autocomplete", "off");
            var newPageSizeGo = document.createElement("span");
            newPageSizeGo.setAttribute("class", "pagebtn");
            newPageSizeGo.onclick = function () {
                g_oSearchResults.m_cPageSize = newPageSizeInput.value;
                g_oSearchResults.m_cMaxPages = Math.ceil(g_oSearchResults.m_cTotalCount / newPageSizeInput.value);
                g_oSearchResults.GoToPage(g_oSearchResults.m_iCurrentPage, true);
            };
            newPageSizeGo.innerHTML = "修改";
            var newPageSizeCtl = document.createElement("div");
            newPageSizeCtl.setAttribute("class", "market_pagesize_options");
            newPageSizeCtl.setAttribute("style", "margin: 0 0 2em 0; font-size: 12px;");
            newPageSizeCtl.innerHTML = "每页显示数：		";
            newPageSizeCtl.appendChild(newPageSizeInput);
            newPageSizeCtl.appendChild(newPageSizeGo);
            document.getElementById('searchResults_ctn').appendChild(newPageSizeCtl);
        }
    }
    main();
})();