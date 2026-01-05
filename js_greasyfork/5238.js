// ==UserScript==
// @name        DailyWTF HTML comments shower
// @namespace   http://www.pathofexile.com/passive-skill-tree/
// @description Shows the HTML comments in the article body
// @include     http://thedailywtf.com/Articles/*
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/5238/DailyWTF%20HTML%20comments%20shower.user.js
// @updateURL https://update.greasyfork.org/scripts/5238/DailyWTF%20HTML%20comments%20shower.meta.js
// ==/UserScript==

// taken from a comment here and reformatted
// http://thedailywtf.com/Articles/Connected-to-the-Connector-to-the-Connection-to-the-System.aspx
b = document.querySelector('#article-page');
b.innerHTML=b.innerHTML.replace(/<!--/g,'<span style="color:red;">').replace(/-->/g,'</span>');