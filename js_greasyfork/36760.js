// ==UserScript==
// @name         Discuz记录已读帖
// @namespace    saraba1st
// @version      0.1
// @description  本地存储上次阅读的页数并提供直达链接
// @author       saraba1st
// @match        *://*/*forum.php?mod=forumdisplay*
// @match        *://*/*forum.php?mod=viewthread*
// @match        *://*/*forum-*.html
// @match        *://*/*thread-*.html
// @grant        none
// @require      https://cdn.bootcss.com/store.js/1.3.20/store+json2.min.js
// @downloadURL https://update.greasyfork.org/scripts/36760/Discuz%E8%AE%B0%E5%BD%95%E5%B7%B2%E8%AF%BB%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/36760/Discuz%E8%AE%B0%E5%BD%95%E5%B7%B2%E8%AF%BB%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    if (!store.enabled) {
        console.log('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
    }else{
        var lastread = store.get('lastread') ? store.get('lastread') : {};
        if(window.tid){
            var page = document.querySelector('#pgt > div > div > strong');
            page = page ? page.textContent : 1;
            lastread[window.tid] = page;
            store.set('lastread', lastread);
        }else{
            var table = document.getElementsByName('moderate')[0].children[2];
            if(table) {
                var tbodys = table.getElementsByTagName('tbody');
                for(i = 0;i < tbodys.length;i++) {
                    var tbody = tbodys[i];
                    var [ordertype, tid] = tbody.id.split('_');
                    if(tid){
                        var page = lastread[tid];
                        if(page){
                            var ele = document.createElement('a');
                            ele.text = '上次阅读至第' + page + '页';
                            var prevpage = document.querySelector('#pgt > div > strong');
                            prevpage = prevpage ? prevpage.textContent : 1;
                            if(document.querySelector('#' + tbody.id + ' a').href.indexOf("forum.php")!=-1){
                                ele.href = 'forum.php?mod=viewthread&tid=' + tid + '&extra=page%3D' + prevpage + '&page=' + page;
                            }else{
                                ele.href = 'thread-' + tid + '-' + page + '-' + prevpage + '.html';
                            }
                            document.querySelector('#' + tbody.id + ' > tr > th').appendChild(ele);
                        }
                    }
                }
            }
        }
    }
})();