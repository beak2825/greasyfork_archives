// ==UserScript==
// @name         OPS Year in Front
// @namespace    https://orpheus.network/
// @version      0.3
// @description  Put the release year in front where it belongs
// @author       b1100101
// @include      http*://orpheus.network/artist.php*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437285/OPS%20Year%20in%20Front.user.js
// @updateURL https://update.greasyfork.org/scripts/437285/OPS%20Year%20in%20Front.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var regex = /<\/span>.*(\[[0-9][0-9][0-9][0-9]\])$/m;
    var regex = /torrentgroupid="[0-9]*">.*<\/a>.*(\[[0-9][0-9][0-9][0-9]\])$/m;
    var td_info = document.getElementsByClassName('group_info clear');//.innerHTML;

    for (var i = 0; i < td_info.length; i++) {
        var found = td_info[i].innerHTML.match(regex);
        td_info[i].innerHTML = td_info[i].innerHTML.replace(found[1], "");
        td_info[i].innerHTML = td_info[i].innerHTML.replace("<a href=\"artist.php", found[1] + " - <a href=\"artist.php");
        td_info[i].innerHTML = td_info[i].innerHTML.replace("Various", found[1] + " - Various");
    }

})();