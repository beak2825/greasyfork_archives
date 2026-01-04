// ==UserScript==
// @name            EksiE
// @description:tr  eksisozluk.com için uygulamalar
// @description:az  ekisozluk.com üçün müraciətlər
// @description:en  Applications for eksisozluk.com
// @version         0.1
// @namespace       https://gist.github.com/metinsanli
// @homepageURL     https://greasyfork.org/scripts/eksie
// @author          metinsanli
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABuCAYAAAC9f+Q3AAACnUlEQVR4Xu3dvUubURxH8asERUWq7oKT4BCki0MXQejQQRAsRczoJg5dOnR26dBRkCJSWoqDCiL4FzgUOipFcHNw9Q2kvhBofynJUDBL+xy55TkBcTvJ/TxfYkICdqSUfsaPt4IFOhqw218XCs6WO7fz+SAJC2xAWAC1kRQWgt39cuhTAWG7srwvrLCEANR0scJCAlDWxQoLCUBZFyssJABlXaywkACUdbHCQgJQ1sUKCwlAWRcrLCQAZV1sGWGfDPak52Mr0NH5bLaf0jZhp4Ngj2co/h6ELd70dzFb2L7+rvSiuvo2HuM76OxoVliIV1hhIQEom/ti38S530NnR7PZwnb3VNL00w8bcfoaKgDFhRUWEoCyLrZssJVKZ5qZWDuMc49DZ0ez2S5WWOi6CyvsgwK5PxV8j0ddha4dms0WtnHql8/WT+PXMCoAxYUVFhKAsi62pLA/4tx90NnRbO6LvY7T96MCUDxr2Nfz29Cxi8menly1DWUNW8zxH78SLxPz/ZT28TmKu0dhi7P8oySssJAAlHWxEOzc5Ef/eBG2whKq0RRWWEgAyrpYYSEBKOtihYUEoOzSqy1fxxK2whKq0RRWWEgAyrpYYSEBKOtiywp7d1tPtalPR3H+kTYGvZDNP2ez/pS2Cdt4jP/dTVjokgkrLCQAZV2ssJAAlHWxwkICUNbFCgsJQFkXKywkAGVdrLCQAJR1scJCAlA268Xe39XT4uwmdHQue3l+4xc2CF6/Kk+oRlNYYSEBKNta7Fn8w98h6D5KmW3BXgTsQCkFoEMLKywkAGVdrLCQAJR1scJCAlDWxQoLCUDZ1mKP4w3CKHQfpcwKC112YYWFBKCsixUWEoCyLlZYSADKulgY9lv0271B8JOFv8T/BWvcF8rG/uxMAAAAAElFTkSuQmCC
// @match						*://eksisozluk.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/456215/EksiE.user.js
// @updateURL https://update.greasyfork.org/scripts/456215/EksiE.meta.js
// ==/UserScript==

var expdate = new Date();
document.cookie = "notheme=1; expires=" + expdate.setDate(expdate.getDate() + 30) + "; path=/"