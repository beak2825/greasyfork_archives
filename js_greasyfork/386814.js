// ==UserScript==
// @namespace
// @name komica tag
// @description 哈兔大聯盟
// @author komica
// @version 1.2
// @grant none

// @include *://*.komica.org/00/*
// @exclude *://*.komica.org/00/src/*
// @exclude *://*.komica.org/00/thumb/*

// @namespace https://greasyfork.org/users/313263
// @downloadURL https://update.greasyfork.org/scripts/386814/komica%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/386814/komica%20tag.meta.js
// ==/UserScript==
$("#postform_tbl > tbody > tr:nth-child(3)").after('<tr><td class="Form_bg"><b>Trip</b></td><td><input maxlength="100" type="text" name="bvUFbdrIC" id="fname" size="28" value="哈#哈"></td></tr>');
$("#postform_tbl > tbody > tr:nth-child(4)").after('<tr><td class="Form_bg"><b>Tag</b></td><td><input type="text" name="category" size="28" value="哈,哈兔大聯盟"></td></tr>');
