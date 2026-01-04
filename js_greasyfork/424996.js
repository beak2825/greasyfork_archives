// ==UserScript==
// @name         Mega.nz Dark Reader Grid
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      0.1
// @description  Fixes the grid that is produced by dark reader extension
// @author       Quin15
// @match        https://mega.nz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424996/Meganz%20Dark%20Reader%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/424996/Meganz%20Dark%20Reader%20Grid.meta.js
// ==/UserScript==

var styles = `.files-grid-view.fm .grid-scrolling-table, .files-grid-view.fm .grid-table, .files-grid-view.fm .grid-scrolling-table .jspPane, .transfer-scrolling-table, .transfer-scrolling-table .jspPane {
	background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Слой_1' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='1px' height='48px' viewBox='-305 373 1 48' enable-background='new -305 373 1 48' xml:space='preserve'%3E%3Ctitle%3EUntitled%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cpath id='Fill-50' sketch:type='MSShapeGroup' fill='%23181a1b' enable-background='new ' d='M-305,397h1v24h-1V397z'/%3E%3Cpath id='Fill-50_1_' sketch:type='MSShapeGroup' fill='%23212121' d='M-305,373h1v24h-1V373z'/%3E%3C/svg%3E") !important;
}`
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);