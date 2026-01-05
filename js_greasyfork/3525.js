// ==UserScript==
// @name     GameFAQs Remove Sidebar
// @description Removes the sidebar on GameFAQs game message boards
// @include http://www.gamefaqs.com/boards/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant none
// @version 0.9
// @namespace https://greasyfork.org/users/3796
// @downloadURL https://update.greasyfork.org/scripts/3525/GameFAQs%20Remove%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/3525/GameFAQs%20Remove%20Sidebar.meta.js
// ==/UserScript==

$(document).find(".span4").hide();
$(document).find(".span8").attr('style', 'width: 100%');
