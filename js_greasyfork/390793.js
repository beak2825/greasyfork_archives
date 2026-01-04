// ==UserScript==
// @name         動畫瘋自動點擊同意
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每次開啟動畫時自動點擊分級畫面的"同意"
// @author       axzxc1236
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012#md5=fd6775a03daee426e576e1394ab2a3b4,sha256=e582c20607e3e723a2e2437ca0546570b1531bf302d4a89cbd99964ccd73e995
// @downloadURL https://update.greasyfork.org/scripts/390793/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%90%8C%E6%84%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/390793/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%90%8C%E6%84%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    waitForKeyElements(".choose-btn-agree", btn => {
        btn.click();
        console.log("<info> clicked agree button.");
    }, true);
})();