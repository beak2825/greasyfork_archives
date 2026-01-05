// ==UserScript==
// @name         匿名版一键搜图
// @namespace    http://zhihaofans.com
// @version      0.4.3
// @description  一键搜图(让盗图狗不再得意，让你不再为祭品信息而烦恼)
// @author       zhihaofans
// @match        https://adnmb.com/t/*
// @match        https://adnmb.com/f/*
// @match        https://adnmb1.com/t/*
// @match        https://adnmb1.com/f/*
// @match        https://adnmb2.com/t/*
// @match        https://adnmb2.com/f/*
// @match        https://h.nimingban.com/f/*
// @match        https://h.nimingban.com/t/*
// @match        http://www.kukuku.cc/t/*
// @match        http://www.kukuku.cc/*
// @match        https://boards.4chan.org/*/*
// @match        http://boards.4chan.org/*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @note         开源地址:https://github.com/zhihaofans/JavaScript-awesome/blob/master/greasyfork/imageboard.imagesearch.user.js
// @note         Greasyfork地址:https://greasyfork.org/zh-CN/scripts/21115
// @note         0.4.3: 设置菜单移至Tampermonkey插件
// @downloadURL https://update.greasyfork.org/scripts/21115/%E5%8C%BF%E5%90%8D%E7%89%88%E4%B8%80%E9%94%AE%E6%90%9C%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/21115/%E5%8C%BF%E5%90%8D%E7%89%88%E4%B8%80%E9%94%AE%E6%90%9C%E5%9B%BE.meta.js
// ==/UserScript==
(function () {
    jQuery.noConflict();
    var nmb_search = {
        'sogou': 'http://pic.sogou.com/ris?query=',
        'baidu': 'http://image.baidu.com/n/pc_search?queryImageUrl=',
        'google': 'https://www.google.com/searchbyimage?image_url=',
        'saucenao': 'http://saucenao.com/search.php?db=999&url=',
        'iqdb': 'http://www.iqdb.org/?url=',
        'iisearch': 'http://iisearch.ddo.jp/front.php?mode=1&url=',
        'tineye': 'http://tineye.com/search/?url='
    };
    var setting_search=GM_getValue("setting_search", "baidu");
    var search_change = function (_search) {
        //localStorage.setItem('setting_search', _search);
        GM_setValue("setting_search", _search);
        alert('设置完毕(' + _search + ')\n即将刷新');
        location.reload();
    };
    var addLink = function (imgs) {
        var a, a_1, img_link, imgs_num, nmb_img, nmb_link, results;
        a_1 = 1;
        a = 0;
        imgs_num = imgs.length;
        results = [];
        while (a < imgs_num) {
            nmb_img = imgs.eq(a);
            a_1 = a + 1;
            img_link = nmb_img.attr('href');
            if (img_link.startsWith('//')) {
                img_link = 'https:' + img_link;
            }
            img_link = encodeURIComponent(img_link);
            nmb_link = '<a  target="_blank" id="one_key_search_image_' + a_1 + '" href="' + nmb_search[setting_search] + img_link + '">(←一键搜图)</a>';
            nmb_img.prop('outerHTML', nmb_img.prop('outerHTML') + nmb_link);
            results.push(a++);
        }
        return results;
    };
    var start = function () {
        switch (location.hostname) {
            case 'h.nimingban.com':
            case 'www.kukuku.cc':
            case 'adnmb.com':
            case 'adnmb1.com':
            case 'adnmb2.com':
                addLink(jQuery('a.h-threads-img-a'));
                break;
            case 'boards.4chan.org':
                addLink(jQuery('div.file > a.fileThumb'));
        }
        Object.entries(nmb_search).forEach(([key, value]) => {
            var trueString=""
            if(setting_search==key){
                trueString=" √"
            }
            GM_registerMenuCommand(key+trueString, search_change.bind(null,  key));
         });
    };
    jQuery(document).ready(function () {
        //setting();
        start();
    });
})();
