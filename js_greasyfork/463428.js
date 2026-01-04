// ==UserScript==
// @name         VIPtmp
// @namespace    VIPtmp
// @version      1.3
// @description  VIPtmp112
// @match        https://admin.crimson.sol.prd.maxbit.private/admin/players/*
// @match        https://admin.crimson.fresh.prd.maxbit.private/admin/players/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463428/VIPtmp.user.js
// @updateURL https://update.greasyfork.org/scripts/463428/VIPtmp.meta.js
// ==/UserScript==
//работает только на солях и свежестях
(function() {
  'use strict';
  const pageText = document.body.innerText;
  if (pageText.includes("Group: Premium A")||pageText.includes("Group: Premium B")) {
    document.body.style.backgroundColor = "#00BFFF";
  }
    if (pageText.includes("Group: D-segment")||pageText.includes("Group: C-segment")||pageText.includes("Group: B-segment")||pageText.includes("Group: A-segment")) {
    document.body.style.backgroundColor = "#DC143C";
  }
  })();