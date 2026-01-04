// ==UserScript==
// @name         知乎-我不感兴趣zz
// @namespace
// @version      3.5
// @description  隐藏掉知乎恼人的“你可能感兴趣”和“热门话题”推送
// @author       MQ
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @match        https://www.zhihu.com/
// @namespace https://greasyfork.org/users/159603
// @downloadURL https://update.greasyfork.org/scripts/39186/%E7%9F%A5%E4%B9%8E-%E6%88%91%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39186/%E7%9F%A5%E4%B9%8E-%E6%88%91%E4%B8%8D%E6%84%9F%E5%85%B4%E8%B6%A3zz.meta.js
// ==/UserScript==

/* jshint ignore:start */
(async () => {
    'use strict';
    const MAX_FILTER_COUNT = 100; //最多主动刷新的条目数
    const USER_ID_KEY = "user-id";
    const USER_TOPICS_KEY = "user-topics";

    let GET = (url, headers) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            if (headers) {
                Object.keys(headers).forEach((key) => { xhr.setRequestHeader(key, headers[key]); });
            }
            xhr.onload = (e) => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject(xhr.statusText);
                    }
                }
            };
            xhr.onerror = reject;
            xhr.send(null);
            return xhr.response;
        });
    };

    let getUserId = async () => {
        let raw = await GET("/api/v4/me");
        let data = JSON.parse(raw);
        return data.url_token;
    };

    let userId = GM_getValue(USER_ID_KEY, null);
    if (!userId) {
        userId = await getUserId();
        GM_setValue(USER_ID_KEY, userId);
    } else {
        setTimeout(async () => {
            let newValue = await getUserId();
            if (newValue != userId) {
                userId = newValue;
                GM_setValue(USER_ID_KEY, userId);
            }
        }, 1000);
    }

    let getUserTopics = async (uid) => {
        //以下部分获取用户关注话题
        let isEnd = true;
        let offset = 0;
        let topics = [];
        do {
            let raw = await GET(`/api/v4/members/${uid}/following-topic-contributions?offset=${offset}&limit=20`);
            let batch = JSON.parse(raw);
            isEnd = batch.paging.is_end;
            topics = topics.concat(batch.data.map(e => e.topic.name));
            offset += batch.data.length;
        } while(!isEnd);
        console.log("your followed topics", topics);
        return topics;
    };

    let followedTopics = GM_getValue(USER_TOPICS_KEY, null);
    if (!followedTopics) {
        followedTopics = await getUserTopics(userId);
        GM_setValue(USER_TOPICS_KEY, followedTopics);
    } else {
        setTimeout(async ()=> {
            let newValue = await getUserTopics(userId);
            if (newValue != followedTopics) {
                followedTopics = newValue;
                GM_setValue(USER_TOPICS_KEY, followedTopics);
            }
        }, 1000);
    }

    const mainFrame = document.querySelector(".TopstoryMain div");
    //全局中没被隐藏的卡片数
    let nonHiddenCards = 0;
    let allCards = 0;
    let fillNewCards = () => setTimeout(() => window.dispatchEvent(new Event("resize"))); //发送resize事件来补充新的内容
    //检查函数
    let checkCards = (cards) => {
        if (cards.length == 0) return;
        cards.forEach(e => {
            try{
                if (e.hidden) return;
                let feature = e.querySelector(".FeedSource-firstline");
                let doHide = false;
                if (feature.textContent.match(/你可能感兴趣|热门内容/)) {
                    doHide = true;
                    console.log(feature.textContent, "hide");
                } else if (feature.textContent.match(/来自话题/)) {
                    var topicDivs = [...feature.querySelectorAll("div.Popover div")];
                    var topicNames = topicDivs.map(e=>e.textContent);
                    doHide = true;
                    for(let topicName of topicNames) {
                        if(followedTopics.includes(topicName)) {
                            doHide = false;
                            break;
                        }
                    }
                    console.log(topicNames, doHide ? "hide" : "not hide");
                }
                if (doHide) {
                    e.hidden = true;
                } else {
                    nonHiddenCards++;
                }
                allCards++;
            } catch(x) {
                console.log(x, e);
            }
        });
        if (nonHiddenCards < 8 && allCards < MAX_FILTER_COUNT) {
            console.log(`too few cards (${nonHiddenCards}/${allCards}) requesting for more...`);
            fillNewCards();
        } else if (nonHiddenCards < 8 && allCards >= MAX_FILTER_COUNT) {
            let option = {
                text: `知乎-我不感兴趣 已为您过滤了 ${allCards-nonHiddenCards} 条推送，仍然没有足够的条目填满您的主页，您可以去喝杯茶，看看别的东西。`,
                title: "主动刷新已停止",
                onclick: console.log,
                ondone: console.log
            };
            GM_notification(option, null);
            nonHiddenCards = 8;
        }
    };

    //注册钩子
    var ob = new MutationObserver((records) => {
        //console.log("mutation records: ", records);
        let addedCards = records.reduce((r, e) => r.concat([...e.addedNodes]), []);
        checkCards(addedCards);
    });
    var config = { childList: true };
    ob.observe(mainFrame, config);
    console.log("hooked");

    //进行首次检查，这里不DRY
    checkCards([...mainFrame.children]);
})();

/* jshint ignore:end */