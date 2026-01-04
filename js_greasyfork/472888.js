// ==UserScript==
// @name         FreeBuf手机域名自动跳转至电脑域名
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  FreeBuf手机域名网页自动跳转至电脑域名网页
// @author       Ricky
// @match        *://m.freebuf.com/*
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAABmoD7/ZqA+/2agPv9moD7/////AP///wD///8AZqA+wGagPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/////wD///8A////AGagPsBmoD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv////8A////AP///wBmoD7AZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/////AP///wD///8AZqA+wGagPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/////wD///8A////AGagPsBmoD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv////8A////AP///wBmoD7AZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/////AP///wD///8AZqA+kGagPsBmoD7AZqA+wGagPsBmoD7AZqA+wGagPsBmoD7AZqA+/2agPv9moD7/ZqA+/////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AGagPv9moD7/ZqA+/2agPv////8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wBmoD7/ZqA+/2agPv9moD7/////AP///wD///8AZqA+YGagPoBmoD6AZqA+gGagPoBmoD6AZqA+gGagPoBmoD6AZqA+/2agPv9moD7/ZqA+/////wD///8A////AGagPsBmoD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv////8A////AP///wBmoD7AZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/////AP///wD///8AZqA+wGagPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/2agPv9moD7/ZqA+/////wD///8A////AGagPjBmoD5AZqA+QGagPkBmoD5AZqA+QGagPkBmoD5AZqA+QGagPv9moD7/ZqA+/2agPv////8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wBmoD7/ZqA+/2agPv9moD7/////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8ADgAAAA4AAAAOAAAADgAAAA4AAAAOAAAADgAAAA//AAAP/wAADgAAAA4AAAAOAAAADgAAAA4AAAAP/wAAD/8AAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472888/FreeBuf%E6%89%8B%E6%9C%BA%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%94%B5%E8%84%91%E5%9F%9F%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/472888/FreeBuf%E6%89%8B%E6%9C%BA%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%E7%94%B5%E8%84%91%E5%9F%9F%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = new URL(location.href);
    var re = /m\.freebuf\.com\/*/;
    if(re.test(url.hostname))// 二次正则匹配，避免误判
    {
        window.stop();// 停止加载当前页面
        url.hostname = url.hostname.replace(re, 'www.freebuf.com');// 替换域名
        location.assign(url.href);// 从当前页面会转为新页面
    }
})();
