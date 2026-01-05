// ==UserScript==
// @name          BrokenStones :: WhatIMG in Main Menu
// @icon          https:/brokenstones.me/favicon.ico
// @description   Insert WhatIMG link in the main menu
// @author        techietrash
// @include       http*://*brokenstones.me/*
// @include       http*://*brokenstones.club/*
// @version       1.0.5
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js

// @namespace     https://greasyfork.org/en/users/68-techietrash
// @downloadURL https://update.greasyfork.org/scripts/15684/BrokenStones%20%3A%3A%20WhatIMG%20in%20Main%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/15684/BrokenStones%20%3A%3A%20WhatIMG%20in%20Main%20Menu.meta.js
// ==/UserScript==

// Add WhatIMG link
$("#nav_upload").after('<li id="nav_whatimg" class="brackets"><a href="https://whatimg.com" target="_blank">WhatIMG</a></li>');
