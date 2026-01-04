// ==UserScript==
// @name         C20 Korridore 26.07
// @version      0.5
// @description  draw on map
// @author       Shinko to Kuma, suilenroc
// @match        https://dep20.die-staemme.de/game.php?*village=*screen=map*
// @grant        none
// @license      MIT
// @namespace    C20RuleZ
// @downloadURL https://update.greasyfork.org/scripts/543850/C20%20Korridore%202607.user.js
// @updateURL https://update.greasyfork.org/scripts/543850/C20%20Korridore%202607.meta.js
// ==/UserScript==

var win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
win.$.ajaxSetup({ cache: true })
$.getScript("https://shinko-to-kuma.com/scripts/mapSdk.js").done(function() {
MapSdk.texts.push({text:"Nomic",x:456,y:493,font:"50px Arial",miniFont: "15px Arial",color: "red",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"RuleZ",x:453,y:477,font:"50px Arial",miniFont: "15px Arial",color: "red",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Sybolic",x:458,y:506,font:"50px Arial",miniFont: "15px Arial",color: "blue",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Castor",x:460,y:520,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Vinitu",x:462,y:531,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Hölle",x:463,y:541,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"xPrimat",x:473,y:543,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Blubs94",x:485,y:542,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Hobbit+Keks",x:501,y:544,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"aL3xEy + Crash",x:467,y:461,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Mapleman",x:483,y:454,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});
MapSdk.texts.push({text:"Jonayay",x:496,y:460,font:"50px Arial",miniFont: "15px Arial",color: "yellow",drawOnMap: false,drawOnMini: true,});





MapSdk.lines.push({x1: 444,y1: 500,x2: 485,y2: 500,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 445,y1: 514,x2: 485,y2: 514,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 445,y1: 515,x2: 485,y2: 515,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 445,y1: 485,x2: 484,y2: 485,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 444,y1: 499,x2: 484,y2: 499,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 445,y1: 484,x2: 484,y2: 484,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 446,y1: 470,x2: 484,y2: 470,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 447,y1: 469,x2: 484,y2: 469,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 489,y1: 444,x2: 489,y2: 465,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 501,y1: 445,x2: 501,y2: 465,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 488,y1: 445,x2: 488,y2: 465,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 471,y1: 451,x2: 484,y2: 464,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 471,y1: 452,x2: 484,y2: 465,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 446,y1: 525,x2: 485,y2: 525,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 446,y1: 526,x2: 485,y2: 526,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 452,y1: 536,x2: 485,y2: 536,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 469,y1: 536,x2: 465,y2: 551,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 485,y1: 536,x2: 490,y2: 536,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 479,y1: 536,x2: 475,y2: 553,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 490,y1: 536,x2: 493,y2: 536,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 493,y1: 536,x2: 488,y2: 556,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 493,y1: 536,x2: 508,y2: 536,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.lines.push({x1: 508,y1: 536,x2: 508,y2: 557,styling:{main: {"strokeStyle": "#D7DF01","lineWidth": 2},mini: {"strokeStyle": "#D7DF01","lineWidth": 2}},drawOnMini: true,drawOnMap: true,});
MapSdk.mapOverlay.reload();});