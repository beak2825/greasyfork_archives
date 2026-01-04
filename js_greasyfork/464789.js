// ==UserScript==
// @name         Atcoder Check First AC
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Check First submit Resolved in Contests
// @author       tatetuke
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submissions
// @exclude      https://atcoder.jp/contests/*/tasks/*/editorial
// @icon         https://atcoder.jp/*
// @grant        none
// @copyright    2023, tatetuke (https://tatetuke.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/464789/Atcoder%20Check%20First%20AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464789/Atcoder%20Check%20First%20AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

function get_URL(){
    var contest_name=location.href
    console.log(contest_name)
    contest_name=contest_name.replace('https://atcoder.jp/contests/','')
    contest_name=contest_name.replace('/tasks/','')
    contest_name=contest_name.replace('/editorial','')

    var contest_name_num=contest_name.substr(contest_name.length/2-1,contest_name.length/2+1)
    contest_name=contest_name.substr(0,contest_name.length/2-1)

   //使用言語を取得
   var language = document.getElementsByClassName("select2-selection__rendered");

   //console.log(language)
   language=Array.prototype.slice.call(language)[0].innerText;
   language=language.substr(0, language.indexOf(' ('));
   if(language.indexOf(' ')!=-1){
       language=language.substr(0, language.indexOf(' '));
   }
   //console.log(language)
   //特殊文字を変換
   language=language.replace( /\+/g,'%2B');
   language=language.replace( /#/g,'%23');

   var ret='https://atcoder.jp/contests/'+contest_name+'/submissions?f.LanguageName='+language+'&f.Status=AC&f.Task='+contest_name_num+'&f.User=&orderBy=created'
   // https://atcoder.jp/contests/abc297/submissions?f.LanguageName=C%2B%2B&f.Status=AC&f.Task=abc297_a&f.User=&orderBy=created
   // https://atcoder.jp/contests/joi2018ho/submissions?desc=true&f.LanguageName=C%2B%2B&f.Status=AC&f.Task=joi2018ho_a&f.User=&orderBy=created
   // window.open(ret, '_blank'); // 新しいタブを開き、ページを表示
   console.log(language)

    return [ret ,language]

};


function get_submit_URL(){
    var query=get_URL()
    var submit_url=query[0]
    var language=query[1]
    console.log(language)

    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest(submit_url);

  request.onreadystatechange = function(){
    if (request.readyState == 4){
      if (request.status == 200){
         var contest_name=location.href
         contest_name=contest_name.replace('https://atcoder.jp/contests/','')
         contest_name=contest_name.replace('/tasks/','')
         var contest_name_num=contest_name.substr(contest_name.length/2-1,contest_name.length/2+1)
         contest_name=contest_name.substr(0,contest_name.length/2-1)
         var texl =request.responseText
         // console.log(texl)
         //提出コードをURL取得
         // var regexp_sub_url=/<a href="\/contests\/....../\/submissions\/........">詳細<\/a>/g;
         var regexp_sub_url=new RegExp('<a href="\/contests\/'+contest_name+'\/submissions\/[0-9]{6,8}">詳細<\/a>','g');
         //console.log(regexp_sub_url)
          // [0-9]{6~8}
         const arr_url = [...texl.matchAll(regexp_sub_url)];
          // <a href="/contests/abc017/submissions/40929732">詳細</a>

         console.log(arr_url.length)

         //提出時間を取得（arr_urlと1対1対応）
         var regexp_sub_time=/<td class="no-break"><time class='fixtime fixtime-second'>........................<\/time><\/td>/g;
         const arr_time = [...texl.matchAll(regexp_sub_time)];

         //コンテスト時間を取得
         var regexp_contest_time=/<time class='fixtime fixtime-full'>........................<\/time>/g;
         const contest_time = [...texl.matchAll(regexp_contest_time)];
         //コンテスト開始/終了時間を取得
         var start_time=contest_time[0][0].substr(34,17);
         var end_time=contest_time[1][0].substr(34,17);

         if(arr_time.length==0){
             window.alert("Not Accepted by "+language);
         }

         for ( i=0; i<arr_time.length ; i++) {
             var v_time=arr_time[i][0].substr(57,17)

             // console.log(v_time)
             // console.log(start_time)
             if(v_time>=start_time&&v_time<end_time){
                 var url=arr_url[i][0]
                 url=url.replace('<a href="','')
                 url=url.replace('">詳細</a>','')
                 // console.log(url)
                 window.open(url, '_blank'); // 新しいタブを開き、ページを表示
                 break;
             }
             else if(v_time>=end_time){
                 console.log('OK')
                 window.alert("not solved in contest");
                 var url2=arr_url[i][0].substr(9,37)
                 window.open(url2, '_blank');
                 break;
             }
         }

      }
    }
  }
  console.log(submit_url)
  request.open('GET', submit_url, true);
  request.send(null);
};



function create_button() {
    var parent = document.getElementsByClassName("h2");
    var a = document.createElement("a");
    a.textContent = "1st AC";
    a.setAttribute("class", "btn btn-default btn-sm");//AtcoderのCopyボタンと同じCSSを適用
    parent[0].appendChild(a);
    // a.addEventListener('mouseup', get_URL, false);
    a.addEventListener('mouseup', get_submit_URL, false);
};
create_button();


})();

