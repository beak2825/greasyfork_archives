// ==UserScript==
// @name         Steam DB Helper Replace "Install button" to "Store button"
// @namespace    https://twitter.com/rin_jugatla
// @version      0.1
// @description  Steam DB Freeページでゲームインストールボタンをスチームクライアントでストアページを開くボタンに変更
// @author       rin_jugatla
// @match        https://steamdb.info/upcoming/free/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404127/Steam%20DB%20Helper%20Replace%20%22Install%20button%22%20to%20%22Store%20button%22.user.js
// @updateURL https://update.greasyfork.org/scripts/404127/Steam%20DB%20Helper%20Replace%20%22Install%20button%22%20to%20%22Store%20button%22.meta.js
// ==/UserScript==

// 【Javascript】XPathを使う（document.evaluate）
// https://www.softel.co.jp/blogs/tech/archives/2067
document.getElementsByXPath = function(expression, parentElement) {
    var r = []
    var x = document.evaluate(expression, parentElement || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    for (var i = 0, l = x.snapshotLength; i < l; i++) {
        r.push(x.snapshotItem(i))
    }
    return r
}

// インストールボタン
var xpath = '//*[contains(@id, "js-app-install")]'
var installs = document.getElementsByXPath(xpath)

for(var i = 0; i < installs.length; i++)
{
    installs[i].href = installs[i].href.replace('install', 'store')
    installs[i].setAttribute('aria-label', 'Launch Steam Client')
}