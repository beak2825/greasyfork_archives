// ==UserScript==
// @name        TS Minimal
// @description Einige CSS Anpassungen
// @author      Sash
// @version     0.1
// @include     https://torrent-syndikat.org/*
// @grant       GM_addStyle
// @run-at      document-start
// @namespace https://greasyfork.org/users/691448
// @downloadURL https://update.greasyfork.org/scripts/412268/TS%20Minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/412268/TS%20Minimal.meta.js
// ==/UserScript==

GM_addStyle ( `

div#searchbar {display: none;}
.tableCell > .indexFlexBetween {
    flex-direction: row-reverse;
    padding: 0 20px 0 0;
}

td.tableCell {padding: 2px;}
.paligncenter.tableCell > div > .hreficondefaultnocolor {display: none!important;}

div.udivided {border-bottom: 0px solid var(--color-6);}

.tbook {display: none;}


a.tTag {
    font-weight: bold;
    padding: 3px 5px;
    text-decoration: none;
    font-size: 0.85em;
    font-weight: 200;
    text-transform: uppercase;
    opacity: 0.9;
}

a.tP2P {
    color: #ddeeff;
    background-color: #3a5b7d;
}

a.tO-Scene {
    color: #eaf5ff;
    background-color: #47535f;
}

a.tScene {
    background-color: #4e839e;
}

a.tNew {
    background-color: #63984800;
    color: #2e541b;
    -webkit-box-shadow: inset 0px 0px 0px 1px #477331;
    -moz-box-shadow: inset 0px 0px 0px 1px #477331;
    box-shadow: inset 0px 0px 0px 1px #477331;
}

thead > tr > td.h800.paligncenter.tableHeader:nth-of-type(5) {display:none;}
tbody > tr > td.h800.paligncenter.tableCell:nth-of-type(5) {display:none;}
tbody > tr.evenodd > td.h800.paligncenter.tableCell:nth-of-type(7) > .pmainrate {font-weight:400; opacity:0.8;}
tbody > tr > td.h800.paligncenter.tableCell:nth-of-type(8) > .pmainrate.hreficondefaultnocolor {color:#315f1a;}
tbody > tr > td.h800.paligncenter.tableCell:nth-of-type(9) > .pmainrate.hreficondefaultnocolor {color:#7b2525;}
tbody > tr > td.h800.paligncenter.tableCell:nth-of-type(9) {color:#7b2525; font-weight:bold;}
` );