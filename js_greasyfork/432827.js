// ==UserScript==
// @name         H3C记住账号密码
// @namespace    https://www.zhxlp.com
// @version      0.1
// @description  H3C记住登录账号和密码
// @author       Zhxlp
// @match        https://192.168.2.1:14000/web/frame/login.html
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/432827/H3C%E8%AE%B0%E4%BD%8F%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432827/H3C%E8%AE%B0%E4%BD%8F%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
 
/* global jQuery */

(async () => {
    let userName = await GM.getValue('user_name', 'admin');
    let password = await GM.getValue('password', '');
    jQuery('#user_name').val(userName);
    jQuery('#password').val(password);
    jQuery('#login_button').click(async () => {
        let userName = jQuery('#user_name').val();
        let password = jQuery('#password').val();
        await GM.setValue('user_name', userName || 'admin');
        await GM.setValue('password', password || '');
    })
})();
