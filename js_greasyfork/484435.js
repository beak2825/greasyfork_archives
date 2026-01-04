// ==UserScript==
// @name         教學用電子書與相關工具免登入腳本
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  使用本腳本代表您同意免責聲明：請勿將本指令碼作為抄答案、侵權等惡意用途，使用本指令碼，請「自行承擔」所有後果與風險。本腳本改寫自https://gist.github.com/notlin4/a05d7db77cd5606a812f4b9900fef3ee
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484435/%E6%95%99%E5%AD%B8%E7%94%A8%E9%9B%BB%E5%AD%90%E6%9B%B8%E8%88%87%E7%9B%B8%E9%97%9C%E5%B7%A5%E5%85%B7%E5%85%8D%E7%99%BB%E5%85%A5%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484435/%E6%95%99%E5%AD%B8%E7%94%A8%E9%9B%BB%E5%AD%90%E6%9B%B8%E8%88%87%E7%9B%B8%E9%97%9C%E5%B7%A5%E5%85%B7%E5%85%8D%E7%99%BB%E5%85%A5%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 檢查是否已經執行過
    if (!localStorage.getItem('scriptExecuted')) {
        // 如果還沒執行過，執行腳本
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/gh/notlin4/without-auth_e-book@main/fast.js';
        document.body.appendChild(script);

        // 設定已經執行過的標記，並且將腳本的內容放入 localStorage
        localStorage.setItem('scriptExecuted', 'true');
        localStorage.setItem('customScript', script.src);
    } else {
        // 如果已經執行過，檢查上次的腳本是否一致，如果不一致再次執行
        var storedScript = localStorage.getItem('customScript');
        if (storedScript !== 'https://cdn.jsdelivr.net/gh/notlin4/without-auth_e-book@main/fast.js') {
            var newScript = document.createElement('script');
            newScript.src = storedScript;
            document.body.appendChild(newScript);
        } else {
            console.log('腳本已經執行過');
        }
    }
})();
