// ==UserScript==
// @name        To watch anime uploaded by the rights holder
// @namespace   https://www.twitter.com/stella_satera
// @match       *://kissanime.com/*
// @match       *://kisscartoon.me/*
// @match       *://kissanime.to/*
// @match       *://kissasian.com/*
// @match       *://kissmanga.com/*
// @match       *://readcomiconline.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.se/*
// @match       *://kissasian.ch/*
// @match       *://kimcartoon.me/*
// @match       *://kissasian.sh/*
// @match       *://kimcartoon.to/*
// @match       *://kisstvshow.to/*
// @match       *://www.anitube.biz/*
// @match       *://www.animenova.org/*
// @match       *://up.b9dm.com/*
// @grant       none
// @version     1.0
// @author      stella_satera
// @run-at      document-idle
// @description 2019/11/24 18:10:26
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392857/To%20watch%20anime%20uploaded%20by%20the%20rights%20holder.user.js
// @updateURL https://update.greasyfork.org/scripts/392857/To%20watch%20anime%20uploaded%20by%20the%20rights%20holder.meta.js
// ==/UserScript==
$('html').remove();
str="";
str+="<html> \n";
str+="<head> \n";
str+="<title>このページは違法かもしれません--This page may be illegal.</title> \n";
str+="</head> \n";
str+="<body> \n";
str+="<font color=\"red\"><h1>警告：このページは違法コンテンツである恐れがあります。</h1><h2>Warning: This page may be illegal content.</h2></font> \n";
str+="<p>このページは、『To watch anime uploaded by the rights holder』スクリプトによって、警告ページへと差し替えられました。<br>This page has been replaced with a warning page by the “To watch anime uploaded by the rights holder” script.</p> \n";
str+="</body> \n";
str+="</html> ";
document.write(str);