// ==UserScript==
// @name         Neopets: Blue Evil Fuzzle AP
// @namespace    http://clraik.com/forum/showthread.php?62612
// @version      0.1
// @description  Plays with the Blue Evil Fuzzle until you get the avatar.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/iteminfo.phtml?obj_id=*
// @match        http://www.neopets.com/useobject.phtml
// @grant        none
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34734/Neopets%3A%20Blue%20Evil%20Fuzzle%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/34734/Neopets%3A%20Blue%20Evil%20Fuzzle%20AP.meta.js
// ==/UserScript==

var itemID = 0000000000; // click on the item and copy the number at the end of the URL
var wait = Math.floor(Math.random() * 2901) + 100;

if (document.URL.indexOf("/iteminfo.phtml?obj_id=" + itemID) != -1) {
    $("select[name=action] option:contains(Play)").prop("selected", "selected");
    setTimeout(function() {
        $("[value='Submit']").click();
    }, wait);
}
if (document.URL.indexOf("/useobject.phtml") != -1) {
    if (document.body.innerHTML.indexOf('Something Has Happened!') !== -1) {
        window.alert("Avatar received!");
    } else {
        setTimeout(function() {
            window.location.href = "/iteminfo.phtml?obj_id=" + itemID;
        }, wait);
    }
}