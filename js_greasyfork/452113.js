// ==UserScript==
// @name         知乎-蛙了个蛙
// @name:zh-CN   知乎-蛙了个蛙
// @name:zh-TW   知乎-蛙了个蛙
// @version      1.0.1
// @author       Elliot_bai
// @description  知乎版找蛙神器，前端渣渣，源码改自《知乎增强》，致敬作者X.I.U.全脚本两个功能：回答页面、用户主页给疑似蛙蛙投票；用户主页如果蛙蛙票数超过一定数量会显示蛙蛙标签。也不知道哪天会挂，纯粹为环境净化做一点点贡献。
// @description:zh-tw 知乎版找蛙神器，前端渣渣，源码改自《知乎增强》，致敬作者X.I.U....
// @match        *://www.zhihu.com/*
// @match        *://www.zhihu.com/people*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0 License
// @namespace    https://greasyfork.org/zh-CN/scripts/452113
// @downloadURL https://update.greasyfork.org/scripts/452113/%E7%9F%A5%E4%B9%8E-%E8%9B%99%E4%BA%86%E4%B8%AA%E8%9B%99.user.js
// @updateURL https://update.greasyfork.org/scripts/452113/%E7%9F%A5%E4%B9%8E-%E8%9B%99%E4%BA%86%E4%B8%AA%E8%9B%99.meta.js
// ==/UserScript==

'use strict';
function blockUsers_button() {
    const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                //console.log(target, target.className)
                if (target.className && (target.className.indexOf('Popover-content Popover-content--top HoverCard-popoverTarget') > -1 || target.className.indexOf('Popover-content Popover-content--bottom HoverCard-popoverTarget') > -1) || target.querySelector('.Popover-content.Popover-content--top.HoverCard-popoverTarget') || target.querySelector('.Popover-content.Popover-content--bottom.HoverCard-popoverTarget')) {
                    let item = target.querySelector('.MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons'),
                        item1 = target.querySelector('a.UserLink-link'),
                        name = item1.textContent,
                        userid = item1.href.split('/')[4];
                    if (item && !target.querySelector('button[data-name][data-userid]')) {
                        item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--red" style="width: 100%;margin: 7px 0 0 0;"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>给蛙蛙来一票</button>`);
                        let tag = "answer";
                        item.lastElementChild.onclick = function () { vote_wawa(userid, name, tag) }
                    }
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document, { childList: true, subtree: true });
}

function vote_wawa(wawa_id, name, tag) {
    let vote_user = document.querySelector('.Popover.AppHeader-menu button');
    vote_user.click();
    let user_window = document.querySelector('.Menu.AppHeaderProfileMenu'),
        vote_id = user_window.querySelector('a').href.split('/')[4];
    user_window.style.display = 'none';
    if (vote_id) {
        var vote_msg = {
            "obj_id": wawa_id,
            "name": name,
            "tag": tag,
            "msg": "",
            "vote_id": vote_id
        };
        GM_xmlhttpRequest({
            method: "POST",
            url: 'http://www.findpneumatic.com/zhihu/vote/',
            data: JSON.stringify(vote_msg),
            headers: {
                "Content-Type": "application/json",
            },
            onload: function (res) {
                alert(res.responseText);
            }
        })
    }

}

// 添加投票按钮（用户主页）
function blockUsers_button_people() {
    let name = document.querySelector('.ProfileHeader-name').firstChild.textContent, // 获取用户名
        userid = location.href.split('/')[4];
    GM_xmlhttpRequest({
        method: "POST",
        url: 'http://www.findpneumatic.com/zhihu/query_tag/',
        data: JSON.stringify({ "id": userid }),
        headers: {
            "Content-Type": "application/json",
        },
        onload: function (res) {
            if (res.status === 200) {
                let st = JSON.parse(res.response);
                // console.log(st);
                let item = document.querySelector('.MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons'),
                    tag = "index";
                if (st.is_1450 === true) {
                    item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--green" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>蛙蛙1只(${st.votes}票)</button>`);
                    item.lastElementChild.onclick = function () { vote_wawa(userid, name, tag) }
                } else {
                    item.insertAdjacentHTML('beforeend', `<button type="button" data-name="${name}" data-userid="${userid}" class="Button FollowButton Button--primary Button--red" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">​<svg class="Zi Zi--Plus FollowButton-icon" fill="currentColor" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path d="M18.376 5.624c-3.498-3.499-9.254-3.499-12.752 0-3.499 3.498-3.499 9.254 0 12.752 3.498 3.499 9.254 3.499 12.752 0 3.499-3.498 3.499-9.14 0-12.752zm-1.693 1.693c2.37 2.37 2.596 6.094.678 8.69l-9.367-9.48c2.708-1.919 6.32-1.58 8.69.79zm-9.48 9.48c-2.37-2.37-2.595-6.095-.676-8.69l9.48 9.48c-2.822 1.918-6.433 1.58-8.803-.79z" fill-rule="evenodd"></path></svg></span>给蛙蛙一票(${st.votes}票)</button>`);
                    item.lastElementChild.onclick = function () { vote_wawa(userid, name, tag) }
                }
            }
        }
    })
}

(function () {
    blockUsers_button();
    blockUsers_button_people();
})();