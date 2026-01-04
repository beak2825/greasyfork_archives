// ==UserScript==
// @name         Togetter User Ban
// @namespace    https://greasyfork.org/ja/scripts/387330-togetter-user-ban
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://togetter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387330/Togetter%20User%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/387330/Togetter%20User%20Ban.meta.js
// ==/UserScript==

/**
 * ユーザーを表すデータ型
 * @typedef {Object} User
 * @property {string} userId
 * @property {string} icon
 */

/**
 * @param {string} userId 
 * @param {string} icon 
 * @returns {User}
 */
const User = (userId, icon) => {
    return { userId: userId, icon: icon };
};

/**
 * user1がuser2と同じユーザーを示すか判別します。
 * @param {User} user1 
 * @param {User} user2 
 */
const isSameUser = (user1, user2) => {
    return (user1.userId === user2.userId);
};

/**
 * 与えられた時間だけスレッドを停止します。
 * @param {number} ms ミリ秒
 */
const sleep = ms => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

/**
 * 文字列からHTMLElementを作り返します。
 * @param {string} h htmlを表現する文字列
 * @returns {Node}
 */
const html = h => {
    const div = document.createElement("div");
    div.insertAdjacentHTML("afterbegin", h);
    return div.firstChild;
}

/**
 * userListがuserを持っているか判別します。
 * @param {User[]} userList 
 * @param {User} user 
 */
const userContains = (userList, user) => userList.filter(i => isSameUser(i, user)).length > 0;

/**
 * objListをJSON CSVに変換して返します。
 * @param {{}[]} objList 
 */
const objListToJson = objList => objList.map(o => JSON.stringify(o)).join(",");

//-------------------------------------------------------------------------------------------------
const ele = {};

/**
 * バンリストの項目を返します。
 * @param {User} user
 */
ele.li = user => {
    const li = html(
    `<li class="clearfix" style="display: flex;">
        <a href="/id/${user.userId}" title="@${user.userId}" style="flex: auto;">
            <p class="">@${user.userId}</p>
            <img class="icon_24 lazy lazy-hidden loaded" src="${user.icon}">
        </a>
    </li>`);
    /** @type {HTMLElement} */
    // @ts-ignore
    const button = html(`<button style="width: 1.5em; height: 1.5em; font-size: 14px; margin: auto; margin-right: 5px; margin-left: 5px;">×</button>`);
    button.onclick = () => {
        dao.delete(user);
        li.parentElement.removeChild(li);
    };
    li.appendChild(button);
    return li;
};

/**
 * バンリストを返します。
 * @param {User[]} users
 */
ele.div = users => {
    const lis = users.map(u => ele.li(u));
    /** @type {HTMLElement} */
    // @ts-ignore
    const div = html(
    `<div class="side_box side_line_box list_recommend expandable scrollable">
        <h3 class="title">バンリスト</h3>
        <div class="main_box closed">
            <ul>
            </ul>
        </div>
    </div>`);
    lis.forEach(l => div.querySelector("div.main_box ul").appendChild(l));
    return div;
};

/**
 * ユーザーのバンやバン解除を行うボタンを返します。
 * @param {User} user
 */
ele.button = user => {
    const isBanned = userContains(dao.find(), user);
    const text = isBanned ? "バンしている" : "バンする";
    const clazz = isBanned ? "btn active" : "btn";
    /** @type {HTMLElement} */
    // @ts-ignore
    const button = html(`<a class="${clazz}" data-title="バンする" data-active-title="バンしている" data-active-hover-title="バンを解除する">${text}</a>`);
    const clickEvent = () => {
        const isActive = button.classList.contains("active");
        if (isActive) {
            dao.delete(user);
            button.setAttribute("class", "btn");
            button.innerText = button.getAttribute("data-title");
            console.log(`${user.userId}のバンを解除しました。`);
        } else {
            dao.add(user);
            button.setAttribute("class", "btn active");
            button.innerText = button.getAttribute("data-active-title");
            console.log(`${user.userId}をバンしました。`);
        };
    };
    const hoverEvent = () => {
        const isActive = button.classList.contains("active");
        if (!isActive) return false;
        button.innerText = button.getAttribute("data-active-hover-title");
    };
    const outEvent = () => {
        const isActive = button.classList.contains("active");
        if (!isActive) return false;
        button.innerText = button.getAttribute("data-active-title");
    };
    button.onclick = clickEvent;
    button.onmouseover = hoverEvent;
    button.onmouseout = outEvent;
    return button;
};

//-------------------------------------------------------------------------------------------------
const dao = {};

/**
 * ローカルストレージに保存されたユーザーの配列を返します。
 * @returns {User[]}
 */
