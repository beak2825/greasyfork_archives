// ==UserScript==
// @name         Последние победы
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  переходит в поиск на последние победы
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @include      /^https:\/\/(lolz\.guru|lolz\.live|zelenka\.guru)/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464759/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%B1%D0%B5%D0%B4%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464759/%D0%9F%D0%BE%D1%81%D0%BB%D0%B5%D0%B4%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D0%B1%D0%B5%D0%B4%D1%8B.meta.js
// ==/UserScript==

function init() {
    GM_addStyle(`.maxwinIcon {background-image: url("data:image/svg+xml,%3Csvg width='50' height='48' viewBox='0 0 50 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.50006 25C2.50006 23.6193 3.61935 22.5 5.00005 22.5H45.0001C46.3808 22.5 47.5001 23.6193 47.5001 25V37.5001C47.5001 43.0229 43.023 47.5 37.5001 47.5H12.5001C6.97722 47.5 2.50006 43.0229 2.50006 37.5001V25ZM8.75009 27.5001C8.05975 27.5001 7.50001 28.0597 7.50001 28.75V37.5001C7.50001 40.2614 9.73858 42.5 12.5001 42.5H37.5001C40.2615 42.5 42.5001 40.2614 42.5001 37.5001V28.75C42.5001 28.0597 41.9404 27.5001 41.2501 27.5001H8.75009Z' fill='%23505050'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M42.5 14.9999H7.49999C6.11929 14.9999 5 16.1193 5 17.5V20C5 21.3807 6.11929 22.4999 7.49999 22.4999H42.5C43.8807 22.4999 45.0001 21.3807 45.0001 20V17.5C45.0001 16.1193 43.8807 14.9999 42.5 14.9999ZM7.49999 10C3.35786 10 0 13.3578 0 17.5V20C0 24.142 3.35786 27.5 7.49999 27.5H42.5C46.6422 27.5 50 24.142 50 20V17.5C50 13.3578 46.6422 10 42.5 10H7.49999Z' fill='%23505050'/%3E%3Cpath d='M22.5001 10H27.5V47.4999H22.5001V10Z' fill='%23505050'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20 15C15.858 15 12.5001 11.6422 12.5001 7.50004C12.5001 3.35787 15.858 0 20 0C21.9209 0 23.6732 0.722144 25.0001 1.90973C26.327 0.722144 28.0792 0 30 0C34.1422 0 37.5001 3.35787 37.5001 7.50004C37.5001 11.6422 34.1422 15 30 15H20ZM20 5.00001C21.3808 5.00001 22.5001 6.1193 22.5001 7.50004V10.0001H20C18.6193 10.0001 17.5001 8.88072 17.5001 7.50004C17.5001 6.1193 18.6193 5.00001 20 5.00001ZM27.5001 10.0001H30C31.3808 10.0001 32.5001 8.88072 32.5001 7.50004C32.5001 6.1193 31.3808 5.00001 30 5.00001C28.6193 5.00001 27.5001 6.1193 27.5001 7.50004V10.0001Z' fill='%23505050'/%3E%3C/svg%3E%0A");`);

    var userId = document.querySelector('a[href*="userthreads\/"]')?.href.match(/userthreads\/(\d+)/)[1];
    console.log('ID пользователя:', userId);

    const lastwin = document.createElement("a");
    lastwin.href = `search/search/?keywords=@${userId}&users=root&nodes[]=771&order=date&type=post`;
    lastwin.target = "_blank";
    lastwin.textContent = "Последние победы";
    lastwin.classList.add("button");

    const icon = document.createElement("span");
    icon.classList.add("icon", "maxwinIcon");
    lastwin.prepend(icon);

    // console.log(lastwin);

    document.querySelector(".userContentLinks")?.append(lastwin.cloneNode(true));
}

function onLoad(fn) {
    document.addEventListener('page:load', fn);
    document.addEventListener('turbolinks:load', fn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

onLoad(init);