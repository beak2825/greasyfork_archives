// ==UserScript==
// @name       Top-News
// @include  http://fussballcup.de/*
// @version    0.1
// @description  Top-News Button
// @copyright  mot33, 2016
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30517/Top-News.user.js
// @updateURL https://update.greasyfork.org/scripts/30517/Top-News.meta.js
// ==/UserScript==

window.setTimeout(function() { changes() }, 2500);
window.setInterval(function() { changes() }, 5000);
function changes()
{
    	if(!document.getElementById("top-news"))
        {
            var topnews = document.getElementsByClassName("button")[0].firstElementChild.getAttribute("href");
    		document.getElementsByClassName("blog-image")[0].innerHTML += "<b style='position:absolute;bottom:8px;'>"+"<a href='#/index.php?w=301&area=user&module=press&action=topnews&squad=" + "' class='button' id='top-news'><span>T-News</span></b></a>";
		}
}