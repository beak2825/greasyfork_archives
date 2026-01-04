// ==UserScript==
// @name         净化汽车之家论坛
// @namespace    https://gitee.com/miniknife/JingTanShiZhe
// @version      0.1.3
// @description  根据用户黑名单和内容关键字过滤帖子内容，还我干净的汽车之家论坛。
// @author       MiniKnife
// @match        *://club.autohome.com.cn/bbs/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/35662/%E5%87%80%E5%8C%96%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/35662/%E5%87%80%E5%8C%96%E6%B1%BD%E8%BD%A6%E4%B9%8B%E5%AE%B6%E8%AE%BA%E5%9D%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户黑名单列表
    var USER_BLACKLIST = ['华尔街在哪', '青之十亩之外', '请把牛逼还给BYD', '榴莲汽车', '我最爱比亚迪', '黑车我矫情', 'loujilin', '我想玩火',
                          'lukenm', 'hjgailh', 'SS001869', '北京华彬', '范尼_雷克萨斯', '我祖先', '无聊的蝙蝠', 'LZYYF', 'eHudu', '龙行W风云', 
                          'njtianwf', '玉林犬国', '16欧洲杯冠军葡萄牙', '船夫在云上飞', 'BYD一万亿', '航模粟', 'tomcyqczj1', '范尼_比克萨斯', 
                          '欧内斯特米乐尔'];

    // 帖子标题要过滤的关键字
    var TITLE_FILTER_KEYWORDS = [];

    // 帖子回复内容要过滤的关键字
    var REPLY_FILTER_KEYWORDS = ['本楼已被自动过滤系统删除', '本楼已被管理员删除'];

    function mergeConfig(valuesFromScript, nameForStorage) {
        if (typeof(GM_getValue) != 'undefined') {
            var valuesFromStorage = Array.from(JSON.parse(GM_getValue(nameForStorage, "[]")));

            var mergeValues = null;

            if (valuesFromStorage.length == 0) {
                mergeValues = valuesFromScript;
            } else {
                var allValues = valuesFromScript.concat(valuesFromStorage);
                mergeValues = Array.from(new Set(allValues));
            }

            if (mergeValues.length != valuesFromStorage) {
                GM_setValue(nameForStorage, JSON.stringify(mergeValues));
            }
            return mergeValues;
        } else {
            console.log('#GM_getValue is disabled');
            return valuesFromScript;
        }
    }

    function replaceArrayElements(the_array, new_array_data) {
        the_array.splice(0, the_array.length);
        for (var i = 0; i < new_array_data.length; ++i) {
            the_array.push(new_array_data[i]);
        }
    }

    function refreshConfig() {
        var newUserBlacklist = mergeConfig(USER_BLACKLIST, 'USER_BLACKLIST');
        if (newUserBlacklist.length != USER_BLACKLIST.length) {
            replaceArrayElements(USER_BLACKLIST, newUserBlacklist);
        }
        console.log('USER_BLACKLIST: ' + USER_BLACKLIST.join(','));

        var newTitleFilterKeywords = mergeConfig(TITLE_FILTER_KEYWORDS, 'TITLE_FILTER_KEYWORDS');
        if (newTitleFilterKeywords.length != TITLE_FILTER_KEYWORDS.length) {
            replaceArrayElements(TITLE_FILTER_KEYWORDS, newTitleFilterKeywords);
        }
        console.log('TITLE_FILTER_KEYWORDS: ' + TITLE_FILTER_KEYWORDS.join(','));

        var newReplyFilterKeywords = mergeConfig(REPLY_FILTER_KEYWORDS, 'REPLY_FILTER_KEYWORDS');
        if (newReplyFilterKeywords.length != REPLY_FILTER_KEYWORDS.length) {
            replaceArrayElements(REPLY_FILTER_KEYWORDS, newReplyFilterKeywords);
        }
        console.log('REPLY_FILTER_KEYWORDS: ' + REPLY_FILTER_KEYWORDS.join(','));
    }

    function trimString(str) {
        if (str) {
            return str.trim();
        } else {
            return '';
        }
    }

    function listPosts() {
        var postList = [];
        $('#subcontent > dl.list_dl').each(function(i) {
            var postEle = $(this);
            var title = postEle.find('dt > a.a_topic').text();
            title = trimString(title);
            var author = postEle.find('dd:first > a').text();
            author = trimString(author);

            if (title && author) {
                postList.push({
                    title: title,
                    author: author,
                    jQElement: postEle
                });
            }
        });
        return postList;
    }

    function listReplies() {
        var replyList = [];
        $('#maxwrap-reply > div').each(function(i) {
            var replyEle = $(this);
            var content = replyEle.find('div.x-reply').text();
            content = trimString(content);
            var author = replyEle.find('div.conleft a[xname=uname]').text();
            author = trimString(author);
            var replyForAuthor = replyEle.find('div.x-reply div.relyhfcon > p:first > a:first').text();
            replyForAuthor = trimString(replyForAuthor);
            var replyForContent = replyEle.find('div.x-reply div.relyhfcon > p.rrlycontxt').text();
            replyForContent = trimString(replyForContent);

            if (author) {
                replyList.push({
                    content: content,
                    author: author,
                    replyForAuthor: replyForAuthor,
                    replyForContent: replyForContent,
                    jQElement: replyEle
                });
            }
        });
        return replyList;
    }

    function getAuthorBlacklist() {
        return USER_BLACKLIST;
    }

    function getTitleFilterKeywords() {
        return TITLE_FILTER_KEYWORDS;
    }

    function getContentFilterKeywords() {
        return REPLY_FILTER_KEYWORDS;
    }

    function filterByBlacklist(dataList, filterAttrName, filterBlacklist) {
        for (var i = 0; i < dataList.length; ++i) {
            var dataItem = dataList[i];
            var attrValue = dataItem[filterAttrName];
            if (attrValue && filterBlacklist.indexOf(attrValue) != -1) {
                console.log('hide value by blacklist: ' + attrValue);
                dataItem['jQElement'].hide();
            }
        }
    }

    function filterByKeywords(dataList, filterAttrName, filterKeywords) {
        for (var i = 0; i < dataList.length; ++i) {
            var dataItem = dataList[i];
            var attrValue = dataItem[filterAttrName];
            if (attrValue) {
                for (var ki = 0; ki < filterKeywords.length; ++ki) {
                    var keywords = filterKeywords[ki];
                    if (attrValue.indexOf(keywords) != -1) {
                        console.log('hide value by keywords: ' + attrValue);
                        dataItem['jQElement'].hide();
                        break;
                    }
                }
            }
        }
    }

    function filterPosts() {
        var postList = listPosts();
        var authorBlacklist = getAuthorBlacklist();
        var titleFilterKeywords = getTitleFilterKeywords();
        filterByBlacklist(postList, 'author', authorBlacklist);
        filterByKeywords(postList, 'title', titleFilterKeywords);
    }

    function filterReplies() {
        var replyList = listReplies();
        var authorBlacklist = getAuthorBlacklist();
        var contentFilterKeywords = getContentFilterKeywords();
        filterByBlacklist(replyList, 'author', authorBlacklist);
        filterByBlacklist(replyList, 'replyForAuthor', authorBlacklist);
        filterByKeywords(replyList, 'content', contentFilterKeywords);
        filterByKeywords(replyList, 'replyForContent', contentFilterKeywords);
    }

    function filterAds() {
        $('div.navarea > ul').hide();
        $('div.area > dl').hide();
        $('#__recom').hide();
        $('#DivIdHrml').hide();
    }

    refreshConfig();
    filterAds();
    filterPosts();
    filterReplies();

})();