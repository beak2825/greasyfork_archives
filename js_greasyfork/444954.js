// ==UserScript==
// @name        remove 青蛙+轮子 - 6parknews.com
// @namespace   Violentmonkey Scripts
// @match       https://www.6parknews.com/newspark/view.php
// @match       https://www.6parknews.com/newspark/index.php
// @require https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js
// @grant       none
// @version     1.12
// @author      tmpStack
// @description 2022/5/14 16:48:52
// @downloadURL https://update.greasyfork.org/scripts/444954/remove%20%E9%9D%92%E8%9B%99%2B%E8%BD%AE%E5%AD%90%20-%206parknewscom.user.js
// @updateURL https://update.greasyfork.org/scripts/444954/remove%20%E9%9D%92%E8%9B%99%2B%E8%BD%AE%E5%AD%90%20-%206parknewscom.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
var banUsers=`
  NTIzNjMxMTA NTA1MDUyNTE NTE5MTE3MDg NTA2MDQ5MDI NTIyODQzNzQ
  NTIxOTUwODY NTE0NjIwOTc NjQ5NDU4 NTExMzEyNzE NTAzNjk1NDA NTA1NTQ1MDI NTIxNzE0Nzk NTA1MTAzNDU NTEzNzU2Mjg NTIwOTcxOTA
  NTA2NTI1MTA NTIyNjIwNDc NzgwMTg5 NTA1MTgzMTY NTA1MTM2MDk NTIyOTMwNjU NTA1OTM4MDc NTIzNjI1MTc NTA1MTM2MTY NTIxODQ2NjY NTEyMjY4ODA
  NTA0OTQ0NzA NzgwMjU0 NTIzNjA1ODA MjAzNjk4NTA NTIxOTI3NDM NTE0MzgxOTc NTE4NTQ5Njk NTExMjYyMDM NzA4NjEx NTAzOTU0MDI NTA1MTI2NTg
  NTIzNTUxODE NTExOTc4NjQ NTIzNTgzNzk NTIxODQ0NTU NTIyODI2NTA NTA1ODY2MDc NTA0NTEwMjU NTEzNTY1ODI NTA3OTAxNzc NTIzNDM2MzQ NTEwMTQyODk
  NTA2MzI1NDc NTE2NzU5Nzg NTExMjAxNjg NTEzMjA5MTE NTA0NjY3MDY NTE2OTk1MDE NTEyOTY3ODY NTIyNzQzOTU NTIwMzUxMDA NTIyNzE0MDA
  NTA0NjQ0OTI NTA1NTEwMTU NTIwMTc1MjQ NTIzNDg5NjE NTIzNDA4NzQ NTE1MDU1Mzk NTIxMDc1ODA NTIzMzQwMjU NTIyOTQ3NDI NTIyMTM4ODc
  NTIyMDM5MDM NTAzNzA5NjQ NTEyMjQxMjA NTIxNzg0MDA NTIwMzgwMDU NTA0OTA2MTQ NTIyNDkyMzg NTE0NzI2NzI NTIyMzIzNzI Nzc5MTc3
  NTA1MjIwMzg NTIxOTk1MTE NTIyMDUwMDY NTIyMDI5MDc NTA3MzY3NTE NTA5Mzg0NDc NTEyNDU4MTY NTA0MTM1MDY NTIyMjk0MTM NTAzODI1ODU
  NTE1NDU0NjI NTE4NDE2Mjc NTA1ODczMTU NTExNjQ1ODg NTE5Mzg5NDQ NTIwOTE2OTY NTA1MzI2Mjg NTA1MTUyMTA NTA0NTkxMTY NTIyODgyMTU
  NTIxNzMyNzU NjgyMTQ0 NTIyNDQ5ODk NTE5MTc3MDc NjY3NDk3 NTIyMjc0MjQ NTA0OTc4ODI NTE2ODQzNjY NTA3MDI5Nzc NTIxNjc3Mzk
  NTA2MDQ4NTk NTE5OTA0NTg Nzc5MDEx NTA0NjczNDI NTA1MjA3NzY NTE3NTk2NTA NTE5OTI1MjE  NTA3NTk2NTQ Njg2Nzc1 NTIyMDU0MDI
  NTA1MTQwMDM NTE3NDU1NzM NTExMjA5OTk NTEyNzg4MjU NTA2MDA4MDM NTA0MDE0OTk NTIxODk2NzE NTIxNjI5MjY NTA0OTA2MjU NTAwNzcxMA
  NTIwODU1Mzk NTE5MTcyOTQ Nzg5NDk3 Njg1NTkz NTA0OTg4OTg NTA0MDkxNjk NTEzNjIwMzM NTIzNTg2MTQ NTA0ODI4Mjg NTE5MjQ3MTQ
  NTE3NDg1NTE NTIxMTE0NTk NTA1MDU4NTA NTA2MzQzOTE NTIwOTg3Njg NTE1MDUzNTA Nzc2ODk2 NTA0OTM2NDg NTE4NTE3MDE NTA0Njg4ODM
  NTA1MDQzNzM NTAwNTQ4NQ NTA4MDE2MjU NTIwMzY1MzI NTA1MTk1NTA NTA2ODk4Njk NTIzNTMyMTI NTA5MDExOTk NTA3OTgwODk NTA1MTI3MTc
  NTIwMTA1MDg NTE5OTQ5MzQ NTIwNDEzNTA NTIxNzE2NDg NTIyMzc1MDU NTIwODMwMTI NTA0NTg4NDA NTA1MDcxMzI NTIxOTU5NTg NTA3MjQ3NDc
  NTIwMzk1ODc NTIzMjI4MDU NTExMzQ3MTg NTIzMjY2ODQ NTIwNDUxNDM NTE3NTI5NDY NTA0OTk2OTY NTIyMjQ0MDI NTE5MDI5OTI NTEzMzAzNjE
  NTA2OTQ4Njg NTA2NDUxOTg NTEwNzUxMTQ NTIyODMwNjg NTA3MDc2MzI NTExMTMyMTE NzAzMjk4 NTA0OTE2MTk NTIyODA2MjI NTIwNTgxOTI
  NTA0ODUwMDk NTA0Njg3ODU NTEwNTUwNDQ NTA4NjQwNTk NTA1MTU4MTU NTA1MDg4OTM NTA1MTg5Nzg NTIxNTUxMjM NTIzNDQ5MTI NTA2OTQ0OTQ
  NTA1MzY1MzU NTIwNDE4Njk NTE2Nzg3Mzg Njg5MDE2 Njg5MDE2 NTIyODYzNTA NTExMTMyMTE  NTIxODg5NDU NTA1MDQ4Mjg NTA5MDA4ODQ
  NTEyMDg4ODA NTA2NDQwNTE NTA2ODMwNjU NTA1MDQzOTY NTA3NjU5NDg NTIzMzU1NjU NTIyNTkwNzI NTIwODUzMTE NTA1ODQ2MDI
  NTA0NjA5MDQ NTA2MzY3MjE NTIwNTY4MDc NTIyOTExNjE NTA2MTk5ODg NTA0NTY0MTQ NTA3NDM0Mzk NzgwOTc0 NTA5MDEzODg NTIyOTA2OTI
`;


