// ==UserScript==
// @name           HackForums.net - Clickable Titles In Message Tracking
// @namespace      spafic/messagetrackingclick
// @description    Creates links to PMs listed in the tracking page
// @author         Spafic
// @copyright      Spafic 2012 (http://userscripts.org/users/Spafic)
// @licence        GNU General Public License
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. For a copy, see <http://www.gnu.org/licenses/>. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.use
//
// @match          hackforums.net/private.php?action=tracking
// @version        1.1.1
//
// @icon           http://cdn2.hackforums.net/uploads/ficons/hf-news.png
// @icon64         http://cdn2.hackforums.net/uploads/ficons/hf-news.png
// @history        1.0.0 - Script created
// @history        1.1.0 - Updated to work with unread messages.
// @downloadURL https://update.greasyfork.org/scripts/2946/HackForumsnet%20-%20Clickable%20Titles%20In%20Message%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/2946/HackForumsnet%20-%20Clickable%20Titles%20In%20Message%20Tracking.meta.js
// ==/UserScript==

(function(){var a,b,c;a=document.getElementsByTagName("table")[2];a=a.getElementsByTagName("tr");for(b=2;b<a.length-1;b++)-1==a[b].textContent.indexOf("You currently do not have any")&&(c=parseInt(a[b].getElementsByClassName("checkbox")[0].getAttribute("name").split(/\[(.*)\]/gim)[1])+1,a[b].getElementsByTagName("td")[1].innerHTML='<a href="http://www.hackforums.net/private.php?action=read&pmid='+c+'" target="_BLANK">'+a[b].getElementsByTagName("td")[1].innerHTML+"</a>");a=document.getElementsByTagName("table")[3];a=a.getElementsByTagName("tr");for(b=2;b<a.length-1;b++)-1==a[b].textContent.indexOf("You currently do not have any")&&(c=parseInt(a[b].getElementsByClassName("checkbox")[0].getAttribute("name").split(/\[(.*)\]/gim)[1])+1,a[b].getElementsByTagName("td")[1].innerHTML='<a href="http://www.hackforums.net/private.php?action=read&pmid='+c+'" target="_BLANK">'+a[b].getElementsByTagName("td")[1].innerHTML+"</a>")})();