// ==UserScript==
// @name        OPlus for reddit
// @namespace   http://www.reddit.com/user/nmtake
// @description スレッドをお気に入りに登録して新着コメント数を一覧チェックするスクリプトです。その他おまけつき
// @include     https://www.reddit.com/*
// @version     0.3
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @license     public domain
// @author      nmtake
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/10291/OPlus%20for%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/10291/OPlus%20for%20reddit.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* global window, document, console, GM_addStyle, GM_registerMenuCommand */
/* eslint no-console:0, no-alert:0, new-cap:0 */

(function() {

"use strict";
var DB_NAME = "OkiniiriPlusForReddit";
var STORE_TLINKS = "tLinks";
var PROGRAM_NAME = "お気に入り＋ for reddit";

var gDB = null;
var DB_VERSION = 25;

function $(context, selector) {
    return context.querySelector(selector);
}

function $$(context, selector) {
    var nodeList = context.querySelectorAll(selector);
    return [].slice.call(nodeList);
}

function deleteDB() {
    if (gDB) {
        gDB.close();
    }
    if (window.confirm(PROGRAM_NAME + " のデータベース " + DB_NAME + " を削除します。よろしいですか？")) {
        var req = window.indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = function() {
            window.alert("データベースを削除しました。");
        };
        req.onerror = function() {
            window.alert("データベースを削除できませんでした。");
        };
    }
}

function upgradeDB(event) {
    window.alert("データベースを更新します。");
    gDB = event.target.result;
    var store;
    if (event.oldVersion < 1) { // 新規
        store = gDB.createObjectStore(STORE_TLINKS, {keyPath: "fullname"});
        store.createIndex("commentsCount", "commentsCount", {unique: false});
        store.createIndex("lastReadTime", "lastReadTime", {unique: false});
        store.createIndex("lastReadCommentsCount", "lastReadCommentsCount", {unique: false});
    }
}

function getJSON(path, onsuccess, onerror) {
    console.log("GET: ", path);
    var req = new window.XMLHttpRequest();
    req.responseType = "json";
    req.open("GET", path, true);
    req.onload = function() {
        try {
            if (req.status >= 200 && req.status < 400) {
                onsuccess(req.response);
            }
        } catch (e) {
            console.log(e);
        }
    };
    req.onerror = onerror ? onerror : console.log;
    req.send();
}

function makeFragment(text) {
    var template = document.createElement("template");
    template.innerHTML = text;
    return template.content;
}

function escapeHTML(html) {
    var s = html.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/"/g, "&quot;");
    return s.replace(/'/g, "&#039;");
}

function TLink(fullname, lastReadTime, lastReadCommentsCount, isFavorite, addToFavoritesTime) {
    this.fullname = fullname;
    this.lastReadCommentsCount = lastReadCommentsCount;
    this.lastReadTime = lastReadTime;
    this.addToFavoritesTime = addToFavoritesTime;
    this.isFavorite = isFavorite;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError("Array.prototype.find called on null or undefined");
    }
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;
    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

function getFullname(tlink) {
    var fullname = tlink.getAttribute("data-fullname");
    if (fullname) {
        return fullname;
    }
    // [deleted] されている場合
    var a = $(tlink, "a.comments");
    var m = a.pathname.match(/\/r\/.+\/comments\/(.+?)\//);
    if (m && m.length > 1) {
        return "t3_" + m[1];
    }
    throw Error("getFullname(): fullname not found");
}

function getCommentsCount(tlink) {
    var a = $(tlink, "a.comments");
    var m = a.textContent.match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
}

function getCommentsURL(tlink) {
    var a = $(tlink, "a.comments");
    return a.href;
}

var CSS = `
    .op-unreads-button {
        width: 42px;
        height: 15px;
        border: 1px solid gray;
        border-radius: 3px;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        color: gray;
        background-color: white;
        margin: 0 3px;
        vertical-align: text-bottom;
        cursor: pointer;
    }
    .op-op-button {
        color: gray;
        font-size: 12px;
    }
    .op-timestamp-jp {
        color: green;
    }
    #op-favorites-outer {
        position: fixed;
        top: 5%;
        left: 5%;
        right: 5%;
        bottom: 5%;
        z-index: 100;
        width: 90%;
        background-color: white;
        color: gray;
        border: 3px solid gray;
        border-radius: 5px;
        overflow: scroll;
    }
    .op-favorites-inner {
        position: relative;
    }
    .op-commands {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: white;
        padding: 5px 1px;
        font-size: 12px;
        border: 2px solid gray;
        border-radius: 5px;
    }
    .op-favorites {
        table-layout: fixed;
        font-size: 12px;
        background-color: white;
        width: 100%; /* なぜか必要*/
    }
    .op-favorites tr:nth-of-type(2n) {
        background-color: #E0E0E0;
    }
    .op-favorites th {
        text-align: center;
        padding: 1 3px;
        border-bottom: 1px solid lightgray;
    }
    .op-favorites th.op-toggle-favorite {
        width: 3ch;
        text-align: center;
    }
    .op-favorites th.op-subreddit {
        width: 15ch;
    }
    .op-favorites th.op-ncomments {
        width: 5ch;
        text-align: center;
    }
    .op-favorites th.op-unreads {
        width: 5ch;
        text-align: center;
    }
    .op-favorites th.op-title {
        width: 80ch;
    }
    .op-favorites td.op-ncomments, .op-favorites td.op-unreads {
        text-align: right;
    }
    .op-favorites td {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding: 2px 5px;
    }
    #op-alert {
        position: fixed;
        top: 30px;
        left: 30px;
        padding: 10px;
        border: 1px solid gray;
        border-radius: 5px;
        background-color: white;
    }
`;

var TOGGLE_FAVORITE_LABELS = {
    "o+": "o-",
    "o-": "o+",
    "+": "-",
    "-": "+"
};

function opAlert(message, duration) {
    var box = document.createElement("div");
    box.id = "op-alert";
    box.style.zIndex = "1000";
    var p = document.createElement("p");
    p.textContent = message;
    box.appendChild(p);
    document.body.appendChild(box);
    window.setInterval(function() {
        box.parentNode.removeChild(box);
    }, 2000);
}

function toggleFavorite(event) {
    if (!event.target.classList.contains("op-toggle-favorite")) {
        return;
    }
    console.log("toggleFavorite called");
    var button = event.target;
    var fullname = event.target.getAttribute("data-op-fullname");
    var transaction = gDB.transaction([STORE_TLINKS], "readwrite");
    var store = transaction.objectStore(STORE_TLINKS);
    var req = store.get(fullname);
    req.onsuccess = function(e) {
        try {
            var record = e.target.result || new TLink(fullname);
            if (record.isFavorite) {
                record.isFavorite = false;
                record.addToFavoritesTime = null;
            } else {
                record.isFavorite = true;
                record.addToFavoritesTime = new Date().getTime();
            }
            store.put(record);
            button.textContent = TOGGLE_FAVORITE_LABELS[button.textContent];
        } catch (ex) {
            console.log(ex);
        }
    };
}

function makeOPButton(fullname, text) {
    var button = document.createElement("span");
    button.className = "op-op-button op-toggle-favorite";
    button.textContent = escapeHTML(text);
    button.setAttribute("data-op-fullname", fullname);
    button.addEventListener("click", toggleFavorite);
    return button;
}

function makeUnreadsCountButton(count, url) { // -> button
    var button = document.createElement("span");
    button.className = "op-unreads-button";
    button.textContent = count || "0";
    button.addEventListener("click", function(e) {
        e.target.textContent = "0";
        window.location.href = url;
    });
    return button;
}

function attachUnreadsCountButton(lastReadCommentsCount, tlink) {
    var unreadsCount = getCommentsCount(tlink) - lastReadCommentsCount;
    var button = makeUnreadsCountButton(unreadsCount, getCommentsURL(tlink));
    var title = $(tlink, "p.title");
    title.insertBefore(button, title.firstChild);
}

function attachOPButton(isFavorite, tlink) {
    var text = (isFavorite ? "o-" : "o+");
    var button = makeOPButton(getFullname(tlink), text);
    var flatList = $(tlink, ".flat-list.buttons");
    if (flatList) {
        flatList.appendChild(button);
    }
}

function attachButtonsToTLinks() {
    var transaction = gDB.transaction([STORE_TLINKS], "readonly");
    var store = transaction.objectStore(STORE_TLINKS);
    var tlinks = $$(document, ".thing.link");
    var req;
    tlinks.forEach(function(tlink) {
        req = store.get(getFullname(tlink));
        req.onsuccess = function(tlink_, e) {
            try {
                var rec = e.target.result;
                if (rec) {
                    if (rec.lastReadCommentsCount) {
                        attachUnreadsCountButton(rec.lastReadCommentsCount, tlink_);
                    }
                    attachOPButton(rec.isFavorite, tlink_);
                } else {
                    attachOPButton(false, tlink_);
                }
            } catch (ex) {
                console.log(ex);
            }
        }.bind(null, tlink);
    });
}

function highlightUnreadComment(comment, lastReadTime) { // -> undefined
    // .thing.comment はコメントがつくと入れ子になるので注意
    var tagline = $(comment, ".tagline");
    var times = $$(tagline, "time");
    var time = times[times.length - 1];
    time = new Date(time.getAttribute("datetime")).getTime();
    // 旧データベース用
    if (typeof lastReadTime === "string" || typeof lastReadTime === "object") {
        lastReadTime = new Date(lastReadTime).getTime();
    }
    if ((time - lastReadTime) > 0) {
        var usertext = $(comment, ".usertext-body");
        if (usertext) { usertext.style.backgroundColor = "#FFFEC7"; }
    }
}

function highlightUnreadComments() {
    var transaction = gDB.transaction([STORE_TLINKS], "readonly");
    var store = transaction.objectStore(STORE_TLINKS);
    var tlink = $(document, ".thing.link");
    var fullname = getFullname(tlink);
    var req = store.get(fullname);
    req.onsuccess = function(e) {
        try {
            var rec = e.target.result || new TLink(fullname);
            for (var comment of $$(document, ".thing.comment")) {
                highlightUnreadComment(comment, rec.lastReadTime);
            }
        } catch (ex) {
            console.log(ex);
        }
    };
}

function updateLastReadInfo() {
    var transaction = gDB.transaction([STORE_TLINKS], "readwrite");
    var store = transaction.objectStore(STORE_TLINKS);
    var tlink = $(document, ".thing.link");
    var fullname = getFullname(tlink);
    var req = store.get(fullname);
    req.onsuccess = function(e) {
        try {
            var rec = e.target.result || new TLink(fullname);
            rec.lastReadCommentsCount = getCommentsCount(tlink);
            rec.lastReadTime = new Date().getTime();
            store.put(rec);
        } catch (ex) {
            console.log(ex);
        }
    };
}

// Frontpage に表示される .thing.interestbar は .entry を含まない
function timeToJapaneseTime(thing) {
    var entry = $(thing, ".entry"); // .entry は .child を含まない
    if (!entry) {
        return;
    }
    for (var time of $$(entry, "time")) {
        // reddit.js の live-timestamp は time.textContent を断続的に書き換える。なので仕方なく非表示
        time.style.display = "none";
        var lt = new Date(time.getAttribute("datetime"));
        var span = document.createElement("span");
        span.className = "op-timestamp-jp";
        if (time.classList.contains("edited-timestamp")) {
            span.textContent = "(" + lt.toLocaleString("ja-JP") + ")";
        } else {
            span.textContent = lt.toLocaleString("ja-JP") + " ";
        }
        time.parentNode.insertBefore(span, time);
    }
}

function openFavorites() {
    console.log("openFavorites called");
    var transaction = gDB.transaction([STORE_TLINKS], "readonly");
    var store = transaction.objectStore(STORE_TLINKS);
    var i = 0;
    var tlinks = [];
    store.openCursor().onsuccess = function(event) {
        try {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.isFavorite) {
                    tlinks.push(cursor.value);
                    i += 1;
                }
                if (i < 99) {
                    cursor.continue();
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    transaction.oncomplete = function() {
        try {
            var fullnames = tlinks.map(function(elem) { return elem.fullname; });
            var path = "/api/info.json?id=" + fullnames.join(",") + "&limit=100&raw_json=1";
            opAlert("新着データを取得しています...", 3000);
            getJSON(path, renderFavorites.bind(null, tlinks), function(e) { console.log(e); });
        } catch (ex) {
            console.log(ex);
        }
    };
}

function compareUnreads(order, a, b) {
    var a2 = parseInt($(a, ".op-unreads").textContent);
    var b2 = parseInt($(b, ".op-unreads").textContent);
    return (a2 - b2) * order;
}

function compareSubreddit(order, a, b) {
    var a2 = $(a, ".op-subreddit").textContent;
    var b2 = $(b, ".op-subreddit").textContent;
    if (a2 > b2) {
        return 1 * order;
    } else if (a2 === b2) {
        return 0;
    } else {
        return -1 * order;
    }
}

function bindSorterTo(elem, func) {
    if (!elem || !func) {
        return;
    }
    elem.addEventListener("click", function() {
        try {
            var outer = $(document, "#op-favorites-outer");
            var tbody = $(outer, "tbody");
            var order = parseInt(elem.getAttribute("data-sort-order")) || -1;
            elem.setAttribute("data-sort-order", order * -1);
            var rows = $$(tbody, "tr");
            tbody.innerHTML = "";
            var sorted = rows.sort(func.bind(null, order));
            for (var tr of sorted) {
                tbody.appendChild(tr);
            }
        } catch(ex) {
            console.log(ex);
        }
    });
}

// XXX 長杉
function renderFavorites(cache, json) {
    console.log("renderFavorites called");
    try {
        var html = `
          <div id="op-favorites-outer"><!-- fixed -->
            <div class="op-favorites-inner"><!-- relative -->
              <div class="op-commands">
                <span class="op-update-favorites">[更新]</span>
                <span class="op-close-favorites">[閉じる]</span>
              </div>
              <table class="op-favorites">
                <thead>
                  <tr>
                    <th class="op-toggle-favorite"></th>
                    <th class="op-subreddit">subreddit</th>
                    <th class="op-ncomments">コメ数</th>
                    <th class="op-unreads">未読数</th>
                    <th class="op-title">title</th>
                  </tr>
                </thead>
                <tbody>
        `;

        html += json.data.children.map(function(child) {
            var needle = cache.find(function(e) { return e.fullname === child.data.name; });
            var unreadsCount = parseInt(child.data["num_comments"] - (needle.lastReadCommentsCount || 0));
            var a = document.createElement("a");
            a.href = child.data.permalink;
            var permalink = a.href;
            a.href = "/r/" + child.data.subreddit;
            var subredditlink = a.href;
            var eh = escapeHTML;
            return `
                  <tr>
                    <td class="op-toggle-favorite" data-op-fullname="${eh(child.data.name)}">${needle.isFavorite ? "-" : "+"}</td>
                    <td class="op-subreddit"><a href="${subredditlink}">${eh(child.data.subreddit)}</a></td>
                    <td class="op-ncomments">${parseInt(child.data["num_comments"])}</td>
                    <td class="op-unreads">${unreadsCount || "-"}</td>
                    <td class="op-title"><a href="${permalink}">${eh(child.data.title)}</a></td>
                  </tr>
            `;
        }).join("\n");

        html += `
                </tbody>
              </table>
            </div>
          </div>
        `;
        document.body.appendChild(makeFragment(html));
        var container = $(document, ".op-favorites-inner");
        bindSorterTo($(container, "th.op-unreads"), compareUnreads);
        bindSorterTo($(container, "th.op-subreddit"), compareSubreddit);
        container.addEventListener("click", toggleFavorite);
        $(container, ".op-update-favorites").addEventListener("click", function() {
            var outer = $(document, "#op-favorites-outer");
            if (outer) {
                outer.parentNode.removeChild(outer);
            }
            openFavorites();
        });
        $(container, ".op-close-favorites").addEventListener("click", function() {
            console.log("close called");
            try {
                var outer = $(document, "#op-favorites-outer");
                outer.parentNode.removeChild(outer);
            } catch(e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

function main() {
    try {
        console.log("main() called");
        if (!window.indexedDB) {
            window.alert("お使いのブラウザではお気に入り＋ for redditを使用できません。");
            return 1;
        }
        GM_addStyle(CSS);
        GM_registerMenuCommand(PROGRAM_NAME + ": " + "データベースを削除する", deleteDB);
        GM_registerMenuCommand(PROGRAM_NAME + ": " + "最近開いたスレを開く", openFavorites);
        document.addEventListener("keydown", function(e) {
            if (e.keyCode === 79 && e.ctrlKey) { // Ctrl+O
                var outer = $(document, "#op-favorites-outer");
                if (outer) {
                    outer.parentNode.removeChild(outer);
                } else {
                    openFavorites();
                }
                e.preventDefault();
            }
        });
        $$(document, ".thing.comment, .thing.link").forEach(timeToJapaneseTime);
        var req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = upgradeDB;
        req.onsuccess = function(event) {
            try {
                gDB = event.target.result;
                var classList = document.body.classList;
                if (classList.contains("comments-page")) {
                    highlightUnreadComments();
                    updateLastReadInfo();
                }
                attachButtonsToTLinks();
            } catch (e) {
                console.log(e);
            }
        };
        req.onerror = function() {
            window.alert("データベースを開けませんでした。");
        };
    } catch (ex) {
        console.log(ex);
    }
}

document.addEventListener("DOMContentLoaded", main, false);

})();

