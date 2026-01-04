// ==UserScript==
// @name         EMS TRA CỨU ems portal ?id=
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       P
// @include      https://ems.com.vn/portal/DesktopDefault.aspx?tabindex=10&tabid=167&lanid=VN*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375151/EMS%20TRA%20C%E1%BB%A8U%20ems%20portal%20id%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/375151/EMS%20TRA%20C%E1%BB%A8U%20ems%20portal%20id%3D.meta.js
// ==/UserScript==

var hu,gy;
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
document.getElementById('ctl03_Mae1_txt').value = id;
document.getElementById('ctl03_Search_Btn').click();
}

