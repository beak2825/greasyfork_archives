// ==UserScript==
// @name         微信文章编辑器查看源码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在微信图文编辑器里面加入直接查看和编辑HTML的功能
// @author       Rika
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381151/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8%E6%9F%A5%E7%9C%8B%E6%BA%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/381151/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8%E6%9F%A5%E7%9C%8B%E6%BA%90%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fixed_frame = '<textarea style="position: fixed;left:0;bottom: 0;z-index: 1000;" id="code-area"></textarea>'
    $('body').append($(fixed_frame))
    fixed_frame = $('#code-area')
    let last_refresh = new Date(), last_edit = new Date()
    fixed_frame[0].oninput = () => {
        last_edit = new Date()
    }
    setInterval(() => {
        try {
            if (last_edit > last_refresh)
                UE.instants["ueditorInstant0"].setContent(fixed_frame.val())
            else
                fixed_frame.val(UE.instants["ueditorInstant0"].getContent())
            last_refresh = new Date()
        } catch (e) {
        }
    }, 500)
})();
