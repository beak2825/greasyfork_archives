// ==UserScript==
// @name        RSSフィードに見えるリンクからRSS Autodiscoveryを作って埋め込む
// @name:en     embed RSS Autodiscovery from links that seem to be feed
// @description Firefox64-向き
// @description:en for Firefox 64-
// @match *://*/*
// @version 0.1
// @grant none
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/375796/RSS%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E3%81%AB%E8%A6%8B%E3%81%88%E3%82%8B%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%8B%E3%82%89RSS%20Autodiscovery%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E5%9F%8B%E3%82%81%E8%BE%BC%E3%82%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375796/RSS%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E3%81%AB%E8%A6%8B%E3%81%88%E3%82%8B%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%8B%E3%82%89RSS%20Autodiscovery%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E5%9F%8B%E3%82%81%E8%BE%BC%E3%82%80.meta.js
// ==/UserScript==

(function() {

  seemFeed = [
    '//a[contains(@href,"rss=")]',
    '//a[contains(@href,"rss") and contains(@href,".xml")]',
    '//a[contains(@href,"rss") and contains(@href,".rdf")]',
    //  '//a[contains(@href,"index.rdf")]',
    '//a[contains(@href,".rdf")]',
    '//a[contains(@href,"rss") and contains(@href,".php")]',
  ].join("|");

  for (let ele of elegeta(seemFeed)) {
    console.log(ele.outerHTML + " はRSSフィードに見えるのでRSS Autodiscoveryを追加します")

    var link = ele.parentNode.insertBefore(document.createElement("link"), ele);
    var url2 = ele.href;
    link.rel = "alternate"
    link.type = "application/rss+xml"
    link.title = (ele.innerText || ele.href) + " | " + document.title; //+" | "+ele.href;
    link.href = url2;
  }
  return;

  function elegeta(xpath, node = document) {
    var ele = document.evaluate("." + xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var array = [];
    for (var i = 0; i < ele.snapshotLength; i++) array[i] = ele.snapshotItem(i);
    return array;
  }

})();
