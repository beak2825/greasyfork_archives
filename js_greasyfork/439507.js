// ==UserScript==
// @name        CodeForces Solution Opener
// @namespace   slbtty.codeforces.solution
// @match       https://codeforces.*/problemset/problem/*/*
// @match       https://codeforces.*/contest/*/problem/*
// @grant       none
// @license     GPLv3
// @version     1.1.1
// @home-url    https://github.com/shenlebantongying
// @author      slbtty
// @description Quickly find fastest solution.
// @downloadURL https://update.greasyfork.org/scripts/439507/CodeForces%20Solution%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/439507/CodeForces%20Solution%20Opener.meta.js
// ==/UserScript==

const url = document.URL
url_parts=url.split("/")

if(url_parts.includes('contest')){
  var new_url = "https://codeforces.com/problemset/status/"
                +url_parts[url_parts.length-3]
                +"/problem/"
                +url_parts[url_parts.length-1]
                +"?order=BY_CONSUMED_TIME_ASC"
} else {
  var new_url = "https://codeforces.com/problemset/status/"
                +url_parts[url_parts.length-2]
                +"/problem/"
                +url_parts[url_parts.length-1]
                +"?order=BY_CONSUMED_TIME_ASC"
}

var mainMenu = document.querySelector(".main-menu-list");

var solution_li = document.createElement("li");

var btn = document.createElement('a');
btn.setAttribute('href',new_url);
btn.innerHTML = "Solution";

solution_li.appendChild(btn);
mainMenu.appendChild(solution_li);
