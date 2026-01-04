 // ==UserScript==
// @name         Add TAPD Tasks to Things
// @namespace    com.ruitiancapital.userscript.tapd.things
// @version      0.1
// @description  None
// @author       Willian
// @match        https://www.tapd.cn/*/prong/stories/view/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400690/Add%20TAPD%20Tasks%20to%20Things.user.js
// @updateURL https://update.greasyfork.org/scripts/400690/Add%20TAPD%20Tasks%20to%20Things.meta.js
// ==/UserScript==

const tags = 'TAPD';
const project = '锐天投资';
const heading = '工作內容';
const showDialog = true;

// ==/Config==
// TODO: won't work yet
GM_addStyle(
`
.things_icon {
  background-image: url(../img/tfl-hebe.sprite+1586243009759.png) !important;
  display: inline-block !important;
}
`);

const info = $("#locateForStoryInfo");
const id = info.find('.story-title-id').text().trim();
const title = info.find('.editable-value').text().trim();

const addTitle = encodeURIComponent(id + title);

let ComponantURL = `things:///add?title=${addTitle}&notes=${location.href}&show-quick-entry=${showDialog?'true':'false'}`
if(tags){
    ComponantURL += `&tags=${encodeURIComponent(tags)}`;
}
if(project){
    ComponantURL += `&list=${encodeURIComponent(project)}`;
}
if(heading){
    ComponantURL += `&heading=${encodeURIComponent(heading)}`;
}
// See https://culturedcode.com/things/support/articles/2803573/

$('<a id="add_to_things_btn"> <span class="things_icon"> Things </span> </a>')
    .attr('href', ComponantURL)
    .addClass('btn add-to-things-item operation-item ')
    .prependTo('.subject_title > .right-operation')

