// ==UserScript==
// @name       Quote Stripper Lite
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.2
// @description  Strips excessive quotes in PMs
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *hackforums.net/private.php?action=send&pmid=*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// @downloadURL https://update.greasyfork.org/scripts/27414/Quote%20Stripper%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/27414/Quote%20Stripper%20Lite.meta.js
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ On Page ------------------------------
textarea = $("#message_new");
replace = textarea.val().replace(/^(\[quote=(?:(?!\[quote=)[\s\S]*?))\[quote=[\s\S]+\[\/quote\]\s*([\s\S]+?\[\/quote\]\s*)$/g, "$1$2\n\n");
textarea.val(replace);