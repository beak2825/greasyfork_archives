// ==UserScript==
// @name     LiberSpark
// @description Script that modifies the design of http://liberspark.com/ to create a reader view.
// @version  1.3
// @include http://liberspark.com/read/*/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/368324-lightnovels/code/LightNovels.js?version=604203
// @grant    GM.getValue
// @grant    GM.setValue
// @namespace https://greasyfork.org/users/186987
// @downloadURL https://update.greasyfork.org/scripts/368348/LiberSpark.user.js
// @updateURL https://update.greasyfork.org/scripts/368348/LiberSpark.meta.js
// ==/UserScript==

var c = $("#reader-content");
if(c.length){
  var t = $("#reader-page-title").text();
  var st = $("#reader-chapter").text() + " : " + $("#reader-title").text();

	c.find("[style]").removeAttr('style');

  var temp = $("#reader-page-title").parent().parent().parent().next();
	var p = temp.find('div[align="left"]>a').attr("href");
	var toc = $("#reader-page-title").attr("href");
	var n = temp.find('div[align="right"]>a').attr("href");

  createBody();
  setTitle(t);
  setSubTitle(st);
  setContent(c.html());
  setPrev(p);
  setTOC(toc);
  setNext(n);
}