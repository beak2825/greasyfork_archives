// ==UserScript==
// @name     Telecommunications prohibit hibernation
// @version  1.2
// @include           *://134.176.172.29*
// @description       Disable hibernation
// @description:zh     dormancy
// @grant    none
// @namespace https://greasyfork.org/users/931105
// @downloadURL https://update.greasyfork.org/scripts/447332/Telecommunications%20prohibit%20hibernation.user.js
// @updateURL https://update.greasyfork.org/scripts/447332/Telecommunications%20prohibit%20hibernation.meta.js
// ==/UserScript==




function formatDateTimeForHMSS(obj) {
    if (obj == null) {
        return null
    }
    let date = new Date(obj);
    let y = 1900 + date.getYear();
    let m = "0" + (date.getMonth() + 1);
    let d = "0" + date.getDate();
    let h = "0" + date.getHours();
    let mm = "0" + date.getMinutes();
    let s = date.getSeconds();
    if (s.toString().length < 2) {
        s = "0" + s;
    }
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length) + " " + h.substring(h.length - 2, h.length) + ":" + mm.substring(mm.length - 2, mm.length) + ":" + s;
};




function aa(){
    console.log(unsafeWindow);
    unsafeWindow['userlist'] = 'urer746QYX89112746QYX1637746QYX1730746QYX526666';
  	if(unsafeWindow['userlist'].indexOf(unsafeWindow.portal.appGlobal.attributes.userCode)>0){
        var xx = formatDateTimeForHMSS(new Date().getTime());
        console.log(xx);
        unsafeWindow.portal.appGlobal.attributes.lastOpDate = xx;
        console.log('true');
       }
};



window.onload=function (){
  setInterval(aa,60000)
}