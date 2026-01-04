// ==UserScript==
// @name         91porn视频直链获取J
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在91视频播放的下方添加m3u8下载直链 借鉴:https://greasyfork.org/zh-CN/scripts/427514-91porn%E5%8E%BB%E5%B9%BF%E5%91%8A-%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95
// @author       You
// @match        */view_video.php*viewkey*
// @icon         https://www.google.com/s2/favicons?domain=91porn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454551/91porn%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E8%8E%B7%E5%8F%96J.user.js
// @updateURL https://update.greasyfork.org/scripts/454551/91porn%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E8%8E%B7%E5%8F%96J.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //strencode2 = unescape;
    var jm = unescape(document.documentElement.outerHTML.split("document.write(strencode2(\"")[1].split("\"")[0]);
    var u = jm.split("<source src='")[1].split("'")[0];
    console.log("91视频地址：" + u);

    var uu = u.split('/');
    uu = uu[uu.length - 1].split('.');
    if (uu.length > 1) {
        uu.pop()
    }
    var id = uu.join('');

    var a = document.createElement("a");
    var name = document.title.replace(' Chinese homemade video', '');
    name = name.replace(/([\:\/\\<\|\"\?>\*“”])/g, "").replace('"', '');
    if (u.indexOf(".mp4") > 0) {
        a.text = 'curl -o "' + id + '_' + name + '.mp4" "' + u + '" -k';
    } else {
        a.text = 'ffmpeg -y -i "' + u + '" "' + id + '_' + name + '.mp4"';
    }
    a.setAttribute("href", u)
    document.getElementById("videodetails").appendChild(a);
})();
