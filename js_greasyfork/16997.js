// ==UserScript==
// @name         Easy Download in H ACG
// @version      1.0
// @description  维护网络健康发展:)
// @author       FeiLong
// @icon         http://www.hacg.red/favicon.ico
// @match        http://www.hacg.red/wp/*
// @grant        none
// @namespace https://greasyfork.org/zh-CN/scripts/16997-easy-download-in-h-acg
// @downloadURL https://update.greasyfork.org/scripts/16997/Easy%20Download%20in%20H%20ACG.user.js
// @updateURL https://update.greasyfork.org/scripts/16997/Easy%20Download%20in%20H%20ACG.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

//get web html
var b=document.body.innerHTML;

/**********************************************************************************************/
//auto display
b=b.replace(/display: none;/g,'display: yes;')
//magnet
b=b.replace(/([\w\d]{40})/g, function(word){
  return word.toUpperCase();}
  );
b = b.replace(/([\w\d]{40})/g,'<a target=\"_blank\" href=\"magnet\:\?xt\=urn\:btih\:$1\">magnet\:\?xt\=urn\:btih\:$1<\/a><br><a target=\"_blank\" href=\"http\:\/\/torcache\.net\/torrent\/$1\.torrent\">下载种子<\/a>');
//pan.baidu
b = b.replace(/\/s\/([\w\d]{6,8})/g,'<a target=\"_blank\" href=\"http\:\/\/pan.baidu.com\/s\/$1\">http\:\/\/pan.baidu.com\/s\/$1<\/a>');
//8 jiang
b = b.replace(/([\w\d]{6,8}) ([^<]+)<br>\n(⑨)/g,'<a  target=\"_blank\" href=\"http\:\/\/pan.baidu.com\/s\/$1\">$1<\/a><br>提取码：$2<br>解压密码：$3')
b = b.replace(/小8酱/,'<a name=\"little8\">小8酱<\/a>');
b = b.replace(/发表于/,'<h1><a href=\"#little8\">直达小8酱<\/a><h1>');
/**********************************************************************************************/

//finish
document.body.innerHTML = b;
