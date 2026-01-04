// ==UserScript==
// @name         delete all zhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除所有的知乎回答！！！
// @author       You
// @match        https://www.zhihu.com/creator/manage/creation/answer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443471/delete%20all%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/443471/delete%20all%20zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setTimeout(()=>{
        console.log('length:',$('button>span').length);
        $('.Card .Popover>button>span').click();
        setTimeout(()=>{
            $("button:contains('删除')").click();
            setTimeout(()=>{
                $("button:contains('确认')").click();
                setTimeout(()=>{
                    location.reload();
                },500);
            },1000);
        },1000);
    },2000);
})();