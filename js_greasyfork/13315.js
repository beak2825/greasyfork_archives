// ==UserScript==
// @name         Clean DIA HTML
// @namespace    http://tbitai.github.io/clean-dia-html/
// @version      1.0
// @author       Tamás Bitai
// @description  Digitális Irodalmi Akadémia HTML tisztító (e-könyv készítéshez)
// @include      http://dia.jadox.pim.hu/jetspeed/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/13315/Clean%20DIA%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/13315/Clean%20DIA%20HTML.meta.js
// ==/UserScript==


$("span.oldaltores").remove();

// Remove anchor elements having name attribute
// (these are inside links, not needed in an ebook).
$("a[name]").remove();

// Remove Google Analytics code.
$("script:contains('google')").remove();
$("script:contains('pageTracker')").remove();
