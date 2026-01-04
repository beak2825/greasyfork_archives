// ==UserScript==
// @name               Codeforces Problem Statement Jumper
// @name:zh-CN         Codeforces题面自动跳转
// @description        Automatic jump the problem statement from problemset to contest
// @description:zh-CN  将Codeforces Problemset下的题目页面跳转至该Contest下的题目页面
// @namespace          https://github.com/ScrapW/Codeforces-Problem-Statement-Jumper
// @icon               https://github.com/ScrapW/Codeforces-Problem-Statement-Jumper/raw/master/icon.ico
// @version            1.1
// @author             ScrapW
// @create             2019-05-17
// @match              https://codeforces.com/problemset/problem/*
// @match              http://codeforces.com/problemset/problem/*
// @match              https://codeforc.es/problemset/problem/*
// @match              http://codeforc.es/problemset/problem/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/383178/Codeforces%20Problem%20Statement%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/383178/Codeforces%20Problem%20Statement%20Jumper.meta.js
// ==/UserScript==

var protocol = window.location.protocol
var host = window.location.host
var path = window.location.pathname
path=path.substr(path.lastIndexOf("problem/")+8)
var contest = path.substr(0,path.search('/'))
var no = path.substr(path.search('/')+1)

var tar=protocol+"//"+host+"/contest/"+contest+"/problem/"+no

window.location.replace(tar)