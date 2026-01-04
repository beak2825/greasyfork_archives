// ==UserScript==
// @id           ElectComment@iamCristYe
// @name         ElectComment
// @namespace    https://iamCristYe.GitHub.io/MP-tools/ElectComment
// @version      11.0
// @description  Automatically elect new comments.
// @author       Crist
// @include      https://mp.weixin.qq.com/misc/appmsgcomment?action=list_latest_comment*
// @match        https://mp.weixin.qq.com/misc/appmsgcomment?action=list_latest_comment*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32035/ElectComment.user.js
// @updateURL https://update.greasyfork.org/scripts/32035/ElectComment.meta.js
// ==/UserScript==





(function () {
    'use strict';

    function Elect() {
        if (document.getElementsByClassName('jsNewElect').length) {                                         //comments to be elected exist
            document.getElementsByClassName('jsNewElect')[0].click();
            setTimeout(Elect, 2000);
        } else {                                                                                            //no comments to be elected
            setInterval(() => {
                if (document.getElementById("js_div_newnum").style.display == "block") location.reload();   //new comment appears
            }, 1000);
            setTimeout(() => {
                location.reload();                                                                          //in case of no activity log out
            }, 800000);
        }
    }

    setTimeout(Elect, 5000);
})();
