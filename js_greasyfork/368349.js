// ==UserScript==
// @name     WuxiaWorld
// @description Script that modifies the design of https://www.wuxiaworld.com/ to create a reader view.
// @version  2.4
// @include https://www.wuxiaworld.com/novel/*/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/368324-lightnovels/code/LightNovels.js?version=604207
// @grant    GM.getValue
// @grant    GM.setValue
// @namespace https://greasyfork.org/users/186987
// @downloadURL https://update.greasyfork.org/scripts/368349/WuxiaWorld.user.js
// @updateURL https://update.greasyfork.org/scripts/368349/WuxiaWorld.meta.js
// ==/UserScript==

var c = $("div.fr-view");
if(c.length){
  var st = c.prev().find("div>h4").first().text();
  
  c.find("[style]").removeAttr('style');
  c.find('[dir]').removeAttr('dir');

	var temp = $("div.top-bar-area>ul.list-inline");
	var t = temp.find("li.caption>a>h4").text();
  var p = temp.find('li.prev>a').attr("href");
	var toc = temp.find("li.caption>a").attr("href");
	var n = temp.find('li.next>a').attr("href");

  createBody();
  setTitle(t);
  setSubTitle(st);
  setContent(c.html());
  setPrev(p);
  setTOC(toc);
  setNext(n);
}
