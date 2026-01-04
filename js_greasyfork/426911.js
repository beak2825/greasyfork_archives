// ==UserScript==
// @name       HighlightAtCoderContestNot2100
// @namespace 	https://greasyfork.org/users/201019
// @description highlight in red AtCoder rated contests whose start time is not 21:00.
// @version     1.1
// @author      Eug1ena
// @match       https://atcoder.jp/*
// @downloadURL https://update.greasyfork.org/scripts/426911/HighlightAtCoderContestNot2100.user.js
// @updateURL https://update.greasyfork.org/scripts/426911/HighlightAtCoderContestNot2100.meta.js
// ==/UserScript==

// https://atcoder.jp/ 用の部分 (日本語版、2021/05/23時点)
(function(){
    const contest_doms = document.querySelectorAll("ul.m-list_contest > li");

    contest_doms.forEach(function(contest){
        const rated_info = contest.querySelector("div.rated span").innerText;

        // Ratingの情報に数字か文字列"All"が含まれている場合にratedであると判定する
        if(rated_info.match(/[0-9]+/) || rated_info.match(/All/)){
            const time_dom = contest.querySelector("div.time time");
            const time_info = time_dom.innerText;

            if(!time_info.match(/21\:00/)){
                time_dom.style.color = "#ff0000";
                time_dom.style.backgroundColor = "#ffeeee";
            }
        }
    });
}());

// https://atcoder.jp/home 用の部分 (日本語版、2021/05/23時点)
(function(){
    const contest_doms = document.querySelectorAll("div#contest-table-active tbody tr, div#contest-table-upcoming tbody tr, div#contest-table-recent tbody tr");

    contest_doms.forEach(function(contest){
        console.log(contest)
        const rated_dom_class = contest.querySelector("small span").classList;

        if(rated_dom_class.contains("user-blue") || rated_dom_class.contains("user-orange") || rated_dom_class.contains("user-red")){
            const time_dom = contest.querySelector("small time");
            const time_info = time_dom.innerText;

            if(!time_info.match(/21\:00/)){
                time_dom.style.color = "#ff0000";
                time_dom.style.backgroundColor = "#ffeeee";
            }
        }
    });
}());
