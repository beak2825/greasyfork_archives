// ==UserScript==
// @name         用户反馈直达
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用户反馈直达用户反馈直达
// @author       renyajun
// @match        https://www.wjx.cn/mobile/detailview.aspx?activity=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451624/%E7%94%A8%E6%88%B7%E5%8F%8D%E9%A6%88%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/451624/%E7%94%A8%E6%88%B7%E5%8F%8D%E9%A6%88%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function() {
    var wjid = document.querySelector("#divattrsign > div.query__data-details > dl.jsource > dd").innerHTML;
    var id1 = wjid.split("自定义链接(")[1];
    var id2 = id1.split(")")[0];
    var url = "https://www.wjx.cn/wjx/design/designstart.aspx?activity="+id2;
    //alert(url);
    var fuyuansu = document.querySelector("#divattrsign > div.query__data-details > dl.jsource");
    var xinyuansu = document.createElement("dd");
    fuyuansu.appendChild(xinyuansu);
    xinyuansu.innerHTML="<a target='_blank' style=font-size:16px;color:red;>查看问卷</a>";
    document.querySelector("#divattrsign > div.query__data-details > dl.jsource > dd:nth-child(3) > a").href = url;

})();