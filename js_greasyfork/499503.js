// ==UserScript==
// @name         Omiai Dakimakura Add External Links
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在Omiai Dakimakura网站中添加基于作品名生成的外部链接
// @author       Your Name
// @match        http://omiai-dakimakura.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499503/Omiai%20Dakimakura%20Add%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/499503/Omiai%20Dakimakura%20Add%20External%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    $(document).ready(function() {
        // 获取作品名和描述
        var titleMeta = $('meta[property="og:title"]').attr('content');
        var descriptionMeta = $('meta[property="og:description"]').attr('content');

        if (titleMeta && descriptionMeta) {
            var title = titleMeta.trim();

            var mercariUrl = 'https://jp.mercari.com/search?keyword=' + encodeURIComponent(title);
            var amiamiCnUrl = 'https://www.amiami.com/cn/search/list/?s_keywords=' + encodeURIComponent(title);
            var amiamiJpUrl = 'https://slist.amiami.jp/top/search/list?s_cate_tag=&s_keywords=' + encodeURIComponent(title);
            var mandarakeUrl = 'https://order.mandarake.co.jp/order/listPage/list?keyword=' + encodeURIComponent(title);
            var surugayaUrl = 'https://www.suruga-ya.jp/search?category=&search_word=' + encodeURIComponent(title);
            var melonUrl = 'https://www.melonbooks.co.jp/search/search.php?mode=search&search_disp=&category_id=0&text_type=&name=' + encodeURIComponent(title);
            var yahooUrl = 'https://auctions.yahoo.co.jp/search/search?va=' + encodeURIComponent(title);
            var xianyuUrl ='https://www.goofish.com/search?q=' + encodeURIComponent(title);

            // 创建新的链接元素
            var mercariLink = $('<a></a>', {
                text: 'mercari',
                href: mercariUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var amiamiCnLink = $('<a></a>', {
                text: 'amiami-cn',
                href: amiamiCnUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var amiamiJpLink = $('<a></a>', {
                text: 'amiami-jp',
                href: amiamiJpUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var mandarakeLink = $('<a></a>', {
                text: 'mandarake',
                href: mandarakeUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var melonLink = $('<a></a>', {
                text: 'melonbook',
                href: melonUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
           var yahooLink = $('<a></a>', {
                text: '日拍',
                href: yahooUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
           var xianyuLink = $('<a></a>', {
                text: '闲鱼',
                href: xianyuUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var surugayaLink = $('<a></a>', {
                text: '骏河屋',
                href: surugayaUrl,
                target: '_blank',
                rel: 'external nofollow'
            });

            // 创建包含链接的新元素
            var linksContainer = $('<div></div>', {
                class: 'external-links',
                style: 'margin-top: 10px;'
            }).append('<p>外部链接：</p>')
              .append(mercariLink).append('、')
              .append(amiamiCnLink).append('、')
              .append(amiamiJpLink).append('、')
              .append(mandarakeLink).append('、')
              .append(surugayaLink).append('、')
              .append(yahooLink).append('、')
              .append(xianyuLink).append('、')
              .append(melonLink);

            // 将新的链接元素添加到 .entry-inner 中
            $('.entry-inner').append(linksContainer);
        }
    });
})();

