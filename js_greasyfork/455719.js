// ==UserScript==
// @name         ahc_mintoku_user_script
// @namespace    http://sample.com/
// @version      0.9
// @description  AHCをみんなで解く会の参加者用のユーザースクリプトです
// @author       hiraku
// @match        https://kenkoooo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455719/ahc_mintoku_user_script.user.js
// @updateURL https://update.greasyfork.org/scripts/455719/ahc_mintoku_user_script.meta.js
// ==/UserScript==

(function() {
    function extention(participants, teamsPage, rankingPage, rankingPageText, rankingPageStyle, participantStyle, hashTags, contestPage, contestName) {
        const MINTOKU_RANKING_PAGE_ID = "mintokuRankingPageLink";
        function createTweetText(contestName, participantInfo, participant, hashTags) {
            return contestName + "での成績\n" + 
            "チーム: " + participantInfo.teamRank + "位（" + participantInfo.teamName + ": " + participantInfo.teamScore + "点）\n" +
            "個人: " + participantInfo.personalRank + "位（" + participant + ": " + participantInfo.personalScore + "点）\n" +
            hashTags + "\n";
        }
        if (!document.getElementById(MINTOKU_RANKING_PAGE_ID)) {
            var ranking = Array.from(document.querySelectorAll("div.mb-2.row")).map(e => e.children[0]);
            // チーム順位表ページへのリンク挿入
            let rankingPageLink = document.createElement("a");
            rankingPageLink.innerHTML = rankingPageText;
            rankingPageLink.setAttribute('id', MINTOKU_RANKING_PAGE_ID);
            rankingPageLink.setAttribute('style', rankingPageStyle);
            rankingPageLink.setAttribute('href', rankingPage);
            ranking[0].appendChild(rankingPageLink);
        }
        // IDの横に(チーム名: discord名)を追加
        var targets = Array.from(document.getElementsByTagName('tbody')[2].getElementsByTagName('tr')).map(e => e.children[1]);
        for (let i = 0; i < targets.length; i++) {
            let participant = targets[i].firstChild.innerHTML;
            // Show Rating機能の対応
            participant = participant.match(/users\/(?<user>\S+)"/)?.groups?.user ?? participant;
            if (participant in participants) {
                let newa = document.createElement("a");
                newa.innerHTML = "(" + participants[participant].teamName + ": " + participants[participant].displayName + ")";
                newa.setAttribute('style', participantStyle);
                newa.setAttribute('href', teamsPage);
                targets[i].appendChild(newa);

                // Share 皆解会!! 機能の対応
                let shareit = targets[i].children[1]?.innerHTML;
                if (shareit != null && shareit.match("Share it!")) {
                    const url = new URL("https://twitter.com/intent/tweet");
                    url.searchParams.set("url", contestPage);
                    url.searchParams.set("text", createTweetText(contestName, participants[participant], participant, hashTags));

                    let newdiv = document.createElement("div");
                    newdiv.setAttribute('class', 'text-right');
                    let newa = document.createElement("a");
                    newa.innerHTML = "Share 皆解会!!";
                    newa.setAttribute('href', url);
                    newa.setAttribute('target', '_blank');
                    newa.setAttribute('rel', 'noopener noreferrer');
                    newa.setAttribute('class', 'btn btn-link');
                    newdiv.appendChild(newa);
                    targets[i].appendChild(newdiv);
                }
            }
        }
    }

    window.onload = function(){
        'use strict';

        // 1. new XMLHttpRequest オブジェクトを作成
        let xhr = new XMLHttpRequest();
        const gasUrl = "https://script.google.com/macros/s/AKfycbzf5VFF6aobcxrrb7jChtQF8vQIMUrwklmjxyhNOZtadVt6ljddgEep0JqOWlEsAulGmg/exec";

        // 2. 設定: URL /article/.../load に対する GET-リクエスト
        xhr.open('GET', gasUrl);

        // 3. ネットワーク経由でリクエスト送信
        xhr.send();

        xhr.onload = function() {
            if (xhr.status != 200) { // レスポンスの HTTP ステータスを解析
                alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
            } else { // show the result
                // console.log(xhr.response); // responseText is the server
                moge(JSON.parse(xhr.response));
            }
        };

        function moge(response) {
            const locationHash = response.locationHash; // 発火する / しないの判定用
            const participants = response.participants;
            const teamsPage = response.teamsPage;
            const rankingPage = response.rankingPage;
            const rankingPageText = response.rankingPageText ? response.rankingPageText : "チーム順位表";
            const rankingPageStyle = response.rankingPageStyle ? response.rankingPageStyle : 'font-size:30px;';
            const participantStyle = response.participantStyle ? response.participantStyle : 'font-size:11px; color:gray; margin:0 4px;';
            const hashTags = response.hashTags ? response.hashTags : '#皆解会';
            const contestPage = response.contestPage;
            const contestName = response.contestName;

            var elem = "";

            // document生成完了後にsendMessageのresponseを取得したときの対応
            if (location.hash === locationHash && document.getElementsByTagName('tbody')[2]){
                elem = document.getElementById("root").firstChild.children[1].children[5];
                extention(participants, teamsPage, rankingPage, rankingPageText, rankingPageStyle, participantStyle, hashTags, contestPage, contestName);
            }

            var observer = new MutationObserver(function () {
                if (location.hash === locationHash) {
                    if (document.getElementsByTagName('tbody')[2] && elem !== document.getElementById("root").firstChild.children[1].children[5]) {
                        elem = document.getElementById("root").firstChild.children[1].children[5];
                        extention(participants, teamsPage, rankingPage, rankingPageText, rankingPageStyle, participantStyle, hashTags, contestPage, contestName);
                    }
                }
            });
            const config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            };

            observer.observe(document, config);
        }
    };
})();