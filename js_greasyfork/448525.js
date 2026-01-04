// ==UserScript==
// @name         Opt Not a CSS fix
// @namespace    https://app.preprod.opticks.io/
// @version      1.4
// @description  Misc UI improvements
// @author       E
// @license      MIT
// @match        *://app.preprod.opticks.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448525/Opt%20Not%20a%20CSS%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/448525/Opt%20Not%20a%20CSS%20fix.meta.js
// ==/UserScript==

GM_addStyle(`
div.fraud-severity-filled-risk {

  background-image: linear-gradient(to right, rgb(255, 180, 180), 70%, rgb(214, 46, 23));
}

div.fraud-severity-empty-risk {
  background-color: rgb(240, 240, 240);
}

main > div > div:nth-child(4) {
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: rgb(11 18 24 / 30%) 0px 0px 6px;
}
main > div > div:nth-child(4) > table tbody tr td {
  border-left: none;
}

main > div > div:nth-child(4) > table th {
  background-color: #0063ff12;
  border: 0.5px solid rgb(217, 217, 217);
  border-style: solid;
  border-color: #ffffff;
}

main > div > div:nth-child(4)
  tbody > :first-child > td {
    position: relative;
}

main > div > div:nth-child(4)
  tbody > :first-child > td:before {
    content: '';
    position: absolute;
    display: block;
    top: 0px;
    left: 0px;
    height: 8px;
    width: 100%;
    background: linear-gradient(rgb(196 195 195 / 30%) 0%, transparent 80%);
}

main > div > div:nth-child(4) th.double-header-invalid {
  background-color: rgb(255, 242, 240 );
}
main > div > div:nth-child(4) th.double-header-invalid + th {
  background-color: rgb(255, 242, 240 );
}

main > div > div:nth-child(4) th.double-header-suspicious {
  background-color: rgb(255, 244, 228);
}
main > div > div:nth-child(4) th.double-header-suspicious + th {
  background-color: rgb(255, 244, 228);
}

main > div > div:nth-child(4) th.double-header-legitimate {
  background-color: rgb(240, 255, 248);
}
main > div > div:nth-child(4) th.double-header-legitimate + th {
  background-color: rgb(240, 255, 248);
}



main > div > div:nth-child(4) tr:nth-child(1) th:first-child {
  border-left: none;
}
main > div > div:nth-child(4) tr:nth-child(2) th:first-child {
  border-left: none;
}
main > div > div:nth-child(4) tfoot tr:first-child td:first-child {
  border-left: none;
}
main > div > div:nth-child(4) tfoot tr:first-child td:last-child {
  border-right: none;
}

main > div > div:nth-child(4) tr:nth-child(1) th {
  border-top: none;
}
main > div > div:nth-child(4) tr:nth-child(2) th {
  border-bottom: 0;
}
main > div > div:nth-child(4) tr:nth-child(1) th:last-child {
  border-right: none;
}
main > div > div:nth-child(4) tr:nth-child(2) th:last-child {
  border-right: none;
}

main > div > div:nth-child(4) .td-subcomponent > div > div {
  background-color: white;
  box-sizing: border-box;
  box-shadow: inset rgb(11 18 24 / 30%) 0px 9px 20px -10px;
}
main > div > div:nth-child(4) .td-subcomponent > div > div .button-row div {
   background-color: white;
}

td.td-subcomponent > div > div > .display-row > div:first-child > div {
   border-radius: 5px;
    box-sizing: border-box;
    box-shadow: rgb(11 18 24 / 30%) 0px 0px 8px;
}

td.td-subcomponent > div > div > .display-row > div:nth-child(2) > div .display-column > div:nth-child(2){
   border-radius: 5px;
    box-sizing: border-box;
    box-shadow: rgb(11 18 24 / 30%) 0px 0px 8px;
}

.box-vertical-separator {
  border-left: 0px solid rgb(187 187 187);
}

.invalid-cell {
  color: black;
  font-weight:normal;
}


`.replace(/;/g, ' !important;'));