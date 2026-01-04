// ==UserScript==
// @name         NGA ADB
// @namespace    https://greasyfork.org/zh-CN/scripts/39474-nga-adb
// @version      0.3.1.20180311
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA ADB 实际上并非阻止加载广告，而是发现加载广告后将其删除，也许应该叫 Cleaner ，但是ADC这个缩写容易让人误会
// @author       AgLandy
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @downloadURL https://update.greasyfork.org/scripts/39474/NGA%20ADB.user.js
// @updateURL https://update.greasyfork.org/scripts/39474/NGA%20ADB.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=13647420

(function(){

    function init(usl){

        if(/adpage_insert/.test(window.location.href))
            getJump();

        let adb = commonui.adBlocker = {
            f: function(){
                usl.$('img[src="http://gg.stargame.com/images/mark.png"]').parent().parent().remove();
            }
        };

        adb.f();

        if(!usl.userScriptData.adb)
            usl.userScriptData.adb = adb.f;

    }

    (function check(){
        try{
            if(commonui.userScriptLoader.$)
                init(commonui.userScriptLoader);
            else
                setTimeout(check, 5);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();

})();


