// ==UserScript==
// @name         Pixiv Auto Like
// @name:zh-TW   Pixiv 自動點讚
// @description        Click **like** automatically in new illust pages
// @description:zh-TW  在新版頁面自動點讚
// @namespace    https://github.com/FlandreDaisuki
// @version      2.0.1
// @author       FlandreDaisuki
// @include      *://www.pixiv.net/*
// @require      https://unpkg.com/winkblue@0.1.1/dist/winkblue.umd.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACw0lEQVRYhe2YvU9TURjGDxGMX4lhZDK6ACGObv4BJixEggvuxNHJ3egKpb3FtooLpjAYXWyoyEAMCYNoYiLGQEKoiXyJQPko9D3nvI/DvdWCh9NzSYMdeJN3aNP79Hefc97n5F4hTitMecU2Eae8GCCcSMcpL7ximw1m+cRg/kItm6FO0hmTU//U/4Ip9SlQVYA8gugPOhp8DvtHXnBtSecojYpAUcKNlxILW4ylXcZ8ntE6LCGihDoHkLoBH6B1WOLbhq+xsMW49UZCxMICRQmjOQVTPf+q/DuuBNVPGJkza4zlNC4lXIE8ws3X0ihUqitD0r58HuH6iF3jzttDGkcCRQi/9tgqtrjDEBELUISQ27JrbBYZTSkXoD6C0naxbWKIXgtQL2GzaNdQzGhKOgIVpF1sfZ8h+ixAfYTVgl1jX7kCRQn3J82bsVS3s8o8KWUad8ftGo+mD2nYpuxskrBwxB6YXNQQcYcpixM+r2mjxuyGxuVnIXPo4lPCvfcaFGjuSaBrTOHMEweYoBsShK4xhd1g4EgDD6Y0LqQMv68EVLpLEfOXQMTIzZnjajgBlYt6QYeBCnOdM1Cc0Dgo0ZlV6JlQaE5L/0yqBNNPaE5L9EwodGYVGgelHSqMQ3ObGhzs8S9rjI5R5QejKa09gogQOkYVfuz4FzEDD6e1/Qx03UMtaQnmgxNXkEByRvtuRehAN6clUjMa6/sHJ+vDKuPaC4tLrg7VJ8xByQzsKWClAGRyjEyOsVLwvzMF/at5Rr1tQp2XzCN0v5NY2rUnr61WC4yW4QoHcqgpi/mZkv3O2CZ3sKJifPrJaEiQPdlDA5XlSXtGYj5vh9IMTC0x2jPSPb9CA5W5dXWI0D0uMbtRmiL+06QZjz8qnE85uFIVoHLHgtA7l/T7WOFZNaBqd+0D1dyjdM29bPgLVSOvY07LXL8BZ79TYIQHQXsAAAAASUVORK5CYII=
// @grant        none
// @compatible   firefox
// @compatible   chrome
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/369479/Pixiv%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/369479/Pixiv%20Auto%20Like.meta.js
// ==/UserScript==

/* global Winkblue */

// desktop layout
Winkblue.winkblue.on(`path[d^="M2,6"]`, async(pathEl) => {
  pathEl.closest('button')?.click();
});

// mobile layout
document.querySelector('.work-interactions-like')?.click();
Winkblue.winkblue.on(`meta[property="og:image"]`, async() => {
  document.querySelector('.work-interactions-like')?.click();
});