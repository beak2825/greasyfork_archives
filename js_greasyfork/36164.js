// ==UserScript==
// @name     Farm thing
// @description Farms stuff
// @version 2.1.7
// @include https://*/game.php?village=*&screen=am_farm*

// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/36164/Farm%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/36164/Farm%20thing.meta.js
// ==/UserScript==

var progressElm = $("<div>da</div>");
$("#am_widget_Farm").before(progressElm);
var total = $(".farm_icon_c").length;
var farms = $(".farm_icon_c");
window.counter = 0;

function fasend(a) {
    "use strict";
    if (a == total) return;
    $(farms[a]).trigger("click");
    progressElm.html(a + " / " + total);
    setTimeout(function() {
        fasend(a+1);
    }, 150);
    window.counter++;
    if (window.counter == total) {
        window.location.reload();
    }
}
fasend(0);