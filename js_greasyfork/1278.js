// ==UserScript==
// @name        zive.cz - oznaceni clanku s kapitolami
// @author      moen
// @namespace   monnef.tk
// @description Označení článků s kapitolami (hlavní stránka a "nepřehlédněte")
// @include     http://www.zive.cz/*
// @version     5
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/1278/zivecz%20-%20oznaceni%20clanku%20s%20kapitolami.user.js
// @updateURL https://update.greasyfork.org/scripts/1278/zivecz%20-%20oznaceni%20clanku%20s%20kapitolami.meta.js
// ==/UserScript==

// nastavení
var chapFormat = "[Kapitoly - ~chap~] "; // formát přidávaného textu, použijte "~chap~" pro vložení počtu kapitol
// konec nastavení

var chapterString = "~chap~";
var parseChapterCount = new RegExp(chapterString).test(chapFormat);
var debug = false;
console.log("Označovač kapitol spuštěn (pChC=" + parseChapterCount + ")");

function stackTrace() {
  var err = new Error();
  return err.stack;
}

function hasChapters(data) {
  return data.indexOf("data-tracker=\"Navigace,NextChapter\"") > -1;
}

function markLink(link, chapCount) {
  var markText = chapFormat.replace(chapterString, chapCount);
  link.attr("title", 'Skript "Označení článků s kapitolami" vám vytvořil moen\n' + link.attr("title"));
  link.html(markText + link.html());
  afterChapterProcessed();
}

var chapterListWithUnorderedListRegex = /<div class="ar-chapters">[\s\S]*?(<ul>[\s\S]*?<\/ul>)[\s\S]*?<div class="ar-content">/;
var chapterListWithSelectRegex = /<div class="[^"]*ar-chapters[^"]*">[\s\S]*?(<select class="fs-os">[\s\S]*?<\/select>)[\s\S]*?<div class="ar-content">/;

// Gets string containing "<ul>" tag with chapters.
function getChapterListWithUnorderedList(data) {
  var list = data.match(chapterListWithUnorderedListRegex);
  if (list) return list[0];
  else return null;
}

function getChapterCountFromUnorderedList(data) {
  if (!parseChapterCount) return -1;
  var list = getChapterListWithUnorderedList(data);
  if (list) {
    return list.match(/<li>/g).length;
  } else {
    return 0;
  }
}

// Gets string containing "<select>" tag with chapters.
function getChapterListWithSelect(data) {
  var list = data.match(chapterListWithSelectRegex);
  if (list) return list[0];
  else return null;
}

function getChapterCountFromSelect(data) {
  if (!parseChapterCount) return -1;
  var list = getChapterListWithSelect(data);
  if (list) {
    return list.match(/<option /g).length;
  } else {
    return 0;
  }
}

function getChapterCount(data){
  return getChapterCountFromUnorderedList(data);
}

function onGenericArticleData(link, data, articleType) {
  if (debug) console.log("got response for [" + articleType + "]: " + link.html());
  if (hasChapters(data)) {
    if (debug) console.log("marking [" + articleType + "]: " + link.html());
    if (debug) console.log(stackTrace());
    markLink(link, getChapterCount(data));
  }
}

// Ordinary articles from main page

function onArticleData(link, data) {
  if (debug) console.log("got response for: " + link.html());
  if (hasChapters(data)) {
    if (debug) console.log("marking: " + link.html());
    markLink(link, getChapterCount(data));
  }
}

function askForArticle(link, onData, articleType) {
  var linkTarget = link.prop('href');
  if (linkTarget.indexOf("zive.cz") > -1) {
    if (debug) console.log("sending request: " + link.html() + " >>> " + linkTarget);
    if (debug) link.css("border", "solid 1px red");
    $.ajax({
      url: linkTarget
    }).done(function (data) {
      if (data) {
        onData(link, data, articleType);
      } else {
        console.log("got null data :(", link.text(), link[0]);
      }
    });
  } else {
    if (debug) console.log("skipping non-zive.cz link - " + linkTarget);
  }
}

$(".box-data > .arlist").each(function () {
  if (debug) $(this).css("border", "solid 2px green");
  var link = $(".smaller > a, h2 > a", this);
  askForArticle(link, onGenericArticleData, "main");
});


// Articles from "Don't miss"

function onDontMissData(link, data) {
  if (debug) console.log("got response for [don't miss]: " + link.html());
  if (hasChapters(data)) {
    if (debug) console.log("marking [don't miss]: " + link.html());
    markLink(link, getChapterCount(data));
  }
}

$("#article-promo-content div[id^=article-promo-content-detail]").each(function () {
  if (debug) $(this).css("border", "solid 2px orange");
  var link = $(".promo-text h1 a", this);
  if (debug) link.css("border", "solid 1px red");
  askForArticle(link, onGenericArticleData, "don't miss");
});


// "Similar articles" bellow current acrticle
$("#ctl04_maindata .box-tabbed .bx-data .arlist").each(function () {
  if (debug) $(this).css("border", "solid 2px gold");
  var link = $("h2 a", this);
  if (debug) link.css("border", "solid 1px magenta");
  askForArticle(link, onGenericArticleData, "similar");
});

// "Created by" notice
var createdCreatedByNotice = false;

function createCreatedByNotice() {
  var sigId = "chapMarkerSig";
  var sigElem = $("<div id='" + sigId + "'>Skript pro označení článků s kapitolami vám napsal <a href='http://monnef.tk'>moen</a>.</div>");

  var mainPageDiv = $("#ctl04_maindata .box-tabbed-gray div.box-data").last();
  var mainPageOlderDiv = $("#ctl04_secdata .box-tabbed-gray div.box-data").last();
  var similarArticlesDiv = $("#ctl04_maindata .box-tabbed .bx-data").last();
  var candidates = [mainPageDiv, mainPageOlderDiv, similarArticlesDiv];
  var nonEmpty = function (a) {
    return a.size() != 0;
  };
  var nonEmptyCandidates = candidates.filter(nonEmpty);
  if (nonEmptyCandidates.length > 0) {
    nonEmptyCandidates[0].append(sigElem);
  }

  $("#" + sigId).css("text-align", "right").css("font-size", "120%").css("margin-bottom", "5px");
}

function afterChapterProcessed() {
  if (!createdCreatedByNotice) {
    createdCreatedByNotice = true;
    createCreatedByNotice();
  }
}
