// ==UserScript==
// @name        strudel-cafe-crunch
// @namespace   endeciel@protonmail.com
// @description makes site compact
// @include     https://strudel-cafe.com/*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/430004/strudel-cafe-crunch.user.js
// @updateURL https://update.greasyfork.org/scripts/430004/strudel-cafe-crunch.meta.js
// ==/UserScript==

$("button[class$='farm-stats-header']").remove()
$("button[class$='farm-stats-header collapsed']").remove()
$("h2[class$='farm-style']").remove()
$("div[id$='new-header']").remove()
$("div[class$='quest-banner-container']").remove()
$("div[class$='npc']").remove()
$("div[style*='height:400px']").css("height","100px")
$("div[class$='manage-barn']").text("manage");

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.orchard-plot .crop-badge {bottom: 50px;}');
addGlobalStyle('.orchard-plot {height: 150px;}');
addGlobalStyle('.seed {float: left; box-sizing: unset;}');
addGlobalStyle('.trade-container { max-width: 50% !important; float: left; border-radius: 0px; padding: 5px; margin-bottom: 5px; background: white;}');
addGlobalStyle('.trade-container { max-width: 50% !important; float: left; border-radius: 0px; padding: 5px; margin-bottom: 5px;}');
addGlobalStyle('.live-clock { position: fixed; top:0px; right:0px; z-index:99;}');
addGlobalStyle('.inventory-box { max-width: 100%; border-radius: 0px; padding: 5px; margin-bottom: 5px;}');
addGlobalStyle('.row.inventory-box { max-width: 50% !important; float: left; border-radius: 0px; padding: 5px; margin-bottom: 5px;}');
addGlobalStyle('.inventory-box-alt { border-radius: 0px; padding: 5px; margin-bottom: 5px;}');
addGlobalStyle('.barHeader { border-radius: 0px !important; margin-bottom:5px;}');
addGlobalStyle('.purchase {margin: 5px; max-width 100px;}');
addGlobalStyle('.img {max-width: 60px !important;}');
addGlobalStyle('.new-container img {max-width: 200px !important;}');
addGlobalStyle('.new-container {width: 1860px; margin: 10px !important;}');
addGlobalStyle('@media screen and (max-width: 800px) {.new-container {max-width: 960px !important;}}');
addGlobalStyle('.seed-wrapper {max-width: 80px !important;}');
addGlobalStyle('.tool-box {width: 580px !important; overflow-x: hidden; border-radius: 0px;}');
addGlobalStyle('.orchard-tools {height: 750px !important; width: 400px !important; overflow-x: hidden; border-radius: 0px;}');


