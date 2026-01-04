// ==UserScript==
// @name         AtCoderTags_Hint
// @version      0.9
// @author       Null_Null
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://*/tasks/*
// @grant        none
// @namespace    https://github.com/null-null-programming/AtCoderTags-Helper
// @description  AtCoderの問題ページにカテゴリーを知ることの出来るボタンを設置します。
// @downloadURL https://update.greasyfork.org/scripts/393337/AtCoderTags_Hint.user.js
// @updateURL https://update.greasyfork.org/scripts/393337/AtCoderTags_Hint.meta.js
// ==/UserScript==

function getContestName() {
  let contestURL = location.href;
  let contestArray = contestURL.split('/');
  return contestArray[contestArray.length - 1];
}

$('#contest-nav-tabs').prepend(`<div>
    <div id="tag-badge" class="row">
      <button id="tags-hint" type="button" class="btn btn-info">Tag</button>
      <span id="hint-tag-0" class="col badge badge-pill badge-primary"></span>
      <span id="hint-tag-1" class="col badge badge-pill badge-primary"></span>
      <span id="hint-tag-2" class="col badge badge-pill badge-primary"></span>
      <span id="hint-tag-3" class="col badge badge-pill badge-primary"></span>
    </div>
</div>`);

$('#tags-hint').click(function() {
    getTag();
})

async function getTag() {
    let parser = new DOMParser();
    let archiveDom = parser.parseFromString((await $.get('https://atcoder-tags.herokuapp.com/check/'+getContestName())), "text/html");
    let tag_list=[];
    if(archiveDom.querySelector("#tag0")!=null)tag_list.push(archiveDom.querySelector("#tag0").innerText);
    if(archiveDom.querySelector("#tag1")!=null)tag_list.push(archiveDom.querySelector("#tag1").innerText);
    if(archiveDom.querySelector("#tag2")!=null)tag_list.push(archiveDom.querySelector("#tag2").innerText);
    if(archiveDom.querySelector("#tag3")!=null)tag_list.push(archiveDom.querySelector("#tag3").innerText);

    if(tag_list[0]!='None'){
        $('#hint-tag-0').html(tag_list[0]);
    }
    if(tag_list[1]!='None' && tag_list[1]!=tag_list[0]){
        $('#hint-tag-1').html(tag_list[1]);
    }
    if(tag_list[2]!='None' && tag_list[2]!=tag_list[0]){
        $('#hint-tag-2').html(tag_list[2]);
    }
    if(tag_list[3]!='None' && tag_list[3]!=tag_list[0]){
        $('#hint-tag-3').html(tag_list[3]);
    }

    return;
}
