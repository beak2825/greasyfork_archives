// ==UserScript==
// @name         115增加链接任务按钮
// @namespace    http://tampermonkey.net/
// @version      20231005
// @description  让世界更加美好
// @author       塞北的雪
// @match        https://115.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @match        https://115.com/*
// @exclude      https://115.com/s/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476749/115%E5%A2%9E%E5%8A%A0%E9%93%BE%E6%8E%A5%E4%BB%BB%E5%8A%A1%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/476749/115%E5%A2%9E%E5%8A%A0%E9%93%BE%E6%8E%A5%E4%BB%BB%E5%8A%A1%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    var offlineTaskButton = `
    <div class="my115Dropdown" id="my115Dropdown">
    <div class="my115Dropbtn">
    <a href="javascript:;"  class="button btn-upload" menu="offline_task"><i class="icon-operate ifo-linktask"></i><span>新建链接任务</span></a>
    </div>
  </div>
    `;

    if (!$("#my115Dropdown").length > 0) {
        $(".left-tvf").eq(0).append(offlineTaskButton);
    }

    //重命名自定义增强
    //https://greasyfork.org/scripts/447226
    let _indexOf = String.prototype.indexOf;
    Object.defineProperty(String.prototype, 'indexOf', {
        configurable: true,
        writable: true,
        value: function(search, start) {
            try {
                let me = String.prototype.indexOf;
                // caller is forbidden in strict mode, so try and catch exception simply.
                if (me.caller !== me) {
                    if (me.caller.toString().indexOf('cache.suffix') != -1) {
                        return -1;
                    }
                }
            } catch (e) {}
            return _indexOf.apply(this, [search, start]);
        },
    });
})();