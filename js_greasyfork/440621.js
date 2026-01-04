// ==UserScript==
// @name         CC98 Tools - Block List
// @version      0.0.4
// @description  CC98 tools for blocking user, title, content and board.
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440621/CC98%20Tools%20-%20Block%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/440621/CC98%20Tools%20-%20Block%20List.meta.js
// ==/UserScript==

/* 屏蔽列表 */
const CONFIG = {
    userName: [], /* 用户名，如 ["ml98"] */
    title: [], /* 标题关键字或正则表达式，如 ["男生进", "女生进"] */
    content: [], /* 帖子内容关键字或正则表达式，如 ["欧蓝德", /^bd$/] */
    board: [], /* 版面id，如 [182, 357, 758] */
};


const log = () => {};
CONFIG.content.push(...(CONFIG.userName).map(userName => `楼：用户${userName}在`));
CONFIG.title = CONFIG.title.map((t) => new RegExp(t));
CONFIG.content = CONFIG.content.map((c) => new RegExp(c));
log('config', CONFIG);

const isBlockedId = (_id) => _id && CONFIG.userName.includes(_id);
const isBlockedTitle = (_title) => _title && CONFIG.title.some((t) => t.test(_title));
const isBlockedContent = (_content) => _content && CONFIG.content.some((c) => c.test(_content));
const isBlockedBoard = (_boardId) => _boardId && CONFIG.board.includes(_boardId);

const topicRegExp = new RegExp("/board/\\d+/topic");
const postRegExp = new RegExp("/Topic/\\d+/(hot-)?post");

const isTopicAPI = (url) => url.includes("/topic/new") ||
      url.includes("/me/custom-board/topic") ||
      url.includes("/topic/search?keyword=") ||
      topicRegExp.test(url);
const isPostAPI = (url) => postRegExp.test(url);
const isIndexAPI = (url) => url.includes("/config/index");

const resolve = (url, data) => {
    log(url);
    log('before', data);
    if (isTopicAPI(url)) {
        data = data.filter(
            (r) =>
            !(
                isBlockedId(r.userName) ||
                isBlockedTitle(r.title) ||
                isBlockedBoard(r.boardId)
            )
        );
    } else if (isPostAPI(url)) {
        data = data.filter(
            (r) =>
            !(
                isBlockedId(r.userName) ||
                isBlockedContent(r.content) ||
                isBlockedBoard(r.boardId)
            )
        );
    } else if (isIndexAPI(url)) {
        data.hotTopic = data.hotTopic.filter(
            (r) =>
            !(
                isBlockedId(r.authorName) ||
                isBlockedTitle(r.title) ||
                isBlockedBoard(r.boardId)
            )
        );
    }
    log('after', data);
    return data;
};

const origResponseJSON = Response.prototype.json;
Response.prototype.json = function () {
  return origResponseJSON.call(this).then((data) => resolve(this.url, data));
};
