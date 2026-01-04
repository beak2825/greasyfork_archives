// ==UserScript==
// @name         HPOI Add External Links
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在HPOI网站的外部链接后面添加多个链接，如果不存在外部链接元素则创建它
// @author       Your Name
// @match        https://www.hpoi.net/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499505/HPOI%20Add%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/499505/HPOI%20Add%20External%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    $(document).ready(function() {
        // 查找名称的元素
        var nameElement = $('.hpoi-infoList-item:contains("名称") p');
        var chineseNameElement = $('.hpoi-ibox-title p[title]');

        if (nameElement.length && chineseNameElement.length) {
            var modelName = nameElement.text().trim();
            var chineseName = chineseNameElement.attr('title').trim();

            var mercariUrl = 'https://jp.mercari.com/search?keyword=' + encodeURIComponent(modelName);
            var amiamiCnUrl = 'https://www.amiami.com/cn/search/list/?s_keywords=' + encodeURIComponent(chineseName);
            var amiamiJpUrl = 'https://slist.amiami.jp/top/search/list?s_cate_tag=&s_keywords=' + encodeURIComponent(modelName);
            var mandarakeUrl = 'https://order.mandarake.co.jp/order/listPage/list?keyword=' + encodeURIComponent(modelName);
            var surugayaUrl = 'https://www.suruga-ya.jp/search?category=&search_word=' + encodeURIComponent(modelName);
            var yahooUrl = 'https://auctions.yahoo.co.jp/search/search?va=' + encodeURIComponent(modelName);
            var solarUrl ='https://solarisjapan.com/search/?query=' + encodeURIComponent(modelName);
            var xianyuUrl ='https://www.goofish.com/search?q=' + encodeURIComponent(chineseName);

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
                text: '日拍',
                href: yahooUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var yahooLink = $('<a></a>', {
                text: 'mandarake',
                href: mandarakeUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var surugayaLink = $('<a></a>', {
                text: '骏河屋',
                href: surugayaUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var solarLink = $('<a></a>', {
                text: 'solar',
                href: solarUrl,
                target: '_blank',
                rel: 'external nofollow'
            });
            var xianyuLink = $('<a></a>', {
                text: '闲鱼',
                href: xianyuUrl,
                target: '_blank',
                rel: 'external nofollow'
            });

            // 查找外部链接的元素
            var externalLinkElement = $('.hpoi-infoList-item:contains("外部链接") p');
            if (externalLinkElement.length) {
                // 如果外部链接元素存在，添加新的链接
                externalLinkElement.append('、').append(mercariLink)
                                   .append('、').append(amiamiCnLink)
                                   .append('、').append(amiamiJpLink)
                                   .append('、').append(mandarakeLink)
                                   .append('、').append(yahooLink)
                                    .append('、').append(solarLink)
                                    .append('、').append(xianyuLink)
                                   .append('、').append(surugayaLink);
            } else {
                // 如果外部链接元素不存在，创建新的外部链接元素并添加到页面中
                var newExternalLinkElement = $('<div></div>', {
                    class: 'hpoi-infoList-item'
                }).append($('<span></span>', {
                    text: '外部链接'
                })).append($('<p></p>').append(mercariLink)
                                       .append('、').append(amiamiCnLink)
                                       .append('、').append(amiamiJpLink)
                                       .append('、').append(mandarakeLink)
                                       .append('、').append(yahooLink)
                                       .append('、').append(solarLink)
                                       .append('、').append(xianyuLink)
                                       .append('、').append(surugayaLink));

                // 将新的外部链接元素添加到 infoList-box 中的适当位置
                $('.infoList-box').append(newExternalLinkElement);
            }
        }
    });
})();
