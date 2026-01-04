// ==UserScript==
// @name         typecho评论自动填入
// @namespace    https://wumingboke.xyz
// @version      0.1
// @description  各类typecho自动填入名称
// @author       无名博客
// @match        *://*/*
// @icon         https://b12757766.beeoffer.cn/files/img/IMG_20220926_195041_034.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453089/typecho%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/453089/typecho%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    var ty_nick = "123" // 学生学号（请在单引号内填写）
    var ty_mail = "your mail" // 学生密码（请在单引号内填写）
    var ty_link = "your blog url"
    //各种主题自动填入

    //正常主题
    if(document.querySelector("#author") !== null)
 {
    document.querySelector('#author').value = ty_nick
    document.querySelector('#mail').value = ty_mail
    document.querySelector('#url').value = ty_link
 }
    if(document.querySelector("#wl-nick") !== null)
    {
    //傻逼主题
    document.querySelector('#wl-nick').value = ty_nick
    document.querySelector('#wl-mail').value = ty_mail
    document.querySelector('#wl-link').value = ty_link
    }
        if(document.querySelector("#comment-name") !== null)
    {
    //傻逼主题
    document.querySelector('#comment-name').value = ty_nick
    document.querySelector('#comment-mail').value = ty_mail
    document.querySelector('#comment-url').value = ty_link
    }
})();