// ==UserScript==
// @name        osu! Highlight For BN Names
// @namespace   https://osu.ppy.sh/u/376831
// @include     *osu.ppy.sh/g/28*
// @include     *osu.ppy.sh/forum/ucp.php*
// @include     *osu.ppy.sh/forum/60*
// @include     *osu.ppy.sh/u/*
// @include     *osu.ppy.sh/forum/t*
// @include     *osu.ppy.sh/forum/p*
// @version     1.3.3
// @description Add purple bold font style for all names of beatmap nominators in osu! website
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10386/osu%21%20Highlight%20For%20BN%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/10386/osu%21%20Highlight%20For%20BN%20Names.meta.js
// ==/UserScript==
var bnColor = '#8040FF';
var bnFriendColor = '#FF00FF';
var cookiesSaveDays = 7;
addLoadEvent(loadEvent);
function loadEvent() {
  var title = document.title;
  var url = document.URL;
  switch (title) {
    case 'osu! - Beatmap Nomination Group':
      var bnNumber = getBnNumber('User');
      removeBnList(bnNumber, 'User');
      addBnList();
      var friends = getBnList('Friend');
      var bnElements = getElements('username');
      addFriendSighToBn(bnElements, friends);
      break;
    case 'Front page':
      var friends = getChilds(getElements('profile_friend '));
      var bnList = getBnList('User');
      var bnNumber = getBnNumber('Friend');
      removeBnList(bnNumber, 'Friend');
      addCookie('bnFriendNumber', addStyleToBn(friends, bnList, true, false, true, 0));
      break;
    case 'Modding Queues':
    case 'View messages':
      var posters = getChilds(getElements('topicauthor'));
      var bnList = getBnList('User');
      addStyleToBn(posters, bnList, true, false, false, 0);
      break;
  }
  if (url.indexOf('osu.ppy.sh/u/') != - 1) {
    var userName = document.getElementsByClassName('profile-username');
    var bnList = getBnList('User');
    addStyleToBn(userName, bnList, false, false, false, 0);
}
if (url.indexOf('osu.ppy.sh/forum/t') != - 1 || url.indexOf('osu.ppy.sh/forum/p') != - 1) {
  var posters = document.getElementsByClassName('postauthor');
  var bnList = getBnList('User');
  addStyleToBn(posters, bnList, false, true, false, 0);
}
}
function getElements(name) {
return document.getElementsByClassName(name);
}
function getChilds(elements) {
var childs = new Array();
for (var i = 0; i < elements.length; i++) {
childs[i] = elements[i].firstChild;
}
return childs;
}
function isElementBn(element, bnList) {
for (var i = 0; i < bnList.length; i++) {
if (element.innerHTML.trim() == bnList[i]) {
  return true;
}
}
return false;
}
function addStyleToElement(element, isBold, isInThread) {
element.style['color'] = bnColor;
if (isBold) {
element.style['font-weight'] = 'bold';
}
if (isInThread) {
element.parentNode.parentNode.parentNode.parentNode.parentNode.style['border-top'] = 'solid 3px #FFCA22';
}
}
function addStyleToBn(elements, bnList, isBold, isInThread, isAddFriend, bnFriendNumber) {
for (var i = 0; i < elements.length; i++) {
if (isElementBn(elements[i], bnList)) {
  addStyleToElement(elements[i], isBold, isInThread);
  if (isAddFriend) {
    if (bnFriendNumber == 0) {
      addCookie('bnFriendNames', elements[i].innerHTML);
    } else {
      addCookie('bnFriendNames', getCookie('bnFriendNames') + ',' + elements[i].innerHTML);
    }
    bnFriendNumber++;
  }
}
}
return bnFriendNumber;
}
function addFriendSighToBn(elements, friendsBnList) {
for (var i = 0; i < elements.length; i++) {
if (isElementBn(elements[i], friendsBnList)) {
  elements[i].style['color'] = bnFriendColor;
}
}
}
function getBnNumber(nameType) {
var bnNumber = parseInt(getCookie('bn' + nameType + 'Number'));
if (isNaN(bnNumber)) {
bnNumber = 150;
}
return bnNumber;
}
function removeBnList(bnNumber, nameType) {
removeCookie('bn' + nameType + 'Names');
removeCookie('bn' + nameType + 'Number');
}
function addBnList() {
var userNames = getElements('username');
addCookie('bnUserNumber', userNames.length);
addCookie('bnUserNames', userNames[0].innerHTML);
for (var i = 1; i < userNames.length; i++) {
addCookie('bnUserNames', getCookie('bnUserNames') + ',' + userNames[i].innerHTML);
}
}
function getBnList(nameType) {
return getCookie('bn' + nameType + 'Names').split(',');
}
function addCookie(name, value) {
var exp = new Date();
exp.setTime(exp.getTime() + cookiesSaveDays * 24 * 60 * 60 * 1000);
document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/';
}
function removeCookie(name) {
document.cookie = name + '=;expires=' + (new Date(0)).toGMTString() + ';path=/';
}
function getCookie(name) {
var arr,
reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
if (arr = document.cookie.match(reg)) {
return unescape(arr[2]);
} 
else {
return null;
}
}
function trim(str) {
str = str.replace(/^(\s|\u00A0)+/, '');
for (var i = str.length - 1; i >= 0; i--) {
if (/\S/.test(str.charAt(i))) {
  str = str.substring(0, i + 1);
  break;
}
}
return str;
}
function addLoadEvent(func) {
var oldonload = window.onload;
if (typeof window.onload != 'function') {
window.onload = func;
} else {
window.onload = function () {
  oldonload();
  func();
}
}
}
