// ==UserScript==
// @name         AtCoder Hide Editorial
// @namespace    AtCoder
// @version      0.5
// @description  hide editorial
// @author       harurun
// @match        https://atcoder.jp/contests/*/tasks/*/editorial*
// @match        https://atcoder.jp/contests/*/editorial*
// @match        https://atcoder.jp/contests/*/tasks/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425127/AtCoder%20Hide%20Editorial.user.js
// @updateURL https://update.greasyfork.org/scripts/425127/AtCoder%20Hide%20Editorial.meta.js
// ==/UserScript==

function usernames() {
  var usr=document.getElementsByClassName("username")
  for(var i=0;i<usr.length;i++){
    usr[i].removeAttribute("href")
    usr[i].textContent="hide editorial"
  }
}

function editional() {
  'use strict';
  var alist=document.getElementsByTagName("a")
  for(var i=0;i<alist.length;i++){
    var target=alist[i]
    var url=target.href
    if(target.textContent==''||url.match('https://www.addtoany.com/.*')||url.match('http://www.timeanddate.com/worldclock/.*')||url.match('https://www.timeanddate.com/worldclock/.*')){
      continue;
    }
    if(url.match('https://youtu.be/.*')||url.match('https://atcoder.jp/contests/.*/editorial/.*')||!(url.match('https://atcoder.jp/.*'))){
      //target.href="javascript:void(0)"
      target.removeAttribute("href")
      target.textContent="hide editorial"
    }
  }
  usernames()
}

function problem() {
  var alist=document.getElementsByTagName("a")
  for(var i=0;i<alist.length;i++){
    var target=alist[i]
    var url=target.href
    if(url.match('https://atcoder.jp/contests/.*/tasks/.*/editorial')||url.match('https://atcoder.jp/contests/*/tasks/*/editorial')){
      target.removeAttribute("href")
      target.textContent="hide editorial"
    }
  }
  usernames()
}

function main() {
  var url=location.href
  if(url.match('https://atcoder.jp/contests/.*/tasks/.*/editorial')){
    //console.log("hide editorial(editorial)")
    editional()
  }else if(url.match('https://atcoder.jp/contests/.*/tasks/.*')||url.match('https://atcoder.jp/contests/.*/tasks/.*?lang=en')){
    //console.log('hide editorial(problem)')
    problem()
  }else if(url.match('https://atcoder.jp/contests/.*/editorial')||url.match('https://atcoder.jp/contests/.*/tasks/.*/editorial')||url.match('https://atcoder.jp/contests/.*/editorial?lang=en')||url.match('https://atcoder.jp/contests/.*/tasks/.*/editorial')){
    //console.log('hide editorial(editorial)')
    editional()
  }
}

main()
