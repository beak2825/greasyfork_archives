// ==UserScript==
// @name         Banh bím VTV
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Như tít lần nữa :)
// @include      /^https?://vtv.vn/truyen-hinh-truc-tuyen\/?.*/
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/30235/Banh%20b%C3%ADm%20VTV.user.js
// @updateURL https://update.greasyfork.org/scripts/30235/Banh%20b%C3%ADm%20VTV.meta.js
// ==/UserScript==

$('head').append('<style>.live-video-content iframe{width:140%!important;height:140%!important}.live-video-right.fr,.scroll_list{float:none!important;}.live-video-right.fr{margin-top: 700px;}.live-video .scroll_list ul li,.scroll_list,#weekdayMenu{width:1158px!important}#weekdayMenu li{width:163px}.name_ct{width:900px!important}</style>');
