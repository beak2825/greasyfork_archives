// ==UserScript==
// @name         AtCoder Standings Watcher
// @name:en      AtCoder Standings Watcher
// @namespace    https://atcoder.jp/
// @version      0.2.8
// @license      MIT
// @description  順位表を定期的に取得して、お気に入りの人の動きを通知します
// @description:en Watch standings and notify your friends' movements
// @author       magurofly
// @match        https://atcoder.jp/contests/*
// @icon         https://www.google.com/s2/favicons?domain=atcoder.jp
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/428862/AtCoder%20Standings%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/428862/AtCoder%20Standings%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 各種設定
    const LANG = "en"; // "ja" or "en"
    const INTERVAL = 30e3; // 更新間隔（ミリ秒単位）
    const NOTIFICATION_TIMEOUT = 15e3; // 通知の表示時間（ミリ秒単位）
    const NOTIFICATION_TEMPLATES = {
        "ja": {
            penalty: ({user, task}) => `${user.id} さんが ${task.assignment} - ${task.name} でペナルティを出しました`,
            accepted: ({user, task, score}) => `${user.id} さんが ${task.assignment} - ${task.name} で ${score} 点を獲得し、 ${user.rank} 位になりました`,
        },
        "en": {
            penalty: ({user, task}) => `${user.id} got penalty at ${task.assignment} - ${task.name}`,
            accepted: ({user, task, score}) => `${user.id} got ${score} points at ${task.assignment} - ${task.name} and became ${user.rank}th`,
        },
    }[LANG];

    // 定数
    const watchingContest = unsafeWindow.contestScreenName;
    const standingsAPI = `/contests/${watchingContest}/standings/json`;
    const channel = new BroadcastChannel("atcoder-standings-watcher");

    // 状態
    let lastUpdate = 0; // 最後に更新した時刻
    const watchingUsers = {};

    // 関数
    async function initialize() {
        console.dir(() => {});
        if (unsafeWindow.getServerTime().isAfter(unsafeWindow.endTime)) { // コンテストが終了している
            console.info("AtCoder Standings Watcher: contest has ended");
            return;
        }

        channel.onmessage = ({data}) => {
            console.log("AtCoder Standings Watcher: receive: ", data);
            switch (data.type) {
                case "update":
                    if (data.contest == watchingContest) lastUpdate = Math.max(lastUpdate, data.time);
                    break;
                case "task":
                    watchingUsers[data.userId].taskResults[data.taskId] = data.result;
                    break
            }
        };

        setTimeout(() => {
            update(false);
            setInterval(() => {
                const now = Date.now();
                if (now - lastUpdate <= INTERVAL) return; // INTERVAL 以内に更新していた場合、今回は見送る
                lastUpdate = now;
                channel.postMessage({ type: "update", contest: watchingContest, time: lastUpdate });
                update().catch(error => console.error(error));
            }, INTERVAL / 2);
        }, INTERVAL);

        const favs = await getFavs();
        for (const fav of favs) {
            watchingUsers[fav] = {
                id: fav,
                rank: 0,
                taskResults: {},
            };
        }
    }

    async function update(notifyChanges = true) {
        console.info("AtCoder Standings Watcher: update");
        const data = await getStandingsData();
        const tasks = {};
        for (const {TaskScreenName, Assignment, TaskName} of data.TaskInfo) {
            tasks[TaskScreenName] = { id: TaskScreenName, assignment: Assignment, name: TaskName };
        }
        for (const standing of data.StandingsData) {
            const userId = standing.UserScreenName;
            if (!(userId in watchingUsers)) continue;
            const user = watchingUsers[userId];

            user.rank = standing.Rank;

            for (const task in standing.TaskResults) {
                const result = user[task] || (user[task] = { count: 0, penalty: 0, score: 0 });
                const Result = standing.TaskResults[task];
                if (Result.Penalty > result.penalty) {
                    result.penalty = Result.Penalty;
                    if (notifyChanges) notify({ user, task: tasks[task], type: "penalty" });
                }
                if (Result.Score > result.score) {
                    result.score = Result.Score;
                    if (notifyChanges) notify({ user, task: tasks[task], type: "accepted", score: result.score / 100 });
                }
            }
        }
    }

    function notify(notification) {
        console.log("AtCoder Standings Watcher: notification: ", notification);
        GM_notification({
            text: NOTIFICATION_TEMPLATES[notification.type](notification),
            timeout: NOTIFICATION_TIMEOUT,
        });
        if (notification.user && notification.task && notification.user.taskResults) {
            channel.postMessage({ type: "task", userId: notification.user.id, taskId: notification.task.id, result: notification.user.taskResults[notification.task.id] });
        }
    }

    async function getFavs() {
        while (!unsafeWindow.favSet) {
            unsafeWindow.reloadFavs();
            await sleep(100);
        }
        return unsafeWindow.favSet;
    }

    async function getStandingsData() {
        return await fetch(standingsAPI).then(response => response.json());
    }

    const sleep = (ms) => new Promise(done => setInterval(done, ms));

    // 初期化
    initialize();
})();