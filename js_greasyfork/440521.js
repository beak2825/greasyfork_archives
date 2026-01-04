// ==UserScript==
// @name         George：网站 hifini.com 自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  网站 hifini.com 自动签到
// @author       George
// @match        *www.hifini.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440521/George%EF%BC%9A%E7%BD%91%E7%AB%99%20hifinicom%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/440521/George%EF%BC%9A%E7%BD%91%E7%AB%99%20hifinicom%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function()
 {
    function enterCourse()
    {
        console.log("自动签到");
        var dom = document.getElementById('sg_sign');
        if (!!dom)
        {
            console.log("找到签到按钮");
            var sign = document.getElementById('sign');
            if (!!sign)
            {
                var text = sign.innerText;
                console.log("文字："+text);
                if(text=="已签"){
                    console.log("已经签到");
                }else{
                    dom.click();
                }
            }
        }}

    enterCourse();
})();