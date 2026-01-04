// ==UserScript==
// @name         天翼云Lasspass自动登入填写错误修复
// @namespace    https://greasyfork.org/users/158180
// @version      0.2
// @description  由于天翼云表单name值的问题导致Lastpass自动填写出现问题,启用本脚本修复
// @author       Shiyunjin
// @match        https://open.e.189.cn/api/logbox/oauth2/unifyAccountLogin.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370609/%E5%A4%A9%E7%BF%BC%E4%BA%91Lasspass%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5%E5%A1%AB%E5%86%99%E9%94%99%E8%AF%AF%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/370609/%E5%A4%A9%E7%BF%BC%E4%BA%91Lasspass%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5%E5%A1%AB%E5%86%99%E9%94%99%E8%AF%AF%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('input[name=password]').eq(2).remove();
    $('input[name=password]').eq(1).remove();
})();