// ==UserScript==
// @name         Weibo Lottery Tools
// @namespace    http://tampermonkey.net/
// @version      2024-02-14
// @description  A tool used for weibo lottery
// @author       HJinnn_Kuo
// @match        https://weibo.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487319/Weibo%20Lottery%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/487319/Weibo%20Lottery%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        // Check PageUrl
        var currentUrl = window.location.href;
        var weiboUrlRegex = /^https:\/\/weibo\.com\/(\d+)\/([a-zA-Z0-9]+)(?:#(attitude|comment|repost))?$/;
        var matchResults = currentUrl.match(weiboUrlRegex);
        if (!matchResults) {
            alert("Error: 当前页面不是 Weibo Post! ");
            return;
        } else {
            console.log("Pass");
        }

        // Get document.postID
        document.uid = matchResults[1];
        document.postID = matchResults[2];
        console.log("postID: " + document.postID); 

        // Build Button
        var functionBox = document.querySelector("footer > div > div:nth-child(1) > div");
        if (!functionBox) {
            alert("Error: FunctionBox Not Found! ");
            return;
        }
        // Build repost button
        var newButton = functionBox.children[0].cloneNode(true);
        var repostButton = newButton.querySelector("div.woo-box-flex.woo-box-alignCenter>span");
        repostButton.innerHTML = "转抽";
        // Build comment button
        var newButton1 = functionBox.children[1].cloneNode(true);
        var commentButton = newButton1.querySelector("div.woo-box-flex.woo-box-alignCenter>span");
        commentButton.innerHTML = "评抽";

        document.luckyGuysNum = -1;

        function getPostInfo() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            return fetch(`https://weibo.com/ajax/statuses/show?id=${document.postID}`, requestOptions);
        }

        function getInputInfo() {
            var luckyGuysNum = Number(prompt("请输入中奖人数(纯数字)", 1));
            console.log("中奖人数: " + luckyGuysNum);
            document.luckyGuysNum = luckyGuysNum;
        }

        function getNextPage() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            if (document.participants.page == 1 || document.participants.page <= document.participants.max_page) {
                console.log(`Loading Page ${document.participants.page}`);
                return fetch(`https://weibo.com/ajax/statuses/repostTimeline?id=${document.participants.id}&page=${document.participants.page}&moduleID=feed&count=${document.participants.page==1?10:20}`, requestOptions)
                    .then((response) => {
                        return response.json();
                    }).then((response) => {
                        response.data.forEach((data) => {
                            document.participants.userLists[data.user.id] = {
                                "name": data.user.screen_name,
                            }
                        })
                        document.participants.page = document.participants.page + 1;
                        document.participants.max_page = response.max_page;
                    }).then(getNextPage);
            } else {
                return document.participants.userLists;
            }
        }

        function loadAllComments() {
            // fetch(`https://weibo.com/ajax/statuses/repostTimeline?id=${document.participants.id}&page=${document.participants.page}&moduleID=feed&count=${document.participants.page==1?10:20}`, requestOptions)
            var requestOptions = {
                method: 'GET', 
                redirect: 'follow'
            };
            if (document.participants.max_id != 0) {
                console.log(`Loading Comments...`);
                if (document.participants.max_id == -1) {
                    return fetch(`https://weibo.com/ajax/statuses/buildComments?is_reload=1&id=${document.participants.id}&is_show_bulletin=2&is_mix=0&count=10&uid=${document.participants.uid}&fetch_level=0&locale=zh-CN`)
                        .then((response) => {
                            return response.json();
                        }).then((response) => {
                            response.data.forEach((data) => {
                                document.participants.userLists[data.user.id] = {
                                    "name": data.user.screen_name,
                                }
                            })
                            document.participants.max_id = response.max_id;
                        }).then(loadAllComments);
                } else {
                    return fetch(`https://weibo.com/ajax/statuses/buildComments?flow=0&is_reload=1&id=${document.participants.id}&is_show_bulletin=2&is_mix=0&max_id=${document.participants.max_id}&count=20&uid=${document.participants.uid}&fetch_level=0&locale=zh-CN`)
                        .then((response) => {
                            return response.json();
                        }).then((response) => {
                            response.data.forEach((data) => {
                                document.participants.userLists[data.user.id] = {
                                    "name": data.user.screen_name,
                                }
                            })
                            document.participants.max_id = response.max_id;
                        }).then(loadAllComments);
                }
            } else {
                // The last page
                return document.participants.userLists;
            }
        }

        function shuffleArray(array) {
            // Fish-Yates Algorithm
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function repostLottery() {
            alert("🚗正在读取转发名单, 请耐心等待! ");
            return getPostInfo().then((response) => {
                return response.json();
            }).then((postInfo) => {
                document.participants = {
                    "id": postInfo.id,
                    "reposts_count": postInfo.reposts_count,
                    "max_page": -1,
                    "page": 1,
                    "userLists": {}
                };
            }).then(getNextPage).then((userLists) => {
                document.userLists = userLists;
            }).catch((err) => {
                alert("Error: 转发名单读取失败! ");
                console.error("Error: ", err); 
                return;
            }).then(() => {
                var userLists = Object.keys(document.userLists);
                if (!userLists.length) {
                    alert("Error: 抽奖人数为 0! ");
                    return;
                }
                getInputInfo();
                if (!document.luckyGuysNum || document.luckyGuysNum > userLists.length) {
                    alert("Error: 中奖人数不合规! ");
                    return;
                }
                var luckyGuyCnt = 0;
                shuffleArray(userLists);
                for (let i = 0; i < userLists.length && luckyGuyCnt < document.luckyGuysNum; i++) {
                    var luckyGuy = document.userLists[userLists[i]];
                    alert(`🎉 恭喜第 ${luckyGuyCnt + 1} / ${document.luckyGuysNum} 名中奖者 🎉 \n` + 
                            `📌微博 ID: ${userLists[i]} \n` + 
                            `😺用户名: ${luckyGuy.name} \n` + 
                            `📆抽奖时间: ${Date()}`);
                    console.log(`🎉 恭喜第 ${luckyGuyCnt + 1} / ${document.luckyGuysNum} 名中奖者 🎉 \n` + 
                            `📌微博 ID: ${userLists[i]} \n` + 
                            `😺用户名: ${luckyGuy.name} \n` + 
                            `📆抽奖时间: ${Date()}`);
                    luckyGuyCnt++;
                }
                alert("📸 抽奖结束，可按 Ctrl+Shift+I 或点击浏览器设置项进入开发者模式，在控制台中复制抽奖结果. ");
            })
        }

        function commentLottery() {
            alert("🚗正在读取评论名单, 请耐心等待! ");
            return getPostInfo().then((response) => {
                return response.json();
            }).then((postInfo) => {
                document.participants = {
                    "id": postInfo.id,
                    "comments_count": postInfo.comments_count,
                    "max_id": -1,
                    "userLists": {}
                };
            }).then(loadAllComments).then((userLists) => {
                document.userLists = userLists;
            }).catch((err) => {
                alert("Error: 评论名单读取失败! ");
                console.error("Error: ", err); 
                return;
            }).then(() => {
                var userLists = Object.keys(document.userLists);
                if (!userLists.length) {
                    alert("Error: 抽奖人数为 0! ");
                    return;
                }
                getInputInfo();
                if (!document.luckyGuysNum || document.luckyGuysNum > userLists.length) {
                    alert("Error: 中奖人数不合规! ");
                    return;
                }
                var luckyGuyCnt = 0;
                shuffleArray(userLists);
                for (let i = 0; i < userLists.length && luckyGuyCnt < document.luckyGuysNum; i++) {
                    var luckyGuy = document.userLists[userLists[i]];
                    alert(`🎉 恭喜第 ${luckyGuyCnt + 1} / ${document.luckyGuysNum} 名中奖者 🎉 \n` + 
                            `📌微博 ID: ${userLists[i]} \n` + 
                            `😺用户名: ${luckyGuy.name} \n` + 
                            `📆抽奖时间: ${Date()}`);
                    console.log(`🎉 恭喜第 ${luckyGuyCnt + 1} / ${document.luckyGuysNum} 名中奖者 🎉 \n` + 
                            `📌微博 ID: ${userLists[i]} \n` + 
                            `😺用户名: ${luckyGuy.name} \n` + 
                            `📆抽奖时间: ${Date()}`);
                    luckyGuyCnt++;
                }
                alert("📸 抽奖结束，可按 Ctrl+Shift+I 或点击浏览器设置项进入开发者模式，在控制台中复制抽奖结果. ");
            })
        }

        repostButton.addEventListener('click', function() {
            console.log("Repost Lottery");
            repostLottery();
        });

        commentButton.addEventListener('click', function() {
            console.log("Comment Lottery");
            commentLottery();
        })

        functionBox.appendChild(newButton);
        functionBox.appendChild(newButton1);
    }, 1000);

})();