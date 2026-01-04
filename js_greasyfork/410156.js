// ==UserScript==
// @name 81dojo
// @namespace https://greasyfork.org/users/680946
// @version 1.0.0
// @description Userstyle for 81dojo.com
// @grant GM_addStyle
// @run-at document-start
// @match *://*.81dojo.com/*
// @downloadURL https://update.greasyfork.org/scripts/410156/81dojo.user.js
// @updateURL https://update.greasyfork.org/scripts/410156/81dojo.meta.js
// ==/UserScript==

(function() {
let css = `
#entrance-img {
    border: 1px solid #CF9555;
    border-radius: 1px;
}
div#layerLogin.layer div#layerLoginContents div.hbox div.left {
    background:#f7f7f7;
    margin-right: 10px;
    text-align: center;
    border-radius:2px;
}
#loginButton {
    background:#7FB043;
    color:#fff;
}

/* NON-ADMINS don't need this */
#serverGrid {display:none;}

#layerBoard, #layerLobby {
    background: rgba(0, 0, 0, .15) url(http://81dojo.com/client/img/tatami.jpg)!important;
    background-blend-mode: darken;
}

#worldClocks {
background: hsl(0, 0%, 81%, 0.35);
border-radius: 3px;
}
div.clock-box {padding:0!important;}

div#playerListBox {
border: solid 3px #cecece;
border-radius: 3px;
padding-bottom:0;
}




/* board */
div#boardBox {
    background:#755b1e;
    border: solid 1px #644545;
    border-radius: 3px;
}

div.player-info-has-turn {border: solid 3px #ff4000;}
div.game-timer-sub-label {color:#000;}
div.game-timer-sub-label:before {content:'(';}
div.game-timer-sub-label:after {content:')';}

/* player profile pic box */
#goteInfo > span:nth-child(2):before {content:'後手';font-size:12px;}
#senteInfo > span:nth-child(2):before {content:'先手';font-size:12px;}
#goteInfo > span:nth-child(3), #senteInfo > span:nth-child(3) {cursor:pointer;}

/* right side */
div#boardChatBox {
background: #cecece;
border: solid 3px #cecece;
border-radius: 3px;
}
div#kifuBox, div#watcherBox {
background: #cecece;
    border: solid 3px #cecece;
border-radius: 3px;    
}

table.dataTable thead th, table.dataTable tfoot th, .dataTables_scrollHeadInner {
    background:#ff9611;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
