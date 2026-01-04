// ==UserScript==
// @name         1001TL：网易云 & 腾讯音乐搜索
// @namespace    im.outv.1001tl.customsearch
// @version      1.0
// @description  将网易云与腾讯音乐的搜索链接加入 1001tracklists 的搜索区域。
// @author       Outvi V
// @match        https://www.1001tracklists.com/tracklist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376901/1001TL%EF%BC%9A%E7%BD%91%E6%98%93%E4%BA%91%20%20%E8%85%BE%E8%AE%AF%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/376901/1001TL%EF%BC%9A%E7%BD%91%E6%98%93%E4%BA%91%20%20%E8%85%BE%E8%AE%AF%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

function us__genElement(title, href, fatag){
    let elem = document.createElement('a')
    elem.target = "_blank"
    elem.rel = "noopener noreferer"
    elem.classList = "iBlock mAlign floatL actionHover"
    elem.title = "search " + title
    elem.href = href
    let elemfa = document.createElement('i')
    elemfa.classList = "fa fa-32 fa-" + fatag + " mAlign"
    elem.append(elemfa)
    return elem
}

(function() {
    'use strict';
    let q = document.querySelectorAll('.tlpItem div[title="search for media"] a')[0].href.match('q=(.*)$')[1];
    for (let i of document.querySelectorAll('.tlpItem div[title="search for media"]')){
        i.append(us__genElement("netease cloudmusic", "https://music.163.com/#/search/m/?s=" + q, "music"))
        i.append(us__genElement("qq music", "https://y.qq.com/portal/search.html#t=song&w=" + q, "qq"))
    }
})();