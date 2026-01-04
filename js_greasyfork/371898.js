// ==UserScript==
// @name           AtCoderScoreHider
// @namespace  https://github.com/task4233
// @version        1.1.0
// @description  AtCoder(beta.atcoder.jp)の日本語版の配点を全て隠します。
// @author         task4233　Mister
// @grant           none
// @license         MIT
// @include         /^https?://atcoder\.jp\/contests\/*
// @downloadURL https://update.greasyfork.org/scripts/371898/AtCoderScoreHider.user.js
// @updateURL https://update.greasyfork.org/scripts/371898/AtCoderScoreHider.meta.js
// ==/UserScript==

// ---------------------------------------------------------------------------------------------
// 変更したい場合はここをいじってください
var display_score = '???';//            点数の代わりに置換される文字列
var display_last_status = true;//     過去の提出コードの点数を表示するか否か
var problem_page = true;//           問題ページで表示するか否か
var top_page = true;//                  トップページで表示するか否か
var source_code_page = true;//    ソースコードページで表示するか否か
var submitted_list_page = true;//   提出コード一覧ページで表示するか否か
// ---------------------------------------------------------------------------------------------

// -------------------------
// variables
// -------------------------
var i;
// 点数表示取得(問題ページ)
var problem_page_scores=document.querySelectorAll('#task-statement > span > span > p > var');
// 点数表示取得(トップページ)
var top_page_scores=document.querySelectorAll('#contest-statement > span > span > .table.table-responsible.table-striped.table-bordered > tbody > tr > td');
// 点数表示取得(ソースコードページ)
var submitted_page_scores=document.querySelectorAll('.panel.panel-default.panel-submission > .table.table-bordered.table-striped > tbody > tr > .text-center');
// 点数表示取得(提出コード一覧ページ)
var submitted_list_page_scores=document.querySelectorAll('.panel-submission > .table-responsive > table > tbody > tr > td');
// 提出コード一覧ページの状態取得
var submitted_list_page_status=document.querySelectorAll('#main-container > .row > .nav-pills >.active > a');
if (submitted_list_page_status.length > 0) submitted_list_page_status = submitted_list_page_status[0].innerText;
// errrors
var errors = ['WJ', 'RE', 'TLE', 'MLE', 'CE', 'OLE', 'QLE'];
var privates = ['自分の提出', 'My Submissions']
var your_name = document.querySelectorAll('.navbar-collapse > .navbar-right > li > a');
if (your_name.length > 0) your_name = your_name[1].innerText.split(' ')[1];
// lambdas
let hasError = (str) => {
  return (errors.indexOf(str) >= 0);
}
let isAC = (str) => {
   return (str == 'AC');
}
let isYou = (str) => {
  return (str == your_name);
}
let isPrivatePage = (str) => {
  return (privates.indexOf(str) >= 0);
}

// ------------------------
// main
// ------------------------


if (problem_page && problem_page_scores.length>0){
  for(i=0;i<2;++i){
    problem_page_scores[i].innerText=display_score;
  }
}

if (top_page && top_page_scores.length > 0){
  for(i=1;i<top_page_scores.length;i+=2){
    top_page_scores[i].innerText = display_score;
  }
}
if (source_code_page && submitted_page_scores.length > 0){
  submitted_page_scores[4].innerText = display_score;
}

if (submitted_list_page && submitted_list_page_scores.length > 0){
  for(i=4;i<submitted_list_page_scores.length; i+=10) {
    var status = submitted_list_page_scores[i + 2].innerText;
    var submitted_user = submitted_list_page_scores[i - 2].innerText.split(' ')[0];
    if (isPrivatePage(submitted_list_page_status)) {
      if (!isAC(status) || (!display_last_status && i > 10)) {
        submitted_list_page_scores[i].innerText = display_score;
      }
    } else {
      if (!isAC(status) || !isYou(submitted_user) || (!display_last_status && i > 10)) {
        submitted_list_page_scores[i].innerText = display_score;
      }
    }
    if(hasError(status)) {
        i -= 2;
    }
  }
}