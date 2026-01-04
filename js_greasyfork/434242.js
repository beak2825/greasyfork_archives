// ==UserScript==
// @name                Twitter: Download Video【mod for kiwi】
// @name:zh-TW          Twitter 下載影片【mod for kiwi】
// @name:zh-CN          Twitter 下载视频【mod for kiwi】
// @name:ja             Twitter ビデオをダウンロード
// @name:ko             Twitter 비디오 다운로드
// @name:ru             Twitter Скачать видео
// @version             1.0.7
// @description         One button click to direct video download web page.
// @description:zh-TW   即按前往下載影片的網頁。
// @description:zh-CN   一键导向下载视频的网页。
// @description:ja      ボタンをクリックして、ビデオのダウンロードWebページに移動します。
// @description:ko      한 번의 클릭으로 비디오 다운로드 웹 사이트를 탐색하십시오.
// @description:ru      Нажмите кнопку, чтобы перейти на страницу загрузки видео.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/M9oO8K9.png
// @include             https://twitter.com/*
// @include             https://mobile.twitter.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/434242/Twitter%3A%20Download%20Video%E3%80%90mod%20for%20kiwi%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434242/Twitter%3A%20Download%20Video%E3%80%90mod%20for%20kiwi%E3%80%91.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icons made by https://www.flaticon.com/authors/freepik
    const svg = `<svg viewBox="0 0 512 512"><path d="M472,313v139c0,11.028-8.972,20-20,20H60c-11.028,0-20-8.972-20-20V313H0v139c0,33.084,26.916,60,60,60h392 c33.084,0,60-26.916,60-60V313H472z"></path></g></g><g><g><polygon points="352,235.716 276,311.716 276,0 236,0 236,311.716 160,235.716 131.716,264 256,388.284 380.284,264"></polygon></svg>`;
    const resource = "https://www.savetweetvid.com/result?url=";
    let currentUrl = document.location.href;
    let updating = false;

    init(10);

    locationChange();

    window.addEventListener("scroll", update);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(findVideo1, 500 * i);
            setTimeout(findVideo2, 500 * i);
            setTimeout(sensitiveContent, 500 * i);
        }
    }

    function findVideo1() {
        // video play button
        document.querySelectorAll("[data-testid='playButton']").forEach(button => {
            // thumbnail
            button.parentElement.querySelectorAll("img:not(.download-set)").forEach(thumbnail => {
                thumbnail.classList.add("download-set");
                const url = thumbnail.src;
                situation(url, thumbnail);
            });
        });
    }

    function findVideo2() {
        // video
        document.querySelectorAll("video:not(.download-set)").forEach(video => {
            video.classList.add("download-set");
            const url = video.poster;
            situation(url, video);
        });
    }

    function situation(url, video) {
        // situation 1: gif
        if (url.includes("tweet_")) findMenu(video, "gif");
        // situation 2: video
        else if (url.includes("ext_tw_") || url.includes("amplify_") || url.includes("media")) findMenu(video, "video");
        // situation 3: unknown
        else console.log("Error: Unknown");
    }

    function findMenu(child, type) {
        const article = child.closest("article:not(.article-set)");
        if (!article) return;
        article.classList.add("article-set");
        const menus = article.querySelectorAll("[data-testid='caret']");
        menus.forEach(menu => menu.addEventListener("click", () => {
            clickMenu(article, type, false);
            if (type === "gif") clickMenu(article, type, true);
        }));
    }

    function clickMenu(article, type, convert) {
        // check exist.
        if (!!document.querySelector(`.option-download-${convert}-set`)) return;
        // wait menu.
        if (!document.querySelector("[role='menuitem']")) {
            setTimeout(() => clickMenu(article, type, convert), 100);
            return;
        }
        const menu = document.querySelector("[role='menuitem']").parentElement;
        // add "download" option.
        const option = document.createElement("div");
        option.style.padding = "5px 0 5px 15px";
        option.className = "css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-ymttw5 r-1yzf0co r-o7ynqc r-6416eg r-13qz1uu option-download-set";
        option.addEventListener("mouseenter", () => option.classList.add(getTheme(["r-1u4rsef", "r-1ysxnx4", "r-1uaug3w"])));
        option.addEventListener("mouseleave", () => option.classList.remove(getTheme(["r-1u4rsef", "r-1ysxnx4", "r-1uaug3w"])));
        option.addEventListener("click", () => clickDownload(article, type, convert));
        // icon
        const icon = document.createElement("div");
        icon.className = "css-1dbjc4n r-1777fci";
        icon.innerHTML = svg;
        const svgElement = icon.querySelector("svg");
        svgElement.setAttribute("class", "r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-zso239 r-dnmrzs r-bnwqim r-1plcrui r-lrvibr");
        svgElement.classList.add(getTheme(["r-1re7ezh", "r-9ilb82", "r-111h2gw"]));
        // text
        const text1 = document.createElement("div");
        text1.className = "css-1dbjc4n r-16y2uox r-1wbh5a2";
        text1.style.textAlign = "center";
        text1.style.paddingTop = "15px";
        const text2 = document.createElement("div");
        text2.className = "css-901oao r-1qd0xha r-a023e6 r-16dba41 r-ad9z0x r-bcqeeo r-qvutc0";
        text2.classList.add(getTheme(["r-hkyrab", "r-1fmj7o5", "r-jwli3a"]));
        const text3 = document.createElement("span");
        text3.className = "css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0";
        text3.innerText = getLocalization(type, convert);
        // append
        menu.prepend(option);
        option.appendChild(icon);
        option.appendChild(text1);
        text1.appendChild(text2);
        text2.appendChild(text3);
    }

    function clickDownload(article, type, convert) {
        // gif
        if (type === "gif" && !convert) {
            let link;
            // condition 1: not play yet.
            article.querySelectorAll("video").forEach(video => {
                link = video.src;
            });
            // condition 2: playing.
            if (!link) {
                const image = [...article.querySelectorAll("img")].find(image => image.src.includes("video"));
                const id = image.src.split(/[/?]/)[4];
                link = `https://video.twimg.com/tweet_video/${id}.mp4`;
            }
            // open
            window.open(link);
        }
        // video
        else {
            const title = article.querySelector("time");
            const url = !!title ? title.parentElement.href : window.location.href;
            window.open(`${resource}${url}`);
        }
    }

    function getTheme(array) {
        const body = document.querySelector("body");
        const color = body.style.backgroundColor; // "rgb(21, 32, 43)"
        const red = color.match(/\d+/)[0]; // "21"
        switch (red) {
            case "255":
                return array[0]; // white
            case "0":
                return array[1]; // black
            default:
                return array[2]; // gray
        }
    }

    function getLocalization(type, convert) {
        let download = "Download";
        switch (document.querySelector("html").lang) {
            case "zh-Hant":
                download = "下載";
                break;
            case "zh":
                download = "下载";
                break;
            case "ja":
                download = "ダウンロード";
                break;
            case "ko":
                download = "다운로드";
                break;
            case "ru":
                download = "Скачать";
                break;
        }

        let extension = "";
        if (type === "gif") extension = convert ? " GIF" : " MP4";

        return `${download}${extension}`;
    }

    function sensitiveContent() {
        // click "view" button on sensitive content warning to run this script again.
        document.querySelectorAll(".r-42olwf.r-1vsu8ta:not(.view-set)").forEach(view => {
            view.classList.add("view-set");
            view.addEventListener("click", () => init(3));
        });
    }

    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
