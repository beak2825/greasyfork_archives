// ==UserScript==
// @name         GoodBlox 2010-2013 Forum Style
// @namespace    http://goodblox.xyz/
// @version      1
// @description  replaces the current older forum style with the newer 2010 - 2013 style on goodblox
// @author       pizzaboxer
// @match        https://goodblox.xyz/Forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420455/GoodBlox%202010-2013%20Forum%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/420455/GoodBlox%202010-2013%20Forum%20Style.meta.js
// ==/UserScript==

(function() {
    $("[href='/resources/forum.css?v=1']").attr("href", "https://sitetest1.goodblox.xyz/Forum/skins/default/style/default.css");
})();