// ==UserScript==
// @name        Bus Form Automation
// @match       https://docs.google.com/forms/*d/e/1FAIpQLScTxQDDAih1DKeEuXMSP3R8V-vn3ON0iSnIHSM9w3j1bfjHBg/*
// @version     1.0.2
// @author      ReznorsRevenge
// @description -
// @namespace https://greasyfork.org/users/1473128
// @downloadURL https://update.greasyfork.org/scripts/536744/Bus%20Form%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/536744/Bus%20Form%20Automation.meta.js
// ==/UserScript==
const page=new URL(window.location.href);
if(page.pathname.endsWith("/closedform")){
  page.pathname="/forms/d/e/1FAIpQLScTxQDDAih1DKeEuXMSP3R8V-vn3ON0iSnIHSM9w3j1bfjHBg/formResponse";
  page.searchParams.set("emailAddress","finn.bal.0512@brssd.org");
  page.searchParams.set("entry.872300432","7th Grade Bus 68");
  window.location.href=page.href;
}else if(page.pathname.endsWith("/formResponse")){
  document.querySelector("#mG61Hd > div.RH5hzf.RLS9Fe > div > div.ThHDze > div > div.lRwqcd > div").click();
}