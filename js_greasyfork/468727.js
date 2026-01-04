// ==UserScript==
// @name         积分点击签到
// @namespace    autosdo
// @version      0.1
// @description  切换到一键登录，自动点击签到
// @author       You
// @match        https://login.u.sdo.com/sdo/Login/LoginFrameFC.php?pm=2&appId=6666&areaId=-1&returnURL=https%3A%2F%2Fqu.sdo.com%2Fpersonal-center%3FmerchantId%3D1%23pointsindex-1
// @match        https://qu.sdo.com/personal-center?merchantId=*
// @icon         https://icons.duckduckgo.com/ip2/sdo.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468727/%E7%A7%AF%E5%88%86%E7%82%B9%E5%87%BB%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/468727/%E7%A7%AF%E5%88%86%E7%82%B9%E5%87%BB%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const NUM = '手机号';
    const url = new URL(window.location.href);

    if ( url.search == ('?merchantId=1') ) {
        setTimeout(
            () => {
                document.querySelector(".action-dom").click();
            },500)
    }else{
        setTimeout(
            () => {
                document.querySelector('#isAgreementAccept').click()
                document.querySelector('#nav_btn_mobile').click()
                document.querySelector('#username').value = NUM
                document.querySelector('.btn_user_login_mobile').click()
            },1000)
    }
})();