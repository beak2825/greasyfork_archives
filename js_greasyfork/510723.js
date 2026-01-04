// ==UserScript==
// @name         Test_Automatic Check-in
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Test_自动签到_防止原作者删库
// @author       Jack Ou
// @match        *www.hifini.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510723/Test_Automatic%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/510723/Test_Automatic%20Check-in.meta.js
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