// ==UserScript==
// @name        Add to List Button in Catalog Section - RateYourMusic
// @namespace   iN008
// @match       https://rateyourmusic.com/release/*
// @license     MIT
// @version     1.0
// @author      ~iN008
// @description Adds the add to list button to the rating/cataloguing section of the page.
// @downloadURL https://update.greasyfork.org/scripts/435646/Add%20to%20List%20Button%20in%20Catalog%20Section%20-%20RateYourMusic.user.js
// @updateURL https://update.greasyfork.org/scripts/435646/Add%20to%20List%20Button%20in%20Catalog%20Section%20-%20RateYourMusic.meta.js
// ==/UserScript==
$("#addtolist").clone().addClass("CatalogList").appendTo("div.release_my_catalog"),
$("div.CatalogList").children("#add_to_list_btn").css({"margin-top":"0em", "font-size":".8em", "padding":".3em .8em", "line-height":"2"}),
$("div.CatalogList").children("#add_to_list_lists").css({"line-height":"1em", "top":"2.2em"})