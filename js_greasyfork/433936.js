// ==UserScript==
// @name         自动分组聊天
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动分组
// @author       You
// @match        https://7e6iv-biaaa-aaaaf-aaada-cai.ic0.app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433936/%E8%87%AA%E5%8A%A8%E5%88%86%E7%BB%84%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/433936/%E8%87%AA%E5%8A%A8%E5%88%86%E7%BB%84%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

function auto_chat() {
  var login = document.querySelector(
    "#app > div.MuiContainer-root.MuiContainer-maxWidthMd.jss2.css-8jl1l5-MuiContainer-root > div > button"
  );
  if (login) {
    login.click();
  }

  var cont = document.querySelector(
    "body > div > div.MuiDialog-container.MuiDialog-scrollPaper > div > div.MuiDialogActions-root.MuiDialogActions-spacing.css-hlj6pa-MuiDialogActions-root > button"
  );
  if (cont) {
    cont.click();
  }
  var ul = document.querySelector(
    "#app > div.MuiContainer-root.MuiContainer-maxWidthLg.jss2.no-padding.css-1pe32jr-MuiContainer-root > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.jss3.css-1vpwr7v-MuiGrid-root > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-wrap-xs-nowrap.jss4.css-1yvdugi-MuiGrid-root > ul"
  );
  if (ul.childNodes.length < 1) {
    var join = document.querySelector(
      "#app > div.MuiContainer-root.MuiContainer-maxWidthLg.jss2.no-padding.css-1pe32jr-MuiContainer-root > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.jss3.css-1vpwr7v-MuiGrid-root > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-wrap-xs-nowrap.jss4.css-1yvdugi-MuiGrid-root > header > div:nth-child(2) > button"
    );
    if (join) {
      join.click();
    }
    var joingroup = document.querySelector(
      "body > div > div > ul > li:nth-child(3)"
    );
    if (joingroup) {
      joingroup.click();
    }
  }

  var input = document.querySelector(
    "#app > div.MuiContainer-root.MuiContainer-maxWidthLg.jss2.no-padding.css-1pe32jr-MuiContainer-root > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.jss3.css-1vpwr7v-MuiGrid-root > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-wrap-xs-nowrap.jss4.css-1yvdugi-MuiGrid-root > div > div > input"
  );
  if (input) {
    var hTMLEvents = document.createEvent("HTMLEvents");
    hTMLEvents.initEvent("input", true, true);
    input.setAttribute("value", "685e21c75eb1595fd264f38352a06fa3");
    input.dispatchEvent(hTMLEvents);
  }

  var ok = document.querySelector(
    "#app > div.MuiContainer-root.MuiContainer-maxWidthLg.jss2.no-padding.css-1pe32jr-MuiContainer-root > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.jss3.css-1vpwr7v-MuiGrid-root > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-wrap-xs-nowrap.jss4.css-1yvdugi-MuiGrid-root > div > button"
  );
  if (ok) {
    ok.click();
  }
  var chat = document.getElementById("textbox");
  if (chat) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("input", true, true);
    chat.innerText = chat.getAttribute("id");
    chat.dispatchEvent(evt);
  }
  var submit = document.getElementsByTagName("button");
  if (submit[0]) {
    submit[submit.length - 1].click();
  }

  var lout = document.querySelector(
    "#app > div.MuiContainer-root.MuiContainer-maxWidthLg.jss2.no-padding.css-1pe32jr-MuiContainer-root > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-wrap-xs-nowrap.jss3.css-1vpwr7v-MuiGrid-root > div.MuiGrid-root.MuiGrid-container.MuiGrid-item.MuiGrid-direction-xs-column.MuiGrid-wrap-xs-nowrap.jss4.css-1yvdugi-MuiGrid-root > header > div:nth-child(2) > button"
  );
  if (lout) {
    lout.click();
  }

  var logout = document.querySelector(
    "body > div > div > ul > li:nth-child(7)"
  );
  if (logout) {
    logout.click();
  }
}



(function () {
  "use strict";
   setTimeout(auto_chat, 10000);
  // Your code here...
})();
