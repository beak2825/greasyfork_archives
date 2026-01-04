// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://typing-tube.net/my/rankings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408961/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/408961/New%20Userscript.meta.js
// ==/UserScript==

//-----------------------------------------------------------------------------
(function() {
    'use strict';

    // Your code here...
    AddElements();
    //document.getElementsByTagName("head").innerHTML += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>';

})();
//-----------------------------------------------------------------------------
function AddElements(){
     //テキストボックスとボタンを配置
    var form = document.createElement("form");
    form.innerHTML = "<input  type='text' id='textBoxForRankingId' size='6'>" +
    "<input id='btnForAddingRankingData'  type='button'  value='タイピング結果をIDから取得（例:123456'>";

    //適当な位置に作成
     var parent = document.getElementById('main_content');
    parent.insertBefore(form, parent.firstChild);

    //onclickイベント追加
    document.getElementById("btnForAddingRankingData").addEventListener("click", onClickBtnForAddingRankingData);
}
//-----------------------------------------------------------------------------
function onClickBtnForAddingRankingData(){
    var rankingID = document.getElementById("textBoxForRankingId").value ;
    console.log(rankingID);

    //格納先HTML要素を作成
//     var div = document.createElement("div");
//     div.innerHTML = '<div id="ranking_log_'+ rankingID +'" class="small pl-3" style="overflow:scroll;max-height:200px;background-color: rgba(0,0,0,.33)"></div>';
//     var parent = document.getElementById('main_content');
//     parent.insertBefore(div, parent.firstChild);

    document.querySelector('#myTable > tbody > tr:nth-child(1) > td:nth-child(1) > a:nth-child(5)').id = 'ranking_log_' + rankingID;
    show_ranking_log(parseInt(rankingID));

}
//   function show_ranking_log(ranking_id) {
//         console.log(ranking_id);

//     $.ajax({
//       type: 'GET',
//       data: {},
//       url:"/my/rankings/" + 6 + "/log",
//       success:function (data){
//         $('#ranking_log_' + ranking_id).html(data);
//         $('#ranking_log_button_' + ranking_id).hide();
//       },
//       error:function(data) {
//         console.log('ログの取得に失敗しました');
//       }
//     });
//   }