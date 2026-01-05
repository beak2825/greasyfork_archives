// ==UserScript==
// @name shutupflambo
// @namespace fasttechforumquiet
// @description hides every posts of flambo on fasttech forums
// @include https://www.fasttech.com/forums/*
// @version 1.03
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/13617/shutupflambo.user.js
// @updateURL https://update.greasyfork.org/scripts/13617/shutupflambo.meta.js
// ==/UserScript==

var ignorelist = new Array('flambo', 'ShelaghStone');

function ignore() {
window.setTimeout(function () {
for (z in ignorelist) {
$('.Nickname:contains(\'' + ignorelist[z] + '\')').each(function (i) {
$(this).parent().parent().remove();
}
)
}
}, 10);
}

window.onload = ignore;