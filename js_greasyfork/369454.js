// ==UserScript==
// @name                UserscloudDirectDownload
// @description         Auto click Usercloud download button.
// @description:zh-CN   自动点击 Usercloud 的下载按钮
// @author              ladit
// @version             1.0.1
// @namespace           https://greasyfork.org/zh-CN/scripts/369454
// @homepageURL         https://github.com/ladit/Userscripts
// @supportURL          https://github.com/ladit/Userscripts
// @grant               none
// @run-at              document-idle
// @match               https://userscloud.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/369454/UserscloudDirectDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/369454/UserscloudDirectDownload.meta.js
// ==/UserScript==


if (document.querySelector('#btn_download')) {
    document.querySelector('#btn_download').click();
} else {
    document.querySelector('a.btn.btn-success.btn-icon-stacked').click();
    setTimeout(window.close(), 10000);
}
