// ==UserScript==
// @name         巴哈姆特之舊版自動開圖
// @description  在朋友多次的拜託之下，誕生了這支重現舊版開圖的腳本。
// @namespace    nathan60107
// @version      1.0
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://forum.gamer.com.tw/C*
// @downloadURL https://update.greasyfork.org/scripts/388458/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E8%88%8A%E7%89%88%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388458/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E8%88%8A%E7%89%88%E8%87%AA%E5%8B%95%E9%96%8B%E5%9C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //若是載入網頁自動開圖的狀態則變更為非自動開圖
    if(Cookies.get("ckForumShrinkMedia")!="yes"){
        Cookies.set("ckForumShrinkMedia", "yes", {
            expires: 365,
            domain: "gamer.com.tw"
        })
        window.location.reload()
    }

    //將按鈕改為手動開圖按鈕
    var newFunc = `function() {
                jQuery(".loadpic").click()
            }`;
    Forum.C.toggleDisplayImage = new Function("return "+newFunc)();

})();