// ==UserScript==
// @name     AO3: [Wrangling] Direct Links on Unassigned Fandoms Page
// @description  Changes links on the unassigned fandom page to go to the All Characters bin directly
// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>


// @match        *://*.archiveofourown.org/fandoms/unassigned*
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/435045/AO3%3A%20%5BWrangling%5D%20Direct%20Links%20on%20Unassigned%20Fandoms%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/435045/AO3%3A%20%5BWrangling%5D%20Direct%20Links%20on%20Unassigned%20Fandoms%20Page.meta.js
// ==/UserScript==

var list = document.getElementsByClassName("fandoms index group");
Array.from(list[0].children).forEach(function (el){
	el.firstElementChild.href +="/wrangle?show=characters";
});