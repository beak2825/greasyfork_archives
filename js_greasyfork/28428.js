// ==UserScript==
// @name SocialBar
// @description:ru Скрипт 
// @namespace excelworld.ru
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant GM_addStyle
// @include *.excelworld.ru/*
// @description Скрипт
// @run-at document-start
// @version 0.0.1.20170325190930
// @downloadURL https://update.greasyfork.org/scripts/28428/SocialBar.user.js
// @updateURL https://update.greasyfork.org/scripts/28428/SocialBar.meta.js
// ==/UserScript==
/*jshint multistr: true */
window.addEventListener(
    "load",
    function(){
        window.$('.uscl-slide-close').click();
        GM_addStyle(
            ".uscl-slide-open{\
                left:auto!important;\
                right:2px;\
                top:2px!important;\
            }\
            .uscl-item.uscl-slide{\
                opacity:1!important;\
                visibility:visible!important;\
            }\
            .uscl-item.uscl-slide .ico_uscl:before {\
                color:#498bfa!important;\
            }"
        );
    },
    false
);