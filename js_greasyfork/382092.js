// ==UserScript==
// @name         AtCoderUserSearchForm
// @namespace    https://github.com/refine-P
// @version      1.0.2
// @description  add form for user search (only lang=ja)
// @author       fine
// @license      MIT
// @include      https://atcoder.jp/home*
// @include      https://atcoder.jp/users*
// @downloadURL https://update.greasyfork.org/scripts/382092/AtCoderUserSearchForm.user.js
// @updateURL https://update.greasyfork.org/scripts/382092/AtCoderUserSearchForm.meta.js
// ==/UserScript==

/*
    JavaScriptをまともに書いたことがない人間が書いたので、
    気になる所があれば、Twitterとかで教えていただければ幸いです。
*/

"use strict";

// ユーザ検索のフォームを挿入する
// http://kimizuka.hatenablog.com/entry/2014/09/12/095957
var addUserSearchHTML = [
'<form class="navbar-form navbar-left">',
'   <div class="form-group input-group input-group-sm" style="margin-top:3px;">',
'       <input type="text" class="form-control" id="user_search", placeholder="User Search">',
'       <div class="input-group-btn">',
'           <button type="submit" class="btn btn-default"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>',
'       </div>',
'    </div>',
'</form>'
].join("\n");

var target = document.getElementsByClassName('header-sub_page')[0].lastElementChild;
target.insertAdjacentHTML('afterend', addUserSearchHTML);

// ユーザ検索の項目を取得
var userSearch = document.getElementsByClassName('header-sub_page')[0].getElementsByTagName('form')[0];

// 言語に応じてplaceholderを変更
var lang = document.getElementsByTagName('meta')[1].content; // 使用言語を取得
if (lang == 'ja') userSearch.getElementsByTagName('input')[0].placeholder = 'ユーザ検索';

// ユーザ検索機能の追加
userSearch.addEventListener('submit', function(event) {
    event.preventDefault();

    var base = "https://atcoder.jp/users/";
    var userName = userSearch.user_search.value;
    var url = base + userName;

    // ユーザーがいるかどうかチェックして、
    // いなかったらページをいい感じにするやつがやりたいが一旦保留
    // とりあえず、何も考えずにユーザー名をくっつけて遷移
    window.location.href = url;
}, false);