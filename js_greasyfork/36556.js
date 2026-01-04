// ==UserScript==
// @name     chess24
// @include https://chess24.com/*
// @version  1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @copyright 2017, sjaaak
// @grant GM.getValue
// @grant GM.setValue
// @description Tries to improve the Chess24 tournament viewing experience
// @namespace https://greasyfork.org/users/163903
// @downloadURL https://update.greasyfork.org/scripts/36556/chess24.user.js
// @updateURL https://update.greasyfork.org/scripts/36556/chess24.meta.js
// ==/UserScript==

(async () => {
  let h = $(window).height();

  let wh = await GM.getValue("windowHeight", h);

  $("head").append($(`<style type='text/css'>

.chatBox{
  max-height: ${wh-100}px !important;
}

.tournamentOngoing{
max-height: ${wh-150}px !important; 
}

.messageContent{
font-size: 12px !important;
}
.sidebarWrapper{
display:none !important;
}
.pageFooter{
display:none !important;
}
.stickyQuickies{
display:none !important;
}
.tournamentTable{
height: ${wh-150}px !important;
margin: 0 !important;
}
body < .top{
display: none !important;
}
.gameSlidingTabs{
margin-top:0 !important;
}
.pageHeader{
display:none !important;
}
.pageContent{
margin-top:0 !important;
}
.pageWrap{
width: 100% !important;
}
.pageBreadcrumb{
display:none !important;
}
.colorHeader{
display:none !important;
}
.tabsList{
display:none !important;
}
.contentWrap{
width:100% !important;
}
.video{
display:none !important;
}

.broadcastChessGame.withEval.chessGame > .right{
float:left !important;
}

.tournamentOngoingGames {
float:left;
width: 500px;
margin-left:10px !important;
}

.broadcastGamesDropdownList{
display:none !important;
}

.slidingTabTriggers{
top: 10px  !important;
height: 1px;
}

.chessGame > .left {
margin-right: 50px !important;
}

.engineLines{
width: 450px !important;
}

</style>`));

})();

let checkIfReady = () => {

  if ($(".gameTabs").first().is(":visible")) {
    let gt = $(".tournamentOngoingGames").first();
    $(".chessGame").first().append(gt);
  }
  else {
    setTimeout(checkIfReady, 100);
  }
};

console.log("Loaded");
window.setTimeout(checkIfReady, 100);
