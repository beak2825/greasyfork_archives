// ==UserScript==
// @name         EMS open tra cứu
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       P
// @include      http://blank.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375147/EMS%20open%20tra%20c%E1%BB%A9u.user.js
// @updateURL https://update.greasyfork.org/scripts/375147/EMS%20open%20tra%20c%E1%BB%A9u.meta.js
// ==/UserScript==

var hu,gy,link1,link2,link3,link4;
function querySt(ji) {

    hu = window.location.search.substring(1);
    gy = hu.split("?");

    for (var i=0;i<gy.length;i++) {
        var ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}
var id = querySt("id");
if(id !== null)
{
link1 = 'http://bccp.vnpost.vn/BCCP.aspx?act=Trace&?id='+id;
link2 = 'https://www.ems.com.vn/TrackTrace.aspx?id='+id;
link3 = 'https://dtkn.vnpost.vn/Main/TimKiem.aspx?id='+id;
link4 = 'https://ems.com.vn/portal/DesktopDefault.aspx?tabindex=10&tabid=167&lanid=VN?id='+id;
window.open(link1);
window.open(link2);
window.open(link3);
window.open(link4);
window.close();
}


