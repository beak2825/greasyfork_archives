// ==UserScript==
// @name         Yahoo Classic Redirect
// @namespace    Amaroq64
// @version      0.03
// @description  Redirect from the bad Yahoo basic to the good Yahoo basic.
// @author       Amaroq
// @match        https://mail.yahoo.com/d/settings/0
// @icon         https://s.yimg.com/nq/nr/img/favicon_cWDEiZtrqTWONMlAUlZWSgK3G1KMiDm8HXxTSbzD7S8_v1.ico
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/528389/Yahoo%20Classic%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/528389/Yahoo%20Classic%20Redirect.meta.js
// ==/UserScript==

var redirector = function()
{
    var autoclick = document.createEvent("MouseEvents");
    autoclick.initEvent("click", true, true);
    document.getElementsByClassName('S_n D_X A_6EqO c1AVi73_6FsP i_6Fd5 C_Z29WjXl t_l k_w W_6D6F P_ZmsLix r_P ac_C u_e69')[0].dispatchEvent(autoclick);
    clearInterval(interval);
}
var interval = setInterval(redirector, 500);