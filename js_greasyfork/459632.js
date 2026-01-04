// ==UserScript==
// @name               Books.com.tw: Shows Username on Login Page
// @name:zh-TW         博客來：強制顯示用戶名
// @description        Forces Books.com.tw to show username on login page.
// @description:zh-TW  強制博客來在登入頁面顯示用戶名。
// @icon               https://icons.duckduckgo.com/ip3/www.books.com.tw.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.1
// @license            MIT
// @match              https://cart.books.com.tw/member/login
// @match              https://cart.books.com.tw/member/login?*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/459632/feedback
// @downloadURL https://update.greasyfork.org/scripts/459632/Bookscomtw%3A%20Shows%20Username%20on%20Login%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/459632/Bookscomtw%3A%20Shows%20Username%20on%20Login%20Page.meta.js
// ==/UserScript==

document.getElementById("login_id").type = "text";
document.getElementById("login_id_eye").style.display = "none";
