// ==UserScript==
// @name         Link Virtual Contest to submission
// @namespace    https://kenkoooo.com/atcoder/
// @version      1.1
// @description  Add link of submission to virtual contest standings page
// @author       Slephy
// @license      MIT
// @match        https://kenkoooo.com/atcoder/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449201/Link%20Virtual%20Contest%20to%20submission.user.js
// @updateURL https://update.greasyfork.org/scripts/449201/Link%20Virtual%20Contest%20to%20submission.meta.js
// ==/UserScript==

(async function(){
    const sleep = (second) => new Promise(resolve => setTimeout(resolve, second * 1000));

    console.log("Wait for loading...");
    await sleep(1);
    console.log("Start!");
    let standing_table = document.querySelector(".col-sm-12 > table");
    console.log(standing_table);
    if(standing_table === null){
        console.log("No standing table");
        return;
    }
    console.log("Got standing table");

    // 問題のコンテスト名、問題番号を取得
    let problem_cells = standing_table.querySelectorAll("thead th");
    problem_cells = Array.from(problem_cells);
    problem_cells = problem_cells.slice(3, problem_cells.length-1);
    let problem_links = [];
    for(let problem_cell of problem_cells){
        let problem_link = problem_cell.querySelector("a");
        problem_links.push(problem_link.href);
    }
    let contest_names = [];
    let problem_full_ids = [];
    for (let i = 0; i < problem_links.length; i++) {
        let problem_info = problem_links[i].match(/https:\/\/atcoder.jp\/contests\/(.*)\/tasks\/(.*)/);
        contest_names.push(problem_info[1]);
        problem_full_ids.push(problem_info[2]);
    }

    // 提出ページへのリンクを貼る
    let standing_rows = standing_table.querySelectorAll("tbody > tr");
    standing_rows = Array.from(standing_rows);
    standing_rows.pop();

    for(let standing_row of standing_rows){
        let standing_cells = standing_row.querySelectorAll("td");
        standing_cells = Array.from(standing_cells);
        standing_cells = standing_cells.slice(1, standing_cells.length-1);
        let username = standing_row.querySelector("th a").innerHTML;

        for(let i=0; i<standing_cells.length; i++){
            let standing_cell = standing_cells[i];
            let submission_link = "https://atcoder.jp/contests/" + contest_names[i] + "/submissions?f.Task=" + problem_full_ids[i] + "&f.LanguageName=&f.Status=&f.User=" + username;
            standing_cell.innerHTML = "<a href=\"" + submission_link + "\">" + standing_cell.innerHTML + "</a>";
        }
    }
}());
