// ==UserScript==
// @name         EMS TRA CỨU bccp &?id=
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       P
// @include      http://bccp.vnpost.vn/*
// @exclude      http://bccp.vnpost.vn/BCCP.aspx?act=Trace&%3fid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375148/EMS%20TRA%20C%E1%BB%A8U%20bccp%20id%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/375148/EMS%20TRA%20C%E1%BB%A8U%20bccp%20id%3D.meta.js
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
/*list.getElementsByTagName("input")[0].value = id;
list.getElementsByTagName("input")[1].value = "";*/
document.getElementById('MainContent_ctl00_txtID').value = id;
document.getElementById("MainContent_ctl00_btnView").click();
}

