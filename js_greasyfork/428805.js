// ==UserScript==
// @name        ABEMA 番組表 Channel非表示
// @description 番組表の特定チャンネルを非表示します テスト
// @namespace https://greasyfork.org/users/716748
// @match       https://abema.tv/timetable
// @version     1.0.0
// @compatible  Firefox
// @author      ykhr.m
// @downloadURL https://update.greasyfork.org/scripts/428805/ABEMA%20%E7%95%AA%E7%B5%84%E8%A1%A8%20Channel%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/428805/ABEMA%20%E7%95%AA%E7%B5%84%E8%A1%A8%20Channel%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

//非表示チャンネル 各自変更してください。(見るチャンネルをHIDDEN_CHから削除してください)チャンネル名はチャンネルヘッダ画像のaltを見ています。 a.com-timetable-ChannelIconHeader__channel-link>picture>img
const HIDDEN_CH = ["news-plus","abema-special","special-plus","drama","drama-2","asia-drama","asia-drama-2","k-world","abema-anime","abema-anime-2","anime-live","anime-live2","everybody-anime","everybody-anime2","commercial","hiphop","abema-radio","fighting-sports","fighting-sports2","world-sports","world-sports-1","world-sports-2","world-sports-3","world-sports-4","boatrace","keirin-auto","fishing","shogi","shogi-live","mahjong","mahjong-live","payperview-pr","payperview-pr-2"];
//チャンネル一覧
//const HIDDEN_CH = ["abema-news","news-plus","abema-special","special-plus","drama","drama-2","asia-drama","asia-drama-2","k-world","abema-anime","abema-anime-2","anime-live","anime-live2","everybody-anime","everybody-anime2","commercial","hiphop","abema-radio","fighting-sports","fighting-sports2","world-sports","world-sports-1","world-sports-2","world-sports-3","world-sports-4","boatrace","keirin-auto","fishing","shogi","shogi-live","mahjong","mahjong-live","payperview-pr","payperview-pr-2"];






function main(){
  let hdindex = [];
  let chlst = [];
  let tablewidth=0;//テーブルのスクロール範囲。指定しないと右側に余白ができる。
  document.querySelectorAll("a.com-timetable-ChannelIconHeader__channel-link>picture>img").forEach(e=>chlst.push(e.alt));
  Array.from(new Set(HIDDEN_CH)).forEach(e=>hdindex.push(chlst.indexOf(e)+1));
  hdindex = Array.from(new Set(hdindex)).sort((a, b) => a - b);
  if(hdindex[0]===0) hdindex.shift();
  tablewidth = (chlst.length - hdindex.length)*180+24;
//  console.log(hdindex + "\ntablewidth:" + tablewidth);  
  if(hdindex.length>0){
    hdindex.forEach(e=>document.styleSheets.item(0).insertRule('a.com-timetable-ChannelIconHeader__channel-link:nth-of-type('+e+'),.com-timetable-TimeTableListTimeTableColumn:nth-of-type('+e+'){display: none!important;}', document.styleSheets.item(0).cssRules.length));
    document.styleSheets.item(0).insertRule('.com-timetable-DesktopTimeTableWrapper__container,.com-timetable-DesktopTimeTableWrapper__channel-content-header,.com-timetable-AllChannelTimeTableView__content-cover{width: ' + tablewidth + 'px !important;}', document.styleSheets.item(0).cssRules.length);
  }
}

let obs_cnt = 0
let obs = setInterval(function(){
  if(document.querySelector("a.com-timetable-ChannelIconHeader__channel-link>picture>img")){
    clearInterval(obs);
    main();
  };
  if(obs_cnt >= 20){
    clearInterval(obs);
  }
  obs_cnt++;
}, 500);
