// ==UserScript==
// @name:zh-CN        Telegraph 反图片防盗链
// @name:zh-TW        Telegraph 反圖片防盜鏈
// @name              Display anti-hotlinking images for Telegraph
// @version           0.03
// @namespace         https://greasyfork.org/users/133518
// @description:zh-CN 不为跨域请求发送 referrer, 让 Telegraph 可以显示防盗链图片
// @description:zh-TW 不為跨網域請求附送 referrer, 使 Telegraph 可以顯示防盜鏈媒體圖片
// @description       Don't send the Referer header for cross-origin requests to display anti-hotlinking images on Telegraph
// @include           http*://*.telegra.ph/*
// @include           http*://telegra.ph/*
// @icon              https://telegra.ph/images/favicon_2x.png
// @run-at            document-body
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/432923/Display%20anti-hotlinking%20images%20for%20Telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/432923/Display%20anti-hotlinking%20images%20for%20Telegraph.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.name = "referrer";
meta.content = "no-referrer";
document.getElementsByTagName('head')[0].appendChild(meta);
var img_list = document.getElementsByTagName('img')
for (var i = 0; i < img_list.length; i++) {
    img_list[i].setAttribute('referrerPolicy', 'same-origin')
}
