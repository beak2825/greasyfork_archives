// ==UserScript==
// @name         酷狗美化(配合"酷狗美化免费vip"使用)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用动听的音乐温暖你我
// @author       煮酒

// @match        https://www.kugou.com/

// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/456181/%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%28%E9%85%8D%E5%90%88%22%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%E5%85%8D%E8%B4%B9vip%22%E4%BD%BF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456181/%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%28%E9%85%8D%E5%90%88%22%E9%85%B7%E7%8B%97%E7%BE%8E%E5%8C%96%E5%85%8D%E8%B4%B9vip%22%E4%BD%BF%E7%94%A8%29.meta.js
// ==/UserScript==
console.log("==================================插件启动成功==================================")

var down_load = document.getElementsByClassName("download")[0];
var sliderWrap_ = document.getElementsByClassName("sliderWrap")[0];
down_load.remove()
sliderWrap_.remove()



