// ==UserScript==
// @name         xqw帖子列表关键词屏蔽
// @description  根据关键词屏蔽帖子列表中不想看到的主贴。
// @version      0.1
// @include      *://xqwh.org/viewforum.php*
// @namespace https://greasyfork.org/users/563202
// @downloadURL https://update.greasyfork.org/scripts/410009/xqw%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/410009/xqw%E5%B8%96%E5%AD%90%E5%88%97%E8%A1%A8%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keywords = ['',''];//关键词写在英文单引号内，多个关键词用英文逗号隔开
    var topics = document.getElementsByClassName('row2 topictitle');
    for (var i = 0; i < topics.length; i++) {
            var a = topics[i];
            var title = a.innerText;
         //   console.log(i+'/'+topics.length+','+title)
            for (var j = 0; j < keywords.length; j++) {
                var keyword = keywords[j];

                if(title.indexOf(keyword) >= 0){
                    console.log('Removed: ' +title);
                  i--;

                    a.parentElement.remove();
                }
            }
        }
})();