// ==UserScript==
// @name        mail_ustc_select_stu_domain
// @description select mail.ustc.edu.cn domain automatically
// @namespace   tz2012
// @include     http://mail.ustc.edu.cn/*
// @include     https://mail.ustc.edu.cn/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22354/mail_ustc_select_stu_domain.user.js
// @updateURL https://update.greasyfork.org/scripts/22354/mail_ustc_select_stu_domain.meta.js
// ==/UserScript==

$(document).ready(function () {
    changeDomain('mail.ustc.edu.cn');
});
