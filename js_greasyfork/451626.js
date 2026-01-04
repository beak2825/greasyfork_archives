// ==UserScript==
// @name         make youtube caption selectable
// @namespace    none
// @version      0.3
// @description  Use this script if you want be able to select youtube captions/subtitles! source: https://stackoverflow.com/questions/40165879/how-make-youtube-subtitles-selectable
// @author       ilya, edr1412
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451626/make%20youtube%20caption%20selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/451626/make%20youtube%20caption%20selectable.meta.js
// ==/UserScript==

!function() {
  setInterval(make_subtitles_selectable, 750);
  function make_subtitles_selectable(){
    elem=document.querySelector("div.caption-window");
    if(elem!=null){
        elem.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        }, true);
        elem.setAttribute("draggable", "false");
        elem.style.userSelect="text";
        /* For Safari */
        elem.style.WebkitUserSelect="text";
        elem.style.cursor="text";
        elem.setAttribute("selectable", "true");
    }
    elem=document.querySelector("span.ytp-caption-segment:not([selectable='true']");
    if(elem!=null){
        elem.style.userSelect="text";
        /* For Safari */
        elem.style.WebkitUserSelect="text";
        elem.style.cursor="text";
        elem.setAttribute("selectable", "true");
    }
    elem=document.querySelector("#caption-window-1:not([selectable='true']");
    if(elem!=null){
        elem.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        }, true);
        elem.setAttribute("selectable", "true");
        elem.setAttribute("draggable", "false");
    }
}
}()