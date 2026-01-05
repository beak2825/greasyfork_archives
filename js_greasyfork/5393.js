// ==UserScript==
// @name         newLISP-Documentation-Search
// @namespace    https://github.com/kosh04/userscript
// @version      20141001
// @description  Provide keyword search interface in newLISP documentation
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @match        http://www.newlisp.org/*newlisp_manual.html
// @match        http://newlisp.nfshost.com/*newlisp_manual.html
// @require      http://code.jquery.com/jquery-2.1.1.js
// @require      http://code.jquery.com/ui/1.11.1/jquery-ui.js
// @resource jquery-ui.css http://code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css
// @author       KOBAYASHI Shigeru (kosh)
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/5393/newLISP-Documentation-Search.user.js
// @updateURL https://update.greasyfork.org/scripts/5393/newLISP-Documentation-Search.meta.js
// ==/UserScript==

GM_addStyle([
    GM_getResourceText("jquery-ui.css"),
    ".search-control {",
    "  position: fixed;",
    "  top: 10px;",
    "  right: 20px;",
    "}",
    ".ui-autocomplete {",
    "  max-height: 100px;",
    "  overflow-x: hidden;",
    "  overflow-y: auto;",
    "}",
].join("\n"));

$("body").prepend([
    "<div class='search-control ui-widget' role='search'>",
    " <label for='keyword' style='display:none;'>Search:</label>",
    " <input id='keyword' type='search' placeholder='Search keyword' autofocus>",
    "</div>",
].join("\n"));

function create_keywords() {
    var keywords = [],
        grep = function(obj, key, value) {
        return $.grep(obj, function(e) { return e[key] === value; });
    };

    $("a[href]").each(function(i, a) {
        var hash = a.hash.slice(1), // #hash -> hash
            href = a.href;
        if (hash.length == 0 || grep(keywords, "href", href).length > 0) {
            return;
        }
        keywords.push({ "label": hash, "href":  href });
    });

    return keywords;
}

$("#keyword").autocomplete({
    source: create_keywords(),
    select: function(event, ui) {
        window.location.replace(ui.item.href);
    }
});
