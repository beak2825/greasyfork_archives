// ==UserScript==
// @name        Abomoo Image Helper
// @description Abomoo Image Manager Disable "Delete" and "Empty the folder" button
// @match       *://www.abomoo.com/admin/*
// @grant       GM_addStyle
// @run-at      document-start
// @version 0.0.1.20190328232513
// @namespace https://greasyfork.org/users/287201
// @downloadURL https://update.greasyfork.org/scripts/381085/Abomoo%20Image%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/381085/Abomoo%20Image%20Helper.meta.js
// ==/UserScript==

GM_addStyle ( `
    [title~="Delete"] {
        display: none;
    }
    [title~="Empty"] {
        display: none;
    }
` );