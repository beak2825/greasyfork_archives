// ==UserScript==
// @name         AtCoder Problems start/end alert
// @namespace    AtCoder Problems
// @version      0.1
// @description  バーチャルコンテスト開始時と終了時にアラートを出します。
// @author       harurun
// @match        https://kenkoooo.com/atcoder/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425193/AtCoder%20Problems%20startend%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/425193/AtCoder%20Problems%20startend%20alert.meta.js
// ==/UserScript==

function main() {
  //コンテスト以外のページの場合は即return
  if(!location.href.match("https://kenkoooo.com/atcoder/#/contest/show/.*")){
    return;
  }
  var org=document.getElementsByTagName("tr")
  var rr=org.item(0).children
  var data=rr[1].textContent.split(" ")
  var start_date=data[0].split("-")
  var start_time=data[1].split(":")

  //start time
  if(new Date(start_date[0],start_date[1]-1,start_date[2],start_time[0],start_time[1],start_time[2])>=new Date()){
    setTimeout(()=>{
      window.alert('コンテストが始まりました。(by AtCoder Problems start/end alert)\n更新すると問題が表示されます。')
    },new Date(start_date[0],start_date[1]-1,start_date[2],start_time[0],start_time[1],start_time[2]) - new Date())
    //月だけ0~11
  }else{
    console.log("contest already started")
  }

  var end_date=data[4].split("-")
  var end_time=data[5].split(":")

  //end time
  if(new Date(end_date[0],end_date[1]-1,end_date[2],end_time[0],end_time[1],end_time[2])>=new Date()){
    setTimeout(()=>{
      window.alert('コンテストが終了しました。(by AtCoder Problems start/end alert)')
    },new Date(end_date[0],end_date[1]-1,end_date[2],end_time[0],end_time[1],end_time[2]) - new Date())
  }else{
    console.log("contest is already finished")
  }
  //setTimeoutは実行時間-現在の時刻で指定する。
  return;
};

//ロードが終わってから実行するために1秒遅らせる。
setTimeout(()=>{
  main()
},1000)