// ==UserScript==
// @name         屏蔽百度广告
// @namespace    http://tampermonkey.net/
// @version      0.5.6
// @description  屏蔽百度首页智能推荐的条目信息
// @author       ╰鳯晟岁月ゞ
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27925/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/27925/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function() {
    var filterKeywords = [''];

    filterKeywords.push('07073网');
    filterKeywords.push('1626潮流在线');
    filterKeywords.push('cnbeta');
    filterKeywords.push('DoNews');
    filterKeywords.push('百度VIP');
    filterKeywords.push('百度糯米');
    filterKeywords.push('北青网');
    filterKeywords.push('比特网');
    filterKeywords.push('财经中国网');
    filterKeywords.push('参考消息');
    filterKeywords.push('重庆晨报');
    filterKeywords.push('大河网');
    filterKeywords.push('东方头条');
    filterKeywords.push('飞象网');
    filterKeywords.push('凤凰财经');
    filterKeywords.push('凤凰地产');
    filterKeywords.push('凤凰房产');
    filterKeywords.push('凤凰佛教');
    filterKeywords.push('凤凰酒业');
    filterKeywords.push('凤凰科技');
    filterKeywords.push('凤凰汽车');
    filterKeywords.push('凤凰时尚');
    filterKeywords.push('凤凰视频');
    filterKeywords.push('凤凰体育');
    filterKeywords.push('凤凰网');
    filterKeywords.push('凤凰新闻');
    filterKeywords.push('凤凰游戏');
    filterKeywords.push('凤凰艺术');
    filterKeywords.push('凤凰音乐');
    filterKeywords.push('凤凰娱乐');
    filterKeywords.push('光明网');
    filterKeywords.push('光明网历史');
    filterKeywords.push('国际新闻');
    filterKeywords.push('海外网');
    filterKeywords.push('和讯股票');
    filterKeywords.push('和讯黄金');
    filterKeywords.push('和讯期货');
    filterKeywords.push('和讯汽车');
    filterKeywords.push('和讯商学院');
    filterKeywords.push('和讯外汇');
    filterKeywords.push('和讯网');
    filterKeywords.push('和讯银行');
    filterKeywords.push('华商网');
    filterKeywords.push('健康网');
    filterKeywords.push('界面');
    filterKeywords.push('界面新闻');
    filterKeywords.push('今报网');
    filterKeywords.push('今视网');
    filterKeywords.push('金融界');
    filterKeywords.push('科技讯');
    filterKeywords.push('历史趣闻网');
    filterKeywords.push('美食天下');
    filterKeywords.push('品科技');
    filterKeywords.push('七丽时尚');
    filterKeywords.push('千趣');
    filterKeywords.push('上游新闻');
    filterKeywords.push('什么值得买');
    filterKeywords.push('搜狐IT');
    filterKeywords.push('搜狐财经');
    filterKeywords.push('搜狐健康频道');
    filterKeywords.push('搜狐教育');
    filterKeywords.push('搜狐军事');
    filterKeywords.push('搜狐理财');
    filterKeywords.push('搜狐历史');
    filterKeywords.push('搜狐旅游');
    filterKeywords.push('搜狐母婴');
    filterKeywords.push('搜狐汽车');
    filterKeywords.push('搜狐时尚');
    filterKeywords.push('搜狐数码');
    filterKeywords.push('搜狐体育');
    filterKeywords.push('搜狐网');
    filterKeywords.push('搜狐文化');
    filterKeywords.push('搜狐新闻');
    filterKeywords.push('搜狐娱乐');
    filterKeywords.push('搜狐证券');
    filterKeywords.push('腾讯数码');
    filterKeywords.push('网易游戏');
    filterKeywords.push('新华网');
    filterKeywords.push('新蓝网');
    filterKeywords.push('新浪财经');
    filterKeywords.push('新浪汽车');
    filterKeywords.push('新浪新闻视频');
    filterKeywords.push('新浪育儿');
    filterKeywords.push('游民星空');
    filterKeywords.push('智能推荐');
    filterKeywords.push('中关村在线');
    filterKeywords.push('中国青年网');
    filterKeywords.push('中国日报网');
    filterKeywords.push('中华网');
    filterKeywords.push('中证网');

    $.ajaxSetup({
        complete: function() {
            $('.from').each(function() {
                if (!!~filterKeywords.indexOf($(this).find('span:first').text().trim()) || !!~$(this).find('span:first').text().indexOf('广告')) {
                    $(this).parents('div.s-news-special').remove();
                }
            });
        }
    });
});