// ==UserScript==
// @name        2024年暑假教师研修|切课
// @namespace   Violentmonkey Scripts
// @match       https://basic.smartedu.cn/*
// @grant       none
// @version     4
// @author      -
// @description 2024/7/26 22:03:40
// @license     咀嚼
// @downloadURL https://update.greasyfork.org/scripts/502619/2024%E5%B9%B4%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%88%87%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502619/2024%E5%B9%B4%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%88%87%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
//暑假研修页面依次打开八个学习网页
  var a = 'https://basic.smartedu.cn/training/2024sqpx'
  var b = 'https://basic.smartedu.cn/training/5d7cf98c-3a42-4b13-8e5f-56f40ce08b1d'
  var kc1='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=4e811eb5-9a6f-4b92-a3c5-b12ce74fb941'
  var kc2='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=a9e353d3-733f-4995-9716-6f1d1b9da1ec'
  var kc3='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=d5917520-b403-4aaa-8575-8d3868884ac4'
  var kc4='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=0d125425-968d-426c-85d6-67bb74e26ce3'
  var kc5='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=58f15ad5-a977-4c6e-8c1e-25d8aa690e28'
  var kc6='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=4b014c2a-f96e-4597-8f7d-0cfc294ca620'
  var kc7='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=4fae558f-7d10-49cd-a7d4-9feab57cea27'
  var v = document.querySelector("video");
 // function doSomething() {if(document.getElementsByClassName("resource-item")){if(!v){window.location.reload();}else {console.log('这个函数每分钟会被调用一次'); }}      }
 // setInterval(doSomething, 60000);
  let hre2 = location.href
setInterval(()=>{
             try {
if (hre2.includes(a)){window.location.replace(kc1);}
if (hre2.includes(kc1)){
  if(document.getElementsByClassName("resource-item")[6].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc2);}
	}
if (hre2.includes(kc2)){
  if(document.getElementsByClassName("resource-item")[0].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc3);}
	}
if (hre2.includes(kc3)){
  if(document.getElementsByClassName("resource-item")[2].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc4);}
	}
if (hre2.includes(kc4)){
  if(document.getElementsByClassName("resource-item")[49].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc5);}
	}
if (hre2.includes(kc5)){
  if(document.getElementsByClassName("resource-item")[6].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc6);}
	}
if (hre2.includes(kc6)){
  if(document.getElementsByClassName("resource-item")[2].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc7);}
	}
if (hre2.includes(kc7)){
  if(document.getElementsByClassName("resource-item")[8].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(b);}
	}
if (hre2.includes(b)){

  if(document.querySelectorAll("span.index-module_topprocessCMy_FZxET")[1].innerText < 10)
    {window.location.replace(kc1);}

	}
  } catch(err) {}
}, 3000);





})();

