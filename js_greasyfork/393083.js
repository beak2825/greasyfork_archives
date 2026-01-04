// ==UserScript==
// @name         CVF-add-ECCV2018
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  when open http://openaccess.thecvf.com/menu.py, add ECCV2018.
// @author       csxz
// @include      http://openaccess.thecvf.com/menu.py
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393083/CVF-add-ECCV2018.user.js
// @updateURL https://update.greasyfork.org/scripts/393083/CVF-add-ECCV2018.meta.js
// ==/UserScript==

function addECCV2018() {
    //find where to put the tag
    var loc = document.getElementsByTagName('dl')[0];
    var obj = document.createElement("dd");
    obj.innerHTML = 'ECCV2018, Munich Germany [<a href="ECCV2018.py">Main Conference</a>]  [<a href="/ECCV2018_workshops/menu.py">Workshops</a>]<br><br>';
    loc.insertBefore(obj, loc.childNodes[5]);
}

window.onload = addECCV2018;