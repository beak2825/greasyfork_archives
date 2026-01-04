// ==UserScript==
// @name           Fuck slink
// @name:en        Fuck slink
// @license        MIT
// @namespace      https://slink.bid/
// @version        0.0.2
// @description    slink.bid をバイパス
// @description:en Bypassing slink.bid
// @author         iniimi2170
// @require        https://code.jquery.com/jquery-3.6.1.min.js
// @match          https://slink.bid/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/457058/Fuck%20slink.user.js
// @updateURL https://update.greasyfork.org/scripts/457058/Fuck%20slink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let query = getUrlQueries(window.location.search);
    if (query.length === 0 || !query.go) {
        return
    }
    let target = atob(query.go);
    document.documentElement.innerHTML = '<h3>Destination -> <a href="' + target + '">' + target + '</a></h3>'
    if (!target.match(/leechpremium\.link/)) {
        document.location.href = target;
    }
})();


function getUrlQueries() {
  var queryStr = window.location.search.slice(1)
  let queries = {}

  if (!queryStr) {
    return queries
  }
  queryStr.split('&').forEach(function(queryStr) {
    var queryArr = queryStr.split('=')
    queries[queryArr[0]] = queryArr[1]
  });
  return queries
}