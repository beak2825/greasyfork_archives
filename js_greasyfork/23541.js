// ==UserScript==
// @name          SY_thread_content_copier
// @name:zh-CN SY_thread_content_copier
// @name:zh-TW SY_thread_content_copier
// @namespace    https://greasyfork.org/scripts/23541-sy-thread-content-copier
// @version      0.1.4
// @description  Copy thread text content from SY.
// @description:zh-CN  在随缘居（mtslash.org）帖子页面中，复制楼层内容。
// @description:zh-TW  在隨緣居（mtslash.org）帖子頁面中，複製樓層內容。
// @author       zephyrus_z
// @match        http://www.mtslash.org/thread*
// @match        http://www.mtslash.org/forum.php?mod=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23541/SY_thread_content_copier.user.js
// @updateURL https://update.greasyfork.org/scripts/23541/SY_thread_content_copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (i = 0; i < document.getElementsByClassName("pti").length; i++) {
        var e = document.getElementsByClassName("pti")[i];
        var threadLevelButton = e.previousElementSibling;
        var copyURLButton = threadLevelButton.firstElementChild;
        var copyButton = document.createElement('a');
        var pid = copyURLButton.id.replace('num', 'message_');
        copyButton.id = copyURLButton.id;
        //console.log(pid);
        copyButton.href = 'javascript:;';
        copyButton.innerHTML = "<em>复制本楼内容</em>";
        copyButton.addEventListener(
            "click",
            function(){setCopy($(this.id.replace('num', 'message_')).innerHTML.replace(/<br>/gi, '\r').replace(/<(?:.|\s)*?>/g, '').replace(/&nbsp;/g, ' '), '');},
            false
        );
        threadLevelButton.appendChild(copyButton);
    }
})();
