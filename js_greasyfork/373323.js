// ==UserScript==
// @name        BlueCat Address Manager Server Interface Direct Select
// @namespace   *
// @description Skip Server Interface Selection for Single Interface Servers in BlueCat Address Manager
// @include     */app*
// @version     1
// @grant       none
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/373323/BlueCat%20Address%20Manager%20Server%20Interface%20Direct%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/373323/BlueCat%20Address%20Manager%20Server%20Interface%20Direct%20Select.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: SelectServerInterface /.test(page)) {
        var outertable = document.getElementById("outerTable");
        if ((outertable != null)||(outertable !== undefined)) {
            var radios = outertable.getElementsByTagName("input");
            if (radios !== undefined) {
                if (radios.length == 1) {
                    radios[0].checked = true;
                    document.getElementById("addButton").click();
                } else if (radios.length>1) {
                    radios[0].checked = true;
                }
            }
        }
    }
}