var banUserMap = new Map(banUsers.split(/[　　\s\r\n]+/).slice(1,-1).map(o=> [o,o]));




var nameRegexp = /uname=([^%]+)/;
var pageRemoveCnt = 0;
var pageCnt = 0;

$("div.reply_list_div > div.reply_auther_info > span.r_auther > a").each(function(i,e){
  
  var matches = nameRegexp.exec(e.href);
  pageCnt = pageCnt+1;
  if(matches){
   if(banUserMap.has(matches[1])){
     console.debug("removing "+ e.innerText +" ==> " + matches[1]);
     $(e).parent().parent().parent().remove();
     pageRemoveCnt = pageRemoveCnt +1;
   } else{
      console.info(e.innerText +" ==> " + matches[1]);
   }
  }else{
    console.debug(e.href);
  }
  
});

$("body").append("<div style='position:fixed;left:20px;top:10px;color: blue;text-align: left;'>"+"ban users("+banUserMap.size+")<br/>del("+pageRemoveCnt +"/"+pageCnt+") <div>")
console.log("ban user count:"+ banUserMap.size);
console.warn("remove frog comment count:"+pageRemoveCnt +"/"+pageCnt);

var banPublishers = [
  "RFA",
  "法广"
];

$("div#d_list > ul > li").each(function(i,e){
   if (banPublishers.some((ban)=>{
    return $(e).text().includes(ban);
  })){
     $(e).remove();
   };
  
});