dao.find = () => {
    const raw = localStorage.bannedUser;
    if (raw === undefined || raw === "[]") return [];
    return raw.split(/,(?={)/).map(i => JSON.parse(i));
};

/**
 * ローカルストレージにuserを保存します。
 * @param {User} user
 */
dao.add = user => {
    const bannedUsers = dao.find();
    if (!userContains(bannedUsers, user)) bannedUsers.push(user);
    const jsonList = objListToJson(bannedUsers);
    dao.save(jsonList);
};

/**
 * ローカルストレージからuserを消去します。
 * @param {User} user
 */
dao.delete = user => {
    const bannedUsers = dao.find();
    const newUserList = bannedUsers.filter(i => !isSameUser(i, user));
    const jsonList = objListToJson(newUserList);
    dao.save(jsonList);
};

/**
 * ローカルストレージのbannedUserキーに文字列を保存します。
 * @param {string} str 
 */
dao.save = str => localStorage.setItem("bannedUser", str);

//HTMLの取得と操作---------------------------------------------------------------------------------
/**
* 条件に一致した要素を見えなくします。
* @param {string} selector 消したい要素のセレクター
* @param {string} checkEleSel eleSelを祖先に持ち、かつattrを有する要素のセレクター
* @param {string} attr 要素を消す基準の属性。"text"を与えた場合はinnerTextを探す。
* @param {string[]} bannedList バンリスト
*/
const hideElement = (selector, checkEleSel, attr, bannedList) => {
    /** @type {NodeListOf<HTMLElement>} */
    const elementList = document.querySelectorAll(selector);
    const getProperty = e => (attr === "text") ? e.innerText : e.getAttribute(attr);
    Array.from(elementList)
        .filter(e => e.style.display !== "none")
        .filter(e => e.querySelector(checkEleSel) !== null)
        .forEach(e => {
            [e]
                .map(e => e.querySelector(checkEleSel))
                .map(getProperty)
                .filter(p => bannedList.includes(p))
                .forEach(p => {
                    e.style.display = "none";
                    console.log(`hideElement: 要素を消しました。(${p})`);    
                });
        });
};

/**
 * togetterサイトのフォローボタンを格納したボックスを返します。
 * バンボタンを設置するのに使います。
 */
const followBox = () => document.querySelector("#follow_box");

/**
 * togetterサイトのプロフィールボックスを返します。
 */
const profileBox = () => document.querySelector("div.profile_box").parentElement;

/**
 * バンボタンを設置します。
 */
const addBanButton = () => {
    const profile = profileBox();
    // @ts-ignore
    const userId = profile.querySelector("a.status_name").innerText.replace("@", "");
    const icon = profile.querySelector("img").getAttribute("src");
    const user = User(userId, icon);
    followBox().appendChild(ele.button(user));
};

/**
 * バンリストを設置します。
 */
const addBannedList = () => {
    const bannedUsers = dao.find();
    const div = ele.div(bannedUsers);
    document.querySelector("#right_wrap_middle .right_wrap").appendChild(div);
};

/**
 * Twitterのデフォルトアイコン
 */
const defaultIcon = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";

/**
 * userListからアイコンのリストを作り返します。 
 * @param {User[]} userList 
 */
const iconList = userList => {
    return userList
        .map(u => u.icon)
        .filter(i => i !== defaultIcon);
        debugger
};

/**
 * userListからIDのリストを作り変えします。
 * @param {User[]} userList 
 */
const idList = userList => {
    return userList
        .map(u => u.userId)
        .map(i => "@" + i);
};

/**
 * 特定のユーザーが作ったまとめを非表示にします。
 * @param {User[]} bannedList 非表示にしたいユーザーのリスト
 */
const hideMatome = bannedList => {
    const list = iconList(bannedList);
    hideElement("li.clearfix", "img.icon_24", "data-lazy-src", list);
};

/**
 * 特定のユーザーのコメントを非表示にします。
 * @param {User[]} bannedList 非表示にしたいユーザーのリスト
 */
const hideComment = bannedList => {
    const list = idList(bannedList);
    hideElement("#comment_box .list_box", ".status_name", "text", list);
};

/**
 * 最近見たまとめなどのまとめを非表示にします。
 * @param {User[]} bannedList 非表示にしたいユーザーのリスト
 */
const hideThumbList = bannedList => {
    const list = iconList(bannedList);
    hideElement("ul.simple_list.thumb_list li", "img.icon_20", "data-lazy-src", list);
};


/**
 * おすすめまとめの要素を非表示にします。
 * @param {User[]} bannedList 
 */
const hideRecommendList = bannedList => {
    const list = iconList(bannedList);
    hideElement(".list_recommend .clearfix", "img.icon_24", "data-lazy-src", list);
};

/**
 * 
 * @param {User[]} bannedList 
 */
const hideCommentPopular = bannedList => {
    const list = iconList(bannedList);
    hideElement(".comment_popular .clearfix", "img.icon_24", "data-lazy-src", list);
};

/**
 * @param {Function} callback
 * @param {number} ms
 */
const thread = async (callback, ms = 300) => {
    while (true) {
        callback();
        await sleep(ms);
    };
};

/**
 * selectorの要素に何らかの変更が加えられたとき、callbackを呼びます。
 * @param {MutationCallback} callback 
 * @param {string} selector 
 * @param {MutationObserverInit} options 
 */
const observe = (callback, selector, options = { childList: true }) => {
    // @ts-ignore
    callback();
    const observer = new MutationObserver(callback);
    const content = document.querySelector(selector);
    observer.observe(content, options);
};

(async () => {
    'use strict';

    const bannedList = dao.find();
    hideThumbList(bannedList);
    hideRecommendList(bannedList);
    hideCommentPopular(bannedList);
    addBannedList();

    if (location.href.startsWith("https://togetter.com/id/")) {
        addBanButton();
        return false;
    };

    if (location.href.startsWith("https://togetter.com/li/")) {
        addBanButton();
        observe(() => hideComment(bannedList), "#comment_box");
        return false;
    };
    
    observe(() => hideMatome(bannedList), ".simple_list");
    
})();