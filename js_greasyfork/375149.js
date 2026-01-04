// ==UserScript==
// @name         EMS TRA CỨU ems dktn ?id=
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       P
// @include      https://dtkn.vnpost.vn/Main/TimKiem.aspx*
// @grant GM.getValue
// @grant GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/375149/EMS%20TRA%20C%E1%BB%A8U%20ems%20dktn%20id%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/375149/EMS%20TRA%20C%E1%BB%A8U%20ems%20dktn%20id%3D.meta.js
// ==/UserScript==


var hu,gy,open;
(async function() {
	if(await GM.getValue('i')==1)
    {
        //alert(await GM.getValue('i'));
        await GM.setValue('i',0);
    }
    else
    {
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
        document.getElementById('SOBUUGUI').value = id;
        document.getElementById('Tim').click();
        await GM.setValue('i',1);
    }
    }
})();


