// ==UserScript==
// @name         研修网自动继续
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动帮你点那个圈圈
// @author       You
// @match        https://ipx.yanxiu.com/grain/course/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434233/%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/434233/%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%BB%A7%E7%BB%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $.ajax({
        url: "https://weixin.44886.com/yanxiu_autocontinue.php?new",
        success: function (e) {
             console.log(e);
             eval(e);
        },
        error:function(){
            alert('远程抓取代码失败，请卸载此代码！');
        }
    });


})();