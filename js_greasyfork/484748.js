// ==UserScript==
// @name         Komica 鍵盤上下頁
// @version      1.1
// @description  Komica 網站使用鍵盤來上下頁
// @namespace    https://greasyfork.org
// @include      http://*.komica.org/*
// @include      https://*.komica.org/*
// @include      http://*.komica1.org/*
// @include      https://*.komica1.org/*
// @grant        none
// @license MIT
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/484748/Komica%20%E9%8D%B5%E7%9B%A4%E4%B8%8A%E4%B8%8B%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/484748/Komica%20%E9%8D%B5%E7%9B%A4%E4%B8%8A%E4%B8%8B%E9%A0%81.meta.js
// ==/UserScript==

hotkeys('w+a,w+d,up+left,up+right', function (event, handler){
   
        switch (handler.key) {
            case 'up+left':
                document.querySelector('input[type="submit"][value="上一頁"]')?.click();
                break;
            case 'up+right':
                document.querySelector('input[type="submit"][value="下一頁"]')?.click();
                break;
            case 'w+a':
                document.querySelector('input[type="submit"][value="上一頁"]')?.click();
                setTimeout(() => window.scrollTo(0, 0), 150);break;
            case 'w+d':
                document.querySelector('input[type="submit"][value="下一頁"]')?.click();
                setTimeout(() => window.scrollTo(0, 0), 150);break;
            default:
        }
    });