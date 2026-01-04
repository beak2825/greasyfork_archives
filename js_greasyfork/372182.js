// ==UserScript==
// @name         Taiwan GazouBBS Menu Link Fix
// @namespace    http://hollen9.yabi.me/userstyle/tawian-gazoubbs-menu-link-fix
// @version      0.3
// @description  取消選單追蹤行為，同時也修復了連結導向。目前主要應用在Ｋ２
// @author       Hollen9
// @include      *://*komica2.net/bbsmenu*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372182/Taiwan%20GazouBBS%20Menu%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/372182/Taiwan%20GazouBBS%20Menu%20Link%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oBrokenLinks = document.querySelectorAll("a[onclick^=track]");
    const regex = /track.*boundLink.*; return false;/gm;
    oBrokenLinks.forEach(function(o)
    {
        let oAttrOnclick = o.getAttribute("onclick");
        oAttrOnclick = oAttrOnclick.replace(regex, '');
        o.setAttribute("onclick", oAttrOnclick);
    });
    return true;
})();