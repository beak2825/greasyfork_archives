// ==UserScript==
// @name        BlueCat Address Manager Dynamic Tab Title
// @namespace   *
// @description Dynamic HTML Tab Title in BlueCat Address Manager
// @include     */app*
// @version     6
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/38694/BlueCat%20Address%20Manager%20Dynamic%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/38694/BlueCat%20Address%20Manager%20Dynamic%20Tab%20Title.meta.js
// ==/UserScript==
if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: ConfigurationPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        var bamVersion = document.getElementById('versionText');
        var element1 = document.getElementById('pc');
        var element2 = document.getElementById('pageMenu-title');
        if (bamVersion !== null) {
            if (element1 !== null) {
                document.title = element1.innerHTML + " [" + subtab.innerHTML.trim() + "]" + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else if (element2 !== null) {
                var str = element2.getElementsByClassName('title-center')[0].innerHTML;
                document.title = str  + " [" + subtab.innerHTML.trim() + "]" + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else {
                document.title = "BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            }
        } else {
            //probably not a BAM
        }
    } else if (/ Page: GroupList /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        var bamVersion = document.getElementById('versionText');
        var element1 = document.getElementById('pc');
        var element2 = document.getElementById('pageMenu-title');
        if (bamVersion !== null) {
            if (element1 !== null) {
                document.title = element1.innerHTML + " [" + subtab.innerHTML.trim() + "]" + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else if (element2 !== null) {
                var str = element2.getElementsByClassName('title-center')[0].innerHTML;
                document.title = str  + " [" + subtab.innerHTML.trim() + "]" + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else {
                document.title = "BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            }
        } else {
            //probably not a BAM
        }
    } else {
        var bamVersion = document.getElementById('versionText');
        var element1 = document.getElementById('pc');
        var element2 = document.getElementById('pageMenu-title');
        if (bamVersion !== null) {
            if (element1 !== null) {
                document.title = element1.innerHTML + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else if (element2 !== null) {
                var str = element2.getElementsByClassName('title-center')[0].innerHTML;
                document.title = str + " - BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            } else {
                document.title = "BlueCat Address Manager (" + bamVersion.innerHTML + ")";
            }
        } else {
            //probably not a BAM
        }
    }
}