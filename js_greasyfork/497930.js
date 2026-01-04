// ==UserScript==
// @name         block-bilibili-up
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.5
// @license      MIT
// @description  屏蔽B站用户、屏蔽视频、屏蔽直播
// @author       You
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match        https://www.bilibili.com/
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/497930/block-bilibili-up.user.js
// @updateURL https://update.greasyfork.org/scripts/497930/block-bilibili-up.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const cssStyle = `
     .opt-button {
        display: block;
        z-index: 999;
        width: 60px;
        background-color: #ff5722;
        color: #fff;
        padding: 0.5em 1em;
        border-radius: 0.2em;
        cursor: pointer;
        font-size: 0.8em;
        transition: all 0.3s ease;
        display: none;
        margin: 5px;
      }
     .opt-button:hover {
        background-color: #f44336;
      }
 
      .block-hide{
        display: none !important;
      }

      .block-container {
        z-index: 999;
        top: 0;
        left: 0;
        position: absolute;
        padding: 0.5em 1em;
        width: 150px;
        height: 50px;
        display: flex;
        flex-direction: horizontal;
      }

      .block-container:hover .opt-button {
        display: block;
      }

    `;
    GM_addStyle(cssStyle);

    const storageBlocksItemName = 'block-bilibili-blackList';
    const storgeIgnoresItemName = 'block-bilibili-ignoreList';
    //从storage读取黑名单
    //格式: [{"name":"黑名单用户1","uid":123456}]
    let blackList = JSON.parse(localStorage.getItem(storageBlocksItemName) || '[]');

    //忽略视频列表
    //格式: [{"videoid":"BV1jb421v7EY","name":"忽略视频1"},{"videoid":"BV1jb421v7EZ","name":"忽略视频2"}]
    let ignoreList = JSON.parse(localStorage.getItem(storgeIgnoresItemName) || '[]');

    function hideCard(card) {
        if ($(card).hasClass("block-hide")) {
            return;
        }
        $(card).attr("class", "block-hide");

    }

    //右上角添加“屏蔽”按钮，鼠标移上时显示
    function addBlockButton(card) {
        if ($(card).find(".block-button").length > 0) {
            return;
        }

        $(card).css("position", "relative");

        let blockContainer = $('<div class="block-container"></div>');
        $(card).append(blockContainer);
        let blockButton = $('<button class="block-button opt-button">屏蔽</button>');
        $(blockContainer).append(blockButton);
        $(blockButton).click(function () {
            hideCard(card);
            let black = getAuthorUid(card);
            if (black == null) {
                return;
            }
            blackList.push(black);
            localStorage.setItem(storageBlocksItemName, JSON.stringify(blackList));
            console.log("屏蔽用户：" + black.name + " uid：" + black.uid);
        });
    }

    function addIgnoreButton(card) {
        if ($(card).find(".ignore-button").length > 0) {
            return;
        }

        let blockContainer = $(card).find(".block-container");
        if (blockContainer.length == 0) {
            return;
        }

        let ignoreButton = $('<button class="ignore-button opt-button">忽略</button>');
        $(blockContainer).append(ignoreButton);

        ignoreButton.click(function () {
            //添加到忽略列表，存入storage
            let videoIdAndName = getVideoIdAndName(card);
            if (videoIdAndName == null) {
                return;
            }

            ignoreList.push(videoIdAndName);
            localStorage.setItem(storgeIgnoresItemName, JSON.stringify(ignoreList));
            console.log("忽略视频：" + videoIdAndName.name + " videoid：" + videoIdAndName.videoid);
            hideCard(card);
        });
    }

    //return {name: "黑名单用户1", uid: 123456}
    function getAuthorUid(card) {
        let owner = $(card).find("a.bili-video-card__info--owner");
        if (owner.length == 0) {
            return null;
        }

        //space地址：//space.bilibili.com/123456
        let spaceHref = $(owner).attr("href")
        //提取uid
        let uid = spaceHref.match(/\/(\d+)/)[1];

        let author = $(card).find(".bili-video-card__info--author");
        let name = $(author).attr("title");

        return { name: name, uid: uid };
    }

    //return {videoid: "BV1jb421v7EY", name: "忽略视频1"}
    function getVideoIdAndName(card) {
        //提取href中的videoid：href="https://www.bilibili.com/video/BV1jb421v7EY"
        let a = $(card).find(".bili-video-card__image--link");
        if (a.length == 0) {
            return null;
        }

        let href = $(a).attr("href");
        let videoid = href.match(/\/video\/(\w+)/)[1];

        let title = $(card).find(".bili-video-card__info--tit");
        if (title.length == 0) {
            return null;
        }

        return { videoid: videoid, name: $(title).attr("title") };
    }

    //屏蔽直播card
    //return :true-已屏蔽; false-未屏蔽
    function blockLiving(card) {
        let living = $(card).find(".bili-live-card__info--living,.living");
        if (living.length > 0) {
            hideCard(card);
            console.log("屏蔽直播card.");
            return true;
        }
        return false;
    }

    function refreshBlackList() {
        $(".feed-card,.bili-video-card.is-rcmd.enable-no-interest,.bili-live-card.is-rcmd.enable-no-interest,.floor-single-card").each((index, card) => {
            if ($(card).parent(".feed-card").length > 0) {
                card = $(card).parent(".feed-card");
            }
            $(card).removeClass("recommended-container_floor-aside");
            addBlockButton(card);
            addIgnoreButton(card);

            if ($(card).hasClass("block-hide")) {
                return;
            }

            //隐藏直播
            if (blockLiving(card)) {
                return;
            }

            //隐藏黑名单
            let authorUid = getAuthorUid(card);
            if (authorUid == null) {
                return;
            }
            let isInBlackList = blackList.some(item => item.uid == authorUid.uid);
            if (isInBlackList) {
                //隐藏
                hideCard(card);
                console.log("隐藏用户：" + authorUid.name + " uid：" + authorUid.uid);
            }

            let videoIdAndName = getVideoIdAndName(card);
            if (videoIdAndName == null) {
                return;
            }

            let isInIgnoreList = ignoreList.some(item => item.videoid == videoIdAndName.videoid);
            if (isInIgnoreList) {
                //隐藏
                hideCard(card);
                console.log("隐藏视频：" + videoIdAndName.name + " videoid：" + videoIdAndName.videoid);
            }
        });
    }

    refreshBlackList();
    //每2秒检测一次
    setInterval(() => {
        refreshBlackList();
    }, 2000);
})();