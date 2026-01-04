// ==UserScript==
// @name          抽屉眼不见为净
// @require       http://cdn.staticfile.org/jquery/3.3.1/jquery.slim.min.js
// @require       http://cdn.staticfile.org/arrive/2.4.1/arrive.min.js
// @require       http://cdn.staticfile.org/jquery-modal/0.9.2/jquery.modal.min.js
// @resource      jqueryModalCss http://cdn.staticfile.org/jquery-modal/0.9.2/jquery.modal.min.css
// @resource      pureCss http://cdn.staticfile.org/pure/1.0.0/pure-min.css
// @version       1.3
// @description   可以按照发布者，标题和tag过滤热榜内容或评论
// @include       https://dig.chouti.com/*
// @exclude       https://dig.chouti.com/link/*
// @exclude       https://dig.chouti.com/user/link/*
// @icon          https://dig.chouti.com/images/favicon-d38b877458.png
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @run-at        document-end
// @namespace https://greasyfork.org/users/96951
// @downloadURL https://update.greasyfork.org/scripts/387238/%E6%8A%BD%E5%B1%89%E7%9C%BC%E4%B8%8D%E8%A7%81%E4%B8%BA%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387238/%E6%8A%BD%E5%B1%89%E7%9C%BC%E4%B8%8D%E8%A7%81%E4%B8%BA%E5%87%80.meta.js
// ==/UserScript==

// 载入两个简单的css
GM_addStyle(GM_getResourceText('jqueryModalCss'));
GM_addStyle(GM_getResourceText('pureCss'));

// 主信息流过滤设置
let titleList = JSON.parse(GM_getValue('titleList', '[]')) || [];
let authorList = JSON.parse(GM_getValue('authorList', '[]')) || [];
let tagList = JSON.parse(GM_getValue('tagList', '[]')) || [];
let commentAuthorList = JSON.parse(GM_getValue('commentAuthorList', '[]')) || [];

function filterFeed(feedElement) {
    let feed = $(feedElement);
    let title = feed.find('.link-title').text();
    if (titleList.some(ele => title.indexOf(ele) >= 0)) {
        feed.remove();
        return;
    }
    let author = feed.find('.author-name').text();
    if (authorList.indexOf(author) >= 0) {
        feed.remove();
        return;
    }
    let tag = feed.find('.link-mark').find('span.left').text();
    if (tag && tagList.indexOf(tag) >= 0) {
        feed.remove();
        return;
    }
}

function filterComment(commentElement) {
    let comment = $(commentElement);
    let author = comment.find('.comment-author').first().text();
    debugger
    if (author && commentAuthorList.some(ele => ele === author)) {
        comment.remove();
        return;
    }
}

// 过滤元素
function monitor(cssSelector, callback) {
    $(document).arrive(cssSelector, callback);
    $(cssSelector).each((index,element) => callback(element));
}

// 开始过滤过滤代码
monitor('.link-item', filterFeed);
monitor('.comment-li', filterComment);

// 设置窗口
let settingDialog = $(`
<div id="settingDialog" class="modal" style="width:800px">
    <form class="pure-form pure-form-stacked" action="/">
        <fieldset>
            <legend>信息流屏蔽设置</legend>
            <div class="pure-g">

                <div class="pure-u-1 pure-u-md-1-3">
                    <label for="filterTitleList">标题</label>
                    <input id="filterTitleList" class="pure-u-23-24" type="text" placeholder="比如：特朗普,美国">
                </div>

                <div class="pure-u-1 pure-u-md-1-3">
                    <label for="filterAuthorList">发布人</label>
                    <input id="filterAuthorList" class="pure-u-23-24" type="text" placeholder="比如：从善如流马歇尔,英国那些事儿">
                </div>

                <div class="pure-u-1 pure-u-md-1-3">
                    <label for="filterTagList">tag</label>
                    <input id="filterTagList" class="pure-u-23-24" type="text" placeholder="比如：每日沙雕,追剧指南">
                </div>
            </div>

            <legend style="margin-top: 20px;">评论屏蔽设置</legend>
            <div class="pure-g">
                <div class="pure-u-1 pure-u-md-1-3">
                    <label for="filterCommentAuthorList">评论人</label>
                    <input id="filterCommentAuthorList" class="pure-u-23-24" type="text" placeholder="比如：真小人,歪理邪说">
                </div>
            </div>

            <button id="submitFilterSetting" type="submit" style="margin-top: 20px;" class="pure-button pure-button-primary">确认</button>
        </fieldset>
    </form>
</div>
`);
settingDialog.appendTo('body');
settingDialog.find('#submitFilterSetting').click(function() {
    let t = settingDialog.find('#filterTitleList').val();
    titleList = t ? t.split(',') : [];
    t = settingDialog.find('#filterAuthorList').val();
    authorList = t ? t.split(',') : [];
    t = settingDialog.find('#filterTagList').val();
    tagList = t ? t.split(',') : [];
    t = settingDialog.find('#filterCommentAuthorList').val();
    commentAuthorList = t ? t.split(',') : [];
    GM_setValue('titleList', JSON.stringify(titleList.length >0 ? titleList : []));
    GM_setValue('authorList', JSON.stringify(authorList.length >0 ? authorList : []));
    GM_setValue('tagList', JSON.stringify(tagList.length >0 ? tagList : []));
    GM_setValue('commentAuthorList', JSON.stringify(commentAuthorList.length >0 ? commentAuthorList : []));
});

// 设置菜单
let menuItem = $('<a href="#settingDialog" rel="modal:open">屏蔽设置</a>');
menuItem.insertBefore('a.logout');
menuItem.click(function() {
    settingDialog.find('#filterTitleList').val(titleList.join(','));
    settingDialog.find('#filterAuthorList').val(authorList.join(','));
    settingDialog.find('#filterTagList').val(tagList.join(','));
    settingDialog.find('#filterCommentAuthorList').val(commentAuthorList.join(','));
    settingDialog.modal();
});
