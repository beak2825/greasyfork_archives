// ==UserScript==
// @name         Bangumi折叠评论与楼中楼
// @namespace    问号
// @version      1.0
// @description  Bangumi折叠长评论与多回复楼中楼，此脚本不会减少流量消耗
// @author       问号
// @include      /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/(group|subject)/topic/
// @include      /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/(blog|ep)/
// @include      /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/settings
// @icon         https://bgm.tv/img/favicon.ico
// @license      GPL V2
// @downloadURL https://update.greasyfork.org/scripts/487832/Bangumi%E6%8A%98%E5%8F%A0%E8%AF%84%E8%AE%BA%E4%B8%8E%E6%A5%BC%E4%B8%AD%E6%A5%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/487832/Bangumi%E6%8A%98%E5%8F%A0%E8%AF%84%E8%AE%BA%E4%B8%8E%E6%A5%BC%E4%B8%AD%E6%A5%BC.meta.js
// ==/UserScript==

const maxCommentHeightKey = "maxCommentHeight";
const maxReplyLengthKey = "maxReplyLength";
let maxCommentHeight = getIntSetting(maxCommentHeightKey, 300);
let maxReplyLength = getIntSetting(maxReplyLengthKey, 5);
function getIntSetting(key, defaultValue) {
    let val = localStorage.getItem(key);
    let parsedVal = parseInt(val);
    if (val != null && parsedVal != NaN) {
        return parsedVal;
    }
    localStorage.setItem(key, defaultValue);
    return defaultValue;
}
//如果是设置页面
if (location.href.indexOf("settings") != -1) {
    let settingTab = document.querySelector(".secTab.rr");
    let maxCommentHeightSetting = document.createElement("li");
    maxCommentHeightSetting.innerHTML = `<a href="javascript:void(0);"><span>修改评论最大长度</span></a>`;
    maxCommentHeightSetting.addEventListener("click", () => {
        let height = parseInt(prompt("当评论的长度像素大于多少时，将会折叠评论?\n(默认300像素)"));
        if (height == NaN) {
            alert("输入的不为整数数字");
        }
        else if(height<0)
        {
            alert("输入的值应不小于0");
        }
        else {
            localStorage.setItem(maxCommentHeightKey, height.toString());
            alert("修改成功");
        }
    })
    settingTab.appendChild(maxCommentHeightSetting);

    let maxReplyLengthSetting = document.createElement("li");
    maxReplyLengthSetting.innerHTML = `<a href="javascript:void(0);"><span>修改回复最大条数</span></a>`;
    maxReplyLengthSetting.addEventListener("click", () => {
        let length = parseInt(prompt("当回复的长度条数大于多少时，将会折叠回复?\n(默认5条)"));
        if (length == NaN) {
            alert("输入的值不为整数数字");
        }
        else if(length<0)
        {
            alert("输入的应不小于0");
        }
        else {
            localStorage.setItem(maxReplyLengthKey, length.toString());
            alert("修改成功");
        }
    })
    settingTab.appendChild(maxReplyLengthSetting);
    return;
}
const style =
`
.expandToggle
{
    color: #0084B4;
    cursor: pointer;
}`;
//添加样式
document.head.insertAdjacentHTML('beforeend', `<style>${style}</style>`);

//遍历所有评论
for (let cmt of document.querySelectorAll(".message, .cmt_sub_content")) {
    //若评论长度大于最大像素
    if (cmt.clientHeight >= maxCommentHeight) {
        //截断评论
        cmt.style.height = `${maxCommentHeight}px`;
        cmt.style.overflow = "hidden";
        cmt.style.position = "relative";
        //展开按钮
        let expandToggle = document.createElement("span");
        expandToggle.className = "expandToggle";
        expandToggle.innerText = "[展开]";
        expandToggle.setAttribute("expanded", "false");
        expandToggle.addEventListener("click", ExpandCommentsToggleClick);
        cmt.parentElement.insertBefore(expandToggle, cmt.nextSibling);
    }
}

for (let replys of document.querySelectorAll(".topic_sub_reply")) {
    if (replys.children.length > maxReplyLength) {
        for (let i = maxReplyLength; i < replys.children.length; i++) {
            replys.children[i].style.display = "none";
        }

        let expandToggle = document.createElement("span");
        expandToggle.className = "expandToggle";
        expandToggle.innerText = `[展开，共${replys.children.length}条回复]`;
        expandToggle.setAttribute("expanded", "false");
        expandToggle.addEventListener("click", ExpandReplysToggleClick);
        replys.parentElement.insertBefore(expandToggle, replys.nextSibling);
    }
}

function ExpandCommentsToggleClick(e) {
    let thisCmt = e.target.previousSibling;
    if (e.target.getAttribute("expanded") == "true") { //展开状态
        let scrollRelativeCmtY = window.scrollY - (thisCmt.offsetTop + thisCmt.clientHeight); // 获得滚动条相对于评论底部的位置
        thisCmt.style.height = `${maxCommentHeight}px`;
        window.scroll(scrollX, scrollRelativeCmtY + (thisCmt.offsetTop + maxCommentHeight)); // 修改滚动条的位置
        e.target.innerText = "[展开]";
        e.target.setAttribute("expanded", "false");
    }
    else { //收起状态
        thisCmt.style.height = "";
        e.target.innerText = "[收起]";
        e.target.setAttribute("expanded", "true");
    }
}

function ExpandReplysToggleClick(e) {
    let thisReplys = e.target.previousSibling;
    if (e.target.getAttribute("expanded") == "true") //展开状态
    {
        let scrollRelativeCmtY = window.scrollY - (thisReplys.offsetTop + thisReplys.clientHeight);// 获得滚动条相对于评论底部的位置
        for (let i = maxReplyLength; i < thisReplys.children.length; i++) {
            thisReplys.children[i].style.display = "none";
        }
        window.scroll(scrollX, scrollRelativeCmtY + (thisReplys.offsetTop + thisReplys.clientHeight));// 修改滚动条的位置
        e.target.innerText = `[展开，共${thisReplys.children.length}条回复]`;
        e.target.setAttribute("expanded", "false");
    }
    else { //收起状态
        for (let i = maxReplyLength; i < thisReplys.children.length; i++) {
            thisReplys.children[i].style.display = "";
        }
        e.target.innerText = `[收起，共${thisReplys.children.length}条回复]`;
        e.target.setAttribute("expanded", "true");
    }
}
