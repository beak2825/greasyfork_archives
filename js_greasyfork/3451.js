// ==UserScript==
// @name        التحويل إلى وضع المشاهدة الآمنة
// @namespace   التحويل إلى وضع المشاهدة الآمنة
// @description تحول المستخدم إختيارياً من إلى وضع المشاهدة الآمنة
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @include     http://m.youtube.com/*
// @include     https://m.youtube.com/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3451/%D8%A7%D9%84%D8%AA%D8%AD%D9%88%D9%8A%D9%84%20%D8%A5%D9%84%D9%89%20%D9%88%D8%B6%D8%B9%20%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D8%A9%20%D8%A7%D9%84%D8%A2%D9%85%D9%86%D8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/3451/%D8%A7%D9%84%D8%AA%D8%AD%D9%88%D9%8A%D9%84%20%D8%A5%D9%84%D9%89%20%D9%88%D8%B6%D8%B9%20%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D8%A9%20%D8%A7%D9%84%D8%A2%D9%85%D9%86%D8%A9.meta.js
// ==/UserScript==
var unsafeWindow = unsafeWindow || null,
    wnd = unsafeWindow || window,
    doc = wnd.document,
    result = /v=([^&]+)(?:&.*)*/i.exec(doc.location.search);

if(result)
{
    if(!wnd.sessionStorage.getItem("__cleanYTPrompted") && wnd.confirm("هل تريد التحول إلى وضع المشاهدة الآمنة؟"))
        wnd.location.href = "https://www.youtube.com/embed/" + result[1] + "?vq=tiny&rel=0";

    wnd.sessionStorage.setItem("__cleanYTPrompted", true);
}