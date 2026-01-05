// ==UserScript==
// @name        根据关键词隐藏部分帖子
// @namespace   rusyue
// @description 根据帖子标题中关键词隐藏部分帖子（占吧闪狗爆炸飞妈=，=）
// @include     http://tieba.baidu.com/*
// @include     https://tieba.baidu.com/*
// @version     1.0
// @author      rusyue
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28500/%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/28500/%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==


(function() {

    var keywords = [
        '诗酒',
        '戒色',
        '忏悔',
        '网络卖药',
        '成长记录',
        '戒', '淫',
    ];

    var re = new RegExp(keywords.join('|'), 'gi');

    var threadList = document.querySelectorAll('li.j_thread_list');

    !function() {
        if (!threadList.length) {
            // console.log('正在获取帖子列表: ', threadList);
            threadList = document.querySelectorAll('li.j_thread_list');
            window.setTimeout(arguments.callee, 300);
        } else {
            complete();
        }
    }();


    function complete() {
        // console.log('获取成功: ', threadList, threadList.length);
        threadList.forEach((item, idx) => {
            var title = item.querySelector('a.j_th_tit').getAttribute('title');
            if (re.test(title)){
                item.setAttribute('style', 'display: none !important;')
                console.log('帖子: "%s" ,已屏蔽', title);
            }
        });
    }

})();





