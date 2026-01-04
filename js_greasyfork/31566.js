// ==UserScript==
// @name        Yeeyi remove top old posts
// @name:zh-CN  Yeeyi去除霸屏信息
// @namespace   github.com/lancelovereading
// @description Remove the posts on yeeyi job lists which are always on the top of the forum for a long time.
// @description:zh-CN 去除Yeeyi招聘版霸屏信息。个人使用，请勿滥用。
// @match       *://www.yeeyi.com/*
// @version     2017.7.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31566/Yeeyi%20remove%20top%20old%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/31566/Yeeyi%20remove%20top%20old%20posts.meta.js
// ==/UserScript==
// 找出所有行
var unwantedElements = document.getElementsByTagName('tr');
var i = unwantedElements.length;

// 构造正则表达式组
var list_author = [
  "大味老火锅",
  "garyguo0321",
  "HARKHARKMEL",
  "CareerDirect",
  "yeeyi",
  "shawn88",
  "澳洲太平洋",
  "CentroGroup",
  "APICGroup",
  "jindingau",
  "小宝快乐无极限",
  "OriginAcc",
  "melacc",
  "Henry_z",
  "阿拉蕾妞",
  "猫本吴彦祖",
  "LEO_CAI",
  "澳华教育咨询",
  "ubertom",
  "fhx128",
  "sddsfdf",
  "beauty998",
  "kevinfung",
  "AuturnAccounts",
  "winniehou",
  "the_job_factory",
  "惊天战神",
  "yu818",
  "adlydgzy",
];
var list_title = [
    "(大|中|小|搬运)工",
    "卡车司机",
];
var regex_author = new RegExp(list_author.join("|"));
var regex_title = new RegExp(list_title.join("|"));

//遍历
while (i--) {
  if (unwantedElements[i].getElementsByClassName('by')[0]
      .childNodes[1].firstChild.innerHTML.match(regex_author)||
      unwantedElements[i].getElementsByClassName('new')[0]
      .childNodes[2].innerHTML.match(regex_title)){
    unwantedElements[i].parentNode.removeChild(unwantedElements[i]);
  }
}