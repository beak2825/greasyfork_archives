// ==UserScript==
// @name         豆瓣电影分级
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  很喜欢IMDB APP上家长指导这个功能，下电影前可以参考一下，是否适合在投影上和家人一起看，所以给豆瓣做了这个扩展，请注意你所在的地区是否能正常访问imdb。
// @author       BigKnife
// @icon         https://img3.doubanio.com/favicon.ico
// @match        *://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @connect      www.imdb.com
// @downloadURL https://update.greasyfork.org/scripts/429162/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%86%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/429162/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%88%86%E7%BA%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    //https://www.imdb.com/title/tt123456/parentalguide

    var gimdbid;
    unsafeWindow.gDoc = "";

    unsafeWindow.getPG = function () {
        let imdbel = [...document.querySelectorAll('span')].find(s => s.innerText == 'IMDb:').nextSibling;
        let imdbid = imdbel.textContent.trim();
        gimdbid = imdbid;
        let info = document.querySelector('#info');
        info.insertAdjacentHTML('beforeend', '<div id="pginfo"></div>');
        info.insertAdjacentHTML('beforeend', '<div id="infodetail"></div>');
        let ss = "https://www.imdb.com/title/" + imdbid + "/parentalguide";
        GM_xmlhttpRequest({
            method: "GET",
            url: ss,
            onloadstart: function () {
                console.log("正在获取" + imdbid);
                document.querySelector("#gpg").innerText = "正在获取";
            },
            onload: function (response) {
                getPGHandleV2(response.responseText);
            }
        })
    }

    unsafeWindow.getField = function (doc, mark) {
        let tmp = doc.querySelector('div[data-testid="sub-section-' + mark + '"]');
        if (tmp == null) {
            return "";
        } else {
            let s = tmp.previousElementSibling.firstChild.innerText;
            s = s.replace("None", "无");
            s = s.replace("Mild", "轻微");
            s = s.replace("Moderate", "中等");
            s = s.replace("Severe", "严重");
            let c;
            if (s == "无") { c = "#d0d0d0" };
            if (s == "轻微") { c = "#c5e197" };
            if (s == "中等") { c = "#fbca8c" };
            if (s == "严重") { c = "#ffb3ad" };
            return '<span style="border-radius:2px;padding:3px 6px;background-color:' + c + '">' + s + '</span>';
        }
    }

    unsafeWindow.getDetailNum = function (doc, mark) {
        let tmp = doc.querySelector('div[data-testid="sub-section-' + mark + '"]');
        if (tmp == null) {
            return 0;
        } else {
            return tmp.querySelectorAll('div[data-testid="item-id"]').length + "条评论";
        }
    }

    unsafeWindow.detailHide = function () {
        let detail = document.querySelector('#infodetail');
        if (detail != null) {
            detail.innerHTML = "";
        }
    }

    unsafeWindow.getDetail = function (mark) {
        let tmp = gDoc.querySelector('div[data-testid="sub-section-' + mark + '"]');
        if (tmp == null) {
            return 0;
        } else {
            let detail = document.querySelector('#infodetail');
            let posts = tmp.querySelectorAll('div[data-testid="item-id"]');
            let s = "";
            for (var i = 0; i < posts.length; i++) {
                s += (i + 1) + "." + posts[i].textContent + "<br>";
            }
            s = s.replaceAll("Edit", "");
            s = "<a style='float:right' href='javascript:detailHide();'>收起</a><br>" + s;
            detail.innerHTML = s;
        }
    }

    unsafeWindow.getPGHandleV2 = function (html) {
        console.log("OK");
        document.querySelector("#gpg").innerText = "查看分级";
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        gDoc = doc;
        let nudity = getField(doc, "nudity") + "<a href='javascript:getDetail(\"nudity\");'>(" + getDetailNum(doc, "nudity") + ")</a>";
        let violence = getField(doc, "violence") + "<a href='javascript:getDetail(\"violence\");'>(" + getDetailNum(doc, "violence") + ")</a>";
        let profanity = getField(doc, "profanity") + "<a href='javascript:getDetail(\"profanity\");'>(" + getDetailNum(doc, "profanity") + ")</a>";
        let alcohol = getField(doc, "alcohol") + "<a href='javascript:getDetail(\"alcohol\");'>(" + getDetailNum(doc, "alcohol") + ")</a>";
        let fright = getField(doc, "frightening") + "<a href='javascript:getDetail(\"frightening\");'>(" + getDetailNum(doc, "frightening") + ")</a>";
        let pgstr = "性爱和裸体:" + nudity + "<br>暴力和血腥:" + violence + "<br>粗言俗语:" + profanity + "<br>酒精毒品和烟草:" + alcohol + "<br>恐怖和紧张场景:" + fright;
        let info = document.querySelector('#pginfo');
        info.innerHTML = pgstr;
    }

    let imdbel = [...document.querySelectorAll('span')].find(s => s.innerText == 'IMDb:');
    let imdbtext = [...document.querySelectorAll('#info > span.pl')].find(s => s.innerText == 'IMDb:').nextSibling;
    let tt = imdbtext.textContent.trim();
    let a = document.createElement('a');
    a.href = 'https://www.imdb.com/title/' + tt;
    a.target = '_blank';
    a.appendChild(document.createTextNode(tt));
    imdbtext.replaceWith(a);
    imdbel.nextSibling.nextSibling.insertAdjacentHTML('beforebegin', '<a id="gpg" href="javascript:getPG();" class="lnk-sharing" style="margin-right: 5px;">查看分级</a>');
})();