// ==UserScript==
// @name        Wikipedia Sticky Header
// @namespace   Violentmonkey Scripts
// @match       *://*.wikipedia.org/wiki/*
// @match       *://wikipedia.org/wiki/*
// @match       *://wikimedia.org/wiki/*
// @match       *://*.wikimedia.org/wiki/*
// @license     GPLv3
// @grant       none
// @version     24.02.27
// @author      PupAtlas! <mfoulks1@gmail.com>
// @description Makes headers on large Wikipedia tables sticky!
// @downloadURL https://update.greasyfork.org/scripts/488483/Wikipedia%20Sticky%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/488483/Wikipedia%20Sticky%20Header.meta.js
// ==/UserScript==

let tableObjs = [];

addEventListener("load", (event) => {
  setTimeout(() => {
    checkForElements()
  }, 250)
  setInterval(() => {
    checkForElements()
  }, 1000);

  addEventListener("scroll", (event) => {
    if(tableObjs.length > 0){
      let tableObj = tableObjs[0]
      for(tableObj of tableObjs){
        calcStickyHeader(tableObj)
      }
    }
  });
});

function calcStickyHeader(obj){
  let bounds = obj.rootElem.getBoundingClientRect();
  let currentPos = bounds.y - (obj.isSticky ? obj.headerHeight : 0);

  if((bounds.height+bounds.top)-obj.headerHeight <= 0 && obj.headerElem.style.position !== "absolute"){
    obj.headerElem.style.position = "absolute";
    obj.headerElem.style.top = ((-bounds.y)-1)+"px";
  }else if((bounds.height+bounds.top)-obj.headerHeight > 0){
    if(currentPos <= 0){
      obj.isSticky = true;

      obj.headerElem.style.position = "fixed";
      obj.headerElem.style.top = "0px";
      obj.headerElem.style.width = obj.originalBounds.width+"px";
      obj.headerElem.style.marginLeft = "-1px";
      obj.headerElem.style.background = "#eaecf0";

      obj.rootElem.style.width = obj.originalBounds.width+"px";
      obj.rootElem.style.position = "relative";
      obj.rootElem.style.top = obj.headerHeight+"px";
      obj.rootElem.style.marginBottom = obj.headerHeight+"px";

      let i = 0;
      for(let col of obj.headerElem.querySelectorAll("thead>tr:nth-of-type(1)>th,thead>tr:nth-of-type(1)>td")){
        col.style.minWidth = obj.colWidths[i]+"px"
        col.style.maxWidth = obj.colWidths[i]+"px"
        col.style.boxSizing = "border-box"
        i++;
      }

      i = 0;
      for(let col of obj.rootElem.querySelectorAll("tbody>tr:nth-of-type(1)>th,tbody>tr:nth-of-type(1)>td")){
        col.style.minWidth = obj.colWidths[i]+"px"
        col.style.maxWidth = obj.colWidths[i]+"px"
        col.style.boxSizing = "border-box"
        i++;
      }

    }else{
      obj.isSticky = false;

      obj.headerElem.style.position = null;
      obj.headerElem.style.top = null;
      obj.headerElem.style.width = null;

      obj.rootElem.style.width = null;
      obj.rootElem.style.position = null;
      obj.rootElem.style.top = null;
      obj.rootElem.style.marginBottom = null;

      let i = 0;
      for(let col of obj.headerElem.querySelectorAll("thead>tr:nth-of-type(1)>th,thead>tr:nth-of-type(1)>td")){
        col.style.minWidth = null
        col.style.maxWidth = null
        col.style.boxSizing = null
        i++;
      }

      i = 0;
      for(let col of obj.rootElem.querySelectorAll("tbody>tr:nth-of-type(1)>th,tbody>tr:nth-of-type(1)>td")){
        col.style.minWidth = null
        col.style.maxWidth = null
        col.style.boxSizing = null
        i++;
      }
    }
  }
}

function checkForElements(){
  let tables = document.querySelectorAll("#mw-content-text .mw-parser-output table:not(.sticky-table)");
  for(let table of tables){
    makeTableSticky(table);
  }
}

function makeTableSticky(table){
  if(tableObjs.find(tableObj => tableObj.rootElem == table) == null){
    if(table.querySelector("thead") == null){
      return;
    }
    let colWidths = [];
    for(let col of table.querySelectorAll("tbody>tr:nth-of-type(1)>th,tbody>tr:nth-of-type(1)>td")){
      colWidths.push(col.getBoundingClientRect().width)
    }
    tableObjs.push({
      rootElem: table,
      headerElem: table.querySelector("thead"),
      headerHeight: table.querySelector("thead").clientHeight,
      originalBounds: table.getBoundingClientRect(),
      colWidths: colWidths,
      isSticky: false
    })
    table.classList.add("sticky-table")
  }
}