// ==UserScript==
// @name         PSO2攻略Wiki 検索結果のコメント系を折りたたむ
// @description 折りたためるようにします。
// @namespace    https://github.com/unarist/
// @version      0.2
// @author       unarist
// @match        http://pso2.swiki.jp/?*&cmd=search&*
// @match        http://pso2m.swiki.jp/?*&cmd=search&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26975/PSO2%E6%94%BB%E7%95%A5Wiki%20%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E7%B3%BB%E3%82%92%E6%8A%98%E3%82%8A%E3%81%9F%E3%81%9F%E3%82%80.user.js
// @updateURL https://update.greasyfork.org/scripts/26975/PSO2%E6%94%BB%E7%95%A5Wiki%20%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E7%B3%BB%E3%82%92%E6%8A%98%E3%82%8A%E3%81%9F%E3%81%9F%E3%82%80.meta.js
// ==/UserScript==

var $root = $('#body ul');

var $commentPages = $root.find('a[href*=Comments]').parent();

// ついでに日付でソート
$commentPages = $commentPages.map((i,e) => ({e:e, d: $(e).text().match(/\((\d+)d\)/)[1]})).sort((a,b) => a.d - b.d).map((i,x) => x.e);

var $li = $('<li>');

$('<a style="cursor:pointer">▼Comments</a>')
.click(function(){ $('#commentLinks').toggle(); })
.appendTo($li);

$('<ul id="commentLinks" style="display: none">')
.append($commentPages)
.appendTo($li);

$li.prependTo($root);