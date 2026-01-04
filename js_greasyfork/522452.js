// ==UserScript==
// @name        森空岛-显示精确时间
// @namespace   http://tampermonkey.net/
// @description 森空岛帖子与评论发布时间替换为精确时间，格式为“yyyy-MM-dd hh:mm:ss”。
// @version     1.1
// @author      Y_jun
// @license     MIT
// @icon        https://bbs.hycdn.cn/public/skland-web/image/11a014c95c5ee68fe26c17995aa44a64.png
// @match       https://www.skland.com/*
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/522452/%E6%A3%AE%E7%A9%BA%E5%B2%9B-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/522452/%E6%A3%AE%E7%A9%BA%E5%B2%9B-%E6%98%BE%E7%A4%BA%E7%B2%BE%E7%A1%AE%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==


const TS_REGEX = /^\d{10}$/;
const FULL_DATETIME_REGEX = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
const MIN_DATETIME_REGEX = /[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/;

function getDateTime(ts, type) {
    if (TS_REGEX.test(ts)) {
        let date = new Date(ts * 1000);
        if (!isNaN(date.getTime())) {
            let y = date.getFullYear();
            if (y < 2000) return;
            let m = date.getMonth() + 1;
            let d = date.getDate();
            if (type === 'full') {
                return `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${date.toTimeString().substring(0, 8)}`;
            } else if (type === 'min') {
                return `${y.toString().substring(2)}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d} ${date.toTimeString().substring(0, 5)}`;
            } else if (type === 'date') {
                return `${y.toString().substring(2)}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
            }
        }
    }
    return null;
}

function getNewText(origTxt, datetime, isJoin) {
    origTxt = origTxt.trim();
    if (isJoin && /天|前/.test(origTxt)) {
        return datetime + ' · ' + origTxt;
    }
    if (origTxt.includes(' · ')) {
        let origTxtArr = origTxt.split(' · ');
        origTxtArr[0] = datetime;
        return origTxtArr.join(' · ');
    }
    return datetime;
}

function getNewTextWithEdit(origTxt, createTime, editTime) {
    origTxt = origTxt.trim();
    let origTxtArr = origTxt.split(' · ');
    if (/天|前/.test(origTxtArr[0])) {
        origTxtArr[0] = createTime + ' · ' + origTxtArr[0];
    } else {
        origTxtArr[0] = createTime;
    }
    if (/天|前/.test(origTxtArr[1])) {
        origTxtArr[1] = '(' + '编辑于 ' + editTime + ' · ' + origTxtArr[1].replace(/编辑于 /, "") + ')';
    } else {
        origTxtArr[1] = '(' + '编辑于 ' + editTime + ')';
    }
    return origTxtArr.join(' · ');
}

function getReactProps(target) {
    const keyof_ReactProps = Object.keys(target).find(k => k.startsWith("__reactProps$"));
    return target[keyof_ReactProps] ?? null;
}

function handleComment(commElements) {
    if (commElements.length === 0) return;
    for (let i = 0; i < commElements.length; i++) {
        const commEle = commElements[i];
        const timeEle = commEle.querySelectorAll(".gxBfiz")[0]; // Item__DateAndIP-sc-1027362-14 gxBfiz
        if (!FULL_DATETIME_REGEX.test(timeEle.textContent)) {
            const reactProps = getReactProps(commEle);
            if (!reactProps?.children) continue;
            const createTimestamp = reactProps.children.props?.comment?.createdAtTs ?? reactProps.children[0].props?.comment?.createdAtTs ?? reactProps.children[1].props?.comment?.createdAtTs;

            const createTime = getDateTime(createTimestamp, 'full');
            timeEle.textContent = getNewText(timeEle.textContent, createTime, 1);
        }
    }
};

function handlePost(postContent) {
    if (!postContent) return;
    const timeEle = postContent.querySelector(".article-tip");
    if (!FULL_DATETIME_REGEX.test(timeEle.textContent)) {
        let postProps = getReactProps(postContent);
        if (!postProps?.children) return;
        let createTime = getDateTime(postProps.children[5].props.item.createdAtTs, 'full');
        let editTime = getDateTime(postProps.children[5].props.item.latestEditAtTs, 'full');
        if (timeEle.textContent.includes("编辑于")) {
            timeEle.textContent = getNewTextWithEdit(timeEle.textContent, createTime, editTime);
        } else {
            timeEle.textContent = getNewText(timeEle.textContent, createTime, 1);
        }
    }
};

function handlePostList(postListEle) {
    if (!postListEle) return;
    let postList = postListEle.querySelectorAll(".hyMxty"); // PostItem__Wrapper-sc-re1odp-5 jpYpgS FeedList__Item-sc-prbdre-6 hyMxty
    for (let i = 0; i < postList.length; i++) {
        const postEle = postList[i];
        const timeEle = postEle.querySelector(".item-info");
        if (!FULL_DATETIME_REGEX.test(timeEle.textContent)) {
            const reactProps = getReactProps(postEle.querySelector(".bmVTmJ")); // PostItem__Body-sc-re1odp-6 bmVTmJ
            if (!reactProps?.children) continue;
            const createTimestamp = reactProps.children[2].props.item.timestamp;
            const createTime = getDateTime(createTimestamp, 'full');
            timeEle.textContent = getNewText(timeEle.textContent, createTime, 1);
        }
    }
};

addEventListener("load", () => {
    if (window.location.pathname === "/article") {
        setInterval(() => {
            let postContent = document.querySelector(`.bRVxGC`); // article__ArticleWrapper-sc-fjni0c-4 bRVxGC
            handlePost(postContent);
            let commElements = document.querySelectorAll(`.elXfXI`); // Aggregation__Content-sc-b4454s-3 elXfXI
            let detailCommElements = document.querySelectorAll(`.iJnrsh`); // Detail__CommentWrap-sc-1lz3wk4-1 iJnrsh
            handleComment(commElements);
            handleComment(detailCommElements);
        }, 100);
    }
    setInterval(() => {
        let postListEle = document.querySelector(`.feed-list`);
        handlePostList(postListEle);
    }, 100);
});
