// ==UserScript==
// @name         jav tag copy
// @namespace    https://github.com/dyxcloud
// @version      0.5.8.1
// @description  获取页面的tag,返回带tag的文件名 "番号标题 #tag1 #tag2.."
// @author       dyxlike
// @include     *://*javlibrary.com/*
// @include     *://*javlib.com/*
// @include     *://*javbus.com/*
// @include     *://*avsox.*/*
// @include     *://*javdb.com*/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/405013/jav%20tag%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/405013/jav%20tag%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义黑名单标签列表
    const blackTags = ['单体作品', '單體作品', '数位马赛克', '數位馬賽克'];

    function javLibGetter(){
        let result = '';
        // 获取标题
        let title = document.querySelector('#video_title > h3').innerText;
        result+=title;

        // 获取star
        let starAs = document.querySelectorAll('span.star > a');
        let stars = Array.from(starAs)
            .map(a => a.text)
            .join("#");
        if (stars !== "") {
            result += " #" + stars;
        }

        // 获取发行商
        let label = document.querySelector('#video_label .text a')?.innerText;
        // 获取发行日期
        let releaseDate = document.querySelector('#video_date .text')?.innerText;
        if ((label && label !== "") || (releaseDate && releaseDate !== "")) {
            result += " ";
            if (label && label !== "") {
                result += ("#" + label);
            }
            if (releaseDate && releaseDate !== "") {
                result += ("#" + releaseDate);
            }
        }

        // 获取tag
        let tagAs = document.querySelectorAll('#video_genres span.genre > a');
        let validTags = Array.from(tagAs)
            .map(a => a.text)
            .filter(tag => !blackTags.includes(tag))
            .join("#");
        if (validTags !== "") {
            result += " #" + validTags;
        }
        return result;
    }

    function javLib(){
        let button = document.createElement('a');
        button.innerText='点击复制tag文件名';
        button.href="#";
        let video_info = document.querySelector('#video_info');
        video_info.append(button);

        button.onclick = function () {
            let result = javLibGetter();
            GM_setClipboard(result);
        };
    }

    function javBusGetter(){
        let result = '';
        // 获取标题
        let title = document.querySelector('body > div.container > h3').innerText;
        console.log("title="+title);
        result+=title;

        // 获取star
        let starAs = document.querySelectorAll('span.genre > a[href*="/star/"]');
        let stars = Array.from(starAs)
            .map(a => a.text)
            .join("#");
        if (stars !== "") {
            result += " #" + stars;
        }

        // 获取发行商
        let labelAs = document.querySelectorAll('#video_info a[href*="/label/"]');
        let label = labelAs.length > 0 ? labelAs[0].innerText : "";
        // 获取发行日期
        let releaseDateE = document.querySelectorAll('#video_info > p:nth-child(2)');
        let releaseDate = releaseDateE.length > 0 ? releaseDateE[0].innerText.replace("發行日期:", "").trim() : "";
        if (label !== "" || releaseDate !== "") {
            result += " ";
            if (label !== "") {
                result += ("#" + label);
            }
            if (releaseDate !== "") {
                result += ("#" + releaseDate);
            }
        }

        // 获取tag
        let tagAs = document.querySelectorAll('span.genre a[href*="/genre/"]');
        let validTags = Array.from(tagAs)
            .map(a => a.text)
            .filter(tag => !blackTags.includes(tag))
            .join("#");
        if (validTags !== "") {
            result += " #" + validTags;
        }
        return result;
    }

    function javBus(){
        let button = document.createElement('a');
        button.innerText='点击复制tag文件名';
        button.href="#";
        let video_info = document.querySelector('body > div.container > div.row.movie > div.col-md-3.info');
        video_info.append(button);

        button.onclick = function () {
            let result = javBusGetter();
            GM_setClipboard(result);
        };
    }

    function avSoxGetter(){
        let result = '';
        // 获取标题
        let title = document.querySelector('body > div.container > h3').innerText;
        console.log("title="+title);
        result+=title;

        // 获取star
        let starAs = document.querySelectorAll('#avatar-waterfall > a');
        let stars = Array.from(starAs)
            .map(a => a.children[1].innerText)
            .join("#");
        if (stars !== "") {
            result += " #" + stars;
        }

        // 获取tag
        let tagAs = document.querySelectorAll('span.genre a[href*="/genre/"]');
        let validTags = Array.from(tagAs)
            .map(a => a.text)
            .filter(tag => !blackTags.includes(tag))
            .join("#");
        if (validTags !== "") {
            result += " #" + validTags;
        }
        result+=("#无码");
        return result;
    }

    function avSox(){
        let button = document.createElement('a');
        button.innerText='点击复制tag文件名';
        button.href="#";
        let video_info = document.querySelector("div.col-md-3.info");
        video_info.append(button);

        button.onclick = function () {
            let result = avSoxGetter();
            GM_setClipboard(result);
        };
    }

    function javDbGetter(){
        let result = '';
        // 获取标题
        let title = document.querySelector('.title.is-4').innerText;
        console.log("title="+title);
        result+=title;

        // 获取star
        let starAs = document.querySelectorAll('nav.panel.movie-panel-info a[href*="/actors/"]');
        let stars = Array.from(starAs)
            .map(a => a.text)
            .join("#");
        if (stars !== "") {
            result += " #" + stars;
        }


        // 获取发行商
        let labelAs = document.querySelectorAll('.movie-panel-info a[href*="/publishers/"]');
        let label = labelAs.length > 0 ? labelAs[0].innerText : "";
        // 获取发行日期
        let releaseDateE = document.querySelectorAll('.movie-panel-info > div:nth-child(2)');
        let releaseDate = releaseDateE.length > 0 ? releaseDateE[0].innerText.replace("日期:", "").trim() : "";
        if (label !== "" || releaseDate !== "") {
            result += " ";
            if (label !== "") {
                result += ("#" + label);
            }
            if (releaseDate !== "") {
                result += ("#" + releaseDate);
            }
        }


        // 获取tag
        let tagAs = document.querySelectorAll('nav.panel.movie-panel-info a[href*="/tags"]');
        let validTags = Array.from(tagAs)
            .map(a => a.text)
            .filter(tag => !blackTags.includes(tag))
            .join("#");
        if (validTags !== "") {
            result += " #" + validTags;
        }
        return result;
    }

    function javDb(){
        let button = document.createElement('a');
        button.innerText='点击复制tag文件名';
        button.href="#";
        let video_info = document.querySelector(".panel.movie-panel-info");
        video_info.append(button);
        button.onclick = function () {
            let result = javDbGetter();
            GM_setClipboard(result);
        };
        video_info.append(document.createElement('br'));
        let button2 = document.createElement('a');
        button2.innerText='点击复制tag文件名(#无码)';
        button2.href="#";
        video_info.append(button2);
        button2.onclick = function () {
            let result = javDbGetter();
            GM_setClipboard(result+'#无码');
        };
    }

    function main(){
        let title = document.title;
        if ((/JAVLib/g).test(title)) {
            javLib();
        } else if ((/JavBus/g).test(title)) {
            javBus();
        } else if ((/AVSOX/g).test(title)) {
            avSox();
        } else if ((/JavDB/g).test(title)) {
            javDb();
        }
    }

    main();

})();