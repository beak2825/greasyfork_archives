// ==UserScript==
// @name Greasy Fork - Fix for problem with [datetime] and Waterfox Classic [Standalone] v.1
// @namespace https://userstyles.world/user/decembre
// @version 1.01
// @description ▶ CSS Fix for problem with [datetime] / Waterfox Classic (only need for WATERFOX CLASSIC)
// @author decembre
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.greasyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/457066/Greasy%20Fork%20-%20Fix%20for%20problem%20with%20%5Bdatetime%5D%20and%20Waterfox%20Classic%20%5BStandalone%5D%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/457066/Greasy%20Fork%20-%20Fix%20for%20problem%20with%20%5Bdatetime%5D%20and%20Waterfox%20Classic%20%5BStandalone%5D%20v1.meta.js
// ==/UserScript==

(function() {
let css = `

/* ==== Greasy Fork - Fix for problem with [datetime] / Waterfox Clasic [Standalone] v.1  (only need for WATERFOX CLASSIC) ==== */

/* (new223) [datetime] COMMENT - TEST - ONLY WATERFOX CLASSIC */
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item {
    display: inline-block !important;
    width: 100% !important;
    min-width: 189px !important;
    max-width: 189px !important;
/* border: 1px solid red !important; */
}
/* #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:before , */
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:before {
    content: attr(datetime) !important;
    clip-path: inset(0px 125px 0px 0px) !important;
/*     position: relative !important; */
    position: absolute !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 20px !important;
    max-height: 20px !important;
    line-height: 20px !important;
    width: 201px !important;
    margin: 1px 0 0 2px !important;
    padding: 0 2px 0 0 !important;
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: left !important;
color: red !important;
background: #111 !important;
/* background: green !important; */
}
/* #comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:after , */
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:after{
content: attr(datetime)!important;
clip-path: inset(0px 98px 0px 114px) !important;
    position: absolute !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 20px !important;
    max-height: 20px !important;
    line-height: 20px !important;
    width: 250px !important;
    margin: 1px 10vw 0 0vw !important;
    left: 30px !important;
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: center !important;
color: gold !important;
/* background: green !important; */
}

/* (new219) COMMENT - DATE RE EDIT */
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item + .comment-meta-item{
    display: inline-block !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 20px !important;
    max-height: 20px !important;
    line-height: 20px !important;
    width: 100% !important;
    min-width: 160px !important;
    max-width: 160px !important;
/* border: 1px solid pink !important; */
}

.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item + .comment-meta-item  {
/*      position: absolute !important; */
/* left: 24vw !important; */
/* border: 1px solid aqua !important; */
}
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item + .comment-meta-item  > relative-time:after {
    content: attr(datetime) !important;
    clip-path: inset(0px 98px 0px 114px) !important;
position: absolute !important;
display: inline-block !important;
    height: 100% !important;
    min-height: 20px !important;
    max-height: 20px !important;
    line-height: 20px !important;
    width: 250px !important;
margin: 0px 0 0 -100px !important;
/* left: 20px !important; */
/* top: -5px !important; */
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: center !important;
color: pink !important;
}


/* (new220) [datetime]SCRIPT INFO (Created / Updtaed)  -  TEST - ONLY WATERFOX CLASSIC
need "Users Request Modification For this Domain" +  "WebCompotementBudle Enable in POLLY */

#script-meta dd.script-show-created-date {
border: 1px solid red !important;
}
#script-meta dd.script-show-updated-date > span relative-time:before  ,
#script-meta dd.script-show-created-date > span relative-time:before {
    content: attr(datetime) !important;
    clip-path: inset(0px 115px 0px 0px) !important;
/*     position: relative !important; */
    position: absolute !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 15px !important;
    max-height: 15px !important;
    line-height: 15px !important;
    width: 201px !important;
    margin: 1px 0 0 -10px !important;
    padding: 0 2px 0 0 !important;
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: left !important;
color: red !important;
background: #111 !important;
/* background: green !important; */
}


/* (new222) [datetime] FEEDBACK  -  TEST - ONLY WATERFOX CLASSIC
need "Users Request Modification For this Domain" +  "WebCompotementBudle Enable in POLLY */

/* FIRST POST */
.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:first-of-type > relative-time {
/* border: 1px solid red !important; */
}
.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:first-of-type > relative-time:before {
    content: attr(datetime) !important;
    clip-path: inset(0px 127px 0px 0px) !important;
/*     position: relative !important; */
    position: absolute !important;
    display: inline-block !important;
    height: 100% !important;
    min-height: 15px !important;
    max-height: 15px !important;
    line-height: 15px !important;
    width: 201px !important;
    margin: 1px 0 0 20px !important;
    padding: 0 2px 0 0 !important;
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: left !important;
color: gold !important;
background: #111 !important;
/* background: green !important; */
}

/* LAST REPLY */
.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:last-of-type .discussion-meta-item > relative-time {
/* border: 1px solid aqua !important; */
}
.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:last-of-type .discussion-meta-item> relative-time:before {
    content: attr(datetime) !important;
    clip-path: inset(0px 127px 0px 0px) !important;
position: relative !important;
/*     position: absolute !important; */
    display: inline-block !important;
    height: 100% !important;
    min-height: 15px !important;
    max-height: 15px !important;
    line-height: 15px !important;
    width: 201px !important;
    margin: 1px 0 0 10px !important;
    padding: 0 2px 0 0 !important;
    letter-spacing: 1.4px !important;
    font-size: 12px !important;
    visibility: visible !important;
    opacity: 1 !important;
    text-align: left !important;
color: red !important;
background: #111 !important;
/* background: green !important; */
}


/* START - (new222) [datetime] NOT QUANTUM */ 
@supports (contain:paint) {

.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:first-of-type > relative-time:before ,
.post-discussion .script-discussion-list .discussion-list-container .discussion-meta > .discussion-meta-item:last-of-type .discussion-meta-item> relative-time:before ,

#script-meta dd.script-show-updated-date > span relative-time:before  ,
#script-meta dd.script-show-created-date > span relative-time:before ,

.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item + .comment-meta-item  > relative-time:before ,
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item + .comment-meta-item  > relative-time:after ,
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:before ,
#comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:before {
    display: none !important;
}
.comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:after ,
#comment-.comment .comment-meta .comment-meta-item.comment-meta-item-main + .comment-meta-item  + .comment-meta-item  > relative-time:after {
content: attr(datetime)!important;
clip-path: inset(0px 98px 0px 114px) !important;
    display: none !important;
}
/* END - (new222) [datetime] NOT QUANTUM /CHROME */ 
}


/* === END - DATETIME === */

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
