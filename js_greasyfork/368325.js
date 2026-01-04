// ==UserScript==
// @name     GravityTales
// @description Script that modifies the design of http://gravitytales.com/ to create a reader view.
// @version  2.3
// @include http://gravitytales.com/novel/*/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/368324-lightnovels/code/LightNovels.js?version=604207
// @grant    GM.getValue
// @grant    GM.setValue
// @namespace https://greasyfork.org/users/186987
// @downloadURL https://update.greasyfork.org/scripts/368325/GravityTales.user.js
// @updateURL https://update.greasyfork.org/scripts/368325/GravityTales.meta.js
// ==/UserScript==

var c = $("#chapterContent");
if(c.length){
  var t = $("#contentElement>div>h3").text();
  var st = $("#chapterContent>p:first").text();
  if(st === "Teaser below") {
    $("#chapterContent>p:first").remove();
    $("#chapterContent>hr:first").remove();
    st = $("#chapterContent>p:first").text() + " (Teaser)";
  }
  c.append($("#chapterNotes"));
  c.find("[style]").removeAttr('style');
  c.find("p:first").remove();
  c.find("p:first").remove();
  var p = $("div.chapter-navigation>a:first-child").attr("href");
  var toc = $("div.chapter-navigation>a:nth-child(2)").attr("href");
  var n = $("div.chapter-navigation>a:last-child").attr("href");

  createBody();
  setTitle(t);
  setSubTitle(st);
  setContent(c.html());
  setPrev(p);
  setTOC(toc);
  setNext(n);
}