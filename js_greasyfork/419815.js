// ==UserScript==
// @name         B站直播增强型关注列表 经典版
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  大点儿操作方便
// @author       SoraYuki
// @include      /https:\/\/live.bilibili.com\/.*/
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/419815/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA%E5%9E%8B%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%20%E7%BB%8F%E5%85%B8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/419815/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA%E5%9E%8B%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%20%E7%BB%8F%E5%85%B8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elem = document.createElement("button");
    elem.textContent = '关注列表';
    elem.style = 'position: absolute; top: 0px; left: 0px; width: 80px; height: 50px; z-index: 200000000;';

    elem.addEventListener('click', async function() {
        let result = await fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=1&page_size=10', {credentials: 'include'});
        let j = await result.json();
        let tbl = document.getElementById("sorayuki-follow-list");
        if (!(tbl === undefined || tbl === null)) {
            tbl.remove();
        } else {
            tbl = document.createElement("table");
            tbl.id = "sorayuki-follow-list";
            tbl.style = 'position: absolute; top: 50px; left: 0px; z-index: 200000000; background-color: white;';
            tbl.border = '2';
            document.body.append(tbl);
            let count = j.data.count;
            let offset = 0;
            while(count > offset) {
                if (offset > 0) {
                    let result = await fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=' + (offset / 10 + 1) + '&page_size=10', {credentials: 'include'});
                    j = await result.json();
                }

                for(let i = 0; i < j.data.rooms.length; ++i) {
                    let tr = document.createElement("tr");
                    let x = j.data.rooms[i];
                    let icon_td = document.createElement("td");
                    let icon_img = document.createElement("img");
                    icon_img.style = "width: 48px; height: 48px;";
                    icon_img.src = x.face;
                    icon_td.append(icon_img);
                    tr.append(icon_td);
                    let link_td = document.createElement("td");
                    let link_a = document.createElement("a");
                    link_a.textContent = '【' + x.uname + "】" + x.title;
                    link_a.href = x.link;
                    link_td.append(link_a);
                    tr.append(link_td);
                    tbl.append(tr);
                }
                offset += j.data.rooms.length;
            }
        }
    });

    document.body.append(elem);
})();