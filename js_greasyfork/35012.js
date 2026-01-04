// ==UserScript==
// @name            Paperclips click
// @version         1.1
// @description     Autoclicker for http://www.decisionproblem.com/paperclips/
// @author          Mc Peace
// @match           /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?\w{3}.decisionproblem.com\/paperclips\/([a-z0-9]+)*\.([a-z0-9]+)*
// @namespace https://greasyfork.org/users/119029
// @downloadURL https://update.greasyfork.org/scripts/35012/Paperclips%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/35012/Paperclips%20click.meta.js
// ==/UserScript==

function clicker() {
    var expList = document.getElementById("btnMakePaperclip");
    if (expList !== null) {
        expList.click();
    }
}
document.addEventListener("load", clicker);
setInterval(clicker, 5);     //Click per 5ms = 0.005s